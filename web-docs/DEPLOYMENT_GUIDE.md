# 🚀 Mayegue Web - Deployment Guide

## Production Deployment Checklist

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality ✅
- [x] TypeScript: 0 errors
- [x] ESLint: Passing (30 warnings - acceptable)
- [x] Build: Successful (874 KB)
- [x] All routes: Functional
- [x] Authentication: Working
- [x] Role-based access: Implemented

### 2. Environment Configuration
- [ ] Create `.env.production` file
- [ ] Set all required environment variables
- [ ] Verify Firebase credentials
- [ ] Test CamPay/NouPai API keys
- [ ] Configure Gemini API key

### 3. Firebase Setup
- [ ] Enable Authentication providers in Firebase Console:
  - [x] Email/Password
  - [ ] Google Sign-In (add OAuth client)
  - [ ] Facebook Login (add app credentials)
- [ ] Deploy Firestore Security Rules
- [ ] Deploy Storage Security Rules
- [ ] Configure CORS for Storage
- [ ] Set up Firebase Hosting (optional)

### 4. Assets
- [ ] Create app icons (192x192, 512x512)
- [ ] Add favicon.ico
- [ ] Create Open Graph image (1200x630)
- [ ] Optimize all images (WebP format)
- [ ] Create SQLite database (`languages.db`)

---

## 🔥 Firebase Configuration Steps

### Step 1: Enable Authentication Providers

```bash
# Go to Firebase Console
https://console.firebase.google.com/project/studio-6750997720-7c22e

# Navigate to: Authentication > Sign-in method
# Enable:
✅ Email/Password
✅ Google (add OAuth client ID)
✅ Facebook (add App ID and Secret)
```

### Step 2: Deploy Firestore Security Rules

Create `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Languages and dictionary - public read
    match /languages/{languageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    match /dictionary/{entryId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // Lessons - authenticated read
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // Progress - user specific
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Community posts
    match /community/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.authorId == request.auth.uid;
    }
    
    // Admin only
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Deploy:
```bash
firebase deploy --only firestore:rules
```

### Step 3: Deploy Storage Security Rules

Create `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio files - public read
    match /audio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // User uploads
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lesson media
    match /lessons/{lessonId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
  }
}
```

Deploy:
```bash
firebase deploy --only storage:rules
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Web)

#### Why Vercel?
- ✅ Free tier generous
- ✅ Auto-deploy from GitHub
- ✅ Edge network (fast globally)
- ✅ Zero config for Vite
- ✅ Preview deployments for PRs

#### Steps:

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# First time
vercel

# Production
vercel --prod
```

4. **Configure Environment Variables**
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from `.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_GEMINI_API_KEY=...
VITE_CAMPAY_API_KEY=...
VITE_CAMPAY_SECRET=...
VITE_NOUPAI_API_KEY=...
VITE_NOUPAI_MERCHANT_ID=...
```

5. **Configure Custom Domain** (Optional)
```bash
vercel domains add mayegue.app
```

---

### Option 2: Firebase Hosting

#### Why Firebase Hosting?
- ✅ Same platform as backend
- ✅ Free SSL certificate
- ✅ CDN included
- ✅ Easy rollbacks
- ✅ Preview channels

#### Steps:

1. **Install Firebase CLI**
```bash
npm i -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize Hosting**
```bash
firebase init hosting

# Select:
# - Use existing project: studio-6750997720-7c22e
# - Public directory: dist
# - Single-page app: Yes
# - GitHub Actions: No (for now)
```

4. **Build & Deploy**
```bash
npm run build
firebase deploy --only hosting
```

5. **Your site will be live at:**
```
https://studio-6750997720-7c22e.web.app
https://studio-6750997720-7c22e.firebaseapp.com
```

6. **Add Custom Domain** (Optional)
```bash
firebase hosting:channel:deploy production --domain mayegue.app
```

---

### Option 3: Netlify

#### Steps:

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Deploy**
```bash
netlify deploy --prod
```

3. **Configure in Netlify Dashboard**
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables

---

## 🔐 Environment Variables Setup

### Development (.env.local)
```env
# Firebase (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
VITE_FIREBASE_AUTH_DOMAIN=studio-6750997720-7c22e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-6750997720-7c22e
VITE_FIREBASE_STORAGE_BUCKET=studio-6750997720-7c22e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=853678151393
VITE_FIREBASE_APP_ID=1:853678151393:web:40332d5cd4cedb029cc9a0
VITE_FIREBASE_MEASUREMENT_ID=G-F60NV25RDJ

# AI (Get from Google AI Studio)
VITE_GEMINI_API_KEY=your_actual_gemini_key

# Payment (Get from CamPay)
VITE_CAMPAY_API_KEY=your_campay_username
VITE_CAMPAY_SECRET=your_campay_password
VITE_CAMPAY_ENVIRONMENT=production
VITE_NOUPAI_API_KEY=your_noupai_key
VITE_NOUPAI_MERCHANT_ID=your_merchant_id

# App
VITE_APP_NAME=Mayegue
VITE_APP_URL=https://mayegue.app
VITE_APP_VERSION=1.0.0
```

### Where to Get API Keys

#### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy and paste in `.env.local`

#### CamPay Credentials
1. Register at https://campay.net
2. Complete KYC
3. Get username and password from dashboard
4. Start in sandbox mode, switch to production after testing

#### NouPai Credentials
1. Contact NouPai at contact@noupai.cm
2. Request merchant account
3. Receive API key and merchant ID

---

## 📦 Build Optimization

### Current Bundle Size
```
Total: 874 KB (precached)
├── firebase-vendor: 496 KB (Firebase SDK)
├── react-vendor: 162 KB (React libraries)
├── index: 93 KB (App code)
├── checkout: 40 KB (Payment page)
└── Other chunks: 83 KB
```

### Optimization Tips

1. **Code Splitting** ✅ Already done
   - Lazy loading all routes
   - Vendor chunking

2. **Image Optimization**
```bash
# Use WebP format
# Compress images: https://squoosh.app
# Lazy load images with loading="lazy"
```

3. **Font Optimization**
```bash
# Use font-display: swap
# Subset fonts (Latin + local characters only)
```

4. **Further Optimizations** (Future)
```bash
# Install bundle analyzer
npm i -D rollup-plugin-visualizer

# Analyze bundle
npm run build -- --mode analyze
```

---

## 🧪 Testing Before Deployment

### Manual Testing Checklist

#### Authentication
- [ ] Email/password login works
- [ ] Google Sign-In works
- [ ] Registration creates user
- [ ] Forgot password sends email
- [ ] Reset password with code works
- [ ] Logout clears session

#### Role-Based Access
- [ ] Visitor sees public content only
- [ ] Learner redirected to learner dashboard
- [ ] Teacher can access teacher routes
- [ ] Admin can access admin routes
- [ ] Unauthorized access blocked

#### Features
- [ ] Dictionary search works
- [ ] Lessons list loads
- [ ] Lesson detail displays content
- [ ] AI assistant responds (with API key)
- [ ] Gamification displays stats
- [ ] Community page loads
- [ ] Profile shows user data
- [ ] Settings allows logout

#### Payment
- [ ] Pricing page displays correctly
- [ ] Checkout page loads
- [ ] Payment form validates
- [ ] CamPay integration works (sandbox)

#### PWA
- [ ] Service worker registers
- [ ] App installable on mobile
- [ ] Offline mode activates
- [ ] Cache strategies work
- [ ] Update prompt appears

#### Responsive
- [ ] Mobile (< 768px) - layout adapts
- [ ] Tablet (768px - 1024px) - columns adjust
- [ ] Desktop (> 1024px) - full layout

#### Cross-Browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

---

## 🔍 SEO Configuration

### Pre-Launch SEO Tasks

1. **Generate Sitemap**
```bash
npm run generate-sitemap
```

2. **Update meta tags** in `index.html`
   - ✅ Already configured
   - Update description if needed

3. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools

4. **Structured Data** (Future)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Mayegue",
  "description": "Apprentissage des langues camerounaises",
  "url": "https://mayegue.app"
}
</script>
```

---

## 📊 Monitoring & Analytics

### Setup Google Analytics
1. Firebase Analytics already configured ✅
2. Events tracked:
   - `page_view`
   - `login`, `sign_up`
   - `lesson_started`, `lesson_completed`
   - `begin_checkout`, `purchase`
   - `search`

### Setup Error Tracking (Optional)

**Sentry Integration**:
```bash
npm install @sentry/react

# Initialize in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

---

## 🚀 Deployment Workflows

### Continuous Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          # ... all other env vars
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔒 Security Hardening

### Pre-Production Security Tasks

1. **Enable Firebase App Check**
```typescript
// In firebase.config.ts
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

if (import.meta.env.PROD) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
    isTokenAutoRefreshEnabled: true
  });
}
```

2. **Content Security Policy**
Already configured in `index.html` ✅

3. **Rate Limiting**
Implement Firebase Functions for API endpoints:
```typescript
// functions/src/index.ts
export const rateLimitedEndpoint = functions.https.onCall(async (data, context) => {
  // Check rate limit with Redis or Firestore
});
```

4. **HTTPS Enforcement**
Vercel/Firebase Hosting handle this automatically ✅

---

## 📱 PWA Deployment

### Manifest Configuration
Already configured in `vite.config.ts` ✅

### Icons Required
Create these files:
```
public/assets/icons/
├── icon-192x192.png
├── icon-512x512.png
├── apple-touch-icon.png
└── favicon.ico
```

### Testing PWA
```bash
# Build and preview
npm run build
npm run preview

# Use Lighthouse in Chrome DevTools
# Check PWA score = 100
```

---

## 🗄️ Database Seeding

### Seed Firestore

Create `scripts/seed-firestore.ts`:
```typescript
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp();
const db = getFirestore(app);

async function seedLanguages() {
  const languages = [
    { id: 'ewondo', name: 'Ewondo', nativeName: 'Ewondo', region: 'Centre', speakers: 1200000 },
    { id: 'duala', name: 'Duala', nativeName: 'Duálá', region: 'Littoral', speakers: 500000 },
    { id: 'fulfulde', name: 'Fulfulde', nativeName: 'Fulfulde', region: 'Nord', speakers: 2000000 },
    // ... more languages
  ];

  for (const lang of languages) {
    await db.collection('languages').doc(lang.id).set(lang);
  }
}

seedLanguages().then(() => console.log('Seeded!'));
```

Run:
```bash
tsx scripts/seed-firestore.ts
```

---

## 🌍 Domain Configuration

### Custom Domain Setup (mayegue.app)

#### For Vercel:
```bash
vercel domains add mayegue.app

# Add DNS records at domain registrar:
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

#### For Firebase:
```bash
firebase hosting:channel:deploy live --domain mayegue.app

# Add TXT record for verification
# Add A records as shown in Firebase Console
```

### SSL Certificate
- Vercel: Automatic ✅
- Firebase: Automatic ✅
- Both providers handle Let's Encrypt certificates

---

## 📈 Performance Monitoring

### Lighthouse Audit
```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://mayegue.app --view

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 100
# PWA: 100
```

### Web Vitals Tracking
Already implemented in Firebase Analytics ✅

---

## 🔄 Update Strategy

### Rolling Updates
```bash
# Build new version
npm run build

# Deploy with preview
vercel --prod

# OR Firebase staging
firebase hosting:channel:deploy staging

# Test staging URL
# If good → deploy to production
firebase deploy --only hosting
```

### Rollback Strategy
```bash
# Vercel - automatic in dashboard
# Firebase
firebase hosting:clone source-site:source-channel target-site:target-channel
```

---

## 📊 Post-Deployment Monitoring

### Week 1 Checklist
- [ ] Monitor error rates (Firebase/Sentry)
- [ ] Check Core Web Vitals
- [ ] Review user feedback
- [ ] Monitor payment success rate
- [ ] Check API quota usage

### Month 1 Metrics
- Total users registered
- Daily active users (DAU)
- Lessons completed
- Revenue generated
- Retention rate (Day 7, Day 30)

---

## 🛠️ Maintenance Plan

### Weekly Tasks
- Review error logs
- Check API usage/costs
- Monitor performance metrics
- Update dependencies (security patches)

### Monthly Tasks
- Review and optimize slow queries
- Analyze user behavior (Analytics)
- A/B test new features
- Update content (new lessons)

### Quarterly Tasks
- Major dependency updates
- Performance optimization sprint
- Security audit
- Feature planning

---

## 🚨 Incident Response

### Production Down
```
1. Check Vercel/Firebase status
2. Review error logs
3. Rollback to previous version if needed
4. Fix issue
5. Deploy hotfix
6. Post-mortem analysis
```

### Data Loss Prevention
- Firebase auto-backup: Daily
- Manual backup: Before major changes
```bash
# Export Firestore
gcloud firestore export gs://your-bucket/backups

# Import if needed
gcloud firestore import gs://your-bucket/backups/timestamp
```

---

## ✅ Go-Live Checklist

### Final Steps Before Launch

1. **Technical**
   - [ ] All environment variables set
   - [ ] Firebase rules deployed
   - [ ] SSL certificate active
   - [ ] Custom domain configured
   - [ ] Service worker working
   - [ ] Analytics tracking
   - [ ] Error monitoring setup

2. **Content**
   - [ ] Seed Firestore with languages
   - [ ] Upload lesson content
   - [ ] Create demo lessons
   - [ ] Add sample dictionary entries
   - [ ] Test all user flows

3. **Legal**
   - [ ] Privacy policy reviewed
   - [ ] Terms of service reviewed
   - [ ] GDPR compliance verified
   - [ ] Cookie consent (if needed)

4. **Marketing**
   - [ ] Social media accounts ready
   - [ ] Launch announcement prepared
   - [ ] Press kit available
   - [ ] Contact support email active

5. **Support**
   - [ ] Support email monitored
   - [ ] FAQ page created
   - [ ] User documentation ready
   - [ ] Onboarding flow tested

---

## 🎉 Launch Day

### Timeline
```
T-24h: Final build and deploy to staging
T-12h: Full regression testing
T-6h:  Deploy to production
T-1h:  Final smoke tests
T-0:   Announce on social media
T+1h:  Monitor closely
T+24h: Review metrics
```

### Success Criteria
- ✅ Site loads in < 3 seconds
- ✅ Zero critical errors
- ✅ Authentication works
- ✅ Payment flow successful
- ✅ > 90 Lighthouse score

---

## 📞 Support Contacts

### Technical Issues
- Email: yvangodimomo@gmail.com
- Firebase Support: https://firebase.google.com/support

### Payment Issues
- CamPay: support@campay.net
- NouPai: contact@noupai.cm

---

## 🎯 Post-Launch Roadmap

### Version 1.1 (1 month)
- Real-time chat in community
- Push notifications
- Advanced lesson editor for teachers
- Student progress tracking

### Version 1.2 (2 months)
- Mobile app (React Native/Flutter)
- Offline mode completion
- Voice recording for pronunciation
- Video lessons

### Version 2.0 (6 months)
- Multi-language UI (English, local languages)
- Advanced AI features
- Live teacher sessions
- Certification system

---

**Ready to Deploy!** 🚀

Last Updated: October 1, 2025

