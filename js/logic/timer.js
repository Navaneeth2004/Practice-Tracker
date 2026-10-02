// Practice timer
// timer
const el=()=>{const t=db.timer;return t?t.acc+(t.run?Date.now()-t.start:0):0};
function tm(a){const t=db.timer;if(a==='start')db.timer={run:1,start:Date.now(),acc:0};
 if(a==='pause'){t.acc=el();t.run=0}if(a==='resume'){t.run=1;t.start=Date.now()}
 if(a==='stop'){const m=Math.round(el()/6e4);db.log[today()]=(db.log[today()]||0)+Math.max(m,1);db.timer=null}save();render()}
setInterval(()=>{const e=$('#tm');if(e)e.textContent=hms(el())},500);
