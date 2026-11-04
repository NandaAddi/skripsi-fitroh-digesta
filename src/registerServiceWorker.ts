/**
 * PWA Service Worker Registration Helper
 * Mendaftarkan /sw.js untuk kemampuan instalasi PWA dan caching offline.
 */
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
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
}
