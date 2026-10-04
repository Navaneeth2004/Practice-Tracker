// Cloud sync actions
async function connectSync(){const u=$('#sl').value.trim(),k=$('#sk').value.trim();
 if(!/^https:\/\/script\.google\.com\/.+\/exec/.test(u)){setStatus('error','Paste the web app link, which ends with /exec');return}
 sync.url=u;sync.key=k;setStatus('busy');
 try{const t=await call('GET');storeLink();
  if(t.empty){await push();render();return}
  if(!hasData(db)){applyRemote(t.data);setStatus('ok');render();return}
  syncChoice=t.data;setStatus('ok');render()}
 catch(e){sync.url='';sync.key='';setStatus('error',e.message)}}
function useCloud(){applyRemote(syncChoice);syncChoice=null;setStatus('ok');render()}
function useDevice(){syncChoice=null;save();push().then(render)}
function disconnectSync(){sync.url='';sync.key='';syncChoice=null;sync.status='off';storeLink();render()}
function syncNow(){pending?push():pull()}
function copyEl(id,b){const t=$('#'+id);t.select();try{document.execCommand('copy');b.textContent='Copied'}catch(e){}setTimeout(()=>{b.textContent='Copy script'},1600)}
