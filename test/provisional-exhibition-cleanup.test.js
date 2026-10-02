// 仮(暫定)展覧会データの修正を共有投影(ユーザー可視面)で検証する。
// No.47 と No.98 の 2 施設だけを対象とする(他の(仮)は対象外)。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const createFacilityPresentationModel = require('../facility-presentation-model.js');

const dataFiles = ['config.js', 'data/facilities.js', 'data/exhibition-meta.js', 'exhibition-meta-runtime.js'];
const source = dataFiles.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n;\n')
  + ';globalThis.__api = { CONFIG, DATA, getEnrichedMeta };';
const context = vm.createContext({});
vm.runInContext(source, context, { filename: 'provisional-cleanup-data-bundle.js' });
const { CONFIG, DATA, getEnrichedMeta } = context.__api;
const facilities = DATA.flatMap(area => area.facilities || []);
const findFacility = no => facilities.find(f => String(f.no) === String(no));

const model = createFacilityPresentationModel({ CONFIG, DATA, getEnrichedMeta });
const projectExhibition = (no, referenceDate) => model.getFacilityExhibitionProjection(findFacility(no), referenceDate);
const findItem = (no, title) => {
  const facility = findFacility(no);
  return { facility, item: facility.enriched.find(entry => entry.title === title) };
};

test('No.47 の確定タイトルが会期内の投影に表示される', () => {
  const projection = projectExhibition('47', '2026-09-15');
  const titles = projection.items.map(item => item.title);
  assert.ok(titles.includes('YUKI TORII 鳥居ユキのハッピー・パワー・アイデンティティ'));
  assert.equal(titles.some(title => /TORII展[（(]仮/.test(title)), false);
});

test('No.47 の確定展示は進行中として正しい会期を持つ', () => {
  const { facility, item } = findItem('47', 'YUKI TORII 鳥居ユキのハッピー・パワー・アイデンティティ');
  assert.ok(item);
  const meta = getEnrichedMeta(facility, item);
  assert.deepEqual([meta.validFrom, meta.validTo], ['2026-09-01', '2026-12-20']);
  assert.equal(meta.checkedAt, '2026-09-04');
  const projected = projectExhibition('47', '2026-10-01').items.find(entry => entry.title === item.title);
  assert.ok(projected);
  assert.equal(projected.relevance_state, 'ongoing');
  assert.deepEqual([projected.valid_from, projected.valid_to], ['2026-09-01', '2026-12-20']);
});

test('No.47 の最終 identity は公式展示ページへ解決する', () => {
  const { facility, item } = findItem('47', 'YUKI TORII 鳥居ユキのハッピー・パワー・アイデンティティ');
  assert.equal(item.url, 'https://acce-museum.main.jp/exhibition/');
  assert.doesNotMatch(item.fields['概要'], /詳細は公式サイトの発表をご確認ください/);
});

test('No.98 は公式の文豪とアルケミストPART VI イベントを現在展示として表示する', () => {
  const projection = projectExhibition('98', '2026-09-04');
  const titles = projection.items.map(item => item.title);
  assert.ok(titles.includes('青梅市吉川英治記念館×文豪とアルケミストPART Ⅵ Many thanks ～私たちと文アル～'));
  assert.equal(titles.some(title => /英治が愛した青梅/.test(title)), false);
  assert.equal(titles.some(title => /（仮）|(仮)/.test(title)), false);
});

test('No.98 の現在イベントは進行中で正しい会期とリンクを持つ', () => {
  const title = '青梅市吉川英治記念館×文豪とアルケミストPART Ⅵ Many thanks ～私たちと文アル～';
  const { facility, item } = findItem('98', title);
  assert.ok(item);
  const meta = getEnrichedMeta(facility, item);
  assert.deepEqual([meta.validFrom, meta.validTo], ['2026-07-18', '2026-11-29']);
  assert.equal(meta.checkedAt, '2026-09-04');

  const projected = projectExhibition('98', '2026-09-04').items.find(entry => entry.title === title);
  assert.ok(projected);
  assert.equal(projected.relevance_state, 'ongoing');
  assert.deepEqual([projected.valid_from, projected.valid_to], ['2026-07-18', '2026-11-29']);
});

test('No.98 の旧仮タイトルは schedule_lines にも残らない', () => {
  const facility = findFacility('98');
  assert.equal(facility.schedule_lines.some(line => /英治が愛した青梅/.test(line)), false);
  assert.equal(facility.schedule_lines.some(line => /（仮）|(仮)/.test(line)), false);
  assert.equal(facility.enriched.some(item => /英治が愛した青梅/.test(item.title)), false);
});

/* ---- リンク解決(既存ナビゲーション所有モデル) ---- */

const window = {};
const context2 = vm.createContext({ window, URL });
vm.runInContext(fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8'), context2, { filename: 'facilities.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'data/exhibition-links.js'), 'utf8'), context2, { filename: 'exhibition-links.js' });
const links = window.EXHIBITION_LINKS;
const uiWindow = {
  EXHIBITION_LINKS: links,
  EXHIBITION_LINK_TYPES: window.EXHIBITION_LINK_TYPES,
  location: { href: 'https://example.test/?lang=ja' },
  navigator: { language: 'ja' }
};
const uiContext = vm.createContext({ window: uiWindow, URL });
vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), uiContext, { filename: 'i18n/ui.js' });

test('No.98 の展覧会リンクは公式イベント詳細ページを指す', () => {
  const title = '青梅市吉川英治記念館×文豪とアルケミストPART Ⅵ Many thanks ～私たちと文アル～';
  const facility = findFacility('98');
  const item = facility.enriched.find(entry => entry.title === title);
  assert.ok(item);
  assert.equal(
    uiWindow.getExhibitionLink(facility, item),
    'https://ome-yoshikawaeiji.net/events/event-10275'
  );
});

test('No.47 の展覧会リンクは公式展示ページのまま解決する', () => {
  const title = 'YUKI TORII 鳥居ユキのハッピー・パワー・アイデンティティ';
  const facility = findFacility('47');
  const item = facility.enriched.find(entry => entry.title === title);
  assert.ok(item);
  assert.equal(uiWindow.getExhibitionLink(facility, item), 'https://acce-museum.main.jp/exhibition/');
});
