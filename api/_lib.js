// api/_lib.js — shared helpers for ALL payment functions (Wraith Pet $ pets
// AND the atom sale). Merged 2026-11-03 (func-limit fix): the pet lib and the
// ion lib were two files with byte-identical bodyOf/paypalToken and the same
// PayPal env vars — one shared helper now serves both. Vercel serverless.
// No secrets in this file: every credential comes from process.env at
// runtime (Vercel dashboard env vars).
// Files starting with _ are NOT exposed as endpoints by Vercel.
'use strict';
const crypto = require('crypto');

// ===== Wraith Pet $ pets =====
// Server-side price table, in US cents. Single source of truth — the client
// never supplies an amount. APEX is deliberately ABSENT: it is never sold.
const PRICES = { ember: 100, frost: 200, shadow: 300, morph: 400 };
const PET_NAMES = { ember: 'EMBER', frost: 'FROST', shadow: 'SHADOW', morph: 'MORPH' };

// ===== Atom sale =====
// Server-side atom-sale price table, in US cents. Single source of truth —
// the client never supplies an amount. Locked rate (Cee 2026-11-01 19:37 EST):
// $1 = 100 atoms; $5 = 500 atoms.
// The buyer pays real $ (PayPal), Cee gets paid,
// and the buyer gets an ATOM code to redeem on the main site. The atom
// wallet here is NOT credited by a sale.
const ION_PACKS = {
  ion1: { cents: 100, usd: 1, ions: 50, atoms: 100 },
  ion5: { cents: 500, usd: 5, ions: 250, atoms: 500 },
};

// Vercel parses a JSON request body into req.body; fall back to a raw string.
function bodyOf(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  return (b && typeof b === 'object') ? b : {};
}

// Unlock token: petId + '.' + HMAC-SHA256(secret, 'wraith-pet-unlock:' + petId).
// One token unlocks exactly one pet. The secret (UNLOCK_SECRET) never leaves
// the server; the client can neither forge nor verify a token on its own.
function signToken(pet, secret) {
  return pet + '.' + crypto.createHmac('sha256', secret)
    .update('wraith-pet-unlock:' + pet).digest('hex');
}
function verifyToken(pet, token, secret) {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2 || parts[0] !== pet) return false;
  const expect = crypto.createHmac('sha256', secret)
    .update('wraith-pet-unlock:' + pet).digest('hex');
  const a = Buffer.from(parts[1], 'utf8');
  const b = Buffer.from(expect, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Atom code: 'ATOM-' + 12 random alphanumeric chars. Generated server-side
// ONLY, after PayPal confirms the payment. The buyer redeems it on the main
// site, which checks atom_codes/<code> for paid:true, redeemed:false.
const ATOM_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function makeAtomCode() {
  let out = '';
  for (let i = 0; i < 12; i++) out += ATOM_ALPHABET[crypto.randomInt(0, ATOM_ALPHABET.length)];
  return 'ATOM-' + out;
}
function isAtomCode(code) {
  return typeof code === 'string' && /^ATOM-[A-Za-z0-9]{12}$/.test(code);
}

// PayPal OAuth: exchange client id + secret (server only) for an access token.
// Returns { ok, base, token } or { ok:false, error }.
// Env vars (same names for $ pets and the atom sale): PAYPAL_CLIENT_ID,
// PAYPAL_CLIENT_SECRET, PAYPAL_MODE ('sandbox' default, 'live' to go live).
async function paypalToken() {
  const mode = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
  const base = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) return { ok: false, error: 'paypal-not-configured' };
  const r = await fetch(base + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!r.ok) return { ok: false, error: 'paypal-auth-failed' };
  const j = await r.json().catch(() => ({}));
  if (!j.access_token) return { ok: false, error: 'paypal-auth-failed' };
  return { ok: true, base, token: j.access_token };
}

// ===== Firestore — server-side atom code issue =====
// The ATOM code is written to Firestore by the SERVER, never by the
// client: a client that could write atom_codes could mint codes without
// paying. The server talks to Firestore over its REST API with a
// service-account OAuth2 token — no firebase-admin dependency, because
// the deploy ships raw files and only Node built-ins are available.
// Env var: FIREBASE_SERVICE_ACCOUNT_JSON = the full service-account JSON,
// pasted as-is (plain JSON; base64 of the same JSON is also accepted).
// Get it in the Firebase console: project swvp-721a0 → Settings →
// Service accounts → Generate new private key. Set it on the swpvp-ion
// Vercel project (Production). If it is missing or invalid, the sale
// refuses to start — the config endpoint reports not configured and the
// capture endpoint fails fast BEFORE PayPal is charged, so a buyer is
// never charged for a code the server cannot issue.
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
const FIRESTORE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const ATOM_CODE_AMOUNTS = [100, 500]; // only amounts the sale sells

let _saCache = null;   // parsed service account, or {ok:false,...}
let _fsToken = null;   // {token, expMs}

function parseServiceAccount() {
  if (_saCache) return _saCache;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
  let parsed = null;
  if (raw) {
    try { parsed = JSON.parse(raw); }
    catch (e) {
      try { parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')); }
      catch (e2) { parsed = null; }
    }
  }
  if (!parsed || typeof parsed !== 'object' ||
      typeof parsed.client_email !== 'string' || !parsed.client_email ||
      typeof parsed.private_key !== 'string' || !parsed.private_key ||
      typeof parsed.project_id !== 'string' || !parsed.project_id) {
    _saCache = { ok: false, error: 'server-not-configured' };
    return _saCache;
  }
  _saCache = { ok: true, projectId: parsed.project_id, clientEmail: parsed.client_email, privateKey: parsed.private_key };
  return _saCache;
}

function firestoreReady() { return parseServiceAccount().ok; }

// Service-account OAuth2: sign a JWT (RS256) and exchange it for an
// access token. The token is cached until shortly before expiry; Vercel
// may reuse the function instance, so a sale rarely re-authenticates.
async function firestoreAccessToken() {
  const sa = parseServiceAccount();
  if (!sa.ok) return { ok: false, error: sa.error };
  if (_fsToken && _fsToken.expMs > Date.now() + 60000) return { ok: true, token: _fsToken.token };
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claims = {
    iss: sa.clientEmail, sub: sa.clientEmail, aud: FIRESTORE_TOKEN_URL,
    scope: FIRESTORE_SCOPE, iat: now, exp: now + 3600,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  let sig;
  try {
    sig = crypto.sign('RSA-SHA256', Buffer.from(header + '.' + payload), sa.privateKey).toString('base64url');
  } catch (e) {
    return { ok: false, error: 'firestore-auth-failed' };
  }
  const jwt = header + '.' + payload + '.' + sig;
  let r;
  try {
    r = await fetch(FIRESTORE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') +
        '&assertion=' + encodeURIComponent(jwt),
    });
  } catch (e) {
    return { ok: false, error: 'firestore-auth-failed' };
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) return { ok: false, error: 'firestore-auth-failed' };
  _fsToken = { token: j.access_token, expMs: Date.now() + ((j.expires_in || 3600) - 60) * 1000 };
  return { ok: true, token: _fsToken.token };
}

// Write one atom_codes doc via the Firestore REST API.
// Returns {ok:true} or {ok:false, status, error}; status 409 means the
// document id (code) already exists.
async function firestoreWriteAtomCode(code, atoms, token) {
  const sa = parseServiceAccount();
  const url = FIRESTORE_BASE + '/projects/' + encodeURIComponent(sa.projectId) +
    '/databases/(default)/documents/atom_codes?documentId=' + encodeURIComponent(code);
  let r;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        atoms: { integerValue: String(atoms) },
        paid: { booleanValue: true },
        redeemed: { booleanValue: false },
        ts: { integerValue: String(Date.now()) },
      } }),
    });
  } catch (e) {
    return { ok: false, error: 'code-write-failed' };
  }
  if (r.ok) return { ok: true };
  if (r.status === 409) return { ok: false, status: 409, error: 'code-exists' };
  if (r.status === 401) return { ok: false, status: 401, error: 'code-write-failed' };
  return { ok: false, status: r.status, error: 'code-write-failed' };
}

// Issue an ATOM code: generate it, write atom_codes/<code> server-side,
// return the code that was actually written. A 409 (code already exists —
// astronomically unlikely) regenerates a fresh code and retries, up to 3
// attempts. A 401 refreshes the access token once and retries. Any other
// failure returns {ok:false, error, code} where code is the last code
// attempted (unwritten) so the caller can show it to the buyer — the
// buyer was charged, so they keep the code and Cee can add the doc.
// Only the sold amounts (100 / 500) are ever written.
async function issueAtomCode(atoms) {
  if (ATOM_CODE_AMOUNTS.indexOf(atoms) < 0) return { ok: false, error: 'bad-amount' };
  const sa = parseServiceAccount();
  if (!sa.ok) return { ok: false, error: sa.error };
  let tokenRes = await firestoreAccessToken();
  if (!tokenRes.ok) return { ok: false, error: tokenRes.error };
  let lastCode = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = makeAtomCode();
    lastCode = code;
    let w = await firestoreWriteAtomCode(code, atoms, tokenRes.token);
    if (w.ok) return { ok: true, code };
    if (w.status === 409) continue; // collision: fresh code, retry
    if (w.status === 401 && attempt === 0) {
      _fsToken = null; // force a fresh token, then retry the same code
      tokenRes = await firestoreAccessToken();
      if (!tokenRes.ok) return { ok: false, error: tokenRes.error, code: lastCode };
      w = await firestoreWriteAtomCode(code, atoms, tokenRes.token);
      if (w.ok) return { ok: true, code };
      if (w.status === 409) continue;
    }
    return { ok: false, error: 'code-write-failed', code: lastCode };
  }
  return { ok: false, error: 'code-write-failed', code: lastCode };
}

module.exports = { PRICES, PET_NAMES, ION_PACKS, bodyOf, signToken, verifyToken, makeAtomCode, isAtomCode, paypalToken, firestoreReady, issueAtomCode };
