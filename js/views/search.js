// Search screen
V.search=function(){return `<h2>Search</h2><div class="card"><input id="sq" style="width:100%" placeholder="Search recordings, notes, pieces, resources, tags, dates..." value="${E(sq)}" oninput="doSearch(this.value)" autocomplete="off"><div class="mu" style="margin:12px 0 8px">Tap a tag to add it to your search</div><div class="chips">${db.tags.map(t=>`<button class="chip" data-t="${E(t)}" onclick="addTerm(this.dataset.t)">${E(t)}</button>`).join('')}</div></div><div id="sres">${searchHtml(sq)}</div>`};
function searchHtml(q){const o=searchAll(q);if(!o)return '<div class="mu">Type to search. Try a tag, a piece name, a date like 2026-10 or a month name, or words from your notes.</div>';
 const n=o.recs.length+o.pieces.length+o.res.length+o.cal.length;if(!n)return '<div class="card mu">Nothing found.</div>';
 const sec=(t,a)=>a.length?`<h3>${t} (${a.length})</h3>`+a.join(''):'';
 return sec('Recordings',o.recs.map(({r,hits})=>`<div class="card" style="cursor:pointer" onclick="openRec='${r.id}';tab='review';render()"><b>${E(r.title)}</b><div class="mu">${r.date} - ${E(pname(r.piece))}</div>${chipLine(r.tags,8)}${hits.slice(0,3).map(h=>`<div class="mu" style="margin-top:6px">${fmt(h.t)} - ${E(h.text)}</div>`).join('')}</div>`))
 +sec('Pieces',o.pieces.map(p=>`<div class="card" style="cursor:pointer" onclick="tab='pieces';render()"><b>${E(p.name)}</b> <span class="tag">${p.status}</span>${chipLine(p.tags,8)}</div>`))
 +sec('Resources',o.res.map(x=>`<div class="card" style="cursor:pointer" onclick="tab='res';render()"><b>${E(x.t)}</b>${chipLine(x.tags,8)}<div class="mu link">${E(x.u)}</div></div>`))
 +sec('Calendar',o.cal.map(({d,it})=>`<div class="card" style="cursor:pointer" onclick="sel='${d}';cm=new Date(sel+'T00:00');cm.setDate(1);tab='sched';render()"><b>${E(it.text)}</b><div class="mu">${d}${it.min?' - '+it.min+' min':''}</div></div>`))}
function doSearch(v){sq=v;$('#sres').innerHTML=searchHtml(v)}
function addTerm(t){sq=(sq+' '+t).trim();$('#sq').value=sq;doSearch(sq)}
