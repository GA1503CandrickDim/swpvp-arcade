/* ARCADIO SHARED MODE PROGRESSION — additive, local-only, no wallet/balance writes. */
(function(){
  'use strict';
  var KEY='arcadio_mode_progress_v1';
  function read(){var d={v:1,xp:0,petWins:0,delveRuns:0,delveClears:0,townBuilds:0,townFarm:0,vanixWins:0};try{var x=JSON.parse(localStorage.getItem(KEY)||'{}');if(x&&typeof x==='object')Object.keys(d).forEach(function(k){if(typeof x[k]==='number'&&isFinite(x[k]))d[k]=Math.max(0,x[k]);});}catch(e){}return d;}
  function rank(x){return x>=900?'WORLD WARDEN':x>=500?'RIFT KEEPER':x>=250?'DEEP DELVER':x>=100?'SCOUT':'WANDERER';}
  function render(){var d=read(),el=document.getElementById('arcWorldProgress');if(!el)return;el.innerHTML='<b>✦ WORLD PROGRESS</b><span>'+rank(d.xp)+' · '+d.xp+' XP</span><small>🐾 PET '+d.petWins+' wins · ⛏ DELVE '+d.delveClears+' clears / '+d.delveRuns+' runs · 🏡 TOWN '+(d.townBuilds+d.townFarm)+' actions · ⚔ VANIX '+d.vanixWins+' wins</small>';}
  function award(mode,kind,points){var d=read(),field=mode==='pet'?'petWins':mode==='delve'?(kind==='clears'?'delveClears':'delveRuns'):mode==='town'?(kind==='builds'?'townBuilds':'townFarm'):'vanixWins';d[field]=(d[field]||0)+1;d.xp=(d.xp||0)+Math.max(0,Number(points)||0);d.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}render();return d;}
  window.arcadioProgressAward=award;window.arcadioProgressRefresh=render;
  function mount(){var el=document.createElement('section');el.id='arcWorldProgress';el.setAttribute('aria-live','polite');var target=document.getElementById('wpBestLine');if(target&&target.parentNode)target.parentNode.insertBefore(el,target.nextSibling);else{target=document.getElementById('megaSel')||document.querySelector('.wrap')||document.body;target.appendChild(el);}render();}
  var style=document.createElement('style');style.textContent='#arcWorldProgress{margin:7px auto 10px;padding:8px 10px;max-width:680px;border:1px solid rgba(255,204,51,.38);border-radius:10px;background:linear-gradient(110deg,rgba(20,17,10,.96),rgba(10,16,24,.96));color:#ffe27a;font:700 11px/1.45 system-ui,Arial,sans-serif;letter-spacing:.04em;text-align:center}#arcWorldProgress b{display:block;color:#ffcc33;letter-spacing:.16em}#arcWorldProgress span{display:block;color:#fff;font-size:12px;margin:2px 0}#arcWorldProgress small{display:block;color:#aeb8c4;font-size:10px;font-weight:600;letter-spacing:0}';document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.addEventListener('storage',function(e){if(e.key===KEY)render();});
})();
