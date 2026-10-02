const { test } = require('@playwright/test');
const { expect } = require('@playwright/test');
const {
  MOBILE_LANGUAGES,
  MOBILE_LAYOUT_CASES,
  assertCompactToolbarRow,
  assertMobileBrowseComposition,
  assertNoBrowserErrors,
  closeDateTimeEditor,
  openDateTimeEditor,
} = require('./mobile-controls-fixtures');
const { preparePage } = require('./release-fixtures');

test.setTimeout(150_000);

test('WebKit mobile browse controls keep the new discovery composition', async ({ page }) => {
  for (const { language, width } of MOBILE_LAYOUT_CASES) {
    await assertMobileBrowseComposition(page, language, width);
  }
  await assertNoBrowserErrors(page);
});

test('WebKit compact toolbar stays one row and the Date & time sheet opens over it', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await assertCompactToolbarRow(page, MOBILE_LANGUAGES[0], 390);
  await openDateTimeEditor(page);
  await expect(page.locator('#targetTimeNow')).toBeHidden();
  await closeDateTimeEditor(page);
  await assertNoBrowserErrors(page);
});
