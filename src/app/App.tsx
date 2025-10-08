import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { syncService } from '@/core/services/offline/sync.service';
import toast from 'react-hot-toast';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import { initializeApp } from '@/core/services/initialization.service';
import { ToastProvider } from '@/shared/components/ui/Toast';

function App() {
  const isOnline = useOnlineStatus();
  const { setUser } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  // Initialize app on mount
  useEffect(() => {
    initializeApp()
      .then(() => {
        setInitialized(true);
      })
      .catch((error) => {
        console.error('App initialization failed:', error);
        // Continue even if initialization fails - app should still be usable
        setInitialized(true);
      });
  }, []);

  useEffect(() => {
    // Wire hybrid auth state changes to Zustand store
    const unsub = hybridAuthService.onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsub();
  }, [setUser]);

  useEffect(() => {
    // Show online/offline status
    if (isOnline) {
      toast.success('Connexion rétablie - Synchronisation en cours...', {
        icon: '🌐',
      });
      syncService.autoSync();
    } else {
      toast('Mode hors ligne activé', {
        icon: '📴',
        duration: 3000,
      });
    }
  }, [isOnline]);

  // Show loading screen while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initialisation de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppRouter />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
