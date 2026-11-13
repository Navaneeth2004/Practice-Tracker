// Calendar actions (forms open in the side panel)
cm.setDate(1);
function shiftM(n){cm=new Date(cm.getFullYear(),cm.getMonth()+n,1);render()}
function goToday(){cm=new Date();cm.setDate(1);sel=today();render()}
function pickDay(k){sel=k;render();if(innerWidth<900){const p=$('#daypanel');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})}}
function calAdd(){const t=$('#ct').value.trim();if(!t){need('Add something to do','Write what you want to practice or log for this day.','#ct');return}(db.cal[sel]=db.cal[sel]||[]).push({id:uid(),text:t,min:+$('#cmn').value||0});save();render()}
function calItemSheet(id){const it=(db.cal[sel]||[]).find(x=>x.id===id);if(!it)return;
 sheet('Edit task',`<div class="form"><input id="cet" class="wide" value="${E(it.text)}"><input id="cem" class="wide" type="number" min="0" placeholder="Minutes" value="${it.min||''}"></div>`,`<button class="b danger" style="margin-right:auto" onclick="askDelCal('${id}')">Delete</button><button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveCal('${id}')">Save</button>`)}
function saveCal(id){const it=db.cal[sel].find(x=>x.id===id),t=$('#cet').value.trim();if(t)it.text=t;it.min=+$('#cem').value||0;save();closeSheet();render()}
function askDelCal(id){ask('Delete task','This task will be removed from the calendar.','Delete',()=>{closeSheet();delCal(sel,id)},1)}
function delCal(d,id){db.cal[d]=(db.cal[d]||[]).filter(x=>x.id!==id);delete db.done[d+'#'+id];save();render()}
function setLog(){const v=Math.max(0,Math.round(+$('#lm').value||0));if(v)db.log[sel]=v;else delete db.log[sel];save();render();toast(v?'Logged '+v+' min':'Minutes cleared')}
function addDayNote(){const t=$('#dnt').value.trim();if(!t){need('Write a note','Type what you want to remember about this day.','#dnt');return}(db.cnotes=db.cnotes||{});(db.cnotes[sel]=db.cnotes[sel]||[]).push({id:uid(),text:t,at:Date.now()});save();render()}
function dnoteSheet(id){const n=dnList(sel).find(x=>x.id===id);if(!n)return;
 sheet('Edit note',`<textarea id="dne" style="min-height:140px">${E(n.text)}</textarea>`,`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveDayNote('${id}')">Save</button>`)}
function saveDayNote(id){const n=dnList(sel).find(x=>x.id===id),t=$('#dne').value.trim();if(n&&t){n.text=t;n.at=Date.now()}save();closeSheet();render()}
function askDelDayNote(id){ask('Delete note','This note will be removed from this day.','Delete',()=>delDayNote(sel,id),1)}
function setDays(a){document.querySelectorAll('#rdays .chip').forEach(c=>c.classList.toggle('on',a.includes(+c.dataset.d)))}
function routineSheet(id){const r=id?plans().find(x=>x.id===id):null,v=r||{name:'',tempo:'',days:[],items:[],pieces:[],min:'',from:today(),to:''};
 sheet(r?'Edit routine':'New routine',`<div class="form"><input id="rn" class="wide" placeholder="Name (e.g. Slow tempo day)" value="${E(v.name)}"><input id="rt" class="wide" placeholder="Tempo note (optional, e.g. 60 BPM, hands separate)" value="${E(v.tempo||'')}"></div>
 <div class="lbl">Days</div><div class="chips" id="rdays">${DAYS.map((d,i)=>`<button type="button" class="chip${(v.days||[]).includes(i)?' on':''}" data-d="${i}" onclick="this.classList.toggle('on')">${d}</button>`).join('')}</div>
 <div class="row" style="margin-top:8px"><button type="button" class="b s sm" onclick="setDays([0,1,2,3,4,5,6])">Every day</button><button type="button" class="b s sm" onclick="setDays([1,2,3,4,5])">Weekdays</button><button type="button" class="b s sm" onclick="setDays([0,6])">Weekend</button></div>
 <div class="lbl">What to practice (one per line)</div><textarea id="ri" placeholder="Major scales&#10;Arpeggios">${E((v.items||[]).map(i=>i.text).join('\n'))}</textarea>
 <div class="lbl">Pieces on these days</div>${db.pieces.length?`<div class="chips" id="rpcs">${db.pieces.map(p=>`<button type="button" class="chip${(v.pieces||[]).includes(p.id)?' on':''}" data-p="${E(p.id)}" onclick="this.classList.toggle('on')">${E(p.name)}</button>`).join('')}</div>`:'<div id="rpcs" class="mu">Add pieces in the Pieces tab first.</div>'}
 <div class="form" style="margin-top:14px"><div><div class="lbl" style="margin-top:0">Minutes (optional)</div><input id="rm" type="number" min="0" value="${v.min||''}"></div><div><div class="lbl" style="margin-top:0">Starts</div><input id="rf" type="date" value="${E(v.from||today())}"></div><div><div class="lbl" style="margin-top:0">Ends (optional)</div><input id="ru" type="date" value="${E(v.to||'')}"></div></div>`,
 (r?`<button class="b danger" style="margin-right:auto" onclick="askDelRoutine('${id}')">Delete</button>`:'')+`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveRoutine('${id||''}')">${r?'Save':'Add routine'}</button>`)}
function saveRoutine(id){const name=$('#rn').value.trim(),days=[...document.querySelectorAll('#rdays .chip.on')].map(c=>+c.dataset.d),pcs=[...document.querySelectorAll('#rpcs .chip.on')].map(c=>c.dataset.p),lines=$('#ri').value.split('\n').map(x=>x.trim()).filter(Boolean);
 if(!name){need('Name the routine','Give it a name, for example Slow tempo day.','#rn');return}
 if(!days.length){need('Pick the days','Choose at least one day of the week for this routine.','#rdays');return}
 if(!lines.length&&!pcs.length){need('Add something to practice','Write at least one thing to practice, or pick a piece.','#ri');return}
 const old=id?plans().find(x=>x.id===id):null,pool=old?(old.items||[]).slice():[];
 const items=lines.map(t=>{const i=pool.findIndex(x=>x.text===t);return i>=0?pool.splice(i,1)[0]:{id:uid(),text:t}});
 const r={id:old?old.id:uid(),name,tempo:$('#rt').value.trim(),days,items,pieces:pcs,min:+$('#rm').value||0,from:$('#rf').value||today(),to:$('#ru').value||'',on:old?old.on!==false:true};
 if(old)Object.assign(old,r);else plans().push(r);save();closeSheet();render()}
function askDelRoutine(id){ask('Delete routine','The routine is removed from every day. Days you already ticked off stay counted.','Delete',()=>{closeSheet();delRoutine(id)},1)}
