const { test, expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  assertNoHorizontalOverflow,
  closeDrawer,
  openDrawer,
  preparePage,
  setLanguage,
} = require('./release-fixtures');

test.setTimeout(120_000);

// Official Source Registry & Contextual CTA ownership. The Detail Header owns
// the canonical homepage as an independent globe action; Contact never repeats
// it; the Pass section only links the classified entitlement-evidence source.

const NO40_HOMEPAGE = 'https://www.topmuseum.jp/';

test('Detail Header owns the homepage as a sibling globe action', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '40');

  const globe = drawer.locator('.facility-drawer-actions .facility-drawer-homepage');
  await expect(globe).toBeVisible();
  await expect(globe).toHaveAttribute('href', NO40_HOMEPAGE);
  await expect(globe).toHaveAttribute('target', '_blank');
  await expect(globe).toHaveAttribute('aria-label', '東京都写真美術館の公式サイトを開く');

  // The globe is a sibling action, never embedded in the h2 title.
  await expect(drawer.locator('h2.facility-drawer-title .facility-drawer-homepage')).toHaveCount(0);
  await expect(drawer.locator('h2.facility-drawer-title')).not.toContainText('公式サイトを開く');

  // Icon is decorative; the link carries the accessible name.
  await expect(globe.locator('svg')).toHaveAttribute('aria-hidden', 'true');

  // Visible icon 18–20px, effective hit target >=44×44px.
  const metrics = await globe.evaluate(el => {
    const rect = el.getBoundingClientRect();
    const svg = el.querySelector('svg').getBoundingClientRect();
    return { link: { w: rect.width, h: rect.height }, icon: { w: svg.width, h: svg.height } };
  });
  expect(metrics.link.w).toBeGreaterThanOrEqual(44);
  expect(metrics.link.h).toBeGreaterThanOrEqual(44);
  expect(metrics.icon.w).toBeGreaterThanOrEqual(18);
  expect(metrics.icon.w).toBeLessThanOrEqual(20);
  await assertNoBrowserErrors(page);
});

test('globe accessible name localizes in EN and ZH', async ({ page }) => {
  await preparePage(page, 'ja');
  await setLanguage(page, 'en');
  const { drawer: enDrawer } = await openDrawer(page, '40');
  await expect(enDrawer.locator('.facility-drawer-homepage')).toHaveAttribute(
    'aria-label',
    'Open Tokyo Photographic Art Museum official website',
  );
  await closeDrawer(page);

  await setLanguage(page, 'zh');
  const { drawer: zhDrawer } = await openDrawer(page, '40');
  await expect(zhDrawer.locator('.facility-drawer-homepage')).toHaveAttribute(
    'aria-label',
    '打开东京都摄影美术馆官网',
  );
  await assertNoBrowserErrors(page);
});

test('Contact keeps phone and drops the header-owned homepage', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '40');

  const contact = drawer.locator('.facility-detail-section--visit .visit-info-contact');
  await expect(contact).toBeVisible();
  // Phone retained.
  await expect(contact).toContainText('03-3280-0099');
  // The homepage is owned by the globe and must not appear as a contact link.
  const homepageLink = contact.locator(`a[href="${NO40_HOMEPAGE}"]`);
  await expect(homepageLink).toHaveCount(0);
  await assertNoBrowserErrors(page);
});

test('Pass evidence is provenance, not a permanent CTA', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '40');

  const pass = drawer.locator('.facility-detail-section--pass');
  // No.40 has entitlement evidence but no facility page carrying Pass guidance,
  // so there is nothing actionable to offer — and no link is manufactured.
  await expect(pass.locator('.source-cta:not(.about-context-link) a')).toHaveCount(0);
  await expect(pass.locator('.about-context-link a')).toHaveAttribute('href', '/about/data/');

  // The facts are still stated, and the evidence is still inspectable.
  await expect(pass.locator('.pass-clause-text').first()).toBeVisible();
  const provenance = pass.locator('[data-pass-provenance]');
  await expect(provenance).toBeVisible();
  await expect(provenance.locator('.pass-provenance-summary')).toContainText('公式情報に基づく');

  // Collapsed by default: the raw document is an answer to "how do you know?",
  // not a step the reader must take.
  await expect(provenance).not.toHaveAttribute('open', '');
  await expect(provenance.locator('.pass-provenance-item-name a').first()).toBeHidden();

  await provenance.locator('.pass-provenance-summary').click();
  const raw = provenance.locator('.pass-provenance-item-name a').first();
  await expect(raw).toBeVisible();
  await expect(raw).toHaveAttribute('href', /rekibun\.or\.jp/);
  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * Provenance integrity: every named document IS the one its own link opens,
 * all of them are listed as peers, and known PDF pages are visible.
 * ---------------------------------------------------------------------- */

async function openProvenance(page, key) {
  const { drawer } = await openDrawer(page, key);
  const provenance = drawer.locator('.facility-detail-section--pass [data-pass-provenance]');
  await provenance.locator('.pass-provenance-summary').click();
  await expect(provenance.locator('.pass-provenance-body')).toBeVisible();
  return { drawer, provenance };
}

test('each named document is the one its own link opens', async ({ page }) => {
  await preparePage(page, 'ja');
  const { provenance } = await openProvenance(page, '100');

  // SOGO's August claim rests on the later Grutto update, so that is the entry
  // listed first — and its link must not open the brochure PDF instead.
  const first = provenance.locator('.pass-provenance-item').first();
  await expect(first.locator('[data-pass-provenance-title]')).toHaveText(/8～9月のおすすめ展覧会（入場）/);
  const raw = first.locator('a');
  await expect(raw).toHaveAttribute('href', 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/');
  await expect(raw).toHaveAttribute('aria-label', /8～9月のおすすめ展覧会/);

  // What it supports, and how current it is, on separate lines.
  expect(await first.locator('.pass-provenance-item-role').textContent()).toContain('最新の対象展情報');
  const meta = await first.locator('.pass-provenance-item-meta').textContent();
  expect(meta).toContain('公開 2026年7月29日');
  expect(meta).toContain('確認 2026年8月16日');
  await assertNoBrowserErrors(page);
});

test('all sources are listed outright, with no second disclosure', async ({ page }) => {
  await preparePage(page, 'ja');
  const { provenance } = await openProvenance(page, '100');

  const list = provenance.locator('[data-pass-provenance-list]');
  await expect(list).toBeVisible();
  // Opening the outer disclosure is the whole gate — nothing left to click.
  await expect(list.locator('summary')).toHaveCount(0);
  // No.100 そごう美術館 is the deepest case in the data set: all documents are
  // reachable without a second click. Keep the checks semantic rather than
  // freezing a count when a new edition snapshot is added.
  const items = provenance.locator('.pass-provenance-item');
  await expect(items.first()).toBeVisible();

  // Each is named and openable — no bare URLs, no unreachable entries.
  const rows = await items.evaluateAll(nodes => nodes.map(node => ({
    name: node.querySelector('.pass-provenance-item-name')?.textContent?.trim() || '',
    href: node.querySelector('a')?.getAttribute('href') || '',
    aria: node.querySelector('a')?.getAttribute('aria-label') || ''
  })));
  for (const row of rows) {
    expect(row.name).not.toBe('');
    expect(row.href).not.toBe('');
    expect(row.name.startsWith('http')).toBe(false);
    // Screen readers must be able to tell the links apart.
    expect(row.aria).toContain(row.name.replace(/\s+$/, ''));
  }
  // Documents, not evidence edges: no URL repeats in the list.
  expect(new Set(rows.map(r => r.href)).size).toBe(rows.length);
  // The claim-relevant document leads the list and appears exactly once.
  expect(rows[0].href).toBe('https://www.rekibun.or.jp/grutto/blog/20260729-6866/');
  expect(rows.some(row => row.href === 'https://www.rekibun.or.jp/pdf/grutto/exhibition_2026_01.pdf#page=21')).toBe(true);
  await assertNoBrowserErrors(page);
});

test('known PDF page locators stay visible and deep-linked regardless of primary source ordering', async ({ page }) => {
  await preparePage(page, 'ja');

  // The accepted March exhibition document has No.7 on p.1 and No.106 on p.22.
  const exhibitionPdf = 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf';
  for (const [key, expectedPage] of [['7', 1], ['106', 22]]) {
    const { provenance } = await openProvenance(page, key);
    // The accepted product may lead with a claim-relevant blog. The PDF's
    // page-locator contract belongs to its own document row, regardless of order.
    const pdf = provenance.locator(`.pass-provenance-item:has(a[href="${exhibitionPdf}#page=${expectedPage}"])`);
    await expect(pdf).toHaveCount(1);
    await expect(pdf.locator('.pass-provenance-item-name'))
      .toHaveText(/「ぐるっとパス2026」参加施設・対象の展覧会情報/);
    // The visible label is authoritative — PDF deep linking is best-effort, so
    // the page number must be readable even where #page= is ignored.
    await expect(pdf.locator('.pass-provenance-item-role')).toContainText(`p.${expectedPage}`);
    await expect(pdf.locator('a'))
      .toHaveAttribute('href', new RegExp(`exhibition_2026_01\\.pdf#page=${expectedPage}$`));
    await closeDrawer(page);
  }

  await assertNoBrowserErrors(page);
});

test('a brochure-primary facility cites its own brochure page', async ({ page }) => {
  await preparePage(page, 'ja');
  // No.26 科学技術館 is the reported case: it used to link the whole 20-page
  // brochure even though its page (9) was already recorded in the repo.
  const { provenance } = await openProvenance(page, '26');
  const first = provenance.locator('.pass-provenance-item').first();
  await expect(first.locator('[data-pass-provenance-title]')).toHaveText(/「ぐるっとパス2026」パンフレット/);
  await expect(first.locator('.pass-provenance-item-role')).toContainText('p.9');
  await expect(first.locator('a'))
    .toHaveAttribute('href', 'https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf#page=9');

  // The other exhibition PDF is cited at ITS page, not the first entry's.
  const marchExhibitionPdf = 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf#page=4';
  const exhibition = provenance.locator(`.pass-provenance-item:has(a[href="${marchExhibitionPdf}"])`);
  await expect(exhibition).toHaveCount(1);
  await expect(exhibition).toContainText('p.4');
  await expect(exhibition.locator('a')).toHaveAttribute('href', marchExhibitionPdf);
  await assertNoBrowserErrors(page);
});

test('every facility deep-links its PDF sources to a page', async ({ page }) => {
  await preparePage(page, 'ja');
  // Sweep the rendered Cards rather than one Drawer: a whole-document PDF link is
  // exactly the regression this release removes, so none may survive anywhere.
  const bad = await page.evaluate(() => {
    const offenders = [];
    document.querySelectorAll('.area-section .card .pass-provenance').forEach(node => {
      const key = node.closest('.card')?.dataset.facilityKey;
      node.querySelectorAll('a[href$=".pdf"]').forEach(link => {
        offenders.push(`${key}: ${link.getAttribute('href')}`);
      });
    });
    return offenders;
  });
  expect(bad).toEqual([]);
  await assertNoBrowserErrors(page);
});

test('every listed entry is a real document, and the list is never empty', async ({ page }) => {
  await preparePage(page, 'ja');
  const { provenance } = await openProvenance(page, '8');
  const items = provenance.locator('.pass-provenance-item');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
  // No placeholder rows: every entry carries a name.
  const names = await provenance.locator('.pass-provenance-item-name').allTextContents();
  expect(names.length).toBe(count);
  names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
  await assertNoBrowserErrors(page);
});

test('sources are peers: no entry is styled or worded as the important one', async ({ page }) => {
  await preparePage(page, 'ja');
  const { provenance } = await openProvenance(page, '100');
  // No ranking copy, and no separate action for one of them.
  await expect(provenance.locator('.pass-provenance-label')).toHaveCount(0);
  await expect(provenance.locator('.pass-provenance-raw')).toHaveCount(0);
  await expect(provenance.getByText('主な参照資料')).toHaveCount(0);

  // Every entry offers the same affordance: its own title is its own link.
  const items = provenance.locator('.pass-provenance-item');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(items.nth(index).locator('.pass-provenance-item-name a')).toHaveCount(1);
  }
  // They support different claims, which is what the role line is for.
  const roles = await provenance.locator('.pass-provenance-item-role').allTextContents();
  expect(new Set(roles).size).toBeGreaterThan(1);
  await assertNoBrowserErrors(page);
});

test('the provenance disclosure is keyboard operable and fits small screens', async ({ page }) => {
  await preparePage(page, 'ja');
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    const { drawer } = await openDrawer(page, '100');
    const provenance = drawer.locator('.facility-detail-section--pass [data-pass-provenance]');

    await provenance.locator('.pass-provenance-summary').focus();
    await page.keyboard.press('Enter');
    await expect(provenance).toHaveAttribute('open', '');

    // One keystroke reaches the evidence: the whole list is already open.
    await expect(provenance.locator('.pass-provenance-item').first()).toBeVisible();

    // Sources read as a vertical list, never a horizontal card row.
    const stacked = await provenance.locator('.pass-provenance-item').evaluateAll(nodes => {
      const lefts = nodes.map(n => Math.round(n.getBoundingClientRect().left));
      return new Set(lefts).size === 1;
    });
    expect(stacked, `width ${width}`).toBe(true);
    await assertNoHorizontalOverflow(page);
    await closeDrawer(page);
  }
  await assertNoBrowserErrors(page);
});

test('provenance labels localize in EN and ZH', async ({ page }) => {
  await preparePage(page, 'ja');
  for (const [lang, summary, published] of [
    ['en', 'Based on official sources', 'Published'],
    ['zh', '基于官方资料', '发布'],
  ]) {
    await setLanguage(page, lang);
    const { provenance } = await openProvenance(page, '100');
    await expect(provenance.locator('.pass-provenance-summary')).toContainText(summary);
    await expect(provenance.locator('.pass-provenance-item-meta').first()).toContainText(published);
    // Role labels are localized copy, never the internal relation vocabulary.
    const lines = [
      ...await provenance.locator('.pass-provenance-item-role').allTextContents(),
      ...await provenance.locator('.pass-provenance-item-meta').allTextContents(),
    ];
    for (const line of lines) {
      expect(line).not.toMatch(/entitlement_evidence|pass_confirmation|context_confirmation/);
    }
    // Dates are locale-formatted, never raw ISO.
    for (const line of await provenance.locator('.pass-provenance-item-meta').allTextContents()) {
      expect(line).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    }
    await closeDrawer(page);
  }
  await assertNoBrowserErrors(page);
});

test('provenance disclosure is keyboard operable and announces its state', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '40');
  const provenance = drawer.locator('.facility-detail-section--pass [data-pass-provenance]');
  const summary = provenance.locator('.pass-provenance-summary');

  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(provenance).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(provenance).not.toHaveAttribute('open', '');

  // Each external link carries an explicit, destination-specific accessible name.
  await summary.click();
  await expect(provenance.locator('.pass-provenance-item-name a').first())
    .toHaveAttribute('aria-label', /ぐるっとパス2026/);
  await assertNoBrowserErrors(page);
});

test('a long localized title wraps without squeezing the globe or close', async ({ page }) => {
  await preparePage(page, 'ja');
  await setLanguage(page, 'en');
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    const { drawer } = await openDrawer(page, '40');
    await expect(drawer.locator('.facility-drawer-homepage')).toBeVisible();
    await expect(drawer.locator('#facilityDrawerClose')).toBeVisible();

    // The actions stay on their column; the title column absorbs the wrap.
    const layout = await drawer.locator('.facility-drawer-head').evaluate(head => {
      const title = head.querySelector('.facility-drawer-title').getBoundingClientRect();
      const actions = head.querySelector('.facility-drawer-actions').getBoundingClientRect();
      return {
        titleRight: title.right,
        actionsLeft: actions.left,
        overlap: !(title.right <= actions.left + 1),
      };
    });
    expect(layout.overlap, `width ${width}`).toBe(false);
    await assertNoHorizontalOverflow(page);
    await closeDrawer(page);
  }
  await assertNoBrowserErrors(page);
});

test('Map Detail header carries the same homepage globe', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await page.evaluate(() => window.setSelectedFacilityKey('40'));
  const globe = page.locator('#mapFacilityActions .facility-drawer-homepage');
  await expect(globe).toBeVisible();
  await expect(globe).toHaveAttribute('href', NO40_HOMEPAGE);
  await expect(globe).toHaveAttribute('aria-label', '東京都写真美術館の公式サイトを開く');
  await assertNoBrowserErrors(page);
});
