'use strict';
var PET_DEFS = [
{ id: 'buddy', name: 'BUDDY', emoji: '🦖', body: '#1c1c22', belly: '#ffd23f', tail: 'rect', ear: 'spike', track: 'free', cost: 0, dollars: 0, desc: 'Your dino buddy. Dark hide, gold belly.' },
{ id: 'goldraven', name: 'GOLDRAVEN', emoji: '🦅', body: '#14141c', belly: '#ffd23f', tail: 'wing', ear: 'beak', track: 'coin', cost: 800, dollars: 0, noBreed: true, desc: 'A raven knight who remembers. Morphs between raven and person.' },
{ id: 'dog', name: 'DOG', emoji: '🐶', body: '#8a6b4f', belly: '#e8dcc8', tail: 'rect', ear: 'flop', track: 'coin', cost: 150, dollars: 0, desc: 'A plain friendly dog. Nothing fancy.' },
{ id: 'cat', name: 'CAT', emoji: '🐱', body: '#6b6b72', belly: '#f0e8dc', tail: 'rect', ear: 'point', track: 'coin', cost: 300, dollars: 0, desc: 'A plain grey cat. Quiet and calm.' },
{ id: 'bunny', name: 'BUNNY', emoji: '🐰', body: '#d8d8d8', belly: '#ffffff', tail: 'puff', ear: 'long', track: 'coin', cost: 600, dollars: 0, desc: 'A plain soft bunny. Long ears.' },
{ id: 'ember', name: 'EMBER', emoji: '🔥', body: '#b3541e', belly: '#ffe9b0', tail: 'flame', ear: 'point', track: 'dollar', cost: 0, dollars: 1, desc: 'A warm little fire pup. Flame tail. Has its own ember field map.' },
{ id: 'frost', name: 'FROST', emoji: '❄️', body: '#a8c8e0', belly: '#ffffff', tail: 'puff', ear: 'point', track: 'dollar', cost: 0, dollars: 2, desc: 'A chilly ice pup. Snow-soft fur. Has its own snowfield map.' },
{ id: 'shadow', name: 'SHADOW', emoji: '🌑', body: '#14141c', belly: '#ffd23f', tail: 'rect', ear: 'horn', track: 'dollar', cost: 0, dollars: 3, desc: 'A quiet wraith cat. Gold eyes, tiny horns. Has its own moonlit yard map.' },
{ id: 'morph', name: 'MORPH', emoji: '🎭', body: '#3f3f56', belly: '#cfd2e0', tail: 'rect', ear: 'horn', track: 'dollar', cost: 0, dollars: 4, desc: 'A shifter — swap his mask, top, chain and hat anytime. Has his own loft map.' },
{ id: 'apex', name: 'APEX', emoji: '👑', body: '#0d0d12', belly: '#ffd700', tail: 'flame', ear: 'horn', track: 'dollar', cost: 0, dollars: 5, desc: 'The ultimate. Every feature, biggest map, gold everything. Has his own spire map.' }
];
var MORPH_PARTS = {
mask: [
{ id: 'none', name: 'BARE FACE', cost: 0 },
{ id: 'goldmask', name: 'GOLD MASK', cost: 60 },
{ id: 'whitemask', name: 'WHITE MASK', cost: 90 },
{ id: 'shadowmask', name: 'SHADOW MASK', cost: 120 }
],
top: [
{ id: 'none', name: 'BARE', cost: 0 },
{ id: 'blackhoodie', name: 'BLACK HOODIE', cost: 70 },
{ id: 'whitehoodie', name: 'WHITE HOODIE', cost: 100 },
{ id: 'goldtrim', name: 'GOLD-TRIM JACKET', cost: 140 }
],
chain: [
{ id: 'none', name: 'NO CHAIN', cost: 0 },
{ id: 'goldchain', name: 'GOLD CHAIN', cost: 50 },
{ id: 'spikechain', name: 'SPIKED CHAIN', cost: 80 }
],
hat: [
{ id: 'none', name: 'NO HAT', cost: 0 },
{ id: 'cap', name: 'WRAITH CAP', cost: 45 },
{ id: 'hood', name: 'DARK HOOD', cost: 75 },
{ id: 'crown', name: 'SCRAP CROWN', cost: 110 }
]
};
function morphPart(slot, id) {
var list = MORPH_PARTS[slot] || [];
for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
return null;
}
var APEX_PARTS = {
mask: [
{ id: 'none', name: 'BARE FACE', cost: 0 },
{ id: 'apexgold', name: 'GOLD VISOR', cost: 80 },
{ id: 'apexonix', name: 'ONYX MASK', cost: 120 },
{ id: 'apexvoid', name: 'VOID MASK', cost: 160 }
],
top: [
{ id: 'none', name: 'BARE', cost: 0 },
{ id: 'apexcoat', name: 'SHADOW COAT', cost: 90 },
{ id: 'apexarmor', name: 'GOLD ARMOR', cost: 130 },
{ id: 'apexrobe', name: 'AURA ROBE', cost: 150 }
],
chain: [
{ id: 'none', name: 'NO CHAIN', cost: 0 },
{ id: 'apexchain', name: 'AURA CHAIN', cost: 70 },
{ id: 'apexspike', name: 'SPIKED AURA CHAIN', cost: 100 }
],
hat: [
{ id: 'none', name: 'NO HAT', cost: 0 },
{ id: 'apexhelm', name: 'GOLD HELM', cost: 90 },
{ id: 'apexhood', name: 'AURA HOOD', cost: 110 },
{ id: 'apexcrown', name: 'APEX CROWN', cost: 160 }
]
};
var PART_CATALOGS = { morph: MORPH_PARTS, apex: APEX_PARTS };
var PART_COLORS = { goldmask: '#ffcc33', whitemask: '#f2f2f2', shadowmask: '#22222e', blackhoodie: '#111116', whitehoodie: '#e8e8ec', goldtrim: '#8a6d1a', goldchain: '#ffcc33', spikechain: '#c0c0c8', apexgold: '#ffd700', apexonix: '#1a1a22', apexvoid: '#5a2a8a', apexcoat: '#0d0d12', apexarmor: '#6a6a76', apexrobe: '#3a1a4a', apexchain: '#ffd700', apexspike: '#d8d8e0' };
var HAT_COLORS = { cap: '#7a1f1f', crown: '#ffcc33', hood: '#111111', apexhelm: '#ffd700', apexhood: '#0d0d12', apexcrown: '#ffd700' };
function partCatalog(petId) { return PART_CATALOGS[petId] || null; }
function catalogPart(petId, slot, id) {
var cat = partCatalog(petId);
if (!cat) return null;
var list = cat[slot] || [];
for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
return null;
}
function freshPartsState() {
return { owned: { mask: ['none'], top: ['none'], chain: ['none'], hat: ['none'] },
equipped: { mask: 'none', top: 'none', chain: 'none', hat: 'none' } };
}
function freshMorphParts() { return freshPartsState(); }
function freshMissionSet() { return { collect: false, spots: false, reach: false, bonus: false }; }
function freshMissions() {
var m = {};
PET_DEFS.forEach(function (d) { m[d.id] = freshMissionSet(); });
return m;
}
function mapDecor(seed, n, w, h) {
var out = [], s = seed;
for (var i = 0; i < n; i++) {
s = (s * 1103515245 + 12345) % 2147483648; var x = 40 + (s % (w - 80));
s = (s * 1103515245 + 12345) % 2147483648; var y = 40 + (s % (h - 80));
out.push({ x: x, y: y, k: i % 3 });
}
return out;
}
var MAP_DEFS = {
buddy: { name: 'DINO FIELD', w: 640, h: 480, ground: '#1e2a18', sky: '#0d140c', coin: 5, dest: { x: 580, y: 60 },
pickups: [ { x: 120, y: 120 }, { x: 520, y: 120 }, { x: 320, y: 360 }, { x: 520, y: 400 } ],
spots: [
{ x: 520, y: 240, kind: 'bones', label: 'BONE PILE', line: 'A pile of old bones. Buddy guards his treasure.', bonus: 10 },
{ x: 140, y: 300, kind: 'pool', label: 'MUD POOL', line: 'Buddy loves the mud pool. Do not ask why.', bonus: 10 }
] },
dog: { name: 'DOG YARD', w: 720, h: 540, ground: '#3a2e1c', sky: '#241c10', coin: 5, dest: { x: 660, y: 70 },
pickups: [ { x: 130, y: 140 }, { x: 590, y: 130 }, { x: 360, y: 420 } ],
spots: [
{ x: 560, y: 260, kind: 'kennel', label: 'KENNEL', line: 'A cozy kennel. Dog naps here after every walk.', bonus: 10 },
{ x: 170, y: 300, kind: 'hydrant', label: 'HYDRANT', line: 'The famous hydrant. Every dog in town knows it.', bonus: 10 }
] },
cat: { name: 'CAT GARDEN', w: 800, h: 600, ground: '#22331f', sky: '#101a0e', coin: 5, dest: { x: 740, y: 70 },
pickups: [ { x: 130, y: 130 }, { x: 670, y: 150 }, { x: 400, y: 450 }, { x: 670, y: 470 } ],
spots: [
{ x: 600, y: 250, kind: 'tree', label: 'CAT TREE', line: 'A tall cat tree. Cat watches the whole garden from up there.', bonus: 10 },
{ x: 180, y: 320, kind: 'pool', label: 'FISH POND', line: 'A small fish pond. Cat stares at it for hours.', bonus: 10 }
] },
bunny: { name: 'BUNNY MEADOW', w: 880, h: 640, ground: '#2c3a1e', sky: '#141f0e', coin: 5, dest: { x: 810, y: 80 },
pickups: [ { x: 130, y: 130 }, { x: 750, y: 140 }, { x: 440, y: 320 }, { x: 150, y: 520 }, { x: 740, y: 520 } ],
spots: [
{ x: 640, y: 250, kind: 'carrot', label: 'CARROT PATCH', line: 'A fat carrot patch. Bunny could live here forever.', bonus: 10 },
{ x: 200, y: 330, kind: 'flowers', label: 'FLOWER BED', line: 'A bed of soft flowers. Bunny naps between the blooms.', bonus: 10 }
] },
ember: { name: 'EMBER FIELD', w: 960, h: 640, ground: '#2a1608', sky: '#1a0d05', coin: 5, dest: { x: 890, y: 80 },
pickups: [ { x: 150, y: 140 }, { x: 820, y: 180 }, { x: 480, y: 480 }, { x: 830, y: 520 } ],
spots: [
{ x: 700, y: 300, kind: 'crystal', label: 'WARM CRYSTAL', line: 'The crystal hums warm. Ember naps beside it sometimes.', bonus: 10 },
{ x: 220, y: 330, kind: 'stand', label: 'LAVA STAND', line: 'A stone stand over a slow lava pool. Toasty.', bonus: 10 },
{ x: 480, y: 150, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] },
frost: { name: 'SNOWFIELD', w: 1040, h: 700, ground: '#dfe9f2', sky: '#b8c9dd', coin: 5, dest: { x: 970, y: 80 },
pickups: [ { x: 180, y: 200 }, { x: 780, y: 160 }, { x: 480, y: 500 } ],
spots: [
{ x: 480, y: 280, kind: 'crystal', label: 'ICE CRYSTAL', line: 'The ice crystal sings quiet in the cold. Frost loves it.', bonus: 10 },
{ x: 760, y: 420, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] },
shadow: { name: 'MOONLIT YARD', w: 1120, h: 760, ground: '#0c0c18', sky: '#070712', coin: 5, dest: { x: 1050, y: 90 },
pickups: [ { x: 120, y: 120 }, { x: 840, y: 140 }, { x: 480, y: 320 }, { x: 160, y: 520 }, { x: 820, y: 520 } ],
spots: [
{ x: 700, y: 200, kind: 'moon', label: 'MOON GATE', line: 'The moon gate glows. Shadow slips through it like smoke.', bonus: 10 },
{ x: 260, y: 420, kind: 'stand', label: 'OLD WELL', line: 'Something glints at the bottom of the old well.', bonus: 10 },
{ x: 560, y: 600, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] },
morph: { name: 'MORPH LOFT', w: 1200, h: 800, ground: '#1c1a20', sky: '#121016', coin: 5, dest: { x: 1120, y: 90 },
pickups: [ { x: 150, y: 150 }, { x: 810, y: 170 }, { x: 480, y: 470 }, { x: 820, y: 500 } ],
spots: [
{ x: 690, y: 300, kind: 'bench', label: 'WORKBENCH', line: 'Tools everywhere. Morph built half his look right here.', bonus: 10 },
{ x: 230, y: 320, kind: 'sign', label: 'NEON SIGN', line: 'The sign buzzes: MAKE IT YOURS.', bonus: 10 },
{ x: 600, y: 620, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] },
apex: { name: 'AURA SPIRE', w: 1280, h: 860, ground: '#14141f', sky: '#0a0a14', coin: 5, dest: { x: 1200, y: 90 },
pickups: [ { x: 160, y: 160 }, { x: 850, y: 180 }, { x: 480, y: 430 }, { x: 240, y: 680 }, { x: 1050, y: 640 } ],
spots: [
{ x: 760, y: 300, kind: 'crystal', label: 'SPIRE CRYSTAL', line: 'The spire crystal burns gold. Apex stands taller near it.', bonus: 10 },
{ x: 280, y: 340, kind: 'stand', label: 'GOLD STAND', line: 'A stand of solid gold. Nobody knows who left it.', bonus: 10 },
{ x: 640, y: 620, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] },
goldraven: { name: 'RAVEN ROOST', w: 1040, h: 700, ground: '#141826', sky: '#0a0c16', coin: 5, dest: { x: 970, y: 80 },
pickups: [ { x: 150, y: 150 }, { x: 800, y: 170 }, { x: 480, y: 480 }, { x: 830, y: 540 } ],
spots: [
{ x: 700, y: 300, kind: 'perch', label: 'HIGH PERCH', line: 'Goldraven watches the whole roost from up here.', bonus: 10 },
{ x: 240, y: 330, kind: 'shrine', label: 'OLD SHRINE', line: 'A shrine to a friend nobody remembers but him.', bonus: 10 },
{ x: 520, y: 600, kind: 'dummy', label: 'TRAINING POST', line: 'A sturdy sparring post.', bonus: 0 }
] }
};
MAP_DEFS.apex.decor = mapDecor(71, 46, 1280, 860);
MAP_DEFS.buddy.decor = mapDecor(3, 24, 640, 480);
MAP_DEFS.dog.decor = mapDecor(7, 28, 720, 540);
MAP_DEFS.cat.decor = mapDecor(13, 32, 800, 600);
MAP_DEFS.bunny.decor = mapDecor(19, 36, 880, 640);
MAP_DEFS.ember.decor = mapDecor(11, 38, 960, 640);
MAP_DEFS.frost.decor = mapDecor(29, 40, 1040, 700);
MAP_DEFS.shadow.decor = mapDecor(47, 42, 1120, 760);
MAP_DEFS.morph.decor = mapDecor(63, 44, 1200, 800);
MAP_DEFS.goldraven.decor = mapDecor(83, 40, 1040, 700);
var EVO_STAGES = [
{ name: 'BABY', xp: 0, cost: 0, mult: 1, scale: 1.0 },
{ name: 'GROWN', xp: 50, cost: 200, mult: 1.5, scale: 1.25 },
{ name: 'BIG BUDDY', xp: 150, cost: 500, mult: 2, scale: 1.5 }
];
var UPGRADES = [
{ id: 'tap', name: 'TAP POWER', desc: '+1 molecule per tap, per level', base: 20, max: 20 },
{ id: 'auto', name: 'AUTO EARN', desc: '+1 molecule per second, per level', base: 50, max: 20 },
{ id: 'touch', name: 'GOLDEN TOUCH', desc: '+1 XP per tap, per level', base: 30, max: 10 }
];
var PET_CFG = {
walletKey: 'wraith_coins', stateKey: 'wraith_pet_v1',
startCoins: 50, meterStart: 80, meterMin: 5, meterMax: 100,
decayPerMin: { hunger: 1.2, happy: 0.8, energy: 0.6, clean: 0.5 },
decayCapMin: 60, awayCapMin: 5,
foods: [
{ id: 'bone', name: 'MEATY BONE', cost: 10, hunger: 35, happy: 0, xp: 2, desc: '+35 hunger' },
{ id: 'berry', name: 'GOLD BERRY', cost: 18, hunger: 20, happy: 10, xp: 3, desc: '+20 hunger, +10 happy' },
{ id: 'feast', name: 'FEAST PLATTER', cost: 30, hunger: 50, happy: 8, xp: 4, desc: '+50 hunger, +8 happy' }
],
gear: [
{ id: 'chain', name: 'GOLD CHAIN', cost: 60, desc: 'Thick gold chain across his chest', attr: 'Battle: +2 damage on all attacks' },
{ id: 'hoodie', name: 'RED HOODIE', cost: 80, desc: 'Dark red hoodie, gold trim', attr: 'Battle: +10 max HP' },
{ id: 'cap', name: 'SPIKE CAP', cost: 50, desc: 'Spiked cap on his head', attr: 'Battle: attackers take 1 thorn damage' },
{ id: 'shades', name: 'STAR SHADES', cost: 45, desc: 'Gold star shades', attr: 'Battle: +2 SPD, strikes first more often' },
{ id: 'ball', name: 'BOUNCE BALL', cost: 40, desc: 'Toy ball — PLAY earns +2 extra molecules & +5 happy' }
]
};

function escapeChance(playerSpd, foeSpd, attempts) {
if (!(foeSpd > 0) || !isFinite(foeSpd)) return 1;
var ps = (typeof playerSpd === 'number' && isFinite(playerSpd)) ? Math.max(0, playerSpd) : 0;
var a = (typeof attempts === 'number' && isFinite(attempts)) ? Math.max(0, Math.floor(attempts)) : 0;
return Math.min(1, (ps * 128 / foeSpd + 30 * a) / 256);
}
function isBossWild(id) { return id === 'hollowking' || id === 'depthmaw'; }
/* SAVE CODE — carry pets and coins to another browser or phone. Pure codec:
   the save becomes JSON, then UTF-8 bytes, then base64url text, plus a short
   checksum, grouped in fours. No network, no server, nothing leaves the page
   except the code the player copies. kind 'gold' (this build, with GOLDRAVEN)
   and kind 'old' (the pre-GOLDRAVEN build) codes never load into each other.
   Dollar pets, dollar wardrobe parts and APEX quest progress are always
   stripped here: nothing dollar-related can arrive by code. Import still
   goes through loadPet, so old and tampered shapes normalize the same way
   a stored save does. */
var SAVE_CODE_PREFIX = 'WP1';
var SAVE_CODE_COINS_CAP = 999999;
function saveCodeKind() {
  for (var i = 0; i < PET_DEFS.length; i++) if (PET_DEFS[i].id === 'goldraven') return 'gold';
  return 'old';
}
function saveCodeHash(s) {
  var h = 5381;
  for (var i = 0; i < s.length; i++) { h = (((h << 5) + h) + s.charCodeAt(i)) >>> 0; }
  var hex = h.toString(16);
  while (hex.length < 8) hex = '0' + hex;
  return hex;
}
function saveCodeUtf8(s) {
  var out = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 128) { out.push(c); }
    else if (c < 2048) { out.push(192 | (c >> 6), 128 | (c & 63)); }
    else if (c >= 55296 && c <= 56319 && i + 1 < s.length) {
      var d = s.charCodeAt(i + 1);
      if (d >= 56320 && d <= 57343) {
        var cp = 65536 + ((c - 55296) << 10) + (d - 56320);
        out.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
        i++;
      } else { out.push(239, 191, 189); }
    }
    else { out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
  }
  return out;
}
function saveCodeFromUtf8(bytes) {
  var out = '', i = 0;
  while (i < bytes.length) {
    var b = bytes[i++];
    if (b < 128) { out += String.fromCharCode(b); }
    else if (b >= 192 && b < 224 && i < bytes.length) { out += String.fromCharCode(((b & 31) << 6) | (bytes[i++] & 63)); }
    else if (b >= 224 && b < 240 && i + 1 < bytes.length) { out += String.fromCharCode(((b & 15) << 12) | ((bytes[i] & 63) << 6) | (bytes[i + 1] & 63)); i += 2; }
    else if (b >= 240 && b < 248 && i + 2 < bytes.length) {
      var cp = ((b & 7) << 18) | ((bytes[i] & 63) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63); i += 3;
      cp -= 65536; out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    }
    else { out += '?'; }
  }
  return out;
}
var SAVE_CODE_B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function saveCodeB64e(bytes) {
  var out = '';
  for (var i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i], b1 = (i + 1 < bytes.length) ? bytes[i + 1] : 0, b2 = (i + 2 < bytes.length) ? bytes[i + 2] : 0;
    out += SAVE_CODE_B64.charAt(b0 >> 2);
    out += SAVE_CODE_B64.charAt(((b0 & 3) << 4) | (b1 >> 4));
    if (i + 1 < bytes.length) out += SAVE_CODE_B64.charAt(((b1 & 15) << 2) | (b2 >> 6));
    if (i + 2 < bytes.length) out += SAVE_CODE_B64.charAt(b2 & 63);
  }
  return out;
}
function saveCodeB64d(s) {
  var vals = {}, i;
  for (i = 0; i < SAVE_CODE_B64.length; i++) vals[SAVE_CODE_B64.charAt(i)] = i;
  var out = [];
  var acc = 0, nbits = 0;
  for (i = 0; i < s.length; i++) {
    var v = vals[s.charAt(i)];
    if (v === undefined) return null;
    acc = (acc << 6) | v; nbits += 6;
    if (nbits >= 8) { nbits -= 8; out.push((acc >> nbits) & 255); }
  }
  return out;
}
function saveCodeNum(v, fallback) { var n = +v; return isFinite(n) ? n : fallback; }
function saveCodeBreedOk(def) {
  if (typeof canBreed === 'function') return canBreed(def);
  return breedableTrack(def);
}
/* Build a clean save from a fresh state, copying only known fields. Dollar
   pets stay fresh and unowned, APEX wardrobe parts stay fresh, the APEX
   quest world stays fresh, and the depths flag stays off. Unknown fields
   are dropped because they are never copied. */
function sanitizeSaveForCode(raw, now) {
  var st = freshPetState(now);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return st;
  var i, d, src, dst;
  for (i = 0; i < PET_DEFS.length; i++) {
    d = PET_DEFS[i];
    src = (raw.pets && raw.pets[d.id]) || null;
    dst = st.pets[d.id];
    if (!src || typeof src !== 'object') { if (d.id === 'goldraven') dst.form = 'raven'; continue; }
    if (d.track === 'dollar') continue;
    dst.owned = !!src.owned || d.track === 'free';
    if (src.m && typeof src.m === 'object') {
      dst.m.hunger = clampM(saveCodeNum(src.m.hunger, PET_CFG.meterStart));
      dst.m.happy = clampM(saveCodeNum(src.m.happy, PET_CFG.meterStart));
      dst.m.energy = clampM(saveCodeNum(src.m.energy, PET_CFG.meterStart));
      dst.m.clean = clampM(saveCodeNum(src.m.clean, PET_CFG.meterStart));
    }
    dst.xp = Math.max(0, Math.min(999999, Math.floor(saveCodeNum(src.xp, 0))));
    dst.evo = Math.max(0, Math.min(EVO_STAGES.length - 1, Math.floor(saveCodeNum(src.evo, 0))));
    dst.variant = (src.variant === 'shiny' || src.variant === 'diamond' || src.variant === 'dark') ? src.variant : null;
    dst.room = (src.room === 'food' || src.room === 'happy') ? src.room : 'living';
    if (d.id === 'goldraven') dst.form = (src.form === 'person' || src.form === 'raven') ? src.form : 'raven';
    dst.lastSeen = saveCodeNum(src.lastSeen, now);
    if (!isFinite(dst.lastSeen) || dst.lastSeen < 0) dst.lastSeen = now;
  }
  /* ===== FUSIONS (pet merge) — free merged pets survive save-code export.
     $ pets / APEX are stripped above; fusions are free pets, so they stay.
     Same validation as restoreFusions in the shell: fuseNNN id, two distinct
     parents (base pets or earlier fusions), look is a parent, 1-16 letter
     name, exactly 3 moves from the parents' pool (power 1-30), variant kind. */
  if (Array.isArray(raw.fusions)) {
    var fseen = {};
    raw.fusions.forEach(function (f) {
      if (!f || typeof f !== 'object') return;
      if (!/^fuse\d+$/.test(f.id || '')) return;
      if (fseen[f.id]) return;
      var pa = f.parents && f.parents[0], pb = f.parents && f.parents[1];
      if (!pa || !pb || pa === pb) return;
      var parentOk = function (id) {
        if (st.pets[id]) return true;
        return st.fusions.some(function (x) { return x.id === id; });
      };
      if (!parentOk(pa) || !parentOk(pb)) return;
      if (f.look !== pa && f.look !== pb) return;
      if (typeof f.name !== 'string' || !(f.name = f.name.trim()) || f.name.length > 16) return;
      if (!Array.isArray(f.moves) || f.moves.length !== 3) return;
      for (var mi = 0; mi < f.moves.length; mi++) {
        var mv = f.moves[mi];
        if (!mv || typeof mv.name !== 'string' || !mv.name || !isFinite(+mv.power) || +mv.power < 1 || +mv.power > 30 || typeof mv.type !== 'string' || !mv.type) return;
      }
      if (f.variant && VARIANT_KINDS.indexOf(f.variant) < 0) return;
      fseen[f.id] = true;
      var variant = f.variant || null;
      var rec = { id: f.id, name: f.name.toUpperCase(), parents: [pa, pb], look: f.look, moves: f.moves.map(function (m) { return { name: m.name, power: Math.floor(+m.power), type: m.type }; }), variant: variant, createdAt: isFinite(+f.createdAt) ? +f.createdAt : now };
      st.fusions.push(rec);
      var ps = (raw.pets && raw.pets[f.id]) || {};
      var pm = (ps.m && typeof ps.m === 'object') ? ps.m : {};
      st.pets[f.id] = { owned: true, m: { hunger: clampM(saveCodeNum(pm.hunger, PET_CFG.meterStart)), happy: clampM(saveCodeNum(pm.happy, PET_CFG.meterStart)), energy: clampM(saveCodeNum(pm.energy, PET_CFG.meterStart)), clean: clampM(saveCodeNum(pm.clean, PET_CFG.meterStart)) }, xp: Math.max(0, Math.min(999999, Math.floor(saveCodeNum(ps.xp, 0)))), evo: 0, variant: variant, room: 'living', lastSeen: saveCodeNum(ps.lastSeen, now) };
      if (!isFinite(st.pets[f.id].lastSeen) || st.pets[f.id].lastSeen < 0) st.pets[f.id].lastSeen = now;
      st.battle[f.id] = { lv: 1, xp: 0 };
    });
  }
  if (raw.active && st.pets[raw.active] && st.pets[raw.active].owned && petDef(raw.active).track !== 'dollar') st.active = raw.active;
  if (raw.inv) for (var f in st.inv) st.inv[f] = Math.max(0, Math.min(99999, Math.floor(saveCodeNum(raw.inv[f], 0))));
  if (raw.owned) for (var g in st.owned) st.owned[g] = !!raw.owned[g];
  if (raw.equipped) for (var e in st.equipped) st.equipped[e] = !!raw.equipped[e] && !!st.owned[e];
  if (raw.upgrades) {
    for (var u in st.upgrades) {
      var umax = 99;
      for (var ui = 0; ui < UPGRADES.length; ui++) if (UPGRADES[ui].id === u) umax = UPGRADES[ui].max;
      st.upgrades[u] = Math.max(0, Math.min(umax, Math.floor(saveCodeNum(raw.upgrades[u], 0))));
    }
  }
  var partsSrc = raw.parts || (raw.morphParts ? { morph: raw.morphParts } : null);
  if (partsSrc) {
    for (var pid in st.parts) {
      if (pid === 'apex') continue;
      var psrc = partsSrc[pid];
      if (!psrc) continue;
      for (var slot in st.parts[pid].owned) {
        var arr = psrc.owned && psrc.owned[slot];
        if (Array.isArray(arr)) {
          st.parts[pid].owned[slot] = arr.filter(function (id) { return !!catalogPart(pid, slot, id); });
        }
        if (!st.parts[pid].owned[slot].length) st.parts[pid].owned[slot] = ['none'];
        var eq = psrc.equipped && psrc.equipped[slot];
        st.parts[pid].equipped[slot] = (eq && st.parts[pid].owned[slot].indexOf(eq) >= 0) ? eq : 'none';
      }
    }
  }
  if (raw.battle) {
    for (var bid in st.battle) {
      if (!raw.battle[bid] || petDef(bid).track === 'dollar') continue;
      st.battle[bid].lv = Math.max(1, Math.min(99, Math.floor(saveCodeNum(raw.battle[bid].lv, 1))));
      st.battle[bid].xp = Math.max(0, Math.min(999999, Math.floor(saveCodeNum(raw.battle[bid].xp, 0))));
    }
  }
  if (raw.caught) {
    for (var cid in raw.caught) {
      if (wildDefById(cid)) st.caught[cid] = Math.max(0, Math.min(99999, Math.floor(saveCodeNum(raw.caught[cid], 0))));
    }
  }
  if (raw.caughtVariants) {
    for (var cv in raw.caughtVariants) {
      var cvp = cv.split('_'), vk = cvp[cvp.length - 1], wid = cvp.slice(0, -1).join('_');
      if (VARIANT_KINDS.indexOf(vk) >= 0 && wildDefById(wid)) st.caughtVariants[cv] = Math.max(0, Math.min(99999, Math.floor(saveCodeNum(raw.caughtVariants[cv], 0))));
    }
  }
  if (raw.merged) {
    for (var mgid in st.merged) {
      if (!raw.merged[mgid] || petDef(mgid).track === 'dollar') continue;
      var smg = raw.merged[mgid];
      st.merged[mgid] = { atk: Math.max(0, Math.min(99, Math.floor(saveCodeNum(smg.atk, 0)))), def: Math.max(0, Math.min(99, Math.floor(saveCodeNum(smg.def, 0)))), spd: Math.max(0, Math.min(99, Math.floor(saveCodeNum(smg.spd, 0)))), count: Math.max(0, Math.min(MERGE_CAP, Math.floor(saveCodeNum(smg.count, 0)))) };
    }
  }
  if (raw.missions) {
    for (var mid in st.missions) {
      if (raw.missions[mid]) for (var mk in st.missions[mid]) st.missions[mid][mk] = !!raw.missions[mid][mk];
    }
  }
  var freshQ = freshQuestState();
  if (raw.quests && typeof raw.quests === 'object') {
    for (var w in freshQ) {
      if (w === 'apex') continue;
      var wsrc = raw.quests[w];
      if (!wsrc) continue;
      for (var qid in freshQ[w]) {
        var qsrc = wsrc[qid], qdst = st.quests[w][qid], qdef = questDef(qid);
        if (!qsrc || !qdef) continue;
        qdst.active = !!qsrc.active;
        qdst.step = Math.max(0, Math.min(qdef.steps.length - 1, Math.floor(saveCodeNum(qsrc.step, 0))));
        qdst.count = Math.max(0, Math.floor(saveCodeNum(qsrc.count, 0)));
        qdst.zones = {};
        if (qsrc.zones) APEX_ZONES.forEach(function (z) { if (qsrc.zones[z.id]) qdst.zones[z.id] = true; });
        qdst.done = !!qsrc.done;
        qdst.doneAt = Math.max(0, saveCodeNum(qsrc.doneAt, 0));
      }
    }
  }
  st.depthsCleared = false;
  if (raw.nest && typeof raw.nest === 'object') {
    var nsrc = raw.nest;
    if (Array.isArray(nsrc.eggs)) {
      st.nest.eggs = nsrc.eggs.filter(function (eg) {
        return eg && st.pets[eg.a] && st.pets[eg.b] && saveCodeBreedOk(petDef(eg.a)) && saveCodeBreedOk(petDef(eg.b)) &&
          st.pets[eg.species] && (eg.species === eg.a || eg.species === eg.b) &&
          VARIANT_KINDS.indexOf(eg.variant) >= 0 && isFinite(+eg.readyAt) && +eg.readyAt >= 0 && isFinite(+eg.createdAt) && +eg.createdAt >= 0;
      }).slice(0, MAX_EGGS).map(function (eg) { return { a: eg.a, b: eg.b, species: eg.species, variant: eg.variant, createdAt: +eg.createdAt, readyAt: +eg.readyAt }; });
    }
    if (Array.isArray(nsrc.pups)) {
      st.nest.pups = nsrc.pups.filter(function (pp) {
        return pp && st.pets[pp.species] && saveCodeBreedOk(petDef(pp.species)) &&
          VARIANT_KINDS.indexOf(pp.variant) >= 0 && isFinite(+pp.hatchedAt) && +pp.hatchedAt >= 0;
      }).map(function (pp) { return { species: pp.species, variant: pp.variant, hatchedAt: +pp.hatchedAt }; });
    }
    if (nsrc.cooldowns) {
      for (var nid in nsrc.cooldowns) {
        if (st.pets[nid] && saveCodeBreedOk(petDef(nid)) && isFinite(+nsrc.cooldowns[nid]) && +nsrc.cooldowns[nid] >= 0) st.nest.cooldowns[nid] = Math.max(0, +nsrc.cooldowns[nid]);
      }
    }
  }
  if (raw.team && typeof raw.team === 'object') {
    if (Array.isArray(raw.team.members)) {
      var seenTeam = {};
      raw.team.members.forEach(function (mid) {
        if (st.team.members.length < TEAM_MAX && st.pets[mid] && st.pets[mid].owned && petDef(mid).track !== 'dollar' && !seenTeam[mid]) { seenTeam[mid] = true; st.team.members.push(mid); }
      });
    }
    st.team.wins = Math.max(0, Math.floor(saveCodeNum(raw.team.wins, 0)));
    st.team.played = Math.max(0, Math.floor(saveCodeNum(raw.team.played, 0)));
  }
  st.lastSeen = saveCodeNum(raw.lastSeen, now);
  if (!isFinite(st.lastSeen) || st.lastSeen < 0) st.lastSeen = now;
  for (var pli = 0; pli < PET_DEFS.length; pli++) st.pets[PET_DEFS[pli].id].lastSeen = st.lastSeen;
  return st;
}
function encodeSave(saveObj, coins) {
  try {
    if (!saveObj || typeof saveObj !== 'object' || Array.isArray(saveObj)) return null;
    var c = +coins;
    if (!isFinite(c) || c < 0) return null;
    c = Math.min(SAVE_CODE_COINS_CAP, Math.floor(c));
    var nowSrc = isFinite(+saveObj.lastSeen) ? +saveObj.lastSeen : 0;
    var clean = sanitizeSaveForCode(saveObj, nowSrc);
    var payload = JSON.stringify({ v: 1, kind: saveCodeKind(), save: clean, coins: c });
    var body = saveCodeB64e(saveCodeUtf8(payload));
    var parts = [SAVE_CODE_PREFIX];
    for (var i = 0; i < body.length; i += 4) parts.push(body.slice(i, i + 4));
    parts.push(saveCodeHash(body));
    return parts.join('-');
  } catch (e) { return null; }
}
function decodeSave(code) {
  var bad = 'That code does not look right — check it and try again.';
  var damaged = 'That code looks damaged — check it and try again.';
  try {
    if (typeof code !== 'string') return { ok: false, error: bad };
    var s = '', ci;
    for (ci = 0; ci < code.length; ci++) {
      var ch = code.charAt(ci);
      if (ch !== ' ' && ch !== '\n' && ch !== '\r' && ch !== '\t') s += ch;
    }
    var parts = s.split('-');
    if (parts.length < 3 || parts[0] !== SAVE_CODE_PREFIX) return { ok: false, error: bad };
    var sum = parts[parts.length - 1];
    if (sum.length !== 8) return { ok: false, error: bad };
    for (ci = 0; ci < sum.length; ci++) {
      var hc = sum.charAt(ci);
      if ('0123456789abcdef'.indexOf(hc) < 0) return { ok: false, error: bad };
    }
    var body = parts.slice(1, parts.length - 1).join('');
    if (!body) return { ok: false, error: bad };
    for (ci = 0; ci < body.length; ci++) {
      if (SAVE_CODE_B64.indexOf(body.charAt(ci)) < 0) return { ok: false, error: bad };
    }
    if (saveCodeHash(body) !== sum) return { ok: false, error: damaged };
    var bytes = saveCodeB64d(body);
    if (!bytes) return { ok: false, error: damaged };
    var p = JSON.parse(saveCodeFromUtf8(bytes));
    if (!p || typeof p !== 'object' || p.v !== 1 || typeof p.kind !== 'string') return { ok: false, error: damaged };
    if (p.kind !== saveCodeKind()) return { ok: false, error: 'That code is for a different version of Wraith Pet — it will not load here.' };
    if (typeof p.coins !== 'number' || !isFinite(p.coins) || p.coins < 0) return { ok: false, error: bad };
    if (!p.save || typeof p.save !== 'object' || Array.isArray(p.save)) return { ok: false, error: damaged };
    if (!p.save.pets || typeof p.save.pets !== 'object' || !p.save.pets.buddy || typeof p.save.pets.buddy !== 'object') return { ok: false, error: damaged };
    var coins = Math.min(SAVE_CODE_COINS_CAP, Math.floor(p.coins));
    var clean = sanitizeSaveForCode(p.save, Date.now());
    return { ok: true, save: clean, coins: coins };
  } catch (e) { return { ok: false, error: bad }; }
}
function exportSaveCode(store) {
  store = store || defaultStore();
  var raw = storeGet(store, PET_CFG.stateKey);
  var parsed = null;
  try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }
  return encodeSave(parsed || freshPetState(Date.now()), getCoins(store));
}
/* Import: decode and sanitize first, then run the result through the same
   loadPet path a stored save uses. Nothing is written until decode says ok,
   so a bad code never partially applies. */
function applySaveCode(code, store, now) {
  store = store || defaultStore();
  var t = now || Date.now();
  var res = decodeSave(code);
  if (!res.ok) return { ok: false, error: res.error };
  var tmp = { _d: {}, getItem: function (k) { return this._d[k] === undefined ? null : this._d[k]; }, setItem: function (k, v) { this._d[k] = String(v); } };
  tmp.setItem(PET_CFG.stateKey, JSON.stringify(res.save));
  var st = loadPet(tmp, t);
  setCoins(store, res.coins);
  savePet(st, store);
  return { ok: true, active: petDef(st.active).name, coins: Math.floor(getCoins(store)) };
}
/* Moved from the shell 2026-10-30 to keep the shell deploy under the
   131,072-byte argv ceiling: battleMove + teamBattleMove are pure logic
   (state in, state out) and run identically as part-file globals. */
function teamBattleMove(tb, st, store, kind, arg) {
if (tb.over) return tb;
if (!st.team) st.team = freshTeamState();
var lines = [];
var moves = petMoves(st, tb.petId);
tb.fought[tb.petId] = true;
function foe() { return tb.foes[tb.fi]; }
function enterNextFighter() {
tb.pi++;
if (tb.pi >= tb.order.length) return false;
tb.petId = tb.order[tb.pi];
tb.stats = battleStats(st, tb.petId);
tb.playerHp = tb.stats.hp; tb.playerMax = tb.stats.hp;
tb.fought[tb.petId] = true;
lines.push(petDef(tb.petId).name + ' steps in!');
return true;
}
function enterNextFoe() {
tb.fi++;
if (tb.fi >= tb.foes.length) return false;
tb.wild = tb.foes[tb.fi]; tb.wildId = tb.wild.wildId;
lines.push('The enemy sends ' + tb.wild.name + '!');
return true;
}
function finishWin() {
tb.over = true; tb.won = true;
var fighters = Object.keys(tb.fought);
fighters.forEach(function (id) { gainBattleXP(st, id, 12); });
setCoins(store, getCoins(store) + tb.reward);
st.team.played++; st.team.wins++;
lines.push('TEAM WIN! +' + tb.reward + ' MOLECULES, +12 BATTLE XP TO ' + fighters.map(function (id) { return petDef(id).name; }).join(', ') + '!');
}
function finishLoss() {
tb.over = true; tb.won = false;
st.team.played++;
lines.push('Your team is out of fight! Back home — nothing lost, no pet harmed.');
}
function foeHit() {
var w = foe();
var pow = w.hp <= w.maxHp / 2 ? w.spPow : 7;
var nm = pow === 7 ? 'STRIKE' : w.special;
var mult = typeMult(w.type, petElement(st, tb.petId));
var dmg = calcDmg(w.atk, pow, tb.stats.def, mult);
tb.playerHp = Math.max(0, tb.playerHp - dmg);
lines.push(w.name + ' uses ' + nm + ' — ' + dmg + ' damage!');
var fainted = false;
if (tb.playerHp <= 0) {
fainted = true;
lines.push(petDef(tb.petId).name + ' is out of fight!');
if (!enterNextFighter()) finishLoss();
}
var th = gearBonus(st).thorns;
if (th && !tb.over && !fainted && w.hp > 0) {
w.hp = Math.max(0, w.hp - th);
lines.push('SPIKE CAP thorns — ' + th + ' damage!');
if (w.hp <= 0) { lines.push(w.name + ' is down!'); if (!enterNextFoe()) finishWin(); }
}
}
function playerHit(mv) {
var w = foe();
var mult = typeMult(mv.type, w.type);
var dmg = calcDmg(tb.stats.atk, mv.power, w.def, mult) + gearBonus(st).dmg;
w.hp = Math.max(0, w.hp - dmg);
lines.push(petDef(tb.petId).name + ' uses ' + mv.name + ' — ' + dmg + ' damage!' + (mult > 1 ? ' Strong!' : (mult < 1 ? ' Weak...' : '')));
if (w.hp <= 0) {
lines.push(w.name + ' is down!');
if (!enterNextFoe()) finishWin();
}
}
if (kind === 'run') {
if(isBossWild(tb.wildId)){lines.push("Can't run from a boss!");foeHit();}
else if(Math.random()<escapeChance(tb.stats.spd,foe().spd,tb.runTries)){tb.over=true;tb.fled=true;st.team.played++;lines.push('Got away! No reward, nothing lost.');}
else{tb.runTries++;lines.push('Could not run!');foeHit();}
} else if (kind === 'bag') {
if (tb.bag <= 0) { lines.push('No snacks left!'); }
else { tb.bag--; tb.playerHp = Math.min(tb.playerMax, tb.playerHp + 15); lines.push('Snack! +15 HP.'); foeHit(); }
} else {
var mv = moves[arg] || moves[0];
var first = tb.stats.spd >= foe().spd;
if (first) { playerHit(mv); if (!tb.over) foeHit(); }
else { foeHit(); if (!tb.over) playerHit(mv); }
}
tb.log = tb.log.concat(lines);
return tb;
}
function battleMove(b, st, store, kind, arg) {
if (b.over) return b;
var lines = [];
var moves = petMoves(st, b.petId);
function wildHit() {
var pow = b.wild.hp <= b.wild.maxHp / 2 ? b.wild.spPow : 7;
var nm = pow === 7 ? 'STRIKE' : b.wild.special;
var mult = typeMult(b.wild.type, petElement(st, b.petId));
var dmg = calcDmg(b.wild.atk, pow, b.stats.def, mult);
b.playerHp = Math.max(0, b.playerHp - dmg);
lines.push(b.wild.name + ' uses ' + nm + ' — ' + dmg + ' damage!');
if (b.playerHp <= 0) { b.over = true; b.won = false; lines.push(petDef(b.petId).name + ' is out of fight! Back to the map — nothing lost.'); }
var th = gearBonus(st).thorns;
if (th && !b.over && b.wild.hp > 0) {
b.wild.hp = Math.max(0, b.wild.hp - th);
lines.push('SPIKE CAP thorns — ' + th + ' damage!');
if (b.wild.hp <= 0) singleBattleWin(b, st, store, lines);
}
}
function playerHit(mv) {
var mult = typeMult(mv.type, b.wild.type);
var dmg = calcDmg(b.stats.atk, mv.power, b.wild.def, mult) + gearBonus(st).dmg;
b.wild.hp = Math.max(0, b.wild.hp - dmg);
lines.push(petDef(b.petId).name + ' uses ' + mv.name + ' — ' + dmg + ' damage!' + (mult > 1 ? ' Strong!' : (mult < 1 ? ' Weak...' : '')));
if (b.wild.hp <= 0) singleBattleWin(b, st, store, lines);
if (b.wild.hp > 0) { var cm = typeMult(petElement(st, b.petId), b.wild.type); var cd = Math.max(1, calcDmg(b.stats.atk, 3, b.wild.def, cm)); b.wild.hp = Math.max(0, b.wild.hp - cd); lines.push(petDef(b.petId).name + "'s companion strikes — " + cd + ' damage!'); if (b.wild.hp <= 0) singleBattleWin(b, st, store, lines); }
}
if (kind === 'run') {
if(isBossWild(b.wildId)){lines.push("Can't run from a boss!");wildHit();}
else if(Math.random()<escapeChance(b.stats.spd,b.wild.spd,b.runTries)){b.over=true;b.fled=true;lines.push('Got away!');}
else{b.runTries++;lines.push('Could not run!');wildHit();}
} else if (kind === 'bag') {
if (b.bag <= 0) { lines.push('No snacks left!'); }
else { b.bag--; b.playerHp = Math.min(b.playerMax, b.playerHp + 15); lines.push('Snack! +15 HP.'); wildHit(); }
} else if (kind === 'catch') {
if (petDef(b.petId).track !== 'dollar') { lines.push('Only unique characters can catch wilds!'); }
else {
var frac = b.wild.hp / b.wild.maxHp;
if (frac > 1 / 3) { lines.push('Too strong to catch — weaken it first!'); }
else {
var chance = Math.max(0.4, 0.9 - 0.6 * frac);
if (Math.random() < chance) {
b.over = true; b.won = true; b.caught = true;
if (b.wild.variant) {
if (!st.caughtVariants) st.caughtVariants = {};
var vkey = b.wildId + '_' + b.wild.variant;
st.caughtVariants[vkey] = (st.caughtVariants[vkey] || 0) + 1;
} else {
if (!st.caught) st.caught = {};
st.caught[b.wildId] = (st.caught[b.wildId] || 0) + 1;
}
var ups2 = gainBattleXP(st, b.petId, 12);
setCoins(store, getCoins(store) + 5);
lines.push('Caught ' + (b.wild.variant ? b.wild.variant.toUpperCase() + ' ' : '') + b.wild.name + '! It joins your collection. +12 battle XP, +5 molecules.' + (ups2 ? ' LEVEL UP!' : ''));
questEvent(st, b.petId, store, { type: 'defeat', n: 1, wildId: b.wildId }, Date.now()).forEach(function (m) { lines.push(m); });
depthsBonus(st, store, b.wildId, lines);
} else { lines.push('It broke free!'); wildHit(); }
}
}
} else {
var mv = moves[arg] || moves[0];
var first = b.stats.spd >= b.wild.spd;
if (first) { playerHit(mv); if (!b.over) wildHit(); }
else { wildHit(); if (!b.over) playerHit(mv); }
}
b.log = b.log.concat(lines);
return b;
}
