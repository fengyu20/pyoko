// 座標生成器は現在の外部 DATA 構成を読み込めること、連絡先なしでは
// 何も問い合わせず・書き出さずに止まることを検証する。
// Nominatim への実際のネットワーク問い合わせは行わない。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadFacilities } = require('../phase2/build-coords.js');

const SCRIPT = path.join(__dirname, '../phase2/build-coords.js');

test('座標生成器は data/facilities.js から全施設を読む', () => {
  const facilities = loadFacilities();
  assert.equal(facilities.length, 108);
  assert.equal(facilities.filter(f => f.no === '36').length, 2);
  assert.ok(facilities.some(f => f.key === '36-2' && f.name === '森美術館'));
});

test('旧 grutto-pass GitHub Pages の連絡先フォールバックは残っていない', () => {
  const source = fs.readFileSync(SCRIPT, 'utf8');
  assert.ok(!source.includes('fengyu20.github.io/grutto-pass'));
});

for (const [label, contact] of [['未設定', undefined], ['空文字', ''], ['空白のみ', '   ']]) {
  test(`NOMINATIM_CONTACT が${label}なら通信・書き出し前に非ゼロ終了する`, () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyoko-coords-'));
    const marker = path.join(outDir, 'fetch-called');
    // fetch が呼ばれたら印を残し、実ネットワークには出さない
    const preload = path.join(outDir, 'no-fetch.js');
    fs.writeFileSync(preload,
      `globalThis.fetch = async () => { require('fs').writeFileSync(${JSON.stringify(marker)}, '1'); throw new Error('network blocked in test'); };\n`);

    const env = { ...process.env, GRUTTO_OUTPUT_DIR: outDir };
    delete env.NOMINATIM_CONTACT;
    if (contact !== undefined) env.NOMINATIM_CONTACT = contact;

    try {
      const r = spawnSync(process.execPath, ['--require', preload, SCRIPT], { env, encoding: 'utf8', timeout: 10000 });
      assert.notEqual(r.status, 0);
      assert.match(r.stderr, /NOMINATIM_CONTACT/);
      assert.match(r.stderr, /NOMINATIM_CONTACT=".+" node phase2\/build-coords\.js/);
      assert.ok(!fs.existsSync(marker), 'fetch must not be called');
      assert.ok(!fs.existsSync(path.join(outDir, 'coords.js')));
      assert.ok(!fs.existsSync(path.join(outDir, 'coords-review.md')));
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
}
