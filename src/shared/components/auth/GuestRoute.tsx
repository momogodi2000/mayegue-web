/**
 * GuestRoute - Blocks access for guest/visitor role to certain routes
 * Redirects guests to /register with a message
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function GuestRoute() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'visitor' && !hasShownToast) {
      toast.error('Créez un compte pour accéder à cette fonctionnalité', {
        duration: 4000,
        icon: '🔒',
      });
      setHasShownToast(true);
    }
  }, [isAuthenticated, user?.role, hasShownToast]);

  // If user is authenticated but is a guest/visitor, redirect to register
  if (isAuthenticated && user?.role === 'visitor') {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // Otherwise allow access
  return <Outlet />;
}
