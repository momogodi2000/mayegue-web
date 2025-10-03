import { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { newsletterService } from '@/core/services/firebase/newsletter.service';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  type: 'newsletter' | 'registration';
  onVerificationSent?: () => void;
}

export function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  email, 
  type,
  onVerificationSent 
}: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isOpen) return null;

  const handleResendVerification = async () => {
    setIsResending(true);
    
    try {
      if (type === 'newsletter') {
        const result = await newsletterService.resendVerification(email);
        if (result.success) {
          toast.success(result.message);
          setVerificationSent(true);
          onVerificationSent?.();
        } else {
          toast.error(result.message);
        }
      } else {
        // For user registration, use auth service
        const { authService } = await import('@/core/services/firebase/auth.service');
        await authService.sendVerificationEmail();
        toast.success('Email de vérification renvoyé avec succès');
        setVerificationSent(true);
        onVerificationSent?.();
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'newsletter':
        return 'Vérifiez votre email pour la newsletter';
      case 'registration':
        return 'Vérifiez votre email pour activer votre compte';
      default:
        return 'Vérification d\'email requise';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'newsletter':
        return `Nous avons envoyé un lien de vérification à ${email}. Cliquez sur le lien dans l'email pour confirmer votre abonnement à notre newsletter.`;
      case 'registration':
        return `Nous avons envoyé un lien de vérification à ${email}. Cliquez sur le lien dans l'email pour activer votre compte et accéder à toutes les fonctionnalités.`;
      default:
        return `Un email de vérification a été envoyé à ${email}.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getTitle()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                {verificationSent ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <EnvelopeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {getMessage()}
              </p>

              {/* Email display */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Que faire ensuite ?
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Vérifiez votre boîte de réception</li>
                  <li>• Regardez dans vos spams si nécessaire</li>
                  <li>• Cliquez sur le lien de vérification</li>
                  {type === 'registration' && (
                    <li>• Revenez vous connecter après vérification</li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  size="sm"
                  fullWidth
                  isLoading={isResending}
                  loadingText="Envoi en cours..."
                  disabled={verificationSent}
                >
                  {verificationSent ? 'Email renvoyé ✓' : 'Renvoyer l\'email'}
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  fullWidth
                >
                  Fermer
                </Button>
              </div>

              {/* Help text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Vous ne recevez pas l'email ? Vérifiez vos spams ou contactez notre support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
