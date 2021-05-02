let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
  './',
  'https://unpkg.com/dexie@latest/dist/dexie.js',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
  'https://data.cityofchicago.org/resource/4ijn-s7e5.json',
  'https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=77017591ad42d71f19a6a35cdeb2ab0e',
  'https://maps.googleapis.com/maps/api/js/AuthenticationService.Authenticate?1shttps%3A%2F%2Fit202-spring2021-bigproject.hamzaali198.repl.co%2F&4sAIzaSyBnpizRoZESqi7RuQ7i8R0XVxOI0cqXmxk&callback=_xdc_._yvv5qj&key=AIzaSyBnpizRoZESqi7RuQ7i8R0XVxOI0cqXmxk&token=97339',
  'https://maps.gstatic.com/mapfiles/openhand_8_8.cur',
  'https://maps.googleapis.com/maps/api/js/StaticMapService.GetMapImage?1m2&1i134094&2i194663&2e1&3u11&4m2&1u859&2u400&5m5&1e0&5sen-US&6sus&10b1&12b1&key=AIzaSyBnpizRoZESqi7RuQ7i8R0XVxOI0cqXmxk&token=36153',
  'https://maps.googleapis.com/maps/api/js/ViewportInfoService.GetViewportInfo?1m6&1m2&1d41.554673485373876&2d-88.52863263690134&2m2&1d42.1886276576409&2d-86.72902079304656&2u11&4sen-US&5e0&6sm%40555000000&7b0&8e0&12e2&callback=_xdc_._n5qd39&key=AIzaSyBnpizRoZESqi7RuQ7i8R0XVxOI0cqXmxk&token=49080'
];


self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});