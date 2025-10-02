import { Link } from 'react-router-dom';

export default function GuestDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-4">Bienvenue, Invité</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Créez un compte pour sauvegarder votre progression.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Découvrir</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Essayez le dictionnaire et des leçons démo.</p>
            <div className="flex gap-3">
              <Link to="/dictionary" className="btn-outline">Dictionnaire</Link>
              <Link to="/register" className="btn-primary">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

