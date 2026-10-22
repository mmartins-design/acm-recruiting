const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
menu.addEventListener('click', () => {
 const open=menu.getAttribute('aria-expanded')!=='true';
 menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);
});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');navigation.classList.remove('open');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}});
const cards=[...document.querySelectorAll('.story-card')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let visible=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)visible++;});
 document.querySelector('#story-status').textContent=`Showing ${visible} ${visible===1?'story':'stories'}`;
}));
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
