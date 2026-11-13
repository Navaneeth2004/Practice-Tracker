// Search actions: typing, tag terms, and jumping to the exact result
function doSearch(v){sq=v;$('#sres').innerHTML=searchHtml(v)}
function addTerm(t){sq=(sq+' '+t).trim();$('#sq').value=sq;doSearch(sq)}
function flashBy(fn){setTimeout(()=>{const e=[...document.querySelectorAll('#main .card')].find(fn);if(e){e.scrollIntoView({block:'center',behavior:'smooth'});e.classList.add('flash')}},80)}
const txt=(e,s)=>{const x=e.querySelector(s);return x?x.textContent:null};
function goRes(k,a,b){openRec=null;ed=null;
 if(k==='rec'){openRecording(a);return}
 if(k==='note'){openRecording(a);flashBy(e=>e.dataset.id===b);return}
 if(k==='piece'){const p=db.pieces.find(x=>x.id===a);pf='all';tab='pieces';render();flashBy(e=>txt(e,'.pn')===(p||{}).name);return}
 if(k==='res'){const r=db.res.find(x=>x.id===a);rq='';rtag='';tab='res';render();flashBy(e=>txt(e,'.rtitle')===(r||{}).t);return}
 if(k==='cal'||k==='dn'){sel=a;cm=new Date(a+'T00:00');cm.setDate(1);ctab='cal';dtab=k==='dn'?'notes':'plan';tab='sched';render();return}
 if(k==='rt'){const r=plans().find(x=>x.id===a);ctab='routines';tab='sched';render();flashBy(e=>txt(e,'b')===(r||{}).name)}}
