// Tests for the time-of-day layer: getHoursFor / computeNowState / seasons /
// long-closure. Pure functions — "now" is injected, so no real-clock flakiness.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { computeNowState, getHoursFor } = require('./load.js');

// Build a fake "now" like tokyoNow() returns.
const at = (dateStr, dow, h, m = 0) => ({
  dateStr, dow,
  minutes: h * 60 + m,
  hhmm: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
});
const code = (key, now) => computeNowState(key, now).code;

// Facility 4 = 国立科学博物館: 09:00–17:00, no explicit last admission
// → DEFAULT 30min → last admission 16:30. (Wed = dow 3, no weekday override.)
test('open-now: before / open / lastcall / ended / after (facility 4)', () => {
  assert.equal(code('4', at('2026-08-12', 3, 8, 0)),  'before');   // 08:00, not open yet
  assert.equal(code('4', at('2026-08-12', 3, 12, 0)), 'open');     // midday
  assert.equal(code('4', at('2026-08-12', 3, 16, 0)), 'lastcall'); // 30min to last adm 16:30
  assert.equal(code('4', at('2026-08-12', 3, 16, 45)), 'ended');   // past last adm, before close
  assert.equal(code('4', at('2026-08-12', 3, 17, 30)), 'after');   // after 17:00 close
});

test('open-now: last-call window boundary is exactly 60 min', () => {
  // last admission 16:30; 15:29 → 61min left → still open; 15:30 → 60min → lastcall.
  assert.equal(code('4', at('2026-08-12', 3, 15, 29)), 'open');
  assert.equal(code('4', at('2026-08-12', 3, 15, 30)), 'lastcall');
});

// Facility 3 = 国立西洋美術館: 09:30–17:30, Fri/Sat until 20:00.
test('open-now: weekday override extends closing (facility 3, Fri vs Wed)', () => {
  assert.equal(code('3', at('2026-08-14', 5, 18, 0)), 'open');   // Friday → open till 20:00
  assert.equal(code('3', at('2026-08-12', 3, 18, 0)), 'after');  // Wednesday → closed 17:30
});

// Facility 43 = 自然教育園: summer(05-01..08-31) 09:00–17:00, winter(09-01..) 09:00–16:30.
test('open-now: season switch on 9/1 changes closing time (facility 43)', () => {
  // Same wall-clock 16:45, one day apart across the boundary.
  assert.equal(code('43', at('2026-08-31', 1, 16, 45)), 'ended'); // summer close 17:00
  assert.equal(code('43', at('2026-09-01', 2, 16, 45)), 'after'); // winter close 16:30
});

// Facility 97 = 東京富士美術館: closedUntil 2026-10-02.
test('open-now: long closure ends the day after closedUntil (facility 97)', () => {
  assert.equal(code('97', at('2026-08-09', 0, 12, 0)), 'longclosed');
  assert.equal(code('97', at('2026-10-02', 5, 12, 0)), 'longclosed'); // boundary: still closed
  assert.notEqual(code('97', at('2026-10-03', 6, 12, 0)), 'longclosed'); // reopened
  assert.equal(code('97', at('2026-10-03', 6, 12, 0)), 'open');
});

// Facility 17 = ミュゼ浜口陽三・ヤマサコレクション: exhibition changeover
// closure through 2026-09-11, reopening on 2026-09-12.
test('open-now: facility 17 remains closed through the dated closure boundary', () => {
  for (const [dateStr, dow] of [['2026-08-11', 2], ['2026-08-20', 4], ['2026-09-01', 2], ['2026-09-11', 5]]) {
    const state = computeNowState('17', at(dateStr, dow, 12, 0));
    assert.equal(state.code, 'longclosed', dateStr);
    assert.equal(state.noteKey, 'status.longClosedExhibitionChangeoverNote', dateStr);
  }
  assert.equal(code('17', at('2026-09-12', 6, 12, 0)), 'open');
});

test('open-now: dated Tomo closure reopens after the facility-confirmed boundary (facility 34)', () => {
  for (const [dateStr, dow] of [['2026-11-12', 4], ['2026-11-13', 5]]) {
    const state = computeNowState('34', at(dateStr, dow, 12, 0));
    assert.equal(state.code, 'longclosed', dateStr);
    assert.equal(state.noteKey, 'status.longClosedNote', dateStr);
    assert.match(state.note, /2026-11-14/);
  }
  assert.equal(computeNowState('34', at('2026-11-14', 6, 12, 0)).code, 'open');
  assert.equal(getHoursFor('34', 6, '2026-11-14').longClosedIndefinite, undefined);
});

test('open-now: Miraikan dated closure starts and ends at the official boundaries (facility 80)', () => {
  assert.equal(code('80', at('2026-09-30', 3, 12, 0)), 'open');
  assert.equal(code('80', at('2026-10-01', 4, 12, 0)), 'longclosed');
  assert.equal(code('80', at('2027-04-22', 4, 12, 0)), 'longclosed');
  assert.equal(code('80', at('2027-04-23', 5, 12, 0)), 'open');
});

// Facility 19 = 国立映画アーカイブ: 11:00–18:30, but last Friday of each month
// extends to 20:00 (materialised into `special`).
test('open-now: special date overrides regular hours (facility 19 last-Friday)', () => {
  // Ordinary Friday → closes 18:30
  assert.equal(code('19', at('2026-08-21', 5, 19, 0)), 'after');
  // Last Friday of the month → open until 20:00 (last adm 19:30)
  assert.equal(code('19', at('2026-08-28', 5, 15, 0)), 'open');
  assert.equal(code('19', at('2026-08-28', 5, 19, 45)), 'ended');
  const h = getHoursFor('19', 5, '2026-08-28');
  assert.equal(h.special, true);
  assert.equal(h.ranges[0][0], '11:00');
  assert.equal(h.ranges[0][1], '20:00'); // extended closing, not the regular 18:30
});

test('open-now: unknown facility never claims to be open', () => {
  assert.equal(code('__no_such_key__', at('2026-08-09', 0, 12, 0)), 'unknown');
});

// Last-admission provenance: exact ("入館は◯◯まで" → no （目安）) vs estimated.
test('getHoursFor: lastIsExact reflects whether HOURS declares `last`', () => {
  assert.equal(getHoursFor('13', 4, '2026-08-06').lastIsExact, true);  // 一葉記念館 has last:30
  assert.equal(getHoursFor('4', 3, '2026-08-12').lastIsExact, false);  // 科博 uses default
});
