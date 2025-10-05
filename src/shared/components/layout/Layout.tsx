import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/core/services/firebase/auth.service';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { NewsletterSubscription } from '@/shared/components/ui/NewsletterSubscription';

export const Layout = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
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
              <Link to="/culture-history" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Culture & Histoire
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                À propos
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Tarifs
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="container-custom py-4">
            <div className="space-y-4">
              <Link 
                to="/dictionary" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                📚 Dictionnaire
              </Link>
              <Link 
                to="/lessons" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                🎓 Leçons
              </Link>
              <Link 
                to="/ai-assistant" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                🤖 Assistant IA
              </Link>
              <Link 
                to="/community" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                👥 Communauté
              </Link>
              <Link 
                to="/culture-history" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                🏛️ Culture & Histoire
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                ℹ️ À propos
              </Link>
              <Link 
                to="/pricing" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                💰 Tarifs
              </Link>
              <Link 
                to="/faq" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                ❓ FAQ
              </Link>
              <Link 
                to="/partners" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                🤝 Partenaires
              </Link>
              <Link 
                to="/careers" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                💼 Carrières
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                📞 Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Ma'a yegue</h3>
              <p className="text-gray-400 text-sm mb-4">
                Préservons ensemble les langues camerounaises pour les générations futures
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/maayegue" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://facebook.com/maayegue" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://youtube.com/maayegue" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Langues</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ewondo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Duala</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fulfulde</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bassa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bamum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fe'efe'e</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Yemba</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dictionary" className="hover:text-white transition-colors">Dictionnaire</Link></li>
                <li><Link to="/lessons" className="hover:text-white transition-colors">Leçons</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white transition-colors">Assistant IA</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Communauté</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">À Propos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">Notre Mission</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-8 pt-6 lg:pt-8 border-t border-gray-800">
            <NewsletterSubscription />
          </div>

          <div className="mt-8 pt-6 lg:pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 Ma'a yegue. Tous droits réservés. Fait avec ❤️ pour le Cameroun 🇨🇲</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
