class Gomoku {
    constructor(size = 15) {
        this.size = size;
        this.board = Array(size).fill(null).map(() => Array(size).fill(null));
        this.moves = [];
        this.currentPlayer = 'black'; // black goes first
        this.gameMode = 'ai';
        this.gameOver = false;
        this.winner = null;
    }

    makeMove(row, col) {
        if (this.board[row][col] !== null || this.gameOver) return false;
        
        this.board[row][col] = this.currentPlayer;
        this.moves.push({ row, col, player: this.currentPlayer });

        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            return true;
        }

        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        return true;
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (const [dr, dc] of directions) {
            let count = 1;
            
            // Check positive direction
            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r < 0 || r >= this.size || c < 0 || c >= this.size) break;
                if (this.board[r][c] !== player) break;
                count++;
            }
            
            // Check negative direction
            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r < 0 || r >= this.size || c < 0 || c >= this.size) break;
                if (this.board[r][c] !== player) break;
                count++;
            }

            if (count >= 5) return true;
        }
        return false;
    }

    getAIMove() {
        const moves = this.getAllAvailableMoves();
        if (moves.length === 0) return null;

        // Try to win
        for (const [r, c] of moves) {
            this.board[r][c] = 'white';
            if (this.checkWin(r, c)) {
                this.board[r][c] = null;
                return [r, c];
            }
            this.board[r][c] = null;
        }

        // Block opponent from winning
        for (const [r, c] of moves) {
            this.board[r][c] = 'black';
            if (this.checkWin(r, c)) {
                this.board[r][c] = null;
                return [r, c];
            }
            this.board[r][c] = null;
        }

        // Score moves by proximity to existing pieces
        const scored = moves.map(([r, c]) => ({
            pos: [r, c],
            score: this.scorePosition(r, c)
        }));

        scored.sort((a, b) => b.score - a.score);
        return scored[0].pos;
    }

    scorePosition(row, col) {
        let score = 0;
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        const range = 3;

        for (const [dr, dc] of directions) {
            for (let dist = -range; dist <= range; dist++) {
                const r = row + dr * dist;
                const c = col + dc * dist;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
                    const piece = this.board[r][c];
                    if (piece === 'white') score += 2;
                    if (piece === 'black') score += 1;
                }
            }
        }
        return score;
    }

    getAllAvailableMoves() {
        const moves = [];
        const range = this.moves.length === 0 ? [[7, 7]] : this.getSearchArea();
        
        for (const [r, c] of range) {
            if (this.board[r][c] === null) {
                moves.push([r, c]);
            }
        }
        return moves;
    }

    getSearchArea() {
        const moves = [];
        const minR = Math.max(0, Math.min(...this.moves.map(m => m.row)) - 2);
        const maxR = Math.min(this.size - 1, Math.max(...this.moves.map(m => m.row)) + 2);
        const minC = Math.max(0, Math.min(...this.moves.map(m => m.col)) - 2);
        const maxC = Math.min(this.size - 1, Math.max(...this.moves.map(m => m.col)) + 2);

        for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
                if (this.board[r][c] === null) {
                    moves.push([r, c]);
                }
            }
        }
        return moves;
    }

    undo() {
        if (this.moves.length === 0) return false;
        const move = this.moves.pop();
        this.board[move.row][move.col] = null;
        this.currentPlayer = move.player;
        this.gameOver = false;
        this.winner = null;
        return true;
    }

    reset() {
        this.__proto__.constructor.call(this, this.size);
    }
}

// UI Controller
const gameMode = document.getElementById('gameMode');
const newGameBtn = document.getElementById('newGameBtn');
const gameBoard = document.getElementById('gameBoard');
const currentTurnEl = document.getElementById('currentTurn');
const statusEl = document.getElementById('status');
const moveCountEl = document.getElementById('moveCount');
const undoBtn = document.getElementById('undoBtn');

let game = new Gomoku();
game.gameMode = 'ai';

function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${game.size}, 1fr)`;
    
    for (let r = 0; r < game.size; r++) {
        for (let c = 0; c < game.size; c++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `square-${r}-${c}`;
            
            if (game.board[r][c] !== null) {
                square.classList.add('placed');
                const stone = document.createElement('div');
                stone.className = 'stone ' + game.board[r][c];
                square.appendChild(stone);
            }

            square.addEventListener('click', () => handleSquareClick(r, c));
            gameBoard.appendChild(square);
        }
    }
    updateInfo();
}

function handleSquareClick(row, col) {
    if (game.gameOver) return;
    if (game.board[row][col] !== null) return;

    if (game.gameMode === 'pvp' || game.currentPlayer === 'black') {
        game.makeMove(row, col);
        renderBoard();

        if (game.gameOver) {
            statusEl.textContent = game.winner.charAt(0).toUpperCase() + game.winner.slice(1) + ' wins! 🎉';
            return;
        }

        if (game.gameMode === 'ai' && game.currentPlayer === 'white') {
            setTimeout(() => {
                const aiMove = game.getAIMove();
                if (aiMove) {
                    game.makeMove(aiMove[0], aiMove[1]);
                    renderBoard();

                    if (game.gameOver) {
                        statusEl.textContent = 'AI (' + game.winner + ') wins!';
                    }
                }
            }, 500);
        }
    }
}

function updateInfo() {
    currentTurnEl.textContent = game.currentPlayer.charAt(0).toUpperCase() + game.currentPlayer.slice(1) + "'s Turn";
    moveCountEl.textContent = 'Moves: ' + game.moves.length;
}

newGameBtn.addEventListener('click', () => {
    game = new Gomoku();
    game.gameMode = gameMode.value;
    statusEl.textContent = 'Game Started';
    renderBoard();
});

gameMode.addEventListener('change', () => {
    game.gameMode = gameMode.value;
});

undoBtn.addEventListener('click', () => {
    if (game.moves.length > 0) {
        game.undo();
        if (game.gameMode === 'ai') {
            game.undo();
        }
        statusEl.textContent = 'Move undone';
        renderBoard();
    }
});

renderBoard();
