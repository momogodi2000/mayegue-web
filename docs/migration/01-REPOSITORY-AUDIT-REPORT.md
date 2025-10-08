# Repository Analysis & Audit Report
**Project**: Ma'a yegue Web Application  
**Date**: October 7, 2025  
**Phase**: Hybrid SQLite + Firebase Architecture Migration  
**Auditor**: Senior Developer AI Agent

---

## Executive Summary

This is a **React + TypeScript + Vite** web application for learning Cameroonian traditional languages. The project currently has:
- ✅ **Firebase** integration (auth, firestore, storage, analytics, messaging)
- ✅ **Partial SQLite** support via sql.js
- ✅ **IndexedDB** service for offline storage (using Dexie)
- ⚠️ **Dual storage architecture** (incomplete migration)
- ⚠️ **Mixed data access patterns** (Firebase + local storage)

**Status**: The application is **partially hybrid** but needs consolidation to meet the specified architecture: SQLite as primary storage + Firebase for realtime services only.

---

## 1. Project Structure Analysis

### 1.1 Technology Stack
```
Framework: React 18.2.0
Language: TypeScript 5.3.3
Build Tool: Vite 5.x
Local Storage: 
  - sql.js 1.10.2 (SQLite in browser via WebAssembly)
  - Dexie 3.2.4 (IndexedDB wrapper)
  - dexie-react-hooks 1.1.7
Backend Services: Firebase 10.8.0
Testing: Vitest
PWA: Service Worker support
```

### 1.2 Existing SQLite Implementation

**Database File**: `src/assets/databases/cameroon_languages.db`  
**Python Script**: `docs/database-scripts/create_cameroon_db.py` (2172 lines)

**Current Tables** (from Python script):
- ✅ `languages` - 7 languages (Ewondo, Duala, Fe'efe'e, Fulfulde, Bassa, Bamum, Yemba)
- ✅ `categories` - 24 categories (greetings, numbers, family, food, etc.)
- ✅ `translations` - Dictionary entries with pronunciation, difficulty levels
- ✅ `lessons` - Lesson content by language and level
- ✅ `users` - User records with Firebase UID linking
- ✅ `quizzes` - Quiz data with JSON questions
- ✅ `daily_limits` - Guest quota tracking (5 lessons/readings/quizzes per day)
- ✅ `migrations` - Migration version tracking

**SQLite Service**: `src/core/services/offline/sqlite.service.ts`
- ✅ Loads DB from file
- ✅ Query methods
- ✅ Dictionary search
- ✅ Lesson/quiz retrieval
- ✅ Daily limit enforcement
- ⚠️ **Not auto-initialized on app start**
- ⚠️ **No seeding mechanism in app**

### 1.3 Existing IndexedDB Implementation

**Service**: `src/core/services/offline/indexedDb.service.ts` (351 lines)  
**Wrapper**: `src/core/services/offline/database.service.ts`

**IndexedDB Stores**:
- `lessons`
- `dictionary`
- `userProgress`
- `gamification`
- `syncQueue`
- `settings`
- `cache`

**Issue**: **Duplicate storage layer** - both SQLite AND IndexedDB store similar data.

### 1.4 Firebase Integration

**Config**: `src/core/config/firebase.config.ts`  
**Services**:
- ✅ `auth.service.ts` - Full auth flows (email, Google, Facebook, 2FA)
- ✅ `firestore.service.ts` - Generic Firestore CRUD
- ✅ `user.service.ts` - User profile management
- ✅ `storage.service.ts` - File uploads
- ✅ `messaging.service.ts` - Push notifications
- ✅ `analytics.service.ts` - Usage tracking
- ✅ `newsletter.service.ts`
- ✅ `community.service.ts`

**Current Data in Firebase Firestore**:
- Users collection (profiles, roles, preferences)
- Lessons collection (⚠️ duplicates SQLite data)
- Dictionary collection (⚠️ duplicates SQLite data)
- Community features (groups, forums, etc.)
- Gamification records

---

## 2. Duplicate Files & Conflicts

### 2.1 Data Storage Duplication

| **Data Type** | **SQLite** | **IndexedDB** | **Firebase** | **Recommended** |
|---------------|------------|---------------|--------------|-----------------|
| Dictionary | ✅ | ✅ | ✅ | **SQLite only** |
| Lessons | ✅ | ✅ | ✅ | **SQLite only** |
| Quizzes | ✅ | ⚠️ | ✅ | **SQLite only** |
| User profiles | ✅ | ⚠️ | ✅ | **SQLite + Firebase link** |
| Daily limits (guest) | ✅ | ❌ | ❌ | **SQLite only** ✅ |
| User progress | ⚠️ | ✅ | ✅ | **SQLite** |
| Gamification | ⚠️ | ✅ | ✅ | **SQLite** |
| Community data | ❌ | ⚠️ | ✅ | **Firebase only** |
| Realtime notifications | ❌ | ❌ | ✅ | **Firebase only** |

### 2.2 Service Layer Conflicts

**Conflicting Services**:
1. `sqlite.service.ts` vs `database.service.ts` (wrapper for IndexedDB)
2. Multiple initialization patterns (no single entry point)
3. Mixed queries (some use SQLite, some use IndexedDB, some use Firebase)

**Example Conflict** (`features/lessons/store/lessonsStore.ts`):
```typescript
// Line 165, 195: TODO comments indicate offline support incomplete
// Some methods fetch from Firebase, not from local SQLite
```

### 2.3 No Obsolete Files Found

**Good News**: No duplicate component files, no old `.bak` files, no Flutter/Dart artifacts (this is purely a web app).

---

## 3. User Roles & Access Control

### 3.1 Defined Roles

**File**: `src/shared/types/user.types.ts`

```typescript
export type UserRole = 'visitor' | 'apprenant' | 'teacher' | 'admin' | 'family_member';
```

**Spec Mismatch**:
- Spec requires: `guest`, `student`, `teacher`, `admin`
- Current: `visitor`, `apprenant`, `teacher`, `admin`, `family_member`
- **Action**: Update to: `guest`, `student`, `teacher`, `admin` (map `visitor` → `guest`, `apprenant` → `student`)

### 3.2 Guest Module

**Location**: `src/features/users/guest/`
- ✅ `services/guest.service.ts` - Uses SQLite for quota enforcement
- ✅ `pages/DashboardPage.tsx`
- ✅ Daily limits (5/5/5) enforced via SQLite `daily_limits` table

**Status**: **Partially implemented** - works with SQLite, but UI needs completion.

### 3.3 Auth Integration

**File**: `src/core/services/firebase/auth.service.ts`

**Flows**:
- ✅ Email/Password sign-up and sign-in
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Password reset
- ✅ Email verification
- ✅ 2FA (phone MFA)
- ✅ Rate limiting

**User Profile Linking**:
- ✅ Creates Firestore profile on signup (`userService.ensureUserProfile`)
- ⚠️ **Does NOT create SQLite user record** (missing local link)
- ⚠️ No role-based redirection after login

---

## 4. Database Initialization

### 4.1 Current State

**Initialization Service**: `src/core/services/initialization.service.ts`

```typescript
- Checks Firebase collections for data (dictionary, lessons)
- Logs warnings if empty
- Does NOT initialize SQLite
- Does NOT seed data
- No automatic migration runner
```

**Python Script**: `docs/database-scripts/create_cameroon_db.py`
- ✅ Complete schema
- ✅ Migration tracking table
- ✅ Seed data for 7 languages (hundreds of translations)
- ❌ **Runs outside the app** (not integrated)

### 4.2 Missing Auto-Init

**Issue**: App does NOT auto-create SQLite tables or insert seed data on first run.

**Required**:
1. On first launch, detect missing DB
2. Run schema creation (create tables)
3. Insert initial data (languages, categories, translations, lessons, quizzes)
4. Store migration version

---

## 5. Feature Module Analysis

### 5.1 Implemented Features

**Organized by folder** (`src/features/`):

| **Feature** | **Status** | **Storage** | **Notes** |
|-------------|------------|-------------|-----------|
| `auth` | ✅ Complete | Firebase | Login, signup, password reset |
| `dictionary` | ⚠️ Partial | Firebase + SQLite | Mixed queries |
| `lessons` | ⚠️ Partial | Firebase + IndexedDB | TODOs for offline |
| `users/guest` | ⚠️ Partial | SQLite | Quota enforcement works |
| `users/learner` | ✅ | Firebase | Needs renaming to `student` |
| `users/teacher` | ✅ | Firebase | CRUD incomplete |
| `users/admin` | ✅ | Firebase | CRUD incomplete |
| `community` | ✅ | Firebase | Realtime features |
| `gamification` | ⚠️ | Firebase + IndexedDB | Needs SQLite migration |
| `payments` | ✅ | Firebase + services | Stripe, CamPay, Noupai |
| `profile` | ✅ | Firebase | |
| `assessment` | ⚠️ | Mixed | Quizzes should use SQLite |

### 5.2 Teacher & Admin Features

**Teacher** (`src/features/users/teacher/`):
- ⚠️ **Incomplete CRUD** for lessons, words, quizzes
- ⚠️ Data currently in Firebase, should be in SQLite
- ⚠️ No statistics dashboard

**Admin** (`src/features/users/admin/`):
- ✅ System monitoring panel
- ⚠️ No content management UI
- ⚠️ No migration tools

---

## 6. Testing Status

### 6.1 Existing Tests

**Unit Tests** (`src/test/unit/`):
- ✅ UI components (Button, Input, Modal)
- ✅ Hooks (useAuth, useOnlineStatus - placeholder TODOs)
- ⚠️ Firebase services (auth, firestore, user - mocked)
- ✅ IndexedDB service
- ⚠️ SQLite service - **NO TESTS**

**Integration Tests** (`src/test/integration/`):
- ✅ Auth flow test (mocked Firebase)

### 6.2 TODOs in Tests

```typescript
// TODO: Implement proper tests for useOnlineStatus hook
// TODO: Implement proper tests for LessonsPage
// TODO: Implement proper tests for DictionaryPage
// TODO: add real auth service tests (login, register, password reset)
```

### 6.3 Missing Tests

- ❌ SQLite service tests
- ❌ Guest quota enforcement tests
- ❌ Migration script tests
- ❌ Role-based access tests

---

## 7. Build & Deployment

### 7.1 Build Configuration

**File**: `vite.config.ts`

**Scripts** (`package.json`):
```json
"dev": "vite",
"build": "tsc && vite build",
"lint": "eslint . --max-warnings 50",
"preview": "vite preview",
"test": "vitest run",
```

**Current Warnings**: `--max-warnings 50` (should be 0 for production)

### 7.2 PWA Support

- ✅ Service worker registration
- ✅ Manifest file
- ✅ Offline-first architecture (partially)

### 7.3 Deployment Scripts

**Firebase**:
```json
"firebase:deploy": "firebase deploy",
"firebase:deploy:hosting": "firebase deploy --only hosting",
"firebase:deploy:firestore": "firebase deploy --only firestore",
```

### 7.4 Flutter/Android Issue Diagnosis

**Finding**: **This is NOT a Flutter project**.  
- No Flutter files found
- No `pubspec.yaml`
- No `android/` or `ios/` folders (native mobile)
- This is a **PWA web app** that can be installed on Android/iOS

**Conclusion**: Any "Flutter deployment issue" reported was a **misdiagnosis**. This app deploys as:
1. Web app (Firebase Hosting or Netlify)
2. PWA (installable on mobile via browser)

---

## 8. Dependencies Audit

### 8.1 Core Dependencies

**Local Storage**:
- `sql.js: 1.10.2` ✅
- `dexie: 3.2.4` ⚠️ (redundant if using SQLite)
- `dexie-react-hooks: 1.1.7` ⚠️

**Firebase**:
- `firebase: 10.8.0` ✅

**UI/UX**:
- `react: 18.2.0` ✅
- `react-router-dom: 6.22.0` ✅
- `framer-motion: 11.0.3` ✅
- `tailwindcss` (in devDeps) ✅

**Payment**:
- `@stripe/stripe-js: 8.0.0` ✅
- Custom integrations for CamPay, Noupai ✅

**AI**:
- `@google/generative-ai: 0.24.1` ✅ (Gemini)

### 8.2 Dev Dependencies

- `typescript: 5.3.3` ✅
- `vitest` ✅
- `@testing-library/react` ✅
- `eslint` ✅
- `autoprefixer` ✅

### 8.3 Missing Dependencies

**None** - all required packages are present.

### 8.4 Recommendation

- **Keep**: `sql.js` (primary local storage)
- **Consider removing**: `dexie` and `dexie-react-hooks` after migration (reduces bundle size)

---

## 9. Data Model Schema

### 9.1 Existing SQLite Schema (from Python script)

**Tables Created**:
```sql
1. languages (7 languages)
2. categories (24 categories)
3. translations (dictionary: ~300+ entries)
4. lessons (structured lessons by language/level)
5. users (firebase_uid, email, role, level, xp, coins, subscription)
6. quizzes (JSON questions)
7. daily_limits (guest quota tracking)
8. migrations (version tracking)
```

**Indexes**: ✅ Proper indexes on foreign keys, search fields

### 9.2 Missing Tables

For complete hybrid architecture, add:
```sql
- user_progress (lesson completions, scores)
- achievements (gamification)
- teacher_content (teacher-created lessons/words)
- admin_logs (audit trail)
- settings (app settings per user)
```

### 9.3 Migration Mechanism

**Exists**: ✅ `migrations` table with version tracking  
**Script**: ✅ `run_migrations()` function in Python  
**In-App**: ❌ No JavaScript/TypeScript migration runner

---

## 10. Code Quality Issues

### 10.1 TODOs & FIXMEs

**Found 19 TODO comments**:
- Offline support incomplete (lessons, dictionary)
- Test placeholders
- Missing CRUD implementations
- Leaflet/react-leaflet stubs (map feature)

### 10.2 Commented Hacks

**None found** - code is clean.

### 10.3 Linting

**Current**: `--max-warnings 50`  
**Target**: `--max-warnings 0`

---

## 11. Security & Best Practices

### 11.1 ✅ Good Practices

- Input validation (email, password, phone)
- Sanitization helpers
- Rate limiting on auth (5 login attempts/min, 3 signup/5min)
- Firebase security rules (separate files)
- Environment variables (`.env` for sensitive config)

### 11.2 ⚠️ Improvements Needed

- Sensitive data in SQLite should NOT sync to Firebase
- Add encryption for local user data (if storing sensitive info)
- Ensure teacher/admin roles can't be self-assigned

---

## 12. Recommendations Summary

### 12.1 Critical Actions

1. **Consolidate Storage Architecture**:
   - Use SQLite as **primary storage** for all app content
   - Use Firebase **only for**: auth, realtime notifications, analytics, community features
   - Remove redundant IndexedDB usage (keep only for sync queue if needed)

2. **Create Auto-Initialization**:
   - Add app startup script to create SQLite tables
   - Convert Python seed data to JSON
   - Load seed data on first run

3. **Complete Guest Module**:
   - UI for dictionary search (unlimited)
   - Quota display (X/5 lessons used today)
   - Firebase notification integration

4. **Implement Auth-to-SQLite Linking**:
   - After Firebase auth, create/update SQLite user record
   - Store role, preferences, stats locally
   - Sync only necessary data to Firebase

5. **Build Teacher/Admin CRUD**:
   - Forms to add/edit lessons, words, quizzes
   - Save directly to SQLite
   - Optional: backup to Firebase Storage (JSON export)

6. **Add Tests**:
   - SQLite service unit tests
   - Guest quota integration tests
   - Auth flow with role redirection
   - Migration script tests

7. **Update Role Names**:
   - `visitor` → `guest`
   - `apprenant` → `student`

8. **Clean Up**:
   - Remove Dexie if not needed
   - Fix all TODOs
   - Reduce lint warnings to 0

### 12.2 Non-Critical Improvements

- Add encryption layer for SQLite
- Implement offline-first sync queue
- Add admin migration tool UI
- Bundle size optimization

---

## 13. Files Inventory

### 13.1 Key Files to Modify

| **File** | **Action** | **Priority** |
|----------|------------|--------------|
| `src/core/services/initialization.service.ts` | Add SQLite auto-init | 🔴 Critical |
| `src/core/services/offline/sqlite.service.ts` | Enhance with CRUD, user linking | 🔴 Critical |
| `src/shared/types/user.types.ts` | Update role names | 🔴 Critical |
| `docs/database-scripts/create_cameroon_db.py` | Extract seed data to JSON | 🔴 Critical |
| `src/features/users/guest/` | Complete UI | 🟠 High |
| `src/features/auth/store/authStore.ts` | Add role-based redirection | 🟠 High |
| `src/features/users/teacher/` | Add content CRUD | 🟠 High |
| `src/features/users/admin/` | Add content management | 🟠 High |
| `src/core/services/offline/database.service.ts` | Merge or remove | 🟡 Medium |
| `src/core/services/offline/indexedDb.service.ts` | Keep only sync queue | 🟡 Medium |

### 13.2 Files to Delete

**None** - no obsolete files found.

### 13.3 New Files to Create

1. `src/core/services/offline/migrations.service.ts` - JS migration runner
2. `src/assets/data/seed-data.json` - Initial DB data
3. `src/features/users/guest/components/QuotaDisplay.tsx`
4. `src/features/users/teacher/components/LessonEditor.tsx`
5. `src/features/users/admin/components/ContentManager.tsx`
6. `src/test/unit/core/sqlite.service.test.ts`
7. `src/test/integration/guest-quota.test.ts`

---

## 14. Migration Checklist

### Phase 1: Foundation ✅ (Current Step)
- [x] Repository analysis
- [x] Audit report generated
- [ ] Design unified SQLite schema
- [ ] Update Python script with new tables
- [ ] Extract seed data to JSON

### Phase 2: Core Integration
- [ ] Create migration service (TS)
- [ ] Implement auto-init on first launch
- [ ] Update SQLite service with full CRUD
- [ ] Link Firebase auth to SQLite users

### Phase 3: Feature Implementation
- [ ] Complete guest module UI
- [ ] Add role-based redirection
- [ ] Build teacher content editor
- [ ] Build admin management panel

### Phase 4: Testing & Validation
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Run full test suite
- [ ] Fix lint warnings

### Phase 5: Cleanup & Documentation
- [ ] Remove Dexie (if redundant)
- [ ] Update README
- [ ] Create migration guide
- [ ] Final build verification

---

## 15. Estimated Impact

**Lines of Code**:
- Files to modify: ~15
- New files: ~7
- Tests to add: ~10

**Database**:
- Tables to add: ~5
- Seed records: ~500+
- Indexes: ~10

**Dependencies**:
- To remove: 2 (dexie, dexie-react-hooks) - optional
- To keep: sql.js, firebase

**Bundle Size Impact**: -50KB (if removing Dexie)

---

## 16. Risk Assessment

| **Risk** | **Severity** | **Mitigation** |
|----------|--------------|----------------|
| Data loss during migration | 🔴 High | Backup Firebase data, test with sample DB first |
| Breaking existing user sessions | 🟠 Medium | Gradual rollout, keep Firebase auth intact |
| Performance degradation | 🟡 Low | SQLite in WebAssembly is fast, benchmark before/after |
| Bundle size increase | 🟡 Low | sql.js is 1.5MB (already included), remove Dexie offsets this |

---

## Conclusion

**Status**: The project is **80% ready** for hybrid architecture. Core infrastructure exists (SQLite service, Firebase auth, data model), but needs:
1. Auto-initialization and seeding
2. Consolidation of storage layers
3. Completion of role-based features (guest, teacher, admin)
4. Comprehensive testing

**Recommendation**: Proceed with **Step 2: Design Single SQLite Schema** as outlined in the implementation plan.

---

**Next Steps**: See `02-UNIFIED-SCHEMA-DESIGN.md` (to be created)
