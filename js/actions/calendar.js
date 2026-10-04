// Calendar actions
cm.setDate(1);
function shiftM(n){cm=new Date(cm.getFullYear(),cm.getMonth()+n,1);render()}
function addCal(){const t=$('#ct').value.trim();if(!t){need('Add something to do','Write what you want to practice or log for this day.','#ct');return}(db.cal[sel]=db.cal[sel]||[]).push({id:uid(),text:t,min:+$('#cmn').value||0});save();render()}
function saveCal(id){const it=db.cal[sel].find(x=>x.id===id),t=$('#cet').value.trim();if(t)it.text=t;it.min=+$('#cem').value||0;ed=null;save();render()}
function setLog(){const v=+$('#lm').value||0;if(v)db.log[sel]=v;else delete db.log[sel];save();render()}
function delCal(d,id){db.cal[d]=(db.cal[d]||[]).filter(x=>x.id!==id);delete db.done[d+'#'+id];save();render()}
