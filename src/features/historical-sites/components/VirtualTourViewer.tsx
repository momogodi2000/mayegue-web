/**
 * Virtual Tour Viewer Component - 360° virtual tour interface
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  InformationCircleIcon,
  MapIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { VirtualTour, TourHotspot, AudioNarration } from '../types/historical-sites.types';

interface VirtualTourViewerProps {
  tour: VirtualTour;
  onClose?: () => void;
  onHotspotClick?: (hotspot: TourHotspot) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  tour,
  onClose,
  onHotspotClick,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentHotspot, setCurrentHotspot] = useState<TourHotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tourRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize tour
  useEffect(() => {
    const initializeTour = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate loading time for virtual tour
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing virtual tour:', err);
        setError('Erreur lors du chargement de la visite virtuelle');
        setIsLoading(false);
      }
    };

    initializeTour();
  }, [tour.id]);

  // Handle audio playback
  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleMuteToggle = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle hotspot interactions
  const handleHotspotClick = useCallback((hotspot: TourHotspot) => {
    setCurrentHotspot(hotspot);
    onHotspotClick?.(hotspot);
  }, [onHotspotClick]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'm':
          handleMuteToggle();
          break;
        case 'h':
          setShowHotspots(!showHotspots);
          break;
        case 'i':
          setShowInfo(!showInfo);
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayPause, handleMuteToggle, showHotspots, showInfo, onClose]);

  // Handle audio progress
  const handleAudioProgress = useCallback(() => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  }, []);

  // Handle audio time update
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  // Handle audio loaded
  const handleAudioLoaded = useCallback(() => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  }, []);

  if (isLoading) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Chargement de la visite virtuelle...</p>
          <p className="text-sm text-gray-300 mt-2">{tour.title}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'relative'} bg-black overflow-hidden`}>
      {/* Tour Container */}
      <div 
        ref={tourRef}
        className="w-full h-full relative"
        style={{ backgroundImage: `url(${tour.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Hotspots */}
        {showHotspots && tour.hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => handleHotspotClick(hotspot)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            style={{
              left: `${hotspot.coordinates[0]}%`,
              top: `${hotspot.coordinates[1]}%`
            }}
            title={hotspot.title}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
            </div>
          </button>
        ))}

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
                onClick={() => setShowHotspots(!showHotspots)}
                className={`p-2 rounded-lg transition-colors ${
                  showHotspots 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                    : 'bg-black/50 hover:bg-black/70 text-white'
                }`}
              >
                {showHotspots ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                <InformationCircleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Center Controls */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            {/* Audio Controls */}
            {tour.audioNarration.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-2">
                  <select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    className="px-3 py-1 bg-black/50 text-white rounded-lg border border-gray-600"
                  >
                    {tour.audioNarration.map((narration) => (
                      <option key={narration.language} value={narration.language}>
                        {narration.language.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleMuteToggle}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                  >
                    {isMuted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Tour Info */}
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{tour.title}</h3>
                <p className="text-sm text-gray-300">{tour.description}</p>
              </div>
              <div className="text-white text-sm">
                <span>{tour.duration} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-16 left-4 w-80 bg-black/80 text-white p-4 rounded-lg pointer-events-auto">
            <h4 className="font-semibold mb-2">Informations sur la visite</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Type:</strong> {tour.type}</p>
              <p><strong>Durée:</strong> {tour.duration} minutes</p>
              <p><strong>Qualité:</strong> {tour.quality}</p>
              <p><strong>Langues:</strong> {tour.languages.join(', ')}</p>
              {tour.isInteractive && <p><strong>Interactif:</strong> Oui</p>}
              {tour.requiresVR && <p><strong>VR:</strong> Requis</p>}
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-3 text-primary-400 hover:text-primary-300 text-sm"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Hotspot Detail Panel */}
        {currentHotspot && (
          <div className="absolute top-16 right-4 w-80 bg-black/80 text-white p-4 rounded-lg pointer-events-auto">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{currentHotspot.title}</h4>
              <button
                onClick={() => setCurrentHotspot(null)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-3">{currentHotspot.description}</p>
            {currentHotspot.type === 'info' && (
              <div className="text-sm text-gray-400">
                <p><strong>Type:</strong> Information</p>
              </div>
            )}
            {currentHotspot.type === 'image' && (
              <img 
                src={currentHotspot.content} 
                alt={currentHotspot.title}
                className="w-full h-32 object-cover rounded-lg mt-2"
              />
            )}
            {currentHotspot.type === 'video' && (
              <video 
                src={currentHotspot.content}
                controls
                className="w-full h-32 rounded-lg mt-2"
              />
            )}
            {currentHotspot.type === 'audio' && (
              <audio 
                src={currentHotspot.content}
                controls
                className="w-full mt-2"
              />
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <button className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-r-lg transition-colors pointer-events-auto">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-l-lg transition-colors pointer-events-auto">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Audio Element */}
      {tour.audioNarration.length > 0 && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleAudioLoaded}
          onProgress={handleAudioProgress}
          src={tour.audioNarration.find(n => n.language === currentLanguage)?.audioUrl}
          muted={isMuted}
        />
      )}
    </div>
  );
};

export default VirtualTourViewer;
