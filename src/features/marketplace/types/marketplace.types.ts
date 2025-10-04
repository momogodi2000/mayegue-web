/**
 * Marketplace Types - TypeScript interfaces for Marketplace module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'artisanat' | 'cours_prives' | 'experiences_culturelles' | 'livres' | 'objets_art';
  subcategory: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  images: string[];
  videos?: string[];
  specifications: ProductSpecification[];
  availability: ProductAvailability;
  shipping: ShippingInfo;
  tags: string[];
  language: string;
  culturalGroup: string;
  region: string;
  materials?: string[];
  techniques?: string[];
  dimensions?: ProductDimensions;
  weight?: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  isDigital: boolean;
  digitalDelivery?: DigitalDeliveryInfo;
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  views: number;
  favorites: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductAvailability {
  inStock: boolean;
  quantity: number;
  maxQuantity?: number;
  preOrder: boolean;
  preOrderDate?: Date;
  backorder: boolean;
}

export interface ShippingInfo {
  freeShipping: boolean;
  shippingCost: number;
  shippingTime: string;
  shippingMethods: ShippingMethod[];
  weight: number;
  dimensions: ProductDimensions;
  restrictions: string[];
}

export interface ShippingMethod {
  name: string;
  cost: number;
  estimatedDays: number;
  description: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface DigitalDeliveryInfo {
  downloadUrl: string;
  accessDuration: number; // in days
  maxDownloads: number;
  fileSize: number;
  fileFormat: string;
  instructions: string;
}

export interface ProductReview {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio: string;
  location: string;
  region: string;
  languages: string[];
  culturalGroups: string[];
  specialties: string[];
  experience: string;
  certifications: Certification[];
  socialMedia: SocialMediaLinks;
  businessInfo: BusinessInfo;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalProducts: number;
  joinDate: Date;
  isVerified: boolean;
  isActive: boolean;
  responseTime: string;
  returnPolicy: string;
  shippingPolicy: string;
  paymentMethods: string[];
  bankAccount?: BankAccount;
  taxInfo?: TaxInfo;
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  credentialId: string;
  imageUrl?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: 'individual' | 'cooperative' | 'association' | 'company';
  registrationNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  swiftCode?: string;
  iban?: string;
}

export interface TaxInfo {
  taxId: string;
  taxType: 'individual' | 'business';
  taxRate: number;
  exemptions: string[];
}

export interface PrivateLesson {
  id: string;
  title: string;
  description: string;
  language: string;
  culturalGroup: string;
  teacherId: string;
  teacherName: string;
  teacherRating: number;
  teacherAvatar?: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  format: 'online' | 'in_person' | 'hybrid';
  maxStudents: number;
  minStudents: number;
  currentStudents: number;
  schedule: LessonSchedule[];
  materials: string[];
  requirements: string[];
  objectives: string[];
  reviews: LessonReview[];
  averageRating: number;
  totalReviews: number;
  totalLessons: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  isRecurring: boolean;
  nextOccurrence?: Date;
}

export interface LessonReview {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  lessonDate: Date;
  helpfulVotes: number;
  createdAt: Date;
}

export interface CulturalExperience {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'tour' | 'ceremony' | 'festival' | 'cooking_class' | 'craft_workshop';
  organizerId: string;
  organizerName: string;
  organizerRating: number;
  organizerAvatar?: string;
  price: number;
  currency: string;
  duration: number; // in hours
  maxParticipants: number;
  minParticipants: number;
  currentParticipants: number;
  location: ExperienceLocation;
  schedule: ExperienceSchedule[];
  includes: string[];
  excludes: string[];
  requirements: string[];
  materials: string[];
  language: string;
  culturalGroup: string;
  region: string;
  images: string[];
  videos?: string[];
  reviews: ExperienceReview[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceLocation {
  name: string;
  address: string;
  city: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
  isOnline: boolean;
  meetingPoint?: string;
  transportation?: string;
}

export interface ExperienceSchedule {
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  availableSpots: number;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface ExperienceReview {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  rating: number;
  comment: string;
  experienceDate: Date;
  helpfulVotes: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  phone?: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  phone?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  addedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  price: number;
  currency: string;
  addedAt: Date;
}

export interface MarketplaceFilter {
  category?: string[];
  subcategory?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  currency?: string;
  region?: string[];
  culturalGroup?: string[];
  language?: string[];
  sellerRating?: {
    min: number;
    max: number;
  };
  condition?: string[];
  availability?: string[];
  shipping?: string[];
  tags?: string[];
  materials?: string[];
  techniques?: string[];
  isDigital?: boolean;
  isFeatured?: boolean;
  hasDiscount?: boolean;
}

export interface MarketplaceSearchResult {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  sellerName: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  region: string;
  culturalGroup: string;
  relevanceScore: number;
}

export interface MarketplaceStats {
  totalProducts: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topCategories: CategoryStats[];
  topRegions: RegionStats[];
  topSellers: SellerStats[];
  recentActivity: ActivityItem[];
  lastUpdated: Date;
}

export interface CategoryStats {
  category: string;
  count: number;
  revenue: number;
  growth: number;
}

export interface RegionStats {
  region: string;
  count: number;
  revenue: number;
  growth: number;
}

export interface SellerStats {
  sellerId: string;
  sellerName: string;
  sales: number;
  revenue: number;
  rating: number;
}

export interface ActivityItem {
  id: string;
  type: 'new_product' | 'new_seller' | 'new_order' | 'new_review';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

export interface Commission {
  id: string;
  orderId: string;
  sellerId: string;
  productId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  gateway: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Refund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: Date;
  createdAt: Date;
}

// Constants
export const PRODUCT_CATEGORIES = [
  'artisanat',
  'cours_prives',
  'experiences_culturelles',
  'livres',
  'objets_art'
] as const;

export const ARTISANAT_SUBCATEGORIES = [
  'poterie',
  'tissage',
  'sculpture',
  'bijoux',
  'tapis',
  'paniers',
  'masques',
  'instruments_musique',
  'textiles',
  'bois'
] as const;

export const EXPERIENCE_TYPES = [
  'workshop',
  'tour',
  'ceremony',
  'festival',
  'cooking_class',
  'craft_workshop'
] as const;

export const LESSON_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'all'
] as const;

export const LESSON_FORMATS = [
  'online',
  'in_person',
  'hybrid'
] as const;

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const;

export const PAYMENT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'refunded'
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
