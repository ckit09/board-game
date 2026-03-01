# Board Games

A collection of simple and elegant board games built with vanilla JavaScript, HTML, and CSS.

## Games Included

### 1. Chess ♟
Classic chess game with full piece movement rules.

**Features:**
- Player vs AI mode
- Player vs Player mode
- Move validation and legal move highlighting
- Undo functionality
- Move counter

**How to Play:**
- Click a piece to select it (valid moves will be highlighted)
- Click on a highlighted square to move the piece
- Use "New Game" button to start over
- Use "Undo" button to take back moves

**Rules:**
- Each piece moves according to standard chess rules
- AI opponent makes random valid moves
- Track moves with the move counter

### 2. Gomoku (Five in a Row) ⬤
A strategy game where players place stones on a board trying to get 5 in a row.

**Features:**
- Player vs AI mode
- Player vs Player mode
- 15x15 game board
- Smart AI that tries to win and blocks opponent
- Undo functionality
- Move counter

**How to Play:**
- Click on any empty square to place your stone
- Black plays first
- Get 5 stones in a row (horizontal, vertical, or diagonal) to win
- In Player vs AI mode: you play as black, AI plays as white

**AI Strategy:**
- Tries to win if possible
- Blocks opponent from winning
- Prioritizes moves near existing stones
- Gets smarter as the game progresses

### 3. Cotton Picker 🌾
A reflex-based clicking game where you collect cotton and avoid obstacles.

### 4. Mahjong 🀄
Network multiplayer Hong Kong Mahjong with AI opponents.

**Features:**
- **Network Multiplayer**: Play with 4 players across different devices (requires backend)
- **AI Opponents**: Automatically fill empty player seats
- **Hong Kong Rules**: Standard ruleset with hand validation
- **Real-time Gameplay**: Live updates via WebSocket
- **Responsive Design**: Works on desktop and tablet

**Game Modes:**
- 4 Players (all human)
- 1-3 Players + AI opponents

**How to Play:**
1. Create or join a room
2. Wait for players to join
3. Start game (dealer goes first)
4. Draw → Discard → Next player
5. Declare win with valid hand

**Winning Hands:**
- 1 Pair (2 identical tiles)
- 4 Melds (3 tiles each: Pung or Chow)

**Backend Required:** Yes - deploy to Railway, Render, or self-hosted

**Quick Start:**
```bash
# Start backend
cd mahjong/server && npm start

# Or deploy to Railway/Render (see DEPLOYMENT.md)
```

See [mahjong/README.md](mahjong/README.md) for full rules and [mahjong/QUICKSTART.md](mahjong/QUICKSTART.md) for setup.

## Project Structure

```
board-game/
├── index.html                    # Main menu
├── styles.css                    # Global styles
├── README.md                     # This file
├── DEPLOYMENT.md                 # Deployment guide
├── deploy.sh                     # Deploy script (macOS/Linux)
├── deploy.ps1                    # Deploy script (Windows)
│
├── .github/workflows/
│   └── deploy-pages.yml          # GitHub Pages CI/CD
│
├── chess/                        # Chess game
│   ├── index.html
│   ├── chess.js
│   └── styles.css
│
├── gomoku/                       # Gomoku game
│   ├── index.html
│   ├── gomoku.js
│   └── styles.css
│
├── cotton-picker/               # Cotton Picker game
│   ├── index.html
│   ├── cotton-picker.js
│   └── styles.css
│
└── mahjong/                      # Mahjong (requires backend)
    ├── index.html               # Client UI
    ├── mahjong.js               # Client logic
    ├── styles.css               # Client styling
    ├── README.md                # Full documentation
    ├── QUICKSTART.md            # Quick setup guide
    │
    └── server/                  # Backend (Node.js)
        ├── package.json         # Dependencies
        ├── server.js            # WebSocket server
        ├── gameEngine.js        # Game logic
        ├── Procfile             # Heroku config
        ├── railway.json         # Railway config
        ├── .env.example         # Environment variables
        └── .gitignore
```

## Getting Started

1. Open `board-game/index.html` in your web browser
2. Click on either Chess or Gomoku to start playing
3. Select your game mode (Player vs AI or Player vs Player)
4. Click "New Game" when ready
5. Use "Undo" to take back moves as needed

## Technologies

- HTML5
- CSS3 (Grid, Flexbox)
- Vanilla JavaScript (ES6)
- No external dependencies (except Node.js for Mahjong backend)

## Deployment

### Frontend (Games: Chess, Gomoku, Cotton Picker, Mahjong Client)

Deployed automatically to **GitHub Pages** on every push to `main/master`:

```bash
git push origin main
# GitHub Actions automatically deploys to GitHub Pages
```

**Live Site:** https://yourusername.github.io/board-games/

**Workflow:** [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

### Backend (Mahjong Server Only)

The Mahjong game requires a WebSocket server. Deploy separately to:
- **Railway** (recommended, free tier)
- **Render** (free tier)
- **Heroku** (paid)
- **Self-hosted VPS**

**Quick Deploy:**

```bash
# Windows
.\deploy.ps1 -Platform railway

# macOS/Linux
./deploy.sh railway
```

**Full Instructions:** See [DEPLOYMENT.md](DEPLOYMENT.md)

## Browser Compatibility

Works in all modern browsers that support ES6 JavaScript.

## Tips

**Chess:**
- Start with classic openings for better strategy
- The AI is random but follows basic piece rules
- Use "Undo" to experiment with different moves

**Gomoku:**
- Control the center of the board early
- Look for opportunities to create multiple threats
- Block the AI's winning moves
- The AI gets smarter as pieces fill the board

## Future Enhancements

- Improved AI with minimax algorithm
- Move history and replay
- Online multiplayer
- Piece capture animations
- Sound effects
- Game statistics tracking
