// Weekly routines and day notes: data helpers (screens live in js/views, forms in js/actions/calendar.js)
// Uses keys on db: cnotes, plans. Old backups and cloud files without them still load.
const plans=()=>db.plans||(db.plans=[]);
const dnList=d=>(db.cnotes||(db.cnotes={}))[d]||[];
function routineFor(d){const w=new Date(d+'T00:00').getDay();
 return plans().filter(r=>r.on!==false&&(r.days||[]).includes(w)&&(!r.from||d>=r.from)&&(!r.to||d<=r.to))}
function routineRows(r,d){const rows=[];
 (r.items||[]).forEach(i=>rows.push({key:d+'#r'+r.id+'_'+i.id,text:i.text,sub:''}));
 (r.pieces||[]).forEach(pid=>{const p=db.pieces.find(x=>x.id===pid);if(p)rows.push({key:d+'#r'+r.id+'_p'+pid,text:p.name,sub:p.tempo?'now '+p.tempo+' BPM':''})});
 return rows}
function routineAllDone(d){const rs=routineFor(d);let n=0,ok=0;rs.forEach(r=>routineRows(r,d).forEach(x=>{n++;if(db.done[x.key])ok++}));return n>0&&n===ok}
function dayMarks(k,n,ok){const rc=routineFor(k).length,nt=dnList(k).length;if(!n&&!rc&&!nt)return '';
 return `<span class="mk">${n?`<span class="dot${ok?' ok':''}"></span>`:''}${rc?`<span class="dot rc${routineAllDone(k)?' ok':''}"></span>`:''}${nt?'<span class="dot nt"></span>':''}</span>`}
function delDayNote(d,id){db.cnotes[d]=dnList(d).filter(x=>x.id!==id);if(!db.cnotes[d].length)delete db.cnotes[d];save();render()}
function toggleRoutine(id){const r=plans().find(x=>x.id===id);r.on=r.on===false;save();render()}
function delRoutine(id){db.plans=plans().filter(x=>x.id!==id);save();render()}
function mergePlus(d){
 if(d.cnotes){db.cnotes=db.cnotes||{};for(const k in d.cnotes){const have=new Set((db.cnotes[k]||[]).map(x=>x.id));(d.cnotes[k]||[]).forEach(x=>{if(!have.has(x.id))(db.cnotes[k]=db.cnotes[k]||[]).push(x)})}}
 if(d.plans){const have=new Set(plans().map(x=>x.id));d.plans.forEach(x=>{if(!have.has(x.id))plans().push(x)})}
 (d.pieces||[]).forEach(q=>{const p=db.pieces.find(x=>x.id===q.id);if(p&&!p.tempo&&q.tempo){p.tempo=q.tempo;if(q.tl)p.tl=q.tl}})}
