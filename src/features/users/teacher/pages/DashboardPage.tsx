import { Link } from 'react-router-dom';

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-4">Tableau de bord Enseignant</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Mes Leçons</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Créez et gérez vos leçons</p>
            <Link to="/teacher/lessons" className="btn-primary">Gérer les leçons</Link>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
            <div className="mb-4">
              <p className="text-3xl font-bold text-primary-600">68</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Étudiants actifs</p>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Apprenants</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Voir la progression des élèves</p>
            <button className="btn-outline" disabled>Bientôt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

