// Optional cloud sync. A small Google Apps Script web app keeps one JSON file in your Google Drive.
// With a link set, the app loads that file at start and saves to it after every change. Without one, data stays on this device.
const LINK_KEY='pt_link';
let sync={url:'',key:'',status:'off',at:null,msg:''},pushT=null,pending=false,syncChoice=null;
try{const l=JSON.parse(localStorage.getItem(LINK_KEY));if(l){sync.url=l.url||'';sync.key=l.key||''}}catch(e){}
sync.status=sync.url?'idle':'off';
const syncOn=()=>!!sync.url;
const storeLink=()=>{try{localStorage.setItem(LINK_KEY,JSON.stringify({url:sync.url,key:sync.key}))}catch(e){}};
function syncText(){const t={off:'Not connected. Your data stays on this device.',idle:'Connected.',busy:'Syncing...',ok:'Synced'+(sync.at?' at '+sync.at.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):''),error:'Sync problem: '+sync.msg};return t[sync.status]||''}
function setStatus(s,m){sync.status=s;sync.msg=m||'';if(s==='ok')sync.at=new Date();const e=$('#syncst');if(e){e.textContent=syncText();e.className=s==='error'?'bad':'mu'}}
const hasData=d=>!!(d&&((d.recs||[]).length||(d.pieces||[]).length||(d.res||[]).length||Object.keys(d.cal||{}).length||Object.keys(d.log||{}).length));
async function call(method,body,url){url=url||sync.url;let r,t;
 try{r=method==='POST'?await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)}):await fetch(url+(url.includes('?')?'&':'?')+'key='+encodeURIComponent(sync.key)+'&t='+Date.now(),{cache:'no-store'});t=await r.json()}
 catch(e){throw new Error(navigator.onLine===false?'You are offline. It will sync when you are back online.':'Could not reach the link. Check that it ends with /exec and that access is set to Anyone.')}
 if(!t.ok)throw new Error(t.error||'The cloud refused the request');return t}
function applyRemote(d){const timer=db.timer;db=Object.assign({cal:{},pieces:[],recs:[],res:[],sched:{},done:{},log:{},st:{},lastExport:null},d,{timer});if(!db.tags)db.tags=TECH.slice();db.res.forEach(r=>{if(!r.tags)r.tags=[]});save(true)}
async function pull(){if(!syncOn())return;if(pending){await push();return}setStatus('busy');
 try{const t=await call('GET');if(t.empty){await push();return}
  const rts=t.data.ts||0,lts=db.ts||0;if(rts>lts){applyRemote(t.data);render()}else if(lts>rts){await push();return}
  setStatus('ok')}catch(e){setStatus('error',e.message)}}
async function push(){if(!syncOn())return;clearTimeout(pushT);if(!db.ts){db.ts=Date.now();save(true)}setStatus('busy');
 try{await call('POST',{key:sync.key,data:Object.assign({},db,{timer:null})});pending=false;setStatus('ok')}catch(e){setStatus('error',e.message)}}
function schedulePush(){if(!syncOn())return;pending=true;clearTimeout(pushT);setStatus('busy');pushT=setTimeout(push,1500)}
function initSync(){if(!syncOn())return;pull();
 document.addEventListener('visibilitychange',()=>{if(!syncOn())return;if(document.hidden){if(pending)push()}else pull()});
 addEventListener('online',()=>{if(syncOn())pull()})}
const SYNC_SCRIPT=`const KEY = 'choose-a-secret';
const FILE = 'practice-log.json';
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function file_(make){var it=DriveApp.getFilesByName(FILE);if(it.hasNext())return it.next();return make?DriveApp.createFile(FILE,'{}','application/json'):null;}
function doGet(e){
  if(KEY&&e.parameter.key!==KEY)return out_({ok:false,error:'Wrong key'});
  var f=file_(false);if(!f)return out_({ok:true,empty:true});
  var t=f.getBlob().getDataAsString();
  if(!t||t==='{}')return out_({ok:true,empty:true});
  return out_({ok:true,data:JSON.parse(t)});
}
function doPost(e){
  var lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    var b=JSON.parse(e.postData.contents);
    if(KEY&&b.key!==KEY)return out_({ok:false,error:'Wrong key'});
    file_(true).setContent(JSON.stringify(b.data));
    return out_({ok:true});
  }finally{lock.releaseLock();}
}`;
