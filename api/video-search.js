// GET /api/video-search?q=... — no-key YouTube search for the HIDEOUT tab.
// Primary: parse the search page's ytInitialData JSON (no key needed).
// Fallback: Innertube search with YouTube's own public web-client key.
// Returns {results:[{id,title,channel,dur,thumb}]} (max 10). No key from Cee.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const IT_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';

function txt(o) {
  if (!o) return '';
  if (typeof o === 'string') return o;
  if (o.simpleText) return o.simpleText;
  if (Array.isArray(o.runs)) return o.runs.map(function (r) { return r.text || ''; }).join('');
  return '';
}

function findVideos(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (var i = 0; i < node.length; i++) findVideos(node[i], out); return; }
  if (node.videoRenderer) {
    var v = node.videoRenderer, id = String(v.videoId || '');
    if (/^[A-Za-z0-9_-]{11}$/.test(id)) {
      out.push({ id: id, title: txt(v.title), channel: txt(v.ownerText), dur: txt(v.lengthText), thumb: 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg' });
    }
  }
  for (var k in node) findVideos(node[k], out);
}

function dedupeCap(out, n) {
  var seen = {}, res = [];
  for (var i = 0; i < out.length; i++) {
    if (!seen[out[i].id]) { seen[out[i].id] = 1; res.push(out[i]); if (res.length >= n) break; }
  }
  return res;
}

async function searchScrape(q) {
  var ctl = new AbortController();
  var to = setTimeout(function () { ctl.abort(); }, 5000);
  try {
    var r = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&hl=en&gl=US', {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, signal: ctl.signal
    });
    if (!r.ok) throw new Error('yt ' + r.status);
    var html = await r.text();
    // First </script> after the assignment ends the tag in a real browser too,
    // so the first "};</script>" IS the end of ytInitialData.
    var m = html.match(/var ytInitialData = (\{.*?\});\s*<\/script>/s);
    if (!m) throw new Error('no ytInitialData');
    var out = [];
    findVideos(JSON.parse(m[1]), out);
    return dedupeCap(out, 10);
  } finally { clearTimeout(to); }
}

async function searchInnertube(q) {
  var ctl = new AbortController();
  var to = setTimeout(function () { ctl.abort(); }, 4000);
  try {
    var r = await fetch('https://www.youtube.com/youtubei/v1/search?key=' + IT_KEY + '&prettyPrint=false', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: '2.20240111.09.00', hl: 'en', gl: 'US' } }, query: q }),
      signal: ctl.signal
    });
    if (!r.ok) throw new Error('innertube ' + r.status);
    var out = [];
    findVideos(await r.json(), out);
    return dedupeCap(out, 10);
  } finally { clearTimeout(to); }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }
  var q = (req.query && typeof req.query.q === 'string') ? req.query.q.trim() : '';
  if (!q) { res.status(400).json({ error: 'A search query is required.' }); return; }
  if (q.length > 200) q = q.slice(0, 200);
  try {
    var results = [];
    try { results = await searchScrape(q); } catch (e) { results = []; }
    if (!results.length) { try { results = await searchInnertube(q); } catch (e) { results = []; } }
    if (!results.length) { res.status(502).json({ error: 'YouTube search is unavailable right now. Try again shortly.' }); return; }
    res.status(200).json({ results: results });
  } catch (e) {
    res.status(502).json({ error: 'Search failed. Try again shortly.' });
  }
};
