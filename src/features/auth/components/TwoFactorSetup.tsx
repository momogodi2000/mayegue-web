import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Badge,
  Spinner
} from '@/shared/components/ui';
import { 
  ShieldCheckIcon,
  PhoneIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { authService } from '@/core/services/firebase/auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

type SetupStep = 'choose' | 'phone' | 'verify' | 'complete';

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<SetupStep>('choose');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const initRecaptcha = async () => {
      try {
        const verifier = await authService.setupRecaptcha('recaptcha-container');
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    };

    if (currentStep === 'phone') {
      initRecaptcha();
    }
  }, [currentStep]);

  const handlePhoneSetup = async () => {
    if (!phoneNumber || !recaptchaVerifier) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    try {
      const verificationId = await authService.enrollPhoneMFA(phoneNumber, recaptchaVerifier);
      setVerificationId(verificationId);
      setCurrentStep('verify');
      toast.success('Code de vérification envoyé!');
    } catch (error: any) {
      console.error('Error setting up phone MFA:', error);
      toast.error('Erreur lors de l\'envoi du code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !verificationId) {
      toast.error('Veuillez entrer le code de vérification');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyPhoneMFA(verificationId, verificationCode, 'Téléphone principal');
      setCurrentStep('complete');
      toast.success('Authentification à deux facteurs activée!');
      
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (error: any) {
      console.error('Error verifying MFA code:', error);
      toast.error('Code de vérification invalide');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format for Cameroon numbers
    if (digits.startsWith('237')) {
      return `+${digits}`;
    } else if (digits.startsWith('6') || digits.startsWith('2')) {
      return `+237${digits}`;
    } else {
      return `+${digits}`;
    }
  };

  const renderChooseMethod = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <ShieldCheckIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sécurisez votre compte
        </h2>
        <p className="text-gray-600">
          Choisissez une méthode d'authentification à deux facteurs
        </p>
      </div>

      <div className="space-y-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary-300"
          onClick={() => setCurrentStep('phone')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <PhoneIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">SMS / Téléphone</h3>
                <p className="text-sm text-gray-600">
                  Recevez des codes par SMS sur votre téléphone
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Recommandé</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <QrCodeIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-400">Application d'authentification</h3>
                <p className="text-sm text-gray-400">
                  Utilisez Google Authenticator ou une app similaire
                </p>
              </div>
              <Badge className="bg-gray-100 text-gray-500">Bientôt disponible</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </motion.div>
  );

  const renderPhoneSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <PhoneIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Numéro de téléphone
        </h2>
        <p className="text-gray-600">
          Entrez votre numéro pour recevoir les codes de vérification
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <Input
            type="tel"
            placeholder="+237 6XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            fullWidth
            leftIcon={<PhoneIcon className="w-5 h-5" />}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: +237 pour le Cameroun, +33 pour la France, etc.
          </p>
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container" className="flex justify-center"></div>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('choose')}
          className="flex-1"
        >
          Retour
        </Button>
        <Button 
          onClick={handlePhoneSetup}
          disabled={!phoneNumber || loading}
          isLoading={loading}
          className="flex-1"
        >
          Envoyer le code
        </Button>
      </div>
    </motion.div>
  );

  const renderVerifyCode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <PhoneIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Code de vérification
        </h2>
        <p className="text-gray-600">
          Entrez le code à 6 chiffres envoyé au {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
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
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important:</p>
              <p>Gardez votre téléphone à portée de main. Vous en aurez besoin pour vous connecter.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('phone')}
          className="flex-1"
        >
          Retour
        </Button>
        <Button 
          onClick={handleVerifyCode}
          disabled={verificationCode.length !== 6 || loading}
          isLoading={loading}
          className="flex-1"
        >
          Vérifier
        </Button>
      </div>
    </motion.div>
  );

  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          2FA Activée avec succès!
        </h2>
        <p className="text-gray-600">
          Votre compte est maintenant protégé par l'authentification à deux facteurs.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm text-green-800">
          <p className="font-medium mb-2">Prochaines étapes:</p>
          <ul className="space-y-1 text-left">
            <li>• Gardez votre téléphone accessible</li>
            <li>• Notez vos codes de récupération (si disponibles)</li>
            <li>• Testez la connexion avec 2FA</li>
          </ul>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full">
        Continuer
      </Button>
    </motion.div>
  );

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Authentification 2FA</CardTitle>
          <Badge className="bg-primary-100 text-primary-800">
            Étape {currentStep === 'choose' ? 1 : currentStep === 'phone' ? 2 : currentStep === 'verify' ? 3 : 4}/4
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 'choose' && renderChooseMethod()}
        {currentStep === 'phone' && renderPhoneSetup()}
        {currentStep === 'verify' && renderVerifyCode()}
        {currentStep === 'complete' && renderComplete()}
      </CardContent>
    </Card>
  );
};
