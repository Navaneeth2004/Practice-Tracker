// Constants and UI state
const TECH=['legato','fingering','rhythm','dynamics','pedaling','hand independence','trills','tempo','posture'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let cm=new Date(),sel=dstr(new Date()),ed=null,tab='today',openRec=null,files={},msg='';
const TABS=[['today','Today'],['review','Review'],['pieces','Pieces'],['res','Resources'],['sched','Calendar'],['prog','Progress'],['data','Backup']];
