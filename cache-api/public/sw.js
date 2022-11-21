var CACHE_STATIC_NAME = "STATIC-V4";
var CACHE_DYNAMIC_NAME = "DYNAMIC-V2";
self.addEventListener("install", function (event) {
  console.log("[Service Worker] Installing Service Worker ...", event);

  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      console.log("[Service worker] Precaching App Shell");
      cache.addAll([
        "/",
        "/index.html",
        "/offline.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/promise.js",
        "/src/js/fetch.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
      ]);
    })
  );
});

// a cmt

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating Service Worker ....", event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[Service worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request)
//         .then(function (fetchRes) {
//           return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
//             cache.put(event.request.url, fetchRes.clone());
//             return fetchRes;
//           });
//         })
//         .catch(function (e) {
//           return caches.open(CACHE_STATIC_NAME).then(function (cache) {
//             return cache.match("/offline.html");
//           });
//         });
//     })
//   );
// });

self.addEventListener("fetch", function (event) {
  var url = "https://httpbin.org/get";
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(function (fetchRes) {
            return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
              cache.put(event.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
          .catch(function (e) {
            return caches.open(CACHE_STATIC_NAME).then(function (cache) {
              if (event.request.url.indexOf("/help") > -1) {
                return cache.match("/offline.html");
              }
            });
          });
      })
    );
  }
});

// // Cache-Only
// self.addEventListener("fetch", function (event) {
//   event.respondWith(caches.match(event.request));
// });

// // Network-Only
// self.addEventListener("fetch", function (event) {
//   event.respondWith(fetch(event.request));
// });

// // Network with cache fallback
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (response) {
//         caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
//           cache.put(event.request.url, response.clone());
//         });
//       })
//       .catch(function (e) {
//         caches.match(event.request);
//       })
//   );
// });
