// api/create-order.js — create a PayPal order for one $ pet.
// The amount comes from the server price table, never from the client.
// POST { pet } -> { orderID } (PayPal order id, approved in the JS SDK).
'use strict';
const { PRICES, PET_NAMES, bodyOf, paypalToken } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  const pet = body.pet;
  if (!PRICES[pet]) {
    // Unknown pet, or APEX (not in the price table — never sold).
    res.status(400).json({ error: 'unknown-pet' });
    return;
  }
  const pp = await paypalToken();
  if (!pp.ok) {
    res.status(503).json({ error: pp.error });
    return;
  }
  const amount = (PRICES[pet] / 100).toFixed(2);
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
          description: 'Wraith Pet — ' + PET_NAMES[pet] + ' ($' + amount + ')',
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
  res.status(200).json({ orderID: j.id });
};
