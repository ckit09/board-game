# Quick Start Guide - Mahjong

Get the game running in 3 steps:

## Step 1: Start the Server

```bash
cd mahjong/server
npm install
npm start
```

Server will run on `http://localhost:3000`

## Step 2: Open the Game

In your browser, go to:

```
http://localhost:8000/mahjong/
```

Or click the Mahjong card from the main board-games menu.

## Step 3: Create or Join a Game

### To Create a Game (Host):
1. Click **"Create Room"**
2. Select number of players (AI fills remaining seats)
3. Share the **Room ID** with other players
4. Wait for all players to join
5. Click **"Start Game"** when ready

### To Join a Game (Player):
1. Get the **Room ID** from the host
2. Click **"Join Room"**
3. Enter the room ID
4. Wait for host to start

## Game Play

**Your Turn:**
- Click **"Draw Tile"** to draw from the wall
- Click a tile from your hand to **discard it**
- Click **"Declare Win"** if you have a winning hand

**Other Players:**
- See their tiles and melds on screen
- Highlighted player is current turn (gold glow)

## Winning Hand

You need:
- **1 Pair** (2 same tiles) 
- **4 Melds** (3 tiles each)
  - Pung: 3 identical tiles
  - Chow: 3 consecutive tiles (1-2-3, 5-6-7, etc.)

## Multiplayer

- **Local**: Pass device between players
- **Network**: Each player uses different computer
  - All connect to same server via Room ID
  - Works on different networks (if server is accessible)

## Troubleshooting

**Server won't start?**
```bash
npm install
# Make sure Node.js is installed: node --version
```

**Can't connect to game?**
- Check Room ID matches
- Verify server is running
- Try refreshing browser
- Check firewall port 3000

**Game feels slow?**
- Network latency (expected over internet)
- Check internet connection
- Try reducing player count

For more details, see [README.md](README.md)
