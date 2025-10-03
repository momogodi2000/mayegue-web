import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { useEffect } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { syncService } from '@/core/services/offline/sync.service';
import toast from 'react-hot-toast';
import { authService } from '@/core/services/firebase/auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import { userService } from '@/core/services/firebase/user.service';

function App() {
  const isOnline = useOnlineStatus();
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Wire Firebase auth state changes to Zustand store
    const unsub = authService.onAuthStateChange((user) => {
      if (user) {
        // Optionally ensure profile and fetch role from Firestore
        void userService.ensureUserProfile(user.id, { email: user.email, displayName: user.displayName });
        // For now we keep existing role in store; could fetch and update based on Firestore
        setUser(user);
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

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
