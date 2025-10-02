export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-8">Mes Leçons</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Lesson Card */}
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-primary">Débutant</span>
              <span className="text-sm text-gray-500">0% complété</span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Introduction à l'Ewondo</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Apprenez les bases de la langue Ewondo avec des salutations et phrases courantes
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              15 minutes
            </div>
            
            <button className="btn-primary w-full">
              Commencer
            </button>
          </div>

          {/* More lesson cards would go here */}
          <div className="card opacity-60">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-secondary">Intermédiaire</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Conversation Courante</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Complétez la leçon précédente pour débloquer
            </p>
            
            <button className="btn-outline w-full" disabled>
              Verrouillé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
