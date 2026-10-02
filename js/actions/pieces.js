// Piece actions
function addPiece(){const n=$('#pn').value.trim();if(!n)return;db.pieces.push({id:uid(),name:n,status:$('#ps').value,tags:pickedTags('pp')});save();render()}
function delPiece(id){db.pieces=db.pieces.filter(p=>p.id!==id);save();render()}
function savePiece(id){const p=db.pieces.find(x=>x.id===id),n=$('#en').value.trim();if(n)p.name=n;p.status=$('#es').value;p.tags=pickedTags('epp');ed=null;save();render()}
