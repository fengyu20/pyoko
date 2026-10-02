// 開館状況の理由が多言語表示で日本語に戻らないことを検証する。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const api = require('./load');
const root = path.join(__dirname, '..');

function loadUi() {
  const window = {
    location: { href: 'https://example.test/index.html?lang=ja' },
    navigator: { language: 'ja' },
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const context = vm.createContext({ window, URL });
  vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), context, { filename: 'i18n/ui.js' });
  return window;
}

function loadFacilities() {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8'), context, { filename: 'data/facilities.js' });
  vm.runInContext(';globalThis.__data = DATA;', context);
  return context.__data.flatMap(area => area.facilities || []);
}

function eachPassDate(callback) {
  for (let date = new Date(Date.UTC(2026, 3, 1)); date <= new Date(Date.UTC(2027, 2, 31)); date.setUTCDate(date.getUTCDate() + 1)) {
    callback(date.toISOString().slice(0, 10));
  }
}

test('Chinese and English closure reasons do not fall back to Japanese', () => {
  const window = loadUi();
  const facilities = loadFacilities();
  const failures = [];

  for (const language of ['zh', 'en']) {
    window.setAppLanguage(language);
    for (const facility of facilities) {
      eachPassDate(date => {
        const raw = api.checkStatus(facility, date);
        const localized = window.localizeStatusResult(raw);
        if (/[\u3040-\u30ff]/.test(localized.reason)) {
          failures.push({ language, key: facility._key, date, reasonKey: raw.reasonKey, reason: localized.reason });
        }
      });
    }
  }

  assert.deepEqual(failures, []);
});

test('holiday closure reason variants share the localized translation', () => {
  const window = loadUi();
  const facility = { closed: ['月曜日(祝休日の場合は開館し翌日休館)'] };
  const raw = api.checkStatus(facility, '2026-05-05');

  assert.equal(raw.reason, '祝日のため翌日休館');
  window.setAppLanguage('zh');
  assert.equal(window.localizeStatusResult(raw).reason, '节假日次日闭馆');
  window.setAppLanguage('en');
  assert.equal(window.localizeStatusResult(raw).reason, 'Closed the day after a holiday');
});

test('localized opening notes expose the hours parenthetical separately', () => {
  const window = loadUi();
  window.setAppLanguage('en');
  const localized = window.localizeNowState({
    textKey: 'status.before',
    textParams: { open: '09:30' },
    noteKey: 'status.beforeNote',
    noteParams: { minutes: 37, open: '09:30', close: '16:30' },
    note: 'あと37分で開館（09:30–16:30）'
  });
  assert.equal(localized.note, 'Opens in 37 min (09:30–16:30)');
  assert.equal(localized.noteMain, 'Opens in 37 min');
  assert.equal(localized.noteHours, ' (09:30–16:30)');
});

test('a warning remains advisory when a time status supplies the single primary badge', () => {
  const status = { state: 'warn' };
  const displayStatus = { cls: 'badge-warn', icon: '🟡', text: 'Check details', reason: 'Irregular closures are possible' };
  const displayNow = { cls: 'badge-closed', icon: '🔴', text: 'Closed for today', note: 'Closed at 17:00' };
  const presentation = api.buildStatusPresentation(status, displayStatus, displayNow);

  assert.equal(presentation.primary, displayNow);
  assert.equal(presentation.needsOfficialCheck, true);
  assert.equal(presentation.reason, 'Closed at 17:00／Irregular closures are possible');
  assert.equal(api.getOfficialStatusUrl({ urls: ['javascript:alert(1)', 'https://example.test/'] }), 'https://example.test/');
});

/* ---- v100: the hours qualifier is localized copy, built in one place ---- */

test('hours qualifiers localize in JA / EN / ZH', () => {
  const cases = [
    ['ja', { kind: 'dow', dow: 6 }, '（土曜のみ）'],
    ['en', { kind: 'dow', dow: 6 }, '(Saturdays only)'],
    ['zh', { kind: 'dow', dow: 6 }, '（仅星期六）'],
    ['ja', { kind: 'date', date: '2026-08-14' }, '（8/14 限定）'],
    ['en', { kind: 'date', date: '2026-08-14' }, '(8/14 only)'],
    ['zh', { kind: 'date', date: '2026-08-14' }, '（仅限8/14）']
  ];
  for (const [language, variant, expected] of cases) {
    const window = loadUi();
    window.setAppLanguage(language);
    assert.equal(window.hoursVariantNote(variant), expected, `${language}/${variant.kind}`);
  }
});

test('no variant produces no qualifier at all', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  for (const value of [null, undefined, {}, { kind: 'dow' }, { kind: 'date', date: 'nonsense' }]) {
    assert.equal(window.hoursVariantNote(value), '');
  }
});

test('localizeNowState attaches the qualifier to the state it describes', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  const plain = window.localizeNowState({
    code: 'open', textKey: 'status.openNow', text: '開館中',
    noteKey: 'status.openNowNote', noteParams: { last: '19:00', suffix: '', close: '19:30' },
    note: '最終入館 19:00・閉館 19:30'
  });
  assert.equal(plain.hoursVariantNote, '');

  const qualified = window.localizeNowState({
    code: 'open', textKey: 'status.openNow', text: '開館中',
    noteKey: 'status.openNowNote', noteParams: { last: '19:00', suffix: '', close: '19:30' },
    note: '最終入館 19:00・閉館 19:30',
    hoursVariant: { kind: 'dow', dow: 6 }
  });
  assert.equal(qualified.hoursVariantNote, '（土曜のみ）');
  // The times themselves are untouched — this narrows the fact, it does not change it.
  assert.equal(qualified.note, plain.note);
});
