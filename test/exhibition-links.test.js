// 特展カードが場馆首页を特展详情页として再利用しないことを検証する。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const window = {};
const context = vm.createContext({ window });
vm.runInContext(fs.readFileSync(path.join(root, 'data/facilities.js'), 'utf8'), context, { filename: 'facilities.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'data/exhibition-links.js'), 'utf8'), context, { filename: 'exhibition-links.js' });
vm.runInContext(';globalThis.__data = DATA;', context);

const facilities = context.__data.flatMap(area => area.facilities || []);
const links = window.EXHIBITION_LINKS;
const uiWindow = {
  EXHIBITION_LINKS: links,
  EXHIBITION_LINK_TYPES: window.EXHIBITION_LINK_TYPES,
  location: { href: 'https://example.test/?lang=ja' },
  navigator: { language: 'ja' }
};
const uiContext = vm.createContext({ window: uiWindow, URL });
vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), uiContext, { filename: 'i18n/ui.js' });
const findItem = (key, title) => {
  const facility = facilities.find(entry => entry._key === key);
  return { facility, item: facility.enriched.find(entry => entry.title === title) };
};
const comparableUrl = url => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/+$/, '') || '/'}${parsed.search}`;
};

test('TNM and Ueno Zoo exhibitions use dedicated official pages', () => {
  assert.equal(
    links['5']['特別企画「ビフォー縄文―旧石器時代発見80周年―」'],
    'https://www.tnm.jp/modules/r_free_page/index.php?id=2766&lang=ja'
  );
  assert.equal(
    links['8']['企画展示「カメカメエブリバディ」'],
    'https://www.tokyo-zoo.net/ueno/news/11819/index.html'
  );
  assert.equal(
    links['8']['パネル展「Giant Thanks 東園パンダ舎」'],
    'https://www.tokyo-zoo.net/ueno/news/12246/index.html'
  );
  assert.equal(
    links['74']['MOTコレクション　はじめて、びじゅつ'],
    'https://www.mot-art-museum.jp/exhibitions/'
  );
});

test('No.71 の確定展覧会タイトルは公式の詳細ページを開く', () => {
  assert.equal(
    links['71']['企画展「浮世へのいざない―江戸博×出光コレクション初共演」'],
    'https://www.edo-tokyo-museum.or.jp/s-exhibition/edohaku-idemitsu/'
  );
});

test('every exhibition item that previously pointed at a facility home page is covered', () => {
  const homepageItems = facilities.flatMap(facility => (facility.enriched || [])
    .filter(item => (facility.urls || []).some(home => comparableUrl(home) === comparableUrl(item.url)))
    .map(item => ({ facility, item })));

  assert.equal(homepageItems.length, 37);
  for (const { facility, item } of homepageItems) {
    assert.ok(Object.prototype.hasOwnProperty.call(links[facility._key] || {}, item.title), `${facility._key}/${item.title}`);
  }
});

test('curated exhibition URLs are valid and never equal a facility home page', () => {
  for (const [facilityKey, entries] of Object.entries(links)) {
    const facility = facilities.find(item => item._key === facilityKey);
    assert.ok(facility, `unknown facility ${facilityKey}`);
    for (const [title, url] of Object.entries(entries)) {
      assert.ok(facility.enriched.some(item => item.title === title), `${facilityKey}/${title}`);
      if (url === null) continue;
      assert.match(url, /^https?:\/\//);
      assert.ok(!(facility.urls || []).some(home => comparableUrl(home) === comparableUrl(url)), `${facilityKey}/${title}`);
    }
  }
});

test('items without a dedicated exhibition page intentionally render without a detail link', () => {
  const { facility, item } = findItem('61', 'コレクション・常設展示');
  assert.equal(links[facility._key][item.title], null);
});

test('runtime link resolver never falls back to a facility homepage', () => {
  const tnm = findItem('5', '特別企画「ビフォー縄文―旧石器時代発見80周年―」');
  assert.equal(uiWindow.getExhibitionLink(tnm.facility, tnm.item), links['5'][tnm.item.title]);

  assert.equal(
    uiWindow.getExhibitionLink(
      { urls: ['https://example.org'] },
      { title: 'Homepage-shaped URL', url: 'https://example.org/' }
    ),
    ''
  );
});

/* ---- v97: link TYPE decides whether a title may carry the link ---- */

test('a listing destination never becomes a title link', () => {
  const facility = { _key: '68', urls: ['http://www.toyo-bunko.or.jp/'] };
  const listing = { title: 'X', url: 'https://www.toyo-bunko.or.jp/museum/exhibition/' };

  // Classified as a listing, so the title stays plain text …
  assert.equal(uiWindow.classifyExhibitionUrl(facility, listing.url), 'listing');
  assert.equal(uiWindow.getExhibitionLink(facility, listing), '');
  // … and the destination is reported for the section-level CTA instead.
  const presentation = uiWindow.getExhibitionLinkPresentation(facility, listing);
  assert.equal(presentation.type, 'listing');
  assert.equal(presentation.url, '');
  assert.equal(presentation.listingUrl, listing.url);
});

test('an exact exhibition page stays on the title', () => {
  const facility = { _key: '68', urls: ['http://www.toyo-bunko.or.jp/'] };
  const exact = { title: '「怖い」本', url: 'https://toyo-bunko.or.jp/museum-exhibition/2631/' };
  assert.equal(uiWindow.classifyExhibitionUrl(facility, exact.url), 'exact');
  assert.equal(uiWindow.getExhibitionLink(facility, exact), exact.url);
  assert.equal(uiWindow.getExhibitionLinkPresentation(facility, exact).listingUrl, '');
});

test('classification is declared, never guessed from the path', () => {
  const facility = { _key: '999', urls: ['https://example.test/'] };
  // A path that "looks like" a listing is still exact unless declared otherwise:
  // this layer narrows known mistakes rather than inventing a heuristic.
  const undeclared = { title: 'Y', url: 'https://example.test/exhibitions/' };
  assert.equal(uiWindow.classifyExhibitionUrl(facility, undeclared.url), 'exact');
  assert.equal(uiWindow.getExhibitionLink(facility, undeclared), undeclared.url);
});

test('classification normalizes trailing slashes before matching', () => {
  const facility = { _key: '68', urls: ['http://www.toyo-bunko.or.jp/'] };
  for (const url of [
    'https://www.toyo-bunko.or.jp/museum/exhibition',
    'https://www.toyo-bunko.or.jp/museum/exhibition/',
    'https://www.toyo-bunko.or.jp/museum/exhibition//'
  ]) {
    assert.equal(uiWindow.classifyExhibitionUrl(facility, url), 'listing', url);
  }
});
