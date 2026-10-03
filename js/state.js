// Constants and UI state
const TECH=['legato','fingering','rhythm','dynamics','pedaling','hand independence','trills','tempo','posture'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let cm=new Date(),sel=dstr(new Date()),ed=null,tab='today',openRec=null,files={},msg='',sq='';
const TABS=[['today','Today'],['review','Review'],['pieces','Pieces'],['res','Resources'],['sched','Calendar'],['tags','Tags'],['search','Search'],['prog','Progress'],['data','Backup']];
if(!db.tags)db.tags=TECH.slice();
db.res.forEach(r=>{if(!r.tags)r.tags=r.g?[r.g]:[]});
let lastKey='';
// one-time move of old summary text into notes
db.recs.forEach(r=>{if(r.good||r.fix){r.notes=r.notes||[];(r.fix||'').split('\n').map(x=>x.trim()).filter(Boolean).forEach(l=>{const i=l.indexOf(':');r.notes.push({id:uid(),t:0,type:'needs',sec:i>0?l.slice(0,i):'',tag:'',text:i>0?l.slice(i+1).trim():l,res:''})});if(r.good)r.notes.push({id:uid(),t:0,type:'good',sec:'',tag:'',text:r.good,res:''});r.good='';r.fix=''}});
save();
// ratings used to be out of 5; now out of 10
if(!db.rs10){db.recs.forEach(r=>{if(r.rating)r.rating*=2});db.rs10=1;save()}
