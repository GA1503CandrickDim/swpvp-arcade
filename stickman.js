/* ============================================================================
   STICKMAN.JS — shared stickman animation library (2026-11-13)
   A tiny standalone canvas library: fluid stick-figure fight flourishes in
   the Xiao Xiao / stick-figure martial-arts style. No dependencies, no
   images, no game globals — just vector lines on whatever ctx you hand it,
   so any game can load it and call it. Fast on phone (a dozen strokes).

   HOW TO LOAD
     <script src="stickman.js"></script>   (before your game script)
     Guard every call:  if(window.Stickman){ ... }   so a missing file can
     never break your game.

   API
     Stickman.draw(ctx, o)    — draw one stickman figure.
       o = {
         x, y      : position, FEET at (x, y) in the caller's current units
         size      : figure height in the caller's current units (default 34)
         color     : figure color, e.g. the attacker's color (default '#fff')
         pose      : 'idle' | 'punch' | 'kick' | 'shoot' | 'special'
                     | 'hit' | 'win'                              (default 'idle')
         progress  : 0..1 through the move. For punch/kick/shoot/special the
                     library runs its own wind-up -> strike -> recover curve:
                     0..0.3 wind-up (limb pulls back), 0.3..0.6 strike (limb
                     snaps out), 0.6..1 recover (limb returns). For 'idle'
                     and 'win' progress is a loop phase (0..1 = one cycle).
                     For 'hit' progress 0 = just hit (max recoil) -> 1 =
                     recovered.
         dir       : 1 = face +x, -1 = face -x                    (default 1)
         rot       : extra rotation in radians, e.g. to aim the figure
                     down a top-down attack angle                 (default 0)
         alpha     : overall opacity 0..1                        (default 1)
         lineWidth : stroke width in canonical units             (default 2.2)
       }
       The figure is drawn facing +x (flipped by dir), ~34 canonical units
       tall, feet at y. It is stroked twice (dark outline, then color with
       a soft glow) so it reads on top of any sprite.
     Stickman.burst(ctx, o)   — hit-impact star + expanding ring.
       o = { x, y, r, color, progress, alpha }
       progress 0 = just hit (small, bright) -> 1 = gone (big, faded).
     Stickman.lines(ctx, o)   — motion lines trailing a moving point.
       o = { x, y, angle, len, color, n, progress, alpha }
       angle = direction of travel in radians; lines trail behind it.
   Reuse notes: Delve's Lestes, Dino Run's dino, Wraith Pet, Defense and SAV
   can all call Stickman.draw with their own color/size/pose — no changes
   needed here. Keep this file the single source of truth for stickmen.
   ============================================================================ */
(function (g) {
  'use strict';
  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Extension curve for an attack: progress 0..1 -> e.
     e = -0.35 (pulled back in wind-up) -> 1 (full extension at the strike)
     -> 0 (back to rest in recovery). Limbs ease instead of snapping. */
  function ext(p) {
    if (p < 0.3) return -0.35 * (p / 0.3);
    if (p < 0.6) return -0.35 + 1.35 * ((p - 0.3) / 0.3);
    var r = (p - 0.6) / 0.4; if (r > 1) r = 1; return 1 - r;
  }

  /* One 2-segment limb: (x1,y1) -> (x2,y2) -> (x3,y3). */
  function limb(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
  }
  /* One straight segment. */
  function seg(ctx, x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  /* Head circle (stroked, not filled — classic stickman). */
  function head(ctx, x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }
  /* Little impact star at (x,y): 4 short spokes. */
  function star(ctx, x, y, r) {
    for (var k = 0; k < 4; k++) {
      var a = k * Math.PI / 4 + Math.PI / 8;
      seg(ctx, x - Math.cos(a) * r, y - Math.sin(a) * r, x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
  }

  /* All the strokes for one pose, in canonical coords (34 tall, feet at
     y=0, facing +x). e = extension from ext(), p = raw progress 0..1. */
  function posePaths(ctx, pose, e, p) {
    var hx, hy, nx, ny, hipx = 0, hipy = -13;
    if (pose === 'punch') {
      hx = 1 + e * 2; hy = -29; nx = 0.5 + e * 2; ny = -25.5; hipx = e * 1.5;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso */
      limb(ctx, 1, -24, 4 + e * 6, -24, 6 + e * 14, -23);             /* front arm snaps out */
      limb(ctx, 0, -24, -4, -20, -7, -17);                            /* rear arm pulled back */
      limb(ctx, hipx, hipy, 5, -7, 8, 0);                             /* front leg (lunge) */
      limb(ctx, hipx, hipy, -4, -7, -8, 0);                            /* back leg */
      if (e > 0.1) {                                                   /* motion lines behind fist */
        var fx = 6 + e * 14, fy = -23;
        seg(ctx, fx - 4 - e * 6, fy - 3, fx - 1 - e * 4, fy - 3);
        seg(ctx, fx - 4 - e * 6, fy, fx - 1 - e * 4, fy);
        seg(ctx, fx - 4 - e * 6, fy + 3, fx - 1 - e * 4, fy + 3);
      }
      if (e > 0.85) star(ctx, 6 + e * 14 + 2, -23, 3.5);               /* impact frame */
    } else if (pose === 'kick') {
      hx = -2; hy = -29; nx = -1; ny = -25.5;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso (lean back) */
      limb(ctx, 0, -24, 5, -23, 8, -22);                               /* front arm out (balance) */
      limb(ctx, 0, -24, -5, -21, -8, -20);                             /* rear arm back */
      limb(ctx, hipx, hipy, -1, -6, -2, 0);                            /* standing leg */
      var kx = (hipx + (2 + e * 16)) / 2, ky = -10;                    /* kicking leg */
      limb(ctx, hipx, hipy, kx, ky, 2 + e * 16, -4 - e * 14);
      if (e > 0.1) {                                                   /* motion arc trailing the foot */
        var fx2 = 2 + e * 16, fy2 = -4 - e * 14;
        seg(ctx, fx2 - 6 - e * 5, fy2 + 4, fx2 - 2 - e * 3, fy2 + 2);
        seg(ctx, fx2 - 8 - e * 6, fy2 + 8, fx2 - 4 - e * 4, fy2 + 6);
      }
      if (e > 0.85) star(ctx, 2 + e * 16 + 2, -4 - e * 14, 3.5);       /* impact frame */
    } else if (pose === 'shoot') {
      hx = -1; hy = -29; nx = -0.5; ny = -25.5;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso (braced, slight lean back) */
      limb(ctx, 0, -24, 5 + e * 4, -24, 9 + e * 7, -24);              /* firing arm straight out */
      limb(ctx, 0, -24, -3, -19, -5, -15);                             /* rear arm braced across body */
      limb(ctx, hipx, hipy, 4, -6, 6, 0);                              /* front leg */
      limb(ctx, hipx, hipy, -4, -6, -7, 0);                            /* back leg */
      if (e > 0.1) {                                                   /* motion lines behind the hand */
        var hx2 = 9 + e * 7;
        seg(ctx, hx2 - 5 - e * 4, -27, hx2 - 2 - e * 3, -27);
        seg(ctx, hx2 - 5 - e * 4, -24, hx2 - 2 - e * 3, -24);
      }
      if (e > 0.7) {                                                   /* muzzle flash */
        star(ctx, 9 + e * 7 + 3, -24, 3);
        ctx.beginPath(); ctx.arc(9 + e * 7 + 3, -24, 1.6, 0, TAU); ctx.fill();
      }
    } else if (pose === 'special') {
      hx = 4; hy = -29; nx = 3; ny = -25;
      head(ctx, hx, hy, 3.6);
      seg(ctx, 0, -13, 2, -19); seg(ctx, 2, -19, nx, ny);             /* torso (twisted, leaning in) */
      limb(ctx, 2, -24, -4, -28, -8, -31);                             /* left arm up/out */
      limb(ctx, 2, -24, 8, -29, 12, -32);                              /* right arm up/out */
      limb(ctx, 0, -13, -5, -6, -8, 0);                                /* wide stance */
      limb(ctx, 0, -13, 5, -6, 8, 0);
      ctx.beginPath(); ctx.arc(0, -17, 10 + e * 12, 0, TAU); ctx.stroke(); /* burst ring */
      for (var s = 0; s < 6; s++) {                                    /* radiating speed lines */
        var a = s * TAU / 6 + 0.3;
        seg(ctx, Math.cos(a) * (13 + e * 10), -17 + Math.sin(a) * (13 + e * 10),
            Math.cos(a) * (17 + e * 14), -17 + Math.sin(a) * (17 + e * 14));
      }
    } else if (pose === 'hit') {
      var r = 1 - p;                                                   /* recoil: max at p=0, gone at p=1 */
      hx = -3 * r; hy = -29; nx = -2 * r; ny = -25.5;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso (snapped back) */
      limb(ctx, 0, -24, -4 * r, -28, -7 * r, -30);                     /* arms flail up */
      limb(ctx, 0, -24, 4 * r, -28, 7 * r, -31);
      limb(ctx, hipx, hipy, 2, -6, 4, 0);                              /* stumbling legs */
      limb(ctx, hipx, hipy, -2, -6, -5, 0);
    } else if (pose === 'win') {
      var b = Math.abs(Math.sin(p * TAU)) * 2;                         /* little victory hop */
      hx = 0; hy = -30 - b; nx = 0; ny = -26 - b; hipy = -13 - b;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso */
      limb(ctx, 0, -24 - b, -4, -30 - b, -7, -34 - b);                 /* arms raised */
      limb(ctx, 0, -24 - b, 4, -30 - b, 7, -34 - b);
      limb(ctx, hipx, hipy, -2, -6 - b, -3, 0);                        /* standing leg */
      limb(ctx, hipx, hipy, 4, -10 - b, 6, -8 - b);                    /* one leg kicked up */
    } else { /* idle */
      var bob = Math.sin(p * TAU) * 0.8;
      hx = 0; hy = -29 + bob; nx = 0; ny = -25.5 + bob; hipy = -13 + bob;
      head(ctx, hx, hy, 3.6);
      seg(ctx, nx, ny, hipx, hipy);                                   /* torso */
      limb(ctx, 0, -24 + bob, -2.5, -19 + bob, -3.5, -14 + bob);       /* arms relaxed at sides */
      limb(ctx, 0, -24 + bob, 2.5, -19 + bob, 3.5, -14 + bob);
      limb(ctx, hipx, hipy, -2, -6 + bob, -4, 0);                      /* legs slightly apart */
      limb(ctx, hipx, hipy, 2, -6 + bob, 4, 0);
    }
  }

  var Stickman = {
    draw: function (ctx, o) {
      if (!ctx || !o) return;
      var pose = o.pose || 'idle';
      if (pose === 'spec') pose = 'special'; /* game kind names: Classic Fight calls it 'spec' */
      if (pose === 'strike') pose = 'punch';   /* Classic Fight 'strike' reads as a punch chop */
      var p = clamp(typeof o.progress === 'number' ? o.progress : 0, 0, 1);
      var size = o.size || 34;
      var col = o.color || '#fff';
      var dir = o.dir || 1;
      var alpha = (typeof o.alpha === 'number') ? o.alpha : 1;
      var lw = o.lineWidth || 2.2;
      var e = ext(p);
      ctx.save();
      ctx.translate(o.x || 0, o.y || 0);
      if (o.rot) ctx.rotate(o.rot);
      ctx.scale(dir * size / 34, size / 34);
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.save();                                                      /* dark outline pass */
      ctx.strokeStyle = 'rgba(8,8,12,0.55)'; ctx.lineWidth = lw + 1.8;
      ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(8,8,12,0.55)';
      posePaths(ctx, pose, e, p);
      ctx.restore();
      ctx.save();                                                      /* color pass with glow */
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.fillStyle = col;
      posePaths(ctx, pose, e, p);
      ctx.restore();
      ctx.restore();
    },

    burst: function (ctx, o) {
      if (!ctx || !o) return;
      var p = clamp(typeof o.progress === 'number' ? o.progress : 0, 0, 1);
      var r = o.r || 16, col = o.color || '#ffe9a8';
      var a = (typeof o.alpha === 'number') ? o.alpha : (1 - p);
      var x = o.x || 0, y = o.y || 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.lineCap = 'round';
      var len = r * (0.5 + 0.7 * p), i, an;
      ctx.save();                                                      /* star spokes, outline pass */
      ctx.strokeStyle = 'rgba(8,8,12,0.5)'; ctx.lineWidth = 4;
      for (i = 0; i < 8; i++) {
        an = i * Math.PI / 4;
        seg(ctx, Math.cos(an) * r * 0.15, Math.sin(an) * r * 0.15,
            Math.cos(an) * len, Math.sin(an) * len);
      }
      ctx.restore();
      ctx.save();                                                      /* star spokes, color pass */
      ctx.strokeStyle = col; ctx.lineWidth = 2.2;
      ctx.shadowColor = col; ctx.shadowBlur = 8;
      for (i = 0; i < 8; i++) {
        an = i * Math.PI / 4;
        seg(ctx, Math.cos(an) * r * 0.15, Math.sin(an) * r * 0.15,
            Math.cos(an) * len, Math.sin(an) * len);
      }
      ctx.restore();
      ctx.globalAlpha = clamp(a, 0, 1) * 0.7;                         /* expanding ring */
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, r * (0.3 + 0.9 * p), 0, TAU); ctx.stroke();
      ctx.globalAlpha = clamp(a, 0, 1);                               /* hot center dot */
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(0, 0, Math.max(1, r * 0.14 * (1 - p)), 0, TAU); ctx.fill();
      ctx.restore();
    },

    lines: function (ctx, o) {
      if (!ctx || !o) return;
      var p = clamp(typeof o.progress === 'number' ? o.progress : 0, 0, 1);
      var n = o.n || 3, len = o.len || 12, ang = o.angle || 0;
      var col = o.color || '#fff';
      var a = (typeof o.alpha === 'number') ? o.alpha : 1;
      var x = o.x || 0, y = o.y || 0;
      ctx.save();
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.lineCap = 'round';
      ctx.strokeStyle = col; ctx.lineWidth = o.lineWidth || 1.6;
      for (var i = 0; i < n; i++) {
        var off = (i - (n - 1) / 2) * 4;
        var bx = x + Math.cos(ang + Math.PI / 2) * off;
        var by = y + Math.sin(ang + Math.PI / 2) * off;
        seg(ctx, bx, by,
            bx - Math.cos(ang) * len * (0.4 + 0.6 * p),
            by - Math.sin(ang) * len * (0.4 + 0.6 * p));
      }
      ctx.restore();
    }
  };

  g.Stickman = Stickman;
  if (typeof module !== 'undefined' && module.exports) module.exports = Stickman;
})(typeof window !== 'undefined' ? window : globalThis);
