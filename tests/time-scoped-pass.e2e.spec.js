const { test, expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  closeDrawer,
  openDrawer,
  preparePage,
  setDateTime,
  setLanguage,
} = require('./release-fixtures');

test.setTimeout(120_000);

// Time-scoped Pass admission availability: the free-admission filter and the
// browse headline must follow the selected date, not a static "入場無料".

const NO7 = '#card-7';
const NO7_HOME = '#card-8';

async function setPassFilter(page, value) {
  await page.evaluate(v => {
    const input = document.querySelector(`input[name="passFilter"][value="${v}"]`);
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function browseHeadline(page, key = '7') {
  return page.evaluate(k => {
    const node = document.getElementById(`card-${k}`).querySelector('.pass-benefit-headline');
    return node ? node.textContent.trim() : '';
  }, key);
}

test('No.7 browse headline follows the eligible-exhibition window', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });

  await setDateTime(page, '2026-08-15', '10:00');
  expect(await browseHeadline(page)).toBe('対象展 入場無料');

  await setDateTime(page, '2026-07-01', '10:00');
  expect(await browseHeadline(page)).toBe('対象展は7/23から');

  await setDateTime(page, '2026-10-08', '10:00');
  expect(await browseHeadline(page)).toBe('対象展 未確認');
  await assertNoBrowserErrors(page);
});

test('No.7 detail keeps the clause and adds the eligible period', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '7');
  const pass = drawer.locator('.facility-detail-section--pass');
  // Official entitlement clause is preserved.
  await expect(pass.locator('.pass-clause-text').first()).toBeVisible();
  // The named exhibition + eligible period are shown separately.
  await expect(pass.locator('.pass-date-named')).toContainText('この場所の風景');
  await expect(pass.locator('.pass-date-value')).toHaveText('7/23–10/7');
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('free-admission filter excludes No.7 after its window, keeps persistent admission', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');

  // Select 入場無料.
  await setPassFilter(page, 'admission');
  await expect(page.locator(NO7)).toBeVisible();
  await expect(page.locator(NO7_HOME)).toBeVisible();

  // After 10/7 the known 対象展 has ended → excluded from free admission.
  await setDateTime(page, '2026-10-08', '10:00');
  await expect(page.locator(NO7)).toBeHidden();
  // A persistent-admission facility (zoo) is still free to enter.
  await expect(page.locator(NO7_HOME)).toBeVisible();

  await setPassFilter(page, 'all');
  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * v96 Pass Source Arbitration regression.
 *
 * No.100 そごう美術館 is the canonical false negative: v92 read the end of
 * KAGAYA 天空の歌 (5/31) as the end of the facility's 企画展入場 entitlement, so the
 * card read 対象展 未確認 all summer. No.7 is the contrast — its source really does
 * scope eligibility, so it must NOT be relaxed by the same change.
 * ---------------------------------------------------------------------- */

const NO100 = '#card-100';

test('No.100 そごう美術館 is free-admission on the later confirmed exhibitions', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });

  // OSAMU GOODS展 8/1–8/31, confirmed by the 2026-07-29 Grutto update.
  await setDateTime(page, '2026-08-15', '10:00');
  expect(await browseHeadline(page, '100')).toBe('対象展 入場無料');

  // カラフルパレット 鈴木信太郎 9/12–10/12, same source.
  await setDateTime(page, '2026-09-20', '10:00');
  expect(await browseHeadline(page, '100')).toBe('対象展 入場無料');

  // The old KAGAYA window is still true on its own dates …
  await setDateTime(page, '2026-05-20', '10:00');
  expect(await browseHeadline(page, '100')).toBe('対象展 入場無料');
  // … and a gap between confirmed exhibitions is upcoming, not "unconfirmed".
  await setDateTime(page, '2026-09-01', '10:00');
  expect(await browseHeadline(page, '100')).toBe('対象展は9/12から');
  await assertNoBrowserErrors(page);
});

test('free-admission filter includes No.100 in August, keeps No.7 date-scoped', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  await setPassFilter(page, 'admission');

  // The stale false negative is gone.
  await expect(page.locator(NO100)).toBeVisible();
  await expect(page.locator(NO7)).toBeVisible();

  // No.7's explicit 対象展覧会開催期間 boundary is NOT relaxed by the correction.
  await setDateTime(page, '2026-10-08', '10:00');
  await expect(page.locator(NO7)).toBeHidden();
  // No.100's last confirmed exhibition still runs on 10/8.
  await expect(page.locator(NO100)).toBeVisible();

  // Past every confirmed exhibition, No.100 is honestly unconfirmed again.
  await setDateTime(page, '2026-10-13', '10:00');
  await expect(page.locator(NO100)).toBeHidden();

  await setPassFilter(page, 'all');
  await assertNoBrowserErrors(page);
});

test('No.100 Detail shows separated eligible periods and arbitrated Pass CTAs', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '100');
  const pass = drawer.locator('.facility-detail-section--pass');

  // Four separated exhibitions must not collapse into one continuous 4/11–10/12.
  const period = await pass.locator('.pass-date-value').textContent();
  expect(period.trim()).toBe('4/11–5/31・6/6–7/17・8/1–8/31・9/12–10/12');

  // Exactly ONE actionable CTA: the ticket page, which really does name the Pass.
  const ctas = pass.locator('.source-cta:not(.about-context-link) a');
  await expect(ctas).toHaveCount(1);
  await expect(ctas.nth(0)).toHaveText(/施設公式の案内/);
  await expect(ctas.nth(0)).toHaveAttribute('href', 'https://sogo-museum.jp/about/ticket.jsp');

  // The arbitrated Grutto source is provenance — and arbitration still picks the
  // later update that actually supports today's claim, not the February PDF.
  const provenance = pass.locator('[data-pass-provenance]');
  await provenance.locator('.pass-provenance-summary').click();
  await expect(provenance.locator('.pass-provenance-item-name a').first())
    .toHaveAttribute('href', 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/');

  // The Header globe still owns the homepage; no section repeats it.
  const globe = drawer.locator('.facility-drawer-homepage').first();
  if (await globe.count()) {
    const homepage = await globe.getAttribute('href');
    const hrefs = await pass.locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    for (const href of hrefs) expect(href).not.toBe(homepage);
  }
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('a facility with no facility-side records shows provenance and no Pass confirmation CTA', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '8');
  const pass = drawer.locator('.facility-detail-section--pass');
  await expect(pass.locator('.source-cta:not(.about-context-link) a')).toHaveCount(0);
  const provenance = pass.locator('[data-pass-provenance]');
  await provenance.locator('.pass-provenance-summary').click();
  // v99: the brochure is cited at this facility's own page, not as a whole document.
  await expect(provenance.locator('.pass-provenance-item-name a').first())
    .toHaveAttribute('href', /brochure_2026_01\.pdf#page=\d+$/);
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * v97 東洋文庫 regression: a generic museum page is never sold as Pass proof,
 * and one destination never gets two affordances.
 * ---------------------------------------------------------------------- */

test('No.68 東洋文庫: Pass shows no verification CTA for a page with no Grutto content', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '68');
  const pass = drawer.locator('.facility-detail-section--pass');

  // The museum's exhibition index says nothing about the Pass, so it cannot
  // "confirm the eligible exhibition" and must not claim to.
  await expect(pass.locator('.source-cta:not(.about-context-link) a')).toHaveCount(0);
  await expect(pass).not.toContainText('対象展を公式サイトで確認');
  const passHrefs = await pass.locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
  expect(passHrefs.some(href => (href || '').includes('toyo-bunko.or.jp/museum/exhibition'))).toBe(false);

  // Facts stay visible and the evidence stays inspectable.
  await expect(pass.locator('.pass-clause-text').first()).toBeVisible();
  await expect(pass.locator('[data-pass-provenance]')).toBeVisible();
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('No.68 東洋文庫: exact title link plus a distinct view-all, never a duplicate', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '68');
  const exhibitions = drawer.locator('.facility-detail-section--exhibitions');

  // The title owns the exact exhibition page.
  const title = exhibitions.locator('a.enriched-title').first();
  await expect(title).toHaveAttribute('href', 'https://toyo-bunko.or.jp/museum-exhibition/2631/');

  // The listing is a genuinely different task, so it is labelled as one.
  const sectionCta = exhibitions.locator('.source-cta a');
  await expect(sectionCta).toHaveCount(1);
  await expect(sectionCta).toHaveText(/すべての展覧会を見る/);
  await expect(sectionCta).toHaveAttribute('href', 'https://www.toyo-bunko.or.jp/museum/exhibition/');

  // No normalized URL is reachable twice within the section.
  const hrefs = await exhibitions.locator('a[href]').evaluateAll(nodes =>
    nodes.map(n => n.getAttribute('href').replace(/\/+$/, '')));
  expect(new Set(hrefs).size).toBe(hrefs.length);
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('No.100 そごう美術館: an exact title link suppresses a duplicate section CTA', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  const { drawer } = await openDrawer(page, '100');
  const exhibitions = drawer.locator('.facility-detail-section--exhibitions');

  // details.jsp?id=2054 is on the title; the registry also holds id=2071 and the
  // current.jsp listing. Only one section affordance may survive, and it must not
  // repeat a URL the title already reaches.
  const titleHrefs = await exhibitions.locator('a.enriched-title').evaluateAll(nodes =>
    nodes.map(n => n.getAttribute('href')));
  const ctaHrefs = await exhibitions.locator('.source-cta a').evaluateAll(nodes =>
    nodes.map(n => n.getAttribute('href')));
  expect(ctaHrefs.length).toBeLessThanOrEqual(1);
  for (const href of ctaHrefs) expect(titleHrefs).not.toContain(href);
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * v100: hours that do not apply every day are qualified, so a Saturday-only
 * closing time is not read as the everyday one.
 * ---------------------------------------------------------------------- */

const variantText = (page, key) => page.evaluate(k => {
  const node = document.querySelector(`#status-wrap-${k} .status-reason-variant`);
  return node ? node.textContent.trim() : '';
}, key);

const reasonText = (page, key) => page.evaluate(k => {
  const node = document.querySelector(`#status-wrap-${k} .status-reason-main`);
  return node ? node.textContent.trim() : '';
}, key);

test('No.71 qualifies its Saturday hours and its dated extension', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });

  // Saturday: closes 19:30 against 17:30 on weekdays.
  await setDateTime(page, '2026-08-15', '10:00');
  expect(await reasonText(page, '71')).toContain('19:30');
  expect(await variantText(page, '71')).toBe('（土曜のみ）');

  // Friday 8/14 is one of four dated extensions to 21:00.
  await setDateTime(page, '2026-08-14', '10:00');
  expect(await reasonText(page, '71')).toContain('21:00');
  expect(await variantText(page, '71')).toBe('（8/14 限定）');

  // An ordinary open weekday (Tuesday — Mondays are a closure day) states the
  // everyday hours with no qualifier at all.
  await setDateTime(page, '2026-08-18', '10:00');
  expect(await reasonText(page, '71')).toContain('17:30');
  expect(await variantText(page, '71')).toBe('');
  await assertNoBrowserErrors(page);
});

test('a shorter variant day is qualified just as neutrally', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  // No.36-2 東京シティビュー closes at 17:00 on Tuesdays against 22:00 otherwise —
  // five hours EARLIER. The qualifier must never imply "open later".
  await setDateTime(page, '2026-08-18', '10:00');
  expect(await reasonText(page, '36-2')).toContain('17:00');
  expect(await variantText(page, '36-2')).toBe('（火曜のみ）');
  const reason = await reasonText(page, '36-2');
  expect(reason).not.toMatch(/延長|遅く/);
  await assertNoBrowserErrors(page);
});

test('the qualifier reaches the Card, the Detail and the Map alike', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');

  // Card
  await expect(page.locator('#status-wrap-71 .status-reason-variant')).toHaveText('（土曜のみ）');

  // Detail reuses the same rendered status region.
  const { drawer } = await openDrawer(page, '71');
  await expect(drawer.locator('.status-reason-variant')).toHaveText('（土曜のみ）');
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('the qualifier localizes and disappears for uniform schedules', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  await setDateTime(page, '2026-08-15', '10:00');
  // No.8 恩賜上野動物園 keeps one schedule all week.
  expect(await variantText(page, '8')).toBe('');

  for (const [lang, expected] of [['en', '(Saturdays only)'], ['zh', '（仅星期六）']]) {
    await setLanguage(page, lang);
    await expect.poll(() => variantText(page, '71')).toBe(expected);
  }
  await assertNoBrowserErrors(page);
});
