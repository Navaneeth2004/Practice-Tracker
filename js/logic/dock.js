// Video opens in a small docked player (no blocking modal)
function openVideo(u,title){const h=embedHtml(u);if(!h){window.open(u,'_blank','noopener');return}closeVideo();
 const v=$('#vd');if(v)v.pause();if(ytp&&ytp.pauseVideo)try{ytp.pauseVideo()}catch(e){}
 const m=document.createElement('div');m.id='dock';m.innerHTML=`<div class="row between" style="margin-bottom:8px;flex-wrap:nowrap"><b style="font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(title||'Video')}</b><button class="b s sm" onclick="closeVideo()">Close</button></div>${h}`;document.body.appendChild(m)}
function closeVideo(){const m=$('#dock');if(m)m.remove()}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});
