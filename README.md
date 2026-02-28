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

## Project Structure

```
board-game/
├── index.html           # Main menu
├── styles.css           # Global styles
├── chess/
│   ├── index.html       # Chess game UI
│   ├── chess.js         # Chess game logic
│   └── styles.css       # Chess specific styles
└── gomoku/
    ├── index.html       # Gomoku game UI
    ├── gomoku.js        # Gomoku game logic
    └── styles.css       # Gomoku specific styles

docs/
└── README.md            # Documentation
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
- No external dependencies

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
