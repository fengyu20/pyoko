// RC1.1 real-device fix regressions. These cover the release-facing defects the
// automated RC1 gate did not: body scroll-lock leaks, Drawer scroll-session
// semantics, inline status help, meaningless-note suppression, and the compact
// Filter / List-Map distinction.
const { test, expect } = require('@playwright/test');
const { preparePage, openDrawer, closeDrawer, assertNoBrowserErrors } = require('./release-fixtures');

test.setTimeout(120_000);

const scrollLockState = page => page.evaluate(() => ({
  locked: document.body.classList.contains('scroll-locked'),
  myPass: document.body.classList.contains('my-pass-open'),
  drawer: document.body.classList.contains('drawer-open'),
  filters: document.body.classList.contains('filters-open'),
  datetime: document.body.classList.contains('datetime-open'),
}));

async function expectUnlocked(page) {
  const state = await scrollLockState(page);
  expect(state.locked).toBe(false);
  expect(state.myPass || state.drawer || state.filters || state.datetime).toBe(false);
  // The page remains scrollable near/beyond the Footer.
  const scrollable = await page.evaluate(() => (
    document.documentElement.scrollHeight > document.documentElement.clientHeight
  ));
  expect(scrollable).toBe(true);
}

test('body scroll lock is released after every overlay close sequence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  // 1. Filter → close by Apply.
  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await page.locator('#filtersApplyButton').click();
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);
  await expectUnlocked(page);

  // 2. Filter → close by backdrop (tap the dimmed area above the sheet).
  await page.locator('#filterToggleBtn').click();
  await page.locator('#filtersBackdrop').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);
  await expectUnlocked(page);

  // 3. Date & time → close by Done.
  await page.locator('#dateTimeSummary').click();
  await expect(page.locator('#dateTimePanel')).toHaveClass(/open/);
  await page.locator('#dateTimeDoneButton').click();
  await expect(page.locator('#dateTimePanel')).not.toHaveClass(/open/);
  await expectUnlocked(page);

  // 4. Date & time → close by backdrop (tap the dimmed area above the sheet).
  await page.locator('#dateTimeSummary').click();
  await page.locator('#dateTimeBackdrop').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#dateTimePanel')).not.toHaveClass(/open/);
  await expectUnlocked(page);

  // 5. Facility Drawer → close.
  await openDrawer(page, '52');
  await closeDrawer(page);
  await expectUnlocked(page);

  // 6. My Pass → close.
  await page.locator('#passTrackerChip').click();
  await expect(page.locator('#passTracker')).toBeVisible();
  await page.locator('#passTrackerClose').click();
  await expect(page.locator('#passTracker')).toBeHidden();
  await expectUnlocked(page);

  // 7. My Pass → Drawer: opening a facility while My Pass is open closes My
  // Pass and leaves exactly one lock owner (the drawer).
  await page.locator('#passTrackerChip').click();
  await expect(page.locator('#passTracker')).toBeVisible();
  await page.evaluate(() => openFacilityDetail('52'));
  await expect(page.locator('#passTracker')).toBeHidden();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  let state = await scrollLockState(page);
  expect(state.locked).toBe(true);
  expect(state.myPass).toBe(false);
  expect(state.drawer).toBe(true);
  await closeDrawer(page);
  await expectUnlocked(page);

  // 8. Drawer → My Pass: opening My Pass while the drawer is open closes the
  // drawer and leaves exactly one lock owner (My Pass).
  await openDrawer(page, '52');
  await page.evaluate(() => setPassTrackerOpen(true));
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(page.locator('#passTracker')).toBeVisible();
  state = await scrollLockState(page);
  expect(state.locked).toBe(true);
  expect(state.drawer).toBe(false);
  expect(state.myPass).toBe(true);
  await page.locator('#passTrackerClose').click();
  await expectUnlocked(page);

  await assertNoBrowserErrors(page);
});

test('Facility Drawer distinguishes new sessions from refreshes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  // A: open A → scroll → close → open B → top.
  await openDrawer(page, '52');
  await page.locator('#facilityDrawerBody').evaluate(body => { body.scrollTop = 400; });
  await closeDrawer(page);
  await openDrawer(page, '53');
  expect(await page.locator('#facilityDrawerBody').evaluate(body => body.scrollTop)).toBe(0);
  await closeDrawer(page);

  // B: open A → scroll → close → reopen A → top.
  await openDrawer(page, '52');
  await page.locator('#facilityDrawerBody').evaluate(body => { body.scrollTop = 400; });
  await closeDrawer(page);
  await openDrawer(page, '52');
  expect(await page.locator('#facilityDrawerBody').evaluate(body => body.scrollTop)).toBe(0);
  await closeDrawer(page);

  // C/D: open A → scroll → language change refreshes the same session and keeps
  // the reading position instead of reopening the facility.
  await openDrawer(page, '52');
  await page.locator('#facilityDrawerBody').evaluate(body => { body.scrollTop = 250; });
  await page.evaluate(() => setAppLanguage('en'));
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  const scrollAfterLanguage = await page.locator('#facilityDrawerBody').evaluate(body => body.scrollTop);
  expect(scrollAfterLanguage).toBeGreaterThanOrEqual(240);
  await closeDrawer(page);

  await assertNoBrowserErrors(page);
});

test('status help expands inline inside the filter sheet without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);

  const button = page.locator('#statusInfoButton');
  const help = page.locator('#statusInfoPopover');
  await expect(help).toBeHidden();

  await button.click();
  await expect(help).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');

  // Inline, not a floating popover.
  const position = await help.evaluate(element => getComputedStyle(element).position);
  expect(position).not.toBe('absolute');

  // It lives inside the sheet and does not overflow the viewport horizontally.
  const bounds = await help.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390 + 0.5);

  // Escape collapses it.
  await page.keyboard.press('Escape');
  await expect(help).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');

  // Closing the filter panel also collapses the help.
  await button.click();
  await expect(help).toBeVisible();
  await page.locator('#filtersApplyButton').click();
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);
  await expect(help).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');

  await assertNoBrowserErrors(page);
});

test('meaningless notes are suppressed while genuine conditions still render', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  const noteIcon = '<span class="caution-mark" aria-hidden="true">⚠</span>';
  const placeholder = await page.evaluate(icon => {
    const row = renderVisitInfoRow(icon, 'field.notes', ['その他注意事項'], 'notes', 'https://example.com', ['その他注意事項'], 'visit-info-row--note');
    return { html: row.html, needsOfficialCheck: row.needsOfficialCheck };
  }, noteIcon);
  expect(placeholder.html).toBe('');
  expect(placeholder.needsOfficialCheck).toBe(false);

  const genuine = await page.evaluate(icon => {
    const row = renderVisitInfoRow(icon, 'field.notes', ['※要予約。'], 'notes', 'https://example.com', ['※要予約。'], 'visit-info-row--note');
    return { html: row.html, needsOfficialCheck: row.needsOfficialCheck };
  }, noteIcon);
  expect(genuine.html).toContain('要予約');

  // No.102's real note is a construction closure — a genuine condition that must
  // keep rendering, not a placeholder to hide.
  await openDrawer(page, '102');
  const noteSection = page.locator('#facilityDrawerBody .visit-info-row--note');
  await expect(noteSection).toContainText('設備等改修工事のため10/16(金)まで休館。10/17(土)再開予定。');
  await closeDrawer(page);

  await assertNoBrowserErrors(page);
});

test('compact toolbar distinguishes Filter from the List / Map segmented group', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja', { skipDateTime: true });

  // The Filter control uses a funnel glyph, not the List control's three lines.
  expect(await page.locator('#filterToggleBtn svg path').count()).toBeGreaterThan(0);
  expect(await page.locator('#filterToggleBtn svg line').count()).toBe(0);

  // List / Map read as one segmented group: a shared ring, the active tab filled
  // with the brand green, the inactive tab low-weight.
  const view = await page.evaluate(() => {
    const switcher = document.querySelector('.view-switch');
    const active = document.querySelector('.view-tab.is-active');
    const inactive = document.querySelector('.view-tab:not(.is-active)');
    return {
      boxShadow: getComputedStyle(switcher).boxShadow,
      activeBackground: getComputedStyle(active).backgroundColor,
      inactiveBackground: getComputedStyle(inactive).backgroundColor,
    };
  });
  expect(view.boxShadow).toContain('0px 0px 0px 1px');
  expect(view.activeBackground).toBe('rgb(31, 107, 72)');
  expect(view.inactiveBackground).not.toBe(view.activeBackground);

  await assertNoBrowserErrors(page);
});
