// Tetris MVP - Game logic and rendering

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 30;
const FALL_INTERVAL = 800;

const COLORS = [
  null,
  '#00f5ff', // I - cyan
  '#ffd700', // O - yellow
  '#9d4edd', // T - purple
  '#2dc653', // S - green
  '#e63946', // Z - red
  '#4361ee', // J - blue
  '#f77f00', // L - orange
];

const SHAPES = [
  null,
  [[1, 1, 1, 1]],                           // I
  [[2, 2], [2, 2]],                          // O
  [[0, 3, 0], [3, 3, 3]],                    // T
  [[0, 4, 4], [4, 4, 0]],                    // S
  [[5, 5, 0], [0, 5, 5]],                    // Z
  [[6, 0, 0], [6, 6, 6]],                    // J
  [[0, 0, 7], [7, 7, 7]],                    // L
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = null;
let score = 0;
let highScore = parseInt(localStorage.getItem('tetrisHighScore') || '0');
let gameOver = false;
let gameStarted = false;
let fallIntervalId = null;

function init() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  gameOver = false;
  gameStarted = true;
  scoreEl.textContent = '0';
  highScore = Math.max(highScore, parseInt(localStorage.getItem('tetrisHighScore') || '0'));
  highScoreEl.textContent = highScore;
  overlay.classList.add('hidden');
  if (fallIntervalId) clearInterval(fallIntervalId);
  spawnPiece();
  fallIntervalId = setInterval(tick, FALL_INTERVAL);
}

function spawnPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  const shape = SHAPES[type].map(row => [...row]);
  currentPiece = {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
    color: type,
  };
  if (collision(currentPiece, currentPiece.x, currentPiece.y)) {
    gameOver = true;
    clearInterval(fallIntervalId);
    fallIntervalId = null;
    overlayText.textContent = 'Game Over - Press R to Restart';
    overlay.classList.remove('hidden');
    localStorage.setItem('tetrisHighScore', String(highScore));
  }
}

function collision(piece, x, y) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const ny = y + row;
        const nx = x + col;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
  }
  return false;
}

function movePiece(dx, dy) {
  if (gameOver || !currentPiece) return;
  if (!collision(currentPiece, currentPiece.x + dx, currentPiece.y + dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (dy > 0) score += 1;
    scoreEl.textContent = score;
    highScore = Math.max(highScore, score);
    highScoreEl.textContent = highScore;
    return true;
  }
  return false;
}

function rotatePiece() {
  if (gameOver || !currentPiece) return;
  const rows = currentPiece.shape.length;
  const cols = currentPiece.shape[0].length;
  const rotated = Array.from({ length: cols }, (_, i) =>
    Array.from({ length: rows }, (_, j) => currentPiece.shape[rows - 1 - j][i])
  );
  const prev = currentPiece.shape;
  currentPiece.shape = rotated;
  if (collision(currentPiece, currentPiece.x, currentPiece.y)) {
    currentPiece.shape = prev;
  }
}

function lockPiece() {
  if (!currentPiece) return;
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const ny = currentPiece.y + row;
        const nx = currentPiece.x + col;
        if (ny >= 0) board[ny][nx] = currentPiece.color;
      }
    }
  }
  clearLines();
  currentPiece = null;
  spawnPiece();
}

function clearLines() {
  let linesCleared = 0;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      row++;
    }
  }
  const points = [0, 100, 300, 500, 800];
  score += points[linesCleared] || 0;
  scoreEl.textContent = score;
  highScore = Math.max(highScore, score);
  highScoreEl.textContent = highScore;
}

function tick() {
  if (gameOver) return;
  if (!movePiece(0, 1)) {
    lockPiece();
  }
}

function draw() {
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellPx = CELL_SIZE;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * cellPx;
      const y = row * cellPx;
      if (board[row][col]) {
        ctx.fillStyle = COLORS[board[row][col]];
        ctx.fillRect(x + 1, y + 1, cellPx - 2, cellPx - 2);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.strokeRect(x, y, cellPx, cellPx);
    }
  }

  if (currentPiece) {
    ctx.fillStyle = COLORS[currentPiece.color];
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const x = (currentPiece.x + col) * cellPx;
          const y = (currentPiece.y + row) * cellPx;
          ctx.fillRect(x + 1, y + 1, cellPx - 2, cellPx - 2);
        }
      }
    }
  }

  requestAnimationFrame(draw);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!gameStarted || gameOver) init();
    return;
  }
  if (e.key === 'r' || e.key === 'R') {
    if (gameOver) init();
    return;
  }
  if (gameOver || !gameStarted) return;

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
      e.preventDefault();
      movePiece(1, 0);
      break;
    case 'ArrowDown':
      e.preventDefault();
      movePiece(0, 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      rotatePiece();
      break;
  }
});

highScoreEl.textContent = localStorage.getItem('tetrisHighScore') || '0';
draw();
