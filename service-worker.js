const CACHE="eolas-prototype-reset-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./css/tokens.css","./css/app.css","./css/components.css","./js/app.js","./js/core/router.js","./js/core/storage.js","./js/core/state.js","./js/core/regions.js","./js/modules/home.js","./js/modules/regions.js","./js/modules/paldex.js","./js/modules/bases.js","./js/modules/settings.js","./data/games/palworld/pals.json","./data/games/palworld/regions.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 const code=e.request.mode==="navigate"||/\.(html|js|css|json)$/.test(u.pathname);
 if(code){
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
 }else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
