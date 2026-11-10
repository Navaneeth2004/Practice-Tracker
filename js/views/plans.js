// Views for day notes, weekly routines and piece tempo (used by the Calendar, Today and Pieces screens)

// rows of one routine for one day, with tick boxes
function routineBlock(r,d){const rows=routineRows(r,d);
 return `<div style="padding:8px 0;border-top:1px solid var(--bd)"><div class="row"><b>${E(r.name)}</b>${r.tempo?`<span class="tag">${E(r.tempo)}</span>`:''}${r.min?`<span class="mu">${r.min} min</span>`:''}</div>
 ${rows.map(x=>`<label class="chk"><input type="checkbox" ${db.done[x.key]?'checked':''} onchange="tickRow('${x.key}',this.checked)"><span>${E(x.text)}${x.sub?` <span class="mu">${E(x.sub)}</span>`:''}</span></label>`).join('')}</div>`}

// shown on Today
function routineToday(){const rs=routineFor(today());if(!rs.length)return '';
 return `<div class="card"><h3 style="margin-top:0">Routine today</h3>${rs.map(r=>routineBlock(r,today())).join('').replace('border-top:1px solid var(--bd)','border-top:0')}</div>`}

// shown on Calendar, under the selected day
function dayPlus(){const rs=routineFor(sel),notes=dnList(sel);
 const routine=rs.length?`<div class="card"><h3 style="margin-top:0">Weekly routine</h3>${rs.map(r=>routineBlock(r,sel)).join('').replace('border-top:1px solid var(--bd)','border-top:0')}</div>`:'';
 const nl=notes.map(n=>ed==='n:'+n.id
  ?`<div style="margin:8px 0"><textarea id="dne">${E(n.text)}</textarea><div class="row"><button class="b" onclick="saveDayNote('${n.id}')">Save</button>${cancel}</div></div>`
  :`<div class="row" style="align-items:flex-start;padding:8px 0;border-top:1px solid var(--bd)"><div class="ntext" style="flex:1;margin-top:0;min-width:0;overflow-wrap:anywhere">${E(n.text)}</div><span>${edb('n:'+n.id,`ask('Delete note','This note will be removed from this day.','Delete',()=>delDayNote('${sel}','${n.id}'),1)`)}</span></div>`).join('');
 const notesCard=`<div class="card"><h3 style="margin-top:0">Notes for this day</h3>${nl||'<div class="mu" style="margin-bottom:8px">No notes yet.</div>'}
  <textarea id="dnt" placeholder="Write anything about this day: what went well, what to remember, ideas for tomorrow" style="margin-top:10px"></textarea><button class="b" onclick="addDayNote()">Add note</button></div>`;
 return routine+notesCard+routinesCard()}

// the routine manager
function ruleForm(r){const n=!r;r=r||{name:'',tempo:'',days:[],items:[],pieces:[],min:'',from:today(),to:''};
 return `<div class="card" id="nform" style="border-color:var(--ac)"><h3 style="margin-top:0">${n?'New routine':'Edit routine'}</h3>
 <div class="form"><input id="rn" class="wide" placeholder="Name (e.g. Slow tempo day)" value="${E(r.name)}"><input id="rt" class="wide" placeholder="Tempo note (optional, e.g. 60 BPM, metronome, hands separate)" value="${E(r.tempo||'')}"></div>
 <div class="lbl">Days</div><div class="chips" id="rdays">${DAYS.map((d,i)=>`<button type="button" class="chip${(r.days||[]).includes(i)?' on':''}" data-d="${i}" onclick="this.classList.toggle('on')">${d}</button>`).join('')}</div>
 <div class="lbl">What to practice (one per line)</div><textarea id="ri" placeholder="Major scales&#10;Arpeggios">${E((r.items||[]).map(i=>i.text).join('\n'))}</textarea>
 <div class="lbl">Pieces on these days</div>${db.pieces.length?`<div class="chips" id="rpcs">${db.pieces.map(p=>`<button type="button" class="chip${(r.pieces||[]).includes(p.id)?' on':''}" data-p="${p.id}" onclick="this.classList.toggle('on')">${E(p.name)}</button>`).join('')}</div>`:'<div id="rpcs" class="mu">Add pieces in the Pieces tab first.</div>'}
 <div class="form" style="margin-top:14px"><div><div class="lbl" style="margin-top:0">Minutes (optional)</div><input id="rm" type="number" min="0" value="${r.min||''}"></div><div><div class="lbl" style="margin-top:0">Starts</div><input id="rf" type="date" value="${r.from||today()}"></div><div><div class="lbl" style="margin-top:0">Ends (optional)</div><input id="ru" type="date" value="${r.to||''}"></div></div>
 <div class="row" style="margin-top:14px"><button class="b" onclick="saveRoutine('${n?'':r.id}')">${n?'Add routine':'Save'}</button>${cancel}</div></div>`}

function routinesCard(){
 const list=plans().map(r=>{if(ed==='r:'+r.id)return ruleForm(r);
  const pn=(r.pieces||[]).map(id=>(db.pieces.find(p=>p.id===id)||{}).name).filter(Boolean);
  return `<div style="padding:10px 0;border-top:1px solid var(--bd)${r.on===false?';opacity:.55':''}"><div class="row"><b>${E(r.name)}</b>${r.tempo?`<span class="tag">${E(r.tempo)}</span>`:''}${r.on===false?'<span class="mu">paused</span>':''}<span style="margin-left:auto">${edb('r:'+r.id,`ask('Delete routine','The routine is removed from every day. Days you already ticked off stay counted.','Delete',()=>delRoutine('${r.id}'),1)`)}</span></div>
  <div class="mu" style="margin-top:4px">${(r.days||[]).slice().sort().map(i=>DAYS[i]).join(', ')}${r.min?' &middot; '+r.min+' min':''}${r.from?' &middot; from '+fmtDate(r.from):''}${r.to?' to '+fmtDate(r.to):''}</div>
  ${(r.items||[]).length?`<div style="margin-top:6px">${E((r.items||[]).map(i=>i.text).join(', '))}</div>`:''}${pn.length?`<div class="mu" style="margin-top:4px">Pieces: ${E(pn.join(', '))}</div>`:''}
  <button class="b s sm" style="margin-top:8px" onclick="toggleRoutine('${r.id}')">${r.on===false?'Resume':'Pause'}</button></div>`}).join('');
 return `<div class="card"><div class="row between"><h3 style="margin:0">Weekly routines</h3>${ed==='r:new'?'':`<button class="b sm" onclick="ed='r:new';render()">New routine</button>`}</div>
 <div class="mu" style="margin-top:8px">Set what you practice on repeating days, for example Slow tempo day on Mon, Wed, Thu, Sat, Sun and another routine for the other days. It appears on those days in the calendar and on Today. Changes only affect the days from the start date onward.</div>
 ${list?`<div style="margin-top:8px">${list}</div>`:''}</div>${ed==='r:new'?ruleForm(null):''}`}

// piece tempo, shown on each piece card
function tempoBlock(p){const hist=(p.tl||[]).slice(-4).reverse(),pct=p.tempo&&p.goal?Math.min(100,Math.round(p.tempo/p.goal*100)):0;
 return `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--bd)"><div class="row"><b style="font-size:14px">Tempo</b>${p.tempo?`<span class="tag">${p.tempo} BPM now</span>`:'<span class="mu">not set</span>'}${p.goal?`<span class="mu">goal ${p.goal} BPM${p.tempo?' &middot; '+pct+'%':''}</span>`:''}</div>
 ${p.tempo&&p.goal?`<div style="height:6px;border-radius:4px;background:rgba(255,255,255,.08);margin-top:8px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(135deg,var(--ac),var(--ac2))"></div></div>`:''}
 <div class="row" style="margin-top:10px"><input id="tb-${p.id}" type="number" min="1" max="400" placeholder="Now (BPM)" value="${p.tempo||''}" style="max-width:130px;flex:none"><input id="tg-${p.id}" type="number" min="1" max="400" placeholder="Goal (BPM)" value="${p.goal||''}" style="max-width:130px;flex:none"><button class="b s sm" onclick="setTempo('${p.id}')">Set tempo</button>${p.tempo||p.goal?`<button class="x" onclick="clearTempo('${p.id}')">Clear</button>`:''}</div>
 ${hist.length>1?`<div class="mu" style="margin-top:8px">${hist.map(h=>fmtDate(h.d).replace(/ \d{4}$/,'')+': '+h.bpm).join(' &middot; ')}</div>`:''}</div>`}
