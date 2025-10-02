# 🚀 Mayegue Web - Quick Reference

## 🎯 User Roles & Permissions

### Visitor (Non-authenticated)
**Access**: `/`, `/about`, `/contact`, `/pricing`, `/dictionary` (limited), `/dashboard/guest`
- ✅ View public content
- ✅ Create account
- ✅ Demo dictionary access
- ❌ No progress saving

### Learner (Default authenticated)
**Access**: All visitor pages + `/dashboard/learner`, `/lessons`, `/ai-assistant`, `/gamification`, `/community`, `/profile`, `/settings`
- ✅ Complete lessons
- ✅ Track progress
- ✅ Use AI assistant
- ✅ Earn badges
- ✅ Join community

### Teacher
**Access**: All learner features + `/dashboard/teacher`, `/teacher/lessons`
- ✅ Create/edit lessons
- ✅ View student analytics
- ✅ Manage content
- ✅ Generate reports

### Admin
**Access**: Everything + `/dashboard/admin`, `/admin/analytics`
- ✅ Full system access
- ✅ User management
- ✅ Analytics dashboard
- ✅ Content moderation

---

## 🔑 Key Routes

### Public
- `/` - Homepage
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password (with code)
- `/pricing` - Pricing plans
- `/about` - About us
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/dictionary` - Dictionary (public limited access)

### Protected (Require Auth)
- `/dashboard` - Auto-redirect to role dashboard
- `/lessons` - Lessons list
- `/lessons/:id` - Lesson detail
- `/ai-assistant` - AI chat
- `/gamification` - Badges & XP
- `/community` - Forums & groups
- `/profile` - User profile
- `/settings` - User settings
- `/checkout` - Payment checkout

### Teacher-Only
- `/teacher/lessons` - Lesson management

### Admin-Only
- `/admin/analytics` - Analytics dashboard

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Services Available

### Authentication
```typescript
import { authService } from '@/core/services/firebase/auth.service';

// Login
await authService.signInWithEmail(email, password);
await authService.signInWithGoogle();

// Sign up
await authService.signUpWithEmail(email, password, name);

// Logout
await authService.signOut();

// Password reset
await authService.requestPasswordReset(email);
```

### Firestore
```typescript
import { firestoreService } from '@/core/services/firebase/firestore.service';

// CRUD
await firestoreService.getCollection('users');
await firestoreService.getDocument('users', userId);
await firestoreService.addDocument('users', userData);
await firestoreService.updateDocument('users', userId, updates);
await firestoreService.deleteDocument('users', userId);
```

### Payment
```typescript
import { campayService } from '@/core/services/payment/campay.service';

// Initiate payment
const payment = await campayService.initiatePayment({
  amount: 2500,
  description: 'Premium Plan',
  phoneNumber: '237XXXXXXXXX',
});
```

### AI
```typescript
import { geminiService } from '@/core/services/ai/gemini.service';

// Send message
const response = await geminiService.sendMessage(prompt);
```

---

## 🎨 UI Components

### Button
```tsx
import { Button } from '@/shared/components/ui/Button';

<Button variant="primary">Click me</Button>
<Button variant="outline">Outline</Button>
```

### Card
```tsx
import { Card } from '@/shared/components/ui/Card';

<Card className="p-6">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### Modal
```tsx
import { Modal } from '@/shared/components/ui/Modal';

<Modal open={isOpen} onClose={closeModal} title="Modal Title">
  <p>Modal content</p>
</Modal>
```

---

## 🪝 Custom Hooks

```typescript
// Authentication
import { useAuth } from '@/shared/hooks/useAuth';
const { user, login, logout, isAuthenticated } = useAuth();

// Online status
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
const isOnline = useOnlineStatus();

// Debounce
import { useDebounce } from '@/shared/hooks/useDebounce';
const debouncedValue = useDebounce(searchTerm, 300);

// Local storage
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
const [value, setValue] = useLocalStorage('key', initialValue);

// Media queries
import { useIsMobile, useIsDesktop } from '@/shared/hooks/useMediaQuery';
const isMobile = useIsMobile();
```

---

## 🗄️ State Management

### Auth Store
```typescript
import { useAuthStore } from '@/features/auth/store/authStore';

const { user, isAuthenticated, loading } = useAuthStore();
```

### Dictionary Store
```typescript
import { useDictionaryStore } from '@/features/dictionary/store/dictionaryStore';

const { searchTerm, setSearchTerm } = useDictionaryStore();
```

---

## 🎨 Tailwind Classes

### Buttons
```html
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-outline">Outline</button>
<button class="btn-ghost">Ghost</button>
```

### Cards
```html
<div class="card">Card content</div>
```

### Badges
```html
<span class="badge-primary">Primary</span>
<span class="badge-secondary">Secondary</span>
<span class="badge-success">Success</span>
```

### Typography
```html
<h1 class="heading-1">Heading 1</h1>
<h2 class="heading-2">Heading 2</h2>
<p class="gradient-text">Gradient text</p>
```

---

## 📱 Responsive Design

### Breakpoints
```
xs:  475px  (Mobile large)
sm:  640px  (Tablet portrait)
md:  768px  (Tablet landscape)
lg:  1024px (Desktop)
xl:  1280px (Desktop large)
2xl: 1536px (Desktop XL)
```

### Usage
```html
<div class="grid md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

---

## 🔐 Firebase Configuration

### Required Environment Variables
Create `.env.local` file:
```env
VITE_FIREBASE_API_KEY=AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
VITE_FIREBASE_AUTH_DOMAIN=studio-6750997720-7c22e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-6750997720-7c22e
VITE_FIREBASE_STORAGE_BUCKET=studio-6750997720-7c22e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=853678151393
VITE_FIREBASE_APP_ID=1:853678151393:web:40332d5cd4cedb029cc9a0
VITE_FIREBASE_MEASUREMENT_ID=G-F60NV25RDJ

VITE_GEMINI_API_KEY=your_gemini_key
VITE_CAMPAY_API_KEY=your_campay_key
VITE_CAMPAY_SECRET=your_campay_secret
```

---

## 🎯 Common Tasks

### Add a new page
1. Create page component in appropriate feature folder
2. Add lazy import in `router.tsx`
3. Add route in `<Routes>` section
4. Update navigation links if needed

### Add a new service
1. Create service file in `core/services/`
2. Export service instance
3. Import and use in components/hooks

### Add a new UI component
1. Create component in `shared/components/ui/`
2. Export component
3. Import with `@/shared/components/ui/ComponentName`

### Add analytics tracking
```typescript
import { analyticsService } from '@/core/services/firebase/analytics.service';

analyticsService.trackPageView('Home', '/');
analyticsService.trackSearch(searchTerm);
analyticsService.trackPaymentInitiated(amount, 'XAF', 'Premium');
```

---

## 🐛 Troubleshooting

### Build fails with import errors
- Ensure all imports use `@/shared/...` for shared components/hooks
- Don't use shorthand aliases like `@/components` in build

### TypeScript errors
- Run `npm run type-check` to see all errors
- Most common: missing type definitions or incorrect imports

### Firebase not working
- Check `.env.local` file exists and has correct values
- Verify Firebase project is active in console
- Enable authentication providers in Firebase console

### PWA not installing
- Must be served over HTTPS (or localhost)
- Check manifest.json is accessible
- Service worker must be registered

---

## 📚 Documentation

- `README.md` - Project overview
- `web-docs/` - Comprehensive documentation (8 files)
- `IMPLEMENTATION_STATUS.md` - Current implementation status
- `QUICK_REFERENCE.md` - This file

---

**Last Updated**: October 1, 2025

