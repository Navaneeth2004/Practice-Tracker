// Search across recordings, notes, pieces, resources and calendar items
const dayWords=d=>{try{return new Date(d+'T00:00').toLocaleString('default',{weekday:'long',month:'long',year:'numeric'})}catch(e){return ''}};
function searchAll(q){const terms=q.toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return null;
 const has=(h,t)=>h.toLowerCase().includes(t),ok=h=>terms.every(t=>has(h,t)),out={recs:[],pieces:[],res:[],cal:[],dn:[],rt:[]};
 db.recs.forEach(r=>{const nh=(r.notes||[]).map(n=>[n.sec,n.tag,n.text,n.type==='needs'?'needs work':n.type==='good'?'good':'question',fmt(n.t)].join(' '));
  const h=[r.title,r.date,dayWords(r.date),pname(r.piece),r.url,r.fileName,(r.tags||[]).join(' '),r.good,r.fix,r.rating?r.rating+'/10':'',nh.join(' ')].join(' ');
  if(ok(h))out.recs.push({r,hits:(r.notes||[]).filter((n,i)=>terms.some(t=>has(nh[i],t)))})});
 db.pieces.forEach(p=>{if(ok([p.name,p.status,(p.tags||[]).join(' ')].join(' ')))out.pieces.push(p)});
 db.res.forEach(x=>{if(ok([x.t,x.u,(x.tags||[]).join(' ')].join(' ')))out.res.push(x)});
 for(const d in db.cal)db.cal[d].forEach(it=>{if(ok([d,dayWords(d),it.text,it.min?it.min+' min':''].join(' ')))out.cal.push({d,it})});
 for(const d in (db.cnotes||{}))db.cnotes[d].forEach(n=>{if(ok([d,dayWords(d),n.text,'note'].join(' ')))out.dn.push({d,n})});
 plans().forEach(r=>{const pn=(r.pieces||[]).map(id=>pname(id)).join(' ');if(ok([r.name,r.tempo,(r.items||[]).map(i=>i.text).join(' '),pn,(r.days||[]).map(i=>DAYS[i]).join(' '),'routine'].join(' ')))out.rt.push(r)});
 return out}
