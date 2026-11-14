/* SWPVP shared cosmetic skin shop v1
 * Uses the existing Molecules balance (wraith_coins) only. Does not touch
 * ATOMS, ION, PayPal, Square, purchases, saves, combat stats, or game rules.
 * Emits swpvp:skin-change for renderer-specific character-art adapters.
 */
(function(){'use strict';
  if(window.__SWPVPSkins)return;
  var BALANCE_KEY='wraith_coins', INVENTORY_KEY='swpvp_skin_inventory_v1', EQUIPPED_KEY='swpvp_skin_equipped_v1';
  var skins=[
    {id:'classic',name:'Classic',price:0,desc:'Original look',color:'#d8d8d8',free:true},
    {id:'ember',name:'Ember Wraith',price:500,desc:'Molten red glow',color:'#ff5b43'},
    {id:'frost',name:'Frostbyte',price:750,desc:'Glacial cyan finish',color:'#63e8ff'},
    {id:'venom',name:'Venom Circuit',price:1000,desc:'Toxic green energy',color:'#a5ff4d'},
    {id:'royal',name:'Royal Void',price:1250,desc:'Violet / gold trim',color:'#b78aff'},
    {id:'neon',name:'Neon Phantom',price:1500,desc:'Electric magenta',color:'#ff62dc'},
    {id:'obsidian',name:'Obsidian',price:2000,desc:'Dark chrome finish',color:'#9da8b7'},
    {id:'solar',name:'Solar Flare',price:2500,desc:'Radiant gold',color:'#ffd45c'},
    {id:'sigilized-devil',name:'Sigilized Devil',price:0,priceAtoms:250,priceIons:125,desc:'Sigilos — Sigilized Devil. Clean standing art. Vault exclusive.',color:'#c07dff'}
  ];
  function read(key,fallback){try{var v=JSON.parse(localStorage.getItem(key));return v==null?fallback:v}catch(e){return fallback}}
  function balance(){var n=Number(localStorage.getItem(BALANCE_KEY));return isFinite(n)&&n>=0?Math.floor(n):0}
  /* SIGILIZED DEVIL (2026-11-14): this one skin is priced in Atoms (250) or
   * Ions (125), not Molecules. Atoms live in 'wraith_atom_balance_v1' (the
   * hub/Exchange atom purse); the Tavern also keeps its atom balance in the
   * 'sw_ion_wallet' object, so that is the fallback. Ions live in
   * 'sw_ion_wallet'.ions. Both purchase paths also mark the skin owned in
   * 'sw_ion_wallet'.owned (id 'skin-sigilos-sigilized-devil') so Vanix Fight
   * activates it; the Vault inventory keeps its own id 'sigilized-devil'. */
  function atomBalance(){var a=Number(localStorage.getItem('wraith_atom_balance_v1'));if(isFinite(a)&&a>0)return Math.floor(a);try{var w=JSON.parse(localStorage.getItem('sw_ion_wallet')||'null');return (w&&isFinite(w.ions))?Math.floor(w.ions):0;}catch(e){return 0;}}
  function ionBalance(){try{var w=JSON.parse(localStorage.getItem('sw_ion_wallet')||'null');return (w&&isFinite(w.ions))?Math.floor(w.ions):0;}catch(e){return 0;}}
  function spendAtoms(n){var a=Number(localStorage.getItem('wraith_atom_balance_v1'));if(isFinite(a)&&a>=n){localStorage.setItem('wraith_atom_balance_v1',String(Math.floor(a)-n));return true;}try{var w=JSON.parse(localStorage.getItem('sw_ion_wallet')||'null');if(w&&isFinite(w.ions)&&w.ions>=n){w.ions=Math.floor(w.ions)-n;localStorage.setItem('sw_ion_wallet',JSON.stringify(w));return true;}}catch(e){}return false;}
  function spendIons(n){try{var w=JSON.parse(localStorage.getItem('sw_ion_wallet')||'null');if(w&&isFinite(w.ions)&&w.ions>=n){w.ions=Math.floor(w.ions)-n;localStorage.setItem('sw_ion_wallet',JSON.stringify(w));return true;}}catch(e){}return false;}
  function markOwnedWallet(id){try{var w=JSON.parse(localStorage.getItem('sw_ion_wallet')||'null')||{};if(!Array.isArray(w.owned))w.owned=[];if(w.owned.indexOf(id)<0)w.owned.push(id);localStorage.setItem('sw_ion_wallet',JSON.stringify(w));}catch(e){}}
  function inventory(){var v=read(INVENTORY_KEY,['classic']);return Array.isArray(v)?v:['classic']}
  function equipped(){var id=localStorage.getItem(EQUIPPED_KEY)||'classic';return skins.some(function(s){return s.id===id;})?id:'classic'}
  function saveInv(v){localStorage.setItem(INVENTORY_KEY,JSON.stringify(v))}
  function emit(){var id=equipped(),skin=skins.find(function(s){return s.id===id})||skins[0];document.documentElement.setAttribute('data-swpvp-skin',id);document.documentElement.style.setProperty('--swpvp-skin-accent',skin.color);window.dispatchEvent(new CustomEvent('swpvp:skin-change',{detail:{id:id,skin:skin}}));}
  function ensure(){if(document.getElementById('swpvpSkinLauncher'))return;
    var style=document.createElement('style');style.textContent='#swpvpSkinLauncher{position:fixed;right:12px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:99990;border:1px solid #9b78ff;background:#111;color:#fff;border-radius:999px;padding:11px 15px;font:800 12px system-ui;letter-spacing:1px;box-shadow:0 4px 18px #0009}#swpvpSkinShade{display:none;position:fixed;inset:0;z-index:99991;background:#000b;align-items:center;justify-content:center;padding:14px;box-sizing:border-box}#swpvpSkinPanel{width:min(620px,100%);max-height:88dvh;overflow:auto;background:#101018;color:#fff;border:1px solid #8065c9;border-radius:18px;padding:16px;box-sizing:border-box;font:14px system-ui;box-shadow:0 12px 48px #000}#swpvpSkinPanel h2{margin:0 0 6px;font-size:21px}#swpvpSkinPanel p{color:#bbb;margin:4px 0 12px}#swpvpSkinBalance{padding:9px 12px;border:1px solid #594b79;border-radius:10px;margin:10px 0 14px;color:#e9dcff}#swpvpSkinGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:9px}.swpvpSkinCard{background:#191923;border:1px solid #343044;border-radius:12px;padding:11px;text-align:left;color:#fff;min-height:124px}.swpvpSkinSwatch{height:28px;border-radius:8px;margin-bottom:9px;border:1px solid #ffffff33}.swpvpSkinCard strong{display:block}.swpvpSkinCard small{display:block;color:#aaa;margin:4px 0 8px}.swpvpSkinCard button,#swpvpSkinClose{border:0;border-radius:8px;background:#8065c9;color:#fff;font-weight:800;padding:8px 10px}.swpvpSkinCard button:disabled{opacity:.45}#swpvpSkinClose{margin-top:12px;background:#333}#swpvpSkinNotice{min-height:18px;color:#ffd45c;margin-top:8px;font-size:12px}';document.head.appendChild(style);
    var launch=document.createElement('button');launch.id='swpvpSkinLauncher';launch.type='button';launch.textContent='✦ SKINS';launch.setAttribute('aria-label','Open skin shop');document.body.appendChild(launch);
    var shade=document.createElement('div');shade.id='swpvpSkinShade';shade.innerHTML='<section id="swpvpSkinPanel" role="dialog" aria-modal="true" aria-labelledby="swpvpSkinTitle"><h2 id="swpvpSkinTitle">✦ WRAITH SKIN VAULT</h2><p>Cosmetic looks shared across games on this site. No stat boosts or gameplay advantages.</p><div id="swpvpSkinBalance"></div><div id="swpvpSkinGrid"></div><div id="swpvpSkinNotice" aria-live="polite"></div><button id="swpvpSkinClose" type="button">CLOSE</button></section>';document.body.appendChild(shade);
    function close(){shade.style.display='none'}
    function render(note){var bal=balance(),owned=inventory(),active=equipped();shade.querySelector('#swpvpSkinBalance').textContent='🪙 '+bal.toLocaleString()+' MOLECULES AVAILABLE';var grid=shade.querySelector('#swpvpSkinGrid');grid.innerHTML='';skins.forEach(function(s){var has=owned.indexOf(s.id)>=0,selected=active===s.id,card=document.createElement('div');card.className='swpvpSkinCard';var sw=document.createElement('div');sw.className='swpvpSkinSwatch';sw.style.background='linear-gradient(110deg,#17171d,'+s.color+')';var title=document.createElement('strong');title.textContent=s.name;var desc=document.createElement('small');desc.textContent=s.desc+' · '+(s.priceAtoms?(s.priceAtoms.toLocaleString()+' ATOMS · or '+s.priceIons.toLocaleString()+' IONS'):(s.price?s.price.toLocaleString()+' Molecules':'FREE'));var btn=document.createElement('button');btn.type='button';
    if(s.priceAtoms&&!has){
      btn.textContent='BUY · '+s.priceAtoms.toLocaleString()+' ATOMS';btn.disabled=atomBalance()<s.priceAtoms;
      btn.addEventListener('click',function(){if(!spendAtoms(s.priceAtoms)){render('Not enough Atoms for '+s.name+'.');return}owned=inventory();owned.push(s.id);saveInv(owned);markOwnedWallet('skin-sigilos-sigilized-devil');localStorage.setItem(EQUIPPED_KEY,s.id);emit();render(s.name+' bought with Atoms and equipped.');});
      var btn2=document.createElement('button');btn2.type='button';btn2.textContent='BUY · '+s.priceIons.toLocaleString()+' IONS';btn2.disabled=ionBalance()<s.priceIons;btn2.style.marginTop='6px';
      btn2.addEventListener('click',function(){if(!spendIons(s.priceIons)){render('Not enough Ions for '+s.name+'.');return}owned=inventory();owned.push(s.id);saveInv(owned);markOwnedWallet('skin-sigilos-sigilized-devil');localStorage.setItem(EQUIPPED_KEY,s.id);emit();render(s.name+' bought with Ions and equipped.');});
      card.appendChild(sw);card.appendChild(title);card.appendChild(desc);card.appendChild(btn);card.appendChild(btn2);grid.appendChild(card);
    }else{
      btn.textContent=selected?'EQUIPPED':has?'EQUIP':s.price?'BUY':'UNLOCK';btn.disabled=selected||(!has&&bal<s.price);btn.addEventListener('click',function(){if(!has){var current=balance();if(current<s.price){render('Not enough Molecules. Earn more by playing.');return}localStorage.setItem(BALANCE_KEY,String(current-s.price));owned=inventory();owned.push(s.id);saveInv(owned)}localStorage.setItem(EQUIPPED_KEY,s.id);emit();render(s.name+' equipped.');});card.appendChild(sw);card.appendChild(title);card.appendChild(desc);card.appendChild(btn);grid.appendChild(card);
    }});shade.querySelector('#swpvpSkinNotice').textContent=note||''}
    launch.addEventListener('click',function(){render();shade.style.display='flex'});shade.addEventListener('click',function(e){if(e.target===shade)close()});shade.querySelector('#swpvpSkinClose').addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});window.addEventListener('storage',function(e){if(e.key===BALANCE_KEY&&shade.style.display==='flex')render()});
  }
  window.__SWPVPSkins={skins:skins,open:function(){var b=document.getElementById('swpvpSkinLauncher');if(b)b.click()},getEquipped:equipped,getInventory:inventory,getBalance:balance};
  function boot(){ensure();emit()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
