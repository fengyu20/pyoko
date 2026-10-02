// Public accepted Pass semantics: clause wording, scoped monetary values,
// and comparable values recomputable from their accepted benefit basis.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const { validate, benefitValue } = require('../scripts/validate-pass-benefits.js');
const { FACILITY_PASS_BENEFITS } = require('../data/facility-pass-benefits.js');

test('every Pass facility card has an entitlement record', () => {
  const keys = Object.keys(FACILITY_PASS_BENEFITS);
  assert.equal(keys.length, 108);
  const context = vm.createContext({ window: {} });
  vm.runInContext(['data/facilities.js', 'data/facility-corrections.js'].map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n;\n') + ';globalThis.__data = DATA;', context);
  const facilities = context.__data.flatMap(area => area.facilities);
  assert.deepEqual(keys.sort(), Array.from(facilities, f => f._key).sort());
  for (const record of Object.values(FACILITY_PASS_BENEFITS)) {
    assert.ok(record.official_clauses.length, `${record.facility_no} has no official clause`);
    assert.ok(record.benefits.length, `${record.facility_no} has no benefit`);
  }
});

test('structured interpretation preserves the accepted official clause wording', () => {
  for (const [key, record] of Object.entries(FACILITY_PASS_BENEFITS)) {
    // Structured interpretation must never leak into the wording layer.
    for (const benefit of record.benefits) {
      assert.equal(benefit.official_wording.ja, record.official_clauses[benefit.clause_index].wording_ja);
      if (benefit.interprets_ja) {
        assert.ok(benefit.official_wording.ja.includes(benefit.interprets_ja), `${key}: interprets_ja is not part of the clause`);
      }
    }
  }
});

test('every scoped monetary value has a scope and a source', () => {
  for (const [key, record] of Object.entries(FACILITY_PASS_BENEFITS)) {
    assert.ok(!('regular_price_yen' in record), `${key}: facility-level price`);
    assert.ok(!('saving_yen' in record), `${key}: facility-level saving`);
    for (const benefit of record.benefits) {
      const hasMoney = benefit.regular_price_yen != null || benefit.saving_yen != null;
      if (!hasMoney) continue;
      assert.ok(benefit.scopes.length, `${key}: money without a scope`);
      assert.ok(benefit.price_source?.url, `${key}: money without a source`);
      assert.ok(benefit.price_source?.checked_at, `${key}: money without checked_at`);
      if (benefit.regular_price_yen != null) {
        assert.ok(!benefit.scopes.includes('unknown'), `${key}: a price on an unknown scope`);
      }
    }
  }
});

test('a variable percentage benefit can never own a permanent yen amount', () => {
  const variablePercent = Object.entries(FACILITY_PASS_BENEFITS)
    .flatMap(([key, record]) => record.benefits.map(benefit => [key, benefit]))
    .filter(([, benefit]) => benefit.type === 'discount_percent' && benefit.price_mode === 'exhibition_variable');
  assert.ok(variablePercent.length >= 3);
  for (const [key, benefit] of variablePercent) {
    assert.equal(benefit.saving_yen, null, `${key}: variable percent with a saving`);
    assert.equal(benefit.regular_price_yen, null, `${key}: variable percent with a price`);
    // The entitlement is still complete: the rate survives.
    assert.ok(benefit.discount_rate > 0, `${key}: lost its discount rate`);
    assert.ok(benefit.official_wording.ja, `${key}: lost its official wording`);
  }
});

test('a fixed yen discount works without any regular price', () => {
  const fixed = Object.entries(FACILITY_PASS_BENEFITS)
    .flatMap(([key, record]) => record.benefits.map(benefit => [key, record, benefit]))
    .filter(([, , benefit]) => benefit.type === 'discount_fixed' && benefit.regular_price_yen == null);
  assert.ok(fixed.length >= 5);
  for (const [key, record, benefit] of fixed) {
    assert.ok(benefit.saving_yen > 0, `${key}: fixed discount lost its amount`);
    assert.equal(benefitValue(benefit), benefit.saving_yen);
    if (record.value_basis?.benefit_type === 'discount_fixed') {
      assert.equal(record.comparable_value_yen, benefit.saving_yen);
    }
  }
});

test('every comparable value has a basis that recomputes it, and null is not zero', () => {
  for (const [key, record] of Object.entries(FACILITY_PASS_BENEFITS)) {
    const value = record.comparable_value_yen;
    if (value == null) {
      assert.equal(record.value_basis, null, `${key}: basis without a value`);
      continue;
    }
    assert.notEqual(value, 0, `${key}: zero used for an unknown value`);
    const basis = record.value_basis;
    assert.ok(basis, `${key}: value without a basis`);
    const benefit = record.benefits[basis.benefit_index];
    assert.ok(benefit, `${key}: basis points nowhere`);
    assert.equal(basis.benefit_type, benefit.type);
    assert.ok(benefit.scopes.includes(basis.scope));
    assert.equal(benefitValue(benefit), value, `${key}: basis cannot recompute ${value}`);
  }
});

test('comparable value is never a cross-scope sum', () => {
  for (const [key, record] of Object.entries(FACILITY_PASS_BENEFITS)) {
    if (record.comparable_value_yen == null) continue;
    const values = record.benefits.map(benefitValue).filter(entry => entry != null);
    assert.ok(record.comparable_value_yen <= Math.max(...values), `${key}: exceeds its largest single saving`);
  }
  // The validator must reject a summed value rather than merely not produce one.
  const summed = JSON.parse(JSON.stringify({ '71': FACILITY_PASS_BENEFITS['71'] }));
  summed['71'].comparable_value_yen = 1120;
  const { errors } = validate(summed);
  assert.ok(errors.some(error => /cannot be recomputed/.test(error)), 'a summed value must be rejected');
});

test('the semantic validator rejects a variable percent that grows a yen value', () => {
  const tampered = JSON.parse(JSON.stringify({ '105': FACILITY_PASS_BENEFITS['105'] }));
  const discount = tampered['105'].benefits.find(benefit => benefit.type === 'discount_percent');
  discount.saving_yen = 750;
  discount.regular_price_yen = 1500;
  const { errors } = validate(tampered);
  assert.ok(errors.some(error => /variable percentage discount with a permanent saving_yen/.test(error)));
  assert.ok(errors.some(error => /variable percentage discount with a permanent regular_price_yen/.test(error)));
});

test('the semantic validator rejects wording that drifts from its clause', () => {
  const tampered = JSON.parse(JSON.stringify({ '71': FACILITY_PASS_BENEFITS['71'] }));
  tampered['71'].benefits[0].official_wording.ja = '常設展・企画展入場';
  const { errors } = validate(tampered);
  assert.ok(errors.some(error => /does not match its clause verbatim/.test(error)));
});

test('the committed data passes semantic validation', () => {
  const { errors, warns } = validate(FACILITY_PASS_BENEFITS);
  assert.deepEqual(errors, []);
  assert.deepEqual(warns, []);
});

test('frozen decisions are represented in the scoped data', () => {
  const expected = {
    44: { value: 200, scope: 'garden', type: 'admission' },
    50: { value: 220, scope: 'collection', type: 'admission' },
    70: { value: 400, scope: 'named_exhibition', type: 'admission' },
    71: { value: 800, scope: 'permanent_collection', type: 'admission' },
    105: { value: 300, scope: 'permanent_collection', type: 'admission' },
  };
  for (const [key, want] of Object.entries(expected)) {
    const record = FACILITY_PASS_BENEFITS[key];
    assert.equal(record.comparable_value_yen, want.value, `No.${key}`);
    assert.equal(record.value_basis.scope, want.scope, `No.${key}`);
    assert.equal(record.value_basis.benefit_type, want.type, `No.${key}`);
  }
  // No.44 keeps the unpriced building-exhibition entitlement in full.
  const teien = FACILITY_PASS_BENEFITS['44'];
  const building = teien.benefits.find(benefit => benefit.interprets_ja === '建物公開展');
  assert.equal(building.saving_yen, null);
  assert.equal(building.official_wording.ja, '建物公開展、庭園入場');
  // No.71 keeps the 20% special-exhibition entitlement with no yen at all.
  const edo = FACILITY_PASS_BENEFITS['71'];
  const discount = edo.benefits.find(benefit => benefit.type === 'discount_percent');
  assert.equal(discount.discount_rate, 0.2);
  assert.equal(discount.saving_yen, null);
  assert.equal(discount.scopes[0], 'special_exhibition');
  // The legacy exhibition-specific figures are absent from production entirely.
  const serialized = JSON.stringify(edo);
  assert.ok(!serialized.includes('1600') && !serialized.includes('320'), 'exhibition-specific figures leaked into production');
});

test('legacy scalars survive for the facilities that still need them', () => {
  const legacy = fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8');
  // Phase 2 stops reading these for verified facilities; Phase 4 removes them.
  assert.match(legacy, /"pass_benefit_yen":320/);
  assert.match(legacy, /"regular_price_yen":1600/);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<script src="data\/facility-pass-benefits\.js"><\/script>/);
  assert.match(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), /data\/facility-pass-benefits\.js/);
});

test('public value semantics ignore unverified and variable benefits', () => {
  assert.equal(benefitValue({ type: 'discount_percent', scopes: ['special_exhibition'], price_mode: 'exhibition_variable', regular_price_yen: 1000, discount_rate: 0.2 }), null);
  assert.equal(benefitValue({ type: 'admission', scopes: ['named_exhibition'], price_mode: 'exhibition_variable', regular_price_yen: 1000 }), null);
  assert.equal(benefitValue({ type: 'admission', scopes: ['permanent_collection'], price_mode: 'fixed', regular_price_yen: 800 }), 800);
});
