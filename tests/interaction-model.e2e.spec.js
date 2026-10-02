const { test, expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  closeDrawer,
  preparePage,
} = require('./release-fixtures');

test.setTimeout(120_000);

const CARD = '#card-52';

test('the passive Facility Card surface opens the Detail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  const card = page.locator(CARD);
  await card.scrollIntoViewIfNeeded();

  // Passive description / body text is part of the card object.
  const passive = card.locator('.facility-intro-row, .card-body p, .pass-benefit-copy').first();
  await passive.click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await expect(page.locator('#facilityDrawerTitle')).toContainText(/\S/);
  await closeDrawer(page);

  // Whitespace inside the card head is passive too.
  await card.locator('.card-head').click({ position: { x: 4, y: 4 } });
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('the card title opens the Detail exactly once and keeps focus return', async ({ page }) => {
  await preparePage(page, 'ja');
  const title = page.locator(`${CARD} .card-title-button`);
  await title.scrollIntoViewIfNeeded();

  let opened = 0;
  await page.exposeFunction('__countDrawerOpen', () => { opened += 1; });
  await page.evaluate(() => {
    const drawer = document.getElementById('facilityDrawer');
    new MutationObserver(records => {
      for (const record of records) {
        if (record.attributeName === 'hidden' && !drawer.hidden) window.__countDrawerOpen();
      }
    }).observe(drawer, { attributes: true });
  });

  await title.click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  expect(opened).toBe(1);
  await closeDrawer(page);
  await expect(title).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('exhibition, visited and link interactions keep their own ownership', async ({ page }) => {
  await preparePage(page, 'ja');
  const drawer = page.locator('#facilityDrawer');
  const card = page.locator('.card', { has: page.locator('.enriched-item .enriched-title') }).first();
  await card.scrollIntoViewIfNeeded();

  // Passive exhibition metadata belongs to the exhibition, not the card.
  const exhibitionMeta = card.locator('.enriched-item .enriched-meta').first();
  if (await exhibitionMeta.count()) {
    await exhibitionMeta.click();
    await expect(drawer).toBeHidden();
  }
  await card.locator('.enriched-item').first().click({ position: { x: 3, y: 3 } });
  await expect(drawer).toBeHidden();

  // An exhibition link performs only its own action.
  const link = card.locator('.enriched-item a.enriched-title').first();
  if (await link.count()) {
    expect(await link.getAttribute('target')).toBe('_blank');
    await link.click({ modifiers: ['Alt'] });
    await expect(drawer).toBeHidden();
  }

  // Visited toggles state without opening the Detail.
  const visited = page.locator(`${CARD} .visited-toggle`);
  await visited.scrollIntoViewIfNeeded();
  await visited.click();
  await expect(page.locator(`${CARD} .visited-toggle`)).toHaveClass(/is-checked/);
  await expect(drawer).toBeHidden();
  await visited.click();
  await expect(page.locator(`${CARD} .visited-toggle`)).not.toHaveClass(/is-checked/);
  await expect(drawer).toBeHidden();

  await assertNoBrowserErrors(page);
});

test('card action links act alone and the card adds no extra tab stop', async ({ page }) => {
  await preparePage(page, 'ja');
  const card = page.locator(CARD);
  await card.scrollIntoViewIfNeeded();

  // Any link the browse feed actually shows must act alone.
  const visibleLink = page.locator('#mainContent .card a:visible').first();
  await expect(visibleLink).toBeVisible();
  await visibleLink.scrollIntoViewIfNeeded();
  await visibleLink.click({ modifiers: ['Alt'] });
  await expect(page.locator('#facilityDrawer')).toBeHidden();

  const wrapperIsFocusable = await card.evaluate(element => (
    element.hasAttribute('tabindex') || element.hasAttribute('role')
  ));
  expect(wrapperIsFocusable).toBe(false);

  // Keyboard still enters the Detail through the title button.
  await card.locator('.card-title-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await assertNoBrowserErrors(page);
});

// ---------------------------------------------------------------------------
// Map selection surface
// ---------------------------------------------------------------------------

// Entering Map Mode scrolls the map under the sticky toolbar. Wait for that
// entry scroll to settle so later assertions describe the marker tap only.
async function waitForMapSettled(page) {
  await expect.poll(() => page.locator('.leaflet-marker-icon').count()).toBeGreaterThan(0);

  await expect.poll(async () => {
    const first = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(120);
    const second = await page.evaluate(() => window.scrollY);
    return first === second;
  }, { timeout: 10_000 }).toBe(true);
}

async function enterMapMode(page) {
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await waitForMapSettled(page);
}

// Selecting a marker refreshes cluster icons, so DOM order is not a stable
// identity. Capture positions once and tap those points like a person would.
async function facilityMarkerBoxes(page) {
  const markers = page.locator('.map-marker-icon');
  const boxes = [];
  for (let index = 0; index < await markers.count(); index += 1) {
    boxes.push(await markers.nth(index).boundingBox());
  }
  const canvas = await page.locator('#mapCanvas').boundingBox();
  // Only markers a person could actually tap: fully inside the map canvas.
  return boxes.filter(box => box
    && box.x >= canvas.x && box.x + box.width <= canvas.x + canvas.width
    && box.y >= canvas.y && box.y + box.height <= canvas.y + canvas.height);
}

async function ensureFacilityMarkers(page, minimum = 1) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const boxes = await facilityMarkerBoxes(page);
    if (boxes.length >= minimum) return boxes;
    const cluster = page.locator('.map-cluster-icon').first();
    if (!await cluster.count()) break;
    await cluster.click();
    await waitForMapSettled(page);
  }
  return facilityMarkerBoxes(page);
}

async function clickMarkerBox(page, box) {
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();
  return page.locator('#mapSelectionPreview').getAttribute('data-facility-key');
}

async function clickMarker(page, index = 0) {
  const boxes = await ensureFacilityMarkers(page, index + 1);
  expect(boxes.length).toBeGreaterThan(index);
  return clickMarkerBox(page, boxes[index]);
}

async function previewGeometry(page) {
  return page.evaluate(() => {
    const preview = document.getElementById('mapSelectionPreview');
    const canvas = document.getElementById('mapCanvas');
    const rect = preview.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const attribution = document.querySelector('.leaflet-control-attribution')?.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      top: rect.top,
      bottom: rect.bottom,
      canvasHeight: canvasRect.height,
      attributionTop: attribution ? attribution.top : null,
      panelDisplay: getComputedStyle(document.getElementById('mapFacilityPanel')).display,
      key: preview.dataset.facilityKey,
      name: document.getElementById('mapSelectionName').textContent,
      count: document.querySelectorAll('.map-selection-preview').length,
    };
  });
}

test('a mobile marker tap answers with a preview inside the same viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await enterMapMode(page);
  await expect(page.locator('#mapSelectionHint')).toBeVisible();

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await clickMarker(page);
  const geometry = await previewGeometry(page);

  // Selection feedback is where the user acted: no page jump, no scrolling to
  // find a Detail below the map.
  expect(geometry.scrollY).toBe(scrollBefore);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.panelDisplay).toBe('none');
  expect(geometry.name.trim()).not.toBe('');
  expect(geometry.count).toBe(1);
  // The floating preview leaves the map's own attribution readable.
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.attributionTop + 0.5);
  // The map is the primary canvas.
  expect(geometry.canvasHeight).toBeGreaterThan(geometry.viewportHeight * 0.55);
  await expect(page.locator('#mapSelectionHint')).toBeHidden();
  await assertNoBrowserErrors(page);
});

test('marker A then marker B replaces the selection instead of appending', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await enterMapMode(page);

  const boxes = await ensureFacilityMarkers(page, 2);
  expect(boxes.length).toBeGreaterThan(1);
  const first = await clickMarkerBox(page, boxes[0]);
  const firstName = await page.locator('#mapSelectionName').textContent();
  const second = await clickMarkerBox(page, boxes[1]);
  const secondName = await page.locator('#mapSelectionName').textContent();

  expect(second).not.toBe(first);
  expect(secondName).not.toBe(firstName);
  expect(await page.locator('.map-selection-preview').count()).toBe(1);
  expect(await page.locator('.map-marker--selected').count()).toBe(1);
  await assertNoBrowserErrors(page);
});

test('the preview opens the existing Drawer and the selection survives closing it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await enterMapMode(page);
  const key = await clickMarker(page);
  const name = await page.locator('#mapSelectionName').textContent();

  await page.locator('#mapSelectionPreview').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await expect(page.locator('#facilityDrawerTitle')).toContainText(name.trim());
  // One full Detail renderer: the Drawer, not a map-only copy.
  expect(await page.locator('#facilityDrawerBody .facility-detail-section').count()).toBeGreaterThan(0);

  await closeDrawer(page);
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();
  await expect(page.locator('#mapSelectionPreview')).toHaveAttribute('data-facility-key', key);
  await expect(page.locator('#mapSelectionPreview')).toBeFocused();
  expect(await page.locator('.map-marker--selected').count()).toBe(1);
  await assertNoBrowserErrors(page);
});

test('List to Drawer to View on map lands on a selected facility with its preview', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await page.locator(`${CARD} .card-title-button`).scrollIntoViewIfNeeded();
  await page.locator(`${CARD} .card-title-button`).click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();

  await page.locator('#facilityDrawerBody [data-map-focus]').first().click();
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(page.locator('#mapView')).toBeVisible();
  await waitForMapSettled(page);
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();
  await expect(page.locator('#mapSelectionPreview')).toHaveAttribute('data-facility-key', '52');

  const geometry = await previewGeometry(page);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  await assertNoBrowserErrors(page);
});

test('filtering out the selected facility leaves no stale preview', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');
  await enterMapMode(page);
  await clickMarker(page);
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();

  // The scrolled toolbar is compact here; reopen Search the way a person does.
  if (!await page.locator('#searchInput').isVisible()) {
    await page.locator('#compactControlsTrigger').click();
  }
  await page.locator('#searchInput').fill('東京国立博物館');
  await expect.poll(async () => (await page.locator('#mapSelectionPreview').isVisible()) ? 'visible' : 'hidden')
    .toBe('hidden');
  await expect(page.locator('#mapSelectionHint')).toBeVisible();
  expect(await page.locator('#mapSelectionName').textContent()).toBe('');
  await assertNoBrowserErrors(page);
});

test('the map selection surface follows the width: preview below 1200, split panel above', async ({ page }) => {
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await preparePage(page, 'ja');
    await enterMapMode(page);
    await clickMarker(page);
    const geometry = await previewGeometry(page);
    expect(geometry.panelDisplay).toBe('none');
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  }

  for (const width of [1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await preparePage(page, 'ja');
    await enterMapMode(page);
    const boxes = await ensureFacilityMarkers(page, 1);
    expect(boxes.length).toBeGreaterThan(0);
    const box = boxes[0];
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator('#mapFacilityDetail')).toBeVisible();
    await expect(page.locator('#mapFacilityTitle')).toContainText(/\S/);
    // Desktop keeps one selection surface; the compact preview stays away.
    await expect(page.locator('#mapSelectionPreview')).toBeHidden();
    await expect(page.locator('#mapSelectionHint')).toBeHidden();
  }
  await assertNoBrowserErrors(page);
});
