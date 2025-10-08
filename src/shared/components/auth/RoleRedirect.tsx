import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export const RoleRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  // Map roles to dashboards
  const roleToPath: Record<string, string> = {
    guest: '/dashboard/guest',
    student: '/dashboard/student',
    teacher: '/teacher/dashboard',
    admin: '/admin/dashboard',
    // Legacy support
    visitor: '/dashboard/guest',
    apprenant: '/dashboard/student',
    learner: '/dashboard/student',
  };

  const target = roleToPath[user.role] || '/dashboard/guest';
  return <Navigate to={target} replace />;
};


