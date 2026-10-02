// In-app video player: YouTube, Google Drive, direct video links and local files
let ytp=null,ytq=[];
function ytId(u){const m=String(u||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:null}
function driveId(u){const m=String(u||'').match(/drive\.google\.com\/file\/d\/([\w-]+)/);return m?m[1]:null}
const VID=/\.(mp4|webm|ogg|mov)(\?|$)/i;
const canEmbed=u=>!!(ytId(u)||driveId(u)||VID.test(u||''));
function embedHtml(u,start){u=u||'';const y=ytId(u),d=driveId(u);
 if(/^blob:/.test(u)||VID.test(u))return `<video src="${E(u)}" controls autoplay playsinline class="player"></video>`;
 if(y)return `<div class="player-wrap"><iframe src="https://www.youtube.com/embed/${y}?playsinline=1&rel=0&autoplay=1${start?'&start='+start:''}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
 if(d)return `<div class="player-wrap"><iframe src="https://drive.google.com/file/d/${d}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;return ''}
function playerHtml(r,f){const y=ytId(r.url),d=driveId(r.url),u=r.url||'';let h='';
 if(f)h=`<video id="vd" src="${f}" controls playsinline class="player"></video>`;
 else if(y)h=`<div class="player-wrap"><iframe id="yt" src="https://www.youtube.com/embed/${y}?enablejsapi=1&playsinline=1&rel=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
 else if(d)h=`<div class="player-wrap"><iframe id="gd" src="https://drive.google.com/file/d/${d}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
 else if(VID.test(u))h=`<video id="vd" src="${E(u)}" controls playsinline class="player"></video>`;
 if(h)return h+`<div class="row" style="margin-bottom:6px"><button class="b s" onclick="openRecVideo('${r.id}')">Open in window</button>${d?'<span class="mu">Drive videos cannot report the time. Type it yourself.</span>':''}</div>`;
 if(r.fileName)return `<div class="card mu">Video file: ${E(r.fileName)}. Select it again to play it here.<div style="margin-top:8px"><input type="file" accept="video/*" onchange="files['${r.id}']=URL.createObjectURL(this.files[0]);render()"></div></div>`;
 return u?`<div class="mu" style="margin-top:10px">This link cannot play inside the app, so it opens in a new tab.</div>`:''}
function openVideo(u,title){const h=embedHtml(u);if(!h){window.open(u,'_blank','noopener');return}closeVideo();
 const v=$('#vd');if(v)v.pause();if(ytp&&ytp.pauseVideo)try{ytp.pauseVideo()}catch(e){}
 const m=document.createElement('div');m.id='vm';m.className='modal';m.innerHTML=`<div class="mbox"><div class="mbar"><b>${E(title||'Video')}</b><button class="b s" onclick="closeVideo()">Close</button></div>${h}</div>`;
 m.onclick=e=>{if(e.target===m)closeVideo()};document.body.appendChild(m)}
function closeVideo(){const m=$('#vm');if(m)m.remove()}
function openRecVideo(id){const r=rec(id);openVideo(files[id]||r.url,r.title)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});
function thumb(u,t){if(!canEmbed(u))return '';const y=ytId(u);return `<div class="thumb" data-u="${E(u)}" data-t="${E(t)}" onclick="openVideo(this.dataset.u,this.dataset.t)">${y?`<img src="https://i.ytimg.com/vi/${y}/mqdefault.jpg" alt="">`:''}<span class="play"></span></div>`}
const playBtn=(u,t)=>canEmbed(u)?`<button class="x" style="color:var(--ac)" data-u="${E(u)}" data-t="${E(t)}" onclick="openVideo(this.dataset.u,this.dataset.t)">Play</button>`:'';
function initPlayer(){ytp=null;if(!$('#yt'))return;const go=()=>{try{ytp=new YT.Player('yt')}catch(e){}};
 if(window.YT&&YT.Player){go();return}ytq.push(go);
 if(!document.getElementById('ytapi')){const s=document.createElement('script');s.id='ytapi';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);window.onYouTubeIframeAPIReady=()=>{ytq.forEach(fn=>fn());ytq=[]}}}
