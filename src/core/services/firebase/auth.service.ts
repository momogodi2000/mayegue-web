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
import type { User, UserRole } from '@/shared/types/user.types';
import { userService } from './user.service';
import {
  isValidEmail,
  isValidPassword,
  sanitizeInput,
  isValidDisplayName,
  isValidPhoneNumber,
  RateLimiter
} from '@/shared/utils/validation';

async function mapFirebaseUser(user: FirebaseUser): Promise<User> {
  // Fetch role and profile from Firestore with error handling
  let role: UserRole = 'apprenant';
  let profile: Awaited<ReturnType<typeof userService.getUserProfile>> = null;

  try {
    // First try to get the user profile
    profile = await userService.getUserProfile(user.uid);
    
    if (!profile) {
      // If no profile exists, create one with default role based on email
      console.log('No profile found, creating default profile for:', user.email);
      
      // Determine role based on email for default users
      let defaultRole: UserRole = 'apprenant';
      if (user.email === 'admin@mayegue.com') {
        defaultRole = 'admin';
      } else if (user.email === 'teacher@mayegue.com') {
        defaultRole = 'teacher';
      }
      
      await userService.ensureUserProfile(user.uid, {
        email: user.email || '',
        displayName: user.displayName || user.email || 'Utilisateur',
        emailVerified: user.emailVerified
      });
      
      // If it's a default user, update their role
      if (defaultRole !== 'apprenant') {
        await userService.updateUserRole(user.uid, defaultRole);
      }
      
      role = defaultRole;
    } else {
      role = await userService.getUserRole(user.uid);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Continue with default values if Firestore fetch fails
  }

  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email || 'Utilisateur',
    photoURL: user.photoURL || undefined,
    phoneNumber: user.phoneNumber || undefined,
    emailVerified: user.emailVerified,
    twoFactorEnabled: multiFactor(user).enrolledFactors.length > 0,
    role,
    subscription: typeof profile?.subscription === 'string' ? undefined : profile?.subscription,
    createdAt: new Date(user.metadata.creationTime || Date.now()),
    lastLoginAt: new Date(user.metadata.lastSignInTime || Date.now()),
    preferences: profile?.preferences || {
      language: 'fr',
      targetLanguages: [],
      notificationsEnabled: true,
      theme: 'system',
      dailyGoalMinutes: 10,
    },
    stats: profile?.stats || {
      lessonsCompleted: 0,
      wordsLearned: 0,
      totalTimeMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      badgesEarned: 0,
      level: 1,
      xp: 0,
      atlasExplorations: 0,
      encyclopediaEntries: 0,
      historicalSitesVisited: 0,
      arVrExperiences: 0,
      marketplacePurchases: 0,
      familyContributions: 0,
      ngondoCoinsEarned: 0,
      achievementsUnlocked: 0,
    },
  };
}

export class AuthService {
  private loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
  private signupRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes

  async signInWithEmail(email: string, password: string): Promise<User> {
    // Validate email
    if (!isValidEmail(email)) {
      throw new Error('Adresse e-mail invalide');
    }

    // Rate limiting
    if (!this.loginRateLimiter.canProceed(email)) {
      throw new Error('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
    }

    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

    // Ensure user profile exists (creates it if it doesn't)
    try {
      await userService.ensureUserProfile(cred.user.uid, {
        email: cred.user.email || '',
        displayName: cred.user.displayName || cred.user.email || 'Utilisateur',
        emailVerified: cred.user.emailVerified
      });

      // Set custom claims for Firestore rules
      await this.setUserCustomClaims(cred.user.uid);
    } catch (error) {
      console.error('Error ensuring user profile on login:', error);
    }

    // Reset rate limiter on successful login
    this.loginRateLimiter.reset(email);

    return await mapFirebaseUser(cred.user);
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    // Validate email
    if (!isValidEmail(email)) {
      throw new Error('Adresse e-mail invalide');
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    // Validate and sanitize display name
    if (displayName) {
      if (!isValidDisplayName(displayName)) {
        throw new Error('Le nom d\'affichage doit contenir entre 2 et 50 caractères');
      }
      displayName = sanitizeInput(displayName);
    }

    // Rate limiting
    if (!this.signupRateLimiter.canProceed(email)) {
      throw new Error('Trop de tentatives d\'inscription. Veuillez réessayer plus tard.');
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Update profile first
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }

      // Create user profile in Firestore with default 'apprenant' role
      try {
        await userService.ensureUserProfile(cred.user.uid, {
          email: cred.user.email || '',
          displayName: displayName || cred.user.email || 'Utilisateur',
          emailVerified: false
        });
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Continue even if profile creation fails - it will be created on next login
      }

      // Send verification email
      try {
        await sendEmailVerification(cred.user);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Continue even if email fails - user can request it later
      }

      // Reset rate limiter on successful signup
      this.signupRateLimiter.reset(email);

      // Return mapped user with proper role
      return await mapFirebaseUser(cred.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const cred = await signInWithPopup(auth, provider);

    // Ensure user profile exists in Firestore FIRST
    await userService.ensureUserProfile(cred.user.uid, {
      email: cred.user.email || '',
      displayName: cred.user.displayName || cred.user.email || 'Utilisateur',
      emailVerified: cred.user.emailVerified
    });

    // Set custom claims for Firestore rules
    try {
      await this.setUserCustomClaims(cred.user.uid);
    } catch (error) {
      console.error('Error setting custom claims:', error);
    }

    // Return mapped user with proper role
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
    // Validate email
    if (!isValidEmail(email)) {
      throw new Error('Adresse e-mail invalide');
    }

    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email.trim(), {
      url: window.location.origin + '/login',
      handleCodeInApp: false,
    });
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    // Validate new password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

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

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error('Numéro de téléphone invalide');
    }

    const multiFactorSession = await multiFactor(user).getSession();
    const phoneInfoOptions = {
      phoneNumber: phoneNumber.trim(),
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

  async getCurrentMappedUser(): Promise<User | null> {
    const fbUser = auth.currentUser;
    if (fbUser) {
      return await mapFirebaseUser(fbUser);
    }
    return null;
  }

  // Set custom claims for Firestore rules compatibility
  private async setUserCustomClaims(userId: string): Promise<void> {
    try {
      const userRole = await userService.getUserRole(userId);
      
      // In a production app, this would be done via Cloud Functions
      // For now, we'll use a workaround by refreshing the token
      const user = auth.currentUser;
      if (user) {
        // Force token refresh to get updated claims
        await user.getIdToken(true);
      }
    } catch (error) {
      console.error('Error setting custom claims:', error);
    }
  }
}

export const authService = new AuthService();


