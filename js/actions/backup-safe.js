// Safer import: validates the backup, and Merge now includes calendar items and folders
const ARR=['pieces','recs','res','folders','tags','plans'],OBJ=['cal','log','done','st','sched','cnotes'];
function cleanBackup(d){if(!d||typeof d!=='object'||Array.isArray(d))throw 0;const o={};
 ARR.forEach(k=>{if(d[k]!=null){if(!Array.isArray(d[k]))throw 0;o[k]=d[k].filter(x=>k==='tags'?typeof x==='string':x&&typeof x==='object'&&/^[\w-]{1,40}$/.test(x.id))}});
 OBJ.forEach(k=>{if(d[k]!=null){if(typeof d[k]!=='object'||Array.isArray(d[k]))throw 0;o[k]=d[k]}});return deepClean(o)}
function imp(merge){try{const d=cleanBackup(JSON.parse($('#im').value));
 if(!merge){db=Object.assign({cal:{},pieces:[],recs:[],res:[],sched:{},done:{},log:{},st:{},lastExport:null},d,{timer:db.timer})}
 else{for(const k of ['pieces','recs','res','folders']){db[k]=db[k]||[];const ids=new Set(db[k].map(x=>x.id));(d[k]||[]).forEach(x=>{if(!ids.has(x.id))db[k].push(x)})}
  for(const k in d.cal||{}){const have=new Set((db.cal[k]||[]).map(x=>x.id));(Array.isArray(d.cal[k])?d.cal[k]:[]).forEach(x=>{if(x&&!have.has(x.id))(db.cal[k]=db.cal[k]||[]).push(x)})}
  for(const k of ['log','done','st','sched']){db[k]=Object.assign({},d[k]||{},db[k])}mergePlus(d)}
 if(!db.tags)db.tags=TECH.slice();ensureTags(d.tags||[]);db.res.forEach(r=>{if(!r.tags)r.tags=[]});save();msg='Import complete.'}catch(e){msg='Could not read that backup. Nothing was changed.'}render()}
