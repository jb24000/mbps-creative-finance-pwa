const CACHE_NAME = "mbps-creative-finance-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  // If you later host Tailwind locally or add icons, add them here too.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          // Fallback: if offline and asking for root, show cached index
          event.request.mode === "navigate"
            ? caches.match("./index.html")
            : undefined
        )
      );
    })
  );
});
