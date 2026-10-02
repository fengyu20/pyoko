const { test, expect } = require('@playwright/test');
const {
  CHROMIUM_LAYOUT_CASES,
  LIVE_CLOCK,
  MOBILE_LANGUAGES,
  assertCompactToolbarRow,
  assertMobileBrowseComposition,
  assertNoBrowserErrors,
  closeDateTimeEditor,
  measureDiscoveryControls,
  openDateTimeEditor,
} = require('./mobile-controls-fixtures');
const { preparePage, assertNoHorizontalOverflow } = require('./release-fixtures');

test.setTimeout(120_000);

test('mobile browse controls stay a search surface across locales and widths', async ({ page }) => {
  for (const { language, width } of CHROMIUM_LAYOUT_CASES) {
    await assertMobileBrowseComposition(page, language, width);
  }
  await assertNoBrowserErrors(page);
});

test('quick filters own a full-width row that view controls cannot clip', async ({ page }) => {
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await preparePage(page, 'ja', { skipDateTime: true });
    const geometry = await measureDiscoveryControls(page);
    for (const item of geometry.quickItems) {
      // Every shortcut sits below the action controls and inside the scroller.
      expect(item.top).toBeGreaterThanOrEqual(geometry.viewSwitch.bottom - 0.5);
      expect(item.left).toBeGreaterThanOrEqual(geometry.quick.left - 0.5);
      expect(item.width).toBeGreaterThan(24);
    }
    const reachable = await page.evaluate(() => {
      const scroller = document.querySelector('.quick-filters');
      const last = document.querySelector('.quick-filter-toggle:last-child');
      scroller.scrollLeft = scroller.scrollWidth;
      return last.getBoundingClientRect().right <= scroller.getBoundingClientRect().right + 1;
    });
    expect(reachable).toBe(true);
    await assertNoHorizontalOverflow(page);
  }
  await assertNoBrowserErrors(page);
});

test('scrolled mobile controls become one compact toolbar row of direct actions', async ({ page }) => {
  for (const language of MOBILE_LANGUAGES) {
    await preparePage(page, language.code, { skipDateTime: true });
    await assertCompactToolbarRow(page, language, 390);
  }
  await assertNoBrowserErrors(page);
});

test('compact controls open the Date & time editor and Filter sheet directly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);

  await openDateTimeEditor(page);
  // The editor must not restore the full discovery controls first.
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);
  await closeDateTimeEditor(page);
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);

  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);
  await assertNoBrowserErrors(page);
});

test('reopened Search collapses again on every later downward browse', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'en', { skipDateTime: true });
  const controls = page.locator('.controls-wrap');
  await expect(controls).not.toHaveClass(/is-compact/);

  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(controls).toHaveClass(/is-compact/);

  // Two full cycles: the fix must not work only for the first manual expansion.
  for (const start of [900, 1200]) {
    await page.evaluate(y => window.scrollTo(0, y), start);
    await page.locator('#compactControlsTrigger').click();
    await expect(controls).not.toHaveClass(/is-compact/);
    await expect(page.locator('#searchInput')).toBeFocused();
    await page.locator('#searchInput').evaluate(element => element.blur());

    // Restoring the toolbar grows the sticky header, and the browser may adjust
    // the scroll position for it. That adjustment is not user browsing.
    const anchor = await page.evaluate(() => window.scrollY);
    await page.evaluate(y => window.scrollTo(0, y + 24), anchor);
    await expect(controls).not.toHaveClass(/is-compact/);

    await page.evaluate(y => window.scrollTo(0, y + 160), anchor);
    await expect(controls).toHaveClass(/is-compact/);
  }
  await assertNoHorizontalOverflow(page);
  await assertNoBrowserErrors(page);
});

test('scrolling upward never reopens the large toolbar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });
  const controls = page.locator('.controls-wrap');
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(controls).toHaveClass(/is-compact/);

  for (const y of [700, 400, 120, 0]) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await expect(controls).toHaveClass(/is-compact/);
  }
  await assertNoBrowserErrors(page);
});

test('discovery controls do not collapse while the user is editing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });
  const controls = page.locator('.controls-wrap');

  await page.locator('#searchInput').focus();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(controls).not.toHaveClass(/is-compact/);
  await page.locator('#searchInput').evaluate(element => element.blur());
  await page.evaluate(() => window.scrollTo(0, 901));
  await expect(controls).toHaveClass(/is-compact/);

  await page.locator('#compactControlsTrigger').click();
  await page.locator('#searchInput').evaluate(element => element.blur());
  await openDateTimeEditor(page);
  await page.evaluate(() => window.scrollTo(0, 2400));
  await expect(controls).not.toHaveClass(/is-compact/);
  await closeDateTimeEditor(page);
  await page.evaluate(() => window.scrollTo(0, 2500));
  await expect(controls).toHaveClass(/is-compact/);
  await assertNoBrowserErrors(page);
});

test('the mobile date and time condition reads as one localized summary', async ({ page }) => {
  await page.clock.install({ time: LIVE_CLOCK });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const language of MOBILE_LANGUAGES) {
    await preparePage(page, language.code, { skipDateTime: true });
    await expect(page.locator('#dateTimeSummaryValue')).toHaveText(language.condition);
    await expect(page.locator('#targetDate')).toHaveValue('2026-08-13');
    await expect(page.locator('#targetTime')).toHaveValue('17:53');
  }
  await assertNoBrowserErrors(page);
});

test('a target date outside the current Tokyo year shows the year', async ({ page }) => {
  await page.clock.install({ time: LIVE_CLOCK });
  await page.setViewportSize({ width: 390, height: 844 });
  const expected = { ja: '2027/3/31 · 09:30', en: 'Mar 31, 2027 · 09:30', zh: '2027/3/31 · 09:30' };
  for (const language of MOBILE_LANGUAGES) {
    await preparePage(page, language.code, { date: '2027-03-31', time: '09:30' });
    await expect(page.locator('#dateTimeSummaryValue')).toHaveText(expected[language.code]);
  }
  await assertNoBrowserErrors(page);
});

test('the Date & time editor owns the native fields and the return-to-now action', async ({ page }) => {
  await page.clock.install({ time: LIVE_CLOCK });
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  await expect(page.locator('#targetTimeNow')).toBeHidden();
  expect(await page.evaluate(() => window.isLiveTimeMode())).toBe(true);

  await openDateTimeEditor(page);
  await expect(page.locator('#dateTimePanelTitle')).toHaveText('日付と時刻');
  await expect(page.locator('#dateTimeDoneButton')).toHaveText('完了');
  await expect(page.locator('#dateTimePanel')).toHaveAttribute('role', 'dialog');
  // Live mode is already "now", so the recovery action stays hidden.
  await expect(page.locator('#targetTimeNow')).toBeHidden();

  await page.locator('#targetTime').fill('16:00');
  await page.locator('#targetTime').dispatchEvent('change');
  expect(await page.evaluate(() => window.isLiveTimeMode())).toBe(false);
  await expect(page.locator('#targetTimeNow')).toBeVisible();
  await expect(page.locator('#targetTimeNow')).toHaveText('現在に戻す');
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 16:00');
  await expect(page.locator('#timeReferenceChip')).toBeVisible();

  await page.locator('#targetTimeNow').click();
  expect(await page.evaluate(() => window.isLiveTimeMode())).toBe(true);
  await expect(page.locator('#targetTimeNow')).toBeHidden();
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 17:53');

  await closeDateTimeEditor(page);
  await expect(page.locator('#dateTimeSummary')).toBeFocused();
  await expect(page.locator('#targetDate')).toBeHidden();
  await expect(page.locator('#targetTime')).toBeHidden();
  await assertNoBrowserErrors(page);
});

test('live mode advances the summary by the minute and custom time stays put', async ({ page }) => {
  await page.clock.install({ time: LIVE_CLOCK });
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 17:53');

  await page.clock.fastForward(60_000);
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 17:54');
  await expect(page.locator('#targetTime')).toHaveValue('17:54');

  await openDateTimeEditor(page);
  await page.locator('#targetTime').fill('16:00');
  await page.locator('#targetTime').dispatchEvent('change');
  await closeDateTimeEditor(page);
  await page.clock.fastForward(120_000);
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 16:00');
  await expect(page.locator('#targetTime')).toHaveValue('16:00');
  await assertNoBrowserErrors(page);
});

test('live mode rolls the date, inputs and summary across midnight', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-13T14:59:00.000Z') });
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/13 · 23:59');

  await page.clock.fastForward(60_000);
  await expect(page.locator('#targetDate')).toHaveValue('2026-08-14');
  await expect(page.locator('#targetTime')).toHaveValue('00:00');
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('8/14 · 00:00');
  expect(await page.evaluate(() => window.isLiveTimeMode())).toBe(true);
  await assertNoBrowserErrors(page);
});

test('desktop keeps the inline date and time controls and shares one state', async ({ page }) => {
  await page.clock.install({ time: LIVE_CLOCK });
  await page.setViewportSize({ width: 1280, height: 900 });
  await preparePage(page, 'en', { skipDateTime: true });

  await expect(page.locator('#targetDate')).toBeVisible();
  await expect(page.locator('#targetTime')).toBeVisible();
  await expect(page.locator('#dateTimeSummary')).toBeHidden();
  await expect(page.locator('#dateTimePanel')).toHaveAttribute('role', 'group');
  await expect(page.locator('#listToggleBtn .view-tab-label')).toBeVisible();
  await expect(page.locator('#listToggleBtn .view-tab-label')).toHaveText('List');

  await page.locator('#targetTime').fill('16:00');
  await page.locator('#targetTime').dispatchEvent('change');
  expect(await page.evaluate(() => window.isLiveTimeMode())).toBe(false);
  await expect(page.locator('#targetTimeNow')).toBeVisible();

  // The same state drives the phone summary after a viewport change.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#dateTimeSummary')).toBeVisible();
  await expect(page.locator('#dateTimeSummaryValue')).toHaveText('Aug 13 · 16:00');
  await expect(page.locator('#targetDate')).toBeHidden();
  await assertNoBrowserErrors(page);
});
