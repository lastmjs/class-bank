const CACHE_NAME = 'CLASS_BANK_CACHE_V2';
const urlsToCache = [
    '/'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', async (event) => {    
    event.respondWith(
        caches
        .match(event.request)
        .then((response) => {
            if (response) {
                return response;
            }
            else {
                return fetch(event.request);
            }
        }));
});