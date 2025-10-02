import { authService } from '@/core/services/firebase/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await authService.signOut();
      toast.success('Déconnecté');
      navigate('/');
    } catch (err) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-2 mb-6">Paramètres</h1>
        
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Notifications push</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Emails hebdomadaires</span>
            </label>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Langue de l'interface</h3>
          <select className="input">
            <option>Français</option>
            <option>English</option>
          </select>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Compte</h3>
          <button onClick={onLogout} className="btn-outline text-red-600">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
}
