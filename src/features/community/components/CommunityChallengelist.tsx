import React, { useState, useEffect } from 'react';
import { useCommunityStore, CommunityChallenge } from '../store/communityStore';
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

const CommunityChallengelist: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { user } = useAuthStore();
  
  const {
    challenges,
    loading,
    error,
    fetchChallenges,
    createChallenge,
    joinChallenge,
    leaveChallenge,
    submitChallengeEntry,
    voteOnEntry
  } = useCommunityStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    difficulty: '',
    language: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleCreateChallenge = async (challengeData: Partial<CommunityChallenge>) => {
    if (!user) {
      showError('Vous devez être connecté pour créer un défi');
      return;
    }

    try {
      await createChallenge(challengeData);
      setIsCreateModalOpen(false);
      showSuccess('Défi créé avec succès');
    } catch (error) {
      showError('Erreur lors de la création du défi');
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      showError('Vous devez être connecté pour rejoindre un défi');
      return;
    }

    try {
      await joinChallenge(challengeId, user.id);
      showSuccess('Vous avez rejoint le défi avec succès');
    } catch (error) {
      showError('Erreur lors de l\'adhésion au défi');
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      await leaveChallenge(challengeId, user.id);
      showSuccess('Vous avez quitté le défi');
    } catch (error) {
      showError('Erreur lors du départ du défi');
    }
  };

  const handleSubmitEntry = async (challengeId: string, content: string, mediaUrl?: string) => {
    if (!user) {
      showError('Vous devez être connecté pour soumettre une entrée');
      return;
    }

    try {
      await submitChallengeEntry(challengeId, {
        content,
        mediaUrl,
        authorId: user.id
      });
      setIsSubmissionModalOpen(false);
      setSelectedChallenge(null);
      showSuccess('Soumission envoyée avec succès');
    } catch (error) {
      showError('Erreur lors de la soumission');
    }
  };

  const handleVote = async (entryId: string, voteType: 'up' | 'down') => {
    if (!user) {
      showError('Vous devez être connecté pour voter');
      return;
    }

    try {
      await voteOnEntry(entryId, user.id, voteType);
    } catch (error) {
      showError('Erreur lors du vote');
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesStatus = !filters.status || challenge.status === filters.status;
    const matchesDifficulty = !filters.difficulty || challenge.difficulty === filters.difficulty;
    const matchesLanguage = !filters.language || challenge.language === filters.language;
    const matchesSearch = !filters.searchTerm || 
      challenge.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesStatus && matchesDifficulty && matchesLanguage && matchesSearch;
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

  const getStatusLabel = (status: string): string => {
    const labels = {
      active: 'Actif',
      upcoming: 'À venir',
      completed: 'Terminé',
      voting: 'Vote en cours'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      voting: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (difficulty: string): string => {
    const labels = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des défis...</span>
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
            Impossible de charger les défis communautaires.
          </p>
          <Button onClick={() => fetchChallenges()}>
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
          <h1 className="text-3xl font-bold text-gray-900">Défis Communautaires</h1>
          <p className="text-gray-600 mt-2">
            Participez aux défis linguistiques et montrez vos compétences
          </p>
        </div>
        
        {user && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + Créer un défi
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
              placeholder="Rechercher un défi..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="upcoming">À venir</option>
              <option value="voting">Vote en cours</option>
              <option value="completed">Terminé</option>
            </select>
            
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes difficultés</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
            
            <Input
              placeholder="Langue"
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {challenges.filter(c => c.status === 'active').length}
            </div>
            <p className="text-gray-600">Défis actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {challenges.reduce((acc, c) => acc + c.participants.length, 0)}
            </div>
            <p className="text-gray-600">Participants totaux</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {challenges.reduce((acc, c) => acc + c.entries.length, 0)}
            </div>
            <p className="text-gray-600">Soumissions totales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {challenges.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-gray-600">Défis terminés</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenge List */}
      {filteredChallenges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun défi trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {challenges.length === 0 
                ? "Aucun défi communautaire n'est disponible pour le moment."
                : "Aucun défi ne correspond à vos critères de recherche."
              }
            </p>
            {user && challenges.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Créer le premier défi
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              currentUserId={user?.id}
              onJoin={() => handleJoinChallenge(challenge.id)}
              onLeave={() => handleLeaveChallenge(challenge.id)}
              onSubmit={() => {
                setSelectedChallenge(challenge);
                setIsSubmissionModalOpen(true);
              }}
              onVote={handleVote}
              formatRelativeTime={formatRelativeTime}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
              getDifficultyLabel={getDifficultyLabel}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>
      )}

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChallenge}
      />

      {/* Submission Modal */}
      {selectedChallenge && (
        <SubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => {
            setIsSubmissionModalOpen(false);
            setSelectedChallenge(null);
          }}
          challenge={selectedChallenge}
          onSubmit={(content, mediaUrl) => handleSubmitEntry(selectedChallenge.id, content, mediaUrl)}
        />
      )}
    </div>
  );
};

interface ChallengeCardProps {
  challenge: CommunityChallenge;
  currentUserId?: string;
  onJoin: () => void;
  onLeave: () => void;
  onSubmit: () => void;
  onVote: (entryId: string, voteType: 'up' | 'down') => void;
  formatRelativeTime: (date: Date) => string;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
  getDifficultyColor: (difficulty: string) => string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  currentUserId,
  onJoin,
  onLeave,
  onSubmit,
  formatRelativeTime,
  getStatusLabel,
  getStatusColor,
  getDifficultyLabel,
  getDifficultyColor
}) => {
  const isParticipant = currentUserId ? challenge.participants.includes(currentUserId) : false;
  const isCreator = currentUserId === challenge.creatorId;
  const hasSubmitted = currentUserId ? challenge.entries.some(e => e.authorId === currentUserId) : false;
  const canSubmit = isParticipant && challenge.status === 'active' && !hasSubmitted;
  const timeLeft = challenge.endDate ? Math.max(0, challenge.endDate.getTime() - Date.now()) : 0;
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{challenge.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge 
                variant="secondary" 
                size="sm"
                className={getStatusColor(challenge.status)}
              >
                {getStatusLabel(challenge.status)}
              </Badge>
              <Badge 
                variant="secondary" 
                size="sm"
                className={getDifficultyColor(challenge.difficulty)}
              >
                {getDifficultyLabel(challenge.difficulty)}
              </Badge>
              <Badge variant="info" size="sm">
                {challenge.language}
              </Badge>
            </div>
          </div>
          <div className="text-2xl">
            🏆
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {challenge.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>👥 {challenge.participants.length} participants</span>
            <span>📝 {challenge.entries.length} soumissions</span>
          </div>

          {challenge.endDate && (
            <div className="text-sm text-gray-600">
              {daysLeft > 0 ? (
                <span className="text-orange-600 font-medium">
                  ⏰ {daysLeft} jour(s) restant(s)
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ⏰ Terminé
                </span>
              )}
            </div>
          )}

          {challenge.reward && (
            <div className="text-sm text-purple-600 font-medium">
              🎁 Récompense: {challenge.reward}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Créé par {challenge.creator.displayName}</span>
            <span>{formatRelativeTime(challenge.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t space-y-2">
            {isCreator ? (
              <Badge variant="success" size="sm" className="w-full justify-center">
                ✨ Votre défi
              </Badge>
            ) : isParticipant ? (
              <div className="space-y-2">
                <Badge variant="info" size="sm" className="w-full justify-center">
                  👥 Participant
                </Badge>
                
                {canSubmit && (
                  <Button
                    onClick={onSubmit}
                    className="w-full"
                    size="sm"
                  >
                    📤 Soumettre votre entrée
                  </Button>
                )}
                
                {hasSubmitted && (
                  <Badge variant="success" size="sm" className="w-full justify-center">
                    ✅ Entrée soumise
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLeave}
                  className="w-full"
                >
                  Quitter le défi
                </Button>
              </div>
            ) : currentUserId ? (
              <Button
                onClick={onJoin}
                className="w-full"
                size="sm"
                disabled={challenge.status !== 'active'}
              >
                Rejoindre le défi
              </Button>
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

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CommunityChallenge>) => void;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    difficulty: 'easy',
    duration: 7,
    reward: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + formData.duration);
    
    onSubmit({
      ...formData,
      endDate
    });
    
    setFormData({
      title: '',
      description: '',
      language: '',
      difficulty: 'easy',
      duration: 7,
      reward: ''
    });
  };

  const languages = [
    'Français', 'Anglais', 'Ewondo', 'Fulfulde', 'Duala', 'Bamileke', 'Bassa'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un nouveau défi">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre du défi"
          placeholder="Ex: Défi de prononciation Ewondo"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <textarea
          placeholder="Décrivez le défi, les règles et les critères d'évaluation..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langue
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
              Difficulté
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée (jours)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            label="Récompense (optionnel)"
            placeholder="Ex: Badge spécial, points"
            value={formData.reward}
            onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le défi
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: CommunityChallenge;
  onSubmit: (content: string, mediaUrl?: string) => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onSubmit
}) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, mediaUrl || undefined);
    setContent('');
    setMediaUrl('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Soumettre votre entrée - ${challenge.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Description du défi:</h4>
          <p className="text-blue-800 text-sm">{challenge.description}</p>
        </div>

        <textarea
          placeholder="Décrivez votre soumission, votre approche et vos résultats..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <Input
          label="URL média (optionnel)"
          placeholder="Lien vers votre audio, vidéo ou image"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Soumettre
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { CommunityChallengelist };