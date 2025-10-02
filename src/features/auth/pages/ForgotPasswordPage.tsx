import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/core/services/firebase/auth.service';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      setSent(true);
      toast.success('Email de réinitialisation envoyé');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de lenvoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="heading-2 gradient-text">Réinitialiser le mot de passe</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Entrez votre email pour recevoir le lien</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📩</div>
              <p className="text-gray-700 dark:text-gray-300">Vérifiez votre boîte mail</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input id="email" type="email" required className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer le lien'}</button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


