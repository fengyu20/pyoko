const { test, expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  clickInputLabel,
  closeDrawer,
  openDrawer,
  preparePage,
} = require('./release-fixtures');

test.setTimeout(120_000);

// Phase 2 moves the monetary source of truth without touching the card data
// contract. These tests read the runtime, not the data files.

async function cardValues(page, key) {
  return page.evaluate(facilityKey => {
    const card = document.getElementById(`card-${facilityKey}`);
    return {
      benefit: card?.dataset.benefit ?? null,
      regularPrice: card?.dataset.regularPrice ?? null,
      passTypes: card?.dataset.passTypes ?? null,
    };
  }, key);
}

test('verified facilities use the scoped comparable value, not the legacy scalar', async ({ page }) => {
  await preparePage(page, 'ja');
  const expected = {
    44: { benefit: '200', regularPrice: '200' },
    50: { benefit: '220', regularPrice: '220' },
    70: { benefit: '400', regularPrice: '400' },
    71: { benefit: '800', regularPrice: '800' },
    105: { benefit: '300', regularPrice: '300' },
  };
  for (const [key, want] of Object.entries(expected)) {
    const actual = await cardValues(page, key);
    expect(actual.benefit, `No.${key} benefit`).toBe(want.benefit);
    expect(actual.regularPrice, `No.${key} regular price`).toBe(want.regularPrice);
  }
  await assertNoBrowserErrors(page);
});

test('No.71 never resurfaces the special-exhibition figures at facility level', async ({ page }) => {
  await preparePage(page, 'ja');
  const resolved = await page.evaluate(() => ({
    comparable: window.getFacilityComparableValue('71'),
    basisPrice: window.getFacilityRegularPriceForValueBasis('71'),
    authoritative: window.hasAuthoritativeScopedMonetaryRecord('71'),
    entitlements: window.getFacilityEntitlements('71'),
    dataset: {
      benefit: document.getElementById('card-71').dataset.benefit,
      regularPrice: document.getElementById('card-71').dataset.regularPrice,
    },
  }));

  expect(resolved.authoritative).toBe(true);
  expect(resolved.comparable.value_yen).toBe(800);
  expect(resolved.comparable.source).toBe('scoped');
  expect(resolved.comparable.value_basis.scope).toBe('permanent_collection');
  expect(resolved.basisPrice).toBe(800);
  expect(resolved.dataset.benefit).toBe('800');
  expect(resolved.dataset.regularPrice).toBe('800');
  // The exhibition-specific figures must not reach the runtime at facility level.
  expect([resolved.dataset.benefit, resolved.dataset.regularPrice, String(resolved.basisPrice)])
    .not.toContain('1600');
  expect([resolved.dataset.benefit, resolved.dataset.regularPrice, String(resolved.basisPrice)])
    .not.toContain('320');

  // The 20% special-exhibition entitlement still exists, with no yen value.
  const discount = resolved.entitlements.benefits.find(benefit => benefit.type === 'discount_percent');
  expect(discount.scopes).toEqual(['special_exhibition']);
  expect(discount.discount_rate).toBe(0.2);
  expect(discount.saving_yen).toBeNull();
  expect(discount.official_wording.ja).toContain('特別展');
  await assertNoBrowserErrors(page);
});

test('an authoritative null never falls back, and a flat discount keeps no fake price', async ({ page }) => {
  await preparePage(page, 'ja');
  const flat = await page.evaluate(() => {
    // No.2 is a flat ¥100 discount whose scoped price is deliberately null,
    // while its legacy record still carries an exhibition price of 3000.
    const card = document.getElementById('card-2');
    return {
      benefit: card.dataset.benefit,
      regularPrice: card.dataset.regularPrice,
      basisPrice: window.getFacilityRegularPriceForValueBasis('2'),
      comparable: window.getFacilityComparableValue('2'),
    };
  });
  expect(flat.benefit).toBe('100');
  expect(flat.regularPrice).toBe('');
  expect(flat.basisPrice).toBeNull();
  expect(flat.comparable.source).toBe('scoped');

  // Same for the other verified flat discounts whose scoped price is null.
  for (const key of ['9', '36', '36-2', '38', '39']) {
    const price = await page.evaluate(facilityKey => ({
      dataset: document.getElementById(`card-${facilityKey}`).dataset.regularPrice,
      basis: window.getFacilityRegularPriceForValueBasis(facilityKey),
    }), key);
    expect(price.dataset, `No.${key} must not gain a legacy exhibition price`).toBe('');
    expect(price.basis).toBeNull();
  }
  // No.18 does have a verified scoped price for its discount scope, so it keeps
  // one — corrected from the legacy exhibition example of 1500 to 1200.
  const mitsui = await cardValues(page, '18');
  expect(mitsui.benefit).toBe('300');
  expect(mitsui.regularPrice).toBe('1200');
  await assertNoBrowserErrors(page);
});

test('entitlement-only facilities keep the legacy monetary behavior', async ({ page }) => {
  await preparePage(page, 'ja');
  const stats = await page.evaluate(() => window.getPassValueResolutionStats());
  expect(stats.total).toBe(108);
  expect(stats.authoritative).toBe(23);
  expect(stats.entitlementOnly).toBe(85);
  // Every card rendered, so every record resolved through the adapter.
  expect(stats.resolvedScoped).toBe(23);
  expect(stats.resolvedLegacy).toBe(85);

  const legacy = await page.evaluate(() => ({
    comparable: window.getFacilityComparableValue('1', { _key: '1', no: '1', name: 'x', pass_types: ['admission'], fee: ['一般300円'] }),
    authoritative: window.hasAuthoritativeScopedMonetaryRecord('1'),
    entitlements: window.getFacilityEntitlements('1'),
  }));
  expect(legacy.authoritative).toBe(false);
  expect(legacy.comparable.source).toBe('legacy');
  expect(legacy.comparable.value_yen).toBe(300);
  // Entitlement is scoped for all 108 regardless of monetary status.
  expect(legacy.entitlements.official_clauses[0].wording_ja).toBe('全ての展覧会に入場');
  await assertNoBrowserErrors(page);
});

test('every facility has scoped entitlements and the source object stays immutable', async ({ page }) => {
  await preparePage(page, 'ja');
  const result = await page.evaluate(() => {
    const keys = [...document.querySelectorAll('#mainContent .card')].map(card => card.dataset.facilityKey);
    const missing = keys.filter(key => !window.getFacilityEntitlements(key));
    const entitlements = window.getFacilityEntitlements('71');
    entitlements.official_clauses[0].wording_ja = 'tampered';
    entitlements.benefits[0].scopes.push('tampered');
    const after = window.getFacilityEntitlements('71');
    return {
      count: keys.length,
      missing,
      wording: after.official_clauses[0].wording_ja,
      scopes: after.benefits[0].scopes,
    };
  });
  expect(result.count).toBe(108);
  expect(result.missing).toEqual([]);
  expect(result.wording).toBe('常設展入場');
  expect(result.scopes).toEqual(['permanent_collection']);
  await assertNoBrowserErrors(page);
});

test('a mixed-scope entitlement does not fuse the derived value into its sentence', async ({ page }) => {
  await preparePage(page, 'ja');
  const mixed = await page.evaluate(() => {
    const card = document.getElementById('card-71');
    return {
      benefit: card.dataset.benefit,
      headline: card.querySelector('.pass-benefit-headline')?.textContent.trim(),
      phrases: [...card.querySelectorAll('.pass-benefit-headline,.pass-benefit-alt')].map(n => n.textContent.trim()),
      value: card.querySelector('.pass-benefit-value')?.textContent.trim() ?? null,
    };
  });
  // The value still exists for sorting, filtering and My Pass.
  expect(mixed.benefit).toBe('800');
  // Both entitlement branches are visible, and neither carries the amount.
  expect(mixed.phrases).toEqual(['常設展 入場', '特別展 20%引']);
  expect(mixed.phrases.join(' ')).not.toContain('800');
  expect(mixed.headline).not.toContain('無料');
  // The amount appears only in its own reference slot.
  expect(mixed.value).toBe('参考 ¥800');

  // A single-scope facility keeps an inline amount, in the same reference slot.
  const single = await page.evaluate(() => {
    const card = document.getElementById('card-80');
    return {
      benefit: card.dataset.benefit,
      value: card.querySelector('.pass-benefit-value')?.textContent.trim() ?? null,
      confidence: card.querySelector('.pass-benefit-value')?.dataset.confidence ?? null,
    };
  });
  expect(single.benefit).toBe('630');
  expect(single.value).toContain('630');
  expect(single.confidence).toBe('verified');
  await assertNoBrowserErrors(page);
});

test('My Pass savings use the corrected comparable values', async ({ page }) => {
  await preparePage(page, 'ja');
  const metrics = () => page.evaluate(() => window.getVisitedMetrics());
  const before = await metrics();
  await clickInputLabel(page, '#card-71 [data-visited-toggle="71"]');
  await expect(page.locator('#card-71 .visited-toggle')).toHaveClass(/is-checked/);
  const afterEdo = await metrics();
  expect(afterEdo.valueTotal - before.valueTotal).toBe(800);

  await clickInputLabel(page, '#card-105 [data-visited-toggle="105"]');
  await expect(page.locator('#card-105 .visited-toggle')).toHaveClass(/is-checked/);
  const afterChiba = await metrics();
  expect(afterChiba.valueTotal - afterEdo.valueTotal).toBe(300);
  expect(afterChiba.count).toBe(2);
  await assertNoBrowserErrors(page);
});

test('sorting and the value filter consume the corrected values', async ({ page }) => {
  await preparePage(page, 'ja');
  // ¥750 would pass a ¥500 threshold; the corrected ¥300 must not.
  await page.locator('#filterToggleBtn').click();
  await page.locator('#valueFilter').selectOption('500');
  await expect.poll(() => page.evaluate(() => (
    getComputedStyle(document.getElementById('card-105')).display
  ))).toBe('none');
  // ¥320 would fail the same threshold; the corrected ¥800 must pass it.
  await expect(page.locator('#card-71')).toBeVisible();

  await page.locator('#valueFilter').selectOption('0');
  await page.locator('#sortMode').selectOption('benefit');
  const order = await page.evaluate(() => [...document.querySelectorAll('#mainContent .card')]
    .filter(card => getComputedStyle(card).display !== 'none')
    .map(card => ({ key: card.dataset.facilityKey, value: Number(card.dataset.benefit || -1) })));
  const edo = order.findIndex(entry => entry.key === '71');
  const chiba = order.findIndex(entry => entry.key === '105');
  expect(edo).toBeGreaterThanOrEqual(0);
  expect(order[edo].value).toBe(800);
  expect(order[chiba].value).toBe(300);
  // Sorted by value descending: the corrected ¥800 now outranks the ¥300.
  expect(edo).toBeLessThan(chiba);
  await assertNoBrowserErrors(page);
});

test('the Facility Detail attributes the derived value to its own scope only', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '71');
  const section = drawer.locator('.facility-detail-section--pass');

  // The official clauses are the entitlement anchor and stay separate.
  const clauses = await section.locator('.pass-clause').evaluateAll(nodes => nodes.map(node => ({
    label: node.querySelector('.pass-clause-label').textContent.trim(),
    text: node.querySelector('.pass-clause-text').textContent.trim(),
  })));
  expect(clauses).toEqual([
    { label: '入場', text: '常設展入場' },
    { label: '割引', text: '特別展：一般料金の20%引' },
  ]);

  // ¥800 exists once, in the reference layer, naming the scope it came from.
  const reference = await section.locator('.pass-reference').innerText();
  expect(reference.replace(/\s+/g, ' ')).toBe('参考価値 ¥800 常設展の一般料金を基準');
  const clauseText = clauses.map(clause => clause.text).join(' ');
  expect(clauseText).not.toContain('800');
  // The special-exhibition figures never reach facility level.
  const passText = await section.innerText();
  expect(passText).not.toContain('1,600');
  expect(passText).not.toContain('320');
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});
