# Backend Deployment Guide

The Mahjong game frontend is deployed to GitHub Pages automatically via workflow. The **backend WebSocket server** must be deployed separately to a server-capable platform.

## Architecture

```
┌─────────────────────────────────────────────┐
│         GitHub Pages (Frontend)             │
│  - HTML/CSS/JS for all games                │
│  - Chess, Gomoku, Cotton Picker (no server) │
│  - Mahjong client (connects to backend)     │
└─────────────────────────────────────────────┘
                      ↓
             (WebSocket Connection)
                      ↓
┌─────────────────────────────────────────────┐
│     Backend Server (Separate Platform)      │
│  - Node.js + Express + Socket.io            │
│  - Game logic engine                        │
│  - Player communication                     │
└─────────────────────────────────────────────┘
```

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway provides free tier with automatic deploys from GitHub.

**Setup:**

1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your board-games repo
5. Choose `mahjong/server` as the root directory
6. Railway auto-detects Node.js and deploys

**Environment Variables:**

Add in Railway dashboard:
```
PORT=8000
NODE_ENV=production
```

**Get Your Backend URL:**

After deployment, Railway provides a public URL (e.g., `https://myjong-prod.up.railway.app`)

### Option 2: Render

Render also offers free tier with GitHub integration.

**Setup:**

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select board-games repo
5. Configure:
   - **Name**: `mahjong-backend`
   - **Runtime**: Node
   - **Build command**: `cd mahjong/server && npm install`
   - **Start command**: `npm start`
   - **Environment**: Free tier

**Get Your Backend URL:**

Render provides URL during deployment (e.g., `https://myjong-backend.onrender.com`)

### Option 3: Heroku (Paid - No Free Tier Now)

Heroku still works but free tier was discontinued.

**Setup:**

```bash
npm install -g heroku
heroku login
heroku create mahjong-backend
git subtree push --prefix mahjong/server heroku main
```

### Option 4: Self-Hosted

Deploy to your own server (VPS, dedicated).

**Requirements:**
- Node.js installed
- Port 3000+ accessible
- PM2 or similar for process management

**Deploy:**

```bash
ssh user@your-server
git clone https://github.com/yourusername/board-games.git
cd board-games/mahjong/server
npm install
npm start
```

Use PM2 for persistence:
```bash
npm install -g pm2
pm2 start server.js --name "mahjong"
pm2 startup
pm2 save
```

## Update Frontend to Use Backend URL

Once backend is deployed, update the Mahjong client to point to your server.

**Edit `mahjong/mahjong.js`:**

```javascript
// Line ~15: Update default server URL
this.serverUrl = 'https://myjong-prod.up.railway.app'; // ← Your deployment URL
```

Or allow users to input server URL in setup screen (already implemented).

## CORS Configuration

The backend already has CORS enabled for all origins (development-friendly):

```javascript
// server/server.js
const io = socketIo(server, {
  cors: {
    origin: '*',  // ← Allows any frontend to connect
    methods: ['GET', 'POST'],
  },
});
```

For production, restrict to your GitHub Pages domain:

```javascript
cors: {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}
```

## Environment Variables

Set these on your deployment platform:

```
PORT=8000                                    # Railway auto-assigns
NODE_ENV=production                          # For Express
FRONTEND_URL=https://yourusername.github.io # Optional: for CORS
```

## Testing Deployment

**Local Test:**

```bash
# Terminal 1: Start server
cd mahjong/server
PORT=3000 npm start

# Terminal 2: Open frontend
# Browser: http://localhost:8000/mahjong/
# Or check server running at: http://localhost:3000/health
```

**Remote Test:**

After deployment, test with:

```bash
# Check server health (if health endpoint implemented)
curl https://your-backend-url/health

# Or test WebSocket connection from browser console
# In any Mahjong game:
# 1. Go to http://yourusername.github.io/mahjong/
# 2. Enter backend URL: https://your-backend-url
# 3. Click "Create Room"
```

## CI/CD Pipeline Status

**Auto-deployed (Frontend):**
- ✅ GitHub Pages: Frontend updates on every push to `main/master`
- 📄 Workflow: `.github/workflows/deploy-pages.yml`
- 🔗 URL: `https://yourusername.github.io/board-games/`

**Manual Deploy (Backend):**
- Backend requires separate deployment
- Choose platform above
- Update `mahjong.js` with backend URL
- Redeploy frontend if URL changes

## Rollback

**Frontend:**
```bash
# Push old commit to main
git revert <commit>
git push origin main
# GitHub Actions auto-redeploys
```

**Backend:**
- Railway: Click "Rollback" in deployment history
- Render: Select previous deployment
- Heroku: `heroku releases:rollback`

## Monitoring

**Railway Dashboard:**
- Real-time logs
- Deployment status
- Error tracking

**Render Dashboard:**
- Live logs
- Crash detection
- Auto-restart on failure

## Common Issues

### Issue: "Connection refused" from frontend

**Cause:** Backend URL incorrect or server not running

**Fix:**
1. Verify backend deployment URL
2. Check `mahjong.js` has correct URL
3. Test direct access: `https://your-backend-url`
4. Check CORS headers with: `curl -i https://your-backend-url`

### Issue: WebSocket timeout

**Cause:** Firewall or proxy blocking WebSocket

**Fix:**
1. Ensure backend supports WebSocket (Socket.io included)
2. Check deployment platform allows WebSocket (most do)
3. Try HTTPS/WSS (Railway/Render enforce this)

### Issue: "502 Bad Gateway"

**Cause:** Backend crashed or not responding

**Fix:**
1. Check logs in platform dashboard
2. Verify `npm start` works locally
3. Check `package.json` dependencies installed
4. Restart deployment

## Advanced: Custom Domain

Use custom domain for backend (optional).

**Railway:**
1. Settings → Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records per instructions

**Render:**
1. Settings → Custom Domain
2. Add domain and update DNS

Then update `mahjong.js`:
```javascript
this.serverUrl = 'https://api.yourdomain.com';
```

## Security Considerations

**Production Checklist:**

- [ ] Enable HTTPS only (automatic on Railway/Render)
- [ ] Restrict CORS to your domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting (TODO: add to server.js)
- [ ] Validate all player inputs
- [ ] Use authentication for sensitive operations
- [ ] Monitor logs for attacks
- [ ] Regular security updates for Node.js/dependencies

## Scaling

**For large player base:**

- Implement Redis for session persistence
- Use load balancer (Railway/Render handle this)
- Database for player history/stats
- Implement server clustering
- Add rate limiting and DDoS protection

---

**Next Steps:**

1. Choose a deployment platform (Railway recommended)
2. Follow setup instructions for that platform
3. Get your backend URL
4. Update `mahjong/mahjong.js` with the URL
5. Test connection from frontend
6. Share backend URL with players
