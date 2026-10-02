// Small formatting helpers
const fmt=s=>{s=Math.floor(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const parseT=t=>{t=String(t).trim();if(t.includes(':')){const p=t.split(':');return (+p[0]||0)*60+(+p[1]||0)}return +t||0};
const hms=s=>{s=Math.floor(s/1000);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const pname=id=>(db.pieces.find(p=>p.id===id)||{}).name||'No piece';
const pOpts=sel=>'<option value="">No piece</option>'+db.pieces.map(p=>`<option value="${p.id}"${p.id===sel?' selected':''}>${E(p.name)}</option>`).join('');
