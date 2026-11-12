const KEY = 'choose-a-secret'; // put the SAME secret you use now
const FILE = 'practice-log.json';
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function file_(make){var it=DriveApp.getFilesByName(FILE);if(it.hasNext())return it.next();return make?DriveApp.createFile(FILE,'{}','application/json'):null;}
function read_(){
  var f=file_(false);if(!f)return {ok:true,empty:true,v:2};
  var t=f.getBlob().getDataAsString();
  if(!t||t==='{}')return {ok:true,empty:true,v:2};
  return {ok:true,data:JSON.parse(t),v:2};
}
function doGet(e){
  if(KEY&&e.parameter.key!==KEY)return out_({ok:false,error:'Wrong key'});
  return out_(read_());
}
function doPost(e){
  var lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    var b=JSON.parse(e.postData.contents);
    if(KEY&&b.key!==KEY)return out_({ok:false,error:'Wrong key'});
    if(b.action==='get')return out_(read_());
    if(!b.data||typeof b.data!=='object'||Array.isArray(b.data))return out_({ok:false,error:'No data to save'});
    file_(true).setContent(JSON.stringify(b.data));
    return out_({ok:true,v:2});
  }finally{lock.releaseLock();}
}
