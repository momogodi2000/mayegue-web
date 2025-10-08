import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Badge } from '@/shared/components/ui';
import { enhancedAdminService, type AdminUser, type UserActivity } from '../services/enhanced-admin.service';
import type { UserRole } from '@/shared/types/user.types';
import toast from 'react-hot-toast';

interface UserManagementPanelProps {
  className?: string;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  className = ''
}) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('learner');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await enhancedAdminService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'online') {
        filtered = filtered.filter(user => user.isOnline);
      } else if (statusFilter === 'offline') {
        filtered = filtered.filter(user => !user.isOnline);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleViewUser = async (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    
    try {
      const activity = await enhancedAdminService.getUserActivity(user.id);
      setUserActivity(activity);
    } catch (error) {
      console.error('Error loading user activity:', error);
    }
  };

  const handleEditRole = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      await enhancedAdminService.updateUserRole(selectedUser.id, newRole);
      await loadUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.displayName} ?`)) {
      return;
    }

    try {
      await enhancedAdminService.deleteUser(user.id);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      admin: 'danger',
      teacher: 'warning',
      learner: 'info',
      guest: 'secondary'
    } as const;

    const labels = {
      admin: 'Admin',
      teacher: 'Enseignant',
      learner: 'Apprenant',
      guest: 'Invité'
    };

    return (
      <Badge variant={variants[role]}>
        {labels[role]}
      </Badge>
    );
  };

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      free: 'secondary',
      premium: 'success',
      family: 'info',
      teacher: 'warning',
      enterprise: 'primary'
    } as const;

    const labels = {
      free: 'Gratuit',
      premium: 'Premium',
      family: 'Famille',
      teacher: 'Enseignant',
      enterprise: 'Entreprise'
    };

    return (
      <Badge variant={variants[subscription as keyof typeof variants] || 'secondary'}>
        {labels[subscription as keyof typeof labels] || subscription}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlusIcon className="w-4 h-4" />
          <span>Nouvel utilisateur</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="teacher">Enseignant</option>
            <option value="learner">Apprenant</option>
            <option value="guest">Invité</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
          </select>

          {/* Advanced Filters */}
          <Button variant="outline" className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>Filtres avancés</span>
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Abonnement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSubscriptionBadge(user.subscription)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Voir les détails"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditRole(user)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Modifier le rôle"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Aucun utilisateur enregistré.'}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-300">
                      {selectedUser.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser.displayName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Informations générales
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Rôle:</span>
                          {getRoleBadge(selectedUser.role)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Abonnement:</span>
                          {getSubscriptionBadge(selectedUser.subscription)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Niveau:</span>
                          <span className="font-medium">{selectedUser.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">XP:</span>
                          <span className="font-medium">{selectedUser.xp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Pièces:</span>
                          <span className="font-medium">{selectedUser.coins}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Activité
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Sessions totales:</span>
                          <span className="font-medium">{selectedUser.totalSessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Contenu créé:</span>
                          <span className="font-medium">{selectedUser.contentCreated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Signalements:</span>
                          <span className="font-medium">{selectedUser.reportsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Inscrit le:</span>
                          <span className="font-medium">{selectedUser.createdAtFormatted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Dernière connexion:</span>
                          <span className="font-medium">{selectedUser.lastLoginFormatted}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Activity */}
                  {userActivity && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Activité récente
                      </h3>
                      <div className="space-y-3">
                        {userActivity.activities.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex-shrink-0">
                              {activity.type === 'login' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                              {activity.type === 'logout' && <XMarkIcon className="w-5 h-5 text-gray-600" />}
                              {activity.type === 'lesson_completed' && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                              {activity.type === 'achievement_earned' && <ShieldCheckIcon className="w-5 h-5 text-yellow-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.type === 'login' && 'Connexion'}
                                {activity.type === 'logout' && 'Déconnexion'}
                                {activity.type === 'lesson_completed' && 'Leçon terminée'}
                                {activity.type === 'achievement_earned' && 'Succès débloqué'}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {activity.timestamp.toLocaleString('fr-FR')}
                              </p>
                              {activity.ipAddress && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  IP: {activity.ipAddress}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowUserDetails(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setShowUserDetails(false);
                    handleEditRole(selectedUser);
                  }}
                >
                  Modifier le rôle
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Edit Modal */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Modifier le rôle
                </h2>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Utilisateur: <strong>{selectedUser.displayName}</strong>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Rôle actuel: {getRoleBadge(selectedUser.role)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau rôle
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="guest">Invité</option>
                    <option value="learner">Apprenant</option>
                    <option value="teacher">Enseignant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {newRole === 'admin' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          Attention
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          L'attribution du rôle administrateur donne un accès complet au système.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowRoleModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleUpdateRole}
                  disabled={newRole === selectedUser.role}
                >
                  Mettre à jour
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};