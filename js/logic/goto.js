// Search results jump to the exact item
function goTo(t,name){tab=t;openRec=null;ed=null;if(t==='pieces')pf='all';render();
 setTimeout(()=>{const b=[...document.querySelectorAll('#main .card b')].find(x=>x.textContent===name),c=b&&b.closest('.card');if(c){c.scrollIntoView({block:'center',behavior:'smooth'});c.classList.add('flash')}},60)}
const _sh=searchHtml;
searchHtml=function(q){const t=document.createElement('template');t.innerHTML=_sh(q);let sec='';
 [...t.content.children].forEach(e=>{if(e.tagName==='H3'){sec=e.textContent;return}const o=e.getAttribute('onclick')||'';
  if(sec.startsWith('Pieces'))e.setAttribute('onclick',"goTo('pieces',this.querySelector('b').textContent)");
  else if(sec.startsWith('Resources'))e.setAttribute('onclick',"goTo('res',this.querySelector('b').textContent)");
  else if(o.includes("tab='sched';"))e.setAttribute('onclick',o.replace("tab='sched';","tab='sched';ptab='"+(sec.startsWith('Day')?'notes':sec.startsWith('Weekly')?'routines':'plan')+"';"))});
 return t.innerHTML};
