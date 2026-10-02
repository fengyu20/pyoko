const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyoko-facility-production-'));
const previewDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyoko-facility-canary-'));
const registry = require('../scripts/facility-direct-url-registry.js');
const generator = require('../scripts/facility-direct-url.js');
const createFacilityPresentationModel = require('../facility-presentation-model.js');
const REFERENCE_DATE = '2026-08-25';
const EXPECTED_CANARY_CANDIDATES = Object.freeze([
  '5', '7', '18', '36', '36-2', '44', '71', '103', '105'
]);
const EXPECTED_PUBLICATION_APPROVED = Object.freeze([
  '5', '7', '18', '36', '36-2', '44', '71', '103', '105'
]);

function extractLocs(source) {
  return [...source.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]);
}

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath).map(file => path.join(entry.name, file));
    return [entry.name];
  }).map(file => file.split(path.sep).join('/'));
}

function runBuild(script, args = [], destination = outputDir) {
  execFileSync(process.execPath, [
    path.join(root, 'scripts', script),
    ...args,
    `--reference-date=${REFERENCE_DATE}`,
    `--output-dir=${destination}`
  ], {
    // The indexing suite also exercises the default output directory. Keep
    // this file's subprocesses isolated so Node's file-level test concurrency
    // cannot make one build read another build's rewritten homepage.
    cwd: root,
    stdio: 'pipe'
  });
}

function readCanaryPages() {
  return registry.CANARY_CANDIDATES.map(key => {
    const slug = registry.FACILITY_URL_SLUGS[key];
    const filename = path.join(previewDir, 'facilities', slug, 'index.html');
    return { key, slug, filename, html: fs.readFileSync(filename, 'utf8') };
  });
}

function projectedExhibition(key, referenceDate, title) {
  const projection = generator.createBuildData(referenceDate).byKey.get(key).projection;
  return projection.exhibitions.items.find(item => item.title === title);
}

test('the stable URL registry covers every card and preserves multi-card identities', () => {
  const buildData = generator.createBuildData(REFERENCE_DATE);
  generator.validateRegistry(buildData);
  const keys = Object.keys(registry.FACILITY_URL_SLUGS);
  assert.equal(keys.length, 108);
  assert.equal(new Set(keys).size, 108);
  assert.equal(registry.FACILITY_URL_SLUGS['36'] === registry.FACILITY_URL_SLUGS['36-2'], false);
  assert.equal(buildData.byKey.get('36').projection.name_ja, '東京シティビュー');
  assert.equal(buildData.byKey.get('36-2').projection.name_ja, '森美術館');
  assert.equal(buildData.byKey.get('103').projection.introduction.descriptions.length, 2);
  assert.deepEqual([...registry.CANARY_CANDIDATES], EXPECTED_CANARY_CANDIDATES);
  assert.deepEqual([...registry.PUBLICATION_APPROVED], EXPECTED_PUBLICATION_APPROVED);
  assert.equal(registry.CANARY_CANDIDATES.length, 9);
  assert.equal(registry.PUBLICATION_APPROVED.length, 9);
  assert.deepEqual(
    [...registry.CANARY_CANDIDATES].sort(),
    [...registry.PUBLICATION_APPROVED].sort(),
    'the first canary cohorts currently have equal membership'
  );
  assert.notStrictEqual(
    registry.CANARY_CANDIDATES,
    registry.PUBLICATION_APPROVED,
    'candidate and publication authorities must remain separate arrays'
  );
  assert.notStrictEqual(
    registry.FACILITY_DIRECT_URL_REGISTRY.canaryCandidates,
    registry.FACILITY_DIRECT_URL_REGISTRY.publicationApproved,
    'registry authority properties must not share a publication reference'
  );
  for (const key of registry.PUBLICATION_APPROVED) {
    assert.ok(registry.FACILITY_URL_SLUGS[key], `${key} must have a stable slug`);
    assert.ok(
      ['FULL', 'DEGRADED_SAFE'].includes(buildData.byKey.get(key).projection.state),
      `${key} must remain safely publishable`
    );
  }
});

test('the shared semantic model gives every card a safe state and explicit degradation reasons', () => {
  const buildData = generator.createBuildData(REFERENCE_DATE);
  const summary = generator.summarizeProjections(buildData);
  assert.deepEqual(summary.states, { FULL: 66, DEGRADED_SAFE: 42 });
  assert.equal(summary.reasons.HIGH_RISK_REFERENCE_SUPPRESSED, 29);
  assert.equal(summary.reasons.ACCESS_NORMALIZED_FALLBACK, 6);
  for (const key of registry.CANARY_CANDIDATES) {
    const projection = buildData.byKey.get(key).projection;
    assert.notEqual(projection.state, 'UNSAFE', `${key} must be publishable in the canary preview`);
    assert.ok(projection.introduction.descriptions.length, `${key} has no approved Introduction`);
    assert.ok(projection.pass.entitlements?.official_clauses.length, `${key} has no Pass clauses`);
  }
  assert.equal(buildData.byKey.get('7').projection.pass.comparable.value_yen, null);
  assert.equal(buildData.byKey.get('103').projection.pass.comparable.value_yen, null);
  assert.equal(buildData.byKey.get('18').projection.access.state, 'RAW_FALLBACK');
  assert.equal(buildData.byKey.get('71').projection.hours.lines_ja.length, 2);
});

test('shared exhibition relevance preserves runtime date semantics without ambient time', () => {
  const model = createFacilityPresentationModel({
    CONFIG: { passEnd: '2027-03-31' },
    getEnrichedMeta: (_facility, item) => ({
      validFrom: item.validFrom || null,
      validTo: item.validTo || null,
      dateState: item.dateState || 'unknown'
    })
  });
  const fixture = {
    _key: 'exhibition-fixture',
    enriched: [
      { title: 'expired', validFrom: '2026-08-01', validTo: '2026-08-24' },
      { title: 'current', validFrom: '2026-08-25', validTo: '2026-08-25' },
      { title: 'near-upcoming', validFrom: '2026-09-01', validTo: '2026-09-30' },
      { title: 'far-upcoming', validFrom: '2026-12-01', validTo: '2027-01-15' },
      { title: 'permanent', dateState: 'permanent' },
      { title: 'recurring', dateState: 'recurring' },
      { title: 'unknown' }
    ]
  };

  assert.throws(() => model.getExhibitionRelevance({ title: 'missing date' }), /explicit YYYY-MM-DD/);
  const projection = model.getFacilityExhibitionProjection(fixture, REFERENCE_DATE);
  assert.deepEqual(
    projection.items.map(item => [item.title, item.relevance_state]),
    [
      ['current', 'ongoing'],
      ['near-upcoming', 'near-upcoming'],
      ['permanent', 'ongoing'],
      ['recurring', 'unknown'],
      ['unknown', 'unknown']
    ]
  );
  assert.equal(projection.state, 'AVAILABLE');
  assert.equal(projection.reference_date, REFERENCE_DATE);
});

test('No.13 projects the autumn Ichiyo exhibition under its own identity', () => {
  const autumn = projectedExhibition('13', '2026-10-24', '特別展「没後100年－師の君 半井桃水と樋口一葉」');
  assert.ok(autumn);
  assert.deepEqual([autumn.valid_from, autumn.valid_to], ['2026-10-24', '2026-12-20']);
  assert.equal(autumn.url, 'https://www.taitogeibun.net/ichiyo/');
  assert.equal(
    projectedExhibition('13', '2026-10-24', '企画展「一葉の肖像と小説の風景」'),
    undefined
  );
});

test('No.38 projects the autumn Toguri exhibition with the current Grutto price', () => {
  const autumn = projectedExhibition('38', '2026-10-07', 'めぐってたのしい　佐賀・長崎のやきもの展');
  assert.ok(autumn);
  assert.match(autumn.fee_ja.join(' / '), /1,100円/);
  assert.doesNotMatch(autumn.fee_ja.join(' / '), /1,200円/);
  assert.equal(autumn.url, 'https://www.toguri-museum.or.jp/tenrankai/tenrankai_2026autumn.php');
});

test('No.20 projects the canonical Mingei Shock exhibition at its start', () => {
  const exhibition = projectedExhibition('20', '2026-09-05', '民藝SHOCK!!―没後60年 静嘉堂の河井寬次郎');
  assert.ok(exhibition);
  assert.deepEqual([exhibition.valid_from, exhibition.valid_to], ['2026-09-05', '2026-11-08']);
  assert.match(exhibition.fee_ja.join(' / '), /1,300円/);
  assert.doesNotMatch(exhibition.title, /元禄/);
  assert.equal(exhibition.url, 'https://www.seikado.or.jp/');
});

test('No.69 projects the new miniature exhibition at its start', () => {
  const exhibition = projectedExhibition('69', '2026-09-26', '新収蔵ミニチュア展―名人小林礫斎を支えた二人の中田');
  assert.ok(exhibition);
  assert.deepEqual([exhibition.valid_from, exhibition.valid_to], ['2026-09-26', '2026-12-20']);
  assert.equal(exhibition.url, 'https://www.tabashio.jp/exhibition/2026/2609sep/index.html');
});

test('the full projection universe suppresses ended items and degrades safely when exhibitions are gone', () => {
  const buildData = generator.createBuildData(REFERENCE_DATE);
  const endedItems = [];
  for (const { facility, projection } of buildData.byKey.values()) {
    for (const item of facility.enriched || []) {
      const meta = buildData.sources.getEnrichedMeta(facility, item);
      if (meta.validTo && meta.validTo < REFERENCE_DATE) {
        endedItems.push(`${facility._key}/${item.title}`);
        assert.equal(
          projection.exhibitions.items.some(candidate => candidate.title === item.title),
          false,
          `${facility._key}/${item.title} must not survive the relevance projection`
        );
      }
    }
  }
  assert.ok(endedItems.length > 0, 'the universe fixture must contain ended exhibitions');

  const sourceFacility = buildData.byKey.get('5').facility;
  const historicalOnly = {
    ...sourceFacility,
    schedule_lines: [],
    enriched: [{
      title: 'Historical exhibition fixture',
      validFrom: '2026-01-01',
      validTo: '2026-08-24',
      fields: { 概要: '過去の展示に関するテスト用情報' }
    }]
  };
  const safeWithoutExhibition = buildData.model.projectFacility(historicalOnly, REFERENCE_DATE);
  assert.equal(safeWithoutExhibition.exhibitions.state, 'NO_SAFE_EXHIBITION');
  assert.equal(safeWithoutExhibition.state, 'DEGRADED_SAFE');
  assert.doesNotMatch(
    generator.renderPageDocument(safeWithoutExhibition, 'historical-only-fixture'),
    /<h2>展覧会情報<\/h2>/
  );
});

test('static canary generation is deterministic and escaping is HTML-safe', () => {
  const first = generator.buildFacilitySurfaces({ mode: 'canary', referenceDate: REFERENCE_DATE });
  const second = generator.buildFacilitySurfaces({ mode: 'canary', referenceDate: REFERENCE_DATE });
  assert.deepEqual([...first.files], [...second.files]);
  assert.deepEqual(first.keys, [...registry.CANARY_CANDIDATES]);

  const source = first.buildData.byKey.get('5').projection;
  const synthetic = JSON.parse(JSON.stringify(source));
  synthetic.name_ja = '<script>alert(1)</script>"';
  const html = generator.renderPageDocument(synthetic, 'escaped-fixture');
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;&quot;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
});

test('default production build emits exactly the approved facility-page public surface', () => {
  runBuild('build-pages.js');
  const files = listFiles(outputDir);
  for (const file of files) {
    const content = fs.readFileSync(path.join(outputDir, file)).toString();
    assert.doesNotMatch(content, /(?:data|docs)\/review\/|source_review_file|source_review_sha256|source_fingerprint|source_classification|review-only|scripts\/(?:build-facility|promote-facility|build-pass|classify-legacy)/,
      `${file} publishes private evidence`);
  }
  const expectedPageFiles = registry.PUBLICATION_APPROVED.map(key => `facilities/${registry.FACILITY_URL_SLUGS[key]}/index.html`);
  const productionPageFiles = files.filter(file => /^facilities\/[^/]+\/index\.html$/.test(file));
  assert.deepEqual(productionPageFiles.sort(), expectedPageFiles.sort());
  assert.ok(files.includes('facilities/index.html'));
  assert.ok(files.includes('facilities/facility-pages.css'));
  assert.ok(files.includes('sitemap.xml'));
  assert.deepEqual(extractLocs(fs.readFileSync(path.join(outputDir, 'sitemap.xml'), 'utf8')), [
    'https://pyoko.jp/',
    'https://pyoko.jp/facilities/',
    ...registry.PUBLICATION_APPROVED.map(key => `https://pyoko.jp/facilities/${registry.FACILITY_URL_SLUGS[key]}/`),
    'https://pyoko.jp/about/',
    'https://pyoko.jp/about/data/',
    'https://pyoko.jp/about/pass-tracker/',
    'https://pyoko.jp/guides/grutto-pass-before-you-go/'
  ]);
  const homepage = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');
  assert.match(homepage, /<a href="\/facilities\/">施設ページ一覧<\/a>/);
  assert.doesNotMatch(homepage, /FACILITY_INDEX_LINK_SLOT/);
  const index = fs.readFileSync(path.join(outputDir, 'facilities', 'index.html'), 'utf8');
  const indexHrefs = [...index.matchAll(/href="(\/facilities\/[^"/]+\/)"/g)].map(match => match[1]);
  assert.deepEqual(indexHrefs, registry.PUBLICATION_APPROVED.map(key => `/facilities/${registry.FACILITY_URL_SLUGS[key]}/`));
  assert.doesNotMatch(index, /shitamachi-museum|not-a-real-facility/);
  assert.equal(fs.existsSync(path.join(outputDir, 'facilities', 'shitamachi-museum', 'index.html')), false);
  assert.equal(fs.existsSync(path.join(outputDir, 'facilities', 'not-a-real-facility', 'index.html')), false);
  for (const key of registry.PUBLICATION_APPROVED) {
    const slug = registry.FACILITY_URL_SLUGS[key];
    assert.equal(fs.existsSync(path.join(outputDir, 'facilities', slug, 'index.html')), true, `${key} direct entry missing`);
  }
  const sw = fs.readFileSync(path.join(outputDir, 'sw.js'), 'utf8');
  assert.doesNotMatch(sw, /facilities\/.*index\.html/);
  assert.doesNotMatch(sw, /facility-pages\.css/);
  assert.ok(files.includes('facility-presentation-model.js'));
  assert.equal(fs.existsSync(path.join(root, 'sitemap.xml')), false);
});

test('explicit canary preview emits only the candidate pages, index, and matching sitemap', () => {
  runBuild('build-pages.js', ['--canary-preview'], previewDir);
  const expectedPageFiles = registry.CANARY_CANDIDATES.map(key => `facilities/${registry.FACILITY_URL_SLUGS[key]}/index.html`);
  const facilityFiles = listFiles(path.join(previewDir, 'facilities')).map(file => `facilities/${file}`);
  assert.deepEqual(facilityFiles.sort(), ['facilities/facility-pages.css', 'facilities/index.html', ...expectedPageFiles].sort());

  const homepage = fs.readFileSync(path.join(previewDir, 'index.html'), 'utf8');
  assert.match(homepage, /href="\/facilities\/">施設ページ一覧/);
  const index = fs.readFileSync(path.join(previewDir, 'facilities', 'index.html'), 'utf8');
  for (const key of registry.CANARY_CANDIDATES) {
    const slug = registry.FACILITY_URL_SLUGS[key];
    assert.match(index, new RegExp(`href="/facilities/${slug}/"`));
  }
  assert.doesNotMatch(index, /shitamachi-museum/);

  const pages = readCanaryPages();
  const canonicalUrls = pages.map(page => page.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
  assert.equal(new Set(canonicalUrls).size, pages.length);
  for (const page of pages) {
    assert.match(page.html, /<title>[^<]+\| PYOKO<\/title>/);
    assert.match(page.html, /<meta property="og:title"/);
    assert.match(page.html, /<meta property="og:description"/);
    assert.match(page.html, /<meta property="og:url"/);
    assert.doesNotMatch(page.html, /application\/ld\+json|hreflang/i);
    assert.doesNotMatch(page.html, /data\/review|review_notes|source_review_file|audit/i);
    assert.doesNotMatch(page.html, /open now|現在開館|ただいま開館/i);
  }

  const no103 = pages.find(page => page.key === '103').html;
  assert.equal((no103.match(/<h3>横浜/g) || []).length, 2);
  assert.doesNotMatch(no103, /参考価値/);
  const highRisk7 = pages.find(page => page.key === '7').html;
  assert.doesNotMatch(highRisk7, /参考価値/);
  assert.match(highRisk7, /対象期間/);

  const no5 = pages.find(page => page.key === '5').html;
  assert.doesNotMatch(no5, /ビフォー縄文―旧石器時代発見80周年/);
  assert.match(no5, /仏教の花―蓮と宝相華―/);
  assert.doesNotMatch(no5, /掲載中の展覧会情報/);

  const no71 = pages.find(page => page.key === '71').html;
  assert.doesNotMatch(no71, /洋館　明治の夢と挑戦/);
  assert.match(no71, /浮世へのいざない―江戸博×出光コレクション初共演/);
  assert.match(no71, /href="https:\/\/www\.edo-tokyo-museum\.or\.jp\/s-exhibition\/edohaku-idemitsu\/"/);
  assert.doesNotMatch(no71, /出光×江戸博コレクションによる浮世絵展/);

  const renderedExhibitions = pages.reduce((count, page) => count + (page.html.match(/<article class="exhibition">/g) || []).length, 0);
  assert.equal(renderedExhibitions, 14);

  const sitemap = extractLocs(fs.readFileSync(path.join(previewDir, 'sitemap.xml'), 'utf8'));
  assert.deepEqual(sitemap, [
    'https://pyoko.jp/',
    'https://pyoko.jp/facilities/',
    ...registry.CANARY_CANDIDATES.map(key => `https://pyoko.jp/facilities/${registry.FACILITY_URL_SLUGS[key]}/`)
  ]);

  const sw = fs.readFileSync(path.join(previewDir, 'sw.js'), 'utf8');
  assert.doesNotMatch(sw, /facilities\/.*index\.html/);
  assert.doesNotMatch(sw, /facility-pages\.css/);

  // OWNED-GUIDE-001 is a production-owned static artifact, not part of the
  // facility technical canary. Regression guard for the canary-leak bug.
  const previewFiles = listFiles(previewDir);
  assert.equal(
    previewFiles.some(file => file.startsWith('guides/')),
    false,
    'facility canary preview must not publish owned-guide files'
  );
  assert.equal(
    sitemap.some(url => url.includes('grutto-pass-before-you-go')),
    false,
    'canary sitemap must not include the owned guide URL'
  );
});
