const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const aiBtn = document.getElementById('aiBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let vsAI = true; // default vs AI

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Create board UI
function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.textContent = board[i];
        if (board[i] !== '') cell.classList.add('taken');
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (!gameActive) return;
    if (board[index] !== '') return;
    if (vsAI && currentPlayer === 'O') return; // AI's turn

    makeMove(index, currentPlayer);

    if (gameActive && vsAI && currentPlayer === 'O' && !checkWinner(board, 'X') && !isBoardFull()) {
        // AI's turn (O)
        setTimeout(() => aiMove(), 100);
    }
}

function makeMove(index, player) {
    board[index] = player;
    updateBoardUI();
    
    if (checkWinner(board, player)) {
        statusElement.textContent = `${player} wins! 🎉`;
        gameActive = false;
        return;
    }
    
    if (isBoardFull()) {
        statusElement.textContent = "It's a draw! 🤝";
        gameActive = false;
        return;
    }
    
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    statusElement.textContent = vsAI ? `${currentPlayer}'s turn` : `${currentPlayer}'s turn`;
    updateBoardUI();
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, idx) => {
        cell.textContent = board[idx];
        if (board[idx] !== '') cell.classList.add('taken');
        else cell.classList.remove('taken');
    });
}

function checkWinner(board, player) {
    return winPatterns.some(pattern => pattern.every(idx => board[idx] === player));
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

// Minimax AI
function aiMove() {
    if (!gameActive) return;
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    if (bestMove !== -1) {
        makeMove(bestMove, 'O');
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, 'O')) return 10 - depth;
    if (checkWinner(board, 'X')) return depth - 10;
    if (isBoardFull()) return 0;
    
    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                best = Math.max(score, best);
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                best = Math.min(score, best);
            }
        }
        return best;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = vsAI ? "X's turn" : "X's turn";
    createBoard();
}

function setMode(isAI) {
    vsAI = isAI;
    resetGame();
    if (vsAI) {
        aiBtn.classList.add('active');
        twoPlayerBtn.classList.remove('active');
    } else {
        twoPlayerBtn.classList.add('active');
        aiBtn.classList.remove('active');
    }
}

// Event listeners
resetBtn.addEventListener('click', resetGame);
twoPlayerBtn.addEventListener('click', () => setMode(false));
aiBtn.addEventListener('click', () => setMode(true));

// Initialize
setMode(true);
