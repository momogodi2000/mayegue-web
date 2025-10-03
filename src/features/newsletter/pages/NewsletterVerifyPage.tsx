import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';
import { newsletterService } from '@/core/services/firebase/newsletter.service';
import logoUrl from '@/assets/logo/logo.jpg';

export default function NewsletterVerifyPage() {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      try {
        const result = await newsletterService.verifySubscription(token);
        
        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message);
        } else {
          setVerificationStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage('Une erreur s\'est produite lors de la vérification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={logoUrl}
              alt="Ma'a yegue Logo" 
              className="h-12 w-12 rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Ma'a yegue
          </h1>
          <p className="mt-2 text-gray-600">
            Vérification de votre abonnement newsletter
          </p>
        </div>

        {/* Verification Result */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            {verificationStatus === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Vérification en cours...
                </h2>
                <p className="text-gray-600">
                  Veuillez patienter pendant que nous vérifions votre email.
                </p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email vérifié avec succès !
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    Que se passe-t-il maintenant ?
                  </h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Vous recevrez notre newsletter hebdomadaire</li>
                    <li>• Soyez informé des nouvelles fonctionnalités</li>
                    <li>• Accédez aux promotions exclusives</li>
                    <li>• Découvrez les contenus premium</li>
                  </ul>
                </div>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                  <XCircleIcon className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Erreur de vérification
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Que faire ?
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Vérifiez que le lien n'a pas expiré</li>
                    <li>• Essayez de vous réinscrire à la newsletter</li>
                    <li>• Contactez notre support si le problème persiste</li>
                  </ul>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Retour à l'accueil
                </Button>
              </Link>

              {verificationStatus === 'error' && (
                <Link to="/#newsletter">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                  >
                    Réessayer l'inscription
                  </Button>
                </Link>
              )}

              {verificationStatus === 'success' && (
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                  >
                    Créer un compte
                  </Button>
                </Link>
              )}
            </div>

            {/* Help */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Besoin d'aide ? {' '}
                <Link to="/contact" className="text-blue-600 hover:text-blue-500 hover:underline">
                  Contactez notre support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
