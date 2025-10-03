# 🚀 Next Steps - Quick Start Guide

## Immediate Actions Required

### 1. Install New Dependencies (5 minutes)
```bash
npm install
# or
npm install firebase-admin@^12.0.0 @types/node@^20.11.5 --save-dev
```

### 2. Firebase Console Setup (10 minutes)

**Go to Firebase Console**: https://console.firebase.google.com/project/studio-6750997720-7c22e

#### A. Enable Authentication Providers:
1. Go to **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Email/Password** (click, toggle on, save)
   - ✅ **Google** (click, toggle on, save)
   - ✅ **Phone** (for 2FA - click, toggle on, save)

#### B. Configure OAuth:
1. In **Google** provider settings:
   - Add your domain to **Authorized domains** (e.g., `localhost`, `maayegue.com`)
   - Note: No need for separate Google Client ID - Firebase handles it!

#### C. Firestore Database:
1. Go to **Firestore Database**
2. If not created, click **Create database**
3. Start in **Test mode** (we'll add security rules later)
4. Choose location: `us-central1` or closest to Cameroon

### 3. Create Default Admin User (15 minutes)

#### Download Service Account Key:
1. Go to: **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Save as `firebase-admin-key.json` in project root
4. **⚠️ NEVER commit this file to git!**

#### Set Environment Variable:
```bash
# Windows PowerShell:
$env:GOOGLE_APPLICATION_CREDENTIALS="$PWD\firebase-admin-key.json"

# Windows CMD:
set GOOGLE_APPLICATION_CREDENTIALS=%CD%\firebase-admin-key.json

# Linux/Mac:
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-admin-key.json"
```

#### Run Admin Creation Script:
```bash
npm run create-admin
```

When prompted:
- Email: Press Enter for default (`admin@maayegue.com`) or enter your own
- Password: Press Enter for default (`Admin@2025`) or enter your own
- Display Name: Press Enter for default (`Admin`) or enter your own

**⚠️ IMPORTANT**: Login and change the password immediately!

---

## 4. Test the Application (10 minutes)

### Start Development Server:
```bash
npm run dev
```

### Test Authentication Flow:
1. **Register New User**:
   - Go to http://localhost:5173/register
   - Enter email and password
   - Check that email verification is sent
   - New user should have role `apprenant`
   - Should redirect to `/dashboard/apprenant`

2. **Google OAuth**:
   - Go to http://localhost:5173/login
   - Click "Sign in with Google"
   - Should create user and redirect to dashboard

3. **Admin Login**:
   - Go to http://localhost:5173/login
   - Use admin credentials from step 3
   - Should redirect to `/dashboard/admin`

4. **Test Logout**:
   - Click user menu → Logout
   - Should clear session and redirect to homepage
   - Try accessing `/dashboard` - should redirect to login

5. **Test Guest Experience**:
   - Open incognito window
   - Go to http://localhost:5173/dashboard/guest
   - Should see guest dashboard with CTAs to register

6. **Test Theme Toggle**:
   - Click theme icon in header
   - Try Light, Dark, and System modes
   - Preference should persist on reload

7. **Test Newsletter**:
   - Scroll to footer
   - Enter email in newsletter form
   - Should save to Firebase Firestore
   - Check in Firebase Console → Firestore → `newsletter_subscriptions`

8. **Test PWA Install Prompt**:
   - Wait 30 seconds on guest page
   - Should see install prompt
   - Can dismiss or install

---

## 5. Firebase Security Rules (IMPORTANT!)

### Firestore Rules:
Go to **Firestore Database** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Admin permissions
    match /admin_permissions/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin();
    }

    // Newsletter subscriptions
    match /newsletter_subscriptions/{docId} {
      allow create: if true; // Anyone can subscribe
      allow read, update, delete: if isAdmin();
    }

    // Lessons
    match /lessons/{lessonId} {
      allow read: if true; // Public read
      allow write: if isAdmin() ||
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    // Dictionary
    match /dictionary/{entryId} {
      allow read: if true; // Public read
      allow write: if isAdmin() ||
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
  }
}
```

Click **Publish**

---

## 6. Optional Enhancements

### A. Add Benefits Section to Homepage:
Edit `src/features/home/pages/HomePage.tsx` and add:

```tsx
import {
  GlobeAltIcon,
  AcademicCapIcon,
  UsersIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const benefits = [
  {
    icon: GlobeAltIcon,
    title: "Préservation Culturelle",
    description: "Contribuez à la sauvegarde des langues camerounaises"
  },
  {
    icon: AcademicCapIcon,
    title: "Apprentissage Efficace",
    description: "Méthode interactive avec IA et reconnaissance vocale"
  },
  {
    icon: UsersIcon,
    title: "Communauté Active",
    description: "Rejoignez des milliers d'apprenants"
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Accessible Partout",
    description: "Fonctionne hors ligne"
  }
];

// Then in your component:
<section className="py-20">
  <div className="container-custom">
    <h2 className="text-3xl font-bold text-center mb-12">
      Pourquoi Ma'a yegue ?
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center">
          <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary-600" />
          <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### B. Add PWA Install Prompt to Guest Dashboard:
Edit `src/features/users/guest/pages/DashboardPage.tsx`:

```tsx
import { PWAInstallPrompt } from '@/shared/components/pwa/PWAInstallPrompt';

// Add at the end of the component:
return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    {/* ... existing content ... */}
    <PWAInstallPrompt />
  </div>
);
```

### C. Add PWA Install Button to Dashboards:
Edit each dashboard (`apprenant`, `teacher`, `admin`):

```tsx
import { PWAInstallButton } from '@/shared/components/pwa/PWAInstallButton';

// Add to dashboard header:
<div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold">Tableau de bord</h1>
  <PWAInstallButton />
</div>
```

---

## 7. Build and Deploy

### Build for Production:
```bash
npm run build
```

### Deploy to Firebase Hosting:
```bash
npm run firebase:deploy
```

Or deploy only hosting:
```bash
npm run firebase:deploy:hosting
```

---

## 📋 Checklist

Before going to production:

- [ ] Firebase Authentication enabled (Email, Google, Phone)
- [ ] Default admin user created and tested
- [ ] Firestore security rules updated
- [ ] All authentication flows tested
- [ ] Role-based redirects work correctly
- [ ] Theme toggle works
- [ ] Newsletter subscription works
- [ ] PWA install prompts work
- [ ] Guest dashboard tested
- [ ] Admin can change user roles
- [ ] Logout clears sessions properly
- [ ] `.gitignore` includes `firebase-admin-key.json`

---

## 🐛 Troubleshooting

### Build Errors:
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

### Firebase Connection Issues:
- Verify `.env` file has correct Firebase credentials
- Check Firebase Console for project ID
- Restart dev server after .env changes

### Admin Script Fails:
- Verify `GOOGLE_APPLICATION_CREDENTIALS` is set
- Check path to `firebase-admin-key.json` is correct
- Ensure service account has proper permissions in Firebase

---

## 📚 Documentation

- **Complete Implementation**: `IMPLEMENTATION_COMPLETE.md`
- **Admin User Guide**: `scripts/README-ADMIN.md`
- **Firebase Docs**: https://firebase.google.com/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🎉 You're Ready!

All major features have been implemented. Follow these steps to get your production-ready app running!

If you encounter any issues, check:
1. Browser console for errors
2. Firebase Console logs
3. Implementation files in `src/`

**Good luck with Ma'a yegue! 🇨🇲**
