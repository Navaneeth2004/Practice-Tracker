// Tag actions: add, rename (a name that exists merges), delete
const same=(a,b)=>String(a||'').toLowerCase()===String(b||'').toLowerCase();
function tagUse(t){const h=a=>(a||[]).some(x=>same(x,t));return{recs:db.recs.filter(r=>h(r.tags)).length,pieces:db.pieces.filter(p=>h(p.tags)).length,res:db.res.filter(r=>h(r.tags)).length,notes:db.recs.reduce((n,r)=>n+(r.notes||[]).filter(x=>same(x.tag,t)).length,0)}}
function addTag(){const v=$('#tn').value.trim();if(!v){need('Add a tag name','Type a name for the tag first.','#tn');return}if(db.tags.some(x=>same(x,v))){toast('That tag already exists');return}ensureTags([v]);save();render()}
function findTag(t){sq=t;tab='search';openRec=null;render()}
function tagSheet(t){const u=tagUse(t);sheet('Edit tag',`<div class="lbl" style="margin-top:0">Name</div><input id="tr" style="width:100%" value="${E(t)}" data-t="${E(t)}" onkeydown="if(event.key==='Enter')renameTag(this.dataset.t,this.value)"><div class="mu" style="margin-top:10px">Used on ${pl(u.recs,'recording')}, ${pl(u.pieces,'piece')}, ${pl(u.res,'resource')} and ${pl(u.notes,'note')}. Using a name that already exists merges the two tags.</div>`,
 `<button class="b danger" style="margin-right:auto" data-t="${E(t)}" onclick="askTag(this.dataset.t)">Delete</button><button class="b s" onclick="closeSheet()">Cancel</button><button class="b" data-t="${E(t)}" onclick="renameTag(this.dataset.t,$('#tr').value)">Save</button>`)}
function renameTag(old,v){v=String(v||'').trim();closeSheet();if(!v||v===old){render();return}
 const dd=a=>{const s=new Set();return a.filter(x=>{const k=String(x).toLowerCase();if(s.has(k))return false;s.add(k);return true})},fix=a=>dd((a||[]).map(x=>same(x,old)||same(x,v)?v:x));
 db.tags=fix(db.tags);db.recs.forEach(r=>{r.tags=fix(r.tags);(r.notes||[]).forEach(n=>{if(same(n.tag,old))n.tag=v})});db.pieces.forEach(p=>p.tags=fix(p.tags));db.res.forEach(r=>r.tags=fix(r.tags));save();render()}
function delTag(t){const rm=a=>(a||[]).filter(x=>!same(x,t));db.tags=db.tags.filter(x=>!same(x,t));db.recs.forEach(r=>{r.tags=rm(r.tags);(r.notes||[]).forEach(n=>{if(same(n.tag,t))n.tag=''})});db.pieces.forEach(p=>p.tags=rm(p.tags));db.res.forEach(r=>r.tags=rm(r.tags));save();render()}
function askTag(t){ask('Delete tag','This removes the tag "'+t+'" from every recording, piece, resource and note.','Delete',()=>{closeSheet();delTag(t)},1)}
