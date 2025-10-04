/**
 * Historical Sites Service - Firebase service for Historical Sites data
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { db } from '@/core/config/firebase.config';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  Timestamp,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { 
  HistoricalSite, 
  VirtualTour, 
  AudioGuide, 
  SiteFilter, 
  SiteSearchResult, 
  SiteStats,
  CulturalRoute,
  SiteVisit,
  SiteEventBooking
} from '../types/historical-sites.types';

const SITES_COLLECTION = 'historicalSites';
const VIRTUAL_TOURS_COLLECTION = 'virtualTours';
const AUDIO_GUIDES_COLLECTION = 'audioGuides';
const CULTURAL_ROUTES_COLLECTION = 'culturalRoutes';
const SITE_VISITS_COLLECTION = 'siteVisits';
const EVENT_BOOKINGS_COLLECTION = 'eventBookings';

export const historicalSitesService = {
  // Sites CRUD operations
  async getAllSites(): Promise<HistoricalSite[]> {
    try {
      const querySnapshot = await getDocs(collection(db, SITES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      } as HistoricalSite));
    } catch (error) {
      console.error('Error fetching all sites:', error);
      throw new Error('Failed to fetch historical sites');
    }
  },

  async getSiteById(id: string): Promise<HistoricalSite | null> {
    try {
      const docRef = doc(db, SITES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          lastUpdated: docSnap.data().lastUpdated?.toDate() || new Date()
        } as HistoricalSite;
      }
      return null;
    } catch (error) {
      console.error('Error fetching site by ID:', error);
      throw new Error('Failed to fetch historical site');
    }
  },

  async getSitesByType(type: string): Promise<HistoricalSite[]> {
    try {
      const q = query(
        collection(db, SITES_COLLECTION),
        where('type', '==', type),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      } as HistoricalSite));
    } catch (error) {
      console.error('Error fetching sites by type:', error);
      throw new Error('Failed to fetch sites by type');
    }
  },

  async getSitesByRegion(region: string): Promise<HistoricalSite[]> {
    try {
      const q = query(
        collection(db, SITES_COLLECTION),
        where('region', '==', region),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      } as HistoricalSite));
    } catch (error) {
      console.error('Error fetching sites by region:', error);
      throw new Error('Failed to fetch sites by region');
    }
  },

  async getFeaturedSites(): Promise<HistoricalSite[]> {
    try {
      const q = query(
        collection(db, SITES_COLLECTION),
        where('isFeatured', '==', true),
        orderBy('averageRating', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      } as HistoricalSite));
    } catch (error) {
      console.error('Error fetching featured sites:', error);
      throw new Error('Failed to fetch featured sites');
    }
  },

  async searchSites(searchQuery: string, filters?: SiteFilter): Promise<SiteSearchResult[]> {
    try {
      let q: Query<DocumentData, DocumentData> | CollectionReference<DocumentData, DocumentData> = collection(db, SITES_COLLECTION);

      // Apply filters
      if (filters?.type && filters.type.length > 0) {
        q = query(q, where('type', 'in', filters.type));
      }
      if (filters?.region && filters.region.length > 0) {
        q = query(q, where('region', 'in', filters.region));
      }
      if (filters?.hasVirtualTour) {
        q = query(q, where('virtualTourUrl', '!=', null));
      }
      if (filters?.hasAudioGuide) {
        q = query(q, where('audioGuideLanguages', '!=', []));
      }
      if (filters?.isAccessible) {
        q = query(q, where('accessibility.wheelchairAccessible', '==', true));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => {
        const data = doc.data() as HistoricalSite;
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          region: data.region,
          city: data.city,
          description: data.description,
          imageUrl: data.images?.[0] || '',
          rating: data.averageRating || 0,
          relevanceScore: 0
        } as SiteSearchResult;
      });

      // Filter by search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        results = results.filter(site => 
          site.name.toLowerCase().includes(lowerQuery) ||
          site.description.toLowerCase().includes(lowerQuery) ||
          site.region.toLowerCase().includes(lowerQuery) ||
          site.city.toLowerCase().includes(lowerQuery)
        );
      }

      // Calculate relevance scores
      results.forEach(site => {
        let score = 0;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (site.name.toLowerCase().includes(lowerQuery)) score += 10;
          if (site.description.toLowerCase().includes(lowerQuery)) score += 5;
          if (site.region.toLowerCase().includes(lowerQuery)) score += 3;
          if (site.city.toLowerCase().includes(lowerQuery)) score += 3;
        }
        score += site.rating * 2;
        site.relevanceScore = score;
      });

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return results;
    } catch (error) {
      console.error('Error searching sites:', error);
      throw new Error('Failed to search historical sites');
    }
  },

  async getSitesNearby(coordinates: [number, number], radiusKm: number = 10): Promise<HistoricalSite[]> {
    try {
      // Note: This is a simplified implementation
      // For production, consider using GeoFire or similar for efficient geospatial queries
      const allSites = await this.getAllSites();
      
      return allSites.filter(site => {
        const distance = this.calculateDistance(coordinates, site.coordinates);
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error fetching nearby sites:', error);
      throw new Error('Failed to fetch nearby sites');
    }
  },

  // Virtual Tours
  async getVirtualToursBySite(siteId: string): Promise<VirtualTour[]> {
    try {
      const q = query(
        collection(db, VIRTUAL_TOURS_COLLECTION),
        where('siteId', '==', siteId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as VirtualTour));
    } catch (error) {
      console.error('Error fetching virtual tours:', error);
      throw new Error('Failed to fetch virtual tours');
    }
  },

  async getAllVirtualTours(): Promise<VirtualTour[]> {
    try {
      const querySnapshot = await getDocs(collection(db, VIRTUAL_TOURS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as VirtualTour));
    } catch (error) {
      console.error('Error fetching all virtual tours:', error);
      throw new Error('Failed to fetch virtual tours');
    }
  },

  // Audio Guides
  async getAudioGuidesBySite(siteId: string): Promise<AudioGuide[]> {
    try {
      const q = query(
        collection(db, AUDIO_GUIDES_COLLECTION),
        where('siteId', '==', siteId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as AudioGuide));
    } catch (error) {
      console.error('Error fetching audio guides:', error);
      throw new Error('Failed to fetch audio guides');
    }
  },

  async getAudioGuideByLanguage(siteId: string, language: string): Promise<AudioGuide | null> {
    try {
      const q = query(
        collection(db, AUDIO_GUIDES_COLLECTION),
        where('siteId', '==', siteId),
        where('language', '==', language)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as AudioGuide;
      }
      return null;
    } catch (error) {
      console.error('Error fetching audio guide by language:', error);
      throw new Error('Failed to fetch audio guide');
    }
  },

  // Cultural Routes
  async getAllCulturalRoutes(): Promise<CulturalRoute[]> {
    try {
      const q = query(
        collection(db, CULTURAL_ROUTES_COLLECTION),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as CulturalRoute));
    } catch (error) {
      console.error('Error fetching cultural routes:', error);
      throw new Error('Failed to fetch cultural routes');
    }
  },

  async getCulturalRouteById(id: string): Promise<CulturalRoute | null> {
    try {
      const docRef = doc(db, CULTURAL_ROUTES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as CulturalRoute;
      }
      return null;
    } catch (error) {
      console.error('Error fetching cultural route by ID:', error);
      throw new Error('Failed to fetch cultural route');
    }
  },

  // Site Visits
  async recordSiteVisit(visit: Omit<SiteVisit, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, SITE_VISITS_COLLECTION), {
        ...visit,
        visitDate: Timestamp.fromDate(visit.visitDate),
        checkInTime: Timestamp.fromDate(visit.checkInTime),
        checkOutTime: visit.checkOutTime ? Timestamp.fromDate(visit.checkOutTime) : null
      });
      return docRef.id;
    } catch (error) {
      console.error('Error recording site visit:', error);
      throw new Error('Failed to record site visit');
    }
  },

  async getSiteVisitsByVisitor(visitorId: string): Promise<SiteVisit[]> {
    try {
      const q = query(
        collection(db, SITE_VISITS_COLLECTION),
        where('visitorId', '==', visitorId),
        orderBy('visitDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        visitDate: doc.data().visitDate?.toDate() || new Date(),
        checkInTime: doc.data().checkInTime?.toDate() || new Date(),
        checkOutTime: doc.data().checkOutTime?.toDate() || undefined
      } as SiteVisit));
    } catch (error) {
      console.error('Error fetching site visits:', error);
      throw new Error('Failed to fetch site visits');
    }
  },

  // Event Bookings
  async bookEvent(booking: Omit<SiteEventBooking, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EVENT_BOOKINGS_COLLECTION), {
        ...booking,
        bookingDate: Timestamp.fromDate(booking.bookingDate),
        eventDate: Timestamp.fromDate(booking.eventDate),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    } catch (error) {
      console.error('Error booking event:', error);
      throw new Error('Failed to book event');
    }
  },

  async getEventBookingsByVisitor(visitorId: string): Promise<SiteEventBooking[]> {
    try {
      const q = query(
        collection(db, EVENT_BOOKINGS_COLLECTION),
        where('visitorId', '==', visitorId),
        orderBy('eventDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        bookingDate: doc.data().bookingDate?.toDate() || new Date(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as SiteEventBooking));
    } catch (error) {
      console.error('Error fetching event bookings:', error);
      throw new Error('Failed to fetch event bookings');
    }
  },

  // Statistics
  async getSiteStats(): Promise<SiteStats> {
    try {
      const [sites, virtualTours, audioGuides] = await Promise.all([
        this.getAllSites(),
        this.getAllVirtualTours(),
        getDocs(collection(db, AUDIO_GUIDES_COLLECTION))
      ]);

      const stats: SiteStats = {
        totalSites: sites.length,
        totalMuseums: sites.filter(s => s.type === 'museum').length,
        totalCulturalCenters: sites.filter(s => s.type === 'cultural_center').length,
        totalArchaeologicalSites: sites.filter(s => s.type === 'archaeological').length,
        totalMonuments: sites.filter(s => s.type === 'monument').length,
        totalRoyalPalaces: sites.filter(s => s.type === 'royal_palace').length,
        totalChiefdoms: sites.filter(s => s.type === 'chiefdom').length,
        totalVirtualTours: virtualTours.length,
        totalAudioGuides: audioGuides.docs.length,
        regionsCovered: new Set(sites.map(s => s.region)).size,
        citiesCovered: new Set(sites.map(s => s.city)).size,
        averageRating: sites.reduce((sum, s) => sum + s.averageRating, 0) / sites.length || 0,
        totalReviews: sites.reduce((sum, s) => sum + s.visitorReviews.length, 0),
        totalVisitors: sites.reduce((sum, s) => sum + s.totalVisitors, 0),
        lastUpdated: new Date()
      };

      return stats;
    } catch (error) {
      console.error('Error fetching site stats:', error);
      throw new Error('Failed to fetch site statistics');
    }
  },

  // Utility functions
  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2[1] - coord1[1]);
    const dLon = this.deg2rad(coord2[0] - coord1[0]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1[1])) * Math.cos(this.deg2rad(coord2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
};
