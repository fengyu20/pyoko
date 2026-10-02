/* Map view for the static Grutto Pass guide. Leaflet loads only when Map opens. */

let mapInstance = null;
let mapLayer = null;
let userLayer = null;
let markerByKey = new Map();
let selectedMarkerKey = '';
let mapInteractionTrackingSuppressed = false;
let mapDependencyPromise = null;
// Set only when the optional cluster enhancement was requested and could not be
// loaded as a whole, so a half-loaded plugin never drives the marker layer.
let mapClusterEnhancementFailed = false;

const MAP_DEPENDENCIES = {
  // Leaflet core. Without it the Map cannot function, so a failure here must
  // fail the Map request and return the user to the List.
  required: [
    ['link', 'vendor/leaflet/leaflet.css'],
    ['script', 'vendor/leaflet/leaflet.js']
  ],
  // MarkerCluster is an optional enhancement. If either half fails the Map
  // still opens, with ordinary individual markers instead of clusters.
  optional: [
    ['link', 'vendor/leaflet.markercluster/MarkerCluster.css'],
    ['script', 'vendor/leaflet.markercluster/leaflet.markercluster.js']
  ]
};

function loadMapAsset(tagName, source) {
  const attribute = tagName === 'link' ? 'href' : 'src';
  const absoluteSource = new URL(source, document.baseURI).href;
  const existing = [...document.head.querySelectorAll(`${tagName}[${attribute}]`)]
    .find(node => node[attribute] === absoluteSource);
  if (existing?.dataset.mapDependencyLoaded === 'true') return Promise.resolve();
  if (existing?.dataset.mapDependencyPromise) return new Promise((resolve, reject) => {
    existing.addEventListener('load', resolve, { once: true });
    existing.addEventListener('error', () => reject(new Error(`Could not load ${source}`)), { once: true });
  });

  return new Promise((resolve, reject) => {
    const node = existing || document.createElement(tagName);
    node.dataset.mapDependencyPromise = 'true';
    node.addEventListener('load', () => {
      node.dataset.mapDependencyLoaded = 'true';
      delete node.dataset.mapDependencyPromise;
      resolve();
    }, { once: true });
    node.addEventListener('error', () => reject(new Error(`Could not load ${source}`)), { once: true });
    if (!existing) {
      if (tagName === 'link') {
        node.rel = 'stylesheet';
        node.href = source;
      } else {
        node.src = source;
      }
      document.head.appendChild(node);
    }
  });
}

function loadMapAssetGroup(group) {
  return Promise.all(group.map(([tagName, source]) => loadMapAsset(tagName, source)));
}

function loadMapDependencies() {
  if (typeof L !== 'undefined') return Promise.resolve();
  if (!mapDependencyPromise) {
    const core = loadMapAssetGroup(MAP_DEPENDENCIES.required).then(() => {
      if (typeof L === 'undefined') throw new Error('Leaflet did not initialize');
    });
    // The plugin extends Leaflet, so it is only requested once core resolved.
    // Its failure is recorded rather than propagated: the Map still opens.
    const enhancement = core
      .then(() => loadMapAssetGroup(MAP_DEPENDENCIES.optional))
      .then(() => {
        if (typeof L.markerClusterGroup !== 'function') mapClusterEnhancementFailed = true;
      })
      .catch(() => { mapClusterEnhancementFailed = true; });
    mapDependencyPromise = core.then(() => enhancement);
  }
  return mapDependencyPromise;
}

function mapText(key, vars, fallback) {
  return typeof window !== 'undefined' && typeof window.uiText === 'function'
    ? window.uiText(key, vars, fallback)
    : fallback;
}

function mapEscape(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function mapPrefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function markMapAsUserMoved() {
  if (!mapInstance || mapInteractionTrackingSuppressed) return;
  mapInstance._hasUserMoved = true;
}

function bindMapInteractionTracking() {
  if (!mapInstance?.on) return;
  // The initial fitBounds and explicit focus actions are wrapped below so only
  // genuine map gestures prevent later marker refreshes from changing the view.
  mapInstance.on('movestart', markMapAsUserMoved);
  mapInstance.on('zoomstart', markMapAsUserMoved);
}

function withMapInteractionTrackingSuppressed(callback) {
  const previous = mapInteractionTrackingSuppressed;
  mapInteractionTrackingSuppressed = true;
  try {
    return callback();
  } finally {
    mapInteractionTrackingSuppressed = previous;
  }
}

function getFacilityMapsTarget(key, label) {
  const coords = typeof COORDS !== 'undefined' ? COORDS[key] : null;
  if (coords) {
    return {
      hasCoords: true,
      url: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${coords[0]},${coords[1]}`)}`
    };
  }
  return {
    hasCoords: false,
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label || key || '')}`
  };
}

window.getFacilityMapsTarget = getFacilityMapsTarget;

function selectFacilityCard(key) {
  selectedMarkerKey = String(key || '');
  window.setSelectedFacilityKey?.(selectedMarkerKey);
  const card = syncSelectedCardVisual();
  syncSelectedMarkerVisual();
  return card;
}

window.selectFacilityCard = selectFacilityCard;

function markerColor(card) {
  const state = card.dataset.nowState;
  if (state === 'longclosed' || state === 'unknown' || card.dataset.status === 'closed') return '#A7B2AC';
  return '#719784';
}

function getFilteredCards() {
  if (Array.isArray(window.filteredCards)) return window.filteredCards;
  return [...document.querySelectorAll('.card')].filter(card => card.style.display !== 'none');
}

function markerStatus(card) {
  const labels = {
    open: mapText('map.open', {}, '開館中'),
    lastcall: mapText('map.soon', {}, 'まもなく最終入館'),
    before: mapText('map.before', {}, '開館前'),
    ended: mapText('map.ended', {}, '最終入館終了'),
    after: mapText('map.after', {}, '本日は終了'),
    longclosed: mapText('map.longclosed', {}, '長期休館中'),
    unknown: mapText('map.unknown', {}, '時間未確認')
  };
  const state = card.dataset.nowState;
  let label = labels[state] || (card.dataset.status === 'closed'
    ? mapText('status.closed', {}, '休館')
    : mapText('status.warn', {}, '要確認'));
  if (!labels[state]) {
    const badge = card.querySelector('.status-badge')?.textContent?.trim() || '';
    label = badge.replace(/^[^\p{L}\p{N}]+/u, '').trim() || label;
  }
  const reason = card.querySelector('.status-reason')?.textContent || '';
  const lastAdmission = reason.match(/(?:最終入館|Last admission|最后入馆)\s*([0-9]{1,2}:[0-9]{2})/)?.[1] || '';
  return { label, lastAdmission };
}

function markerStateClass(card) {
  const state = card.dataset.nowState;
  return state === 'longclosed' || state === 'unknown' || card.dataset.status === 'closed'
    ? 'muted'
    : 'neutral';
}

function markerIcon(card) {
  const stateClass = markerStateClass(card);
  const selectedClass = selectedMarkerKey === card.dataset.facilityKey ? ' map-marker--selected' : '';
  return L.divIcon({
    className: 'map-marker-icon',
    html: `<span class="map-marker map-marker--${stateClass}${selectedClass}" style="--marker-color:${markerColor(card)}" aria-hidden="true"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

function clusterTier(count) {
  if (count >= 30) return 'large';
  if (count >= 10) return 'medium';
  return 'small';
}

function clusterIconSize(count) {
  if (count >= 30) return 48;
  if (count >= 10) return 42;
  return 36;
}

function clusterContainsSelectedFacility(cluster) {
  if (!selectedMarkerKey) return false;
  return cluster.getAllChildMarkers().some(marker =>
    String(marker.options.facilityKey || '') === selectedMarkerKey
  );
}

function clusterIcon(cluster) {
  const count = cluster.getChildCount();
  const containsSelected = clusterContainsSelectedFacility(cluster);
  const size = clusterIconSize(count);
  const accessibleLabel = mapText(
    containsSelected ? 'map.clusterSelectedCount' : 'map.clusterCount',
    { count },
    containsSelected
      ? `${count} facilities, including the selected facility`
      : `${count} facilities`
  );
  // MarkerCluster instances are Leaflet markers, so this is copied onto the
  // interactive icon element as its useful native title on every refresh.
  if (cluster.options) cluster.options.title = accessibleLabel;
  return L.divIcon({
    className: `map-cluster-icon map-cluster-icon--${clusterTier(count)}${containsSelected ? ' map-cluster-icon--selected' : ''}`,
    html: `<span class="map-cluster" aria-hidden="true">${count}</span><span class="visually-hidden">${mapEscape(accessibleLabel)}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function createMapMarkerLayer() {
  // The cluster plugin is optional at runtime. If either of its vendored files
  // is missing or fails to load, retain the existing individual-marker map.
  if (typeof L === 'undefined') return null;
  if (mapClusterEnhancementFailed || typeof L.markerClusterGroup !== 'function') return L.layerGroup();
  try {
    return L.markerClusterGroup({
      animate: false,
      disableClusteringAtZoom: 15,
      maxClusterRadius(zoom) {
        if (zoom < 11) return 72;
        if (zoom < 13) return 56;
        return 40;
      },
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: clusterIcon
    });
  } catch {
    return L.layerGroup();
  }
}

function syncSelectedCardVisual() {
  document.querySelectorAll('.card.is-selected').forEach(card => card.classList.remove('is-selected'));
  const card = selectedMarkerKey ? document.getElementById(`card-${selectedMarkerKey}`) : null;
  card?.classList.add('is-selected');
  return card;
}

function syncSelectedMarkerVisual() {
  if (!markerByKey.size) return;
  markerByKey.forEach((marker, key) => {
    const card = document.getElementById(`card-${key}`);
    if (card) marker.setIcon(markerIcon(card));
    if (typeof marker.setZIndexOffset === 'function') {
      marker.setZIndexOffset(selectedMarkerKey === key ? 1000 : 0);
    }
  });
  // The selected marker can be hidden inside a cluster. Refreshing the plugin's
  // cluster icons preserves that selected state without changing selection.
  mapLayer?.refreshClusters?.();
}

// index.html owns `facilityCardName`; fall back to the first child node, which is
// the localized name that precedes the optional `.original-name` secondary line.
function cardPrimaryName(card) {
  if (typeof facilityCardName === 'function') return facilityCardName(card);
  const title = card.querySelector('.card-title-button') || card.querySelector('.card-title');
  return title?.childNodes[0]?.textContent?.trim()
    || title?.textContent?.trim()
    || card.dataset.facilityKey;
}

// markerStatus() already routes every label through mapText(), so this stays
// localized wherever it is used.
function markerStatusText(card) {
  const { label, lastAdmission } = markerStatus(card);
  return lastAdmission && (card.dataset.nowState === 'open' || card.dataset.nowState === 'lastcall')
    ? `${label}${mapText('map.lastAdmission', { time: lastAdmission }, ` · 最終入館${lastAdmission}`)}`
    : label;
}

function markerTitle(card) {
  const name = cardPrimaryName(card) || card.dataset.facilityKey;
  const status = markerStatusText(card);
  return status ? `${name} — ${status}` : name;
}

function ensureMap() {
  if (mapInstance) return mapInstance;
  if (typeof L === 'undefined') return loadMapDependencies().then(() => ensureMap());
  const el = document.getElementById('mapCanvas');
  if (!el) return null;

  mapInstance = L.map(el, { zoomControl: true, preferCanvas: true })
    .setView([35.681, 139.767], 11);
  mapInstance._hasUserMoved = false;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance);
  mapLayer = createMapMarkerLayer().addTo(mapInstance);
  userLayer = L.layerGroup().addTo(mapInstance);
  bindMapInteractionTracking();
  updateMapMarkers();
  return mapInstance;
}

function mapStatusText() {
  const filtered = getFilteredCards();
  const located = filtered.filter(card => COORDS[card.dataset.facilityKey]);
  const missing = filtered.length - located.length;
  const parts = [mapText('map.summary', { count: located.length }, `表示 ${located.length} 件`)];
  if (missing) parts.push(mapText('map.missing', { count: missing }, `座標未登録 ${missing} 件`));
  if (!userPos) parts.push(mapText('map.locationUnset', {}, '現在地未設定'));
  return parts.join(' · ');
}

function updateMapMarkers() {
  syncSelectedCardVisual();
  if (!mapInstance || !mapLayer) return;
  mapLayer.clearLayers();
  userLayer?.clearLayers();
  markerByKey = new Map();

  const bounds = [];
  const markers = [];
  getFilteredCards().forEach(card => {
    const coords = COORDS[card.dataset.facilityKey];
    if (!coords) return;
    const point = [coords[0], coords[1]];
    const marker = L.marker(point, {
      icon: markerIcon(card),
      zIndexOffset: selectedMarkerKey === card.dataset.facilityKey ? 1000 : 0,
      // Opening state is otherwise colour-only on the marker; the accessible
      // name is the only place a screen reader or a tooltip can read it.
      title: markerTitle(card),
      facilityKey: card.dataset.facilityKey
    });
    marker.bindTooltip(mapEscape(cardPrimaryName(card)), {
      direction: 'top',
      offset: [0, -12],
      opacity: .92
    });
    marker.on('click', () => selectFacilityCard(card.dataset.facilityKey));
    markers.push(marker);
    markerByKey.set(card.dataset.facilityKey, marker);
    bounds.push(point);
  });
  markers.forEach(marker => mapLayer.addLayer(marker));

  if (userPos) {
    const point = [userPos.lat, userPos.lon];
    L.circleMarker(point, {
      radius: 7,
      color: '#fff',
      weight: 2,
      fillColor: '#2563eb',
      fillOpacity: 1
    }).bindTooltip(mapText('map.current', {}, '現在地')).addTo(userLayer);
    bounds.push(point);
  }

  const summary = document.getElementById('mapSummary');
  if (summary) summary.textContent = mapStatusText();
  if (bounds.length && !mapInstance._hasUserMoved) {
    withMapInteractionTrackingSuppressed(() => {
      mapInstance.fitBounds(bounds, { padding: [28, 28], maxZoom: userPos ? 14 : 12, animate: false });
    });
  }
}

function centerMapOnUser() {
  if (!mapInstance || !userPos) return;
  withMapInteractionTrackingSuppressed(() => {
    mapInstance.setView([userPos.lat, userPos.lon], 14);
  });
  mapInstance._hasUserMoved = true;
}

function updateViewButtons(showMap) {
  const listButton = document.getElementById('listToggleBtn');
  const mapButton = document.getElementById('mapToggleBtn');
  listButton?.classList.toggle('is-active', !showMap);
  mapButton?.classList.toggle('is-active', showMap);
  listButton?.setAttribute('aria-pressed', showMap ? 'false' : 'true');
  mapButton?.setAttribute('aria-pressed', showMap ? 'true' : 'false');
}

function finishMapViewSetup() {
  requestAnimationFrame(() => {
    mapInstance?.invalidateSize();
    updateMapMarkers();
    const mapView = document.getElementById('mapView');
    const sticky = document.querySelector('.controls-wrap');
    const offset = (sticky?.getBoundingClientRect().height || 0) + 10;
    const target = (mapView?.getBoundingClientRect().top || 0) + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, target), behavior: mapPrefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

function setMapView(show) {
  const mapView = document.getElementById('mapView');
  const toc = document.querySelector('.toc-section');
  const areaLayout = document.querySelector('.area-layout');
  const mapFacilityPanel = document.getElementById('mapFacilityPanel');
  const main = document.getElementById('mainContent');
  const empty = document.getElementById('emptyState');
  if (!mapView || !main) return;

  mapView.hidden = !show;
  // The list navigation lives outside #mainContent, so keep its visibility in
  // sync explicitly instead of relying only on the body state class. This
  // prevents the area rail/toc from being laid out below the map.
  if (toc) toc.hidden = show;
  // The browse feed is List-only. Map Mode owns one selected-facility panel
  // instead of scrolling a second copy of the results feed.
  if (areaLayout) areaLayout.hidden = show;
  if (mapFacilityPanel) mapFacilityPanel.hidden = !show;
  main.hidden = false;
  if (empty) empty.hidden = show;
  document.body.classList.toggle('map-active', show);
  updateViewButtons(show);
  if (show) {
    window.renderSelectedFacilityPanel?.();
    const map = ensureMap();
    if (map?.then) {
      return map.then(() => finishMapViewSetup()).catch(() => {
        // A core dependency or Map initialization failure must never strand the default List flow.
        setMapView(false);
      });
    }
    finishMapViewSetup();
  }
  return Promise.resolve();
}

function focusMapOnFacility(key) {
  selectFacilityCard(key);
  return Promise.resolve(setMapView(true)).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!mapInstance) return;
    const coords = typeof COORDS !== 'undefined' ? COORDS[key] : null;
    const marker = markerByKey.get(key);
    if (coords) {
      // MarkerCluster can still be resolving the broad initial fitBounds when
      // this path runs. Stop that animation and finish the facility focus in a
      // single synchronous view update; otherwise zoomToShowLayer may calculate
      // from the old viewport and put the map back on a broad cluster view.
      withMapInteractionTrackingSuppressed(() => {
        mapInstance.stop?.();
        const targetZoom = Math.max(mapInstance.getZoom(), 15);
        mapInstance.setView([coords[0], coords[1]], targetZoom, { animate: false });
      });
      mapInstance._hasUserMoved = true;
    }
    if (marker && typeof mapLayer?.zoomToShowLayer === 'function') {
      mapLayer.zoomToShowLayer(marker, () => marker.openTooltip());
    } else {
      marker?.openTooltip();
    }
  })));
}

window.focusMapOnFacility = focusMapOnFacility;

// The compact map canvas is sized against the sticky toolbar, so the app tells
// Leaflet to re-measure when that height changes.
window.invalidateMapSize = () => mapInstance?.invalidateSize();

document.addEventListener('click', event => {
  const focus = event.target.closest('[data-map-focus]');
  if (focus) {
    event.preventDefault();
    window.closeFacilityDetail?.({ restoreFocus: false });
    focusMapOnFacility(focus.dataset.mapFocus);
  }
});

window.addEventListener('resize', () => {
  if (!document.body.classList.contains('map-active')) return;
  requestAnimationFrame(() => mapInstance?.invalidateSize());
});
