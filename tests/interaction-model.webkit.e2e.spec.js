const { test, expect } = require('@playwright/test');
const { assertNoBrowserErrors, closeDrawer, preparePage } = require('./release-fixtures');

test.setTimeout(120_000);

test('WebKit mobile Map answers a marker tap in the same viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await expect.poll(() => page.locator('.map-marker-icon, .map-cluster-icon').count()).toBeGreaterThan(0);
  await expect.poll(async () => {
    const first = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(150);
    return first === await page.evaluate(() => window.scrollY);
  }, { timeout: 10_000 }).toBe(true);
  await expect(page.locator('#mapSelectionHint')).toBeVisible();
  await expect(page.locator('#mapFacilityPanel')).toBeHidden();

  const canvas = await page.locator('#mapCanvas').boundingBox();
  const markers = page.locator('.map-marker-icon');
  let target = null;
  for (let index = 0; index < await markers.count(); index += 1) {
    const box = await markers.nth(index).boundingBox();
    if (box && box.x >= canvas.x && box.x + box.width <= canvas.x + canvas.width
      && box.y >= canvas.y && box.y + box.height <= canvas.y + canvas.height) {
      target = box;
      break;
    }
  }
  expect(target).not.toBeNull();

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();

  const geometry = await page.evaluate(() => {
    const rect = document.getElementById('mapSelectionPreview').getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, scrollY: window.scrollY, viewport: window.innerHeight };
  });
  expect(geometry.scrollY).toBe(scrollBefore);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport);

  await page.locator('#mapSelectionPreview').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await closeDrawer(page);
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();
  await assertNoBrowserErrors(page);
});
