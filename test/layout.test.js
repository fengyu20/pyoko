const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('English desktop rail widens without changing the JA/ZH rail or card minimum', () => {
  assert.match(html, /\.area-layout\{display:grid;grid-template-columns:190px minmax\(0,1fr\);gap:24px/);
  assert.match(html, /html:lang\(en\) \.area-layout\{grid-template-columns:240px minmax\(0,1fr\);\}/);
  assert.match(html, /\.grid\{display:grid; grid-template-columns:repeat\(auto-fill,minmax\(400px,1fr\)/);
  assert.doesNotMatch(html, /html:lang\((?:ja|zh)\) \.area-layout\{grid-template-columns:240px/);
});

test('exhibition Fee and Hours values share a wrapped value node', () => {
  assert.match(html, /\.enriched-meta-value\{display:block;min-width:0;flex:1 1 auto;overflow-wrap:anywhere;\}/);
  assert.match(html, /html:lang\(en\) \.enriched-meta\{grid-template-columns:minmax\(0,1fr\);\}/);
  assert.match(html, /html:lang\(en\) \.enriched-meta-field--fee,[\s\S]*?html:lang\(en\) \.enriched-meta-field--hours\{display:grid;grid-template-columns:max-content minmax\(0,1fr\)/);
  assert.match(html, /<span class="enriched-meta-field enriched-meta-field--\$\{escapeHtml\(overlayKey\)\}"><b>\$\{escapeHtml\(t\(labelKey\)\)\}<\/b><span class="enriched-meta-value">\$\{escapeHtml\(value\)\}<\/span><\/span>/);
});

test('sticky controls use the quiet page surface and a single divider', () => {
  const controls = html.match(/\.controls-wrap\{[\s\S]*?\n  \}/)?.[0] || '';
  assert.match(controls, /background:var\(--paper-card\)/);
  assert.match(controls, /border-bottom:1px solid/);
  assert.match(controls, /box-shadow:none/);
  assert.doesNotMatch(controls, /background:rgba/);
  assert.doesNotMatch(controls, /backdrop-filter/);
});

test('ordinary desktop list cards keep natural heights while map expansion stays scoped', () => {
  assert.match(html, /\.grid\{display:grid; grid-template-columns:repeat\(auto-fill,minmax\(400px,1fr\)\); gap:20px;align-items:start;\}/);
  assert.match(html, /body:not\(\.map-active\) \.area-layout \.grid,[\s\S]*?body:not\(\.map-active\) \.area-layout \.grid\.has-expanded-card\{align-items:start;\}/);
  assert.match(html, /const expandedEnrichedCards = new Set\(\);/);
  assert.match(html, /expandedEnrichedCards\.has\(facility\._key \|\|/);
  assert.match(html, /card\.dataset\.enrichedHasMore = String\(hasMore\)/);
  assert.match(html, /grid\.classList\.toggle\('has-expanded-card', hasExpandedCard\)/);
  assert.match(html, /expandedEnrichedCards\.add\(card\.dataset\.facilityKey\)/);
});

test('desktop toolbar gives the native time input enough room', () => {
  assert.match(html, /@media \(min-width:900px\)\{/);
  assert.match(html, /\.controls-primary \.search-box\{flex:1 1 360px;min-width:220px;max-width:460px;\}/);
  assert.match(html, /\.date-picker-wrap input\[type="time"\]\{inline-size:112px;min-inline-size:112px;flex:0 0 112px;\}/);
});

test('mobile browse state shows one date+time condition instead of native fields', () => {
  // The summary is the browse-state control; the native inputs belong to the
  // Date & time edit state and stay a single source of truth.
  assert.match(html, /<button type="button" class="datetime-summary" id="dateTimeSummary" aria-expanded="false" aria-controls="dateTimePanel">/);
  assert.match(html, /<span class="datetime-summary-value" id="dateTimeSummaryValue"><\/span>/);
  assert.match(html, /<div class="date-picker-wrap" id="dateTimePanel" role="group" aria-labelledby="dateTimePanelTitle" tabindex="-1">/);
  assert.match(html, /<input type="date" id="targetDate">/);
  assert.match(html, /<input type="time" id="targetTime">/);
  assert.equal(html.match(/id="targetDate"/g).length, 1);
  assert.equal(html.match(/id="targetTime"/g).length, 1);
  assert.match(html, /<div class="datetime-panel-actions">\s*<button type="button" class="time-now-button" id="targetTimeNow" hidden[\s\S]*?<button type="button" class="datetime-done-button" id="dateTimeDoneButton"/);
  assert.match(html, /\.datetime-summary\{display:none;\}/);
  assert.match(html, /\.controls-primary \.date-picker-wrap\{\s*position:fixed;left:0;right:0;bottom:0;z-index:32;/);
  assert.match(html, /body\.scroll-locked\{overflow:hidden;\}/);
  assert.doesNotMatch(html, /body\.filters-open,body\.datetime-open\{overflow:hidden;\}/);
  // The old always-present toolbar chrome is gone, not merely hidden.
  assert.doesNotMatch(html, /controls-collapse-btn/);
  assert.doesNotMatch(html, /compact-filter-count/);
  assert.doesNotMatch(html, /time-field-label-row/);
});

test('mobile quick filters own a full-width row beneath the action controls', () => {
  assert.match(html, /\.controls-action-row\{grid-column:1;grid-row:3;display:grid;grid-template-columns:minmax\(0,1fr\) max-content;/);
  assert.match(html, /\.controls-action-row \.quick-filters\{grid-column:1 \/ -1;grid-row:2;\}/);
  assert.match(html, /\.controls-action-row\{grid-row:2;grid-template-columns:max-content minmax\(0,1fr\) max-content;\}/);
  assert.match(html, /\.quick-filters\{gap:4px 8px;overflow-x:auto;flex-wrap:nowrap;/);
});

test('mobile view switch is icon-only while keeping localized accessible names', () => {
  assert.match(html, /id="listToggleBtn"[^>]*aria-label="リスト" data-i18n-attr="aria-label:controls\.list"/);
  assert.match(html, /id="mapToggleBtn"[^>]*aria-label="マップ" data-i18n-attr="aria-label:controls\.map"/);
  assert.match(html, /<span class="view-tab-label" data-i18n="controls\.list">リスト<\/span>/);
  assert.match(html, /\.view-tab-label\{display:none;\}/);
  assert.match(html, /\.view-tab\{min-width:44px;min-height:44px;/);
});

test('compact sticky controls collapse repeatedly without a permanent manual lock', () => {
  assert.match(html, /const MOBILE_CONTROLS_COLLAPSE_TRAVEL = 64;/);
  assert.match(html, /let mobileControlsExpandAnchorY = null;/);
  assert.match(html, /if \(mobileControlsExpandAnchorY !== null\s*&& window\.scrollY < mobileControlsExpandAnchorY \+ MOBILE_CONTROLS_COLLAPSE_TRAVEL\) return;/);
  assert.doesNotMatch(html, /mobileControlsManualExpanded/);
  assert.doesNotMatch(html, /mobileControlsCollapsePending/);
  assert.match(html, /\.controls-wrap\.is-compact \.controls-primary \.search-box\{display:none;\}/);
  assert.match(html, /\.controls-wrap\.is-compact \.quick-filters\{display:none;\}/);
  assert.match(html, /\.controls-wrap\.is-compact \.controls-action-row\{display:flex;align-items:center;gap:8px;min-width:0;\}/);
  assert.match(html, /let liveTimeMode = true;/);
  assert.match(html, /function isLiveTimeMode\(\)/);
  assert.match(html, /if \(nowButton\) nowButton\.hidden = live;/);
});

test('the passive Facility Card surface is one delegated Detail affordance', () => {
  assert.match(html, /const INDEPENDENT_CARD_INTERACTIONS = \[/);
  assert.match(html, /'\.enriched-item', '\.visited-toggle',/);
  assert.match(html, /const isIndependentCardInteraction = target => Boolean\(/);
  assert.match(html, /if \(event\.defaultPrevented \|\| isIndependentCardInteraction\(event\.target\)\) return;/);
  assert.match(html, /if \(hasActiveTextSelection\(\)\) return;/);
  // The card object must not become a second tab stop or a second renderer.
  assert.doesNotMatch(html, /<div class="card" id="card-\$\{escapeHtml\(key\)\}"[^>]*tabindex/);
  assert.match(html, /window\.openFacilityDetail\?\.\(card\.dataset\.facilityKey, titleButton \|\| null\)/);
});

test('the map selection surface is responsive with one shared selection state', () => {
  assert.match(html, /<button type="button" class="map-selection-preview" id="mapSelectionPreview" hidden>/);
  assert.match(html, /<div class="map-selection-layer" id="mapSelectionLayer" aria-live="polite">/);
  assert.match(html, /const isSplitViewMapLayout = \(\) => window\.matchMedia\('\(min-width: 1200px\)'\)\.matches;/);
  assert.match(html, /body\.map-active \.map-mode-layout \.map-facility-panel\{display:none!important;\}/);
  assert.match(html, /@media \(min-width:1200px\)\{[\s\S]*?body\.map-active \.map-selection-layer\{display:none;\}/);
  assert.match(html, /body\.map-active #mapCanvas\{\s*height:calc\(100vh - var\(--controls-height,0px\) - 112px\);\s*height:calc\(100dvh - var\(--controls-height,0px\) - 112px\);/);
  // The preview is a summary; the Drawer stays the only full Detail renderer.
  assert.match(html, /if \(key\) openFacilityDetail\(key, mapSelectionPreview\);/);
  assert.doesNotMatch(html, /populateFacilityDetail\(mapSelectionPreview/);
});

test('the shared Toast has explicit responsive message and action ownership', () => {
  assert.match(html, /<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" hidden>/);
  assert.match(html, /\.toast\{[\s\S]*display:grid;grid-template-columns:minmax\(0,1fr\) max-content;/);
  assert.match(html, /\.toast-message\{min-width:0;overflow-wrap:anywhere;/);
  assert.match(html, /\.toast button\{[\s\S]*min-width:max-content;[\s\S]*white-space:nowrap;/);
  assert.match(html, /body\.toast-visible \.back-top\{display:none !important;\}/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*--toast-inline-start:max\(16px,env\(safe-area-inset-left\)\)/);
  assert.match(html, /@media \(max-width:640px\)\{[\s\S]*\.toast button::before\{content:none;\}/);
  assert.match(html, /@media \(max-width:374px\)\{[\s\S]*\.toast\{grid-template-columns:minmax\(0,1fr\);row-gap:2px;\}/);
  assert.match(html, /const TOAST_DURATION_MS = 6000;/);
  assert.match(html, /if \(revision !== toastRevision\) return;/);
});
