// LaunchServe Service Worker
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>clients.claim())
  );
});
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request)));
self.addEventListener('push',e=>{
  const data=e.data?e.data.json():{title:'The Dancing Cup',body:'Update on your order'};
  e.waitUntil(
    self.registration.showNotification(data.title||'The Dancing Cup',{
      body:data.body||'',
      icon:'/icon-192.png',
      badge:'/icon-192.png',
      tag:'order-ready',
      requireInteraction:true
    })
  );
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cs=>{
    if(cs.length)return cs[0].focus();
    return clients.openWindow('/');
  }));
});
