// api/paypal-config.js — public checkout config for the $ pets checkout, the
// atom sale, and Cash App Pay. MERGED 2026-11-03 (func-limit fix): the three
// config endpoints (paypal-config, ion-paypal-config, square-config) were
// three separate serverless functions returning public config — one endpoint
// now returns all of it. The client id / application id are public by
// design (they go in the PayPal JS SDK URL / Square Web Payments SDK call).
// The secrets are NEVER returned here — they live only in Vercel env vars.
// GET -> {
//   configured, clientId, mode,            // PayPal ($ pets checkout)
//   firestore, ionConfigured,              // atom sale: Firestore service
//                                          // account present; ionConfigured
//                                          // is true only when BOTH the PayPal
//                                          // client id AND Firestore are set —
//                                          // without Firestore the server
//                                          // cannot issue an ATOM code, so the
//                                          // sale must not start.
//   square: { configured, applicationId, locationId, environment }
//                                          // Cash App Pay (Square)
// }
'use strict';
const { firestoreReady } = require('./_lib');

module.exports = function handler(req, res) {
  const id = process.env.PAYPAL_CLIENT_ID || '';
  const mode = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
  const fs = firestoreReady();
  const appId = process.env.SQUARE_APPLICATION_ID || '';
  const loc = process.env.SQUARE_LOCATION_ID || '';
  const env = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  res.status(200).json({
    configured: !!id,
    clientId: id,
    mode: mode === 'live' ? 'live' : 'sandbox',
    firestore: fs,
    ionConfigured: !!id && fs,
    square: {
      configured: !!(appId && loc),
      applicationId: appId,
      locationId: loc,
      environment: env === 'production' ? 'production' : 'sandbox',
    },
  });
};
