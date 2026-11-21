/* Karte der Hopfentreffen (Leaflet + OpenStreetMap) */
(function () {
  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  var data = window.TREFFEN || [];
  var mini = el.dataset.mini === 'true';
  var munichCenter = [48.1374, 11.5755];
  var map = L.map(el, {
    center: munichCenter, zoom: 12, scrollWheelZoom: false,
    dragging: !mini, touchZoom: !mini, doubleClickZoom: !mini,
    boxZoom: !mini, keyboard: !mini, zoomControl: !mini
  });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
  }).addTo(map);

  function popup(t) {
    var box = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = t.title; box.appendChild(h);
    box.appendChild(document.createElement('br'));
    box.appendChild(document.createTextNode(t.date));
    if (t.b != null && t.f != null && t.m != null) {
      box.appendChild(document.createElement('br'));
      box.appendChild(document.createTextNode('Hopfen ' + t.b + '/5 · Essen ' + t.f + '/5 · Treff ' + t.m + '/5'));
    }
    box.appendChild(document.createElement('br'));
    var a = document.createElement('a'); a.href = t.url; a.textContent = 'Zum Treffen'; box.appendChild(a);
    return box;
  }

  var markers = data.map(function (t) {
    return L.marker([t.lat, t.lon], { title: t.title }).addTo(map).bindPopup(popup(t));
  });
  var inMunich = markers.filter(function (m, i) { return data[i].lon < 12; });

  function showMunich() {
    if (!inMunich.length) return map.setView(munichCenter, 12);
    map.fitBounds(L.featureGroup(inMunich).getBounds().pad(0.12), { maxZoom: 13 });
  }
  function showAll() {
    if (!markers.length) return map.setView(munichCenter, 12);
    map.fitBounds(L.featureGroup(markers).getBounds().pad(0.12));
  }
  showMunich();

  document.querySelectorAll('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.view === 'munich') showMunich(); else showAll();
    });
  });
  document.querySelectorAll('.map-list a[data-i]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var i = +a.dataset.i, m = markers[i];
      if (!m) return;
      e.preventDefault();
      map.flyTo(m.getLatLng(), data[i].lon < 12 ? 15 : 12);
      m.openPopup();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
