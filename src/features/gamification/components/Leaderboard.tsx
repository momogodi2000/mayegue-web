import React, { useState } from 'react';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank: number;
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserRank,
  className = ''
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'global' | 'friends' | 'language'>('global');

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'text-yellow-600';
      case 2: return 'text-gray-500';
      case 3: return 'text-amber-600';
      default: return 'text-gray-700';
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getFilterLabel = (filter: string): string => {
    const labels = {
      all: 'Tout temps',
      week: 'Cette semaine',
      month: 'Ce mois',
      global: 'Global',
      friends: 'Amis',
      language: 'Par langue'
    };
    return labels[filter as keyof typeof labels] || filter;
  };

  // Mock data based on current filter (in real app, this would come from props)
  const filteredEntries = entries.slice(0, 50); // Show top 50

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Classement</h2>
          <p className="text-gray-600">
            Votre position: {getRankIcon(currentUserRank)} #{currentUserRank}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm text-gray-500">Top 10%</div>
            <div className="text-xs text-green-600">+2 niveaux ce mois</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {currentUserRank <= 3 ? getRankIcon(currentUserRank) : getRankIcon(currentUserRank).slice(1)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-2">
          <span className="text-sm font-medium text-gray-700 py-2">Période:</span>
          {(['all', 'week', 'month'] as const).map(filter => (
            <Button
              key={filter}
              size="sm"
              variant={timeFilter === filter ? undefined : 'outline'}
              onClick={() => setTimeFilter(filter)}
            >
              {getFilterLabel(filter)}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <span className="text-sm font-medium text-gray-700 py-2">Catégorie:</span>
          {(['global', 'friends', 'language'] as const).map(filter => (
            <Button
              key={filter}
              size="sm"
              variant={categoryFilter === filter ? undefined : 'outline'}
              onClick={() => setCategoryFilter(filter)}
            >
              {getFilterLabel(filter)}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[2, 1, 3].map(position => {
          const entry = filteredEntries.find(e => e.rank === position);
          if (!entry) return null;

          return (
            <Card
              key={entry.id}
              className={`text-center p-4 ${
                position === 1 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 transform scale-105' 
                  : position === 2
                  ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
              } ${entry.isCurrentUser ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="relative">
                {/* Podium Height Effect */}
                <div className={`mb-3 ${position === 1 ? 'mt-0' : position === 2 ? 'mt-4' : 'mt-6'}`}>
                  {/* Avatar */}
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-white ${
                    position === 1 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg' 
                      : position === 2
                      ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-md'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-md'
                  }`}>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getInitials(entry.name)
                    )}
                  </div>
                  
                  {/* Crown for winner */}
                  {position === 1 && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">
                      👑
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-gray-900 mb-1">{entry.name}</h3>
                <div className={`text-2xl font-bold mb-1 ${getRankColor(position)}`}>
                  {getRankIcon(position)}
                </div>
                <div className="text-lg font-bold text-gray-900">{entry.points.toLocaleString()} XP</div>
                <div className="text-xs text-gray-600">Niveau {entry.level}</div>
                
                {entry.streakDays > 0 && (
                  <div className="mt-2">
                    <Badge size="sm" className="bg-orange-100 text-orange-800">
                      🔥 {entry.streakDays} jours
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 ${
                  entry.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                {/* Rank */}
                <div className={`w-12 text-center font-bold ${getRankColor(entry.rank)}`}>
                  {entry.rank <= 3 ? (
                    <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                  ) : (
                    <span className="text-lg">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-4">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(entry.name)
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold text-gray-900 truncate ${
                      entry.isCurrentUser ? 'text-blue-900' : ''
                    }`}>
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-600">(Vous)</span>
                      )}
                    </h3>
                    <Badge size="sm" className="bg-gray-100 text-gray-700">
                      Niv. {entry.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{entry.points.toLocaleString()} XP</span>
                    {entry.streakDays > 0 && (
                      <span className="text-sm text-orange-600">🔥 {entry.streakDays} jours</span>
                    )}
                  </div>
                </div>

                {/* Rank Change Indicator */}
                <div className="text-right">
                  {index < 3 && (
                    <div className="text-xs text-green-600">↗ +{Math.floor(Math.random() * 5) + 1}</div>
                  )}
                  {index >= 3 && index < 10 && Math.random() > 0.5 && (
                    <div className="text-xs text-green-600">↗ +{Math.floor(Math.random() * 3) + 1}</div>
                  )}
                  {index >= 10 && Math.random() > 0.7 && (
                    <div className="text-xs text-red-600">↘ -{Math.floor(Math.random() * 2) + 1}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current User Quick Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Vos statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">#{currentUserRank}</div>
            <div className="text-xs text-gray-600">Position actuelle</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">↗12</div>
            <div className="text-xs text-gray-600">Places gagnées</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-xs text-gray-600">Top percentile</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">🔥7</div>
            <div className="text-xs text-gray-600">Série active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;