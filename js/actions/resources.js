// Resource actions
function addRes(){const t=$('#xt').value.trim();if(!t)return;db.res.push({id:uid(),t,u:$('#xu').value.trim(),tags:pickedTags('xp')});save();render()}
function saveRes(id){const r=db.res.find(x=>x.id===id),t=$('#ext').value.trim();if(t)r.t=t;r.u=$('#exu').value.trim();r.tags=pickedTags('exp');ed=null;save();render()}
