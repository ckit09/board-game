/**
 * Hong Kong Mahjong Game Engine
 * Standard Hong Kong rules implementation
 */

class MahjongEngine {
  constructor(playerCount = 4, aiPlayers = []) {
    this.playerCount = playerCount;
    this.aiPlayers = new Set(aiPlayers); // Player indices that are AI
    this.players = Array(playerCount).fill(null).map((_, i) => ({
      id: `player-${i}`,
      name: this.aiPlayers.has(i) ? `AI Player ${i + 1}` : `Player ${i + 1}`,
      hand: [],
      melds: [], // Pungs, Kongs, Chows
      discards: [],
      winType: null,
    }));

    this.tiles = this.initializeTiles();
    this.wall = [];
    this.discardPile = [];
    this.currentPlayer = 0;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.dealerPosition = 0;
    this.roundNumber = 0;

    this.initializeGame();
  }

  /**
   * Create a standard 136-tile Mahjong set (Hong Kong style)
   * 4 sets of 34 unique tiles + 8 extra tiles for Kong
   */
  initializeTiles() {
    const tiles = [];

    // Characters (1-9)
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        tiles.push({ suit: 'character', value: i, id: `c${i}-${j}` });
      }
    }

    // Dots/Circles (1-9)
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        tiles.push({ suit: 'dot', value: i, id: `d${i}-${j}` });
      }
    }

    // Bamboo (1-9)
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        tiles.push({ suit: 'bamboo', value: i, id: `b${i}-${j}` });
      }
    }

    // Dragons (Red, Green, White)
    const dragons = ['red', 'green', 'white'];
    dragons.forEach(dragon => {
      for (let j = 0; j < 4; j++) {
        tiles.push({ suit: 'dragon', value: dragon, id: `dr${dragon}-${j}` });
      }
    });

    // Winds (East, South, West, North)
    const winds = ['east', 'south', 'west', 'north'];
    winds.forEach(wind => {
      for (let j = 0; j < 4; j++) {
        tiles.push({ suit: 'wind', value: wind, id: `w${wind}-${j}` });
      }
    });

    return this.shuffleTiles(tiles);
  }

  shuffleTiles(tiles) {
    const shuffled = [...tiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  initializeGame() {
    this.wall = [...this.tiles];
    this.discardPile = [];
    this.currentPlayer = this.dealerPosition;

    // Deal 13 tiles to each player
    this.players.forEach((player, index) => {
      player.hand = [];
      player.melds = [];
      player.discards = [];
      for (let i = 0; i < 13; i++) {
        player.hand.push(this.wall.pop());
      }
    });

    // Dealer gets 1 extra tile
    this.players[this.dealerPosition].hand.push(this.wall.pop());
  }

  /**
   * Draw a tile from the wall
   */
  drawTile() {
    if (this.wall.length === 0) {
      this.gameOver = true;
      this.winner = null; // Draw/no winner
      return null;
    }
    return this.wall.pop();
  }

  /**
   * Discard a tile from current player's hand
   */
  discardTile(tileId) {
    const player = this.players[this.currentPlayer];
    const tileIndex = player.hand.findIndex(t => t.id === tileId);

    if (tileIndex === -1) {
      return { valid: false, error: 'Tile not in hand' };
    }

    const tile = player.hand.splice(tileIndex, 1)[0];
    this.discardPile.push(tile);
    player.discards.push(tile);

    this.moveHistory.push({
      type: 'discard',
      player: this.currentPlayer,
      tile,
      timestamp: Date.now(),
    });

    return { valid: true, tile };
  }

  /**
   * Check if player can win with their current hand
   * Hong Kong Mahjong win conditions (Hu)
   */
  checkWin(playerIndex) {
    const player = this.players[playerIndex];
    const hand = [...player.hand];

    // Must have 14 tiles to win (13 + 1 drawn)
    if (hand.length !== 14) return null;

    // Win patterns: 1 pair + 4 melds (pung/kong/chow)
    return this.checkWinPattern(hand);
  }

  checkWinPattern(hand, isLast = false) {
    if (hand.length === 0) return { valid: true, melds: [] };
    if (hand.length % 3 !== 2) return null;

    // Check for pairs
    const pairCandidates = this.getPairs(hand);

    for (const pair of pairCandidates) {
      const remaining = hand.filter((_, i) => i !== pair[0] && i !== pair[1]);
      if (this.checkMelds(remaining)) {
        return { valid: true, pair, melds: [] };
      }
    }

    return null;
  }

  getPairs(hand) {
    const pairs = [];
    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        if (this.tilesEqual(hand[i], hand[j])) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }

  checkMelds(hand) {
    if (hand.length === 0) return true;
    if (hand.length % 3 !== 0) return false;

    // Try to form a pung (3 identical tiles)
    const pungIndex = this.findPung(hand);
    if (pungIndex !== -1) {
      const remaining = hand.filter((_, i) => i < pungIndex || i >= pungIndex + 3);
      if (this.checkMelds(remaining)) return true;
    }

    // Try to form a chow (3 consecutive tiles)
    const chowIndices = this.findChow(hand);
    if (chowIndices.length === 3) {
      const remaining = hand.filter((_, i) => !chowIndices.includes(i));
      if (this.checkMelds(remaining)) return true;
    }

    return false;
  }

  findPung(hand) {
    for (let i = 0; i < hand.length - 2; i++) {
      if (this.tilesEqual(hand[i], hand[i + 1]) && this.tilesEqual(hand[i], hand[i + 2])) {
        return i;
      }
    }
    return -1;
  }

  findChow(hand) {
    // Simple implementation: look for 3 consecutive suited tiles
    for (let i = 0; i < hand.length - 2; i++) {
      const t1 = hand[i];
      const t2 = hand[i + 1];
      const t3 = hand[i + 2];

      if (t1.suit === t2.suit && t2.suit === t3.suit && 
          !isNaN(t1.value) && !isNaN(t2.value) && !isNaN(t3.value)) {
        const vals = [parseInt(t1.value), parseInt(t2.value), parseInt(t3.value)].sort((a, b) => a - b);
        if (vals[1] === vals[0] + 1 && vals[2] === vals[1] + 1) {
          return [i, i + 1, i + 2];
        }
      }
    }
    return [];
  }

  tilesEqual(tile1, tile2) {
    return tile1.suit === tile2.suit && tile1.value === tile2.value;
  }

  /**
   * Next player's turn
   */
  nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;
  }

  /**
   * Get game state for broadcast
   */
  getGameState() {
    return {
      playerCount: this.playerCount,
      currentPlayer: this.currentPlayer,
      players: this.players.map((p, i) => ({
        id: p.id,
        name: p.name,
        handSize: p.hand.length,
        melds: p.melds,
        discards: p.discards,
        isAI: this.aiPlayers.has(i),
      })),
      wallSize: this.wall.length,
      discardPile: this.discardPile,
      gameOver: this.gameOver,
      winner: this.winner,
      roundNumber: this.roundNumber,
    };
  }

  /**
   * Get private hand for a specific player
   */
  getPlayerHand(playerIndex) {
    return this.players[playerIndex].hand;
  }
}

module.exports = MahjongEngine;
