import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LessonManagementPage() {
  const [lessons] = useState([
    { id: '1', title: 'Introduction à l\'Ewondo', language: 'Ewondo', level: 'Débutant', students: 45 },
    { id: '2', title: 'Grammaire Duala', language: 'Duala', level: 'Intermédiaire', students: 23 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="heading-2">Gestion des Leçons</h1>
          <button className="btn-primary">+ Nouvelle Leçon</button>
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <span className="badge-primary text-xs">{lesson.language}</span>
                    <span className="badge-secondary text-xs">{lesson.level}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lesson.students} étudiants inscrits
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/teacher/lessons/${lesson.id}/edit`} className="btn-outline btn-sm">
                    Modifier
                  </Link>
                  <button className="btn-ghost btn-sm">Statistiques</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aucune leçon créée pour le moment
            </p>
            <button className="btn-primary">Créer ma première leçon</button>
          </div>
        )}
      </div>
    </div>
  );
}

