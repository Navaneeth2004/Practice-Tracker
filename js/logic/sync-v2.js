// Keeps the secret out of the URL, but only once the cloud script is the new version.
// It never sends the new request to a script that has not announced v:2, so an old script is never hit with it.
const V2K='pt_v2';const isV2=u=>{try{return localStorage.getItem(V2K)===(u||sync.url)}catch(e){return false}};
const _call=call;
call=async function(method,body,url){
 if(method==='GET'&&isV2(url))return _call('POST',{key:sync.key,action:'get'},url);
 const t=await _call(method,body,url);
 if(method==='GET'&&t&&t.v===2){try{localStorage.setItem(V2K,url||sync.url)}catch(e){}}
 return t};
