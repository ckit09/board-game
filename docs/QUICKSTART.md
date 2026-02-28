# Quick Start Guide

## 🚀 Start Playing Now

### Option 1: Direct Browser Open (Easiest)
1. Navigate to `board-game` folder
2. Double-click `index.html`
3. Your browser opens with the game menu
4. Click "Chess" or "Gomoku" to play

### Option 2: Using HTTP Server (Recommended)

**If you have Node.js installed:**
```bash
cd board-game
npm install http-server -g
http-server . -p 8000
# Opens http://localhost:8000 in your browser
```

**Or with Python:**
```bash
cd board-game
python -m http.server 8000
# Open http://localhost:8000 in browser
```

---

## 🎮 First Game - Chess

1. Click **Chess** from menu
2. Choose mode:
   - **Player vs AI** - You play white, AI plays black
   - **Player vs Player** - Two players on same computer
3. Click **"New Game"** button
4. Click a piece (valid moves show in bright squares)
5. Click where you want to move
6. Play!

**Controls:**
- Click piece → Select
- Click green square → Move
- Undo → Take back moves
- New Game → Start over

---

## ⬤ First Game - Gomoku

1. Click **Gomoku** from menu
2. Choose mode:
   - **Player vs AI** - You play black (first), AI plays white
   - **Player vs Player** - Take turns on same computer
3. Click **"New Game"** button
4. Click any empty square to place your stone
5. Get 5 in a row to win!

**Controls:**
- Click square → Place stone
- Undo → Take back moves
- New Game → Start over

---

## 📋 Game Rules (Brief)

### Chess
- Move pieces according to chess rules
- Goal: Checkmate opponent's king
- Click piece to see valid moves (bright highlight)

### Gomoku
- Place stones on board
- Goal: Get 5 in a row (any direction)
- Black goes first
- Super simple rules!

---

## 🎯 Tips for Beginners

### Chess Tips
- Learn piece movements first:
  - Pawns: Forward 1-2 squares
  - Rooks: Straight lines
  - Knights: L-shaped jumps
  - Bishops: Diagonals
  - Queen: Any direction
  - King: One square any direction

- Use Undo to experiment!
- Try Player vs Player first to learn

### Gomoku Tips
- Control the center of the board
- Look ahead 5 squares in each direction
- Block opponent's winning moves
- Create two threats to force a win

---

## 🆘 Troubleshooting

**Q: Game won't open**
- Make sure you're opening `index.html` (not the folder)
- Try right-click → "Open with" → Choose browser

**Q: Board looks weird/partially loaded**
- Try refreshing the page (F5)
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

**Q: Can't make moves**
- Make sure it's your turn (check turn indicator)
- In Chess, click piece first to see valid moves
- Make sure you're in a game (click New Game button)

**Q: AI seems stuck**
- Refresh the page
- Click New Game button

---

## 📖 Learn More

- **Rules Deep Dive:** See `docs/RULES.md`
- **How It Works:** See `docs/DEVELOPMENT.md`
- **Full Info:** See `docs/README.md`

---

## 🎮 Play Options

### Player vs AI
- Play against computer
- Computer uses basic strategy
- Great for learning

### Player vs Player
- Play with a friend on same computer
- One person = one color
- Take turns clicking

---

## 🎨 Features

✅ **Chess:**
- Full piece movement rules
- Move validation
- Undo system
- Two game modes
- Clean, simple UI

✅ **Gomoku:**
- 15x15 board
- Win detection (all directions)
- Smart AI opponent
- Two game modes
- Simple, elegant design

---

Enjoy! ♟ ⬤
