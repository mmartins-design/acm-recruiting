const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
menu.addEventListener('click', () => {
 const open=menu.getAttribute('aria-expanded')!=='true';
 menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);
});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');navigation.classList.remove('open');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}});
const cards=[...document.querySelectorAll('.story-card')];
const storyTrack=document.querySelector('#story-track');
const storyPrev=document.querySelector('#story-prev'),storyNext=document.querySelector('#story-next');
const storyStatus=document.querySelector('#story-status');
let storyScrollTimer;
function visibleStories(){return cards.filter(card=>!card.hidden);}
function storyLayout(){
 const visible=visibleStories();
 const gap=parseFloat(getComputedStyle(storyTrack).columnGap)||0;
 const step=(visible[0]?.getBoundingClientRect().width||storyTrack.clientWidth)+gap;
 const count=Math.max(1,Math.round((storyTrack.clientWidth+gap)/step));
 const index=Math.min(Math.max(0,visible.length-count),Math.max(0,Math.round(storyTrack.scrollLeft/step)));
 return {visible,step,count,index};
}
function updateStoryNavigation(){
 const {visible,count,index}=storyLayout();
 const maxScroll=storyTrack.scrollWidth-storyTrack.clientWidth;
 storyPrev.setAttribute('aria-disabled',String(storyTrack.scrollLeft<=2));
 storyNext.setAttribute('aria-disabled',String(storyTrack.scrollLeft>=maxScroll-2));
 document.querySelector('.story-arrows').hidden=visible.length<=count;
 storyStatus.textContent=visible.length?`Showing ${index+1}–${Math.min(index+count,visible.length)} of ${visible.length} ${visible.length===1?'story':'stories'}`:'No stories in this category';
}
function moveStories(direction){
 const {visible,step,count,index}=storyLayout();
 const next=Math.max(0,Math.min(visible.length-count,index+direction));
 storyTrack.scrollTo({left:next*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
storyPrev.addEventListener('click',()=>moveStories(-1));
storyNext.addEventListener('click',()=>moveStories(1));
storyTrack.addEventListener('keydown',event=>{
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
  event.preventDefault();moveStories(event.key==='ArrowRight'?1:-1);
 }
});
storyTrack.addEventListener('scroll',()=>{
 clearTimeout(storyScrollTimer);storyScrollTimer=setTimeout(updateStoryNavigation,120);
},{passive:true});
new ResizeObserver(updateStoryNavigation).observe(storyTrack);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
 storyTrack.scrollTo({left:0,behavior:'instant'});
 updateStoryNavigation();
}));
updateStoryNavigation();
const dialog=document.querySelector('#video-dialog'),video=document.querySelector('#story-video');let videoTrigger;
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
 videoTrigger=button;document.querySelector('#video-title').textContent=button.dataset.title;document.querySelector('#video-person').textContent=button.dataset.name;
 document.querySelector('#video-error').hidden=true;video.src='./assets/'+button.dataset.video;video.setAttribute('aria-label',button.dataset.title);
 dialog.showModal();document.body.classList.add('modal-open');video.play().catch(()=>{});
}));
const close=()=>dialog.close();document.querySelector('#close-video').addEventListener('click',close);
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}});
dialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();document.body.classList.remove('modal-open');videoTrigger?.focus();});
video.addEventListener('error',()=>{document.querySelector('#video-error').hidden=false;});
document.querySelector('#year').textContent=new Date().getFullYear();
// Measurement hook: no analytics vendor or tracking is enabled by default.
// A site-owned listener can send the event to an approved analytics provider.
const campaignKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const params=new URLSearchParams(location.search);const campaign=Object.fromEntries(campaignKeys.filter(k=>params.has(k)).map(k=>[k,params.get(k)]));
document.querySelectorAll('[data-contact]').forEach(link=>link.addEventListener('click',()=>{
 window.dispatchEvent(new CustomEvent('acm:contact',{detail:{method:link.dataset.contact,...campaign}}));
}));

// Reveal hero overlays as they enter view; parallax stays independent of entrance motion.
const heroVisual=document.querySelector('.hero-visual');
const heroFloats=[...document.querySelectorAll('.photo-label')];
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let heroFrame=0;
let heroObserver;
function updateHeroParallax(){
 heroFrame=0;
 if(motionPreference.matches)return;
 const rect=heroVisual.getBoundingClientRect();
 const travel=Math.max(-400,Math.min(800,scrollY));
 if(rect.bottom<0||rect.top>innerHeight)return;
 heroFloats.forEach(element=>{
  const offset=Math.max(-26.4,Math.min(26.4,travel*.0495));
  element.style.setProperty('--parallax-y',offset.toFixed(2)+'px');
 });
}
function queueHeroParallax(){
 if(!heroFrame&&!motionPreference.matches)heroFrame=requestAnimationFrame(updateHeroParallax);
}
function configureHeroMotion(){
 heroObserver?.disconnect();
 heroFloats.forEach(element=>{
  element.classList.remove('motion-pending','motion-entered');
  element.style.removeProperty('--parallax-y');
 });
 if(motionPreference.matches)return;
 heroFloats.forEach(element=>element.classList.add('hero-float','motion-pending'));
 heroObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.remove('motion-pending');
   entry.target.classList.add('motion-entered');
   heroObserver.unobserve(entry.target);
  });
 },{threshold:.15});
 heroFloats.forEach(element=>heroObserver.observe(element));
 queueHeroParallax();
}
if(heroVisual&&heroFloats.length){
 configureHeroMotion();
 addEventListener('scroll',queueHeroParallax,{passive:true});
 addEventListener('resize',queueHeroParallax,{passive:true});
 motionPreference.addEventListener('change',configureHeroMotion);
}

// Advantage cards reveal once; mobile cards enter individually without a stagger.
const advantageCards=[...document.querySelectorAll('.advantage-card')];
let advantageObserver;
function configureAdvantageMotion(){
 advantageObserver?.disconnect();
 advantageCards.forEach(card=>card.classList.remove('card-reveal','card-reveal-pending','card-reveal-visible'));
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 advantageObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.remove('card-reveal-pending');
   entry.target.classList.add('card-reveal-visible');
   advantageObserver.unobserve(entry.target);
  });
 },{threshold:.15,rootMargin:'0px 0px -24px 0px'});
 advantageCards.forEach((card,index)=>{
  card.style.setProperty('--card-delay',index*100+'ms');
  card.classList.add('card-reveal','card-reveal-pending');
  advantageObserver.observe(card);
 });
}
configureAdvantageMotion();
motionPreference.addEventListener('change',configureAdvantageMotion);

// Section 3 workflow panel enters from the right once it scrolls into view.
const workflowPanel=document.querySelector('#platform .workflow');
let workflowObserver;
function configureWorkflowMotion(){
 workflowObserver?.disconnect();
 if(!workflowPanel)return;
 workflowPanel.classList.remove('workflow-reveal','workflow-reveal-pending','workflow-reveal-visible');
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 workflowPanel.classList.add('workflow-reveal','workflow-reveal-pending');
 workflowObserver=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  workflowPanel.classList.remove('workflow-reveal-pending');
  workflowPanel.classList.add('workflow-reveal-visible');
  workflowObserver.disconnect();
 },{threshold:.15,rootMargin:'0px 0px -24px 0px'});
 workflowObserver.observe(workflowPanel);
}
configureWorkflowMotion();
motionPreference.addEventListener('change',configureWorkflowMotion);

// Section 4 support box enters left; numbered items enter right in sequence.
const supportElements=[...document.querySelectorAll('#support .support-statement,#support .support-list article')];
let supportObserver;
function configureSupportMotion(){
 supportObserver?.disconnect();
 supportElements.forEach(element=>element.classList.remove('support-reveal','support-reveal-pending','support-reveal-visible'));
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 supportObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.remove('support-reveal-pending');
   entry.target.classList.add('support-reveal-visible');
   supportObserver.unobserve(entry.target);
  });
 },{threshold:.15,rootMargin:'0px 0px -24px 0px'});
 supportElements.forEach((element,index)=>{
  element.style.setProperty('--support-delay',Math.max(0,index-1)*120+'ms');
  element.classList.add('support-reveal','support-reveal-pending');
  supportObserver.observe(element);
 });
}
configureSupportMotion();
motionPreference.addEventListener('change',configureSupportMotion);

// Sections 5–8 and 11: consistent, one-time scroll entrances.
const remainingRevealGroups=[
 {selector:'#stories .story-card',x:0,y:36,stagger:100},
 {selector:'#models .model-grid article',x:40,y:0,opposed:true,stagger:0},
 {selector:'#growth .resource-list details',x:40,y:0,stagger:120},
 {selector:'#transition .transition-grid article',x:0,y:36,stagger:100},
 {selector:'#connect .contact-card',x:40,y:0,stagger:0}
];
const remainingReveals=remainingRevealGroups.flatMap(group=>
 [...document.querySelectorAll(group.selector)].map((element,index)=>({
  element,x:group.opposed&&index===0?-group.x:group.x,y:group.y,delay:index*group.stagger
 }))
);
let remainingRevealObserver;
function configureRemainingReveals(){
 remainingRevealObserver?.disconnect();
 remainingReveals.forEach(({element})=>element.classList.remove('scroll-reveal','scroll-reveal-pending','scroll-reveal-visible'));
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 remainingRevealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.remove('scroll-reveal-pending');
   entry.target.classList.add('scroll-reveal-visible');
   remainingRevealObserver.unobserve(entry.target);
  });
 },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
 remainingReveals.forEach(({element,x,y,delay})=>{
  element.style.setProperty('--reveal-x',x+'px');
  element.style.setProperty('--reveal-y',y+'px');
  element.style.setProperty('--reveal-delay',delay+'ms');
  element.classList.add('scroll-reveal','scroll-reveal-pending');
  remainingRevealObserver.observe(element);
 });
}
configureRemainingReveals();
motionPreference.addEventListener('change',configureRemainingReveals);

// Play the footprint film only while it is visible; respect reduced motion.
const footprintVideo=document.querySelector('.footprint-video');
const footprintToggle=document.querySelector('.footprint-toggle');
let footprintVisible=false,footprintPaused=motionPreference.matches;
function syncFootprintVideo(){
 const shouldPlay=footprintVisible&&!footprintPaused&&!document.hidden;
 if(shouldPlay)footprintVideo.play().catch(()=>{});else footprintVideo.pause();
 footprintToggle.setAttribute('aria-label',footprintPaused?'Play map animation':'Pause map animation');
 footprintToggle.innerHTML=footprintPaused?'Play animation <span aria-hidden="true">▶</span>':'Pause animation <span aria-hidden="true">Ⅱ</span>';
}
if(footprintVideo){
 footprintVideo.muted=true;
 footprintVideo.autoplay=!motionPreference.matches;
 new IntersectionObserver(entries=>{footprintVisible=entries[0].isIntersecting;syncFootprintVideo();},{threshold:.1}).observe(footprintVideo);
 footprintToggle.addEventListener('click',()=>{footprintPaused=!footprintPaused;syncFootprintVideo();});
 motionPreference.addEventListener('change',()=>{footprintPaused=motionPreference.matches;syncFootprintVideo();});
 document.addEventListener('visibilitychange',syncFootprintVideo);
 syncFootprintVideo();
}
