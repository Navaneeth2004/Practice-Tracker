// Progress screen: dashboard of stats and charts (range switch for the trend)
let prange='w4';
function bars(v,l,mx){const m=mx||Math.max(...v,1);return `<div class="bars">${v.map((x,i)=>`<i style="height:${Math.round(x/m*100)}%" title="${E(l[i])}: ${x}"></i>`).join('')}</div><div class="bl">${l.map(x=>`<span>${E(x)}</span>`).join('')}</div>`}
const hrow=(n,v,m,t)=>`<div class="row" style="padding:4px 0;flex-wrap:nowrap"><span style="width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(n)}</span><span class="hb"><i style="width:${Math.round(v/m*100)}%"></i></span><span class="mu" style="min-width:34px;text-align:right">${t}</span></div>`;
const sumKeys=p=>Object.keys(db.log).filter(k=>k.startsWith(p)).reduce((n,k)=>n+(db.log[k]||0),0);
function trendData(){const v=[],l=[];
 if(prange==='w4')for(let i=27;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);v.push(db.log[dstr(d)]||0);l.push(i%7===0?d.getDate():'')}
 else if(prange==='w12')for(let w=11;w>=0;w--){let s=0,d;for(let i=0;i<7;i++){d=new Date();d.setDate(d.getDate()-w*7-i);s+=db.log[dstr(d)]||0}v.push(s);l.push(w%3===0?d.getDate()+'/'+(d.getMonth()+1):'')}
 else for(let m=11;m>=0;m--){const d=new Date(new Date().getFullYear(),new Date().getMonth()-m,1);v.push(sumKeys(dstr(d).slice(0,7)));l.push(d.toLocaleString('default',{month:'short'})[0])}
 return[v,l]}
function heatmap(a){const c=[],now=new Date(),s=new Date(),W=innerWidth<700?26:52;s.setDate(s.getDate()-now.getDay()-(W-1)*7);
 for(let i=0;i<W*7;i++){const d=new Date(s);d.setDate(d.getDate()+i);const k=dstr(d);c.push(`<i class="${d>now?'f':a.has(k)?'a':''}" title="${k}${db.log[k]?' - '+db.log[k]+' min':''}"></i>`)}
 return `<div class="mu" style="margin-bottom:8px">${W===52?'Last 12 months':'Last 6 months'}</div><div class="hm" style="grid-template-columns:repeat(${W},1fr)">${c.join('')}</div>`}
V.prog=function(){const s=streaks(),a=active(),T=today(),[tv,tl]=trendData(),tile=(n,l)=>`<div class="tile"><div class="big">${n}</div><div class="mu">${l}</div></div>`,c=(h,b)=>`<div class="card"><b>${h}</b><div style="margin-top:12px">${b}</div></div>`;
 let wk=0;for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);wk+=db.log[dstr(d)]||0}
 const wd=[0,0,0,0,0,0,0];for(const d in db.log)wd[new Date(d+'T00:00').getDay()]+=db.log[d]||0;
 const tot=Object.values(db.log).reduce((x,y)=>x+y,0),days=Object.keys(db.log).length,notes=db.recs.flatMap(r=>r.notes||[]),open=notes.filter(n=>n.type==='needs'&&!n.done).length,done=notes.filter(n=>n.type==='needs'&&n.done).length;
 const rated=db.recs.filter(r=>r.rating).sort((x,y)=>x.date<y.date?-1:1).slice(-14),
  byP=db.pieces.map(p=>{const r=db.recs.filter(x=>x.piece===p.id&&x.rating);return[p.name,r.length?r.reduce((x,y)=>x+y.rating,0)/r.length:0]}).filter(x=>x[1]).sort((x,y)=>y[1]-x[1]).slice(0,8),
  tg={};notes.forEach(n=>{if(n.type==='needs'&&n.tag)tg[n.tag]=(tg[n.tag]||0)+1});const fl=Object.entries(tg).sort((x,y)=>y[1]-x[1]).slice(0,8),
  tp=db.pieces.filter(p=>(p.tl||[]).length>1).map(p=>[p.name,p.tl[0].bpm,p.tempo||p.tl[p.tl.length-1].bpm]).sort((x,y)=>(y[2]-y[1])-(x[2]-x[1])).slice(0,6);
 const bd=Object.entries(db.log).sort((x,y)=>y[1]-x[1])[0],mp=db.pieces.map(p=>[p.name,db.recs.filter(r=>r.piece===p.id).length]).sort((x,y)=>y[1]-x[1])[0],allR=db.recs.filter(r=>r.rating),
  hl=`<div class="row between" style="padding:3px 0"><span class="mu">Best day</span><b>${bd?bd[1]+' min, '+fmtDate(bd[0]):'-'}</b></div><div class="row between" style="padding:3px 0"><span class="mu">Most recorded piece</span><b>${mp&&mp[1]?E(mp[0])+' ('+mp[1]+')':'-'}</b></div><div class="row between" style="padding:3px 0"><span class="mu">Average rating</span><b>${allR.length?(allR.reduce((x,y)=>x+y.rating,0)/allR.length).toFixed(1)+' / 10':'-'}</b></div><div class="row between" style="padding:3px 0"><span class="mu">Recordings this month</span><b>${db.recs.filter(r=>(r.date||'').startsWith(T.slice(0,7))).length}</b></div>`;
 const rg=[['w4','4 weeks'],['w12','12 weeks'],['y','Year']];
 return `<h2>Progress</h2><div class="stats4">${tile(s.cur,'Current streak')}${tile(s.best,'Best streak')}${tile(wk,'Min this week')}${tile(sumKeys(T.slice(0,7)),'Min this month')}</div><div class="card">${heatmap(a)}</div>
 <div class="seg">${rg.map(([k,l])=>`<button class="${prange===k?'on':''}" onclick="prange='${k}';render()">${l}</button>`).join('')}</div>
 <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(310px,1fr))">`
 +c('Minutes practiced ('+tv.reduce((x,y)=>x+y,0)+' total)',bars(tv,tl))+c('Minutes by weekday',bars(wd,DAYS.map(x=>x[0])))
 +c('Recording ratings',rated.length?bars(rated.map(r=>r.rating),rated.map((r,i)=>i+1),10):'<div class="mu">Rate a recording to see this.</div>')
 +c('Average rating by piece',byP.map(([n,v])=>hrow(n,v,10,v.toFixed(1))).join('')||'<div class="mu">No ratings yet.</div>')
 +c('Most flagged techniques',fl.map(([n,v])=>hrow(n,v,fl[0][1],v+'x')).join('')||'<div class="mu">None yet.</div>')
 +c('Tempo progress',tp.map(([n,x,y])=>`<div class="row between" style="padding:5px 0;flex-wrap:nowrap"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(n)}</span><span class="mu" style="white-space:nowrap">${x} to ${y} <b class="${y>=x?'good':'bad'}">${y>=x?'+':''}${y-x}</b></span></div>`).join('')||'<div class="mu">Log a tempo on two different days.</div>')
 +c('Fix list',open+done?`<div class="row" style="gap:22px;flex-wrap:nowrap"><div><div class="big" style="font-size:34px;color:var(--bad)">${open}</div><div class="mu">open</div></div><div><div class="big" style="font-size:34px;color:var(--ok)">${done}</div><div class="mu">resolved</div></div><div><div class="big" style="font-size:34px">${Math.round(done/(open+done)*100)}%</div><div class="mu">resolved</div></div></div><div class="stack" style="margin-top:14px"><i style="flex:${open||0.001};background:var(--bad)"></i><i style="flex:${done||0.001};background:var(--ok)"></i></div>`:'<div class="mu">No "needs work" notes yet.</div>')
 +c('Totals',`<div class="row between"><span class="mu">Total minutes</span><b>${tot}</b></div><div class="row between"><span class="mu">Days logged</span><b>${days}</b></div><div class="row between"><span class="mu">Average per day</span><b>${days?Math.round(tot/days):0} min</b></div><div class="row between"><span class="mu">Recordings</span><b>${db.recs.length}</b></div><div class="row between"><span class="mu">Notes</span><b>${notes.length}</b></div>`)+c('Highlights',hl)+`</div>`};
