import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui';
import { useToastActions } from '@/shared/components/ui';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { GoogleIcon } from '@/shared/components/icons/GoogleIcon';

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  text?: string;
  fullWidth?: boolean;
}

export default function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  text = "Continuer avec Google",
  fullWidth = false
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToastActions();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const user = await hybridAuthService.signInWithGoogle();

      if (user) {
        showSuccess('Connexion réussie avec Google !');
        onSuccess?.(user);
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Erreur de connexion avec Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Connexion annulée par l\'utilisateur';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqué par le navigateur. Veuillez autoriser les popups.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erreur de réseau. Vérifiez votre connexion internet.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Connexion Google non autorisée. Contactez l\'administrateur.';
          break;
        default:
          errorMessage = error.message || 'Erreur de connexion avec Google';
      }
      
      showError(errorMessage);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={fullWidth ? 'w-full' : ''}
    >
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className={`
          flex items-center justify-center gap-3 px-6 py-3 
          border-2 border-gray-300 dark:border-gray-600
          hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
          transition-all duration-200
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        <GoogleIcon className="w-5 h-5" />
        <span className="font-medium">
          {loading ? 'Connexion...' : text}
        </span>
      </Button>
    </motion.div>
  );
}
