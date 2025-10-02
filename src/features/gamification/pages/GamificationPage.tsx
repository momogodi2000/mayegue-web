import React, { useState } from 'react';
import { useGamificationStore, DailyChallenge } from '../store/gamificationStore';
import AchievementPopup from '../components/AchievementPopup';
import AchievementGrid from '../components/AchievementGrid';
import BadgeSystem from '../components/BadgeSystem';
import Leaderboard from '../components/Leaderboard';
import DailyChallenges from '../components/DailyChallenges';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';

const GamificationPage: React.FC = () => {
  const {
    userStats,
    achievements,
    unlockedAchievements,
    badges,
    unlockedBadges,
    levels,
    currentLevel,
    dailyChallenges,
    showAchievementPopup,
    completeChallenge
  } = useGamificationStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'badges' | 'leaderboard' | 'challenges'>('overview');

  // Generate current user rank for leaderboard (mock)
  const currentUserRank = Math.floor(Math.random() * 50) + 1;

  // Mock leaderboard data
  const mockLeaderboardEntries = Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Utilisateur ${i + 1}`,
    points: Math.floor(Math.random() * 5000) + 1000,
    level: Math.floor(Math.random() * 20) + 1,
    rank: i + 1,
    streakDays: Math.floor(Math.random() * 30),
    isCurrentUser: i + 1 === currentUserRank
  }));

  const getTabIcon = (tab: string): string => {
    const icons = {
      overview: '📊',
      achievements: '🏆',
      badges: '🎖️',
      leaderboard: '🏅',
      challenges: '🎯'
    };
    return icons[tab as keyof typeof icons] || '📊';
  };

  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
  };

  // Calculate next level progress
  const nextLevel = levels.find(l => l.level === (currentLevel?.level || 1) + 1);
  const progressToNextLevel = nextLevel 
    ? ((userStats.totalXP - (currentLevel?.minPoints || 0)) / (nextLevel.minPoints - (currentLevel?.minPoints || 0))) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Achievement Popup */}
      {showAchievementPopup && (
        <AchievementPopup
          achievement={showAchievementPopup}
          isOpen={!!showAchievementPopup}
          onClose={() => {
            // Note: Need to add a close function to the store
            console.log('Close achievement popup');
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎮 Gamification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez vos progrès, débloquez des succès et grimpez dans le classement !
          </p>
        </div>

        {/* Quick Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Points Total</p>
                    <p className="text-3xl font-bold">{userStats.totalXP.toLocaleString()}</p>
                  </div>
                  <div className="text-4xl">⚡</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Niveau Actuel</p>
                    <p className="text-3xl font-bold">{currentLevel?.level || 1}</p>
                    <p className="text-green-100 text-xs">{currentLevel?.name}</p>
                  </div>
                  <div className="text-4xl">🏆</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Série Active</p>
                    <p className="text-3xl font-bold">{userStats.streakDays}</p>
                    <p className="text-orange-100 text-xs">jours consécutifs</p>
                  </div>
                  <div className="text-4xl">🔥</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Succès</p>
                    <p className="text-3xl font-bold">{unlockedAchievements.length}</p>
                    <p className="text-purple-100 text-xs">sur {achievements.length}</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Level Progress */}
        {activeTab === 'overview' && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Niveau {currentLevel?.level || 1} - {currentLevel?.name}
                  </h3>
                  <p className="text-gray-600">
                    {nextLevel 
                      ? `${nextLevel.minPoints - userStats.totalXP} XP jusqu'au niveau ${nextLevel.level}`
                      : 'Niveau maximum atteint !'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(progressToNextLevel)}%</div>
                  <div className="text-sm text-gray-500">progression</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
                >
                  {progressToNextLevel > 10 && (
                    <span className="text-white text-xs font-semibold">
                      {userStats.totalXP.toLocaleString()} XP
                    </span>
                  )}
                </div>
              </div>

              {currentLevel?.benefits && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Avantages de ce niveau:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentLevel.benefits.map((benefit: string, index: number) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(['overview', 'achievements', 'badges', 'leaderboard', 'challenges'] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? undefined : 'outline'}
              onClick={() => setActiveTab(tab)}
              className="flex items-center space-x-2"
            >
              <span>{getTabIcon(tab)}</span>
              <span className="capitalize">
                {tab === 'overview' ? 'Vue d\'ensemble' :
                 tab === 'achievements' ? 'Succès' :
                 tab === 'badges' ? 'Badges' :
                 tab === 'leaderboard' ? 'Classement' :
                 'Défis'}
              </span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Achievements */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Succès Récents</h3>
                  <div className="space-y-3">
                    {unlockedAchievements.slice(-5).reverse().map(achievement => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-lg">
                          🏆
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">+{achievement.pointsReward} XP</p>
                        </div>
                      </div>
                    ))}
                    {unlockedAchievements.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        Aucun succès débloqué pour le moment
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Challenges Preview */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Défis d'Aujourd'hui</h3>
                  <div className="space-y-3">
                    {dailyChallenges.slice(0, 3).map((challenge: DailyChallenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                            🎯
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                            <p className="text-sm text-gray-600">
                              {challenge.currentProgress}/{challenge.targetValue}
                            </p>
                          </div>
                        </div>
                        <Badge className={challenge.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {challenge.isCompleted ? 'Complété' : `+${challenge.pointsReward} XP`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('challenges')}
                  >
                    Voir tous les défis
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'achievements' && (
            <AchievementGrid
              achievements={achievements}
              unlockedAchievements={unlockedAchievements}
            />
          )}

          {activeTab === 'badges' && (
            <BadgeSystem
              badges={badges}
              unlockedBadges={unlockedBadges}
            />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              entries={mockLeaderboardEntries}
              currentUserRank={currentUserRank}
            />
          )}

          {activeTab === 'challenges' && (
            <DailyChallenges
              challenges={dailyChallenges}
              onCompleteChallenge={handleCompleteChallenge}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
