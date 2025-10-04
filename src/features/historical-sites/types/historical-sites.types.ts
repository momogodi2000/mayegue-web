/**
 * Historical Sites Types - TypeScript interfaces for Historical Sites module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface HistoricalSite {
  id: string;
  name: string;
  description: string;
  type: 'museum' | 'cultural_center' | 'archaeological' | 'monument' | 'royal_palace' | 'chiefdom';
  region: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: OpeningHours;
  admissionFees: AdmissionFees;
  images: string[];
  virtualTourUrl?: string;
  audioGuideLanguages: string[];
  culturalSignificance: string;
  historicalPeriod: string;
  architecturalStyle?: string;
  materials: string[];
  constructionYear?: number;
  restorationHistory: RestorationEvent[];
  events: SiteEvent[];
  accessibility: AccessibilityInfo;
  facilities: SiteFacilities;
  nearbyAttractions: NearbyAttraction[];
  visitorReviews: VisitorReview[];
  averageRating: number;
  totalVisitors: number;
  lastUpdated: Date;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

export interface OpeningHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
  holidays?: TimeSlot;
  specialHours?: SpecialHours[];
}

export interface TimeSlot {
  open: string; // HH:MM format
  close: string; // HH:MM format
  isClosed: boolean;
}

export interface SpecialHours {
  date: string; // YYYY-MM-DD format
  open: string;
  close: string;
  description: string;
}

export interface AdmissionFees {
  adult: number;
  child: number;
  student: number;
  senior: number;
  group: number;
  currency: string;
  freeDays?: string[];
  discounts?: Discount[];
}

export interface Discount {
  type: string;
  percentage: number;
  conditions: string;
}

export interface RestorationEvent {
  year: number;
  description: string;
  organization: string;
  cost?: number;
  duration?: string;
  images?: string[];
}

export interface SiteEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: string;
  type: 'exhibition' | 'workshop' | 'festival' | 'ceremony' | 'tour';
  capacity: number;
  price: number;
  organizer: string;
  contactInfo: string;
  requirements?: string[];
  images?: string[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  elevatorAvailable: boolean;
  accessibleParking: boolean;
  accessibleRestrooms: boolean;
  signLanguageGuide: boolean;
  brailleGuide: boolean;
  audioGuide: boolean;
  visualImpairmentSupport: boolean;
  hearingImpairmentSupport: boolean;
  mobilitySupport: boolean;
  notes: string;
}

export interface SiteFacilities {
  parking: boolean;
  restrooms: boolean;
  giftShop: boolean;
  restaurant: boolean;
  cafe: boolean;
  wifi: boolean;
  guidedTours: boolean;
  audioGuide: boolean;
  photographyAllowed: boolean;
  videoRecordingAllowed: boolean;
  cloakroom: boolean;
  firstAid: boolean;
  security: boolean;
  airConditioning: boolean;
  heating: boolean;
  notes: string;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  type: 'historical' | 'cultural' | 'natural' | 'commercial';
  distance: number; // in kilometers
  coordinates: [number, number];
  description: string;
  imageUrl?: string;
}

export interface VisitorReview {
  id: string;
  visitorName: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  visitDate: Date;
  helpfulVotes: number;
  images?: string[];
  verifiedVisit: boolean;
  language: string;
}

export interface VirtualTour {
  id: string;
  siteId: string;
  title: string;
  description: string;
  type: '360_photos' | '3d_model' | 'vr_experience' | 'video_walkthrough';
  thumbnailUrl: string;
  tourUrl: string;
  duration: number; // in minutes
  hotspots: TourHotspot[];
  audioNarration: AudioNarration[];
  languages: string[];
  isInteractive: boolean;
  requiresVR: boolean;
  quality: 'standard' | 'hd' | '4k' | '8k';
  createdAt: Date;
  updatedAt: Date;
}

export interface TourHotspot {
  id: string;
  coordinates: [number, number, number]; // 3D coordinates
  title: string;
  description: string;
  type: 'info' | 'image' | 'video' | 'audio' | 'link';
  content: string;
  icon: string;
}

export interface AudioNarration {
  language: string;
  audioUrl: string;
  transcript: string;
  duration: number;
  narrator: string;
  quality: 'standard' | 'hd';
}

export interface AudioGuide {
  id: string;
  siteId: string;
  language: string;
  title: string;
  description: string;
  totalDuration: number;
  segments: AudioGuideSegment[];
  downloadUrl: string;
  fileSize: number;
  format: 'mp3' | 'wav' | 'aac';
  quality: 'standard' | 'hd';
  narrator: string;
  backgroundMusic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioGuideSegment {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  transcript: string;
  location: string;
  order: number;
  images?: string[];
  relatedArtifacts?: string[];
}

export interface SiteFilter {
  type?: string[];
  region?: string[];
  city?: string[];
  hasVirtualTour?: boolean;
  hasAudioGuide?: boolean;
  isAccessible?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  facilities?: string[];
  tags?: string[];
}

export interface SiteSearchResult {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
  description: string;
  imageUrl: string;
  rating: number;
  distance?: number;
  relevanceScore: number;
}

export interface SiteStats {
  totalSites: number;
  totalMuseums: number;
  totalCulturalCenters: number;
  totalArchaeologicalSites: number;
  totalMonuments: number;
  totalRoyalPalaces: number;
  totalChiefdoms: number;
  totalVirtualTours: number;
  totalAudioGuides: number;
  regionsCovered: number;
  citiesCovered: number;
  averageRating: number;
  totalReviews: number;
  totalVisitors: number;
  lastUpdated: Date;
}

export interface SiteVisit {
  id: string;
  siteId: string;
  visitorId: string;
  visitDate: Date;
  duration: number; // in minutes
  rating?: number;
  review?: string;
  photos?: string[];
  checkInTime: Date;
  checkOutTime?: Date;
  groupSize: number;
  tourType: 'self_guided' | 'guided' | 'audio_guide' | 'virtual';
  cost: number;
  currency: string;
  feedback?: string;
  recommendations?: string[];
}

export interface CulturalRoute {
  id: string;
  name: string;
  description: string;
  region: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  distance: number; // in kilometers
  sites: string[]; // Site IDs
  theme: string;
  highlights: string[];
  images: string[];
  mapUrl?: string;
  audioGuide?: string;
  price: number;
  currency: string;
  includes: string[];
  excludes: string[];
  requirements: string[];
  bestTimeToVisit: string[];
  transportation: string[];
  accommodation?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteEventBooking {
  id: string;
  eventId: string;
  visitorId: string;
  bookingDate: Date;
  eventDate: Date;
  numberOfPeople: number;
  totalCost: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Constants
export const SITE_TYPES = [
  'museum',
  'cultural_center',
  'archaeological',
  'monument',
  'royal_palace',
  'chiefdom'
] as const;

export const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
] as const;

export const VIRTUAL_TOUR_TYPES = [
  '360_photos',
  '3d_model',
  'vr_experience',
  'video_walkthrough'
] as const;

export const AUDIO_GUIDE_LANGUAGES = [
  'fr',
  'en',
  'ar',
  'de',
  'es',
  'pt',
  'zh',
  'ja',
  'ko',
  'ru'
] as const;
