// Time-scoped Pass entitlement availability model — unit tests.
//
// Locks the canonical No.7 calibration, the persistent fallback, and the rule
// that PDF silence after a known window is `unconfirmed`, never "no exhibition".
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadApi() {
  const window = {};
  const context = vm.createContext({ window, URL });
  let src = ['config.js', 'data/facilities.js', 'data/facility-pass-time-scope.js', 'pass-time-scope-runtime.js']
    .map(f => fs.readFileSync(path.join(root, f), 'utf8'))
    .join('\n;\n');
  src += ';globalThis.__api = { DATA, FACILITY_PASS_TIME_SCOPE, FACILITY_PASS_TIME_SCOPE_META, FACILITY_PASS_TIME_SCOPE_SOURCES, PASS_TIME_SCOPE_ENTITLEMENT_MODES, getPassTimeScope, resolvePassAdmissionAvailability, getPassAdmissionNextWindowStart, getPassAdmissionActiveWindow, getPassAdmissionMergedWindows };';
  vm.runInContext(src, context, { filename: 'time-scope-bundle.js' });
  return context.__api;
}

const api = loadApi();
const facilities = api.DATA.flatMap(area => area.facilities || []);
const facilityByKey = key => facilities.find(f => f._key === key);

const availability = (key, dateStr) => api.resolvePassAdmissionAvailability(api.getPassTimeScope(facilityByKey(key)), dateStr);

test('No.7 東京都美術館 calibrates upcoming / available / unconfirmed', () => {
  assert.equal(availability('7', '2026-07-01'), 'upcoming');
  assert.equal(availability('7', '2026-07-23'), 'available');
  assert.equal(availability('7', '2026-08-15'), 'available');
  assert.equal(availability('7', '2026-10-07'), 'available');
  assert.equal(availability('7', '2026-10-08'), 'unconfirmed');
});

test('No.7 is explicitly named and date-scoped in the registry', () => {
  const scope = api.getPassTimeScope(facilityByKey('7'));
  assert.equal(scope.classification, 'named_exhibition_scoped');
  assert.equal(scope.admission_time_scoped, true);
  assert.equal(scope.named_exhibition, 'この場所の風景―上野・大牟田・ブエノスアイレス');
  assert.equal(scope.windows.length, 1);
  assert.equal(scope.windows[0].valid_from, '2026-07-23');
  assert.equal(scope.windows[0].valid_to, '2026-10-07');
  assert.equal(scope.post_validity, 'unconfirmed');
});

test('persistent admission (no record or admission_time_scoped=false) is always available', () => {
  // A zoo with plain 入場 and no time-scope record falls back to persistent.
  assert.equal(availability('8', '2026-10-08'), 'available');
  assert.equal(availability('8', '2026-07-01'), 'available');
  assert.equal(api.resolvePassAdmissionAvailability({ admission_time_scoped: false }, '2026-10-08'), 'available');
  assert.equal(api.resolvePassAdmissionAvailability(null, '2026-10-08'), 'available');
});

test('a date in a gap between two known windows is upcoming, not ended', () => {
  // No.45 目黒区美術館: 2/21–5/10 then 6/27–8/30.
  assert.equal(availability('45', '2026-05-20'), 'upcoming');
  assert.equal(api.getPassAdmissionNextWindowStart(api.getPassTimeScope(facilityByKey('45')), '2026-05-20'), '2026-06-27');
});

test('post-window availability is unconfirmed, never none_confirmed', () => {
  // No.40 東京都写真美術館 対象展 ends 9/21; the PDF does not cover what follows.
  assert.equal(availability('40', '2026-09-22'), 'unconfirmed');
  // No source can manufacture `available` for an unscoped, empty record.
  const empty = { admission_time_scoped: true, windows: [], post_validity: 'unconfirmed' };
  assert.equal(api.resolvePassAdmissionAvailability(empty, '2026-08-15'), 'unconfirmed');
});

test('No.34 confirmed November window stays upcoming until its eligibility start', () => {
  assert.equal(availability('34', '2026-08-15'), 'upcoming');
  assert.equal(availability('34', '2026-11-14'), 'available');
  assert.equal(api.getPassTimeScope(facilityByKey('34')).windows.length, 1);
});

/* -------------------------------------------------------------------------
 * v96 Pass Source Arbitration — schedule snapshot vs entitlement boundary.
 * ---------------------------------------------------------------------- */

test('No.100 そごう美術館: a schedule end does not end the entitlement', () => {
  const scope = api.getPassTimeScope(facilityByKey('100'));
  assert.equal(scope.entitlement_baseline, '企画展入場');
  assert.equal(scope.entitlement_mode, 'eligible_exhibitions');
  assert.equal(scope.schedule_is_exhaustive, false);
  // The February snapshot's own words are why 5/31 cannot be a boundary.
  assert.match(scope.non_exhaustive_wording, /以降の展覧会/);

  // KAGAYA 天空の歌 really did end 5/31 …
  assert.equal(availability('100', '2026-05-31'), 'available');
  // … but that is an exhibition end, not the end of 企画展入場. The later
  // official Grutto updates confirm the exhibitions that follow.
  assert.equal(availability('100', '2026-08-15'), 'available');
  assert.equal(availability('100', '2026-09-20'), 'available');
});

test('No.100 windows past the snapshot cite the later official Grutto updates', () => {
  const scope = api.getPassTimeScope(facilityByKey('100'));
  const byStart = Object.fromEntries(scope.windows.map(w => [w.valid_from, w]));

  // The snapshot still owns the exhibition it actually listed.
  assert.equal(byStart['2026-04-11'].source_ref, 'grutto_exhibition_pdf_2026_01');
  // Everything after it comes from a later update, not from an inference.
  assert.equal(byStart['2026-06-06'].source_ref, 'grutto_blog_20260626');
  assert.equal(byStart['2026-08-01'].source_ref, 'grutto_blog_20260729');
  assert.equal(byStart['2026-09-12'].source_ref, 'grutto_blog_20260729');
  assert.equal(byStart['2026-08-01'].title, 'The 50th Anniversary OSAMU GOODS展');

  const later = api.FACILITY_PASS_TIME_SCOPE_SOURCES.grutto_blog_20260729;
  assert.equal(later.role, 'later_grutto_update');
  assert.equal(later.published_at, '2026-07-29');
  assert.ok(later.published_at > api.FACILITY_PASS_TIME_SCOPE_SOURCES.grutto_exhibition_pdf_2026_01.published_at);
});

test('later official evidence is not suppressed by the older snapshot', () => {
  // No.58 ICC: the snapshot deferred the schedule to the venue, so v92 could
  // never make it available. The 2026-07-29 update names an eligible exhibition.
  const scope = api.getPassTimeScope(facilityByKey('58-NTT-ICC'));
  assert.equal(scope.windows.length, 1);
  assert.equal(scope.windows[0].source_ref, 'grutto_blog_20260729');
  assert.equal(availability('58-NTT-ICC', '2026-08-15'), 'available');
  assert.equal(availability('58-NTT-ICC', '2026-11-08'), 'available');
  assert.equal(availability('58-NTT-ICC', '2026-11-09'), 'unconfirmed');
});

test('a later update correcting the same claim supersedes the snapshot date', () => {
  // No.33 大倉集古館: snapshot said 祈りと救いの美 ends 10/12; the later update and
  // the museum's own schedule both end it 9/27.
  const w33 = api.getPassTimeScope(facilityByKey('33')).windows.find(w => w.valid_from === '2026-07-28');
  assert.equal(w33.valid_to, '2026-09-27');
  assert.equal(w33.source_ref, 'grutto_blog_20260729');
  assert.equal(w33.supersedes, 'grutto_exhibition_pdf_2026_01');
  assert.equal(availability('33', '2026-09-27'), 'available');
  assert.equal(availability('33', '2026-09-28'), 'upcoming');

  // No.68 東洋文庫: only the start moved (5/29 → 6/3).
  const w68 = api.getPassTimeScope(facilityByKey('68')).windows.find(w => w.valid_to === '2026-09-23');
  assert.equal(w68.valid_from, '2026-06-03');
  assert.equal(availability('68', '2026-06-02'), 'upcoming');
  assert.equal(availability('68', '2026-06-03'), 'available');
});

test('an explicit eligibility boundary is preserved, not relaxed', () => {
  // No.7 and No.83 quote wording that scopes eligibility itself, so their end
  // dates are real boundaries. No.40 enumerates a closed set.
  for (const key of ['7', '83', '40']) {
    const scope = api.getPassTimeScope(facilityByKey(key));
    assert.equal(scope.schedule_is_exhaustive, true, `${key} should be exhaustive`);
    assert.ok(String(scope.boundary_wording || '').trim(), `${key} must quote its boundary wording`);
  }
  assert.equal(api.getPassTimeScope(facilityByKey('7')).entitlement_mode, 'explicit_period');
  assert.equal(api.getPassTimeScope(facilityByKey('40')).entitlement_mode, 'enumerated_exhibitions');
  assert.equal(availability('83', '2026-08-02'), 'available');
  assert.equal(availability('83', '2026-08-03'), 'unconfirmed');
});

test('a non-exhaustive schedule quotes the wording that makes it non-exhaustive', () => {
  const nonExhaustive = Object.entries(api.FACILITY_PASS_TIME_SCOPE)
    .filter(([, record]) => record.schedule_is_exhaustive === false);
  assert.ok(nonExhaustive.length >= 15);
  for (const [key, record] of nonExhaustive) {
    assert.ok(!record.boundary_wording, `${key} cannot both be non-exhaustive and quote a boundary`);
    assert.equal(record.entitlement_mode === 'explicit_period', false, `${key} must not be explicit_period`);
  }
});

test('every window names a registered source and every mode is in the vocabulary', () => {
  for (const [key, record] of Object.entries(api.FACILITY_PASS_TIME_SCOPE)) {
    assert.ok(api.PASS_TIME_SCOPE_ENTITLEMENT_MODES.includes(record.entitlement_mode), `${key} mode`);
    assert.ok(record.entitlement_baseline, `${key} baseline`);
    (record.windows || []).forEach(w => {
      assert.ok(api.FACILITY_PASS_TIME_SCOPE_SOURCES[w.source_ref], `${key} window ${w.valid_from} source_ref`);
      assert.ok(w.title, `${key} window ${w.valid_from} title`);
    });
  }
});

test('merged period label keeps a real gap visible', () => {
  // No.100 has four separated exhibitions — they must never collapse into one span.
  const merged100 = api.getPassAdmissionMergedWindows(api.getPassTimeScope(facilityByKey('100')));
  assert.equal(merged100.length, 4);
  // No.40's four windows genuinely overlap, so they legitimately merge into one.
  const merged40 = api.getPassAdmissionMergedWindows(api.getPassTimeScope(facilityByKey('40')));
  assert.equal(merged40.length, 1);
  assert.equal(merged40[0].valid_from, '2026-03-17');
  assert.equal(merged40[0].valid_to, '2026-09-21');
});

test('the active window names the exhibition actually in scope', () => {
  const scope = api.getPassTimeScope(facilityByKey('100'));
  assert.equal(api.getPassAdmissionActiveWindow(scope, '2026-08-15').title, 'The 50th Anniversary OSAMU GOODS展');
  assert.equal(api.getPassAdmissionActiveWindow(scope, '2026-09-20').title, 'カラフルパレット　鈴木信太郎');
  assert.equal(api.getPassAdmissionActiveWindow(scope, '2026-09-01'), null);
});

test('source horizon metadata is recorded for traceability', () => {
  assert.equal(api.FACILITY_PASS_TIME_SCOPE_META.snapshot_as_of, '2026-02');
  assert.equal(api.FACILITY_PASS_TIME_SCOPE_META.coverage_label, '2026-04..2026-09');
  assert.match(api.FACILITY_PASS_TIME_SCOPE_META.source_url, /exhibition_2026_01\.pdf$/);
});

test('2026-08-27 admission update adds only confirmed non-exhaustive windows', () => {
  const source = api.FACILITY_PASS_TIME_SCOPE_SOURCES.grutto_blog_20260827;
  assert.equal(source.url, 'https://www.rekibun.or.jp/grutto/blog/20260827-6903/');
  assert.equal(source.authority, 'grutto_pass');
  assert.equal(source.role, 'later_grutto_update');
  assert.equal(source.label, '9～10月のおすすめ展覧会（入場）');
  assert.equal(source.published_at, '2026-08-27');
  assert.equal(source.is_exhaustive, false);
  assert.equal(source.checked_at, '2026-09-04');
  assert.equal(Object.values(api.FACILITY_PASS_TIME_SCOPE_SOURCES)
    .some(s => s.url.includes('discount')), false);

  assert.equal(availability('28', '2026-10-14'), 'upcoming');
  assert.equal(availability('28', '2026-10-15'), 'available');
  assert.equal(availability('28', '2026-12-20'), 'available');
  assert.equal(availability('28', '2026-12-21'), 'unconfirmed');
  assert.equal(availability('62', '2026-10-03'), 'available');
  assert.equal(availability('94', '2026-10-21'), 'available');
  assert.equal(availability('106', '2026-10-10'), 'available');

  for (const key of ['28', '33', '62', '94', '106']) {
    const windows = api.getPassTimeScope(facilityByKey(key)).windows;
    assert.ok(windows.some(w => w.source_ref === 'grutto_blog_20260827'), key);
  }
});

test('every time-scope key maps to a real admission facility', () => {
  for (const key of Object.keys(api.FACILITY_PASS_TIME_SCOPE)) {
    const facility = facilityByKey(key);
    assert.ok(facility, `unknown facility ${key}`);
    assert.ok((facility.pass_types || []).includes('admission'), `${key} should be an admission facility`);
  }
});
