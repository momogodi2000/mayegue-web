import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/core/config/firebase.config';
import type { User } from '@/types/user.types';
import { userService } from './user.service';

async function mapFirebaseUser(user: FirebaseUser): Promise<User> {
  // Fetch role from Firestore
  const role = await userService.getUserRole(user.uid);
  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email || 'Utilisateur',
    photoURL: user.photoURL || undefined,
    role,
    createdAt: new Date(user.metadata.creationTime || Date.now()),
    lastLoginAt: new Date(user.metadata.lastSignInTime || Date.now()),
    preferences: {
      language: 'fr',
      targetLanguages: [],
      notificationsEnabled: true,
      theme: 'system',
      dailyGoalMinutes: 10,
    },
    stats: {
      lessonsCompleted: 0,
      wordsLearned: 0,
      totalTimeMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      badgesEarned: 0,
      level: 1,
      xp: 0,
    },
  };
}

export class AuthService {
  async signInWithEmail(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUser(cred.user);
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await userService.ensureUserProfile(cred.user.uid, { email: cred.user.email || '', displayName: displayName || '' });
    return await mapFirebaseUser(cred.user);
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await userService.ensureUserProfile(cred.user.uid, { email: cred.user.email || '', displayName: cred.user.displayName || '' });
    return await mapFirebaseUser(cred.user);
  }

  async signInWithFacebook(): Promise<User> {
    const provider = new FacebookAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await userService.ensureUserProfile(cred.user.uid, { email: cred.user.email || '', displayName: cred.user.displayName || '' });
    return await mapFirebaseUser(cred.user);
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      callback(fbUser ? await mapFirebaseUser(fbUser) : null);
    });
    return unsub;
  }

  // Password reset
  async requestPasswordReset(email: string): Promise<void> {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email, {
      // Configure actionCodeSettings if needed
      url: window.location.origin + '/reset-password',
      handleCodeInApp: true,
    });
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    const { confirmPasswordReset } = await import('firebase/auth');
    await confirmPasswordReset(auth, oobCode, newPassword);
  }

  async verifyPasswordResetCode(oobCode: string): Promise<string> {
    const { verifyPasswordResetCode } = await import('firebase/auth');
    return verifyPasswordResetCode(auth, oobCode);
  }
}

export const authService = new AuthService();


