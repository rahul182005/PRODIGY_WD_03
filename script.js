const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let cells, currentPlayer, gameActive;
let playerX = 'Player X', playerO = 'AI';
let scoreX = 0, scoreO = 0, draws = 0;
let aiEnabled = true;
let aiLevel = 'medium';

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const drawEl = document.getElementById('draws');

const winCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function startGame() {
  playerX = document.getElementById('playerX').value || 'Player X';
  playerO = document.getElementById('playerO').value || 'AI';
  aiLevel = document.getElementById('aiLevel').value;
  aiEnabled = true;

  currentPlayer = 'X';
  createBoard();
  updateStatus();
}

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', onCellClick);
    board.appendChild(cell);
  }
  cells = document.querySelectorAll('.cell');
  gameActive = true;
}

function onCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (cell.textContent || !gameActive || (currentPlayer === 'O' && aiEnabled)) return;

  cell.textContent = currentPlayer;
  processMove();
}

function processMove() {
  if (checkWinner()) {
    status.textContent = `${currentPlayer === 'X' ? playerX : playerO} Wins!`;
    updateScore(currentPlayer);
    gameActive = false;
    return;
  }

  if (isDraw()) {
    status.textContent = "It's a Draw!";
    draws++;
    drawEl.textContent = `Draws: ${draws}`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (currentPlayer === 'O' && aiEnabled) {
    setTimeout(aiMove, 500);
  }
}

function updateStatus() {
  status.textContent = `${currentPlayer === 'X' ? playerX : playerO}'s Turn`;
}

function checkWinner() {
  for (const combo of winCombinations) {
    const [a, b, c] = combo;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      cells[a].classList.add('winning-cell');
      cells[b].classList.add('winning-cell');
      cells[c].classList.add('winning-cell');
      return true;
    }
  }
  return false;
}

function isDraw() {
  return [...cells].every(cell => cell.textContent);
}

function updateScore(winner) {
  if (winner === 'X') {
    scoreX++;
    scoreXEl.textContent = `X: ${scoreX}`;
  } else {
    scoreO++;
    scoreOEl.textContent = `O: ${scoreO}`;
  }
}

function aiMove() {
  let emptyIndices = [];
  cells.forEach((cell, idx) => {
    if (cell.textContent === '') emptyIndices.push(idx);
  });

  let move;

  if (aiLevel === 'medium') {
    move = findBestMove(emptyIndices);
  } else {
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  if (move != null) {
    cells[move].textContent = 'O';
    processMove();
  }
}

function findBestMove(emptyIndices) {
  for (let idx of emptyIndices) {
    cells[idx].textContent = 'O';
    if (checkWinner()) {
      cells[idx].textContent = '';
      return idx;
    }
    cells[idx].textContent = '';
  }

  for (let idx of emptyIndices) {
    cells[idx].textContent = 'X';
    if (checkWinner()) {
      cells[idx].textContent = '';
      return idx;
    }
    cells[idx].textContent = '';
  }

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

restartBtn.addEventListener('click', () => {
  createBoard();
  updateStatus();
});

startGame();
