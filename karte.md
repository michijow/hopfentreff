---
layout: page
title: Unsere Wirtshaus-Karte
permalink: /karte/
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">

<style>
  .meetup-map-intro {
    margin-bottom: 1rem;
  }

  .meetup-map-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1rem 0;
  }

  .meetup-map-toolbar button,
  .meetup-map-list button {
    border: 1px solid #c8c8c8;
    border-radius: 0.35rem;
    background: #fff;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.45rem 0.75rem;
  }

  .meetup-map-toolbar button:hover,
  .meetup-map-list button:hover {
    background: #f3f5ef;
  }

  #meetup-map {
    height: min(68vh, 680px);
    min-height: 420px;
    border: 1px solid #d5d5d5;
    border-radius: 0.5rem;
    z-index: 0;
  }

  .meetup-map-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .meetup-map-list button {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    text-align: left;
  }

  .meetup-map-list time {
    color: #666;
    white-space: nowrap;
  }

  .meetup-popup h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  .meetup-popup p {
    margin: 0.25rem 0;
  }

  .meetup-popup a {
    display: inline-block;
    margin-top: 0.35rem;
  }

  @media (max-width: 600px) {
    #meetup-map {
      min-height: 360px;
    }
  }
</style>

<div class="meetup-map-intro">
  <p>Alle bisherigen Hopfentreffen auf einer Karte. Wähle einen Pin oder einen Treffpunkt aus der Liste, um Datum und Bewertung zu sehen.</p>
</div>

<div class="meetup-map-toolbar" aria-label="Kartenausschnitt">
  <button type="button" id="show-munich">München anzeigen</button>
  <button type="button" id="show-all">Alle Orte anzeigen</button>
</div>

<div id="meetup-map" role="application" aria-label="Karte der Hopfentreffen"></div>

<div class="meetup-map-list" id="meetup-map-list" aria-label="Hopfentreffen auswählen"></div>

<p><small>Kartendaten © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>.</small></p>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
  (function () {
    if (!window.L) return;

    const places = [
      {% for meeting in site.hopfentreffen %}
        {% assign coordinate_key = meeting.path | remove: "_hopfentreffen/" | remove: ".md" %}
        {% assign coordinates = site.data.map_coordinates[coordinate_key] %}
        {
          name: {{ meeting.title | jsonify }},
          date: {{ meeting.date | date: "%d.%m.%Y" | jsonify }},
          lat: {{ coordinates.lat | jsonify }},
          lon: {{ coordinates.lon | jsonify }},
          ratings: {
            beer: {{ meeting.bier_rating | jsonify }},
            food: {{ meeting.kaese_rating | jsonify }},
            meetup: {{ meeting.treffen_rating | jsonify }}
          },
          url: {{ meeting.url | relative_url | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    const map = L.map('meetup-map', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markerGroup = L.featureGroup().addTo(map);
    const munichPlaces = [];

    function makePopup(place) {
      const content = document.createElement('div');
      content.className = 'meetup-popup';

      const title = document.createElement('h3');
      title.textContent = place.name;
      content.appendChild(title);

      const date = document.createElement('p');
      date.textContent = place.date;
      content.appendChild(date);

      const rating = document.createElement('p');
      rating.textContent = `Hopfen ${place.ratings.beer}/5 · Essen ${place.ratings.food}/5 · Treff ${place.ratings.meetup}/5`;
      content.appendChild(rating);

      const link = document.createElement('a');
      link.href = place.url;
      link.textContent = 'Zum Treffen';
      content.appendChild(link);

      return content;
    }

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lon]).bindPopup(makePopup(place));
      marker.addTo(markerGroup);
      place.marker = marker;
      if (place.lon < 12) munichPlaces.push(place);

      const button = document.createElement('button');
      button.type = 'button';
      const name = document.createElement('span');
      name.textContent = place.name;
      const date = document.createElement('time');
      date.textContent = place.date;
      button.append(name, date);
      button.addEventListener('click', () => {
        map.flyTo([place.lat, place.lon], place.lon < 12 ? 15 : 12);
        place.marker.openPopup();
      });
      document.getElementById('meetup-map-list').appendChild(button);
    });

    function showMunich() {
      const bounds = L.latLngBounds(munichPlaces.map((place) => [place.lat, place.lon]));
      map.fitBounds(bounds.pad(0.12), { maxZoom: 13 });
    }

    document.getElementById('show-munich').addEventListener('click', showMunich);
    document.getElementById('show-all').addEventListener('click', () => {
      map.fitBounds(markerGroup.getBounds().pad(0.12));
    });
    showMunich();
  })();
</script>
