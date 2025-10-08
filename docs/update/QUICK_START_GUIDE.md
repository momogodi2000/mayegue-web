# Ma'a Yegue - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Git installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Add your Firebase credentials to .env
```

### 3. Run Development Server
```bash
npm run dev
```

App will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to Firebase
```bash
npm run deploy
```

---

## 🔑 Default User Accounts

Create default users with:
```bash
npm run setup-default-users
```

This creates:

| Email | Password | Role |
|-------|----------|------|
| admin@mayegue.com | Admin123! | Admin |
| teacher@mayegue.com | Teacher123! | Teacher |
| demo@mayegue.com | Demo123! | Learner |

---

## 📁 Project Structure

```
mayegue-web/
├── src/
│   ├── app/                    # App entry point & router
│   ├── core/                   # Core services
│   │   ├── services/
│   │   │   ├── auth/           # Hybrid auth service
│   │   │   ├── firebase/       # Firebase services
│   │   │   └── offline/        # SQLite service
│   ├── features/               # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── home/              # Home page
│   │   ├── users/             # Role-based dashboards
│   │   └── ...
│   └── shared/                # Shared components
├── public/                    # Static assets
│   └── sql-wasm/             # SQLite WASM files
├── docs/                     # Documentation
└── scripts/                  # Setup scripts
```

---

## 🔧 Available Scripts

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Run TypeScript checks
```

### Database Setup
```bash
npm run setup-default-users    # Create default users
npm run create-users           # Create custom users
npm run create-lessons         # Create sample lessons
```

### Deployment
```bash
npm run deploy                 # Deploy to Firebase
npm run deploy:hosting         # Deploy hosting only
npm run deploy:functions       # Deploy functions only
npm run deploy:rules           # Deploy Firestore rules
```

---

## 🐛 Troubleshooting

### SQLite Not Loading?
1. Clear browser cache
2. Check console for WASM errors
3. Verify `public/sql-wasm/` contains WASM files
4. Check network tab for correct MIME type

### Login Not Working?
1. Check Firebase console for enabled auth methods
2. Verify `.env` has correct Firebase config
3. Check Firestore rules are deployed
4. Clear local storage and retry

### Build Errors?
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear TypeScript cache: `rm -rf .tsbuildinfo`
4. Run `npm run type-check` to see detailed errors

### Service Worker Issues?
1. Unregister all service workers in DevTools
2. Clear application cache
3. Hard reload (Ctrl+Shift+R)
4. Build is only enabled in production

---

## 📚 Key Concepts

### Hybrid Architecture
- **SQLite (Local):** Fast, offline-first data storage
- **Firebase (Cloud):** Authentication, sync, backups
- **Hybrid Service:** Seamlessly combines both

### User Roles
- **Guest:** Limited access (5 lessons/day, dictionary)
- **Learner:** Full learning access
- **Teacher:** Can create lessons, quizzes
- **Admin:** Full system access

### Offline Features
- Login works offline (after first login)
- Lessons cached locally
- Contact form queues offline
- Newsletter subscription queues offline
- Progress tracked locally

---

## 🎯 Common Tasks

### Add a New Page
1. Create component in `src/features/{module}/pages/`
2. Add route in `src/app/router.tsx`
3. Update navigation if needed

### Add to SQLite Database
1. Create migration in `src/core/services/offline/migrations.ts`
2. Add service methods in `sqlite.service.ts`
3. Use in components via `sqliteService`

### Add Firebase Collection
1. Update Firestore rules in `firestore.rules`
2. Create service in `src/core/services/firebase/`
3. Deploy rules: `firebase deploy --only firestore:rules`

---

## 📞 Getting Help

- **Documentation:** `/docs` folder
- **Architecture:** `HYBRID_MIGRATION_REPORT.md`
- **Fixes:** `FIXES_COMPLETED_FINAL.md`
- **Issues:** GitHub Issues

---

## ✅ Quick Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Firebase project configured
- [ ] Firestore rules deployed
- [ ] Default users created
- [ ] Sample data loaded
- [ ] Build completes successfully
- [ ] No console errors in production
- [ ] Service worker registers
- [ ] SQLite initializes
- [ ] Authentication works
- [ ] Offline features work

---

**Happy Coding! 🎉**
