// api/create-order.js — create a PayPal order. MERGED 2026-11-03 (func-limit
// fix): the $ pet order and the atom-sale order were two near-identical files
// (same PayPal call, same env vars) — one endpoint now serves both.
// The amount comes from the server price table, never from the client.
// POST { pet }  -> { orderID } (Wraith Pet $ pet; APEX never sold)
// POST { pack } -> { orderID, pack, atoms } (atom sale: ion1 = $1 = 50 ions =
// 100 atoms; ion5 = $5 = 250 ions = 500 atoms). The ions turn into atoms —
// the ion wallet is never credited.
'use strict';
const { PRICES, PET_NAMES, ION_PACKS, bodyOf, paypalToken } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  // A pack key means the atom sale; otherwise it is a $ pet order.
  const isPack = typeof body.pack === 'string';
  const pack = isPack ? ION_PACKS[body.pack] : null;
  const pet = isPack ? null : body.pet;
  if (isPack && !pack) {
    res.status(400).json({ error: 'unknown-pack' });
    return;
  }
  if (!isPack && !PRICES[pet]) {
    // Unknown pet, or APEX (not in the price table — never sold).
    res.status(400).json({ error: 'unknown-pet' });
    return;
  }
  const pp = await paypalToken();
  if (!pp.ok) {
    res.status(503).json({ error: pp.error });
    return;
  }
  const amount = isPack
    ? (pack.cents / 100).toFixed(2)
    : (PRICES[pet] / 100).toFixed(2);
  const description = isPack
    ? 'SWPVP ION — $' + amount + ' = ' + pack.atoms + ' atoms (via ' + pack.ions + ' ions)'
    : 'Wraith Pet — ' + PET_NAMES[pet] + ' ($' + amount + ')';
  let r;
  try {
    r = await fetch(pp.base + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + pp.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: amount },
          description: description,
        }],
      }),
    });
  } catch (e) {
    res.status(502).json({ error: 'paypal-create-failed' });
    return;
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.id) {
    res.status(502).json({ error: 'paypal-create-failed' });
    return;
  }
  if (isPack) res.status(200).json({ orderID: j.id, pack: body.pack, atoms: pack.atoms });
  else res.status(200).json({ orderID: j.id });
};
