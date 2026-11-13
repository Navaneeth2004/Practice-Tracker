// Review screen: recordings grid by folder, and the recording page (video left, notes right)
let rfold='all',nfilter='all';
const validF=id=>!!id&&(db.folders||[]).some(f=>f.id===id);
const folderOf=r=>{if(validF(r.folder))return r.folder;const p=db.pieces.find(x=>x.id===r.piece);return p&&validF(p.folder)?p.folder:''};
let rpiece='all';
function pieceOpts(sel){const fl=db.folders||[],o=p=>`<option value="${E(p.id)}"${p.id===sel?' selected':''}>${E(p.name)}</option>`;
 return fl.map(f=>{const a=db.pieces.filter(p=>p.folder===f.id);return a.length?`<optgroup label="${E(f.name)}">${a.map(o).join('')}</optgroup>`:''}).join('')+db.pieces.filter(p=>!fl.some(f=>f.id===p.folder)).map(o).join('')}
function recCard(r){const y=ytId(r.url),open=(r.notes||[]).filter(n=>n.type==='needs'&&!n.done).length;
 return `<div class="card rcard" onclick="openRecording('${r.id}')"><div class="rth">${y?`<img src="https://i.ytimg.com/vi/${y}/mqdefault.jpg" alt="">`:'<span class="mu">No preview</span>'}${r.rating?`<b class="rbadge">${r.rating}/10</b>`:''}</div><div class="rbody"><b>${E(r.title)}</b><div class="mu">${fmtDate(r.date)} &middot; ${E(pname(r.piece))}</div><div class="mu">${pl((r.notes||[]).length,'note')}${open?` &middot; <span class="bad">${open} to fix</span>`:''}</div>${chipLine(r.tags,8)}</div></div>`}
V.review=function(){if(openRec){const r=rec(openRec);if(r)return recView(r);openRec=null}
 const fl=db.folders||[];if(rfold!=='all'&&rfold!=='none'&&!validF(rfold))rfold='all';
 const inFold=r=>rfold==='all'||(rfold==='none'?folderOf(r)==='':folderOf(r)===rfold);
 const scope=db.pieces.filter(p=>rfold==='all'||(rfold==='none'?!validF(p.folder):p.folder===rfold)||db.recs.some(r=>r.piece===p.id&&inFold(r)));if(rpiece!=='all'&&!scope.some(p=>p.id===rpiece))rpiece='all';
 const recs=db.recs.slice().reverse().filter(r=>inFold(r)&&(rpiece==='all'||r.piece===rpiece)),
  cnt=v=>db.recs.filter(r=>v==='all'||(v==='none'?folderOf(r)==='':folderOf(r)===v)).length,
  chip=(v,n)=>`<button class="${rfold===v?'on':''}" data-f="${E(v)}" onclick="rfold=this.dataset.f;rpiece='all';render()">${E(n)} (${cnt(v)})</button>`,
  pchip=(v,n,c)=>`<button class="${rpiece===v?'on':''}" data-p="${E(v)}" onclick="rpiece=this.dataset.p;render()">${E(n)} (${c})</button>`,groups=[];
 if(rpiece!=='all')groups.push([pname(rpiece),recs]);
 else if(rfold==='all')[...fl.map(f=>[f.id,f.name]),['','Unfiled']].forEach(([id,n])=>{const c=recs.filter(r=>folderOf(r)===id);if(c.length)groups.push([n,c])});
 else{scope.forEach(p=>{const c=recs.filter(r=>r.piece===p.id);if(c.length)groups.push([p.name,c])});const c=recs.filter(r=>!db.pieces.some(p=>p.id===r.piece));if(c.length)groups.push(['No piece',c])}
 const body=groups.map(([n,c])=>`<h3>${E(n)} (${c.length})</h3><div class="grid">${c.map(recCard).join('')}</div>`).join('')||'<div class="empty">No recordings here yet.</div>';
 return `<h2>Review</h2><div class="row" style="margin-bottom:10px;flex-wrap:nowrap"><div class="seg" style="margin:0;flex:1">${chip('all','All')}${fl.map(f=>chip(f.id,f.name)).join('')}${chip('none','Unfiled')}</div><button class="b sm" onclick="newRecSheet()">New recording</button></div>
 ${scope.length?`<div class="seg">${pchip('all','All pieces',recs.length&&rpiece==='all'?recs.length:db.recs.filter(inFold).length)}${scope.map(p=>pchip(p.id,p.name,db.recs.filter(r=>r.piece===p.id&&inFold(r)).length)).join('')}</div>`:''}${body}`};
function recView(r){return `<a href="#" class="back" onclick="openRec=null;nfilter='all';render();return false">&lsaquo; All recordings</a>
 <div class="rhead"><div class="grow"><h2 style="margin:0 0 6px">${E(r.title)}</h2><div class="mu">${fmtDate(r.date)} &middot; ${E(pname(r.piece))}</div>${chipLine(r.tags,10)}</div><div class="row" style="flex-wrap:nowrap"><select class="rsel" onchange="setRating('${r.id}',this.value)">${Array.from({length:11},(_,i)=>`<option value="${i}"${(r.rating||0)===i?' selected':''}>${i?i+' / 10':'Not rated'}</option>`).join('')}</select><button class="b s sm" onclick="editRecSheet('${r.id}')">Edit</button></div></div>
 <div class="rec"><div class="recv">${playerHtml(r,files[r.id])}</div><div id="notes-area">${notesHtml(r)}</div></div>`}
function notesHtml(r){const all=(r.notes||[]).slice().sort((a,b)=>a.t-b.t),open=all.filter(n=>n.type==='needs'&&!n.done).length,list=nfilter==='all'?all:all.filter(n=>n.type===nfilter),
 tabs=[['all','All '+all.length],['needs','Needs work'+(open?' '+open:'')],['good','Good'],['q','Questions']];
 return `<div class="row between" style="margin-bottom:12px;flex-wrap:nowrap"><div class="seg" style="margin:0">${tabs.map(([a,b])=>`<button class="${nfilter===a?'on':''}" onclick="nfilter='${a}';refreshNotes()">${b}</button>`).join('')}</div><button class="b sm" onclick="noteSheet('${r.id}')">Add note</button></div>${list.map(n=>noteCard(r,n)).join('')||`<div class="empty">${all.length?'No notes in this filter.':'No notes yet. Tap Add note while you watch.'}</div>`}`}
function noteCard(r,n){const rs=db.res.find(x=>x.id===n.res),needs=n.type==='needs';
 return `<div class="card note ${n.type}${n.done?' isdone':''}" data-id="${E(n.id)}"><div class="row"><a href="#" class="ts" onclick="seek(${+n.t||0});return false">${fmt(n.t)}</a><b class="${n.type==='good'?'good':needs?'bad':''}">${n.type==='good'?'Good':needs?'Needs work':'Question'}</b>${n.done?'<span class="tag">Done</span>':''}${n.sec?`<span class="tag">${E(n.sec)}</span>`:''}${n.tag?`<span class="tag">${E(n.tag)}</span>`:''}</div><div class="ntext">${E(n.text)}</div>${rs?`<div class="mu" style="margin-top:6px">Resource: ${/^https?:/.test(rs.u)?`<a href="${E(rs.u)}" target="_blank" rel="noopener">${E(rs.t)}</a>`:E(rs.t)}</div>`:''}
 <div class="row nacts">${needs?(n.done?`<button class="b s sm" onclick="setDone('${r.id}','${n.id}',false)">Reopen</button>`:`<button class="b sm" onclick="setDone('${r.id}','${n.id}',true)">Mark done</button>`):''}<button class="x" style="color:var(--ac)" onclick="noteSheet('${r.id}','${n.id}')">Edit</button><button class="x" onclick="ask('Delete note','This note will be removed.','Delete',()=>delNote('${r.id}','${n.id}'),1)">Delete</button></div></div>`}
