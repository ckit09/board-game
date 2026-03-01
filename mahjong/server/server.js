/**
 * Mahjong Game Server
 * WebSocket server using Socket.io for multiplayer gameplay
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const MahjongEngine = require('./gameEngine');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

// Health check endpoint (for monitoring/deployment platforms)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'mahjong-server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Mahjong Game Server',
    version: '1.0.0',
    description: 'WebSocket server for multiplayer Hong Kong Mahjong',
    documentation: 'See ../README.md',
    endpoints: {
      websocket: 'wss://this-server/socket.io',
      health: 'GET /health',
    },
  });
});

// Store active games and rooms
const games = new Map(); // roomId -> MahjongEngine
const rooms = new Map(); // roomId -> [players]
const playerRooms = new Map(); // socketId -> roomId
const playerIndices = new Map(); // socketId -> playerIndex in game

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Connection] ${socket.id} connected`);

  /**
   * Create a new game room
   * Data: { playerMode: 1-4, aiPlayers: [0,1,2,3] (indices that are AI) }
   */
  socket.on('createRoom', (data, callback) => {
    const roomId = generateRoomId();
    const playerCount = data.playerMode || 4;
    const aiPlayers = data.aiPlayers || [];

    // Create game instance
    const game = new MahjongEngine(playerCount, aiPlayers);
    games.set(roomId, game);
    rooms.set(roomId, []);

    console.log(`[Room] Created room ${roomId} with ${playerCount} players (AI: ${aiPlayers})`);

    socket.join(roomId);
    playerRooms.set(socket.id, roomId);
    playerIndices.set(socket.id, 0); // First player joins as index 0

    rooms.get(roomId).push(socket.id);

    callback({
      success: true,
      roomId,
      playerIndex: 0,
      gameState: game.getGameState(),
    });

    io.to(roomId).emit('playerJoined', {
      roomId,
      playerCount: rooms.get(roomId).length,
      gameState: game.getGameState(),
    });
  });

  /**
   * Join an existing game room
   * Data: { roomId }
   */
  socket.on('joinRoom', (data, callback) => {
    const { roomId } = data;
    const game = games.get(roomId);

    if (!game) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const room = rooms.get(roomId);
    if (room.length >= game.playerCount) {
      callback({ success: false, error: 'Room is full' });
      return;
    }

    socket.join(roomId);
    const playerIndex = room.length;
    playerRooms.set(socket.id, roomId);
    playerIndices.set(socket.id, playerIndex);
    room.push(socket.id);

    console.log(`[Room] ${socket.id} joined room ${roomId} as player ${playerIndex}`);

    callback({
      success: true,
      roomId,
      playerIndex,
      gameState: game.getGameState(),
    });

    io.to(roomId).emit('playerJoined', {
      roomId,
      playerCount: room.length,
      gameState: game.getGameState(),
    });
  });

  /**
   * Start the game (distribute tiles)
   */
  socket.on('startGame', (data, callback) => {
    const roomId = playerRooms.get(socket.id);
    const game = games.get(roomId);

    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    game.initializeGame();
    console.log(`[Game] Started in room ${roomId}`);

    // Send game state to all players
    io.to(roomId).emit('gameStarted', {
      gameState: game.getGameState(),
    });

    // Send private hands to each player
    const room = rooms.get(roomId);
    room.forEach((playerId, index) => {
      const playerHand = game.getPlayerHand(index);
      io.to(playerId).emit('receiveHand', {
        hand: playerHand,
        playerIndex: index,
      });
    });

    callback({ success: true });

    // If current player is AI, trigger AI move
    if (game.aiPlayers.has(game.currentPlayer)) {
      setTimeout(() => {
        handleAIMove(game, roomId);
      }, 1000);
    }
  });

  /**
   * Player discards a tile
   */
  socket.on('discardTile', (data, callback) => {
    const { tileId } = data;
    const roomId = playerRooms.get(socket.id);
    const game = games.get(roomId);
    const playerIndex = playerIndices.get(socket.id);

    if (!game || playerIndex !== game.currentPlayer) {
      callback({ success: false, error: 'Not your turn' });
      return;
    }

    const result = game.discardTile(tileId);
    if (!result.valid) {
      callback({ success: false, error: result.error });
      return;
    }

    console.log(`[Move] Player ${playerIndex} discarded ${result.tile.id}`);

    // Broadcast discard to all players
    io.to(roomId).emit('tileDiscarded', {
      playerIndex,
      tile: result.tile,
      gameState: game.getGameState(),
    });

    callback({ success: true });

    // Move to next player
    game.nextTurn();

    // Check if next player is AI
    if (game.aiPlayers.has(game.currentPlayer)) {
      setTimeout(() => {
        handleAIMove(game, roomId);
      }, 1000);
    } else {
      // Notify next player to draw
      io.to(roomId).emit('playerTurn', {
        currentPlayer: game.currentPlayer,
        action: 'draw',
      });
    }
  });

  /**
   * Player draws a tile
   */
  socket.on('drawTile', (data, callback) => {
    const roomId = playerRooms.get(socket.id);
    const game = games.get(roomId);
    const playerIndex = playerIndices.get(socket.id);

    if (!game || playerIndex !== game.currentPlayer) {
      callback({ success: false, error: 'Not your turn' });
      return;
    }

    const tile = game.drawTile();
    if (!tile) {
      // Wall empty - game over
      io.to(roomId).emit('gameEnded', {
        gameState: game.getGameState(),
        reason: 'Wall empty - draw',
      });
      callback({ success: false, error: 'Wall empty' });
      return;
    }

    // Send tile only to the current player
    io.to(socket.id).emit('tileDraw', {
      tile,
      handSize: game.players[playerIndex].hand.length + 1,
    });

    // Add tile to player's hand on server
    game.players[playerIndex].hand.push(tile);

    callback({ success: true });
  });

  /**
   * Player declares win
   */
  socket.on('declareWin', (data, callback) => {
    const roomId = playerRooms.get(socket.id);
    const game = games.get(roomId);
    const playerIndex = playerIndices.get(socket.id);

    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    const winResult = game.checkWin(playerIndex);
    if (!winResult || !winResult.valid) {
      callback({ success: false, error: 'Invalid win' });
      return;
    }

    game.gameOver = true;
    game.winner = playerIndex;

    console.log(`[Win] Player ${playerIndex} won Game ${roomId}`);

    io.to(roomId).emit('gameEnded', {
      gameState: game.getGameState(),
      winner: playerIndex,
      reason: 'Player won',
    });

    callback({ success: true, message: 'You won!' });
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', () => {
    const roomId = playerRooms.get(socket.id);
    console.log(`[Disconnect] ${socket.id} disconnected from room ${roomId}`);

    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        const index = room.indexOf(socket.id);
        if (index > -1) room.splice(index, 1);

        // Notify other players
        io.to(roomId).emit('playerLeft', {
          playerIndex: playerIndices.get(socket.id),
          remainingPlayers: room.length,
        });

        // Clean up if room is empty
        if (room.length === 0) {
          games.delete(roomId);
          rooms.delete(roomId);
          console.log(`[Room] Deleted room ${roomId}`);
        }
      }
    }

    playerRooms.delete(socket.id);
    playerIndices.delete(socket.id);
  });
});

/**
 * Handle AI player move
 */
function handleAIMove(game, roomId) {
  const playerIndex = game.currentPlayer;

  // Draw a tile
  const tile = game.drawTile();
  if (!tile) {
    io.to(roomId).emit('gameEnded', {
      gameState: game.getGameState(),
      reason: 'Wall empty - draw',
    });
    return;
  }

  game.players[playerIndex].hand.push(tile);

  // Simple AI: discard a random tile
  const handIndex = Math.floor(Math.random() * game.players[playerIndex].hand.length);
  const discardTile = game.players[playerIndex].hand[handIndex];

  const result = game.discardTile(discardTile.id);
  if (result.valid) {
    io.to(roomId).emit('tileDiscarded', {
      playerIndex,
      tile: result.tile,
      gameState: game.getGameState(),
    });

    game.nextTurn();

    // Continue if next player is also AI
    if (game.aiPlayers.has(game.currentPlayer)) {
      setTimeout(() => {
        handleAIMove(game, roomId);
      }, 1000);
    } else {
      io.to(roomId).emit('playerTurn', {
        currentPlayer: game.currentPlayer,
        action: 'draw',
      });
    }
  }
}

/**
 * Utility: Generate unique room ID
 */
function generateRoomId() {
  return 'room-' + Math.random().toString(36).substr(2, 9);
}

server.listen(PORT, () => {
  console.log(`🀄 Mahjong Server listening on port ${PORT}`);
  console.log(`📍 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`ℹ️  API Info: http://localhost:${PORT}/`);
  console.log(`🌐 Frontend CORS: ${process.env.FRONTEND_URL || 'All origins (*)'}`);
});
