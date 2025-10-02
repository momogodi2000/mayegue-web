export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-6">Gamification</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-1">1250 XP</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Points d'expérience</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-1">Niveau 3</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Débutant avancé</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-1">7 jours</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Streak actuel</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {['🥇', '📚', '💬', '🎯', '⚡', '🌟'].map((badge, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{badge}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Badge {i + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Classement</h2>
          <p className="text-gray-600 dark:text-gray-400">Fonctionnalité à venir...</p>
        </div>
      </div>
    </div>
  );
}
