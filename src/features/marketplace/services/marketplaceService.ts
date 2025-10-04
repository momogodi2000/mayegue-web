/**
 * Marketplace Service - Firebase service for Marketplace data
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
  updateDoc,
  Timestamp,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { 
  Product, 
  Seller, 
  PrivateLesson, 
  CulturalExperience, 
  Order, 
  Cart, 
  Wishlist,
  MarketplaceFilter, 
  MarketplaceSearchResult, 
  MarketplaceStats,
  PRODUCT_CATEGORIES,
  CAMEROON_REGIONS
} from '../types/marketplace.types';

const PRODUCTS_COLLECTION = 'marketplace_products';
const SELLERS_COLLECTION = 'marketplace_sellers';
const LESSONS_COLLECTION = 'marketplace_lessons';
const EXPERIENCES_COLLECTION = 'marketplace_experiences';
const ORDERS_COLLECTION = 'marketplace_orders';
const CARTS_COLLECTION = 'marketplace_carts';
const WISHLISTS_COLLECTION = 'marketplace_wishlists';

export const marketplaceService = {
  // Products CRUD operations
  async getAllProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate() || undefined
      } as Product));
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          publishedAt: docSnap.data().publishedAt?.toDate() || undefined
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate() || undefined
      } as Product));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  },

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('sellerId', '==', sellerId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate() || undefined
      } as Product));
    } catch (error) {
      console.error('Error fetching products by seller:', error);
      throw new Error('Failed to fetch products by seller');
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('averageRating', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate() || undefined
      } as Product));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  },

  async searchProducts(searchQuery: string, filters?: MarketplaceFilter): Promise<MarketplaceSearchResult[]> {
    try {
      let q: Query<DocumentData, DocumentData> | CollectionReference<DocumentData, DocumentData> = query(collection(db, PRODUCTS_COLLECTION), where('isActive', '==', true));

      // Apply filters
      if (filters?.category && filters.category.length > 0) {
        q = query(q, where('category', 'in', filters.category));
      }
      if (filters?.region && filters.region.length > 0) {
        q = query(q, where('region', 'in', filters.region));
      }
      if (filters?.culturalGroup && filters.culturalGroup.length > 0) {
        q = query(q, where('culturalGroup', 'in', filters.culturalGroup));
      }
      if (filters?.isFeatured) {
        q = query(q, where('isFeatured', '==', true));
      }
      if (filters?.hasDiscount) {
        q = query(q, where('discount', '>', 0));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          title: data.title,
          category: data.category,
          subcategory: data.subcategory,
          sellerName: data.sellerName,
          price: data.price,
          currency: data.currency,
          imageUrl: data.images?.[0] || '',
          rating: data.averageRating || 0,
          region: data.region,
          culturalGroup: data.culturalGroup,
          relevanceScore: 0
        } as MarketplaceSearchResult;
      });

      // Filter by search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        results = results.filter(product => 
          product.title.toLowerCase().includes(lowerQuery) ||
          product.sellerName.toLowerCase().includes(lowerQuery) ||
          product.region.toLowerCase().includes(lowerQuery) ||
          product.culturalGroup.toLowerCase().includes(lowerQuery)
        );
      }

      // Apply price filter
      if (filters?.priceRange) {
        results = results.filter(product => 
          product.price >= filters.priceRange!.min && 
          product.price <= filters.priceRange!.max
        );
      }

      // Calculate relevance scores
      results.forEach(product => {
        let score = 0;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (product.title.toLowerCase().includes(lowerQuery)) score += 10;
          if (product.sellerName.toLowerCase().includes(lowerQuery)) score += 5;
          if (product.region.toLowerCase().includes(lowerQuery)) score += 3;
          if (product.culturalGroup.toLowerCase().includes(lowerQuery)) score += 3;
        }
        score += product.rating * 2;
        product.relevanceScore = score;
      });

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  },

  // Sellers CRUD operations
  async getAllSellers(): Promise<Seller[]> {
    try {
      const querySnapshot = await getDocs(collection(db, SELLERS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinDate: doc.data().joinDate?.toDate() || new Date()
      } as Seller));
    } catch (error) {
      console.error('Error fetching all sellers:', error);
      throw new Error('Failed to fetch sellers');
    }
  },

  async getSellerById(id: string): Promise<Seller | null> {
    try {
      const docRef = doc(db, SELLERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          joinDate: docSnap.data().joinDate?.toDate() || new Date()
        } as Seller;
      }
      return null;
    } catch (error) {
      console.error('Error fetching seller by ID:', error);
      throw new Error('Failed to fetch seller');
    }
  },

  async getTopSellers(): Promise<Seller[]> {
    try {
      const q = query(
        collection(db, SELLERS_COLLECTION),
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        orderBy('totalSales', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinDate: doc.data().joinDate?.toDate() || new Date()
      } as Seller));
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      throw new Error('Failed to fetch top sellers');
    }
  },

  // Private Lessons CRUD operations
  async getAllLessons(): Promise<PrivateLesson[]> {
    try {
      const querySnapshot = await getDocs(collection(db, LESSONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as PrivateLesson));
    } catch (error) {
      console.error('Error fetching all lessons:', error);
      throw new Error('Failed to fetch lessons');
    }
  },

  async getLessonById(id: string): Promise<PrivateLesson | null> {
    try {
      const docRef = doc(db, LESSONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as PrivateLesson;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lesson by ID:', error);
      throw new Error('Failed to fetch lesson');
    }
  },

  async getLessonsByLanguage(language: string): Promise<PrivateLesson[]> {
    try {
      const q = query(
        collection(db, LESSONS_COLLECTION),
        where('language', '==', language),
        where('isActive', '==', true),
        orderBy('averageRating', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as PrivateLesson));
    } catch (error) {
      console.error('Error fetching lessons by language:', error);
      throw new Error('Failed to fetch lessons by language');
    }
  },

  // Cultural Experiences CRUD operations
  async getAllExperiences(): Promise<CulturalExperience[]> {
    try {
      const querySnapshot = await getDocs(collection(db, EXPERIENCES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as CulturalExperience));
    } catch (error) {
      console.error('Error fetching all experiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  },

  async getExperienceById(id: string): Promise<CulturalExperience | null> {
    try {
      const docRef = doc(db, EXPERIENCES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as CulturalExperience;
      }
      return null;
    } catch (error) {
      console.error('Error fetching experience by ID:', error);
      throw new Error('Failed to fetch experience');
    }
  },

  async getExperiencesByType(type: string): Promise<CulturalExperience[]> {
    try {
      const q = query(
        collection(db, EXPERIENCES_COLLECTION),
        where('type', '==', type),
        where('isActive', '==', true),
        orderBy('averageRating', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as CulturalExperience));
    } catch (error) {
      console.error('Error fetching experiences by type:', error);
      throw new Error('Failed to fetch experiences by type');
    }
  },

  // Cart operations
  async getCart(userId: string): Promise<Cart | null> {
    try {
      const q = query(
        collection(db, CARTS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Cart;
      }
      return null;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw new Error('Failed to fetch cart');
    }
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProductById(productId);
      if (!product) throw new Error('Product not found');

      const cart = await this.getCart(userId);
      const cartItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        productTitle: product.title,
        productImage: product.images[0] || '',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        currency: product.currency,
        addedAt: new Date()
      };

      if (cart) {
        // Update existing cart
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += quantity;
          cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].unitPrice * cart.items[existingItemIndex].quantity;
        } else {
          cart.items.push(cartItem);
        }
        
        // Recalculate totals
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.total = cart.subtotal + cart.shipping + cart.tax - cart.discount;
        cart.updatedAt = new Date();

        await updateDoc(doc(db, CARTS_COLLECTION, cart.id), {
          items: cart.items,
          subtotal: cart.subtotal,
          total: cart.total,
          updatedAt: Timestamp.fromDate(cart.updatedAt)
        });
      } else {
        // Create new cart
        const newCart = {
          userId,
          items: [cartItem],
          subtotal: cartItem.totalPrice,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: cartItem.totalPrice,
          currency: product.currency,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await addDoc(collection(db, CARTS_COLLECTION), {
          ...newCart,
          createdAt: Timestamp.fromDate(newCart.createdAt),
          updatedAt: Timestamp.fromDate(newCart.updatedAt)
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add to cart');
    }
  },

  async removeFromCart(userId: string, productId: string): Promise<void> {
    try {
      const cart = await this.getCart(userId);
      if (!cart) return;

      cart.items = cart.items.filter(item => item.productId !== productId);
      cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      cart.total = cart.subtotal + cart.shipping + cart.tax - cart.discount;
      cart.updatedAt = new Date();

      await updateDoc(doc(db, CARTS_COLLECTION, cart.id), {
        items: cart.items,
        subtotal: cart.subtotal,
        total: cart.total,
        updatedAt: Timestamp.fromDate(cart.updatedAt)
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove from cart');
    }
  },

  // Wishlist operations
  async getWishlist(userId: string): Promise<Wishlist | null> {
    try {
      const q = query(
        collection(db, WISHLISTS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Wishlist;
      }
      return null;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw new Error('Failed to fetch wishlist');
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<void> {
    try {
      const product = await this.getProductById(productId);
      if (!product) throw new Error('Product not found');

      const wishlist = await this.getWishlist(userId);
      const wishlistItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        productTitle: product.title,
        productImage: product.images[0] || '',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        price: product.price,
        currency: product.currency,
        addedAt: new Date()
      };

      if (wishlist) {
        // Check if item already exists
        const existingItem = wishlist.items.find(item => item.productId === productId);
        if (!existingItem) {
          wishlist.items.push(wishlistItem);
          wishlist.updatedAt = new Date();

          await updateDoc(doc(db, WISHLISTS_COLLECTION, wishlist.id), {
            items: wishlist.items,
            updatedAt: Timestamp.fromDate(wishlist.updatedAt)
          });
        }
      } else {
        // Create new wishlist
        const newWishlist = {
          userId,
          items: [wishlistItem],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await addDoc(collection(db, WISHLISTS_COLLECTION), {
          ...newWishlist,
          createdAt: Timestamp.fromDate(newWishlist.createdAt),
          updatedAt: Timestamp.fromDate(newWishlist.updatedAt)
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add to wishlist');
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    try {
      const wishlist = await this.getWishlist(userId);
      if (!wishlist) return;

      wishlist.items = wishlist.items.filter(item => item.productId !== productId);
      wishlist.updatedAt = new Date();

      await updateDoc(doc(db, WISHLISTS_COLLECTION, wishlist.id), {
        items: wishlist.items,
        updatedAt: Timestamp.fromDate(wishlist.updatedAt)
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove from wishlist');
    }
  },

  // Order operations
  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...order,
        createdAt: Timestamp.fromDate(order.createdAt),
        updatedAt: Timestamp.fromDate(order.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          estimatedDelivery: docSnap.data().estimatedDelivery?.toDate() || undefined,
          actualDelivery: docSnap.data().actualDelivery?.toDate() || undefined
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  },

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('buyerId', '==', buyerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: doc.data().estimatedDelivery?.toDate() || undefined,
        actualDelivery: doc.data().actualDelivery?.toDate() || undefined
      } as Order));
    } catch (error) {
      console.error('Error fetching orders by buyer:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  // Statistics
  async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      const [products, sellers, orders] = await Promise.all([
        this.getAllProducts(),
        this.getAllSellers(),
        getDocs(collection(db, ORDERS_COLLECTION))
      ]);

      const totalRevenue = orders.docs.reduce((sum, doc) => {
        const order = doc.data();
        return sum + (order.total || 0);
      }, 0);

      const averageOrderValue = orders.docs.length > 0 ? totalRevenue / orders.docs.length : 0;

      // Calculate category stats
      const categoryStats = PRODUCT_CATEGORIES.map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const categoryRevenue = orders.docs.reduce((sum, doc) => {
          const order = doc.data();
          const categoryItems = order.items?.filter((item: any) => 
            categoryProducts.some(p => p.id === item.productId)
          ) || [];
          return sum + categoryItems.reduce((itemSum: number, item: any) => itemSum + item.totalPrice, 0);
        }, 0);
        
        return {
          category,
          count: categoryProducts.length,
          revenue: categoryRevenue,
          growth: 0 // Placeholder
        };
      });

      // Calculate region stats
      const regionStats = CAMEROON_REGIONS.map(region => {
        const regionProducts = products.filter(p => p.region === region);
        const regionRevenue = orders.docs.reduce((sum, doc) => {
          const order = doc.data();
          const regionItems = order.items?.filter((item: any) => 
            regionProducts.some(p => p.id === item.productId)
          ) || [];
          return sum + regionItems.reduce((itemSum: number, item: any) => itemSum + item.totalPrice, 0);
        }, 0);
        
        return {
          region,
          count: regionProducts.length,
          revenue: regionRevenue,
          growth: 0 // Placeholder
        };
      });

      // Calculate seller stats
      const sellerStats = sellers.map(seller => ({
        sellerId: seller.id,
        sellerName: seller.name,
        sales: seller.totalSales,
        revenue: 0, // Calculate from orders
        rating: seller.rating
      }));

      const stats: MarketplaceStats = {
        totalProducts: products.length,
        totalSellers: sellers.length,
        totalOrders: orders.docs.length,
        totalRevenue,
        averageOrderValue,
        topCategories: categoryStats,
        topRegions: regionStats,
        topSellers: sellerStats,
        recentActivity: [], // Placeholder
        lastUpdated: new Date()
      };

      return stats;
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      throw new Error('Failed to fetch marketplace statistics');
    }
  }
};
