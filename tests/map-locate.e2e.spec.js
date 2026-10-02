const { test, expect } = require('@playwright/test');

// Tokyo Station, inside the facility set's bounding box.
test.use({ permissions: ['geolocation'], geolocation: { latitude: 35.681, longitude: 139.767 } });

async function openMap(page) {
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
}

test('Map view reaches location without opening the filter panel', async ({ page }) => {
  await openMap(page);
  const locate = page.locator('#mapLocateBtn');
  await expect(locate).toBeVisible();
  // The filter panel is not involved.
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);

  await locate.click();
  // One shared state: granting here enables the list-view controls too.
  await expect(page.locator('#radiusFilter')).toBeEnabled();
  await expect(page.locator('#sortNearOption')).not.toBeDisabled();
  await expect(locate).toHaveClass(/is-located/);
});

test('the two location entries never disagree', async ({ page }) => {
  await openMap(page);
  await page.locator('#mapLocateBtn').click();
  await expect(page.locator('#mapLocateBtn')).toHaveClass(/is-located/);

  // The filter-panel entry reflects the same grant rather than asking again.
  await page.locator('#listToggleBtn').click();
  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await expect(page.locator('#geoBtn .geo-btn-label')).toHaveText('現在地を更新');
  await expect(page.locator('#radiusFilter')).toBeEnabled();
});

test('a located map re-centres instead of prompting again', async ({ page }) => {
  await openMap(page);
  await page.locator('#mapLocateBtn').click();
  await expect(page.locator('#mapLocateBtn')).toHaveClass(/is-located/);

  // Its accessible name changes from "find me" to "bring me back".
  await expect(page.locator('#mapLocateBtn')).toHaveAttribute('aria-label', '地図を現在地に戻す');
  await page.locator('#mapLocateBtn').click();
  await expect(page.locator('#mapLocateBtn')).toHaveClass(/is-located/);
});

test('the locate control is reachable and labelled across the responsive range', async ({ page }) => {
  await openMap(page);
  for (const width of [320, 375, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('#mapLocateBtn')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `width ${width}`).toBeLessThanOrEqual(2);
  }
});

test('a Map asset failure returns to the usable List experience', async ({ page }) => {
  await page.route('**/vendor/leaflet/**', route => route.abort());
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#listToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#mapView')).toBeHidden();
  await expect(page.locator('#mainContent .card').first()).toBeVisible();
});

const EMPTY_TILE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

// Map dependency behavior is about our own vendored assets, so third-party tile
// availability is kept out of the result.
async function trackMapAssets(page) {
  const requested = [];
  await page.route('https://*.tile.openstreetmap.org/**', route => route.fulfill({
    status: 200,
    contentType: 'image/png',
    body: EMPTY_TILE,
  }));
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/vendor/leaflet')) requested.push(url.split('/').pop());
  });
  return requested;
}

test('Map assets stay off the initial List load and arrive on the first Map request', async ({ page }) => {
  const requested = await trackMapAssets(page);
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  await expect(page.locator('#mainContent .card').first()).toBeVisible();
  expect(requested).toEqual([]);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
  await expect.poll(() => page.locator('.map-cluster-icon, .map-marker-icon').count()).toBeGreaterThan(0);
  expect(requested.sort()).toEqual([
    'MarkerCluster.css',
    'leaflet.css',
    'leaflet.js',
    'leaflet.markercluster.js',
  ]);

  // Leaving and re-entering Map must reuse the already loaded dependencies.
  const afterFirstMap = requested.length;
  await page.locator('#listToggleBtn').click();
  await expect(page.locator('#mapView')).toBeHidden();
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  expect(requested.length).toBe(afterFirstMap);
});

test('a MarkerCluster script failure keeps Map usable with ordinary markers', async ({ page }) => {
  await trackMapAssets(page);
  await page.route('**/leaflet.markercluster.js', route => route.abort());
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#listToggleBtn')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
  await expect.poll(() => page.locator('.map-marker-icon').count()).toBeGreaterThan(1);
  expect(await page.locator('.map-cluster-icon').count()).toBe(0);
});

test('a MarkerCluster stylesheet failure also keeps Map usable with ordinary markers', async ({ page }) => {
  await trackMapAssets(page);
  await page.route('**/MarkerCluster.css', route => route.abort());
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  // The plugin global loaded, but its visual half did not, so the enhancement
  // must not be used on the strength of the global alone.
  await expect.poll(() => page.locator('.map-marker-icon').count()).toBeGreaterThan(1);
  expect(await page.locator('.map-cluster-icon').count()).toBe(0);
});
