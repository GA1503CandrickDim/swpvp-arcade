// api/square-config.js — public Square config for Cash App Pay.
// The application id + location id are public by design (they go in the
// Web Payments SDK call: Square.payments(applicationId, locationId)).
// The access token is NEVER returned here — Vercel env vars only.
'use strict';
module.exports = function handler(req, res) {
  const appId = process.env.SQUARE_APPLICATION_ID || '';
  const loc = process.env.SQUARE_LOCATION_ID || '';
  const env = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  res.status(200).json({
    configured: !!(appId && loc),
    applicationId: appId,
    locationId: loc,
    environment: env === 'production' ? 'production' : 'sandbox',
  });
};
