/**
 * AI Features Page - Main page for AI features
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  SparklesIcon,
  AcademicCapIcon,
  HeartIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  EyeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { aiFeaturesService } from '../services/aiFeaturesService';
import {
  AIMentor,
  VirtualGrandmother,
  AdaptiveLearning,
  ConversationMessage
} from '../types/ai.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';

const AIFeaturesPage: React.FC = () => {
  // State management
  const [mentor, setMentor] = useState<AIMentor | null>(null);
  const [grandmother, setGrandmother] = useState<VirtualGrandmother | null>(null);
  const [adaptiveLearning, setAdaptiveLearning] = useState<AdaptiveLearning | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mentor' | 'grandmother' | 'adaptive' | 'insights'>('overview');

  // Mock user ID - in real app, get from auth context
  const userId = 'mock-user-id';

  // Intersection observer for animations - not needed, AnimatedSection has its own

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load AI features data
      const [mentorData, grandmotherData, adaptiveData] = await Promise.all([
        aiFeaturesService.getMentor(userId),
        aiFeaturesService.getVirtualGrandmother(userId),
        aiFeaturesService.getAdaptiveLearning(userId)
      ]);

      setMentor(mentorData);
      setGrandmother(grandmotherData);
      setAdaptiveLearning(adaptiveData);

      // Load conversation history if mentor exists
      if (mentorData) {
        const history = await aiFeaturesService.getConversationHistory(mentorData.id);
        setConversationHistory(history);
      }
    } catch (err) {
      console.error('Error loading AI features data:', err);
      setError('Erreur lors du chargement des fonctionnalités IA');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !mentor) return;

    try {
      const userMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        type: 'user',
        content: currentMessage,
        timestamp: new Date(),
        language: 'fr'
      };

      setConversationHistory(prev => [...prev, userMessage]);
      setCurrentMessage('');

      const aiResponse = await aiFeaturesService.sendMessage(mentor.id, userMessage);
      setConversationHistory(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Erreur lors de l\'envoi du message');
    }
  }, [currentMessage, mentor]);

  const getPersonalityColor = (personality: string) => {
    const colors: Record<string, string> = {
      patient: 'bg-blue-100 text-blue-800',
      encouraging: 'bg-green-100 text-green-800',
      challenging: 'bg-red-100 text-red-800',
      wise: 'bg-purple-100 text-purple-800',
      playful: 'bg-yellow-100 text-yellow-800',
      strict: 'bg-gray-100 text-gray-800'
    };
    return colors[personality] || colors.wise;
  };

  const getInsightTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      strength: 'bg-green-100 text-green-800',
      weakness: 'bg-red-100 text-red-800',
      pattern: 'bg-blue-100 text-blue-800',
      recommendation: 'bg-purple-100 text-purple-800',
      achievement: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || colors.recommendation;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement des fonctionnalités IA...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="btn-primary btn"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Fonctionnalités IA - Ma'a yegue</title>
        <meta name="description" content="Découvrez nos fonctionnalités IA avancées : mentor virtuel, grand-mère virtuelle, apprentissage adaptatif et analyse intelligente." />
        <meta name="keywords" content="intelligence artificielle, mentor virtuel, grand-mère virtuelle, apprentissage adaptatif, IA, Gemini" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Fonctionnalités IA
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez nos fonctionnalités d'intelligence artificielle révolutionnaires : 
                mentor virtuel personnalisé, grand-mère virtuelle culturelle et apprentissage adaptatif intelligent.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* AI Stats */}
      <AnimatedSection className="container-custom py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Statistiques IA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={mentor ? 1 : 0} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Mentor IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={grandmother ? 1 : 0} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Grand-mère Virtuelle</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={adaptiveLearning ? 1 : 0} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Apprentissage Adaptatif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={conversationHistory.length} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={adaptiveLearning?.insights.length || 0} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <CountUp end={adaptiveLearning?.recommendations.length || 0} duration={2} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recommandations</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* AI Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CpuChipIcon className="w-5 h-5 mr-2" />
                  État de l'IA
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mentor IA</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mentor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mentor ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grand-mère Virtuelle</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      grandmother ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {grandmother ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Apprentissage Adaptatif</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      adaptiveLearning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {adaptiveLearning ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions Rapides
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('mentor')}
                    className="w-full btn-primary btn-sm flex items-center justify-center"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Parler au Mentor
                  </button>
                  <button 
                    onClick={() => setActiveTab('grandmother')}
                    className="w-full btn-secondary btn-sm flex items-center justify-center"
                  >
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Visiter Grand-mère
                  </button>
                  <button 
                    onClick={() => setActiveTab('adaptive')}
                    className="w-full btn-outline btn-sm flex items-center justify-center"
                  >
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    Apprentissage Adaptatif
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Aperçu', icon: EyeIcon },
                      { id: 'mentor', label: 'Mentor IA', icon: AcademicCapIcon },
                      { id: 'grandmother', label: 'Grand-mère Virtuelle', icon: HeartIcon },
                      { id: 'adaptive', label: 'Apprentissage Adaptatif', icon: ChartBarIcon },
                      { id: 'insights', label: 'Insights', icon: LightBulbIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatedSection>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aperçu des Fonctionnalités IA
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez comment nos fonctionnalités d'intelligence artificielle 
                            transforment votre expérience d'apprentissage.
                          </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                            <AcademicCapIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Mentor IA Personnalisé
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Un mentor virtuel intelligent qui s'adapte à votre style d'apprentissage 
                              et vous guide dans votre parcours culturel.
                            </p>
                            <button
                              onClick={() => setActiveTab('mentor')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Découvrir →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-6">
                            <HeartIcon className="w-8 h-8 text-pink-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Grand-mère Virtuelle
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Une grand-mère virtuelle qui partage contes, recettes et sagesse 
                              traditionnelle dans une expérience immersive.
                            </p>
                            <button
                              onClick={() => setActiveTab('grandmother')}
                              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                            >
                              Rencontrer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <ChartBarIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Apprentissage Adaptatif
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Un système qui analyse vos performances et adapte automatiquement 
                              le contenu à vos besoins et préférences.
                            </p>
                            <button
                              onClick={() => setActiveTab('adaptive')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
                            <LightBulbIcon className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Insights Intelligents
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Des analyses approfondies de vos performances avec des recommandations 
                              personnalisées pour optimiser votre apprentissage.
                            </p>
                            <button
                              onClick={() => setActiveTab('insights')}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                              Analyser →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <GlobeAltIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Contexte Culturel
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Une compréhension profonde des nuances culturelles camerounaises 
                              pour un apprentissage authentique et respectueux.
                            </p>
                            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                              Découvrir →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6">
                            <RocketLaunchIcon className="w-8 h-8 text-red-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Innovation Continue
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Des fonctionnalités en constante évolution grâce aux dernières 
                              avancées en intelligence artificielle et apprentissage automatique.
                            </p>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              En savoir plus →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'mentor' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Mentor IA
                          </h2>
                          {mentor && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPersonalityColor(mentor.personality.type)}`}>
                              {mentor.personality.type}
                            </span>
                          )}
                        </div>
                        
                        {mentor ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Mentor Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {mentor.name}
                              </h3>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expertise:</span>
                                  <p className="text-gray-900 dark:text-white">{mentor.expertise.join(', ')}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Contexte culturel:</span>
                                  <p className="text-gray-900 dark:text-white">{mentor.culturalBackground}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Langue:</span>
                                  <p className="text-gray-900 dark:text-white">{mentor.language}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Style de communication:</span>
                                  <p className="text-gray-900 dark:text-white">{mentor.personality.communicationStyle}</p>
                                </div>
                              </div>
                            </div>

                            {/* Chat Interface */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Conversation
                              </h3>
                              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                                {conversationHistory.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`p-3 rounded-lg ${
                                      message.type === 'user'
                                        ? 'bg-primary-100 text-primary-900 ml-8'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white mr-8'
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={currentMessage}
                                  onChange={(e) => setCurrentMessage(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                  placeholder="Tapez votre message..."
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                                <button
                                  onClick={sendMessage}
                                  disabled={!currentMessage.trim()}
                                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                >
                                  Envoyer
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Aucun mentor IA configuré
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Créez votre mentor IA personnalisé pour commencer votre apprentissage guidé.
                            </p>
                            <button className="btn-primary btn">
                              Créer un Mentor
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'grandmother' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Grand-mère Virtuelle
                          </h2>
                        </div>
                        
                        {grandmother ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Grandmother Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {grandmother.name}
                              </h3>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Contexte culturel:</span>
                                  <p className="text-gray-900 dark:text-white">{grandmother.culturalBackground}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Région:</span>
                                  <p className="text-gray-900 dark:text-white">{grandmother.region}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Langue:</span>
                                  <p className="text-gray-900 dark:text-white">{grandmother.language}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Chaleur:</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-pink-600 h-2 rounded-full"
                                      style={{ width: `${grandmother.personality.warmth * 10}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sagesse:</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-purple-600 h-2 rounded-full"
                                      style={{ width: `${grandmother.personality.wisdom * 10}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Grandmother Content */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Contenu Disponible
                              </h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center">
                                    <BookOpenIcon className="w-5 h-5 text-blue-600 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Contes</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{grandmother.stories.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center">
                                    <HeartIcon className="w-5 h-5 text-red-600 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Recettes</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{grandmother.recipes.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center">
                                    <LightBulbIcon className="w-5 h-5 text-yellow-600 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Sagesse</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{grandmother.wisdom.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center">
                                    <SparklesIcon className="w-5 h-5 text-purple-600 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Mémoires</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{grandmother.memories.length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Aucune grand-mère virtuelle configurée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Créez votre grand-mère virtuelle pour découvrir contes, recettes et sagesse traditionnelle.
                            </p>
                            <button className="btn-primary btn">
                              Créer une Grand-mère
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'adaptive' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Apprentissage Adaptatif
                          </h2>
                        </div>
                        
                        {adaptiveLearning ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Learning Style */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Style d'Apprentissage
                              </h3>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Profil VARK:</span>
                                  <p className="text-gray-900 dark:text-white">{adaptiveLearning.learningStyle.varkProfile.dominant}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Style cognitif:</span>
                                  <p className="text-gray-900 dark:text-white">{adaptiveLearning.learningStyle.cognitiveStyle.processing}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Motivation:</span>
                                  <p className="text-gray-900 dark:text-white">{adaptiveLearning.learningStyle.motivationStyle.intrinsic > 50 ? 'Intrinsèque' : 'Extrinsèque'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Performance Data */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Données de Performance
                              </h3>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Précision:</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${adaptiveLearning.performanceData.accuracy}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement:</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${adaptiveLearning.performanceData.engagement}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Rétention:</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-purple-600 h-2 rounded-full"
                                      style={{ width: `${adaptiveLearning.performanceData.retention}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Aucun profil d'apprentissage adaptatif
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Créez votre profil d'apprentissage adaptatif pour une expérience personnalisée.
                            </p>
                            <button className="btn-primary btn">
                              Créer un Profil
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'insights' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Insights IA
                          </h2>
                        </div>
                        
                        {adaptiveLearning && adaptiveLearning.insights.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adaptiveLearning.insights.map((insight) => (
                              <div key={insight.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInsightTypeColor(insight.type)}`}>
                                    {insight.type}
                                  </span>
                                  <span className="text-sm text-gray-500">{Math.round(insight.confidence * 100)}%</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                                  {insight.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {insight.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {insight.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <LightBulbIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Aucun insight disponible
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Les insights apparaîtront ici une fois que vous commencerez à utiliser les fonctionnalités IA.
                            </p>
                            <button className="btn-primary btn">
                              Commencer l'Apprentissage
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPage;
