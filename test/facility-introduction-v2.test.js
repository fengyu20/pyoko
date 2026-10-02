// Public accepted Introduction copy contracts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, 'data/facility-summaries.js'), 'utf8') + ';globalThis.__summaries = FACILITY_PRODUCT_SUMMARIES;', context);
const production = context.__summaries;

function loadFacilities() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8')};globalThis.__data = DATA;`,
    context,
    { filename: 'data/facilities.js' },
  );
  return context.__data.flatMap(area => area.facilities || []);
}

const facilities = loadFacilities();
const entries = Array.from(production.entries, entry => ({ ...entry, summary_ja: entry.summary.ja, summary_en: entry.summary.en, summary_zh: entry.summary.zh }));

function stripWs(s) {
  return String(s || '').replace(/\s+/g, '');
}

function wordCount(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean).length;
}

test('approved Introductions cover every facility key with JA/EN/ZH copy', () => {
  const keys = new Set(facilities.map(f => f._key));
  assert.equal(entries.length, 109, 'venue-level record count');
  const covered = new Set(entries.map(e => e.facility_key));
  for (const key of keys) assert.ok(covered.has(key), `missing facility key ${key}`);
  for (const entry of entries) {
    assert.ok(stripWs(entry.summary_ja).length > 0, `${entry.venue_key} JA empty`);
    assert.ok(stripWs(entry.summary_en).length > 0, `${entry.venue_key} EN empty`);
    assert.ok(stripWs(entry.summary_zh).length > 0, `${entry.venue_key} ZH empty`);
    assert.ok(keys.has(entry.facility_key), `orphan facility_key ${entry.facility_key}`);
  }
});

test('accepted summaries stay within Detail reading-density bounds', () => {
  for (const entry of entries) {
    const ja = stripWs(entry.summary_ja).length;
    const zh = stripWs(entry.summary_zh).length;
    const en = wordCount(entry.summary_en);
    assert.ok(ja >= 12 && ja <= 110, `${entry.venue_key} JA length ${ja}`);
    assert.ok(zh >= 12 && zh <= 110, `${entry.venue_key} ZH length ${zh}`);
    assert.ok(en >= 8 && en <= 45, `${entry.venue_key} EN words ${en}`);
  }
});

test('accepted introductions do not duplicate schedule / price / pass / access / hours', () => {
  const forbidden = /年[0-9０-９]+(?:～[0-9０-９]+)?回|[0-9]+円|無料|割引|ぐるっと|パス|徒歩|駅|開館時間|入場料|アクセス/;
  for (const entry of entries) {
    assert.doesNotMatch(entry.summary_ja, forbidden, `${entry.venue_key} JA operational duplication`);
    assert.doesNotMatch(entry.summary_zh, forbidden, `${entry.venue_key} ZH operational duplication`);
    assert.doesNotMatch(entry.summary_en, /\b(?:yen|free|discount|pass|min(?:utes)? walk|station|opening hours|admission fee)\b/i, `${entry.venue_key} EN operational duplication`);
  }
});

test('accepted introductions contain no ungrounded marketing language', () => {
  const jaZh = /必見|おすすめ|人気|隠れた名所|魅力|魅力的|素晴らしい|見逃せない|值得专程|非常适合亲子|世界一/;
  const en = /\b(?:must-see|iconic|hidden gem|best|world-famous)\b/i;
  for (const entry of entries) {
    assert.doesNotMatch(entry.summary_ja, jaZh, `${entry.venue_key} JA marketing`);
    assert.doesNotMatch(entry.summary_zh, jaZh, `${entry.venue_key} ZH marketing`);
    assert.doesNotMatch(entry.summary_en, en, `${entry.venue_key} EN marketing`);
  }
});
