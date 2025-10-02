import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/core/services/firebase/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, isAuthenticated, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.signInWithEmail(email, password);
      useAuthStore.getState().setUser(user);
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur de connexion');
      throw err;
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    try {
      const user = await authService.signUpWithEmail(email, password, displayName);
      useAuthStore.getState().setUser(user);
      toast.success('Compte créé avec succès');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || "Erreur d'inscription");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      toast.success('Déconnecté');
      navigate('/');
    } catch (err: any) {
      toast.error('Erreur de déconnexion');
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
  };
}

