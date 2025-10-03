import React, { useState, useEffect } from 'react';
import { useCommunityStore, LanguageExchange } from '../store/communityStore';
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

const LanguageExchangeList: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { user } = useAuthStore();
  
  const {
    exchanges: languageExchanges,
    loading,
    error,
    fetchExchanges: fetchLanguageExchanges,
    createExchange: createLanguageExchange,
    joinExchange: joinLanguageExchange,
    leaveExchange: leaveLanguageExchange
  } = useCommunityStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    languageOffered: '',
    languageWanted: '',
    level: '',
    format: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchLanguageExchanges();
  }, [fetchLanguageExchanges]);

  const handleCreateExchange = async (exchangeData: Partial<LanguageExchange>) => {
    if (!user) {
      showError('Vous devez être connecté pour créer un échange');
      return;
    }

    try {
      await createLanguageExchange(exchangeData as any);
      setIsCreateModalOpen(false);
      showSuccess('Échange linguistique créé avec succès');
    } catch (error) {
      showError('Erreur lors de la création de l\'échange');
    }
  };

  const handleJoinExchange = async (exchangeId: string) => {
    if (!user) {
      showError('Vous devez être connecté pour rejoindre un échange');
      return;
    }

    try {
      await joinLanguageExchange(exchangeId, user.id);
      showSuccess('Vous avez rejoint l\'échange avec succès');
    } catch (error) {
      showError('Erreur lors de l\'adhésion à l\'échange');
    }
  };

  const handleLeaveExchange = async (exchangeId: string) => {
    if (!user) return;

    try {
      await leaveLanguageExchange(exchangeId, user.id);
      showSuccess('Vous avez quitté l\'échange');
    } catch (error) {
      showError('Erreur lors du départ de l\'échange');
    }
  };

  const filteredExchanges = languageExchanges.filter(exchange => {
    const matchesLanguageOffered = !filters.languageOffered || 
      exchange.nativeLanguage.toLowerCase().includes(filters.languageOffered.toLowerCase());
    const matchesLanguageWanted = !filters.languageWanted || 
      exchange.targetLanguage.toLowerCase().includes(filters.languageWanted.toLowerCase());
    const matchesLevel = !filters.level || exchange.level === filters.level;
    const matchesFormat = !filters.format || exchange.format === filters.format;
    const matchesSearch = !filters.searchTerm || 
      exchange.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      exchange.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesLanguageOffered && matchesLanguageWanted && matchesLevel && 
           matchesFormat && matchesSearch;
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
      native: 'Natif'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getFormatLabel = (format: string): string => {
    const labels = {
      video: 'Vidéo',
      audio: 'Audio',
      text: 'Texte',
      in_person: 'En personne'
    };
    return labels[format as keyof typeof labels] || format;
  };

  const getFormatIcon = (format: string): string => {
    const icons = {
      video: '📹',
      audio: '🎙️',
      text: '💬',
      in_person: '👥'
    };
    return icons[format as keyof typeof icons] || '💬';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des échanges...</span>
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
            Impossible de charger les échanges linguistiques.
          </p>
          <Button onClick={() => fetchLanguageExchanges()}>
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
          <h1 className="text-3xl font-bold text-gray-900">Échanges Linguistiques</h1>
          <p className="text-gray-600 mt-2">
            Trouvez des partenaires pour pratiquer les langues camerounaises
          </p>
        </div>
        
        {user && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + Créer un échange
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Rechercher..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            
            <Input
              placeholder="Langue offerte"
              value={filters.languageOffered}
              onChange={(e) => setFilters(prev => ({ ...prev, languageOffered: e.target.value }))}
            />
            
            <Input
              placeholder="Langue recherchée"
              value={filters.languageWanted}
              onChange={(e) => setFilters(prev => ({ ...prev, languageWanted: e.target.value }))}
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
              <option value="native">Natif</option>
            </select>
            
            <select
              value={filters.format}
              onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous formats</option>
              <option value="video">Vidéo</option>
              <option value="audio">Audio</option>
              <option value="text">Texte</option>
              <option value="in_person">En personne</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {languageExchanges.length}
            </div>
            <p className="text-gray-600">Échanges actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {languageExchanges.filter(e => e.participants.length > 1).length}
            </div>
            <p className="text-gray-600">Échanges en cours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {new Set(languageExchanges.map(e => e.nativeLanguage)).size}
            </div>
            <p className="text-gray-600">Langues disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {languageExchanges.reduce((acc, e) => acc + e.participants.length, 0)}
            </div>
            <p className="text-gray-600">Participants totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Exchange List */}
      {filteredExchanges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun échange trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {languageExchanges.length === 0 
                ? "Aucun échange linguistique n'est disponible pour le moment."
                : "Aucun échange ne correspond à vos critères de recherche."
              }
            </p>
            {user && languageExchanges.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Créer le premier échange
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExchanges.map(exchange => (
            <ExchangeCard
              key={exchange.id}
              exchange={exchange}
              currentUserId={user?.id}
              onJoin={() => handleJoinExchange(exchange.id)}
              onLeave={() => handleLeaveExchange(exchange.id)}
              formatRelativeTime={formatRelativeTime}
              getLevelLabel={getLevelLabel}
              getFormatLabel={getFormatLabel}
              getFormatIcon={getFormatIcon}
            />
          ))}
        </div>
      )}

      {/* Create Exchange Modal */}
      <CreateExchangeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExchange}
      />
    </div>
  );
};

interface ExchangeCardProps {
  exchange: LanguageExchange;
  currentUserId?: string;
  onJoin: () => void;
  onLeave: () => void;
  formatRelativeTime: (date: Date) => string;
  getLevelLabel: (level: string) => string;
  getFormatLabel: (format: string) => string;
  getFormatIcon: (format: string) => string;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  exchange,
  currentUserId,
  onJoin,
  onLeave,
  formatRelativeTime,
  getLevelLabel,
  getFormatLabel,
  getFormatIcon
}) => {
  const isParticipant = currentUserId ? exchange.participants.includes(currentUserId) : false;
  const isCreator = currentUserId === exchange.hostId;
  const canJoin = currentUserId && !isParticipant && exchange.participants.length < exchange.maxParticipants;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{exchange.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="info" size="sm">
                {exchange.nativeLanguage} → {exchange.targetLanguage}
              </Badge>
              <Badge variant="secondary" size="sm">
                {getLevelLabel(exchange.level)}
              </Badge>
            </div>
          </div>
          <div className="text-2xl">
            {getFormatIcon(exchange.format)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {exchange.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Format: {getFormatLabel(exchange.format)}</span>
            <span>{exchange.participants.length}/{exchange.maxParticipants} participants</span>
          </div>

            {exchange.scheduledAt && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Horaires:</span> {exchange.scheduledAt.toLocaleString()}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Créé par {exchange.host.displayName}</span>
            <span>{formatRelativeTime(exchange.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t">
            {isCreator ? (
              <Badge variant="success" size="sm" className="w-full justify-center">
                ✨ Votre échange
              </Badge>
            ) : isParticipant ? (
              <div className="space-y-2">
                <Badge variant="info" size="sm" className="w-full justify-center">
                  👥 Participant
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLeave}
                  className="w-full"
                >
                  Quitter l'échange
                </Button>
              </div>
            ) : canJoin ? (
              <Button
                onClick={onJoin}
                className="w-full"
                size="sm"
              >
                Rejoindre l'échange
              </Button>
            ) : exchange.participants.length >= exchange.maxParticipants ? (
              <Badge variant="secondary" size="sm" className="w-full justify-center">
                🔒 Complet
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

interface CreateExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LanguageExchange>) => void;
}

const CreateExchangeModal: React.FC<CreateExchangeModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    languageOffered: '',
    languageWanted: '',
    level: 'beginner',
    format: 'video',
    maxParticipants: 4,
    schedule: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      hostId: user?.id || 'anonymous',
      nativeLanguage: formData.languageOffered,
      targetLanguage: formData.languageWanted,
      level: formData.level as 'beginner' | 'intermediate' | 'advanced',
      format: formData.format as 'text' | 'voice' | 'video',
      duration: 60,
      maxParticipants: formData.maxParticipants,
      tags: []
    });
    setFormData({
      title: '',
      description: '',
      languageOffered: '',
      languageWanted: '',
      level: 'beginner',
      format: 'video',
      maxParticipants: 4,
      schedule: ''
    });
  };

  const languages = [
    'Français', 'Anglais', 'Ewondo', 'Fulfulde', 'Duala', 'Bamileke', 'Bassa', 
    'Beti', 'Gbaya', 'Mandara', 'Kanuri', 'Kotoko', 'Masa', 'Mundang'
  ];

  return (
    <Modal open={isOpen} onClose={onClose} title="Créer un échange linguistique">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre de l'échange"
          placeholder="Ex: Échange Français-Ewondo pour débutants"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <textarea
          placeholder="Décrivez votre échange, vos objectifs et ce que vous proposez..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langue que vous offrez
            </label>
            <select
              value={formData.languageOffered}
              onChange={(e) => setFormData(prev => ({ ...prev, languageOffered: e.target.value }))}
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
              Langue que vous cherchez
            </label>
            <select
              value={formData.languageWanted}
              onChange={(e) => setFormData(prev => ({ ...prev, languageWanted: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une langue</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau requis
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="native">Natif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format d'échange
            </label>
            <select
              value={formData.format}
              onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">📹 Vidéo</option>
              <option value="audio">🎙️ Audio</option>
              <option value="text">💬 Texte</option>
              <option value="in_person">👥 En personne</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre max de participants
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.maxParticipants}
              onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            label="Horaires préférés (optionnel)"
            placeholder="Ex: Lundi et mercredi 19h-20h"
            value={formData.schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Créer l'échange
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { LanguageExchangeList };