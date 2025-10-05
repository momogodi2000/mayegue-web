import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Attachment[];
  type: 'text' | 'announcement' | 'assignment' | 'feedback';
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  lastActive: Date;
  unreadCount: number;
}

interface Conversation {
  id: string;
  student: Student;
  messages: Message[];
  lastMessage: Message;
  isActive: boolean;
}

interface StudentCommunicationSystemProps {
  teacherId: string;
}

const StudentCommunicationSystem: React.FC<StudentCommunicationSystemProps> = ({
  teacherId
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'announcement' | 'assignment' | 'feedback'>('text');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConversations: Conversation[] = [
        {
          id: '1',
          student: {
            id: 's1',
            name: 'Marie Kouam',
            email: 'marie.kouam@email.com',
            level: 'Intermédiaire',
            lastActive: new Date(Date.now() - 1000 * 60 * 30),
            unreadCount: 2
          },
          messages: [
            {
              id: 'm1',
              senderId: 's1',
              senderName: 'Marie Kouam',
              senderRole: 'student',
              content: 'Bonjour professeur, j\'ai une question sur la leçon d\'hier.',
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              isRead: false,
              type: 'text'
            },
            {
              id: 'm2',
              senderId: teacherId,
              senderName: 'Professeur',
              senderRole: 'teacher',
              content: 'Bonjour Marie ! Quelle est votre question ?',
              timestamp: new Date(Date.now() - 1000 * 60 * 25),
              isRead: true,
              type: 'text'
            }
          ],
          lastMessage: {
            id: 'm2',
            senderId: teacherId,
            senderName: 'Professeur',
            senderRole: 'teacher',
            content: 'Bonjour Marie ! Quelle est votre question ?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            isRead: true,
            type: 'text'
          },
          isActive: true
        },
        {
          id: '2',
          student: {
            id: 's2',
            name: 'Jean-Paul Dibango',
            email: 'jean.dibango@email.com',
            level: 'Débutant',
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
            unreadCount: 0
          },
          messages: [
            {
              id: 'm3',
              senderId: teacherId,
              senderName: 'Professeur',
              senderRole: 'teacher',
              content: 'Excellent travail sur l\'exercice de prononciation !',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              isRead: true,
              type: 'feedback'
            }
          ],
          lastMessage: {
            id: 'm3',
            senderId: teacherId,
            senderName: 'Professeur',
            senderRole: 'teacher',
            content: 'Excellent travail sur l\'exercice de prononciation !',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isRead: true,
            type: 'feedback'
          },
          isActive: false
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      showError('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: teacherId,
        senderName: 'Professeur',
        senderRole: 'teacher',
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false,
        type: messageType
      };

      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
              isActive: true
            }
          : conv
      ));

      setNewMessage('');
      showSuccess('Message envoyé avec succès');
    } catch (error) {
      showError('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId
        ? {
            ...conv,
            messages: conv.messages.map(msg => ({ ...msg, isRead: true })),
            student: { ...conv.student, unreadCount: 0 }
          }
        : conv
    ));
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'assignment': return '📝';
      case 'feedback': return '⭐';
      default: return '💬';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-green-100 text-green-800';
      case 'feedback': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Conversations
            </CardTitle>
            <div className="mt-4">
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    markAsRead(conversation.id);
                  }}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {conversation.student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{conversation.student.name}</p>
                        {conversation.student.unreadCount > 0 && (
                          <Badge variant="danger" className="ml-2">
                            {conversation.student.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {conversation.lastMessage.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getMessageTypeColor(conversation.lastMessage.type)}`}
                        >
                          {getMessageTypeIcon(conversation.lastMessage.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        {currentConversation ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {currentConversation.student.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{currentConversation.student.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {currentConversation.student.level} • {currentConversation.student.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {currentConversation.student.unreadCount} non lus
                  </Badge>
                  {currentConversation.isActive && (
                    <Badge variant="success">En ligne</Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-4 space-y-4">
                {currentConversation.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderRole === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderRole === 'teacher'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderName}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            message.senderRole === 'teacher' 
                              ? 'bg-blue-600 text-white' 
                              : getMessageTypeColor(message.type)
                          }`}
                        >
                          {getMessageTypeIcon(message.type)}
                        </Badge>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="text">Message</option>
                    <option value="announcement">Annonce</option>
                    <option value="assignment">Devoir</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Pièce jointe
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    rows={3}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="self-end"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm mt-2">
                  Choisissez un étudiant pour commencer à communiquer
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentCommunicationSystem;