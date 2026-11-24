(()=>{'use strict';
const products={"flowstate":["FlowState","#8B5CF6","#F1EAFE","Plus Jakarta Sans","DM Mono","F"],"datalens":["DataLens","#0891B2","#E0F7FC","IBM Plex Sans","IBM Plex Mono","D"],"promptlab":["PromptLab","#D946EF","#FBE7FF","Space Grotesk","DM Mono","P"],"roboroute":["RoboRoute","#16A34A","#E4F8EA","Rajdhani","IBM Plex Mono","R"],"budgetboard":["BudgetBoard","#B45309","#FEF3D8","DM Sans","DM Mono","B"],"studykit":["StudyKit","#2563EB","#E8F0FF","Nunito","DM Mono","S"],"cvstudio":["CV Studio","#E11D48","#FFE8EF","Libre Franklin","IBM Plex Mono","C"],"habittrack":["HabitTrack","#65A30D","#EEF8D8","Outfit","DM Mono","H"]};
const clean=s=>s.replace(/\s+/g,' ').trim().slice(0,34);
function init(){
const main=document.querySelector('main');if(!main||document.querySelector('.product-sidebar'))return;
const slug=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'product',p=products[slug]||['Workspace','#6B8EAE','#EAF1F5','Manrope','DM Mono','P'],name=p[0];
document.body.classList.add('pl-product-'+slug);
['accent','soft','font','mono'].forEach((k,i)=>document.body.style.setProperty('--product-'+k,[p[1],p[2],"'"+p[3]+"',sans-serif","'"+p[4]+"',monospace"][i]));
const top=document.querySelector('body > nav.top');if(top)top.remove();
const side=document.createElement('aside');side.className='product-sidebar';side.innerHTML='<a class="ps-brand" href="../../index.html"><span class="ps-mark">'+p[5]+'</span><span>PORTFOLIO <b>LABS</b></span></a><div class="ps-product"><small>YOUR WORKSPACE</small><strong>'+name+'</strong><span class="ps-local"><i></i> SAVED ON THIS DEVICE</span></div><nav class="ps-nav" aria-label="'+name+' pages"></nav><div class="ps-bottom"><a href="../../projects/index.html">← All products</a><a class="ps-home" href="../../index.html">⌂ Back to homepage</a></div><button class="ps-close" type="button" aria-label="Close navigation">×</button>';
const layout=document.createElement('div');layout.className='product-layout';const content=document.createElement('div');content.className='product-content';main.parentNode.insertBefore(layout,main);layout.append(side,content);content.append(main);const footer=document.querySelector('body > footer');if(footer)content.append(footer);
const toggle=document.createElement('button');toggle.className='ps-mobile-toggle';toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span>☰</span> '+name+' <span class="ps-toggle-end">Pages</span>';content.insertBefore(toggle,main);
const close=()=>{side.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')};toggle.onclick=()=>{side.classList.toggle('is-open');toggle.setAttribute('aria-expanded',side.classList.contains('is-open'))};side.querySelector('.ps-close').onclick=close;
const nav=side.querySelector('.ps-nav');let pages=[],overview;
function addPage(title,node){if(!node||pages.some(p=>p.node===node))return;pages.push({title:clean(title)||'Workspace',node})}
function discover(){
pages=[];
if(slug==='roboroute'){
const board=main.querySelector('.sim > .panel');const controls=main.querySelector('.sim > .controls');
if(board)addPage('Map editor',board);if(controls)addPage('Route planning & simulation',controls);
}else{
main.querySelectorAll('h2').forEach(h=>{
const node=h.closest('section')||h.closest('article')||h.closest('.panel')||h.parentElement;
addPage(h.textContent,node);
});
}
if(!pages.length){
const root=main.querySelector('#root');
if(root)root.querySelectorAll('section').forEach(s=>addPage(s.querySelector('h2')?.textContent||'Study workspace',s));
}
}
function renderNav(){
nav.innerHTML='';
overview=document.createElement('button');overview.type='button';overview.className='ps-link';overview.textContent='Overview';overview.addEventListener('click',()=>show(-1));nav.append(overview);
pages.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-link';b.textContent=p.title;b.addEventListener('click',()=>show(i));nav.append(b)});
}
function makeOverview(){
let panel=main.querySelector('.pl-overview-panel');if(panel)return panel;
panel=document.createElement('section');panel.className='pl-overview-panel';
panel.innerHTML='<div class="pl-overview-heading"><span>WORKSPACE OVERVIEW</span><h2>'+name+'</h2><p>Choose a workspace page to get started. Your existing tools and saved work remain in this application.</p></div><div class="pl-page-launchers"></div>';
const hero=main.querySelector('.hero');if(hero)hero.after(panel);else main.prepend(panel);
const grid=panel.querySelector('.pl-page-launchers');
pages.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='pl-launch-card';b.innerHTML='<span class="pl-launch-index">'+String(i+1).padStart(2,'0')+'</span><strong></strong><span class="pl-launch-open">Open page ↗</span>';b.querySelector('strong').textContent=p.title;b.addEventListener('click',()=>show(i));grid.append(b)});
return panel;
}
function show(index){
const panel=makeOverview();panel.hidden=index>=0;
pages.forEach((p,i)=>p.node.classList.toggle('pl-page-hidden',index<0||i!==index));
[...nav.querySelectorAll('button')].forEach((b,i)=>b.classList.toggle('active',i===(index<0?0:index+1)));
main.classList.toggle('pl-page-mode',index>=0);close();
if(index>=0)pages[index].node.scrollIntoView({behavior:'smooth',block:'start'});else{panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'})}
}
discover();renderNav();makeOverview();show(-1);
if(slug==='studykit'||!pages.length){const observer=new MutationObserver(()=>{const before=pages.length;discover();if(pages.length!==before||!nav.children.length){renderNav();const old=main.querySelector('.pl-overview-panel');if(old)old.remove();makeOverview();show(-1)}});observer.observe(main,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),10000)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();