import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Textarea,
  Badge,
  useToastActions
} from '@/shared/components/ui';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  lastActive: Date;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'teacher' | 'student';
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Attachment[];
  type: 'text' | 'announcement' | 'assignment' | 'feedback';
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'specific';
  targetStudents?: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isPublished: boolean;
}

interface StudentCommunicationSystemProps {
  teacherId: string;
}

export default function StudentCommunicationSystem({ teacherId }: StudentCommunicationSystemProps) {
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'announcements' | 'assignments'>('chat');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetAudience: 'all' as 'all' | 'specific'
  });

  useEffect(() => {
    loadStudents();
    if (selectedStudent) {
      loadMessages(selectedStudent.id);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      // Mock data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Marie Nguema',
          email: 'marie.nguema@email.com',
          level: 'beginner',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOnline: true
        },
        {
          id: '2',
          name: 'Jean Mballa',
          email: 'jean.mballa@email.com',
          level: 'intermediate',
          lastActive: new Date(Date.now() - 30 * 60 * 1000),
          isOnline: true
        },
        {
          id: '3',
          name: 'Fatou Diallo',
          email: 'fatou.diallo@email.com',
          level: 'advanced',
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isOnline: false
        },
        {
          id: '4',
          name: 'Pierre Essomba',
          email: 'pierre.essomba@email.com',
          level: 'beginner',
          lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isOnline: false
        }
      ];
      setStudents(mockStudents);
    } catch (error) {
      showError('Erreur lors du chargement des étudiants');
    }
  };

  const loadMessages = async (studentId: string) => {
    try {
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: studentId,
          senderName: students.find(s => s.id === studentId)?.name || 'Étudiant',
          senderType: 'student',
          content: 'Bonjour professeur, j\'ai une question sur la leçon d\'hier.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          type: 'text'
        },
        {
          id: '2',
          senderId: teacherId,
          senderName: 'Vous',
          senderType: 'teacher',
          content: 'Bonjour ! Quelle est votre question ?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: true,
          type: 'text'
        },
        {
          id: '3',
          senderId: studentId,
          senderName: students.find(s => s.id === studentId)?.name || 'Étudiant',
          senderType: 'student',
          content: 'Je ne comprends pas bien la différence entre les tons en ewondo.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      showError('Erreur lors du chargement des messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: teacherId,
        senderName: 'Vous',
        senderType: 'teacher',
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false,
        type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      showSuccess('Message envoyé');
    } catch (error) {
      showError('Erreur lors de l\'envoi du message');
    }
  };

  const sendAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      showError('Le titre et le contenu sont requis');
      return;
    }

    try {
      // Simulate sending announcement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Annonce publiée avec succès');
      setShowAnnouncementModal(false);
      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'medium',
        targetAudience: 'all'
      });
    } catch (error) {
      showError('Erreur lors de la publication de l\'annonce');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !filterLevel || student.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const tabs = [
    { id: 'chat', label: 'Messages', icon: ChatBubbleLeftRightIcon },
    { id: 'announcements', label: 'Annonces', icon: BellIcon },
    { id: 'assignments', label: 'Devoirs', icon: CheckCircleIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Communication avec les Étudiants
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez la communication et les annonces
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAnnouncementModal(true)}
          className="flex items-center gap-2"
        >
          <BellIcon className="w-4 h-4" />
          Nouvelle Annonce
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Students List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Étudiants ({filteredStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative mb-3">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un étudiant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                {/* Students List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedStudent?.id === student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {student.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {student.name}
                            </p>
                            <Badge className={getLevelColor(student.level)}>
                              {student.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {student.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {student.isOnline ? 'En ligne' : `Dernière activité: ${formatTime(student.lastActive)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedStudent ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{selectedStudent.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    'Sélectionnez un étudiant pour commencer la conversation'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-96">
                {selectedStudent ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderType === 'teacher' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderType === 'teacher'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Sélectionnez un étudiant pour commencer la conversation</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            key="announcements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5" />
                  Annonces Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock announcements */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Nouvelle leçon disponible
                      </h4>
                      <Badge variant="secondary">Moyenne</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      La nouvelle leçon sur la grammaire ewondo est maintenant disponible dans votre tableau de bord.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Publiée il y a 2h</span>
                      <span>•</span>
                      <span>Destinée à tous les étudiants</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Rappel: Devoir à rendre
                      </h4>
                      <Badge variant="secondary">Haute</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      N'oubliez pas de rendre votre devoir sur la prononciation avant vendredi.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Publiée il y a 1 jour</span>
                      <span>•</span>
                      <span>Destinée aux étudiants débutants</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'assignments' && (
          <motion.div
            key="assignments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  Devoirs et Évaluations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Fonctionnalité de devoirs en cours de développement</p>
                  <p className="text-sm">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Créer une nouvelle annonce
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre *
                  </label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de l'annonce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenu *
                  </label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Contenu de l'annonce"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priorité
                    </label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audience
                    </label>
                    <select
                      value={newAnnouncement.targetAudience}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">Tous les étudiants</option>
                      <option value="specific">Étudiants spécifiques</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Annuler
                </Button>
                <Button onClick={sendAnnouncement}>
                  Publier
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
