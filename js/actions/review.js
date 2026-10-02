// Recording and note actions
const rec=id=>db.recs.find(r=>r.id===id);
function grab(){const v=$('#vd');if(v)$('#nt').value=fmt(v.currentTime)}
function seek(t){const v=$('#vd');if(v){v.currentTime=t;v.play()}}
function addRec(){const t=$('#rt').value.trim();if(!t)return;const f=$('#rf').files[0],id=uid();if(f)files[id]=URL.createObjectURL(f);
 db.recs.push({id,title:t,date:$('#rd').value||today(),piece:$('#rp').value,url:$('#ru').value.trim(),fileName:f?f.name:'',notes:[],good:'',fix:'',rating:0});save();openRec=id;render()}
function addNote(id){const x=$('#nx').value.trim();if(!x)return;const o={t:parseT($('#nt').value),type:$('#ny').value,sec:$('#ns').value.trim(),tag:$('#ng').value.trim(),text:x,res:$('#nr').value},r=rec(id),n=ed&&ed[0]==='n'?r.notes.find(q=>'n:'+q.id===ed):null;if(n)Object.assign(n,o);else r.notes.push(Object.assign({id:uid()},o));ed=null;resetFlags();save();render()}
function delNote(id,n){const r=rec(id);r.notes=r.notes.filter(x=>x.id!==n);save();render()}
function saveSum(id){const r=rec(id);r.good=$('#sg').value;r.fix=$('#sf').value;r.rating=+$('#sr').value;resetFlags();save();render()}
function delRec(id){if(!confirm('Delete this recording?'))return;db.recs=db.recs.filter(r=>r.id!==id);openRec=null;save();render()}
function saveRec(id){const r=rec(id),t=$('#et').value.trim();if(t)r.title=t;r.date=$('#edt').value||r.date;r.piece=$('#ep').value;r.url=$('#eu').value.trim();ed=null;resetFlags();save();render()}
