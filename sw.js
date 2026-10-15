const C='pp-1.0-bd7b390903',F=["content.js", "core.js", "data/lms.js", "drugs.js", "icon.png", "index.html", "manifest.webmanifest", "og.png", "style.css", "ui.js", "upd.js"];
// v3.6+: sieć najpierw (świeże pliki), cache tylko offline; stare cache i stare SW usuwane automatycznie
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(f=>fetch(new Request('./'+f,{cache:'reload'})).then(r=>r.ok&&c.put('./'+f,r)).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();const old=ks.filter(k=>k!==C);await Promise.all(old.map(k=>caches.delete(k)));await self.clients.claim();
 if(old.length){const cl=await self.clients.matchAll({type:'window'});cl.forEach(c=>{try{c.navigate(c.url)}catch(_){}})}})())});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
 e.respondWith(fetch(q,{cache:'no-store'}).then(n=>{if(n.ok){const c=n.clone();caches.open(C).then(x=>x.put(q,c))}return n}).catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
