// Phase 3: the Pass presentation model. Three layers — official entitlement,
// structured interpretation, derived reference value — must stay separable, and
// none may stand in for another.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadUi() {
  const window = {
    location: { href: 'http://localhost/index.html' },
    navigator: { language: 'ja' },
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const context = vm.createContext({ window, URL });
  for (const file of ['i18n/ui.js', 'data/facility-brochure.js', 'data/facility-pass-benefits.js'])
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  window.SCOPED = context.FACILITY_PASS_BENEFITS || window.FACILITY_PASS_BENEFITS;
  return window;
}

// Mirrors the runtime adapter: a record is monetary authority only when it is
// verification_status === 'priced'. Everything else falls back to legacy.
function inputsFor(window, key, legacyValue = null) {
  const record = window.SCOPED[key];
  const entitlements = record
    ? { official_clauses: record.official_clauses, benefits: record.benefits }
    : null;
  const comparable = record && record.verification_status === 'priced'
    ? { value_yen: record.comparable_value_yen, value_basis: record.value_basis, source: 'scoped' }
    : { value_yen: legacyValue, value_basis: null, source: 'legacy' };
  const passTypes = [...new Set((record?.benefits || []).map(b => (b.type === 'admission' ? 'admission' : 'discount')))];
  return { entitlements, comparable, passTypes };
}

const present = (window, key, legacyValue = null) =>
  window.getPassPresentation({ no: key }, inputsFor(window, key, legacyValue));

const allText = view => JSON.stringify(view);

test('No.18 leads with the source-stated discount and never invents a facility price', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const view = present(window, '18');

  // The ¥300 is the official entitlement itself, so it belongs in the phrase.
  assert.equal(view.phrases.length, 1);
  assert.match(view.headline, /¥300引/);
  assert.match(view.clauses[0].official, /企画展・特別展割引/);
  assert.match(view.clauses[0].official, /一般料金の300円引/);
  assert.equal(view.clauses[0].label, '割引');

  // ...and must not be repeated underneath as a separate derived value.
  assert.equal(view.reference, null);
  assert.equal(view.value, null);

  // ¥1,200 is one exhibition's price, never the facility's regular price.
  assert.doesNotMatch(allText(view), /1,200|1200/);
  assert.equal(window.SCOPED['18'].comparable_value_yen, 300);
});

test('No.71 keeps admission and the percentage discount visible and the ¥800 separate', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const view = present(window, '71');

  assert.deepEqual([...view.phrases], ['常設展 入場', '特別展 20%引']);
  assert.equal(view.clauses.length, 2);
  assert.equal(view.clauses[0].official, '常設展入場');
  assert.match(view.clauses[1].official, /特別展：一般料金の20%引/);

  // The derived value is its own layer and names the scope it came from.
  assert.equal(view.reference.amount, '¥800');
  assert.match(view.reference.basis, /常設展/);
  assert.equal(view.reference.confidence, 'verified');

  // No fusion of "free admission" with the whole-facility saving.
  assert.doesNotMatch(view.headline, /800/);
  assert.doesNotMatch(view.headline, /お得/);
  // The special-exhibition figures never surface at facility level.
  assert.doesNotMatch(allText(view), /1,600|1600|320/);
});

test('No.44 preserves the official clauses and attributes ¥200 to the garden alone', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const view = present(window, '44');

  assert.equal(view.clauses[0].official, '建物公開展、庭園入場');
  assert.match(view.clauses[1].official, /団体割引相当額/);
  // A group-rate-equivalent stays wording; it is never converted to yen.
  assert.doesNotMatch(view.clauses[1].official, /¥/);

  assert.equal(view.reference.amount, '¥200');
  assert.match(view.reference.basis, /庭園/);
  // Source order: the brochure lists the building exhibition first.
  assert.equal(view.phrases[0], '建物公開展・庭園 入場');
  // ...but the reference basis must not read as if both were worth ¥200.
  assert.doesNotMatch(view.reference.basis, /建物公開展/);
});

test('a source-stated fixed discount is never duplicated as a reference-value line', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  for (const key of ['2', '9', '18', '20', '36', '38']) {
    const view = present(window, key);
    const record = window.SCOPED[key];
    assert.equal(record.value_basis.benefit_type, 'discount_fixed', `fixture ${key}`);
    assert.equal(view.reference, null, `No.${key} reference line`);
    assert.equal(view.value, null, `No.${key} browse value`);
    // The amount is still visible — in the entitlement phrase where it belongs.
    assert.match(view.headline, new RegExp(String(record.comparable_value_yen)), `No.${key} amount`);
  }
  // A null regular price does not make the presentation incomplete.
  assert.equal(window.SCOPED['9'].benefits[0].regular_price_yen, null);
  assert.ok(present(window, '9').clauses[0].official);
});

test('a variable percentage stays a percentage and never becomes yen', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const variable = window.SCOPED['70'].benefits[1];
  assert.equal(variable.price_mode, 'exhibition_variable');
  assert.equal(variable.saving_yen, null);

  const view = present(window, '70');
  assert.equal(view.phrases[1], '企画展 20%引');
  assert.doesNotMatch(view.phrases[1], /¥/);
  // The reference value belongs to the admission benefit, not to the discount.
  assert.equal(view.reference.amount, '¥400');
  assert.doesNotMatch(allText(view), /¥0\b/);
});

test('a legacy fallback amount is labelled as an estimate, never as a verified reference value', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const legacyKey = Object.keys(window.SCOPED)
    .find(key => window.SCOPED[key].verification_status !== 'priced');
  const view = present(window, legacyKey, 630);

  // The entitlement still renders from the scoped official source.
  assert.ok(view.clauses.length);
  assert.ok(view.phrases.length);
  // The amount is shown, but weakened and without a verified basis.
  assert.equal(view.reference, null);
  assert.equal(view.value.confidence, 'estimated');
  assert.match(view.value.text, /概算/);
  assert.doesNotMatch(view.value.text, /参考価値/);
});

test('an unknown value is never presented as ¥0', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const legacyKey = Object.keys(window.SCOPED)
    .find(key => window.SCOPED[key].verification_status !== 'priced');
  for (const missing of [null, undefined]) {
    const view = present(window, legacyKey, missing);
    assert.equal(view.value, null);
    assert.equal(view.reference, null);
    assert.doesNotMatch(allText(view), /¥0/);
  }
});

test('every language keeps the same three layers and the Japanese source stays available', () => {
  const window = loadUi();
  const shapes = {};
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    const view = present(window, '71');
    shapes[language] = {
      phrases: view.phrases.length,
      clauses: view.clauses.length,
      reference: Boolean(view.reference)
    };
    assert.ok(view.reference.label, `${language} reference label`);
    assert.ok(view.reference.basis, `${language} reference basis`);
    for (const clause of view.clauses) {
      // The official Japanese wording is always carried, whatever the language.
      assert.match(clause.official, /[ぁ-んァ-ヶ一-龠]/);
      if (language === 'ja') assert.equal(clause.translated, '');
      else assert.ok(clause.translated, `${language} clause translation`);
    }
  }
  assert.deepEqual(shapes.en, shapes.ja);
  assert.deepEqual(shapes.zh, shapes.ja);
});

test('no facility leaks data-model vocabulary or an unresolved amount into copy', () => {
  const window = loadUi();
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    for (const key of Object.keys(window.SCOPED)) {
      const text = allText(present(window, key, 500));
      assert.doesNotMatch(text, /value_basis|verification_status|comparable_value|scoped|legacy/i, `${language} ${key}`);
      assert.doesNotMatch(text, /undefined|NaN|\$\{|\{amount\}|\{scope\}|\{rate\}/, `${language} ${key}`);
    }
  }
});
