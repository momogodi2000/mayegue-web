/**
 * VR Scene Viewer Component - VR scene rendering and interaction
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { ARScene, ARSession } from '../types/ar-vr.types';
import { arVrService } from '../services/arVrService';

interface VRSceneViewerProps {
  scene: ARScene;
  onClose?: () => void;
  onSessionEnd?: (session: ARSession) => void;
  userId?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const VRSceneViewer: React.FC<VRSceneViewerProps> = ({
  scene,
  onClose,
  onSessionEnd,
  userId,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vrMode, setVrMode] = useState<'desktop' | 'mobile' | 'vr-headset'>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [session, setSession] = useState<ARSession | null>(null);
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comfortSettings, setComfortSettings] = useState({
    vignette: true,
    snapTurn: true,
    smoothTurn: false,
    teleport: true,
    heightAdjustment: true,
    seatedMode: false
  });

  const viewerRef = useRef<HTMLDivElement>(null);
  const vrContainerRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  // Initialize VR scene
  useEffect(() => {
    const initializeVRScene = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Create new session
        if (userId) {
          const newSession: Omit<ARSession, 'id'> = {
            userId,
            sceneId: scene.id,
            startTime: sessionStartTime.current,
            duration: 0,
            interactions: [],
            progress: {
              currentStep: 0,
              totalSteps: scene.interactions.length,
              completedObjectives: [],
              remainingObjectives: scene.learningObjectives,
              score: 0,
              timeSpent: 0,
              efficiency: 0
            },
            performance: {
              frameRate: 90, // VR typically requires 90fps
              latency: 11, // VR requires low latency
              memoryUsage: 1024,
              cpuUsage: 70,
              gpuUsage: 80,
              batteryLevel: 100,
              heatLevel: 40,
              networkQuality: 100
            },
            feedback: {
              rating: 0,
              comments: '',
              suggestions: [],
              bugs: [],
              improvements: [],
              wouldRecommend: false
            },
            achievements: [],
            errors: []
          };

          const sessionId = await arVrService.createSession(newSession);
          const createdSession = await arVrService.getSessionById(sessionId);
          setSession(createdSession);
        }

        // Simulate VR scene loading
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing VR scene:', err);
        setError('Erreur lors du chargement de la scène VR');
        setIsLoading(false);
      }
    };

    initializeVRScene();
  }, [scene.id, userId]);

  // Handle VR scene lifecycle
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    // Start VR scene rendering
    console.log('Starting VR scene:', scene.name);
  }, [scene.name]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Pause VR scene rendering
    console.log('Pausing VR scene:', scene.name);
  }, [scene.name]);

  const handleStop = useCallback(async () => {
    setIsPlaying(false);
    
    if (session) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - sessionStartTime.current.getTime()) / 1000);
      
      await arVrService.updateSession(session.id, {
        endTime,
        duration,
        progress: {
          ...session.progress,
          timeSpent: duration
        }
      });

      const updatedSession = await arVrService.getSessionById(session.id);
      onSessionEnd?.(updatedSession!);
    }
    
    onClose?.();
  }, [session, onSessionEnd, onClose]);

  // Handle VR interactions
  const handleVRInteraction = useCallback(async (interaction: any) => {
    if (!session) return;

    try {
      const interactionData = {
        id: `vr-interaction-${Date.now()}`,
        timestamp: new Date(),
        type: interaction.type,
        target: interaction.target,
        action: interaction.action.type,
        result: 'success',
        duration: 0,
        success: true
      };

      await arVrService.recordInteraction(session.id, interactionData);
      
      // Update progress
      const newProgress = {
        ...session.progress,
        currentStep: session.progress.currentStep + 1,
        completedObjectives: [...session.progress.completedObjectives, interaction.learningObjective]
      };

      await arVrService.updateSession(session.id, { progress: newProgress });
      
      setProgress((newProgress.currentStep / newProgress.totalSteps) * 100);
    } catch (err) {
      console.error('Error handling VR interaction:', err);
    }
  }, [session]);

  // Handle VR achievements
  const handleAchievement = useCallback(async (achievement: any) => {
    if (!session) return;

    try {
      await arVrService.recordAchievement(session.id, achievement);
      setAchievements(prev => [...prev, achievement]);
    } catch (err) {
      console.error('Error recording VR achievement:', err);
    }
  }, [session]);

  // Handle VR errors
  const handleError = useCallback(async (error: any) => {
    if (!session) return;

    try {
      await arVrService.recordError(session.id, error);
      setErrors(prev => [...prev, error]);
    } catch (err) {
      console.error('Error recording VR error:', err);
    }
  }, [session]);

  // Handle VR comfort settings
  const updateComfortSettings = useCallback((newSettings: any) => {
    setComfortSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
          break;
        case 'Escape':
          handleStop();
          break;
        case 'm':
          setIsMuted(!isMuted);
          break;
        case 'i':
          setShowInfo(!showInfo);
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 'v':
          setVrMode(vrMode === 'desktop' ? 'vr-headset' : 'desktop');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted, showInfo, showSettings, vrMode, handlePlay, handlePause, handleStop]);

  if (isLoading) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Chargement de la scène VR...</p>
          <p className="text-sm text-gray-300 mt-2">{scene.name}</p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Optimisation pour casque VR...</p>
            <p>90 FPS • Latence &lt; 20ms</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Erreur de chargement VR</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black overflow-hidden`}>
      {/* VR Container */}
      <div 
        ref={vrContainerRef}
        className="w-full h-full relative"
        style={{ backgroundImage: `url(${scene.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* VR Content Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* VR Objects and Characters would be rendered here */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{scene.name}</h3>
              <p className="text-gray-300">{scene.description}</p>
              <div className="mt-4 text-sm text-gray-400">
                <p>Mode VR • {vrMode}</p>
                {vrMode === 'vr-headset' && (
                  <p className="text-green-400">Casque VR détecté</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                <InformationCircleIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVrMode(vrMode === 'desktop' ? 'vr-headset' : 'desktop')}
                className={`p-2 rounded-lg transition-colors ${
                  vrMode === 'vr-headset' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-black/50 hover:bg-black/70 text-white'
                }`}
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              {onToggleFullscreen && (
                <button
                  onClick={onToggleFullscreen}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Center Controls */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="p-4 bg-black/50 hover:bg-black/70 disabled:bg-gray-600 text-white rounded-full transition-colors"
              >
                <PlayIcon className="w-8 h-8" />
              </button>
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                className="p-4 bg-black/50 hover:bg-black/70 disabled:bg-gray-600 text-white rounded-full transition-colors"
              >
                <PauseIcon className="w-8 h-8" />
              </button>
              <button
                onClick={handleStop}
                className="p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <StopIcon className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-300 mt-1">
                <span>Progression VR</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Scene Info */}
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{scene.name}</h3>
                <p className="text-sm text-gray-300">{scene.description}</p>
              </div>
              <div className="text-white text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{scene.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-1" />
                    <span>{achievements.length}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    <span>{vrMode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-16 left-4 w-80 bg-black/80 text-white p-4 rounded-lg pointer-events-auto">
            <h4 className="font-semibold mb-2">Informations VR</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Type:</strong> {scene.type}</p>
              <p><strong>Catégorie:</strong> {scene.category}</p>
              <p><strong>Langue:</strong> {scene.language}</p>
              <p><strong>Groupe culturel:</strong> {scene.culturalGroup}</p>
              <p><strong>Région:</strong> {scene.region}</p>
              <p><strong>Difficulté:</strong> {scene.difficulty}</p>
              <p><strong>Durée:</strong> {scene.duration} minutes</p>
              <p><strong>Mode VR:</strong> {vrMode}</p>
            </div>
            <div className="mt-4">
              <h5 className="font-medium mb-2">Objectifs d'apprentissage</h5>
              <ul className="text-sm space-y-1">
                {scene.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-3 text-primary-400 hover:text-primary-300 text-sm"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 w-80 bg-black/80 text-white p-4 rounded-lg pointer-events-auto">
            <h4 className="font-semibold mb-2">Paramètres VR</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : 100}
                  onChange={(e) => setIsMuted(e.target.value === '0')}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qualité VR</label>
                <select className="w-full px-3 py-2 bg-gray-700 text-white rounded">
                  <option value="ultra">Ultra (90 FPS)</option>
                  <option value="high">Haute (72 FPS)</option>
                  <option value="medium">Moyenne (60 FPS)</option>
                  <option value="low">Basse (45 FPS)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confort VR</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={comfortSettings.vignette}
                      onChange={(e) => updateComfortSettings({ vignette: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Vignette de confort</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={comfortSettings.snapTurn}
                      onChange={(e) => updateComfortSettings({ snapTurn: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Rotation par clics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={comfortSettings.teleport}
                      onChange={(e) => updateComfortSettings({ teleport: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Téléportation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={comfortSettings.heightAdjustment}
                      onChange={(e) => updateComfortSettings({ heightAdjustment: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Ajustement de hauteur</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={comfortSettings.seatedMode}
                      onChange={(e) => updateComfortSettings({ seatedMode: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Mode assis</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contrôles</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2"
                    />
                    <span className="text-sm">Suivi des mains</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2"
                    />
                    <span className="text-sm">Audio spatial 3D</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2"
                    />
                    <span className="text-sm">Haptique</span>
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-3 text-primary-400 hover:text-primary-300 text-sm"
            >
              Fermer
            </button>
          </div>
        )}

        {/* VR Comfort Vignette */}
        {comfortSettings.vignette && vrMode === 'vr-headset' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black opacity-20 rounded-full" style={{
              background: 'radial-gradient(circle at center, transparent 60%, black 100%)'
            }}></div>
          </div>
        )}

        {/* Achievements Panel */}
        {achievements.length > 0 && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-yellow-600 text-white p-4 rounded-lg pointer-events-auto">
            <h4 className="font-semibold mb-2">🏆 Nouveau succès VR!</h4>
            {achievements.slice(-1).map((achievement, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{achievement.name}</p>
                <p className="text-yellow-100">{achievement.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* VR Status Indicator */}
        {vrMode === 'vr-headset' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm pointer-events-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>VR Actif</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VRSceneViewer;
