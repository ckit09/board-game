/**
 * Mahjong Game Client
 * Handles WebSocket communication and UI rendering
 */

class MahjongClient {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.playerIndex = null;
    this.serverUrl = 'http://localhost:3000';
    this.currentHand = [];
    this.playerMode = 4;
    this.gameState = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Setup screen
    document.getElementById('createRoomBtn').addEventListener('click', () => this.createRoom());
    document.getElementById('joinRoomBtn').addEventListener('click', () => this.joinRoom());
    document.getElementById('serverUrl').addEventListener('change', (e) => {
      this.serverUrl = e.target.value || 'http://localhost:3000';
    });
    document.getElementById('playerMode').addEventListener('change', (e) => {
      this.playerMode = parseInt(e.target.value);
    });

    // Waiting screen
    document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
    document.getElementById('leaveRoomBtn').addEventListener('click', () => this.leaveRoom());

    // Game screen
    document.getElementById('drawBtn').addEventListener('click', () => this.drawTile());
    document.getElementById('winBtn').addEventListener('click', () => this.declareWin());
    document.getElementById('leaveGameBtn').addEventListener('click', () => this.leaveGame());

    // Game over screen
    document.getElementById('playAgainBtn').addEventListener('click', () => this.resetToSetup());
    document.getElementById('exitGameBtn').addEventListener('click', () => this.resetToSetup());
  }

  /**
   * Connect to WebSocket server
   */
  connectToServer(callback) {
    if (this.socket) {
      callback(true);
      return;
    }

    try {
      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected');
        callback(true);
      });

      this.socket.on('disconnect', () => {
        console.log('[Socket] Disconnected');
        this.showStatus('Connection lost', 'error');
      });

      this.socket.on('playerJoined', (data) => {
        this.updateWaitingScreen(data);
      });

      this.socket.on('gameStarted', (data) => {
        this.gameState = data.gameState;
        this.transitionToGame();
      });

      this.socket.on('receiveHand', (data) => {
        this.currentHand = data.hand;
        this.playerIndex = data.playerIndex;
        this.renderPlayerHand();
      });

      this.socket.on('tileDiscarded', (data) => {
        this.gameState = data.gameState;
        this.renderGameBoard(data);
      });

      this.socket.on('playerTurn', (data) => {
        this.onPlayerTurn(data);
      });

      this.socket.on('gamEnded', (data) => {
        this.onGameEnded(data);
      });

      this.socket.on('playerLeft', (data) => {
        this.showStatus(`Player ${data.playerIndex + 1} left`, 'warning');
      });

      this.socket.on('error', (error) => {
        console.error('[Socket Error]', error);
        this.showStatus('Connection error: ' + error, 'error');
      });
    } catch (error) {
      console.error('[Connection Error]', error);
      callback(false);
    }
  }

  /**
   * Create a new game room
   */
  createRoom() {
    const btn = document.getElementById('createRoomBtn');
    btn.disabled = true;
    btn.textContent = 'Connecting...';

    this.connectToServer((connected) => {
      if (!connected) {
        this.showStatus('Failed to connect to server', 'error');
        btn.disabled = false;
        btn.textContent = 'Create Room';
        return;
      }

      const aiPlayers = [];
      for (let i = this.playerMode; i < 4; i++) {
        aiPlayers.push(i);
      }

      this.socket.emit('createRoom', { playerMode: this.playerMode, aiPlayers }, (response) => {
        if (response.success) {
          this.roomId = response.roomId;
          this.playerIndex = response.playerIndex;
          this.gameState = response.gameState;
          document.getElementById('displayRoomId').textContent = this.roomId;
          this.transitionToWaiting();
        } else {
          this.showStatus('Failed to create room: ' + response.error, 'error');
          btn.disabled = false;
          btn.textContent = 'Create Room';
        }
      });
    });
  }

  /**
   * Join an existing game room
   */
  joinRoom() {
    const roomId = document.getElementById('roomId').value.trim();
    if (!roomId) {
      this.showStatus('Please enter a room ID', 'error');
      return;
    }

    const btn = document.getElementById('joinRoomBtn');
    btn.disabled = true;
    btn.textContent = 'Joining...';

    this.connectToServer((connected) => {
      if (!connected) {
        this.showStatus('Failed to connect to server', 'error');
        btn.disabled = false;
        btn.textContent = 'Join Room';
        return;
      }

      this.socket.emit('joinRoom', { roomId }, (response) => {
        if (response.success) {
          this.roomId = response.roomId;
          this.playerIndex = response.playerIndex;
          this.gameState = response.gameState;
          document.getElementById('displayRoomId').textContent = this.roomId;
          this.transitionToWaiting();
        } else {
          this.showStatus('Failed to join room: ' + response.error, 'error');
          btn.disabled = false;
          btn.textContent = 'Join Room';
        }
      });
    });
  }

  /**
   * Start the game
   */
  startGame() {
    this.socket.emit('startGame', {}, (response) => {
      if (!response.success) {
        this.showStatus('Failed to start game: ' + response.error, 'error');
      }
    });
  }

  /**
   * Draw a tile
   */
  drawTile() {
    document.getElementById('drawBtn').disabled = true;
    this.socket.emit('drawTile', {}, (response) => {
      if (!response.success) {
        this.showStatus('Cannot draw: ' + response.error, 'error');
        document.getElementById('drawBtn').disabled = false;
      }
    });
  }

  /**
   * Select tile to discard
   */
  selectTileToDiscard(tileId) {
    this.socket.emit('discardTile', { tileId }, (response) => {
      if (!response.success) {
        this.showStatus('Cannot discard: ' + response.error, 'error');
      }
    });
  }

  /**
   * Declare win
   */
  declareWin() {
    this.socket.emit('declareWin', {}, (response) => {
      if (response.success) {
        this.showStatus(response.message, 'success');
      } else {
        this.showStatus('Cannot win: ' + response.error, 'error');
      }
    });
  }

  /**
   * Leave room
   */
  leaveRoom() {
    this.socket.disconnect();
    this.resetToSetup();
  }

  /**
   * Leave game
   */
  leaveGame() {
    this.socket.disconnect();
    this.resetToSetup();
  }

  /**
   * Screen transitions
   */
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
  }

  transitionToWaiting() {
    this.showScreen('waitingScreen');
    this.updateWaitingScreen({ playerCount: 1 });
    document.getElementById('startGameBtn').disabled = true;
  }

  transitionToGame() {
    this.showScreen('gameScreen');
    this.renderGameBoard();
  }

  resetToSetup() {
    this.showScreen('setupScreen');
    document.getElementById('setupStatus').textContent = '';
  }

  /**
   * Update waiting screen
   */
  updateWaitingScreen(data) {
    const playerCount = data.playerCount || 1;
    const total = this.gameState?.playerCount || 4;
    document.getElementById('playerCount').textContent = `Players: ${playerCount}/${total}`;

    if (playerCount === total) {
      document.getElementById('startGameBtn').disabled = false;
    }
  }

  /**
   * Render game board
   */
  renderGameBoard(data = {}) {
    if (!this.gameState) return;

    // Update wall count
    document.getElementById('wallCount').textContent = this.gameState.wallSize;

    // Update current turn
    const currentPlayer = this.gameState.currentPlayer;
    const playerName = this.gameState.players[currentPlayer]?.name || `Player ${currentPlayer + 1}`;
    document.getElementById('currentTurnInfo').textContent = `Current Turn: ${playerName}`;

    // Update discard pile
    const discardPile = document.getElementById('discardPile');
    if (data.tile) {
      const tileEl = this.createTileElement(data.tile);
      discardPile.appendChild(tileEl);
    }

    // Update player information
    this.gameState.players.forEach((player, index) => {
      const playerEl = document.getElementById(`player-${index}`);
      if (playerEl) {
        playerEl.querySelector('.player-name').textContent = player.name;
        const statusClass = index === currentPlayer ? 'current-turn' : '';
        playerEl.classList.toggle('current-turn', index === currentPlayer);
      }
    });

    // Enable/disable buttons based on turn
    const isMyTurn = currentPlayer === this.playerIndex;
    document.getElementById('drawBtn').disabled = !isMyTurn;
    document.getElementById('winBtn').disabled = !isMyTurn;
  }

  /**
   * Render player hand
   */
  renderPlayerHand() {
    const handContainer = document.getElementById('playerHand');
    handContainer.innerHTML = '';

    this.currentHand.forEach(tile => {
      const tileEl = this.createTileElement(tile);
      tileEl.classList.add('clickable');
      tileEl.addEventListener('click', () => this.selectTileToDiscard(tile.id));
      handContainer.appendChild(tileEl);
    });
  }

  /**
   * Create tile HTML element
   */
  createTileElement(tile) {
    const el = document.createElement('div');
    el.className = `tile tile-${tile.suit}`;
    el.dataset.tileId = tile.id;

    // Render tile display
    let display = '';
    if (typeof tile.value === 'number') {
      display = tile.value.toString();
    } else {
      display = tile.value.charAt(0).toUpperCase();
    }

    el.textContent = display;
    el.setAttribute('title', `${tile.suit} ${tile.value}`);

    return el;
  }

  /**
   * Handle player turn
   */
  onPlayerTurn(data) {
    if (data.action === 'draw') {
      if (data.currentPlayer === this.playerIndex) {
        document.getElementById('drawBtn').disabled = false;
      }
    }
  }

  /**
   * Handle game end
   */
  onGameEnded(data) {
    this.showScreen('gameOverScreen');
    const title = document.getElementById('gameOverTitle');
    const info = document.getElementById('gameOverInfo');

    if (data.winner !== undefined) {
      const winner = data.gameState.players[data.winner];
      title.textContent = data.winner === this.playerIndex ? '🎉 You Won!' : '❌ Game Over';
      info.innerHTML = `<p>${winner.name} won the game!</p>`;
    } else {
      title.textContent = 'Game Draw';
      info.innerHTML = '<p>The wall is empty. No winner this round.</p>';
    }
  }

  /**
   * Show status message
   */
  showStatus(message, type = 'info') {
    const statusEl = document.getElementById('setupStatus');
    statusEl.textContent = message;
    statusEl.className = `status-message status-${type}`;
  }
}

// Initialize client
const client = new MahjongClient();
client.showScreen('setupScreen');
