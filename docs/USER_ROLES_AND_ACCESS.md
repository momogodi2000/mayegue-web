# User Roles and Access Control

## Overview

Ma'a yegue uses a role-based access control system with the following user roles:
- `visitor` (unauthenticated users)
- `apprenant` (learner - authenticated students)
- `teacher` (authenticated teachers/instructors)
- `admin` (administrators)
- `family_member` (family plan members)

## Route Access Matrix

### Public Routes (No Authentication Required)

| Route | Description | Accessible By |
|-------|-------------|--------------|
| `/` | Home page | Everyone |
| `/login` | Login page | Everyone |
| `/register` | Registration page | Everyone |
| `/forgot-password` | Password reset request | Everyone |
| `/reset-password` | Password reset confirmation | Everyone |
| `/pricing` | Pricing page | Everyone |
| `/about` | About us page | Everyone |
| `/contact` | Contact page | Everyone |
| `/privacy` | Privacy policy | Everyone |
| `/terms` | Terms of service | Everyone |
| `/faq` | FAQ page | Everyone |
| `/partners` | Partners page | Everyone |
| `/careers` | Careers page | Everyone |
| `/dictionary` | Dictionary (limited features) | Everyone |
| `/atlas` | Atlas page (public view) | Everyone |
| `/encyclopedia` | Encyclopedia page | Everyone |
| `/historical-sites` | Historical sites | Everyone |
| `/marketplace` | Marketplace | Everyone |
| `/ar-vr` | AR/VR experiences | Everyone |
| `/rpg` | RPG Gamification | Everyone |
| `/ai-features` | AI Features | Everyone |
| `/dashboard/guest` | Guest dashboard | Everyone |

### Protected Routes (Authentication Required)

#### Learner (`apprenant`) Access

Learners (apprenants) have access to ALL of the following routes:

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Redirects to role dashboard | ✅ Yes |
| `/dashboard/apprenant` | Learner dashboard | ✅ Yes |
| `/lessons` | Browse all lessons | ✅ Yes |
| `/lessons/:lessonId` | Individual lesson detail | ✅ Yes |
| `/ai-assistant` | AI language assistant | ✅ Yes |
| `/gamification` | Gamification features | ✅ Yes |
| `/community` | Community forum | ✅ Yes |
| `/profile` | User profile | ✅ Yes |
| `/settings` | User settings | ✅ Yes |
| `/checkout` | Payment/checkout | ✅ Yes |

#### Teacher Access

Teachers have access to learner routes PLUS:

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/teacher` | Teacher dashboard | ✅ Yes |
| `/teacher/lessons` | Lesson management | ✅ Yes |

#### Admin Access

Admins have access to ALL routes PLUS:

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/admin` | Admin dashboard | ✅ Yes |
| `/admin/analytics` | Analytics dashboard | ✅ Yes |

## Implementation Details

### Route Protection

1. **ProtectedRoute Component** (`src/shared/components/auth/ProtectedRoute.tsx`)
   - Wraps all authenticated routes
   - Checks if user is logged in
   - Redirects to `/login` if not authenticated
   - Shows loading screen while checking auth state

2. **RoleRoute Component** (`src/shared/components/auth/RoleRoute.tsx`)
   - Wraps role-specific routes (teacher, admin)
   - Checks if user has required role
   - Redirects to user's dashboard if insufficient permissions

3. **RoleRedirect Component** (`src/shared/components/auth/RoleRedirect.tsx`)
   - Redirects users to their role-specific dashboard
   - Handles the `/dashboard` route

### Router Structure

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    {/* ... other public routes ... */}
    
    {/* Protected Routes - All authenticated users */}
    <Route element={<ProtectedRoute />}>
      <Route path="dashboard" element={<RoleRedirect />} />
      <Route path="dashboard/apprenant" element={<LearnerDashboard />} />
      
      {/* Teacher & Admin Only Routes */}
      <Route element={<RoleRoute allow={["teacher", "admin"]} />}>
        <Route path="dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="teacher/lessons" element={<TeacherLessonManagementPage />} />
        <Route path="dashboard/admin" element={<AdminPage />} />
        <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>
      
      {/* Routes accessible by ALL authenticated users (including learners) */}
      <Route path="lessons" element={<LessonsPage />} />
      <Route path="lessons/:lessonId" element={<LessonDetailPage />} />
      <Route path="ai-assistant" element={<AIAssistantPage />} />
      <Route path="gamification" element={<GamificationPage />} />
      <Route path="community" element={<CommunityPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Route>
  </Route>
</Routes>
```

## Common Issues and Solutions

### Issue: Learner Cannot Access `/lessons`

**Cause**: Learner may not be authenticated or auth state hasn't loaded

**Solution**:
1. Check if user is logged in
2. Check browser console for authentication errors
3. Verify user role in Firestore: `users/{userId}` → `role: "apprenant"`
4. Clear browser cache and cookies
5. Log out and log back in

### Issue: Learner Cannot Access `/checkout`

**Cause**: Same as above - authentication issue

**Solution**:
1. Verify user is authenticated
2. Check that `ProtectedRoute` is working
3. Check console for errors
4. Verify Firebase auth is configured correctly

### Issue: User Redirected to Login When Already Logged In

**Cause**: Auth state not persisting or loading slowly

**Solution**:
1. Check Firebase auth persistence settings
2. Verify `authStore` is working correctly
3. Check for errors in `onAuthStateChange` listener
4. Ensure localStorage is not blocked

### Issue: "Error loading" Messages on Pages

**Cause**: Firebase Firestore permission errors or missing data

**Solution**:
1. Check Firebase Console → Firestore → Rules
2. Verify user has read permissions
3. Check browser console for specific errors
4. Pages should fall back to mock data if Firebase fails

## Testing Access

### Test Learner Access

1. Login as learner:
   ```
   Email: apprenant@maayegue.app
   Password: Learner@2025!
   ```

2. Navigate to each learner route and verify access:
   - `/dashboard/apprenant` ✅
   - `/lessons` ✅
   - `/checkout` ✅
   - `/community` ✅
   - `/profile` ✅
   - `/ai-features` ✅
   - `/atlas` ✅
   - `/ar-vr` ✅

3. Verify CANNOT access:
   - `/dashboard/teacher` ❌ (should redirect to `/dashboard/apprenant`)
   - `/dashboard/admin` ❌ (should redirect to `/dashboard/apprenant`)

### Test Teacher Access

1. Login as teacher:
   ```
   Email: teacher@maayegue.app
   Password: Teacher@2025!
   ```

2. Verify access to all learner routes PLUS:
   - `/dashboard/teacher` ✅
   - `/teacher/lessons` ✅

### Test Admin Access

1. Login as admin:
   ```
   Email: admin@maayegue.app
   Password: Admin@2025!
   ```

2. Verify access to ALL routes including:
   - `/dashboard/admin` ✅
   - `/admin/analytics` ✅

## Firestore Security Rules

Ensure your Firestore rules allow authenticated users to read their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read/write any profile
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Lessons - all authenticated users can read
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // Community - all authenticated users can read/write
    match /community/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Add more rules as needed...
  }
}
```

## Support

If you encounter access issues not covered here:

1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Review authentication logs in Firebase Console
5. Contact development team

Last Updated: October 2025
