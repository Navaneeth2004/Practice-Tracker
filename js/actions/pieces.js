// Piece, folder and tempo actions (forms open in the side panel)
db.pieces.forEach(p=>{delete p.goal});
function logTempo(p,v){p.tempo=v;p.tl=(p.tl||[]).filter(x=>x.d!==today());p.tl.push({d:today(),bpm:v});delete p.goal}
function bumpTempo(id,d){const p=db.pieces.find(x=>x.id===id);if(!p)return;logTempo(p,Math.min(400,Math.max(1,(p.tempo||60)+d)));save();render()}
function clearTempo(id){const p=db.pieces.find(x=>x.id===id);if(p){delete p.tempo;delete p.goal;delete p.tl;save();render()}}
function pieceFields(p){p=p||{};const fl=db.folders||[];
 return `<div class="form"><input id="pn" class="wide" placeholder="Piece name" value="${E(p.name||'')}"><select id="ps">${STS.map(o=>`<option${o===(p.status||'learning')?' selected':''}>${o}</option>`).join('')}</select><select id="pfo"><option value="">Unfiled</option>${fl.map(x=>`<option value="${E(x.id)}"${p.folder===x.id?' selected':''}>${E(x.name)}</option>`).join('')}</select><input id="ptm" class="wide" type="number" min="1" max="400" placeholder="Current tempo in BPM (optional)" value="${p.tempo||''}"></div><div class="lbl">Tags</div>${tagPicker('ptg',p.tags)}`}
function pieceSheet(id){const p=id?db.pieces.find(x=>x.id===id):null;
 sheet(p?'Edit piece':'New piece',pieceFields(p||(pf!=='all'&&pf!=='none'?{folder:pf}:null)),(p?`<button class="b danger" style="margin-right:auto" onclick="askDelPiece('${id}')">Delete</button>`:'')+`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="savePiece('${id||''}')">${p?'Save':'Add piece'}</button>`)}
function savePiece(id){const n=$('#pn').value.trim();if(!n){need('Add a piece name','Type the name of the piece first.','#pn');return}
 const p=id?db.pieces.find(x=>x.id===id):{id:uid()},f=$('#pfo').value,raw=$('#ptm').value,v=Math.round(+raw);
 p.name=n;p.status=$('#ps').value;if(f)p.folder=f;else delete p.folder;p.tags=pickedTags('ptg');
 if(v>=1&&v<=400){if(v!==p.tempo)logTempo(p,v)}else if(!raw)delete p.tempo;
 if(!id)db.pieces.push(p);save();closeSheet();render()}
function askDelPiece(id){ask('Delete piece','Its recordings stay but lose the piece link.','Delete',()=>{closeSheet();delPiece(id)},1)}
function delPiece(id){db.pieces=db.pieces.filter(p=>p.id!==id);db.recs.forEach(r=>{if(r.piece===id)r.piece=''});plans().forEach(r=>{r.pieces=(r.pieces||[]).filter(x=>x!==id)});save();render()}
function pieceRecs(id){const p=db.pieces.find(x=>x.id===id);rfold=p&&(db.folders||[]).some(f=>f.id===p.folder)?p.folder:'none';openRec=null;tab='review';render()}
function folderSheet(id){const f=id?(db.folders||[]).find(x=>x.id===id):null;
 sheet(f?'Edit folder':'New folder',`<input id="fn" style="width:100%" placeholder="Folder name (e.g. Burgmuller)" value="${E(f?f.name:'')}" onkeydown="if(event.key==='Enter')saveFolder('${id||''}')">`,(f?`<button class="b danger" style="margin-right:auto" onclick="askDelFolder('${id}')">Delete</button>`:'')+`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveFolder('${id||''}')">Save</button>`)}
function saveFolder(id){const v=$('#fn').value.trim();if(!v){need('Name the folder','Type a folder name first.','#fn');return}
 if(id){(db.folders||[]).find(x=>x.id===id).name=v}else{const n={id:uid(),name:v};(db.folders=db.folders||[]).push(n);pf=n.id}save();closeSheet();render()}
function askDelFolder(id){ask('Delete folder','The pieces inside stay, and move to Unfiled.','Delete',()=>{closeSheet();delFolder(id)},1)}
function delFolder(id){db.folders=(db.folders||[]).filter(f=>f.id!==id);db.pieces.forEach(p=>{if(p.folder===id)delete p.folder});if(pf===id)pf='all';save();render()}
function folderPiecesSheet(fid){const f=(db.folders||[]).find(x=>x.id===fid);if(!f)return;
 sheet('Add pieces to '+f.name,`<div class="mu" style="margin-bottom:12px">Switch on the pieces that belong in this folder.</div>${db.pieces.map(p=>{const o=p.folder&&p.folder!==fid&&validF(p.folder)?(db.folders.find(x=>x.id===p.folder)||{}).name:'';return `<div class="task"><label class="tl"><input type="checkbox" class="sw" data-p="${E(p.id)}"${p.folder===fid?' checked':''}><span class="tt">${E(p.name)}${o?` <span class="mu">now in ${E(o)}</span>`:''}</span></label></div>`}).join('')||'<div class="empty">No pieces yet. Create one first.</div>'}`,`<button class="b s" onclick="closeSheet()">Cancel</button><button class="b" onclick="saveFolderPieces('${fid}')">Save</button>`)}
function saveFolderPieces(fid){document.querySelectorAll('#sheet input.sw').forEach(i=>{const p=db.pieces.find(x=>x.id===i.dataset.p);if(!p)return;if(i.checked)p.folder=fid;else if(p.folder===fid)delete p.folder});save();closeSheet();render()}
