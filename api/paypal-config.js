// api/paypal-config.js — public PayPal config for the checkout.
// The client id is public by design (it goes in the PayPal JS SDK URL).
// The secret is NEVER returned here — it lives only in Vercel env vars.
'use strict';
module.exports = function handler(req, res) {
  const id = process.env.PAYPAL_CLIENT_ID || '';
  const mode = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
  res.status(200).json({
    configured: !!id,
    clientId: id,
    mode: mode === 'live' ? 'live' : 'sandbox',
  });
};
