import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuthStore } from '@/features/auth/store/authStore';
import { auth } from '@/core/config/firebase.config';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { EnvelopeIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface EmailVerificationGuardProps {
  allowUnverified?: boolean; // For guest users
}

/**
 * Component that enforces email verification for all authenticated users
 * Guests can bypass this requirement
 */
export const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ 
  allowUnverified = false 
}) => {
  const { user, loading } = useAuthStore();
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<number | null>(null);

  // Cooldown period for resending verification email (60 seconds)
  const RESEND_COOLDOWN = 60000;

  useEffect(() => {
    // Auto-refresh auth state every 5 seconds to check for verification
    if (user && !user.emailVerified && !allowUnverified) {
      const interval = setInterval(() => {
        if (auth.currentUser) {
          auth.currentUser.reload();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user, allowUnverified]);

  const handleResendVerification = async () => {
    if (!auth.currentUser || sending) return;

    // Check cooldown
    if (lastSent && Date.now() - lastSent < RESEND_COOLDOWN) {
      const remainingTime = Math.ceil((RESEND_COOLDOWN - (Date.now() - lastSent)) / 1000);
      toast.error(`Veuillez attendre ${remainingTime} secondes avant de renvoyer l'email`);
      return;
    }

    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setLastSent(Date.now());
      toast.success('Email de vérification envoyé ! Vérifiez votre boîte de réception.');
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de vérification');
    } finally {
      setSending(false);
    }
  };

  const handleRefreshStatus = () => {
    if (auth.currentUser) {
      auth.currentUser.reload().then(() => {
        window.location.reload(); // Force refresh to update auth state
      });
    }
  };

  // Show loading while checking
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow unverified access for guests or if explicitly allowed
  if (allowUnverified || user.role === 'guest') {
    return <Outlet />;
  }

  // Show verification required screen for unverified users
  if (!user.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Vérification d'email requise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Un email de vérification a été envoyé à :
                </p>
                <p className="font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  {user.email}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                      Vérification obligatoire
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Vous devez vérifier votre adresse email avant d'accéder à votre compte.
                      Cliquez sur le lien dans l'email que nous vous avons envoyé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={sending}
                  variant="outline"
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Renvoyer l'email de vérification
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleRefreshStatus}
                  variant="primary"
                  className="w-full"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  J'ai vérifié mon email
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Vous ne trouvez pas l'email ?</p>
                <p>Vérifiez votre dossier spam ou courrier indésirable.</p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    // Sign out and redirect to login
                    auth.signOut().then(() => {
                      window.location.href = '/login';
                    });
                  }}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                >
                  Se connecter avec un autre compte
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render children if email is verified
  return <Outlet />;
};
