// Today: streak and timer on the left, tabs (Plan / Routine / Focus) on the right
let ttab='plan';const _today=V.today;
V.today=function(){const t=document.createElement('template');t.innerHTML=_today();const k=[...t.content.children];
 const hd=e=>(e.querySelector('h3')||{}).textContent||'',plan=k.find(e=>hd(e).startsWith("Today's plan")),rt=k.find(e=>hd(e)==='Routine today'),
  fi=k.findIndex(e=>e.tagName==='H3'&&e.textContent.startsWith('Focus next')),foc=k.slice(fi+1).filter(e=>e.classList.contains('card')),
  cnt=e=>{const a=e?[...e.querySelectorAll('input[type=checkbox]')]:[];return a.length?' '+a.filter(x=>x.checked).length+'/'+a.length:''};
 const tabs=[['plan','Plan'+cnt(plan)],['routine','Routine'+cnt(rt)],['focus','Focus'+(foc.length&&foc[0].classList.contains('note')?' '+(k.slice(fi+1).filter(e=>e.classList.contains('note')).length):'')]];
 const body=ttab==='routine'?(rt?rt.outerHTML:'<div class="card mu">No routine today. Add one in Calendar, under Routines.</div>'):ttab==='focus'?`<div class="grid" style="grid-template-columns:1fr">${foc.map(e=>e.outerHTML).join('')||'<div class="mu">Nothing open.</div>'}</div>`:(plan?plan.outerHTML:'');
 return k[0].outerHTML+`<div class="split"><div>${k.find(e=>e.classList.contains('hero')).outerHTML}${k.find(e=>e.classList.contains('timer')).outerHTML}</div><div><div class="seg">${tabs.map(([a,b])=>`<button class="${ttab===a?'on':''}" onclick="ttab='${a}';render()">${E(b)}</button>`).join('')}</div>${body}</div></div>`};
