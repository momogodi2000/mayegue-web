/**
 * Service Worker Registration for PWA
 */

import { databaseService } from '../services/offline/database.service';

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Initialize offline database
        await databaseService.initialize();
        
        const registration = await navigator.serviceWorker.register('/sw.js');
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

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          const { type, data } = event.data;
          
          switch (type) {
            case 'CACHE_UPDATED':
              console.log('Cache updated:', data);
              break;
            case 'OFFLINE_DATA_SYNCED':
              console.log('Offline data synced:', data);
              break;
            case 'SYNC_FAILED':
              console.error('Sync failed:', data);
              break;
          }
        });

        // Request background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          await (registration as any).sync.register('background-sync');
        }

      } catch (error) {
        console.error('❌ SW registration failed:', error);
      }
    });
  }
}

export function unregisterServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export function checkForUpdates(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

export function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready;
  }
  return Promise.resolve(null);
}
