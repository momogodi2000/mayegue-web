import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/core/services/firebase/auth.service';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  Form, 
  FormGroup, 
  FormError,
  Badge,
  useToastActions
} from '@/shared/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: showSuccess, error: showError } = useToastActions();

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('L\'adresse email est requise');
      return;
    }

    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      setSent(true);
      showSuccess('Email de réinitialisation envoyé avec succès');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      setError(errorMessage);
      showError('Impossible d\'envoyer l\'email. Veuillez vérifier votre adresse.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      showSuccess('Email renvoyé avec succès');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du renvoi';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/src/assets/logo/logo.jpg" 
              alt="Mayegue Logo" 
              className="h-12 w-12 rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mot de passe oublié?
          </h1>
          <p className="mt-2 text-gray-600">
            {sent 
              ? 'Nous avons envoyé les instructions à votre email'
              : 'Entrez votre adresse email pour recevoir le lien de réinitialisation'
            }
          </p>
          <Badge variant="info" className="mt-2">
            Récupération sécurisée
          </Badge>
        </div>

        {/* Reset Form */}
        <Card variant="elevated" className="w-full">
          <CardContent>
            {sent ? (
              // Success State
              <div className="text-center py-8 space-y-6">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email envoyé!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nous avons envoyé un lien de réinitialisation à{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Vérifiez votre boîte de réception et vos spams. Le lien expire dans 24 heures.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleResend}
                    isLoading={loading}
                    loadingText="Renvoi en cours..."
                  >
                    Renvoyer l'email
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="ghost" fullWidth>
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Form State
              <>
                {error && (
                  <FormError 
                    message={error} 
                    className="mb-6"
                  />
                )}

                <Form onSubmit={onSubmit}>
                  <FormGroup>
                    <Input
                      id="email"
                      type="email"
                      label="Adresse email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error && !validateEmail(email) ? 'Format d\'email invalide' : undefined}
                      hint="Entrez l'email associé à votre compte Mayegue"
                      fullWidth
                      required
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      }
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading}
                    loadingText="Envoi en cours..."
                  >
                    Envoyer le lien de réinitialisation
                  </Button>
                </Form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-600">
                    Vous vous souvenez de votre mot de passe?{' '}
                  </span>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 hover:underline"
                  >
                    Retourner à la connexion
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        {!sent && (
          <Card variant="outlined" className="w-full">
            <CardContent className="p-4">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Besoin d'aide?</strong>
                </p>
                <p>
                  Si vous ne recevez pas l'email, vérifiez vos spams ou{' '}
                  <Link to="/contact" className="text-purple-600 hover:underline">
                    contactez notre support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


