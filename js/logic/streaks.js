// Streak calculation
// streaks
function active(){const s=new Set();for(const d in db.log)if(db.log[d]>0)s.add(d);for(const k in db.done)if(db.done[k])s.add(k.split('#')[0]);return s}
function streaks(){const a=active();let cur=0,d=new Date();if(!a.has(dstr(d)))d.setDate(d.getDate()-1);while(a.has(dstr(d))){cur++;d.setDate(d.getDate()-1)}
 const ds=[...a].sort();let best=0,run=0,prev=null;for(const x of ds){run=prev&&(new Date(x)-new Date(prev))===864e5?run+1:1;best=Math.max(best,run);prev=x}return{cur,best,on:a.has(today())}}
