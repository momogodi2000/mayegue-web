import { useParams } from 'react-router-dom';

export default function LessonDetailPage() {
  const { lessonId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-2 mb-6">Leçon #{lessonId}</h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Introduction à l'Ewondo</h2>
          <div className="mb-4">
            <span className="badge-primary mr-2">Débutant</span>
            <span className="badge-secondary">15 min</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dans cette leçon, vous apprendrez les salutations de base en Ewondo.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold mb-2">Mbolo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bonjour (salutation générale)</p>
              <button className="btn-ghost mt-2">🔊 Écouter</button>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold mb-2">Akiba</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Merci</p>
              <button className="btn-ghost mt-2">🔊 Écouter</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Exercice</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Fonctionnalité à venir...</p>
          <button className="btn-primary">Commencer l'exercice</button>
        </div>
      </div>
    </div>
  );
}
