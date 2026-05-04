var CACHE_NAME = 'gi-maintenance-v3';
var ASSETS = [
  '/GreenIdea-Maintenance/',
  '/GreenIdea-Maintenance/index.html',
  '/GreenIdea-Maintenance/manifest.json',
  '/GreenIdea-Maintenance/icon-192.png',
  '/GreenIdea-Maintenance/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS.map(function(url){
        return new Request(url, {mode:'no-cors'});
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Firebase & API calls — always network
  if(e.request.url.indexOf('firestore') > -1 ||
     e.request.url.indexOf('firebase') > -1 ||
     e.request.url.indexOf('googleapis.com') > -1 && e.request.url.indexOf('fonts') === -1){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(response){
        return caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(function(){
      return caches.match('/GreenIdea-Maintenance/index.html');
    })
  );
});
