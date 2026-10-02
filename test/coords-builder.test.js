// 座標生成器は現在の外部 DATA 構成を読み込めることだけを検証する。
// ネットワーク問い合わせとファイル書き出しは実行しない。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFacilities } = require('../phase2/build-coords.js');

test('座標生成器は data/facilities.js から全施設を読む', () => {
  const facilities = loadFacilities();
  assert.equal(facilities.length, 108);
  assert.equal(facilities.filter(f => f.no === '36').length, 2);
  assert.ok(facilities.some(f => f.key === '36-2' && f.name === '森美術館'));
});
