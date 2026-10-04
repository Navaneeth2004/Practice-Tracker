// Resource actions
function addRes(){const t=$('#xt').value.trim();if(!t){need('Add a title','Give the resource a title before saving it.','#xt');return}db.res.push({id:uid(),t,u:$('#xu').value.trim(),tags:pickedTags('xp')});save();render()}
function saveRes(id){const r=db.res.find(x=>x.id===id),t=$('#ext').value.trim();if(t)r.t=t;r.u=$('#exu').value.trim();r.tags=pickedTags('exp');ed=null;save();render()}
function delRes(id){db.res=db.res.filter(x=>x.id!==id);db.recs.forEach(r=>(r.notes||[]).forEach(n=>{if(n.res===id)n.res=''}));save();render()}
