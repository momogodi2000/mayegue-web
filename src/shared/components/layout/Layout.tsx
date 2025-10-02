import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/core/services/firebase/auth.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Layout = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast.success('Déconnecté');
      navigate('/');
    } catch (err) {
      toast.error('Erreur de déconnexion');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">Ma’a yegue</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dictionary" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Dictionnaire
              </Link>
              <Link to="/lessons" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Leçons
              </Link>
              <Link to="/ai-assistant" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Assistant IA
              </Link>
              <Link to="/community" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Communauté
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                À propos
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Tarifs
              </Link>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 btn-ghost btn-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                    <span className="hidden md:inline">{user?.displayName}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 card py-2 shadow-lg z-50">
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📊 Tableau de bord
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 Mon profil
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Paramètres
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🚪 Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost btn-sm">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary btn-sm">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ma’a yegue</h3>
              <p className="text-gray-400 text-sm">
                Préservons ensemble les langues camerounaises pour les générations futures
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Langues</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Ewondo</a></li>
                <li><a href="#" className="hover:text-white">Duala</a></li>
                <li><a href="#" className="hover:text-white">Fulfulde</a></li>
                <li><a href="#" className="hover:text-white">Bassa</a></li>
                <li><a href="#" className="hover:text-white">Bamum</a></li>
                <li><a href="#" className="hover:text-white">Fe'efe'e</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dictionary" className="hover:text-white">Dictionnaire</Link></li>
                <li><Link to="/lessons" className="hover:text-white">Leçons</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white">Assistant IA</Link></li>
                <li><Link to="/community" className="hover:text-white">Communauté</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">À Propos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">Notre Mission</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-white">Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 Ma’a yegue. Tous droits réservés. Fait avec ❤️ pour le Cameroun 🇨🇲</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
