// In-app video player: YouTube, Google Drive, direct video links and local files
let ytp=null,ytq=[];
const isFile=location.protocol==='file:';
const VID=/\.(mp4|webm|ogg|mov)(\?|$)/i;
function ytId(u){const m=String(u||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:null}
function driveId(u){const m=String(u||'').match(/drive\.google\.com\/file\/d\/([\w-]+)/);return m?m[1]:null}
const canEmbed=u=>!!(ytId(u)||driveId(u)||VID.test(u||''));
const WRAP='style="position:relative;aspect-ratio:16/9;width:100%;background:#000;border-radius:14px;overflow:hidden"',FR='style="position:absolute;inset:0;width:100%;height:100%;border:0"';
// YouTube refuses to play inside a page opened as a file, so show a thumbnail and a link instead
function blocked(y,u){return `<div class="player-wrap blk" ${WRAP}><img src="https://i.ytimg.com/vi/${y}/hqdefault.jpg" alt=""><div class="blkc"><b>YouTube cannot play it here</b><span>YouTube blocks playback when the app is opened as a file. Host the app (GitHub Pages) or run a local server and it plays inside the app.</span><a class="b" href="${E(u)}" target="_blank" rel="noopener">Watch on YouTube</a></div></div>`}
function embedHtml(u,id){u=u||'';const y=ytId(u),d=driveId(u);
 if(/^blob:/.test(u)||VID.test(u))return `<video ${id?`id="${id}"`:'autoplay'} src="${E(u)}" controls playsinline class="player"></video>`;
 if(y&&isFile)return blocked(y,u);
 if(y)return `<div class="player-wrap" ${WRAP}><iframe ${id?`id="${id}"`:''} ${FR} src="https://www.youtube.com/embed/${y}?playsinline=1&rel=0${id?'&enablejsapi=1':'&autoplay=1'}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
 if(d)return `<div class="player-wrap" ${WRAP}><iframe ${id?`id="${id}"`:''} ${FR} src="https://drive.google.com/file/d/${d}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;return ''}
function playerHtml(r,f){const u=r.url||'';let m='',can=false;
 if(f){m=`<video id="vd" src="${f}" controls playsinline class="player"></video>`;can=true}
 else if(VID.test(u)){m=embedHtml(u,'vd');can=true}
 else if(ytId(u)){m=embedHtml(u,'yt');can=!isFile}
 else if(driveId(u)){m=embedHtml(u,'gd');can=true}
 if(m)return `${driveId(u)?'<div class="mu" style="margin-bottom:8px">Drive cannot report the time, so type it yourself.</div>':''}${m}`;
 if(r.fileName)return `<div class="card mu">Video file: ${E(r.fileName)}. Select it again to play it here.<div style="margin-top:8px"><input type="file" accept="video/*" onchange="files['${r.id}']=URL.createObjectURL(this.files[0]);render()"></div></div>`;
 return u?`<div class="card row between"><span class="mu">This link cannot play inside the app.</span><a class="b" href="${E(u)}" target="_blank" rel="noopener">Open link</a></div>`:''}
function initPlayer(){ytp=null;if(!$('#yt'))return;const go=()=>{try{ytp=new YT.Player('yt')}catch(e){}};
 if(window.YT&&YT.Player){go();return}ytq.push(go);
 if(!document.getElementById('ytapi')){const s=document.createElement('script');s.id='ytapi';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);window.onYouTubeIframeAPIReady=()=>{ytq.forEach(fn=>fn());ytq=[]}}}
