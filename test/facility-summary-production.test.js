const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const productionPath = path.join(root, 'data/facility-summaries.js');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function loadProduction() {
  const context = { console };
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(productionPath, 'utf8')}\nglobalThis.__production = FACILITY_PRODUCT_SUMMARIES;`,
    context,
    { filename: 'data/facility-summaries.js' },
  );
  return JSON.parse(JSON.stringify(context.__production));
}

function loadFacilities() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8')};globalThis.__data = DATA;`,
    context,
    { filename: 'data/facilities.js' },
  );
  return context.__data.flatMap(area => area.facilities || []);
}

function loadRuntime() {
  let language = 'ja';
  const context = {
    console,
    window: {},
    getAppLanguage() {
      return language;
    },
    setRuntimeLanguage(value) {
      language = value;
    },
    t(key, values = {}) {
      if (key === 'facility.intro') return '施設紹介';
      if (key === 'facility.brochureSource') return `公式パンフレット p.${values.page}`;
      if (key === 'facility.introJapaneseSource') return '日本語原文';
      return key;
    },
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[character]));
    },
    ICON: { ext: '↗' },
  };
  vm.createContext(context);
  const source = indexHtml;
  const start = source.indexOf('function getFacilityBrochureVenues(');
  const end = source.indexOf('function renderCard(');
  assert.ok(start >= 0 && end > start, 'summary renderer seam is present');
  vm.runInContext([
    fs.readFileSync(path.join(root, 'data/facility-brochure.js'), 'utf8'),
    fs.readFileSync(productionPath, 'utf8'),
    source.slice(start, end),
    'globalThis.__production = FACILITY_PRODUCT_SUMMARIES; globalThis.__api = { getApprovedFacilitySummary, renderApprovedFacilitySummary, renderFacilityBrochureInfo, renderFacilityDiscoveryPreview };',
  ].join('\n'), context, { filename: 'facility-summary-runtime.js' });
  return context;
}

function entriesByFacility(entries) {
  return new Map(entries.reduce((groups, entry) => {
    const current = groups.get(entry.facility_key) || [];
    current.push(entry);
    groups.set(entry.facility_key, current);
    return groups;
  }, new Map()));
}

test('Summary production projection covers every accepted facility and venue', () => {
  const production = loadProduction();
  assert.equal(production.entries.length, 109);
  assert.equal(new Set(production.entries.map(entry => entry.venue_key)).size, 109);
  assert.deepEqual([...new Set(production.entries.map(entry => entry.facility_key))].sort(), Array.from(loadFacilities(), f => f._key).sort());
  assert.equal(production.entries.some(entry => entry.facility_key === '50'), true);
});

test('Summary production projection has accepted shape and excludes review-only fields', () => {
  const productionSource = fs.readFileSync(productionPath, 'utf8');
  const production = loadProduction();
  assert.equal(production.metadata.approved_on, '2026-08-17');
  assert.doesNotMatch(productionSource, /\b(?:facts_used|source_excerpt_for_review|review_notes|needs_review|review_status|classification|atomic_facts|selected_facts|provenance|decision|rationale)\b/);
  for (const entry of production.entries) {
    assert.deepEqual(Object.keys(entry).sort(), ['facility_key', 'source', 'summary', 'venue_key']);
    assert.deepEqual(Object.keys(entry.summary).sort(), ['en', 'ja', 'zh']);
    assert.deepEqual(Object.keys(entry.source).sort(), ['label', 'page', 'url']);
  }
});

test('Summary production mapping preserves special identities and No.103 one-to-many venues', () => {
  const byFacility = entriesByFacility(loadProduction().entries);
  assert.equal(byFacility.get('36').length, 1);
  assert.equal(byFacility.get('36')[0].venue_key, '36-tokyo-city-view');
  assert.equal(byFacility.get('36-2').length, 1);
  assert.equal(byFacility.get('36-2')[0].venue_key, '36-mori-art-museum');
  assert.equal(byFacility.get('32-WHAT-MUSEUM').length, 1);
  assert.equal(byFacility.get('58-NTT-ICC').length, 1);
  assert.equal(byFacility.get('103').length, 2);
  assert.deepEqual(byFacility.get('103').map(entry => entry.venue_key), [
    '103-yokohama-urban-history',
    '103-eurasian-cultures',
  ]);
});

test('Summary runtime uses the same approved copy in Browse and Detail for every facility', () => {
  const facilities = loadFacilities();
  const facility1 = facilities.find(facility => facility._key === '1');
  const facility20 = facilities.find(facility => facility._key === '20');
  const facility52 = facilities.find(facility => facility._key === '52');
  const facility50 = facilities.find(facility => facility._key === '50');
  const facility103 = facilities.find(facility => facility._key === '103');
  const context = loadRuntime();
  const api = context.__api;
  const production = context.__production;

  assert.equal(api.getApprovedFacilitySummary(facility52).length, 1);
  assert.equal(api.getApprovedFacilitySummary(facility50).length, 1);
  const detail20 = api.renderFacilityBrochureInfo(facility20);
  const detail52 = api.renderFacilityBrochureInfo(facility52);
  const detail50 = api.renderFacilityBrochureInfo(facility50);
  assert.match(detail52, /夏目漱石/);
  assert.match(detail52, /^<div class="facility-intro-body">/);
  assert.doesNotMatch(detail52, /facility-intro-row|facility-intro-mark|facility-intro-heading|facility-detail-section-heading/);
  assert.doesNotMatch(detail20, /class="facility-intro-source"/);
  assert.doesNotMatch(detail52, /class="facility-intro-source"/);
  assert.doesNotMatch(detail50, /class="facility-intro-source"/);
  assert.match(detail50, /地域総合文学館/);
  assert.doesNotMatch(detail50, /文学との新しい出会いの場/);

  const approved52 = production.entries.find(entry => entry.facility_key === '52');
  assert.deepEqual(Object.keys(approved52.source).sort(), ['label', 'page', 'url']);
  assert.ok(approved52.source.url);
  assert.equal(approved52.source.url, 'https://soseki-museum.jp/exhibition-room/');
  assert.equal(approved52.source.page, null);

  const approved103 = api.getApprovedFacilitySummary(facility103);
  assert.equal(approved103.length, 2);
  const detail103 = api.renderFacilityBrochureInfo(facility103);
  assert.doesNotMatch(detail103, /class="facility-intro-source"/);
  assert.match(detail103, /<strong>横浜都市発展記念館<\/strong>/);
  assert.match(detail103, /<strong>横浜ユーラシア文化館<\/strong>/);
  assert.ok(detail103.includes(approved103[0].summary.ja));
  assert.ok(detail103.includes(approved103[1].summary.ja));

  const discovery52 = api.renderFacilityDiscoveryPreview(facility52);
  const approved52Browse = api.getApprovedFacilitySummary(facility52);
  assert.ok(discovery52.includes(approved52Browse[0].summary.ja));
  assert.doesNotMatch(discovery52, /夏目漱石が晩年を過ごし/);
  const discovery1 = api.renderFacilityDiscoveryPreview(facility1);
  const approved1 = api.getApprovedFacilitySummary(facility1);
  assert.equal(approved1.length, 1);
  assert.ok(discovery1.includes(approved1[0].summary.ja));
  assert.doesNotMatch(discovery1, /提灯屋と裏長屋の再現展示や/);
  assert.match(indexHtml, /data\/facility-summaries\.js/);
  assert.doesNotMatch(indexHtml, /data\/review\//);
  const discoverySourceStart = indexHtml.indexOf('function renderFacilityDiscoveryPreview(');
  const discoverySourceEnd = indexHtml.indexOf('function getApprovedFacilitySummary(');
  assert.doesNotMatch(indexHtml.slice(discoverySourceStart, discoverySourceEnd), /getApprovedFacilitySummary/);
  assert.match(indexHtml, /const body = card\.querySelector\('\.facility-detail-content'\)\?\.cloneNode\(true\)/);
  assert.match(indexHtml, /const drawerDetailTarget =/);
  assert.match(indexHtml, /const mapDetailTarget =/);
});

test('Summary runtime supports JA, EN and ZH through the existing language state', () => {
  const facilities = loadFacilities();
  const facility1 = facilities.find(facility => facility._key === '1');
  const facility52 = facilities.find(facility => facility._key === '52');
  const facility50 = facilities.find(facility => facility._key === '50');
  const context = loadRuntime();
  const summary1 = context.__production.entries.find(entry => entry.facility_key === '1');
  const summary = context.__production.entries.find(entry => entry.facility_key === '52');
  const summary50 = context.__production.entries.find(entry => entry.facility_key === '50');
  for (const language of ['ja', 'en', 'zh']) {
    context.setRuntimeLanguage(language);
    const rendered = context.__api.renderFacilityBrochureInfo(facility52);
    const discovery = context.__api.renderFacilityDiscoveryPreview(facility1);
    const rendered50 = context.__api.renderFacilityBrochureInfo(facility50);
    assert.ok(rendered.includes(context.escapeHtml(summary.summary[language])));
    assert.ok(discovery.includes(context.escapeHtml(summary1.summary[language])));
    assert.ok(rendered50.includes(context.escapeHtml(summary50.summary[language])));
    assert.doesNotMatch(rendered, /class="facility-intro-source"/);
    assert.doesNotMatch(rendered50, /class="facility-intro-source"/);
  }
});
