import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { authService } from '@/core/services/firebase/auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  Form, 
  FormGroup, 
  FormError, 
  Badge
} from '@/shared/components/ui';
import toast from 'react-hot-toast';
import logoUrl from '@/assets/logo/logo.jpg';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setError, setLoading, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'L\'adresse email est requise';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!password) {
      errors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.signInWithEmail(email, password);
      console.log('🔐 User logged in:', user.email, 'Role:', user.role, 'UID:', user.id);
      setUser(user);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      toast.success('Connexion réussie! Bienvenue dans Ma\'a yegue');
      
      // Navigate to dashboard route - let RoleBasedRouter handle the role-based redirection
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      toast.error('Identifiants invalides. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={logoUrl}
              alt="Ma’a yegue Logo" 
              className="h-12 w-12 rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ma’a yegue
          </h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre compte pour continuer votre apprentissage
          </p>
          <Badge variant="info" className="mt-2">
            Apprenez les langues du Cameroun
          </Badge>
        </div>

        {/* Login Form */}
        <Card variant="elevated" className="w-full">
          <CardContent>
            {error && (
              <FormError 
                message={error} 
                className="mb-6"
              />
            )}

            {/* Google Sign In */}
            <div className="mb-6">
              <GoogleSignInButton 
                onSuccess={(user) => {
                  console.log('🔐 User logged in with GoogleSignInButton:', user.email, 'Role:', user.role, 'UID:', user.id);
                  setUser(user);
                  toast.success('Connecté avec Google avec succès!');
                  navigate('/dashboard', { replace: true });
                }}
                onError={(error) => {
                  setError(error.message);
                }}
                fullWidth
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
              </div>
            </div>

            <Form onSubmit={onSubmit}>
              <FormGroup>
                <Input
                  id="email"
                  type="email"
                  label="Adresse email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validationErrors.email}
                  fullWidth
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </FormGroup>

              <FormGroup>
                <Input
                  id="password"
                  type="password"
                  label="Mot de passe"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={validationErrors.password}
                  fullWidth
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
              </FormGroup>

              <FormGroup inline>
                <div className="flex items-center justify-between w-full">
                  <label className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Se souvenir de moi
                    </span>
                  </label>

                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
              </FormGroup>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Connexion en cours..."
              >
                Se connecter
              </Button>
            </Form>


            {/* Register Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Pas encore de compte?{' '}
              </span>
              <Link 
                to="/register" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Inscrivez-vous gratuitement
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
