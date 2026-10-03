// Focus next: open "needs work" notes, resolved one by one
function openNotes(){const o=[];db.recs.forEach(r=>(r.notes||[]).forEach(n=>{if(n.type==='needs'&&!n.done)o.push({r,n})}));return o.sort((a,b)=>a.r.date<b.r.date?1:a.r.date>b.r.date?-1:a.n.t-b.n.t)}
function setDone(rid,nid,v){const n=rec(rid).notes.find(x=>x.id===nid);n.done=v;n.doneAt=v?today():'';save();if($('#notes-area'))refreshNotes();else render()}
