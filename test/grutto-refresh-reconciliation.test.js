const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8')
  + ';globalThis.__DATA = DATA;';
const context = vm.createContext({});
vm.runInContext(source, context, { filename: 'grutto-refresh-data.js' });
const facilities = context.__DATA.flatMap(area => area.facilities || []);
const byNo = new Map(facilities.map(facility => [String(facility.no), facility]));

test('2026 Grutto review omissions are promoted without replacing neighboring exhibitions', () => {
  const shitamachi = byNo.get('1');
  assert.ok(shitamachi.schedule_lines.includes('壁画 浅草ビッグパレード 加太こうじが描いた浅草のスターたち'));
  assert.ok(shitamachi.schedule_lines.includes('7/7(火)～11/1(日)'));
  assert.equal(shitamachi.schedule_lines.includes('壁画 浅草ビッグパレード展(仮)'), false);

  const baseball = byNo.get('22');
  assert.ok(baseball.schedule_lines.includes('2026年野球殿堂入り特別展'));
  assert.ok(baseball.schedule_lines.includes('7/28(火)～10/4(日)'));
  assert.ok(baseball.schedule_lines.includes('企画展「明治神宮野球場 100年」'));

  const basho = byNo.get('72');
  assert.ok(basho.schedule_lines.includes('2026年度後期企画展「「蛙」が飛び込んだ地・深川－その歴史と文化－」'));
  assert.ok(basho.schedule_lines.includes('8/29(土)～12/13(日)'));
  assert.ok(basho.schedule_lines.includes('2026年度特別展「伊藤コレクション展」(仮)'));
});

test('facility-confirmed exhibition titles replace stale runtime identities without changing their periods', () => {
  const asakura = byNo.get('11');
  const asakuraTitle = '特別展「ASAKURA ZOO 2026」';
  const asakuraIndex = asakura.schedule_lines.indexOf(asakuraTitle);
  assert.notEqual(asakuraIndex, -1);
  assert.deepEqual(Array.from(asakura.schedule_lines.slice(asakuraIndex, asakuraIndex + 2)), [
    asakuraTitle,
    '7/18(土)～12/27(日)'
  ]);
  assert.equal(asakura.schedule_lines.includes('特別展「ASAKURA ZOO 2026」(仮)'), false);
  assert.deepEqual(
    Array.from(asakura.enriched.filter(item => item.title.includes('ASAKURA ZOO 2026')), item => item.title),
    ['ASAKURA ZOO 2026']
  );

  const tomo = byNo.get('34');
  assert.deepEqual(Array.from(tomo.schedule_lines), [
    '関島寿子 かごについてのかご',
    '11/14(土)～3/22(月・休) ※展示替え休館：1/12(火)～1/18(月)'
  ]);
  assert.equal(tomo.schedule_lines.includes('関島寿子 バスケタリー展（仮称）'), false);

  const edo = byNo.get('71');
  const edoTitle = '企画展「浮世へのいざない―江戸博×出光コレクション初共演」';
  const edoIndex = edo.schedule_lines.indexOf(edoTitle);
  assert.notEqual(edoIndex, -1);
  assert.deepEqual(Array.from(edo.schedule_lines.slice(edoIndex, edoIndex + 2)), [
    edoTitle,
    '8/25(火)～9/27(日)'
  ]);
  assert.equal(
    edo.schedule_lines.includes('企画展「出光×江戸博コレクションによる浮世絵展」(仮)'),
    false
  );
  const edoEnriched = edo.enriched.find(item => item.title === edoTitle);
  assert.ok(edoEnriched);
  assert.equal(edoEnriched.url, 'https://www.edo-tokyo-museum.or.jp/s-exhibition/edohaku-idemitsu/');
  assert.equal(
    edo.enriched.some(item => item.title === '企画展「出光×江戸博コレクションによる浮世絵展」'),
    false
  );
  assert.ok(edo.exhibition_sources.includes('https://www.edo-tokyo-museum.or.jp/s-exhibition/edohaku-idemitsu/'));
});
