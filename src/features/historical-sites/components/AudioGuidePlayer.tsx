/**
 * Audio Guide Player Component - Audio guide interface for historical sites
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
  ForwardIcon,
  BackwardIcon,
  ListBulletIcon,
  XMarkIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { AudioGuide, AudioGuideSegment } from '../types/historical-sites.types';

interface AudioGuidePlayerProps {
  audioGuide: AudioGuide;
  onClose?: () => void;
  onSegmentSelect?: (segment: AudioGuideSegment) => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  audioGuide,
  onClose,
  onSegmentSelect,
  onFavorite,
  onShare,
  onDownload
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<AudioGuideSegment | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize audio guide
  useEffect(() => {
    if (audioGuide.segments.length > 0) {
      setCurrentSegment(audioGuide.segments[0]);
    }
  }, [audioGuide]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next segment if available
      const currentIndex = audioGuide.segments.findIndex(s => s.id === currentSegment?.id);
      if (currentIndex < audioGuide.segments.length - 1) {
        const nextSegment = audioGuide.segments[currentIndex + 1];
        handleSegmentSelect(nextSegment);
      }
    };

    const handleError = () => {
      setError('Erreur lors de la lecture audio');
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioGuide.segments, currentSegment]);

  // Handle play/pause
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

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Handle playback rate change
  const handlePlaybackRateChange = useCallback((newRate: number) => {
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  }, []);

  // Handle segment selection
  const handleSegmentSelect = useCallback((segment: AudioGuideSegment) => {
    setCurrentSegment(segment);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = segment.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    onSegmentSelect?.(segment);
  }, [isPlaying, onSegmentSelect]);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * duration;
      
      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  }, [duration]);

  // Handle skip forward/backward
  const handleSkip = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  }, [currentTime, duration]);

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <SpeakerWaveIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {audioGuide.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {audioGuide.language.toUpperCase()} • {formatTime(audioGuide.totalDuration)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onFavorite}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <HeartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onDownload}
              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Current Segment Info */}
      {currentSegment && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {currentSegment.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {currentSegment.description}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-3 h-3 mr-1" />
            <span>{formatTime(currentSegment.duration)}</span>
            {currentSegment.location && (
              <>
                <span className="mx-2">•</span>
                <span>{currentSegment.location}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="p-4">
        <div 
          ref={progressRef}
          className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSkip(-10)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <BackwardIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => handleSkip(10)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ForwardIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMuteToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMuted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-lg transition-colors ${
                showPlaylist 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Paramètres de lecture</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vitesse de lecture
                </label>
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="border-t border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Liste des segments</h5>
            <div className="space-y-2">
              {audioGuide.segments.map((segment, index) => (
                <button
                  key={segment.id}
                  onClick={() => handleSegmentSelect(segment)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSegment?.id === segment.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{segment.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {segment.description}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(segment.duration)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        muted={isMuted}
      />
    </div>
  );
};

export default AudioGuidePlayer;
