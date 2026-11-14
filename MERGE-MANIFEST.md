# SWPVP arcade — MERGED build (visual-fix + tavern-look) + siege infinite — 2026-11-04

Merged drop zip combining two builds, both made on base **0be2a357**
(the live redesign, dropped by Cee 2026-11-04 14:52 EST).
Base SHA-256: `0be2a35761d3c81b71227f8e190465fce8fc82f6cfcb2517a6ff1102cddebe12`
(6,953,506 B, 36 files, index SHA-1 `9808259f`).
Plus the siege-shells change below, made on top of the merge
(Cee 2026-11-04 16:25 EST: "remove this from siege" / "or make it
infinite like std" — went with infinite).

## Sources merged

### 1. Visual-fix build — drop-package-ion-visualfix.zip
- SHA-256: `b7f0e0ce06c289266e7919b9c6c27551afc46ca8b1ef862d34981339e5259571`
  (7,937,280 B, 37 files + 1 api/ dir entry, index SHA-1 `edb897b8`).
- Taken into this merge: `index.html` (`edb897b8`),
  `wraith-survival.html` (`c05c92c5`), `wraith-dungeon.html` (`daec22a0`),
  `sw.js` (`5f4515a7`, CACHE=`ion-arcade-v2-edb897b8`),
  `class-21-poster.jpg` (`300a7af9`, 992,810 B, NEW file).
- What it fixed (vs base 0be2a357):
  - **Bug 1 — Vanix Fight struggle has no controls + overlapping text.**
    During a STRUGGLE/grapple the D-pad and PUNCH/KICK/BLOCK buttons were
    not visible at all (Cee's screenshot image-191.png: "no controls" /
    "pad?"), and "TAP PUNCH — STRUGGLE!" overlapped "TAP PUNCH!" in the
    centre. Fixed: controls are visible during the struggle; the two
    texts no longer overlap. Static/logic-verified only — NOT
    browser-verified (headless Chrome dead VM-wide since ~20:25 EST);
    Cee's phone is the ground truth.
  - **Bug 4 — Brawl auto-picks Kavio.** Brawl ignored the player's
    character picks and forced Kavio in. Fixed: the fighters that enter
    the match are the ones the player selected; picking Kavio
    deliberately still works. Static/logic-verified only — NOT
    browser-verified; Cee's phone is the ground truth.
  - **Bug 2 — Brawl / Stand 3v3 screen too small.** Controls worked,
    the screen rendered too small. Fixed: Brawl/Stand canvas/frame
    enlarged. Browser-verified in the visual-fix build (headless
    Chrome, single-process).
  - **Bug 3 — Delve positioning.** The dungeon view sat in the
    top-left corner with most of the screen black, and all controls
    were piled on the left. Fixed: dungeon view centred and fills the
    frame; controls split D-pad left / action buttons right.
    Browser-verified in the visual-fix build (single-process Chrome).
  - **Bug 5 — one uniform 15-game grid + 21-character hero poster.**
    WRAITH PET and TOWN / KART were wide cards while the other 10 were
    small; the "MORE IN THE ARCADE" row was separate. Fixed: all 15
    games (12 main + Dino Run, Wraith Wings, Wraith Serpent) in ONE
    grid, all the same size, no separate MORE row. The hero/headline
    picture is now the 21-character design (`class-21-poster.jpg`,
    the all-characters chibi poster); the background (`wraith-bg.jpg`)
    is unchanged. Static-verified only (grid 28/28 + hero checks) —
    NOT browser-verified; Cee's phone is the ground truth.
  - Its `tavern.html` is byte-identical to the base — it does NOT
    include the Tavern look-match (that comes from the tavern-look
    build below).

### 2. Tavern-look build — drop-package-ion-tavernlook.zip
- SHA-256: `6a44a6e05714d0bb4512ee103cdad9319c0a970d5951e6f1e2855ea566173f4f`
  (6,954,356 B, 36 files, index SHA-1 `9808259f` — byte-identical to base).
- Taken into this merge: `tavern.html` (`62f544e7`, 114,785 B).
- What it fixed (vs base 0be2a357): 13 look mismatches so the Tavern
  matches the arcade home — fonts (Google Fonts link removed, system
  stack like home), gold removed (red `#ff4040` / violet `#a86bff`
  only), background now `wraith-bg.jpg` like home, hero/badge/nav/cards/
  section-heads/buttons/wallet/text-colours/inputs/avatar/lobby/chat
  all re-tokened to the home's values. No functionality, price, or
  balance change. Browser-verified 31/31 in its own build (headless
  Chrome, mobile 390×844 + desktop 1280×900, 0 errors/0 exceptions);
  re-verified statically in this merged zip (see Verification below).
  Its `index.html`, `wraith-survival.html`, `wraith-dungeon.html` and
  `sw.js` are byte-identical to the base.

### 3. Siege shells infinite — on top of the merge (wraith-defense.html)
- Cee 2026-11-04 16:25 EST (screenshot image-194.png): the siege
  cannon's 5 special shells (SPLIT / RAIN / DRILL / PIERCE / QUAKE)
  were limited to ×2 per wave while STD was unlimited (∞). He said
  "remove this from siege" / "or make it infinite like std" — went
  with **infinite like STD**: all 6 shells now show ∞ and never run
  out. No per-wave counts, no "OUT OF …S!" block, no 'out' state.
- Changed in `wraith-defense.html` (`20df7611` → `c95b7c0c`):
  shell buttons ×2 → ∞; `sgFire` no longer checks or decrements a
  count; `refreshBar` shows ∞ for every shell and never marks one
  'out'; `pickShell` no longer blocks an empty shell; help text now
  reads "ALL SHELLS UNLIMITED". Shell damage, blast radius, wind,
  and the cannon itself are unchanged. `sgWp` init/reset is now dead
  state (written, never read) — left in place, harmless.
- Static-verified only (node --check 3/3, 0 ×2 left, 0 "OUT OF" left)
  — NOT browser-verified (headless Chrome dead VM-wide); Cee's phone
  is the ground truth.

## NOT included — the bot zip (DO NOT DROP)
- `swpvp-responsive-controls-fixed.zip`
  (SHA-256 `d1b5e1a7a05e7389909e3cbf8c8439aa538c49b20d9224a7ad0a33f72d0a5b24`)
  was audited and given the verdict **DO NOT DROP as-is**. Verified
  regressions: landscape Fight controls unreachable on the rotate path
  (frame 337px, hub not scrollable, iframe touch-drag does not scroll);
  D-pad cross shrunk 132→121.44px; Dungeon BREAKS (deliberate 36px
  D-pad dirs enlarged to 42px); Defense `#ctl` 56→~43px; Pet buttons
  48→40px; Kart `#ctl` shrunk. Only its `index.html` load-remeasure
  was judged safe, and it was too small to risk hand-editing the
  merged index for — it was SKIPPED. The bot zip fixes nothing Cee
  reported.

## Files vs base 0be2a357 (diff summary)
- **Differ (7):** `index.html` (9808259f → edb897b8),
  `wraith-survival.html` (b791211b → c05c92c5),
  `wraith-dungeon.html` (128ae157 → daec22a0),
  `tavern.html` (d00e96e9 → 62f544e7),
  `wraith-defense.html` (20df7611 → c95b7c0c, siege shells infinite),
  `sw.js` (40fbb9ac → 5f4515a7, stamp only,
  CACHE=`ion-arcade-v2-edb897b8` — matches the merged index SHA-1;
  the index did not change for the siege patch, so no re-stamp was
  needed — defense is lazy-loaded, not precached),
  `MERGE-MANIFEST.md` (this file).
- **Added (1):** `class-21-poster.jpg` (300a7af9, 992,810 B).
- **Identical:** everything else (all other game files, all api/ files,
  icons, manifest.json, wraith-bg.jpg, vs-ui.js, wraith-pet-data.js,
  movies.html, vault.html).
- Total: 37 files + 1 api/ dir entry. `unzip -t` clean.

## Verification (merge build)
- Source SHAs verified before merging (base 0be2a357…, visual-fix
  b7f0e0ce…, tavern-look 6a44a6e0…). Merged file SHAs confirmed:
  index `edb897b8`, tavern `62f544e7`, survival `c05c92c5`,
  dungeon `daec22a0`, sw.js `5f4515a7` (CACHE `ion-arcade-v2-edb897b8`),
  poster `300a7af9`.
- `node --check` on every edited script block: OK.
- Static re-verification on the MERGED files: Tavern-look test 31/31,
  Bug 5 grid verify 28/28, recent-work marker check 28/28.
- Browser: headless Chrome is DEAD VM-wide (SIGTRAP / exit 133, since
  ~2026-11-04 20:25 EST). A single-process attempt was made; if it did
  not come up, Bug 1 / Bug 4 / Bug 5 remain NOT browser-verified and
  Cee's phone is the ground truth. Bug 2 / Bug 3 were browser-verified
  in the visual-fix build (single-process Chrome); the Tavern-look was
  browser-verified 31/31 in its own build.
- Siege infinite: `wraith-defense.html` node --check 3/3 script blocks
  parse OK; 0 ×2 and 0 "OUT OF" strings remain; all 6 shell buttons
  show ∞. NOT browser-verified; Cee's phone is the ground truth.

## What still needs Cee's phone
- Bug 1: struggle controls visible + tappable, "TAP PUNCH" texts no
  longer overlapping.
- Bug 4: pick two non-Kavio fighters in Brawl — those exact fighters
  enter the match (not Kavio); picking Kavio deliberately still works.
- Bug 2: Brawl / Stand 3v3 renders at a proper, playable size.
- Bug 3: Delve dungeon view centred and filling the frame; controls
  split D-pad left / buttons right.
- Bug 5: all 15 game cards in one grid, all the same size; hero shows
  the 21-character poster; background unchanged.
- Tavern look on his real phone (same photo background, red/violet
  pills and cards, no gold) + Tavern still works (!bal, !daily,
  wares, avatar picker, Buy Atoms).
- Siege: all 6 shells (STD + SPLIT / RAIN / DRILL / PIERCE / QUAKE)
  show ∞ and never run out; fire a special several times in one wave
  and confirm it never says "OUT OF".
- Installed-app pickup (sw.js stamp changed to `ion-arcade-v2-edb897b8`,
  so the app should pick up the new build after one close + reopen).

## Still to come after this
- Checklist build (smoke tests, tutorial overlay, pause/restart/mute/
  fullscreen, high scores, analytics, controls) — needs a NEW
  coordinator (ad61837f is gone).
- Classic Fight new skillsets — VANIX designs them, Cee approves
  before building.
- Four new games — Tavern management first, then Rhythm, then
  Pinball, then Boss Rush (Breakout is OUT).
- Brawl feel — mix of Overwatch + Paladins (Cee picked 2026-11-04
  13:40 EST), needs designing (roles, ultimates, objective, hero
  select) and Cee's approval — Maeve was his favourite Paladins
  champion, a fast dagger assassin.
- Bounce — its game file does not exist, so it is NOT in the arcade
  (15 cards in the grid, 12 games in the hero shuffle — Bounce is not
  among them). If Cee wants Bounce playable, its game file must be
  recovered or built as a separate task.
- Hashbone life swap finisher — parked. Per-fighter finishers — need
  designing. Kestrel × Blackfeather and Kavio × Silvernail + Bane
  mixes — designed, not built. Lestes Seven Sword mecha style —
  separate follow-up. Authenticated leaderboards, daily challenges,
  achievements, BLOODNET boss events — Later.

## Deploy
- Drop the extracted FOLDER onto the **swpvp-arcadio** Vercel project
  only — never the zip, never vercel.com/drop, never the duplicate
  arcade-1 / arcade-2 projects, never swpvp-dsu8 (the main site).
- The live site still runs 0be2a357 until Cee drops this merged folder.

## Playability build — on top of the siege build (2026-11-04, Cee: "i want to be able to play the games now without having to worry about the bugs")
Built on the siege build above (drop-package-ion.zip, SHA-256 276e922b...). Cee drops THIS zip (drop-package-ion-playability.zip) once — not the siege zip — so he only drops once. No Vercel deploy; Cee drops the extracted folder onto swpvp-arcadio himself. Only 4 files differ vs the siege build: wraith-survival.html, index.html, sw.js (re-stamped, see below), this manifest. Every other file is byte-identical. sw.js IS re-stamped here (CACHE `ion-arcade-v2-edb897b8` → `ion-arcade-v2-13a276b4`, the new index SHA-1) because index.html changed and '/' is precached — the installed app only picks up a new build when sw.js changes, so the stamp is what makes the topbar PAUSE/EXIT reach the installed app.

### FIX 1 — Vanix Fight WASD stuck keys ("keeps going after I let go", Cee 2026-11-04 17:09 EST, main browser/PC, main site embed)
The fighter kept moving after releasing a WASD key. Wiring was correct (A/D→keys.l/r, W→keys.j, S→keys.dn; update reads them; keyup clears unconditionally). Cause: the game frame loses focus while a key is held, so the keyup is missed and the key stays true. Fix (wraith-survival.html only): `clearAllKeys()` sweeps the shared `keys` object to false, wired to `window blur` + `document visibilitychange` (when hidden). Covers Fight (l/r/j/dn/blk), Stand (u/d) and Brawl (e.code keys) — one shared object. No binding, speed or jump change. Logic-verified: the exact function from the file, run against a stuck-keys object (all Fight/Stand/Brawl keys true), leaves NONE true. node --check 8/8.

### FIX 2 — PAUSE + EXIT onto the MODES nav (top bar) (Cee 2026-11-04 17:09 EST, screenshot image-201.png)
The Fight view is cut off at the bottom in the main-site embed, so the fight-foot PAUSE/EXIT were unreachable. Also note: the in-HUD ❚❚ PAUSE is `display:none` on desktop by design (only the ✕ EXIT shows) — only the landscape-touch media query shows it — so on PC the only reachable PAUSE was the cut-off foot row. Fix: PAUSE + EXIT buttons added to the hub topbar in index.html (`#topPause`, `#topExit`, class `topGameBtn`), shown only for Vanix Fight (mode 'fight', toggled in playMode, hidden again in backToMenu). They call the fight's own handlers in the game frame via contentWindow (same-origin, same pattern playMode uses for go/showTop): PAUSE → `doPause()` (P-key behaviour unchanged, no-op unless a fight is running); EXIT → `goFightModeSelect()` (back to the fight select, exactly like the in-game ✕ EXIT). The in-game foot/HUD buttons and the P key are untouched. Stage, D-pad and action buttons untouched. node --check 4/4.

### FIX 3 — Facing cues for front-facing fighters (Cee 2026-11-04 17:12 EST, "some of the characters like sigilos only faces one way", screenshot image-202.png)
Classic Fight flips sprites with ctx.scale(f.dir*sc,sc), which works for asymmetric art — but front-facing/symmetric art flips invisibly. The 2026-11-03 fix added a cue for Lyko (green core glint), Machaira (dagger glint), Kid (flame glint), Lestes (belt sphere + scarf); Sigilos got none. Fix (wraith-survival.html, drawF sprite path only): audited all 21 sprite images by eye (contact sheets) + silhouette/pixel symmetry metrics. Added a small glowing dot on the facing side (+x, tracks direction through the flip), in each fighter's special colour, to the 9 whose art is front-on/symmetric: SIGILOS (violet), CHRYSOKERAS (gold), EREBAR (green), AETHERIS (green), GRINNOIR (white), ASTONYX (purple), HARPAX (blue), BALLOON GUY (orange), SYMBIOS (violet). Left alone (flip already reads): NYXAR (staff), HASHBONE (profile + scythe), NIGHTWRAITH1 (sword), GRIM (book/orb swap), KAVIO (revolver), WRIGHTSMITH (axe), HIPPOTHANATOS (profile), PHARMAKON (staff), ICARON (staff/blade swap). Vector fighters (GOLD DEMON, THRONE KEEPER, WHITE MASK, TATTERED, GRAVE WARDEN, RUNE WRAITH, GRIM boss, KILL MODE, LESTES) are asymmetric by construction. No art redrawn, flip code untouched. node --check 8/8.

### FIX 4 — Crouch animation (Cee 2026-11-04 17:12 EST, "some has no crouch animation")
ALREADY PRESENT — no code change. The Classic Fight draw (`drawF`, wraith-survival.html:257) already squashes every fighter when crouched: `if(f.cr)ctx.scale(1,.55)` — applied to sprite and vector art alike, driven by the same cr state the gameplay uses (update() sets p.cr/me.cr from S/Down, gated on not-airborne/not-attacking; the game loop runs update before draw). Present in the base build (0be2a357) as well as this one. The "no visual change" read missed it — it sits on a very long minified line. If the crouch still doesn't read on Cee's screen, that is a visibility/tuning question, not a missing implementation; do not add a second squash (it would double-squash to 0.38 and flatten the fighter).

## Deploy (playability build)
- Drop the extracted FOLDER from **drop-package-ion-playability.zip** onto the **swpvp-arcadio** Vercel project only — never the zip, never vercel.com/drop, never arcade-1 / arcade-2, never swpvp-dsu8. Drop THIS zip, not the siege zip.
- The live site still runs 0be2a357 until Cee drops this folder.

## Defense→Stand merge + hub redesign + previews + labels — on top of the Delve-sandbox final (2026-11-04, coordinator f71a3d83)
Built on the Delve-sandbox final (drop-package-ion.zip, SHA-256 f41b420e…). Cee drops THIS refreshed zip once — not the sandbox zip. No Vercel deploy; Cee drops the extracted folder onto swpvp-arcadio himself. One final file, no back-and-forth.

### MERGE — Defense into Stand (WAVES), swipeable mode scroll (Cee 2026-11-04 19:14 + 19:15 EST)
Stand and Defense are the same gameplay (wave survival), different vibes (arena fighter vs tower defense), so Stand contains Defense. No nested ARENA/DEFENSE picker — the Vanix Fight mode select is now a swipeable horizontal scroll of 6 mode cards (`.vf-modes`, overflow-x:auto, scroll-snap-type:x mandatory, -webkit-overflow-scrolling:touch): 1V1→start1v1() (tagMode=false, startMatch), 2V2→start2v2() (refuses with the TAG TEAM UNLOCKS message unless tag unlocked, else tagMode=true, startMatch), 3V3→startBrawl3(), SHOWDOWN→startShowdown(), WAVES→startWaves() (Arena, unchanged), DEFENSE→goDefense() (routes via parent.playMode('defense') → wraith-defense.html, or direct nav). "DEFENSE NEEDS NO FIGHTER" noted on the select. `#topModeSel` now has one button (goFight) and the subtitle "ONE GAME — SIX WAYS TO FIGHT"; `#fModeSel` title lists all six. toggleMode() remains as dead code (0 callers, harmless). The `_modes` deep-link map keeps defense:goDefense. wraith-defense.html is byte-identical (SHA-1 c83826ab); all 6 shells still ∞; no Defense stats/shells/balance changed. The Defense hub card + slide were removed (13→12 games, 10→9 slides) — then subsumed by the hub redesign below (ALL cards removed).

### REDESIGN — hub: no card grid, carousel is the picker, Tavern inside the Arcade (Cee 2026-11-04 19:19 EST)
- THE FULL FLOOR grid is gone (12 cards, filter, "12 GAMES" label all removed). Players pick by swiping the hero carousel and hitting PLAY NOW / the alt button — PLAY NOW now calls playMode(id) and LAUNCHES (it used to scroll to a card and flash it; that path is gone).
- Touch swipe on the carousel: horizontal drag >50px moves a slide; taps still fire the buttons; a `_swiped` guard stops a drag's trailing tap from launching a game by accident. Dots/prev/next/pause/auto-rotate (2.6s) unchanged; dots and the count are built from the slide list, so they follow automatically.
- Tabs removed (no ARCADE / TAVERN tabs). Tavern is a 10th hero slide (data-hero="tavern", CARDMAP "tavern" → tavern.html page, MODE_TITLES "THE TAVERN"); PLAY NOW / PULL UP A CHAIR opens tavern.html. tavern.html itself is byte-identical — chat, Keeper, wares, coin purse, SAV BOT, wallet all untouched; only how you reach it changed. Hero count is now 1/10; the line under the hero reads "SWIPE TO PICK · FREE TO PLAY". Wallet + stats rail kept as-is. Bottom note reworded ("Swipe the hero above to pick a game"). Delve/Pet/Town are NOT removed — they are carousel slides like every other game. No renames (Town stays Town).

### PREVIEWS — each hero slide shows its own game (Cee 2026-11-04 19:20 + 19:21 EST)
- MAIN-SITE GRID CHECK (UPDATE 4): the main site's "game grid" (oneblood-socialdark.html PICK A GAME) has NO per-game images — it is 4 text buttons (STAR INVADER / TETRIS / SLIMEBALL / SAV) with coloured borders, and the main-site folder holds no per-game image files. So per the brief's own fallback rule, ALL previews come from the games' in-game visuals. Nothing was copied from the main site, because there was nothing to copy.
- Real art (3 slides): VANIX FIGHT keeps class-21-poster.jpg (the 21-fighter roster poster, already in the pkg). DELVE uses preview-delve.jpg (new, 32,906 B) — the Wrightsmith sprite from wraith-dungeon.html's SPRITES map (a Delve hero), composited on a dark red/violet gradient. SAV uses preview-sav.jpg (new, 26,681 B) — the Balloon Guy sprite from sav.html's SAVSPR map (a SAV rider), same treatment. TAVERN uses wraith-bg.jpg (its real background, already in the pkg).
- Glyph fallback (6 slides): Tetris, Star Invader, Slimeball, Wraith Cards, Wraith Pet, Town/Kart are canvas-drawn with ZERO image assets anywhere in their files (0 data:image embeds; no sprite files), so each shows its title/icon glyph big on its own red/violet gradient — the fallback the brief allows. No AI images generated; no phone screenshots used.
- Both new previews are precached by sw.js (SHELL) alongside class-21-poster.jpg and wraith-bg.jpg, so they work offline too. sw.js re-stamped (CACHE `ion-arcade-v2-4d789995`, the new index SHA-1 first 8) so the installed app picks the build up.

### LABELS — "BACK TO THE ARCADE" → "BACK TO ARCADE" (Cee 2026-11-04 19:22 EST)
Text only, in 5 arcade game files: dino-run.html:185, sav.html:336, slimeball.html:418, star-invader.html:170, tetris.html:22. Each link still reads `← BACK TO ARCADE`, href index.html, onclick goHub(). Zero "BACK TO THE ARCADE" (with THE) remain anywhere in the pkg. movies.html/vault.html already said it — untouched. The main-site "OPEN IN ARCADE" button and the "BACK TO ARCADE" link on the Was Listening card are a SEPARATE dsu8 job (not in this zip).

### Verification (this build)
- Logic test 64/64 (`/tmp/test_merge_redesign.js`): 6 mode cards + tag lock + scroll styles + topModeSel + deep-link route; defense file byte-identical + shells ∞; hub 0 cards/tabs, 10 slides incl. Tavern, PLAY NOW launches, swipe 50px + guard, wallet rail kept; previews exist + valid JPEG + wired in CSS; labels 0× "THE" + 5 renamed links intact.
- node --check: 34/34 inline script blocks pass (index 4, survival 8, defense 3, dino 3, sav 4, slimeball 4, invader 4, tetris 4). sw.js node --check OK.
- NOT browser-verified (headless Chrome dead VM-wide); Cee's phone is the ground truth.
- Deliberately NOT changed: wraith-dungeon.html (Delve sandbox, byte-identical 12b37889); the dungeon's duplicate Stand/Brawl via Town FIGHT RING (known gap, separate follow-up); Wraith World cards/games (Delve/Pet/Town stay, now as slides); Defense shells/damage/balance; the 7 heroes' stats; Gunslinger=Kavio; tavern.html (byte-identical 62f544e7); the main site (dsu8 — separate job).

### Files vs the Delve-sandbox final (SHA-256 f41b420e…)
- **Differ (9):** index.html (fabdbcb7 → 4d789995), wraith-survival.html (5507e4ff → bdd04175), sav.html (fdc4cffa → b4ba88c3, label only), star-invader.html (e251bea6 → b9d7108d, label only), slimeball.html (2a20950c → 77613abc, label only), tetris.html (c6427050 → 9d9fd4a3, label only), dino-run.html (4900186f → 66c72eef, label only), sw.js (62a74e9e → acda3376, re-stamp + SHELL), MERGE-MANIFEST.md (faeda1dc → this file).
- **Added (2):** preview-delve.jpg (32,906 B), preview-sav.jpg (26,681 B).
- **Identical:** everything else (incl. wraith-dungeon.html 12b37889, wraith-defense.html c83826ab, tavern.html 62f544e7, all api/ files, icons, wraith-bg.jpg, class-21-poster.jpg).
- Total: 40 files. `unzip -t` clean (verified on rebuild).

### WRAITH SLICE added 2026-11-12 (Cee: "Fruit Ninja-like games first")
- NEW file `wraith-slice.html` (single-file fruit-slicing game, Breaker + pinball checklist-kit pattern).
- `index.html`: one hub card (WRAITH SLICE, 🍉), CARDMAP + MODE_TITLES + ORIENT (portrait) + HUB_GAMES (plain `wraith_slice_best`, plays `sw_plays_wraith-slice`) + WT_SLUGS entries; floor count 9 → 10 GAMES. Hero carousel untouched (still 9 slides, 1/9).
- Gameplay: swipe to slice, 3+ in one swipe = COMBO +20, golden fruit +50, bombs cost 1 of 3 lives, missed fruit costs nothing. Free to play; molecules only (`wraith_coins`: +1/slice, +5 golden, +2 combo). Best in localStorage `wraith_slice_best`. No atoms/ions, no blade-skin shop. Plain wraith blade — no fighter's blade assigned (Cee hasn't picked).
- Verification: DOM-faithful harness `~/workspace/goals/finish-the-games-checklist/hidden_files/harness-slice.js` 4/4 PASS (logic, UI, 2× missing-id no-throw); node --check 2/2 slice blocks, 10/10 index blocks. NOT deployed — Cee drops folders himself; Cee's phone is the ground truth.

## ARCADIO RECONCILIATION — games-only (2026-11-12, file-only, NOT deployed)

Live arcadio index was 110,100 B (SHA-1 cf0e235e…); the pkg index was only
98,879 B — the pkg was BEHIND live. Reconciled the pkg to live + Wraith
Slice, games-only (productivity OUT). Cee drops the folder himself.

### Method
- Diffed every pkg file against its live twin in
  ~/workspace/goals/current-sites-backup-before-changes/files/2026-11-12/live-arcadio/.
  Live was a strict superset for most files: the same identical 65-line
  block appended to 9 game files (arc-quality graphics widget Low/Medium/
  High/Ultra + `<script src="/swpvp-skins.js" defer>`) plus per-file fixes.
- Hub index: started from the LIVE index, then (a) title restored to the
  pkg's "SWPVP ARCADE — ONE GAME", (b) Focus Lab card removed, (c) Wraith
  Slice card + all 6 slice wirings restored (CARDMAP, MODE_TITLES, ORIENT,
  HUB_GAMES, WT_SLUGS, floor card), (d) floor count kept at 10 GAMES,
  (e) Tavern card dropped — live moved the Tavern to ARCADE/TAVERN hub
  tabs (showHubTab), so a card would duplicate it and its "scroll down"
  text would be wrong under tabs.

### Per-file outcome (LIVE won unless noted)
- TOOK LIVE WHOLESALE (byte-identical to live backup): dino-run, guide,
  movies, sav, slimeball, star-invader, tavern, tetris, vault,
  wraith-cards, wraith-defense, wraith-dungeon, wraith-flap, wraith-pet,
  wraith-pinball, wraith-serpent, wraith-survival. Why: live-only additions
  were real fixes — quality widget + skins include (9 games); SAV UI refresh
  + char-select sessionStorage fallback + jump retune (-10.5/-13 → -6.5);
  pinball DPR-aware canvas resize; dungeon pointer-capture bindHold +
  52px town pads + progression hooks; pet new drawWraithPet vector renderer
  + progression hooks; tavern quality widget + skins (live dropped 2
  "ATOMS — YOU ARE HERE" marker links — cosmetic, not functionality).
  Pkg-only lines in these files were older versions of the same code
  (verified: same identifiers/functions present in live), except dungeon's
  simpler bindHold, which live's pointer-capture version supersedes.
- index.html: MERGED (live base + slice + title + guards, see above).
  New SHA-1 006e9589… (110,4xx B).
- sw.js: live base MINUS '/productivity.html' from SHELL (a missing precache
  entry would fail the whole install via caches.addAll). SHELL now precaches
  skin-vault.html, swpvp-skins.js, arcadio-mode-progression.js. Re-stamped
  CACHE='ion-arcade-v2-006e9589' (first 8 of new index SHA-1). No __BUILD__.
- skin-vault.html (7caab6c2…) + swpvp-skins.js (21cd689d…): ADDED from live.
- arcadio-mode-progression.js (d0afdcd5…, 2,630 B): ADDED — live file the
  2026-11-12 backup missed. Referenced by live sw.js SHELL, live dungeon
  and live pet; fetched read-only from the live site (GET 200). Local-only
  XP tracker (arcadio_mode_progress_v1), no wallet/balance writes; all
  arcadioProgressAward calls are typeof-guarded. Without it, dropping this
  pkg would have DELETED a live file.
- wraith-pet-data.js: took live's richer pet descs, SAME economy
  (buddy 0, goldraven 800, dog 150, cat 300, bunny 600, ember $1, frost $2,
  shadow $3, morph $4, apex $5) — BUT fixed one live bug: live's goldraven
  desc contains an unescaped `knight's` apostrophe inside a single-quoted
  string = SyntaxError, so the live file fails to parse and PET_DEFS would
  be undefined (Wraith Pet broken — pet.html loads it via
  `<script src="wraith-pet-data.js">`). Fixed with `knight\'s` (renders
  identically). New SHA-1 d5ca7b62… (was live 48d5a3f3…).
- wraith-slice.html: UNCHANGED, SHA-1 152a19a7… (20,620 B). Hub card kept.
- api/ (12 files), images, icons, manifest, vs-ui.js, wraith-bg.jpg:
  UNCHANGED (pkg copies; live backup had no api/ dir).
- NOT copied: productivity.html (stays in the backup + ion package).
  No productivity/Focus Lab/Brain Gym reference remains anywhere in the
  served pkg (grep clean, including .bak files).

### Defensive fix found by the harness (index.html only)
The live index attached 4 load-time listeners with NO null guard
(modesBtn, topPause, topExit, menu) — if any of those ids were ever absent,
the whole main script would die on load (the 2026-10-28 game-full failure
mode). Guarded all four the same way the adjacent tab listeners already
are (`var _x=getElementById(...);if(_x)_x.addEventListener(...)`).
Zero behavior change when the elements exist (they do).

### Verification (2026-11-12, file-only — NOTHING deployed, NOT live)
- node --check: 121/121 inline script blocks + standalone JS pass
  (after the pet-data fix; live's pet-data failed before it).
- DOM-faithful hub harness (new, saved alongside the pkg):
  ~/workspace/goals/savage-wraith-website/hidden_files/ion-home/merge-work/harness-hub-index.js
  9/9 PASS — load all blocks, slice wiring (CARDMAP/MODE_TITLES/ORIENT/
  HUB_GAMES/WT_SLUGS), cards present + no productivity, showHubTab toggle,
  playMode('slice') loads wraith-slice.html + titles it, playMode tetris +
  unknown-mode no-throw, missing-id load no-throw for tabArcade/gameFrame/
  topPause. getElementById returns null for absent ids (no proxy stubs).
- Wraith Slice harness re-run: 4/4 PASS.
- Final pkg: 34 served files + api/ (12 files); all 14 games + Tavern +
  guide + Skin Vault present; Tavern gambling (!slots 5, !dice 6, !scratch 5
  — same counts as live); hidden ion double-taps intact (dblclick ×2,
  ION_URL https://swpvp-ion-dsu8.vercel.app); revive prices 3 ions /
  15 atoms / 10 molecules in every game file (counts identical live vs pkg);
  $1=100 atoms strings intact; no ads strings anywhere (arcadio ad-free);
  sw.js SHELL entries all exist in the pkg.

### Still needs Cee's phone (ground truth)
- Hub: tabs ARCADE/TAVERN switch, Slice card launches, Skin Vault opens,
  guide opens, installed app picks up the build after one close+reopen
  (sw.js re-stamped).
- Games: quality widget (Low/Medium/High/Ultra) on each game, SAV new UI +
  jump feel, pinball crispness on his screen, dungeon hold-controls,
  pet new vector art, Tavern gambling + wallet.
- The live pet-data SyntaxError: if live Wraith Pet is currently broken on
  his phone, this pkg fixes it — confirm after the drop.

## 2026-11-12 13:54 EST — HOLD: Focus Lab restored to arcadio (pending Cee's confirmation)
- Parent paused the arcadio-removal step: Cee asked to confirm only ion gets the new look and arcadio gets no changes.
- Restored the live BRAIN GYM + FOCUS card into index.html (byte-identical live markup, placed before the Skin Vault link), copied productivity.html back from the live backup (SHA-1 eb200102…), and re-added '/productivity.html' to sw.js SHELL in the live position.
- index.html is now SHA-1 1d5b0e8080add9c362fab813655490fb2be4968a; sw.js re-stamped CACHE='ion-arcade-v2-1d5b0e80'. Slice (152a19a7…) and Skin Vault (7caab6c2… / 21cd689d…) untouched and re-verified. node --check clean on index (10 blocks), sw.js, productivity.html (1 block); SHELL 15 entries, 0 missing.
- The removal is NOT done — it waits on Cee's confirmation. If he confirms, remove the card + file + SHELL entry and re-stamp again.
