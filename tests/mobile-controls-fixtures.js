const { expect } = require('@playwright/test');
const {
  assertNoBrowserErrors,
  assertNoHorizontalOverflow,
  preparePage,
} = require('./release-fixtures');

const MOBILE_LANGUAGES = [
  {
    code: 'ja',
    dateLabel: '日付：',
    timeLabel: '時刻：',
    useNowLabel: '現在に戻す',
    dateTimeTitle: '日付と時刻',
    doneLabel: '完了',
    listName: 'リスト',
    mapName: 'マップ',
    openSearchName: '検索・条件を開く',
    condition: '8/13 · 17:53',
  },
  {
    code: 'en',
    dateLabel: 'Date:',
    timeLabel: 'Time:',
    useNowLabel: 'Use current time',
    dateTimeTitle: 'Date & time',
    doneLabel: 'Done',
    listName: 'List',
    mapName: 'Map',
    openSearchName: 'Open search and conditions',
    condition: 'Aug 13 · 17:53',
  },
  {
    code: 'zh',
    dateLabel: '日期：',
    timeLabel: '时间：',
    useNowLabel: '回到现在',
    dateTimeTitle: '日期与时间',
    doneLabel: '完成',
    listName: '列表',
    mapName: '地图',
    openSearchName: '打开搜索与条件',
    condition: '8/13 · 17:53',
  },
];
const MOBILE_LAYOUT_CASES = [
  { language: MOBILE_LANGUAGES[0], width: 320 },
  { language: MOBILE_LANGUAGES[0], width: 375 },
  { language: MOBILE_LANGUAGES[0], width: 390 },
  { language: MOBILE_LANGUAGES[0], width: 430 },
  { language: MOBILE_LANGUAGES[1], width: 390 },
  { language: MOBILE_LANGUAGES[2], width: 390 },
];
const CHROMIUM_LAYOUT_CASES = [
  ...MOBILE_LAYOUT_CASES,
  { language: MOBILE_LANGUAGES[1], width: 320 },
  { language: MOBILE_LANGUAGES[2], width: 320 },
  { language: MOBILE_LANGUAGES[1], width: 430 },
];
const LIVE_CLOCK = new Date('2026-08-13T08:53:00.000Z');

async function measureDiscoveryControls(page) {
  return page.evaluate(() => {
    const toBox = element => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible: Boolean(
          rect.width && rect.height
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number(style.opacity) !== 0,
        ),
      };
    };
    const box = selector => toBox(document.querySelector(selector));
    const quickFilters = document.querySelector('.quick-filters');
    const accessibleName = selector => {
      const element = document.querySelector(selector);
      if (!element) return '';
      const label = element.getAttribute('aria-label');
      if (label) return label;
      const labelledBy = element.getAttribute('aria-labelledby');
      if (labelledBy) return document.getElementById(labelledBy)?.textContent.trim() || '';
      return element.textContent.trim();
    };
    return {
      compact: Boolean(document.querySelector('.controls-wrap')?.classList.contains('is-compact')),
      controls: box('.controls-wrap'),
      search: box('#searchInput'),
      compactTrigger: box('#compactControlsTrigger'),
      compactTriggerName: accessibleName('#compactControlsTrigger'),
      summary: box('#dateTimeSummary'),
      summaryText: document.getElementById('dateTimeSummaryValue')?.textContent || '',
      summaryName: accessibleName('#dateTimeSummary'),
      summaryExpanded: document.getElementById('dateTimeSummary')?.getAttribute('aria-expanded') || '',
      filter: box('#filterToggleBtn'),
      filterName: accessibleName('#filterToggleBtn'),
      filterCount: box('#filterCount'),
      viewSwitch: box('.view-switch'),
      list: box('#listToggleBtn'),
      listName: accessibleName('#listToggleBtn'),
      map: box('#mapToggleBtn'),
      mapName: accessibleName('#mapToggleBtn'),
      quick: box('.quick-filters'),
      quickItems: [...document.querySelectorAll('.quick-filter-toggle')].map(toBox),
      quickScroll: quickFilters
        ? { scrollWidth: quickFilters.scrollWidth, clientWidth: quickFilters.clientWidth }
        : null,
      dateInput: box('#targetDate'),
      timeInput: box('#targetTime'),
      nowButton: box('#targetTimeNow'),
      panel: box('#dateTimePanel'),
      panelOpen: Boolean(document.getElementById('dateTimePanel')?.classList.contains('open')),
      panelRole: document.getElementById('dateTimePanel')?.getAttribute('role') || '',
      panelInert: document.getElementById('dateTimePanel')?.hasAttribute('inert') || false,
      liveTimeMode: typeof window.isLiveTimeMode === 'function' ? window.isLiveTimeMode() : null,
    };
  });
}

function assertNoOverlap(left, right, gap = 0) {
  expect(left.right + gap).toBeLessThanOrEqual(right.left + 0.5);
}

function assertTouchTarget(box) {
  expect(box.visible).toBe(true);
  expect(box.width).toBeGreaterThanOrEqual(43.5);
  expect(box.height).toBeGreaterThanOrEqual(43.5);
}

// The browse state is Search, one condition/action row, then quick filters.
// Native date and time fields belong to the Date & time edit state only.
async function assertMobileBrowseComposition(page, language, width) {
  await page.setViewportSize({ width, height: 844 });
  await preparePage(page, language.code, { skipDateTime: true });
  const geometry = await measureDiscoveryControls(page);

  expect(geometry.compact).toBe(false);
  expect(geometry.search.visible).toBe(true);
  expect(geometry.summary.visible).toBe(true);
  expect(geometry.filter.visible).toBe(true);
  expect(geometry.list.visible).toBe(true);
  expect(geometry.map.visible).toBe(true);
  expect(geometry.quick.visible).toBe(true);
  expect(geometry.compactTrigger.visible).toBe(false);

  // Editing-only controls are not part of the browse toolbar.
  expect(geometry.dateInput.visible).toBe(false);
  expect(geometry.timeInput.visible).toBe(false);
  expect(geometry.nowButton.visible).toBe(false);
  expect(geometry.panelOpen).toBe(false);

  // Row 1 search, row 2 conditions and view, row 3 quick filters.
  expect(geometry.search.bottom).toBeLessThanOrEqual(geometry.summary.top + 0.5);
  expect(geometry.summary.top).toBeCloseTo(geometry.filter.top, 0);
  expect(geometry.summary.top).toBeCloseTo(geometry.viewSwitch.top, 0);
  assertNoOverlap(geometry.summary, geometry.filter, 4);
  assertNoOverlap(geometry.filter, geometry.viewSwitch, 4);
  expect(geometry.quick.top).toBeGreaterThanOrEqual(geometry.viewSwitch.bottom - 0.5);
  expect(geometry.quick.left).toBeCloseTo(geometry.search.left, 0);
  expect(geometry.quick.right).toBeCloseTo(geometry.search.right, 0);

  // No sibling control may cover or clip a quick filter; overflow scrolls.
  expect(geometry.quickItems.length).toBe(3);
  for (const item of geometry.quickItems) {
    expect(item.top).toBeGreaterThanOrEqual(geometry.viewSwitch.bottom - 0.5);
    expect(item.height).toBeGreaterThan(0);
  }
  expect(geometry.quickScroll.scrollWidth).toBeGreaterThanOrEqual(geometry.quickScroll.clientWidth);

  assertTouchTarget(geometry.summary);
  assertTouchTarget(geometry.list);
  assertTouchTarget(geometry.map);
  expect(geometry.filter.height).toBeGreaterThanOrEqual(43.5);

  // Icon-only view controls keep their localized accessible names.
  expect(geometry.listName).toBe(language.listName);
  expect(geometry.mapName).toBe(language.mapName);
  expect(geometry.summaryName).toContain(geometry.summaryText);

  await assertNoHorizontalOverflow(page);
  return geometry;
}

// The scrolled state must be one real toolbar row of direct actions.
async function assertCompactToolbarRow(page, language, width) {
  await page.setViewportSize({ width, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator('.controls-wrap')).toHaveClass(/is-compact/);
  const geometry = await measureDiscoveryControls(page);

  expect(geometry.search.visible).toBe(false);
  expect(geometry.quick.visible).toBe(false);
  expect(geometry.compactTrigger.visible).toBe(true);
  expect(geometry.summary.visible).toBe(true);
  expect(geometry.filter.visible).toBe(true);
  expect(geometry.list.visible).toBe(true);
  expect(geometry.map.visible).toBe(true);

  for (const box of [geometry.summary, geometry.filter, geometry.list, geometry.map]) {
    expect(box.top).toBeCloseTo(geometry.compactTrigger.top, 0);
  }
  assertNoOverlap(geometry.compactTrigger, geometry.summary, 4);
  assertNoOverlap(geometry.summary, geometry.filter, 4);
  assertNoOverlap(geometry.filter, geometry.viewSwitch, 4);
  assertTouchTarget(geometry.compactTrigger);
  assertTouchTarget(geometry.summary);
  assertTouchTarget(geometry.list);
  assertTouchTarget(geometry.map);
  expect(geometry.compactTriggerName).toBe(language.openSearchName);
  expect(geometry.controls.height).toBeLessThan(72);

  await assertNoHorizontalOverflow(page);
  return geometry;
}

async function openDateTimeEditor(page) {
  await page.locator('#dateTimeSummary').click();
  await expect(page.locator('#dateTimePanel')).toHaveClass(/open/);
  await expect(page.locator('#targetDate')).toBeVisible();
  await expect(page.locator('#targetTime')).toBeVisible();
}

async function closeDateTimeEditor(page) {
  await page.locator('#dateTimeDoneButton').click();
  await expect(page.locator('#dateTimePanel')).not.toHaveClass(/open/);
}

module.exports = {
  CHROMIUM_LAYOUT_CASES,
  LIVE_CLOCK,
  MOBILE_LANGUAGES,
  MOBILE_LAYOUT_CASES,
  assertCompactToolbarRow,
  assertMobileBrowseComposition,
  assertNoBrowserErrors,
  closeDateTimeEditor,
  measureDiscoveryControls,
  openDateTimeEditor,
};
