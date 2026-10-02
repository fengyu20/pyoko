// Tests for the weekday/holiday/period closure layer (checkStatus, in status.js)
// and for how it combines with the time layer the way the page does.
// Facility objects are synthesised so each closure rule is tested in isolation.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkStatus, computeNowState } = require('./load.js');

const state = (f, dateStr) => checkStatus(f, dateStr).state;

test('closure: weekly closed day (Mondays)', () => {
  const f = { closed: ['月曜日'] };
  assert.equal(state(f, '2026-08-10'), 'closed'); // Monday
  assert.equal(state(f, '2026-08-12'), 'open');   // Wednesday
});

test('closure: general holiday closure (祝日)', () => {
  const f = { closed: ['祝日'] };
  assert.equal(state(f, '2026-08-11'), 'closed'); // 山の日 (national holiday)
  assert.equal(state(f, '2026-08-12'), 'open');   // ordinary Wednesday
});

test('closure: "open on holidays, close the next weekday" (facility 1 pattern)', () => {
  const f = { closed: ['月曜日(祝休日の場合は開館し翌平日休館)'] };
  assert.equal(state(f, '2026-08-10'), 'closed'); // plain Monday → closed
  assert.equal(state(f, '2026-01-12'), 'open');   // 成人の日 (Mon holiday) → open
  assert.equal(state(f, '2026-01-13'), 'closed'); // substitute closure the next weekday
});

test('closure: 2027 holidays are recognised (pass valid to 2027-03-31)', () => {
  const f = { closed: ['祝日'] };
  assert.equal(state(f, '2027-01-01'), 'closed'); // 元日
  assert.equal(state(f, '2027-03-22'), 'closed'); // 春分の日の振替休日
  assert.equal(state(f, '2027-03-23'), 'open');   // ordinary Tuesday
});

test('closure: explicit annual date range (year-end)', () => {
  const f = { closed: ['12/29~1/3'] };
  assert.equal(state(f, '2026-12-30'), 'closed');
  assert.equal(state(f, '2026-08-09'), 'open');
});

test('closure: next exhibition date after a closure is not another closure date', () => {
  const f = { notes: ['11/13まで休館。次回展は11/14から。'] };
  assert.equal(state(f, '2026-11-13'), 'closed');
  assert.equal(state(f, '2026-11-14'), 'open');
});

test('closure: explicit reopening date after a closure is not closed', () => {
  const text = '10/16まで休館。10/17再開予定。';
  const f = { notes: [text], closed: [text] };
  assert.equal(state(f, '2026-10-16'), 'closed');
  assert.equal(state(f, '2026-10-17'), 'open');
});

test('closure: exhibition dates stay open while the changeover range is closed', () => {
  const f = { schedule_lines: ['11/14～3/22 ※展示替え休館：1/12～1/18'] };
  assert.equal(state(f, '2026-11-14'), 'open');
  assert.equal(state(f, '2027-01-12'), 'closed');
  assert.equal(state(f, '2027-01-15'), 'closed');
  assert.equal(state(f, '2027-01-18'), 'closed');
  assert.equal(state(f, '2027-01-19'), 'open');
  assert.equal(state(f, '2027-03-22'), 'open');
});

// Mirrors index.html updateStatuses(): a closed/out day from checkStatus wins,
// otherwise the live time-of-day state (computeNowState) is shown.
function liveState(f, key, now) {
  const base = checkStatus(f, now.dateStr);
  if (base.state === 'closed' || base.state === 'out') return base.state;
  return computeNowState(key, now).code;
}

test('layering: weekly closure beats an otherwise-open time window', () => {
  // Facility 4 has 09:00–17:00 hours; pretend it closes Mondays.
  const f = { _key: '4', closed: ['月曜日'] };
  const monNoon = { dateStr: '2026-08-10', dow: 1, minutes: 12 * 60, hhmm: '12:00' };
  const wedNoon = { dateStr: '2026-08-12', dow: 3, minutes: 12 * 60, hhmm: '12:00' };
  assert.equal(liveState(f, '4', monNoon), 'closed'); // closure wins over "open"
  assert.equal(liveState(f, '4', wedNoon), 'open');   // open day → live time state
});
