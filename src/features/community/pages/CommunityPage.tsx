import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Spinner, useToastActions } from '@/shared/components/ui';
import { DiscussionList } from '../components/DiscussionList';
import { DiscussionDetail } from '../components/DiscussionDetail';
import { LanguageExchangeList } from '../components/LanguageExchangeList';
import { CommunityChallengelist } from '../components/CommunityChallengelist';
import { StudyGroupsList } from '../components/StudyGroupsList';
import { AnimatedSection, FloatingCard, CountUp } from '@/shared/components/ui/AnimatedComponents';
import { VERSION_INFO } from '@/shared/constants/version';
import {
  TrophyIcon,
  ShoppingBagIcon,
  SparklesIcon,
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { paymentService } from '@/core/services/payment/payment.service';
import { communityService, Group, Post } from '@/core/services/firebase/community.service';
import GroupCreationModal from '../components/GroupCreationModal';
import PostCreationModal from '../components/PostCreationModal';

type CommunityView = 'overview' | 'discussions' | 'discussion-detail' | 'exchanges' | 'challenges' | 'groups' | 'marketplace';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Community Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Une erreur est survenue
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nous rencontrons des difficultés techniques. Veuillez réessayer.
              </p>
              <Button onClick={() => window.location.reload()}>
                Recharger la page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

const CommunityPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<CommunityView>('overview');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  
  // V1.1 New State
  const { user } = useAuthStore();
  const [hasFullAccess, setHasFullAccess] = useState(false);
  
  // Enhanced community functionality
  const [groups, setGroups] = useState<Group[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToastActions();

  const handleDiscussionSelect = (discussionId: string) => {
    setSelectedDiscussionId(discussionId);
    setCurrentView('discussion-detail');
  };

  const handleBackToDiscussions = () => {
    setSelectedDiscussionId(null);
    setCurrentView('discussions');
  };

  // Load community data
  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [groupsData, postsData] = await Promise.all([
        communityService.getGroups({ limit: 10 }),
        communityService.getPosts({ limit: 20 })
      ]);
      
      setGroups(groupsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading community data:', error);
      showError('Erreur lors du chargement des données communautaires');
    } finally {
      setLoading(false);
    }
  };

  // Check user access level
  useEffect(() => {
    const checkAccess = async () => {
      if (user?.id) {
        try {
          const hasAccess = await paymentService.userHasAccess(user.id, 'community_features');
          setHasFullAccess(hasAccess);
        } catch (error) {
          console.error('Error checking user access:', error);
          setHasFullAccess(false);
        }
      }
    };

    checkAccess();
  }, [user]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
    showSuccess('Groupe créé avec succès !');
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    showSuccess('Post créé avec succès !');
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user?.id) return;
    
    try {
      await communityService.joinGroup(groupId, user.id);
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, memberCount: group.memberCount + 1, members: [...group.members, user.id] }
          : group
      ));
      showSuccess('Vous avez rejoint le groupe !');
    } catch (error) {
      showError('Erreur lors de l\'adhésion au groupe');
    }
  };

  const renderContent = () => {
    try {
      switch (currentView) {
        case 'discussions':
          return (
            <ErrorBoundary>
              <DiscussionList onDiscussionClick={(d) => handleDiscussionSelect(d.id)} />
            </ErrorBoundary>
          );

        case 'discussion-detail':
          return selectedDiscussionId ? (
            <ErrorBoundary>
              <DiscussionDetail
                discussionId={selectedDiscussionId}
                onBack={handleBackToDiscussions}
              />
            </ErrorBoundary>
          ) : null;

        case 'exchanges':
          return (
            <ErrorBoundary>
              <LanguageExchangeList />
            </ErrorBoundary>
          );

        case 'challenges':
          return (
            <ErrorBoundary>
              <CommunityChallengelist />
            </ErrorBoundary>
          );

        case 'groups':
          return (
            <ErrorBoundary>
              <StudyGroupsList />
            </ErrorBoundary>
          );

        case 'marketplace':
          return (
            <div className="text-center py-8">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Marketplace
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Découvrez des produits culturels et linguistiques uniques.
              </p>
              <Button onClick={() => window.location.href = '/marketplace'}>
                Visiter le Marketplace
              </Button>
            </div>
          );

        default:
          return (
            <ErrorBoundary>
              <CommunityOverview onNavigate={setCurrentView} />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error('Error rendering community content:', error);
      return (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Une erreur s'est produite lors du chargement du contenu.
            </p>
            <Button onClick={() => setCurrentView('overview')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Communauté V1.1 - Ma'a yegue | Marketplace & Échanges Linguistiques</title>
        <meta name="description" content="Rejoignez la communauté Ma'a yegue V1.1 : discussions, échanges linguistiques, défis et marketplace culturel." />
      </Helmet>

      <div className="container-custom py-8">
        {currentView === 'overview' && (
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              🆕 Version {VERSION_INFO.version} - {VERSION_INFO.name}
            </div>
            <h1 className="heading-1 mb-6">
              👥 Communauté Ma'a yegue V1.1
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              Rejoignez une communauté dynamique d'apprenants des langues camerounaises. 
              Participez aux discussions, échangez avec d'autres locuteurs, relevez des défis 
              et apprenez ensemble dans nos groupes d'étude.
              {!hasFullAccess && (
                <span className="block mt-2 text-sm text-orange-600 dark:text-orange-400">
                  Accès limité - Passez à Premium pour débloquer toutes les fonctionnalités
                </span>
              )}
            </p>

            {/* V1.1 Features Banner */}
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">Nouvelles Fonctionnalités V1.1</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBagIcon className="w-6 h-6" />
                  <span className="text-sm">Marketplace Culturel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-6 h-6" />
                  <span className="text-sm">IA Modération</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-6 h-6" />
                  <span className="text-sm">Compétitions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="w-6 h-6" />
                  <span className="text-sm">Contributions</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
        
        {currentView !== 'overview' && (
          <AnimatedSection className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
              className="dark:bg-gray-700 dark:text-white"
            >
              ← Retour à l'accueil communauté
            </Button>
          </AnimatedSection>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

interface CommunityOverviewProps {
  onNavigate: (view: CommunityView) => void;
}

const CommunityOverview: React.FC<CommunityOverviewProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'discussions',
      title: 'Forums de Discussion',
      description: 'Posez vos questions, partagez vos expériences et aidez autres apprenants',
      icon: '💬',
      color: 'from-blue-500 to-blue-600',
      stats: [
        { label: 'Discussions actives', value: '124+' },
        { label: 'Réponses quotidiennes', value: '50+' }
      ]
    },
    {
      id: 'exchanges',
      title: 'Échanges Linguistiques',
      description: 'Trouvez des partenaires pour pratiquer en temps réel',
      icon: '🌍',
      color: 'from-green-500 to-green-600',
      stats: [
        { label: 'Échanges actifs', value: '89+' },
        { label: 'Langues disponibles', value: '12' }
      ]
    },
    {
      id: 'challenges',
      title: 'Défis Communautaires',
      description: 'Participez aux challenges linguistiques et montrez vos compétences',
      icon: '🏆',
      color: 'from-purple-500 to-purple-600',
      stats: [
        { label: 'Défis en cours', value: '15+' },
        { label: 'Participants actifs', value: '300+' }
      ]
    },
    {
      id: 'groups',
      title: 'Groupes d\'Étude',
      description: 'Rejoignez des groupes pour apprendre ensemble de façon structurée',
      icon: '👥',
      color: 'from-orange-500 to-orange-600',
      stats: [
        { label: 'Groupes actifs', value: '45+' },
        { label: 'Sessions programmées', value: '80+' }
      ]
    },
    {
      id: 'marketplace',
      title: 'Marketplace Culturel',
      description: 'Achetez et vendez des objets culturels, cours privés et expériences',
      icon: '🛒',
      color: 'from-pink-500 to-pink-600',
      stats: [
        { label: 'Articles disponibles', value: '67+' },
        { label: 'Vendeurs certifiés', value: '25+' }
      ],
      premium: true
    }
  ];

  const recentActivity = [
    {
      type: 'discussion',
      title: 'Comment prononcer les tons en Ewondo ?',
      author: 'Marie K.',
      time: '2 min',
      responses: 8
    },
    {
      type: 'exchange',
      title: 'Échange Français-Duala (niveau intermédiaire)',
      author: 'Jean-Paul N.',
      time: '15 min',
      participants: 3
    },
    {
      type: 'challenge',
      title: 'Défi de traduction Bamileke',
      author: 'Communauté',
      time: '1h',
      entries: 12
    },
    {
      type: 'group',
      title: 'Session "Grammaire Fulfulde avancée"',
      author: 'Groupe Fulfulde',
      time: '2h',
      attendees: 6
    }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      discussion: '💬',
      exchange: '🌍',
      challenge: '🏆',
      group: '👥'
    };
    return icons[type as keyof typeof icons] || '📌';
  };

  return (
    <div className="space-y-8">
      {/* Feature Cards */}
      <AnimatedSection delay={200} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {features.map((feature, index) => (
          <FloatingCard
            key={feature.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative"
            delay={index * 100}
            onClick={() => onNavigate(feature.id as CommunityView)}
          >
            {/* Premium Badge */}
            {feature.premium && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  Premium
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl text-white mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <CardTitle className="text-xl text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-gray-900 dark:text-white">
                {feature.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-3">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{stat.label}</span>
                    <Badge variant="secondary" size="sm" className="dark:bg-gray-700 dark:text-white">
                      {stat.value}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 group-hover:bg-primary-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(feature.id as CommunityView);
                }}
                disabled={feature.premium}
              >
                {feature.premium ? 'Premium requis' : 'Explorer'}
              </Button>
            </CardContent>
          </FloatingCard>
        ))}
      </AnimatedSection>

      {/* Community Stats */}
      <AnimatedSection delay={400}>
        <FloatingCard>
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-white">📊 Statistiques de la Communauté</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  <CountUp end={2847} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Membres actifs</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  <CountUp end={1256} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Discussions créées</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  <CountUp end={89} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Échanges en cours</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  <CountUp end={45} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Groupes d'étude</p>
              </div>
            </div>
          </CardContent>
        </FloatingCard>
      </AnimatedSection>

      {/* Recent Activity */}
      <AnimatedSection delay={600}>
        <FloatingCard>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">🔥 Activité Récente</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => onNavigate(activity.type as CommunityView)}
              >
                <div className="text-2xl">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>par {activity.author}</span>
                    <span>•</span>
                    <span>il y a {activity.time}</span>
                    {activity.responses && (
                      <>
                        <span>•</span>
                        <span>{activity.responses} réponses</span>
                      </>
                    )}
                    {activity.participants && (
                      <>
                        <span>•</span>
                        <span>{activity.participants} participants</span>
                      </>
                    )}
                    {activity.entries && (
                      <>
                        <span>•</span>
                        <span>{activity.entries} entrées</span>
                      </>
                    )}
                    {activity.attendees && (
                      <>
                        <span>•</span>
                        <span>{activity.attendees} participants</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-blue-500 dark:text-blue-400">
                  →
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </FloatingCard>
      </AnimatedSection>

      {/* Community Guidelines */}
      <AnimatedSection delay={700}>
        <FloatingCard className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">📋 Règles de la Communauté</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-semibold mb-2">🤝 Respect et Bienveillance</h4>
              <p className="text-sm">
                Traitez tous les membres avec respect. Encouragez les apprenants 
                et créez un environnement positif.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🎯 Restez dans le Sujet</h4>
              <p className="text-sm">
                Gardez les discussions liées à l'apprentissage des langues 
                camerounaises et à la culture.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">📚 Partagez vos Connaissances</h4>
              <p className="text-sm">
                Aidez les autres apprenants en partageant vos expériences 
                et ressources utiles.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🚫 Pas de Spam</h4>
              <p className="text-sm">
                Évitez les messages répétitifs, la publicité non sollicitée 
                ou le contenu hors sujet.
              </p>
            </div>
          </div>
        </CardContent>
        </FloatingCard>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection delay={800}>
        <FloatingCard className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="text-center py-12">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-4">
            Prêt à Rejoindre notre Communauté ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Commencez dès aujourd'hui ! Posez votre première question, 
            rejoignez un échange linguistique, ou participez à un défi. 
            La communauté vous attend !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('discussions')}
            >
              🗨️ Commencer une Discussion
            </Button>
            <Button 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('exchanges')}
            >
              🌍 Trouver un Partenaire
            </Button>
            <Button 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('groups')}
            >
              👥 Rejoindre un Groupe
            </Button>
          </div>
        </CardContent>
        </FloatingCard>
      </AnimatedSection>
    </div>
  );
};

export default CommunityPage;
