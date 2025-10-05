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
  AcademicCapIcon,
  BookOpenIcon,
  TagIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { geminiService } from '@/core/services/ai/geminiService';

interface LessonCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonCreated: (lesson: any) => void;
}

interface Exercise {
  id: string;
  type: 'multiple_choice' | 'translation' | 'pronunciation' | 'cultural' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export default function LessonCreationModal({ 
  isOpen, 
  onClose, 
  onLessonCreated 
}: LessonCreationModalProps) {
  const { user } = useAuthStore();
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    level: 'beginner',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 30,
    tags: [] as string[],
    culturalNotes: '',
    objectives: [] as string[]
  });
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');

  const levels = [
    'beginner',
    'intermediate', 
    'advanced'
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

  const categories = [
    'vocabulaire',
    'grammaire',
    'conversation',
    'culture',
    'prononciation',
    'compréhension',
    'expression'
  ];

  const exerciseTypes = [
    { value: 'multiple_choice', label: 'Choix multiple' },
    { value: 'translation', label: 'Traduction' },
    { value: 'pronunciation', label: 'Prononciation' },
    { value: 'cultural', label: 'Culturel' },
    { value: 'fill_blank', label: 'Texte à trous' }
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

  const addObjective = () => {
    if (currentObjective.trim() && !formData.objectives.includes(currentObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, currentObjective.trim()]
      }));
      setCurrentObjective('');
    }
  };

  const removeObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objectiveToRemove)
    }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const updateExercise = (id: string, field: string, value: any) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const generateContentWithAI = async () => {
    if (!formData.title.trim()) {
      showError('Veuillez d\'abord saisir un titre pour la leçon');
      return;
    }

    setLoading(true);
    try {
      const aiContent = await geminiService.generateLessonContent({
        title: formData.title,
        language: formData.language,
        level: formData.level,
        category: formData.category,
        objectives: formData.objectives
      });

      setFormData(prev => ({
        ...prev,
        content: aiContent.content,
        culturalNotes: aiContent.culturalNotes || prev.culturalNotes,
        description: aiContent.description || prev.description
      }));

      // Generate exercises
      if (aiContent.exercises) {
        setExercises(aiContent.exercises.map((ex: any, index: number) => ({
          id: `ai-${index}`,
          ...ex,
          points: 10
        })));
      }

      showSuccess('Contenu généré avec succès par l\'IA !');
    } catch (error) {
      console.error('Error generating content:', error);
      showError('Erreur lors de la génération du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      showError('Vous devez être connecté pour créer une leçon');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showError('Le titre et le contenu sont requis');
      return;
    }

    if (exercises.length === 0) {
      showError('Veuillez ajouter au moins un exercice');
      return;
    }

    setLoading(true);

    try {
      const lessonData = {
        ...formData,
        authorId: user.id,
        authorName: user.displayName || user.email,
        createdAt: new Date(),
        exercises,
        isActive: true,
        isApproved: false, // Needs admin approval
        studentCount: 0,
        rating: 0,
        totalRatings: 0
      };

      // Here you would typically save to Firebase
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Leçon créée avec succès ! Elle sera disponible après validation par un administrateur.');
      onLessonCreated(lessonData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        level: 'beginner',
        language: 'dualaba',
        category: 'vocabulaire',
        duration: 30,
        tags: [],
        culturalNotes: '',
        objectives: []
      });
      setExercises([]);
      
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      showError(error.message || 'Erreur lors de la création de la leçon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5" />
                Créer une Nouvelle Leçon
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre de la leçon *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Salutations en dualaba"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Durée (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="5"
                    max="180"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez brièvement le contenu de cette leçon..."
                  rows={2}
                />
              </div>

              {/* Level, Language, Category */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Niveau
                  </label>
                  <SelectRoot value={formData.level} onValueChange={(value: string) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <SelectRoot value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Objectifs d'apprentissage
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    placeholder="Ajouter un objectif..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" onClick={addObjective} size="sm">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.objectives.length > 0 && (
                  <div className="space-y-2">
                    {formData.objectives.map((objective) => (
                      <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                        {objective}
                        <button
                          type="button"
                          onClick={() => removeObjective(objective)}
                          className="ml-1 hover:text-red-500"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Content Generation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Génération IA</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Laissez l'IA générer le contenu et les exercices pour votre leçon
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={generateContentWithAI}
                    disabled={loading || !formData.title.trim()}
                    variant="outline"
                  >
                    {loading ? 'Génération...' : 'Générer avec IA'}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenu de la leçon *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Rédigez le contenu principal de votre leçon..."
                  rows={8}
                  required
                />
              </div>

              {/* Cultural Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes culturelles
                </label>
                <Textarea
                  value={formData.culturalNotes}
                  onChange={(e) => handleInputChange('culturalNotes', e.target.value)}
                  placeholder="Ajoutez des informations culturelles importantes..."
                  rows={3}
                />
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

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exercices ({exercises.length})
                  </label>
                  <Button type="button" onClick={addExercise} size="sm">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Ajouter un exercice
                  </Button>
                </div>

                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">Exercice {index + 1}</h5>
                        <Button 
                          type="button" 
                          onClick={() => removeExercise(exercise.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Type
                          </label>
                          <SelectRoot
                            value={exercise.type}
                            onValueChange={(value: string) => updateExercise(exercise.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {exerciseTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Points
                          </label>
                          <Input
                            type="number"
                            value={exercise.points}
                            onChange={(e) => updateExercise(exercise.id, 'points', parseInt(e.target.value))}
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Question
                        </label>
                        <Input
                          value={exercise.question}
                          onChange={(e) => updateExercise(exercise.id, 'question', e.target.value)}
                          placeholder="Tapez votre question..."
                        />
                      </div>

                      {exercise.type === 'multiple_choice' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Options
                          </label>
                          <div className="space-y-2">
                            {exercise.options?.map((option, optIndex) => (
                              <Input
                                key={optIndex}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(exercise.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateExercise(exercise.id, 'options', newOptions);
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Réponse correcte
                        </label>
                        <Input
                          value={exercise.correctAnswer}
                          onChange={(e) => updateExercise(exercise.id, 'correctAnswer', e.target.value)}
                          placeholder="Réponse correcte..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Explication
                        </label>
                        <Textarea
                          value={exercise.explanation}
                          onChange={(e) => updateExercise(exercise.id, 'explanation', e.target.value)}
                          placeholder="Explication de la réponse..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {exercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun exercice ajouté</p>
                    <p className="text-sm">Cliquez sur "Ajouter un exercice" pour commencer</p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer la Leçon'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
