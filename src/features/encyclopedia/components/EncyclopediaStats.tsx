/**
 * Encyclopedia Stats Component - Statistics dashboard for Encyclopedia
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { EncyclopediaStats } from '../types/encyclopedia.types';
import { encyclopediaService } from '../services/encyclopediaService';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';

interface EncyclopediaStatsProps {
  onStatsLoad?: (stats: EncyclopediaStats) => void;
}

const EncyclopediaStatsComponent: React.FC<EncyclopediaStatsProps> = ({
  onStatsLoad
}) => {
  const [stats, setStats] = useState<EncyclopediaStats>({
    totalGroups: 0,
    totalTraditions: 0,
    totalCuisineItems: 0,
    totalCrafts: 0,
    totalStories: 0,
    totalProverbs: 0,
    totalMusicItems: 0,
    totalDances: 0,
    totalCeremonies: 0,
    regions: 0,
    languages: 0,
    totalMediaItems: 0,
    regionsCovered: 0,
    lastUpdated: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const ethnicGroups = await encyclopediaService.getEthnicGroups();

      // Calculate statistics
      const totalGroups = ethnicGroups.length;
      const totalTraditions = ethnicGroups.reduce((sum: number, group: any) => sum + group.traditions.length, 0);
      const totalCuisineItems = ethnicGroups.reduce((sum: number, group: any) => sum + group.cuisine.length, 0);
      const totalCrafts = ethnicGroups.reduce((sum: number, group: any) => sum + group.crafts.length, 0);
      const totalStories = ethnicGroups.reduce((sum: number, group: any) => sum + group.proverbs.length + group.contes.length, 0);
      const totalMediaItems = ethnicGroups.filter((group: any) => group.imageUrl).length;
      const regionsCovered = new Set(ethnicGroups.map((group: any) => group.region)).size;

      const newStats: EncyclopediaStats = {
        totalGroups,
        totalTraditions,
        totalCuisineItems,
        totalCrafts,
        totalStories,
        totalProverbs: 0,
        totalMusicItems: 0,
        totalDances: 0,
        totalCeremonies: 0,
        regions: regionsCovered,
        languages: 0,
        totalMediaItems,
        regionsCovered,
        lastUpdated: new Date()
      };

      setStats(newStats);
      onStatsLoad?.(newStats);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={loadStats}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: UsersIcon,
      label: 'Groupes ethniques',
      value: stats.totalGroups,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Communautés culturelles'
    },
    {
      icon: DocumentTextIcon,
      label: 'Traditions',
      value: stats.totalTraditions,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Coutumes ancestrales'
    },
    {
      icon: PhotoIcon,
      label: 'Plats de cuisine',
      value: stats.totalCuisineItems,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Recettes traditionnelles'
    },
    {
      icon: ChartBarIcon,
      label: 'Artisanats',
      value: stats.totalCrafts,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Savoir-faire locaux'
    },
    {
      icon: SpeakerWaveIcon,
      label: 'Contes & Proverbes',
      value: stats.totalStories,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Patrimoine oral'
    },
    {
      icon: VideoCameraIcon,
      label: 'Médias',
      value: stats.totalMediaItems,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'Images & vidéos'
    },
    {
      icon: MapPinIcon,
      label: 'Régions',
      value: stats.regionsCovered,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      description: 'Zones géographiques'
    },
    {
      icon: CalendarIcon,
      label: 'Dernière mise à jour',
      value: stats.lastUpdated.toLocaleDateString('fr-FR'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      description: 'Contenu actualisé'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
          Statistiques de l'Encyclopédie
        </h3>
        <button
          onClick={loadStats}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          <GlobeAltIcon className="w-4 h-4 mr-1" />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`${item.bgColor} ${item.color} w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <item.icon className="w-8 h-8" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {typeof item.value === 'number' ? (
                <CountUp end={item.value} duration={2} />
              ) : (
                item.value
              )}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {item.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Aperçu du contenu
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Groupes ethniques</span>
              <span className="text-gray-900 dark:text-white">{stats.totalGroups} / 250+</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.totalGroups / 250) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Traditions documentées</span>
              <span className="text-gray-900 dark:text-white">{stats.totalTraditions} / 1000+</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.totalTraditions / 1000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Contenu multimédia</span>
              <span className="text-gray-900 dark:text-white">{stats.totalMediaItems} / {stats.totalGroups}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalGroups > 0 ? (stats.totalMediaItems / stats.totalGroups) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Actions rapides
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
            <div className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Contribuer
            </div>
            <div className="text-xs text-primary-600 dark:text-primary-400">
              Ajouter du contenu
            </div>
          </button>
          <button className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <div className="text-sm font-medium text-green-700 dark:text-green-300">
              Partager
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Diffuser la culture
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncyclopediaStatsComponent;
