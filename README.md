# Hopfentreff – neues Design für Jekyll / GitHub Pages

Kopiere den Inhalt dieses Ordners in dein Repo (bestehende Dateien mit gleichem Namen ersetzen).
Diese README nicht mitkopieren.

## 1. `_config.yml`
Die beiliegende `_config.yml` ersetzt deine bisherige. Sie übernimmt Titel, URL, Locale, Sammlung
`hopfentreffen` (gleiche Permalinks wie bisher), Feed, Sitemap und SEO-Tag. Entfernt sind das
So-Simple-Theme, Skin, Google Fonts, Disqus, Autor-/Footer-Einstellungen und die Paginierung
(`jekyll-paginate`; nur nötig, wenn du Blog-Posts hast).
Die Meetings nutzen jetzt `layout: hopfentreff`.

## 2. Dateien, die du selbst herunterladen musst
- **Leaflet 1.9.4** (leafletjs.com/download.html): `leaflet.js`, `leaflet.css` und den Ordner `images/`
  nach `assets/vendor/leaflet/` legen.
- **Schriften** als woff2 (Zeichensatz „latin“, z. B. über google-webfonts-helper) nach `assets/fonts/`:
  `fraunces-600.woff2`, `fraunces-800.woff2`, `inter-400.woff2`, `inter-500.woff2`, `inter-600.woff2`.
  Lokal gehostet, damit keine Verbindung zu Google entsteht.

## 3. Treffen pflegen (Front Matter)
Dein bisheriges Format funktioniert unverändert; das Datum kommt aus dem Dateinamen
(`_hopfentreffen/2026-11-12-Die_Pforte.md`):

```yaml
---
title: Schinken-Peter
image:
  path: /images/beer.jpg
  caption: "Photo from [Pexels](https://www.pexels.com)"   # optional
bier_rating: 3
kaese_rating: 3
treffen_rating: 5
---
Wirtshaus in Giesing.
```
Bewertungen werden als „x/5“ angezeigt, „Gesamt“ ist der Mittelwert der drei Werte.
Die Karte liest die Koordinaten aus deiner `_data/map_coordinates.yml` (Schlüssel = Dateiname ohne `.md`, z. B. `2025-02-06-schinken-peter`). Treffen ohne Eintrag erscheinen nicht auf der Karte. Alternativ kannst du `lat`/`lon` ins Front Matter schreiben; das hat Vorrang. Ohne Bild zeigt die Kachel eine Farbfläche.
Das nächste Treffen pflegst du in `_data/next.yml`.

## 4. Testen und veröffentlichen
`bundle exec jekyll serve`, dann nach `main` pushen.

## Hinweise
- `images/logo.png` ist das freigestellte Logo (400 px breit, ca. 40 KB).
- Die Karte lädt Kacheln von tile.openstreetmap.org. Dabei wird die IP-Adresse der Besucher übertragen:
  gehört in die Datenschutzerklärung. Für mehr Traffic einen eigenen Kachel-Anbieter verwenden.
- Ohne JavaScript bleiben Seiten und Treffenliste nutzbar, nur die Karte bleibt leer.
