// Data safety: ids end up inside onclick strings, so drop anything unsafe from imported or cloud data
const IDRE=/^[\w-]{1,40}$/,okId=x=>!!x&&IDRE.test(String(x.id));
function deepClean(d){if(!d||typeof d!=='object')return d;
 ['pieces','recs','res','folders','plans'].forEach(k=>{if(Array.isArray(d[k]))d[k]=d[k].filter(okId)});
 if(Array.isArray(d.recs))d.recs.forEach(r=>{r.notes=Array.isArray(r.notes)?r.notes.filter(okId):[]});
 ['cal','cnotes'].forEach(k=>{if(d[k]&&typeof d[k]==='object')for(const day in d[k]){if(!/^\d{4}-\d{2}-\d{2}$/.test(day)){delete d[k][day];continue}d[k][day]=Array.isArray(d[k][day])?d[k][day].filter(okId):[]}});
 if(Array.isArray(d.plans))d.plans.forEach(p=>{p.items=(p.items||[]).filter(okId);p.pieces=(p.pieces||[]).filter(x=>IDRE.test(String(x)))});
 return d}
const _applyRemote=applyRemote;applyRemote=function(d){_applyRemote(deepClean(d))};
