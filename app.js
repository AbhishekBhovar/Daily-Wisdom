const quotes=(window.DW_QUOTES||[]).filter(q=>q.quote);
const $=id=>document.getElementById(id);
const DAY=86400000;
const START_UTC=Date.UTC(2026,8,1); // 1 September 2026
const localDayUTC=(d=new Date())=>Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());
const dayNumber=()=>Math.max(0,Math.floor((localDayUTC()-START_UTC)/DAY));
const dailyIndex=()=>quotes.length?Math.min(dayNumber(),quotes.length-1):0;
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let i=Number.isInteger(+localStorage.dwIndex)?+localStorage.dwIndex:dailyIndex(); if(i>=quotes.length)i=dailyIndex();
let favs=new Set(JSON.parse(localStorage.dwFavs||'[]'));
let reflections=JSON.parse(localStorage.dwReflections||'{}');
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function highlighted(q){
  const raw=q.quote||'', h=(q.highlight||'').trim();
  if(!h)return esc(raw).replace(/\n/g,'<br>');
  let pos=raw.toLowerCase().indexOf(h.toLowerCase()), match=h;
  if(pos<0){
    const hw=h.toLowerCase().split(/\s+/).filter(w=>w.length>3);
    let best='';
    for(let a=0;a<hw.length;a++)for(let b=a+1;b<=hw.length;b++){
      const phrase=hw.slice(a,b).join(' ');
      if(phrase.length>best.length && raw.toLowerCase().includes(phrase))best=phrase;
    }
    if(best){pos=raw.toLowerCase().indexOf(best);match=raw.slice(pos,pos+best.length)}
  }
  if(pos<0)return esc(raw).replace(/\n/g,'<br>');
  return esc(raw.slice(0,pos)).replace(/\n/g,'<br>')+'<span class="focus">'+esc(match).replace(/\n/g,'<br>')+'</span>'+esc(raw.slice(pos+match.length)).replace(/\n/g,'<br>');
}
function dateForIndex(n){return new Date(START_UTC+n*DAY)}
function dateLabelForIndex(n){return dateForIndex(n).toLocaleDateString('en-AU',{timeZone:'UTC',month:'short',day:'numeric'}).toUpperCase()}
function save(){localStorage.dwFavs=JSON.stringify([...favs]);localStorage.dwIndex=i;localStorage.dwReflections=JSON.stringify(reflections)}
function reflectionKey(){return todayKey()+'::'+quotes[i].id}
function render(){if(!quotes.length)return;const q=quotes[i];$('date').textContent=dateLabelForIndex(i);$('fullQuote').innerHTML=highlighted(q);$('who').textContent=q.character;$('where').textContent=q.source;$('fav').classList.toggle('active',favs.has(q.id));$('fav').firstChild.nodeValue=favs.has(q.id)?'♥':'♡';$('reflectionText').value=reflections[reflectionKey()]||'';save()}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1300)}
function page(p){document.querySelectorAll('.screen:not(.modal)').forEach(x=>x.classList.remove('active'));$(p).classList.add('active');document.querySelectorAll('.bottomnav [data-page]').forEach(x=>x.classList.toggle('on',x.dataset.page===p));if(p==='library')lib()}
let transitioning=false;function changeDay(delta){if(transitioning)return;let target=i+delta;if(target<0||target>=quotes.length){toast('End of unlocked wisdom.');return}transitioning=true;const card=$('wisdomCard');card.classList.add(delta>0?'swipe-out-left':'swipe-out-right');setTimeout(()=>{i=target;render();card.className='wisdomCard '+(delta>0?'swipe-in-right':'swipe-in-left');setTimeout(()=>{card.className='wisdomCard';transitioning=false},300)},220)}
$('fav').onclick=()=>{const id=quotes[i].id;favs.has(id)?favs.delete(id):favs.add(id);render();toast(favs.has(id)?'Added to favorites':'Removed from favorites')};
$('reflectionToggle').onclick=()=>$('reflectionBox').classList.toggle('open');
$('saveReflection').onclick=()=>{const v=$('reflectionText').value.trim();if(v)reflections[reflectionKey()]=v;else delete reflections[reflectionKey()];save();toast('Reflection saved')};
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>page(b.dataset.page));
function lib(filter='all'){let h='';quotes.forEach((q,n)=>{if(filter==='favs'&&!favs.has(q.id))return;h+=`<div class="libitem" data-n="${n}"><span class="d">${esc(q.world)}</span><p>${esc(q.quote).replace(/\n/g,' ')}</p><small>${esc(q.character)} · ${esc(q.source)}</small>${favs.has(q.id)?'<span class="heart">♥</span>':''}</div>`});$('libraryList').innerHTML=h||'<p class="empty">No favorites yet.</p>';document.querySelectorAll('.libitem').forEach(e=>e.onclick=()=>{i=+e.dataset.n;page('today');render()})}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');lib(t.dataset.tab)});
let sx=0,sy=0;$('today').addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});$('today').addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>52&&Math.abs(dx)>Math.abs(dy))dx<0?changeDay(1):changeDay(-1)},{passive:true});
$('quoteCount').textContent=quotes.length;
render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
