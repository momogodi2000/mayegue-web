import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/core/services/firebase/auth.service';
import toast from 'react-hot-toast';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = query.get('oobCode');
    if (code) {
      setOobCode(code);
      authService.verifyPasswordResetCode(code)
        .then(setEmail)
        .catch(() => {
          toast.error('Lien invalide ou expiré');
          navigate('/forgot-password');
        });
    } else {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      setLoading(true);
      await authService.confirmPasswordReset(oobCode, password);
      toast.success('Mot de passe réinitialisé');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="heading-2 gradient-text">Définir un nouveau mot de passe</h2>
          {email && <p className="mt-2 text-gray-600 dark:text-gray-400">Compte: {email}</p>}
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nouveau mot de passe</label>
              <input id="password" type="password" required className="input" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer</label>
              <input id="confirm" type="password" required className="input" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}


