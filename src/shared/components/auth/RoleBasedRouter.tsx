import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';
import { userService } from '@/core/services/firebase/user.service';
import toast from 'react-hot-toast';

/**
 * Role-based router that redirects users to appropriate dashboards
 * based on their role after successful authentication
 */
export const RoleBasedRouter = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const [roleChecking, setRoleChecking] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user && !loading) {
        try {
          console.log('🔍 Checking role for user:', user.id, 'Current role in store:', user.role);
          
          // Get the role directly from Firestore to ensure it's up to date
          const actualRole = await userService.getUserRole(user.id);
          console.log('📋 Role from Firestore:', actualRole);
          
          setUserRole(actualRole);
          
          const roleToPath: Record<string, string> = {
            visitor: '/dashboard/guest',
            apprenant: '/dashboard/apprenant',
            learner: '/dashboard/apprenant', // Legacy support
            teacher: '/dashboard/teacher',
            admin: '/dashboard/admin',
            family_member: '/dashboard/apprenant', // Family members use learner dashboard
          };

          const targetPath = roleToPath[actualRole] || '/dashboard/apprenant';
          console.log('🎯 Redirecting to:', targetPath);
          
          // Show welcome message based on role
          const welcomeMessages: Record<string, string> = {
            admin: 'Bienvenue dans l\'interface d\'administration',
            teacher: 'Bienvenue dans l\'espace enseignant',
            apprenant: 'Bienvenue dans votre espace d\'apprentissage',
            visitor: 'Bienvenue sur Ma\'a yegue',
            family_member: 'Bienvenue dans l\'espace familial'
          };

          const message = welcomeMessages[actualRole] || welcomeMessages.apprenant;
          toast.success(message);

          // Navigate to appropriate dashboard
          navigate(targetPath, { replace: true });
        } catch (error) {
          console.error('❌ Error checking user role:', error);
          // Fallback to learner dashboard if role check fails
          navigate('/dashboard/apprenant', { replace: true });
        } finally {
          setRoleChecking(false);
        }
      } else if (!loading && !user) {
        setRoleChecking(false);
      }
    };

    checkUserRole();
  }, [user, loading, navigate]);

  if (loading || roleChecking) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // This component handles redirection, so it should not render anything
  return null;
};
