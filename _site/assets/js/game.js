const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverEl = document.getElementById('game-over');
const startScreenEl = document.getElementById('start-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

// Load obstacle images
let bayerImg = new Image();
bayerImg.src = '/bayer.svg';
let sausageImg = new Image();
sausageImg.src = '/sausage.svg';

let gameRunning = false;
let gameOver = false;
let score = 0;
let lives = 3;
let speed = 5;
let gravity = 0.6;
let jumpPower = -15;
let groundY = canvas.height - 50;
let hitCooldown = 0;

// Player
let player = {
  x: 50,
  y: groundY - 50,
  width: 30,
  height: 50,
  dy: 0,
  jumping: false,
  ducking: false
};

// Obstacles
let obstacles = [];
let collectibles = [];

// Keys
let keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameRunning && !gameOver) startGame();
    else if (gameOver) restartGame();
    else jump();
  }
  if (e.code === 'ArrowDown') {
    e.preventDefault();
    duck();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (e.code === 'ArrowDown') {
    player.ducking = false;
    player.height = 50;
    player.y = groundY - player.height;
  }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
  gameRunning = true;
  gameOver = false;
  score = 0;
  lives = 3;
  speed = 5;
  player.y = groundY - 50;
  player.dy = 0;
  player.jumping = false;
  obstacles = [];
  collectibles = [];
  hitCooldown = 0;
  startScreenEl.style.display = 'none';
  gameOverEl.style.display = 'none';
  update();
}

function restartGame() {
  startGame();
}

function jump() {
  if (!player.jumping && !player.ducking) {
    player.dy = jumpPower;
    player.jumping = true;
  }
}

function duck() {
  if (!player.jumping) {
    player.ducking = true;
    player.height = 25;
    player.y = groundY - player.height;
  }
}

function update() {
  if (!gameRunning) return;

  // Decrement hit cooldown
  if (hitCooldown > 0) hitCooldown--;

  // Player physics
  player.dy += gravity;
  player.y += player.dy;

  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  // Move obstacles and collectibles
  obstacles.forEach((obs, i) => {
    obs.x -= speed;
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
    }
  });

  collectibles.forEach((col, i) => {
    col.x -= speed;
    if (col.x + col.width < 0) {
      collectibles.splice(i, 1);
    }
  });

  // Spawn obstacles and collectibles
  if (Math.random() < 0.01) {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 150) {
      let type = Math.random() < 0.6 ? 'bayer' : 'flying';
      let y = type === 'bayer' ? groundY - 60 : groundY - 120;
      let width = type === 'bayer' ? 30 : 60; // bayer is thinner
      let height = type === 'bayer' ? 60 : 30; // sausage is flatter
      obstacles.push({
        x: canvas.width,
        y: y,
        width: width,
        height: height,
        type: type
      });
    }
  }

  if (Math.random() < 0.0005) {
    collectibles.push({
      x: canvas.width,
      y: groundY - 30,
      width: 20,
      height: 20,
      type: 'hop'
    });
  }

  // Collision detection
  obstacles.forEach((obs) => {
    if (hitCooldown === 0 && player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y) {
      lives--;
      hitCooldown = 30; // 30 frames invincibility
      livesEl.classList.add('flash');
      setTimeout(() => livesEl.classList.remove('flash'), 500);
      if (lives <= 0) {
        endGame();
      }
    }
  });

  collectibles.forEach((col, i) => {
    if (player.x < col.x + col.width &&
        player.x + player.width > col.x &&
        player.y < col.y + col.height &&
        player.y + player.height > col.y) {
      lives++;
      livesEl.classList.add('gain');
      setTimeout(() => livesEl.classList.remove('gain'), 500);
      collectibles.splice(i, 1);
    }
  });

  // Update score
  score += 1;
  speed += 0.001; // Gradually increase speed

  // Update UI
  scoreEl.textContent = `Punkte: ${Math.floor(score / 100)}`;
  livesEl.textContent = `Leben: ${lives}`;

  // Draw
  draw();

  if (!gameOver) {
    requestAnimationFrame(update);
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set font for emojis
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  // Draw ground
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, groundY, canvas.width, 50);

  // Draw player (beer mug emoji)
  ctx.fillText('🍺', player.x + player.width/2, player.y + player.height);

  // Draw obstacles
  obstacles.forEach((obs) => {
    if (obs.type === 'bayer') {
      ctx.drawImage(bayerImg, obs.x, obs.y, obs.width, obs.height);
    } else if (obs.type === 'flying') {
      ctx.drawImage(sausageImg, obs.x, obs.y, obs.width, obs.height);
    }
  });

  // Draw collectibles
  collectibles.forEach((col) => {
    ctx.fillText('🥨', col.x + col.width/2, col.y + col.height);
  });
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  gameOverEl.style.display = 'block';
}