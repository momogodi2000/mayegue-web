# Firebase Google OAuth Setup Guide

This guide will help you configure Google OAuth authentication for the Ma'a yegue application.

## Prerequisites

- Firebase project created (already done)
- Firebase Console access
- Admin access to Google Cloud Console

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-6750997720-7c22e`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** in the providers list
5. Toggle **Enable** to ON
6. Configure the following:
   - **Project public-facing name**: Ma'a yegue
   - **Project support email**: Choose your support email
7. Click **Save**

## Step 2: Configure Authorized Domains

Still in the Firebase Console under Authentication → Settings → Authorized domains:

1. Add your domains:
   - `localhost` (already added by default)
   - `studio-6750997720-7c22e.firebaseapp.com` (already added)
   - Your custom domain if you have one (e.g., `maayegue.app`)

2. Click **Add domain** for each new domain

## Step 3: Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the same project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in the required information:
   - **App name**: Ma'a yegue
   - **User support email**: your-email@example.com
   - **App logo**: Upload your app logo (optional but recommended)
   - **Application home page**: https://maayegue.app
   - **Application privacy policy**: https://maayegue.app/privacy
   - **Application terms of service**: https://maayegue.app/terms
   - **Authorized domains**: 
     - `firebaseapp.com`
     - `maayegue.app` (if you have custom domain)
   - **Developer contact information**: your-email@example.com

5. Click **Save and Continue**

## Step 4: Add OAuth Scopes

1. On the **Scopes** screen, click **Add or Remove Scopes**
2. Add the following scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
3. Click **Update** then **Save and Continue**

## Step 5: Add Test Users (Development/Testing Mode)

If your OAuth consent screen is in "Testing" mode:

1. Go to **Test users** section
2. Click **Add Users**
3. Add email addresses that should be allowed to sign in during testing
4. Click **Save**

**Note**: For production, publish your OAuth consent screen for verification.

## Step 6: Configure OAuth Client ID (Optional - Advanced)

Firebase automatically creates an OAuth client ID, but if you need to customize:

1. Go to **APIs & Services** → **Credentials**
2. Find the auto-created **Web client (auto created by Google Service)**
3. Click to edit
4. Add **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `https://studio-6750997720-7c22e.firebaseapp.com`
   - `https://your-custom-domain.com`

5. Add **Authorized redirect URIs**:
   - `http://localhost:5173/__/auth/handler`
   - `https://studio-6750997720-7c22e.firebaseapp.com/__/auth/handler`
   - `https://your-custom-domain.com/__/auth/handler`

6. Click **Save**

## Step 7: Update Environment Variables (Optional)

If you want to use the Google Client ID directly in your app:

1. Copy the **Client ID** from Google Cloud Console
2. Add to your `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

**Note**: This is optional. Firebase SDK handles OAuth without explicit client ID.

## Step 8: Test Google Sign-In

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:5173/login`

3. Click on **"Continuer avec Google"** button

4. You should see Google's sign-in popup

5. Sign in with a Google account (must be a test user if in Testing mode)

6. Verify that:
   - User is redirected to the dashboard
   - User profile is created in Firestore
   - No console errors

## Troubleshooting

### Error: "Not Authorized Domain"

**Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Error: "OAuth Client Not Found"

**Solution**: 
1. Check that Google sign-in is enabled in Firebase Console
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache and try again

### Error: "Access Blocked: Authorization Error"

**Solution**:
1. Ensure OAuth consent screen is configured in Google Cloud Console
2. Add your email as a test user if in Testing mode
3. Publish your OAuth consent screen for production

### Error: "redirect_uri_mismatch"

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit the OAuth 2.0 Client ID
3. Add the missing redirect URI shown in the error message
4. Format: `https://your-domain.com/__/auth/handler`

### Popup Blocked by Browser

**Solution**:
1. Check browser popup blocker settings
2. Allow popups for your domain
3. Try using redirect-based auth instead (modify `auth.service.ts`)

## Security Best Practices

1. **Never commit** OAuth credentials to version control
2. **Use environment variables** for sensitive data
3. **Rotate credentials** regularly
4. **Monitor authentication logs** in Firebase Console
5. **Enable** App Check for production
6. **Implement** rate limiting for auth endpoints
7. **Use** reCAPTCHA for additional security

## Production Deployment Checklist

- [ ] OAuth consent screen published and verified by Google
- [ ] Production domain added to Firebase authorized domains
- [ ] OAuth redirect URIs updated with production URLs
- [ ] Test users removed (production mode)
- [ ] App Check enabled
- [ ] Security rules configured properly
- [ ] Rate limiting implemented
- [ ] Error logging and monitoring set up
- [ ] Terms of service and privacy policy published
- [ ] Google OAuth branding configured

## Support

For more help:
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

## Current Configuration

```
Project ID: studio-6750997720-7c22e
Auth Domain: studio-6750997720-7c22e.firebaseapp.com
Default Authorized Domains:
  - localhost
  - studio-6750997720-7c22e.firebaseapp.com
```

Last Updated: October 2025
