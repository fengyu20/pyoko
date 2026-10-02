const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const mapSource = fs.readFileSync(path.join(root, 'map.js'), 'utf8');

function classListFor(card) {
  const values = new Set();
  return {
    add(value) { values.add(value); },
    remove(value) { values.delete(value); },
    toggle(value, force) {
      const next = force == null ? !values.has(value) : Boolean(force);
      if (next) values.add(value);
      else values.delete(value);
      return next;
    },
    contains(value) { return values.has(value); }
  };
}

function makeCard(key) {
  const card = {
    dataset: {
      facilityKey: key,
      nowState: 'open',
      status: 'open'
    },
    style: { display: '' },
    classList: null,
    querySelector(selector) {
      if (selector === '.card-title-button') {
        return { setAttribute() {} };
      }
      if (selector === '.status-reason') return null;
      if (selector === '.status-badge') return { textContent: 'Open' };
      return null;
    }
  };
  card.classList = classListFor(card);
  return card;
}

function makeLayer(kind, options) {
  return {
    kind,
    options,
    map: null,
    layers: [],
    refreshCount: 0,
    zoomToShowLayerCalls: 0,
    addTo(map) {
      this.map = map;
      map.layers.push(this);
      return this;
    },
    addLayer(layer) {
      this.layers.push(layer);
      return this;
    },
    clearLayers() {
      this.layers = [];
      return this;
    },
    refreshClusters() {
      this.refreshCount += 1;
      return this;
    },
    zoomToShowLayer(marker, callback) {
      this.zoomToShowLayerCalls += 1;
      // Simulate the real plugin using the current viewport while revealing a
      // clustered marker. An animated focus leaves the old zoom in place here,
      // so this exposes the race between the two competing view updates.
      if (this.map && this.map.getZoom() < 15) this.map.setView([35.681, 139.767], 12);
      callback(marker);
    }
  };
}

function loadMap({ clusterPlugin = true, userPosition = null, lazy = false, failingAssets = [] } = {}) {
  const requestedAssets = [];
  const cards = [makeCard('a'), makeCard('b'), makeCard('c')];
  const cardsById = new Map(cards.map(card => [`card-${card.dataset.facilityKey}`, card]));
  const summary = { textContent: '' };
  const bodyClasses = new Set();
  let clusterOptions = null;

  function makeAssetNode(tagName) {
    const node = {
      tagName,
      dataset: {},
      handlers: {},
      addEventListener(type, handler) { (this.handlers[type] ||= []).push(handler); }
    };
    return node;
  }

  const head = {
    nodes: [],
    querySelectorAll() { return this.nodes; },
    appendChild(node) {
      this.nodes.push(node);
      const source = node.href || node.src || '';
      requestedAssets.push(source);
      // Resolve out of band so the loader promises behave like real assets.
      queueMicrotask(() => {
        const failed = failingAssets.some(fragment => source.includes(fragment));
        if (!failed) applyAssetSideEffect(source);
        (node.handlers[failed ? 'error' : 'load'] || []).forEach(handler => handler({}));
      });
      return node;
    }
  };

  const document = {
    baseURI: 'http://localhost/index.html',
    head,
    createElement: makeAssetNode,
    body: { classList: { contains: value => bodyClasses.has(value), toggle: (value, force) => force ? bodyClasses.add(value) : bodyClasses.delete(value) } },
    addEventListener() {},
    getElementById(id) {
      if (id === 'mapCanvas') return {};
      if (id === 'mapView') return mapView;
      if (id === 'mapFacilityPanel') return mapFacilityPanel;
      if (id === 'mainContent') return main;
      if (id === 'emptyState') return empty;
      if (id === 'listToggleBtn') return listButton;
      if (id === 'mapToggleBtn') return mapButton;
      if (id === 'mapSummary') return summary;
      return cardsById.get(id) || null;
    },
    querySelectorAll(selector) {
      if (selector === '.card.is-selected') return cards.filter(card => card.classList.contains('is-selected'));
      if (selector === '.map-mode-layout .area-layout .card' || selector === '.card') return cards;
      return [];
    },
    querySelector(selector) {
      if (selector === '.toc-section') return toc;
      if (selector === '.controls-wrap') return controls;
      return null;
    }
  };

  const mapView = { hidden: true, getBoundingClientRect() { return { top: 0 }; } };
  const mapFacilityPanel = { hidden: true, scrollTop: 0 };
  const main = { hidden: false };
  const empty = { hidden: false };
  const toc = { hidden: false };
  const controls = { getBoundingClientRect() { return { height: 0 }; } };
  const controlClassList = classListFor({});
  const listButton = { classList: controlClassList, setAttribute() {} };
  const mapButton = { classList: classListFor({}), setAttribute() {} };

  const L = {
    divIcon(options) { return { options }; },
    layerGroup() { return makeLayer('layer-group'); },
    map() {
      return {
        layers: [],
        handlers: {},
        zoom: 11,
        center: null,
        pendingView: null,
        on(event, handler) {
          event.split(/\s+/).forEach(type => {
            this.handlers[type] ||= [];
            this.handlers[type].push(handler);
          });
          return this;
        },
        fire(event, payload = {}) {
          (this.handlers[event] || []).forEach(handler => handler({ type: event, ...payload }));
          return this;
        },
        setView(_center, zoom, options = {}) {
          if (options.animate) this.pendingView = { center: _center, zoom };
          else {
            const zoomChanged = this.zoom !== zoom;
            if (zoomChanged) this.fire('zoomstart');
            this.fire('movestart');
            this.center = _center;
            this.zoom = zoom;
            this.pendingView = null;
            if (zoomChanged) this.fire('zoomend');
            this.fire('moveend');
          }
          return this;
        },
        getZoom() { return this.zoom; },
        fitBounds(bounds, options) {
          this.lastFitBounds = { bounds, options };
          this.setView(bounds[0], options.maxZoom, { animate: options.animate });
        },
        invalidateSize() {},
        stop() { this.pendingView = null; return this; }
      };
    },
    tileLayer() { return { addTo() { return this; } }; },
    marker(_point, options) {
      return {
        options,
        handlers: {},
        bindTooltip() { return this; },
        on(event, handler) {
          this.handlers[event] = handler;
          return this;
        },
        setIcon(icon) { this.icon = icon; },
        setZIndexOffset(offset) { this.options.zIndexOffset = offset; this.zIndexOffset = offset; },
        openTooltip() { this.tooltipOpened = true; }
      };
    },
    circleMarker() {
      return { bindTooltip() { return this; }, addTo(layer) { layer.addLayer(this); return this; } };
    }
  };
  function installClusterPlugin() {
    L.markerClusterGroup = options => {
      clusterOptions = options;
      return makeLayer('cluster-group', options);
    };
  }
  if (clusterPlugin && !lazy) installClusterPlugin();

  // Only a successfully loaded script contributes its runtime global, which is
  // what lets a test distinguish a JS failure from a stylesheet failure.
  function applyAssetSideEffect(source) {
    if (source.includes('leaflet/leaflet.js')) context.L = L;
    if (source.includes('leaflet.markercluster.js') && clusterPlugin) installClusterPlugin();
  }

  const window = {
    filteredCards: cards.slice(),
    uiText(key, vars, fallback) {
      if (key === 'map.clusterCount') return `Cluster of ${vars.count} facilities`;
      if (key === 'map.clusterSelectedCount') return `Cluster of ${vars.count} facilities, including the selected facility`;
      return fallback || key;
    },
    matchMedia() { return { matches: false }; },
    addEventListener() {},
    requestAnimationFrame(callback) { callback(); },
    scrollY: 0,
    scrollTo() {}
  };

  const context = vm.createContext({
    console,
    window,
    document,
    URL,
    queueMicrotask,
    L: lazy ? undefined : L,
    COORDS: {
      a: [35.68, 139.76],
      b: [35.69, 139.77],
      c: [35.70, 139.78]
    },
    userPos: userPosition,
    facilityCardName: card => `Facility ${card.dataset.facilityKey}`,
    requestAnimationFrame: callback => callback()
  });
  const source = `${mapSource}\n;globalThis.__mapApi = {\n  ensureMap, updateMapMarkers, selectFacilityCard, focusMapOnFacility, centerMapOnUser, clusterIcon, createMapMarkerLayer,\n  getMap: () => mapInstance, getMapLayer: () => mapLayer, getUserLayer: () => userLayer,\n  getMarker: key => markerByKey.get(key), getSelected: () => selectedMarkerKey,\n  setMapView, loadMapDependencies, clusterFailed: () => mapClusterEnhancementFailed\n};`;
  vm.runInContext(source, context, { filename: 'map.js' });
  return { api: context.__mapApi, cards, window, clusterOptions: () => clusterOptions, requestedAssets };
}

test('cluster layer uses only filtered markers and keeps selected facility state', () => {
  const fixture = loadMap();
  fixture.api.ensureMap();

  const layer = fixture.api.getMapLayer();
  const options = fixture.clusterOptions();
  assert.equal(layer.kind, 'cluster-group');
  assert.equal(layer.layers.length, 3);
  assert.equal(options.animate, false);
  assert.equal(options.disableClusteringAtZoom, 15);
  assert.equal(options.maxClusterRadius(10), 72);
  assert.equal(options.maxClusterRadius(12), 56);
  assert.equal(options.maxClusterRadius(13), 40);
  assert.equal(options.zoomToBoundsOnClick, true);
  assert.equal(options.spiderfyOnMaxZoom, true);
  assert.equal(fixture.api.getMarker('a').options.zIndexOffset, 0);

  fixture.api.selectFacilityCard('b');
  assert.equal(fixture.api.getSelected(), 'b');
  assert.equal(fixture.cards[1].classList.contains('is-selected'), true);
  assert.equal(layer.refreshCount, 1);
  assert.equal(fixture.api.getMarker('a').zIndexOffset, 0);
  assert.equal(fixture.api.getMarker('b').zIndexOffset, 1000);
  assert.equal(fixture.api.getMarker('c').zIndexOffset, 0);
  assert.match(fixture.api.getMarker('b').icon.options.html, /map-marker--selected/);

  const selectedCluster = {
    options: {},
    getChildCount: () => 23,
    getAllChildMarkers: () => [fixture.api.getMarker('a'), fixture.api.getMarker('b')]
  };
  const selectedClusterIcon = options.iconCreateFunction(selectedCluster);
  assert.match(selectedClusterIcon.options.className, /map-cluster-icon--medium/);
  assert.match(selectedClusterIcon.options.className, /map-cluster-icon--selected/);
  assert.match(selectedClusterIcon.options.html, /Cluster of 23 facilities, including the selected facility/);
  assert.equal(selectedCluster.options.title, 'Cluster of 23 facilities, including the selected facility');

  fixture.api.selectFacilityCard('c');
  assert.equal(fixture.api.getMarker('b').zIndexOffset, 0);
  assert.equal(fixture.api.getMarker('c').zIndexOffset, 1000);

  fixture.api.selectFacilityCard('b');
  assert.equal(fixture.api.getMarker('a').zIndexOffset, 0);
  assert.equal(fixture.api.getMarker('b').zIndexOffset, 1000);
  assert.equal(fixture.api.getMarker('c').zIndexOffset, 0);

  fixture.window.filteredCards = [fixture.cards[1]];
  fixture.api.updateMapMarkers();
  assert.equal(layer.layers.length, 1);
  assert.equal(fixture.api.getMarker('a'), undefined);
  assert.equal(fixture.api.getMarker('b').options.facilityKey, 'b');
  assert.equal(fixture.cards[1].classList.contains('is-selected'), true);

  fixture.api.selectFacilityCard('');
  assert.equal(fixture.api.getMarker('b').zIndexOffset, 0);
});

test('map falls back to individual markers when the cluster plugin is unavailable', () => {
  const fixture = loadMap({ clusterPlugin: false });
  fixture.api.ensureMap();

  const layer = fixture.api.getMapLayer();
  assert.equal(layer.kind, 'layer-group');
  assert.equal(layer.layers.length, 3);
});

test('manual map movement preserves the viewport while filtered markers refresh', () => {
  const fixture = loadMap();
  fixture.api.ensureMap();

  const map = fixture.api.getMap();
  assert.equal(map._hasUserMoved, false);

  map.setView([35.55, 139.55], 15, { animate: false });
  const center = [...map.center];
  const zoom = map.getZoom();

  fixture.window.filteredCards = [fixture.cards[0]];
  fixture.api.updateMapMarkers();

  assert.equal(map._hasUserMoved, true);
  assert.deepEqual([...map.center], center);
  assert.equal(map.getZoom(), zoom);
});

test('current-location layer remains separate from filtered cluster markers', () => {
  const fixture = loadMap({ userPosition: { lat: 35.681, lon: 139.767 } });
  fixture.api.ensureMap();

  assert.equal(fixture.api.getMapLayer().layers.length, 3);
  assert.equal(fixture.api.getUserLayer().layers.length, 1);
  fixture.api.centerMapOnUser();
  assert.equal(fixture.api.getMap().getZoom(), 14);
  assert.equal(fixture.api.getMap()._hasUserMoved, true);
});

test('facility map focus wins over the initial clustered viewport', async () => {
  const fixture = loadMap();

  await fixture.api.focusMapOnFacility('b');

  const map = fixture.api.getMap();
  assert.deepEqual([...map.center], [35.69, 139.77]);
  assert.equal(map.getZoom(), 15);
  assert.equal(map.pendingView, null);
  assert.equal(map._hasUserMoved, true);
  assert.equal(map.lastFitBounds.options.animate, false);
  assert.equal(fixture.api.getMapLayer().zoomToShowLayerCalls, 1);
  assert.equal(fixture.api.getMarker('b').tooltipOpened, true);
});

test('cluster dependency is locally loaded on Map request, cached, and built without default heatmap CSS', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const mapJs = fs.readFileSync(path.join(root, 'map.js'), 'utf8');
  const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const buildScript = fs.readFileSync(path.join(root, 'scripts', 'build-pages.js'), 'utf8');

  assert.equal(fs.existsSync(path.join(root, 'vendor', 'leaflet.markercluster', 'leaflet.markercluster.js')), true);
  assert.equal(fs.existsSync(path.join(root, 'vendor', 'leaflet.markercluster', 'MarkerCluster.css')), true);
  assert.match(mapJs, /vendor\/leaflet\.markercluster\/MarkerCluster\.css/);
  assert.match(mapJs, /vendor\/leaflet\.markercluster\/leaflet\.markercluster\.js/);
  assert.doesNotMatch(html, /<link[^>]+vendor\/leaflet\.markercluster\/MarkerCluster\.css/);
  assert.doesNotMatch(html, /<script[^>]+vendor\/leaflet\.markercluster\/leaflet\.markercluster\.js/);
  assert.doesNotMatch(html, /MarkerCluster\.Default\.css/);
  assert.match(serviceWorker, /vendor\/leaflet\.markercluster\/leaflet\.markercluster\.js/);
  assert.match(serviceWorker, /vendor\/leaflet\.markercluster\/MarkerCluster\.css/);
  assert.match(buildScript, /vendor\/leaflet\.markercluster/);
  assert.match(html, /body\.map-active \.map-mode-layout \.map-view\{order:1;width:100%;max-width:none;margin:0;\}/);
});

test('lazy Map request loads Leaflet core first and clusters when both halves arrive', async () => {
  const fixture = loadMap({ lazy: true });

  await fixture.api.setMapView(true);

  assert.deepEqual(fixture.requestedAssets.map(source => source.split('/').pop()), [
    'leaflet.css',
    'leaflet.js',
    'MarkerCluster.css',
    'leaflet.markercluster.js'
  ]);
  assert.equal(fixture.api.clusterFailed(), false);
  assert.equal(fixture.api.getMapLayer().kind, 'cluster-group');
  assert.equal(fixture.api.getMapLayer().layers.length, 3);
});

test('lazy Leaflet core failure fails the Map request instead of stranding the user', async () => {
  const fixture = loadMap({ lazy: true, failingAssets: ['leaflet/leaflet.js'] });

  await fixture.api.setMapView(true);

  assert.equal(fixture.api.getMap(), null);
  assert.equal(fixture.window.filteredCards.length, 3);
  await assert.rejects(() => fixture.api.loadMapDependencies());
});

test('lazy MarkerCluster script failure keeps the Map with ordinary markers', async () => {
  const fixture = loadMap({ lazy: true, failingAssets: ['leaflet.markercluster.js'] });

  await fixture.api.setMapView(true);

  assert.equal(fixture.api.clusterFailed(), true);
  const layer = fixture.api.getMapLayer();
  assert.equal(layer.kind, 'layer-group');
  assert.equal(layer.layers.length, 3);
  assert.notEqual(fixture.api.getMap(), null);
});

test('lazy MarkerCluster stylesheet failure also degrades to ordinary markers', async () => {
  const fixture = loadMap({ lazy: true, failingAssets: ['MarkerCluster.css'] });

  await fixture.api.setMapView(true);

  // The plugin global exists, but its visual half never arrived, so clustering
  // must not be used on the strength of the global alone.
  assert.equal(fixture.api.clusterFailed(), true);
  assert.equal(fixture.api.getMapLayer().kind, 'layer-group');
  assert.equal(fixture.api.getMapLayer().layers.length, 3);
  assert.notEqual(fixture.api.getMap(), null);
});

test('re-entering Map does not request the lazy dependencies twice', async () => {
  const fixture = loadMap({ lazy: true });

  await fixture.api.setMapView(true);
  const firstMap = fixture.api.getMap();
  const requestedOnce = fixture.requestedAssets.length;

  await fixture.api.setMapView(false);
  await fixture.api.setMapView(true);

  assert.equal(fixture.requestedAssets.length, requestedOnce);
  assert.equal(fixture.api.getMap(), firstMap);
  assert.equal(fixture.api.getMapLayer().layers.length, 3);
});

test('map.js separates required Leaflet core from the optional cluster enhancement', () => {
  const mapJs = fs.readFileSync(path.join(root, 'map.js'), 'utf8');
  const required = mapJs.match(/required: \[([\s\S]*?)\n  \]/)[1];
  const optional = mapJs.match(/optional: \[([\s\S]*?)\n  \]/)[1];

  assert.match(required, /vendor\/leaflet\/leaflet\.css/);
  assert.match(required, /vendor\/leaflet\/leaflet\.js/);
  assert.doesNotMatch(required, /markercluster|MarkerCluster/i);
  assert.match(optional, /vendor\/leaflet\.markercluster\/MarkerCluster\.css/);
  assert.match(optional, /vendor\/leaflet\.markercluster\/leaflet\.markercluster\.js/);
});
