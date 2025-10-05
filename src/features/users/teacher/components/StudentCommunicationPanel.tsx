import React, { useState, useEffect, useRef } from 'react';
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
  useToastActions,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/shared/components/ui';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperClipIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
  type: 'text' | 'announcement' | 'feedback' | 'question';
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastActive: Date;
  unreadMessages: number;
  performance: {
    level: string;
    lessonsCompleted: number;
    averageScore: number;
  };
}

interface Conversation {
  studentId: string;
  student: Student;
  messages: Message[];
  lastMessage?: Message;
}

const StudentCommunicationPanel: React.FC = () => {
  const { user } = useAuthStore();
  const { success: showSuccess, error: showError } = useToastActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'questions'>('all');
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [sending, setSending] = useState(false);

  // Mock data - Replace with actual API calls
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Marie Kouam',
      email: 'marie.k@example.com',
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
      unreadMessages: 3,
      performance: {
        level: 'Intermédiaire',
        lessonsCompleted: 24,
        averageScore: 85
      }
    },
    {
      id: '2',
      name: 'Jean-Paul Dibango',
      email: 'jp.d@example.com',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadMessages: 0,
      performance: {
        level: 'Débutant',
        lessonsCompleted: 12,
        averageScore: 72
      }
    },
    {
      id: '3',
      name: 'Aminata Sow',
      email: 'aminata.s@example.com',
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      unreadMessages: 1,
      performance: {
        level: 'Avancé',
        lessonsCompleted: 45,
        averageScore: 92
      }
    }
  ];

  useEffect(() => {
    // Initialize conversations with mock data
    const mockConversations: Conversation[] = mockStudents.map(student => ({
      studentId: student.id,
      student,
      messages: generateMockMessages(student.id),
      lastMessage: undefined
    }));

    mockConversations.forEach(conv => {
      if (conv.messages.length > 0) {
        conv.lastMessage = conv.messages[conv.messages.length - 1];
      }
    });

    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const conversation = conversations.find(c => c.studentId === selectedStudent.id);
      if (conversation) {
        setCurrentMessages(conversation.messages);
        scrollToBottom();
      }
    }
  }, [selectedStudent, conversations]);

  const generateMockMessages = (studentId: string): Message[] => {
    const messages: Message[] = [
      {
        id: '1',
        senderId: studentId,
        senderName: mockStudents.find(s => s.id === studentId)?.name || '',
        recipientId: user?.id || '',
        content: 'Bonjour professeur, j\'ai une question sur la leçon d\'hier concernant les salutations.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
        type: 'question'
      },
      {
        id: '2',
        senderId: user?.id || '',
        senderName: user?.displayName || 'Enseignant',
        recipientId: studentId,
        content: 'Bonjour ! Bien sûr, quelle est votre question ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
        read: true,
        type: 'text'
      }
    ];
    return messages;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    setSending(true);

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.displayName || 'Enseignant',
        recipientId: selectedStudent.id,
        content: newMessage,
        timestamp: new Date(),
        read: false,
        type: 'text'
      };

      // Update conversations
      setConversations(prev => prev.map(conv => {
        if (conv.studentId === selectedStudent.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message
          };
        }
        return conv;
      }));

      setNewMessage('');
      showSuccess('Message envoyé avec succès');
      scrollToBottom();
    } catch (error) {
      showError('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) return;

    setSending(true);

    try {
      const announcement: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.displayName || 'Enseignant',
        recipientId: 'all',
        content: announcementText,
        timestamp: new Date(),
        read: false,
        type: 'announcement'
      };

      // Send to all students
      setConversations(prev => prev.map(conv => ({
        ...conv,
        messages: [...conv.messages, announcement],
        lastMessage: announcement
      })));

      setAnnouncementText('');
      setShowAnnouncement(false);
      showSuccess(`Annonce envoyée à ${conversations.length} étudiants`);
    } catch (error) {
      showError('Erreur lors de l\'envoi de l\'annonce');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' ||
                         (filterType === 'unread' && conv.student.unreadMessages > 0) ||
                         (filterType === 'questions' && conv.messages.some(m => m.type === 'question' && !m.read));

    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days}j`;
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Communication avec les Étudiants
            </CardTitle>
            <Button
              onClick={() => setShowAnnouncement(true)}
              className="flex items-center gap-2"
            >
              <BellIcon className="w-4 h-4" />
              Annonce Générale
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Student List */}
          <div className="w-80 border-r flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un étudiant..."
                  className="pl-10"
                />
              </div>

              <SelectRoot value={filterType} onValueChange={(value: string) => setFilterType(value as 'all' | 'unread' | 'questions')}>
                <SelectTrigger className="w-full">
                  <FunnelIcon className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les étudiants</SelectItem>
                  <SelectItem value="unread">Messages non lus</SelectItem>
                  <SelectItem value="questions">Questions</SelectItem>
                </SelectContent>
              </SelectRoot>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.studentId}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  onClick={() => setSelectedStudent(conv.student)}
                  className={`p-4 cursor-pointer border-b transition-colors ${
                    selectedStudent?.id === conv.student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {conv.student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{conv.student.name}</p>
                        {conv.student.unreadMessages > 0 && (
                          <Badge variant="danger" className="ml-2">
                            {conv.student.unreadMessages}
                          </Badge>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {conv.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(conv.lastMessage.timestamp)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedStudent ? (
              <>
                {/* Student Info Header */}
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedStudent.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{selectedStudent.performance.level}</Badge>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {selectedStudent.performance.lessonsCompleted} leçons • {selectedStudent.performance.averageScore}% moy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {currentMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : message.type === 'announcement'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          {message.type === 'announcement' && (
                            <div className="flex items-center gap-2 mb-2">
                              <BellIcon className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                                Annonce
                              </span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white dark:bg-gray-900">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Écrivez votre message..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <PaperClipIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-3"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <UserGroupIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un étudiant pour commencer la conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Announcement Modal */}
      <AnimatePresence>
        {showAnnouncement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BellIcon className="w-6 h-6" />
                Envoyer une Annonce Générale
              </h2>

              <Textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Écrivez votre annonce pour tous les étudiants..."
                rows={6}
                className="mb-4"
              />

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cette annonce sera envoyée à {conversations.length} étudiant(s)
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAnnouncement(false);
                      setAnnouncementText('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSendAnnouncement}
                    disabled={!announcementText.trim() || sending}
                  >
                    {sending ? 'Envoi...' : 'Envoyer l\'Annonce'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCommunicationPanel;
