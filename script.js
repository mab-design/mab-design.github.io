"use strict";
const header=document.querySelector('.header');
const toggle=document.querySelector('#menuToggle');
const nav=document.querySelector('#siteNav');
const navLinks=[...nav.querySelectorAll('a')];
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Apri il menu')}
function setScrolledHeader(){header.classList.toggle('is-scrolled',window.scrollY>36)}
setScrolledHeader();window.addEventListener('scroll',setScrolledHeader,{passive:true});
toggle.addEventListener('click',()=>{const opening=!nav.classList.contains('open');nav.classList.toggle('open',opening);toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Chiudi il menu':'Apri il menu')});
navLinks.forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('pointerdown',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeMenu()});
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu()});
document.querySelector('#year').textContent=new Date().getFullYear();

const links=[...nav.querySelectorAll('a')],sections=[...document.querySelectorAll('main section[id]')];
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{const e=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!e)return;links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))},{rootMargin:'-25% 0px -55% 0px'});sections.forEach(s=>observer.observe(s))}

const projectData={
 architecture:{title:'Architecture Concept',image:'project-architecture.webp',alt:'Concept architettonico con illuminazione serale',description:'Studio concettuale di un sito web per un’attività nel settore architettura: fotografia protagonista, impaginazione essenziale e contrasti raffinati.'},
 identity:{title:'Natural Identity',image:'project-identity.webp',alt:'Materiali grafici con texture naturali',description:'Esercizio di brand identity per un marchio ispirato alla natura: colori coordinati, tipografia e applicazioni del logo.'},
 digital:{title:'Digital Experience',image:'project-web.webp',alt:'Layout di sito web mostrato su un laptop',description:'Prototipo visivo di esperienza web con priorità a gerarchia dei contenuti, chiarezza dei percorsi e presentazione fotografica.'}
};
const projectDialog=document.querySelector('#projectDialog');
let previousFocus=null;
document.querySelectorAll('.project-open').forEach(button=>button.addEventListener('click',()=>{const data=projectData[button.dataset.project];if(!data)return;previousFocus=document.activeElement;document.querySelector('#projectDialogTitle').textContent=data.title;const im=document.querySelector('#projectDialogImage');im.src=data.image;im.alt=data.alt;document.querySelector('#projectDialogText').textContent=data.description;projectDialog.showModal()}));
const contactDialog=document.querySelector('#contactDialog');
const contactForm=document.querySelector('#contactForm');
const contactStatus=document.querySelector('#contactFormStatus');
const contactSubmit=document.querySelector('#contactSubmit');
const rawEndpoint=(window.MAB_CONTACT && window.MAB_CONTACT.formspreeEndpoint || '').trim();
const endpoint=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(rawEndpoint)?rawEndpoint:null;
const isContactReady=Boolean(endpoint);
if(isContactReady){
  contactForm.action=endpoint;
  contactSubmit.disabled=false;
  contactStatus.textContent='I campi contrassegnati con * sono obbligatori.';
} else {
  contactStatus.textContent='Modulo in preparazione: invio disattivato fino al collegamento del servizio.';
}
document.querySelector('#copyMessage').addEventListener('click',()=>{
  previousFocus=document.activeElement;
  contactDialog.showModal();
});
for(const btn of document.querySelectorAll('[data-close]')){
  btn.addEventListener('click',()=>document.getElementById(btn.dataset.close).close());
}
for(const dialog of [projectDialog,contactDialog]){
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{if(previousFocus&&previousFocus.isConnected)previousFocus.focus()});
}
contactForm.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!isContactReady){
  contactStatus.textContent='Invio non ancora attivo: configurare l’endpoint Formspree.';
  return;
 }
 if(!contactForm.reportValidity())return;
 const honeypot=document.querySelector('#contactWebsite');
 if(honeypot.value.trim())return;
 const initialText=contactSubmit.textContent;
 contactSubmit.disabled=true;
 contactSubmit.textContent='Invio in corso…';
 contactStatus.textContent='Invio della richiesta in corso…';
 contactStatus.classList.remove('is-success','is-error');
 try{
  const response=await fetch(endpoint,{
    method:'POST',
    body:new FormData(contactForm),
    headers:{'Accept':'application/json'}
  });
  if(response.ok){
    contactStatus.textContent='Richiesta ricevuta dal servizio di contatto. Grazie! Ti risponderò appena possibile.';
    contactStatus.classList.add('is-success');
    contactForm.reset();
  }else{
    const payload=await response.json().catch(()=>null);
    const msg=payload && Array.isArray(payload.errors) ? payload.errors.map(e=>e.message).filter(Boolean).join(' ') : '';
    contactStatus.textContent=msg || 'Non è stato possibile inviare la richiesta. Riprova tra poco.';
    contactStatus.classList.add('is-error');
  }
 }catch{
    contactStatus.textContent='Impossibile raggiungere il servizio. Controlla la connessione e riprova.';
    contactStatus.classList.add('is-error');
 }finally{
   contactSubmit.disabled=false;
   contactSubmit.textContent=initialText;
 }
});
