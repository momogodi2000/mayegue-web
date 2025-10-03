import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  MultiFactorResolver,
} from 'firebase/auth';
import { auth } from '@/core/config/firebase.config';
import type { User } from '@/shared/types/user.types';
import { userService } from './user.service';

async function mapFirebaseUser(user: FirebaseUser): Promise<User> {
  // Fetch role and profile from Firestore
  const role = await userService.getUserRole(user.uid);
  const profile = await userService.getUserProfile(user.uid);

  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email || 'Utilisateur',
    photoURL: user.photoURL || undefined,
    phoneNumber: user.phoneNumber || undefined,
    emailVerified: user.emailVerified,
    twoFactorEnabled: multiFactor(user).enrolledFactors.length > 0,
    role,
    subscriptionStatus: profile?.subscriptionStatus || 'free',
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

    // Update profile and send verification email
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await sendEmailVerification(cred.user);

    // Create user profile in Firestore with default 'apprenant' role
    await userService.ensureUserProfile(cred.user.uid, {
      email: cred.user.email || '',
      displayName: displayName || cred.user.email || 'Utilisateur'
    });

    return await mapFirebaseUser(cred.user);
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const cred = await signInWithPopup(auth, provider);

    // Ensure user profile exists in Firestore
    await userService.ensureUserProfile(cred.user.uid, {
      email: cred.user.email || '',
      displayName: cred.user.displayName || cred.user.email || 'Utilisateur'
    });

    return await mapFirebaseUser(cred.user);
  }

  async signInWithFacebook(): Promise<User> {
    const provider = new FacebookAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    await userService.ensureUserProfile(cred.user.uid, {
      email: cred.user.email || '',
      displayName: cred.user.displayName || cred.user.email || 'Utilisateur'
    });

    return await mapFirebaseUser(cred.user);
  }

  async signOut(): Promise<void> {
    // Clear any local storage/session data
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Sign out from Firebase
    await signOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const user = await mapFirebaseUser(fbUser);
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem('user');
        callback(null);
      }
    });
    return unsub;
  }

  // Email verification
  async sendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  }

  // Password reset
  async requestPasswordReset(email: string): Promise<void> {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login',
      handleCodeInApp: false,
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

  // 2FA Methods
  async setupRecaptcha(elementId: string): Promise<RecaptchaVerifier> {
    const verifier = new RecaptchaVerifier(auth, elementId, {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // Response expired
      }
    });
    await verifier.render();
    return verifier;
  }

  async enrollPhoneMFA(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const multiFactorSession = await multiFactor(user).getSession();
    const phoneInfoOptions = {
      phoneNumber,
      session: multiFactorSession
    };

    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);

    return verificationId;
  }

  async verifyPhoneMFA(verificationId: string, verificationCode: string, displayName?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    await multiFactor(user).enroll(multiFactorAssertion, displayName || 'Phone Number');
  }

  async unenrollMFA(factorUid: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const enrolledFactors = multiFactor(user).enrolledFactors;
    const factor = enrolledFactors.find(f => f.uid === factorUid);

    if (factor) {
      await multiFactor(user).unenroll(factor);
    }
  }

  async verifyMFACode(resolver: MultiFactorResolver, verificationId: string, verificationCode: string): Promise<User> {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    const userCred = await resolver.resolveSignIn(multiFactorAssertion);
    return await mapFirebaseUser(userCred.user);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();


