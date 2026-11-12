// Review: folder chips, grouped grid, add-recording form opens on demand
let radd=false,rf='all';const _rev=V.review;
V.review=function(){if(openRec)return _rev();const t=document.createElement('template');t.innerHTML=_rev();const k=[...t.content.children],fl=db.folders||[];
 const cards=k.slice(2).filter(e=>e.classList.contains('item')),fo=e=>{const m=/openRec='([^']+)'/.exec(e.getAttribute('onclick')||''),r=m&&rec(m[1]),p=r&&db.pieces.find(x=>x.id===r.piece);return p&&fl.some(f=>f.id===p.folder)?p.folder:''};
 const groups=[...fl.map(f=>[f.id,f.name]),['','Unfiled']].filter(g=>rf==='all'||(rf==='none'?g[0]==='':rf===g[0]));
 const body=groups.map(([id,n])=>{const c=cards.filter(e=>fo(e)===id);return c.length?`<h3>${E(n)} (${c.length})</h3><div class="grid">${c.map(e=>e.outerHTML).join('')}</div>`:''}).join('')||'<div class="mu">No recordings here yet.</div>';
 const chip=(v,n)=>`<button class="${rf===v?'on':''}" data-f="${E(v)}" onclick="rf=this.dataset.f;render()">${E(n)}</button>`;
 return `${k[0].outerHTML}<div class="row" style="margin-bottom:14px;flex-wrap:nowrap"><div class="seg" style="margin:0;flex:1">${chip('all','All')}${fl.map(f=>chip(f.id,f.name)).join('')}${chip('none','Unfiled')}</div><button class="b sm" onclick="radd=!radd;render()">${radd?'Close':'New recording'}</button></div>${radd?`<div class="drawer">${k[1].outerHTML}</div>`:''}${body}`};
