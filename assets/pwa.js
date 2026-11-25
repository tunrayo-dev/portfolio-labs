(()=>{'use strict';
const script=document.currentScript;
const root=new URL('../',script.src);
const nav=document.querySelector('.top');
if(nav&&!document.getElementById('installApp')){
 const button=document.createElement('button');
 button.id='installApp';button.className='btn';button.type='button';
 button.textContent='Install app';button.hidden=true;button.style.cssText='padding:8px 11px;font-size:11px';
 nav.append(button);let promptEvent=null;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;button.hidden=false});
 button.addEventListener('click',async()=>{if(!promptEvent){alert('To install: open your browser menu and choose “Install app” or “Add to Home screen”.');return}promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;button.hidden=true});
}
if('serviceWorker'in navigator&&location.protocol!=='file:'){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register(new URL('sw.js',root),{updateViaCache:'none'})
   .then(registration=>registration.update())
   .catch(()=>{});
 });
}
})();