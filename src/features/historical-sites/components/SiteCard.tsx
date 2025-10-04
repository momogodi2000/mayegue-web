/**
 * Site Card Component - Display card for historical sites
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CameraIcon,
  SpeakerWaveIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { HistoricalSite, TimeSlot } from '../types/historical-sites.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';

interface SiteCardProps {
  site: HistoricalSite;
  onSelect?: (site: HistoricalSite) => void;
  onFavorite?: (site: HistoricalSite) => void;
  onShare?: (site: HistoricalSite) => void;
  showActions?: boolean;
  compact?: boolean;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onSelect,
  onFavorite,
  onShare,
  showActions = true,
  compact = false
}) => {
  const handleCardClick = () => {
    onSelect?.(site);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(site);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(site);
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      museum: 'Musée',
      cultural_center: 'Centre culturel',
      archaeological: 'Site archéologique',
      monument: 'Monument',
      royal_palace: 'Palais royal',
      chiefdom: 'Chefferie'
    };
    return typeLabels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      museum: 'bg-blue-100 text-blue-800',
      cultural_center: 'bg-green-100 text-green-800',
      archaeological: 'bg-orange-100 text-orange-800',
      monument: 'bg-purple-100 text-purple-800',
      royal_palace: 'bg-yellow-100 text-yellow-800',
      chiefdom: 'bg-red-100 text-red-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatOpeningHours = () => {
    if (!site.openingHours) return 'Horaires non disponibles';

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = site.openingHours[today as keyof typeof site.openingHours];

    if (Array.isArray(todayHours)) return 'Horaires spéciaux';
    const timeSlot = todayHours as TimeSlot;
    if (timeSlot?.isClosed) return 'Fermé aujourd\'hui';
    if (timeSlot) return `Ouvert ${timeSlot.open} - ${timeSlot.close}`;
    return 'Horaires non disponibles';
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`;
  };

  if (compact) {
    return (
      <FloatingCard 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex">
          {site.images.length > 0 && (
            <img 
              src={site.images[0]} 
              alt={site.name}
              className="w-24 h-24 object-cover"
            />
          )}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                {site.name}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(site.type)}`}>
                {getTypeLabel(site.type)}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
              <MapPinIcon className="w-3 h-3 mr-1" />
              <span>{site.city}, {site.region}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {site.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {site.virtualTourUrl && (
                  <CameraIcon className="w-3 h-3 text-blue-500" />
                )}
                {site.audioGuideLanguages.length > 0 && (
                  <SpeakerWaveIcon className="w-3 h-3 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      {site.images.length > 0 && (
        <div className="relative">
          <img 
            src={site.images[0]} 
            alt={site.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(site.type)}`}>
              {getTypeLabel(site.type)}
            </span>
          </div>
          {site.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                En vedette
              </span>
            </div>
          )}
          {showActions && (
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={handleFavoriteClick}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
              <button
                onClick={handleShareClick}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <ShareIcon className="w-4 h-4 text-gray-600 hover:text-blue-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {site.name}
          </h4>
          <div className="flex items-center ml-2">
            <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {site.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{site.city}, {site.region}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
          {site.description}
        </p>

        {/* Features */}
        <div className="flex items-center space-x-4 mb-3">
          {site.virtualTourUrl && (
            <div className="flex items-center text-xs text-blue-600">
              <CameraIcon className="w-3 h-3 mr-1" />
              <span>Visite virtuelle</span>
            </div>
          )}
          {site.audioGuideLanguages.length > 0 && (
            <div className="flex items-center text-xs text-green-600">
              <SpeakerWaveIcon className="w-3 h-3 mr-1" />
              <span>Guide audio</span>
            </div>
          )}
          {site.accessibility.wheelchairAccessible && (
            <div className="flex items-center text-xs text-purple-600">
              <EyeIcon className="w-3 h-3 mr-1" />
              <span>Accessible</span>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-3">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span>{formatOpeningHours()}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPrice(site.admissionFees.adult, site.admissionFees.currency)}
          </div>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Voir détails →
          </button>
        </div>

        {/* Contact Info */}
        {(site.phone || site.website) && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {site.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="w-3 h-3 mr-1" />
                  <span>{site.phone}</span>
                </div>
              )}
              {site.website && (
                <div className="flex items-center">
                  <GlobeAltIcon className="w-3 h-3 mr-1" />
                  <span>Site web</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </FloatingCard>
  );
};

export default SiteCard;
