// Focus next: weak spots from notes and summaries
// focus items from notes + summaries
function flags(){const m={};const add=(r,sec,tag,txt,t)=>{const lab=sec||tag||'general';const k=r.piece+'|'+lab.toLowerCase();
 const o=m[k]=m[k]||{k,piece:r.piece,label:lab,n:0,last:'',refs:[]};o.n++;if(r.date>o.last)o.last=r.date;o.refs.push({r:r.title,t,txt,tag})};
 for(const r of db.recs){for(const n of r.notes||[])if(n.type==='needs')add(r,n.sec,n.tag,n.text,n.t);
  for(const l of (r.fix||'').split('\n').map(x=>x.trim()).filter(Boolean)){const i=l.indexOf(':');add(r,i>0?l.slice(0,i):'',null,i>0?l.slice(i+1).trim():l,null)}}return m}
function focus(){const f=flags();return Object.values(f).filter(o=>(db.st[o.k]||{}).s!=='solid').sort((a,b)=>b.n-a.n||(b.last>a.last?1:-1))}
function resetFlags(){const f=flags();for(const k in f){const s=db.st[k];if(s&&s.s!=='tricky'&&f[k].n>(s.n||0)){s.s='tricky';s.h.push([today(),'tricky'])}if(s)s.n=f[k].n}}
function improve(k){const s=db.st[k]=db.st[k]||{s:'tricky',h:[],n:flags()[k].n};s.s=s.s==='tricky'?'improving':'solid';s.h.push([today(),s.s]);save();render()}
