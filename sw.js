var CACHE = 'gi-maintenance-v1';
var URLS = ['/GreenIdea-Maintenance/', '/GreenIdea-Maintenance/index.html'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(URLS); }));
});
self.addEventListener('fetch', function(e){
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
