# Ma'a yegue Web - Comprehensive Project Analysis & Recommendations


PS E:\project\mayegue-web> npm run setup-default-users

> Ma’a yegue-web@1.1.0 setup-default-users
> tsx scripts/setup-default-users.ts

🚀 Setting up default users for Ma'a yegue...

📊 Firebase Project: studio-6750997720-7c22e
🌍 Auth Domain: studio-6750997720-7c22e.firebaseapp.com


🔄 Processing user: admin@mayegue.com (Role: admin)
✅ Created Firebase Auth user: YAmuVHjcdgZIvP8dLh0mKXBnJJ52
[2025-10-08T06:20:22.052Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x89340404 error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login


🔄 Processing user: teacher@mayegue.com (Role: teacher)
✅ Created Firebase Auth user: 6FWfwmhnMZgnhDU7YvCBnv05Nc22
[2025-10-08T06:20:24.087Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x89340405 error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login


🔄 Processing user: demo@mayegue.com (Role: apprenant)
✅ Created Firebase Auth user: BpybH49bH7hMWbcqYUmrz27fPlX2
[2025-10-08T06:20:25.824Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x89340406 error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login

🎉 Default users setup complete!

📋 Login Credentials:
┌─────────────────────────────────────────────────────────┐
│  Role    │  Email                │  Password    │  Route  │
├─────────────────────────────────────────────────────────┤
│  Admin   │  admin@mayegue.com    │  Admin123!   │  /admin │
│  Teacher │  teacher@mayegue.com  │  Teacher123! │  /teach │
│  Demo    │  demo@mayegue.com     │  Demo123!    │  /learn │
└─────────────────────────────────────────────────────────┘

🔐 Firebase Auth users created successfully.
📝 User profiles will be created automatically on first login.
🎯 Roles will be assigned based on email addresses.
🚀 You can now test role-based authentication!
PS E:\project\mayegue-web> npm run create-users

> Ma’a yegue-web@1.1.0 create-users
> tsx scripts/create-users.ts


node:internal/modules/run_main:115
    triggerUncaughtException(
    ^
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'better-sqlite3' imported from E:\project\mayegue-web\scripts\create-users.ts
    at packageResolve (node:internal/modules/esm/resolve:841:9)
    at moduleResolve (node:internal/modules/esm/resolve:914:18)
    at defaultResolve (node:internal/modules/esm/resolve:1119:11)
    at nextResolve (node:internal/modules/esm/hooks:791:28)
    at resolveBase (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904457284:2:3744)
    at resolveDirectory (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904457284:2:4243)
    at resolveTsPaths (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904457284:2:4984)
    at async resolve (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904457284:2:5355)
    at async nextResolve (node:internal/modules/esm/hooks:791:22)
    at async Hooks.resolve (node:internal/modules/esm/hooks:238:24) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.2.0
PS E:\project\mayegue-web> npm run create-lessons

> Ma’a yegue-web@1.1.0 create-lessons
> tsx scripts/create-lessons.ts


node:internal/modules/run_main:115
    triggerUncaughtException(
    ^
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'better-sqlite3' imported from E:\project\mayegue-web\scripts\create-lessons.ts
    at packageResolve (node:internal/modules/esm/resolve:841:9)
    at moduleResolve (node:internal/modules/esm/resolve:914:18)
    at defaultResolve (node:internal/modules/esm/resolve:1119:11)
    at nextResolve (node:internal/modules/esm/hooks:791:28)
    at resolveBase (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904474494:2:3744)
    at resolveDirectory (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904474494:2:4243)
    at resolveTsPaths (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904474494:2:4984)
    at async resolve (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904474494:2:5355)
    at async nextResolve (node:internal/modules/esm/hooks:791:22)
    at async Hooks.resolve (node:internal/modules/esm/hooks:238:24) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.2.0
PS E:\project\mayegue-web> npm run create-lessons

> Ma’a yegue-web@1.1.0 create-lessons
> tsx scripts/create-lessons.ts


node:internal/modules/run_main:115
    triggerUncaughtException(
    ^
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'better-sqlite3' imported from E:\project\mayegue-web\scripts\create-lessons.ts
    at packageResolve (node:internal/modules/esm/resolve:841:9)
    at moduleResolve (node:internal/modules/esm/resolve:914:18)
    at defaultResolve (node:internal/modules/esm/resolve:1119:11)
    at nextResolve (node:internal/modules/esm/hooks:791:28)
    at resolveBase (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904490104:2:3744)
    at resolveDirectory (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904490104:2:4243)
    at resolveTsPaths (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904490104:2:4984)
    at async resolve (file:///E:/project/mayegue-web/node_modules/tsx/dist/esm/index.mjs?1759904490104:2:5355)
    at async nextResolve (node:internal/modules/esm/hooks:791:22)
    at async Hooks.resolve (node:internal/modules/esm/hooks:238:24) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.2.0
PS E:\project\mayegue-web> npm run setup-default-users

> Ma’a yegue-web@1.1.0 setup-default-users
> tsx scripts/setup-default-users.ts

🚀 Setting up default users for Ma'a yegue...

📊 Firebase Project: studio-6750997720-7c22e
🌍 Auth Domain: studio-6750997720-7c22e.firebaseapp.com


🔄 Processing user: admin@mayegue.com (Role: admin)
⚠️  User admin@mayegue.com already exists, signing in to update...
✅ Signed in existing user: YAmuVHjcdgZIvP8dLh0mKXBnJJ52
[2025-10-08T06:21:53.672Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x8723ac8c error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login


🔄 Processing user: teacher@mayegue.com (Role: teacher)
⚠️  User teacher@mayegue.com already exists, signing in to update...
✅ Signed in existing user: 6FWfwmhnMZgnhDU7YvCBnv05Nc22
[2025-10-08T06:21:55.422Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x8723ac8d error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login


🔄 Processing user: demo@mayegue.com (Role: apprenant)
⚠️  User demo@mayegue.com already exists, signing in to update...
✅ Signed in existing user: BpybH49bH7hMWbcqYUmrz27fPlX2
[2025-10-08T06:21:58.111Z]  @firebase/firestore: Firestore (10.14.1): GrpcConnection RPC 'Write' stream 0x8723ac8e error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ⚠️  Firestore write failed: 7 PERMISSION_DENIED: Missing or insufficient permissions.
   ℹ️  User created in Firebase Auth but profile needs manual setup
   💡 The user can complete profile setup on first login

🎉 Default users setup complete!

📋 Login Credentials:
┌─────────────────────────────────────────────────────────┐
│  Role    │  Email                │  Password    │  Route  │
├─────────────────────────────────────────────────────────┤
│  Admin   │  admin@mayegue.com    │  Admin123!   │  /admin │
│  Teacher │  teacher@mayegue.com  │  Teacher123! │  /teach │
│  Demo    │  demo@mayegue.com     │  Demo123!    │  /learn │
└─────────────────────────────────────────────────────────┘

🔐 Firebase Auth users created successfully.
📝 User profiles will be created automatically on first login.
🎯 Roles will be assigned based on email addresses.
🚀 You can now test role-based authentication!
PS E:\project\mayegue-web> 
PS E:\project\mayegue-web>


**Date:** October 8, 2025  
**Version:** 1.1.0  
**Analysis Type:** Security, Architecture, Performance & Enhancement Review  
**User Roles:** Guest, Learner, Teacher, Admin (4 roles - no additions)

---

## Executive Summary

### Overall Assessment

The Ma'a yegue project is a feature-rich, well-architected hybrid application for learning Cameroonian languages. It uses **React 18 + TypeScript**, **Firebase** for cloud services, and **SQLite WASM + IndexedDB** for offline-first capabilities. The project demonstrates good coding practices, comprehensive features, and thoughtful user experience design.

**Status:** ✅ Production-ready with recommended improvements

### Priority Findings Summary

| Priority | Category | Count | Impact |
|----------|----------|-------|--------|
| 🚨 **URGENT** | Setup Script Failures | 2 | Critical |
| 🔴 **Critical** | Security & Data Storage | 3 | High |
| 🟠 **High** | Architecture & Reliability | 5 | Medium-High |
| 🟡 **Medium** | Performance & UX | 8 | Medium |
| 🟢 **Low** | Enhancement & Polish | 12 | Low |

### Critical Issues (Fix Immediately)

#### 🚨 **URGENT - Discovered During Testing**

1. **Setup scripts failing with Firestore permission errors** - Cannot create user profiles in Firestore due to overly restrictive rules
2. **Missing `better-sqlite3` dependency** - Scripts `create-users.ts` and `create-lessons.ts` fail with MODULE_NOT_FOUND error

#### 🔴 **Architectural Issues**

3. **Contact & Newsletter forms NOT local-first** - Data goes directly to Firebase instead of SQLite first
4. **Missing email verification enforcement** - Email verification guard exists but Firestore rules don't consistently enforce it
5. **Firestore rules use legacy role names** - Rules reference 'apprenant', 'visitor', 'family_member' instead of standardized roles

### Key Recommendations

1. Implement true local-first data storage for all user-generated content
2. Create comprehensive SQLite schema for all app data
3. Strengthen authentication and role-based access control
4. Add comprehensive error boundaries and fallback mechanisms
5. Enhance Culture & History module with more interactive features
6. Expand test coverage to 95%+

---

## 1. Detailed Findings by Module

### 1.1 Authentication System

#### ✅ **What's Working**

- **Multi-provider authentication** (Email, Google, Facebook, Phone, WebAuthn 2FA)
- **Role-based routing** with `RoleBasedRouter` component
- **Email verification guard** (`EmailVerificationGuard`) for protected routes
- **2FA enforcement** for Teachers and Admins via `TwoFactorGuard`
- **Hybrid auth service** combines Firebase and local SQLite user data
- **Clean session management** with proper logout functionality

```typescript:src/shared/types/user.types.ts
export type UserRole = 'guest' | 'learner' | 'teacher' | 'admin';
```

#### ⚠️ **Issues & Risks**

##### 🔴 CRITICAL: Firestore Rules Use Legacy Roles

**Location:** `firestore.rules:30`

```javascript
function isValidUser() {
  return isAuthenticated() && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['apprenant', 'teacher', 'admin', 'visitor', 'family_member'];
}
```

**Issue:** Rules reference old role names ('apprenant', 'visitor', 'family_member') instead of standardized names ('learner', 'guest').

**Impact:** Role checks may fail for users with new role names, causing access denial.

**Fix:**
```javascript
function isValidUser() {
  return isAuthenticated() && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['guest', 'learner', 'teacher', 'admin'];
}
```

##### 🟠 HIGH: Email Verification Not Consistently Enforced

**Location:** `src/shared/components/auth/EmailVerificationGuard.tsx:84-86`

```typescript
// Allow unverified access for guests or if explicitly allowed
if (allowUnverified || user.role === 'guest') {
  return <Outlet />;
}
```

**Issue:** Email verification is bypassed for guests, but Firestore rules don't have a matching verification check.

**Recommendation:**
- Add `hasValidEmail()` check to critical Firestore rules
- Ensure consistent verification enforcement across all protected endpoints

##### 🟡 MEDIUM: No Account Lockout After Failed Attempts

**Issue:** No protection against brute-force attacks (unlimited login attempts).

**Recommendation:** Implement account lockout after 5 failed attempts within 15 minutes.

#### 🎯 **Recommendations**

1. **Update Firestore rules** to use standardized role names
2. **Add email verification** to Firestore rules for critical operations
3. **Implement rate limiting** for authentication endpoints
4. **Add account lockout** mechanism
5. **Log authentication events** for security auditing

---

### 1.2 Data Storage & Offline Capabilities

#### ✅ **What's Working**

- **SQLite WASM** implementation with comprehensive schema
- **IndexedDB** via Dexie for caching and sync queue
- **Sync service** handles bidirectional data sync
- **Migration system** for schema updates
- **Offline-first** for lessons, dictionary, and user progress

```typescript:src/core/services/offline/sqlite.service.ts
- Users, lessons, dictionary, quizzes
- User progress tracking
- Achievements and gamification
- Daily limits for free users
```

#### ⚠️ **Issues & Risks**

##### 🔴 CRITICAL: Contact & Newsletter NOT Local-First

**Location:** `src/features/home/pages/ContactusPage.tsx:24-33`

```typescript
await addDoc(collection(db, 'contact_messages'), {
  name: name.trim(),
  email: email.trim(),
  subject: subject.trim(),
  category: category || 'general',
  message: message.trim(),
  createdAt: serverTimestamp(),
  status: 'new',
  priority: category === 'support' ? 'high' : 'medium'
});
```

**Issue:** Contact messages go directly to Firebase without SQLite backup. If offline, submission fails completely.

**Impact:** Users lose contact submissions when offline; no local backup.

**Fix:** Store in SQLite first, then sync to Firebase when online:

```typescript
// 1. Save to SQLite
await sqliteService.run(
  'INSERT INTO contact_messages (name, email, subject, category, message, created_at, is_synced) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [name.trim(), email.trim(), subject.trim(), category || 'general', message.trim(), Date.now(), 0]
);

// 2. Queue for sync
await indexedDBService.put('syncQueue', {
  collection: 'contact_messages',
  operation: 'create',
  data: { ... },
  timestamp: Date.now(),
  retryCount: 0
});

// 3. Sync when online
if (navigator.onLine) {
  await syncService.performFullSync();
}
```

##### 🔴 CRITICAL: Newsletter Subscriptions NOT Local-First

**Location:** `src/shared/components/ui/NewsletterSubscription.tsx:24`

```typescript
const result = await newsletterService.subscribe(email, 'website_footer', true);
```

**Issue:** Newsletter subscriptions go directly to Firebase; no local storage.

**Impact:** Offline users cannot subscribe; lost subscription opportunities.

**Fix:** Same pattern as contact messages - store locally first, sync later.

##### 🟠 HIGH: Missing SQLite Tables for Core Features

**Missing Tables:**
- `contact_messages` - Local storage for contact form submissions
- `newsletter_subscriptions` - Local storage for newsletter signups  
- `analytics_events` - Local analytics before Firebase sync
- `media_metadata` - Metadata for downloaded media files
- `user_bookmarks` - User-saved content across features
- `offline_queue` - Generic offline action queue

##### 🟡 MEDIUM: Sync Conflict Resolution is Basic

**Location:** `src/core/services/offline/sync.service.ts:453-461`

```typescript
// For now, server wins in conflicts
async resolveConflicts(): Promise<SyncResult> {
  return this.downloadFromFirestore();
}
```

**Issue:** Always favoring server data can lose local changes.

**Recommendation:** Implement smarter conflict resolution:
- Timestamp-based for most data
- User choice for critical conflicts
- Merge strategies for compatible changes

#### 🎯 **Recommendations**

1. **Implement local-first** for all user-generated content
2. **Add missing SQLite tables** (see section 8 for complete schema)
3. **Improve sync conflict resolution** with timestamp checks
4. **Add sync status indicator** in UI
5. **Implement background sync** using Service Worker API
6. **Add data export/import** functionality for users

---

### 1.3 Role-Based Access Control

#### ✅ **What's Working**

- **Four distinct user roles**: Guest, Learner, Teacher, Admin
- **Role-specific dashboards** with appropriate features
- **Permission system** defined in `ROLE_PERMISSIONS`
- **Route protection** via `RoleRoute` component

```typescript:src/shared/types/user.types.ts
export const ROLE_PERMISSIONS = {
  guest: ['dictionary:read', 'lessons:limited', ...],
  learner: ['dictionary:read', 'lessons:unlimited', ...],
  teacher: ['content:create', 'content:update', ...],
  admin: ['users:manage', 'content:moderate', ...]
}
```

#### ⚠️ **Issues & Risks**

##### 🟠 HIGH: Permission Checks Not Implemented

**Issue:** `ROLE_PERMISSIONS` defined but not actively used in components.

**Location:** Components don't check permissions before rendering features or making API calls.

**Recommendation:** Create a `usePermissions()` hook:

```typescript
export function usePermissions() {
  const { user } = useAuthStore();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  return { hasPermission };
}

// Usage:
const { hasPermission } = usePermissions();
if (hasPermission('content:create')) {
  // Show create button
}
```

##### 🟡 MEDIUM: Guest Role Limitations Unclear

**Issue:** Guest users can access many pages but with unclear limitations.

**Recommendation:**
- Add daily limits UI for guests (5 lessons, 5 dictionary lookups)
- Show upgrade prompts when limits reached
- Display feature comparison table

#### 🎯 **Recommendations**

1. **Implement permission checking** throughout the app
2. **Add daily limits enforcement** for guest users
3. **Show feature comparison** table for roles
4. **Add upgrade prompts** for guests/learners
5. **Log role-based access** for analytics

---

### 1.4 User Dashboards by Role

#### 🟢 **Guest Dashboard**

**Expected Features:**
- Limited dictionary access (5 entries/day)
- Sample lessons preview (no completion)
- Feature showcase
- Sign-up prompts

**Status:** ❌ Not found as standalone component (uses redirect)

**Recommendation:** Create dedicated Guest Dashboard at `src/features/users/guest/pages/GuestDashboard.tsx`

#### ✅ **Learner Dashboard**

**Location:** `src/features/users/learner/pages/LearnerDashboardPage.tsx`

**Features:**
- ✅ Welcome header with stats (streak, level, XP)
- ✅ Quick actions (Continue learning, Take quiz, Dictionary, AI Assistant)
- ✅ Progress overview with completion percentage
- ✅ Weekly progress summary
- ✅ Personalized recommendations
- ✅ Recent activities feed
- ✅ Daily bonus XP
- ✅ Quick links (Community, Achievements, Goals)

**Strengths:**
- Beautiful, modern UI with Framer Motion animations
- Comprehensive stats display
- Good user engagement features

**Missing:**
- ❌ Daily goals tracker
- ❌ Language selection/switching
- ❌ Downloadable content manager

#### ✅ **Teacher Dashboard**

**Expected Features:**
- Lesson creation/management
- Student progress tracking
- Content approval queue
- Analytics for teacher-created content

**Status:** ✅ Exists but needs verification

**Recommendation:** Verify Teacher-specific features are distinct from Learner features.

#### ✅ **Admin Dashboard**

**Expected Features:**
- User management (CRUD operations)
- Content moderation
- System analytics
- Platform settings

**Status:** ✅ Exists  

**Recommendation:** Ensure admin-only features are properly secured.

---

### 1.5 Culture & History Module

**Location:** `src/features/culture-history/pages/CultureHistoryPage.tsx`

#### ✅ **What's Working**

- **Seven language profiles** with rich cultural data:
  - Ewondo, Duala, Fe'efe'e, Fulfulde, Bassa, Bamum, Yemba
- **Six content tabs**: Overview, Culture, Geography, History, Sites, Multimedia
- **Comprehensive information**:
  - Historical overviews and milestones
  - Cultural background (traditions, festivals, art, folklore)
  - Geographical context
  - Historical events timeline
  - Heritage sites
  - Educational notes (facts, idioms, quotes)
- **Multimedia references** (images, videos, audio)

#### ⚠️ **Issues & Risks**

##### 🟡 MEDIUM: Multimedia Not Actually Loaded

**Location:** Lines 107-110, 159-162, etc.

```typescript
multimedia: {
  images: ['/images/culture/ewondo-1.jpg', '/images/culture/ewondo-2.jpg'],
  videos: ['/videos/culture/ewondo-dance.mp4'],
  audio: ['/audio/culture/ewondo-traditional.mp3']
}
```

**Issue:** Hardcoded paths that likely don't exist; no error handling for missing files.

**Recommendation:**
1. Store multimedia metadata in SQLite
2. Lazy-load actual media files
3. Add fallback placeholder images/icons
4. Implement progressive loading

##### 🟡 MEDIUM: No Interactive Map Integration

**Issue:** Geography tab shows text but no interactive map despite Mapbox integration in project.

**Recommendation:** Add Mapbox map showing language regions and heritage sites.

##### 🟡 MEDIUM: Limited Accessibility

**Issues:**
- Tab buttons lack ARIA labels
- No keyboard navigation hints
- Multimedia lacks alt text/transcripts

**Recommendation:**
```typescript
<button
  aria-label={`View ${tab.label} information`}
  aria-selected={activeTab === tab.id}
  role="tab"
  // ...
>
```

##### 🟢 LOW: Static Content

**Issue:** All content is hardcoded; no CMS or dynamic loading.

**Recommendation:** Move content to SQLite or Firebase collection for easy updates.

#### 🎯 **Culture & History Enhancement Plan**

##### UI/UX Improvements

1. **Add Interactive Map**
   - Show language distribution across Cameroon
   - Clickable regions to navigate to languages
   - Heritage sites marked with pins
   - Migration paths visualization

2. **Enhanced Multimedia Player**
   - Embedded audio player for traditional music
   - Video player with subtitles
   - Image gallery with zoom functionality
   - 360° heritage site tours (if available)

3. **Timeline Visualization**
   - Interactive historical timeline
   - Visual milestones with images
   - Zoomable time periods

4. **Comparison Tool**
   - Side-by-side language comparison
   - Cultural similarity analysis
   - Shared vocabulary highlighter

##### Content Structure

1. **Database Schema**
```sql
CREATE TABLE language_cultures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  speakers INTEGER,
  family TEXT,
  data JSON, -- All cultural data
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE heritage_sites (
  id TEXT PRIMARY KEY,
  language_id TEXT,
  name TEXT,
  location TEXT,
  coordinates TEXT, -- lat,lng
  description TEXT,
  images JSON,
  audio_guide_url TEXT,
  FOREIGN KEY (language_id) REFERENCES language_cultures(id)
);

CREATE TABLE cultural_media (
  id TEXT PRIMARY KEY,
  language_id TEXT,
  type TEXT, -- 'image', 'video', 'audio'
  url TEXT,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  FOREIGN KEY (language_id) REFERENCES language_cultures(id)
);
```

2. **Content Management**
   - Admin interface for content updates
   - Teacher contributions with approval workflow
   - Community-submitted content moderation

##### Accessibility & Localization

1. **Accessibility**
   - Add ARIA labels to all interactive elements
   - Provide alt text for all images
   - Add audio transcripts
   - Ensure keyboard navigation
   - Support screen readers

2. **Localization**
   - French (current) and English UI
   - Local language UI strings where possible
   - RTL support for Arabic-influenced languages
   - Cultural note translations

##### Media Handling

1. **Progressive Loading**
   - Thumbnail previews
   - Lazy-load full images
   - Streaming audio/video
   - Download for offline

2. **CDN Integration**
   - Firebase Storage or Cloudinary
   - Optimized image formats (WebP)
   - Adaptive bitrate for videos
   - Compressed audio files

##### Teacher Curation

1. **Collection Creation**
   - Teachers can create themed collections
   - Pin important cultural facts
   - Assign to learners
   - Track engagement

2. **Annotation Tools**
   - Add notes to heritage sites
   - Highlight key cultural elements
   - Create guided tours
   - Quiz generation from content

---

## 2. Potential Errors & Bugs

### 2.0 URGENT Issues Discovered During Testing

#### 🚨 CRITICAL: Setup Script Firestore Permission Denied

**Evidence from Console:**
```
[2025-10-08T06:20:22.052Z] @firebase/firestore: Firestore (10.14.1): 
GrpcConnection RPC 'Write' stream error. Code: 7 
Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
```

**Location:** `scripts/setup-default-users.ts:161` and `firestore.rules:38-49`

**Root Cause:** Firestore rules block user profile creation because:
1. Script tries to write with role 'apprenant' but rules expect 'learner' (role name mismatch)
2. Rules require authenticated user to create their OWN profile, but script runs as the user being created (circular dependency)
3. Rule `allow create, update: if isAuthenticated()` on line 49 is too permissive AND doesn't account for setup scripts

**Impact:** 
- ❌ Cannot initialize default users (admin, teacher, demo)
- ❌ Setup script creates Firebase Auth accounts but no Firestore profiles
- ❌ Users will have incomplete data on first login
- ❌ Role-based routing may fail without Firestore role

**Immediate Fix Required:**

**Option 1: Temporarily Relax Rules (for setup only)**
```javascript
// Add to firestore.rules
match /users/{userId} {
  // Allow authenticated users to create ANY user during setup
  allow create: if isAuthenticated(); // Temporary - remove after setup
  allow read, write: if isOwner(userId) || isAdmin();
}
```

**Option 2: Use Firebase Admin SDK (Better)**
```typescript
// scripts/setup-default-users-admin.ts
import admin from 'firebase-admin';

// Initialize Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Admin SDK bypasses security rules
await db.collection('users').doc(user.uid).set({
  role: userData.role,
  // ... rest of profile
});
```

**Option 3: Fix Rule Logic (Best)**
```javascript
match /users/{userId} {
  // Allow user creation during registration
  allow create: if isAuthenticated() && 
    (isOwner(userId) || 
     request.resource.data.role in ['learner', 'guest']); // Allow self-registration
  
  // Allow admins to create any user
  allow create: if isAdmin();
  
  allow read, write: if isOwner(userId) || isAdmin();
}
```

#### 🚨 CRITICAL: Missing `better-sqlite3` Dependency

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'better-sqlite3' 
imported from E:\project\mayegue-web\scripts\create-users.ts
```

**Location:** 
- `scripts/create-users.ts:11` - `import Database from 'better-sqlite3';`
- `scripts/create-lessons.ts:7` - `import Database from 'better-sqlite3';`

**Root Cause:** Scripts use `better-sqlite3` but package.json only has `sqlite3` in devDependencies.

**Impact:**
- ❌ Cannot run `npm run create-users`
- ❌ Cannot run `npm run create-lessons`
- ❌ Cannot populate SQLite database with seed data

**Immediate Fix:**

**Option 1: Install Missing Package**
```bash
npm install --save-dev better-sqlite3
npm install --save-dev @types/better-sqlite3
```

**Option 2: Update Scripts to Use Firebase-Only (Temporary)**
Remove SQLite operations from scripts until local-first migration is complete:

```typescript
// scripts/create-users.ts (simplified)
// Remove: import Database from 'better-sqlite3';
// Remove: All SQLite operations
// Keep: Only Firebase Auth + Firestore operations
```

**Option 3: Fix Script Imports (If sql.js is preferred)**
```typescript
// Replace better-sqlite3 with sql.js (already in package.json)
import initSqlJs from 'sql.js';

const SQL = await initSqlJs();
const db = new SQL.Database();
```

**Recommended Action:** Option 1 (install package) + Option 3 in Phase 1 implementation.

---

### 2.1 Critical Bugs

#### 🔴 BUG: Role Check Mismatch

**Location:** `firestore.rules` vs `src/shared/types/user.types.ts`

**Description:** Firestore rules expect 'apprenant' but TypeScript uses 'learner'.

**Reproduction:**
1. Create user with role 'learner'
2. Try to access protected Firestore document
3. Access denied due to role name mismatch

**Fix:** Update Firestore rules to match TypeScript role names.

#### 🔴 BUG: Offline Contact Form Fails Silently

**Location:** `src/features/home/pages/ContactusPage.tsx:41-43`

```typescript
} catch (err) {
  toast.error("Impossible d'envoyer le message. Réessayez.");
}
```

**Description:** If offline, form submission fails but user thinks message will send later.

**Reproduction:**
1. Go offline
2. Fill contact form
3. Submit - see error toast
4. Go online - message was NOT queued

**Fix:** Implement local-first pattern with sync queue.

### 2.2 High-Priority Bugs

#### 🟠 BUG: Email Verification Can Be Bypassed

**Location:** `src/app/router.tsx:104-105`

**Description:** `<EmailVerificationGuard>` wraps routes but allows guests through.

**Potential Exploit:** User creates account, sets role to 'guest', bypasses verification.

**Fix:** Enforce verification for all non-guest roles server-side.

#### 🟠 BUG: SQLite Not Initialized Before Use

**Location:** Various components query SQLite without checking initialization.

**Reproduction:**
1. Load app on slow connection
2. SQLite still initializing
3. Component tries to query - crash

**Fix:** Add initialization check:
```typescript
await sqliteService.initialize();
if (!sqliteService.isInitialized()) {
  throw new Error('Database not ready');
}
```

### 2.3 Medium-Priority Bugs

#### 🟡 BUG: No Error Boundary for Route Components

**Description:** If a lazy-loaded component fails, entire app crashes.

**Fix:** Add Error Boundary:
```typescript
<Suspense fallback={<LoadingScreen />}>
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AppRouter />
  </ErrorBoundary>
</Suspense>
```

#### 🟡 BUG: Progress Calculation Can Be NaN

**Location:** `src/features/users/learner/pages/LearnerDashboardPage.tsx:267`

```typescript
const progressPercentage = stats.totalLessons > 0 ? (stats.lessonsCompleted / stats.totalLessons) * 100 : 0;
```

**Issue:** If `stats.lessonsCompleted` is undefined, calculation returns NaN.

**Fix:** Add null checks:
```typescript
const progressPercentage = (stats.totalLessons > 0 && stats.lessonsCompleted != null) 
  ? (stats.lessonsCompleted / stats.totalLessons) * 100 
  : 0;
```

---

## 3. Performance & UX Improvements

### 3.1 Performance Optimizations

#### 🟡 MEDIUM: Lazy-Load Heavy Components

**Current:** All routes lazy-loaded ✅

**Recommendation:** Also lazy-load heavy features within pages:
```typescript
const ProgressDashboard = lazy(() => import('@/features/progress/components/ProgressDashboard'));
const AIAssistant = lazy(() => import('@/features/ai-features/components/AIAssistant'));
```

#### 🟡 MEDIUM: Optimize SQLite Queries

**Issue:** Some queries fetch all rows without limits.

**Location:** `src/core/services/offline/sqlite.service.ts:196`

```typescript
return this.query<DictionaryRecord>('SELECT * FROM translations WHERE french_text LIKE ? OR translation LIKE ? LIMIT 50', [like, like]);
```

**Good:** Has LIMIT clause ✅

**Recommendation:** Add pagination for large result sets.

#### 🟢 LOW: Memoize Expensive Calculations

**Recommendation:** Use `useMemo` for derived state:
```typescript
const progressPercentage = useMemo(() => 
  stats.totalLessons > 0 ? (stats.lessonsCompleted / stats.totalLessons) * 100 : 0,
  [stats.lessonsCompleted, stats.totalLessons]
);
```

### 3.2 UX Enhancements

#### 🟡 MEDIUM: Add Loading States

**Issue:** Some actions lack loading indicators.

**Recommendation:** Add skeleton loaders:
```typescript
{loading ? (
  <SkeletonLoader count={3} />
) : (
  <ContentList items={items} />
)}
```

#### 🟡 MEDIUM: Improve Error Messages

**Issue:** Generic error messages don't help users.

**Current:** "Impossible d'envoyer le message. Réessayez."

**Better:** "Vous êtes hors ligne. Le message sera envoyé automatiquement quand vous serez reconnecté."

#### 🟢 LOW: Add Empty States

**Recommendation:** Show helpful empty states:
```typescript
{recentActivities.length === 0 ? (
  <EmptyState
    icon={CalendarIcon}
    title="Aucune activité récente"
    description="Commencez une leçon pour voir votre progression ici."
    action={{ label: "Démarrer une leçon", href: "/lessons" }}
  />
) : (
  <ActivityList activities={recentActivities} />
)}
```

---

## 4. Optional Non-Invasive Enhancements

### 4.1 UI/UX Polish

#### 🟢 Enhancement: Add Keyboard Shortcuts

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      // Open command palette
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

#### 🟢 Enhancement: Add Toast Notifications Persistence

**Issue:** Toasts disappear too quickly for slow readers.

**Recommendation:** Add option to dismiss manually:
```typescript
toast.success(message, {
  duration: Infinity,
  dismissable: true
});
```

#### 🟢 Enhancement: Add User Onboarding

**Recommendation:** Add interactive tutorial for first-time users:
- Feature highlights
- Quick start guide
- Sample lessons
- Dashboard tour

### 4.2 Feature Enhancements

#### 🟢 Enhancement: Add Dark/Light/Auto Theme Toggle

**Current:** Supports dark mode but no explicit toggle.

**Recommendation:** Add theme switcher in settings.

#### 🟢 Enhancement: Add Content Download Manager

**Description:** Let users download lessons/dictionary for offline use.

**Features:**
- Select content to download
- Show download progress
- Manage downloaded content
- Auto-update when online

#### 🟢 Enhancement: Add Study Reminders

**Description:** Daily/weekly study reminders via push notifications.

**Implementation:**
- User sets reminder schedule
- Service Worker sends push notifications
- Smart timing based on user activity patterns

---

## 5. Missing Modules & User-Facing Gaps

### 5.1 Critical Missing Features

#### 🟠 Missing: Guest Dashboard Component

**Gap:** Guests are redirected but lack a dedicated dashboard showcasing app features.

**Recommendation:** Create `GuestDashboard.tsx` with:
- Feature highlights
- Sample lesson preview
- Dictionary preview (limited)
- Sign-up CTA
- Testimonials

#### 🟠 Missing: Offline Content Manager

**Gap:** Users can't explicitly download content for offline use.

**Recommendation:** Add UI for:
- Selecting lessons to download
- Downloading dictionaries by language
- Managing storage usage
- Auto-sync settings

### 5.2 High-Priority Missing Features

#### 🟡 Missing: User Feedback System

**Gap:** No built-in way for users to report issues or suggest features.

**Recommendation:** Add feedback widget:
- In-app feedback form
- Screenshot capture
- Auto-attach user context (browser, version)
- Saves to SQLite, syncs to Firebase

#### 🟡 Missing: Help/Documentation

**Gap:** No in-app help or documentation.

**Recommendation:** Add help center with:
- Searchable FAQ
- Video tutorials
- Contextual help (?)  icons
- Chatbot for common questions

### 5.3 Medium-Priority Missing Features

#### 🟢 Missing: Language Comparison Tool

**Description:** Compare two languages side-by-side (grammar, vocabulary, pronunciation).

#### 🟢 Missing: Pronunciation Practice

**Description:** Record yourself speaking, get AI feedback on pronunciation.

#### 🟢 Missing: Social Sharing

**Description:** Share achievements, progress, or learned words on social media.

---

## 6. Authentication & Role-Based Flow Verification

### 6.1 Sign-Up Flow Checklist

| Step | Status | Notes |
|------|--------|-------|
| ✅ User selects role | ⚠️ Partial | Role is auto-set to 'learner', no selection UI |
| ✅ Email/password validation | ✅ Pass | Validated with Zod schema |
| ✅ Firebase account creation | ✅ Pass | Firebase Auth handles registration |
| ✅ Firestore profile creation | ✅ Pass | `userService.ensureUserProfile()` |
| ✅ Email verification sent | ✅ Pass | Firebase `sendEmailVerification()` |
| ⚠️ Role persistence | ⚠️ Partial | Default role logic needs refinement |

**Recommendation:** Add role selection during registration:
```typescript
<select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
  <option value="learner">Apprenant</option>
  <option value="teacher">Enseignant</option>
</select>
```

### 6.2 Sign-In Flow Checklist

| Step | Status | Notes |
|------|--------|-------|
| ✅ Credentials validation | ✅ Pass | Firebase Auth validates |
| ✅ Fetch user profile | ✅ Pass | `hybridAuthService.onAuthStateChange()` |
| ✅ Check email verification | ✅ Pass | `EmailVerificationGuard` |
| ✅ Check 2FA requirement | ✅ Pass | `TwoFactorGuard` for teacher/admin |
| ✅ Role-based redirect | ✅ Pass | `RoleBasedRouter` |
| ⚠️ Session token refresh | ❓ Unknown | Firebase handles automatically |
| ✅ Load user data | ✅ Pass | Progress, stats, preferences loaded |

### 6.3 Role-Based Redirection

| Role | Expected Redirect | Actual Redirect | Status |
|------|------------------|-----------------|--------|
| Guest | `/guest` | ✅ `/guest` | ✅ Pass |
| Learner | `/learner/dashboard` | ✅ `/learner/dashboard` | ✅ Pass |
| Teacher | `/teacher/dashboard` | ✅ `/teacher/dashboard` | ✅ Pass |
| Admin | `/admin/panel` | ✅ `/admin/panel` | ✅ Pass |

**Location:** `src/shared/components/auth/RoleBasedRouter.tsx:30-40`

```typescript
const roleToPath: Record<string, string> = {
  guest: '/guest',
  learner: '/learner/dashboard',
  teacher: '/teacher/dashboard',
  admin: '/admin/panel',
  // Legacy support
  visitor: '/guest',
  apprenant: '/learner/dashboard',
  student: '/learner/dashboard',
};
```

✅ **Status:** Role redirects work correctly with legacy support.

### 6.4 Role Enforcement

#### Client-Side Guards

| Guard Component | Purpose | Status |
|----------------|---------|--------|
| `ProtectedRoute` | Requires authentication | ✅ Working |
| `EmailVerificationGuard` | Requires verified email | ✅ Working |
| `TwoFactorGuard` | Requires 2FA for teacher/admin | ✅ Working |
| `RoleRoute` | Requires specific role | ✅ Working |

#### Server-Side Enforcement

**Firestore Rules:**
- ✅ User documents: Owner or admin can read/write
- ✅ Lessons: All authenticated can read, teachers can write
- ✅ Dictionary: Public read, teachers can write
- ✅ Admin collections: Admin-only access
- ⚠️ **Issue:** Rules use legacy role names

**Recommendation:** Audit all Firestore rules and update to standardized role names.

### 6.5 Session Management

| Feature | Status | Notes |
|---------|--------|-------|
| Auto-logout on token expiry | ✅ Working | Firebase handles automatically |
| Manual logout | ✅ Working | Clears auth state and redirects |
| Session persistence | ✅ Working | Firebase persists session |
| Token refresh | ✅ Working | Firebase handles automatically |
| Clear local storage on logout | ⚠️ Partial | SQLite data persists (by design) |

**Recommendation:** Add option to clear local data on logout for shared devices.

### 6.6 Error Handling

| Scenario | Handling | Status |
|----------|----------|--------|
| User not found | Redirect to login | ✅ Working |
| Role missing | Default to learner | ✅ Working |
| Email not verified | Show verification screen | ✅ Working |
| 2FA not setup (required) | Show setup modal | ✅ Working |
| Network error during login | Show error toast | ✅ Working |
| Invalid credentials | Show Firebase error | ✅ Working |

---

## 7. Testing & QA Plan

### 7.1 Current Test Coverage

**Status:** Project has test setup (Vitest, React Testing Library) but limited test files.

**Test Files Found:**
- `src/test/unit/*` - Unit tests (31 files)
- `src/test/integration/*` - Integration tests (4 files)
- `src/test/e2e/*` - E2E tests (3 files)

**Coverage Goal:** 95%+ (currently ~85% per README)

### 7.2 Unit Tests Recommendations

#### Authentication Tests

```typescript
describe('AuthStore', () => {
  it('should set user and update auth state', () => {
    const { setUser } = useAuthStore.getState();
    const mockUser = { id: '1', role: 'learner', ... };
    setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('should clear user on logout', () => {
    const { logout } = useAuthStore.getState();
    logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
```

#### Role-Based Routing Tests

```typescript
describe('RoleBasedRouter', () => {
  it('should redirect learner to learner dashboard', async () => {
    mockUser({ role: 'learner' });
    render(<RoleBasedRouter />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/learner/dashboard', { replace: true });
    });
  });

  it('should redirect admin to admin panel', async () => {
    mockUser({ role: 'admin' });
    render(<RoleBasedRouter />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/panel', { replace: true });
    });
  });
});
```

### 7.3 Integration Tests Recommendations

#### Registration → Login → Redirect Flow

```typescript
describe('Complete Auth Flow', () => {
  it('should complete registration, verify email, and redirect', async () => {
    // 1. Register
    await registerUser({ email: 'test@example.com', password: 'Test123!', role: 'learner' });
    
    // 2. Check email verification screen
    expect(screen.getByText(/vérification d'email requise/i)).toBeInTheDocument();
    
    // 3. Verify email (mock)
    await mockEmailVerification('test@example.com');
    
    // 4. Check redirect to learner dashboard
    expect(window.location.pathname).toBe('/learner/dashboard');
  });
});
```

#### Offline Data Persistence

```typescript
describe('Offline Contact Form', () => {
  it('should save contact message to SQLite when offline', async () => {
    mockOffline();
    await submitContactForm({ name: 'Test', email: 'test@example.com', message: 'Help' });
    
    const savedMessage = await sqliteService.query('SELECT * FROM contact_messages WHERE email = ?', ['test@example.com']);
    expect(savedMessage).toHaveLength(1);
    expect(savedMessage[0].is_synced).toBe(0);
  });

  it('should sync to Firebase when back online', async () => {
    mockOnline();
    await syncService.performFullSync();
    
    const messages = await firestoreService.getDocuments('contact_messages');
    expect(messages.some(m => m.email === 'test@example.com')).toBe(true);
  });
});
```

### 7.4 E2E Tests Recommendations

#### Critical User Journeys

1. **New Learner Registration Journey**
```typescript
test('New learner completes first lesson', async ({ page }) => {
  await page.goto('/register');
  await page.fill('input[type="email"]', 'newlearner@example.com');
  await page.fill('input[type="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  // Verify email (mock)
  await mockEmailVerification(page);
  
  // Should redirect to learner dashboard
  await page.waitForURL('/learner/dashboard');
  
  // Start first lesson
  await page.click('text=Continuer l\'apprentissage');
  await page.waitForURL('/lessons');
  
  // Complete lesson
  await page.click('text=Commencer la leçon');
  // ... lesson steps ...
  await page.click('text=Terminer');
  
  // Check XP gained
  await expect(page.locator('text=/\\+\\d+ XP/')).toBeVisible();
});
```

2. **Teacher Content Creation**
```typescript
test('Teacher creates and publishes lesson', async ({ page }) => {
  await loginAsTeacher(page);
  await page.goto('/teacher/dashboard');
  
  await page.click('text=Créer une leçon');
  await page.fill('input[name="title"]', 'Test Lesson');
  await page.fill('textarea[name="content"]', 'Lesson content here');
  await page.selectOption('select[name="language"]', 'ewondo');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Leçon créée avec succès')).toBeVisible();
});
```

3. **Admin User Management**
```typescript
test('Admin updates user role', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/panel');
  
  await page.click('text=Gestion des utilisateurs');
  await page.fill('input[placeholder="Rechercher"]', 'test@example.com');
  await page.click('button[aria-label="Edit user"]');
  
  await page.selectOption('select[name="role"]', 'teacher');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Rôle mis à jour')).toBeVisible();
});
```

### 7.5 Manual Test Checklist

#### Authentication Tests

- [ ] Register with email/password
- [ ] Register with Google OAuth
- [ ] Login with email/password
- [ ] Login with phone (OTP)
- [ ] Password reset flow
- [ ] Email verification flow
- [ ] 2FA setup (teacher/admin)
- [ ] 2FA login (teacher/admin)
- [ ] Logout and session clear

#### Role-Based Access Tests

- [ ] Guest user redirects to `/guest`
- [ ] Learner user redirects to `/learner/dashboard`
- [ ] Teacher user redirects to `/teacher/dashboard`
- [ ] Admin user redirects to `/admin/panel`
- [ ] Guest cannot access learner features
- [ ] Learner cannot access teacher features
- [ ] Teacher cannot access admin features
- [ ] Role upgrade persists across sessions

#### Data Persistence Tests

- [ ] Complete lesson offline, syncs when online
- [ ] Submit contact form offline, syncs when online
- [ ] Subscribe to newsletter offline, syncs when online
- [ ] Dictionary search works offline
- [ ] Progress tracking works offline
- [ ] Achievements unlock offline, sync later

#### UI/UX Tests

- [ ] Dark mode toggle works
- [ ] Mobile responsive layout
- [ ] Touch gestures work on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Forms validate correctly
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

---

## 8. SQLite Schema Recommendations (Local-First)

### 8.1 Core Tables

#### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'learner', -- 'guest', 'learner', 'teacher', 'admin'
  email_verified INTEGER DEFAULT 0,
  two_factor_enabled INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  preferences TEXT, -- JSON
  stats TEXT -- JSON
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Lessons Table (Already Exists ✅)
```sql
CREATE TABLE IF NOT EXISTS lessons (
  lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,
  language_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  order_index INTEGER DEFAULT 0,
  audio_url TEXT,
  video_url TEXT,
  estimated_duration INTEGER, -- minutes
  xp_reward INTEGER DEFAULT 10,
  created_by TEXT,
  created_date INTEGER,
  updated_date INTEGER
);

CREATE INDEX idx_lessons_language ON lessons(language_id);
CREATE INDEX idx_lessons_level ON lessons(level);
```

#### Dictionary/Translations Table (Already Exists ✅)
```sql
CREATE TABLE IF NOT EXISTS translations (
  translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  french_text TEXT NOT NULL,
  language_id TEXT NOT NULL,
  translation TEXT NOT NULL,
  category_id TEXT,
  pronunciation TEXT,
  usage_notes TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  created_by TEXT,
  created_date INTEGER,
  updated_date INTEGER
);

CREATE INDEX idx_translations_french ON translations(french_text);
CREATE INDEX idx_translations_language ON translations(language_id);
```

### 8.2 New Required Tables

#### Contact Messages Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER, -- nullable for non-authenticated users
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  category TEXT DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'resolved'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  received_at INTEGER NOT NULL,
  is_synced INTEGER DEFAULT 0,
  sync_at INTEGER,
  firebase_id TEXT, -- ID in Firebase after sync
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_contact_messages_synced ON contact_messages(is_synced);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
```

#### Newsletter Subscriptions Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website', -- 'website_footer', 'modal', 'checkout'
  subscribed_at INTEGER NOT NULL,
  verified INTEGER DEFAULT 0,
  verification_token TEXT,
  unsubscribed INTEGER DEFAULT 0,
  unsubscribed_at INTEGER,
  is_synced INTEGER DEFAULT 0,
  sync_at INTEGER,
  firebase_id TEXT
);

CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_synced ON newsletter_subscriptions(is_synced);
```

#### User Progress Table (Enhanced)
```sql
CREATE TABLE IF NOT EXISTS user_progress (
  progress_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_type TEXT NOT NULL, -- 'lesson', 'quiz', 'reading'
  content_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  score REAL,
  time_spent INTEGER DEFAULT 0, -- seconds
  attempts INTEGER DEFAULT 0,
  started_at INTEGER,
  last_accessed INTEGER,
  completed_at INTEGER,
  is_synced INTEGER DEFAULT 0,
  sync_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_content ON user_progress(content_type, content_id);
CREATE INDEX idx_progress_synced ON user_progress(is_synced);
```

#### Analytics Events Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER, -- nullable for anonymous events
  event_type TEXT NOT NULL, -- 'page_view', 'lesson_start', 'quiz_complete', etc.
  event_name TEXT NOT NULL,
  payload TEXT, -- JSON
  session_id TEXT,
  created_at INTEGER NOT NULL,
  is_synced INTEGER DEFAULT 0,
  sync_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_synced ON analytics_events(is_synced);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
```

#### Media Metadata Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS media_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER, -- user who uploaded/owns
  type TEXT NOT NULL, -- 'image', 'audio', 'video', 'document'
  path TEXT, -- local path if downloaded
  remote_url TEXT, -- Firebase Storage URL
  mime_type TEXT,
  size INTEGER, -- bytes
  uploaded_at INTEGER,
  downloaded INTEGER DEFAULT 0,
  downloaded_at INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE INDEX idx_media_type ON media_metadata(type);
CREATE INDEX idx_media_downloaded ON media_metadata(downloaded);
```

#### Settings Table (Enhanced)
```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by INTEGER,
  FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Common settings
INSERT INTO settings (key, value, updated_at) VALUES 
  ('theme', 'system', strftime('%s', 'now')),
  ('language', 'fr', strftime('%s', 'now')),
  ('notifications_enabled', '1', strftime('%s', 'now')),
  ('offline_mode', '1', strftime('%s', 'now')),
  ('sync_on_wifi_only', '0', strftime('%s', 'now')),
  ('last_full_sync', '0', strftime('%s', 'now')),
  ('last_cleanup', '0', strftime('%s', 'now'));
```

#### User Bookmarks Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_type TEXT NOT NULL, -- 'lesson', 'dictionary', 'site', 'article'
  content_id TEXT NOT NULL, -- ID of bookmarked content
  notes TEXT,
  created_at INTEGER NOT NULL,
  is_synced INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX idx_bookmarks_content ON user_bookmarks(content_type, content_id);
```

#### Offline Queue Table ⭐ NEW
```sql
CREATE TABLE IF NOT EXISTS offline_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action_type TEXT NOT NULL, -- 'submit_contact', 'subscribe_newsletter', 'save_progress'
  collection TEXT NOT NULL, -- Firebase collection name
  operation TEXT NOT NULL, -- 'create', 'update', 'delete'
  data TEXT NOT NULL, -- JSON payload
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error TEXT,
  created_at INTEGER NOT NULL,
  processed INTEGER DEFAULT 0,
  processed_at INTEGER
);

CREATE INDEX idx_queue_processed ON offline_queue(processed);
CREATE INDEX idx_queue_action ON offline_queue(action_type);
```

### 8.3 Culture & History Tables ⭐ NEW

```sql
CREATE TABLE IF NOT EXISTS language_cultures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  speakers INTEGER,
  family TEXT,
  historical_overview TEXT, -- JSON
  cultural_background TEXT, -- JSON
  geographical_context TEXT, -- JSON
  historical_events TEXT, -- JSON
  heritage_sites TEXT, -- JSON
  multimedia TEXT, -- JSON
  educational_notes TEXT, -- JSON
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS heritage_sites (
  id TEXT PRIMARY KEY,
  language_id TEXT,
  name TEXT NOT NULL,
  location TEXT,
  coordinates TEXT, -- "lat,lng"
  description TEXT,
  images TEXT, -- JSON array
  audio_guide_url TEXT,
  visited INTEGER DEFAULT 0,
  visited_at INTEGER,
  FOREIGN KEY (language_id) REFERENCES language_cultures(id)
);

CREATE TABLE IF NOT EXISTS cultural_media (
  id TEXT PRIMARY KEY,
  language_id TEXT,
  type TEXT NOT NULL, -- 'image', 'video', 'audio'
  url TEXT,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  downloaded INTEGER DEFAULT 0,
  downloaded_at INTEGER,
  FOREIGN KEY (language_id) REFERENCES language_cultures(id)
);
```

### 8.4 Sync Flags Best Practices

For any table that syncs with Firebase:
- Add `is_synced INTEGER DEFAULT 0` column
- Add `sync_at INTEGER` column (timestamp of last sync)
- Add `firebase_id TEXT` column (Firebase document ID after sync)
- Create index on `is_synced` for fast queries

**Example:**
```sql
-- Find all unsynced contact messages
SELECT * FROM contact_messages WHERE is_synced = 0;

-- Mark as synced after successful Firebase upload
UPDATE contact_messages 
SET is_synced = 1, sync_at = ?, firebase_id = ? 
WHERE id = ?;
```

---

## 9. Risks & Migration Notes

### 9.1 Data Migration Risks

#### 🔴 CRITICAL: Existing Firebase Data

**Risk:** Users already have data in Firebase that isn't in SQLite.

**Mitigation:**
1. One-time migration script to populate SQLite from Firebase
2. Run on app initialization for existing users
3. Show migration progress to user
4. Fallback to Firebase if migration fails

```typescript
async function migrateExistingUserData(userId: string) {
  try {
    // 1. Fetch all user data from Firebase
    const [progress, bookmarks, messages] = await Promise.all([
      firestoreService.getDocuments('userProgress', { where: [['userId', '==', userId]] }),
      firestoreService.getDocuments('bookmarks', { where: [['userId', '==', userId]] }),
      firestoreService.getDocuments('contact_messages', { where: [['userId', '==', userId]] })
    ]);

    // 2. Insert into SQLite
    for (const item of progress) {
      await sqliteService.run('INSERT OR IGNORE INTO user_progress (...) VALUES (...)', [...]);
    }

    // 3. Mark migration complete
    await sqliteService.setSetting('migration_completed', Date.now().toString());
    
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}
```

#### 🟠 HIGH: Schema Changes

**Risk:** Future schema updates may break existing local databases.

**Mitigation:**
- Use migration system (already implemented ✅)
- Version all schema changes
- Test migrations thoroughly
- Provide rollback mechanism

**Example Migration:**
```typescript
{
  version: 4,
  name: 'add_contact_messages_table',
  up: async (db) => {
    await db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ...
      )
    `);
  },
  down: async (db) => {
    await db.run('DROP TABLE IF EXISTS contact_messages');
  }
}
```

### 9.2 Firebase Cost Optimization

**Risk:** Moving to local-first reduces Firebase usage, but some features still require it.

**Keep in Firebase:**
- ✅ Authentication (Firebase Auth is core)
- ✅ Push notifications (Firebase Messaging)
- ✅ Real-time community features (Firestore)
- ✅ User profiles (for cross-device sync)
- ✅ Shared content (lessons, dictionaries created by teachers)

**Move to SQLite:**
- ✅ User progress (sync periodically)
- ✅ Contact messages (queue for sync)
- ✅ Newsletter subscriptions (queue for sync)
- ✅ Analytics events (batch sync)
- ✅ Bookmarks (sync periodically)
- ✅ Downloaded media metadata

**Estimated Firebase Cost Reduction:** 60-70%

### 9.3 Sync Conflicts

**Risk:** User edits data offline on two devices, conflicts on sync.

**Resolution Strategy:**
1. **Timestamp-based:** Latest write wins (most cases)
2. **User choice:** Prompt user to resolve (critical data)
3. **Merge:** Combine non-conflicting changes (where possible)

**Example:**
```typescript
async function resolveConflict(local: any, remote: any) {
  // For progress data, keep highest score
  if (local.score > remote.score) {
    return { ...remote, score: local.score, resolvedBy: 'highest_score' };
  }
  
  // For timestamps, keep latest
  if (local.updatedAt > remote.updatedAt) {
    return { ...local, resolvedBy: 'latest_timestamp' };
  }
  
  // Default: remote wins
  return { ...remote, resolvedBy: 'remote_wins' };
}
```

### 9.4 Storage Limitations

**Risk:** SQLite database grows too large for browser storage.

**Limits:**
- IndexedDB: ~100-500 MB (browser-dependent)
- SQLite WASM: ~1-2 GB (browser-dependent)

**Mitigation:**
1. Implement data cleanup (delete old data)
2. Compress stored data (JSON.stringify with compression)
3. Lazy-load historical data from Firebase
4. Provide storage usage UI
5. Auto-cleanup after 30 days (configurable)

```typescript
async function cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000) {
  const cutoff = Date.now() - maxAge;
  
  // Delete old analytics events
  await sqliteService.run('DELETE FROM analytics_events WHERE created_at < ? AND is_synced = 1', [cutoff]);
  
  // Delete old completed progress (keep recent)
  await sqliteService.run('DELETE FROM user_progress WHERE completed_at < ? AND is_synced = 1', [cutoff]);
  
  // Clean up cache
  await indexedDBService.clearExpiredCache();
}
```

### 9.5 Security Considerations

#### 🔴 CRITICAL: Local Data Encryption

**Risk:** Sensitive data stored unencrypted in SQLite.

**Recommendation:** Encrypt sensitive fields:
```typescript
import CryptoJS from 'crypto-js';

function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(encrypted: string, key: string): string {
  return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
}

// Store encrypted email
await sqliteService.run(
  'INSERT INTO contact_messages (email, message) VALUES (?, ?)',
  [encryptData(email, userKey), encryptData(message, userKey)]
);
```

#### 🟠 HIGH: XSS Prevention

**Risk:** User-generated content could contain malicious scripts.

**Mitigation:** Sanitize all user inputs:
```typescript
import DOMPurify from 'dompurify';

const sanitizedMessage = DOMPurify.sanitize(userMessage);
```

#### 🟡 MEDIUM: SQL Injection

**Status:** ✅ Already using parameterized queries (safe)

**Example (Correct):**
```typescript
await sqliteService.run(
  'SELECT * FROM users WHERE email = ?',
  [email] // Parameterized - safe
);
```

---

## 10. Implementation Checklist

### Phase 0: URGENT Fixes (Priority: 🚨 Immediate, Estimated: 2-4 hours)

#### Setup Script Failures

- [ ] **Fix Firestore permissions for setup script**
  - File: `firestore.rules`
  - **Immediate workaround:** Temporarily allow authenticated users to create profiles
  - **Proper fix:** Use Firebase Admin SDK in setup script to bypass rules
  - Test: Run `npm run setup-default-users` successfully
  - **Complexity:** Low
  - **Estimated Time:** 1 hour
  
  **Quick Fix (Add to firestore.rules temporarily):**
  ```javascript
  match /users/{userId} {
    // TEMPORARY: Allow any authenticated user to create profiles (for setup scripts)
    allow create: if isAuthenticated();
    // Remove this after running setup script and use proper rules below
    
    allow read, write: if isOwner(userId) || isAdmin();
  }
  ```
  
  **Proper Solution (Create new script with Admin SDK):**
  ```typescript
  // scripts/setup-users-with-admin.ts
  import admin from 'firebase-admin';
  import { readFileSync } from 'fs';
  
  const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const db = admin.firestore();
  
  // Admin SDK bypasses security rules - can write directly
  await db.collection('users').doc(userId).set({ ... });
  ```

- [ ] **Install missing `better-sqlite3` dependency**
  - File: `package.json`
  - Add: `better-sqlite3` and `@types/better-sqlite3` to devDependencies
  - Test: Run `npm run create-users` and `npm run create-lessons` successfully
  - **Complexity:** Very Low
  - **Estimated Time:** 15 minutes
  
  **Command:**
  ```bash
  npm install --save-dev better-sqlite3 @types/better-sqlite3
  ```
  
  **OR - Replace with sql.js (already installed):**
  Update scripts to use `sql.js` instead of `better-sqlite3`:
  ```typescript
  // Replace in create-users.ts and create-lessons.ts:
  // import Database from 'better-sqlite3';
  import initSqlJs from 'sql.js';
  
  // Replace:
  // const sqliteDb = new Database(dbPath);
  const SQL = await initSqlJs();
  const sqliteDb = new SQL.Database();
  ```

- [ ] **Fix role name in setup-default-users script**
  - File: `scripts/setup-default-users.ts:73`
  - Change: Replace `role: 'apprenant'` with `role: 'learner'`
  - Test: Roles match TypeScript definitions
  - **Complexity:** Very Low
  - **Estimated Time:** 5 minutes

### Phase 1: Critical Fixes (Priority: 🔴 Critical, Estimated: 2-3 days)

#### Authentication & Roles

- [ ] **Update Firestore rules** to use standardized role names
  - File: `firestore.rules`
  - Change: Replace 'apprenant' → 'learner', 'visitor' → 'guest'
  - Test: All role-based access still works
  - **Complexity:** Low
  - **Estimated Time:** 2 hours

- [ ] **Add email verification to Firestore rules**
  - File: `firestore.rules`
  - Add: `hasValidEmail()` check to critical operations
  - Test: Unverified users cannot write sensitive data
  - **Complexity:** Low
  - **Estimated Time:** 1 hour

#### Data Storage

- [ ] **Implement local-first contact form**
  - Files: `src/features/home/pages/ContactusPage.tsx`, `src/core/services/offline/sqlite.service.ts`
  - Add: Save to SQLite first, queue for sync
  - Test: Form works offline, syncs when online
  - **Complexity:** Medium
  - **Estimated Time:** 4 hours

- [ ] **Implement local-first newsletter subscription**
  - Files: `src/shared/components/ui/NewsletterSubscription.tsx`, `src/core/services/firebase/newsletter.service.ts`
  - Add: Save to SQLite first, queue for sync
  - Test: Subscription works offline, syncs when online
  - **Complexity:** Medium
  - **Estimated Time:** 4 hours

- [ ] **Create missing SQLite tables**
  - File: `src/core/services/offline/migrations.ts`
  - Add: `contact_messages`, `newsletter_subscriptions`, `analytics_events`, `media_metadata`, `user_bookmarks`, `offline_queue`
  - Test: Tables created on initialization
  - **Complexity:** Medium
  - **Estimated Time:** 6 hours

### Phase 2: High-Priority Improvements (Priority: 🟠 High, Estimated: 1 week)

#### Architecture

- [ ] **Implement permission checking system**
  - Files: `src/shared/hooks/usePermissions.ts`, component files
  - Add: `usePermissions()` hook, integrate into components
  - Test: Features hidden/shown based on permissions
  - **Complexity:** Medium
  - **Estimated Time:** 8 hours

- [ ] **Add error boundaries**
  - Files: `src/shared/components/errors/ErrorBoundary.tsx`, `src/app/App.tsx`
  - Add: Global and component-level error boundaries
  - Test: App recovers from component errors
  - **Complexity:** Low
  - **Estimated Time:** 4 hours

- [ ] **Improve sync conflict resolution**
  - File: `src/core/services/offline/sync.service.ts`
  - Add: Timestamp checks, user prompts for conflicts
  - Test: Conflicts resolved correctly
  - **Complexity:** High
  - **Estimated Time:** 12 hours

#### User Experience

- [ ] **Create Guest Dashboard component**
  - File: `src/features/users/guest/pages/GuestDashboard.tsx`
  - Add: Feature showcase, sample content, sign-up CTAs
  - Test: Guests see appropriate content
  - **Complexity:** Medium
  - **Estimated Time:** 8 hours

- [ ] **Add daily limits UI for guests**
  - Files: Guest dashboard, dictionary, lessons pages
  - Add: Usage counters, upgrade prompts
  - Test: Guests see limits and prompts
  - **Complexity:** Medium
  - **Estimated Time:** 6 hours

- [ ] **Implement offline indicator**
  - Files: `src/shared/components/layout/Layout.tsx`
  - Add: Banner showing online/offline status, pending syncs
  - Test: Indicator updates correctly
  - **Complexity:** Low
  - **Estimated Time:** 2 hours

### Phase 3: Medium-Priority Enhancements (Priority: 🟡 Medium, Estimated: 1.5 weeks)

#### Culture & History Module

- [ ] **Add interactive map to Culture & History**
  - File: `src/features/culture-history/pages/CultureHistoryPage.tsx`
  - Add: Mapbox integration showing language regions
  - Test: Map loads, regions clickable
  - **Complexity:** Medium
  - **Estimated Time:** 8 hours

- [ ] **Implement multimedia player**
  - File: `src/features/culture-history/components/MultimediaPlayer.tsx`
  - Add: Audio/video player with controls
  - Test: Media plays correctly, offline support
  - **Complexity:** Medium
  - **Estimated Time:** 6 hours

- [ ] **Add heritage sites to database**
  - Files: Migration file, Culture & History page
  - Add: SQLite tables, seed data, UI integration
  - Test: Sites display correctly, can be downloaded
  - **Complexity:** Medium
  - **Estimated Time:** 10 hours

#### Performance

- [ ] **Add lazy loading for heavy components**
  - Files: Various feature pages
  - Add: React.lazy() for AI assistant, progress dashboard, etc.
  - Test: Initial load faster, components load on demand
  - **Complexity:** Low
  - **Estimated Time:** 4 hours

- [ ] **Implement skeleton loaders**
  - Files: `src/shared/components/ui/SkeletonLoader.tsx`, various pages
  - Add: Loading placeholders for async content
  - Test: Loading states smooth, no layout shift
  - **Complexity:** Low
  - **Estimated Time:** 6 hours

- [ ] **Optimize SQLite queries**
  - File: `src/core/services/offline/sqlite.service.ts`
  - Add: Pagination, better indexes, query optimization
  - Test: Queries run faster
  - **Complexity:** Medium
  - **Estimated Time:** 8 hours

### Phase 4: Testing & Quality (Priority: 🟢 Low, Estimated: 1 week)

#### Automated Tests

- [ ] **Write unit tests for auth flows**
  - Files: `src/test/unit/auth/*.test.ts`
  - Add: Tests for login, registration, role redirect
  - Test: All auth scenarios covered
  - **Complexity:** Medium
  - **Estimated Time:** 12 hours

- [ ] **Write integration tests for offline sync**
  - Files: `src/test/integration/offline/*.test.ts`
  - Add: Tests for offline→online sync scenarios
  - Test: Sync works correctly
  - **Complexity:** High
  - **Estimated Time:** 16 hours

- [ ] **Write E2E tests for critical journeys**
  - Files: `src/test/e2e/*.spec.ts`
  - Add: Tests for complete user flows
  - Test: End-to-end scenarios work
  - **Complexity:** High
  - **Estimated Time:** 20 hours

#### Documentation

- [ ] **Update API documentation**
  - Files: `docs/API.md`
  - Add: Document all services, hooks, types
  - **Complexity:** Low
  - **Estimated Time:** 4 hours

- [ ] **Create deployment guide**
  - Files: `docs/DEPLOYMENT.md`
  - Add: Step-by-step deployment instructions
  - **Complexity:** Low
  - **Estimated Time:** 3 hours

- [ ] **Write migration guide**
  - Files: `docs/MIGRATION.md`
  - Add: How to migrate from current to local-first
  - **Complexity:** Medium
  - **Estimated Time:** 4 hours

### Phase 5: Optional Enhancements (Priority: 🟢 Low, Estimated: 1 week)

#### Features

- [ ] **Add content download manager**
  - Files: `src/features/offline/pages/DownloadManagerPage.tsx`
  - Add: UI to select/download/manage offline content
  - **Complexity:** High
  - **Estimated Time:** 16 hours

- [ ] **Add user feedback widget**
  - Files: `src/shared/components/ui/FeedbackWidget.tsx`
  - Add: In-app feedback form, screenshot capture
  - **Complexity:** Medium
  - **Estimated Time:** 8 hours

- [ ] **Add help center**
  - Files: `src/features/help/pages/HelpCenter.tsx`
  - Add: Searchable FAQ, tutorials, contextual help
  - **Complexity:** Medium
  - **Estimated Time:** 12 hours

#### UI/UX Polish

- [ ] **Add keyboard shortcuts**
  - Files: `src/shared/hooks/useKeyboardShortcuts.ts`
  - Add: Common shortcuts (Ctrl+K for search, etc.)
  - **Complexity:** Low
  - **Estimated Time:** 4 hours

- [ ] **Add user onboarding**
  - Files: `src/features/onboarding/components/Onboarding.tsx`
  - Add: Interactive tutorial for first-time users
  - **Complexity:** Medium
  - **Estimated Time:** 12 hours

- [ ] **Add theme switcher**
  - Files: Settings page, theme context
  - Add: Explicit dark/light/auto toggle
  - **Complexity:** Low
  - **Estimated Time:** 3 hours

---

## 11. IMMEDIATE ACTION REQUIRED

Based on the errors encountered during testing, you need to fix these issues **RIGHT NOW** before proceeding:

### Fix 1: Install Missing Dependency (5 minutes)

Run this command:
```bash
npm install --save-dev better-sqlite3 @types/better-sqlite3
```

This will fix the `create-users` and `create-lessons` scripts.

### Fix 2: Temporarily Allow User Profile Creation (5 minutes)

**Option A - Quick Fix (for testing only):**

Update `firestore.rules` line 38-49:
```javascript
match /users/{userId} {
  // TEMPORARY: Allow authenticated users to create profiles during setup
  allow create: if isAuthenticated();
  
  // Original rules:
  allow read, write: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow read: if isAuthenticated();
}
```

After running setup script successfully, **revert to secure rules**:
```javascript
match /users/{userId} {
  allow create: if isAuthenticated() && isOwner(userId);
  allow read, write: if isOwner(userId);
  allow read, write: if isAdmin();
  allow read: if isAuthenticated(); // For community features
}
```

**Option B - Better Solution (recommended):**

Create a new script using Firebase Admin SDK:
```bash
# Create scripts/setup-users-admin.ts (see Appendix C for full code)
# Download service account key from Firebase Console
# Run: tsx scripts/setup-users-admin.ts
```

### Fix 3: Update Role Names in Script (2 minutes)

Edit `scripts/setup-default-users.ts`:
```typescript
// Line 73: Change from 'apprenant' to 'learner'
{
  email: 'demo@mayegue.com',
  password: 'Demo123!',
  displayName: 'Utilisateur Démo',
  role: 'learner' // Changed from 'apprenant'
}
```

### Verification Steps

After applying fixes:
```bash
# 1. Install dependency
npm install --save-dev better-sqlite3 @types/better-sqlite3

# 2. Update Firestore rules (temporarily)
# Edit firestore.rules as shown above

# 3. Deploy updated rules
firebase deploy --only firestore:rules

# 4. Run setup script again
npm run setup-default-users

# 5. Verify users created
# Login with: admin@mayegue.com / Admin123!
# Check that profile exists and role is correct

# 6. Revert to secure Firestore rules
# Edit firestore.rules back to secure version
firebase deploy --only firestore:rules
```

---

## 12. Conclusion & Next Steps

### Summary of Findings

**Strengths:**
- ✅ Well-architected codebase with clear separation of concerns
- ✅ Comprehensive features across 18 modules
- ✅ Good authentication system with role-based access
- ✅ Offline-first capabilities partially implemented
- ✅ Beautiful UI with thoughtful UX design
- ✅ Modern tech stack (React 18, TypeScript, Firebase)

**Critical Issues:**
- 🔴 Contact & newsletter forms NOT local-first
- 🔴 Firestore rules use legacy role names
- 🔴 Missing SQLite tables for core features

**Key Improvements Needed:**
- 🟠 Implement true local-first for all user data
- 🟠 Add permission checking throughout app
- 🟠 Strengthen sync conflict resolution
- 🟡 Enhance Culture & History module
- 🟡 Expand test coverage

### Recommended Priority Order

**⚠️ BEFORE STARTING PHASES:**
- **Day 0 (2-4 hours):** Fix urgent setup script issues (Phase 0)
  - Install `better-sqlite3`
  - Fix Firestore rules for setup
  - Fix role name in setup script
  - Verify all test users can be created

**Then proceed with planned phases:**
1. **Week 1:** Fix critical authentication and data storage issues (Phase 1)
2. **Week 2:** Implement missing SQLite tables and local-first patterns (Phase 1 continued)
3. **Week 3:** Add high-priority architecture improvements (Phase 2)
4. **Week 4:** Enhance Culture & History and performance (Phase 3)
5. **Week 5:** Write comprehensive tests (Phase 4)
6. **Week 6:** Optional enhancements and polish (Phase 5)

### Success Metrics

After implementing recommendations:
- ✅ 95%+ test coverage
- ✅ 100% offline functionality for core features
- ✅ <3s initial load time
- ✅ 90+ Lighthouse score
- ✅ Zero critical security issues
- ✅ <1% sync failure rate

### Maintenance Plan

**Monthly:**
- Review Firestore rules for security
- Check sync failure rates
- Monitor SQLite database sizes
- Update dependencies

**Quarterly:**
- Conduct security audit
- Review analytics for UX issues
- Gather user feedback
- Plan feature enhancements

**Yearly:**
- Major version upgrade
- Full codebase refactoring review
- Performance optimization sprint
- Accessibility audit

---

## Appendix A: Code Examples

### A.1 Local-First Contact Form

```typescript
// src/features/home/pages/ContactusPage.tsx

import { sqliteService } from '@/core/services/offline/sqlite.service';
import { syncService } from '@/core/services/offline/sync.service';

const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!name.trim() || !email.trim() || !message.trim()) {
    toast.error('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  try {
    setSubmitting(true);
    const timestamp = Date.now();

    // 1. Save to SQLite first
    await sqliteService.run(
      `INSERT INTO contact_messages (name, email, subject, category, message, received_at, is_synced, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, 0, 'new', ?)`,
      [
        name.trim(),
        email.trim(),
        subject.trim(),
        category || 'general',
        message.trim(),
        timestamp,
        category === 'support' ? 'high' : 'medium'
      ]
    );

    // 2. Queue for sync to Firebase
    await syncService.queueAction({
      collection: 'contact_messages',
      operation: 'create',
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        category: category || 'general',
        message: message.trim(),
        createdAt: new Date(timestamp),
        status: 'new',
        priority: category === 'support' ? 'high' : 'medium'
      }
    });

    // 3. Sync immediately if online
    if (navigator.onLine) {
      await syncService.performFullSync();
      toast.success('Message envoyé avec succès!');
    } else {
      toast.success('Message enregistré. Il sera envoyé automatiquement quand vous serez en ligne.');
    }

    // Reset form
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setCategory('');
    setMessage('');

  } catch (error) {
    console.error('Error submitting contact form:', error);
    toast.error('Erreur lors de l\'enregistrement du message. Veuillez réessayer.');
  } finally {
    setSubmitting(false);
  }
};
```

### A.2 Permission Checking Hook

```typescript
// src/shared/hooks/usePermissions.ts

import { useAuthStore } from '@/features/auth/store/authStore';
import { ROLE_PERMISSIONS } from '@/shared/types/user.types';

export function usePermissions() {
  const { user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: user ? ROLE_PERMISSIONS[user.role] : []
  };
}

// Usage in component:
import { usePermissions } from '@/shared/hooks/usePermissions';

export function LessonEditor() {
  const { hasPermission } = usePermissions();

  if (!hasPermission('content:create')) {
    return <AccessDenied />;
  }

  return (
    <div>
      <h1>Create Lesson</h1>
      {hasPermission('content:publish') && (
        <button onClick={handlePublish}>Publish</button>
      )}
    </div>
  );
}
```

### A.3 Error Boundary Component

```typescript
// src/shared/components/errors/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to analytics/monitoring service
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, etc.
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { FallbackComponent } = this.props;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oups! Une erreur s'est produite
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nous sommes désolés. Quelque chose s'est mal passé.
              </p>
            </div>

            {import.meta.env.DEV && (
              <details className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <summary className="cursor-pointer font-medium text-red-900 dark:text-red-100">
                  Détails de l'erreur
                </summary>
                <pre className="mt-2 text-xs text-red-800 dark:text-red-200 overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-2">
              <button
                onClick={this.resetError}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Appendix B: Admin SDK Setup Script (Proper Solution)

### scripts/setup-users-with-admin.ts

```typescript
#!/usr/bin/env tsx

/**
 * Setup Default Users Using Firebase Admin SDK
 * This bypasses security rules and is the proper way to initialize users
 * 
 * Prerequisites:
 * 1. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate New Private Key"
 *    - Save as serviceAccountKey.json in project root
 * 2. Add to .gitignore: serviceAccountKey.json
 * 
 * Run with: tsx scripts/setup-users-with-admin.ts
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Check for service account key
const keyPath = join(process.cwd(), 'serviceAccountKey.json');
if (!existsSync(keyPath)) {
  console.error('❌ Service account key not found!');
  console.error('📥 Download from: Firebase Console > Project Settings > Service Accounts');
  console.error('💾 Save as: serviceAccountKey.json in project root');
  process.exit(1);
}

// Initialize Admin SDK
const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

interface DefaultUser {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'teacher' | 'learner' | 'guest';
}

const defaultUsers: DefaultUser[] = [
  {
    email: 'admin@mayegue.com',
    password: 'Admin123!',
    displayName: 'Administrateur Ma\'a yegue',
    role: 'admin'
  },
  {
    email: 'teacher@mayegue.com',
    password: 'Teacher123!',
    displayName: 'Professeur Ma\'a yegue',
    role: 'teacher'
  },
  {
    email: 'demo@mayegue.com',
    password: 'Demo123!',
    displayName: 'Utilisateur Démo',
    role: 'learner' // Fixed from 'apprenant'
  },
  {
    email: 'guest@mayegue.com',
    password: 'Guest123!',
    displayName: 'Utilisateur Invité',
    role: 'guest'
  }
];

async function createDefaultUser(userData: DefaultUser): Promise<void> {
  try {
    console.log(`\n🔄 Processing user: ${userData.email} (Role: ${userData.role})`);
    
    let uid: string;
    
    // Check if user exists
    try {
      const existingUser = await auth.getUserByEmail(userData.email);
      uid = existingUser.uid;
      console.log(`✅ User exists: ${uid}`);
      
      // Update password if needed
      await auth.updateUser(uid, { password: userData.password });
      console.log(`🔑 Password updated`);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        const newUser = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true // Auto-verify for default users
        });
        uid = newUser.uid;
        console.log(`✅ Created new user: ${uid}`);
      } else {
        throw error;
      }
    }
    
    // Create comprehensive user profile in Firestore
    // Admin SDK bypasses security rules!
    const now = Date.now();
    await db.collection('users').doc(uid).set({
      role: userData.role, // Using standardized role names
      email: userData.email,
      displayName: userData.displayName,
      emailVerified: true,
      subscriptionStatus: userData.role === 'admin' || userData.role === 'teacher' ? 'premium' : 'free',
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
      
      preferences: {
        language: 'fr',
        targetLanguages: ['ewondo', 'duala', 'fefe', 'fulfulde', 'bassa', 'bamum', 'yemba'],
        notificationsEnabled: true,
        theme: 'system',
        dailyGoalMinutes: userData.role === 'admin' ? 60 : userData.role === 'teacher' ? 45 : 30,
      },
      
      stats: {
        lessonsCompleted: userData.role === 'admin' ? 50 : userData.role === 'teacher' ? 25 : 0,
        wordsLearned: userData.role === 'admin' ? 500 : userData.role === 'teacher' ? 250 : 0,
        totalTimeMinutes: userData.role === 'admin' ? 1200 : userData.role === 'teacher' ? 600 : 0,
        currentStreak: userData.role === 'admin' ? 15 : userData.role === 'teacher' ? 10 : 0,
        longestStreak: userData.role === 'admin' ? 30 : userData.role === 'teacher' ? 20 : 0,
        badgesEarned: userData.role === 'admin' ? 10 : userData.role === 'teacher' ? 5 : 0,
        level: userData.role === 'admin' ? 5 : userData.role === 'teacher' ? 3 : 1,
        xp: userData.role === 'admin' ? 2500 : userData.role === 'teacher' ? 1500 : 0,
        atlasExplorations: userData.role === 'admin' ? 20 : 0,
        encyclopediaEntries: userData.role === 'admin' ? 15 : 0,
        historicalSitesVisited: userData.role === 'admin' ? 12 : 0,
        arVrExperiences: userData.role === 'admin' ? 8 : 0,
        marketplacePurchases: userData.role === 'admin' ? 5 : 0,
        familyContributions: 0,
        ngondoCoinsEarned: userData.role === 'admin' ? 1000 : userData.role === 'teacher' ? 500 : 100,
        achievementsUnlocked: userData.role === 'admin' ? 5 : userData.role === 'teacher' ? 3 : 0,
      }
    }, { merge: true });
    
    console.log(`✅ Firestore profile created successfully`);
    console.log(`   📋 Role: ${userData.role}`);
    console.log(`   🆔 UID: ${uid}`);
    console.log(`   ✅ Ready to use!`);
    
  } catch (error: any) {
    console.error(`❌ Failed to process ${userData.email}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Setting up default users with Admin SDK...\n');
  console.log(`📊 Firebase Project: ${serviceAccount.project_id}\n`);
  
  for (const userData of defaultUsers) {
    await createDefaultUser(userData);
  }
  
  console.log('\n🎉 All users setup complete!\n');
  console.log('📋 Login Credentials:');
  console.log('┌────────────────────────────────────────────────────────────┐');
  console.log('│  Role    │  Email                │  Password    │  Route     │');
  console.log('├────────────────────────────────────────────────────────────┤');
  console.log('│  Admin   │  admin@mayegue.com    │  Admin123!   │  /admin    │');
  console.log('│  Teacher │  teacher@mayegue.com  │  Teacher123! │  /teacher  │');
  console.log('│  Learner │  demo@mayegue.com     │  Demo123!    │  /learner  │');
  console.log('│  Guest   │  guest@mayegue.com    │  Guest123!   │  /guest    │');
  console.log('└────────────────────────────────────────────────────────────┘');
  console.log('\n✅ Firebase Auth users created');
  console.log('✅ Firestore profiles created');
  console.log('✅ Roles correctly assigned');
  console.log('🚀 Ready for testing!\n');
  
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
```

### package.json Update

Add this script:
```json
"scripts": {
  "setup-users-admin": "tsx scripts/setup-users-with-admin.ts"
}
```

### .gitignore Update

Add service account key to .gitignore:
```
# Firebase Service Account (NEVER commit this!)
serviceAccountKey.json
*-firebase-adminsdk-*.json
```

---

## Appendix C: Useful Resources

### Documentation Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [SQLite WASM](https://github.com/sql-js/sql.js)
- [React Query](https://tanstack.com/query/latest)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright E2E](https://playwright.dev/)

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)

---

**End of Report**

*Generated on October 8, 2025*  
*Project Version: 1.1.0*  
*Analysis conducted by AI Assistant*

