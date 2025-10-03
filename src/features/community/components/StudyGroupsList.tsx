import React, { useState, useEffect } from 'react';
import { useCommunityStore, StudyGroup } from '../store/communityStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Input, 
  Badge,
  Spinner,
  Modal,
  useToastActions 
} from '@/shared/components/ui';

const StudyGroupsList: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { user } = useAuthStore();
  
  const {
    studyGroups,
    loading,
    error,
    fetchStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup
  } = useCommunityStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    level: '',
    maxMembers: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchStudyGroups();
  }, [fetchStudyGroups]);

  const handleCreateGroup = async (groupData: Partial<StudyGroup>) => {
    if (!user) {
      showError('Vous devez être connecté pour créer un groupe');
      return;
    }

    try {
      await createStudyGroup(groupData as any);
      setIsCreateModalOpen(false);
      showSuccess('Groupe d\'étude créé avec succès');
    } catch (error) {
      showError('Erreur lors de la création du groupe');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      showError('Vous devez être connecté pour rejoindre un groupe');
      return;
    }

    try {
      await joinStudyGroup(groupId, user.id);
      showSuccess('Vous avez rejoint le groupe avec succès');
    } catch (error) {
      showError('Erreur lors de l\'adhésion au groupe');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      await leaveStudyGroup(groupId, user.id);
      showSuccess('Vous avez quitté le groupe');
    } catch (error) {
      showError('Erreur lors du départ du groupe');
    }
  };

  const handleScheduleSession = async (
    groupId: string, 
    title: string, 
    description: string, 
    date: Date,
    meetingUrl?: string
  ) => {
    if (!user) {
      showError('Vous devez être connecté pour programmer une session');
      return;
    }

    try {
      // TODO: Implement scheduleSession function
      console.log('Scheduling session:', { groupId, title, description, date, meetingUrl });
      setIsSessionModalOpen(false);
      setSelectedGroup(null);
      showSuccess('Session programmée avec succès');
    } catch (error) {
      showError('Erreur lors de la programmation de la session');
    }
  };

  const handleShareResource = async (
    groupId: string,
    title: string,
    description: string,
    url: string,
    type: string
  ) => {
    if (!user) {
      showError('Vous devez être connecté pour partager une ressource');
      return;
    }

    try {
      // TODO: Implement shareResource function
      console.log('Sharing resource:', { groupId, title, description, url, type });
      setIsResourceModalOpen(false);
      setSelectedGroup(null);
      showSuccess('Ressource partagée avec succès');
    } catch (error) {
      showError('Erreur lors du partage de la ressource');
    }
  };

  const filteredGroups = studyGroups.filter(group => {
    const matchesLanguage = !filters.language || group.languageId === filters.language;
    const matchesLevel = !filters.level || group.level === filters.level;
    const matchesMaxMembers = !filters.maxMembers || 
      group.members.length <= parseInt(filters.maxMembers);
    const matchesSearch = !filters.searchTerm || 
      group.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesLanguage && matchesLevel && matchesMaxMembers && matchesSearch;
  });

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

  const getLevelLabel = (level: string): string => {
    const labels = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      mixed: 'Mixte'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getUpcomingSession = (group: StudyGroup) => {
    const now = new Date();
    return group.schedules
      .filter(session => session.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des groupes...</span>
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
          <p className="text-gray-600 mb-6">
            Impossible de charger les groupes d'étude.
          </p>
          <Button onClick={() => fetchStudyGroups()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groupes d'Étude</h1>
          <p className="text-gray-600 mt-2">
            Rejoignez des groupes pour apprendre ensemble les langues camerounaises
          </p>
        </div>
        
        {user && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + Créer un groupe
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher un groupe..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            
            <Input
              placeholder="Langue"
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
            />
            
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="mixed">Mixte</option>
            </select>
            
            <Input
              type="number"
              placeholder="Max membres"
              value={filters.maxMembers}
              onChange={(e) => setFilters(prev => ({ ...prev, maxMembers: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {studyGroups.length}
            </div>
            <p className="text-gray-600">Groupes actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {studyGroups.reduce((acc, g) => acc + g.members.length, 0)}
            </div>
            <p className="text-gray-600">Membres totaux</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {studyGroups.reduce((acc, g) => acc + g.schedules.length, 0)}
            </div>
            <p className="text-gray-600">Sessions programmées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {studyGroups.reduce((acc, g) => acc + g.resources.length, 0)}
            </div>
            <p className="text-gray-600">Ressources partagées</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun groupe trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {studyGroups.length === 0 
                ? "Aucun groupe d'étude n'est disponible pour le moment."
                : "Aucun groupe ne correspond à vos critères de recherche."
              }
            </p>
            {user && studyGroups.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Créer le premier groupe
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              currentUserId={user?.id}
              onJoin={() => handleJoinGroup(group.id)}
              onLeave={() => handleLeaveGroup(group.id)}
              onScheduleSession={() => {
                setSelectedGroup(group);
                setIsSessionModalOpen(true);
              }}
              onShareResource={() => {
                setSelectedGroup(group);
                setIsResourceModalOpen(true);
              }}
              formatRelativeTime={formatRelativeTime}
              getLevelLabel={getLevelLabel}
              getUpcomingSession={getUpcomingSession}
            />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

      {/* Schedule Session Modal */}
      {selectedGroup && (
        <ScheduleSessionModal
          open={isSessionModalOpen}
          onClose={() => {
            setIsSessionModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onSubmit={(title, description, date, meetingUrl) => 
            handleScheduleSession(selectedGroup.id, title, description, date, meetingUrl)
          }
        />
      )}

      {/* Share Resource Modal */}
      {selectedGroup && (
        <ShareResourceModal
          open={isResourceModalOpen}
          onClose={() => {
            setIsResourceModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onSubmit={(title, description, url, type) => 
            handleShareResource(selectedGroup.id, title, description, url, type)
          }
        />
      )}
    </div>
  );
};

interface GroupCardProps {
  group: StudyGroup;
  currentUserId?: string;
  onJoin: () => void;
  onLeave: () => void;
  onScheduleSession: () => void;
  onShareResource: () => void;
  formatRelativeTime: (date: Date) => string;
  getLevelLabel: (level: string) => string;
  getUpcomingSession: (group: StudyGroup) => StudyGroup['schedules'][0] | undefined;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  currentUserId,
  onJoin,
  onLeave,
  onScheduleSession,
  onShareResource,
  formatRelativeTime,
  getLevelLabel,
  getUpcomingSession
}) => {
  const isMember = currentUserId ? group.members.includes(currentUserId) : false;
  const isCreator = currentUserId === group.createdBy;
  const canJoin = currentUserId && !isMember && group.members.length < group.maxMembers;
  const upcomingSession = getUpcomingSession(group);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="info" size="sm">
                {group.languageId}
              </Badge>
              <Badge variant="secondary" size="sm">
                {getLevelLabel(group.level)}
              </Badge>
              {group.isPrivate && (
                <Badge variant="secondary" size="sm">
                  🔒 Privé
                </Badge>
              )}
            </div>
          </div>
          <div className="text-2xl">
            📚
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {group.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>👥 {group.members.length}/{group.maxMembers} membres</span>
            <span>📅 {group.schedules.length} sessions</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>📚 {group.resources.length} ressources</span>
            <span>⏰ {formatRelativeTime(group.createdAt)}</span>
          </div>

          {upcomingSession && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Prochaine session:
              </div>
              <div className="text-sm text-blue-800">
                {upcomingSession.title}
              </div>
              <div className="text-xs text-blue-600">
                {upcomingSession.startTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}

          {group.schedules && group.schedules.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Horaires:</span> {group.schedules.length} programmés
            </div>
          )}

          <div className="text-sm text-gray-500">
            Créé par {group.createdBy}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t space-y-2">
            {isCreator ? (
              <div className="space-y-2">
                <Badge variant="success" size="sm" className="w-full justify-center">
                  ✨ Votre groupe
                </Badge>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onScheduleSession}
                  >
                    📅 Session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShareResource}
                  >
                    📚 Ressource
                  </Button>
                </div>
              </div>
            ) : isMember ? (
              <div className="space-y-2">
                <Badge variant="info" size="sm" className="w-full justify-center">
                  👥 Membre
                </Badge>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShareResource}
                  >
                    📚 Ressource
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLeave}
                  >
                    Quitter
                  </Button>
                </div>
              </div>
            ) : canJoin ? (
              <Button
                onClick={onJoin}
                className="w-full"
                size="sm"
              >
                Rejoindre le groupe
              </Button>
            ) : group.members.length >= group.maxMembers ? (
              <Badge variant="secondary" size="sm" className="w-full justify-center">
                🔒 Complet
              </Badge>
            ) : group.isPrivate ? (
              <Badge variant="secondary" size="sm" className="w-full justify-center">
                🔒 Groupe privé
              </Badge>
            ) : (
              <Badge variant="secondary" size="sm" className="w-full justify-center">
                🔒 Connexion requise
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<StudyGroup>) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    level: 'beginner',
    maxMembers: 10,
    schedule: '',
    isPrivate: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      languageId: formData.language,
      level: formData.level as 'beginner' | 'intermediate' | 'advanced',
      createdBy: user?.id || '',
      moderators: [],
      maxMembers: formData.maxMembers,
      isPrivate: formData.isPrivate,
      schedules: [],
      resources: []
    });
    setFormData({
      name: '',
      description: '',
      language: '',
      level: 'beginner',
      maxMembers: 10,
      schedule: '',
      isPrivate: false
    });
  };

  const languages = [
    'Français', 'Anglais', 'Ewondo', 'Fulfulde', 'Duala', 'Bamileke', 'Bassa'
  ];

  return (
    <Modal open={open} onClose={onClose} title="Créer un groupe d'étude">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du groupe"
          placeholder="Ex: Groupe d'étude Ewondo débutants"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <textarea
          placeholder="Décrivez les objectifs du groupe et les activités prévues..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langue d'étude
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une langue</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau du groupe
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="mixed">Mixte</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre max de membres
            </label>
            <input
              type="number"
              min="2"
              max="50"
              value={formData.maxMembers}
              onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            label="Horaires des sessions (optionnel)"
            placeholder="Ex: Mardi et jeudi 20h-21h"
            value={formData.schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
            Groupe privé (invitation uniquement)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le groupe
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface ScheduleSessionModalProps {
  open: boolean;
  onClose: () => void;
  group: StudyGroup;
  onSubmit: (title: string, description: string, date: Date, meetingUrl?: string) => void;
}

const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  open,
  onClose,
  group,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    meetingUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionDate = new Date(`${formData.date}T${formData.time}`);
    onSubmit(
      formData.title,
      formData.description,
      sessionDate,
      formData.meetingUrl || undefined
    );
    
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      meetingUrl: ''
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Programmer une session - ${group.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre de la session"
          placeholder="Ex: Révision du vocabulaire Ewondo"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <textarea
          placeholder="Décrivez le contenu et les objectifs de la session..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <Input
            type="time"
            label="Heure"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Lien de réunion (optionnel)"
          placeholder="URL Zoom, Meet, etc."
          value={formData.meetingUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, meetingUrl: e.target.value }))}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Programmer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface ShareResourceModalProps {
  open: boolean;
  onClose: () => void;
  group: StudyGroup;
  onSubmit: (title: string, description: string, url: string, type: string) => void;
}

const ShareResourceModal: React.FC<ShareResourceModalProps> = ({
  open,
  onClose,
  group,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'document'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.title, formData.description, formData.url, formData.type);
    setFormData({
      title: '',
      description: '',
      url: '',
      type: 'document'
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Partager une ressource - ${group.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre de la ressource"
          placeholder="Ex: Guide de prononciation Ewondo"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <textarea
          placeholder="Décrivez cette ressource et son utilité pour le groupe..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <Input
          label="URL de la ressource"
          placeholder="https://..."
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de ressource
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="document">📄 Document</option>
            <option value="video">📹 Vidéo</option>
            <option value="audio">🎵 Audio</option>
            <option value="exercise">📝 Exercice</option>
            <option value="tool">🔧 Outil</option>
            <option value="other">🔗 Autre</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Partager
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { StudyGroupsList };