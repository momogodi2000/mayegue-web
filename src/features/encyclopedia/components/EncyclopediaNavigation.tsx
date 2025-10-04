/**
 * Encyclopedia Navigation Component - Navigation breadcrumbs and quick links
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { 
  HomeIcon,
  ChevronRightIcon,
  MapIcon,
  BookOpenIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

interface EncyclopediaNavigationProps {
  currentSection?: string;
  showQuickLinks?: boolean;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  bgColor: string;
}

const EncyclopediaNavigationComponent: React.FC<EncyclopediaNavigationProps> = ({
  currentSection,
  showQuickLinks = true
}) => {
  const location = useLocation();

  const quickLinks: NavigationItem[] = [
    {
      name: 'Atlas Linguistique',
      path: '/atlas',
      icon: MapIcon,
      description: 'Cartes des langues',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Sites Historiques',
      path: '/historical-sites',
      icon: PhotoIcon,
      description: 'Patrimoine géolocalisé',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Marketplace',
      path: '/marketplace',
      icon: SparklesIcon,
      description: 'Artisanat & expériences',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Archives Audio',
      path: '/archives',
      icon: SpeakerWaveIcon,
      description: 'Enregistrements',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const encyclopediaSections = [
    {
      name: 'Groupes ethniques',
      path: '/encyclopedia#ethnic-groups',
      icon: BookOpenIcon,
      description: 'Histoire et origines'
    },
    {
      name: 'Traditions',
      path: '/encyclopedia#traditions',
      icon: StarIcon,
      description: 'Coutumes ancestrales'
    },
    {
      name: 'Cuisine',
      path: '/encyclopedia#cuisine',
      icon: PhotoIcon,
      description: 'Recettes traditionnelles'
    },
    {
      name: 'Artisanat',
      path: '/encyclopedia#crafts',
      icon: SparklesIcon,
      description: 'Savoir-faire locaux'
    },
    {
      name: 'Contes',
      path: '/encyclopedia#stories',
      icon: SpeakerWaveIcon,
      description: 'Patrimoine oral'
    }
  ];

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Accueil', path: '/', icon: HomeIcon }
    ];

    if (pathSegments.includes('encyclopedia')) {
      breadcrumbs.push({
        name: 'Encyclopédie Culturelle',
        path: '/encyclopedia',
        icon: BookOpenIcon
      });
    }

    if (currentSection) {
      breadcrumbs.push({
        name: currentSection,
        path: location.pathname,
        icon: BookOpenIcon
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm mb-6">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            )}
            <Link
              to={crumb.path}
              className={`flex items-center space-x-1 ${
                index === breadcrumbs.length - 1
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <crumb.icon className="w-4 h-4" />
              <span>{crumb.name}</span>
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Quick Links */}
      {showQuickLinks && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Modules V1.1
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-md"
              >
                <div className={`${link.bgColor} ${link.color} w-8 h-8 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {link.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {link.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Encyclopedia Sections */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sections de l'Encyclopédie
        </h3>
        <div className="space-y-2">
          {encyclopediaSections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <section.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {section.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {section.description}
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <ClockIcon className="w-4 h-4 mr-2" />
          Activité récente
        </h3>
        <div className="space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dernière consultation: Bamiléké
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Contenu ajouté: 3 nouvelles traditions
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mise à jour: Recettes Douala
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Guide d'utilisation
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Apprendre à naviguer
            </div>
          </button>
          <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contribuer
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Ajouter du contenu
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncyclopediaNavigationComponent;
