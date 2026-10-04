// Export and import
function exp(k){let o;if(k==='json')o=JSON.stringify(db);else o=db.recs.map(r=>`${r.title} (${r.date}, ${pname(r.piece)}) rating ${r.rating||'-'}\nWent well: ${r.good||'-'}\nTo fix: ${(r.fix||'-').replace(/\n/g,'; ')}\n`+(r.notes||[]).sort((a,b)=>a.t-b.t).map(n=>`  ${fmt(n.t)} [${n.type}] ${n.sec||''} ${n.tag||''}: ${n.text}`).join('\n')).join('\n\n');
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([o],{type:'text/plain'}));a.download=(k==='json'?'practice-backup-':'practice-notes-')+today()+(k==='json'?'.json':'.txt');document.body.appendChild(a);a.click();a.remove()}catch(e){}
 db.lastExport=Date.now();save();$('#ex').value=o}
function readF(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#im').value=r.result};r.readAsText(f)}
function imp(merge){try{const d=JSON.parse($('#im').value);if(!merge){db=Object.assign(db,d)}else{for(const k of ['pieces','recs','res']){const ids=new Set(db[k].map(x=>x.id));(d[k]||[]).forEach(x=>{if(!ids.has(x.id))db[k].push(x)})}
 for(const k of ['log','done','st','sched']){db[k]=Object.assign({},d[k]||{},db[k])}}
 ensureTags(d.tags||[]);save();msg='Import complete.'}catch(e){msg='Could not read that backup.'}render()}
function copyEx(b){const t=$('#ex');if(!t.value)return;t.select();try{document.execCommand('copy');b.textContent='Copied'}catch(e){b.textContent='Select the text and copy it'}setTimeout(()=>{b.textContent='Copy to clipboard'},1600)}
function askExp(k){ask(k==='json'?'Export backup':'Export notes as text',k==='json'?'This creates a copy of all your data. Keep the file private.':'This creates a readable text copy of your recordings and notes.','Export',()=>exp(k))}
function askImp(merge){if(!$('#im').value.trim()){need('Nothing to import','Choose a backup file or paste the backup text first.','#im');return}
 merge?ask('Merge backup','Items from the backup are added to this device. Existing items are kept.','Merge',()=>imp(1)):ask('Replace everything','All data on this device is replaced by the backup. Anything not in the backup is lost. This cannot be undone.','Replace everything',()=>imp(0),1)}
