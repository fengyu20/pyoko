// 展覧会の会期推定・明示的な例外補正を検証する。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const files = ['config.js', 'data/facilities.js', 'data/exhibition-meta.js', 'exhibition-meta-runtime.js'];
const source = files.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n;\n')
  + ';globalThis.__api = { DATA, getEnrichedMeta };';
const context = vm.createContext({});
vm.runInContext(source, context, { filename: 'exhibition-meta-bundle.js' });
const { DATA, getEnrichedMeta } = context.__api;
const facilities = DATA.flatMap(area => area.facilities || []);
const findFacility = no => facilities.find(f => String(f.no) === String(no));
const findItem = (no, title) => {
  const facility = findFacility(no);
  const item = facility.enriched.find(entry => entry.title === title);
  return { facility, item };
};

test('展覧会会期は schedule_lines から推定できる', () => {
  const { facility, item } = findItem('2', '大ゴッホ展　夜のカフェテラス');
  assert.deepEqual(getEnrichedMeta(facility, item).validFrom, '2026-05-29');
  assert.deepEqual(getEnrichedMeta(facility, item).validTo, '2026-08-12');
});

test('明示した終了日で終了済み展示を判定できる', () => {
  const { facility, item } = findItem('17', '浜口陽三と白倉嘉入展 満ちてくる光');
  const meta = getEnrichedMeta(facility, item);
  assert.equal(meta.validTo, '2026-08-02');
  assert.equal(meta.dateState, 'dated');
});

test('スラッシュ区切りの翌年会期も年を保持する', () => {
  const { facility, item } = findItem('82', '企画展「西望偉人伝」');
  assert.equal(getEnrichedMeta(facility, item).validTo, '2027-04-04');
});

test('府中のプラネタリウム料金は入場券付き・パス利用可と明示される', () => {
  const { facility, item } = findItem('89', '生解説プラネタリウム「クイズで星空大冒険！2026」');
  assert.equal(item.fields['料金'], '一般900円（プラネタリウム観覧券付き入場券／パスで入場）');
  assert.match(item.notice, /特別投映は対象外/);
});

test('東京シティビューの展覧会会期は情報カードにも使える', () => {
  const { facility, item } = findItem('36', 'TVアニメ『薬屋のひとりごと』×東京シティビュー「舞が織りなす幻想の世界」');
  const meta = getEnrichedMeta(facility, item);
  assert.equal(meta.validFrom, '2026-08-01');
  assert.equal(meta.validTo, '2026-10-26');
});

test('月次更新で会期未確認の項目を残さない', () => {
  const unresolved = facilities.flatMap(f => (f.enriched || []).map(item => ({
    no: f.no,
    title: item.title,
    state: getEnrichedMeta(f, item).dateState
  }))).filter(item => item.state === 'unknown');
  assert.equal(unresolved.length, 0);
});

test('定期開催のコンサートは会期未確認ではなく recurring として扱う', () => {
  const { facility, item } = findItem('6', '日曜コンサート（チェンバロ／パイプオルガン）');
  const meta = getEnrichedMeta(facility, item);
  assert.equal(meta.dateState, 'recurring');
  assert.match(item.notice, /第5日曜は実施なし/);
});
