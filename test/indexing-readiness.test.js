const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const outputDir = path.join(root, '.cloudflare-dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'i18n', 'ui.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'config.js'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const registry = require('../scripts/facility-direct-url-registry.js');
const REFERENCE_DATE = '2026-08-25';

const expectedTitles = {
  ja: '東京・ミュージアム ぐるっとパス2026 非公式ガイド | PYOKO',
  en: 'Tokyo Museum Grutto Pass 2026 Unofficial Guide | PYOKO',
  zh: '东京·博物馆 Grutto Pass 2026 非官方指南 | PYOKO'
};

function extractMeta(source, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`<meta\\s+${attribute}="${escaped}"[^>]+content="([^"]*)"`, 'i'))?.[1] || '';
}

function extractLocs(source) {
  return [...source.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]);
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = path.relative(outputDir, path.join(directory, entry.name));
    if (entry.isDirectory()) return listFiles(path.join(directory, entry.name));
    return [relative.split(path.sep).join('/')];
  });
}

function buildProductionArtifact() {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build-pages.js')], {
    env: { ...process.env, PYOKO_BUILD_REFERENCE_DATE: REFERENCE_DATE },
    cwd: root,
    stdio: 'pipe'
  });
}

function readProductionSitemap() {
  buildProductionArtifact();
  return fs.readFileSync(path.join(outputDir, 'sitemap.xml'), 'utf8');
}

function generalCrawlerBlocks(resourcePath) {
  const generalStart = robots.indexOf('User-agent: *');
  const firstNamedCrawler = robots.search(/^User-agent:\s+GPTBot\s*$/m);
  assert.ok(generalStart >= 0 && firstNamedCrawler > generalStart, 'general robots group must precede named crawler rules');
  const generalGroup = robots.slice(generalStart, firstNamedCrawler);
  const disallows = [...generalGroup.matchAll(/^Disallow:\s*(\S*)\s*$/gm)]
    .map(match => match[1])
    .filter(Boolean);
  const path = resourcePath.startsWith('/') ? resourcePath : '/' + resourcePath;
  return disallows.some(rule => rule === '/' || path.startsWith(rule));
}

test('source metadata owns the app title and keeps the deadline in product UI only', () => {
  const initialTitle = html.match(/<title>([^<]*)<\/title>/i)?.[1] || '';
  assert.equal(initialTitle, expectedTitles.ja);
  assert.doesNotMatch(initialTitle, /2027|最終利用日|Last use date|最晚使用日/);

  const applyConfigStart = html.indexOf('function applyConfig');
  const applyConfigEnd = html.indexOf('\nfunction updateHeroCoverage', applyConfigStart);
  const applyConfig = html.slice(applyConfigStart, applyConfigEnd);
  assert.match(applyConfig, /document\.title = localizedTitle;/);
  assert.doesNotMatch(applyConfig, /pageDeadline/);
  assert.doesNotMatch(applyConfig, /document\.title\s*=\s*`[^`]*\$\{pageDeadline\}/);

  assert.match(config, /passEnd:\s*'2027-03-31'/);
  assert.match(html, /passTrackerEditionFinal/);
  assert.match(html, /formatUiDate\(CONFIG\.passEnd\)/);

  const context = vm.createContext({
    window: {
      location: { href: 'http://localhost/index.html' },
      navigator: { language: 'ja' },
      localStorage: { getItem: () => null, setItem: () => {} }
    }
  });
  vm.runInContext(ui, context, { filename: 'i18n/ui.js' });
  for (const [language, title] of Object.entries(expectedTitles)) {
    context.window.setAppLanguage(language);
    assert.equal(context.window.t('app.title', { year: 2026 }), title);
    assert.match(title, /\| PYOKO$/);
  }
});

test('source canonical metadata and crawler policy are production-safe', () => {
  assert.equal((html.match(/<link\s+rel="canonical"/gi) || []).length, 1);
  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/pyoko\.jp\/"/i);
  assert.equal(extractMeta(html, 'property', 'og:url'), 'https://pyoko.jp/');
  assert.equal(extractMeta(html, 'property', 'og:image'), 'https://pyoko.jp/assets/social/grutto-pass-share.png');
  assert.equal(extractMeta(html, 'name', 'twitter:image'), 'https://pyoko.jp/assets/social/grutto-pass-share.png');
  assert.ok(extractMeta(html, 'name', 'description').trim());
  assert.doesNotMatch(html, /<meta[^>]+(?:noindex|nofollow)/i);
  assert.doesNotMatch(html, /(?:grutto-pass|gruttopass)\.pages\.dev/i);
  assert.doesNotMatch(html, /X-Robots-Tag/i);

  assert.match(robots, /^User-agent: \*$/m);
  assert.doesNotMatch(robots, /^User-agent: \*\s*\n\s*Disallow: \/\s*$/m);
  assert.match(robots, /^Sitemap: https:\/\/pyoko\.jp\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /Sitemap:\s*https:\/\/pyoko\.jp\/$/m);

  const sitemap = readProductionSitemap();
  const locs = extractLocs(sitemap);
  assert.deepEqual(locs, [
    'https://pyoko.jp/',
    'https://pyoko.jp/facilities/',
    ...registry.PUBLICATION_APPROVED.map(key => `https://pyoko.jp/facilities/${registry.FACILITY_URL_SLUGS[key]}/`),
    'https://pyoko.jp/about/',
    'https://pyoko.jp/about/data/',
    'https://pyoko.jp/about/pass-tracker/',
    'https://pyoko.jp/guides/grutto-pass-before-you-go/'
  ]);
  assert.match(sitemap, /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  for (const loc of locs) {
    const url = new URL(loc);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'pyoko.jp');
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
  }
});

test('general search crawlers can fetch the resources required to render the public homepage', () => {
  const requiredResources = [
    'index.html',
    'i18n/ui.js',
    'config.js',
    'data/holidays.js',
    'data/facilities.js',
    'data/facility-corrections.js',
    'data/facility-brochure.js',
    'data/facility-summaries.js',
    'data/facility-access-presentation.js',
    'data/exhibition-meta.js',
    'exhibition-meta-runtime.js',
    'data/exhibition-links.js',
    'data/i18n/facilities.en.js',
    'data/i18n/facilities.zh.js',
    'data/search-aliases.js',
    'data/facility-pass-benefits.js',
    'data/facility-legacy-risk.js',
    'data/facility-official-sources.js',
    'official-source-runtime.js',
    'data/facility-pass-time-scope.js',
    'pass-time-scope-runtime.js',
    'coords.js',
    'status.js',
    'phase1/hours.js',
    'phase1/phase1-open-now.js',
    'phase2/phase2-nearby.js',
    'map.js',
    'facility-presentation-model.js',
    'vendor/leaflet/leaflet.js',
    'vendor/leaflet/leaflet.css',
    'vendor/leaflet.markercluster/leaflet.markercluster.js',
    'vendor/leaflet.markercluster/MarkerCluster.css'
  ];
  assert.equal(generalCrawlerBlocks('/'), false, 'the homepage must remain fetchable');
  for (const resource of requiredResources)
    assert.equal(generalCrawlerBlocks(resource), false, resource + ' is required for search rendering');
});

test('named AI crawler policy separates discovery from model training', () => {
  const allowed = [
    'OAI-SearchBot',
    'ChatGPT-User',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Applebot',
    'Amzn-SearchBot',
    'Amzn-User'
  ];
  const blocked = [
    'GPTBot',
    'ClaudeBot',
    'anthropic-ai',
    'Applebot-Extended',
    'Google-Extended',
    'Amazonbot',
    'CCBot',
    'Bytespider',
    'meta-externalagent',
    'Diffbot',
    'omgili'
  ];

  for (const agent of allowed)
    assert.match(robots, new RegExp('^User-agent: ' + agent + '$\\nAllow: /$', 'm'));
  for (const agent of blocked)
    assert.match(robots, new RegExp('^User-agent: ' + agent + '$\\nDisallow: /$', 'm'));

  assert.doesNotMatch(robots, /^User-agent: Googlebot$/m);
});

test('fresh production artifact contains the canonical sitemap and no internal release files', () => {
  buildProductionArtifact();
  const files = listFiles(outputDir);
  for (const required of ['index.html', 'robots.txt', 'sitemap.xml', 'manifest.json', 'LICENSE', 'DATA_AND_CONTENT_TERMS.md', 'THIRD-PARTY-NOTICES.md']) {
    assert.ok(files.includes(required), `${required} is missing from production output`);
  }

  for (const excluded of [
    'AGENTS.md',
    'data/review/',
    'phase1/phase1-review.md',
    'phase1/phase1-integration.md',
    'phase2/phase2-integration.md',
    'phase2/build-coords.js',
    'docs/',
    'scripts/',
    'test/',
    'tests/'
  ]) {
    assert.equal(files.some(file => file === excluded || file.startsWith(excluded)), false, `${excluded} leaked into production output`);
  }
  assert.equal(files.some(file => file.endsWith('.map')), false, 'source map leaked into production output');
  assert.ok(files.includes('data/facility-brochure.js'), 'required brochure runtime projection is missing from production output');
  assert.ok(files.includes('facility-presentation-model.js'), 'shared facility presentation model is missing from production output');
  const facilityPages = files.filter(file => /^facilities\/[^/]+\/index\.html$/.test(file));
  assert.deepEqual(
    facilityPages.sort(),
    registry.PUBLICATION_APPROVED.map(key => `facilities/${registry.FACILITY_URL_SLUGS[key]}/index.html`).sort()
  );
  assert.ok(files.includes('facilities/index.html'));
  assert.ok(files.includes('facilities/facility-pages.css'));
  assert.equal(files.includes('data/review/facility-brochure-prose.json'), false, 'brochure prose review artifact leaked into production output');

  const artifactHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');
  const artifactRobots = fs.readFileSync(path.join(outputDir, 'robots.txt'), 'utf8');
  const artifactSitemap = fs.readFileSync(path.join(outputDir, 'sitemap.xml'), 'utf8');
  const publicArtifact = [artifactHtml, artifactRobots, artifactSitemap].join('\n');
  assert.equal(extractLocs(artifactSitemap).length, 15);
  assert.deepEqual(extractLocs(artifactSitemap), [
    'https://pyoko.jp/',
    'https://pyoko.jp/facilities/',
    ...registry.PUBLICATION_APPROVED.map(key => `https://pyoko.jp/facilities/${registry.FACILITY_URL_SLUGS[key]}/`),
    'https://pyoko.jp/about/',
    'https://pyoko.jp/about/data/',
    'https://pyoko.jp/about/pass-tracker/',
    'https://pyoko.jp/guides/grutto-pass-before-you-go/'
  ]);
  assert.equal(
    (artifactSitemap.match(/https:\/\/pyoko\.jp\/guides\/grutto-pass-before-you-go\//g) || []).length,
    1,
    'the guide canonical URL must appear exactly once in the sitemap'
  );
  assert.match(artifactRobots, /^Sitemap: https:\/\/pyoko\.jp\/sitemap\.xml$/m);
  assert.match(artifactHtml, /<title>東京・ミュージアム ぐるっとパス2026 非公式ガイド \| PYOKO<\/title>/);
  assert.doesNotMatch(publicArtifact, /(?:grutto-pass|gruttopass)\.pages\.dev/i);
  assert.doesNotMatch(publicArtifact, /noindex/i);
  assert.doesNotMatch(publicArtifact, /X-Robots-Tag/i);
  assert.match(artifactHtml, /<a href="\/facilities\/">施設ページ一覧<\/a>/);
  assert.doesNotMatch(artifactHtml, /FACILITY_INDEX_LINK_SLOT/);
  assert.match(artifactHtml, /<a href="\/guides\/grutto-pass-before-you-go\/">ぐるっとパスの使い方ガイド<\/a>/);

  const facilityIndex = fs.readFileSync(path.join(outputDir, 'facilities', 'index.html'), 'utf8');
  const indexHrefs = [...facilityIndex.matchAll(/href="(\/facilities\/[^"/]+\/)"/g)].map(match => match[1]);
  assert.deepEqual(indexHrefs, registry.PUBLICATION_APPROVED.map(key => `/facilities/${registry.FACILITY_URL_SLUGS[key]}/`));
  assert.doesNotMatch(facilityIndex, /shitamachi-museum|not-a-real-facility/);
  assert.equal(files.some(file => file.includes('not-a-real-facility')), false);
  assert.equal(files.some(file => file.includes('shitamachi-museum')), false);

  const sw = fs.readFileSync(path.join(outputDir, 'sw.js'), 'utf8');
  assert.doesNotMatch(sw, /facilities\/.*index\.html/);
  assert.doesNotMatch(sw, /facility-pages\.css/);
  assert.doesNotMatch(sw, /guides\//, 'the owned guide must not be install-time precached');
});

test('OWNED-GUIDE-001 owned guide is a self-contained, indexable static page', () => {
  buildProductionArtifact();
  const guideDir = path.join(outputDir, 'guides', 'grutto-pass-before-you-go');
  const files = listFiles(outputDir).filter(file => file.startsWith('guides/'));

  // Explicit two-file allowlist, not a copied `guides/` directory: guard
  // against the mechanism silently widening to publish anything else placed
  // under guides/ in the future.
  assert.deepEqual(files.sort(), [
    'guides/grutto-pass-before-you-go/index.html',
    'guides/grutto-pass-before-you-go/pyoko-facility-detail-example.png'
  ]);

  const guideHtml = fs.readFileSync(path.join(guideDir, 'index.html'), 'utf8');

  assert.equal((guideHtml.match(/<link\s+rel="canonical"/gi) || []).length, 1);
  assert.match(guideHtml, /<link\s+rel="canonical"\s+href="https:\/\/pyoko\.jp\/guides\/grutto-pass-before-you-go\/">/);
  assert.match(guideHtml, /<h1>ぐるっとパス2026で行き先を決める前に確認したい4つのこと<\/h1>/);
  assert.match(guideHtml, /<title>ぐるっとパス2026で行き先を決める前に確認したい4つのこと｜PYOKO<\/title>/);
  assert.ok(extractMeta(guideHtml, 'name', 'description').trim(), 'guide is missing a non-empty meta description');
  assert.doesNotMatch(guideHtml, /<meta[^>]+(?:noindex|nofollow)/i);
  assert.doesNotMatch(guideHtml, /(?:grutto-pass|gruttopass)\.pages\.dev/i);
  assert.match(guideHtml, /<a class="cta-button" href="\/">PYOKOで次に行ける施設を探す<\/a>/);
  assert.doesNotMatch(guideHtml, /<script/i, 'the article body must not require JavaScript execution');

  // Discount wording must not overstate a specific payment mechanism beyond
  // "not free admission, paid at the discounted price."
  assert.doesNotMatch(guideHtml, /差額の支払いが必要です/);
  assert.match(guideHtml, /「割引」は無料入場ではなく、割引適用後の料金がかかります。/);

  // The four numbered checks promised by the title/opening must be
  // independently scannable H2 sections, and the transition section must not
  // be presented as a fifth numbered check.
  const h2Headings = [...guideHtml.matchAll(/<h2>([^<]*)<\/h2>/g)].map(match => match[1]);
  assert.deepEqual(
    h2Headings.filter(heading => /^[1-4]\./.test(heading)).map(heading => heading.match(/^[1-4]/)[0]),
    ['1', '2', '3', '4']
  );
  assert.ok(h2Headings.some(heading => /^3\..*何を展示しているか/.test(heading)));
  assert.ok(h2Headings.some(heading => /^4\..*ぐるっとパスが使えるか/.test(heading)));
  assert.ok(h2Headings.includes('候補が増えるほど、確認を繰り返すことになる'));
  assert.doesNotMatch(guideHtml, /<h2>5\./);

  assert.match(fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8'), /<a href="\/guides\/grutto-pass-before-you-go\/">ぐるっとパスの使い方ガイド<\/a>/);
});
