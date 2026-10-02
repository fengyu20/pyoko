const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const notFound = fs.readFileSync(path.join(__dirname, '..', '404.html'), 'utf8');

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

test('404 keeps the PYOKO Forest lockup and semantic color roles', () => {
  assert.match(notFound, /--brand-surface:\s*#143D33/);
  assert.match(notFound, /--brand-accent-coral:\s*#F28B78/);
  assert.match(notFound, /--brand-accent-lime:\s*#B7CF71/);
  assert.match(notFound, /--product-primary:\s*#1F6B48/);
  assert.match(notFound, /class="pyoko-wordmark"/);
  assert.match(notFound, /pyoko-letter--orbit/);
  assert.match(notFound, /pyoko-letter--hop/);
  assert.match(notFound, /data-copy="descriptor"/);
  assert.match(notFound, /data-copy="unofficial">非公式/);
  assert.match(notFound, /class="home-link"/);
  assert.doesNotMatch(notFound, /#B7D0BE/);
});

test('404 exposes the three supported language copies and remembers the app locale', () => {
  ['Page not found', 'Unofficial', 'Back to home', 'Language'].forEach(copy => assert.match(notFound, new RegExp(copy)));
  ['找不到页面', '非官方', '返回首页', '语言'].forEach(copy => assert.match(notFound, new RegExp(copy)));
  assert.match(notFound, /grutto-pass-lang/);
  assert.match(notFound, /searchParams\.get\('lang'\)/);
  assert.match(notFound, /window\.navigator\.language/);
  assert.match(notFound, /document\.documentElement\.lang = next/);
});

test('404 keeps focus and compact-layout safeguards', () => {
  assert.match(notFound, /min-width:\s*44px/);
  assert.match(notFound, /min-height:\s*44px/);
  assert.match(notFound, /outline:\s*3px solid var\(--product-primary\)/);
  assert.match(notFound, /text-wrap:\s*balance/);
  assert.match(notFound, /prefers-reduced-motion/);
  assert.ok(contrastRatio('#1F6B48', '#FFFFFF') >= 3);
});
