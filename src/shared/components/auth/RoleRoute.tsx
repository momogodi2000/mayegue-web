import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/shared/types/user.types';

interface Props {
  allow: UserRole[];
}

export function RoleRoute({ allow }: Props) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  // Check if user's role is in the allowed roles
  if (!allow.includes(user.role)) {
    // Redirect to user's own dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}


