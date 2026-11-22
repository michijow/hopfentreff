/* Hopfenheld – Spiel für hopfentreff.de */
(function () {
  'use strict';

  var canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var container = document.getElementById('game-container');

  var W = 800, H = 400;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  var scoreVal = document.getElementById('score-val');
  var livesEl = document.getElementById('lives');
  var livesIcons = document.getElementById('lives-icons');
  var gameOverEl = document.getElementById('game-over');
  var finalScoreEl = document.getElementById('final-score');
  var startScreenEl = document.getElementById('start-screen');
  var restartBtn = document.getElementById('restart-btn');
  var startBtn = document.getElementById('start-btn');

  // ---------- Einstellungen ----------
  var MAX_LIVES = 3;
  var GROUND_Y = H - 50;
  var PLAYER_W = 30, PLAYER_H = 42, DUCK_H = 22;
  var GRAVITY = 0.6, JUMP_POWER = -15;
  var START_SPEED = 5;

  // ---------- Grafiken ----------
  var PRETZEL_D = 'M5.5 19.5C-.5 13.5.5 3.5 8 3.5c3.6 0 6 2.8 6 7.5M22.5 19.5C28.5 13.5 27.5 3.5 20 3.5c-3.6 0-6 2.8-6 7.5M5.5 19.5C9 23 19 23 22.5 19.5M8.4 17.2L20.5 8M19.6 17.2L7.5 8';
  var SALT = [[4.5, 10], [9, 4.6], [23.5, 10], [19, 4.6], [14, 9], [14, 21]];

  function svgImage(svg, onload) {
    var img = new Image();
    if (onload) img.onload = onload;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  function pretzelSvg(w, h) {
    var salt = SALT.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".9" fill="#FFFDF6"/>'; }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="-2 -1 32 26">' +
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="' + PRETZEL_D + '" stroke="#7A4413" stroke-width="5.4"/><path d="' + PRETZEL_D + '" stroke="#C97C2A" stroke-width="3.4"/></g>' + salt + '</svg>';
  }
  var MUG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="112" viewBox="0 0 24 28">' +
    '<path d="M17.2 11h2.2a3.3 3.3 0 0 1 3.3 3.3v3.4a3.3 3.3 0 0 1-3.3 3.3h-3" fill="none" stroke="#2F4A2B" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M3.6 8h13.6l-1.4 16.4a2.2 2.2 0 0 1-2.2 2H7.2a2.2 2.2 0 0 1-2.2-2z" fill="#E0A030" stroke="#2F4A2B" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M7.2 12.5l.7 10" stroke="#FBE7A9" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M3 8.4C1.8 5.6 3.4 3.4 6 3.8 6.8 1.6 10 1.2 11.4 3c2-1.4 4.8-.2 4.8 2.4 1.8.2 2.6 2.4 1.4 3.6z" fill="#FFFDF6" stroke="#2F4A2B" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function redrawIfIdle() { if (state !== 'running') draw(); }
  var mugImg = svgImage(MUG_SVG, redrawIfIdle);
  var pretzelImg = svgImage(pretzelSvg(128, 104), redrawIfIdle);
  var bayerImg = new Image();
  bayerImg.onload = redrawIfIdle;
  bayerImg.src = (container && container.dataset.bayer) || '/bayer.svg';
  var sausageImg = new Image();
  sausageImg.onload = redrawIfIdle;
  sausageImg.src = (container && container.dataset.sausage) || '/sausage.svg';

  // ---------- Hintergrund (einmal vorgezeichnet) ----------
  function makeLayer(fn) {
    var c = document.createElement('canvas');
    c.width = W * DPR; c.height = H * DPR;
    var g = c.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    fn(g);
    return c;
  }

  var skyLayer = makeLayer(function (g) {
    var grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#F6F0E4');
    grad.addColorStop(1, '#F3D9A4');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(224,160,48,.22)';
    g.beginPath(); g.arc(640, 118, 62, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(224,160,48,.45)';
    g.beginPath(); g.arc(640, 118, 40, 0, Math.PI * 2); g.fill();
  });

  var farLayer = makeLayer(function (g) {
    var pts = [[0, 230], [90, 150], [150, 205], [250, 110], [340, 215], [430, 140], [520, 210], [620, 120], [720, 200], [800, 230]];
    g.fillStyle = '#A9BFA0';
    g.beginPath(); g.moveTo(0, 300);
    pts.forEach(function (p) { g.lineTo(p[0], p[1]); });
    g.lineTo(800, 300); g.closePath(); g.fill();
    g.fillStyle = '#F6F0E4';
    [[90, 150], [250, 110], [430, 140], [620, 120]].forEach(function (p) {
      g.beginPath();
      g.moveTo(p[0], p[1]); g.lineTo(p[0] - 17, p[1] + 30); g.lineTo(p[0], p[1] + 22); g.lineTo(p[0] + 15, p[1] + 32);
      g.closePath(); g.fill();
    });
  });

  var midLayer = makeLayer(function (g) {
    g.fillStyle = '#6F8A57';
    g.beginPath(); g.moveTo(0, H);
    for (var x = 0; x <= W; x += 8) {
      g.lineTo(x, 285 + 16 * Math.sin(2 * Math.PI * 2 * x / W));
    }
    g.lineTo(W, H); g.closePath(); g.fill();
  });

  var hopLayer = makeLayer(function (g) {
    var heights = [104, 116, 98, 120, 108, 100, 118, 110, 96, 114, 122, 102, 112, 106, 120, 100];
    heights.forEach(function (h, i) {
      var x = i * 50 + 25, top = 352 - h;
      g.strokeStyle = '#5A4A32'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(x, 352); g.lineTo(x, top); g.stroke();
      g.strokeStyle = '#4F6B3A'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(x, top + 6); g.quadraticCurveTo(x - 22, top + 36, x - 4, top + h - 54); g.stroke();
      g.beginPath(); g.moveTo(x, top + 6); g.quadraticCurveTo(x + 22, top + 36, x + 4, top + h - 54); g.stroke();
      for (var k = 0; k < 4; k++) {
        g.fillStyle = '#8FB36A'; g.strokeStyle = '#4F6B3A'; g.lineWidth = 1.5;
        g.beginPath(); g.ellipse(x + (k % 2 ? -9 : 9), top + 22 + k * 20, 7, 10, 0, 0, Math.PI * 2); g.fill(); g.stroke();
      }
    });
  });

  var buntingLayer = makeLayer(function (g) {
    for (var i = 0; i < 20; i++) {
      g.fillStyle = i % 2 === 0 ? '#2F6DB5' : '#F6F0E4';
      g.globalAlpha = 0.95;
      g.beginPath(); g.moveTo(i * 40, 0); g.lineTo(i * 40 + 40, 0); g.lineTo(i * 40 + 20, 26); g.closePath(); g.fill();
    }
  });

  function drawTile(layer, offset) {
    var x = -(offset % W);
    ctx.drawImage(layer, x, 0, W, H);
    ctx.drawImage(layer, x + W, 0, W, H);
  }

  // ---------- Spielzustand ----------
  var state = 'ready'; // ready | running | over
  var rafId = 0, lastTs = 0;
  var score, lives, speed, hitCooldown;
  var scrollFar, scrollMid, scrollHops, scrollGround;
  var player, obstacles, collectibles;

  function resetState() {
    score = 0; lives = MAX_LIVES; speed = START_SPEED; hitCooldown = 0;
    scrollFar = scrollMid = scrollHops = scrollGround = 0;
    player = { x: 50, y: GROUND_Y - PLAYER_H, width: PLAYER_W, height: PLAYER_H, dy: 0, jumping: false, ducking: false };
    obstacles = [];
    collectibles = [];
  }
  resetState();

  // ---------- Anzeige ----------
  function pretzelIcon(lost) {
    var salt = SALT.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".9"/>'; }).join('');
    return '<svg class="pz' + (lost ? ' lost' : '') + '" viewBox="-2 -1 32 26" aria-hidden="true">' +
      '<g class="pz-g"><path class="pz-o" d="' + PRETZEL_D + '"/><path class="pz-i" d="' + PRETZEL_D + '"/></g><g class="pz-s">' + salt + '</g></svg>';
  }
  function renderLives() {
    if (!livesIcons) return;
    var html = '';
    for (var i = 0; i < MAX_LIVES; i++) html += pretzelIcon(i >= lives);
    livesIcons.innerHTML = html;
    if (livesEl) livesEl.setAttribute('aria-label', 'Leben: ' + lives + ' von ' + MAX_LIVES);
  }
  function renderScore() {
    if (scoreVal) scoreVal.textContent = Math.floor(score / 100);
  }
  function pulse(cls) {
    if (!livesEl) return;
    livesEl.classList.remove('flash', 'gain');
    void livesEl.offsetWidth;
    livesEl.classList.add(cls);
    setTimeout(function () { livesEl.classList.remove(cls); }, 500);
  }

  // ---------- Steuerung ----------
  function jump() {
    if (!player.jumping && !player.ducking) {
      player.dy = JUMP_POWER;
      player.jumping = true;
    }
  }
  function duck() {
    if (!player.jumping && !player.ducking) {
      player.ducking = true;
      player.height = DUCK_H;
      player.y = GROUND_Y - player.height;
    }
  }
  function standUp() {
    if (player.ducking) {
      player.ducking = false;
      player.height = PLAYER_H;
      player.y = GROUND_Y - player.height;
    }
  }
  function action() {
    if (state === 'ready') startGame();
    else if (state === 'over') startGame();
    else jump();
  }

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) action(); }
    else if (e.code === 'ArrowUp') { e.preventDefault(); if (state === 'running') jump(); }
    else if (e.code === 'ArrowDown') { e.preventDefault(); if (state === 'running') duck(); }
  });
  document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowDown') standUp();
  });
  canvas.addEventListener('touchstart', function (e) { e.preventDefault(); action(); }, { passive: false });
  canvas.addEventListener('mousedown', function () { action(); });
  if (startBtn) startBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);
  document.addEventListener('visibilitychange', function () { lastTs = 0; });

  // ---------- Ablauf ----------
  function startGame() {
    cancelAnimationFrame(rafId);
    resetState();
    state = 'running';
    lastTs = 0;
    if (startScreenEl) startScreenEl.style.display = 'none';
    if (gameOverEl) gameOverEl.style.display = 'none';
    renderLives();
    renderScore();
    rafId = requestAnimationFrame(loop);
  }

  function endGame() {
    state = 'over';
    cancelAnimationFrame(rafId);
    if (finalScoreEl) finalScoreEl.textContent = 'Du hast ' + Math.floor(score / 100) + ' Punkte erreicht.';
    if (gameOverEl) gameOverEl.style.display = 'flex';
  }

  function loop(ts) {
    if (state !== 'running') return;
    if (!lastTs) lastTs = ts;
    var step = Math.min((ts - lastTs) / 16.667, 3); // 1 = ein Bild bei 60 Hz
    lastTs = ts;
    update(step);
    draw();
    if (state === 'running') rafId = requestAnimationFrame(loop);
  }

  function overlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function update(step) {
    if (hitCooldown > 0) hitCooldown -= step;

    // Spieler
    player.dy += GRAVITY * step;
    player.y += player.dy * step;
    if (player.y >= GROUND_Y - player.height) {
      player.y = GROUND_Y - player.height;
      player.dy = 0;
      player.jumping = false;
    }

    // Bewegung
    var dx = speed * step;
    obstacles.forEach(function (o) { o.x -= dx; });
    collectibles.forEach(function (c) { c.x -= dx; });
    obstacles = obstacles.filter(function (o) { return o.x + o.width > 0; });
    collectibles = collectibles.filter(function (c) { return c.x + c.width > 0; });
    scrollFar += dx * 0.08;
    scrollMid += dx * 0.25;
    scrollHops += dx * 0.5;
    scrollGround += dx;

    // Hindernisse
    if (Math.random() < 0.01 * step) {
      var last = obstacles[obstacles.length - 1];
      if (!last || last.x < W - 150) {
        var bayer = Math.random() < 0.6;
        obstacles.push(bayer
          ? { x: W, y: GROUND_Y - 60, width: 30, height: 60, type: 'bayer' }
          : { x: W, y: GROUND_Y - 120, width: 60, height: 30, type: 'flying' });
      }
    }
    // Brezeln gibt es nur, wenn ein Leben fehlt
    if (lives < MAX_LIVES && collectibles.length === 0 && Math.random() < 0.0015 * step) {
      collectibles.push({ x: W, y: GROUND_Y - 30, width: 20, height: 20 });
    }

    // Treffer
    if (hitCooldown <= 0) {
      for (var i = 0; i < obstacles.length; i++) {
        if (overlap(player, obstacles[i])) {
          lives--;
          hitCooldown = 30;
          renderLives();
          pulse('flash');
          if (lives <= 0) { endGame(); return; }
          break;
        }
      }
    }

    // Brezel eingesammelt: ein Leben dazu, höchstens drei
    for (var j = collectibles.length - 1; j >= 0; j--) {
      if (overlap(player, collectibles[j])) {
        collectibles.splice(j, 1);
        if (lives < MAX_LIVES) {
          lives++;
          renderLives();
          pulse('gain');
        }
      }
    }

    // Punkte laufen mit der Zeit
    score += step;
    speed += 0.001 * step;
    renderScore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(skyLayer, 0, 0, W, H);
    drawTile(farLayer, scrollFar);
    drawTile(midLayer, scrollMid);
    drawTile(hopLayer, scrollHops);

    // Boden
    ctx.fillStyle = '#2F4A2B';
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = '#4F6B3A';
    ctx.fillRect(0, GROUND_Y, W, 7);
    ctx.save();
    ctx.strokeStyle = 'rgba(246,240,228,.45)';
    ctx.lineWidth = 3;
    ctx.setLineDash([26, 22]);
    ctx.lineDashOffset = scrollGround % 48;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 28); ctx.lineTo(W, GROUND_Y + 28); ctx.stroke();
    ctx.restore();

    ctx.drawImage(buntingLayer, 0, 0, W, H);

    // Brezeln und Hindernisse
    collectibles.forEach(function (c) {
      ctx.drawImage(pretzelImg, c.x - 4, c.y - 2, 28, 23);
    });
    obstacles.forEach(function (o) {
      ctx.drawImage(o.type === 'bayer' ? bayerImg : sausageImg, o.x, o.y, o.width, o.height);
    });

    // Spieler (blinkt kurz nach einem Treffer)
    var blink = hitCooldown > 0 && Math.floor(hitCooldown / 4) % 2 === 0;
    ctx.globalAlpha = blink ? 0.4 : 1;
    var dh = player.ducking ? 24 : 40, dw = 34;
    ctx.drawImage(mugImg, player.x + player.width / 2 - dw / 2, player.y + player.height - dh, dw, dh);
    ctx.globalAlpha = 1;
  }

  renderLives();
  renderScore();
  draw();
})();
