---
layout: page
title: Beer Runner Game
permalink: /game/
---

<div id="game-container">
  <canvas id="game-canvas" width="800" height="400"></canvas>
  <div id="game-ui">
    <div id="score">Punkte: 0</div>
    <div id="lives">Leben: 3</div>
    <div id="game-over" style="display: none;">
      <h2>Game Over</h2>
      <button id="restart-btn">Nochmal</button>
    </div>
    <div id="start-screen">
      <h2>Beer Runner</h2>
      <p>Spring über Bierflaschen und Fässer! Sammle Hopfen für Extraleben, Bier für Punkte!</p>
      <p>Drücke LEERTASTE zum Springen, PFEIL NACH UNTEN zum Ducken.</p>
      <button id="start-btn">Start</button>
    </div>
  </div>
</div>

<script src="/assets/js/game.js"></script>
<link rel="stylesheet" href="/assets/css/game.css">