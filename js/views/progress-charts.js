// Progress: analytics grid (adds charts, drops "Recently resolved")
const _prog=V.prog;
function bars(v,l){const m=Math.max(...v,1);return `<div class="bars">${v.map((x,i)=>`<i style="height:${Math.round(x/m*100)}%" title="${E(l[i])}: ${x}"></i>`).join('')}</div><div class="bl">${l.map(x=>`<span>${E(x)}</span>`).join('')}</div>`}
V.prog=function(){const t=document.createElement('template');t.innerHTML=_prog();const k=[...t.content.children];
 const d14=[],l14=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);d14.push(db.log[dstr(d)]||0);l14.push(d.getDate())}
 const wd=[0,0,0,0,0,0,0];for(const d in db.log)wd[new Date(d+'T00:00').getDay()]+=db.log[d]||0;
 const tot=Object.values(db.log).reduce((a,b)=>a+b,0),days=Object.keys(db.log).length,notes=db.recs.reduce((n,r)=>n+(r.notes||[]).length,0);
 const rated=db.recs.filter(r=>r.rating).sort((a,b)=>a.date<b.date?-1:1).slice(-14);
 const byP=db.pieces.map(p=>{const rs=db.recs.filter(r=>r.piece===p.id&&r.rating);return[p.name,rs.length?rs.reduce((a,r)=>a+r.rating,0)/rs.length:0]}).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]).slice(0,8);
 const c=(h,b)=>`<div class="card"><b>${h}</b><div style="margin-top:12px">${b}</div></div>`;
 return k[0].outerHTML+k[1].outerHTML+k[2].outerHTML+`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(310px,1fr))">`
 +c('Minutes, last 14 days',bars(d14,l14))+c('Minutes by weekday',bars(wd,DAYS.map(x=>x[0])))
 +c('Recording ratings',rated.length?bars(rated.map(r=>r.rating),rated.map((r,i)=>i+1)):'<div class="mu">Rate a recording to see this.</div>')
 +c('Average rating by piece',byP.map(([n,v])=>`<div class="row" style="padding:4px 0;flex-wrap:nowrap"><span style="width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(n)}</span><span class="hb"><i style="width:${v*10}%"></i></span><span class="mu">${v.toFixed(1)}</span></div>`).join('')||'<div class="mu">No ratings yet.</div>')
 +c('Totals',`<div class="row between"><span class="mu">Total minutes</span><b>${tot}</b></div><div class="row between"><span class="mu">Days logged</span><b>${days}</b></div><div class="row between"><span class="mu">Average per day</span><b>${days?Math.round(tot/days):0} min</b></div><div class="row between"><span class="mu">Recordings</span><b>${db.recs.length}</b></div><div class="row between"><span class="mu">Notes</span><b>${notes}</b></div>`)
 +k[3].outerHTML+`</div>`};
