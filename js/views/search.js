// Search screen: one box, type filters with counts, results open the exact item
let sfil='all';const SK=[['all','All'],['recs','Recordings'],['notes','Notes'],['pieces','Pieces'],['res','Resources'],['cal','Calendar'],['rt','Routines']];
const rcard=(k,a,b,kind,title,sub)=>`<div class="card sr" data-k="${k}" data-a="${E(a)}" data-b="${E(b||'')}" onclick="goRes(this.dataset.k,this.dataset.a,this.dataset.b)"><div class="mu kind">${E(kind)}</div><b>${E(title)}</b>${sub?`<div class="mu" style="margin-top:4px">${E(sub)}</div>`:''}</div>`;
function searchHtml(q){const o=searchAll(q);if(!o)return '<div class="empty">Type to search. Try a tag, a piece name, a date like 2026-10, a month name, or words from your notes.</div>';
 const notes=[];o.recs.forEach(({r,hits})=>hits.forEach(n=>notes.push({r,n})));
 const cals=[...o.cal.map(x=>({k:'cal',d:x.d,t:x.it.text,s:x.d+(x.it.min?' - '+x.it.min+' min':'')})),...o.dn.map(x=>({k:'dn',d:x.d,t:x.n.text,s:x.d+' - note'}))],
  cnt={recs:o.recs.length,notes:notes.length,pieces:o.pieces.length,res:o.res.length,cal:cals.length,rt:o.rt.length},tot=Object.values(cnt).reduce((a,b)=>a+b,0),
  seg=`<div class="seg">${SK.map(([k,l])=>`<button class="${sfil===k?'on':''}" onclick="sfil='${k}';doSearch(sq)">${l}${k==='all'?' '+tot:cnt[k]?' '+cnt[k]:''}</button>`).join('')}</div>`;
 if(!tot)return seg+'<div class="empty">Nothing found.</div>';
 const w=k=>sfil==='all'||sfil===k,c=[];
 if(w('recs'))o.recs.forEach(({r})=>c.push(rcard('rec',r.id,'','Recording',r.title,r.date+' - '+pname(r.piece))));
 if(w('notes'))notes.forEach(({r,n})=>c.push(rcard('note',r.id,n.id,'Note','['+fmt(n.t)+'] '+n.text,r.title)));
 if(w('pieces'))o.pieces.forEach(p=>c.push(rcard('piece',p.id,'','Piece',p.name,p.status)));
 if(w('res'))o.res.forEach(x=>c.push(rcard('res',x.id,'','Resource',x.t,x.u)));
 if(w('cal'))cals.forEach(x=>c.push(rcard(x.k,x.d,'',x.k==='dn'?'Day note':'Calendar',x.t,x.s)));
 if(w('rt'))o.rt.forEach(r=>c.push(rcard('rt',r.id,'','Routine',r.name,r.days.slice().sort().map(i=>DAYS[i]).join(', '))));
 return seg+`<div class="grid">${c.slice(0,90).join('')}</div>`}
V.search=function(){return `<h2>Search</h2><input id="sq" class="sbig" autofocus placeholder="Search recordings, notes, pieces, resources, tags, dates..." value="${E(sq)}" oninput="doSearch(this.value)" autocomplete="off"><div class="chipscroll" style="margin:12px 0">${db.tags.map(t=>`<button class="chip" data-t="${E(t)}" onclick="addTerm(this.dataset.t)">${E(t)}</button>`).join('')}</div><div id="sres">${searchHtml(sq)}</div>`};
