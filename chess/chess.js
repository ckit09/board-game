class Chess {
    constructor() {
        this.board = this.initBoard();
        this.moves = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.currentPlayer = 'white';
        this.gameMode = 'ai';
        this.gameOver = false;
    }

    initBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Place black pieces
        const blackBackRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
        blackBackRank.forEach((piece, i) => board[0][i] = piece);
        for (let i = 0; i < 8; i++) board[1][i] = 'p';

        // Place white pieces
        for (let i = 0; i < 8; i++) board[6][i] = 'P';
        const whiteBackRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
        whiteBackRank.forEach((piece, i) => board[7][i] = piece);

        return board;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const isWhite = piece === piece.toUpperCase();
        const moves = [];
        const type = piece.toUpperCase();

        if (type === 'P') {
            const direction = isWhite ? -1 : 1;
            const startRow = isWhite ? 6 : 1;
            
            // Move forward
            const nextRow = row + direction;
            if (nextRow >= 0 && nextRow < 8 && !this.board[nextRow][col]) {
                moves.push([nextRow, col]);
                
                // Double move from start
                if (row === startRow && !this.board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            
            // Captures
            for (let dc of [-1, 1]) {
                const newCol = col + dc;
                if (nextRow >= 0 && nextRow < 8 && newCol >= 0 && newCol < 8) {
                    const target = this.board[nextRow][newCol];
                    if (target && this.isOpponent(target, isWhite)) {
                        moves.push([nextRow, newCol]);
                    }
                }
            }
        } else if (type === 'N') {
            const positions = [
                [-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]
            ];
            this.addLegalMoves(row, col, positions, isWhite, moves, 1);
        } else if (type === 'B') {
            this.addLegalMoves(row, col, [[-1,-1],[-1,1],[1,-1],[1,1]], isWhite, moves);
        } else if (type === 'R') {
            this.addLegalMoves(row, col, [[-1,0],[1,0],[0,-1],[0,1]], isWhite, moves);
        } else if (type === 'Q') {
            this.addLegalMoves(row, col, [
                [-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]
            ], isWhite, moves);
        } else if (type === 'K') {
            this.addLegalMoves(row, col, [
                [-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]
            ], isWhite, moves, 1);
        }

        return moves;
    }

    addLegalMoves(row, col, directions, isWhite, moves, limit = 8) {
        for (const [dr, dc] of directions) {
            for (let i = 1; i <= limit; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else if (this.isOpponent(target, isWhite)) {
                    moves.push([newRow, newCol]);
                    break;
                } else {
                    break;
                }
            }
        }
    }

    isOpponent(piece, isWhite) {
        const isWhitePiece = piece === piece.toUpperCase();
        return isWhite !== isWhitePiece;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        this.moves.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            captured: this.board[toRow][toCol]
        });

        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.selectedSquare = null;
        this.validMoves = [];
    }

    undo() {
        if (this.moves.length === 0) return false;
        const move = this.moves.pop();
        this.board[move.from[0]][move.from[1]] = this.board[move.to[0]][move.to[1]];
        this.board[move.to[0]][move.to[1]] = move.captured;
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        return true;
    }

    getAIMove() {
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && this.isAIPieceTurn(piece)) {
                    const validMoves = this.getValidMoves(r, c);
                    validMoves.forEach(([tr, tc]) => {
                        moves.push([r, c, tr, tc]);
                    });
                }
            }
        }
        return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : null;
    }

    isAIPieceTurn(piece) {
        const isWhite = piece === piece.toUpperCase();
        return this.currentPlayer === 'white' ? isWhite : !isWhite;
    }

    hasValidMoves() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && this.isAIPieceTurn(piece)) {
                    if (this.getValidMoves(r, c).length > 0) return true;
                }
            }
        }
        return false;
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

let game = new Chess();
game.gameMode = 'ai';

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
            
            if (game.selectedSquare && game.selectedSquare[0] === r && game.selectedSquare[1] === c) {
                square.classList.add('selected');
            }

            const isValidMove = game.validMoves.some(m => m[0] === r && m[1] === c);
            if (isValidMove) {
                square.classList.add('valid-move');
            }

            const piece = game.board[r][c];
            if (piece) {
                const pieceEl = document.createElement('div');
                pieceEl.className = 'piece';
                pieceEl.textContent = getPieceSymbol(piece);
                pieceEl.classList.add(piece === piece.toUpperCase() ? 'white' : 'black');
                square.appendChild(pieceEl);
            }

            square.addEventListener('click', () => handleSquareClick(r, c));
            gameBoard.appendChild(square);
        }
    }
    updateInfo();
}

function getPieceSymbol(piece) {
    const symbols = {
        'k': '♚', 'K': '♔',
        'q': '♛', 'Q': '♕',
        'r': '♜', 'R': '♖',
        'b': '♝', 'B': '♗',
        'n': '♞', 'N': '♘',
        'p': '♟', 'P': '♙'
    };
    return symbols[piece] || piece;
}

function handleSquareClick(row, col) {
    if (game.gameOver) return;

    if (game.selectedSquare === null) {
        const piece = game.board[row][col];
        const isWhitePiece = piece === piece?.toUpperCase();
        const playerIsWhite = game.currentPlayer === 'white';

        if (piece && isWhitePiece === playerIsWhite) {
            game.selectedSquare = [row, col];
            game.validMoves = game.getValidMoves(row, col);
            renderBoard();
        }
    } else {
        const validMove = game.validMoves.some(m => m[0] === row && m[1] === col);
        if (validMove) {
            game.movePiece(game.selectedSquare[0], game.selectedSquare[1], row, col);
            renderBoard();
            
            if (game.gameMode === 'ai' && !game.gameOver) {
                setTimeout(() => {
                    if (game.hasValidMoves()) {
                        const aiMove = game.getAIMove();
                        if (aiMove) {
                            game.movePiece(aiMove[0], aiMove[1], aiMove[2], aiMove[3]);
                            renderBoard();
                        }
                    } else {
                        statusEl.textContent = 'Checkmate! ' + (game.currentPlayer === 'white' ? 'Black' : 'White') + ' wins!';
                        game.gameOver = true;
                    }
                }, 500);
            }
        } else {
            game.selectedSquare = null;
            game.validMoves = [];
            renderBoard();
        }
    }
}

function updateInfo() {
    currentTurnEl.textContent = game.currentPlayer.charAt(0).toUpperCase() + game.currentPlayer.slice(1) + "'s Turn";
    moveCountEl.textContent = 'Moves: ' + game.moves.length;
}

newGameBtn.addEventListener('click', () => {
    game = new Chess();
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
        game.gameOver = false;
        statusEl.textContent = 'Move undone';
        renderBoard();
    }
});

renderBoard();
