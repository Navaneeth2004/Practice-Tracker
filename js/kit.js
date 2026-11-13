// Shared UI kit: side panel (bottom sheet on phones) and toast
function sheet(title,body,foot){closeSheet();const bg=document.createElement('div');bg.id='sheetbg';bg.onclick=closeSheet;
 const s=document.createElement('aside');s.id='sheet';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');
 s.innerHTML=`<div class="sh-h"><b style="font:700 19px Fraunces,Georgia,serif">${E(title)}</b><button class="b s sm" onclick="closeSheet()">Close</button></div><div class="sh-b">${body}</div>${foot?`<div class="sh-f">${foot}</div>`:''}`;
 document.body.append(bg,s);const f=s.querySelector('input,textarea,select');if(f)f.focus()}
function closeSheet(){['sheetbg','sheet'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove()})}
function toast(m){const o=document.getElementById('toast');if(o)o.remove();const t=document.createElement('div');t.id='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
