import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { syncService } from '@/core/services/offline/sync.service';
import toast from 'react-hot-toast';
import { authService } from '@/core/services/firebase/auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import { userService } from '@/core/services/firebase/user.service';
import { initializeApp } from '@/core/services/initialization.service';

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
        setInitialized(true); // Continue even if initialization fails
      });
  }, []);

  useEffect(() => {
    // Wire Firebase auth state changes to Zustand store
    const unsub = authService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          // Ensure profile exists and fetch complete user data
          await userService.ensureUserProfile(user.id, { 
            email: user.email, 
            displayName: user.displayName,
            emailVerified: user.emailVerified 
          });
          
          // Get fresh user data with role from Firestore
          const freshUser = await authService.getCurrentMappedUser();
          setUser(freshUser);
        } catch (error) {
          console.error('Error updating user profile:', error);
          setUser(user); // Fallback to the user from auth state
        }
      } else {
        setUser(null);
      }
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
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
