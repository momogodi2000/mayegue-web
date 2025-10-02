import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { authService } from '@/core/services/firebase/auth.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setError, setLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      setLoading(true);
      const user = await authService.signUpWithEmail(email, password, name);
      setUser(user);
      toast.success('Compte créé avec succès');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || "Erreur d'inscription");
      toast.error("Échec de l'inscription");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="heading-2 gradient-text">Créer un Compte</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Commencez votre voyage linguistique
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input id="name" name="name" type="text" required className="input" placeholder="Jean Dupont" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input id="email" name="email" type="email" required className="input" placeholder="votre@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input id="password" name="password" type="password" required className="input" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmer le mot de passe
              </label>
              <input id="confirm-password" name="confirm-password" type="password" required className="input" placeholder="••••••••" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                J'accepte les{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  conditions d'utilisation
                </a>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              S'inscrire
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Déjà un compte? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
