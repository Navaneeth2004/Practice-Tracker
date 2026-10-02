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
 if(m)return `<div class="vbar"><span class="mu">Video${driveId(u)?' (Drive cannot report the time, so type it yourself)':''}</span>${can?`<button class="b s sm" onclick="openRecVideo('${r.id}')">Expand</button>`:''}</div>${m}`;
 if(r.fileName)return `<div class="card mu">Video file: ${E(r.fileName)}. Select it again to play it here.<div style="margin-top:8px"><input type="file" accept="video/*" onchange="files['${r.id}']=URL.createObjectURL(this.files[0]);render()"></div></div>`;
 return u?`<div class="card row between"><span class="mu">This link cannot play inside the app.</span><a class="b" href="${E(u)}" target="_blank" rel="noopener">Open link</a></div>`:''}
function openVideo(u,title){const h=embedHtml(u);if(!h){window.open(u,'_blank','noopener');return}closeVideo();
 const v=$('#vd');if(v)v.pause();if(ytp&&ytp.pauseVideo)try{ytp.pauseVideo()}catch(e){}
 const m=document.createElement('div');m.id='vm';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:50;display:flex;align-items:center;justify-content:center;padding:16px';
 m.innerHTML=`<div style="width:min(960px,100%);background:#14161c;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:14px"><div class="row between" style="margin-bottom:10px"><b>${E(title||'Video')}</b><button class="b s" onclick="closeVideo()">Close</button></div>${h}</div>`;
 m.onclick=e=>{if(e.target===m)closeVideo()};document.body.appendChild(m)}
function closeVideo(){const m=$('#vm');if(m)m.remove()}
function openRecVideo(id){const r=rec(id);openVideo(files[id]||r.url,r.title)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});
function thumb(u,t){if(!canEmbed(u))return '';const y=ytId(u);return `<div class="thumb" data-u="${E(u)}" data-t="${E(t)}" onclick="openVideo(this.dataset.u,this.dataset.t)">${y?`<img src="https://i.ytimg.com/vi/${y}/mqdefault.jpg" alt="">`:''}<span class="play"></span></div>`}
const playBtn=(u,t)=>canEmbed(u)?`<button class="x" style="color:var(--ac)" data-u="${E(u)}" data-t="${E(t)}" onclick="openVideo(this.dataset.u,this.dataset.t)">Play</button>`:'';
function initPlayer(){ytp=null;if(!$('#yt'))return;const go=()=>{try{ytp=new YT.Player('yt')}catch(e){}};
 if(window.YT&&YT.Player){go();return}ytq.push(go);
 if(!document.getElementById('ytapi')){const s=document.createElement('script');s.id='ytapi';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);window.onYouTubeIframeAPIReady=()=>{ytq.forEach(fn=>fn());ytq=[]}}}
