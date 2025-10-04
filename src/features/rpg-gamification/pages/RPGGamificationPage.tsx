/**
 * RPG Gamification Page - Main page for RPG gamification system
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { 
  UserIcon,
  TrophyIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  StarIcon,
  GiftIcon,
  FireIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { rpgService } from '../services/rpgService';
import { 
  Player, 
  Achievement, 
  Quest, 
  Competition, 
  League, 
  NgondoShop,
  NgondoAuction
} from '../types/rpg.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';

const RPGGamificationPage: React.FC = () => {
  // State management
  const [player, setPlayer] = useState<Player | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [shops, setShops] = useState<NgondoShop[]>([]);
  const [auctions, setAuctions] = useState<NgondoAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'character' | 'quests' | 'achievements' | 'competitions' | 'economy'>('overview');

  // Mock user ID - in real app, get from auth context
  const userId = 'mock-user-id';

  // Intersection observer for animations
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [contentRef, contentInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load player data
      let playerData = await rpgService.getPlayer(userId);
      
      // Create player if doesn't exist
      if (!playerData) {
        const newPlayer: Omit<Player, 'id'> = {
          userId,
          username: 'Apprenti Culturel',
          avatar: {
            id: 'default-avatar',
            name: 'Avatar par défaut',
            appearance: {
              gender: 'non-binary',
              skinTone: '#FDBCB4',
              hairStyle: 'short',
              hairColor: '#8B4513',
              eyeColor: '#4169E1',
              facialFeatures: [],
              bodyType: 'average',
              height: 170,
              weight: 70
            },
            customization: {
              clothing: {
                top: 'basic-shirt',
                bottom: 'basic-pants',
                shoes: 'basic-shoes',
                jewelry: [],
                color: '#FFFFFF',
                pattern: 'solid',
                material: 'cotton'
              },
              accessories: [],
              tattoos: [],
              scars: [],
              culturalElements: [],
              seasonalItems: []
            },
            animations: [],
            expressions: [],
            isCustom: false,
            rarity: 'common',
            unlockedAt: new Date()
          },
          level: 1,
          experience: 0,
          experienceToNext: 100,
          totalExperience: 0,
          ngondoCoins: 100,
          achievements: [],
          skills: [],
          equipment: {
            weapon: null,
            armor: [],
            accessories: [],
            tools: [],
            cultural: [],
            totalStats: {
              charisma: 10,
              intelligence: 10,
              wisdom: 10,
              strength: 10,
              dexterity: 10,
              constitution: 10
            }
          },
          inventory: [],
          quests: [],
          stats: {
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50,
            stamina: 100,
            maxStamina: 100,
            attributes: {
              strength: 10,
              dexterity: 10,
              constitution: 10,
              intelligence: 10,
              wisdom: 10,
              charisma: 10
            },
            resistances: {
              fire: 0,
              water: 0,
              earth: 0,
              air: 0,
              light: 0,
              dark: 0,
              physical: 0,
              magical: 0
            },
            bonuses: {
              experience: 0,
              skillExperience: 0,
              ngondoCoins: 0,
              dropRate: 0,
              criticalChance: 0,
              criticalDamage: 0,
              movementSpeed: 0,
              attackSpeed: 0,
              castingSpeed: 0
            }
          },
          preferences: {
            language: 'fr',
            difficulty: 'normal',
            autoSave: true,
            notifications: {
              achievements: true,
              quests: true,
              social: true,
              events: true,
              reminders: true,
              sound: true,
              vibration: true
            },
            privacy: {
              profileVisible: true,
              progressVisible: true,
              achievementsVisible: true,
              onlineStatus: true,
              allowFriendRequests: true,
              allowMessages: true
            },
            accessibility: {
              highContrast: false,
              largeText: false,
              screenReader: false,
              colorBlindSupport: false,
              reducedMotion: false,
              keyboardNavigation: true
            },
            ui: {
              theme: 'auto',
              language: 'fr',
              fontSize: 'medium',
              compactMode: false,
              showTooltips: true,
              showAnimations: true,
              showParticles: true
            }
          },
          social: {
            friends: [],
            reputation: {
              total: 0,
              categories: {},
              rank: 'Débutant',
              benefits: [],
              penalties: [],
              lastUpdated: new Date()
            },
            socialRank: {
              level: 1,
              title: 'Nouveau venu',
              description: 'Vous commencez votre aventure culturelle',
              benefits: [],
              requirements: [],
              nextRank: 'Explorateur',
              progress: 0
            },
            achievements: [],
            events: []
          },
          progress: {
            totalPlayTime: 0,
            sessionsCompleted: 0,
            questsCompleted: 0,
            achievementsUnlocked: 0,
            skillsMastered: 0,
            languagesLearned: 0,
            culturalGroupsExplored: 0,
            regionsVisited: 0,
            artifactsCollected: 0,
            socialInteractions: 0,
            lastActivity: new Date(),
            streak: 0,
            longestStreak: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const playerId = await rpgService.createPlayer(newPlayer);
        playerData = await rpgService.getPlayer(userId);
      }

      const [achievementsData, questsData, competitionsData, leaguesData, shopsData, auctionsData] = await Promise.all([
        rpgService.getAllAchievements(),
        rpgService.getAllQuests(),
        rpgService.getAllCompetitions(),
        rpgService.getAllLeagues(),
        rpgService.getAllShops(),
        rpgService.getAllAuctions()
      ]);

      setPlayer(playerData);
      setAchievements(achievementsData);
      setQuests(questsData);
      setCompetitions(competitionsData);
      setLeagues(leaguesData);
      setShops(shopsData);
      setAuctions(auctionsData);
    } catch (err) {
      console.error('Error loading RPG data:', err);
      setError('Erreur lors du chargement du système RPG');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-800',
      uncommon: 'bg-green-100 text-green-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    };
    return colors[rarity] || colors.common;
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'text-yellow-600';
    if (level >= 30) return 'text-purple-600';
    if (level >= 20) return 'text-blue-600';
    if (level >= 10) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement du système RPG...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="btn-primary btn"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Système RPG Gamifié - Ma'a yegue</title>
        <meta name="description" content="Transformez votre apprentissage en aventure épique avec notre système RPG complet : avatars, quêtes, succès et économie virtuelle." />
        <meta name="keywords" content="RPG, gamification, avatars, quêtes, succès, compétitions, économie virtuelle, Ngondo Coins" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Système RPG Gamifié
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Transformez votre apprentissage en aventure épique ! Créez votre avatar, 
                accomplissez des quêtes, débloquez des succès et participez à des compétitions.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Player Stats */}
      {player && (
        <AnimatedSection ref={statsRef} className="container-custom py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Votre Progression
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-1 ${getLevelColor(player.level)}`}>
                  <CountUp end={player.level} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Niveau</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={player.totalExperience} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  <CountUp end={player.ngondoCoins} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ngondo Coins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  <CountUp end={player.achievements.length} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Succès</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  <CountUp end={player.quests.filter(q => q.status === 'completed').length} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quêtes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  <CountUp end={player.progress.streak} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Série</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Player Avatar */}
              {player && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Votre Avatar
                  </h3>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{player.username}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Niveau {player.level}</p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(player.experience / player.experienceToNext) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {player.experience} / {player.experienceToNext} XP
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions Rapides
                </h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary btn-sm flex items-center justify-center">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    Nouvelle Quête
                  </button>
                  <button className="w-full btn-secondary btn-sm flex items-center justify-center">
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    Boutique
                  </button>
                  <button className="w-full btn-outline btn-sm flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Compétitions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Aperçu', icon: ChartBarIcon },
                      { id: 'character', label: 'Personnage', icon: UserIcon },
                      { id: 'quests', label: 'Quêtes', icon: BookOpenIcon },
                      { id: 'achievements', label: 'Succès', icon: TrophyIcon },
                      { id: 'competitions', label: 'Compétitions', icon: UsersIcon },
                      { id: 'economy', label: 'Économie', icon: CurrencyDollarIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatedSection ref={contentRef}>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aperçu du Système RPG
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez toutes les fonctionnalités de notre système de gamification 
                            pour rendre votre apprentissage plus engageant et motivant.
                          </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                            <UserIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Personnage Personnalisable
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Créez et personnalisez votre avatar avec des vêtements, 
                              accessoires et éléments culturels uniques.
                            </p>
                            <button
                              onClick={() => setActiveTab('character')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Personnaliser →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <BookOpenIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Quêtes Épiques
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Accomplissez des quêtes variées pour progresser dans votre 
                              apprentissage et débloquer de nouveaux contenus.
                            </p>
                            <button
                              onClick={() => setActiveTab('quests')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6">
                            <TrophyIcon className="w-8 h-8 text-yellow-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Succès & Récompenses
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Débloquez des succès rares et collectez des récompenses 
                              pour vos accomplissements.
                            </p>
                            <button
                              onClick={() => setActiveTab('achievements')}
                              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                            >
                              Voir les succès →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
                            <UsersIcon className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Compétitions
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Participez à des tournois et ligues pour tester vos 
                              compétences contre d'autres joueurs.
                            </p>
                            <button
                              onClick={() => setActiveTab('competitions')}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                              Compétir →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <CurrencyDollarIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Économie Ngondo
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Gagnez et dépensez des Ngondo Coins pour acheter des 
                              objets, équipements et améliorations.
                            </p>
                            <button
                              onClick={() => setActiveTab('economy')}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Économie →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6">
                            <SparklesIcon className="w-8 h-8 text-red-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Fonctionnalités Uniques
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Découvrez des fonctionnalités exclusives comme la grand-mère 
                              virtuelle et l'arbre linguistique familial.
                            </p>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Découvrir →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'character' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Personnage
                          </h2>
                        </div>
                        
                        {player && (
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Avatar Display */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Votre Avatar
                              </h3>
                              <div className="text-center">
                                <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                                  <UserIcon className="w-16 h-16 text-primary-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{player.username}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Niveau {player.level}</p>
                              </div>
                            </div>

                            {/* Character Stats */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Statistiques
                              </h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Charisme</span>
                                  <span className="font-semibold">{player.stats.attributes.charisma}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Intelligence</span>
                                  <span className="font-semibold">{player.stats.attributes.intelligence}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Sagesse</span>
                                  <span className="font-semibold">{player.stats.attributes.wisdom}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Force</span>
                                  <span className="font-semibold">{player.stats.attributes.strength}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Dextérité</span>
                                  <span className="font-semibold">{player.stats.attributes.dexterity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Constitution</span>
                                  <span className="font-semibold">{player.stats.attributes.constitution}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'quests' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Quêtes ({quests.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {quests.slice(0, 9).map((quest) => (
                            <div key={quest.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(quest.difficulty)}`}>
                                  {quest.difficulty}
                                </span>
                                <span className="text-sm text-gray-500">Niveau {quest.level}</span>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{quest.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                {quest.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{quest.category}</span>
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                  Commencer →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'achievements' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Succès ({achievements.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {achievements.slice(0, 9).map((achievement) => (
                            <div key={achievement.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                                  {achievement.rarity}
                                </span>
                                <span className="text-sm text-gray-500">{achievement.points} pts</span>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{achievement.category}</span>
                                <div className="flex items-center">
                                  <TrophyIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {achievement.progress}/{achievement.maxProgress}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'competitions' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Compétitions ({competitions.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {competitions.slice(0, 9).map((competition) => (
                            <div key={competition.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(competition.difficulty)}`}>
                                  {competition.difficulty}
                                </span>
                                <span className="text-sm text-gray-500">{competition.participants.length} participants</span>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{competition.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                {competition.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{competition.type}</span>
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                  Participer →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'economy' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Économie Ngondo
                          </h2>
                          {player && (
                            <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                              <CurrencyDollarIcon className="w-5 h-5 text-yellow-600 mr-2" />
                              <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                                {player.ngondoCoins} Ngondo Coins
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Shops */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Boutiques ({shops.length})
                            </h3>
                            <div className="space-y-4">
                              {shops.slice(0, 3).map((shop) => (
                                <div key={shop.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{shop.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{shop.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{shop.category}</span>
                                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                      Visiter →
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Auctions */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Enchères ({auctions.length})
                            </h3>
                            <div className="space-y-4">
                              {auctions.slice(0, 3).map((auction) => (
                                <div key={auction.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{auction.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{auction.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-green-600">{auction.currentBid} Ngondo Coins</span>
                                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                      Enchérir →
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPGGamificationPage;
