const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'i18n', 'ui.js'), 'utf8');

function loadConfig() {
  const context = vm.createContext({});
  vm.runInContext(`${fs.readFileSync(path.join(root, 'config.js'), 'utf8')};globalThis.__config = CONFIG;`, context, { filename: 'config.js' });
  return JSON.parse(JSON.stringify(context.__config));
}

test('Footer uses two disclosures and has no legacy source prose node', () => {
  assert.match(html, /<details class="footer-disclosure site-about">/);
  assert.match(html, /<details class="footer-disclosure site-sources">/);
  assert.match(html, /id="footerCoreSources"/);
  assert.match(html, /id="footerExhibitionSources"/);
  assert.match(html, /id="footerRecommendations"/);
  assert.match(html, /data-i18n="footer\.unofficialShort"/);
  assert.match(html, /id="footerOfficialLink"[^>]+target="_blank"[^>]+rel="noopener"/);
  assert.match(html, /class="footer-map-credit"[^>]+data-i18n="map\.credit"/);
  assert.doesNotMatch(html, /id="sourceNote"/);
  assert.doesNotMatch(html, /footer\.(?:sourceRole|sourceBody)/);
});

test('Footer source data is grouped, machine-readable, and keeps historical recommendations', () => {
  const config = loadConfig();
  assert.deepEqual(Object.keys(config.sources).sort(), ['core', 'exhibitions', 'recommendations']);
  assert.deepEqual(config.sources.core.map(source => source.id), ['grutto-official', 'facility-official-sites']);
  assert.deepEqual(config.sources.exhibitions.map(source => source.id), ['edition-exhibition-list']);
  assert.deepEqual(config.sources.recommendations.map(source => [source.periodStart, source.periodEnd]), [
    ['2026-10', '2026-11'],
    ['2026-09', '2026-10'],
    ['2026-08', '2026-09'],
    ['2026-07', '2026-08']
  ]);
  assert.match(html, /function formatFooterPeriod\(periodStart, periodEnd\)/);
  assert.match(html, /function sortFooterRecommendations\(recommendations\)/);
  assert.match(html, /source\?\.admissionUrl \? footerExternalLink/);
  assert.match(html, /source\?\.discountUrl \? footerExternalLink/);
});

test('Footer i18n owns the new semantic groups in all supported languages', () => {
  const keys = [
    'footer.about', 'footer.sources', 'footer.coverageHeading', 'footer.passBasicsHeading',
    'footer.recordsHeading', 'footer.displayHeading', 'footer.valueHeading', 'footer.statusHeading',
    'footer.coreSourcesHeading', 'footer.exhibitionSourcesHeading', 'footer.recommendationsHeading',
    'footer.unofficialShort', 'footer.officialSite', 'footer.admissionSource', 'footer.discountSource'
  ];
  const context = vm.createContext({ window: {} });
  vm.runInContext(ui + ';globalThis.__tables = window.UI_STRINGS;', context, { filename: 'i18n/ui.js' });
  for (const language of ['ja', 'en', 'zh']) {
    for (const key of keys) assert.equal(typeof context.__tables[language][key], 'string', `${language}.${key}`);
  }
  for (const legacyKey of ['footer.sourceRole', 'footer.sourceBody', 'footer.unofficial', 'footer.valueNote', 'footer.statusNote']) {
    const escapedKey = legacyKey.replace('.', '\\.');
    assert.doesNotMatch(ui, new RegExp(`['"]${escapedKey}['"]`));
  }
});

test('Footer About and Sources use explicit semantic placement hooks', () => {
  assert.match(html, /<section class="footer-section footer-section--display">/);
  assert.match(html, /<section class="footer-section footer-section--terms">/);
  assert.match(html, /\.footer-display-grid\{display:grid;gap:14px;\}/);
  assert.match(html, /@media \(min-width:760px\)\{[\s\S]*?\.footer-section--display,[\s\S]*?\.footer-section--terms\{grid-column:1 \/ -1;\}[\s\S]*?\.footer-display-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
  assert.match(html, /footer\.site-footer \.footer-terms-body\{max-width:min\(var\(--measure\),60ch,42rem\);color:var\(--ink-soft\);\}/);
  assert.doesNotMatch(html, /footer-section[^}]*:nth-child/);
  assert.doesNotMatch(html, /footer-sections--(?:about|sources)[^}]*:nth-child/);

  const displayStart = html.indexOf('<section class="footer-section footer-section--display">');
  const termsStart = html.indexOf('<section class="footer-section footer-section--terms">');
  assert.ok(displayStart >= 0 && termsStart > displayStart);
  const display = html.slice(displayStart, termsStart);
  assert.match(display, /data-i18n="footer\.valueHeading"/);
  assert.match(display, /data-i18n="footer\.statusHeading"/);
});

test('Footer official destination remains the configured Hero destination', () => {
  const heroUrl = html.match(/id="heroOfficialLink" href="([^"]+)"/)?.[1];
  const configuredUrl = loadConfig().sources.core.find(source => source.type === 'official')?.url;
  assert.ok(heroUrl);
  assert.equal(configuredUrl, heroUrl);
  assert.match(html, /id="footerOfficialLink"[^>]+target="_blank"[^>]+rel="noopener"[^>]+hidden[^>]+data-i18n="hero\.officialLink"/);
  assert.match(html, /officialLink\.href = encodeURI\(officialSource\.url\)/);
});
