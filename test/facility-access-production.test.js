const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const productionPath = path.join(root, 'data/facility-access-presentation.js');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const FALLBACK_KEYS = ['11', '18', '21', '41', '51', '87'];

function loadProduction() {
  const context = { console };
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(productionPath, 'utf8')}\nglobalThis.__production = FACILITY_ACCESS_PRESENTATION;`,
    context,
    { filename: 'data/facility-access-presentation.js' },
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
  const context = {
    console,
    URL,
    window: { location: { href: 'https://example.test/' } },
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[character]));
    },
  };
  vm.createContext(context);
  const seamStart = indexHtml.indexOf('const VISIT_INFO_OFFICIAL_SITE_TAIL');
  const seamEnd = indexHtml.indexOf('/*\n * Facility Introduction resolution.');
  assert.ok(seamStart >= 0 && seamEnd > seamStart, 'access renderer seam is present');
  vm.runInContext([
    fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'data/i18n/facilities.en.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'data/i18n/facilities.zh.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8'),
    fs.readFileSync(productionPath, 'utf8'),
    'globalThis.t = window.t; globalThis.getAppLanguage = window.getAppLanguage; globalThis.tField = window.tField; globalThis.__data = DATA;',
    indexHtml.slice(seamStart, seamEnd),
    'globalThis.__production = FACILITY_ACCESS_PRESENTATION; globalThis.__api = { getApprovedAccessPresentation, renderVisitInfoRow };',
  ].join('\n'), context, { filename: 'facility-access-runtime.js' });
  return context;
}

function productionByKey(entries) {
  return new Map(entries.map(entry => [entry.key, entry]));
}

test('Access production projection covers accepted structured entries and keeps raw fallbacks', () => {
  const production = loadProduction();
  const facilityKeys = new Set(loadFacilities().map(f => f._key));
  assert.equal(production.entries.length, 102);
  const byKey = productionByKey(production.entries);
  assert.equal(byKey.size, production.entries.length);
  for (const entry of production.entries) assert.ok(facilityKeys.has(entry.key));
  for (const key of FALLBACK_KEYS) assert.equal(byKey.has(key), false, `${key} must remain raw fallback`);
});

test('Access projection has accepted shape and preserves runtime text exactly', () => {
  const productionSource = fs.readFileSync(productionPath, 'utf8');
  const production = loadProduction();
  const byKey = new Map(loadFacilities().map(f => [f._key, f]));
  assert.equal(production.metadata.approved_on, '2026-08-12');
  assert.doesNotMatch(productionSource, /\b(?:review_notes|unparsed_segments|needs_review|parse_status|source_incomplete)\b/);
  for (const entry of production.entries) {
    assert.deepEqual(Object.keys(entry).sort(), ['display_lines_ja', 'key']);
    assert.ok(Array.isArray(entry.display_lines_ja) && entry.display_lines_ja.length);
    assert.equal(entry.display_lines_ja.join('/'), byKey.get(entry.key).access[0], `${entry.key}: runtime text was rewritten`);
  }
});

test('Access display segmentation keeps the reviewed special cases source-preserving', () => {
  const byKey = productionByKey(loadProduction().entries);
  assert.equal(byKey.get('52').display_lines_ja.length, 3);
  assert.deepEqual(byKey.get('52').display_lines_ja, [
    '東京メトロ東西線「早稲田駅」1番出口徒歩10分',
    '都営大江戸線「牛込柳町駅」東口徒歩15分',
    '都営バス(白61) 「牛込保健センター前」下車徒歩2分',
  ]);
  assert.equal(byKey.get('23').display_lines_ja[1], 'JR総武線「飯田橋駅」東口、東京メトロ有楽町線・東西線・南北線・都営大江戸線「飯田橋駅」B1出口徒歩13分');
  assert.match(byKey.get('20').display_lines_ja[0], /3番出口直結$/);
  assert.equal(byKey.get('97').display_lines_ja.length, 1);
  assert.match(byKey.get('97').display_lines_ja[0], /「創価大学正門\/東京富士美術館」/);
});

test('Access adapter uses JA structured lines, keeps raw fallback cases, and rejects source drift', () => {
  const facilities = loadFacilities();
  const byKey = new Map(facilities.map(facility => [facility._key, facility]));
  const context = loadRuntime();
  const api = context.__api;

  context.window.setAppLanguage('ja');
  const structured52 = api.getApprovedAccessPresentation(byKey.get('52'));
  assert.ok(structured52);
  assert.equal(structured52.display_lines_ja.length, 3);
  const rendered52 = api.renderVisitInfoRow('', 'field.access', structured52.display_lines_ja, 'access', '', byKey.get('52').access);
  assert.equal((rendered52.html.match(/<p /g) || []).length, 3);
  assert.doesNotMatch(rendered52.html, /\[object Object\]/);

  for (const key of FALLBACK_KEYS) {
    assert.equal(api.getApprovedAccessPresentation(byKey.get(key)), null, `${key} must use raw fallback`);
  }
  const raw18 = byKey.get('18').access[0];
  const rendered18 = api.renderVisitInfoRow('', 'field.access', byKey.get('18').access, 'access', '', byKey.get('18').access);
  assert.match(rendered18.html, /半蔵門線/);
  assert.match(rendered18.html, new RegExp(raw18.slice(0, 12)));

  const drifted52 = { ...byKey.get('52'), access: ['different source text'] };
  assert.equal(api.getApprovedAccessPresentation(drifted52), null);
});

test('Access renderer keeps EN / ZH localized raw access and reuses the existing renderer seam', () => {
  const facilities = loadFacilities();
  const facility52 = facilities.find(facility => facility._key === '52');
  const context = loadRuntime();
  const production = context.__production;
  const structured52 = production.entries.find(entry => entry.key === '52');
  for (const language of ['en', 'zh']) {
    context.window.setAppLanguage(language);
    const rawLocalizedAccess = context.tField(facility52, 'access', facility52.access || []);
    const values = Array.isArray(rawLocalizedAccess) ? rawLocalizedAccess : [rawLocalizedAccess];
    assert.ok(values.length && values.every(value => value && !/[぀-ヿ]/.test(value)));
    assert.notDeepEqual(values, structured52.display_lines_ja);
    const rendered = context.__api.renderVisitInfoRow('', 'field.access', rawLocalizedAccess, 'access', '', facility52.access);
    assert.ok(rendered.html);
  }

  const cardStart = indexHtml.indexOf('function renderCard(f, areaName = \'\', expanded = false){');
  const cardEnd = indexHtml.indexOf('// One source of truth for both the list and map views.', cardStart);
  const cardSource = indexHtml.slice(cardStart, cardEnd);
  assert.match(cardSource, /const rawLocalizedAccess =/);
  assert.match(cardSource, /const approvedAccess = getApprovedAccessPresentation\(f\)/);
  assert.match(cardSource, /const useStructuredJa =/);
  assert.match(cardSource, /const displayAccess = useStructuredJa \? approvedAccess\.display_lines_ja : rawLocalizedAccess/);
  assert.match(cardSource, /renderVisitInfoRow\(ICON\.access, 'field\.access', displayAccess, 'access', canonicalOfficialUrl, f\.access\)/);
  assert.match(indexHtml, /data\/facility-access-presentation\.js/);
  assert.doesNotMatch(indexHtml, /data\/review\//);
  assert.match(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), /data\/facility-access-presentation\.js/);
});

test('Access drift guard accepts slim and legacy cached data without normalizing source equality', () => {
  const createModel = require('../facility-presentation-model.js');
  const facility = { _key: 'fixture', access: [' Station A /Station B '] };
  const slim = { key: 'fixture', display_lines_ja: [' Station A ', 'Station B '] };
  const legacy = { ...slim, source_text_ja: facility.access[0], source_fingerprint: 'unused old cache metadata' };
  for (const entry of [slim, legacy]) {
    const model = createModel({ FACILITY_ACCESS_PRESENTATION: { entries: [entry] } });
    assert.equal(model.getFacilityAccessProjection(facility).state, 'APPROVED');
    assert.equal(model.getFacilityAccessProjection({ ...facility, access: ['Station A/Station B'] }).state, 'RAW_FALLBACK');
    assert.equal(model.getFacilityAccessProjection({ ...facility, access: ['new route'] }).state, 'RAW_FALLBACK');
  }
});
