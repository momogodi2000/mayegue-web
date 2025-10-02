import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';

/**
 * Protected route wrapper
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
