/* ===============================
   CACHE VERSION (CHANGE WHEN UPDATE 🔥)
================================= */
const CACHE_NAME = "glowgirl-v6"; // Bumped to v6 for Checkout update

/* ===============================
   FILES TO CACHE
================================= */
const urlsToCache = [
  "/",
  "index.html",
  "cart.html",
  "wishlist.html",
  "checkout.html",  // ✅ Added Checkout Page
  "pwa.html",
  "css/style.css",
  "js/app.js",

  // images
  "images/Lehenga.jpeg",
  "images/Anarkali.jpeg",
  "images/lehengaparty4.jpeg",
  "images/festivallehenge.jpeg",
  "images/blazeroffice.jpeg",
  "images/skirt.jpeg",
  "images/t-shirts.jpeg",
  "images/sweatshirtskirt.jpeg",
  "images/blazer.jpeg",
  "images/elegant.jpeg",
  "images/longfrock.jpeg",
  "images/longfrockdress.jpeg",
  "images/bridaldress.jpeg"
];


/* ===============================
   INSTALL
================================= */
self.addEventListener("install", event => {
  console.log("Service Worker Installing...");

  self.skipWaiting(); 

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching files...");
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log("Cache failed:", err))
  );
});


/* ===============================
   ACTIVATE
================================= */
self.addEventListener("activate", event => {
  console.log("Service Worker Activated");

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim(); 
});


/* ===============================
   FETCH (SMART STRATEGY 🔥)
================================= */
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});