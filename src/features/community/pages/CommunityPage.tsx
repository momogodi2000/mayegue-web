import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { DiscussionList } from '../components/DiscussionList';
import { DiscussionDetail } from '../components/DiscussionDetail';
import { LanguageExchangeList } from '../components/LanguageExchangeList';
import { CommunityChallengelist } from '../components/CommunityChallengelist';
import { StudyGroupsList } from '../components/StudyGroupsList';

type CommunityView = 'overview' | 'discussions' | 'discussion-detail' | 'exchanges' | 'challenges' | 'groups';

const CommunityPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<CommunityView>('overview');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);

  const handleDiscussionSelect = (discussionId: string) => {
    setSelectedDiscussionId(discussionId);
    setCurrentView('discussion-detail');
  };

  const handleBackToDiscussions = () => {
    setSelectedDiscussionId(null);
    setCurrentView('discussions');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'discussions':
        return (
          <DiscussionList onDiscussionSelect={handleDiscussionSelect} />
        );
      
      case 'discussion-detail':
        return selectedDiscussionId ? (
          <DiscussionDetail
            discussionId={selectedDiscussionId}
            onBack={handleBackToDiscussions}
          />
        ) : null;
      
      case 'exchanges':
        return <LanguageExchangeList />;
      
      case 'challenges':
        return <CommunityChallengelist />;
      
      case 'groups':
        return <StudyGroupsList />;
      
      default:
        return <CommunityOverview onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Communauté Ma’a yegue
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez une communauté dynamique d'apprenants des langues camerounaises. 
              Participez aux discussions, échangez avec d'autres locuteurs, relevez des défis 
              et apprenez ensemble dans nos groupes d'étude.
            </p>
          </div>
        )}
        
        {currentView !== 'overview' && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
            >
              ← Retour à l'accueil communauté
            </Button>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => onNavigate(feature.id as CommunityView)}
          >
            <CardHeader className="pb-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl text-white mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <CardTitle className="text-xl text-center group-hover:text-blue-600 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 text-center mb-4 line-clamp-3">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{stat.label}</span>
                    <Badge variant="secondary" size="sm">
                      {stat.value}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 group-hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(feature.id as CommunityView);
                }}
              >
                Explorer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">📊 Statistiques de la Communauté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
              <p className="text-gray-600">Membres actifs</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,256</div>
              <p className="text-gray-600">Discussions créées</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <p className="text-gray-600">Échanges en cours</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">45</div>
              <p className="text-gray-600">Groupes d'étude</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onNavigate(activity.type as CommunityView)}
              >
                <div className="text-2xl">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                
                <div className="text-blue-500">
                  →
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Règles de la Communauté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
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
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
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
      </Card>
    </div>
  );
};

export default CommunityPage;
