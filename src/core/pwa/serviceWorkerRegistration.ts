/**
 * Service Worker Registration for PWA
 */

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ SW registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  const showPopup = (import.meta as any).env?.VITE_SW_UPDATE_POPUP !== 'false';
                  if (showPopup) {
                    if (confirm('Une nouvelle version est disponible. Mettre à jour?')) {
                      window.location.reload();
                    }
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ SW registration failed:', error);
        });
    });
  }
}
