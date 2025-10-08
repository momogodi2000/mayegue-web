# Scripts Usage Guide - Ma'a yegue

This document provides detailed instructions for running the database and user management scripts.

## Prerequisites

Before running any scripts, ensure you have:

1. **Node.js** (v18 or higher) and **npm** installed
2. **TypeScript** installed globally or use `tsx` (installed in devDependencies)
3. **Firebase project** configured with proper credentials
4. **.env file** with Firebase configuration (for some scripts)

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Available Scripts

### 1. Create Default Users (setup-default-users.ts)

**Purpose**: Creates default admin, teacher, and demo users in Firebase Authentication and Firestore.

**Command**:
```bash
npm run setup-default-users
```

**What it does**:
- Creates three default users:
  - **Admin**: admin@mayegue.com (Password: Admin123!)
  - **Teacher**: teacher@mayegue.com (Password: Teacher123!)
  - **Demo Learner**: demo@mayegue.com (Password: Demo123!)
- Sets up complete user profiles in Firestore with appropriate roles
- Assigns proper subscription status and permissions
- Creates default stats and preferences

**When to use**:
- Initial project setup
- After resetting Firebase Authentication
- Setting up development/staging environment
- Creating admin accounts

**Output**:
```
🔄 Processing user: admin@mayegue.com (Role: admin)
✅ Created Firebase Auth user: [uid]
✅ Created Firestore profile for: admin@mayegue.com
   📋 Role: admin
   ✨ Subscription: premium
```

**Note**: Admin users are ONLY created via this script. They cannot register through the website.

---

### 2. Create Users (create-users.ts)

**Purpose**: Extended user creation script with more test users and SQLite integration.

**Command**:
```bash
npm run create-users
```

**What it does**:
- Creates users in Firebase Authentication
- Creates user profiles in Firestore
- **Optionally syncs with SQLite database** (if `cameroon_languages.db` exists)
- Creates multiple test users for different roles

**Default users created**:
- admin@maayegue.app (Admin@2025!)
- teacher@maayegue.app (Teacher@2025!)
- apprenant@maayegue.app (Learner@2025!)
- guest@maayegue.app (Guest@2025!)

**SQLite Integration**:
If you want to sync users with SQLite, ensure the database file exists:
```bash
# Create SQLite database first (if needed)
python docs/database-scripts/create_cameroon_db.py
```

---

### 3. Create Lessons (create-lessons.ts)

**Purpose**: Creates default lesson data in **SQLite database**.

**Command**:
```bash
npm run create-lessons
```

**Prerequisites**:
- SQLite database must exist: `cameroon_languages.db`
- Create database first if it doesn't exist:

```bash
# Navigate to database scripts
cd docs/database-scripts

# Run Python script to create database
python create_cameroon_db.py

# Return to project root
cd ../..

# Now run the lesson creation script
npm run create-lessons
```

**What it does**:
- Creates `lessons` table in SQLite if it doesn't exist
- Inserts default lessons for various Cameroonian languages
- Supports multiple lesson types: basic greetings, vocabulary, grammar
- Includes exercises, cultural notes, and multimedia links

**Output**:
```
🚀 Creating default lessons...
✅ Lessons table created
✅ Inserted 20 lessons
✨ Lessons created successfully!
```

**Important**: This script works with **SQLite** (local database), not Firebase Firestore.

---

## User Registration Flow

### For Regular Users (Learner/Teacher)

Users can register through the website at `/register`:

1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - Name
   - Email
   - Password (min 8 chars, must include uppercase, lowercase, and number)
   - **Select Role**: Choose between "Apprenant / Étudiant" or "Enseignant"
3. Accept terms and conditions
4. Click "Créer mon compte"
5. Email verification link will be sent
6. After verification, user will be redirected to appropriate dashboard based on role

**Role Selection**:
- **Apprenant / Étudiant (Learner)**: Default role for students who want to learn languages
- **Enseignant (Teacher)**: For teachers who want to create and manage courses

### For Admin Users

Admins **CANNOT** register through the website. They must be created via scripts:

**Option 1 - Using setup-default-users.ts**:
```bash
npm run setup-default-users
```
Default admin: admin@mayegue.com / Admin123!

**Option 2 - Modify script for custom admin**:
Edit `scripts/setup-default-users.ts` and add your admin user:

```typescript
const defaultUsers: DefaultUser[] = [
  {
    email: 'your-admin@example.com',
    password: 'YourSecurePassword123!',
    displayName: 'Your Admin Name',
    role: 'admin'
  },
  // ... other users
];
```

Then run:
```bash
npm run setup-default-users
```

---

## Role-Based Redirection

After login, users are redirected based on their role:

| Role | Redirect Path | Dashboard |
|------|---------------|-----------|
| **Admin** | `/admin/panel` | Admin Dashboard (with 2FA) |
| **Teacher** | `/teacher/dashboard` | Teacher Dashboard (with 2FA) |
| **Learner** | `/learner/dashboard` | Learner Dashboard |
| **Guest** | `/guest` | Public Guest Area |

**Note**: Admin and Teacher dashboards require Two-Factor Authentication (2FA) setup.

---

## Troubleshooting

### Script Fails with "Firebase Not Initialized"

**Solution**: Check your Firebase configuration in the script files or `.env` file.

### "Permission Denied" Error

**Solution**: 
1. Check Firestore security rules
2. Ensure you're using admin credentials if needed
3. Verify Firebase project permissions

### SQLite Database Not Found

**Solution**:
```bash
# Create the SQLite database first
cd docs/database-scripts
python create_cameroon_db.py
cd ../..
```

### "Rate Limit Exceeded"

**Solution**: The auth service has rate limiting. Wait a few minutes and try again.

### Users Created but Can't Login

**Checklist**:
1. Verify email/password are correct
2. Check Firebase Console > Authentication for user status
3. Verify Firestore user document exists in `users` collection
4. Check that role is properly set in Firestore

---

## Database Schema

### Firebase Firestore Collections

#### users
```typescript
{
  id: string;              // Firebase UID
  email: string;
  displayName: string;
  role: 'guest' | 'learner' | 'teacher' | 'admin';
  emailVerified: boolean;
  subscriptionStatus: 'free' | 'premium' | 'trial';
  twoFactorEnabled: boolean;
  createdAt: number;
  updatedAt: number;
  preferences: {
    language: string;
    targetLanguages: string[];
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'system';
    dailyGoalMinutes: number;
  };
  stats: {
    lessonsCompleted: number;
    wordsLearned: number;
    totalTimeMinutes: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    xp: number;
    // ... more stats
  };
}
```

### SQLite Database (cameroon_languages.db)

#### lessons
```sql
CREATE TABLE lessons (
  lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,
  language_id VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  order_index INTEGER NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  exercises TEXT,        -- JSON string
  cultural_notes TEXT,
  tags TEXT,             -- JSON string
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (language_id) REFERENCES languages(language_id)
);
```

---

## Best Practices

1. **Always create admin users via scripts** - Never expose admin registration publicly
2. **Verify email addresses** - Ensure email verification is enabled for security
3. **Use strong passwords** - Minimum 8 characters with mixed case and numbers
4. **Regular backups** - Export Firebase data and SQLite database regularly
5. **Test in development** - Always test scripts in development environment first
6. **Monitor logs** - Check console output for errors during script execution
7. **Clean up test users** - Remove test users from production Firebase

---

## Quick Reference

```bash
# Create admin/teacher/demo users
npm run setup-default-users

# Create extended user set with SQLite sync
npm run create-users

# Create lessons in SQLite database
npm run create-lessons

# Create SQLite database (Python)
python docs/database-scripts/create_cameroon_db.py

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Support

For issues or questions:
1. Check this documentation first
2. Review script source code in `scripts/` directory
3. Check Firebase Console for auth/database status
4. Review application logs in browser console
5. Consult Firebase documentation for auth/Firestore issues

---

**Last Updated**: October 2025  
**Version**: 1.1.0
