---
layout: default
title: Hopfenheld
permalink: /game/
extra_css: /assets/css/game.css
---
<section class="wrap section">
  <h1 class="sr-only">Hopfenheld</h1>
  <div id="game-container">
    <canvas id="game-canvas" width="800" height="400"></canvas>
    <div id="game-ui">
      <div id="score">Punkte: 0</div>
      <div id="lives">Leben: 3</div>
      <div id="game-over" style="display: none;">
        <h2>Verloren</h2>
        <button id="restart-btn" class="btn btn--amber" type="button">Nochmal</button>
      </div>
      <div id="start-screen">
        <h2>Hopfenheld</h2>
        <p>Vorsicht vorm durstigen Bayern und fliegenden Würsten! Sammle Brezeln für Extraleben!</p>
        <p>Drücke die Leertaste oder tippe auf das Spielfeld zum Springen.</p>
        <button id="start-btn" class="btn btn--amber" type="button">Start</button>
      </div>
    </div>
  </div>
</section>

<script src="{{ '/assets/js/game.js' | relative_url }}"></script>
