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
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { communityService } from '@/core/services/firebase/community.service';

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: any) => void;
}

export default function GroupCreationModal({ 
  isOpen, 
  onClose, 
  onGroupCreated 
}: GroupCreationModalProps) {
  const { user } = useAuthStore();
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    language: 'dualaba',
    privacy: 'public' as 'public' | 'private',
    tags: [] as string[],
    maxMembers: 50
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const categories = [
    'Général',
    'Débutant',
    'Intermédiaire',
    'Avancé',
    'Culture',
    'Grammaire',
    'Vocabulaire',
    'Prononciation',
    'Conversation',
    'Étude'
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
      showError('Vous devez être connecté pour créer un groupe');
      return;
    }

    if (!formData.name.trim()) {
      showError('Le nom du groupe est requis');
      return;
    }

    setLoading(true);

    try {
      const groupData = {
        ...formData,
        createdBy: user.id,
        createdAt: new Date(),
        memberCount: 1,
        members: [user.id],
        admins: [user.id]
      };

      const newGroup = await communityService.createGroup(groupData);
      
      showSuccess('Groupe créé avec succès !');
      onGroupCreated(newGroup);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        language: 'dualaba',
        privacy: 'public',
        tags: [],
        maxMembers: 50
      });
      
    } catch (error: any) {
      console.error('Error creating group:', error);
      showError(error.message || 'Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Créer un Nouveau Groupe
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom du groupe *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Apprenants Dualaba Débutants"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez l'objectif et le contenu de votre groupe..."
                  rows={3}
                />
              </div>

              {/* Category and Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <SelectRoot value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </div>

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
              </div>

              {/* Privacy and Max Members */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidentialité
                  </label>
                  <SelectRoot value={formData.privacy} onValueChange={(value: string) => handleInputChange('privacy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <GlobeAltIcon className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <LockClosedIcon className="w-4 h-4" />
                          Privé
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </SelectRoot>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre max de membres
                  </label>
                  <Input
                    type="number"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
                    min="2"
                    max="1000"
                  />
                </div>
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
                  {loading ? 'Création...' : 'Créer le Groupe'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
