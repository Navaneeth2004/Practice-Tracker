// Calendar: month left, tabs (Plan / Notes / Routines) right, so nothing hides far below
let ptab='plan';const _sched=V.sched;
V.sched=function(){const t=document.createElement('template');t.innerHTML=_sched();const k=[...t.content.children],rest=k.slice(3);
 const kind=e=>{const h=(e.querySelector('h3')||{}).textContent;return h==='Weekly routine'?'routine':h==='Notes for this day'?'notes':'routines'},pick=n=>rest.filter(e=>kind(e)===n).map(e=>e.outerHTML).join('');
 const tabs=[['plan','Plan'],['notes','Notes'],['routines','Routines']],body=ptab==='notes'?pick('notes'):ptab==='routines'?pick('routines'):k[2].outerHTML+pick('routine');
 return k[0].outerHTML+`<div class="split"><div>${k[1].outerHTML}</div><div><div class="seg">${tabs.map(([a,b])=>`<button class="${ptab===a?'on':''}" onclick="ptab='${a}';ed=null;render()">${b}</button>`).join('')}</div>${body}</div></div>`};
