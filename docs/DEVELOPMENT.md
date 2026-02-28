# Development Guide

## Project Architecture

This is a simple frontend board game project with no external dependencies. Everything is vanilla JavaScript, HTML, and CSS.

### File Organization

```
board-game/
├── index.html          # Game picker menu
├── styles.css          # Global styles
├── chess/              # Chess game folder
│   ├── index.html      # Chess UI
│   ├── chess.js        # Chess logic (Board class, AI, validators)
│   └── styles.css      # Chess specific styles
└── gomoku/             # Gomoku game folder
    ├── index.html      # Gomoku UI
    ├── gomoku.js       # Gomoku logic (Board class, AI, validators)
    └── styles.css      # Gomoku specific styles
```

## Chess Implementation

### File: `chess.js`

#### Class: `Chess`

Main game logic for chess.

**Properties:**
- `board` - 8x8 2D array representing pieces
- `moves` - Array of move history
- `selectedSquare` - Currently selected piece [row, col]
- `validMoves` - Array of valid moves for selected piece
- `currentPlayer` - 'white' or 'black'
- `gameMode` - 'ai' or 'pvp'
- `gameOver` - Boolean game state

**Key Methods:**

```javascript
initBoard()          // Creates standard chess setup
getValidMoves(r, c)  // Returns legal moves for piece
movePiece(fr, fc, tr, tc)  // Makes move, updates player
undo()               // Reverts last move
getAIMove()          // Returns best AI move [fr, fc, tr, tc]
hasValidMoves()      // Checks if current player can move
```

**Piece Notation:**
- Uppercase = White pieces
- Lowercase = Black pieces
- 'P'/'p' = Pawn, 'R'/'r' = Rook, 'N'/'n' = Knight
- 'B'/'b' = Bishop, 'Q'/'q' = Queen, 'K'/'k' = King

### Board Representation

```
Row 0: [r] [n] [b] [q] [k] [b] [n] [r]  (Black's back rank)
Row 1: [p] [p] [p] [p] [p] [p] [p] [p]  (Black pawns)
...
Row 6: [P] [P] [P] [P] [P] [P] [P] [P]  (White pawns)
Row 7: [R] [N] [B] [Q] [K] [B] [N] [R]  (White's back rank)
```

### AI Logic

The AI makes random valid moves:

```javascript
getAIMove() {
    // 1. Collect all pieces for current player
    // 2. Get valid moves for each piece
    // 3. Return random move from collection
}
```

**To Improve AI:**
- Add piece value scoring
- Implement minimax algorithm
- Add opening book
- Add endgame database

## Gomoku Implementation

### File: `gomoku.js`

#### Class: `Gomoku`

Main game logic for Gomoku (Five in a Row).

**Properties:**
- `board` - 15x15 2D array ('black', 'white', null)
- `moves` - Array of move history
- `currentPlayer` - 'black' or 'white'
- `gameMode` - 'ai' or 'pvp'
- `gameOver` - Boolean game state
- `winner` - 'black' or 'white' if game over

**Key Methods:**

```javascript
makeMove(row, col)      // Place stone, check win
checkWin(row, col)      // Check 5 in a row from position
getAIMove()             // Returns best AI move [row, col]
scorePosition(r, c)     // Scores move quality
getAllAvailableMoves()  // Returns list of empty squares
getSearchArea()         // Optimizes AI search area
undo()                  // Reverts last move
reset()                 // Starts new game
```

### Win Condition

Checks all 4 directions from played piece:
- Horizontal
- Vertical
- Diagonal (both ways)

For each direction, counts consecutive stones in both directions (±).

### AI Strategy

1. **Try to Win** - If can place 5 in a row, do it
2. **Block** - If opponent can win, block them
3. **Score** - Evaluate positions near existing pieces
4. **Search** - Only search squares near existing pieces (optimization)

**Scoring:**
- White stone nearby = +2 points
- Black stone nearby = +1 point
- Closer to existing pieces = higher score

## CSS Organization

### Responsive Design
- Uses CSS Grid for board layout
- Flexbox for menus
- Media queries for mobile

### Color Scheme

**Main App:**
- Background: Purple gradient (#667eea to #764ba2)
- Accent: Light purple (#667eea)
- Text: Dark gray (#333) and white

**Chess:**
- Board: Tan (#f0d9b5) and brown (#b58863)
- Selected: Green (#7fc97f)
- Valid moves: Green highlight

**Gomoku:**
- Board: Sandy tan (#d4a574)
- Black stones: #000
- White stones: #fff
- Grid lines: Dark brown

## How to Extend

### Adding a New Game

1. Create new folder: `project/board-game/newgame/`
2. Create files:
   - `index.html` - Game UI with game-board div
   - `newgame.js` - Game logic class + UI controller
   - `styles.css` - Game specific styles

3. Update main menu in `board-game/index.html`
4. Add documentation to `docs/RULES.md`

### Improving AI

**Chess AI Enhancement:**
```javascript
// In chess.js
getAIMove() {
    const moves = [];
    // ... collect all valid moves
    
    // Score each move (add this)
    const scored = moves.map(([fr, fc, tr, tc]) => {
        // Score based on:
        // - Piece value taken
        // - Piece safety
        // - Board control
        return { move: [fr, fc, tr, tc], score: calculateScore(...) };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0].move;
}
```

**Gomoku AI Enhancement:**
```javascript
// Add minimax with alpha-beta pruning
getAIMove() {
    return this.minimax(3, true, -Infinity, Infinity);
}
```

## Testing

To test games manually:

1. **Chess:**
   - Test all piece movements
   - Test capture mechanics
   - Test move validation
   - Test undo functionality

2. **Gomoku:**
   - Test 5 in a row detection (all directions)
   - Test AI blocking
   - Test AI winning
   - Test board boundaries

## Performance Notes

- Chess: Full board scan (O(64)) on each move
- Gomoku: Optimized search area to reduce calculations
- AI delay: 500ms artificial delay for better UX
- No animations to keep rendering fast

## Browser Tools for Debugging

1. **Chrome DevTools** - Inspect board state in console
2. **Console Logging** - Add `console.log(game.board)` to debug
3. **Breakpoints** - Use debugger in JavaScript

### Quick Debug Commands

```javascript
// In browser console while game is open:
game.board              // See current board state
game.moves              // See move history
game.currentPlayer      // See who's playing
game.gameMode           // See current mode
```

## Minimal Dependencies

This project uses only HTML, CSS, and vanilla JavaScript:
- No jQuery
- No React/Vue
- No build tools
- No package managers needed

Just open `index.html` in browser and play!

---

## Code Style

- Simple, readable code
- ES6 features (arrow functions, const/let, classes)
- Comments for complex logic
- Clear variable names
- Keep it KISS (Keep It Simple, Stupid)
