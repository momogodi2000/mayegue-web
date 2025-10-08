# Migration Quick Reference Checklist

## Phase 1: Analysis & Design ✅ COMPLETE

- [x] Clone and analyze repository structure
- [x] Inventory all dependencies (package.json)
- [x] Identify existing SQLite/IndexedDB/Firebase services
- [x] Locate Python database script
- [x] Map user roles and types
- [x] Detect duplicate files/code (NONE FOUND)
- [x] Review security practices (GOOD)
- [x] Assess test coverage (40%, needs improvement)
- [x] Document findings (01-REPOSITORY-AUDIT-REPORT.md)
- [x] Design unified schema v2.0 (14 tables)
- [x] Document schema (02-UNIFIED-SCHEMA-DESIGN.md)
- [x] Create migration status summary
- [x] Define success criteria

## Phase 2: Core Integration 🔄 IN PROGRESS

### Step 3: Python Script Update ⏳ CURRENT
- [ ] Add `create_user_progress_table()` function
- [ ] Add `create_achievements_table()` function
- [ ] Add `create_user_achievements_table()` function
- [ ] Add `create_teacher_content_table()` function
- [ ] Add `create_admin_logs_table()` function
- [ ] Add `create_app_settings_table()` function
- [ ] Add ALTER TABLE statements for new columns
- [ ] Create `migration_002()` function
- [ ] Add 50 achievement seed data entries
- [ ] Create `export_seed_data_to_json()` function
- [ ] Test script execution locally
- [ ] Verify all tables created
- [ ] Verify all indexes created
- [ ] Verify seed data inserted correctly

### Step 4: TypeScript Migration Service
- [ ] Create `src/core/services/offline/migrations.service.ts`
- [ ] Implement `MigrationService` class
- [ ] Add `getCurrentVersion()` method
- [ ] Add `runMigrations()` method
- [ ] Add `applyMigration()` method
- [ ] Add `rollbackMigration()` method (optional)
- [ ] Create `src/assets/data/seed-data.json`
- [ ] Load seed data in migration service
- [ ] Test migration runner

### Step 5: SQLite Service Enhancement
- [ ] Add `createUser(firebaseUid, email, role)` method
- [ ] Add `updateUser(userId, updates)` method
- [ ] Add `getUserByEmail(email)` method
- [ ] Add `insertTranslation(data)` method (teacher feature)
- [ ] Add `updateTranslation(id, data)` method
- [ ] Add `deleteTranslation(id)` method
- [ ] Add `insertLesson(data)` method
- [ ] Add `updateLesson(id, data)` method
- [ ] Add `deleteLesson(id)` method
- [ ] Add `insertQuiz(data)` method
- [ ] Add `updateQuiz(id, data)` method
- [ ] Add `deleteQuiz(id)` method
- [ ] Add `recordProgress(userId, contentType, contentId, data)` method
- [ ] Add `getProgress(userId, contentType)` method
- [ ] Add `earnAchievement(userId, achievementCode)` method
- [ ] Add `getUserAchievements(userId)` method
- [ ] Update `initialize()` to run migrations
- [ ] Add error handling and transactions
- [ ] Write unit tests for new methods

### Step 6: App Initialization Service
- [ ] Update `src/core/services/initialization.service.ts`
- [ ] Import `sqliteService` and `migrationService`
- [ ] Add `initializeSQLite()` function
- [ ] Detect first launch (check for DB in IndexedDB)
- [ ] Run migrations on startup
- [ ] Load seed data on first launch
- [ ] Add progress logging
- [ ] Handle errors gracefully
- [ ] Remove Firebase collection checks (no longer needed)

### Step 7: Firebase Auth to SQLite Linking
- [ ] Update `src/core/services/firebase/auth.service.ts`
- [ ] After Firebase signup, create SQLite user record
- [ ] After Firebase login, sync SQLite user record
- [ ] On role change, update SQLite user role
- [ ] Handle guest-to-student upgrade
- [ ] Test auth flow with SQLite integration

## Phase 3: Feature Implementation

### Step 8: Guest Module UI
- [ ] Create `src/features/users/guest/components/QuotaDisplay.tsx`
- [ ] Create `src/features/users/guest/components/DictionarySearch.tsx`
- [ ] Update `src/features/users/guest/pages/DashboardPage.tsx`
- [ ] Add quota warning when limit reached
- [ ] Add upgrade CTA (sign up for unlimited access)
- [ ] Integrate Firebase notifications
- [ ] Test quota enforcement (5/5/5)

### Step 9: Auth Module Role Redirection
- [ ] Update `src/features/auth/store/authStore.ts`
- [ ] Add `redirectByRole()` helper
- [ ] After login, redirect based on role:
  - Guest → `/guest/dashboard`
  - Student → `/dashboard`
  - Teacher → `/teacher/dashboard`
  - Admin → `/admin/dashboard`
- [ ] Test all redirection flows
- [ ] Add role-based route guards

### Step 10: Teacher Features
- [ ] Create `src/features/users/teacher/components/LessonEditor.tsx`
- [ ] Create `src/features/users/teacher/components/WordEditor.tsx`
- [ ] Create `src/features/users/teacher/components/QuizEditor.tsx`
- [ ] Create `src/features/users/teacher/components/MyContent.tsx` (list)
- [ ] Create `src/features/users/teacher/components/Statistics.tsx`
- [ ] Connect forms to SQLite service
- [ ] Add draft/publish workflow
- [ ] Add teacher_content tracking
- [ ] Test CRUD operations

### Step 11: Admin Features
- [ ] Create `src/features/users/admin/components/ContentManager.tsx`
- [ ] Create `src/features/users/admin/components/ContentApproval.tsx`
- [ ] Create `src/features/users/admin/components/UserManager.tsx`
- [ ] Create `src/features/users/admin/components/MigrationTool.tsx`
- [ ] Create `src/features/users/admin/components/AuditLogs.tsx`
- [ ] Connect to SQLite service
- [ ] Add approval/rejection workflow
- [ ] Log all admin actions to `admin_logs`
- [ ] Test admin panel

## Phase 4: Testing & Validation

### Step 12: Unit Tests
- [ ] Create `src/test/unit/core/offline/sqlite.service.test.ts`
- [ ] Test all CRUD methods
- [ ] Test daily limit enforcement
- [ ] Test user progress tracking
- [ ] Test achievement earning
- [ ] Create `src/test/unit/core/offline/migrations.service.test.ts`
- [ ] Test migration runner
- [ ] Test version tracking
- [ ] Run all unit tests: `npm run test`
- [ ] Ensure >80% coverage

### Step 13: Integration Tests
- [ ] Create `src/test/integration/guest-quota.test.ts`
- [ ] Test guest accessing 5 lessons
- [ ] Test quota reset next day
- [ ] Test guest upgrade to student
- [ ] Create `src/test/integration/teacher-workflow.test.ts`
- [ ] Test teacher creating content
- [ ] Test admin approving content
- [ ] Test content appearing for students
- [ ] Create `src/test/integration/auth-sqlite-linking.test.ts`
- [ ] Test Firebase signup → SQLite user creation
- [ ] Test Firebase login → SQLite user update
- [ ] Test role-based redirection
- [ ] Run all integration tests
- [ ] Fix any failures

### Step 14: Build & Lint
- [ ] Run `npm run type-check` (ensure no TS errors)
- [ ] Run `npm run lint` (fix all warnings)
- [ ] Update `package.json`: `"lint": "eslint . --max-warnings 0"`
- [ ] Run `npm run build` (ensure successful)
- [ ] Check bundle size (<3MB)
- [ ] Test PWA offline functionality
- [ ] Verify service worker caching

## Phase 5: Cleanup & Documentation

### Step 15: Code Cleanup
- [ ] Remove unused imports
- [ ] Remove all TODO comments (implement or delete)
- [ ] Remove console.log statements (use proper logging)
- [ ] Update role names: `visitor` → `guest`, `apprenant` → `student`
- [ ] Remove Dexie if no longer needed
- [ ] Remove `src/core/services/offline/indexedDb.service.ts` (if redundant)
- [ ] Remove `src/core/services/offline/database.service.ts` (if redundant)
- [ ] Commit cleanup with descriptive message

### Step 16: Update Documentation
- [ ] Update `README.md` with new architecture
- [ ] Update `docs/03-architecture.md`
- [ ] Update `docs/04-fonctionnalites.md`
- [ ] Create `docs/migration/03-MIGRATION-GUIDE.md`
- [ ] Document environment variables required
- [ ] Document first-launch behavior
- [ ] Document role-based access rules
- [ ] Add troubleshooting guide

### Step 17: Deployment Verification
- [ ] Create `.env.example` file
- [ ] Test build in staging environment
- [ ] Verify Firebase config
- [ ] Test first launch (DB creation)
- [ ] Test existing users (migration)
- [ ] Test all role flows (guest, student, teacher, admin)
- [ ] Performance benchmark (load time, query speed)
- [ ] Create deployment checklist
- [ ] Create rollback plan

### Step 18: Final Handover
- [ ] Create changelog (CHANGELOG.md)
- [ ] List all files modified
- [ ] List all files created
- [ ] List all files deleted
- [ ] Document breaking changes
- [ ] Create migration instructions for users
- [ ] Create QA test plan
- [ ] Create one-page summary for product owner
- [ ] Sign off migration completion

## Verification Checklist

### Functionality ✅
- [ ] Guest can search dictionary (unlimited)
- [ ] Guest quota enforced (5/5/5 per day)
- [ ] Student has unlimited access
- [ ] Teacher can create/edit content
- [ ] Admin can approve teacher content
- [ ] Admin can manage users
- [ ] Auth creates SQLite user
- [ ] Role-based redirection works
- [ ] Progress tracking works
- [ ] Achievements earned correctly

### Technical ✅
- [ ] SQLite auto-initializes on first launch
- [ ] Migrations run automatically
- [ ] Seed data loaded correctly
- [ ] All tables created with indexes
- [ ] Firebase auth integrated
- [ ] Offline mode works
- [ ] PWA installable
- [ ] Service worker caching works

### Quality ✅
- [ ] All tests passing
- [ ] Test coverage >80%
- [ ] Zero lint warnings
- [ ] Zero TypeScript errors
- [ ] Build successful
- [ ] Bundle size <3MB
- [ ] No console errors in browser
- [ ] No TODOs in code

### Security ✅
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)
- [ ] Role-based access enforced
- [ ] Sensitive data not logged
- [ ] Firebase security rules updated
- [ ] Rate limiting on auth
- [ ] XSS prevention (sanitization)

### Documentation ✅
- [ ] README updated
- [ ] Architecture docs updated
- [ ] API docs updated
- [ ] Migration guide complete
- [ ] Inline code comments
- [ ] Environment setup guide
- [ ] Troubleshooting guide

---

## Quick Command Reference

```bash
# Development
npm run dev                    # Start dev server
npm run type-check             # Check TypeScript errors
npm run lint                   # Run ESLint
npm run test                   # Run tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report

# Database Scripts
npm run create-users           # Create default users (Firebase)
npm run create-lessons         # Create lessons (Firebase)
python docs/database-scripts/create_cameroon_db.py  # Generate SQLite DB

# Build & Deploy
npm run build                  # Production build
npm run preview                # Preview build
npm run firebase:deploy        # Deploy to Firebase

# Firebase
npm run firebase:emulators     # Start Firebase emulators
npm run firebase:deploy:hosting
npm run firebase:deploy:firestore
```

---

## File Locations Quick Reference

### Documentation
- Migration docs: `docs/migration/`
- Audit report: `docs/migration/01-REPOSITORY-AUDIT-REPORT.md`
- Schema design: `docs/migration/02-UNIFIED-SCHEMA-DESIGN.md`
- Status summary: `docs/migration/00-MIGRATION-STATUS-SUMMARY.md`

### Database
- Python script: `docs/database-scripts/create_cameroon_db.py`
- SQLite DB: `src/assets/databases/cameroon_languages.db`
- Seed data JSON: `src/assets/data/seed-data.json` (to be created)

### Services
- SQLite service: `src/core/services/offline/sqlite.service.ts`
- Migration service: `src/core/services/offline/migrations.service.ts` (to be created)
- Init service: `src/core/services/initialization.service.ts`
- Auth service: `src/core/services/firebase/auth.service.ts`

### Features
- Guest: `src/features/users/guest/`
- Student: `src/features/users/learner/` (rename to `student`)
- Teacher: `src/features/users/teacher/`
- Admin: `src/features/users/admin/`

### Tests
- Unit: `src/test/unit/`
- Integration: `src/test/integration/`
- Setup: `src/test/setup.ts`

---

**Last Updated**: October 7, 2025  
**Current Step**: Phase 2, Step 3 (Python Script Update)  
**Overall Progress**: 20%
