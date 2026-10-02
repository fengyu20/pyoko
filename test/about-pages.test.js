const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.join(__dirname, '..');
const productionDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyoko-about-production-'));
const canaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyoko-about-canary-'));
const referenceDate = '2026-08-25';
const aboutFiles = [
  'about/about.css',
  'about/about.js',
  'about/index.html',
  'about/data/index.html',
  'about/pass-tracker/index.html'
];
const aboutPaths = [
  'https://pyoko.jp/about/',
  'https://pyoko.jp/about/data/',
  'https://pyoko.jp/about/pass-tracker/'
];

function runBuild(destination, extraArgs = []) {
  execFileSync(process.execPath, [
    path.join(root, 'scripts', 'build-pages.js'),
    ...extraArgs,
    `--reference-date=${referenceDate}`,
    `--output-dir=${destination}`
  ], { cwd: root, stdio: 'pipe' });
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath).map(file => path.join(entry.name, file));
    return [entry.name];
  }).map(file => file.split(path.sep).join('/'));
}

function extractLocs(source) {
  return [...source.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]);
}

function outputPage(relativePath) {
  const filename = path.join(productionDir, relativePath);
  assert.ok(fs.existsSync(filename), `production output is missing ${relativePath}`);
  return fs.readFileSync(filename, 'utf8');
}

test('production publishes only the approved About files and canary publishes none', () => {
  runBuild(productionDir);
  runBuild(canaryDir, ['--canary-preview']);

  assert.deepEqual(
    listFiles(productionDir).filter(file => file.startsWith('about/')).sort(),
    aboutFiles.sort()
  );
  assert.equal(listFiles(canaryDir).some(file => file.startsWith('about/')), false);
});

test('production sitemap owns each About URL exactly once and canary owns none', () => {
  const productionSitemap = fs.readFileSync(path.join(productionDir, 'sitemap.xml'), 'utf8');
  const canarySitemap = fs.readFileSync(path.join(canaryDir, 'sitemap.xml'), 'utf8');
  const productionLocs = extractLocs(productionSitemap);
  const canaryLocs = extractLocs(canarySitemap);

  for (const url of aboutPaths) {
    assert.equal(productionLocs.filter(candidate => candidate === url).length, 1, url);
    assert.equal(canaryLocs.includes(url), false, url);
  }
});

test('each About page is canonical and indexable without language URL variants', () => {
  const expectations = {
    'about/index.html': {
      canonical: 'https://pyoko.jp/about/',
      title: 'PYOKOについて｜ぐるっとパス非公式ガイド'
    },
    'about/data/index.html': {
      canonical: 'https://pyoko.jp/about/data/',
      title: '情報・出典と判断について｜PYOKO'
    },
    'about/pass-tracker/index.html': {
      canonical: 'https://pyoko.jp/about/pass-tracker/',
      title: 'Pass Trackerと参考価値について｜PYOKO'
    }
  };

  for (const [relativePath, expected] of Object.entries(expectations)) {
    const html = outputPage(relativePath);
    assert.equal((html.match(/<link\s+rel="canonical"/gi) || []).length, 1, relativePath);
    assert.match(html, new RegExp(`<link\\s+rel="canonical"\\s+href="${expected.canonical.replaceAll('/', '\\/')}"`));
    assert.match(html, new RegExp(`<title>${expected.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/title>`));
    assert.doesNotMatch(html, /<meta[^>]+noindex/i);
    assert.doesNotMatch(html, /hreflang/i);
    assert.doesNotMatch(html, /application\/ld\+json/i);
    assert.doesNotMatch(html, /<link[^>]+href="\/(?:ja|en|zh)\/about/i);
  }
});

test('About pages keep all approved languages in the no-JS-safe static shell', () => {
  const about = outputPage('about/index.html');
  const data = outputPage('about/data/index.html');
  const tracker = outputPage('about/pass-tracker/index.html');

  for (const html of [about, data, tracker]) {
    for (const language of ['ja', 'en', 'zh']) {
      assert.match(html, new RegExp(`data-about-language="${language}"`), language);
    }
    assert.match(html, /<article[^>]+data-about-language="ja"[^>]*>/);
    assert.match(html, /<article[^>]+data-about-language="en"[^>]+hidden/);
    assert.match(html, /<article[^>]+data-about-language="zh"[^>]+hidden/);
    for (const language of ['ja', 'en', 'zh']) {
      assert.match(html, new RegExp(`data-about-lang="${language}"`), language);
    }
    assert.match(html, /<button[^>]+type="button"[^>]+data-about-lang=/);
    assert.match(html, /src="\/about\/about\.js"/);
    assert.match(html, /href="\/about\/about\.css"/);
  }

  assert.match(about, /PYOKOは、「東京・ミュージアム ぐるっとパス」を使って/);
  assert.match(about, /PYOKO is an independent, unofficial guide I make/);
  assert.match(about, /PYOKO 是我为「东京・博物馆 ぐるっとパス」使用者/);
  assert.match(about, /I had made a list, but I was still doing almost the same amount of checking\./);
  assert.match(about, /列表是有了，查资料的次数却几乎没有变少/);
  assert.doesNotMatch(about, /(?:href|src)="[^"]*note/i);
  assert.match(about, /href="\/about\/data\/"/);
  assert.match(about, /href="\/about\/pass-tracker\/"/);

  assert.match(data, /この情報はどこから来たのか/);
  assert.match(data, /「不明」は「休館」ではありません/);
  assert.match(data, /Where did this information come from\?/);
  assert.match(data, /Unknown does not mean closed\./);
  assert.match(data, /这条信息到底从哪里来的/);
  assert.match(data, /未知不等于关闭/);

  assert.match(tracker, /実際に節約した金額ではありません/);
  assert.match(tracker, /「未確認」は0円ではありません/);
  assert.match(tracker, /It does not show the exact amount of money you personally saved\./);
  assert.match(tracker, /“Unverified” does not mean zero/);
  assert.match(tracker, /不是你的实际“节省金额”/);
  assert.match(tracker, /“未确认”不是 0 日元/);
});

test('runtime and generated Detail surfaces link from provenance context to About Data', () => {
  const homepageSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const directUrlSource = fs.readFileSync(path.join(root, 'scripts', 'facility-direct-url.js'), 'utf8');
  const generated = outputPage('facilities/tokyo-national-museum/index.html');

  assert.match(homepageSource, /href="\/about\/data\/"/);
  assert.match(homepageSource, /data-i18n="source\.aboutData"/);
  assert.match(directUrlSource, /href="\/about\/data\/"/);
  assert.match(generated, /href="\/about\/data\/"/);
  assert.match(generated, /情報・出典と判断について/);
});

test('homepage and Pass Tracker carry quiet localized About links without changing storage owners', () => {
  const homepageSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const uiSource = fs.readFileSync(path.join(root, 'i18n', 'ui.js'), 'utf8');

  assert.match(homepageSource, /href="\/about\/"/);
  assert.match(homepageSource, /data-i18n="footer\.aboutMore"/);
  assert.match(homepageSource, /href="\/about\/pass-tracker\/"/);
  assert.match(homepageSource, /data-i18n="pass\.referenceLearnMore"/);
  assert.match(uiSource, /'footer\.aboutMore':/);
  assert.match(uiSource, /'pass\.referenceLearnMore':/);
  assert.match(uiSource, /grutto-pass-lang/);
  assert.match(homepageSource, /visitedStorageKey/);
  assert.match(homepageSource, /wantToGoStorageKey/);
});
