#!/bin/bash

# Quick deployment script for Mahjong backend
# Supports: Railway, Render, Heroku

echo "🀄 Mahjong Backend Deployment Script"
echo "===================================="
echo ""

if [ $# -eq 0 ]; then
    echo "Usage: ./deploy.sh [platform] [options]"
    echo ""
    echo "Platforms:"
    echo "  railway          Deploy to Railway (recommended)"
    echo "  render           Deploy to Render"
    echo "  heroku           Deploy to Heroku"
    echo "  local            Run locally for testing"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh railway                    (create new Railway project)"
    echo "  ./deploy.sh heroku mahjong-backend     (create new Heroku app)"
    echo "  ./deploy.sh local                      (run on localhost:3000)"
    exit 0
fi

PLATFORM=$1
APPNAME=${2:-mahjong-backend}

case $PLATFORM in
  railway)
    echo "🚀 Deploying to Railway..."
    echo ""
    echo "Steps:"
    echo "1. Go to https://railway.app"
    echo "2. Sign in with GitHub"
    echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "4. Select 'board-games' repository"
    echo "5. Railway will auto-detect and deploy"
    echo ""
    echo "✅ After deployment:"
    echo "   - Get deployment URL from Railway dashboard"
    echo "   - Update MAHJONG_SERVER_URL in frontend"
    ;;

  render)
    echo "🚀 Deploying to Render..."
    echo ""
    echo "Steps:"
    echo "1. Go to https://render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect GitHub and select 'board-games'"
    echo "4. Configure:"
    echo "   - Root Directory: mahjong/server"
    echo "   - Build: npm install"
    echo "   - Start: npm start"
    echo ""
    echo "✅ After deployment:"
    echo "   - Get deployment URL from Render dashboard"
    echo "   - Add FRONTEND_URL environment variable"
    ;;

  heroku)
    echo "🚀 Deploying to Heroku..."
    echo ""
    if ! command -v heroku &> /dev/null; then
      echo "❌ Heroku CLI not found. Install: https://devcenter.heroku.com/articles/heroku-cli"
      exit 1
    fi
    
    echo "Creating Heroku app: $APPNAME"
    heroku create "$APPNAME"
    
    echo "Pushing code..."
    git subtree push --prefix mahjong/server heroku main
    
    echo ""
    echo "✅ After deployment:"
    echo "   - Get app URL: heroku open"
    echo "   - View logs: heroku logs --tail"
    ;;

  local)
    echo "🚀 Running locally..."
    cd "$(dirname "$0")"
    npm install
    PORT=3000 npm start
    ;;

  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Use: railway, render, heroku, or local"
    exit 1
    ;;
esac

echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT.md"
