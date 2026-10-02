// Accepted conditions and reference-value safety, independent of private audits.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '..');
const { FACILITY_LEGACY_HIGH_RISK } = require('../data/facility-legacy-risk.js');
const { createBuildData } = require('../scripts/facility-direct-url.js');

test('the two source-backed conditions are re-homed verbatim in the scoped model', () => {
  const scoped = require(path.join(root, 'data/facility-pass-benefits.js')).FACILITY_PASS_BENEFITS;
  assert.deepEqual(scoped['74'].notes_ja, ['一部割引対象外の展示があります。']);
  assert.deepEqual(scoped['36-2'].notes_ja, ['展覧会により割引対象外となる場合があります。']);
  // The verbatim official clauses are untouched — a note is added, not rewritten.
  assert.equal(scoped['74'].official_clauses[1].wording_ja, '企画展割引‥一般料金の団体割引相当額');
  assert.equal(scoped['36-2'].official_clauses[0].wording_ja, '企画展割引‥一般料金の200円引');
  assert.doesNotMatch(JSON.stringify(scoped['87']), /通常時間内|regular_hours_only/);
});

test('accepted high-risk monetary fallbacks stay withheld from runtime projections', () => {
  const data = createBuildData('2026-08-25');
  const highRisk = Object.keys(FACILITY_LEGACY_HIGH_RISK);
  // Freeze the accepted runtime withholding set, independent of audit classifications.
  assert.deepEqual(highRisk.sort(), [
    '7', '15', '23', '28', '33', '35', '37', '42', '45', '48', '52', '53',
    '63', '81', '83', '88', '89', '92', '94', '96', '97', '99', '100', '103',
    '104', '106', '107', '32-WHAT-MUSEUM', '58-NTT-ICC',
  ].sort());
  assert.ok(highRisk.includes('97'));
  assert.ok(!highRisk.includes('87'));
  assert.ok(!highRisk.includes('1'));
  for (const key of highRisk) {
    const projection = data.byKey.get(key).projection;
    // An accepted time-scoped admission can supersede the legacy fallback.
    if (projection.pass.comparable.source !== 'legacy') continue;
    assert.equal(projection.pass.comparable.value_yen, null, key);
    assert.equal(projection.pass.comparable.risk, 'high', key);
    assert.ok(projection.pass.entitlements.official_clauses.length, key);
  }
  assert.equal(data.byKey.get('87').projection.pass.comparable.value_yen, 500);
  assert.equal(data.byKey.get('87').projection.pass.comparable.risk, 'low');
});
