'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "3768feb8417afc82fc5976d251bf6694",
"index.html": "4c7180c76d8166373e24d8af1a38c3ee",
"/": "4c7180c76d8166373e24d8af1a38c3ee",
"main.dart.js": "cc4bbe542be3f4d3a39a8b5ee944ef08",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "2491b1c01ebb8603f9ba89d6e1c29539",
"icons/Icon-192.png": "d6ed48a625fe8a890d521701ab930712",
"icons/Icon-512.png": "9c4858cc025ef3703ea072857fbb4f04",
"manifest.json": "073a7e7fdf1511c7fe777e7eee63f8b2",
"assets/AssetManifest.json": "d2b83f640e510b88642acf374df07b79",
"assets/NOTICES": "b2c14c0555da363c1ca63b36aac8b7f4",
"assets/FontManifest.json": "3ddd9b2ab1c2ae162d46e3cc7b78ba88",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "dffd9504fcb1894620fa41c700172994",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "4b6a9b7c20913279a3ad3dd9c96e155b",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "00bb2b684be61e89d1bc7d75dee30b58",
"assets/shaders/ink_sparkle.frag": "70eb5306541f3074e2e6de35f71ea9b2",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/sakura1.png": "d42a605aa21da2115d1fcf95fe74701c",
"assets/assets/images/sakura2.png": "a4f24ec0ec7105ae5a7e37dc1790a6da",
"assets/assets/images/sakura3.png": "321ff53f2b4584c0ad42047723c3fed4",
"assets/assets/images/zazkia1.png": "93592f4470747d8c8fa786d1f32d39f6",
"assets/assets/images/zazkia2.png": "f0588a01580ad53519f149dad172881c",
"assets/assets/images/bir1.jpg": "19b312a0ef2b771c600f866609bf3dbd",
"assets/assets/images/umkm_default.png": "6050926940e2bd4175766df136a77c89",
"assets/assets/images/vamelia1.jpeg": "ffdc68de296b14676d1985aa66cd5390",
"assets/assets/images/green1.jpg": "ca09bb10dda36791138692d8d1d2c722",
"assets/assets/images/background.jpeg": "cc7c7a6bb7f9c004cc554b2b85ec8ec0",
"assets/assets/images/toga2.webp": "1cac3cdfc48c5ed9c023b30527fedb47",
"assets/assets/images/toga1.jpg": "21e998195281530a4d1a5a42abf15021",
"assets/assets/images/logo.png": "2491b1c01ebb8603f9ba89d6e1c29539",
"assets/assets/images/tabulampot1.jpeg": "09f0fce8db0d43236a4559322917716c",
"assets/assets/images/toga3.webp": "6b12535f9c058438f7af553126f0e806",
"assets/assets/images/setia3.jpeg": "781db5e4af809c03da591c0bfa59f162",
"assets/assets/images/setia1.png": "56c635ea19f1d63c56e4a894091bf1ba",
"assets/assets/images/green3.webp": "3e1a37c6b2c78c8e6a28a23d27cf51e0",
"assets/assets/images/tabulampot3.webp": "01a2c601833cf9641fa59bcb94b49cee",
"assets/assets/images/tabulampot2.webp": "be66a7eb7a11dd23d54b0fb6800c0e9a",
"assets/assets/images/green2.webp": "24fc32b57cae51a40d8ea01287b67dc6",
"assets/assets/images/setia2.jpeg": "c8bdfcfd4a147134f45ff315c71ba3b1",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
