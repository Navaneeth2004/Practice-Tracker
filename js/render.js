// Tab rendering
const V={}; // each file in js/views adds one screen
function render(){
 $('#nav').innerHTML='<h1>Practice Log</h1>'+TABS.map(t=>`<button class="${t[0]===tab?'on':''}" onclick="tab='${t[0]}';openRec=null;ed=null;msg='';render()">${t[1]}</button>`).join('');
 $('#main').innerHTML=V[tab]();initPlayer();if(tab!=='sched')window.scrollTo(0,0)}
