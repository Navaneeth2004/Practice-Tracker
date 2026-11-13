// Folder and tempo actions
function addFolder(){const v=$('#fn').value.trim();if(!v){need('Name the folder','Type a folder name first.','#fn');return}(db.folders=db.folders||[]).push({id:uid(),name:v});save();render()}
function askFolder(id){ask('Delete folder','The pieces inside stay, and move to Unfiled.','Delete',()=>delFolder(id),1)}
function delFolder(id){db.folders=(db.folders||[]).filter(f=>f.id!==id);db.pieces.forEach(p=>{if(p.folder===id)delete p.folder});if(pf===id)pf='all';save();render()}
function movePiece(id,f){const p=db.pieces.find(x=>x.id===id);if(!p)return;if(f)p.folder=f;else delete p.folder;save();render()}
function setTempo(id){const p=db.pieces.find(x=>x.id===id),v=Math.round(+$('#tb-'+id).value);
 if(!(v>=1&&v<=400)){need('Enter a tempo','Type a BPM between 1 and 400.','#tb-'+id);return}
 p.tempo=v;delete p.goal;p.tl=(p.tl||[]).filter(x=>x.d!==today());p.tl.push({d:today(),bpm:v});save();render()}
