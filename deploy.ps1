# Quick deployment script for Mahjong backend (Windows)
# Supports: Railway, Render, Heroku

param(
    [string]$Platform,
    [string]$AppName = "mahjong-backend"
)

Write-Host "🀄 Mahjong Backend Deployment Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

if (-not $Platform) {
    Write-Host "Usage: .\deploy.ps1 -Platform <platform> [-AppName <name>]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Platforms:"
    Write-Host "  railway    Deploy to Railway (recommended)"
    Write-Host "  render     Deploy to Render"
    Write-Host "  heroku     Deploy to Heroku"
    Write-Host "  local      Run locally for testing"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy.ps1 -Platform railway"
    Write-Host "  .\deploy.ps1 -Platform heroku -AppName mahjong"
    Write-Host "  .\deploy.ps1 -Platform local"
    exit
}

switch ($Platform) {
    "railway" {
        Write-Host "🚀 Deploying to Railway..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to https://railway.app"
        Write-Host "2. Sign in with GitHub"
        Write-Host "3. Click 'New Project' → 'Deploy from GitHub repo'"
        Write-Host "4. Select 'board-games' repository"
        Write-Host "5. Allow Railway to detect and auto-deploy"
        Write-Host ""
        Write-Host "✅ After deployment:" -ForegroundColor Green
        Write-Host "   - Get deployment URL from Railway dashboard"
        Write-Host "   - Update mahjong.js with server URL"
        Write-Host "   - Re-deploy frontend (GitHub Pages auto-updates)"
    }

    "render" {
        Write-Host "🚀 Deploying to Render..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to https://render.com"
        Write-Host "2. Click 'New +' → 'Web Service'"
        Write-Host "3. Connect GitHub and select 'board-games'"
        Write-Host "4. Configure root directory: mahjong/server"
        Write-Host ""
        Write-Host "✅ After deployment:" -ForegroundColor Green
        Write-Host "   - Get URL from Render dashboard"
        Write-Host "   - Set FRONTEND_URL env var to your GitHub Pages URL"
    }

    "heroku" {
        Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Green
        Write-Host ""
        
        $herokuCmd = Get-Command heroku -ErrorAction SilentlyContinue
        if (-not $herokuCmd) {
            Write-Host "❌ Heroku CLI not found" -ForegroundColor Red
            Write-Host "Install from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Creating Heroku app: $AppName" -ForegroundColor Cyan
        heroku create $AppName
        
        Write-Host "Pushing code..." -ForegroundColor Cyan
        git subtree push --prefix mahjong/server heroku main
        
        Write-Host ""
        Write-Host "✅ Done!" -ForegroundColor Green
        Write-Host "   - Get app URL: heroku open"
        Write-Host "   - View logs: heroku logs --tail"
    }

    "local" {
        Write-Host "🚀 Running locally on http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        
        $serverPath = Join-Path $PSScriptRoot "mahjong\server"
        
        if (-not (Test-Path $serverPath)) {
            Write-Host "❌ mahjong/server directory not found" -ForegroundColor Red
            exit 1
        }
        
        Push-Location $serverPath
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        npm install
        
        Write-Host ""
        Write-Host "Starting server..." -ForegroundColor Cyan
        $env:PORT = 3000
        npm start
        Pop-Location
    }

    default {
        Write-Host "❌ Unknown platform: $Platform" -ForegroundColor Red
        Write-Host "Use: railway, render, heroku, or local" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "📖 For detailed instructions, see: DEPLOYMENT.md" -ForegroundColor Cyan
