const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({ window: {} });
const runtimeFiles = [
  'config.js',
  'data/facilities.js',
  'data/exhibition-meta.js',
  'exhibition-meta-runtime.js',
  'data/facility-pass-time-scope.js',
  'pass-time-scope-runtime.js',
  'data/facility-pass-benefits.js'
];
vm.runInContext(
  runtimeFiles.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n')
    + '\nglobalThis.__api = { CONFIG, DATA, EXHIBITION_META, getEnrichedMeta, getPassTimeScope, getPassAdmissionWindows, FACILITY_PASS_TIME_SCOPE, FACILITY_PASS_BENEFITS };',
  context,
  { filename: 'data-reconciliation-runtime.js' }
);
vm.runInContext(fs.readFileSync(path.join(root, 'data/exhibition-links.js'), 'utf8'), context);

const api = context.__api;
const facilities = api.DATA.flatMap(area => area.facilities || []);
const byKey = new Map(facilities.map(facility => [String(facility._key || facility.no), facility]));
const itemFor = (key, title) => byKey.get(key).enriched.find(item => item.title === title);
const metaFor = (key, title) => api.getEnrichedMeta(byKey.get(key), itemFor(key, title));
const plain = value => JSON.parse(JSON.stringify(value));

test('October–November recommendation provenance is newest-first and preserves history', () => {
  assert.equal(api.CONFIG.lastUpdated, '2026-10-06');
  assert.deepEqual(plain(api.CONFIG.sources.recommendations), [
    {
      id: '2026-10-06', periodStart: '2026-10', periodEnd: '2026-11',
      admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260930-6956/',
      discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260930-6955/'
    },
    {
      id: '2026-09-04', periodStart: '2026-09', periodEnd: '2026-10',
      admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260827-6903/',
      discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260827-6902/'
    },
    {
      id: '2026-08-09', periodStart: '2026-08', periodEnd: '2026-09',
      admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
      discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260729-6865/'
    },
    {
      id: '2026-07-08', periodStart: '2026-07', periodEnd: '2026-08',
      admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260626-6804/',
      discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260624-6803/'
    }
  ]);
});

test('No.15 successor has the official identity, dates, source and no duplicate', () => {
  const title = '特別展「観潮楼歌会―鴎外の歌壇観測」';
  const url = 'https://moriogai-kinenkan.jp/modules/event/print.php?action=View&caldate=2026-11-15&cid=0&event_id=0000002534&smode=Daily';
  const facility = byKey.get('15');
  assert.equal(facility.enriched.filter(item => item.title === title).length, 1);
  assert.ok(facility.enriched.some(item => item.title === '鷗外、雑誌をつくる。'));
  assert.deepEqual([metaFor('15', title).validFrom, metaFor('15', title).validTo, metaFor('15', title).checkedAt],
    ['2026-10-10', '2027-01-11', '2026-10-06']);
  assert.equal(itemFor('15', title).url, url);
  assert.deepEqual(plain(facility.exhibition_sources), [url]);
  assert.equal(facility.exhibition_check.source_url, url);
  assert.equal(facility.exhibition_check.checked_on, '2026-10-06');
});

test('No.34 facility listing supplies visible facts while the accepted Pass window stays separate', () => {
  const title = '関島寿子 かごについてのかご';
  const url = 'https://www.musee-tomo.or.jp/exhibition/schedule.html';
  const facility = byKey.get('34');
  assert.ok(facility.schedule_lines.includes(title));
  assert.equal(facility.enriched.filter(item => item.title === title).length, 1);
  assert.deepEqual([metaFor('34', title).validFrom, metaFor('34', title).validTo, metaFor('34', title).checkedAt],
    ['2026-11-14', '2027-03-22', '2026-10-06']);
  assert.equal(itemFor('34', title).url, url);
  assert.equal(context.window.EXHIBITION_LINK_TYPES[url], 'listing');
  assert.equal(facility.exhibition_check.source_url, url);
  assert.equal(facility.exhibition_check.checked_on, '2026-10-06');
  assert.equal(facility.enriched.some(item => item.title.includes('バスケタリー展')), false);
  assert.deepEqual(plain(api.getPassAdmissionWindows(api.getPassTimeScope(facility))), [{
    valid_from: '2026-11-14', valid_to: '2027-03-22', title,
    source_ref: 'grutto_exhibition_pdf_2026_01'
  }]);
});

test('No.35 presents the full facility title and retains its shorter Grutto Pass title', () => {
  const title = '特別展 唐物誕生―茶の湯デザインの源流をさぐる';
  const passTitle = '特別展 唐物誕生';
  const url = 'https://sen-oku.or.jp/program/t_202611_karamono/';
  const facility = byKey.get('35');
  assert.ok(facility.schedule_lines.includes(title));
  assert.equal(facility.schedule_lines.includes(passTitle), false);
  assert.equal(facility.enriched.filter(item => item.title === title).length, 1);
  assert.deepEqual([metaFor('35', title).validFrom, metaFor('35', title).validTo, metaFor('35', title).checkedAt],
    ['2026-11-03', '2026-12-13', '2026-10-06']);
  assert.equal(itemFor('35', title).url, url);
  const windows = api.getPassAdmissionWindows(api.getPassTimeScope(facility));
  assert.equal(windows.at(-1).title, passTitle);
  assert.deepEqual([windows.at(-1).valid_from, windows.at(-1).valid_to], ['2026-11-03', '2026-12-13']);
});

test('No.36-2 successor is visible with official dates, prices and reservation notice', () => {
  const title = '森万里子：燦燦';
  const url = 'https://www.mori.art.museum/jp/exhibitions/marikomori/index.html';
  const facility = byKey.get('36-2');
  assert.equal(facility.enriched.filter(item => item.title === title).length, 1);
  assert.ok(facility.schedule_lines.includes(title));
  assert.deepEqual([metaFor('36-2', title).validFrom, metaFor('36-2', title).validTo, metaFor('36-2', title).checkedAt],
    ['2026-10-31', '2027-03-28', '2026-10-06']);
  assert.equal(itemFor('36-2', title).url, url);
  assert.equal(itemFor('36-2', title).fields['料金'], 'ぐるっとパス利用後 平日2,600円 / 土日祝2,800円');
  assert.match(itemFor('36-2', title).notice, /日時指定券/);
  assert.equal(api.getPassTimeScope(facility).classification, 'persistent');
  assert.equal(api.FACILITY_PASS_BENEFITS['36-2'].benefits[0].type, 'discount_fixed');
  assert.equal(api.FACILITY_PASS_BENEFITS['36-2'].benefits[0].saving_yen, 200);
  assert.equal(api.FACILITY_PASS_BENEFITS['36-2'].official_clauses[0].wording_ja, '企画展割引‥一般料金の200円引');
});
