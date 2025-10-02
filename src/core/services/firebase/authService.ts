import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  deleteUser,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/core/config/firebase.config';
import { config } from '@/core/config/env.config';
import type { User as AppUser, UserRole } from '@/shared/types/user.types';

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  user: AppUser | null;
  error: string | null;
}

export interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  email?: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;
  private facebookProvider: FacebookAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
    
    // Configure providers
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    
    this.facebookProvider.addScope('email');
    this.facebookProvider.addScope('public_profile');
  }

  /**
   * Create user profile in Firestore
   */
  private async createUserProfile(user: User, additionalData: Partial<AppUser> = {}): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    
    const userData: Partial<AppUser> = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'learner',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        language: 'fr',
        targetLanguages: [],
        notificationsEnabled: true,
        theme: 'light',
        dailyGoalMinutes: 15
      },
      stats: {
        lessonsCompleted: 0,
        wordsLearned: 0,
        totalTimeMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        badgesEarned: 0,
        level: 1,
        xp: 0
      },
      ...additionalData
    };

    await setDoc(userRef, userData);
  }

  /**
   * Convert Firebase User to AppUser
   */
  private async convertFirebaseUser(firebaseUser: User): Promise<AppUser> {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: userData.role || 'learner',
        createdAt: userData.createdAt?.toDate() || new Date(),
        lastLoginAt: new Date(),
        preferences: userData.preferences,
        stats: userData.stats
      } as AppUser;
    } else {
      // Create profile if it doesn't exist
      await this.createUserProfile(firebaseUser);
      return await this.convertFirebaseUser(firebaseUser);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      if (!data.acceptedTerms || !data.acceptedPrivacy) {
        return {
          user: null,
          error: 'You must accept the terms of service and privacy policy'
        };
      }

      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: data.displayName
      });

      // Send email verification
      if (config.environment === 'production') {
        await sendEmailVerification(firebaseUser);
      }

      // Create user profile
      await this.createUserProfile(firebaseUser, {
        displayName: data.displayName,
        role: data.role || 'learner'
      });

      const appUser = await this.convertFirebaseUser(firebaseUser);

      return {
        user: appUser,
        error: null
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        user: null,
        error: this.getAuthErrorMessage(authError)
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update last login time
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });

      const appUser = await this.convertFirebaseUser(firebaseUser);

      return {
        user: appUser,
        error: null
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        user: null,
        error: this.getAuthErrorMessage(authError)
      };
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, this.googleProvider);

      // Check if user profile exists, create if not
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await this.createUserProfile(firebaseUser);
      } else {
        // Update last login time
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
      }

      const appUser = await this.convertFirebaseUser(firebaseUser);

      return {
        user: appUser,
        error: null
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        user: null,
        error: this.getAuthErrorMessage(authError)
      };
    }
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<AuthResult> {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, this.facebookProvider);

      // Check if user profile exists, create if not
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await this.createUserProfile(firebaseUser);
      } else {
        // Update last login time
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
      }

      const appUser = await this.convertFirebaseUser(firebaseUser);

      return {
        user: appUser,
        error: null
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        user: null,
        error: this.getAuthErrorMessage(authError)
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(data: ProfileUpdateData): Promise<{ error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No authenticated user' };
      }

      // Update Firebase Auth profile
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: data.photoURL
        });
      }

      // Update email if provided
      if (data.email && data.email !== user.email) {
        await updateEmail(user, data.email);
        await sendEmailVerification(user);
      }

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No authenticated user' };
      }

      await updatePassword(user, newPassword);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<{ error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No authenticated user' };
      }

      await sendEmailVerification(user);
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { error: 'No authenticated user' };
      }

      // Delete user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);

      // Delete Firebase Auth user
      await deleteUser(user);

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      return { error: this.getAuthErrorMessage(authError) };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await this.convertFirebaseUser(firebaseUser);
          callback(appUser);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AppUser | null> {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return await this.convertFirebaseUser(firebaseUser);
    }
    return null;
  }

  /**
   * Get auth error message
   */
  private getAuthErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Aucun compte trouvé avec cette adresse email';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Veuillez réessayer plus tard';
      case 'auth/network-request-failed':
        return 'Erreur de connexion. Vérifiez votre connexion internet';
      case 'auth/popup-closed-by-user':
        return 'Connexion annulée par l\'utilisateur';
      case 'auth/cancelled-popup-request':
        return 'Connexion annulée';
      case 'auth/popup-blocked':
        return 'Popup bloquée. Autorisez les popups pour ce site';
      case 'auth/requires-recent-login':
        return 'Cette opération nécessite une connexion récente';
      default:
        console.error('Auth error:', error);
        return 'Une erreur est survenue. Veuillez réessayer';
    }
  }
}

export const authService = new AuthService();