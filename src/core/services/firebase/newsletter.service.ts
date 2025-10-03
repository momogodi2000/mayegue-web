import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import { authService } from './auth.service';
import { emailService } from '../email.service';

export interface NewsletterSubscription {
  id?: string;
  email: string;
  status: 'pending' | 'verified' | 'unsubscribed';
  source: 'website_footer' | 'user_registration' | 'manual';
  subscribedAt: Timestamp;
  verifiedAt?: Timestamp;
  verificationToken?: string;
  userId?: string;
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };
}

export class NewsletterService {
  private readonly collectionName = 'newsletter_subscriptions';

  /**
   * Subscribe an email to the newsletter
   */
  async subscribe(
    email: string, 
    source: NewsletterSubscription['source'] = 'website_footer',
    sendVerification: boolean = true
  ): Promise<{ success: boolean; message: string; requiresVerification?: boolean }> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Validate email format
      if (!this.isValidEmail(normalizedEmail)) {
        return { success: false, message: 'Format d\'email invalide' };
      }

      // Check if email already exists
      const existingSubscription = await this.getSubscriptionByEmail(normalizedEmail);
      
      if (existingSubscription) {
        if (existingSubscription.status === 'verified') {
          return { success: false, message: 'Cet email est déjà inscrit à notre newsletter' };
        } else if (existingSubscription.status === 'pending') {
          // Resend verification if needed
          if (sendVerification) {
            await this.sendVerificationEmail(normalizedEmail, existingSubscription.verificationToken!);
          }
          return { 
            success: true, 
            message: 'Un email de vérification a été envoyé', 
            requiresVerification: true 
          };
        }
      }

      // Generate verification token
      const verificationToken = this.generateVerificationToken();
      const currentUser = authService.getCurrentUser();

      // Create subscription
      const subscriptionData: Omit<NewsletterSubscription, 'id'> = {
        email: normalizedEmail,
        status: sendVerification ? 'pending' : 'verified',
        source,
        subscribedAt: serverTimestamp() as Timestamp,
        verificationToken: sendVerification ? verificationToken : undefined,
        userId: currentUser?.uid,
        preferences: {
          frequency: 'weekly',
          categories: ['updates', 'news', 'promotions']
        }
      };

      await addDoc(collection(db, this.collectionName), subscriptionData);

      // Send verification email if required
      if (sendVerification) {
        await this.sendVerificationEmail(normalizedEmail, verificationToken);
        return { 
          success: true, 
          message: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre abonnement.', 
          requiresVerification: true 
        };
      }

      return { 
        success: true, 
        message: 'Inscription à la newsletter réussie !' 
      };

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return { 
        success: false, 
        message: 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.' 
      };
    }
  }

  /**
   * Verify email subscription
   */
  async verifySubscription(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('verificationToken', '==', token),
        where('status', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, message: 'Token de vérification invalide ou expiré' };
      }

      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, this.collectionName, subscriptionDoc.id), {
        status: 'verified',
        verifiedAt: serverTimestamp(),
        verificationToken: null
      });

      return { success: true, message: 'Email vérifié avec succès ! Vous êtes maintenant abonné à notre newsletter.' };

    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, message: 'Erreur lors de la vérification. Veuillez réessayer.' };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const subscription = await this.getSubscriptionByEmail(email.toLowerCase().trim());
      
      if (!subscription) {
        return { success: false, message: 'Aucun abonnement trouvé pour cet email' };
      }

      if (subscription.status === 'verified') {
        return { success: false, message: 'Cet email est déjà vérifié' };
      }

      if (!subscription.verificationToken) {
        // Generate new token if missing
        const newToken = this.generateVerificationToken();
        await updateDoc(doc(db, this.collectionName, subscription.id!), {
          verificationToken: newToken
        });
        subscription.verificationToken = newToken;
      }

      await this.sendVerificationEmail(subscription.email, subscription.verificationToken);
      
      return { success: true, message: 'Email de vérification renvoyé avec succès' };

    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, message: 'Erreur lors de l\'envoi. Veuillez réessayer.' };
    }
  }

  /**
   * Get subscription by email
   */
  private async getSubscriptionByEmail(email: string): Promise<NewsletterSubscription | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('email', '==', email.toLowerCase().trim())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as NewsletterSubscription;

    } catch (error) {
      console.error('Get subscription error:', error);
      return null;
    }
  }

  /**
   * Send verification email (now using real email service)
   */
  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await emailService.sendNewsletterVerification(email, token);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw error - we don't want newsletter subscription to fail if email sending fails
    }
  }

  /**
   * Generate verification token
   */
  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const subscription = await this.getSubscriptionByEmail(email.toLowerCase().trim());
      
      if (!subscription) {
        return { success: false, message: 'Aucun abonnement trouvé pour cet email' };
      }

      await updateDoc(doc(db, this.collectionName, subscription.id!), {
        status: 'unsubscribed',
        unsubscribedAt: serverTimestamp()
      });

      return { success: true, message: 'Désabonnement réussi' };

    } catch (error) {
      console.error('Unsubscribe error:', error);
      return { success: false, message: 'Erreur lors du désabonnement. Veuillez réessayer.' };
    }
  }
}

export const newsletterService = new NewsletterService();
