const quotes=[
{date:'SEP 3',before:'When everything around you gets noisy, ',focus:'the choice you make next is what matters most.',after:' Direction is built one decision at a time.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'SEP 2',before:'Courage is not always loud. ',focus:'Sometimes courage is simply choosing to continue',after:' when stopping would be easier.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'SEP 1',before:'A setback does not have to be a verdict. ',focus:'It can become information if you are willing to learn from it.',after:' Adjust, then move again.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'AUG 31',before:'Strength is useful. ',focus:'Knowing when and why to use it is wisdom.',after:' Power without judgment is only force.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'AUG 30',before:'You cannot predict every problem. ',focus:'Preparation gives you more choices when the unexpected arrives.',after:' The work you do beforehand becomes freedom later.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'AUG 29',before:'Certainty is rare. ',focus:'You do not need certainty before you take the next sensible step.',after:' Movement can create clarity.',who:'MYSTERY VOICE',where:'Prototype wisdom'},
{date:'AUG 28',before:'What you repeat when nobody is watching matters. ',focus:'The standard you keep in private eventually becomes the person others see.',after:' Character is built before it is noticed.',who:'MYSTERY VOICE',where:'Prototype wisdom'}
];
let i=+(localStorage.dwIndex||0),revealed=false;let favs=new Set(JSON.parse(localStorage.dwFavs||'[1,4]'));
const $=id=>document.getElementById(id);
function whole(x){return x.before+x.focus+x.after}
function save(){localStorage.dwFavs=JSON.stringify([...favs]);localStorage.dwIndex=i}
function render(){const x=quotes[i];$('date').textContent=x.date;$('fullQuote').innerHTML=`<span class="surround">${x.before}</span><span class="focus">${x.focus}</span><span class="surround">${x.after}</span>`;$('who').textContent=x.who;$('where').textContent=x.where;$('source').classList.toggle('hidden',!revealed);$('revealSource').classList.toggle('hidden',revealed);$('fav').classList.toggle('active',favs.has(i));$('fav').firstChild.nodeValue=favs.has(i)?'♥':'♡';save()}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1300)}
function page(p){document.querySelectorAll('.screen:not(.modal)').forEach(x=>x.classList.remove('active'));$(p).classList.add('active');document.querySelectorAll('.bottomnav [data-page]').forEach(x=>x.classList.toggle('on',x.dataset.page===p));if(p==='library')lib()}
$('revealSource').onclick=e=>{e.stopPropagation();revealed=true;render()};
$('wisdomCard').onclick=e=>{if(e.target.closest('button'))return;if(!revealed){revealed=true;render()}};
let transitioning=false;
function flashDay(label){
  const f=$('dayFlash'); f.textContent=label; f.classList.remove('show'); void f.offsetWidth; f.classList.add('show');
}
function changeDay(delta){
  if(transitioning)return;
  const target=i+delta;
  if(target<0){toast("Tomorrow's wisdom is still waiting.");return;}
  if(target>=quotes.length)return;
  transitioning=true;
  const card=$('wisdomCard');
  const goingOlder=delta>0;
  card.classList.remove('swipe-in-left','swipe-in-right');
  card.classList.add(goingOlder?'swipe-out-left':'swipe-out-right');
  setTimeout(()=>{
    i=target; revealed=false; render();
    card.classList.remove('swipe-out-left','swipe-out-right');
    card.classList.add(goingOlder?'swipe-in-right':'swipe-in-left');
    flashDay(i===0?'TODAY':quotes[i].date);
    setTimeout(()=>{card.classList.remove('swipe-in-left','swipe-in-right');transitioning=false},300);
  },220);
}
$('fav').onclick=()=>{favs.has(i)?favs.delete(i):favs.add(i);render();toast(favs.has(i)?'Added to favorites':'Removed from favorites')};
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>page(b.dataset.page));
function lib(filter='all'){let h='';quotes.forEach((x,n)=>{if(filter==='favs'&&!favs.has(n))return;h+=`<div class="libitem" data-n="${n}"><span class="d">${x.date}</span><p>${whole(x)}</p><small>UNLOCKED</small>${favs.has(n)?'<span class="heart">♥</span>':''}</div>`});$('libraryList').innerHTML=h;document.querySelectorAll('.libitem').forEach(e=>e.onclick=()=>{i=+e.dataset.n;revealed=true;page('today');render()})}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');lib(t.dataset.tab)});
function week(){$('weekRange').textContent='AUG 28 – SEP 3';$('weekGrid').innerHTML=quotes.slice(0,7).reverse().map((x,n)=>{let idx=6-n,f=favs.has(idx);return `<div class="daycard ${f?'faved':''}">${x.date}<span class="star">★</span>${f?'<span class="heart">♥</span>':'—'}</div>`}).join('');$('week').classList.add('active')}
$('openWeek').onclick=week;$('closeWeek').onclick=()=>$('week').classList.remove('active');$('viewFavs').onclick=()=>{$('week').classList.remove('active');page('library');document.querySelector('[data-tab=favs]').click()};
let sx=0,sy=0;$('today').addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});$('today').addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>52&&Math.abs(dx)>Math.abs(dy)){dx<0?changeDay(1):changeDay(-1)}},{passive:true});
render();
