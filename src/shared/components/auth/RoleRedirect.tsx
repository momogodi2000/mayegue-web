import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export const RoleRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  // Map roles to dashboards
  const roleToPath: Record<string, string> = {
    visitor: '/dashboard/guest',
    apprenant: '/dashboard/apprenant',
    teacher: '/dashboard/teacher',
    admin: '/dashboard/admin',
  };

  const target = roleToPath[user.role] || '/dashboard/guest';
  return <Navigate to={target} replace />;
};


