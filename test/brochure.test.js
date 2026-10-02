// Accepted public brochure projection and product invariants.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadRuntimeData() {
  const context = vm.createContext({ window: {} });
  const dataSource = [
    fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'data/facility-corrections.js'), 'utf8')
  ].join('\n;\n') + ';globalThis.__data = DATA;';
  vm.runInContext(dataSource, context, { filename: 'data/facilities.js' });
  vm.runInContext(fs.readFileSync(path.join(root, 'data/facility-brochure.js'), 'utf8'), context, { filename: 'data/facility-brochure.js' });
  return { facilities: context.__data.flatMap(area => area.facilities), brochure: context.window.FACILITY_BROCHURE };
}

test('accepted brochure projection preserves card and venue counts', () => {
  const { facilities, brochure } = loadRuntimeData();
  assert.equal(facilities.length, 108);
  assert.equal(Object.keys(brochure.cards).length, 108);
  assert.equal(brochure.metadata.brochureVenueCount, 109);
  assert.deepEqual(Object.keys(brochure.cards).sort(), Array.from(facilities, f => f._key).sort());
});

test('Miraikan uses the brochure admission benefit after the reviewed correction', () => {
  const { facilities } = loadRuntimeData();
  const miraikan = facilities.find(facility => facility._key === '80');
  assert.deepEqual(Array.from(miraikan.pass_types), ['admission']);
  assert.equal(miraikan.regular_price_yen, 630);
  assert.equal(miraikan.admission_label, '常設展入場');
});

test('reviewed corrections keep No.51 and No.74 collection values separate from exhibition discounts', () => {
  const { facilities } = loadRuntimeData();
  const setagaya = facilities.find(facility => facility._key === '51');
  const mot = facilities.find(facility => facility._key === '74');
  assert.equal(setagaya.pass_benefit_yen, 220);
  assert.equal(setagaya.regular_price_yen, 220);
  assert.match(setagaya.admission_label, /コレクション展入場/);
  assert.match(setagaya.admission_label, /企画展割引/);
  assert.match(setagaya.benefit_basis, /220円/);
  assert.match(setagaya.benefit_basis, /展覧会により異なる/);
  assert.equal(mot.pass_benefit_yen, 500);
  assert.equal(mot.regular_price_yen, 500);
  assert.match(mot.admission_label, /MOTコレクション入場/);
  assert.match(mot.admission_label, /企画展割引/);
  assert.match(mot.benefit_basis, /500円/);
  assert.match(mot.benefit_basis, /一部割引対象外/);
  assert.notEqual(setagaya.pass_benefit_yen, 200);
  assert.notEqual(mot.pass_benefit_yen, 460);
});

test('the runtime brochure projection carries identity and structure, and no prose', () => {
  const { brochure } = loadRuntimeData();
  const allowedCard = new Set(['nameJa', 'nameEn', 'sourcePage', 'subfacilities']);
  const allowedVenue = new Set(['nameJa', 'nameEn']);
  for (const [key, card] of Object.entries(brochure.cards)) {
    for (const field of Object.keys(card)) {
      assert.ok(allowedCard.has(field), `cards[${key}] carries unexpected runtime field ${field}`);
    }
    assert.ok(card.nameJa, `cards[${key}] has no Japanese name`);
    assert.ok(Number.isInteger(card.sourcePage), `cards[${key}] lost its page locator`);
    for (const venue of card.subfacilities || []) {
      for (const field of Object.keys(venue)) {
        assert.ok(allowedVenue.has(field), `cards[${key}] subfacility carries unexpected runtime field ${field}`);
      }
    }
  }
  const raw = fs.readFileSync(path.join(root, 'data/facility-brochure.js'), 'utf8');
  const body = raw.slice(raw.indexOf('const FACILITY_BROCHURE'));
  assert.doesNotMatch(body, /description(?:Ja|En|Zh)/, 'brochure prose is back in the runtime file');
});

test('no runtime code can render brochure prose', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /descriptionJa|descriptionEn|descriptionZh/);
  assert.doesNotMatch(html, /function brochureDescription\(/);
  assert.doesNotMatch(html, /renderExistingBrochureIntroduction/);
  // The introduction resolver returns nothing at all when approved copy is
  // missing; it must not have regrown a second source of text.
  const start = html.indexOf('function renderFacilityBrochureInfo(');
  const body = html.slice(start, html.indexOf('\n}', start));
  assert.match(body, /approved\.length \? renderApprovedFacilitySummary\(f, approved\) : ''/);
});

test('No.103 keeps two accepted venue identities from structure alone', () => {
  const { brochure } = loadRuntimeData();
  const projected = brochure.cards['103'];
  assert.equal(projected.subfacilities.length, 2);
  assert.deepEqual(Array.from(projected.subfacilities, item => item.nameJa), ['横浜都市発展記念館', '横浜ユーラシア文化館']);
  assert.ok(projected.nameJa && projected.nameEn);
  assert.ok(projected.subfacilities.every(item => item.nameJa && item.nameEn));
});
