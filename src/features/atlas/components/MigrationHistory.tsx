/**
 * Migration History Component - Display historical language migrations
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useMemo } from 'react';
import { MigrationEvent, Language } from '../types/atlas.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface MigrationHistoryProps {
  language?: Language;
  events: MigrationEvent[];
  onEventSelect?: (event: MigrationEvent) => void;
}

const MigrationHistory: React.FC<MigrationHistoryProps> = ({
  language,
  events,
  onEventSelect
}) => {
  const [sortBy, setSortBy] = useState<'period' | 'impact'>('period');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const uniquePeriods = useMemo(() => {
    const periods = [...new Set(events.map(event => event.period))];
    return periods.sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(event => event.period === selectedPeriod);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'period') {
        return a.period.localeCompare(b.period);
      } else {
        return b.impact.localeCompare(a.impact);
      }
    });
  }, [events, selectedPeriod, sortBy]);

  const getPeriodColor = (period: string): string => {
    const periodLower = period.toLowerCase();
    
    if (periodLower.includes('ancien') || periodLower.includes('préhistorique')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
    if (periodLower.includes('moyen')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    if (periodLower.includes('moderne') || periodLower.includes('contemporain')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    if (periodLower.includes('récent')) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getImpactIcon = (impact: string) => {
    const impactLower = impact.toLowerCase();
    
    if (impactLower.includes('majeur') || impactLower.includes('important')) {
      return '🔴';
    }
    if (impactLower.includes('modéré') || impactLower.includes('significatif')) {
      return '🟡';
    }
    if (impactLower.includes('mineur') || impactLower.includes('local')) {
      return '🟢';
    }
    
    return '🔵';
  };

  const getImpactColor = (impact: string): string => {
    const impactLower = impact.toLowerCase();
    
    if (impactLower.includes('majeur') || impactLower.includes('important')) {
      return 'text-red-600 dark:text-red-400';
    }
    if (impactLower.includes('modéré') || impactLower.includes('significatif')) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    if (impactLower.includes('mineur') || impactLower.includes('local')) {
      return 'text-green-600 dark:text-green-400';
    }
    
    return 'text-blue-600 dark:text-blue-400';
  };

  const formatCoordinates = (lat: number, lng: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
  };

  const calculateDistance = (from: { lat: number; lng: number }, to: { lat: number; lng: number }): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (events.length === 0) {
    return (
      <FloatingCard className="card p-6">
        <div className="text-center py-8">
          <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune migration documentée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language 
              ? `Aucune donnée de migration historique disponible pour ${language.name}.`
              : 'Aucune donnée de migration historique disponible pour le moment.'
            }
          </p>
        </div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ArrowRightIcon className="w-5 h-5 mr-2 text-blue-500" />
          Histoire des Migrations
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Réduire
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Étendre
            </>
          )}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {events.length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Événements</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {uniquePeriods.length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Périodes</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(events.reduce((sum, event) => 
              sum + calculateDistance(event.from, event.to), 0
            ) / events.length)}km
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Distance moy.</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Période:</span>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">Toutes les périodes</option>
          {uniquePeriods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
        
        <span className="text-sm text-gray-600 dark:text-gray-400">Trier par:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="period">Période</option>
          <option value="impact">Impact</option>
        </select>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.slice(0, isExpanded ? filteredEvents.length : 5).map(event => (
          <div
            key={event.id}
            onClick={() => onEventSelect?.(event)}
            className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors ${
              onEventSelect ? 'hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-lg">{getImpactIcon(event.impact)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPeriodColor(event.period)}`}>
                    {event.period}
                  </span>
                  <span className={`text-sm font-medium ${getImpactColor(event.impact)}`}>
                    {event.impact}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>
                      <strong>De:</strong> {formatCoordinates(event.from.lat, event.from.lng)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRightIcon className="w-4 h-4" />
                    <span>
                      <strong>À:</strong> {formatCoordinates(event.to.lat, event.to.lng)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>
                      <strong>Distance:</strong> {Math.round(calculateDistance(event.from, event.to))} km
                    </span>
                  </div>
                  {event.sources && event.sources.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        <strong>Sources:</strong> {event.sources.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isExpanded && filteredEvents.length > 5 && (
          <div className="text-center pt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir {filteredEvents.length - 5} événements supplémentaires
            </button>
          </div>
        )}
      </div>

      {/* Timeline Visualization */}
      {isExpanded && uniquePeriods.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Chronologie des Migrations
          </h4>
          <div className="space-y-3">
            {uniquePeriods.map(period => {
              const periodEvents = events.filter(event => event.period === period);
              return (
                <div key={period} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPeriodColor(period)}`}>
                      {period}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(periodEvents.length / Math.max(...uniquePeriods.map(p => events.filter(e => e.period === p).length))) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {periodEvents.length} événement{periodEvents.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources */}
      {events.some(event => event.sources && event.sources.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Sources et Références
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              Les données de migration sont basées sur des recherches linguistiques, 
              archéologiques et historiques. Consultez les sources individuelles pour 
              plus de détails sur chaque événement.
            </p>
          </div>
        </div>
      )}
    </FloatingCard>
  );
};

export default MigrationHistory;