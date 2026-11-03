// api/verify-unlock.js — check stored unlock tokens against the server secret.
// The client can NEVER trust a token on its own (it does not know the secret),
// so on every load it asks here: only tokens whose HMAC matches come back
// unlocked. Flipping a localStorage flag or hand-writing a fake token unlocks
// nothing — the server says no.
// POST { tokens: { ember: 'ember.<hmac>', ... } } -> { ok, unlocked: { ember: true/false, ... } }
'use strict';
const { PRICES, bodyOf, verifyToken } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  const secret = process.env.UNLOCK_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'unlock-not-configured' });
    return;
  }
  const tokens = (body && body.tokens && typeof body.tokens === 'object') ? body.tokens : {};
  const unlocked = {};
  for (const pet of Object.keys(PRICES)) {
    unlocked[pet] = verifyToken(pet, tokens[pet], secret);
  }
  res.status(200).json({ ok: true, unlocked });
};
