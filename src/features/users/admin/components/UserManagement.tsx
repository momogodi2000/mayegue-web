import React, { useState, useEffect } from 'react';
import { useAdminStore, AdminUser } from '../store/adminStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Spinner,
  Input,
  Modal,
  useToastActions 
} from '@/shared/components/ui';

const UserManagement: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    updateUserRole, 
    updateUserStatus, 
    deleteUser,
    clearError 
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt'
  });

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      user.displayName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'lastActive') {
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
    if (filters.sortBy === 'displayName') {
      return a.displayName.localeCompare(b.displayName);
    }
    return 0;
  });

  const handleRoleUpdate = async (userId: string, newRole: AdminUser['role']) => {
    try {
      await updateUserRole(userId, newRole);
      showSuccess(`Rôle mis à jour vers ${newRole}`);
    } catch (error) {
      showError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleStatusUpdate = async (userId: string, newStatus: AdminUser['status']) => {
    try {
      await updateUserStatus(userId, newStatus);
      showSuccess(`Statut mis à jour vers ${newStatus}`);
    } catch (error) {
      showError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !deleteReason.trim()) return;

    try {
      await deleteUser(selectedUser.id, deleteReason);
      showSuccess('Utilisateur supprimé avec succès');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setDeleteReason('');
    } catch (error) {
      showError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getRoleLabel = (role: string): string => {
    const labels = {
      admin: 'Administrateur',
      moderator: 'Modérateur',
      user: 'Utilisateur'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      active: 'Actif',
      suspended: 'Suspendu',
      banned: 'Banni'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getRoleColor = (role: string): string => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-yellow-100 text-yellow-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-orange-100 text-orange-800',
      banned: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des utilisateurs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={clearError}>Réessayer</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez les comptes utilisateurs, rôles et permissions
          </p>
        </div>
        
        <Button onClick={fetchUsers} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Actualisation...
            </>
          ) : (
            '🔄 Actualiser'
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="moderator">Modérateur</option>
              <option value="user">Utilisateur</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="banned">Banni</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date de création</option>
              <option value="lastActive">Dernière activité</option>
              <option value="displayName">Nom</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {users.length}
            </div>
            <p className="text-gray-600">Total utilisateurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-gray-600">Utilisateurs actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {users.filter(u => u.role === 'moderator').length}
            </div>
            <p className="text-gray-600">Modérateurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-gray-600">Administrateurs</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Rôle</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Activité</th>
                  <th className="text-left py-3 px-4">Progression</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {user.displayName[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value as AdminUser['role'])}
                        className={`px-2 py-1 rounded text-sm font-medium border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">Utilisateur</option>
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    
                    <td className="py-3 px-4">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusUpdate(user.id, e.target.value as AdminUser['status'])}
                        className={`px-2 py-1 rounded text-sm font-medium border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Actif</option>
                        <option value="suspended">Suspendu</option>
                        <option value="banned">Banni</option>
                      </select>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>Créé: {formatRelativeTime(user.createdAt)}</div>
                        <div className="text-gray-500">Actif: {formatRelativeTime(user.lastActive)}</div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>🎓 {user.learningProgress.lessonsCompleted} leçons</div>
                        <div className="text-gray-500">
                          ⏱️ {Math.round(user.learningProgress.totalTimeSpent / 60)}h
                        </div>
                        <div className="text-gray-500">
                          💬 {user.communityActivity.reputation} points
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          ✏️ Modifier
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          🗑️ Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé avec ces critères
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Modifier l'utilisateur"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {selectedUser.displayName[0].toUpperCase()}
              </div>
              <h3 className="text-lg font-semibold">{selectedUser.displayName}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <Badge className={getRoleColor(selectedUser.role)}>
                  {getRoleLabel(selectedUser.role)}
                </Badge>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <Badge className={getStatusColor(selectedUser.status)}>
                  {getStatusLabel(selectedUser.status)}
                </Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Statistiques d'apprentissage</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Leçons complétées:</span>
                  <span className="ml-2 font-medium">{selectedUser.learningProgress.lessonsCompleted}</span>
                </div>
                <div>
                  <span className="text-gray-600">Temps total:</span>
                  <span className="ml-2 font-medium">{Math.round(selectedUser.learningProgress.totalTimeSpent / 60)}h</span>
                </div>
                <div>
                  <span className="text-gray-600">Langues étudiées:</span>
                  <span className="ml-2 font-medium">{selectedUser.learningProgress.languagesStudied.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Niveau:</span>
                  <span className="ml-2 font-medium">{selectedUser.learningProgress.level}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Activité communautaire</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Discussions créées:</span>
                  <span className="ml-2 font-medium">{selectedUser.communityActivity.discussionsCreated}</span>
                </div>
                <div>
                  <span className="text-gray-600">Réponses postées:</span>
                  <span className="ml-2 font-medium">{selectedUser.communityActivity.repliesPosted}</span>
                </div>
                <div>
                  <span className="text-gray-600">Likes reçus:</span>
                  <span className="ml-2 font-medium">{selectedUser.communityActivity.likesReceived}</span>
                </div>
                <div>
                  <span className="text-gray-600">Réputation:</span>
                  <span className="ml-2 font-medium">{selectedUser.communityActivity.reputation}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
          setDeleteReason('');
        }}
        title="Supprimer l'utilisateur"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Supprimer l'utilisateur ?
              </h3>
              <p className="text-gray-600">
                Cette action est irréversible. Toutes les données de l'utilisateur 
                <strong> {selectedUser.displayName}</strong> seront définitivement supprimées.
              </p>
            </div>
            
            <textarea
              placeholder="Raison de la suppression (obligatoire)..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                  setDeleteReason('');
                }}
              >
                Annuler
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
                disabled={!deleteReason.trim()}
              >
                🗑️ Supprimer définitivement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;