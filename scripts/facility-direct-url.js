'use strict';

/* D2.2 facility direct-URL build surface. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const siteOrigin = 'https://pyoko.jp';
const registry = require('./facility-direct-url-registry.js');
const createFacilityPresentationModel = require('../facility-presentation-model.js');
const REFERENCE_DATE_ARGUMENT = '--reference-date=';

const DATA_SOURCES = [
  'config.js',
  'data/facilities.js',
  'data/facility-corrections.js',
  'data/facility-brochure.js',
  'data/facility-summaries.js',
  'data/facility-access-presentation.js',
  'data/exhibition-meta.js',
  'exhibition-meta-runtime.js',
  'data/exhibition-links.js',
  'data/facility-pass-benefits.js',
  'data/facility-legacy-risk.js',
  'data/facility-official-sources.js',
  'official-source-runtime.js',
  'data/facility-pass-time-scope.js',
  'pass-time-scope-runtime.js',
  'phase1/hours.js'
];

function assertReferenceDate(value) {
  const referenceDate = String(value == null ? '' : value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) {
    throw new TypeError(`Facility build requires an explicit YYYY-MM-DD reference date: ${referenceDate || '(missing)'}`);
  }
  return referenceDate;
}

function getBuildReferenceDate(argv = process.argv) {
  const argument = argv.find(value => String(value).startsWith(REFERENCE_DATE_ARGUMENT));
  const explicit = argument ? String(argument).slice(REFERENCE_DATE_ARGUMENT.length) : '';
  const configured = explicit || process.env.PYOKO_BUILD_REFERENCE_DATE || '';
  if (configured) return assertReferenceDate(configured);

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return assertReferenceDate(`${values.year}-${values.month}-${values.day}`);
}

function loadBuildContext() {
  const context = vm.createContext({ console, URL, URLSearchParams, window: {} });
  DATA_SOURCES.forEach(relativePath => {
    const filename = path.join(projectRoot, relativePath);
    vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename: relativePath });
  });
  vm.runInContext(`
    globalThis.__facilityBuildSources = {
      DATA,
      CONFIG,
      FACILITY_BROCHURE: window.FACILITY_BROCHURE,
      FACILITY_PRODUCT_SUMMARIES,
      FACILITY_ACCESS_PRESENTATION,
      FACILITY_PASS_BENEFITS: window.FACILITY_PASS_BENEFITS,
      FACILITY_LEGACY_HIGH_RISK: window.FACILITY_LEGACY_HIGH_RISK,
      FACILITY_PASS_TIME_SCOPE: window.FACILITY_PASS_TIME_SCOPE,
      HOURS,
      getFacilityOfficialSources,
      getFacilityHomepageSource,
      resolveContextualCtas,
      getPassTimeScope,
      getEnrichedMeta,
      getSourceOpenUrl
    };
  `, context, { filename: 'facility-direct-url-capture.js' });
  return context.__facilityBuildSources;
}

function createBuildData(referenceDate) {
  const targetDate = assertReferenceDate(referenceDate);
  const sources = loadBuildContext();
  const model = createFacilityPresentationModel(sources);
  const areas = [];
  const byKey = new Map();
  (Array.isArray(sources.DATA) ? sources.DATA : []).forEach(area => {
    const entries = (Array.isArray(area?.facilities) ? area.facilities : []).map(facility => {
      const projection = model.projectFacility(facility, targetDate);
      const entry = { facility, projection };
      byKey.set(projection.key, entry);
      return entry;
    });
    areas.push({ name: String(area?.name || ''), entries });
  });
  return { sources, model, areas, byKey, referenceDate: targetDate };
}

function createPresentationModel() {
  return createFacilityPresentationModel(loadBuildContext());
}

function validateRegistry(buildData) {
  const dataKeys = [...buildData.byKey.keys()];
  const slugEntries = Object.entries(registry.FACILITY_URL_SLUGS);
  const dataKeySet = new Set(dataKeys);
  const slugKeySet = new Set(slugEntries.map(([key]) => key));
  const missing = dataKeys.filter(key => !slugKeySet.has(key));
  const extra = slugEntries.map(([key]) => key).filter(key => !dataKeySet.has(key));
  if (missing.length || extra.length || slugEntries.length !== dataKeys.length) {
    throw new Error(`Facility URL registry does not exactly cover DATA (missing: ${missing.join(', ') || 'none'}; extra: ${extra.join(', ') || 'none'})`);
  }
  const seenSlugs = new Set();
  slugEntries.forEach(([key, slug]) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid facility slug for ${key}: ${slug}`);
    if (seenSlugs.has(slug)) throw new Error(`Duplicate facility slug: ${slug}`);
    seenSlugs.add(slug);
  });
  const known = key => dataKeySet.has(String(key));
  [...registry.CANARY_CANDIDATES, ...registry.PUBLICATION_APPROVED].forEach(key => {
    if (!known(key)) throw new Error(`Facility publication registry references unknown key: ${key}`);
  });
  if (new Set(registry.CANARY_CANDIDATES).size !== registry.CANARY_CANDIDATES.length) throw new Error('CANARY_CANDIDATES contains duplicate keys');
  if (new Set(registry.PUBLICATION_APPROVED).size !== registry.PUBLICATION_APPROVED.length) throw new Error('PUBLICATION_APPROVED contains duplicate keys');
  registry.PUBLICATION_APPROVED.forEach(key => {
    if (buildData.byKey.get(key).projection.state === 'UNSAFE') throw new Error(`Publication-approved facility is UNSAFE: ${key}`);
  });
  return true;
}

function activeKeys(mode) {
  return mode === 'canary' ? [...registry.CANARY_CANDIDATES] : [...registry.PUBLICATION_APPROVED];
}

function validateActiveProjections(buildData, keys) {
  keys.forEach(key => {
    const entry = buildData.byKey.get(String(key));
    if (!entry) throw new Error(`Active facility key not found: ${key}`);
    if (entry.projection.state === 'UNSAFE') throw new Error(`Active facility ${key} is UNSAFE: ${entry.projection.reasons.join(', ')}`);
  });
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

function safeExternalUrl(value) {
  const url = String(value || '').trim();
  return /^https?:\/\//i.test(url) ? url : '';
}

function absoluteUrl(pathname) {
  return `${siteOrigin}${pathname}`;
}

function formatYen(value) {
  return Number.isFinite(Number(value)) ? `${Number(value).toLocaleString('ja-JP')}円` : '';
}

function textList(items) {
  return (Array.isArray(items) ? items : []).filter(Boolean);
}

function renderList(items, className = '') {
  const values = textList(items);
  if (!values.length) return '';
  return `<ul${className ? ` class="${escapeHtml(className)}"` : ''}>${values.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderPass(projection) {
  const pass = projection.pass;
  const clauses = textList(pass.entitlements?.official_clauses)
    .map(clause => `<li><strong>${escapeHtml(clause.label_ja)}</strong>${escapeHtml(clause.wording_ja)}</li>`)
    .join('');
  const types = pass.pass_types.map(type => type === 'admission' ? '入場' : '割引').join('・');
  const value = pass.comparable?.value_yen !== null
    && pass.comparable?.value_yen !== undefined
    && Number.isFinite(Number(pass.comparable?.value_yen))
    ? `<p><strong>参考価値</strong> ${escapeHtml(formatYen(pass.comparable.value_yen))}${pass.comparable.source === 'legacy' ? '（概算）' : '（確認済み）'}。実際の利用条件・料金は変更される場合があります。</p>`
    : '';
  const timeScope = pass.time_scope?.admission_time_scoped
    ? `<div class="callout"><strong>対象期間</strong>${renderList(pass.time_scope.windows.map(window => `${window.valid_from}〜${window.valid_to}${window.title ? `：${window.title}` : ''}`))}</div>`
    : '';
  const notes = renderList(pass.notes_ja);
  return `<section class="panel panel--pass">
    <h2>ぐるっとパス2026の利用条件</h2>
    <p class="lead">${escapeHtml(types || '利用条件')}。このページは非公式の独立ガイドです。</p>
    ${clauses ? `<ul class="clauses">${clauses}</ul>` : '<p>公開用に確認できる特典条項はありません。</p>'}
    ${value}
    ${notes ? `<h3>注意事項</h3>${notes}` : ''}
    ${timeScope}
  </section>`;
}

function renderIntroduction(projection) {
  const descriptions = projection.introduction.descriptions || [];
  if (!descriptions.length) return '';
  const body = descriptions.map(description => `<div class="intro-item">${description.venue_name_ja ? `<h3>${escapeHtml(description.venue_name_ja)}</h3>` : ''}<p>${escapeHtml(description.summary_ja)}</p></div>`).join('');
  return `<section class="panel"><h2>施設紹介</h2>${body}</section>`;
}

function renderVisit(projection) {
  const sections = [
    ['開館時間', projection.hours.lines_ja],
    ['休館日', projection.visit.closed_ja],
    ['料金', projection.visit.fee_ja],
    ['アクセス', projection.access.display_lines_ja],
    ['注意事項', projection.visit.notes_ja]
  ].filter(([, values]) => values.length);
  if (!sections.length) return '';
  return `<section class="panel"><h2>訪問前に確認</h2><div class="visit-grid">${sections.map(([label, values]) => `<div class="visit-item"><h3>${escapeHtml(label)}</h3>${renderList(values)}</div>`).join('')}</div></section>`;
}

function renderExhibitions(projection) {
  const items = projection.exhibitions.items || [];
  if (!items.length) return '';
  return `<section class="panel"><h2>展覧会情報</h2>${items.map(item => {
    const safeUrl = safeExternalUrl(item.url);
    const title = safeUrl ? `<a href="${escapeHtml(safeUrl)}" rel="noopener">${escapeHtml(item.title)}</a>` : escapeHtml(item.title);
    const period = item.valid_from || item.valid_to
      ? `<p class="muted">会期: ${escapeHtml([item.valid_from, item.valid_to].filter(Boolean).join('〜'))}</p>`
      : `<p class="muted">期間: ${escapeHtml(item.date_state === 'permanent' ? '通年' : item.date_state === 'recurring' ? '定期開催' : '未確認')}</p>`;
    return `<article class="exhibition"><h3>${title}</h3>${period}${item.summary_ja.length ? `<p>${escapeHtml(item.summary_ja.join(' / '))}</p>` : ''}${item.fee_ja.length ? `<p><strong>料金:</strong> ${escapeHtml(item.fee_ja.join(' / '))}</p>` : ''}${item.hours_ja.length ? `<p><strong>時間:</strong> ${escapeHtml(item.hours_ja.join(' / '))}</p>` : ''}${item.notice_ja.length ? `<p class="notice">${escapeHtml(item.notice_ja.join(' / '))}</p>` : ''}</article>`;
  }).join('')}</section>`;
}

function renderSources(projection) {
  const links = (projection.sources.links || []).map(link => {
    const url = safeExternalUrl(link.url);
    return url ? `<li><a href="${escapeHtml(url)}" rel="noopener">${escapeHtml(link.label)}</a></li>` : '';
  }).filter(Boolean).join('');
  return links ? `<section class="panel panel--sources"><h2>出典・確認先</h2><p class="muted">掲載内容の確認に使った公開情報です。最新の会期・料金・休館日は施設公式サイトでご確認ください。</p><p class="about-context-link"><a href="/about/data/">情報・出典と判断について</a></p><ul>${links}</ul></section>` : '';
}

function pageDescription(projection) {
  const summary = projection.introduction.descriptions?.[0]?.summary_ja || '';
  const benefit = projection.pass.pass_types.includes('admission') ? '入場' : '割引';
  return `${summary || `${projection.name_ja}の施設紹介と訪問情報。`}${benefit}条件、開館時間、アクセスを掲載。`.slice(0, 155);
}

function renderPageDocument(projection, slug) {
  const pathname = `/facilities/${slug}/`;
  const canonical = absoluteUrl(pathname);
  const title = `${projection.name_ja}｜ぐるっとパス2026 非公式ガイド | PYOKO`;
  const description = pageDescription(projection);
  const noLabel = projection.no ? `No.${projection.no}` : '';
  const stateNote = projection.state === 'DEGRADED_SAFE'
    ? '<p class="state-note">一部の参考値または補足情報は、安全のため表示していません。利用前に公式情報をご確認ください。</p>'
    : '';
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:site_name" content="PYOKO">
  <meta property="og:image" content="${escapeHtml(absoluteUrl('/assets/social/grutto-pass-share.png'))}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/facilities/facility-pages.css">
</head>
<body>
  <header class="site-header"><a href="/" class="brand">PYOKO</a><span>ぐるっとパス2026 非公式ガイド</span></header>
  <main class="page-shell">
    <p class="breadcrumbs"><a href="/">トップ</a> / <a href="/facilities/">施設一覧</a> / ${escapeHtml(projection.name_ja)}</p>
    <div class="eyebrow">${escapeHtml(noLabel)} · ${escapeHtml(projection.area_name_ja)}</div>
    <h1>${escapeHtml(projection.name_ja)}</h1>
    <p class="independent-note">PYOKOが作成する非公式・独立ガイドです。Passの利用条件、会期、料金、休館日は変更されることがあります。</p>
    ${stateNote}
    ${renderIntroduction(projection)}
    ${renderPass(projection)}
    ${renderExhibitions(projection)}
    ${renderVisit(projection)}
    ${renderSources(projection)}
    <nav class="page-nav" aria-label="ページ内ナビゲーション"><a href="/facilities/">施設一覧へ</a><a href="/">トップへ戻る</a></nav>
  </main>
  <footer class="site-footer">© PYOKO · 施設公式情報をご確認ください。</footer>
</body>
</html>`;
}

function renderFacilitiesIndex(entries) {
  const groups = new Map();
  entries.forEach(entry => {
    const area = entry.projection.area_name_ja || 'その他';
    if (!groups.has(area)) groups.set(area, []);
    groups.get(area).push(entry);
  });
  const body = [...groups.entries()].map(([area, areaEntries]) => `<section class="index-group"><h2>${escapeHtml(area)}</h2><ul>${areaEntries.map(entry => {
    const slug = registry.FACILITY_URL_SLUGS[entry.projection.key];
    return `<li><a href="/facilities/${escapeHtml(slug)}/"><span>No.${escapeHtml(entry.projection.no)}</span>${escapeHtml(entry.projection.name_ja)}</a></li>`;
  }).join('')}</ul></section>`).join('');
  const title = '施設一覧｜ぐるっとパス2026 非公式ガイド | PYOKO';
  const canonical = absoluteUrl('/facilities/');
  return `<!doctype html>
<html lang="ja"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="ぐるっとパス2026の公開施設ページ一覧。PYOKOの非公式・独立ガイドです。">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="ぐるっとパス2026の公開施設ページ一覧。"><meta property="og:url" content="${escapeHtml(canonical)}">
  <link rel="stylesheet" href="/facilities/facility-pages.css">
</head><body>
  <header class="site-header"><a href="/" class="brand">PYOKO</a><span>ぐるっとパス2026 非公式ガイド</span></header>
  <main class="page-shell"><p class="breadcrumbs"><a href="/">トップ</a> / 施設一覧</p><div class="eyebrow">公開施設ページ</div><h1>施設一覧</h1><p class="independent-note">公開中の施設ページだけを掲載しています。掲載内容は非公式で、最新情報は各施設の公式サイトをご確認ください。</p>${body}<nav class="page-nav"><a href="/">トップへ戻る</a></nav></main>
  <footer class="site-footer">© PYOKO · 施設公式情報をご確認ください。</footer>
</body></html>`;
}

function renderFacilityStyles() {
  return `:root{color-scheme:light;--ink:#17332f;--muted:#5d716b;--line:#d9e3de;--paper:#f8fbf8;--panel:#fff;--accent:#276b5e;--soft:#e8f1ed}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--paper);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",sans-serif;line-height:1.75}.site-header{display:flex;justify-content:space-between;gap:1rem;padding:1rem max(1rem,calc((100vw - 980px)/2));background:var(--ink);color:#fff;font-size:.9rem}.brand{color:#fff;font-weight:800;letter-spacing:.16em;text-decoration:none}.page-shell{max-width:980px;margin:0 auto;padding:1.5rem 1rem 4rem}.breadcrumbs{font-size:.82rem;color:var(--muted);margin:0 0 2.5rem}.breadcrumbs a,.page-nav a,.panel a,.index-group a{color:var(--accent)}.eyebrow{color:var(--accent);font-size:.86rem;font-weight:700;letter-spacing:.08em}h1{font-size:clamp(2rem,5vw,3.4rem);line-height:1.2;margin:.35rem 0 1rem;letter-spacing:.02em}h2{font-size:1.3rem;line-height:1.35;margin:0 0 1rem}h3{font-size:1rem;line-height:1.4;margin:0 0 .4rem}.independent-note,.state-note{color:var(--muted);max-width:60rem}.state-note{padding:.8rem 1rem;background:#fff3d7;border-left:4px solid #c58b20}.panel{margin-top:1.5rem;padding:1.5rem;border:1px solid var(--line);border-radius:16px;background:var(--panel);box-shadow:0 8px 24px rgba(23,51,47,.04)}.panel--pass{background:var(--soft)}.lead{font-weight:650}.clauses,.panel ul{padding-left:1.25rem}.panel--pass .clauses{margin:0 0 1rem}.callout{margin-top:1rem;padding:1rem;background:#fff;border-radius:10px}.visit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.2rem}.visit-item{border-top:1px solid var(--line);padding-top:.75rem}.visit-item ul{margin:.25rem 0 0}.intro-item+.intro-item,.exhibition+.exhibition{border-top:1px solid var(--line);margin-top:1rem;padding-top:1rem}.muted{color:var(--muted);font-size:.9rem}.notice{color:#805c22}.panel--sources{font-size:.95rem}.page-nav{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}.page-nav a{display:inline-block;padding:.65rem 1rem;border:1px solid var(--line);border-radius:999px;background:#fff;text-decoration:none;font-weight:700}.index-group{margin-top:1.5rem}.index-group h2{border-bottom:2px solid var(--line);padding-bottom:.55rem}.index-group ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.index-group a{display:flex;gap:.75rem;align-items:baseline;padding:.65rem .75rem;border:1px solid var(--line);border-radius:10px;background:#fff;text-decoration:none}.index-group a span{color:var(--muted);font-size:.8rem;white-space:nowrap}.site-footer{border-top:1px solid var(--line);padding:1.2rem max(1rem,calc((100vw - 980px)/2));color:var(--muted);font-size:.82rem}@media(max-width:640px){.site-header{display:block}.site-header span{display:block;margin-top:.25rem}.page-shell{padding-top:1rem}.breadcrumbs{margin-bottom:1.75rem}.panel{padding:1.1rem;border-radius:12px}.visit-grid,.index-group ul{grid-template-columns:1fr}h1{font-size:2.15rem}}\n`;
}

// Explicit static-indexable paths outside the facility URL family.
// Each entry is an explicitly approved, hand-maintained path with its own
// product/document ownership. This is not a directory scan or a template for
// hypothetical future pages.
// OWNED-GUIDE-001 is governed by its roadmap/evidence gate. ABOUT-001 is
// product identity/trust documentation governed by durable product messaging,
// not a search experiment.
const STATIC_INDEXABLE_PATHS = [
  '/about/', // ABOUT-001
  '/about/data/', // ABOUT-001
  '/about/pass-tracker/', // ABOUT-001
  '/guides/grutto-pass-before-you-go/' // OWNED-GUIDE-001
];

function generateSitemap(keys, { includeStaticPaths = true } = {}) {
  const urls = [absoluteUrl('/')];
  if (keys.length) {
    urls.push(absoluteUrl('/facilities/'));
    keys.forEach(key => urls.push(absoluteUrl(`/facilities/${registry.FACILITY_URL_SLUGS[key]}/`)));
  }
  if (includeStaticPaths) STATIC_INDEXABLE_PATHS.forEach(pathname => urls.push(absoluteUrl(pathname)));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

function summarizeProjections(buildData) {
  const states = {};
  const reasons = {};
  buildData.byKey.forEach(({ projection }) => {
    states[projection.state] = (states[projection.state] || 0) + 1;
    projection.reasons.forEach(reason => { reasons[reason] = (reasons[reason] || 0) + 1; });
  });
  return { states, reasons };
}

function buildFacilitySurfaces({ outputDir, mode = 'production', referenceDate }) {
  const buildData = createBuildData(referenceDate);
  validateRegistry(buildData);
  const keys = activeKeys(mode);
  validateActiveProjections(buildData, keys);
  const files = new Map();
  files.set('sitemap.xml', generateSitemap(keys, { includeStaticPaths: mode === 'production' }));
  if (keys.length) {
    const entries = keys.map(key => buildData.byKey.get(key));
    files.set('facilities/facility-pages.css', renderFacilityStyles());
    files.set('facilities/index.html', renderFacilitiesIndex(entries));
    entries.forEach(entry => {
      const slug = registry.FACILITY_URL_SLUGS[entry.projection.key];
      files.set(`facilities/${slug}/index.html`, renderPageDocument(entry.projection, slug));
    });
  }
  if (outputDir) {
    files.forEach((content, relativePath) => {
      const target = path.join(outputDir, relativePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    });
  }
  return { buildData, keys, files };
}

function getFacilityUniverse(referenceDate) {
  const buildData = createBuildData(referenceDate);
  validateRegistry(buildData);
  return [...buildData.byKey.values()].map(({ facility, projection }) => ({ facility, projection }));
}

if (require.main === module) {
  const mode = process.argv.includes('--canary') ? 'canary' : 'production';
  const referenceDate = getBuildReferenceDate(process.argv);
  const result = buildFacilitySurfaces({ mode, referenceDate });
  console.log(`Facility ${mode} surface: ${result.keys.length} page(s) at reference date ${referenceDate}`);
}

module.exports = {
  activeKeys,
  assertReferenceDate,
  buildFacilitySurfaces,
  createBuildData,
  createPresentationModel,
  escapeHtml,
  generateSitemap,
  getFacilityUniverse,
  getBuildReferenceDate,
  loadBuildContext,
  renderFacilitiesIndex,
  renderFacilityStyles,
  renderPageDocument,
  safeExternalUrl,
  summarizeProjections,
  siteOrigin,
  validateRegistry
};
