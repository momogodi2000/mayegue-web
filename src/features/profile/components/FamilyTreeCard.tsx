import React from 'react';
import { FamilyTree, FamilyMember } from '../types/rpg.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  UserGroupIcon, 
  HeartIcon,
  ClockIcon,
  TrophyIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface FamilyTreeCardProps {
  familyTree: FamilyTree;
  onNavigate: (section: string) => void;
  onInviteMember: () => void;
}

export const FamilyTreeCard: React.FC<FamilyTreeCardProps> = ({ 
  familyTree, 
  onNavigate, 
  onInviteMember 
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'child': return '👶';
      case 'grandparent': return '👴';
      case 'sibling': return '👫';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'parent': return 'text-blue-600';
      case 'child': return 'text-green-600';
      case 'grandparent': return 'text-purple-600';
      case 'sibling': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <FloatingCard className="card p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          🌳 Arbre Linguistique Familial
        </h3>
        <button
          onClick={onInviteMember}
          className="btn-outline text-sm py-1 px-3"
        >
          + Inviter
        </button>
      </div>

      {/* Family Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <UserGroupIcon className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {familyTree.members.length}
          </div>
          <div className="text-xs text-gray-500">Membres</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <TrophyIcon className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            Niveau {familyTree.level}
          </div>
          <div className="text-xs text-gray-500">Famille</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <CurrencyDollarIcon className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {familyTree.totalCoins.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Coins Partagés</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <HeartIcon className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {familyTree.totalXp.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">XP Total</div>
        </div>
      </div>

      {/* Family Members */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <UserGroupIcon className="w-4 h-4 mr-2" />
          Membres de la Famille
        </h4>
        
        {familyTree.members.slice(0, 4).map((member) => (
          <div
            key={member.id}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onNavigate('family-member')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {member.displayName.charAt(0).toUpperCase()}
              </div>
              {member.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {member.displayName}
                </span>
                <span className={`text-xs ${getRoleColor(member.role)}`}>
                  {getRoleIcon(member.role)} {member.role}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Niveau {member.level}</span>
                <span>{member.xp.toLocaleString()} XP</span>
                <span className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {member.lastActiveAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {familyTree.members.length > 4 && (
          <div className="text-center">
            <button
              onClick={() => onNavigate('family-members')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tous les membres ({familyTree.members.length})
            </button>
          </div>
        )}
      </div>

      {/* Shared Goals */}
      {familyTree.sharedGoals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon className="w-4 h-4 mr-2" />
            Objectifs Partagés
          </h4>
          
          {familyTree.sharedGoals.slice(0, 2).map((goal) => (
            <div
              key={goal.id}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {goal.title}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status === 'completed' ? 'Terminé' :
                   goal.status === 'active' ? 'Actif' : 'Expiré'}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{goal.current} / {goal.target}</span>
                <span>{goal.participants.length} participants</span>
              </div>
            </div>
          ))}

          {familyTree.sharedGoals.length > 2 && (
            <div className="text-center">
              <button
                onClick={() => onNavigate('family-goals')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir tous les objectifs ({familyTree.sharedGoals.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => onNavigate('family-tree')}
          className="btn-outline text-sm py-2"
        >
          🌳 Arbre Complet
        </button>
        <button
          onClick={() => onNavigate('family-challenges')}
          className="btn-outline text-sm py-2"
        >
          🏆 Défis Famille
        </button>
      </div>
    </FloatingCard>
  );
};
