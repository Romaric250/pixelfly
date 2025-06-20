# PixelFly Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **MongoDB Database**: Set up a MongoDB Atlas cluster
4. **Environment Variables**: Prepare your environment variables

### Step 1: Prepare Environment Variables

Create these environment variables in your Vercel dashboard:

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/pixelfly"

# Authentication
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Backend API (will be the same as your Vercel app URL)
NEXT_PUBLIC_BACKEND_URL="https://your-app.vercel.app"

# GitHub API (for repository stats)
GITHUB_TOKEN="your-github-token"

# Optional: UploadThing
UPLOADTHING_TOKEN="your-uploadthing-token"
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add your environment variables
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your username/team
# - Link to existing project? No
# - Project name: pixelfly
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 3: Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your custom domain
4. Update your environment variables with the new domain

### Step 4: Update Environment Variables

After deployment, update these variables with your actual Vercel URL:

```bash
BETTER_AUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXT_PUBLIC_BACKEND_URL="https://your-app.vercel.app"
```

## 🔧 Backend Configuration

### Production WSGI Server Setup

The backend is now configured with proper production WSGI servers:

#### For Linux/macOS (Gunicorn):
```bash
# Navigate to backend directory
cd backend

# Start production server
./start-production.sh
# OR manually:
gunicorn -c gunicorn.conf.py wsgi:application
```

#### For Windows (Waitress):
```cmd
# Navigate to backend directory
cd backend

# Start production server
start-production.bat
# OR manually:
waitress-serve --host=0.0.0.0 --port=5001 --threads=4 wsgi:application
```

#### Development Mode:
```bash
# Linux/macOS
./start-development.sh

# Windows
start-development.bat
```

### Vercel Serverless Configuration:

- **Entry Point**: `backend/api/index.py`
- **Runtime**: Python 3.9
- **Max Duration**: 60 seconds (increased for image processing)
- **Memory**: 1024 MB
- **Max Lambda Size**: 50MB

### API Endpoints

After deployment, your API endpoints will be available at:

- `https://your-app.vercel.app/api/enhance` - Photo enhancement
- `https://your-app.vercel.app/api/watermark` - Photo watermarking
- `https://your-app.vercel.app/api/health` - Health check

## 🗄️ Database Setup

### MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string
6. Add it to your environment variables as `DATABASE_URL`

### Prisma Setup

The database schema will be automatically applied when the app starts. If you need to manually update:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## 🔐 Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Vercel URL to authorized origins:
   - `https://your-app.vercel.app`
6. Add callback URL:
   - `https://your-app.vercel.app/api/auth/callback/google`

## 📊 GitHub Integration

For repository stats (stars, forks):

1. Create a GitHub Personal Access Token
2. Add it as `GITHUB_TOKEN` environment variable
3. No special permissions needed for public repositories

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript types are correct
   - Check build logs in Vercel dashboard

2. **API Errors**
   - Verify environment variables are set
   - Check function logs in Vercel dashboard
   - Ensure database connection string is correct

3. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check callback URLs match your domain
   - Ensure `BETTER_AUTH_URL` matches your deployment URL

4. **Database Connection**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

### Logs and Monitoring

- **Function Logs**: Vercel Dashboard → Project → Functions tab
- **Build Logs**: Vercel Dashboard → Project → Deployments
- **Real-time Logs**: Use `vercel logs` CLI command

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch. To configure:

1. Go to Project Settings → Git
2. Configure production branch (usually `main`)
3. Set up preview deployments for other branches

## 📈 Performance Optimization

### Vercel Specific

- Functions are automatically optimized
- Static assets are served from CDN
- Images are automatically optimized

### Database

- Use connection pooling
- Index frequently queried fields
- Monitor query performance

## 🛡️ Security

- All environment variables are encrypted
- HTTPS is enforced by default
- API routes have CORS protection
- Database connections use SSL

## 📞 Support

If you encounter issues:

1. Check Vercel documentation
2. Review function logs
3. Test API endpoints directly
4. Check database connectivity

---

**Happy Deploying! 🚀**
