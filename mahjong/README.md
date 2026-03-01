# 🀄 Mahjong - Hong Kong Style

A network multiplayer Mahjong game implementation using Hong Kong rules with WebSocket support and AI opponents.

## Features

- **Network Multiplayer**: Play with 4 players across different devices using WebSocket connection
- **AI Opponents**: Fill empty seats with AI players (supports 1-4 player games)
- **Hong Kong Rules**: Implements standard Hong Kong Mahjong rules
- **Real-time UI**: Live game updates across all connected players
- **Responsive Design**: Works on desktop and tablet devices

## System Requirements

- **Node.js** (v14+) for running the server
- **Modern web browser** with WebSocket support
- **npm** for dependency management

## Setup Instructions

### 1. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd mahjong/server
npm install
```

Start the server:

```bash
npm start
# Server will run on http://localhost:3000
```

Or for development with auto-reload:

```bash
npm run dev
# Requires nodemon: npm install --save-dev nodemon
```

### 2. Client Setup

Open your web browser and navigate to:

```
http://localhost:8000/mahjong/
```

Or use the main board-games menu at `http://localhost:8000/`

## How to Play

### Game Setup

1. **Create Room** or **Join Room**:
   - To create: Click "Create Room" and select number of players (AI fills remaining seats)
   - To join: Enter room ID from another player
   - Server URL defaults to `http://localhost:3000`

2. **Wait for Players**: 
   - Room shows player count
   - "Start Game" button enables when all seats are filled

3. **Game Play**:
   - Each player starts with 13 tiles
   - Dealer gets 1 extra tile
   - Players take turns: **Draw → Discard → Next Player**

### Player Actions

- **Draw Tile**: Draw from the wall
- **Discard Tile**: Click a tile from your hand to discard it
- **Declare Win**: Declare winning hand (must have valid winning pattern)
- **Current Turn**: Highlighted with gold glow

### Winning

Win with a hand containing:
- **1 Pair** (2 identical tiles)
- **4 Melds** (each meld is 3 tiles: either Pung or Chow)

Valid Melds:
- **Pung**: 3 identical tiles
- **Chow**: 3 consecutive tiles of same suit (e.g., 1-2-3)

## Game Rules (Hong Kong Style)

### Tile Sets

- **Characters** (Man): 1-9, 4 of each = 36 tiles
- **Dots** (Pin): 1-9, 4 of each = 36 tiles
- **Bamboo** (Tiao): 1-9, 4 of each = 36 tiles
- **Dragons** (Red, Green, White): 4 of each = 12 tiles
- **Winds** (East, South, West, North): 4 of each = 16 tiles

**Total: 136 tiles**

### Turn Structure

1. **Draw Phase**: Draw one tile from the wall
2. **Check Phase**: Check for winning condition
3. **Discard Phase**: Discard one tile to discard pile
4. **Next Player**: Pass turn to next player (clockwise)

### End Conditions

- **Player Wins**: Valid winning hand combinations
- **Draw**: No tiles left in wall (dead wall)

## Architecture

### Backend (`server/`)

- **server.js**: Main WebSocket server (Socket.io)
- **gameEngine.js**: Core Mahjong game logic
  - Tile initialization and shuffling
  - Hand validation
  - Win pattern checking
  - Move history tracking

### Frontend

- **index.html**: UI structure (Setup, Waiting, Game, Game Over screens)
- **mahjong.js**: Game client with WebSocket communication
- **styles.css**: Responsive game styling

### File Structure

```
mahjong/
├── index.html          # Client UI
├── mahjong.js          # Client game logic
├── styles.css          # Client styling
└── server/
    ├── package.json    # Server dependencies
    ├── server.js       # WebSocket server
    └── gameEngine.js   # Game logic engine
```

## Socket.io Events

### Client → Server

- `createRoom`: Create new game room
- `joinRoom`: Join existing room
- `startGame`: Start game after players join
- `drawTile`: Draw tile from wall
- `discardTile`: Discard a tile
- `declareWin`: Declare winning hand

### Server → Client

- `playerJoined`: Player joins room
- `gameStarted`: Game begins
- `receiveHand`: Private hand for player
- `tileDiscarded`: Player discarded tile
- `playerTurn`: Notify player for their turn
- `gameEnded`: Game finished
- `playerLeft`: Player disconnected

## Troubleshooting

### Connection Issues

- Ensure server is running: `npm start` in `server/` directory
- Check port 3000 is not blocked by firewall
- Verify browser supports WebSocket
- Try resetting server connection: Reload page

### Room Issues

- **Room not found**: Check room ID is correct
- **Room is full**: Max 4 players per room
- **Connection dropped**: Players need to rejoin with room ID

## Development Notes

### AI Implementation

Currently simple random move selection. To improve:

1. **Basic Strategy**: Prioritize discarding number tiles (safer than honors)
2. **Win Detection**: Check for near-win hands
3. **Blocking**: Detect opponent win threats
4. **Advanced**: Machine learning approach with training

### Future Enhancements

- [ ] Scoring system (Hong Kong point calculation)
- [ ] Meld declaration (Chow, Pung, Kong)
- [ ] Wall drawing mechanics (special Kong handling)
- [ ] Chat system for players
- [ ] Player statistics tracking
- [ ] UI animations for tile movement
- [ ] Sound effects and music
- [ ] Game replay system

## License

This project is part of the board-games collection. See main README for details.

## References

- Hong Kong Mahjong Rules: https://en.wikipedia.org/wiki/Mahjong
- Socket.io Documentation: https://socket.io/docs/v4/
- Game Theory: Optimal Mahjong Strategy

---

**Note**: This is a work in progress. Features may change as development continues.
