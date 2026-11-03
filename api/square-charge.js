// api/square-charge.js — charge a Cash App Pay token and, ONLY if Square
// confirms the payment, issue the signed unlock token for the pet.
// Verification: payment status COMPLETED + amount EXACTLY the server price
// (in cents) + currency USD + source WALLET + brand CASH_APP.
// POST { pet, token } -> { ok, pet, token } or an error (no token).
// Sandbox test tokens (Square docs): 'wnon:cash-app-ok' succeeds,
// 'wnon:cash-app-declined' fails with GENERIC_DECLINE.
'use strict';
const crypto = require('crypto');
const { PRICES, bodyOf, signToken } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  const pet = body.pet;
  const sourceToken = body.token;
  if (!PRICES[pet] || typeof sourceToken !== 'string' || !sourceToken) {
    res.status(400).json({ error: 'bad-request' });
    return;
  }
  const secret = process.env.UNLOCK_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'unlock-not-configured' });
    return;
  }
  const access = process.env.SQUARE_ACCESS_TOKEN;
  const loc = process.env.SQUARE_LOCATION_ID;
  if (!access || !loc) {
    res.status(503).json({ error: 'square-not-configured' });
    return;
  }
  const env = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  const base = env === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
  const cents = PRICES[pet];
  let r;
  try {
    r = await fetch(base + '/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + access,
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        source_id: sourceToken,
        amount_money: { amount: cents, currency: 'USD' },
        location_id: loc,
      }),
    });
  } catch (e) {
    res.status(502).json({ error: 'square-charge-failed' });
    return;
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    res.status(502).json({ error: 'square-charge-failed' });
    return;
  }
  const p = j.payment || {};
  const ok = p.status === 'COMPLETED' &&
    p.amount_money && p.amount_money.amount === cents &&
    p.amount_money.currency === 'USD' &&
    p.source_type === 'WALLET' &&
    p.wallet_details && p.wallet_details.brand === 'CASH_APP';
  if (!ok) {
    res.status(402).json({ error: 'payment-not-verified' });
    return;
  }
  res.status(200).json({ ok: true, pet, token: signToken(pet, secret) });
};
