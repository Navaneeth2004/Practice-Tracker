// Constants and UI state
const TECH=['legato','fingering','rhythm','dynamics','pedaling','hand independence','trills','tempo','posture'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let cm=new Date(),sel=dstr(new Date()),ed=null,tab='today',openRec=null,files={},msg='',sq='';
const TABS=[['today','Today'],['review','Review'],['pieces','Pieces'],['res','Resources'],['sched','Calendar'],['tags','Tags'],['search','Search'],['prog','Progress'],['data','Backup']];
if(!db.tags)db.tags=TECH.slice();
db.res.forEach(r=>{if(!r.tags)r.tags=r.g?[r.g]:[]});
