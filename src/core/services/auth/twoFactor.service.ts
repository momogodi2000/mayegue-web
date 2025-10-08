import { 
  multiFactor, 
  PhoneAuthProvider, 
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  MultiFactorResolver,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/core/config/firebase.config';
import { userService } from '@/core/services/firebase/user.service';
import type { UserRole } from '@/shared/types/user.types';

export class TwoFactorService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  /**
   * Check if 2FA is required for the user's role
   */
  is2FARequired(role: UserRole): boolean {
    return role === 'teacher' || role === 'admin';
  }

  /**
   * Check if user has 2FA enabled
   */
  async has2FAEnabled(user: FirebaseUser): Promise<boolean> {
    try {
      const multiFactorUser = multiFactor(user);
      return multiFactorUser.enrolledFactors.length > 0;
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      return false;
    }
  }

  /**
   * Enforce 2FA for teachers and admins
   */
  async enforce2FAForRole(user: FirebaseUser, role: UserRole): Promise<boolean> {
    if (!this.is2FARequired(role)) {
      return true; // 2FA not required for this role
    }

    const has2FA = await this.has2FAEnabled(user);
    if (!has2FA) {
      // User needs to set up 2FA
      throw new Error('2FA_SETUP_REQUIRED');
    }

    return true;
  }

  /**
   * Setup reCAPTCHA verifier
   */
  async setupRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
    try {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });

      await this.recaptchaVerifier.render();
      return this.recaptchaVerifier;
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      throw error;
    }
  }

  /**
   * Enroll phone number for 2FA
   */
  async enrollPhoneNumber(user: FirebaseUser, phoneNumber: string): Promise<void> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const multiFactorUser = multiFactor(user);
      const phoneAuthCredential = PhoneAuthProvider.credential(phoneNumber, '');
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
      
      await multiFactorUser.enroll(multiFactorAssertion, 'Phone Number');
      
      // Update user profile to mark 2FA as enabled
      await userService.updateUserRole(user.uid, await userService.getUserRole(user.uid));

      console.log('2FA enrollment successful');
    } catch (error) {
      console.error('Error enrolling 2FA:', error);
      throw error;
    }
  }

  /**
   * Send verification code for 2FA setup
   */
  async sendVerificationCode(user: FirebaseUser, phoneNumber: string): Promise<string> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const multiFactorUser = multiFactor(user);
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        this.recaptchaVerifier
      );

      return verificationId;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  /**
   * Verify 2FA code during login
   */
  async verifyCode(resolver: MultiFactorResolver, verificationId: string, code: string): Promise<FirebaseUser> {
    try {
      const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
      
      const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
      return userCredential.user;
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      throw error;
    }
  }

  /**
   * Unenroll 2FA (admin function)
   */
  async unenroll2FA(user: FirebaseUser): Promise<void> {
    try {
      const multiFactorUser = multiFactor(user);
      const enrolledFactors = multiFactorUser.enrolledFactors;
      
      if (enrolledFactors.length > 0) {
        await multiFactorUser.unenroll(enrolledFactors[0]);
        
        // Update user profile
        await userService.updateUserRole(user.uid, await userService.getUserRole(user.uid));
      }
    } catch (error) {
      console.error('Error unenrolling 2FA:', error);
      throw error;
    }
  }

  /**
   * Get 2FA status for user
   */
  async get2FAStatus(user: FirebaseUser): Promise<{
    enabled: boolean;
    required: boolean;
    enrolledFactors: number;
    phoneNumber?: string;
  }> {
    try {
      const userRole = await userService.getUserRole(user.uid);
      const multiFactorUser = multiFactor(user);
      const enrolledFactors = multiFactorUser.enrolledFactors;
      
      return {
        enabled: enrolledFactors.length > 0,
        required: this.is2FARequired(userRole),
        enrolledFactors: enrolledFactors.length,
        phoneNumber: enrolledFactors[0]?.uid || undefined
      };
    } catch (error) {
      console.error('Error getting 2FA status:', error);
      return {
        enabled: false,
        required: false,
        enrolledFactors: 0
      };
    }
  }

  /**
   * Clean up reCAPTCHA verifier
   */
  cleanup(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

export const twoFactorService = new TwoFactorService();
