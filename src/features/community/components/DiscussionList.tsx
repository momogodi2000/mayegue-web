import React, { useState, useEffect } from 'react';
import { useCommunityStore, Discussion, CommunityUser } from '../store/communityStore';
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
  useToastActions 
} from '@/shared/components/ui';

interface DiscussionListProps {
  languageId?: string;
  category?: string;
  onDiscussionClick: (discussion: Discussion) => void;
}

const DiscussionList: React.FC<DiscussionListProps> = ({
  languageId,
  category,
  onDiscussionClick
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { user } = useAuthStore();
  
  const {
    discussions,
    loading,
    error,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLanguage,
    fetchDiscussions,
    getFilteredDiscussions,
    toggleDiscussionLike
  } = useCommunityStore();

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDiscussions(languageId, category);
  }, [fetchDiscussions, languageId, category]);

  const filteredDiscussions = getFilteredDiscussions();

  const handleLike = async (discussionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showError('Vous devez être connecté pour aimer une discussion');
      return;
    }

    try {
      await toggleDiscussionLike(discussionId, user.id);
      showSuccess('Votre réaction a été enregistrée');
    } catch (error) {
      showError('Erreur lors de la mise à jour de votre réaction');
    }
  };

  const getCategoryLabel = (cat: string): string => {
    const labels = {
      general: 'Général',
      grammar: 'Grammaire',
      vocabulary: 'Vocabulaire',
      culture: 'Culture',
      practice: 'Pratique',
      resources: 'Ressources'
    };
    return labels[cat as keyof typeof labels] || cat;
  };

  const getCategoryColor = (cat: string): string => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      grammar: 'bg-blue-100 text-blue-800',
      vocabulary: 'bg-green-100 text-green-800',
      culture: 'bg-purple-100 text-purple-800',
      practice: 'bg-orange-100 text-orange-800',
      resources: 'bg-teal-100 text-teal-800'
    };
    return colors[cat as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  if (loading && discussions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des discussions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discussions communautaires</h2>
          <p className="text-gray-600 mt-1">
            Échangez avec la communauté d'apprenants
          </p>
        </div>
        
        {user && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="whitespace-nowrap"
          >
            + Nouvelle discussion
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <Input
                type="text"
                placeholder="Rechercher des discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                <option value="general">Général</option>
                <option value="grammar">Grammaire</option>
                <option value="vocabulary">Vocabulaire</option>
                <option value="culture">Culture</option>
                <option value="practice">Pratique</option>
                <option value="resources">Ressources</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              <select
                value={selectedLanguage || ''}
                onChange={(e) => setSelectedLanguage(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les langues</option>
                <option value="bamileke">Bamiléké</option>
                <option value="douala">Douala</option>
                <option value="ewondo">Ewondo</option>
                <option value="fulfulde">Fulfulde</option>
                <option value="bassa">Bassa</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-8">
            <div className="text-red-600 text-lg mb-2">
              ⚠️ Erreur de chargement
            </div>
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => fetchDiscussions()}
              className="mt-4"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDiscussions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune discussion trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Soyez le premier à démarrer une conversation dans cette catégorie !
            </p>
            {user && (
              <Button onClick={() => setShowCreateForm(true)}>
                Créer une discussion
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Discussions List */}
      {filteredDiscussions.length > 0 && (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onClick={() => onDiscussionClick(discussion)}
              onLike={(e) => handleLike(discussion.id, e)}
              isLiked={user ? discussion.likedBy.includes(user.id) : false}
              formatRelativeTime={formatRelativeTime}
              getCategoryLabel={getCategoryLabel}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}

      {/* Create Discussion Form */}
      {showCreateForm && (
        <CreateDiscussionForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            showSuccess('Discussion créée avec succès !');
          }}
        />
      )}
    </div>
  );
};

interface DiscussionCardProps {
  discussion: Discussion;
  onClick: () => void;
  onLike: (e: React.MouseEvent) => void;
  isLiked: boolean;
  formatRelativeTime: (date: Date) => string;
  getCategoryLabel: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  onClick,
  onLike,
  isLiked,
  formatRelativeTime,
  getCategoryLabel,
  getCategoryColor
}) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {discussion.isPinned && (
                  <Badge variant="secondary" size="sm">
                    📌 Épinglé
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  size="sm"
                  className={getCategoryColor(discussion.category)}
                >
                  {getCategoryLabel(discussion.category)}
                </Badge>
                <Badge variant="info" size="sm">
                  {discussion.languageId}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-500 flex items-center space-x-4">
                <span>👁️ {discussion.views}</span>
                <span>💬 {discussion.replies.length}</span>
              </div>
            </div>

            {/* Title and Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {discussion.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {discussion.content}
            </p>

            {/* Tags */}
            {discussion.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {discussion.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    #{tag}
                  </Badge>
                ))}
                {discussion.tags.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{discussion.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {discussion.author.displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {discussion.author.displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(discussion.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{isLiked ? '❤️' : '🤍'}</span>
                  <span>{discussion.likes}</span>
                </button>

                {discussion.isClosed && (
                  <Badge variant="secondary" size="sm">
                    🔒 Fermé
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CreateDiscussionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateDiscussionForm: React.FC<CreateDiscussionFormProps> = ({
  onClose,
  onSuccess
}) => {
  const { user } = useAuthStore();
  const { createDiscussion } = useCommunityStore();
  const { error: showError } = useToastActions();
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    languageId: string;
    category: 'general' | 'grammar' | 'vocabulary' | 'culture' | 'practice' | 'resources';
    tags: string[];
  }>({
    title: '',
    content: '',
    languageId: '',
    category: 'general',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('Vous devez être connecté pour créer une discussion');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock user data - in real app, this would come from user store
      const mockUser: CommunityUser = {
        id: user.id,
        displayName: user.displayName || user.email || 'Utilisateur',
        email: user.email || '',
        languagesLearning: [],
        languagesTeaching: [],
        level: 'beginner',
        joinedAt: new Date(),
        reputation: 0,
        badges: []
      };

      await createDiscussion({
        title: formData.title.trim(),
        content: formData.content.trim(),
        authorId: user.id,
        author: mockUser,
        languageId: formData.languageId || 'general',
        category: formData.category,
        tags: formData.tags,
        isPinned: false,
        isClosed: false
      });
      
      onSuccess();
    } catch (error) {
      showError('Erreur lors de la création de la discussion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Nouvelle discussion</CardTitle>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <Input
                type="text"
                placeholder="Sujet de votre discussion..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    category: e.target.value as 'general' | 'grammar' | 'vocabulary' | 'culture' | 'practice' | 'resources'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Général</option>
                  <option value="grammar">Grammaire</option>
                  <option value="vocabulary">Vocabulaire</option>
                  <option value="culture">Culture</option>
                  <option value="practice">Pratique</option>
                  <option value="resources">Ressources</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  value={formData.languageId}
                  onChange={(e) => setFormData(prev => ({ ...prev, languageId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les langues</option>
                  <option value="bamileke">Bamiléké</option>
                  <option value="douala">Douala</option>
                  <option value="ewondo">Ewondo</option>
                  <option value="fulfulde">Fulfulde</option>
                  <option value="bassa">Bassa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                placeholder="Décrivez votre question ou partagez votre réflexion..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Ajouter un tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Ajouter
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              >
                {isSubmitting ? <Spinner size="sm" /> : 'Publier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { DiscussionList };