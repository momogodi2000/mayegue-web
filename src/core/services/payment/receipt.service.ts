import { firestoreService } from '../firebase/firestore.service';
import { storage } from '@/core/config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import { Transaction } from './payment.types';
import { User } from '@/shared/types/user.types';

export interface Receipt {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  plan: string;
  provider: string;
  status: string;
  receiptUrl?: string;
  emailSent: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export class ReceiptService {
  /**
   * Generate and store receipt for a completed transaction
   */
  async generateReceipt(transaction: Transaction, user: User): Promise<Receipt> {
    try {
      const receiptId = `receipt_${transaction.id}`;
      
      // Generate PDF receipt
      const pdfUrl = await this.generatePDFReceipt(transaction, user);
      
      // Create receipt record
      const receipt: Receipt = {
        id: receiptId,
        userId: transaction.userId,
        transactionId: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        plan: transaction.description,
        provider: transaction.provider,
        status: transaction.status,
        receiptUrl: pdfUrl,
        emailSent: false,
        createdAt: new Date(),
        metadata: {
          features: this.getPlanFeatures(transaction.description),
          duration: this.getPlanDuration(transaction.description),
          userEmail: user.email,
          userName: user.displayName
        }
      };

      // Store receipt in Firestore
      await firestoreService.addDocument('receipts', receipt);

      // Send email receipt
      await this.sendEmailReceipt(receipt, user);

      // Update receipt with email status
      await firestoreService.updateDocument('receipts', receiptId, {
        emailSent: true,
        updatedAt: new Date()
      });

      return receipt;
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      throw error;
    }
  }

  /**
   * Generate PDF receipt
   */
  private async generatePDFReceipt(transaction: Transaction, user: User): Promise<string> {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Ma\'a yegue', 20, 30);
      doc.setFontSize(12);
      doc.text('Reçu de Paiement', 20, 40);
      
      // Transaction details
      doc.setFontSize(10);
      doc.text(`ID Transaction: ${transaction.id}`, 20, 60);
      doc.text(`Date: ${new Date(transaction.createdAt).toLocaleDateString('fr-FR')}`, 20, 70);
      doc.text(`Utilisateur: ${user.displayName}`, 20, 80);
      doc.text(`Email: ${user.email}`, 20, 90);
      
      // Payment details
      doc.text(`Plan: ${transaction.description}`, 20, 110);
      doc.text(`Montant: ${transaction.amount.toLocaleString()} ${transaction.currency}`, 20, 120);
      doc.text(`Statut: ${transaction.status}`, 20, 130);
      doc.text(`Fournisseur: ${transaction.provider}`, 20, 140);
      
      // Features included
      if (transaction.metadata?.features) {
        doc.text('Fonctionnalités incluses:', 20, 160);
        const features = transaction.metadata.features;
        features.forEach((feature: string, index: number) => {
          doc.text(`• ${feature}`, 25, 170 + (index * 10));
        });
      }
      
      // Footer
      doc.setFontSize(8);
      doc.text('Merci d\'utiliser Ma\'a yegue pour apprendre les langues camerounaises!', 20, 280);
      doc.text('Conservez ce reçu pour vos archives.', 20, 290);
      
      // Convert to blob and upload to Firebase Storage
      const pdfBlob = doc.output('blob');
      const storageRef = ref(storage, `receipts/${transaction.id}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Failed to generate PDF receipt:', error);
      throw error;
    }
  }

  /**
   * Send email receipt to user
   */
  private async sendEmailReceipt(receipt: Receipt, user: User): Promise<void> {
    try {
      // This would integrate with an email service like SendGrid, AWS SES, etc.
      // For now, we'll just log the receipt details
      console.log('Email receipt would be sent to:', user.email);
      console.log('Receipt details:', {
        transactionId: receipt.transactionId,
        amount: receipt.amount,
        currency: receipt.currency,
        plan: receipt.plan,
        receiptUrl: receipt.receiptUrl
      });
      
      // TODO: Implement actual email sending
      // await emailService.sendReceipt(user.email, receipt);
    } catch (error) {
      console.error('Failed to send email receipt:', error);
      // Don't throw error - receipt generation should continue even if email fails
    }
  }

  /**
   * Get user's receipt history
   */
  async getUserReceipts(userId: string, limit = 20): Promise<Receipt[]> {
    try {
      const receipts = await firestoreService.queryDocuments('receipts', {
        filters: [{ field: 'userId', operator: '==', value: userId }],
        orderByField: 'createdAt',
        orderDirection: 'desc',
        limitCount: limit
      });

      return receipts as Receipt[];
    } catch (error) {
      console.error('Failed to get user receipts:', error);
      return [];
    }
  }

  /**
   * Get specific receipt by ID
   */
  async getReceipt(receiptId: string): Promise<Receipt | null> {
    try {
      const receipt = await firestoreService.getDocument('receipts', receiptId);
      return receipt as Receipt;
    } catch (error) {
      console.error('Failed to get receipt:', error);
      return null;
    }
  }

  /**
   * Helper method to get plan features
   */
  private getPlanFeatures(planDescription: string): string[] {
    const featureMap: Record<string, string[]> = {
      'freemium': ['5 leçons par mois', 'Dictionnaire de base', 'Assistant IA limité'],
      'premium': ['Leçons illimitées', 'Dictionnaire complet', 'Assistant IA Gemini', 'Atlas Linguistique', 'Encyclopédie Culturelle'],
      'family': ['Tout Premium +', '6 comptes familiaux', 'Mode Famille', 'Arbre Linguistique'],
      'teacher': ['Tout Premium +', 'Gestion de classes', 'Analytics avancés', 'Outils d\'évaluation'],
      'enterprise': ['Tout Teacher +', 'Utilisateurs illimités', 'API et intégrations', 'Support 24/7']
    };

    // Simple matching logic - in production, this would be more sophisticated
    for (const [plan, features] of Object.entries(featureMap)) {
      if (planDescription.toLowerCase().includes(plan.toLowerCase())) {
        return features;
      }
    }

    return ['Fonctionnalités de base'];
  }

  /**
   * Helper method to get plan duration
   */
  private getPlanDuration(planDescription: string): string {
    if (planDescription.toLowerCase().includes('annuel') || planDescription.toLowerCase().includes('yearly')) {
      return '365 jours';
    } else if (planDescription.toLowerCase().includes('mensuel') || planDescription.toLowerCase().includes('monthly')) {
      return '30 jours';
    } else if (planDescription.toLowerCase().includes('freemium')) {
      return 'Permanent';
    }
    return '30 jours';
  }
}

export const receiptService = new ReceiptService();
