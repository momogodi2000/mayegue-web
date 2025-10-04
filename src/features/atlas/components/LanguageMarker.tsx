/**
 * Language Marker Component - Individual language marker for the map
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Language, AtlasSettings } from '../types/atlas.types';

interface LanguageMarkerProps {
  language: Language;
  onSelect: (language: Language) => void;
  settings: AtlasSettings;
}

const LanguageMarker: React.FC<LanguageMarkerProps> = ({
  language,
  onSelect,
  settings
}) => {
  const getMarkerColor = (language: Language, settings: AtlasSettings) => {
    switch (settings.colorScheme) {
      case 'family':
        return getFamilyColor(language.family.id);
      case 'status':
        return getStatusColor(language.status);
      case 'speakers':
        return getSpeakerColor(language.speakers);
      case 'endangered':
        return getEndangeredColor(language.endangeredLevel || 'safe');
      default:
        return '#3B82F6';
    }
  };

  const getFamilyColor = (familyId: string) => {
    const colors: Record<string, string> = {
      'bantu': '#3B82F6',
      'sudanic': '#10B981',
      'chadic': '#F59E0B',
      'afro-asiatic': '#EF4444',
      'niger-congo': '#8B5CF6'
    };
    return colors[familyId] || '#6B7280';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'vital': '#10B981',
      'threatened': '#F59E0B',
      'endangered': '#EF4444',
      'critically_endangered': '#DC2626',
      'extinct': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getSpeakerColor = (speakers: number) => {
    if (speakers > 1000000) return '#10B981';
    if (speakers > 100000) return '#3B82F6';
    if (speakers > 10000) return '#F59E0B';
    if (speakers > 1000) return '#EF4444';
    return '#6B7280';
  };

  const getEndangeredColor = (level: string) => {
    const colors: Record<string, string> = {
      'safe': '#10B981',
      'vulnerable': '#F59E0B',
      'definitely_endangered': '#EF4444',
      'severely_endangered': '#DC2626',
      'critically_endangered': '#991B1B',
      'extinct': '#6B7280'
    };
    return colors[level] || '#6B7280';
  };

  const color = getMarkerColor(language, settings);
  const size = Math.max(8, Math.min(20, Math.log10(language.speakers + 1) * 3));

  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });

  return (
    <Marker
      position={[language.coordinates.lat, language.coordinates.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect(language),
      }}
    >
      <Popup maxWidth={300} className="language-popup">
        <div className="p-2">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {language.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Nom natif:</strong> {language.nativeName}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Famille:</strong> {language.family.name}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Région:</strong> {language.region}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Locuteurs:</strong> {language.speakers.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Statut:</strong> 
            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
              language.status === 'vital' ? 'bg-green-100 text-green-800' :
              language.status === 'threatened' ? 'bg-yellow-100 text-yellow-800' :
              language.status === 'endangered' ? 'bg-orange-100 text-orange-800' :
              language.status === 'critically_endangered' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {language.status === 'vital' ? 'Vital' :
               language.status === 'threatened' ? 'Menacé' :
               language.status === 'endangered' ? 'En danger' :
               language.status === 'critically_endangered' ? 'Critiquement en danger' :
               'Éteint'}
            </span>
          </p>
          {language.description && (
            <p className="text-sm text-gray-700 mt-2">
              {language.description.length > 150 
                ? `${language.description.substring(0, 150)}...` 
                : language.description}
            </p>
          )}
          <button
            onClick={() => onSelect(language)}
            className="mt-3 w-full bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
          >
            Voir les détails
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default LanguageMarker;
