module.exports = async function handler(req, res) {
if (req.method !== 'GET') {
res.status(405).json({ error: 'Method not allowed' });
return;
}
var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
var refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
if (!clientId || !clientSecret || !refreshToken) {
res.status(500).json({ error: 'Spotify credentials are not set in Vercel' });
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
res.status(500).json({ error: 'Could not refresh Spotify token' });
return;
}
var tokenData = await tokenRes.json();
var playerRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
headers: { 'Authorization': 'Bearer ' + tokenData.access_token }
});
if (playerRes.status === 204) {
res.status(200).json({ playing: false });
return;
}
if (!playerRes.ok) {
res.status(500).json({ error: 'Could not read Spotify playback' });
return;
}
var data = await playerRes.json();
var item = data.item || {};
var artists = (item.artists || []).map(function (a) { return a.name; }).join(', ');
res.status(200).json({
playing: !!data.is_playing,
name: item.name || '',
artist: artists,
album: item.album ? item.album.name : '',
progress_ms: data.progress_ms || 0,
duration_ms: item.duration_ms || 0,
url: item.external_urls ? item.external_urls.spotify : ''
});
} catch (e) {
res.status(500).json({ error: 'Spotify check failed' });
}
};
