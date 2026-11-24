(()=>{'use strict';
const products={"flowstate":["FlowState","#8B5CF6","#F1EAFE","Plus Jakarta Sans","DM Mono","F"],"datalens":["DataLens","#0891B2","#E0F7FC","IBM Plex Sans","IBM Plex Mono","D"],"promptlab":["PromptLab","#D946EF","#FBE7FF","Space Grotesk","DM Mono","P"],"roboroute":["RoboRoute","#16A34A","#E4F8EA","Rajdhani","IBM Plex Mono","R"],"budgetboard":["BudgetBoard","#B45309","#FEF3D8","DM Sans","DM Mono","B"],"studykit":["StudyKit","#2563EB","#E8F0FF","Nunito","DM Mono","S"],"cvstudio":["CV Studio","#E11D48","#FFE8EF","Libre Franklin","IBM Plex Mono","C"],"habittrack":["HabitTrack","#65A30D","#EEF8D8","Outfit","DM Mono","H"]};
function init(){
const main=document.querySelector('main');if(!main||document.querySelector('.product-sidebar'))return;
const slug=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'product',p=products[slug]||['Workspace','#6B8EAE','#EAF1F5','Manrope','DM Mono','P'],name=p[0];
document.body.classList.add('pl-product-'+slug);
['accent','soft','font','mono'].forEach((k,i)=>document.body.style.setProperty('--product-'+k,[p[1],p[2],"'"+p[3]+"',sans-serif","'"+p[4]+"',monospace"][i]));
const top=document.querySelector('body > nav.top');if(top)top.remove();
const side=document.createElement('aside');side.className='product-sidebar';
side.innerHTML='<a class="ps-brand" href="../../index.html"><span class="ps-mark">'+p[5]+'</span><span>PORTFOLIO <b>LABS</b></span></a><div class="ps-product"><small>YOUR WORKSPACE</small><strong>'+name+'</strong><span class="ps-local"><i></i> SAVED ON THIS DEVICE</span></div><nav class="ps-nav" aria-label="'+name+' pages"></nav><div class="ps-bottom"><a href="../../projects/index.html">← All products</a><a class="ps-home" href="../../index.html">⌂ Back to homepage</a></div><button class="ps-close" type="button" aria-label="Close navigation">×</button>';
const layout=document.createElement('div');layout.className='product-layout';const content=document.createElement('div');content.className='product-content';
main.parentNode.insertBefore(layout,main);layout.append(side,content);content.append(main);
const footer=document.querySelector('body > footer');if(footer)content.append(footer);
const nav=side.querySelector('.ps-nav');let pages=[],active=0;
function buildPages(){
if(pages.length)return;
const headings=[...main.querySelectorAll('h2')];
const seen=new Set();
headings.forEach((h,i)=>{
const section=h.closest('section,.panel,article')||h.parentElement;
if(!section||seen.has(section))return;seen.add(section);
pages.push({title:h.textContent.trim().replace(/\s+/g,' ').slice(0,32)||('Page '+(i+1)),node:section});
});
if(!pages.length)pages=[{title:'Workspace',node:null}];
const overview=document.createElement('button');overview.type='button';overview.className='ps-link active';overview.textContent='Overview';overview.addEventListener('click',()=>showPage(-1));nav.append(overview);
pages.forEach((page,i)=>{const b=document.createElement('button');b.type='button';b.className='ps-link';b.textContent=page.title;b.addEventListener('click',()=>showPage(i));nav.append(b)});
function showPage(index){
active=index;const buttons=[...nav.querySelectorAll('button')];
buttons.forEach((b,i)=>b.classList.toggle('active',i===(index<0?0:index+1)));
pages.forEach((page,i)=>{if(page.node)page.node.classList.toggle('pl-page-hidden',index>=0&&i!==index)});
main.classList.toggle('pl-overview-mode',index<0);
if(index>=0&&pages[index].node)pages[index].node.scrollIntoView({behavior:'smooth',block:'start'});
else main.scrollIntoView({behavior:'smooth',block:'start'});
side.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');
}
showPage(-1);
}
const toggle=document.createElement('button');toggle.className='ps-mobile-toggle';toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span>☰</span> '+name+' <span class="ps-toggle-end">Pages</span>';content.insertBefore(toggle,main);
toggle.onclick=()=>{side.classList.toggle('is-open');toggle.setAttribute('aria-expanded',side.classList.contains('is-open'))};
side.querySelector('.ps-close').onclick=()=>{side.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')};
buildPages();
if(!pages.length||pages[0].title==='Workspace'){const observer=new MutationObserver(()=>{if(main.querySelector('h2')){observer.disconnect();nav.innerHTML='';pages=[];buildPages()}});observer.observe(main,{childList:true,subtree:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();