/**
 * Language Map Component - Interactive Map for Linguistic Atlas
 * 
 * This component renders an interactive map showing Cameroonian languages
 * with markers, clustering, and detailed information on hover/click.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
// TODO: Install react-leaflet and leaflet packages to enable map functionality
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import { Icon, LatLngTuple } from 'leaflet';
import { Language, MapViewport, AtlasSettings } from '../types/atlas.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';

// Import Leaflet CSS
// import 'leaflet/dist/leaflet.css';

// Stub types for react-leaflet (TODO: remove when packages are installed)
const MapContainer: any = 'div';
const TileLayer: any = 'div';
const Marker: any = 'div';
const Popup: any = 'div';
const Icon: any = class {};
const useMap = () => ({
  setView: (_center: any, _zoom?: any) => {},
  fitBounds: (_bounds: any) => {},
  getCenter: () => ({ lat: 0, lng: 0 }),
  getZoom: () => 6,
  on: (_event: any, _handler: any) => {},
  off: (_event: any, _handler: any) => {}
});

interface LanguageMapProps {
  languages: Language[];
  filters: any;
  viewport: MapViewport;
  onLanguageSelect: (language: Language) => void;
  onViewportChange: (viewport: MapViewport) => void;
  settings: AtlasSettings;
}

// Custom marker component with language-specific styling
const LanguageMarker: React.FC<{
  language: Language;
  onSelect: (language: Language) => void;
  settings: AtlasSettings;
}> = ({ language, onSelect, settings }) => {
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

// Map viewport controller
const MapController: React.FC<{
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
}> = ({ viewport, onViewportChange }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([viewport.center[0], viewport.center[1]], viewport.zoom);
  }, [viewport, map]);

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onViewportChange({
        center: [center.lat, center.lng],
        zoom
      });
    };

    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
    };
  }, [map, onViewportChange]);

  return null;
};

const LanguageMap: React.FC<LanguageMapProps> = ({
  languages,
  filters,
  viewport,
  onLanguageSelect,
  onViewportChange,
  settings
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  // Filter languages based on settings
  const filteredLanguages = languages.filter(language => {
    if (settings.showEndangeredOnly) {
      return language.status === 'endangered' ||
             language.status === 'critically_endangered' ||
             language.status === 'threatened';
    }
    return true;
  });

  const handleMapReady = useCallback(() => {
    setMapLoaded(true);
  }, []);

  // Show placeholder if no languages or map library not available
  if (languages.length === 0) {
    return (
      <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carte interactive
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Les langues apparaîtront ici sur une carte interactive.
          </p>
        </div>
      </div>
    );
  }

  // Show map placeholder since react-leaflet is not installed yet
  return (
    <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <path d="M100 100 L700 100 L700 500 L100 500 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="10,5"/>
          <circle cx="400" cy="300" r="150" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M250 250 L350 350 L450 250 L550 350" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <div className="text-center z-10 p-8 max-w-2xl">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Carte Interactive du Cameroun
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {filteredLanguages.length} {filteredLanguages.length === 1 ? 'langue' : 'langues'} disponibles
        </p>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-6 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            La carte interactive sera disponible une fois les bibliothèques cartographiques installées.
            En attendant, voici les langues disponibles :
          </p>
          <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto">
            {filteredLanguages.slice(0, 12).map(lang => (
              <button
                key={lang.id}
                onClick={() => onLanguageSelect(lang)}
                className="text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {lang.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang.region} - {lang.speakers.toLocaleString()} locuteurs
                </div>
              </button>
            ))}
          </div>
          {filteredLanguages.length > 12 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Et {filteredLanguages.length - 12} autres langues...
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Cliquez sur une langue pour voir les détails</span>
        </div>
      </div>
    </div>
  );

  // Original map code (currently unreachable due to stub libraries)
  if (!mapLoaded) {
    return (
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement de la carte...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <MapContainer
        ref={mapRef}
        center={[viewport.center[0], viewport.center[1]]}
        zoom={viewport.zoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={handleMapReady}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          viewport={viewport} 
          onViewportChange={onViewportChange} 
        />

        {filteredLanguages.map((language) => (
          <LanguageMarker
            key={language.id}
            language={language}
            onSelect={onLanguageSelect}
            settings={settings}
          />
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Légende
        </h4>
        <div className="space-y-2 text-sm">
          {settings.colorScheme === 'family' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Bantou</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Soudanique</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Tchadique</span>
              </div>
            </>
          )}
          {settings.colorScheme === 'status' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Vital</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Menacé</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>En danger</span>
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Taille = Nombre de locuteurs
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={() => onViewportChange({
            center: [12.3547, 7.3697], // Cameroon center
            zoom: 6
          })}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Recentrer sur le Cameroun"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LanguageMap;
