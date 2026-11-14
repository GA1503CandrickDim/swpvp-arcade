// api/spotify-auth.js — visitor Spotify OAuth for the Vault player. MERGED
// 2026-11-03 (func-limit fix): the authorize start and the token refresh
// were two functions — one endpoint now handles both, dispatched by method.
// GET /api/spotify-auth           -> 302 to accounts.spotify.com/authorize
// GET /api/spotify-auth?probe=1  -> 200 JSON { configured: true|false }
// POST /api/spotify-auth { refresh_token } -> 200 { access_token, expires_in,
//   refresh_token? } (refresh a visitor's access token; the client secret
//   stays server-side, the refresh token is never logged or stored — it just
//   passes through to accounts.spotify.com and back)
// The client id comes from SPOTIFY_CLIENT_ID (Vercel env var, server-side
// only — it never ships to the browser). The redirect URI below must be
// registered in the Spotify dev app.
// Redirect URI: https://swpvp-arcadio.vercel.app/api/spotify-callback
var crypto = require('crypto');
var REDIRECT_URI = 'https://swpvp-arcadio.vercel.app/api/spotify-callback';
var SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-private'
].join(' ');
module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    var body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    var refreshToken = (body && body.refresh_token) || '';
    if (!refreshToken) {
      res.status(400).json({ error: 'refresh_token required' });
      return;
    }
    var clientId = process.env.SPOTIFY_CLIENT_ID;
    var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(503).json({ error: 'spotify_not_configured' });
      return;
    }
    try {
      var basic = Buffer.from(clientId + ':' + clientSecret).toString('base64');
      var tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + basic,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(refreshToken)
      });
      if (!tokenRes.ok) {
        res.status(502).json({ error: 'spotify_refresh_failed' });
        return;
      }
      var t = await tokenRes.json();
      var out = { access_token: t.access_token, expires_in: t.expires_in };
      if (t.refresh_token) out.refresh_token = t.refresh_token;
      res.status(200).json(out);
    } catch (e) {
      res.status(502).json({ error: 'spotify_refresh_failed' });
    }
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  var clientIdGet = process.env.SPOTIFY_CLIENT_ID;
  if (req.query && req.query.probe === '1') {
    res.status(200).json({ configured: !!(clientIdGet && process.env.SPOTIFY_CLIENT_SECRET) });
    return;
  }
  if (!clientIdGet || !process.env.SPOTIFY_CLIENT_SECRET) {
    res.status(503).json({ error: 'spotify_not_configured' });
    return;
  }
  var state = crypto.randomBytes(16).toString('hex');
  var requestedReturn = (req.query && req.query.return_to) || '/vault.html';
  var returnTo = (requestedReturn === '/tavern.html' || requestedReturn === '/vault.html') ? requestedReturn : '/vault.html';
  res.setHeader('Set-Cookie', [
    'sp_oauth_state=' + state + '; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax',
    'sp_oauth_return=' + encodeURIComponent(returnTo) + '; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax'
  ]);
  var url = 'https://accounts.spotify.com/authorize'
    + '?client_id=' + encodeURIComponent(clientIdGet)
    + '&response_type=code'
    + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
    + '&scope=' + encodeURIComponent(SCOPES)
    + '&state=' + encodeURIComponent(state);
  res.writeHead(302, { Location: url });
  res.end();
};
