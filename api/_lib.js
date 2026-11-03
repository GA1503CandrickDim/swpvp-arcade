// api/_lib.js — shared helpers for the Wraith Pet $ pets payment functions.
// Vercel serverless (arcade project swpvp-arcade). No secrets in this file:
// every credential comes from process.env at runtime (Vercel dashboard env vars).
// Files starting with _ are NOT exposed as endpoints by Vercel.
'use strict';
const crypto = require('crypto');

// Server-side price table, in US cents. Single source of truth — the client
// never supplies an amount. APEX is deliberately ABSENT: it is never sold.
const PRICES = { ember: 100, frost: 200, shadow: 300, morph: 400 };
const PET_NAMES = { ember: 'EMBER', frost: 'FROST', shadow: 'SHADOW', morph: 'MORPH' };

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

// PayPal OAuth: exchange client id + secret (server only) for an access token.
// Returns { ok, base, token } or { ok:false, error }.
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

module.exports = { PRICES, PET_NAMES, bodyOf, signToken, verifyToken, paypalToken };
