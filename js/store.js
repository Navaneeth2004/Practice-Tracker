// Data storage: the db object, saved to localStorage, plus date and id helpers
const $=s=>document.querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db={};try{db=JSON.parse(localStorage.getItem('pt'))||{}}catch(e){}
db=Object.assign({cal:{},pieces:[],recs:[],res:[],sched:{},done:{},log:{},st:{},timer:null,lastExport:null},db);
// save(true) stores quietly, without marking a change (used for migrations and for data pulled from the cloud)
function save(quiet){if(!quiet)db.ts=Date.now();try{localStorage.setItem('pt',JSON.stringify(db))}catch(e){}if(!quiet&&typeof schedulePush==='function')schedulePush()}
const dstr=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>dstr(new Date());
const uid=()=>Math.random().toString(36).slice(2,9);
