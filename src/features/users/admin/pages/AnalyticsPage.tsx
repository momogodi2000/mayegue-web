export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-6">Analytics & Statistiques</h1>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Utilisateurs Totaux</p>
            <p className="text-3xl font-bold text-primary-600">1,247</p>
            <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Leçons Complétées</p>
            <p className="text-3xl font-bold text-primary-600">8,923</p>
            <p className="text-xs text-green-600 mt-1">+8% ce mois</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenus (FCFA)</p>
            <p className="text-3xl font-bold text-primary-600">2.5M</p>
            <p className="text-xs text-green-600 mt-1">+15% ce mois</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taux de Rétention</p>
            <p className="text-3xl font-bold text-primary-600">68%</p>
            <p className="text-xs text-gray-500 mt-1">Stable</p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Croissance Utilisateurs</h3>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p className="text-gray-500">Graphique à implémenter (Chart.js/Recharts)</p>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Langues Populaires</h3>
            <div className="space-y-3">
              {[
                { lang: 'Ewondo', percent: 45 },
                { lang: 'Duala', percent: 30 },
                { lang: 'Fulfulde', percent: 15 },
                { lang: 'Bassa', percent: 10 },
              ].map((item) => (
                <div key={item.lang}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.lang}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {[
              { user: 'Jean D.', action: 'a complété la leçon "Introduction Ewondo"', time: 'Il y a 5 min' },
              { user: 'Marie K.', action: 's\'est inscrit au plan Premium', time: 'Il y a 12 min' },
              { user: 'Paul M.', action: 'a ajouté 10 mots au dictionnaire', time: 'Il y a 1h' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                <div>
                  <p className="text-sm"><strong>{activity.user}</strong> {activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

