const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'i18n', 'ui.js'), 'utf8');

function keyCount(key) {
  return (ui.match(new RegExp(`'${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g')) || []).length;
}

test('footer trust and feedback copy exists in all supported locales', () => {
  const keys = [
    'footer.accuracyHeading',
    'footer.accuracyBody',
    'footer.contactHeading',
    'footer.contactPrefix',
    'footer.contactSuffix'
  ];
  keys.forEach(key => assert.equal(keyCount(key), 3, `${key} must exist in JA / EN / ZH`));

  [
    '情報の正確性について',
    'PYOKOでは公式情報をもとに、できる限り正確な情報の確認・更新に努めています。ただし、開館時間・休館日・展覧会・パス特典などは変更される場合があります。来館前には、各ページに掲載している公式情報もあわせてご確認ください。',
    '情報の修正・更新について',
    'About information accuracy',
    'PYOKO makes every effort to verify and keep information up to date using official sources. Opening hours, closures, exhibitions and Pass benefits can still change, so please check the linked official information before visiting.',
    'Questions or corrections?',
    '关于信息准确性',
    'PYOKO 会尽可能根据官方来源核实并更新信息，但开放时间、休馆安排、展览及 Pass 优惠可能临时变更。来馆前建议确认页面中链接的官方信息。',
    '发现信息需要更新？'
  ].forEach(copy => assert.ok(ui.includes(copy), `missing approved copy: ${copy}`));
});

test('footer places always-visible assurance between identity and disclosures', () => {
  const trustStart = html.indexOf('<div class="footer-trust">');
  const assuranceStart = html.indexOf('<div class="footer-assurance">');
  const disclosuresStart = html.indexOf('<div class="footer-disclosures">');
  assert.ok(trustStart >= 0 && trustStart < assuranceStart);
  assert.ok(assuranceStart < disclosuresStart);

  const assurance = html.slice(assuranceStart, disclosuresStart);
  assert.match(assurance, /class="footer-assurance-section"/g);
  assert.equal((assurance.match(/class="footer-assurance-section"/g) || []).length, 2);
  assert.doesNotMatch(assurance, /<details|footer-disclosure/);
  assert.match(html, /\.footer-assurance\{display:grid;gap:20px;max-width:960px/);
  assert.match(html, /@media \(min-width:760px\)\{[\s\S]*?\.footer-assurance\{grid-template-columns:repeat\(2,minmax\(0,1fr\)/);
});

test('footer contact remains a plain mailto link and removes the duplicate caveat', () => {
  assert.equal((html.match(/hello@pyoko\.jp/g) || []).length, 2);
  assert.match(html, /<a class="footer-contact-link" href="mailto:hello@pyoko\.jp">hello@pyoko\.jp<\/a>/);
  assert.doesNotMatch(html, /footer-contact-form|<form[^>]*footer/i);
  assert.doesNotMatch(html, /footer-contact-link[^>]*target=/);
  assert.match(html, /id="footerOfficialLink"[^>]*data-i18n="hero\.officialLink"/);
  assert.match(html, /class="footer-disclosure site-about"/);
  assert.match(html, /class="footer-disclosure site-sources"/);

  const unofficialLines = ui.match(/'footer\.unofficialShort': '[^']*'/g) || [];
  assert.equal(unofficialLines.length, 3);
  unofficialLines.forEach(line => assert.doesNotMatch(line, /最新|latest information|最新信息/));
  assert.match(html, /\.footer-contact-link:focus-visible\{outline:2px solid var\(--brand-green\)/);
});

test('footer trust row reuses the Hero CTA semantics in all supported locales', () => {
  const context = vm.createContext({ window: {} });
  vm.runInContext(`${ui};globalThis.__tables = window.UI_STRINGS;`, context, { filename: 'i18n/ui.js' });
  const expected = {
    ja: { identity: '非公式ガイドです。', cta: '購入・最新情報は公式サイトへ ↗' },
    en: { identity: 'Unofficial guide.', cta: 'Buy & check latest info on the official site ↗' },
    zh: { identity: '非官方指南。', cta: '购买及最新信息请查看官网 ↗' }
  };

  for (const [language, copy] of Object.entries(expected)) {
    assert.equal(context.__tables[language]['footer.unofficialShort'], copy.identity);
    assert.equal(context.__tables[language]['hero.officialLink'], copy.cta);
  }

  const trustStart = html.indexOf('<div class="footer-trust">');
  const assuranceStart = html.indexOf('<div class="footer-assurance">');
  const trust = html.slice(trustStart, assuranceStart);
  assert.match(trust, /data-i18n="footer\.unofficialShort"/);
  assert.match(trust, /data-i18n="hero\.officialLink"/);
  assert.doesNotMatch(trust, /<br\b/i);
  assert.match(html, /\.footer-trust\{display:flex;align-items:baseline;justify-content:flex-start;flex-wrap:wrap;/);
  assert.doesNotMatch(html, /@media \(max-width:640px\)\{[\s\S]*?\.footer-trust\{display:block/);
  assert.doesNotMatch(html, /\.footer-official-link\{margin-top:/);
  assert.match(html, /\.footer-official-link:focus-visible\{outline:2px solid var\(--brand-green\)/);
});
