import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container-custom py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <h1 className="heading-1 mb-6 gradient-text">
            Mayegue
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Apprenez les langues traditionnelles camerounaises avec une technologie moderne
          </p>

          {/* Language Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Ewondo', 'Duala', 'Fulfulde', 'Bassa', 'Bamum', "Fe'efe'e"].map((lang) => (
              <span key={lang} className="badge-primary text-base px-4 py-2">
                {lang}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary btn text-lg px-8 py-3">
              Commencer Gratuitement
            </Link>
            <Link to="/dictionary" className="btn-outline btn text-lg px-8 py-3">
              Explorer le Dictionnaire
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Mots</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">3M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Locuteurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Fonctionnalités Principales</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3">Dictionnaire Interactif</h3>
            <p className="text-gray-600 dark:text-gray-400">
              10,000+ mots avec prononciation audio et exemples contextuels
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-3">Leçons Structurées</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cours progressifs du débutant à l'expert avec exercices interactifs
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">Assistant IA</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conversez en temps réel et recevez des corrections personnalisées
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-3">Gamification</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Badges, classements et défis pour rendre l'apprentissage ludique
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📴</div>
            <h3 className="text-xl font-semibold mb-3">Mode Hors Ligne</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Accédez au contenu même sans connexion internet
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3">Communauté</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Échangez avec d'autres apprenants et enseignants natifs
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom py-16 text-center">
        <h2 className="heading-2 mb-6">Prêt à Commencer?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'apprenants et préservez les langues camerounaises
        </p>
        <Link to="/register" className="btn-primary btn text-lg px-8 py-3">
          Créer un Compte Gratuit
        </Link>
      </div>
    </div>
  );
}
