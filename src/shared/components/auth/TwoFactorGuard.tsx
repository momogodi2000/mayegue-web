import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { twoFactorService } from '@/core/services/auth/twoFactor.service';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';
import { TwoFactorSetup } from '@/features/auth/components/TwoFactorSetup';
import { Modal } from '@/shared/components/ui/Modal';
import toast from 'react-hot-toast';

interface TwoFactorGuardProps {
  children: React.ReactNode;
}

/**
 * Component that enforces 2FA for teachers and admins
 * Shows setup modal if 2FA is required but not enabled
 */
export const TwoFactorGuard: React.FC<TwoFactorGuardProps> = ({ children }) => {
  const { user, loading } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  useEffect(() => {
    const check2FARequirement = async () => {
      if (!user || loading) {
        setChecking(false);
        return;
      }

      try {
        // Check if 2FA is required for this user's role
        const isRequired = twoFactorService.is2FARequired(user.role);
        
        if (isRequired) {
          // Check if user already has 2FA enabled
          const firebaseUser = user as any; // Cast to access Firebase methods
          const has2FA = await twoFactorService.has2FAEnabled(firebaseUser);
          
          if (!has2FA) {
            setNeeds2FA(true);
            setShow2FASetup(true);
            toast.error(
              `L'authentification à deux facteurs est obligatoire pour les ${user.role === 'teacher' ? 'enseignants' : 'administrateurs'}`,
              { duration: 6000 }
            );
          }
        }
      } catch (error) {
        console.error('Error checking 2FA requirement:', error);
        // Allow access on error to prevent blocking users
      } finally {
        setChecking(false);
      }
    };

    check2FARequirement();
  }, [user, loading]);

  // Show loading while checking
  if (loading || checking) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show 2FA setup modal if required
  if (needs2FA && show2FASetup) {
    return (
      <>
        {children}
        <Modal
          open={show2FASetup}
          onClose={() => {
            // Don't allow closing if 2FA is required
            toast('L\'authentification à deux facteurs est obligatoire pour continuer', {
              icon: '⚠️',
              duration: 4000,
            });
          }}
          title="Configuration de l'authentification à deux facteurs"
          size="lg"
        >
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sécurité renforcée requise
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                En tant que {user.role === 'teacher' ? 'enseignant' : 'administrateur'}, 
                vous devez configurer l'authentification à deux facteurs pour accéder à votre compte.
              </p>
            </div>
            
            <TwoFactorSetup
              onComplete={() => {
                setShow2FASetup(false);
                setNeeds2FA(false);
                toast.success('Authentification à deux facteurs configurée avec succès !');
              }}
              onCancel={() => {
                // For required 2FA, redirect to logout instead of canceling
                toast.error('Configuration annulée. Vous allez être déconnecté.');
                setTimeout(() => {
                  window.location.href = '/login';
                }, 2000);
              }}
            />
          </div>
        </Modal>
      </>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};
