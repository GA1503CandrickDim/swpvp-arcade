// api/capture-order.js — capture a PayPal order and, ONLY if PayPal confirms
// the payment, issue the signed unlock token for the pet.
// Verification: capture status COMPLETED + currency USD + amount EXACTLY the
// server price for the requested pet. A Venmo payment settles as a PayPal
// transaction, so the same check covers it — no separate Venmo flow.
// POST { orderID, pet } -> { ok, pet, token } or an error (no token).
'use strict';
const { PRICES, bodyOf, paypalToken, signToken } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  const pet = body.pet;
  const orderID = body.orderID;
  if (!PRICES[pet] || typeof orderID !== 'string' || !orderID) {
    res.status(400).json({ error: 'bad-request' });
    return;
  }
  const secret = process.env.UNLOCK_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'unlock-not-configured' });
    return;
  }
  const pp = await paypalToken();
  if (!pp.ok) {
    res.status(503).json({ error: pp.error });
    return;
  }
  let r;
  try {
    r = await fetch(pp.base + '/v2/checkout/orders/' + encodeURIComponent(orderID) + '/capture', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + pp.token,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
  } catch (e) {
    res.status(502).json({ error: 'paypal-capture-failed' });
    return;
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    res.status(502).json({ error: 'paypal-capture-failed' });
    return;
  }
  // Find the first capture on the order and verify it, hard.
  let cap = null;
  const units = Array.isArray(j.purchase_units) ? j.purchase_units : [];
  for (const u of units) {
    const caps = (u.payments && Array.isArray(u.payments.captures)) ? u.payments.captures : [];
    if (caps.length) { cap = caps[0]; break; }
  }
  const amount = cap && cap.amount;
  const expected = (PRICES[pet] / 100).toFixed(2);
  const ok = !!cap && cap.status === 'COMPLETED' && !!amount &&
    amount.currency_code === 'USD' && amount.value === expected;
  if (!ok) {
    // Wrong amount, wrong currency, or not completed: no token, no unlock.
    res.status(402).json({ error: 'payment-not-verified' });
    return;
  }
  res.status(200).json({ ok: true, pet, token: signToken(pet, secret) });
};
