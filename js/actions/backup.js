// Export and import, with validation and one-step undo
const ARR=['pieces','recs','res','folders','tags','plans'],OBJ=['cal','log','done','st','sched','cnotes'];
function cleanBackup(d){if(!d||typeof d!=='object'||Array.isArray(d))throw 0;const o={};
 ARR.forEach(k=>{if(d[k]!=null){if(!Array.isArray(d[k]))throw 0;o[k]=d[k].filter(x=>k==='tags'?typeof x==='string':x&&typeof x==='object'&&IDRE.test(String(x.id)))}});
 OBJ.forEach(k=>{if(d[k]!=null){if(typeof d[k]!=='object'||Array.isArray(d[k]))throw 0;o[k]=d[k]}});return deepClean(o)}
function exp(k){const o=k==='json'?JSON.stringify(Object.assign({},db,{timer:null})):db.recs.map(r=>`${r.title} (${r.date}, ${pname(r.piece)}) rating ${r.rating||'-'}\n`+(r.notes||[]).slice().sort((a,b)=>a.t-b.t).map(n=>`  ${fmt(n.t)} [${n.type}] ${n.sec||''} ${n.tag||''}: ${n.text}`).join('\n')).join('\n\n');
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([o],{type:'text/plain'}));a.download=(k==='json'?'practice-backup-':'practice-notes-')+today()+(k==='json'?'.json':'.txt');document.body.appendChild(a);a.click();a.remove()}catch(e){}
 if(k==='json'){db.lastExport=Date.now();save(true)}const t=$('#ex');if(t)t.value=o;toast(k==='json'?'Backup downloaded':'Notes downloaded')}
function askExp(k){ask(k==='json'?'Download backup':'Download notes as text',k==='json'?'This creates a copy of all your data. Keep the file private.':'This creates a readable text copy of your recordings and notes.','Download',()=>exp(k))}
function copyEx(){const t=$('#ex');if(!t||!t.value){need('Nothing to copy','Download an export first, then copy it.','#ex');return}
 const fb=()=>{t.select();try{document.execCommand('copy');toast('Copied')}catch(e){toast('Select the text and copy it')}};
 if(navigator.clipboard)navigator.clipboard.writeText(t.value).then(()=>toast('Copied'),fb);else fb()}
function readF(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#im').value=r.result;importPreview()};r.readAsText(f)}
function importPreview(){const e=$('#ipv'),t=$('#im').value.trim();if(!e)return;if(!t){e.textContent='';return}
 try{const d=cleanBackup(JSON.parse(t));e.className='good';e.textContent='Valid backup: '+counts(d)}catch(x){e.className='bad';e.textContent='This is not a valid backup.'}}
function imp(merge){try{const d=cleanBackup(JSON.parse($('#im').value));try{localStorage.setItem('pt_undo',JSON.stringify(db))}catch(e){}
 if(!merge){db=Object.assign({cal:{},pieces:[],recs:[],res:[],sched:{},done:{},log:{},st:{},lastExport:null},d,{timer:db.timer})}
 else{for(const k of ['pieces','recs','res','folders']){db[k]=db[k]||[];const ids=new Set(db[k].map(x=>x.id));(d[k]||[]).forEach(x=>{if(!ids.has(x.id))db[k].push(x)})}
  for(const k in d.cal||{}){const have=new Set((db.cal[k]||[]).map(x=>x.id));(Array.isArray(d.cal[k])?d.cal[k]:[]).forEach(x=>{if(x&&!have.has(x.id))(db.cal[k]=db.cal[k]||[]).push(x)})}
  for(const k of ['log','done','st','sched']){db[k]=Object.assign({},d[k]||{},db[k])}mergePlus(d)}
 if(!db.tags)db.tags=TECH.slice();ensureTags(d.tags||[]);db.res.forEach(r=>{if(!r.tags)r.tags=[]});save();msg='Import complete.'}catch(e){msg='Could not read that backup. Nothing was changed.'}render()}
function askImp(merge){const v=$('#im').value.trim();if(!v){need('Nothing to import','Choose a backup file or paste the backup text first.','#im');return}
 try{cleanBackup(JSON.parse(v))}catch(e){need('Not a valid backup','This text is not a Practice Log backup. Nothing was changed.','#im');return}
 merge?ask('Merge backup','Items from the backup are added to this device. Existing items are kept.','Merge',()=>imp(1)):ask('Replace everything','All data on this device is replaced by the backup. You can undo this once right after.','Replace everything',()=>imp(0),1)}
function askUndoImport(){ask('Undo last import','This device goes back to how it was before the last import.','Undo',undoImport,1)}
function undoImport(){try{const p=JSON.parse(localStorage.getItem('pt_undo'));if(!p)throw 0;db=Object.assign(p,{timer:db.timer});localStorage.removeItem('pt_undo');save();msg='Restored the data from before the last import.'}catch(e){msg='Nothing to undo.'}render()}
