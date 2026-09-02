const quotes = [
  {
    id:'demo-1',
    quote:'The obstacle is not always a wall. Sometimes it is the instruction.',
    micro:'Pause. Reframe. Move.',
    speaker:'Prototype Wisdom',
    source:'Original app placeholder • copyright-safe demo text',
    context:'This build intentionally uses original placeholder copy. Your authenticated quote library can be plugged into the same layout later, with full-scene references and source metadata.'
  },
  {
    id:'demo-2',
    quote:'Discipline is what remains when motivation has already left the room.',
    micro:'Do the next useful thing.',
    speaker:'Prototype Wisdom',
    source:'Original app placeholder • copyright-safe demo text',
    context:'The final app can keep the quote hidden at first, then reveal speaker, universe and source on a second tap so the character does not give away the surprise.'
  },
  {
    id:'demo-3',
    quote:'You do not need certainty before you move. You need enough clarity for the next step.',
    micro:'Act without pretending to know everything.',
    speaker:'Prototype Wisdom',
    source:'Original app placeholder • copyright-safe demo text',
    context:'Longer passages can open in this contextual panel. For copyrighted works, the production app should use only text you have rights to display, or brief excerpts with scene/source references.'
  }
];
let idx = Math.floor(Math.random()*quotes.length); let stage=0;
const $=id=>document.getElementById(id);
function render(){
  const q=quotes[idx]; stage=0;
  $('quoteText').textContent='Tap below for today’s wisdom.';
  $('microText').textContent='A little surprise. A useful thought.';
  $('sourceName').textContent=q.speaker; $('sourceMeta').textContent=q.source; $('passageText').textContent=q.context;
  $('sourcePanel').classList.add('hidden'); $('passagePanel').classList.add('hidden'); $('journalPanel').classList.add('hidden');
  $('revealBtn').textContent='TAP TO REVEAL';
  $('favBtn').textContent=localStorage.getItem('fav:'+q.id)?'♥':'♡';
  $('journal').value=localStorage.getItem('note:'+q.id)||'';
}
function reveal(){
  const q=quotes[idx]; stage++;
  if(stage===1){$('quoteText').textContent=q.quote;$('microText').textContent=q.micro;$('revealBtn').textContent='REVEAL SOURCE';}
  else if(stage===2){$('sourcePanel').classList.remove('hidden');$('revealBtn').textContent='FULL CONTEXT';}
  else if(stage===3){$('passagePanel').classList.remove('hidden');$('revealBtn').textContent='REFLECT';}
  else {$('journalPanel').classList.remove('hidden');$('revealBtn').textContent='BACK TO QUOTE';stage=4;}
}
$('revealBtn').addEventListener('click',()=>{if(stage===4){render()}else reveal()});
$('shuffleBtn').addEventListener('click',()=>{let n=idx;while(n===idx&&quotes.length>1)n=Math.floor(Math.random()*quotes.length);idx=n;render()});
$('favBtn').addEventListener('click',()=>{const q=quotes[idx],k='fav:'+q.id;if(localStorage.getItem(k))localStorage.removeItem(k);else localStorage.setItem(k,'1');$('favBtn').textContent=localStorage.getItem(k)?'♥':'♡'});
$('saveBtn').addEventListener('click',()=>{$('favBtn').click()});
$('saveNoteBtn').addEventListener('click',()=>{localStorage.setItem('note:'+quotes[idx].id,$('journal').value);$('saveNoteBtn').textContent='Saved ✓';setTimeout(()=>$('saveNoteBtn').textContent='Save note',1200)});
$('shareBtn').addEventListener('click',async()=>{const q=quotes[idx];const text=`“${q.quote}”\n— ${q.speaker}`;if(navigator.share){try{await navigator.share({title:'Daily Wisdom',text})}catch{}}else{await navigator.clipboard?.writeText(text)}});
$('dateText').textContent=new Intl.DateTimeFormat(undefined,{day:'numeric',month:'long',year:'numeric'}).format(new Date());
render();
