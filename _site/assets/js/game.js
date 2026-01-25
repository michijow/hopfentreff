const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverEl = document.getElementById('game-over');
const startScreenEl = document.getElementById('start-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

let gameRunning = false;
let gameOver = false;
let score = 0;
let lives = 3;
let speed = 5;
let gravity = 0.6;
let jumpPower = -15;
let groundY = canvas.height - 50;

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
    let type = Math.random() < 0.5 ? 'bottle' : 'keg';
    let height = type === 'bottle' ? 40 : 60;
    obstacles.push({
      x: canvas.width,
      y: groundY - height,
      width: 20,
      height: height,
      type: type
    });
  }

  if (Math.random() < 0.005) {
    let type = Math.random() < 0.5 ? 'hop' : 'beer';
    collectibles.push({
      x: canvas.width,
      y: groundY - 30,
      width: 20,
      height: 20,
      type: type
    });
  }

  // Collision detection
  obstacles.forEach((obs) => {
    if (player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y) {
      lives--;
      if (lives <= 0) {
        endGame();
      } else {
        // Reset player position or something
        player.y = groundY - 50;
        player.dy = 0;
        player.jumping = false;
      }
    }
  });

  collectibles.forEach((col, i) => {
    if (player.x < col.x + col.width &&
        player.x + player.width > col.x &&
        player.y < col.y + col.height &&
        player.y + player.height > col.y) {
      if (col.type === 'hop') {
        lives++;
      } else if (col.type === 'beer') {
        score += 100;
      }
      collectibles.splice(i, 1);
    }
  });

  // Update score
  score += 1;
  speed += 0.001; // Gradually increase speed

  // Update UI
  scoreEl.textContent = `Score: ${score}`;
  livesEl.textContent = `Lives: ${lives}`;

  // Draw
  draw();

  if (!gameOver) {
    requestAnimationFrame(update);
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, groundY, canvas.width, 50);

  // Draw player (beer mug)
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Handle
  ctx.fillRect(player.x + player.width, player.y + 5, 5, 20);

  // Draw obstacles
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.type === 'bottle' ? '#8B4513' : '#654321';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Draw collectibles
  collectibles.forEach((col) => {
    if (col.type === 'hop') {
      ctx.fillStyle = '#32CD32';
      ctx.beginPath();
      ctx.arc(col.x + col.width/2, col.y + col.height/2, col.width/2, 0, Math.PI * 2);
      ctx.fill();
    } else if (col.type === 'beer') {
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(col.x, col.y, col.width, col.height);
    }
  });
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  gameOverEl.style.display = 'block';
}