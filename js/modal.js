// Custom dialogs: ask() for confirmations, need() when information is missing
let dlgFocus=null;
function dlg(html){closeModal(true);const m=document.createElement('div');m.id='dlg';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:60;display:flex;align-items:center;justify-content:center;padding:16px';
 m.innerHTML=`<div role="dialog" aria-modal="true" style="width:min(420px,100%);background:#16181e;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.65)">${html}</div>`;
 m.onclick=e=>{if(e.target===m)closeModal()};document.body.appendChild(m);return m}
function closeModal(keep){const m=$('#dlg');if(m)m.remove();if(!keep&&dlgFocus){const s=dlgFocus;dlgFocus=null;setTimeout(()=>{const e=$(s);if(e)e.focus()},30)}}
const dHead=(t,x)=>`<div style="font:700 21px Fraunces,Georgia,serif;margin-bottom:8px">${E(t)}</div><div class="mu" style="font-size:15px;line-height:1.55">${E(x)}</div>`;
function ask(title,text,label,fn,danger){dlg(dHead(title,text)+`<div class="row" style="justify-content:flex-end;margin-top:20px"><button class="b s" id="dno" onclick="closeModal()">Cancel</button><button class="b" id="dyes" ${danger?'style="background:linear-gradient(135deg,#ff8d7a,#d9503c);color:#fff;box-shadow:none"':''}>${E(label||'OK')}</button></div>`);
 $('#dyes').onclick=()=>{closeModal(true);if(fn)fn()};$('#dno').focus()}
function need(title,text,sel){dlgFocus=sel||null;dlg(dHead(title,text)+`<div class="row" style="justify-content:flex-end;margin-top:20px"><button class="b" id="dok" onclick="closeModal()">OK</button></div>`);$('#dok').focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
