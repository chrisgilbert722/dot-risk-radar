#!/bin/bash

# DOT Risk Radar - Quick Deploy Script
# This script helps you deploy to Vercel

set -e

echo "🚀 DOT Risk Radar - Deployment Helper"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: DOT Risk Radar with Supabase auth"
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found"
    echo "Install with: npm i -g vercel"
    echo ""
    read -p "Would you like to install Vercel CLI now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm i -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "❌ Deployment cancelled. Install Vercel CLI and run this script again."
        exit 1
    fi
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo ""
echo "1. ✅ Supabase project created?"
echo "2. ✅ Environment variables ready?"
echo "3. ✅ GitHub repository created (optional but recommended)?"
echo ""
read -p "Ready to deploy? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to Vercel
vercel

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Add environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. Update Supabase redirect URLs:"
echo "   - Go to Authentication → URL Configuration"
echo "   - Add: https://your-project.vercel.app/auth/callback"
echo ""
echo "3. Redeploy with: vercel --prod"
echo ""
echo "📖 Full deployment guide: ./DEPLOYMENT.md"
echo ""
