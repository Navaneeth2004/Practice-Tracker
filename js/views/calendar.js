// Calendar screen
V.sched=function(){const y=cm.getFullYear(),m=cm.getMonth(),first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),T=today(),cells=[];
 for(let i=0;i<first;i++)cells.push('<div></div>');
 for(let d=1;d<=dim;d++){const k=dstr(new Date(y,m,d)),it=db.cal[k]||[],ok=it.length&&it.every(x=>db.done[k+'#'+x.id]);
  cells.push(`<button class="day${k===sel?' sel':''}${k===T?' now':''}" onclick="sel='${k}';render()"><b>${d}</b>${it.length?`<span class="dot${ok?' ok':''}"></span>`:''}${db.log[k]?`<small>${db.log[k]}m</small>`:''}</button>`)}
 const items=db.cal[sel]||[],pd=new Date(sel+'T00:00');
 return `<h2>Calendar</h2><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:12px"><button class="b s" onclick="shiftM(-1)">Prev</button><b style="font:700 19px Fraunces,Georgia,serif">${cm.toLocaleString('default',{month:'long'})} ${y}</b><span class="row"><button class="b s" onclick="cm=new Date();cm.setDate(1);sel=today();render()">Today</button><button class="b s" onclick="shiftM(1)">Next</button></span></div>
 <div class="cal">${DAYS.map(d=>`<div class="wd">${d}</div>`).join('')}${cells.join('')}</div>
 <div class="mu" style="margin-top:10px">Gold dot: planned. Green dot: all done. Number: minutes practiced.</div></div>
 <div class="card"><h3 style="margin-top:0">${pd.toLocaleDateString('default',{weekday:'long',day:'numeric',month:'long'})}</h3>
 ${items.map(it=>{const k=sel+'#'+it.id;if(ed==='c:'+k)return `<div class="form" style="margin:8px 0"><input id="cet" class="wide" value="${E(it.text)}"><input id="cem" type="number" min="0" value="${it.min||''}" placeholder="Minutes"><button class="b" onclick="saveCal('${it.id}')">Save</button>${cancel}</div>`;
  return `<div class="row" style="padding:6px 0"><label class="row" style="flex:1"><input type="checkbox" ${db.done[k]?'checked':''} onchange="db.done['${k}']=this.checked;save();render()"> ${E(it.text)}${it.min?` <span class="mu">${it.min} min</span>`:''}</label><span>${edb('c:'+k,`db.cal['${sel}']=db.cal['${sel}'].filter(x=>x.id!=='${it.id}');delete db.done['${k}'];save();render()`)}</span></div>`}).join('')||'<div class="mu" style="margin-bottom:8px">Nothing on this day yet.</div>'}
 <div class="form" style="margin-top:10px"><input id="ct" class="wide" placeholder="Plan or log something (e.g. Moonlight bars 17-24)"><input id="cmn" type="number" min="0" placeholder="Minutes (optional)"><button class="b" onclick="addCal()">Add</button></div>
 <h3>Minutes practiced this day</h3><div class="row"><input id="lm" type="number" min="0" value="${db.log[sel]||''}" placeholder="Minutes" style="max-width:160px;flex:none"><button class="b s" onclick="setLog()">Save minutes</button></div></div>`};
