const CACHE_NAME = "eolas-iteration-02-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/app.css",
  "./css/components.css",
  "./js/app.js",
  "./js/core/router.js",
  "./js/core/storage.js",
  "./js/core/state.js",
  "./js/core/regions.js",
  "./js/modules/home.js",
  "./js/modules/regions.js",
  "./js/modules/paldex.js",
  "./js/modules/bases.js",
  "./js/modules/settings.js",
  "./data/games/palworld/game.json",
  "./data/games/palworld/regions.json",
  "./data/games/palworld/pals.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkRequest = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkRequest;
    })
  );
});
