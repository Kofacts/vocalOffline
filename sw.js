var cacheName= "iamVocal";
var filesToCache = [
    '/',
   '/blog',
    '/polls',
    '/about_us',
    'assets/custom/style.css',
    'img/logo.png',
    'https://code.jquery.com/jquery-3.2.1.min.js',
    'assets/custom/particles.json',
    'assets/custom/style.js',
    'assets/materialize/materialize/css/materialize.css',
    'assets/materialize/materialize/js/materialize.js',
    'assets/particlesjs/particles.js',
    'assets/slick/slick/slick.css',
    'assets/slick/slick/slick-theme.css',
    'assets/slick/slick/slick.js',
    'src/logo.png',
];

// Install Service Worker
self.addEventListener('install', function(event) {

    console.log('Service Worker: Installing....');

    event.waitUntil(

        // Open the Cache
        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching App Shell at the moment......');

            // Add Files to the Cache
            return cache.addAll(filesToCache);
        })
    );
});


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if( key !== cacheName) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
    console.log('[demoPWA - ServiceWorker] Fetch event fired.', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                console.log('[demoPWA - ServiceWorker] Retrieving from cache...');
                return response;
            }
            console.log('[demoPWA - ServiceWorker] Retrieving from URL...');
            return fetch(e.request).catch(function (e) {
               //you might want to do more error checking here too,
               //eg, check what e is returning..
               console.log('You appear to be offline, please try again when back online');
               window.href='/';
            });
        })
    );
});