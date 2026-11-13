// Tab rendering
const V={}; // each file in js/views adds one screen
function render(){
 $('#nav').innerHTML='<h1>Practice Log<small style="font:500 10px Inter,sans-serif;color:var(--mu);align-self:flex-end">'+BUILD+'</small></h1>'+TABS.map(t=>`<button class="${t[0]===tab?'on':''}" onclick="tab='${t[0]}';openRec=null;ed=null;msg='';closeSheet();render()">${t[1]}</button>`).join('');
 const on=$('#nav .on');if(on&&innerWidth<700)$('#nav').scrollLeft=on.offsetLeft-70;
 $('#main').innerHTML=(tab!=='data'?holdBar():'')+V[tab]();initPlayer();const k=tab+'|'+openRec;if(k!==lastKey){window.scrollTo(0,0);lastKey=k}const nf=$('#nform');if(nf&&ed)nf.scrollIntoView({block:'center'})}
