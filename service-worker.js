
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
    console.log("Workbox berhasil dimuat");
    workbox.precaching.precacheAndRoute([
        {url: "/", revision: '1'},
        {url: "/nav.html", revision: '1'},
        {url: "/index.html", revision: '1'},
        {url: "/team.html", revision: '1'},
        {url: "/pages/home.html", revision: '1'},
        {url: "/pages/about.html", revision: '1'},
        {url: "/pages/contact.html", revision: '1'},
        {url: "/pages/saved.html", revision: '1'},
        {url: "/css/materialize.min.css", revision: '1'},
        {url: "/css/style.css", revision: '1'},
        {url: "/js/materialize.min.js", revision: '1'},
        {url: "/js/nav.js", revision: '1'},
        {url: "/js/api.js", revision: '1'},
        {url: "/js/db.js", revision: '1'},
        {url: "/js/idb.js", revision: '1'},
        {url: "/js/script.js", revision: '1'},
        {url: "js/notification.js", revision: '1'},
        {url: "/images/icon72.png", revision: '1'},
        {url: "/images/icon96.png", revision: '1'},
        {url: "/images/icon128.png", revision: '1'},
        {url: "/images/icon144.png", revision: '1'},
        {url: "/images/icon152.png", revision: '1'},
        {url: "/images/icon384.png", revision: '1'},
        {url: "/images/icon512.png", revision: '1'},
        {url: "/manifest.json", revision: '1'},
    ],{
        ignoreUrlParametersMatching: [/.*/]
    })
}

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
)

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('/css/materialize.min.css'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('.*\.png'),
    workbox.strategies.cacheFirst()
);

self.addEventListener('push', event=>{
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push Message no Payload'
    }
    var options = {
        body: body,
        icon: 'images/icon72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
})