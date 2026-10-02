// Tag actions
const same=(a,b)=>String(a||'').toLowerCase()===String(b||'').toLowerCase();
function tagUse(t){const h=a=>(a||[]).some(x=>same(x,t));return{recs:db.recs.filter(r=>h(r.tags)).length,pieces:db.pieces.filter(p=>h(p.tags)).length,res:db.res.filter(r=>h(r.tags)).length,notes:db.recs.reduce((n,r)=>n+(r.notes||[]).filter(x=>same(x.tag,t)).length,0)}}
function addTag(){const v=$('#tn').value.trim();if(v){ensureTags([v]);save()}render()}
function renameTag(old){const v=$('#tr').value.trim();ed=null;if(v&&v!==old){const fix=a=>(a||[]).map(x=>same(x,old)?v:x);db.tags=[...new Set(db.tags.map(x=>x===old?v:x))];db.recs.forEach(r=>{r.tags=fix(r.tags);(r.notes||[]).forEach(n=>{if(same(n.tag,old))n.tag=v})});db.pieces.forEach(p=>p.tags=fix(p.tags));db.res.forEach(r=>r.tags=fix(r.tags));save()}render()}
function delTag(t){if(!confirm('Delete the tag "'+t+'" from everything?'))return;const rm=a=>(a||[]).filter(x=>!same(x,t));db.tags=db.tags.filter(x=>x!==t);db.recs.forEach(r=>{r.tags=rm(r.tags);(r.notes||[]).forEach(n=>{if(same(n.tag,t))n.tag=''})});db.pieces.forEach(p=>p.tags=rm(p.tags));db.res.forEach(r=>r.tags=rm(r.tags));save();render()}
