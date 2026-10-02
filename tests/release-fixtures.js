const { expect } = require('@playwright/test');

const LANGUAGES = ['ja', 'en', 'zh'];
const TARGET_DATE = '2026-08-12';
const TARGET_TIME = '10:00';
const EMPTY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

async function installReleaseGuards(page) {
  if (page.__releaseGuardsInstalled) return;
  page.__releaseGuardsInstalled = true;
  page.__releaseErrors = [];

  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.__releaseUnhandledRejections = [];
    window.addEventListener('unhandledrejection', event => {
      const reason = event.reason;
      window.__releaseUnhandledRejections.push(String(reason?.stack || reason || 'unhandled rejection'));
    });
  });

  page.on('pageerror', error => {
    page.__releaseErrors.push(`pageerror: ${error.message}`);
  });
  page.on('console', message => {
    if (message.type() === 'error') page.__releaseErrors.push(`console.error: ${message.text()}`);
  });
  // The map must render without depending on OpenStreetMap availability. A
  // valid transparent tile keeps Chromium quiet while testing our map DOM and
  // selection behavior rather than a third party network request.
  await page.route('https://*.tile.openstreetmap.org/**', route => route.fulfill({
    status: 200,
    contentType: 'image/png',
    body: EMPTY_PNG,
  }));
}

async function clickInputLabel(page, selector) {
  const label = page.locator(selector).locator('xpath=ancestor::label');
  await expect(label).toBeVisible();
  await label.scrollIntoViewIfNeeded();
  // The application toolbar is sticky. Keep a card control below it before
  // clicking so the test exercises the real label hit area, not a forced click
  // through a fixed header.
  await label.evaluate(element => {
    const sticky = document.querySelector('.controls-wrap');
    const stickyHeight = sticky?.getBoundingClientRect().height || 0;
    const rect = element.getBoundingClientRect();
    const safeTop = stickyHeight + 12;
    if (rect.top < safeTop || rect.bottom > window.innerHeight) {
      window.scrollTo(0, Math.max(0, window.scrollY + rect.top - safeTop));
    }
  });
  await label.click();
}

// Phone widths keep the native date and time fields inside the Date & time
// editor, so setup uses the same route a person does instead of reaching into
// controls the browse state deliberately does not show.
async function setDateTime(page, date = TARGET_DATE, time = TARGET_TIME) {
  const summary = page.locator('#dateTimeSummary');
  const usesEditor = await summary.isVisible();
  if (usesEditor) {
    await summary.click();
    await expect(page.locator('#dateTimePanel')).toHaveClass(/open/);
  }
  const dateInput = page.locator('#targetDate');
  const timeInput = page.locator('#targetTime');
  await expect(dateInput).toBeVisible();
  await dateInput.fill(date);
  await dateInput.dispatchEvent('change');
  await timeInput.fill(time);
  await timeInput.dispatchEvent('change');
  await expect(dateInput).toHaveValue(date);
  await expect(timeInput).toHaveValue(time);
  if (usesEditor) {
    await page.locator('#dateTimeDoneButton').click();
    await expect(page.locator('#dateTimePanel')).not.toHaveClass(/open/);
  }
}

async function preparePage(page, language = 'ja', options = {}) {
  await installReleaseGuards(page);
  await page.goto(`/index.html?lang=${language}`, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  await expect(page.locator('#mainContent')).toBeVisible();
  if (!options.skipDateTime) {
    await setDateTime(page, options.date || TARGET_DATE, options.time ?? TARGET_TIME);
  }
}

async function setLanguage(page, language) {
  await page.locator(`.hero .language-switch [data-lang="${language}"]`).click();
  await expect(page.locator(`.hero .language-switch [data-lang="${language}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
}

async function primaryCardName(card) {
  return card.locator('.card-title-button').evaluate(button => {
    const text = [...button.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent || '')
      .join(' ')
      .trim();
    return text || button.textContent.trim();
  });
}

async function openDrawer(page, key = '52') {
  const trigger = page.locator(`#card-${key} .card-title-button`);
  await expect(trigger).toBeVisible();
  await trigger.evaluate(element => {
    // The application uses smooth document scrolling for real navigation.
    // Release setup needs a settled target before Playwright checks pointer
    // stability, otherwise a sticky toolbar can keep the target moving.
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
    root.style.scrollBehavior = previousScrollBehavior;
  });
  await trigger.click();
  const drawer = page.locator('#facilityDrawer');
  await expect(drawer).toBeVisible();
  await expect(page.locator('#facilityDrawer .facility-drawer-panel')).toBeVisible();
  return { drawer, trigger };
}

async function closeDrawer(page, { escape = false } = {}) {
  if (escape) await page.keyboard.press('Escape');
  else await page.locator('#facilityDrawerClose').click();
  await expect(page.locator('#facilityDrawer')).toBeHidden();
}

async function visibleCardCount(page) {
  return page.locator('#mainContent .card').evaluateAll(cards => cards.filter(card => (
    getComputedStyle(card).display !== 'none' && card.getClientRects().length > 0
  )).length);
}

async function assertNoHorizontalOverflow(page, tolerance = 2) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + tolerance);
  expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + tolerance);
  return dimensions;
}

async function assertNoBrowserErrors(page) {
  const unhandled = await page.evaluate(() => window.__releaseUnhandledRejections || []);
  expect([...page.__releaseErrors, ...unhandled]).toEqual([]);
}

async function assertNoLeakedValues(page) {
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toContain('[object Object]');
  expect(bodyText).not.toMatch(/(?:^|\s)(?:undefined|null|NaN)(?:$|\s)/);
}

module.exports = {
  LANGUAGES,
  TARGET_DATE,
  TARGET_TIME,
  assertNoBrowserErrors,
  assertNoHorizontalOverflow,
  assertNoLeakedValues,
  clickInputLabel,
  closeDrawer,
  openDrawer,
  preparePage,
  primaryCardName,
  setDateTime,
  setLanguage,
  visibleCardCount,
};
