---
layout: default
title: Hopfenheld
permalink: /game/
---
<link rel="stylesheet" href="{{ '/assets/css/game.css' | relative_url }}">

<section class="wrap section">
  <h1 class="sr-only">Hopfenheld</h1>
  <div id="game-container" data-bayer="{{ '/bayer.svg' | relative_url }}" data-sausage="{{ '/sausage.svg' | relative_url }}">
    <canvas id="game-canvas" width="800" height="400" aria-label="Spielfeld von Hopfenheld"></canvas>
    <div id="game-ui">
      <div id="score" class="hud">
        <span class="hud-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="9.5" y="1.5" width="5" height="3" rx="1" fill="#1E1B16"/><path d="M18.4 6.4l1.6-1.6" stroke="#1E1B16" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="13.5" r="8" fill="#FFFDF6" stroke="#1E1B16" stroke-width="2"/><path d="M12 13.5V8.8" stroke="#1E1B16" stroke-width="2" stroke-linecap="round"/><path d="M12 13.5l3.2 2" stroke="#C0392B" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="13.5" r="1.3" fill="#1E1B16"/></svg></span>
        <span class="hud-txt"><span class="hud-lab">Punkte</span><span id="score-val" class="hud-num">0</span></span>
      </div>
      <div id="lives" class="hud">
        <span class="hud-lab">Leben</span>
        <span id="lives-icons" class="pz-row"></span>
      </div>
      <div id="game-over" style="display: none;">
        <h2>Verloren</h2>
        <p id="final-score"></p>
        <button id="restart-btn" class="btn btn--amber" type="button">Nochmal</button>
      </div>
      <div id="start-screen">
        <h2>Hopfenheld</h2>
        <p>Vorsicht vorm durstigen Bayern und fliegenden Würsten! Sammle Brezeln für Extraleben, aber mehr als drei Leben gibt es nicht.</p>
        <p>Drücke die Leertaste oder tippe auf das Spielfeld zum Springen.</p>
        <button id="start-btn" class="btn btn--amber" type="button">Start</button>
      </div>
    </div>
  </div>
</section>

<script src="{{ '/assets/js/game.js' | relative_url }}"></script>
