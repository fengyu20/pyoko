const { test, expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  assertNoHorizontalOverflow,
  clickInputLabel,
  closeDrawer,
  openDrawer,
  preparePage,
  setLanguage,
} = require('./release-fixtures');

test.setTimeout(120_000);

// Phase 3 separates three layers that used to be fused: the official
// entitlement, the product's structured reading of it, and the derived
// reference value. These tests read the rendered surfaces.

const browsePhrases = (page, key) => page.evaluate(facilityKey => {
  const card = document.getElementById(`card-${facilityKey}`);
  return [...card.querySelectorAll('.pass-benefit-headline,.pass-benefit-alt')].map(node => node.textContent.trim());
}, key);

const browseValue = (page, key) => page.evaluate(facilityKey => {
  const node = document.getElementById(`card-${facilityKey}`).querySelector('.pass-benefit-value');
  return node ? { text: node.textContent.trim(), confidence: node.dataset.confidence } : null;
}, key);

const detailLayers = async (page, key) => {
  const { drawer } = await openDrawer(page, key);
  const section = drawer.locator('.facility-detail-section--pass');
  const layers = await section.evaluate(node => ({
    clauses: [...node.querySelectorAll('.pass-clause')].map(clause => ({
      label: clause.querySelector('.pass-clause-label').textContent.trim(),
      text: clause.querySelector('.pass-clause-text').textContent.trim(),
      original: clause.querySelector('.pass-clause-original')?.textContent.trim() ?? null,
    })),
    reference: node.querySelector('.pass-reference:not(.pass-reference--estimate)')
      ? {
        label: node.querySelector('.pass-reference-label').textContent.trim(),
        amount: node.querySelector('.pass-reference-amount').textContent.trim(),
        basis: node.querySelector('.pass-reference-basis').textContent.trim(),
      }
      : null,
    estimate: node.querySelector('.pass-reference--estimate')?.textContent.trim() ?? null,
    // Reading order matters: entitlement first, derived value after.
    order: [...node.querySelectorAll('.pass-clause-label,.pass-reference-label')].map(el => el.className),
  }));
  await closeDrawer(page);
  return layers;
};

test('No.18 emphasizes the source-stated discount and invents no facility price', async ({ page }) => {
  await preparePage(page, 'ja');
  // Browse leads with the official ¥300, which is the entitlement itself.
  expect(await browsePhrases(page, '18')).toEqual(['企画展・特別展 ¥300引']);
  // ...so it must not also appear as a separate derived reference value.
  expect(await browseValue(page, '18')).toBeNull();

  const layers = await detailLayers(page, '18');
  expect(layers.clauses).toEqual([
    { label: '割引', text: '企画展・特別展割引：一般料金の300円引', original: null },
  ]);
  expect(layers.reference).toBeNull();

  // ¥1,200 is one exhibition's price. It backs the comparable value but is
  // never shown as this facility's regular price.
  const detailText = await page.evaluate(() => document.getElementById('card-18').innerText);
  expect(detailText).not.toContain('1,200');
  expect(await page.evaluate(() => document.getElementById('card-18').dataset.benefit)).toBe('300');
  await assertNoBrowserErrors(page);
});

test('No.44 keeps both official clauses and pins ¥200 to the garden', async ({ page }) => {
  await preparePage(page, 'ja');
  expect(await browsePhrases(page, '44')).toEqual([
    '建物公開展・庭園 入場',
    '企画展 団体料金相当の割引',
  ]);

  const layers = await detailLayers(page, '44');
  expect(layers.clauses).toEqual([
    { label: '入場', text: '建物公開展、庭園入場', original: null },
    { label: '割引', text: '企画展割引：一般料金の団体割引相当額', original: null },
  ]);
  // A group-rate equivalent stays wording; it is never converted to yen.
  expect(layers.clauses[1].text).not.toContain('¥');
  expect(layers.reference.amount).toBe('¥200');
  expect(layers.reference.basis).toContain('庭園');
  // The building exhibition must not read as if it were worth ¥200.
  expect(layers.reference.basis).not.toContain('建物公開展');
  await assertNoBrowserErrors(page);
});

test('a variable percentage stays a percentage across Browse and Detail', async ({ page }) => {
  await preparePage(page, 'ja');
  const phrases = await browsePhrases(page, '70');
  expect(phrases[1]).toBe('企画展 20%引');
  expect(phrases[1]).not.toMatch(/¥|円/);

  const layers = await detailLayers(page, '70');
  expect(layers.clauses[1].text).toContain('20％引');
  // The reference value belongs to the admission benefit, and says so.
  expect(layers.reference.amount).toBe('¥400');
  expect(layers.reference.basis).toContain('北斎を学ぶ部屋');
  const text = await page.evaluate(() => document.getElementById('card-70').innerText);
  expect(text).not.toContain('¥0');
  await assertNoBrowserErrors(page);
});

test('legacy fallback amounts read as estimates, verified ones as reference values', async ({ page }) => {
  await preparePage(page, 'ja');
  const verified = await browseValue(page, '80');
  expect(verified).toEqual({ text: '参考 ¥630', confidence: 'verified' });

  // No.1 has an entitlement-only record: its amount still comes from the
  // legacy parser, so it may not claim the same standing.
  const legacy = await browseValue(page, '1');
  expect(legacy.confidence).toBe('estimated');
  expect(legacy.text).toMatch(/^概算/);
  expect(legacy.text).not.toContain('参考価値');

  // The two are visually distinguishable, not just semantically tagged.
  const styles = await page.evaluate(() => {
    const read = key => {
      const node = document.getElementById(`card-${key}`).querySelector('.pass-benefit-value');
      const style = getComputedStyle(node);
      return { color: style.color, weight: style.fontWeight };
    };
    return { verified: read('80'), estimated: read('1') };
  });
  expect(styles.estimated.color).not.toBe(styles.verified.color);
  expect(Number(styles.estimated.weight)).toBeLessThan(Number(styles.verified.weight));

  // The entitlement itself still comes from the scoped official source.
  const layers = await detailLayers(page, '1');
  expect(layers.clauses).toEqual([{ label: '入場', text: '全ての展覧会に入場', original: null }]);
  // It gets the weakened estimate line, not the verified reference-value block.
  expect(layers.reference).toBeNull();
  expect(layers.estimate).toBe('概算 ¥300');
  // The computation contract is untouched by the display policy.
  expect(await page.evaluate(() => document.getElementById('card-1').dataset.benefit)).not.toBe('');
  await assertNoBrowserErrors(page);
});

test('the derived value follows the entitlement in reading order', async ({ page }) => {
  await preparePage(page, 'ja');
  const layers = await detailLayers(page, '71');
  expect(layers.order).toEqual([
    'pass-clause-label',
    'pass-clause-label',
    'pass-reference-label',
  ]);
  // The reference value carries a readable label, not colour alone.
  expect(layers.reference.label).toBe('参考価値');
  await assertNoBrowserErrors(page);
});

test('Facility Drawer and Map Detail render the same Pass section', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.setViewportSize({ width: 1400, height: 900 });
  const { drawer } = await openDrawer(page, '71');
  const fromDrawer = (await drawer.locator('.facility-detail-section--pass').innerText()).replace(/\s+/g, ' ').trim();
  await closeDrawer(page);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await page.evaluate(() => window.setSelectedFacilityKey('71'));
  const fromMap = (await page.locator('.map-facility-body .facility-detail-section--pass').innerText()).replace(/\s+/g, ' ').trim();
  expect(fromMap).toBe(fromDrawer);
  await assertNoBrowserErrors(page);
});

test('EN and ZH lead with the localized reading and keep the Japanese source', async ({ page }) => {
  await preparePage(page, 'ja');
  for (const [language, expected] of Object.entries({
    en: { primary: 'Permanent collection · Free admission', label: 'Admission', reference: 'Reference value' },
    zh: { primary: '常设展 · 免费入场', label: '入场', reference: '参考价值' },
  })) {
    await setLanguage(page, language);
    const layers = await detailLayers(page, '71');
    expect(layers.clauses[0].label, language).toBe(expected.label);
    expect(layers.clauses[0].text, language).toBe(expected.primary);
    // The official Japanese wording stays available underneath.
    expect(layers.clauses[0].original, language).toContain('常設展入場');
    expect(layers.reference.label, language).toBe(expected.reference);
    expect(layers.reference.amount, language).toBe('¥800');
    await assertNoHorizontalOverflow(page);
  }
  await assertNoBrowserErrors(page);
});

test('My Pass reports reference value, never actual savings', async ({ page }) => {
  await preparePage(page, 'ja');
  await clickInputLabel(page, '#card-71 [data-visited-toggle="71"]');
  await clickInputLabel(page, '#card-80 [data-visited-toggle="80"]');
  await page.locator('#passTrackerChip').click();

  const panel = page.locator('#passTracker .my-pass-panel');
  const text = (await panel.innerText()).replace(/\s+/g, ' ');

  // The computation is unchanged: ¥800 + ¥630.
  expect(await page.evaluate(() => window.getVisitedMetrics().valueTotal)).toBe(1430);
  expect(text).toContain('参考価値の合計');
  expect(text).toContain('1,430円');
  expect(text).toContain('参考 800円');
  // Break-even copy states the model it is built on.
  expect(text).toContain('参考価値では、あと1,070円でパス価格相当');
  // Nothing claims the visitor actually saved this money.
  expect(text).not.toMatch(/お得|節約|元が取れ/);
  // ...and the qualification is stated once, where the total is claimed.
  expect(text).toContain('実際の料金・利用内容により異なります');
  await assertNoBrowserErrors(page);
});
