// オフライン時にも UI の描画が外部フォント CDN に依存しないことを検証する。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(__dirname, '..', 'i18n', 'ui.js'), 'utf8');
const manifest = fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8');
const mapJs = fs.readFileSync(path.join(__dirname, '..', 'map.js'), 'utf8');
const openNow = fs.readFileSync(path.join(__dirname, '..', 'phase1', 'phase1-open-now.js'), 'utf8');
const presentationModel = fs.readFileSync(path.join(__dirname, '..', 'facility-presentation-model.js'), 'utf8');

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

test('index.html は Google Fonts CDN を参照しない', () => {
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/i);
});

test('index.html exposes a localized description hook', () => {
  assert.match(html, /<meta\s+name="description"\s+id="metaDescription"/i);
  assert.match(html, /app\.description/);
});

test('index.html exposes the Japanese default product metadata before JavaScript', () => {
  assert.match(html, /<title>東京・ミュージアム ぐるっとパス2026 非公式ガイド \| PYOKO<\/title>/);
  assert.doesNotMatch(html, /<title>[^<]*最終利用日/);
  assert.match(html, /<meta\s+name="description"\s+id="metaDescription"[^>]+content="開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきでまとめて確認。気になる施設を保存して、地図や訪問記録から次の一館を決められる非公式ガイドです。"/);
  assert.match(html, /<link\s+rel="manifest"\s+href="\/manifest\.json"/);
  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/pyoko\.jp\/"/);
  assert.match(html, /<link\s+rel="icon"\s+href="\/favicon\.svg"/);
  assert.match(html, /<link\s+rel="icon"[^>]+sizes="32x32"[^>]+href="\/favicon-32x32\.png"/);
  assert.match(html, /<link\s+rel="apple-touch-icon"\s+href="\/apple-touch-icon\.png"/);
  const requiredMeta = [
    'og:type', 'og:title', 'og:description', 'og:url', 'og:image',
    'og:image:width', 'og:image:height', 'og:image:alt', 'og:site_name',
    'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
    'twitter:image:alt'
  ];
  requiredMeta.forEach(key => {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    assert.match(html, new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`), key);
  });
  assert.equal((html.match(/<meta\s+name="description"/gi) || []).length, 1);
  assert.equal((html.match(/<meta\s+property="og:title"/gi) || []).length, 1);
  assert.equal((html.match(/<meta\s+name="twitter:title"/gi) || []).length, 1);
  assert.match(html, /<meta\s+property="og:title"[^>]+content="東京・ミュージアム ぐるっとパス2026 非公式ガイド \| PYOKO"/);
  assert.match(html, /<meta\s+property="og:url"[^>]+content="https:\/\/pyoko\.jp\/"/);
  assert.match(html, /<meta\s+property="og:image"[^>]+content="https:\/\/pyoko\.jp\/assets\/social\/grutto-pass-share\.png"/);
  assert.match(html, /<meta\s+name="twitter:card"[^>]+content="summary_large_image"/);
  assert.match(html, /<meta\s+name="twitter:title"[^>]+content="東京・ミュージアム ぐるっとパス2026 非公式ガイド \| PYOKO"/);
  assert.match(html, /<meta\s+name="twitter:image"[^>]+content="https:\/\/pyoko\.jp\/assets\/social\/grutto-pass-share\.png"/);
  assert.doesNotMatch(html, /grutto-pass\.pages\.dev/);
});

test('manifest exposes the installable PYOKO identity and current theme', () => {
  const parsed = JSON.parse(manifest);
  assert.equal(parsed.name, 'PYOKO for Tokyo Museum Grutto Pass');
  assert.equal(parsed.short_name, 'PYOKO');
  assert.equal(parsed.start_url, './');
  assert.equal(parsed.scope, './');
  assert.equal(parsed.display, 'standalone');
  assert.equal(parsed.theme_color, '#143D33');
  assert.equal(parsed.background_color, '#F5F5F1');
  assert.deepEqual(parsed.icons.map(icon => [icon.src, icon.sizes, icon.type]), [
    ['assets/brand/pyoko-symbol-192.png', '192x192', 'image/png'],
    ['assets/brand/pyoko-symbol-512.png', '512x512', 'image/png']
  ]);
});

test('offline shell precaches the cross-language search vocabulary', () => {
  const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  assert.match(html, /data\/search-aliases\.js/);
  assert.match(sw, /data\/search-aliases\.js/);
  assert.match(html, /data\/exhibition-links\.js/);
  assert.match(html, /data\/facility-brochure\.js/);
  assert.match(html, /data\/facility-corrections\.js/);
  assert.match(sw, /data\/exhibition-links\.js/);
  assert.match(sw, /data\/facility-corrections\.js/);
  assert.match(sw, /data\/facility-brochure\.js/);
  assert.match(sw, /grutto-pass-v\d+/);
});

test('hero owns edition and provenance while My Pass owns the deadline', () => {
  const heroStart = html.indexOf('<div class="hero">');
  const heroEnd = html.indexOf('<div class="controls-wrap"', heroStart);
  const hero = html.slice(heroStart, heroEnd);
  assert.match(hero, /id="passEdition"/);
  assert.doesNotMatch(hero, /passAmount|passUntil|2,500|最終利用日|Last use date|最晚使用日/);
  assert.doesNotMatch(html, /const pageDeadline = t\('pass\.until'/);
  assert.match(html, /document\.title = localizedTitle;/);
  assert.match(html, /passTrackerValidity/);
  assert.match(html, /passTrackerEditionFinal/);
  assert.match(html, /formatUiDate\(CONFIG\.passEnd\)/);
  assert.match(html, /<p class="hero-eyebrow" data-i18n="app\.eyebrow">東京・ミュージアム ぐるっとパス<\/p>/);
  assert.doesNotMatch(html, /data-i18n="app\.eyebrow">[^<]*(?:非公式ガイド|Unofficial guide|非官方指南)/);
  assert.match(hero, /<p class="pass-meta" role="group"/);
  assert.match(hero, /<div class="pyoko-descriptor">\s*<span class="pyoko-descriptor-prefix">for<\/span>\s*<p class="hero-eyebrow" data-i18n="app\.eyebrow">東京・ミュージアム ぐるっとパス<\/p>\s*<span class="pyoko-descriptor-qualifier">\s*<span class="pyoko-descriptor-separator"[^>]*>·<\/span>\s*<span class="pyoko-unofficial" id="heroUnofficialNote"[^>]*>非公式<\/span>\s*<\/span>\s*<\/div>\s*<div class="hero-hop" aria-hidden="true">[\s\S]*?<\/div>\s*<div class="hero-product-group">/);
  assert.equal((hero.match(/class="hero-hop"/g) || []).length, 1);
  assert.doesNotMatch(hero, /pyoko-mobile-context/);
  assert.match(html, /data-i18n="app\.pageContext">展覧会ガイド<\/p>/);
  assert.match(html, /data-i18n="app\.heroTitle">ぐるっとパスで、次はどこへ。<\/p>/);
  assert.match(html, /id="passEdition">2026年版<\/span>/);
  assert.match(html, /id="heroUpdated">更新<\/span>/);
  assert.match(html, /data-i18n="hero\.officialLink">購入・最新情報は公式サイトへ ↗<\/a>/);
  assert.match(html, /data-i18n="footer\.passValidity"/);
  assert.match(html, /data-i18n="footer\.passOnce"/);
  assert.match(html, /data-i18n="footer\.admissionMeaning"/);
  assert.match(html, /data-i18n="footer\.discountMeaning"/);
});

test('hero metadata stays one quiet semantic row with natural wrapping', () => {
  assert.match(html, /\.hero-product-group\{margin-top:22px;[\s\S]*?\.hero-info-row\{\s*display:block;[\s\S]*?margin-top:11px;/);
  assert.match(html, /\.pyoko-descriptor-qualifier\{order:3;display:inline-flex;align-items:baseline;gap:7px;flex:0 0 auto;white-space:nowrap;\}/);
  assert.match(html, /\.hero-hop\{margin-top:14px;width:clamp\(128px,16vw,188px\);max-width:100%;\}/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*?\.pyoko-unofficial\{font-size:10px;letter-spacing:\.04em;\}/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*?\.hero-product-group\{margin-top:18px;\}/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*?\.hero-hop\{margin-top:10px;width:clamp\(112px,34vw,150px\);\}/);
  assert.doesNotMatch(html, /\.pyoko-unofficial\{order:0;flex-basis:100%/);
  assert.doesNotMatch(html, /\.pyoko-descriptor-separator\{display:none/);
  assert.match(html, /\.pass-meta\{[\s\S]*?flex-direction:row;[\s\S]*?gap:0;[\s\S]*?font-size:var\(--text-xs\)/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*?\.pass-meta\{align-items:flex-start;flex-direction:row;column-gap:0;row-gap:4px;\}/);
  assert.match(html, /\.pass-meta-label\{color:inherit;font-weight:500;letter-spacing:0;font-size:inherit;\}/);
  assert.match(html, /\.pass-meta > \*:not\(:last-child\)::after\{[\s\S]*?content:"·"/);
  assert.doesNotMatch(html, /\.pass-meta > \*:not\(:last-child\)::after\{[^}]*border-radius/);
  assert.doesNotMatch(html, /pass-meta-group--pass|pass-meta-group--guide/);
  assert.match(html, /\.pass-meta a\{color:inherit;font-weight:500;text-decoration:underline/);
  assert.match(html, /formatUiShortDate\(CONFIG\.lastUpdated\)/);
  assert.match(ui, /function formatUiShortDate\(value\)/);
  assert.match(ui, /'hero\.editionLabel': '\{year\}年版'/);
  assert.ok(contrastRatio('#B7D0BE', '#164C35') >= 4.5);
});

test('catalog facility numbers keep one shared visible convention in every locale', () => {
  assert.equal((ui.match(/'facility\.number': 'No\. \{no\}'/g) || []).length, 3);
  assert.doesNotMatch(ui, /'facility\.number': 'No\.\{no\}'/);
  assert.match(ui, /'pass\.until': '最終利用日 \{date\}'/);
  assert.match(ui, /'pass\.until': 'Last use date \{date\}'/);
  assert.match(ui, /'pass\.until': '最晚使用日 \{date\}'/);
});

test('hero coverage and filter discovery stay compact and localized', () => {
  assert.match(html, /id="heroCoverage"/);
  assert.match(html, /footer\.coverageSummary/);
  assert.match(html, /class="footer-disclosure site-about"/);
  assert.match(html, /class="filter-toggle-btn"[^>]*aria-expanded="false"/);
  assert.match(html, /class="filters-panel" id="filtersPanel"/);
  assert.match(html, /if \(wasOpen === isOpen\) \{[\s\S]*filtersPanel\.setAttribute\('inert', ''\)/);
  assert.match(html, /setFiltersOpen\(false\)/);
  assert.match(html, /\.filter-toggle-btn\{display:inline-flex; width:auto; align-self:flex-start; max-width:100%;\}/);
  assert.doesNotMatch(html, /\.filter-toggle-btn\{display:flex; width:100%;\}/);
  assert.doesNotMatch(html, /direction < 0\) setFiltersOpen\(true\)/);
  assert.match(html, /grid-template-rows:0fr/);
  assert.match(html, /\.filters-panel-inner\{[\s\S]*min-height:0; overflow:hidden/);
  assert.doesNotMatch(html, /const syncFilterPanelOnScroll =/);
  assert.doesNotMatch(html, /max-height:0; margin-top:0; overflow:hidden/);
  assert.match(html, /\.controls-wrap\{[\s\S]*background:var\(--paper-card\)/);
  assert.doesNotMatch(html, /\.controls-wrap\{[^}]*background:rgba/);
  assert.doesNotMatch(html, /\.controls-wrap\{[^}]*backdrop-filter/);
  assert.doesNotMatch(html, /\.area-head\.reveal-pending\{/);
  assert.match(html, /\.controls\{[\s\S]*max-width:1320px/);
  assert.match(html, /\.global-context\{max-width:1320px/);
});

test('closed filter panel is inert and keeps its focus lifecycle ordered', () => {
  assert.match(html, /<div class="filters-panel" id="filtersPanel"[^>]*aria-hidden="true"[^>]*inert/);
  const setFiltersOpenSource = html.match(/const setFiltersOpen = \(open, \{ restoreFocus = true \} = \{\}\) => \{[\s\S]*?\n  \};\n  setFiltersOpen\(false\);/)?.[0];
  assert.ok(setFiltersOpenSource);
  assert.match(setFiltersOpenSource, /if \(isOpen\) filtersPanel\.removeAttribute\('inert'\);/);
  assert.match(setFiltersOpenSource, /if \(!isOpen\) \{\s*filtersPanel\.setAttribute\('inert', ''\);\s*\}/);
  assert.ok(
    setFiltersOpenSource.indexOf('filterToggleBtn.focus({ preventScroll: true })')
      < setFiltersOpenSource.lastIndexOf("filtersPanel.setAttribute('inert', '')")
  );
});

test('quick filters are three toggles while complete radio groups stay in the panel', () => {
  const quickStart = html.indexOf('<div class="quick-filters"');
  const panelStart = html.indexOf('<div class="filters-panel" id="filtersPanel"', quickStart);
  assert.ok(quickStart >= 0 && panelStart > quickStart);
  const quickMarkup = html.slice(quickStart, panelStart);
  assert.equal((quickMarkup.match(/class="quick-filter-toggle/g) || []).length, 3);
  assert.doesNotMatch(quickMarkup, /\sname="(?:statusFilter|passFilter|visitedFilter)"/);
  assert.match(quickMarkup, /data-quick-filter-name="statusFilter" data-quick-filter-value="nowopen"/);
  assert.match(quickMarkup, /data-quick-filter-name="passFilter" data-quick-filter-value="admission"/);
  assert.match(quickMarkup, /data-quick-filter-name="visitedFilter" data-quick-filter-value="unvisited"/);
  assert.match(quickMarkup, /data-i18n="pass\.freeWith">入場無料<\/span>/);
  assert.doesNotMatch(quickMarkup, /quick-filter-brand|GRUTTO PASS/);

  const panelEnd = html.indexOf('<button type="button" class="filters-backdrop"', panelStart);
  const panelMarkup = html.slice(panelStart, panelEnd);
  ['statusFilter', 'passFilter', 'visitedFilter'].forEach(name => {
    assert.match(panelMarkup, new RegExp(`name="${name}"`));
  });
  assert.match(html, /function syncQuickFilterButtons\(\)/);
  assert.match(html, /next\.dispatchEvent\(new Event\('change', \{ bubbles: true \}\)\)/);
  assert.match(html, /syncQuickFilterButtons\(\);\s*updateMapMarkers\(\);/);
});

test('view controls expose pressed state without tab semantics', () => {
  assert.match(html, /<div class="view-switch" role="group"[^>]*data-i18n-attr="aria-label:controls\.view"/);
  assert.match(html, /id="listToggleBtn"[^>]*aria-pressed="true"[^>]*aria-controls="mainContent"/);
  assert.match(html, /id="mapToggleBtn"[^>]*aria-pressed="false"[^>]*aria-controls="mapView"/);
  assert.doesNotMatch(html, /id="(?:listToggleBtn|mapToggleBtn)"[^>]*(?:role="tab"|aria-selected)/);
  assert.match(mapJs, /function updateViewButtons\(showMap\)/);
  assert.match(mapJs, /listButton\?\.setAttribute\('aria-pressed', showMap \? 'false' : 'true'\)/);
  assert.match(mapJs, /mapButton\?\.setAttribute\('aria-pressed', showMap \? 'true' : 'false'\)/);
  assert.doesNotMatch(mapJs, /aria-selected/);
});

test('filter recovery and global sorting are explicit', () => {
  assert.match(html, /id="resultsSummary"[^>]*aria-live="polite"/);
  assert.match(html, /id="clearFiltersButton"/);
  assert.match(html, /id="emptyClearFiltersButton"/);
  assert.match(html, /function clearAllFilters/);
  assert.match(html, /const ensureGlobalResultsSection =/);
  assert.match(html, /const isGlobalSort = mode !== 'number'/);
  assert.match(html, /cards\.forEach\(card => globalGrid\.appendChild\(card\)\)/);
  assert.match(html, /id="radiusFilter"[^>]*disabled/);
  assert.match(openNow, /if \(isLongClosure\) effectiveStatus = 'closed'/);
  assert.match(openNow, /card\.dataset\.status = effectiveStatus/);
});

test('visited changes keep discovery DOM stable unless the visited filter depends on them', () => {
  assert.match(html, /function syncVisitedCardState\(key = ''\)/);
  assert.match(html, /function applyFilters\(\{ reorder = true \} = \{\}\)/);
  assert.match(html, /const sortState = reorder \? applySort\(\) : getSortState\(\)/);
  assert.match(html, /function applyVisitedDependentFiltering\(\)[\s\S]*if \(personalStateMode\(\) !== 'all'\) applyFilters\(\{ reorder: false \}\)/);
  assert.match(html, /document\.addEventListener\('visited-change', applyVisitedDependentFiltering\)/);
  assert.doesNotMatch(html, /document\.addEventListener\('visited-change', applyFilters\)/);
});

test('card hierarchy keeps DOM order and exposes only one primary status badge', () => {
  assert.match(html, /\.grid\{[^}]*align-items:start/);
  assert.doesNotMatch(html, /column-count|(?:^|[;{])\s*columns\s*:/m);
  assert.equal((openNow.match(/<span class="status-badge/g) || []).length, 1);
  assert.match(openNow, /buildStatusPresentation/);
  assert.match(openNow, /status-official-link/);
  // v100: times that do not apply every day carry a qualifier, built once in the
  // i18n layer and only placed here.
  assert.match(openNow, /class="status-reason-variant"/);
  assert.match(openNow, /presentation\.hoursVariantNote/);
  // Copy is assembled in the i18n layer, so the renderer must not reach for the
  // string keys itself.
  assert.doesNotMatch(openNow, /status\.hoursDowOnly|status\.hoursDateOnly/);
  assert.match(html, /\.status-reason-variant\{/);
  // The Hours CTA must resolve through the Official Source Registry first; the
  // homepage is only a fallback, and only while the status genuinely needs
  // official verification.
  assert.match(openNow, /resolveContextualCtas\('hours', facility\)/);
  assert.match(openNow, /if \(precise\?\.source\?\.url\) return precise\.source\.url;/);
  assert.match(openNow, /presentation\.needsHeaderVerification \? getOfficialStatusUrl\(f\) : ''/);
  assert.match(html, /exhibition\.japaneseOnlyShort/);
  assert.match(html, /title="\$\{escapeHtml\(t\('exhibition\.japaneseOnly'\)\)\}" aria-label=/);
  assert.doesNotMatch(html, /<p class="enriched-desc">\$\{escapeHtml\(t\('exhibition\.untranslatedDetails'\)\)/);
});

test('browse cards separate facility discovery copy from compact exhibition previews', () => {
  assert.match(html, /function getFacilityBrochureVenues\(f\)/);
  assert.match(html, /function renderFacilityDiscoveryPreview\(f\)/);
  assert.match(html, /class="facility-discovery-preview"/);
  assert.match(html, /class="facility-discovery-preview" data-presentation-level="browse"/);
  assert.doesNotMatch(html, /browse-exhibition-block|browse-exhibition-label/);
  assert.doesNotMatch(html, /browseExhibitionBlock\.classList\.toggle/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.facility-discovery-preview/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.facility-detail-section--exhibitions\{[\s\S]*border-top:1px solid var\(--line-soft\)/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.enriched-meta-field--hours,[\s\S]*?\.enriched-meta-field--source\{display:none;\}/);
});

test('secondary content is compact, dynamic, and expandable without changing card order', () => {
  assert.match(html, /item\.classList\.toggle\('is-upcoming', upcoming\)/);
  assert.match(html, /const expanded = document\.body\.classList\.contains\('map-active'\)[\s\S]*?card\.dataset\.enrichedExpanded === 'true'/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.enriched-meta-field--fee/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.enriched-meta-field--period b/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.enriched-language-note\{display:none;\}/);
  assert.doesNotMatch(html, /body:not\(\.map-active\) \.area-layout \.card-no\{\s*display:none/);
  assert.match(html, /\.card-no\{[\s\S]*border:0; border-radius:0; background:transparent;[\s\S]*color:var\(--ink-faint\); font-family:var\(--font-sans\)[\s\S]*font-size:var\(--text-xs\)/);
  assert.match(html, /\.card-no\{[\s\S]*flex:0 0 52px; width:52px; min-width:52px[\s\S]*white-space:nowrap/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.visited-toggle\{\s*display:inline-flex/);
  assert.doesNotMatch(html, /visited-toggle:not\(\.is-checked\) > span:last-child\{display:none;\}/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.visited-toggle\{[\s\S]*border:1px solid var\(--line\);border-radius:var\(--radius-pill\)/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.grid,[\s\S]*?\.grid\.has-expanded-card\{align-items:start;\}/);
  assert.match(html, /\.enriched-item\.is-upcoming \.enriched-meta-field:not/);
  assert.match(html, /\.enriched-item\.is-upcoming \.enriched-desc/);
  assert.doesNotMatch(html, /const DETAIL_EXHIBITION_HORIZON_DAYS = 60/);
  assert.match(presentationModel, /const DETAIL_EXHIBITION_HORIZON_DAYS = 60/);
  assert.match(presentationModel, /function exhibitionHorizon\(referenceDate\)/);
  assert.match(presentationModel, /return passEnd && passEnd < horizon \? passEnd : horizon/);
  assert.match(html, /getExhibitionRelevance\(item\?\.dataset \|\| item, targetDate\)/);
  assert.match(presentationModel, /function exhibitionRelevance\(item, referenceDate\)/);
  assert.match(html, /function prepareDetailExhibitions\(body, targetDate\)/);
  assert.match(html, /item\.hidden = false/);
  assert.doesNotMatch(html, /card-secondary-details/);
  assert.match(html, /\.card \[data-presentation-level="detail"\]\{display:none;\}/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.card \[data-presentation-level\] \.facility-detail-section-heading\{display:none;\}/);
  assert.match(html, /\.map-facility-body \[data-presentation-level="browse"\],[\s\S]*?\.facility-drawer-body \[data-presentation-level="browse"\]\{display:none;\}/);
  assert.doesNotMatch(html, /body:not\(\.map-active\) \.area-layout \[data-presentation-level="detail"\]\{display:none;\}/);
  assert.doesNotMatch(html, /body\.drawer-open \.facility-drawer-body \[data-presentation-level="browse"\]/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.facility-detail-section--pass\{margin-top:9px;padding-top:0;border-top:0;\}/);
  assert.doesNotMatch(html, /class="facility-intro-details"/);
  // The Introduction no longer carries an attribution row: it renders only
  // approved product copy, so there is no brochure citation and no
  // "Japanese source" note left to attribute.
  assert.doesNotMatch(html, /const attribution = \[sourceNote, sourceLink\]/);
  assert.doesNotMatch(html, /facility-intro-source/);
  assert.match(html, /<div class="facility-intro-body">\$\{descriptions\}<\/div>/);
  assert.match(html, /data-presentation-level="browse">\$\{discoveryPreview\}/);
  assert.match(html, /data-presentation-level="detail">\$\{brochureIntro\}/);
  assert.doesNotMatch(html, /body\.querySelectorAll\('\.facility-intro-details'\)\.forEach\(details => \{ details\.open = true; \}\)/);
  assert.match(html, /stripIds\(body\)/);
});

test('facility cards use a normal product-card frame without ticket decoration', () => {
  assert.match(html, /\.card\{[\s\S]*?border:1px solid var\(--line\); border-radius/);
  assert.doesNotMatch(html, /border-top:3px solid var\(--area-accent\)/);
  assert.match(html, /\.card:hover\{border-color:var\(--brand-green\);\}/);
  assert.doesNotMatch(html, /perforation/);
  assert.doesNotMatch(html, /class="card-secondary-details/);
});

test('area and selected controls share the single green accent while card numbers stay quiet', () => {
  assert.doesNotMatch(html, /data-area-index="\d+"\}\{--area-accent:/);
  assert.match(html, /\.card-no\{[\s\S]*border:0; border-radius:0; background:transparent;[\s\S]*color:var\(--ink-faint\); font-family:var\(--font-sans\)[\s\S]*font-size:var\(--text-xs\)/);
  const renderPassStart = html.indexOf('function renderPassSummary(f){');
  const renderCardStart = html.indexOf('function renderCard(f, areaName = \'\', expanded = false){');
  const renderCardEnd = html.indexOf('// One source of truth for both the list and map views.', renderCardStart);
  const renderPassSource = html.slice(renderPassStart, renderCardStart);
  const renderCardSource = html.slice(renderCardStart, renderCardEnd);
  assert.match(renderCardSource, /const facilityNumber = t\('facility\.number', \{ no: f\.no \}\)/);
  assert.match(renderCardSource, /<div class="card-no">\$\{escapeHtml\(facilityNumber\)\}<\/div>/);
  assert.doesNotMatch(renderPassSource, /const facilityNumber = t\('facility\.number'/);
  assert.match(html, /target\.kicker\.textContent = t\('facility\.number'/);
  assert.match(html, /const number = t\('facility\.number', \{ no: card\.dataset\.facilityNo \|\| '' \}\)/);
  assert.match(html, /<span class="area-no" aria-hidden="true">\$\{String\(idx\+1\)\.padStart\(2,'0'\)\}<\/span>/);
  assert.doesNotMatch(html, /facility\.drawerNo/);
  assert.match(html, /\.area-no\{[\s\S]*font-family:var\(--font-sans\)[\s\S]*color:var\(--ink-faint\)/);
  assert.match(html, /\.area-name\{font-family:var\(--font-sans\)[\s\S]*font-size:var\(--text-lg\)/);
  assert.match(html, /\.card-title\{[\s\S]*font-family:var\(--font-serif\)/);
  assert.match(html, /\.map-title\{font-family:var\(--font-sans\)/);
  assert.match(html, /\.area-toggle\{[\s\S]*color:var\(--brand-green-deep\)/);
  assert.match(html, /\.area-head-button:focus-visible\{outline:2px solid var\(--brand-green\)/);
  assert.match(html, /\.status-filter input:checked \+ span\{background:var\(--brand-green-tint\);color:var\(--brand-green-deep\)/);
});

test('status text is quiet while visited cards retain a readable state', () => {
  assert.match(html, /\.badge-warn,\.badge-out \{ color:var\(--ink-soft\); \}/);
  assert.match(html, /\.badge-closed \{ color:var\(--vermillion-deep\); \}/);
  assert.doesNotMatch(html, /\.badge-closed[^}]*background:\s*#[A-F0-9]{6}/i);
  assert.doesNotMatch(html, /\.card\.is-visited::after/);
  assert.doesNotMatch(html, /\.card\.is-visited \.card-no\{background:var\(--brand-green\);border-color:var\(--brand-green\);color:#fff;\}/);
  assert.match(html, /\.visited-toggle\.is-checked \.visited-mark\{background:var\(--brand-green\);border-color:var\(--brand-green\);color:#fff;\}/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.visited-toggle\.is-checked \.visited-mark\{[\s\S]*background:var\(--brand-green-tint\)/);
  assert.match(html, /\.card-title-button:focus-visible\{outline:2px solid var\(--brand-green\)/);
  assert.match(html, /\.visited-toggle:focus-within\{outline:2px solid var\(--brand-green\)/);
  assert.match(html, /\.visited-toggle input:focus-visible \+ \.visited-mark\{outline:2px solid var\(--brand-green\)/);
});

test('the pass action stays beside the visited control with a true narrow-card fallback', () => {
  assert.match(html, /\.pass-benefit\{display:grid;grid-template-columns:minmax\(0,1fr\) max-content;/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*?\.pass-benefit\{column-gap:8px;row-gap:4px;\}/);
  assert.match(html, /@media \(max-width:340px\)\{[\s\S]*?\.pass-benefit\{grid-template-columns:minmax\(0,1fr\);/);
  assert.match(html, /\.pass-benefit-copy\{grid-column:1;min-width:0;\}/);
  assert.match(html, /\.visited-toggle\{[\s\S]*grid-column:2;grid-row:1;[\s\S]*white-space:nowrap/);
  assert.match(html, /\.visited-toggle\{[\s\S]*min-height:36px;padding:5px 9px/);
  assert.match(html, /\.visited-toggle::before\{[\s\S]*inset-block:-4px;inset-inline:-2px[\s\S]*pointer-events:auto/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.visited-toggle::before\{inset-block:-8px;\}/);
  assert.match(html, /\.pass-benefit \.visited-toggle::before\{inset-inline:4px 0;\}/);
  assert.doesNotMatch(html, /\.visited-toggle\{min-height:44px;\}/);
  assert.doesNotMatch(html, /body:not\(\.map-active\) \.area-layout \.visited-toggle,[^{]*\{[^}]*min-width:44px;min-height:44px/);
  assert.doesNotMatch(html, /\.visited-toggle[^}]*padding:10px 9px/);
});

test('pass benefits keep the pass label and visitor outcome in a compact first line', () => {
  assert.match(html, /\.pass-benefit-line\{display:flex;align-items:baseline;flex-wrap:wrap;/);
  assert.match(html, /\.pass-benefit-main\{display:inline-flex;align-items:baseline;[^}]*min-width:0/);
  assert.match(html, /\.pass-benefit-divider\{[^}]*color:var\(--ink-faint\)/);
  assert.match(html, /\.pass-benefit-value\{[^}]*color:var\(--ink-soft\);[^}]*font-weight:600/);
  assert.match(html, /<div class="pass-benefit-line" data-presentation-level="browse">[\s\S]*<span class="pass-benefit-main">[\s\S]*<span class="pass-benefit-headline"[^>]*>/);
  assert.match(html, /<p class="pass-benefit-supporting">/);
  assert.match(html, /function getPassDetailDescription\(f, presentation = null\)/);
  assert.match(html, /const basis = localizedValues\('benefit_basis'\)/);
  assert.match(html, /const notes = localizedValues\('pass_notes'\)/);
  assert.match(html, /const admission = localizedValues\('admission_label'\)/);
  assert.match(html, /pass\.benefitSectionAria/);
  assert.match(html, /\.map-facility-body \.pass-benefit-kicker,[\s\S]*?display:none/);
  assert.match(html, /t\('pass\.label'\)/);
  assert.doesNotMatch(html, /pass\.browseLabel|pass\.detailLabel|pass\.scopeWithSaving/);
  assert.doesNotMatch(html, /body\.querySelectorAll\('\.pass-benefit'\)\.forEach/);
});

test('browse status hides only the opening-hours parenthetical', () => {
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.status-reason-hours\{display:none;\}/);
  assert.match(openNow, /class="status-reason-main"/);
  assert.match(openNow, /class="status-reason-hours"/);
  assert.match(openNow, /class="status-reason-advisory"/);
});

test('critical controls remain keyboard and touch accessible', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="mainContent"[^>]*tabindex="-1"/);
  assert.match(html, /for="searchInput"[^>]*data-i18n="controls\.searchLabel"/);
  assert.doesNotMatch(html, /id="facilityDrawer"[^>]*role="dialog"/);
  assert.match(html, /class="facility-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="facilityDrawerTitle"/);
  assert.equal((html.match(/class="facility-drawer-panel" role="dialog"/g) || []).length, 1);
  assert.match(html, /<main id="mainContent" tabindex="-1"><\/main>/);
  assert.doesNotMatch(html, /id="mainContent"[^>]*(?:role="tabpanel"|aria-labelledby)/);
  assert.doesNotMatch(html, /id="mapView"[^>]*(?:role="tabpanel"|aria-labelledby)/);
  assert.doesNotMatch(html, /\.toggle input\{display:none/);
  assert.match(html, /\.toggle input:focus-visible \+ \.sw/);
  assert.match(html, /\.info-icon\{[\s\S]*width:28px;height:28px/);
  assert.match(html, /\.facility-drawer-close\{[\s\S]*width:44px;height:44px/);
  assert.match(html, /id="filtersApplyButton"/);
  assert.match(html, /body\.scroll-locked\{overflow:hidden/);
  assert.doesNotMatch(html, /body\.filters-open,body\.datetime-open\{overflow:hidden/);
  assert.doesNotMatch(html, /body\.drawer-open\{overflow:hidden/);
  assert.doesNotMatch(html, /body\.my-pass-open\{overflow:hidden/);
  assert.match(html, /\.filters-backdrop\{[\s\S]*background:rgba\(23,43,34,.30\)/);
  assert.match(html, /\.filters-apply-button:focus-visible/);
});

test('visited tracker persists a local-only facility record', () => {
  assert.match(html, /id="passTracker"/);
  assert.match(html, /id="passTrackerChip"/);
  assert.match(html, /id="passTrackerChip"[^>]*aria-expanded="false"[^>]*aria-controls="passTracker"/);
  assert.match(html, /class="my-pass-entry"/);
  assert.match(html, /class="my-pass-panel" role="dialog" aria-modal="true" aria-labelledby="passTrackerTitle"/);
  assert.match(html, /id="passTrackerClose"/);
  assert.match(html, /id="passTrackerBackdrop"/);
  assert.match(html, /id="passVisitedList"/);
  assert.match(html, /function setPassTrackerOpen/);
  assert.match(html, /if \(passTracker\) passTracker\.hidden = !passTrackerOpen/);
  assert.match(html, /if \(passTrackerChip\) \{[\s\S]*passTrackerChip\.hidden = false/);
  assert.match(html, /document\.getElementById\('passTrackerChip'\)\?\.addEventListener/);
  assert.match(html, /document\.body\.classList\.toggle\('my-pass-open'/);
  assert.match(html, /function renderVisitedFacilities/);
  assert.doesNotMatch(html, /passTracker[\s\S]*scrollIntoView/);
  // Want-to-go list polish (v96): one shared tabular identity column so every
  // facility name starts at the same x, and a full native-chrome reset on the
  // name <button> so the list does not render as a column of form widgets.
  assert.match(html, /--my-pass-number-width:\s*54px/);
  assert.match(html, /\.my-pass-want-item\{[^}]*grid-template-columns:var\(--my-pass-number-width\)/);
  assert.match(html, /\.my-pass-visited-item\{[^}]*grid-template-columns:var\(--my-pass-number-width\)/);
  assert.match(html, /\.my-pass-want-name\{appearance:none;-webkit-appearance:none;[^}]*border:0;background:transparent;padding:0;margin:0;font:inherit;text-align:left/);
  assert.match(html, /\.my-pass-want-name:focus-visible\{outline:/);
  // Collection-level browse action reuses the single existing Want-to-go filter,
  // which now lives as a value of the personal-state radio group.
  assert.match(html, /id="browseCollectionButton"/);
  assert.match(html, /data-i18n="pass\.browseCollection"/);
  assert.match(html, /getElementById\('browseCollectionButton'\)\?\.addEventListener/);
  assert.match(html, /const filter = document\.querySelector\('input\[name="visitedFilter"\]\[value="want"\]'\)/);

  // v97 Want-to-Go state invariant, enforced in the one state layer.
  assert.match(html, /function normalizeWantAgainstVisited/);
  assert.match(html, /if \(want && isVisited\(normalized\)\) return;/);
  assert.match(html, /if \(normalizeWantAgainstVisited\(wantToGoKeys, visitedKeys\)\)/);
  // v97 Detail return context: a nested origin is reinstated, not re-opened.
  assert.match(html, /let detailReturnContext = null;/);
  assert.match(html, /context\?\.surface === 'passTracker'/);
  assert.match(html, /activePassTab = tab === 'want' \|\| tab === 'visited' \? tab : chooseDefaultPassTab\(\);/);
  assert.match(html, /function openPassTrackerOnTab/);
  // v97 feedback reuses the single existing toast; no second snackbar component.
  assert.match(html, /showToast\(t\('pass\.wantToGoAddedToast'\), t\('pass\.wantToGoAddedAction'\)/);
  assert.match(html, /const messageKey = wasWantToGo \? 'pass\.visitedFromWantToast' : 'pass\.visitedAddedToast';/);
  assert.match(html, /showToast\(t\(messageKey\), t\('pass\.visitedAddedAction'\), \(\) => openPassTrackerOnTab\('visited'\)\)/);
  assert.equal((html.match(/function showToast\(/g) || []).length, 1);
  // v97 Pass provenance disclosure.
  assert.match(html, /function renderPassProvenance/);
  assert.match(html, /<details class="pass-provenance" data-pass-provenance>/);
  // One flat list: every source is rendered by the same branch, so none can be
  // presented as a lesser version of another.
  assert.match(html, /const records = \[model\?\.primary, \.\.\.\(model\?\.supporting \|\| \[\]\)\]/);
  assert.match(html, /<ul class="pass-provenance-list" data-pass-provenance-list>/);
  assert.equal((html.match(/<li class="pass-provenance-item">/g) || []).length, 1);
  // The retired two-tier chrome must not leave dead markup or copy behind.
  assert.doesNotMatch(html, /pass-provenance-raw|pass-provenance-more|pass-provenance-label|pass-provenance-name\{/);
  assert.doesNotMatch(html, /provenancePrimary|provenanceRaw|provenanceOther/);
  // v98 provenance integrity: one atomic record still feeds title, page and href,
  // and an entry with no URL never borrows a neighbour's.
  assert.match(html, /const label = record\.title \|\| record\.url;/);
  assert.match(html, /record\.open_url\s*\?\s*`<a href="\$\{escapeHtml\(record\.open_url\)\}"/);
  assert.match(html, /: `<span>\$\{escapeHtml\(label\)\}<\/span>`/);
  // Claim-relevant document stays first; that marker is now about position.
  assert.match(html, /const firstAttr = index === 0 \? ' data-pass-provenance-title' : '';/);
  // Each entry answers "what does it support" and "how current is it" separately.
  assert.match(html, /function passProvenanceRole\(record\)/);
  assert.match(html, /function passProvenanceDates\(record\)/);
  // Provenance dates are locale-formatted like every other date on the page.
  assert.match(html, /typeof formatUiDate === 'function' \? formatUiDate\(value\) : value/);
  // Deep links are built in one helper, never hand-concatenated in a renderer.
  assert.doesNotMatch(html, /#page=\$\{/);
  // Claim-relevant primary selection reads the recorded window source. Page
  // locators belong to the DOCUMENT, so they are applied by the provenance model
  // rather than attached per claim source here.
  assert.match(html, /function resolvePassClaimSources/);
  assert.doesNotMatch(html, /getPassTimeScopeSourcePage/);
  // v97 Want-list opening summary projects the shared status reason verbatim.
  assert.match(html, /card\.querySelector\('\.status-reason-hours'\)\?\.textContent/);
  assert.doesNotMatch(html, /getWantListOpeningState/);
  assert.match(html, /id="resultsBar"/);
  assert.match(html, /id="resultsContext"/);
  assert.match(html, /const placeResultsContext =/);
  assert.doesNotMatch(html, /class="area-context"/);
  assert.match(html, /\.results-bar\.is-visible\{display:block;\}/);
  assert.match(html, /data-i18n="pass\.storageNote"/);
  assert.match(html, /id="visitedSummary"/);
  assert.match(html, /name="visitedFilter"/);
  assert.match(html, /value="unvisited"/);
  assert.match(html, /role="radiogroup"[^>]*data-i18n-attr="aria-label:filters\.myListAria"/);
  assert.match(html, /data-visited-toggle/);
  assert.match(html, /localStorage\?\.getItem\(visitedStorageKey\(\)\)/);
  assert.match(html, /localStorage\?\.setItem\(visitedStorageKey\(\)/);
  assert.match(html, /passPriceYen/);
  assert.match(html, /bindAreaHeads\(\);\s*syncVisitedCardState\(\);\s*syncWantToGoCardState\(\);\s*updateHeroCoverage/);
  assert.doesNotMatch(html, /\.card\.is-visited::after/);
  assert.doesNotMatch(html, /\.card\.is-visited \.card-no\{background:var\(--brand-green\);border-color:var\(--brand-green\);color:#fff;\}/);
  assert.match(html, /input type="checkbox" data-visited-toggle="\$\{escapeHtml\(key\)\}"[\s\S]*aria-label="\$\{escapeHtml\(visitedLabel\)\}"/);
});

test('area headings are not sticky while area navigation offsets remain', () => {
  assert.doesNotMatch(html, /\.area-head\{\s*position:sticky/);
  assert.match(html, /--controls-height/);
  assert.match(html, /--area-scroll-offset/);
  assert.match(html, /const scrollToArea =/);
});

test('exhibitions show one featured item and disclose the rest progressively', () => {
  assert.match(html, /class="enriched-list"/);
  assert.match(html, /const displayTitle = title \|\|/);
  assert.match(html, /isJapaneseOnlyExhibition\(facility, item\)/);
  assert.match(html, /sourceLinkLabel/);
  assert.doesNotMatch(html, /class="card-foot-summary"/);
  assert.match(html, /class="enriched-meta-field enriched-meta-field--/);
  assert.doesNotMatch(html, /class="card-more-details"/);
  assert.match(html, /class="facility-detail-section facility-detail-section--visit" data-presentation-level="detail"><h3 class="facility-detail-section-heading">/);
  assert.match(html, /t\('facility\.moreDetails'\)/);
  assert.doesNotMatch(html, /foot\.querySelectorAll\('\.facility-details'\)/);
  assert.doesNotMatch(html, /body\.querySelectorAll\('\.facility-intro-details'\)\.forEach\(details => \{ details\.open = true; \}\)/);
  assert.match(html, /enriched-language-note/);
  assert.match(html, /renderFacilityBrochureInfo\(f\)/);
  // `facility.brochureSource` went with the fallback renderer that cited the
  // brochure page; nothing displays brochure text any more.
  assert.doesNotMatch(html, /facility\.brochureSource/);
  assert.match(html, /facility\.exhibitionOngoing/);
  assert.match(html, /facility\.exhibitionNearUpcoming/);
  assert.match(html, /group\.dataset\.enrichedGroup/);
  assert.doesNotMatch(html, /scheduleHtml|scheduleSection/);
  assert.doesNotMatch(html, /\.enriched-list\.is-scrollable/);
  assert.doesNotMatch(html, /function syncEnrichedListHeights\(\)/);
  assert.match(html, /data-enriched-expand/);
  assert.match(html, /exhibition\.showMore/);
  assert.match(html, /const hasMore = activeItems\.length > 1/);
  assert.match(html, /const featuredItem = activeItems\.find\(item => !item\.classList\.contains\('is-upcoming'\)\) \|\| activeItems\[0\] \|\| null/);
  assert.match(html, /item\.hidden = !expanded && item !== featuredItem/);
  assert.match(html, /moreButton\.hidden = !hasMore \|\| expanded/);
  assert.match(html, /body\.querySelectorAll\('\[data-enriched-expand\]'\)\.forEach\(button => button\.remove\(\)\)/);
  assert.match(html, /getExhibitionLink\(facility, item\)/);
  // v97 presentation policy: one destination gets one affordance, and a section
  // CTA is never emitted for a URL a title link already reaches.
  assert.match(html, /function resolveExhibitionSectionCta/);
  assert.match(html, /if \(titleUrls\.has\(key\)\) continue;/);
  assert.match(html, /hasExactTitleLink \? 'exhibition_view_all' : 'exhibition_listing'/);
  // The label that promised a verification a generic page cannot perform is gone.
  assert.doesNotMatch(html, /source\.cta\.contextExhibition/);
  assert.doesNotMatch(html, /context_exhibition/);
  assert.match(html, /const titleMarkup = exhibitionUrl/);
});

test('visit information is a permanent section and separates its practical fields', () => {
  assert.match(html, /\.facility-detail-section--visit \.foot-rows\{display:flex;flex-direction:column/);
  assert.match(html, /renderVisitInfoRow\(ICON\.closed, 'field\.closed'/);
  assert.match(html, /renderVisitInfoRow\(ICON\.fee, 'field\.fee'/);
  assert.match(html, /const accessRow = renderVisitInfoRow\(ICON\.access, 'field\.access'/);
  assert.match(html, /const fieldNeedsOfficialCheck = \[accessRow, \.\.\.visitRows\]/);
  assert.match(html, /facility-detail-section--access/);
  assert.match(html, /const accessContent = \[accessRow\.html, actions\]/);
  assert.match(html, /const hasHiddenGenericAccess = fieldKey === 'access'/);
  assert.match(html, /visit-info-secondary visit-info-source/);
  assert.match(html, /t\('facility\.introJapaneseSource'\)/);
  assert.match(html, /class="visit-info-heading"/);
  assert.match(html, /class="visit-info-content"/);
  assert.match(html, /facility\.checkOfficialSite/);
  assert.match(html, /const officialUrl = \(f\.urls \|\| \[\]\)\.find/);
  assert.doesNotMatch(html, /class="foot-row(?:["\s])/);
  assert.doesNotMatch(html, /<details class="facility-details">/);
  assert.doesNotMatch(html, /displayAccess[^\n]*\.split\(/);
});

test('official website links dedupe by normalized URL inside the practical region', () => {
  assert.match(html, /function normalizeFacilityUrl\(url\)/);
  assert.match(html, /const contextualOfficialKey = normalizeFacilityUrl\(contextualOfficialUrl\)/);
  assert.match(html, /const contactUrls = facilityUrls\.filter\(url => normalizeFacilityUrl\(url\) !== contextualOfficialKey\)/);
  assert.match(html, /data-contact-website="\$\{escapeHtml\(normalized\)\}"/);
  assert.match(html, /contactWebsiteLinks\.forEach\(link =>/);
  assert.match(html, /contact\.hidden = !visibleContactItems/);
  assert.match(html, /const officialSiteLink = canonicalOfficialUrl && fieldNeedsOfficialCheck/);
});

test('drawer practical sections have one compact rhythm owner', () => {
  assert.match(html, /\.facility-detail-section \+ \.facility-detail-section\{margin-top:16px;padding-top:16px;border-top:1px solid var\(--line-soft\);\}/);
  assert.match(html, /\.card-foot\{[\s\S]*gap:0;/);
  assert.doesNotMatch(html, /scheduleHtml|scheduleSection/);
  assert.match(html, /\.facility-drawer-body \.card-actions\{border:0;padding:0;margin:0;\}/);
  assert.doesNotMatch(html, /facility-drawer-body \.card-foot > \.facility-detail-section \+ \.facility-detail-section\{margin-top:20px/);
  assert.doesNotMatch(html, /facility-drawer-body \.card-foot \.facility-detail-section--actions\{margin-top:18px/);
});

test('map markers select the existing facility panel without a duplicate popup', () => {
  assert.doesNotMatch(mapJs, /bindPopup|map-route-link|openPopup/);
  assert.match(mapJs, /marker\.on\('click', \(\) => selectFacilityCard/);
  assert.match(mapJs, /marker\.bindTooltip/);
  assert.match(mapJs, /selectedMarkerKey/);
  assert.doesNotMatch(mapJs, /MAP_DETAIL_ICON|map-detail-link|data-map-detail|mapText\('map\.details'/);
  assert.doesNotMatch(mapJs, /map-list-link|map\.list|data-map-card/);
});

test('Map Mode renders one selected facility panel and shares drawer detail content', () => {
  assert.match(html, /id="mapFacilityPanel"/);
  assert.match(html, /id="mapFacilityEmpty"/);
  assert.match(html, /id="mapFacilityDetail"/);
  assert.match(html, /data-i18n="map\.selectFacility"/);
  assert.match(html, /const populateFacilityDetail =/);
  assert.match(html, /populateFacilityDetail\(drawerDetailTarget, card\)/);
  assert.match(html, /populateFacilityDetail\(mapDetailTarget, card, \{ mapContext: true \}\)/);
  assert.match(html, /body\.querySelectorAll\('\[data-map-focus\]'\)/);
  assert.doesNotMatch(html, /foot\.querySelectorAll\('\[data-map-focus\]'\)/);
  assert.match(html, /window\.renderSelectedFacilityPanel = renderSelectedFacilityPanel/);
  assert.match(html, /window\.setSelectedFacilityKey = setSelectedFacilityKey/);
  assert.match(mapJs, /window\.setSelectedFacilityKey\?\./);
  assert.match(mapJs, /window\.renderSelectedFacilityPanel\?\./);
  assert.match(mapJs, /if \(areaLayout\) areaLayout\.hidden = show/);
  assert.match(mapJs, /if \(mapFacilityPanel\) mapFacilityPanel\.hidden = !show/);
  assert.doesNotMatch(mapJs, /map-list-card|syncMapListCards|scrollIntoView/);
  assert.doesNotMatch(html, /body\.map-active \.map-list-card/);
});

test('map markers use neutral, muted, and selected states instead of a status legend', () => {
  assert.doesNotMatch(html, /class="map-key/);
  assert.doesNotMatch(html, /map-key-before|map-key-soon|map-key-ended/);
  assert.match(mapJs, /return '#A7B2AC'/);
  assert.match(mapJs, /return '#719784'/);
  assert.match(mapJs, /map-marker--selected/);
  assert.match(html, /\.map-marker--selected\{[^}]*background:var\(--brand-green\)/);
});

test('selected map markers use static size, ring, and stacking emphasis', () => {
  assert.match(html, /\.map-marker\{[^}]*width:18px;height:18px;border:2px solid var\(--paper-card\)/);
  assert.match(html, /\.map-marker--selected\{[^}]*width:30px;height:30px;margin:-6px;border:4px solid var\(--paper-card\)[^}]*box-shadow:0 0 0 2px var\(--brand-green-deep\)[^}]*opacity:1/);
  assert.match(html, /\.map-marker--selected\{z-index:3;\}/);
  assert.match(mapJs, /zIndexOffset: selectedMarkerKey === card\.dataset\.facilityKey \? 1000 : 0/);
  assert.match(mapJs, /marker\.setZIndexOffset\(selectedMarkerKey === key \? 1000 : 0\)/);
  assert.doesNotMatch(html, /\.map-marker--selected\{[^}]*animation/);
});

test('every same-origin script the shell loads is precached, in load order', () => {
  const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
  const shell = [...sw.matchAll(/'\.\/([^']+)'/g)].map(match => match[1]);
  for (const src of scripts) {
    if (/^https?:/.test(src)) continue;
    assert.ok(shell.includes(src), `${src} is loaded by index.html but not precached by sw.js`);
  }
  // The scoped Pass benefit source must be parsed before the inline runtime
  // that adapts it, otherwise the adapter starts with an empty table.
  const scopedAt = html.indexOf('<script src="data/facility-pass-benefits.js"></script>');
  assert.ok(scopedAt > 0, 'index.html does not load the scoped Pass benefit data');
  assert.ok(scopedAt < html.lastIndexOf('<script>'), 'scoped data loads after the runtime');
  for (const [data, runtime] of [
    ['data/exhibition-meta.js', 'exhibition-meta-runtime.js'],
    ['data/facility-official-sources.js', 'official-source-runtime.js'],
    ['data/facility-pass-time-scope.js', 'pass-time-scope-runtime.js']
  ]) {
    assert.ok(scripts.indexOf(data) >= 0, `${data} must load`);
    assert.equal(scripts.indexOf(runtime), scripts.indexOf(data) + 1,
      `${runtime} must load immediately after its data`);
    assert.equal(shell.indexOf(runtime), shell.indexOf(data) + 1,
      `${runtime} must follow its data in the precache`);
  }
  assert.match(sw, /grutto-pass-v127/);
  assert.match(sw, /'\.\/facility-presentation-model\.js'/);
  assert.match(sw, /'\.\/manifest\.json'/);
  assert.match(sw, /'\.\/assets\/brand\/pyoko-symbol-192\.png'/);
  assert.match(sw, /'\.\/assets\/brand\/pyoko-symbol-512\.png'/);
});

test('the scoped Pass benefit adapter is the only monetary boundary', () => {
  // Legacy resolution survives for the facilities that still need it.
  assert.match(html, /function legacyKnownBenefit\(f\)/);
  assert.match(html, /function legacyRegularAdultPrice\(f\)/);
  // The public helpers keep their names so the card contract is unchanged.
  assert.match(html, /function getKnownBenefit\(f\)\{\s*const resolved = getFacilityComparableValue/);
  assert.match(html, /function getRegularAdultPrice\(f\)\{\s*return getFacilityRegularPriceForValueBasis/);
  // Authority is decided by verification status, never by a null value.
  assert.match(html, /function hasAuthoritativeScopedMonetaryRecord\(key\)\{\s*return getScopedPassRecord\(key\)\?\.verification_status === 'priced';/);
  assert.doesNotMatch(html, /comparable_value_yen \?\? /);
  // The legacy benefit path must not re-enter the scoped price accessor.
  const legacyBody = html.slice(html.indexOf('function legacyKnownBenefit'), html.indexOf('function getKnownBenefit'));
  assert.doesNotMatch(legacyBody, /getRegularAdultPrice\(/);
  assert.match(legacyBody, /legacyRegularAdultPrice\(f\)/);
  // The card data contract is still produced from the same two helpers.
  assert.match(html, /data-benefit="\$\{Number\.isFinite\(benefit\)\?benefit:''\}"/);
  assert.match(html, /data-regular-price="\$\{Number\.isFinite\(regularPrice\)\?regularPrice:''\}"/);
});

test('official entitlement, interpretation and derived value stay in separate layers', () => {
  // One model feeds Browse, Facility Drawer and Map Detail alike.
  assert.match(html, /function getFacilityPassPresentation\(f, key = facilityPassKey\(f\)\)/);
  assert.match(html, /entitlements: getFacilityEntitlements\(key\)/);
  assert.match(html, /comparable: getFacilityComparableValue\(key, f\)/);
  assert.doesNotMatch(html, /drawerPassRenderer|mapPassRenderer/);

  // The official clauses are the Detail anchor and keep their source labels.
  assert.match(html, /<dt class="pass-clause-label">\$\{escapeHtml\(clause\.label\)\}<\/dt>/);
  assert.match(html, /const primary = language === 'ja' \? clause\.official : \(clause\.translated \|\| clause\.official\)/);

  // The derived value is a separate, visually secondary layer that names its
  // basis, and a source-stated amount is never repeated as one.
  assert.match(html, /<p class="pass-reference" data-confidence="verified">/);
  assert.match(html, /<span class="pass-reference-basis">/);
  assert.match(ui, /const statedInEntitlement = Boolean\(basisBenefit/);
  assert.match(ui, /basisBenefit\.type === 'discount_fixed'/);

  // A legacy fallback amount must not look as trustworthy as a verified one.
  assert.match(html, /pass-reference--estimate/);
  assert.match(html, /\.pass-benefit-value\[data-confidence="estimated"\]\{color:var\(--ink-faint\)/);

  // Presentation never edits the card data contract.
  assert.doesNotMatch(html, /data-benefit="\$\{(reference|copy\.value)/);
});

test('personal state is one radio group, so no dead visited+want combination exists', () => {
  const panelStart = html.indexOf('<div class="filters-panel" id="filtersPanel"');
  const panelEnd = html.indexOf('<button type="button" class="filters-backdrop"', panelStart);
  const panelMarkup = html.slice(panelStart, panelEnd);
  const values = [...panelMarkup.matchAll(/name="visitedFilter" value="([a-z]+)"/g)].map(match => match[1]);
  assert.deepEqual(values, ['all', 'unvisited', 'want', 'visited']);
  assert.match(panelMarkup, /data-i18n="filters\.myList"/);
  // The standalone switch is gone: two controls over one exclusive dimension
  // allowed 訪問済みのみ + 行きたい, which can never return a result.
  assert.doesNotMatch(html, /id="onlyWantToGo"/);
  assert.doesNotMatch(html, /const onlyWant = /);
  assert.match(html, /function matchesPersonalState\(key, mode\)/);
  assert.match(html, /if \(mode === 'want'\) return isWantToGo\(key\);/);
  // Want to go must not be counted as a second active condition.
  assert.doesNotMatch(html, /const activeCount = \[[^\]]*onlyWant/);
});

test('preference-like filters persist, contextual ones deliberately do not', () => {
  assert.match(html, /const FILTER_STORAGE_VERSION = 'v1';/);
  assert.match(html, /filters:\$\{FILTER_STORAGE_VERSION\}/);
  assert.match(html, /const PERSISTED_RADIO_FILTERS = \['statusFilter', 'passFilter', 'visitedFilter'\];/);
  assert.match(html, /const PERSISTED_SELECT_FILTERS = \['valueFilter', 'sortMode'\];/);

  // The search box, the geo radius and the date/time are excluded on purpose:
  // restoring them would assert something untrue after a reload.
  const readState = html.slice(html.indexOf('function readFilterState()'), html.indexOf('function persistFilterState()'));
  assert.doesNotMatch(readState, /searchInput|radiusFilter|targetDate|targetTime/);

  // The first applyFilters() of a load must not write DOM defaults over the
  // stored state before it has been read.
  assert.match(html, /let filterStateRestored = false;/);
  assert.match(html, /function persistFilterState\(\)\{\s*if \(!filterStateRestored\) return;/);
  assert.match(html, /updateMapMarkers\(\);\s*persistFilterState\(\);/);
  assert.match(html, /restoreFilterState\(\);\s*syncLiveTimeInputs\(\);/);

  // Stored values are validated against the controls actually present, so a
  // renamed or disabled option cannot strand the UI.
  assert.match(html, /const target = inputs\.find\(input => input\.value === value\);/);
  assert.match(html, /if \(!target \|\| target\.disabled\) return;/);
  assert.match(html, /if \(!option \|\| option\.disabled\) return;/);
});

test('the open-now filter labels itself by the date and time it actually reads', () => {
  assert.match(html, /function syncNowOpenLabels\(\)/);
  assert.match(html, /const labelKey = live \? 'filters\.nowOpen' : 'filters\.nowOpenAtSelected';/);
  assert.match(html, /const infoKey = live \? 'filters\.statusInfoNow' : 'filters\.statusInfoNowSelected';/);
  // Both the quick chip and the panel radio carry the hook, and so does the ⓘ line.
  assert.equal((html.match(/data-nowopen-label/g) || []).length, 3);
  assert.equal((html.match(/data-nowopen-info/g) || []).length, 2);
  // The key is written back so a later language switch translates the variant
  // that is showing, not the one the markup shipped with.
  assert.match(html, /element\.dataset\.i18n = labelKey;/);
  assert.match(html, /updateDateTimeSummary\(\);\s*syncNowOpenLabels\(\);/);
});

test('a chosen time offers the open-at-that-time filter instead of applying it', () => {
  assert.match(html, /id="openAtTimeSuggestion"/);
  assert.match(html, /id="openAtTimeApply"/);
  assert.match(html, /id="openAtTimeDismiss"/);
  assert.match(html, /function syncOpenAtTimeSuggestion\(\)/);
  assert.match(html, /const show = !isLiveTimeMode\(\) && Boolean\(time\) && statusMode !== 'nowopen' && !openAtTimeSuggestionDismissed;/);
  // Only a click applies it: the date and time listeners must never select the
  // filter themselves.
  const timeHandlers = html.slice(html.indexOf('const refreshTimeDependentUi ='), html.indexOf("timeNowButton?.addEventListener"));
  assert.doesNotMatch(timeHandlers, /nowopen/);
  const applyHandler = html.slice(html.indexOf("getElementById('openAtTimeApply')"), html.indexOf("getElementById('openAtTimeDismiss')"));
  assert.match(applyHandler, /input\[name="statusFilter"\]\[value="nowopen"\]/);
  // Saying no once is remembered for the page session.
  assert.match(html, /let openAtTimeSuggestionDismissed = false;/);
  assert.match(html, /openAtTimeSuggestionDismissed = true;/);
  // The offer participates in the results-bar visibility rule.
  assert.match(html, /hasClearAction \|\| hasSuggestion\)/);
});

test('Map view has its own entry to the one shared location state', () => {
  assert.match(html, /id="mapLocateBtn"/);
  assert.match(html, /data-i18n-attr="aria-label:map\.locateAria"/);
  // Second entry, not a second implementation: geolocation is never called here.
  assert.doesNotMatch(html, /navigator\.geolocation/);
  const handler = html.slice(html.indexOf("getElementById('mapLocateBtn')"), html.indexOf("getElementById('mapLocateBtn')") + 700);
  assert.match(handler, /if \(typeof userPos !== 'undefined' && userPos\) \{\s*centerMapOnUser\(\);/);
  assert.match(handler, /requestLocation\(/);
  // The filter-panel entry stays: the radius filter and 近い順 live there.
  assert.match(html, /id="geoBtn"/);
  assert.match(html, /id="radiusFilter"/);
  assert.match(html, /id="sortNearOption"/);
});

test('the location entry points share one presentation owner', () => {
  const nearby = fs.readFileSync(path.join(__dirname, '..', 'phase2', 'phase2-nearby.js'), 'utf8');
  assert.match(nearby, /function syncMapLocateButton\(\)/);
  assert.match(nearby, /function refreshLocationUi\(\)\s*\{[\s\S]*syncMapLocateButton\(\);/);
  // Every state transition reaches both buttons, so they cannot disagree.
  const requestBody = nearby.slice(nearby.indexOf('function requestLocation'));
  assert.equal((requestBody.match(/syncMapLocateButton\(\);/g) || []).length, 4);
});

test('only files the app actually loads are published', () => {
  const build = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'build-pages.js'), 'utf8');
  // Internal verification artifacts record how the data was checked, not what it
  // says, so publishing them gives a reader nothing and gives a copier the
  // reasoning behind the set.
  assert.match(build, /const excludedPaths = \[\s*'data\/review',/);
  assert.match(build, /excludedNames = new Set\(\['\.DS_Store'/);
  // A recursive copy would ship anything later added under data/, so the build
  // fails rather than trusting anyone to remember the exclusion.
  assert.match(build, /const SHELL_ASSETS = \\\[/);
  assert.match(build, /file\.startsWith\('data\/'\) && !shellAssets\.has\(file\)/);
  assert.match(build, /throw new Error\(\s*`These files would be published but are never loaded by the app/);
  // The terms and the crawler policy have to reach the site to mean anything.
  assert.match(build, /'404\.html',\s*'facility-presentation-model\.js',\s*'exhibition-meta-runtime\.js',\s*'official-source-runtime\.js',\s*'pass-time-scope-runtime\.js',\s*'config\.js',/);
  assert.doesNotMatch(build, /'robots\.txt',\s*'sitemap\.xml'/);
  assert.match(build, /buildFacilitySurfaces/);
});

test('published code, data, third-party material and crawler policy have separate terms', () => {
  const root = path.join(__dirname, '..');
  const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
  const terms = fs.readFileSync(path.join(root, 'DATA_AND_CONTENT_TERMS.md'), 'utf8');
  const notices = fs.readFileSync(path.join(root, 'THIRD-PARTY-NOTICES.md'), 'utf8');
  assert.match(license, /Copyright \(c\) 2026 Yu/);
  assert.match(license, /only to software code and functional implementation/);
  assert.match(license, /Permission is hereby granted, free of charge/);
  assert.match(license, /DATA_AND_CONTENT_TERMS\.md/);
  assert.match(terms, /claims no exclusive rights in underlying public facts/);
  assert.match(terms, /protectable original selection/);
  assert.match(terms, /does not grant a general open-data licence/);
  assert.match(terms, /official Tokyo Museum Grutto Pass operator may, free of charge/);
  assert.match(terms, /The PYOKO name, logo, Forest visual identity/);
  assert.match(notices, /`coords\.js` contains coordinates derived from OpenStreetMap/);
  assert.match(notices, /OpenStreetMap data is available under the Open\s+Database License \(ODbL\)/);

  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  assert.match(robots, /\/DATA_AND_CONTENT_TERMS\.md/);
  assert.match(robots, /^User-agent: \*\nSitemap: https:\/\/pyoko\.jp\/sitemap\.xml$/m);
  const generalPolicy = robots.slice(
    robots.indexOf('User-agent: *'),
    robots.indexOf('\nUser-agent: GPTBot')
  );
  assert.doesNotMatch(generalPolicy, /^Disallow:/m);
  assert.match(robots, /^Sitemap: https:\/\/pyoko\.jp\/sitemap\.xml$/m);
  for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Bytespider', 'PerplexityBot']) {
    assert.match(robots, new RegExp(`^User-agent: ${agent}$`, 'm'), `${agent} not covered`);
  }
  // Pages stay indexable: the blanket disallow applies to crawlers, not readers.
  assert.doesNotMatch(robots, /^User-agent: \*\nDisallow: \/$/m);

  // The reader is told in their own language, not only in a repository file.
  assert.match(html, /data-i18n="footer\.termsHeading"/);
  assert.match(html, /data-i18n="footer\.termsBody"/);
  assert.match(html, /href="\/DATA_AND_CONTENT_TERMS\.md"[^>]*data-i18n="footer\.termsLicense"/);
});
