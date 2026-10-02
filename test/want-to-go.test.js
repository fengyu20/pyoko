// Want to Go — state-transition & persistence contract.
//
// The state layer lives inline in index.html (buildless). These tests extract
// the personal-state slice and run it against a mocked localStorage / document,
// so the invariants below hold even without a browser:
//   - visited-only storage keeps working (backward compatible)
//   - a missing wantToGo key defaults to empty
//   - stale / non-string keys are ignored
//   - marking visited clears Want to Go; un-visiting never restores it
//   - the invariant is SYMMETRIC: a visited facility can never be re-planned,
//     and legacy storage holding both is normalized on load
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const SLICE_START = "const VISITED_STORAGE_VERSION = 'v1';";
const SLICE_END = 'function getVisitedMetrics(){';

const sliceStartIndex = html.indexOf(SLICE_START);
const sliceEndIndex = html.indexOf(SLICE_END);
assert.ok(sliceStartIndex >= 0, 'visited storage slice start found');
assert.ok(sliceEndIndex > sliceStartIndex, 'visited storage slice end found');
const stateSource = html.slice(sliceStartIndex, sliceEndIndex);

function memoryStorage(seed = {}) {
  const data = { ...seed };
  return {
    data,
    getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    removeItem(key) { delete data[key]; }
  };
}

function loadState(storage) {
  const context = {
    window: {
      localStorage: storage,
      clearTimeout,
      setTimeout,
      setInterval
    },
    document: {
      addEventListener() {},
      getElementById() { return null; },
      querySelectorAll() { return []; },
      dispatchEvent() {}
    },
    CustomEvent: class CustomEvent { constructor(type) { this.type = type; } },
    CONFIG: { year: '2026', passPriceYen: 2500, passEnd: '2027-03-31' },
    t(key) { return key; },
    updatePassTracker() {},
    escapeHtml(value) { return String(value); }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(
    `${stateSource}\n;__api = { visitedKeys, wantToGoKeys, isVisited, isWantToGo, setVisited, setWantToGo, toggleWantToGo, loadVisitedKeys, loadWantToGoKeys, normalizeWantAgainstVisited };`,
    context,
    { filename: 'want-to-go-state.js' }
  );
  return context.__api;
}

function storageKey(year) {
  return `grutto-pass:${year}:wantToGo:v1`;
}

test('a visited-only install keeps working and Want to Go defaults empty', () => {
  const year = '2026';
  const storage = memoryStorage({
    [`grutto-pass:${year}:visited:v1`]: JSON.stringify({ visited: ['2', '7'] })
  });
  const api = loadState(storage);
  assert.deepEqual([...api.visitedKeys].sort(), ['2', '7']);
  assert.deepEqual([...api.wantToGoKeys], []);
  assert.equal(api.isVisited('2'), true);
  assert.equal(api.isWantToGo('2'), false);
});

test('stale and non-string stored keys are ignored', () => {
  const year = '2026';
  const storage = memoryStorage({
    [storageKey(year)]: JSON.stringify({ wantToGo: ['2', 3, null, '', '7'] })
  });
  const api = loadState(storage);
  assert.deepEqual([...api.wantToGoKeys].sort(), ['2', '7']);
});

test('adding Want to Go persists and reloads', () => {
  const year = '2026';
  const storage = memoryStorage();
  const api = loadState(storage);
  api.setWantToGo('40', true);
  assert.equal(api.isWantToGo('40'), true);
  const stored = JSON.parse(storage.getItem(storageKey(year)));
  assert.deepEqual(stored.wantToGo, ['40']);

  // A fresh "reload" reads the same persisted set.
  const reloaded = loadState(storage);
  assert.equal(reloaded.isWantToGo('40'), true);
});

test('removing Want to Go persists', () => {
  const storage = memoryStorage();
  const api = loadState(storage);
  api.setWantToGo('40', true);
  api.setWantToGo('40', false);
  assert.equal(api.isWantToGo('40'), false);
  assert.deepEqual([...api.wantToGoKeys], []);
});

test('toggleWantToGo flips state through the single transition layer', () => {
  const api = loadState(memoryStorage());
  api.toggleWantToGo('71');
  assert.equal(api.isWantToGo('71'), true);
  api.toggleWantToGo('71');
  assert.equal(api.isWantToGo('71'), false);
});

test('recording a visit clears Want to Go; un-visiting never restores it', () => {
  const api = loadState(memoryStorage());
  api.setWantToGo('33', true);
  assert.equal(api.isWantToGo('33'), true);

  // visited=true → wantToGo=false
  api.setVisited('33', true);
  assert.equal(api.isVisited('33'), true);
  assert.equal(api.isWantToGo('33'), false);

  // visited=false → wantToGo stays false (never restored)
  api.setVisited('33', false);
  assert.equal(api.isVisited('33'), false);
  assert.equal(api.isWantToGo('33'), false);
});

/* ---- v97: the invariant is symmetric and enforced in the state layer ---- */

test('a visited facility can never be added to Want to Go', () => {
  const storage = memoryStorage();
  const api = loadState(storage);
  api.setVisited('33', true);

  // Want → Visited was already blocked; Visited → Want is the path that leaked.
  api.setWantToGo('33', true);
  assert.equal(api.isVisited('33'), true);
  assert.equal(api.isWantToGo('33'), false);

  // …including through the toggle, which routes to the same layer.
  api.toggleWantToGo('33');
  assert.equal(api.isWantToGo('33'), false);

  // Nothing invalid reached storage either.
  const raw = storage.getItem(storageKey('2026'));
  assert.deepEqual(raw ? JSON.parse(raw).wantToGo : [], []);
});

test('no interaction path can produce visited && wantToGo', () => {
  const api = loadState(memoryStorage());
  // Every ordering of the two setters, both directions.
  const paths = [
    () => { api.setWantToGo('7', true); api.setVisited('7', true); },
    () => { api.setVisited('7', true); api.setWantToGo('7', true); },
    () => { api.setVisited('7', true); api.toggleWantToGo('7'); },
    () => { api.setWantToGo('7', true); api.toggleWantToGo('7'); api.setVisited('7', true); }
  ];
  for (const path of paths) {
    api.setVisited('7', false);
    api.setWantToGo('7', false);
    path();
    assert.equal(api.isVisited('7') && api.isWantToGo('7'), false, 'invalid pair produced');
  }
});

test('un-visiting frees the Want action without resurrecting the plan', () => {
  const api = loadState(memoryStorage());
  api.setWantToGo('45', true);
  api.setVisited('45', true);
  api.setVisited('45', false);
  assert.equal(api.isWantToGo('45'), false);
  // Now available again, and it takes.
  api.setWantToGo('45', true);
  assert.equal(api.isWantToGo('45'), true);
  assert.equal(api.isVisited('45'), false);
});

test('legacy storage holding both states is normalized and re-persisted on load', () => {
  const year = '2026';
  const storage = memoryStorage({
    [`grutto-pass:${year}:visited:v1`]: JSON.stringify({ visited: ['3', '30'] }),
    // An older build allowed Visited → Want, so '3' is in both.
    [storageKey(year)]: JSON.stringify({ wantToGo: ['3', '107'] })
  });
  const api = loadState(storage);

  assert.equal(api.isVisited('3'), true);
  assert.equal(api.isWantToGo('3'), false, 'the invalid pair must not survive load');
  assert.equal(api.isWantToGo('107'), true, 'a valid plan is untouched');

  // Normalization is written back, so the bad state cannot outlive one load.
  assert.deepEqual(JSON.parse(storage.getItem(storageKey(year))).wantToGo, ['107']);

  const reloaded = loadState(storage);
  assert.equal(reloaded.isWantToGo('3'), false);
});

test('normalizeWantAgainstVisited reports whether it changed anything', () => {
  const api = loadState(memoryStorage());
  const clean = new Set(['1', '2']);
  assert.equal(api.normalizeWantAgainstVisited(clean, new Set(['9'])), false);
  assert.deepEqual([...clean].sort(), ['1', '2']);

  const dirty = new Set(['1', '2']);
  assert.equal(api.normalizeWantAgainstVisited(dirty, new Set(['2'])), true);
  assert.deepEqual([...dirty], ['1']);
});

test('the two collections are independent for distinct facilities', () => {
  const api = loadState(memoryStorage());
  api.setWantToGo('2', true);
  api.setVisited('2', true);
  api.setWantToGo('3', true);
  assert.equal(api.isVisited('2'), true);
  assert.equal(api.isWantToGo('2'), false);
  assert.equal(api.isWantToGo('3'), true);
  assert.equal(api.isVisited('3'), false);
});
