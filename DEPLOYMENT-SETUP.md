# GitHub Actions + Deployment Setup - Summary

## ✅ What Was Created

### 1. GitHub Actions Workflow
**File:** `.github/workflows/deploy-pages.yml`

- **Triggers:** Automatically on push to `main` or `master` branch
- **Action:** Builds and deploys frontend to GitHub Pages
- **Excludes:** Mahjong server code (not needed on static hosting)
- **Includes:** Chess, Gomoku, Cotton Picker, Mahjong client

**How It Works:**
```
Git Push → GitHub Actions → Build Frontend → Deploy to GitHub Pages
                                ↓
                         https://yourusername.github.io/board-games/
```

### 2. Deployment Documentation
**File:** `DEPLOYMENT.md`

Complete guide for deploying Mahjong backend to:
- Railway (recommended)
- Render
- Heroku
- Self-hosted VPS

Includes:
- Step-by-step instructions for each platform
- Environment variables configuration
- CORS setup
- Monitoring and troubleshooting
- Security checklist

### 3. Quick Deploy Scripts

#### For macOS/Linux:
**File:** `deploy.sh`

```bash
chmod +x deploy.sh        # Make executable
./deploy.sh railway       # Deploy to Railway
./deploy.sh render        # Deploy to Render
./deploy.sh heroku <app>  # Deploy to Heroku
./deploy.sh local         # Run locally
```

#### For Windows:
**File:** `deploy.ps1`

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # One-time setup
.\deploy.ps1 -Platform railway                                        # Deploy to Railway
.\deploy.ps1 -Platform render                                         # Deploy to Render
.\deploy.ps1 -Platform heroku -AppName mahjong-backend               # Deploy to Heroku
.\deploy.ps1 -Platform local                                          # Run locally
```

### 4. Backend Configuration Files

#### `mahjong/server/railway.json`
- Auto-detection config for Railway
- Specifies build/start commands
- Enables auto-deploy from GitHub

#### `mahjong/server/Procfile`
- Heroku deployment config
- Specifies process to run (npm start)

#### `mahjong/server/.env.example`
- Template for environment variables
- Shows: PORT, NODE_ENV, FRONTEND_URL
- Copy to `.env` locally before running

#### Updated `mahjong/server/server.js`
- Added `/health` endpoint (for monitoring)
- Added `/` info endpoint
- Support for `FRONTEND_URL` environment variable
- Better console logging

### 5. Updated Documentation

#### `README.md`
- Added Mahjong game overview
- Deployment section with quick links
- Updated project structure diagram
- Instructions for frontend and backend deployment

#### `DEPLOYMENT.md` (New)
- Comprehensive deployment guide
- Platform comparisons
- Step-by-step setup for each option
- Troubleshooting section
- Security checklist

---

## 🚀 How to Use

### Step 1: Deploy Frontend to GitHub Pages

**Option A: Automatic (Recommended)**

1. Commit and push code to `main` branch:
   ```bash
   git add .
   git commit -m "Add Mahjong game with deployment"
   git push origin main
   ```

2. GitHub Actions automatically:
   - Builds the frontend
   - Deploys to GitHub Pages
   - Takes ~2 minutes

3. View your site:
   ```
   https://yourusername.github.io/board-games/
   ```

4. Check workflow status:
   - Go to GitHub → Repo → Actions tab
   - See build status and logs

**Option B: Manual Build**

```bash
# Build locally
mkdir -p _site
cp -r . _site/
rm -rf _site/.github _site/mahjong/server

# Test locally
cd _site
python -m http.server 8000

# Then push _site to GitHub Pages using git subtree
```

### Step 2: Deploy Mahjong Backend

**Choose One Platform:**

#### Railway (Recommended - Fastest)
```bash
# Windows
.\deploy.ps1 -Platform railway

# macOS/Linux
./deploy.sh railway
```

Then:
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `board-games` repo
5. Railway auto-deploys and gives you a URL

#### Render
```bash
# Windows
.\deploy.ps1 -Platform render

# macOS/Linux
./deploy.sh render
```

Then:
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select GitHub repo and configure

#### Local Testing
```bash
# Windows
.\deploy.ps1 -Platform local

# macOS/Linux
./deploy.sh local
```

Server runs on `http://localhost:3000`

### Step 3: Update Frontend with Backend URL

Edit `mahjong/mahjong.js` around line 15:

```javascript
// Change this:
this.serverUrl = 'http://localhost:3000';

// To your deployed URL:
this.serverUrl = 'https://your-railway-deployment.up.railway.app';
// or
this.serverUrl = 'https://your-render-deployment.onrender.com';
```

OR users can enter the server URL in the setup screen.

### Step 4: Redeploy Frontend

If you changed the backend URL, redeploy:

```bash
git add mahjong/mahjong.js
git commit -m "Update backend URL"
git push origin main
# GitHub Actions automatically redeploys
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────┐
│     GitHub Repository               │
│  (Source Code)                      │
└──────────────┬──────────────────────┘
               │
        ┌──────▼────────┐
        │ Git Push      │
        └──────┬────────┘
               │
      ┌────────▼─────────┐
      │ GitHub Actions   │ ← Automatic on push
      │  Build & Test    │
      └────────┬─────────┘
               │
      ┌────────▼──────────────┐
      │ GitHub Pages Hosting  │ ← Frontend
      │ (Static: HTML/CSS/JS) │
      └─────────┬─────────────┘
                │
                │ WebSocket
                │ Connection
                │
      ┌─────────▼──────────────┐
      │  Railway/Render/etc    │ ← Backend
      │  (Node.js Server)      │
      └────────────────────────┘
```

---

## 🔧 Environment Variables for Backend

Set these in your deployment platform dashboard:

```
PORT=auto                    # Railway/Render auto-assign
NODE_ENV=production         # Enable production mode
FRONTEND_URL=https://yourusername.github.io  # For CORS
```

---

## ✨ File Checklist

- ✅ `.github/workflows/deploy-pages.yml` - GitHub Pages CI/CD
- ✅ `deploy.ps1` - Windows deployment script
- ✅ `deploy.sh` - macOS/Linux deployment script
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `README.md` - Updated with deployment info
- ✅ `mahjong/server/railway.json` - Railway config
- ✅ `mahjong/server/Procfile` - Heroku config
- ✅ `mahjong/server/.env.example` - Env template
- ✅ `mahjong/server/server.js` - Updated with health endpoints

---

## 🔗 Quick Links

- Frontend Deploy: Just push to GitHub (automatic)
- Backend Deploy Script: `.\deploy.ps1` or `./deploy.sh`
- Deployment Guide: `DEPLOYMENT.md`
- Mahjong Docs: `mahjong/README.md`
- Mahjong Quick Start: `mahjong/QUICKSTART.md`

---

## 📝 Next Steps

1. **Commit deployment setup:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions + deployment setup"
   git push origin main
   ```

2. **Monitor GitHub Actions:**
   - Go to Actions tab
   - Watch workflow run
   - Confirm frontend deploys to GitHub Pages

3. **Deploy backend (choose one):**
   - Run `.\deploy.ps1 -Platform railway` (or selected platform)
   - Get deployment URL
   - Update `mahjong/mahjong.js` with backend URL

4. **Test live:**
   - Visit `https://yourusername.github.io/board-games/`
   - Click Mahjong card
   - Enter backend URL in setup screen
   - Create/join room and play!

---

**Questions?** See `DEPLOYMENT.md` for detailed troubleshooting.
