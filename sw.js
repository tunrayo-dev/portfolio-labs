const CACHE='portfolio-labs-v37';
const CORE=[
 './','./index.html','./assets/site.css','./assets/tech-theme.css','./assets/redesign.css',
 './assets/cinematic.css','./assets/launch-theme.css','./assets/master-home.css',
 './assets/design-system.css','./assets/product-visuals.css','./assets/theme-sync.js',
 './assets/calendar.css','./calendar.html','./assets/product-footer.js',
 './assets/product-suite.js','./assets/product-sidebar.js','./assets/product-sidebar.css',
 './assets/flowstate-redesign.css','./assets/project.css','./assets/pwa.js',
 './assets/navigation.js','./assets/site-shell.js','./assets/icon.svg','./manifest.webmanifest',
 './projects/flowstate/index.html','./projects/flowstate/app.js',
 './projects/datalens/index.html','./projects/datalens/app.js',
 './projects/promptlab/index.html','./projects/promptlab/app.js',
 './projects/roboroute/index.html','./projects/roboroute/app.js',
 './assets/extra-projects.css','./projects/index.html',
 './projects/budgetboard/index.html','./projects/budgetboard/app.js',
 './projects/studykit/index.html','./projects/studykit/app.jsx',
 './projects/cvstudio/index.html','./projects/cvstudio/app.js',
 './projects/habittrack/index.html','./projects/habittrack/app.js',
 './projects/sellsmart/index.html','./projects/sellsmart/app.js',
 './projects/readwell/index.html','./projects/readwell/app.js',
 './code-projects/index.html','./privacy.html','./install.html',
 './account.html','./assets/account.css','./assets/account-link.js',
 ''
];
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('portfolio-labs-')&&key!==CACHE).map(key=>caches.delete(key))))
 .then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const url=new URL(request.url);
 const page=request.mode==='navigate'||request.destination==='document';
 const refreshable=page||['style','script'].includes(request.destination)||/\.(?:html|css|js)$/.test(url.pathname);
 if(refreshable){
  event.respondWith((async()=>{
   try{
    const freshRequest=new Request(request,{cache:'no-store'});
    const response=await fetch(freshRequest);
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}
    return response;
   }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    if(page){const home=await caches.match('./index.html');if(home)return home}
    return Response.error();
   }
  })());
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}
  return response;
 })));
});
