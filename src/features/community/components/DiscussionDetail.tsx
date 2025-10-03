import React, { useState, useEffect } from 'react';
import { useCommunityStore, Reply, CommunityUser } from '../store/communityStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  Spinner,
  useToastActions 
} from '@/shared/components/ui';

interface DiscussionDetailProps {
  discussionId: string;
  onBack: () => void;
}

const DiscussionDetail: React.FC<DiscussionDetailProps> = ({
  discussionId,
  onBack
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { user } = useAuthStore();
  
  const {
    currentDiscussion,
    loading,
    error,
    fetchDiscussionById,
    addReply,
    toggleReplyLike,
    toggleDiscussionLike,
    acceptReply
  } = useCommunityStore();

  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscussionById(discussionId);
  }, [fetchDiscussionById, discussionId]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('Vous devez être connecté pour répondre');
      return;
    }

    if (!replyContent.trim()) {
      showError('Veuillez saisir votre réponse');
      return;
    }

    setIsSubmittingReply(true);
    
    try {
      // Mock user data
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

      await addReply(discussionId, {
        content: replyContent.trim(),
        authorId: user.id,
        author: mockUser,
        discussionId: discussionId,
        parentReplyId: replyingTo || undefined
      });
      
      setReplyContent('');
      setReplyingTo(null);
      showSuccess('Réponse ajoutée avec succès');
    } catch (error) {
      showError('Erreur lors de l\'ajout de la réponse');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikeDiscussion = async () => {
    if (!user || !currentDiscussion) {
      showError('Vous devez être connecté pour aimer cette discussion');
      return;
    }

    try {
      await toggleDiscussionLike(currentDiscussion.id, user.id);
    } catch (error) {
      showError('Erreur lors de la mise à jour de votre réaction');
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!user) {
      showError('Vous devez être connecté pour aimer cette réponse');
      return;
    }

    try {
      await toggleReplyLike(replyId, user.id);
    } catch (error) {
      showError('Erreur lors de la mise à jour de votre réaction');
    }
  };

  const handleAcceptReply = async (replyId: string) => {
    if (!user || !currentDiscussion) return;
    
    // Only the discussion author can accept replies
    if (currentDiscussion.authorId !== user.id) {
      showError('Seul l\'auteur de la discussion peut accepter les réponses');
      return;
    }

    try {
      await acceptReply(replyId);
      showSuccess('Réponse acceptée comme solution');
    } catch (error) {
      showError('Erreur lors de l\'acceptation de la réponse');
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

  const getCategoryLabel = (category: string): string => {
    const labels = {
      general: 'Général',
      grammar: 'Grammaire',
      vocabulary: 'Vocabulaire',
      culture: 'Culture',
      practice: 'Pratique',
      resources: 'Ressources'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      grammar: 'bg-blue-100 text-blue-800',
      vocabulary: 'bg-green-100 text-green-800',
      culture: 'bg-purple-100 text-purple-800',
      practice: 'bg-orange-100 text-orange-800',
      resources: 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement de la discussion...</span>
      </div>
    );
  }

  if (error || !currentDiscussion) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Discussion introuvable
          </h3>
          <p className="text-gray-600 mb-6">
            La discussion que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button onClick={onBack}>
            Retour aux discussions
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sortedReplies = [...currentDiscussion.replies].sort((a, b) => {
    // Accepted replies first, then by creation date
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const isDiscussionLiked = user ? currentDiscussion.likedBy.includes(user.id) : false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Retour aux discussions
      </Button>

      {/* Discussion Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {currentDiscussion.isPinned && (
                  <Badge variant="secondary" size="sm">
                    📌 Épinglé
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  size="sm"
                  className={getCategoryColor(currentDiscussion.category)}
                >
                  {getCategoryLabel(currentDiscussion.category)}
                </Badge>
                <Badge variant="info" size="sm">
                  {currentDiscussion.languageId}
                </Badge>
                {currentDiscussion.isClosed && (
                  <Badge variant="secondary" size="sm">
                    🔒 Fermé
                  </Badge>
                )}
              </div>

              <CardTitle className="text-2xl mb-4">
                {currentDiscussion.title}
              </CardTitle>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>👁️ {currentDiscussion.views} vues</span>
                  <span>💬 {currentDiscussion.replies.length} réponses</span>
                  <span>⏰ {formatRelativeTime(currentDiscussion.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Discussion Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentDiscussion.content}
            </p>
          </div>

          {/* Tags */}
          {currentDiscussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentDiscussion.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Author and Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {currentDiscussion.author.displayName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {currentDiscussion.author.displayName}
                </p>
                <p className="text-sm text-gray-500">
                  Auteur de la discussion
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLikeDiscussion}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  isDiscussionLiked 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{isDiscussionLiked ? '❤️' : '🤍'}</span>
                <span>{currentDiscussion.likes}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentDiscussion.replies.length} réponse(s)
          </CardTitle>
        </CardHeader>

        <CardContent>
          {sortedReplies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">💭</div>
              <p>Aucune réponse pour le moment. Soyez le premier à répondre !</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedReplies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  currentUserId={user?.id}
                  discussionAuthorId={currentDiscussion.authorId}
                  onLike={() => handleLikeReply(reply.id)}
                  onAccept={() => handleAcceptReply(reply.id)}
                  onReply={() => setReplyingTo(reply.id)}
                  formatRelativeTime={formatRelativeTime}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      {user && !currentDiscussion.isClosed && (
        <Card>
          <CardHeader>
            <CardTitle>
              {replyingTo ? 'Répondre au commentaire' : 'Ajouter une réponse'}
            </CardTitle>
            {replyingTo && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  En réponse à un commentaire précédent
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Annuler
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <textarea
                placeholder="Partagez votre réponse ou votre expérience..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmittingReply}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Publication...
                    </>
                  ) : (
                    'Publier la réponse'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="text-center py-8">
            <div className="text-blue-600 text-lg mb-2">
              💡 Rejoignez la conversation
            </div>
            <p className="text-blue-700 mb-4">
              Connectez-vous pour répondre à cette discussion et interagir avec la communauté.
            </p>
            <Button variant="outline">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ReplyCardProps {
  reply: Reply;
  currentUserId?: string;
  discussionAuthorId: string;
  onLike: () => void;
  onAccept: () => void;
  onReply: () => void;
  formatRelativeTime: (date: Date) => string;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  currentUserId,
  discussionAuthorId,
  onLike,
  onAccept,
  onReply,
  formatRelativeTime
}) => {
  const isLiked = currentUserId ? reply.likedBy.includes(currentUserId) : false;
  const canAccept = currentUserId === discussionAuthorId && !reply.isAccepted;
  const isAuthor = currentUserId === reply.authorId;

  return (
    <div className={`p-4 rounded-lg border ${
      reply.isAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
    }`}>
      {reply.isAccepted && (
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="success" size="sm">
            ✅ Solution acceptée
          </Badge>
        </div>
      )}

      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          {reply.author.displayName[0].toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">
              {reply.author.displayName}
            </span>
            {isAuthor && (
              <Badge variant="secondary" size="sm">
                Vous
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              {formatRelativeTime(reply.createdAt)}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none mb-3">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{reply.likes}</span>
            </button>

            <button
              onClick={onReply}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Répondre
            </button>

            {canAccept && (
              <button
                onClick={onAccept}
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                ✅ Accepter comme solution
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DiscussionDetail };