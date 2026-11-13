// Today actions
function togglePlan(k,v){db.done[k]=v;save();render()}
function quickAdd(){const i=$('#qa'),t=i.value.trim();if(!t){need('Write the task','Type what you want to practice today.','#qa');return}(db.cal[today()]=db.cal[today()]||[]).push({id:uid(),text:t,min:0});save();render();const n=$('#qa');if(n)n.focus()}
function askDelPlan(id){ask('Remove task','This task is removed from today.','Remove',()=>delCal(today(),id),1)}
function askDiscard(){ask('Discard session','This session is thrown away and no time is saved.','Discard',()=>tm('discard'),1)}
function stopSession(){if(el()<3e4){ask('Too short to save','Sessions under 30 seconds are not logged. Discard this one?','Discard',()=>tm('discard'),1);return}const m=Math.max(1,Math.round(el()/6e4));tm('stop');toast('Saved '+m+' min')}
