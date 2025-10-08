import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  GlobeAltIcon,
  SparklesIcon,
  AcademicCapIcon,
  UserPlusIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { guestService } from '../services/guest.service';

export default function GuestDashboardPage() {
  const [limits, setLimits] = useState({
    lessons: 5,
    readings: 5,
    quizzes: 5,
    usedLessons: 0,
    usedReadings: 0,
    usedQuizzes: 0
  });

  useEffect(() => {
    const loadLimits = async () => {
      const today = guestService.getTodayDate();
      const usage = await guestService.getDailyUsage(today);
      if (usage) {
        setLimits({
          lessons: usage.maxLessons,
          readings: usage.maxReadings,
          quizzes: usage.maxQuizzes,
          usedLessons: usage.lessonsUsed,
          usedReadings: usage.readingsUsed,
          usedQuizzes: usage.quizzesUsed
        });
      }
    };
    loadLimits();
  }, []);

  const guestFeatures = [
    {
      icon: BookOpenIcon,
      title: 'Dictionnaire Gratuit',
      description: 'Accédez à notre dictionnaire de base avec des mots essentiels en langues camerounaises.',
      link: '/dictionary',
      buttonText: 'Explorer',
      color: 'text-blue-600 dark:text-blue-400',
      available: true,
      limit: null
    },
    {
      icon: AcademicCapIcon,
      title: `Leçons (${limits.lessons - limits.usedLessons}/${limits.lessons} aujourd'hui)`,
      description: 'Accédez à des leçons interactives limitées par jour.',
      link: '/lessons',
      buttonText: limits.usedLessons < limits.lessons ? 'Commencer' : 'Limite Atteinte',
      color: limits.usedLessons < limits.lessons ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500',
      available: limits.usedLessons < limits.lessons
    },
    {
      icon: GlobeAltIcon,
      title: `Quiz (${limits.quizzes - limits.usedQuizzes}/${limits.quizzes} aujourd'hui)`,
      description: 'Testez vos connaissances avec des quiz limités par jour.',
      link: '/quiz',
      buttonText: limits.usedQuizzes < limits.quizzes ? 'Jouer' : 'Limite Atteinte',
      color: limits.usedQuizzes < limits.quizzes ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500',
      available: limits.usedQuizzes < limits.quizzes
    },
    {
      icon: SparklesIcon,
      title: 'Culture & Histoire',
      description: 'Découvrez la richesse culturelle et historique des langues camerounaises.',
      link: '/culture-history',
      buttonText: 'Découvrir',
      color: 'text-purple-600 dark:text-purple-400',
      available: true,
      limit: null
    },
    {
      icon: GlobeAltIcon,
      title: 'Atlas Linguistique',
      description: 'Explorez la carte interactive des langues camerounaises.',
      link: '/atlas',
      buttonText: 'Explorer',
      color: 'text-indigo-600 dark:text-indigo-400',
      available: true,
      limit: null
    },
    {
      icon: BookOpenIcon,
      title: 'Encyclopédie',
      description: 'Accédez à notre encyclopédie des langues et cultures camerounaises.',
      link: '/encyclopedia',
      buttonText: 'Lire',
      color: 'text-teal-600 dark:text-teal-400',
      available: true,
      limit: null
    }
  ];

  const premiumBenefits = [
    'Accès illimité à toutes les leçons',
    'Dictionnaire complet avec audio',
    'Assistant IA sans limite',
    'Suivi de progression détaillé',
    'Certificats d\'apprentissage',
    'Support prioritaire',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bienvenue, Invité ! 👋</h1>
              <p className="text-white/90 mb-4 max-w-2xl">
                Découvrez les langues camerounaises avec nos fonctionnalités gratuites.
                Créez un compte pour débloquer tout le potentiel de Ma'a yegue.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Créer un Compte Gratuit
                </Link>
                <Link
                  to="/login"
                  className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Se Connecter
                </Link>
              </div>
            </div>
            <RocketLaunchIcon className="h-24 w-24 text-white/20 hidden lg:block" />
          </div>
        </div>

        {/* Guest Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Fonctionnalités Gratuites
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guestFeatures.map((feature, index) => (
              <div
                key={index}
                className={`card transition-shadow ${
                  feature.available ? 'hover:shadow-lg' : 'opacity-75 relative'
                }`}
              >
                {!feature.available && (
                  <div className="absolute top-4 right-4 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                    Premium
                  </div>
                )}
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className={`btn-outline w-full text-center ${
                    !feature.available ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700' : ''
                  }`}
                >
                  {feature.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Passez à un Compte Apprenant
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez un compte gratuit pour accéder à encore plus de fonctionnalités
                et sauvegarder votre progression d'apprentissage.
              </p>
              <Link
                to="/register"
                className="btn-primary inline-flex items-center gap-2"
              >
                <UserPlusIcon className="h-5 w-5" />
                Créer un Compte Gratuit
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                Avantages d'un compte Apprenant:
              </h3>
              <ul className="space-y-3">
                {premiumBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="h-6 w-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mots Gratuits</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">10+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Leçons Démo</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Gratuit</div>
          </div>
        </div>
      </div>
    </div>
  );
}

