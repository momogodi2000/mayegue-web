import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

interface Props {
  allow: Array<'learner' | 'teacher' | 'admin' | 'visitor'>;
}

export function RoleRoute({ allow }: Props) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role as any)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}


