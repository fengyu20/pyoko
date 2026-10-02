const { test, expect } = require('@playwright/test');
const {
  LANGUAGES,
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
} = require('./release-fixtures');

for (const language of LANGUAGES) {
  test(`P0 boots and renders a usable ${language.toUpperCase()} application`, async ({ page }) => {
    await preparePage(page, language);

    await expect(page.locator('#mainContent')).toBeVisible();
    await expect.poll(() => visibleCardCount(page)).toBeGreaterThan(0);
    await expect(page.locator('#searchInput')).toBeVisible();
    await expect(page.locator('#filterToggleBtn')).toBeVisible();
    await expect(page.locator('#listToggleBtn')).toBeVisible();
    await expect(page.locator('#mapToggleBtn')).toBeVisible();
    await expect(page.locator('#card-52')).toBeVisible();
    await assertNoLeakedValues(page);
    await assertNoBrowserErrors(page);
  });
}

test('P1 Footer keeps trust, About, and Sources ownership separate in every locale', async ({ page }) => {
  const expected = {
    ja: {
      about: '本サイトについて',
      sources: 'データ・出典',
      core: '基本情報',
      exhibitions: '展覧会情報',
      recommendations: '公式おすすめ',
      period: '8–9月'
    },
    en: {
      about: 'About this site',
      sources: 'Data & sources',
      core: 'Basic information',
      exhibitions: 'Exhibition information',
      recommendations: 'Official recommendations',
      period: 'Aug–Sep'
    },
    zh: {
      about: '关于本网站',
      sources: '数据与来源',
      core: '基本信息',
      exhibitions: '展览信息',
      recommendations: '官方推荐',
      period: '8–9月'
    }
  };

  for (const language of LANGUAGES) {
    await preparePage(page, language);
    const footer = page.locator('footer.site-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator('.footer-unofficial')).toBeVisible();
    await expect(footer.locator('.footer-unofficial')).not.toContainText('出典の役割');
    await expect(footer.locator('.footer-official-link')).toBeVisible();
    await expect(footer.locator('.footer-official-link')).toHaveAttribute('target', '_blank');
    await expect(footer.locator('.footer-official-link')).toHaveAttribute('rel', /noopener/);
    await expect(footer.locator('.site-about > summary')).toContainText(expected[language].about);
    await expect(footer.locator('.site-sources > summary')).toContainText(expected[language].sources);
    await expect(footer.locator('#sourceNote')).toHaveCount(0);

    const collapsedText = await footer.innerText();
    expect(collapsedText).not.toContain(expected[language].period);

    await footer.locator('.site-about > summary').click();
    await expect(footer.locator('.site-about-body')).toBeVisible();
    const aboutText = await footer.locator('.site-about-body').innerText();
    expect(aboutText).toContain(language === 'ja' ? '掲載情報' : language === 'en' ? 'Coverage' : '收录信息');
    expect(aboutText).toContain(language === 'ja' ? 'ぐるっとパスの基本' : language === 'en' ? 'Grutto Pass basics' : 'Grutto Pass 基本规则');
    expect(aboutText).toContain(language === 'ja' ? 'あなたの記録' : language === 'en' ? 'Your records' : '你的记录');
    expect(aboutText).toContain(language === 'ja' ? '表示について' : language === 'en' ? 'How information is shown' : '显示说明');

    await footer.locator('.site-sources > summary').click();
    await expect(footer.locator('.site-sources-body')).toBeVisible();
    const sourceText = await footer.locator('.site-sources-body').innerText();
    expect(sourceText).toContain(expected[language].core);
    expect(sourceText).toContain(expected[language].exhibitions);
    expect(sourceText).toContain(expected[language].recommendations);
    expect(sourceText).toContain(expected[language].period);
    const recommendationCount = await page.evaluate(() => CONFIG.sources.recommendations.length);
    await expect(footer.locator('.footer-recommendation-row')).toHaveCount(recommendationCount);
    expect(sourceText).not.toContain('[object Object]');

    const unsafeExternalLinks = await footer.locator('a[href^="http"]').evaluateAll(links => links
      .filter(link => link.target !== '_blank' || !link.rel.split(/\s+/).includes('noopener'))
      .map(link => link.getAttribute('href')));
    expect(unsafeExternalLinks).toEqual([]);
  }
});

test('P1 Footer monthly source rows are data-driven and wrap across release widths', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await preparePage(page, 'ja');
  const footer = page.locator('footer.site-footer');
  await footer.scrollIntoViewIfNeeded();
  await footer.locator('.site-sources > summary').click();
  const recommendationCount = await page.evaluate(() => CONFIG.sources.recommendations.length);
  await expect(footer.locator('.footer-recommendation-row')).toHaveCount(recommendationCount);

  await page.evaluate(() => {
    CONFIG.sources.recommendations.push({
      id: 'fixture-2026-09-10',
      periodStart: '2026-09',
      periodEnd: '2026-10',
      admissionUrl: 'https://example.com/fixture-admission',
      discountUrl: 'https://example.com/fixture-discount'
    });
    window.renderFooterSources();
  });
  await expect(footer.locator('.footer-recommendation-row')).toHaveCount(recommendationCount + 1);
  const fixtureRow = footer.locator('[data-source-id="fixture-2026-09-10"]');
  await expect(fixtureRow).toContainText('9–10月');
  await expect(fixtureRow.locator('a')).toHaveCount(2);
  await assertNoHorizontalOverflow(page);

  for (const width of [390, 430, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await assertNoHorizontalOverflow(page);
    await expect(fixtureRow).toContainText('9–10月');
  }
});

// Each locale/viewport has the ordinary test budget and the full assertion set.
{
  const trustCopy = {
    ja: { identity: '非公式ガイドです。', cta: '購入・最新情報は公式サイトへ ↗' },
    en: { identity: 'Unofficial guide.', cta: 'Buy & check latest info on the official site ↗' },
    zh: { identity: '非官方指南。', cta: '购买及最新信息请查看官网 ↗' }
  };
  const widths = [320, 390, 768, 1280];

  for (const width of widths) {
    for (const language of LANGUAGES) {
      test(`P1 Footer semantic groups keep DOM order, explicit placement, and natural trust wrapping (${width}px, ${language})`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await preparePage(page, language);
        const footer = page.locator('footer.site-footer');
        await footer.scrollIntoViewIfNeeded();

        await expect(footer.locator('.footer-unofficial')).toHaveText(trustCopy[language].identity);
        const footerOfficial = footer.locator('.footer-official-link');
        await expect(footerOfficial).toHaveText(trustCopy[language].cta);
        await expect(footerOfficial).toHaveAttribute('href', await page.locator('#heroOfficialLink').getAttribute('href'));
        await expect(footerOfficial).toHaveAttribute('target', '_blank');
        await expect(footerOfficial).toHaveAttribute('rel', /noopener/);

        await footer.locator('.site-about > summary').click();
        await footer.locator('.site-sources > summary').click();
        const layout = await footer.evaluate(footerNode => {
          const trust = footerNode.querySelector('.footer-trust');
          const official = footerNode.querySelector('.footer-official-link');
          const sourcesGrid = footerNode.querySelector('.footer-sections--sources');
          const display = footerNode.querySelector('.footer-section--display');
          const methodGrid = footerNode.querySelector('.footer-display-grid');
          const terms = footerNode.querySelector('.footer-section--terms');
          const termsBody = footerNode.querySelector('.footer-terms-body');
          const directSectionKeys = selector => [...footerNode.querySelectorAll(`${selector} > .footer-section`)]
            .map(section => section.querySelector('h3')?.dataset.i18n || '');
          const gridColumnCount = node => String(getComputedStyle(node).gridTemplateColumns || '')
            .trim().split(/\s+/).filter(Boolean).length;
          return {
            trustDisplay: getComputedStyle(trust).display,
            trustFlexWrap: getComputedStyle(trust).flexWrap,
            officialMarginTop: getComputedStyle(official).marginTop,
            aboutOrder: directSectionKeys('.footer-sections--about'),
            sourcesOrder: directSectionKeys('.footer-sections--sources'),
            displayColumnStart: getComputedStyle(display).gridColumnStart,
            displayColumnEnd: getComputedStyle(display).gridColumnEnd,
            methodColumns: gridColumnCount(methodGrid),
            termsColumnStart: getComputedStyle(terms).gridColumnStart,
            termsColumnEnd: getComputedStyle(terms).gridColumnEnd,
            sourceColumns: gridColumnCount(sourcesGrid),
            termsWidth: termsBody.getBoundingClientRect().width,
            termsSectionWidth: terms.getBoundingClientRect().width
          };
        });

        expect(layout.trustDisplay).toBe('flex');
        expect(layout.trustFlexWrap).toBe('wrap');
        expect(layout.officialMarginTop).toBe('0px');
        expect(layout.aboutOrder).toEqual([
          'footer.pyokoHeading', 'footer.coverageHeading', 'footer.passBasicsHeading',
          'footer.recordsHeading', 'footer.displayHeading'
        ]);
        expect(layout.sourcesOrder).toEqual([
          'footer.coreSourcesHeading', 'footer.exhibitionSourcesHeading',
          'footer.recommendationsHeading', 'footer.termsHeading'
        ]);
        if (width >= 760) {
          expect(layout.displayColumnStart).toBe('1');
          expect(layout.displayColumnEnd).toBe('-1');
          expect(layout.methodColumns).toBe(2);
          expect(layout.termsColumnStart).toBe('1');
          expect(layout.termsColumnEnd).toBe('-1');
          expect(layout.sourceColumns).toBe(3);
          expect(layout.termsWidth).toBeLessThan(layout.termsSectionWidth);
        } else {
          expect(layout.methodColumns).toBe(1);
          expect(layout.sourceColumns).toBe(1);
        }

        await assertNoHorizontalOverflow(page);
        await assertNoBrowserErrors(page);
      });
    }
  }
}

test('P0 opens an accessible No.52 Drawer and protects clone identity', async ({ page }) => {
  await preparePage(page, 'ja');
  const { trigger } = await openDrawer(page, '52');
  const panel = page.locator('#facilityDrawer .facility-drawer-panel');

  await expect(panel).toHaveAttribute('role', 'dialog');
  await expect(panel).toHaveAttribute('aria-modal', 'true');
  await expect(panel).toHaveAttribute('aria-labelledby', 'facilityDrawerTitle');
  await expect(page.locator('#facilityDrawerTitle')).not.toHaveText('');
  await expect(page.locator('#facilityDrawerClose')).toHaveAttribute('aria-label', /.+/);
  await expect(page.locator('#facilityDrawerKicker')).toContainText('No. 52');

  const drawerText = await page.locator('#facilityDrawerBody').innerText();
  expect(drawerText).toContain('早稲田駅');
  expect(drawerText).toContain('入場');
  expect(drawerText).toContain('夏目漱石');
  expect(await page.locator('#facilityDrawerBody .facility-detail-section--access .visit-info-content p').count()).toBe(3);

  const duplicateIds = await page.locator('[id]').evaluateAll(elements => {
    const seen = new Set();
    const duplicates = new Set();
    elements.forEach(element => {
      if (seen.has(element.id)) duplicates.add(element.id);
      seen.add(element.id);
    });
    return [...duplicates];
  });
  expect(duplicateIds).toEqual([]);
  await assertNoLeakedValues(page);
  await closeDrawer(page);
  await expect(trigger).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('P1 Drawer and Map share detail ownership, order, and item-level language semantics', async ({ page }) => {
  await preparePage(page, 'en');

  const sectionOrder = async selector => page.locator(`${selector} .facility-detail-section`).evaluateAll(sections => sections.map(section => {
    const sectionClass = [...section.classList].find(name => name.startsWith('facility-detail-section--'));
    return sectionClass?.replace('facility-detail-section--', '') || '';
  }));

  await openDrawer(page, '3');
  await expect(page.locator('#facilityDrawerBody [data-presentation-level="browse"]')).toHaveCount(0);
  expect(await sectionOrder('#facilityDrawerBody')).toEqual(['introduction', 'pass', 'exhibitions', 'access', 'visit']);
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toBeVisible();
  await expect(page.locator('#facilityDrawerBody .enriched-title')).toContainText('Myth, Allegory and Celebration');
  await expect(page.locator('#facilityDrawerBody .enriched-language-note')).toHaveCount(0);

  const drawerHeader = await page.locator('#facilityDrawer .facility-drawer-head').evaluate(header => {
    const heading = header.querySelector('.facility-drawer-heading');
    const status = header.querySelector('.facility-drawer-status');
    return {
      statusIsHeaderChild: status?.parentElement === header,
      statusInsideHeading: Boolean(heading?.contains(status)),
      statusColumnStart: getComputedStyle(status).gridColumnStart,
      statusColumnEnd: getComputedStyle(status).gridColumnEnd
    };
  });
  expect(drawerHeader).toEqual({
    statusIsHeaderChild: true,
    statusInsideHeading: false,
    statusColumnStart: '1',
    statusColumnEnd: '-1'
  });

  await page.locator('#facilityDrawerBody [data-map-focus="3"]').click();
  await expect(page.locator('body')).toHaveClass(/map-active/);
  await expect(page.locator('#mapFacilityDetail')).toBeVisible();
  await expect(page.locator('#mapFacilityBody [data-presentation-level="browse"]')).toHaveCount(0);
  expect(await sectionOrder('#mapFacilityBody')).toEqual(['introduction', 'pass', 'exhibitions', 'access', 'visit']);
  await expect(page.locator('#mapFacilityBody .enriched-title')).toContainText('Myth, Allegory and Celebration');
  await expect(page.locator('#mapFacilityBody .enriched-language-note')).toHaveCount(0);
  await expect(page.locator('#mapFacilityStatus')).toHaveCSS('grid-column-start', '1');
  await expect(page.locator('#mapFacilityStatus')).toHaveCSS('grid-column-end', '-1');

  await page.locator('#listToggleBtn').click();
  await expect(page.locator('body')).not.toHaveClass(/map-active/);
  await openDrawer(page, '15');
  const marker = page.locator('#facilityDrawerBody .enriched-language-note').first();
  await expect(marker).toBeVisible();
  await expect(marker).toContainText('(JP)');
  await expect(marker).toHaveAttribute('aria-label', 'Japanese only');
  expect(await marker.evaluate(node => Boolean(node.closest('.enriched-title')))).toBe(true);
  await expect(page.locator('#facilityDrawerBody .enriched-title')).toHaveAttribute('aria-label', /Japanese only/);

  await assertNoHorizontalOverflow(page);
  await assertNoLeakedValues(page);
  await assertNoBrowserErrors(page);
});

test('P1 Detail continues the Browse introduction before decision sections', async ({ page }) => {
  test.setTimeout(60_000);
  const normalizeText = value => String(value || '').replace(/\s+/g, ' ').trim();
  const assertFacilityContinuation = async (key, width) => {
    await page.setViewportSize({ width, height: 844 });
    const browseIntro = page.locator(`#card-${key} .facility-discovery-preview`);
    await expect(browseIntro).toBeVisible();
    const browseMetrics = await browseIntro.evaluate(element => {
      const style = getComputedStyle(element);
      return {
        lineClamp: style.webkitLineClamp || style.getPropertyValue('-webkit-line-clamp'),
        overflow: style.overflow,
        text: element.textContent || ''
      };
    });
    expect(browseMetrics.lineClamp).toBe('2');
    expect(browseMetrics.overflow).toBe('hidden');

    await openDrawer(page, key);
    const body = page.locator('#facilityDrawerBody');
    const intro = body.locator('.facility-detail-section--introduction');
    await expect(body.locator('[data-presentation-level="browse"]')).toHaveCount(0);
    await expect(intro).toHaveCount(1);
    await expect(intro).toBeVisible();
    await expect(intro.locator('.facility-detail-section-heading')).toHaveCount(0);
    await expect(intro.locator('.facility-intro-mark, .facility-intro-row')).toHaveCount(0);
    const detailText = normalizeText(await intro.locator('.facility-intro-body').innerText());
    expect(detailText).toContain(normalizeText(browseMetrics.text));

    const hierarchy = await body.evaluate(root => {
      const nodes = [...root.querySelectorAll('.personal-actions, .facility-detail-section')];
      const index = selector => {
        const node = root.querySelector(selector);
        return node ? nodes.indexOf(node) : -1;
      };
      return {
        actions: index('.personal-actions'),
        introduction: index('.facility-detail-section--introduction'),
        pass: index('.facility-detail-section--pass'),
        exhibitions: index('.facility-detail-section--exhibitions'),
        access: index('.facility-detail-section--access'),
        introWidth: root.querySelector('.facility-detail-section--introduction')?.getBoundingClientRect().width || 0,
        bodyWidth: root.querySelector('.card-body')?.getBoundingClientRect().width || 0,
        actionsBorderBottom: getComputedStyle(root.querySelector('.personal-actions')).borderBottomWidth,
        introBorderTop: getComputedStyle(root.querySelector('.facility-detail-section--introduction')).borderTopWidth,
        passBorderTop: root.querySelector('.facility-detail-section--pass')
          ? getComputedStyle(root.querySelector('.facility-detail-section--pass')).borderTopWidth
          : '0px'
      };
    });
    expect(hierarchy.actions).toBeGreaterThanOrEqual(0);
    expect(hierarchy.introduction).toBeGreaterThan(hierarchy.actions);
    for (const section of ['pass', 'exhibitions', 'access']) {
      if (hierarchy[section] >= 0) expect(hierarchy.introduction).toBeLessThan(hierarchy[section]);
    }
    expect(hierarchy.introWidth).toBeLessThanOrEqual(hierarchy.bodyWidth + 1);
    expect(hierarchy.actionsBorderBottom).toBe('0px');
    expect(hierarchy.introBorderTop).toBe('0px');
    if (hierarchy.pass >= 0) expect(hierarchy.passBorderTop).toBe('1px');
    await assertNoHorizontalOverflow(page);
    await closeDrawer(page);
  };

  await preparePage(page, 'en');
  for (const width of [320, 390, 768, 1280]) await assertFacilityContinuation('101', width);
  await assertFacilityContinuation('52', 390);
  await assertFacilityContinuation('103', 390);
  await assertFacilityContinuation('51', 390);
  await assertNoBrowserErrors(page);
});

test('P0 supports Drawer Escape and refreshes selected status after date/time changes', async ({ page }) => {
  await preparePage(page, 'ja', { date: '2026-08-12', time: '10:00' });
  const { trigger } = await openDrawer(page, '4');
  await expect(page.locator('#card-4')).toHaveAttribute('data-now-state', 'open');

  const cardStatusAtOpen = await page.locator('#card-4 .status-container').innerText();
  const drawerStatusAtOpen = await page.locator('#facilityDrawerStatus').innerText();
  expect(drawerStatusAtOpen).toContain(cardStatusAtOpen.trim().split('\n')[0]);

  await setDateTime(page, '2026-08-12', '17:15');
  await expect(page.locator('#card-4')).toHaveAttribute('data-now-state', 'after');
  const cardStatusAfterClose = await page.locator('#card-4 .status-container').innerText();
  const drawerStatusAfterClose = await page.locator('#facilityDrawerStatus').innerText();
  expect(drawerStatusAfterClose).toContain(cardStatusAfterClose.trim().split('\n')[0]);

  await closeDrawer(page, { escape: true });
  await expect(trigger).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('P0 List to Map preserves selection and replaces stale detail', async ({ page }) => {
  await preparePage(page, 'ja');
  const name52 = await primaryCardName(page.locator('#card-52'));
  await openDrawer(page, '52');
  await page.locator('#facilityDrawerBody [data-map-focus="52"]').click();

  await expect(page.locator('body')).toHaveClass(/map-active/);
  await expect(page.locator('#mapView')).toBeVisible();
  await expect(page.locator('#mapFacilityPanel')).toBeVisible();
  await expect(page.locator('#mapFacilityDetail')).toBeVisible();
  await expect(page.locator('#mapFacilityTitle')).toHaveText(name52);
  await expect(page.locator('#mapFacilityKicker')).toContainText('No. 52');
  await expect(page.locator('#mapFacilityBody')).toContainText('早稲田駅');
  await expect(page.locator('#mapFacilityBody [data-map-focus]')).toHaveCount(0);
  await expect(page.locator('#mapFacilityBody a[href*="google.com/maps"]')).toHaveCount(1);

  await page.locator('#mapFacilityPanel').evaluate(panel => { panel.scrollTop = 10_000; });
  await page.evaluate(() => window.selectFacilityCard('50'));
  await expect(page.locator('#mapFacilityKicker')).toContainText('No. 50');
  await expect(page.locator('#mapFacilityTitle')).not.toHaveText(name52);
  await expect(page.locator('#mapFacilityBody')).toContainText('芦花公園駅');
  await expect.poll(() => page.locator('#mapFacilityPanel').evaluate(panel => panel.scrollTop)).toBe(0);
  await assertNoHorizontalOverflow(page);
  await assertNoLeakedValues(page);
  await assertNoBrowserErrors(page);
});

test('P0 searches real localized facility names in all languages', async ({ page }) => {
  await preparePage(page, 'ja');
  const search = page.locator('#searchInput');

  for (const language of LANGUAGES) {
    if (language !== 'ja') await setLanguage(page, language);
    const query = await primaryCardName(page.locator('#card-52'));
    await search.fill(query);
    const searchBlob = await page.locator('#card-52').getAttribute('data-search');
    await expect(
      page.locator('#card-52'),
      `${language}: query=${JSON.stringify(query)} data-search=${JSON.stringify(searchBlob)}`,
    ).toBeVisible();
    await expect.poll(() => visibleCardCount(page)).toBeGreaterThan(0);
    await search.fill('');
    await expect(page.locator('#card-52')).toBeVisible();
  }

  await assertNoLeakedValues(page);
  await assertNoBrowserErrors(page);
});

test('P0 empty search recovers and language changes do not blank results', async ({ page }) => {
  await preparePage(page, 'ja');
  const query = await primaryCardName(page.locator('#card-52'));
  await page.locator('#searchInput').fill(query);
  await expect(page.locator('#card-52')).toBeVisible();
  await setLanguage(page, 'en');
  await expect(page.locator('#searchInput')).toHaveValue(query);
  await expect(page.locator('#card-52')).toBeVisible();

  await page.locator('#searchInput').fill('zzzz-no-such-facility');
  await expect(page.locator('#emptyState')).toHaveClass(/show/);
  await expect(page.locator('#emptyClearFiltersButton')).toBeVisible();
  await page.locator('#emptyClearFiltersButton').click();
  await expect(page.locator('#card-52')).toBeVisible();
  await expect(page.locator('#emptyState')).not.toHaveClass(/show/);
  await assertNoBrowserErrors(page);
});

test('P0 quick filters and Filter & sort share one state and clear cleanly', async ({ page }) => {
  await preparePage(page, 'ja');
  const baseline = await visibleCardCount(page);
  const quickAdmission = page.locator('[data-quick-filter-name="passFilter"][data-quick-filter-value="admission"]');
  await quickAdmission.click();
  await expect(quickAdmission).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('input[name="passFilter"][value="admission"]')).toBeChecked();
  await expect.poll(() => visibleCardCount(page)).toBeLessThan(baseline);

  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await expect(page.locator('input[name="passFilter"][value="admission"]')).toBeChecked();
  await clickInputLabel(page, 'input[name="passFilter"][value="discount"]');
  await expect(quickAdmission).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-quick-filter-name="passFilter"][data-quick-filter-value="admission"]')).toHaveAttribute('aria-pressed', 'false');

  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#clearFiltersButton')).toBeVisible();
  await page.locator('#clearFiltersButton').click();
  await expect.poll(() => visibleCardCount(page)).toBe(baseline);
  await expect(page.locator('#filterCount')).toBeHidden();
  await assertNoBrowserErrors(page);
});

test('P0 visited state remains visible, persists through rerender, and syncs My Pass', async ({ page }) => {
  await preparePage(page, 'ja');
  const toggle = page.locator('#card-52 [data-visited-toggle="52"]');
  await clickInputLabel(page, '#card-52 [data-visited-toggle="52"]');
  await expect(toggle).toBeChecked();
  await expect(page.locator('#card-52')).toBeVisible();
  await expect(page.locator('#card-52')).toHaveClass(/is-visited/);

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('grutto-pass:2026:visited:v1')));
  expect(stored.visited).toContain('52');
  await setDateTime(page, '2026-08-13', '10:00');
  await setLanguage(page, 'en');
  await expect(page.locator('#card-52 [data-visited-toggle="52"]')).toBeChecked();
  await expect(page.locator('#card-52')).toBeVisible();

  await page.locator('#passTrackerChip').click();
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#passVisitedList')).toContainText('Natsume Soseki');
  await page.locator('#passTrackerClose').click();
  await clickInputLabel(page, '#card-52 [data-visited-toggle="52"]');
  await page.locator('#passTrackerChip').click();
  // With both collections empty the default tab is Want to go; switch to
  // Visited to assert its empty state.
  await page.locator('#visitedTab').click();
  await expect(page.locator('#passNoVisits')).toBeVisible();
  await assertNoBrowserErrors(page);
});

test('P0 Not visited excludes a newly visited card without losing filter state', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator('#filterToggleBtn').click();
  await clickInputLabel(page, 'input[name="visitedFilter"][value="unvisited"]');
  await expect(page.locator('input[name="visitedFilter"][value="unvisited"]')).toBeChecked();
  await expect(page.locator('#card-52')).toBeVisible();

  await clickInputLabel(page, '#card-52 [data-visited-toggle="52"]');
  await expect(page.locator('#card-52')).toBeHidden();
  await expect(page.locator('input[name="visitedFilter"][value="unvisited"]')).toBeChecked();
  await expect(page.locator('#filterCount')).toBeVisible();
  await assertNoBrowserErrors(page);
});

test('P1 mobile Map preserves the viewport when marking the selected facility visited', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await preparePage(page, 'ja');
  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapView')).toBeVisible();
  await expect.poll(() => page.evaluate(() => (
    typeof mapInstance !== 'undefined' && Boolean(mapInstance?.getCenter?.())
  ))).toBe(true);

  // Below the desktop split-view width the map answers a selection with the
  // in-canvas preview, and the visited control lives in the Drawer it opens.
  await page.evaluate(() => window.selectFacilityCard('52'));
  await expect(page.locator('#mapSelectionPreview')).toBeVisible();
  await expect(page.locator('#mapFacilityPanel')).toBeHidden();

  const before = await page.evaluate(() => {
    mapInstance.setView([35.55, 139.55], 15, { animate: false });
    const center = mapInstance.getCenter();
    return { lat: center.lat, lng: center.lng, zoom: mapInstance.getZoom() };
  });

  // Entering Map Mode scrolls past the stable discovery boundary, so mobile
  // controls may already be compact by the time the selected panel is ready.
  // Re-open the shared controls before using a quick filter.
  if (await page.locator('#compactControlsTrigger').isVisible()) {
    await page.locator('#compactControlsTrigger').click();
  }
  await page.locator('.quick-filter-toggle[data-quick-filter-name="visitedFilter"]').click();
  await expect(page.locator('input[name="visitedFilter"][value="unvisited"]')).toBeChecked();
  await page.locator('#mapSelectionPreview').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await page.locator('#facilityDrawerBody .personal-action--visited').click();
  await page.locator('#facilityDrawerClose').click();
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect.poll(() => page.evaluate(() => (
    !window.filteredCards.some(card => card.dataset.facilityKey === '52')
  ))).toBe(true);

  const after = await page.evaluate(() => {
    const center = mapInstance.getCenter();
    return { lat: center.lat, lng: center.lng, zoom: mapInstance.getZoom() };
  });
  // The compact map canvas is sized against the sticky toolbar, so opening and
  // closing the Drawer can resize it by a few pixels and Leaflet re-anchors the
  // centre accordingly. The invariant is that the viewport does not move to a
  // different place: no pan, no zoom change.
  const drift = await page.evaluate(([lat, lng]) => (
    mapInstance.distance(mapInstance.getCenter(), { lat, lng })
  ), [before.lat, before.lng]);
  expect(drift).toBeLessThan(25);
  expect(after.zoom).toBe(before.zoom);
  await assertNoBrowserErrors(page);
});

test('P1 mobile admission filtering is explicit', async ({ page }) => {
  for (const language of [
    { code: 'ja', label: '入場無料' },
    { code: 'zh', label: '免费入场' },
  ]) {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 812 });
      await preparePage(page, language.code);
      await expect(page.locator('.quick-filter-toggle[data-quick-filter-name="passFilter"]'))
        .toHaveText(language.label);
    }
  }
  await assertNoBrowserErrors(page);
});

test('P1 Hero metadata keeps one hierarchy across locales and breakpoints', async ({ page }) => {
  test.setTimeout(120_000);
  const expectedHero = {
    ja: { descriptor: 'for 東京・ミュージアム ぐるっとパス · 非公式', proposition: 'ぐるっとパスで、次はどこへ。', edition: '2026年版', official: '購入・最新情報は公式サイトへ ↗' },
    en: { descriptor: 'for Tokyo Museum Grutto Pass · Unofficial', proposition: 'Where to next with your Grutto Pass?', edition: '2026 edition', official: 'Buy & check latest info on the official site ↗' },
    zh: { descriptor: 'for 东京·博物馆 Grutto Pass · 非官方', proposition: '拿着 Grutto Pass，下一站去哪？', edition: '2026版', official: '购买及最新信息请查看官网 ↗' }
  };
  const viewports = [
    [320, 800],
    [375, 812],
    [390, 844],
    [430, 900],
    [768, 900],
    [1024, 768],
    [1440, 900],
  ];

  for (const [width, height] of viewports) {
    for (const language of LANGUAGES) {
      await page.setViewportSize({ width, height });
      await preparePage(page, language);

      const descriptor = page.locator('.pyoko-descriptor');
      const qualifier = page.locator('.pyoko-descriptor-qualifier');
      const meta = page.locator('.pass-meta');
      const edition = page.locator('#passEdition');
      const provenance = page.locator('#heroUnofficialNote');
      const officialLink = page.locator('#heroOfficialLink');
      const languageButtons = page.locator('.hero .language-switch button');
      await expect(descriptor).toHaveText(expectedHero[language].descriptor);
      await expect(descriptor.locator('.pyoko-descriptor-separator')).toHaveText('·');
      await expect(qualifier).toHaveCSS('white-space', 'nowrap');
      await expect(meta).toBeVisible();
      await expect(edition).toBeVisible();
      await expect(provenance).toBeVisible();
      await expect(officialLink).toBeVisible();
      await expect(page.locator('.hero-title')).toHaveText(expectedHero[language].proposition);
      await expect(edition).toHaveText(expectedHero[language].edition);
      await expect(officialLink).toHaveText(expectedHero[language].official);
      await expect(page.locator('.hero .pyoko-unofficial')).toHaveCount(1);
      await expect(languageButtons).toHaveCount(3);
      await expect(officialLink).toContainText('↗');
      await expect(officialLink).toHaveAttribute('target', '_blank');
      await expect(officialLink).toHaveAttribute('rel', /noopener/);
      const metaText = await meta.innerText();
      expect(metaText).not.toMatch(/2,500|2027/);

      const metrics = await page.evaluate(() => {
        const meta = document.querySelector('.pass-meta');
        const edition = document.querySelector('#passEdition');
        const provenance = document.querySelector('#heroUnofficialNote');
        const link = document.querySelector('#heroOfficialLink');
        const title = document.querySelector('.hero-title');
        const descriptor = document.querySelector('.pyoko-descriptor').getBoundingClientRect();
        const qualifier = document.querySelector('.pyoko-descriptor-qualifier').getBoundingClientRect();
        const hop = document.querySelector('.hero-hop');
        const hopBox = hop.getBoundingClientRect();
        const product = document.querySelector('.hero-product-group').getBoundingClientRect();
        const wordmark = document.querySelector('.pyoko-wordmark').getBoundingClientRect();
        const languageSwitch = document.querySelector('.hero .language-switch').getBoundingClientRect();
        const styles = element => {
          const computed = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return {
            fontSize: parseFloat(computed.fontSize),
            fontWeight: parseInt(computed.fontWeight, 10),
            color: computed.color,
            top: rect.top,
            bottom: rect.bottom,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          };
        };
        return {
          meta: styles(meta),
          edition: styles(edition),
          provenance: styles(provenance),
          link: styles(link),
          titleBottom: title.getBoundingClientRect().bottom,
          descriptor: { top: descriptor.top, bottom: descriptor.bottom, height: descriptor.height },
          qualifier: { top: qualifier.top, bottom: qualifier.bottom },
          hop: { top: hopBox.top, bottom: hopBox.bottom, ariaHidden: hop.getAttribute('aria-hidden') },
          product: { top: product.top, bottom: product.bottom },
          heroChildren: [...document.querySelector('.hero-inner').children].map(element => element.className),
          heroHeight: document.querySelector('.hero').getBoundingClientRect().height,
          wordmark: { left: wordmark.left, right: wordmark.right, top: wordmark.top, bottom: wordmark.bottom },
          languageSwitch: { left: languageSwitch.left, right: languageSwitch.right, top: languageSwitch.top, bottom: languageSwitch.bottom },
          metaDirection: getComputedStyle(document.querySelector('.pass-meta')).flexDirection,
          unofficialFlexBasis: getComputedStyle(document.querySelector('.pyoko-unofficial')).flexBasis,
          officialClass: link.getAttribute('class') || '',
          languageButtons: [...document.querySelectorAll('.hero .language-switch button')].map(button => ({
            left: button.getBoundingClientRect().left,
            right: button.getBoundingClientRect().right,
            whiteSpace: getComputedStyle(button).whiteSpace,
            labels: [...button.querySelectorAll('span')]
              .filter(label => getComputedStyle(label).display !== 'none')
              .map(label => {
                const rect = label.getBoundingClientRect();
                return {
                  left: rect.left,
                  right: rect.right,
                  height: rect.height,
                  lineHeight: parseFloat(getComputedStyle(label).lineHeight),
                };
              }),
          })),
        };
      });

      expect(metrics.edition.fontSize).toBeGreaterThanOrEqual(metrics.provenance.fontSize);
      expect(metrics.edition.fontWeight).toBeLessThan(700);
      expect(metrics.edition.color).toBe(metrics.provenance.color);
      expect(metrics.link.color).toBe(metrics.provenance.color);
      expect(metrics.link.fontWeight).toBeLessThan(700);
      expect(metrics.officialClass).not.toMatch(/(?:primary|cta|button)/i);
      expect(metrics.heroChildren).toEqual(['hero-topline', 'pyoko-descriptor', 'hero-hop', 'hero-product-group']);
      expect(metrics.hop.ariaHidden).toBe('true');
      expect(metrics.qualifier.top).toBeLessThanOrEqual(metrics.descriptor.bottom + 1);
      expect(metrics.qualifier.bottom).toBeGreaterThanOrEqual(metrics.descriptor.top - 1);
      expect(metrics.hop.top).toBeGreaterThan(metrics.descriptor.bottom);
      expect(metrics.product.top).toBeGreaterThan(metrics.hop.bottom);
      const wordmarkLanguageOverlap = metrics.wordmark.left < metrics.languageSwitch.right
        && metrics.wordmark.right > metrics.languageSwitch.left
        && metrics.wordmark.top < metrics.languageSwitch.bottom
        && metrics.wordmark.bottom > metrics.languageSwitch.top;
      expect(wordmarkLanguageOverlap).toBe(false);
      if (width <= 640) expect(metrics.unofficialFlexBasis).toBe('auto');
      metrics.languageButtons.forEach(button => {
        expect(button.whiteSpace).toBe('nowrap');
        button.labels.forEach(label => {
          expect(label.height).toBeLessThanOrEqual(label.lineHeight * 1.5 + 1);
          expect(label.left).toBeGreaterThanOrEqual(button.left - 1);
          expect(label.right).toBeLessThanOrEqual(button.right + 1);
        });
      });
      expect(metrics.meta.top).toBeGreaterThanOrEqual(metrics.titleBottom);
      expect(metrics.metaDirection).toBe('row');
      expect(metrics.meta.scrollWidth).toBeLessThanOrEqual(metrics.meta.clientWidth + 1);
      await assertNoHorizontalOverflow(page);
    }
  }

  await assertNoBrowserErrors(page);
});

test('P1 locale metadata and install identity follow the active language', async ({ page }) => {
  const expected = {
    ja: {
      title: '東京・ミュージアム ぐるっとパス2026 非公式ガイド | PYOKO',
      description: '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきでまとめて確認。気になる施設を保存して、地図や訪問記録から次の一館を決められる非公式ガイドです。',
      social: '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきで確認。施設を保存し、地図や訪問記録から次の一館を決められる非公式ガイド。'
    },
    en: {
      title: 'Tokyo Museum Grutto Pass 2026 Unofficial Guide | PYOKO',
      description: "See what's open, which exhibitions are covered by the Grutto Pass, and the reference value of each benefit — with sources and verification dates. Save places and use the map and visit history to decide where to go next. Unofficial guide.",
      social: "See what's open, which Grutto Pass exhibitions are covered, and each benefit's reference value — with sources and verification dates. Save places and decide where to go next. Unofficial guide."
    },
    zh: {
      title: '东京·博物馆 Grutto Pass 2026 非官方指南 | PYOKO',
      description: '查看场馆开放状态、Grutto Pass 对象展览与优惠内容，每条信息均标注官方出处和核验日期。收藏想去的场馆，结合地图与到访记录决定下一站。非官方指南。',
      social: '查看开放状态、Grutto Pass 对象展览和优惠内容，参考官方出处与核验日期；收藏场馆，结合地图和到访记录决定下一站。非官方指南。'
    }
  };

  for (const language of LANGUAGES) {
    await preparePage(page, language, { skipDateTime: true });
    const metadata = await page.evaluate(async () => {
      const content = selector => document.querySelector(selector)?.getAttribute('content') || '';
      const manifestLink = document.querySelector('link[rel="manifest"]');
      const manifest = manifestLink ? await fetch(manifestLink.href).then(response => response.json()) : null;
      return {
        lang: document.documentElement.lang,
        title: document.title,
        description: content('meta[name="description"]'),
        ogTitle: content('meta[property="og:title"]'),
        ogDescription: content('meta[property="og:description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        ogUrl: content('meta[property="og:url"]'),
        ogImage: content('meta[property="og:image"]'),
        twitterTitle: content('meta[name="twitter:title"]'),
        twitterDescription: content('meta[name="twitter:description"]'),
        twitterImage: content('meta[name="twitter:image"]'),
        manifestHref: manifestLink?.getAttribute('href') || '',
        manifest
      };
    });

    expect(metadata.lang).toBe(language);
    expect(metadata.title).toBe(expected[language].title);
    expect(metadata.title).not.toContain('2027');
    expect(metadata.description).toBe(expected[language].description);
    expect(metadata.ogTitle).toBe(expected[language].title);
    expect(metadata.ogDescription).toBe(expected[language].social);
    expect(metadata.twitterTitle).toBe(expected[language].title);
    expect(metadata.twitterDescription).toBe(expected[language].social);
    expect(metadata.canonical).toBe('https://pyoko.jp/');
    expect(metadata.ogUrl).toBe(metadata.canonical);
    expect(metadata.ogImage).toBe('https://pyoko.jp/assets/social/grutto-pass-share.png');
    expect(metadata.twitterImage).toBe(metadata.ogImage);
    expect(metadata.manifestHref).toBe('/manifest.json');
    expect(metadata.manifest).toMatchObject({
      name: 'PYOKO for Tokyo Museum Grutto Pass',
      short_name: 'PYOKO',
      display: 'standalone',
      theme_color: '#143D33',
      background_color: '#F5F5F1'
    });
  }

  await assertNoBrowserErrors(page);
});

test('P1 browser title follows locale changes without the Pass final-use deadline', async ({ page }) => {
  const expectedTitles = {
    ja: '東京・ミュージアム ぐるっとパス2026 非公式ガイド | PYOKO',
    en: 'Tokyo Museum Grutto Pass 2026 Unofficial Guide | PYOKO',
    zh: '东京·博物馆 Grutto Pass 2026 非官方指南 | PYOKO'
  };

  await preparePage(page, 'ja', { skipDateTime: true });
  for (const language of ['ja', 'en', 'zh']) {
    if (language !== 'ja') await setLanguage(page, language);
    await expect(page).toHaveTitle(expectedTitles[language]);
    await expect(page).not.toHaveTitle(/2027|最終利用日|Last use date|最晚使用日/);
  }
  await assertNoBrowserErrors(page);
});

test('P1 pass ownership keeps Hero quiet and My Pass complete', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page, 'ja');

  const heroText = await page.locator('.hero').innerText();
  expect(heroText).toContain('ぐるっとパスで、次はどこへ。');
  expect(heroText).toContain('2026年版');
  expect(heroText).toContain('非公式');
  const lastUpdated = await page.evaluate(() => CONFIG.lastUpdated);
  const [, month, day] = lastUpdated.split('-');
  expect(heroText).toContain(`${Number(month)}月${Number(day)}日更新`);
  expect(heroText).toContain('購入・最新情報は公式サイトへ');
  expect(heroText).not.toContain('PASS 2026');
  expect(heroText).not.toContain('2,500');
  expect(heroText).not.toContain('2027');

  await clickInputLabel(page, '#card-1 [data-visited-toggle="1"]');
  await expect(page.locator('#passTrackerEntrySummary')).toContainText('訪問済み 1施設');
  // Visiting proves attendance, not what was paid, so the entry states the
  // reference-value model rather than an amount the visitor saved.
  await expect(page.locator('#passTrackerEntryState')).toContainText('参考価値であと2,200円');

  await page.locator('#passTrackerChip').click();
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#passPriceSummary')).toHaveText('2,500円');
  // The two-month-from-first-use rule is the product rule; CONFIG.passEnd is
  // shown only as an explicitly edition-level final-use date, never a personal
  // expiry.
  await expect(page.locator('#passTrackerValidity')).toContainText('初回利用から2か月');
  await expect(page.locator('#passTrackerEditionFinal')).toContainText('2026年度 最終利用日 2027年3月31日');
  await assertNoBrowserErrors(page);
});

test('P1 facility identity keeps catalog numbers aligned without shrinking the hit target', async ({ page }) => {
  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await preparePage(page, 'ja');
    // The current source has 107 official numbers and 108 app cards because
    // No.103 is intentionally one combined card. Use the highest real number
    // present rather than inventing a No.108 identity in a presentation test.
    for (const key of ['1', '9', '52', '101', '107']) {
      const number = page.locator(`#card-${key} .card-no`);
      const title = page.locator(`#card-${key} .card-title-button`);
      await expect(number).toBeVisible();
      await expect(title).toBeVisible();
      const metrics = await page.locator(`#card-${key}`).evaluate(card => {
        const numberElement = card.querySelector('.card-no');
        const titleElement = card.querySelector('.card-title-button');
        const statusElement = card.querySelector('.status-container');
        const numberRect = numberElement.getBoundingClientRect();
        const titleRect = titleElement.getBoundingClientRect();
        const hitStyle = getComputedStyle(titleElement, '::before');
        return {
          number: {
            top: numberRect.top,
            right: numberRect.right,
            scrollWidth: numberElement.scrollWidth,
            clientWidth: numberElement.clientWidth,
            whiteSpace: getComputedStyle(numberElement).whiteSpace,
          },
          title: {
            top: titleRect.top,
            left: titleRect.left,
            paddingTop: getComputedStyle(titleElement).paddingTop,
            paddingBottom: getComputedStyle(titleElement).paddingBottom,
            height: titleRect.height,
            hitTop: parseFloat(hitStyle.top),
            hitBottom: parseFloat(hitStyle.bottom),
          },
          statusZIndex: statusElement ? getComputedStyle(statusElement).zIndex : 'auto',
        };
      });
      expect(Math.abs(metrics.number.top - metrics.title.top)).toBeLessThanOrEqual(8);
      expect(metrics.title.left).toBeGreaterThanOrEqual(metrics.number.right);
      expect(metrics.number.whiteSpace).toBe('nowrap');
      expect(metrics.number.scrollWidth).toBeLessThanOrEqual(metrics.number.clientWidth + 1);
      expect(metrics.title.paddingTop).toBe('0px');
      expect(metrics.title.paddingBottom).toBe('0px');
      expect(metrics.title.height - metrics.title.hitTop - metrics.title.hitBottom).toBeGreaterThanOrEqual(44);
      expect(metrics.statusZIndex).toBe('1');
    }
  }
  await assertNoBrowserErrors(page);
});

test('P0 Access and Summary production cases remain visible in the rendered Drawer', async ({ page }) => {
  // This intentionally broad production matrix opens several detail surfaces
  // across three locales; keep its release gate independent from the default
  // per-test timeout while retaining the same assertions.
  test.setTimeout(60_000);
  await preparePage(page, 'ja');
  const browseIntro = page.locator('#card-52 .facility-discovery-preview');
  await expect(browseIntro).toContainText('夏目漱石が暮らし、執筆した');
  await expect(browseIntro).not.toContainText('夏目漱石が晩年を過ごし');
  await openDrawer(page, '52');
  const access52 = page.locator('#facilityDrawerBody .facility-detail-section--access .visit-info-content p');
  await expect(access52).toHaveCount(3);
  await expect(access52).toContainText(['早稲田駅', '牛込柳町駅', '牛込保健センター前']);
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('10');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('15');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('2');
  await expect(page.locator('#facilityDrawerBody .facility-intro-body')).toContainText('夏目漱石が暮らし、執筆した');
  await expect(page.locator('#facilityDrawerBody .pass-benefit')).toBeVisible();
  await closeDrawer(page);

  await openDrawer(page, '18');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('半蔵門線');
  await closeDrawer(page);
  await openDrawer(page, '87');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('調布駅');
  await closeDrawer(page);
  await openDrawer(page, '97');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toContainText('創価大学正門/東京富士美術館');
  await expect(page.locator('#facilityDrawerBody .facility-detail-section--access')).toHaveText(/創価大学正門\/東京富士美術館/);
  await closeDrawer(page);
  await openDrawer(page, '20');
  const access20 = page.locator('#facilityDrawerBody .facility-detail-section--access');
  await expect(access20).toContainText('直結');
  await expect(access20).not.toContainText('徒歩0分');
  await closeDrawer(page);

  await openDrawer(page, '50');
  await expect(page.locator('#facilityDrawerBody .facility-intro-body')).toContainText('地域総合文学館');
  await expect(page.locator('#facilityDrawerBody .facility-intro-source')).toHaveCount(0);
  await closeDrawer(page);
  await openDrawer(page, '103');
  await expect(page.locator('#facilityDrawerBody .facility-intro-source')).toHaveCount(0);
  await expect(page.locator('#facilityDrawerBody .facility-intro-body strong')).toHaveCount(2);
  await closeDrawer(page);

  await setLanguage(page, 'en');
  await openDrawer(page, '52');
  const accessEn = await page.locator('#facilityDrawerBody .facility-detail-section--access').innerText();
  expect(accessEn).toMatch(/Waseda Station|Ushigome-yanagicho Station/i);
  expect(accessEn).not.toMatch(/[\u3040-\u30ff]/);
  await closeDrawer(page);
  await setLanguage(page, 'zh');
  await openDrawer(page, '52');
  const accessZh = await page.locator('#facilityDrawerBody .facility-detail-section--access').innerText();
  expect(accessZh).toMatch(/早稻田站|牛込柳町站/);
  expect(accessZh).not.toMatch(/[\u3040-\u30ff]/);
  await assertNoLeakedValues(page);
  await assertNoBrowserErrors(page);
});

test('P0 status and exhibition relevance follow deterministic selected dates', async ({ page }) => {
  await preparePage(page, 'ja', { date: '2026-08-01', time: '10:00' });
  await openDrawer(page, '2');
  await expect(page.locator('#facilityDrawerBody .enriched-group--ongoing .enriched-item')).toHaveCount(1);
  await expect(page.locator('#facilityDrawerBody .enriched-group--upcoming .enriched-item')).toHaveCount(1);
  await expect(page.locator('#facilityDrawerBody .enriched-group--ongoing .enriched-group-heading')).toHaveText('開催中');
  await expect(page.locator('#facilityDrawerBody .enriched-group--upcoming .enriched-group-heading')).toHaveText('近日開催');
  await closeDrawer(page);

  await setDateTime(page, '2026-08-13', '10:00');
  await openDrawer(page, '2');
  await expect(page.locator('#facilityDrawerBody .enriched-group--ongoing .enriched-item')).toHaveCount(0);
  const upcoming = page.locator('#facilityDrawerBody .enriched-group--upcoming .enriched-item');
  await expect(upcoming).toHaveCount(2);
  await expect(upcoming).toContainText([
    '第39回 日本の自然を描く展',
    'シンシナティ美術館展 アメリカに渡ったヨーロッパの至宝'
  ]);
  await closeDrawer(page);

  // No.8 has a real exhibition ending on 2026-08-11. On the next selected
  // date it must not remain in the default detail view.
  await openDrawer(page, '8');
  const expiredNo8 = page.locator('#facilityDrawerBody .enriched-item[data-valid-to="2026-08-11"]');
  await expect(expiredNo8).toBeHidden();
  await expect(page.locator('#facilityDrawerBody .enriched-item:visible')).toHaveCount(1);
  await closeDrawer(page);

  await setDateTime(page, '2026-08-12', '08:00');
  await expect(page.locator('#card-4')).toHaveAttribute('data-now-state', 'before');
  await setDateTime(page, '2026-08-12', '16:00');
  await expect(page.locator('#card-4')).toHaveAttribute('data-now-state', 'lastcall');
  await setDateTime(page, '2026-08-12', '17:15');
  await expect(page.locator('#card-4')).toHaveAttribute('data-now-state', 'after');
  await setDateTime(page, '2026-08-12', '12:00');
  await expect(page.locator('#card-97')).toHaveAttribute('data-now-state', 'longclosed');
  await assertNoBrowserErrors(page);
});

for (const [width, height] of [[320, 800], [375, 812], [390, 844]]) {
  test(`P1 mobile List/Map controls and key states stay within ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await preparePage(page, 'ja');
    await expect(page.locator('.hero .language-switch')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('#passEdition')).toBeVisible();
    await expect(page.locator('#listToggleBtn')).toBeVisible();
    await expect(page.locator('#mapToggleBtn')).toBeVisible();
    await assertNoHorizontalOverflow(page);

    const labelHeights = await page.locator('#listToggleBtn span, #mapToggleBtn span').evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      return { height: element.getBoundingClientRect().height, lineHeight: parseFloat(style.lineHeight) };
    }));
    labelHeights.forEach(({ height, lineHeight }) => expect(height).toBeLessThanOrEqual(lineHeight * 1.5 + 1));

    await page.locator('#filterToggleBtn').click();
    await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
    await assertNoHorizontalOverflow(page);
    await page.locator('#filtersApplyButton').click();

    await openDrawer(page, '50');
    await assertNoHorizontalOverflow(page);
    await expect(page.locator('#facilityDrawer .facility-drawer-close')).toBeVisible();
    await expect(page.locator('#facilityDrawer .facility-drawer-body')).toBeVisible();
    await closeDrawer(page);

    await clickInputLabel(page, '#card-52 [data-visited-toggle="52"]');
    await page.locator('#passTrackerChip').click();
    await expect(page.locator('#passTracker')).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await assertNoBrowserErrors(page);
  });
}

test('P1 long facility numbers and mobile Drawer copy do not clip or overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await preparePage(page, 'ja');
  for (const key of ['2', '52', '101', '107']) {
    const number = page.locator(`#card-${key} .card-no`);
    await expect(number).toBeVisible();
    const metrics = await number.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      whiteSpace: getComputedStyle(element).whiteSpace,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
    expect(metrics.whiteSpace).toBe('nowrap');
  }
  await openDrawer(page, '50');
  await assertNoHorizontalOverflow(page);
  const drawerMetrics = await page.locator('#facilityDrawer .facility-drawer-body').evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
  }));
  expect(drawerMetrics.scrollWidth).toBeLessThanOrEqual(drawerMetrics.clientWidth + 1);
  expect(drawerMetrics.scrollHeight).toBeGreaterThan(drawerMetrics.clientHeight);
  await closeDrawer(page);
  await assertNoBrowserErrors(page);
});

test('P1 Map and its selection surface retain usable dimensions at every width', async ({ page }) => {
  // The selection surface is width-dependent: the split Detail panel on
  // desktop, the in-canvas preview below it. Both must stay usable.
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 900 });
    await preparePage(page, 'ja');
    await openDrawer(page, '52');
    await page.locator('#facilityDrawerBody [data-map-focus="52"]').click();
    await expect(page.locator('#mapView')).toBeVisible();
    const splitView = width >= 1200;
    const selectionSurface = page.locator(splitView ? '#mapFacilityPanel' : '#mapSelectionPreview');
    await expect(selectionSurface).toBeVisible();
    if (!splitView) await expect(page.locator('#mapFacilityPanel')).toBeHidden();
    const mapBox = await page.locator('#mapCanvas').boundingBox();
    const surfaceBox = await selectionSurface.boundingBox();
    expect(mapBox?.width || 0).toBeGreaterThan(0);
    expect(mapBox?.height || 0).toBeGreaterThan(0);
    expect(surfaceBox?.width || 0).toBeGreaterThan(0);
    expect(surfaceBox?.height || 0).toBeGreaterThan(0);
    await assertNoHorizontalOverflow(page);
  }
  await assertNoBrowserErrors(page);
});

test('P1 keyboard activation, focus trap, focus return, and primary names work', async ({ page }) => {
  await preparePage(page, 'ja');
  const trigger = page.locator('#card-52 .card-title-button');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#facilityDrawer')).toBeVisible();

  const visibleFocusables = page.locator('#facilityDrawer .facility-drawer-panel button:visible, #facilityDrawer .facility-drawer-panel a:visible');
  const firstFocusable = visibleFocusables.first();
  const lastFocusable = visibleFocusables.last();
  await lastFocusable.focus();
  await page.keyboard.press('Tab');
  await expect(firstFocusable).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(lastFocusable).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(trigger).toBeFocused();

  await expect(page.locator('#searchInput')).toHaveAttribute('id', 'searchInput');
  await expect.poll(() => page.locator('#searchInput').evaluate(element => element.labels?.length || 0)).toBeGreaterThan(0);
  await expect(page.locator('#filterToggleBtn')).toHaveAttribute('aria-controls', 'filtersPanel');
  await expect(page.locator('#listToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#mapToggleBtn')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hero .language-switch')).toHaveAttribute('role', 'group');
  await expect(page.locator('#card-52 [data-visited-toggle="52"]')).toHaveAttribute('aria-label', /.+/);

  await page.locator('#filterToggleBtn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await page.keyboard.press('Enter');
  await expect(page.locator('#filtersPanel')).not.toHaveClass(/open/);
  await expect(page.locator('#filterToggleBtn')).toBeFocused();

  await page.locator('#mapToggleBtn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveClass(/map-active/);
  await expect(page.locator('#mapView')).toBeVisible();
  await page.locator('#listToggleBtn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).not.toHaveClass(/map-active/);
  await assertNoBrowserErrors(page);
});
