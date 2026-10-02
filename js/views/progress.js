// Progress screen
V.prog=function(){const s=streaks(),a=active(),cells=[],now=new Date(),st0=new Date(),W=innerWidth<700?26:52;st0.setDate(st0.getDate()-now.getDay()-(W-1)*7);for(let i=0;i<W*7;i++){const d=new Date(st0);d.setDate(d.getDate()+i);const k=dstr(d);cells.push(`<i class="${d>now?'f':a.has(k)?'a':''}" title="${k}${db.log[k]?' - '+db.log[k]+' min':''}"></i>`)}
 let wk=0;for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);wk+=db.log[dstr(d)]||0}
 const tg={};Object.values(flags()).forEach(o=>o.refs.forEach(r=>{if(r.tag)tg[r.tag]=(tg[r.tag]||0)+1}));
 const hist=[];for(const k in db.st)db.st[k].h.forEach(h=>hist.push([h[0],k.replace('|',' / '),h[1]]));hist.sort().reverse();
 return `<h2>Progress</h2><div class="stats"><div class="tile"><div class="big">${s.cur}</div><div class="mu">Current streak</div></div><div class="tile"><div class="big">${s.best}</div><div class="mu">Best streak</div></div><div class="tile"><div class="big">${wk}</div><div class="mu">Min this week</div></div></div>
 <div class="card"><div class="mu" style="margin-bottom:8px">${W===52?'Last 12 months':'Last 6 months'}</div><div class="hm" style="grid-template-columns:repeat(${W},1fr)">${cells.join('')}</div></div>
 <div class="card"><b>Most flagged techniques</b>${Object.entries(tg).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row"><span>${E(k)}</span><span class="mu">${v}x</span></div>`).join('')||'<div class="mu">None yet.</div>'}</div>
 <div class="card"><b>Status history</b>${hist.map(h=>`<div class="mu">${h[0]} - ${E(h[1])} - ${h[2]}</div>`).join('')||'<div class="mu">None yet.</div>'}</div>`};
