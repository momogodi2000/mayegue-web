# Scripts Directory

This directory contains utility scripts for the Ma'a yegue web application.

## Available Scripts

### User Management
- `create-admin-user.ts` - Create admin user account
- `create-default-users.ts` - Create default test users (learners, teachers)

### Lesson Management
- `create-default-lessons.ts` - Create default lessons (requires Firebase permissions)
- `create-lessons-with-auth.ts` - Create lessons using Firebase Admin SDK
- `import-lessons.ts` - Import lessons from JSON file
- `lessons-data.json` - JSON data containing all default lessons

## Usage

### Create Users
```bash
# Create admin user
npm run create-admin

# Create default test users
npm run create-users
# or
npm run create-default-users
```

### Create Lessons
```bash
# Method 1: Direct Firebase (may have permission issues)
npm run create-lessons

# Method 2: Using Firebase Admin SDK (recommended)
npm run create-lessons-with-auth

# Method 3: Import from JSON file
npm run import-lessons
```

## Firebase Permission Issues

If you encounter permission errors when creating lessons:

1. **Use the Admin SDK version**: `npm run create-lessons-with-auth`
2. **Import from JSON**: `npm run import-lessons`
3. **Manual import**: Use the Firebase Console to import the data from `lessons-data.json`

## File Structure

```
scripts/
├── README.md                    # This file
├── create-admin-user.ts         # Admin user creation
├── create-default-users.ts      # Default users creation
├── create-default-lessons.ts    # Lessons creation (direct)
├── create-lessons-with-auth.ts  # Lessons creation (admin SDK)
├── import-lessons.ts            # Import lessons from JSON
└── lessons-data.json            # Lesson data in JSON format
```

## Notes

- All scripts use TypeScript with tsx for execution
- Firebase configuration is embedded in scripts for simplicity
- For production use, consider using environment variables for Firebase config
- The JSON import method is most reliable for lesson creation
