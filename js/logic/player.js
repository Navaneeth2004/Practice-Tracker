// In-app video player: YouTube, Google Drive, direct video links and local files
let ytp=null,ytq=[];
function ytId(u){const m=String(u||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:null}
function driveId(u){const m=String(u||'').match(/drive\.google\.com\/file\/d\/([\w-]+)/);return m?m[1]:null}
function playerHtml(r,f){
 if(f)return `<video id="vd" src="${f}" controls playsinline class="player"></video>`;
 const y=ytId(r.url),d=driveId(r.url),u=r.url||'';
 if(y)return `<div class="player-wrap"><iframe id="yt" src="https://www.youtube.com/embed/${y}?enablejsapi=1&playsinline=1&rel=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
 if(d)return `<div class="player-wrap"><iframe id="gd" src="https://drive.google.com/file/d/${d}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe></div><div class="mu">Drive videos play here, but the time button cannot read the position. Type the time yourself.</div>`;
 if(/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u))return `<video id="vd" src="${E(u)}" controls playsinline class="player"></video>`;
 if(r.fileName)return `<div class="card mu">Video file: ${E(r.fileName)}. Select it again to play it here.<div style="margin-top:8px"><input type="file" accept="video/*" onchange="files['${r.id}']=URL.createObjectURL(this.files[0]);render()"></div></div>`;
 return u?`<div class="mu" style="margin-top:10px">This link cannot play inside the app, so it opens in a new tab.</div>`:'';
}
function initPlayer(){ytp=null;if(!$('#yt'))return;const go=()=>{try{ytp=new YT.Player('yt')}catch(e){}};
 if(window.YT&&YT.Player){go();return}ytq.push(go);
 if(!document.getElementById('ytapi')){const s=document.createElement('script');s.id='ytapi';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);window.onYouTubeIframeAPIReady=()=>{ytq.forEach(fn=>fn());ytq=[]}}}
