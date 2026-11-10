// Calendar notes, weekly routines and piece tempo.
// Everything here uses NEW keys on db (cnotes, plans, and tempo fields on pieces).
// Existing data is never rewritten, and old backups or cloud files without these keys still load.
const plans=()=>db.plans||(db.plans=[]);
const dnList=d=>(db.cnotes||(db.cnotes={}))[d]||[];

// ---- weekly routines -------------------------------------------------------
// A routine: {id,name,tempo,days:[0-6],items:[{id,text}],pieces:[pieceId],min,from,to,on}
function routineFor(d){const w=new Date(d+'T00:00').getDay();
 return plans().filter(r=>r.on!==false&&(r.days||[]).includes(w)&&(!r.from||d>=r.from)&&(!r.to||d<=r.to))}
// rows to tick off for one routine on one day
function routineRows(r,d){const rows=[];
 (r.items||[]).forEach(i=>rows.push({key:d+'#r'+r.id+'_'+i.id,text:i.text,sub:''}));
 (r.pieces||[]).forEach(pid=>{const p=db.pieces.find(x=>x.id===pid);if(p)rows.push({key:d+'#r'+r.id+'_p'+pid,text:p.name,sub:p.tempo?'now '+p.tempo+' BPM':''})});
 return rows}
function routineAllDone(d){const rs=routineFor(d);let n=0,ok=0;rs.forEach(r=>routineRows(r,d).forEach(x=>{n++;if(db.done[x.key])ok++}));return n>0&&n===ok}

// small markers shown on a calendar day cell
function dayMarks(k,n,ok){const rc=routineFor(k).length,nt=dnList(k).length;if(!n&&!rc&&!nt)return '';
 return `<span class="mk">${n?`<span class="dot${ok?' ok':''}"></span>`:''}${rc?`<span class="dot rc${routineAllDone(k)?' ok':''}"></span>`:''}${nt?'<span class="dot nt"></span>':''}</span>`}

// ---- day notes -------------------------------------------------------------
function addDayNote(){const t=$('#dnt').value.trim();if(!t){need('Write a note','Type what you want to remember about this day.','#dnt');return}
 (db.cnotes=db.cnotes||{});(db.cnotes[sel]=db.cnotes[sel]||[]).push({id:uid(),text:t,at:Date.now()});save();render()}
function saveDayNote(id){const n=dnList(sel).find(x=>x.id===id),t=$('#dne').value.trim();if(t){n.text=t;n.at=Date.now()}ed=null;save();render()}
function delDayNote(d,id){db.cnotes[d]=dnList(d).filter(x=>x.id!==id);if(!db.cnotes[d].length)delete db.cnotes[d];save();render()}

// ---- routine actions -------------------------------------------------------
function saveRoutine(id){
 const name=$('#rn').value.trim(),days=[...document.querySelectorAll('#rdays .chip.on')].map(c=>+c.dataset.d),
  pcs=[...document.querySelectorAll('#rpcs .chip.on')].map(c=>c.dataset.p),lines=$('#ri').value.split('\n').map(x=>x.trim()).filter(Boolean);
 if(!name){need('Name the routine','Give it a name, for example Slow tempo day.','#rn');return}
 if(!days.length){need('Pick the days','Choose at least one day of the week for this routine.','#rdays');return}
 if(!lines.length&&!pcs.length){need('Add something to practice','Write at least one thing to practice, or pick a piece.','#ri');return}
 const old=id?plans().find(x=>x.id===id):null,pool=old?(old.items||[]).slice():[];
 // keep the same item id when the text is unchanged, so ticks already made on past days stay valid
 const items=lines.map(t=>{const i=pool.findIndex(x=>x.text===t);return i>=0?pool.splice(i,1)[0]:{id:uid(),text:t}});
 const r={id:old?old.id:uid(),name,tempo:$('#rt').value.trim(),days,items,pieces:pcs,min:+$('#rm').value||0,from:$('#rf').value||today(),to:$('#ru').value||'',on:old?old.on!==false:true};
 if(old)Object.assign(old,r);else plans().push(r);
 ed=null;save();render()}
function toggleRoutine(id){const r=plans().find(x=>x.id===id);r.on=r.on===false;save();render()}
function delRoutine(id){db.plans=plans().filter(x=>x.id!==id);save();render()}
function tickRow(k,v){db.done[k]=v;save();render()}

// ---- piece tempo -----------------------------------------------------------
// piece fields added: tempo (BPM now), goal (target BPM), tl (history [{d,bpm}])
function setTempo(id){const p=db.pieces.find(x=>x.id===id),v=+$('#tb-'+id).value||0,g=+$('#tg-'+id).value||0;
 if(!v&&!g){need('Enter a tempo','Type the BPM you are practicing at now, and optionally a goal tempo.','#tb-'+id);return}
 if(v){p.tempo=v;p.tl=(p.tl||[]).filter(x=>x.d!==today());p.tl.push({d:today(),bpm:v})}
 if(g)p.goal=g;else delete p.goal;
 save();render()}
function clearTempo(id){const p=db.pieces.find(x=>x.id===id);delete p.tempo;delete p.goal;delete p.tl;save();render()}

// ---- importing a backup with Merge: add new notes and routines, keep existing ones ----
function mergePlus(d){
 if(d.cnotes){db.cnotes=db.cnotes||{};for(const k in d.cnotes){const have=new Set((db.cnotes[k]||[]).map(x=>x.id));(d.cnotes[k]||[]).forEach(x=>{if(!have.has(x.id))(db.cnotes[k]=db.cnotes[k]||[]).push(x)})}}
 if(d.plans){const have=new Set(plans().map(x=>x.id));d.plans.forEach(x=>{if(!have.has(x.id))plans().push(x)})}
 // tempo fields on pieces that already exist here but have none yet
 (d.pieces||[]).forEach(q=>{const p=db.pieces.find(x=>x.id===q.id);if(p&&!p.tempo&&q.tempo){p.tempo=q.tempo;if(q.goal)p.goal=q.goal;if(q.tl)p.tl=q.tl}})}
