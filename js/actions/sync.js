// Cloud sync actions
async function connectSync(){const u=$('#sl').value.trim(),k=$('#sk').value.trim();
 if(!/^https:\/\/script\.google\.com\/.+\/exec/.test(u)){setStatus('error','Paste the web app link, which ends with /exec');return}
 sync.url=u;sync.key=k;setStatus('busy');
 try{const t=await call('GET'),cd=t.empty?null:t.data;
  if(!hasData(cd)&&!hasData(db)){storeLink();synced=true;cloudSize=0;setStatus('ok');render();return}
  syncChoice={data:cd};setStatus('idle');render()}
 catch(e){sync.url='';sync.key='';setStatus('error',e.message)}}
function useCloud(){applyRemote(syncChoice.data);syncChoice=null;storeLink();synced=true;cloudSize=size(db);setStatus('ok');render()}
function useDevice(){syncChoice=null;storeLink();synced=true;db.ts=Date.now();save(true);push(true).then(render)}
function cancelConnect(){sync.url='';sync.key='';syncChoice=null;sync.status='off';render()}
function disconnectSync(){sync.url='';sync.key='';syncChoice=null;syncHold=null;sync.status='off';storeLink();render()}
function holdUpload(){syncHold=null;push(true).then(render)}
async function holdLoad(){syncHold=null;try{const t=await call('GET');if(!t.empty)applyRemote(t.data);pending=false;cloudSize=size(db);setStatus('ok')}catch(e){setStatus('error',e.message)}render()}
function syncNow(){pending?push():pull()}
function copyEl(id,b){const t=$('#'+id);t.select();try{document.execCommand('copy');b.textContent='Copied'}catch(e){}setTimeout(()=>{b.textContent='Copy script'},1600)}
function askConnect(){const u=$('#sl').value.trim();if(!/^https:\/\/script\.google\.com\/.+\/exec/.test(u)){need('Add the link','Paste the web app link, which ends with /exec.','#sl');return}
 ask('Connect to cloud sync','Nothing is changed yet. You will see what the cloud and this device hold, then choose what to keep.','Connect',connectSync)}
function askSyncNow(){ask('Sync now','Check the cloud and exchange the latest changes with this device?','Sync now',()=>{pending?push():pull()})}
function askDisconnect(){ask('Disconnect cloud sync','This device stops syncing. Its data is kept and the cloud file is not changed.','Disconnect',disconnectSync)}
function askHoldLoad(){ask('Replace this device with the cloud data','Changes on this device that are not in the cloud will be lost.','Replace',holdLoad,1)}
function askHoldUpload(){ask('Overwrite the cloud with this device','Cloud data that is not on this device will be lost.','Overwrite',holdUpload,1)}
function askUseCloud(){hasData(db)?ask('Replace this device with the cloud data','Everything on this device is replaced by the cloud data.','Replace',useCloud,1):useCloud()}
function askUseDevice(){hasData(syncChoice.data)?ask('Overwrite the cloud with this device','The cloud data is replaced by what is on this device.','Overwrite',useDevice,1):useDevice()}
