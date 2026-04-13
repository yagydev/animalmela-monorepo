/* global window, navigator, document */
/* Public file: do NOT use process.env — it does not exist in the browser. */
(function () {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  var host = window.location.hostname || '';
  var isLocalDev =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /\.local$/i.test(host) ||
    // LAN dev (e.g. phone → http://192.168.x.x:3000) — must not register PWA SW or stale chunks break.
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);

  if (isLocalDev) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
      });
    });
    if (window.caches && window.caches.keys) {
      window.caches.keys().then(function (keys) {
        keys.forEach(function (key) {
          window.caches.delete(key);
        });
      });
    }
    return;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function (registration) {
        console.log('SW registered: ', registration);

        registration.addEventListener('updatefound', function () {
          var newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', function () {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                if (
                  window.confirm(
                    'New content is available. Refresh to get the latest version?'
                  )
                ) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(function (registrationError) {
        console.error('Service Worker registration failed:', registrationError);
      });
  });

  navigator.serviceWorker.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      window.location.reload();
    }
  });
})();
