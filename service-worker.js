const CACHE_NAME = "satvika-publisher-shell-v1";

const APP_SHELL_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/styles.css",
    "./css/laptop.css",
    "./css/mobile.css",
    "./css/newspaper-page.css",
    "./css/news-shapes.css",
    "./assets/icons/icon.svg"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(APP_SHELL_FILES);
        })
    );

    self.skipWaiting();
});


self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            const deleteTasks = cacheNames.map(function (cacheName) {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }

                return Promise.resolve(false);
            });

            return Promise.all(deleteTasks);
        })
    );

    self.clients.claim();
});


self.addEventListener("fetch", function (event) {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(function (response) {
                    if (response && response.ok) {
                        const responseCopy = response.clone();

                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put("./index.html", responseCopy);
                        });
                    }

                    return response;
                })
                .catch(function () {
                    return caches.match(request).then(function (cachedPage) {
                        return cachedPage || caches.match("./index.html");
                    });
                })
        );

        return;
    }

    event.respondWith(
        caches.match(request).then(function (cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then(function (response) {
                if (!response || !response.ok) {
                    return response;
                }

                const responseCopy = response.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(request, responseCopy);
                });

                return response;
            });
        })
    );
});
