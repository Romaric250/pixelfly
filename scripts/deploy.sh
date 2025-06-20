#!/bin/bash

# PixelFly Deployment Script for Vercel
echo "🚀 Starting PixelFly deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please log in to Vercel:"
    vercel login
fi

# Build the project locally first to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on Vercel!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your environment variables in Vercel dashboard"
    echo "2. Configure your custom domain (optional)"
    echo "3. Test your API endpoints"
    echo "4. Set up monitoring and alerts"
    echo ""
    echo "🔗 Useful links:"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Project Settings: https://vercel.com/dashboard/[your-project]/settings"
    echo "- Function Logs: https://vercel.com/dashboard/[your-project]/functions"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
