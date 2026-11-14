// api/capture-order.js — capture a PayPal order and, ONLY if PayPal confirms
// the payment, issue the reward. MERGED 2026-11-03 (func-limit fix): the
// $ pet capture and the atom-sale capture were two files sharing the same
// capture + verification — one endpoint now serves both.
// Verification (both flows): capture status COMPLETED + currency USD +
// amount EXACTLY the server price. A Venmo payment settles as a PayPal
// transaction, so the same check covers it — no separate Venmo flow.
// POST { orderID, pet }  -> { ok, pet, token } (signed unlock token)
// POST { orderID, pack } -> { ok, pack, ions, atoms, code, saved } (ATOM code,
// written to Firestore atom_codes server-side; if the write fails after a
// verified capture the code is still returned with saved:false so the buyer
// keeps it and Cee can add the doc — the buyer WAS charged, so the client
// must never say "you were not charged"). If the service account is missing
// the pack flow fails fast (503) BEFORE capturing, so the buyer is never
// charged for a code the server cannot issue.
'use strict';
const { PRICES, ION_PACKS, bodyOf, paypalToken, signToken, firestoreReady, issueAtomCode } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const body = bodyOf(req);
  const orderID = body.orderID;
  // A pack key means the atom sale; otherwise it is a $ pet order.
  const isPack = typeof body.pack === 'string';
  const pack = isPack ? ION_PACKS[body.pack] : null;
  const pet = isPack ? null : body.pet;
  if (typeof orderID !== 'string' || !orderID ||
      (isPack && !pack) || (!isPack && !PRICES[pet])) {
    res.status(400).json({ error: 'bad-request' });
    return;
  }
  if (isPack) {
    // Fail fast: no service account means no code can be issued — refuse
    // before PayPal is charged.
    if (!firestoreReady()) {
      res.status(503).json({ error: 'server-not-configured' });
      return;
    }
  } else {
    const secret = process.env.UNLOCK_SECRET;
    if (!secret) {
      res.status(503).json({ error: 'unlock-not-configured' });
      return;
    }
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
  const expected = isPack
    ? (pack.cents / 100).toFixed(2)
    : (PRICES[pet] / 100).toFixed(2);
  const ok = !!cap && cap.status === 'COMPLETED' && !!amount &&
    amount.currency_code === 'USD' && amount.value === expected;
  if (!ok) {
    // Wrong amount, wrong currency, or not completed: no reward.
    res.status(402).json({ error: 'payment-not-verified' });
    return;
  }
  if (isPack) {
    // Payment verified — the server writes the code to Firestore.
    const issue = await issueAtomCode(pack.atoms);
    if (!issue.ok) {
      // Charged but unsaved: return the code (if any) with saved:false so
      // the buyer keeps it; the client must show the keep-the-code warning.
      res.status(200).json({ ok: true, pack: body.pack, ions: pack.ions, atoms: pack.atoms, code: issue.code || null, saved: false, error: issue.error });
      return;
    }
    res.status(200).json({ ok: true, pack: body.pack, ions: pack.ions, atoms: pack.atoms, code: issue.code, saved: true });
    return;
  }
  res.status(200).json({ ok: true, pet, token: signToken(pet, process.env.UNLOCK_SECRET) });
};
