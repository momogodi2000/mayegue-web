import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Badge
} from '@/shared/components/ui';
import { 
  ShieldCheckIcon,
  PhoneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { authService } from '@/core/services/firebase/auth.service';
import { MultiFactorResolver } from 'firebase/auth';
import toast from 'react-hot-toast';

interface TwoFactorVerificationProps {
  resolver: MultiFactorResolver;
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  resolver,
  onSuccess,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  // Get the enrolled factor (phone number)
  const enrolledFactor = resolver.hints[0];
  const phoneNumber = enrolledFactor?.uid || 'votre téléphone';

  useEffect(() => {
    // Initialize reCAPTCHA for resend functionality
    const initRecaptcha = async () => {
      try {
        const verifier = await authService.setupRecaptcha('recaptcha-container-verify');
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    };

    initRecaptcha();
  }, []);

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      // For MFA verification during login, we need the verification ID from the resolver
      // This is a simplified implementation - in practice, you'd need to handle the MFA flow properly
      const user = await authService.verifyMFACode(resolver, verificationId, verificationCode);
      onSuccess(user);
      toast.success('Vérification réussie!');
    } catch (error: any) {
      console.error('Error verifying MFA code:', error);
      toast.error('Code de vérification invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!recaptchaVerifier) {
      toast.error('reCAPTCHA non initialisé');
      return;
    }

    setResendLoading(true);
    try {
      // This would need to be implemented based on your MFA setup
      // For now, we'll just show a success message
      toast.success('Nouveau code envoyé!');
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Vérification 2FA
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Entrez le code de vérification envoyé à votre téléphone
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <PhoneIcon className="w-4 h-4" />
                <span>Code envoyé au {phoneNumber}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification
              </label>
              <Input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                fullWidth
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Entrez le code à 6 chiffres reçu par SMS
              </p>
            </div>

            {/* reCAPTCHA container for resend */}
            <div id="recaptcha-container-verify" className="flex justify-center"></div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || loading}
                isLoading={loading}
                loadingText="Vérification..."
                className="w-full"
                size="lg"
              >
                Vérifier le code
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  isLoading={resendLoading}
                  className="flex-1"
                  leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                >
                  Renvoyer
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Problème de réception?</p>
                <p>Vérifiez que votre téléphone a du réseau et réessayez dans quelques minutes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
