/**
 * PWA Service Worker Registration Helper
 * Mendaftarkan /sw.js untuk kemampuan instalasi PWA dan caching offline.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // JANGAN jalankan Service Worker di mode pengembangan (development / localhost)
  // agar tidak merusak Vite HMR WebSocket dan caching modul lokal.
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      });
    }
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Segera periksa dan terapkan pembaruan Service Worker
        registration.update().catch(() => {});
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.info('[DIGESTA PWA] Versi baru aplikasi siap digunakan.');
                } else {
                  console.info('[DIGESTA PWA] Seluruh aset game berhasil dicache untuk penggunaan offline.');
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.warn('[DIGESTA PWA] Gagal mendaftarkan Service Worker:', error);
      });
  });
}
