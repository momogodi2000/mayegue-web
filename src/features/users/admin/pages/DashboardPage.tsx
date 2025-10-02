import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-4">Tableau de bord Admin</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Statistiques et métriques</p>
            <Link to="/admin/analytics" className="btn-primary">Voir analytics</Link>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Modération</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Gérer contenus et utilisateurs</p>
            <button className="btn-outline" disabled>Bientôt</button>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Abonnements</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Gérer les paiements</p>
            <button className="btn-outline" disabled>Bientôt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

