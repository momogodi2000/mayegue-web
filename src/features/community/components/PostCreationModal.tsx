import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  useToastActions
} from '@/shared/components/ui';
import { 
  XMarkIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { communityService } from '@/core/services/firebase/community.service';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
  groupId?: string;
}

export default function PostCreationModal({ 
  isOpen, 
  onClose, 
  onPostCreated,
  groupId 
}: PostCreationModalProps) {
  const { user } = useAuthStore();
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'discussion' as 'discussion' | 'question' | 'tip' | 'resource',
    language: 'dualaba',
    tags: [] as string[],
    isQuestion: false
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const postTypes = [
    { value: 'discussion', label: 'Discussion', icon: DocumentTextIcon },
    { value: 'question', label: 'Question', icon: QuestionMarkCircleIcon },
    { value: 'tip', label: 'Conseil', icon: LightBulbIcon },
    { value: 'resource', label: 'Ressource', icon: DocumentTextIcon }
  ];

  const languages = [
    'dualaba',
    'ewondo',
    'bassa',
    'bamoun',
    'fulfulde',
    'yemba',
    'anglais',
    'français'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      showError('Vous devez être connecté pour créer un post');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showError('Le titre et le contenu sont requis');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        ...formData,
        authorId: user.id,
        authorName: user.displayName || user.email,
        createdAt: new Date(),
        groupId: groupId || undefined,
        likes: 0,
        comments: 0,
        isResolved: false
      };

      const newPost = await communityService.createPost(postData);
      
      showSuccess('Post créé avec succès !');
      onPostCreated(newPost);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'discussion',
        language: 'dualaba',
        tags: [],
        isQuestion: false
      });
      
    } catch (error: any) {
      console.error('Error creating post:', error);
      showError(error.message || 'Erreur lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = postTypes.find(type => type.value === formData.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedType && <selectedType.icon className="w-5 h-5" />}
                Créer un Nouveau Post
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de post
                </label>
                <SelectRoot value={formData.type} onValueChange={(value: string) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {postTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={
                    formData.type === 'question' 
                      ? "Ex: Comment dit-on 'merci' en dualaba ?"
                      : "Ex: Conseils pour apprendre la prononciation"
                  }
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenu *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={
                    formData.type === 'question'
                      ? "Décrivez votre question en détail..."
                      : "Partagez votre contenu, conseil ou ressource..."
                  }
                  rows={6}
                  required
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue
                </label>
                <SelectRoot value={formData.language} onValueChange={(value: string) => handleInputChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <TagIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer le Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
