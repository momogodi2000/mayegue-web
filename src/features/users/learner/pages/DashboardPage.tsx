import { Link } from 'react-router-dom';

export default function LearnerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-4">Tableau de bord Apprenant</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Continuer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Reprenez vos leçons là où vous vous êtes arrêté.</p>
            <Link to="/lessons" className="btn-primary">Mes Leçons</Link>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Dictionnaire</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Recherchez des mots et prononciations.</p>
            <Link to="/dictionary" className="btn-outline">Ouvrir</Link>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Assistant IA</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Pratiquez avec l'IA en temps réel.</p>
            <Link to="/ai-assistant" className="btn-outline">Démarrer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

