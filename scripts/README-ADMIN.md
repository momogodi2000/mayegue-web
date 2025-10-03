# Firebase Admin User Creation Guide

## Prerequisites

1. **Firebase Admin SDK Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com/project/studio-6750997720-7c22e/settings/serviceaccounts/adminsdk)
   - Click "Generate New Private Key"
   - Save the JSON file securely (e.g., `firebase-admin-key.json`)
   - **NEVER commit this file to git**

2. **Install Dependencies**
   ```bash
   npm install firebase-admin --save-dev
   ```

## Option 1: Using the TypeScript Script (Recommended - PowerShell Compatible)

### Step 1: Set Environment Variable
```bash
# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="path/to/firebase-admin-key.json"

# Windows (CMD)
set GOOGLE_APPLICATION_CREDENTIALS=path\to\firebase-admin-key.json

# Linux/Mac
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/firebase-admin-key.json"
```

### Step 2: Run the Script

**Method A: Use Defaults (Quickest)**
```bash
npm run create-admin
```
Creates admin with:
- Email: admin@maayegue.com
- Password: Admin@2025!
- Name: Admin

**Method B: Pass Arguments (Recommended)**
```bash
npm run create-admin -- --email=youremail@domain.com --password=YourSecurePass123 --name="Your Name"
```

**Method C: Use Environment Variables**
```bash
# PowerShell
$env:ADMIN_EMAIL="admin@test.com"
$env:ADMIN_PASSWORD="SecurePass123!"
$env:ADMIN_NAME="Super Admin"
npm run create-admin

# Bash
ADMIN_EMAIL="admin@test.com" ADMIN_PASSWORD="SecurePass123!" npm run create-admin
```

The script no longer uses interactive prompts to avoid PowerShell readline issues.

## Option 2: Using Firebase Console

1. Go to [Firebase Authentication](https://console.firebase.google.com/project/studio-6750997720-7c22e/authentication/users)
2. Click "Add User"
3. Enter:
   - Email: `admin@maayegue.com`
   - Password: Your secure password
4. Click "Add User"
5. Copy the User UID
6. Go to [Firestore Database](https://console.firebase.google.com/project/studio-6750997720-7c22e/firestore/data)
7. Create a new document in the `users` collection:
   - Document ID: [paste the User UID]
   - Fields:
     ```
     email: "admin@maayegue.com"
     displayName: "Admin"
     role: "admin"
     emailVerified: true
     subscriptionStatus: "premium"
     twoFactorEnabled: false
     createdAt: [current timestamp]
     updatedAt: [current timestamp]
     ```

## Option 3: Using Firestore Rules & Cloud Function

You can also create a Cloud Function that allows creating an admin user (only once).

See `functions/src/index.ts` for implementation.

## Default Admin Credentials

If you run the script without input:
- **Email**: `admin@maayegue.com`
- **Password**: `Admin@2025`
- **Role**: `admin`

⚠️ **IMPORTANT**: Change the default password immediately after first login!

## Admin Privileges

An admin user has the following permissions:
- ✅ Manage all users (create, update, delete, change roles)
- ✅ Manage lessons and content
- ✅ Manage dictionary entries
- ✅ View analytics and reports
- ✅ Send push notifications
- ✅ Manage subscriptions and payments
- ✅ System settings and configuration

## Security Notes

1. **Never share admin credentials**
2. **Enable 2FA for admin accounts**
3. **Use strong, unique passwords**
4. **Regularly audit admin activities**
5. **Limit number of admin users**
6. **Keep the service account key secure and never commit it to version control**

## Troubleshooting

### Error: "Could not load the default credentials"
- Make sure `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set correctly
- Verify the path to the service account key file

### Error: "Email already exists"
- The user already exists. The script will update the role to admin.

### Error: "Invalid password"
- Password must be at least 6 characters long

### Permission Denied
- Ensure your service account has proper permissions in Firebase Console
