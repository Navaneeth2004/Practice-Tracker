// Data storage: the db object, saved to localStorage, plus date and id helpers
const $=s=>document.querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db={};try{db=JSON.parse(localStorage.getItem('pt'))||{}}catch(e){}
db=Object.assign({cal:{},pieces:[],recs:[],res:[],sched:{},done:{},log:{},st:{},timer:null,lastExport:null},db);
const save=()=>{try{localStorage.setItem('pt',JSON.stringify(db))}catch(e){}};
const dstr=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>dstr(new Date());
const uid=()=>Math.random().toString(36).slice(2,9);
