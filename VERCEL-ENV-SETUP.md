# Vercel Environment Variables Setup

## Required Environment Variables

To make PixelFly work properly in production, you need to set these environment variables in your Vercel dashboard:

### 1. Authentication Variables

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://pixelfly-pi.vercel.app

# App URL (for auth client)
NEXT_PUBLIC_APP_URL=https://pixelfly-pi.vercel.app

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Database Variables

```bash
# MongoDB Connection
DATABASE_URL=your-mongodb-connection-string
```

### 3. Optional Variables

```bash
# GitHub Stats (for landing page)
GITHUB_TOKEN=your-github-token

# Backend URL (Python API on Render)
NEXT_PUBLIC_BACKEND_URL=https://pixelfly.onrender.com
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your PixelFly project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value
5. Make sure to set them for "Production", "Preview", and "Development" environments

## Important Notes

- `BETTER_AUTH_SECRET` should be a random string (at least 32 characters)
- `DATABASE_URL` should be your MongoDB connection string
- Google OAuth credentials can be obtained from Google Cloud Console
- After adding environment variables, redeploy your application

## Current Status

✅ **Fixed Issues:**
- Auth client now uses production URL instead of localhost
- Backend client points to correct production endpoints
- Tracking APIs point to correct routes
- Authentication protection added to enhance page

🔧 **Next Steps:**
1. Set the environment variables in Vercel dashboard
2. Redeploy the application
3. Test authentication flow
4. Test photo enhancement functionality
