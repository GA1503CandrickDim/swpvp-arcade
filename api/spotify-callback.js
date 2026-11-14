// api/spotify-callback.js — OAuth redirect target for the Vault Spotify player.
// Exchanges the authorization code for tokens SERVER-SIDE (the client secret
// never leaves Vercel, and the VM never touches accounts.spotify.com — its
// egress proxy blocks it). The tokens are then handed to the browser via a
// same-origin page that stores them in sessionStorage and returns to the caller-selected same-origin page (Tavern or Vault). Tokens
// are never put in the URL and never stored on the server.
// Redirect URI (must match the Spotify dev app):
// https://swpvp-arcadio.vercel.app/api/spotify-callback
var REDIRECT_URI = 'https://swpvp-arcadio.vercel.app/api/spotify-callback';
function readCookie(req, name) {
  var c = (req.headers && req.headers.cookie) || '';
  var parts = c.split(';');
  for (var i = 0; i < parts.length; i++) {
    var kv = parts[i].trim().split('=');
    if (kv[0] === name) return decodeURIComponent(kv[1] || '');
  }
  return '';
}
function returnTarget(req) {
  var p = readCookie(req, 'sp_oauth_return');
  return (p === '/tavern.html' || p === '/vault.html') ? p : '/vault.html';
}
function clearOAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    'sp_oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    'sp_oauth_return=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax'
  ]);
}
function bounce(res, status, target) {
  clearOAuthCookies(res);
  res.writeHead(302, { Location: (target || '/vault.html') + '?spotify=' + status });
  res.end();
}
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  var q = req.query || {};
  var target = returnTarget(req);
  if (q.error) {
    bounce(res, 'denied', target);
    return;
  }
  var code = q.code || '';
  var state = q.state || '';
  if (!code || !state || state !== readCookie(req, 'sp_oauth_state')) {
    bounce(res, 'error', target);
    return;
  }
  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    bounce(res, 'not_configured', target);
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
      body: 'grant_type=authorization_code&code=' + encodeURIComponent(code)
        + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
    });
    if (!tokenRes.ok) {
      bounce(res, 'error', target);
      return;
    }
    var t = await tokenRes.json();
    if (!t.access_token) {
      bounce(res, 'error', target);
      return;
    }
    var payload = JSON.stringify({
      access: t.access_token,
      refresh: t.refresh_token || '',
      exp: Date.now() + (t.expires_in || 3600) * 1000
    }).replace(/</g, '\\u003c');
    clearOAuthCookies(res);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connecting Spotify…</title></head><body>'
      + '<p>Connecting your Spotify…</p>'
      + '<script>try{var t=' + payload + ';'
      + 'sessionStorage.setItem("sw_spotify_access",t.access);'
      + 'if(t.refresh)sessionStorage.setItem("sw_spotify_refresh",t.refresh);'
      + 'sessionStorage.setItem("sw_spotify_expires_at",String(t.exp));'
      + '}catch(e){}location.replace("' + target + '?spotify=connected");</script>'
      + '</body></html>'
    );
  } catch (e) {
    bounce(res, 'error', target);
  }
};
