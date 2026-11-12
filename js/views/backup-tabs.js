// Backup: status strip and tabs (Cloud sync / Export / Import)
let btab='sync';const _data=V.data;
V.data=function(){const t=document.createElement('template');t.innerHTML=_data();const k=[...t.content.children];if(syncHold||syncChoice)btab='sync';
 const days=db.lastExport?Math.floor((Date.now()-db.lastExport)/864e5):null,old=days===null||days>14,tabs=[['sync','Cloud sync'],['export','Export'],['import','Import']];
 return k[0].outerHTML+`<div class="card row between"><div><b>Your data</b><div class="mu" style="margin-top:4px">${E(counts(db))}</div></div><div class="${old?'bad':'good'}">${days===null?'Never backed up':days===0?'Backed up today':'Backed up '+days+' days ago'}</div></div><div class="seg">${tabs.map(([a,b])=>`<button class="${btab===a?'on':''}" onclick="btab='${a}';render()">${b}</button>`).join('')}</div>${{sync:k[1],export:k[2],import:k[3]}[btab].outerHTML}`};
