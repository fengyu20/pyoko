// Shared opening-hours evaluator getFacilityOpeningState — unit tests.
// Covers the canonical No.40 / No.71 cases, precedence, holiday logic,
// substitute closure, last admission, multiple intervals, and unknown.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const api = require('./load');

const root = path.join(__dirname, '..');
const fctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8') + ';globalThis.__d = DATA;', fctx);
const facilities = fctx.__d.flatMap(a => a.facilities || []);
const byKey = key => facilities.find(f => f._key === key);

const dt = (dateStr, minutes) => ({
  dateStr,
  dow: new Date(`${dateStr}T12:00:00`).getDay(),
  minutes: minutes ?? null
});

test('No.71 江戸東京博物館: Saturday variation + August Friday night extension', () => {
  const f = byKey('71');
  // Saturday → 19:30 (weekday override)
  const sat = api.getFacilityOpeningState(f, dt('2026-08-15', 10 * 60));
  assert.equal(sat.status, 'open');
  assert.equal(sat.closes_at, '19:30');
  assert.equal(sat.last_admission_at, '19:00');
  assert.equal(sat.is_special_hours, false);
  // Weekday → 17:30
  const tue = api.getFacilityOpeningState(f, dt('2026-08-11', 12 * 60));
  assert.equal(tue.closes_at, '17:30');
  assert.equal(tue.last_admission_at, '17:00');
  // Friday 8/7 → 21:00 (explicit special date, not a recurrence)
  const fri = api.getFacilityOpeningState(f, dt('2026-08-07', 20 * 60));
  assert.equal(fri.status, 'open');
  assert.equal(fri.closes_at, '21:00');
  assert.equal(fri.last_admission_at, '20:30');
  assert.equal(fri.is_special_hours, true);
});

test('No.40 東京都写真美術館: Thu/Fri 20:00 and 30-min last admission', () => {
  const f = byKey('40');
  const thu = api.getFacilityOpeningState(f, dt('2026-08-13', 19 * 60));
  assert.equal(thu.status, 'open');
  assert.equal(thu.closes_at, '20:00');
  assert.equal(thu.last_admission_at, '19:30');
  const mon = api.getFacilityOpeningState(f, dt('2026-08-10', 12 * 60)); // Monday → closed
  assert.equal(mon.status, 'closed');
});

test('closure wins over hours; Monday closure is closed', () => {
  const f = byKey('71');
  assert.equal(api.getFacilityOpeningState(f, dt('2026-08-10', 12 * 60)).status, 'closed'); // Monday
});

test('holiday-open + substitute closure for a 祝休日・都民の日 garden', () => {
  const f = byKey('8'); // 恩賜上野動物園: 月曜日(祝休日・都民の日の場合は開園し翌日休園)
  // 2026-09-21 is 敬老の日 (Monday holiday) → open
  assert.equal(api.getFacilityOpeningState(f, dt('2026-09-21', 12 * 60)).status, 'open');
  // next day (Tuesday) is the substitute closure
  assert.equal(api.getFacilityOpeningState(f, dt('2026-09-22', 12 * 60)).status, 'closed');
});

test('No.34 and No.102 reopen after their last closed dates; No.34 changeover remains closed', () => {
  const tomo = byKey('34');
  assert.equal(api.getFacilityOpeningState(tomo, dt('2026-11-13', 12 * 60)).status, 'closed');
  assert.equal(api.getFacilityOpeningState(tomo, dt('2026-11-14', 12 * 60)).status, 'open');
  assert.equal(api.getFacilityOpeningState(tomo, dt('2027-01-12', 12 * 60)).status, 'closed');
  assert.equal(api.getFacilityOpeningState(tomo, dt('2027-01-19', 12 * 60)).status, 'open');

  const kanagawaHistory = byKey('102');
  assert.equal(api.getFacilityOpeningState(kanagawaHistory, dt('2026-10-16', 12 * 60)).status, 'closed');
  assert.equal(api.getFacilityOpeningState(kanagawaHistory, dt('2026-10-17', 12 * 60)).status, 'open');
});

test('last admission is separate from close: ended but still open', () => {
  const f = byKey('40'); // Thu close 20:00, last 19:30
  const beforeLast = api.getFacilityOpeningState(f, dt('2026-08-13', 18 * 60 + 20)); // 18:20, last admission 19:30
  assert.equal(beforeLast.status, 'open');
  assert.equal(beforeLast.time_state, 'open');
  const afterLast = api.getFacilityOpeningState(f, dt('2026-08-13', 19 * 60 + 40)); // 19:40, admission ended
  assert.equal(afterLast.status, 'open');
  assert.equal(afterLast.time_state, 'ended');
  assert.equal(afterLast.last_admission_at, '19:30');
});

test('multiple intervals (lunch break) evaluate the gap as before-next-open', () => {
  api.HOURS.__test__ = { d: [['10:00', '12:00'], ['13:00', '17:00']], last: 30 };
  const f = { _key: '__test__', no: '999', name: 'Test', closed: [], notes: [] };
  assert.equal(api.getFacilityOpeningState(f, dt('2026-08-11', 11 * 60)).closes_at, '12:00');
  // gap 12:30 → not open now, next opens 13:00
  const gap = api.getFacilityOpeningState(f, dt('2026-08-11', 12 * 60 + 30));
  assert.equal(gap.status, 'closed');
  assert.equal(gap.time_state, 'before');
  assert.equal(gap.opens_at, '13:00');
  assert.equal(api.getFacilityOpeningState(f, dt('2026-08-11', 14 * 60)).closes_at, '17:00');
  delete api.HOURS.__test__;
});

test('unknown when no hours data exists', () => {
  const f = { _key: '__none__', no: '998', name: 'None', closed: [], notes: [] };
  const state = api.getFacilityOpeningState(f, dt('2026-08-11', 12 * 60));
  assert.equal(state.status, 'unknown');
  assert.equal(state.confidence, 'low');
});

test('precedence: explicit special date overrides weekday override', () => {
  const f = byKey('71');
  // 2026-08-07 is Friday AND a special date (21:00). Friday regular is 17:30,
  // Saturday override does not apply, so special must win → 21:00.
  const fri = api.getFacilityOpeningState(f, dt('2026-08-07', 18 * 60));
  assert.equal(fri.closes_at, '21:00');
  assert.equal(fri.is_special_hours, true);
});

test('tokyoNow returns Asia/Tokyo date parts', () => {
  const now = api.tokyoNow();
  assert.match(now.dateStr, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(now.hhmm, /^\d{2}:\d{2}$/);
  assert.ok(Number.isInteger(now.minutes) && now.minutes >= 0 && now.minutes < 1440);
});

/* ---- v100: hours that do not apply every day are flagged ---- */

test('a weekday override that differs from the default is flagged', () => {
  // No.71 東京都江戸東京博物館: 9:30–17:30 normally, 9:30–19:30 on Saturdays.
  // Showing only "閉館 19:30" reads as the everyday closing time.
  const weekday = api.getHoursFor('71', 1, '2026-08-17');
  assert.equal(weekday.ranges[0][1], '17:30');
  assert.equal(weekday.variant, null, 'ordinary hours carry no qualifier');

  const saturday = api.getHoursFor('71', 6, '2026-08-15');
  assert.equal(saturday.ranges[0][1], '19:30');
  assert.deepEqual({ ...saturday.variant }, { kind: 'dow', dow: 6 });
});

test('a dated special is flagged with its own date', () => {
  // 8/7, 8/14, 8/21, 8/28 (Fri) extend to 21:00 — those dates only.
  const special = api.getHoursFor('71', 5, '2026-08-14');
  assert.equal(special.ranges[0][1], '21:00');
  assert.equal(special.special, true);
  assert.deepEqual({ ...special.variant }, { kind: 'date', date: '2026-08-14' });

  // A Friday outside that list gets the ordinary hours and no qualifier.
  const ordinary = api.getHoursFor('71', 5, '2026-09-04');
  assert.equal(ordinary.ranges[0][1], '17:30');
  assert.equal(ordinary.variant, null);
});

test('a SHORTER variant day is flagged too, and neutrally', () => {
  // The qualifier must not imply "open later": these days close earlier.
  const cityView = api.getHoursFor('36-2', 2, '2026-08-18');
  assert.equal(cityView.ranges[0][1], '17:00', 'Tuesday closes 5h earlier than usual');
  assert.deepEqual({ ...cityView.variant }, { kind: 'dow', dow: 2 });

  const bunka = api.getHoursFor('54', 6, '2026-08-15');
  assert.equal(bunka.ranges[0][1], '15:00');
  assert.deepEqual({ ...bunka.variant }, { kind: 'dow', dow: 6 });
});

test('a facility with one uniform schedule is never qualified', () => {
  const zoo = api.getHoursFor('8', 3, '2026-08-19');
  assert.ok(zoo.ranges.length);
  assert.equal(zoo.variant, null);
});

test('the shared evaluator exposes the variant alongside is_special_hours', () => {
  const facility = { _key: '71' };
  const saturday = api.getFacilityOpeningState(facility, { dateStr: '2026-08-15', dow: 6, minutes: 10 * 60 });
  assert.equal(saturday.closes_at, '19:30');
  assert.equal(saturday.is_special_hours, false, 'a weekly rule is not a dated special');
  assert.deepEqual({ ...saturday.hours_variant }, { kind: 'dow', dow: 6 });

  const special = api.getFacilityOpeningState(facility, { dateStr: '2026-08-14', dow: 5, minutes: 10 * 60 });
  assert.equal(special.closes_at, '21:00');
  assert.equal(special.is_special_hours, true);
  assert.deepEqual({ ...special.hours_variant }, { kind: 'date', date: '2026-08-14' });
});
