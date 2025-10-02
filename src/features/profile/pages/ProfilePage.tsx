import { useAuthStore } from '@/features/auth/store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-2 mb-6">Mon Profil</h1>
        
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'Utilisateur'}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <span className="badge-primary mt-1 inline-block">{user?.role || 'learner'}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leçons complétées</p>
              <p className="text-2xl font-bold">{user?.stats?.lessonsCompleted || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mots appris</p>
              <p className="text-2xl font-bold">{user?.stats?.wordsLearned || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Préférences</h3>
          <p className="text-gray-600 dark:text-gray-400">Langues cibles: {user?.preferences?.targetLanguages?.join(', ') || 'Aucune'}</p>
        </div>
      </div>
    </div>
  );
}
