const { test, expect } = require('@playwright/test');
const {
  assertNoHorizontalOverflow,
  clickInputLabel,
  setDateTime,
  visibleCardCount,
} = require('./release-fixtures');

// Persistence has to be observed across a real reload, so these specs open the
// page directly instead of through `preparePage`: the shared release guards
// install an init script that clears localStorage on EVERY navigation, which
// would wipe the state under test. Playwright gives each test a fresh context,
// so storage already starts empty.
async function openApp(page) {
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
}

async function reload(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
}

async function openFilters(page) {
  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
}

const nowOpenChip = '.quick-filter-toggle[data-quick-filter-name="statusFilter"] [data-nowopen-label]';

test('preference-like filters survive a reload', async ({ page }) => {
  await openApp(page);
  await openFilters(page);
  await clickInputLabel(page, 'input[name="passFilter"][value="admission"]');
  await page.locator('#valueFilter').selectOption('500');
  await page.locator('#sortMode').selectOption('benefit');
  await clickInputLabel(page, '#onlyEnriched');
  const before = await visibleCardCount(page);

  await reload(page);

  await expect(page.locator('input[name="passFilter"][value="admission"]')).toBeChecked();
  await expect(page.locator('#valueFilter')).toHaveValue('500');
  await expect(page.locator('#sortMode')).toHaveValue('benefit');
  await expect(page.locator('#onlyEnriched')).toBeChecked();
  await expect.poll(() => visibleCardCount(page)).toBe(before);
});

test('search text, geo radius and date/time are deliberately not restored', async ({ page }) => {
  await openApp(page);
  await page.locator('#searchInput').fill('美術館');
  await setDateTime(page, '2026-08-20', '19:00');
  await expect(page.locator('#timeReferenceChip')).toBeVisible();

  await reload(page);

  // A one-off search intent must not come back as a permanent condition.
  await expect(page.locator('#searchInput')).toHaveValue('');
  // Radius depends on a geolocation grant a reload does not carry over.
  await expect(page.locator('#radiusFilter')).toHaveValue('0');
  // Live mode is the designed default; a stale date would misreport today.
  await expect(page.locator('#timeReferenceChip')).toBeHidden();
});

test('a restored filter state is announced on screen and clearable in one click', async ({ page }) => {
  await openApp(page);
  await openFilters(page);
  await clickInputLabel(page, 'input[name="statusFilter"][value="closed"]');

  await reload(page);

  // The restored state is never silent: this is what makes persistence safe.
  await expect(page.locator('#resultsSummary')).toBeVisible();
  await expect(page.locator('#clearFiltersButton')).toBeVisible();

  await page.locator('#clearFiltersButton').click();
  await expect(page.locator('input[name="statusFilter"][value="all"]')).toBeChecked();

  // Clearing is itself persisted — the old condition must not return.
  await reload(page);
  await expect(page.locator('input[name="statusFilter"][value="all"]')).toBeChecked();
  await expect(page.locator('#clearFiltersButton')).toBeHidden();
});

test('an option that no longer exists falls back to the shipped default', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => {
    localStorage.setItem(window.filterStorageKey(), JSON.stringify({
      radios: { statusFilter: 'retired-value', passFilter: 'admission', visitedFilter: 'all' },
      selects: { valueFilter: '99999', sortMode: 'near' },
      onlyEnriched: 'not-a-boolean',
    }));
  });
  await reload(page);

  await expect(page.locator('input[name="statusFilter"][value="all"]')).toBeChecked();
  await expect(page.locator('#valueFilter')).toHaveValue('0');
  // 近い順 stays disabled until a location is granted, so it must not be restored.
  await expect(page.locator('#sortMode')).toHaveValue('number');
  await expect(page.locator('#onlyEnriched')).not.toBeChecked();
  // The one valid value still applies.
  await expect(page.locator('input[name="passFilter"][value="admission"]')).toBeChecked();
});

test('personal state is a single control, so visited and want cannot be combined', async ({ page }) => {
  await openApp(page);
  await openFilters(page);
  const values = await page.locator('input[name="visitedFilter"]').evaluateAll(inputs => inputs.map(input => input.value));
  expect(values).toEqual(['all', 'unvisited', 'want', 'visited']);
  // There is no second control over the same dimension to combine it with.
  await expect(page.locator('#onlyWantToGo')).toHaveCount(0);
});

test('行きたいのみ filters to the saved collection and releases a facility once visited', async ({ page }) => {
  await openApp(page);
  await page.locator('#card-2 .card-wanttoggle').click();
  await page.locator('#card-3 .card-wanttoggle').click();

  await openFilters(page);
  await clickInputLabel(page, 'input[name="visitedFilter"][value="want"]');
  await expect.poll(() => visibleCardCount(page)).toBe(2);

  // Recording a visit clears Want to Go, so the card leaves this view — the
  // same invariant that makes 訪問済み + 行きたい unrepresentable.
  await clickInputLabel(page, '#card-2 [data-visited-toggle]');
  await expect.poll(() => visibleCardCount(page)).toBe(1);
});

test('the open-now filter renames itself when a date and time are chosen', async ({ page }) => {
  await openApp(page);
  await expect(page.locator(nowOpenChip)).toHaveText('いま開館中');

  await setDateTime(page, '2026-08-20', '19:00');
  await expect(page.locator(nowOpenChip)).toHaveText('その時間に開館');

  await openFilters(page);
  await page.locator('#statusInfoButton').click();
  const info = page.locator('#statusInfoPopover [data-nowopen-info]');
  await expect(info).toBeVisible();
  await expect(info).toContainText('選択した日時');
  await expect(info).not.toContainText('今日現在');
});

test('returning to the current time restores the live wording', async ({ page }) => {
  await openApp(page);
  await setDateTime(page, '2026-08-20', '19:00');
  await expect(page.locator(nowOpenChip)).toHaveText('その時間に開館');

  const summary = page.locator('#dateTimeSummary');
  if (await summary.isVisible()) {
    await summary.click();
    await expect(page.locator('#dateTimePanel')).toHaveClass(/open/);
  }
  await page.locator('#targetTimeNow').click();
  await expect(page.locator(nowOpenChip)).toHaveText('いま開館中');
});

test('the selected-time wording survives a language switch', async ({ page }) => {
  await openApp(page);
  await setDateTime(page, '2026-08-20', '19:00');
  await page.locator('.hero .language-switch [data-lang="en"]').click();
  await expect(page.locator('.hero .language-switch [data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
  // The variant that is showing must be re-translated, not the shipped default.
  await expect(page.locator(nowOpenChip)).toHaveText('Open at that time');
});

test('the four-option personal-state group fits the responsive range', async ({ page }) => {
  await openApp(page);
  // A fourth radio joined an existing row; the panel must still not overflow.
  for (const width of [320, 375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openFilters(page);
    await expect(page.locator('input[name="visitedFilter"][value="want"]')).toHaveCount(1);
    await assertNoHorizontalOverflow(page);
    // At phone widths the panel is a bottom sheet covering its own trigger, and
    // it is dismissed by its own footer action instead.
    const apply = page.locator('#filtersApplyButton');
    if (await apply.isVisible()) await apply.click();
    else await page.locator('#filterToggleBtn').click();
    await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);
  }
});

test('choosing a time offers the filter and never applies it by itself', async ({ page }) => {
  await openApp(page);
  const before = await visibleCardCount(page);
  const offer = page.locator('#openAtTimeSuggestion');
  await expect(offer).toBeHidden();

  await setDateTime(page, '2026-08-20', '19:00');

  // The result set is untouched — only an offer appeared.
  await expect(offer).toBeVisible();
  await expect(page.locator('#openAtTimeApply')).toContainText('19:00');
  await expect(page.locator('input[name="statusFilter"][value="all"]')).toBeChecked();
  expect(await visibleCardCount(page)).toBe(before);

  await page.locator('#openAtTimeApply').click();
  await expect(page.locator('input[name="statusFilter"][value="nowopen"]')).toBeChecked();
  // Once the filter is on, the offer has nothing left to offer.
  await expect(offer).toBeHidden();
  await expect.poll(() => visibleCardCount(page)).toBeLessThan(before);
});

test('dismissing the offer keeps it away for the rest of the session', async ({ page }) => {
  await openApp(page);
  await setDateTime(page, '2026-08-20', '19:00');
  await expect(page.locator('#openAtTimeSuggestion')).toBeVisible();

  await page.locator('#openAtTimeDismiss').click();
  await expect(page.locator('#openAtTimeSuggestion')).toBeHidden();

  // A further time change must not re-ask.
  await setDateTime(page, '2026-08-21', '11:00');
  await expect(page.locator('#openAtTimeSuggestion')).toBeHidden();
  await expect(page.locator('input[name="statusFilter"][value="all"]')).toBeChecked();
});

test('returning to live time withdraws the offer', async ({ page }) => {
  await openApp(page);
  await setDateTime(page, '2026-08-20', '19:00');
  await expect(page.locator('#openAtTimeSuggestion')).toBeVisible();

  const summary = page.locator('#dateTimeSummary');
  if (await summary.isVisible()) {
    await summary.click();
    await expect(page.locator('#dateTimePanel')).toHaveClass(/open/);
  }
  await page.locator('#targetTimeNow').click();
  await expect(page.locator('#openAtTimeSuggestion')).toBeHidden();
});
