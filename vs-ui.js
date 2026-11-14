// HIDEOUT video search UI — lazy-loaded by vsLoad() in index.html on the first
// tap of the HIDEOUT NOW PLAYING bar. Kept out of index.html on purpose: the
// main site is out of deploy room (131,072 B argv ceiling), and this file can
// evolve without touching the index at all. Uses the page's own $ / esc /
// safeUrl helpers (defined by the main script, which runs before any tap).
// Player sits ABOVE the results, so no BACK button is needed: tap a result,
// the player appears at top + scrolls into view, results stay below; the
// modal X closes the player (src -> about:blank) and the search.
var VS_MODAL = '<div class=modal id=vs><div class=modal-header><span>SEARCH VIDEOS</span><span class=close onclick=vsClose()>X</span></div><div class=modal-body><form class=pm-form onsubmit="vsSearch();return false"><input id=vs-q type=text placeholder="Search YouTube..."><button type=submit>SEARCH</button></form><div id=vs-player style=display:none><iframe id=vs-frame width=100% height=240 allowfullscreen allow="autoplay; fullscreen"></iframe></div><div id=vs-results></div></div></div>';
if (!document.getElementById('vs')) document.body.insertAdjacentHTML('beforeend', VS_MODAL);
function vsOpen() { var m = $('vs'); if (m) { m.classList.add('show'); var q = $('vs-q'); if (q) q.focus(); } }
function vsClose() { var m = $('vs'); if (m) m.classList.remove('show'); var f = $('vs-frame'); if (f) f.src = 'about:blank'; var p = $('vs-player'); if (p) p.style.display = 'none'; }
function vsPlay(id) { var f = $('vs-frame'), p = $('vs-player'); if (f) f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'; if (p) { p.style.display = 'block'; p.scrollIntoView(); } }
function vsSearch() { var q = $('vs-q'), r = $('vs-results'); if (!q || !r) return; var v = q.value.trim(); if (!v) { r.innerHTML = 'Type something to search.'; return; } r.innerHTML = 'Searching...'; fetch('/api/video-search?q=' + encodeURIComponent(v)).then(function (x) { return x.json(); }).then(function (d) { if (!d || !d.results || !d.results.length) { r.innerHTML = 'No videos found.'; return; } r.innerHTML = d.results.map(function (t) { return '<button class=msg-row onclick="vsPlay(\'' + t.id + '\')"><img src=' + safeUrl(t.thumb) + ' style=width:120px;height:68px;flex:0 0 auto><span style=min-width:0><b>' + esc(t.title) + '</b><span class=muted>' + esc(t.channel) + (t.dur ? ' · ' + esc(t.dur) : '') + '</span></span></button>'; }).join(''); }).catch(function () { r.innerHTML = 'Search failed - try again.'; }); }
