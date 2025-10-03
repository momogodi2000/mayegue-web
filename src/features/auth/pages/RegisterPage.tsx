import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { EmailVerificationModal } from '@/shared/components/ui/EmailVerificationModal';
import toast from 'react-hot-toast';
import logoUrl from '@/assets/logo/logo.jpg';
import { newsletterService } from '@/core/services/firebase/newsletter.service';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  subscribeNewsletter?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setError, setLoading, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Le nom complet est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'L\'adresse email est requise';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.name.trim()
      );
      
      // Subscribe to newsletter if opted in
      if (formData.subscribeNewsletter) {
        try {
          await newsletterService.subscribe(formData.email, 'user_registration', false);
        } catch (error) {
          console.error('Newsletter subscription error:', error);
          // Don't fail registration if newsletter subscription fails
        }
      }
      
      setUser(user);
      setRegisteredEmail(formData.email);
      setShowEmailVerificationModal(true);
      
      toast.success("Bienvenue dans Ma'a yegue! Votre compte a été créé avec succès.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(errorMessage);
      toast.error("Échec de l'inscription. Veuillez vérifier vos informations et réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Rejoignez Ma’a yegue
          </h1>
          <p className="mt-2 text-gray-600">
            Commencez votre voyage d'apprentissage des langues camerounaises
          </p>
          <Badge variant="success" className="mt-2">
            Inscription gratuite
          </Badge>
        </div>

        {/* Registration Form */}
        <Card variant="elevated" className="w-full">
          <CardContent>
            {error && (
              <FormError 
                message={error} 
                className="mb-6"
              />
            )}

            <Form onSubmit={onSubmit}>
              <FormGroup>
                <Input
                  id="name"
                  type="text"
                  label="Nom complet"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={validationErrors.name}
                  fullWidth
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              </FormGroup>

              <FormGroup>
                <Input
                  id="email"
                  type="email"
                  label="Adresse email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
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
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={validationErrors.password}
                  hint="Au moins 8 caractères avec majuscule, minuscule et chiffre"
                  fullWidth
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
              </FormGroup>

              <FormGroup>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={validationErrors.confirmPassword}
                  fullWidth
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </FormGroup>

              <FormGroup>
                <label className="flex items-start">
                  <input
                    id="subscribeNewsletter"
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange('subscribeNewsletter')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Je souhaite recevoir la newsletter avec les dernières actualités et promotions
                  </span>
                </label>
              </FormGroup>

              <FormGroup>
                <label className="flex items-start">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange('acceptTerms')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 hover:underline">
                      conditions d'utilisation
                    </Link>
                    {' '}et la{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 hover:underline">
                      politique de confidentialité
                    </Link>
                  </span>
                </label>
                {validationErrors.acceptTerms && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.acceptTerms}
                  </p>
                )}
              </FormGroup>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Création du compte..."
              >
                Créer mon compte
              </Button>
            </Form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Vous avez déjà un compte?{' '}
              </span>
              <Link 
                to="/login" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Connectez-vous ici
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Email Verification Modal */}
        <EmailVerificationModal
          isOpen={showEmailVerificationModal}
          onClose={() => {
            setShowEmailVerificationModal(false);
            navigate('/dashboard');
          }}
          email={registeredEmail}
          type="registration"
          onVerificationSent={() => {
            toast.success('Email de vérification renvoyé avec succès');
          }}
        />
      </div>
    </div>
  );
}
