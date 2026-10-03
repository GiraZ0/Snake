const CACHE_NAME = "neon-snake-v3";

const FICHIERS = [
    "./Snake.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// Installation
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FICHIERS))
    );

    self.skipWaiting();
});

// Activation
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cachesExistantes =>
            Promise.all(
                cachesExistantes
                    .filter(nom => nom !== CACHE_NAME)
                    .map(nom => caches.delete(nom))
            )
        )
    );

    self.clients.claim();
});

// Gestion des fichiers
self.addEventListener("fetch", event => {

    // On laisse le navigateur gérer directement
    // les pages HTML ouvertes
    if (event.request.mode === "navigate") {
        return;
    }

    // Pour les autres fichiers : cache puis réseau
    event.respondWith(
        caches.match(event.request)
            .then(reponse => {
                return reponse || fetch(event.request);
            })
    );
});