// Resource actions (forms open in the side panel)
function resSheet(id){const r=id?db.res.find(x=>x.id===id):null,v=r||{};
 sheet(r?'Edit resource':'New resource',`<div class="form"><input id="xt" class="wide" placeholder="Title" value="${E(v.t||'')}"></div><div class="lbl">Link or text</div><textarea id="xu" style="min-height:90px" placeholder="Paste a link, or write the text itself">${E(v.u||'')}</textarea><div class="lbl">Tags</div>${tagPicker('xp',v.tags)}`,
 (r?`<button class="b danger" style="margin-right:auto" onclick="askDelRes('${id}')">Delete</button>`:'')+`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveRes('${id||''}')">Save</button>`)}
function saveRes(id){const t=$('#xt').value.trim();if(!t){need('Add a title','Give the resource a title before saving it.','#xt');return}
 const r=id?db.res.find(x=>x.id===id):{id:uid()};r.t=t;r.u=$('#xu').value.trim();r.tags=pickedTags('xp');if(!id)db.res.push(r);save();closeSheet();render()}
function playRes(id){closeVideo();rplay=id;render()}
function askDelRes(id){const n=resUse(id);ask('Delete resource',n?`This removes the resource. ${pl(n,'note')} that use it lose the attachment.`:'This removes the resource.','Delete',()=>{closeSheet();delRes(id)},1)}
function delRes(id){db.res=db.res.filter(x=>x.id!==id);db.recs.forEach(r=>(r.notes||[]).forEach(n=>{if(n.res===id)n.res=''}));if(rplay===id)rplay=null;save();render()}
