/**
 * Story Card Component - Display card for stories
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { BookOpenIcon, SpeakerWaveIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { Story } from '../types/encyclopedia.types';

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'folktale': 'bg-blue-100 text-blue-800',
      'legend': 'bg-purple-100 text-purple-800',
      'myth': 'bg-green-100 text-green-800',
      'history': 'bg-orange-100 text-orange-800',
      'moral': 'bg-pink-100 text-pink-800',
      'creation': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'folktale': 'Conte populaire',
      'legend': 'Légende',
      'myth': 'Mythe',
      'history': 'Histoire',
      'moral': 'Morale',
      'creation': 'Création'
    };
    return labels[type] || type;
  };

  return (
    <div
      onClick={() => onSelect(story)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {story.images && story.images.length > 0 && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
          <img
            src={story.images[0]}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {story.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {story.nativeTitle}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(story.type)}`}>
              {getTypeLabel(story.type)}
            </span>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center space-x-2 mb-4">
          <LanguageIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {story.language}
          </span>
          {story.translation && (
            <span className="text-xs text-gray-500">
              (traduit)
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {story.description}
        </p>

        {/* Characters */}
        {story.characters && story.characters.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personnages
            </h4>
            <div className="flex flex-wrap gap-1">
              {story.characters.slice(0, 3).map((character, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {character.name}
                </span>
              ))}
              {story.characters.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{story.characters.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Themes */}
        {story.themes && story.themes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thèmes
            </h4>
            <div className="flex flex-wrap gap-1">
              {story.themes.slice(0, 3).map((theme, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {theme}
                </span>
              ))}
              {story.themes.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{story.themes.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Moral */}
        {story.moral && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Morale
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {story.moral}
            </p>
          </div>
        )}

        {/* Media indicators */}
        <div className="flex items-center space-x-4 mb-4">
          {story.audio && story.audio.length > 0 && (
            <div className="flex items-center space-x-1">
              <SpeakerWaveIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Audio
              </span>
            </div>
          )}
          {story.videos && story.videos.length > 0 && (
            <div className="flex items-center space-x-1">
              <BookOpenIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Vidéo
              </span>
            </div>
          )}
        </div>

        {/* Cultural significance */}
        {story.culturalSignificance && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Signification culturelle
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {story.culturalSignificance}
            </p>
          </div>
        )}

        {/* Variations */}
        {story.variations && story.variations.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {story.variations.length} variation{story.variations.length > 1 ? 's' : ''} disponible{story.variations.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Lire l'histoire
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
