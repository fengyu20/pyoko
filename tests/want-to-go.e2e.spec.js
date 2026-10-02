const { test, expect } = require('@playwright/test');
const {
  preparePage,
  openDrawer,
  closeDrawer,
  setLanguage,
  visibleCardCount,
  assertNoHorizontalOverflow,
  assertNoBrowserErrors,
  clickInputLabel,
} = require('./release-fixtures');

const cardBookmark = key => `#card-${key} .card-wanttoggle`;
const drawerWant = '#facilityDrawer .personal-action--want';
const drawerVisited = '#facilityDrawer .personal-action--visited';

async function openMyPass(page) {
  await page.locator('#passTrackerChip').click();
  await expect(page.locator('#passTracker')).toBeVisible();
}

async function closeMyPass(page) {
  await page.locator('#passTrackerClose').click();
  await expect(page.locator('#passTracker')).toBeHidden();
}

async function expectPassTrackerScrollRestored(page, requestedScrollTop) {
  const body = page.locator('#passTracker .my-pass-body');
  await expect.poll(async () => body.evaluate((node, requested) => {
    const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight);
    const expectedScrollTop = Math.min(Math.max(0, Number(requested)), maxScrollTop);
    return Math.abs(node.scrollTop - expectedScrollTop);
  }, requestedScrollTop), { timeout: 10_000 }).toBeLessThanOrEqual(1);
}

test('Card bookmark toggles Want to Go and persists across reload', async ({ page }) => {
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  const bookmark = page.locator(cardBookmark('2'));
  await bookmark.scrollIntoViewIfNeeded();
  await bookmark.click();
  await expect(bookmark).toHaveAttribute('aria-pressed', 'true');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  await expect(page.locator(cardBookmark('2'))).toHaveAttribute('aria-pressed', 'true');
});

test('Card → My Pass: bookmarking a card shows it in the Want-to-go list', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  await expect(page.locator(cardBookmark('2'))).toHaveAttribute('aria-pressed', 'true');

  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#wantToGoTabCount')).toHaveText('1');
  await expect(page.locator('#passWantToGoList .my-pass-want-item')).toHaveCount(1);
  await expect(page.locator('#passWantToGoList')).toContainText('上野の森美術館');
});

test('Detail personal Want-to-go action syncs back to the Card', async ({ page }) => {
  await preparePage(page, 'ja');
  await openDrawer(page, '2');
  await page.locator(drawerWant).click();
  await expect(page.locator(drawerWant)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#toast')).toContainText('「行きたい」に追加しました');
  await expect(page.locator('#toastAction')).toHaveText('リストを見る');
  await closeDrawer(page);
  await expect(page.locator(cardBookmark('2'))).toHaveAttribute('aria-pressed', 'true');
});

test('My Pass remove syncs back to the Card and manages focus', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  await openMyPass(page);
  const remove = page.locator('#passWantToGoList .my-pass-want-remove').first();
  await remove.click();
  await expect(page.locator('#passWantToGoList .my-pass-want-item')).toHaveCount(0);
  await expect(page.locator('#passNoWantToGo')).toBeVisible();
  await closeMyPass(page);
  await expect(page.locator(cardBookmark('2'))).toHaveAttribute('aria-pressed', 'false');
});

test('recording a visit clears Want to Go and the tab follows to Visited', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#passWantToGoList .my-pass-want-item')).toHaveCount(1);
  await closeMyPass(page);

  await openDrawer(page, '2');
  await page.locator(drawerVisited).click();
  await expect(page.locator(drawerVisited)).toHaveAttribute('aria-pressed', 'true');
  await closeDrawer(page);

  await openMyPass(page);
  // The Want-to-go item moved to Visited; with no Want-to-go items left, the
  // active tab follows to Visited.
  await expect(page.locator('#visitedTab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#passVisitedList .my-pass-visited-item')).toHaveCount(1);
  await expect(page.locator(cardBookmark('2'))).toHaveAttribute('aria-pressed', 'false');
});

test('Want-to-go-only filter shows only saved cards and Map consumes the same set', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  await page.locator(cardBookmark('3')).click();
  const total = await page.locator('#mainContent .card').count();

  await page.locator('#filterToggleBtn').click();
  await expect(page.locator('#filtersPanel')).toHaveClass(/open/);
  await clickInputLabel(page, 'input[name="visitedFilter"][value="want"]');
  await expect(page.locator('input[name="visitedFilter"][value="want"]')).toBeChecked();

  expect(await visibleCardCount(page)).toBe(2);
  const filteredKeys = await page.evaluate(() => (window.filteredCards || []).map(card => card.dataset.facilityKey).sort());
  expect(filteredKeys).toEqual(['2', '3']);
  expect(2).toBeLessThan(total);
});

test('responsive widths stay free of horizontal overflow with the bookmark present', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(80);
    await assertNoHorizontalOverflow(page);
  }
});

test('Want-to-go labels localize in JA / EN / ZH', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('2')).click();
  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toContainText('行きたい');
  await closeMyPass(page);

  await setLanguage(page, 'en');
  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toContainText('Want to go');
  await closeMyPass(page);

  await setLanguage(page, 'zh');
  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toContainText('想去');
  await closeMyPass(page);

  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * v96 Want-to-Go polish.
 * ---------------------------------------------------------------------- */

const WANT_ROWS = ['3', '30', '107'];

async function bookmarkAll(page, keys) {
  for (const key of keys) {
    const bookmark = page.locator(cardBookmark(key));
    await bookmark.scrollIntoViewIfNeeded();
    await bookmark.click();
    await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
  }
}

test('No.3 / No.30 / No.107 facility names share one horizontal start', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);
  await openMyPass(page);

  const rows = page.locator('#passWantToGoList .my-pass-want-item');
  await expect(rows).toHaveCount(3);

  const lefts = await page.locator('#passWantToGoList .my-pass-want-name')
    .evaluateAll(nodes => nodes.map(n => Math.round(n.getBoundingClientRect().left)));
  expect(lefts).toHaveLength(3);
  expect(new Set(lefts).size).toBe(1);

  // The identity column must actually fit "No. 107" — a clipped number would
  // align but lie.
  const overflow = await page.locator('#passWantToGoList .my-pass-facility-no')
    .evaluateAll(nodes => nodes.map(n => n.scrollWidth - n.clientWidth));
  expect(Math.max(...overflow)).toBeLessThanOrEqual(1);
  await assertNoBrowserErrors(page);
});

test('the Want-list name button shows no native browser chrome', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, ['3']);
  await openMyPass(page);

  const style = await page.locator('#passWantToGoList .my-pass-want-name').first().evaluate(node => {
    const s = getComputedStyle(node);
    return {
      appearance: s.appearance,
      borderTopWidth: s.borderTopWidth,
      borderTopStyle: s.borderTopStyle,
      background: s.backgroundColor,
      paddingTop: s.paddingTop,
      paddingLeft: s.paddingLeft,
      textAlign: s.textAlign,
      tag: node.tagName
    };
  });
  // Still a real button for keyboard / AT …
  expect(style.tag).toBe('BUTTON');
  // … with the UA control chrome fully reset.
  expect(style.appearance).toBe('none');
  expect(style.borderTopWidth).toBe('0px');
  expect(style.background).toBe('rgba(0, 0, 0, 0)');
  expect(style.paddingTop).toBe('0px');
  expect(style.paddingLeft).toBe('0px');
  expect(style.textAlign).toBe('left');
  await assertNoBrowserErrors(page);
});

test('Want list has no horizontal overflow across the responsive range', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);
  for (const width of [320, 375, 390, 430, 500, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openMyPass(page);
    await assertNoHorizontalOverflow(page);
    const lefts = await page.locator('#passWantToGoList .my-pass-want-name')
      .evaluateAll(nodes => nodes.map(n => Math.round(n.getBoundingClientRect().left)));
    expect(new Set(lefts).size, `names misaligned at ${width}px`).toBe(1);
    await closeMyPass(page);
  }
  await assertNoBrowserErrors(page);
});

test('a Want-list row opens the shared Facility Detail; removing does not', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, ['3', '30']);
  await openMyPass(page);

  // Row → inspect one facility.
  await page.locator('#passWantToGoList .my-pass-want-name').first().click();
  await expect(page.locator('#passTracker')).toBeHidden();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  // Closing returns to the parent Pass Tracker, not to Browse (see below).
  await closeDrawer(page);
  await expect(page.locator('#passTracker')).toBeVisible();

  // Remove → stays in the list, never opens Detail.
  await page.locator('#passWantToGoList .my-pass-want-remove').first().click();
  await expect(page.locator('#passWantToGoList .my-pass-want-item')).toHaveCount(1);
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(page.locator('#passTracker')).toBeVisible();
  await assertNoBrowserErrors(page);
});

/* -------------------------------------------------------------------------
 * v97 — state invariant, return context, and feedback.
 * ---------------------------------------------------------------------- */

const wantIsSet = (page, key) => page.evaluate(k => window.__wantState(k), key);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__wantState = key => ({
      want: window.isWantToGo?.(key) ?? null,
      visited: window.isVisited?.(key) ?? null
    });
  });
});

test('Visited → Want is refused: the two states can never coexist', async ({ page }) => {
  await preparePage(page, 'ja');
  const { drawer } = await openDrawer(page, '3');
  await drawer.locator('.personal-action--visited').click();
  await expect(drawer.locator('.personal-action--visited')).toHaveAttribute('aria-pressed', 'true');

  // The planning affordance is hidden, not left visible and silently inert.
  await expect(drawer.locator('.personal-action--want')).toBeHidden();
  await closeDrawer(page);
  await expect(page.locator(cardBookmark('3'))).toBeHidden();

  // Even driven directly, the state layer refuses the invalid pair.
  await page.evaluate(() => window.setWantToGo('3', true));
  expect(await page.evaluate(() => window.__wantState('3'))).toEqual({ want: false, visited: true });
});

test('Want → Visited clears the plan; un-visiting does not resurrect it', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('3')).click();
  expect(await wantIsSet(page, '3')).toEqual({ want: true, visited: false });

  await openDrawer(page, '3');
  await page.locator(drawerVisited).click();
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: true });

  // Un-visit → both false. The Want action becomes available again, but the
  // earlier plan is not restored.
  await page.locator(drawerVisited).click();
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: false });
  await expect(page.locator(drawerWant)).toBeVisible();
  await closeDrawer(page);
});

test('legacy storage holding both states is normalized on load', async ({ page }) => {
  await page.goto('/index.html?lang=ja', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);
  await page.evaluate(() => {
    localStorage.setItem(window.visitedStorageKey(), JSON.stringify({ visited: ['3', '30'] }));
    // Invalid pair an older build could produce via Visited → Want.
    localStorage.setItem(window.wantToGoStorageKey(), JSON.stringify({ wantToGo: ['3', '107'] }));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#mainContent .card').count()).toBeGreaterThan(0);

  // No.3 was both → normalized to visited only. No.107 was only wanted → kept.
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: true });
  expect(await wantIsSet(page, '107')).toEqual({ want: true, visited: false });

  // The normalized state is persisted, not just corrected in memory.
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem(window.wantToGoStorageKey())).wantToGo);
  expect(stored).toEqual(['107']);

  // And no surface shows both states selected.
  await expect(page.locator(cardBookmark('3'))).toBeHidden();
});

test('Want → Detail → Close returns to the Pass Tracker Want tab', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);
  // More visited than saved, so a default-tab policy would land on Visited.
  await page.evaluate(() => ['5', '7', '8', '9'].forEach(k => window.setVisited(k, true)));

  await openMyPass(page);
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#passWantToGoList [data-want-open="30"]').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();

  await closeDrawer(page);
  await expect(page.locator('#passTracker')).toBeVisible();
  // The parent context is reinstated: same tab, not the default-tab choice.
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#wantToGoPanel')).toBeVisible();
  // Focus lands back on the row we came from, never inside hidden content.
  await expect(page.locator('#passWantToGoList [data-want-open="30"]')).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('Escape from a Want-opened Detail follows the same return semantics', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);
  await openMyPass(page);
  await page.locator('#passWantToGoList [data-want-open="30"]').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await assertNoBrowserErrors(page);
});

test('Browse → Detail → Close still returns to Browse, not to My Pass', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, ['3']);
  await openDrawer(page, '30');
  await closeDrawer(page);
  await expect(page.locator('#passTracker')).toBeHidden();
  await assertNoBrowserErrors(page);
});

test('tracker scroll position is approximately restored', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await preparePage(page, 'ja');
  await page.evaluate(() => ['3', '5', '7', '8', '9', '14', '18', '20', '27', '30', '107']
    .forEach(k => window.setWantToGo(k, true)));
  await openMyPass(page);

  const body = page.locator('#passTracker .my-pass-body');
  await body.evaluate(node => { node.scrollTop = node.scrollHeight; });
  const before = await body.evaluate(node => node.scrollTop);
  expect(before).toBeGreaterThan(0);

  await page.locator('#passWantToGoList [data-want-open="107"]').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await closeDrawer(page);
  await expect(page.locator('#passTracker')).toBeVisible();
  await expectPassTrackerScrollRestored(page, before);
  await expect(page.locator('#passWantToGoList [data-want-open="107"]')).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('tracker scroll restoration also works with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await preparePage(page, 'ja');
  await page.evaluate(() => ['3', '5', '7', '8', '9', '14', '18', '20', '27', '30', '107']
    .forEach(k => window.setWantToGo(k, true)));
  await openMyPass(page);

  const body = page.locator('#passTracker .my-pass-body');
  await body.evaluate(node => { node.scrollTop = node.scrollHeight; });
  const before = await body.evaluate(node => node.scrollTop);
  expect(before).toBeGreaterThan(0);

  await page.locator('#passWantToGoList [data-want-open="107"]').click();
  await expect(page.locator('#facilityDrawer')).toBeVisible();
  await closeDrawer(page);
  await expect(page.locator('#passTracker')).toBeVisible();
  await expectPassTrackerScrollRestored(page, before);
  await expect(page.locator('#passWantToGoList [data-want-open="107"]')).toBeFocused();
  await assertNoBrowserErrors(page);
});

test('marking Visited inside a Want-opened Detail leaves no broken focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await preparePage(page, 'ja');
  await bookmarkAll(page, ['3', '5', '7', '8', '9', '14', '18', '20', '27', '30', '107']);
  await openMyPass(page);
  const body = page.locator('#passTracker .my-pass-body');
  await body.evaluate(node => { node.scrollTop = node.scrollHeight; });
  const before = await body.evaluate(node => node.scrollTop);
  expect(before).toBeGreaterThan(0);

  await page.locator('#passWantToGoList [data-want-open="30"]').click();
  await page.locator(drawerVisited).click();
  await closeDrawer(page);

  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  // No.30 left the list; focus falls back to a surviving row, not a dead node.
  await expect(page.locator('#passWantToGoList [data-want-open="30"]')).toHaveCount(0);
  await expectPassTrackerScrollRestored(page, before);
  const focusOk = await page.evaluate(() => {
    const active = document.activeElement;
    return Boolean(
      active
      && active !== document.body
      && active.matches('[data-want-open]')
      && active.getClientRects().length > 0
      && !active.hidden
    );
  });
  expect(focusOk).toBe(true);
  await assertNoBrowserErrors(page);
});

test('emptying Want while in Detail follows the existing tab transition', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, ['3']);
  await page.evaluate(() => window.setVisited('5', true));
  await openMyPass(page);
  await page.locator('#passWantToGoList [data-want-open="3"]').click();
  await page.locator(drawerVisited).click();
  await closeDrawer(page);

  await expect(page.locator('#passTracker')).toBeVisible();
  // Want is now empty and Visited is not, so the existing transition rule applies.
  await expect(page.locator('#visitedTab')).toHaveAttribute('aria-selected', 'true');
  await assertNoBrowserErrors(page);
});

test('saving from a Card toasts and its action opens the Want tab', async ({ page }) => {
  await preparePage(page, 'ja');
  // Visited outnumbers saved, so a default-tab choice would land on Visited.
  await page.evaluate(() => ['5', '7', '8'].forEach(k => window.setVisited(k, true)));

  const bookmark = page.locator(cardBookmark('3'));
  await bookmark.scrollIntoViewIfNeeded();
  await bookmark.click();

  const toast = page.locator('#toast');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('「行きたい」に追加しました');

  const action = page.locator('#toastAction');
  await expect(action).toBeVisible();
  await expect(action).toHaveText('リストを見る');
  await action.click();

  // The explicit action owns the destination — never the default-tab policy.
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#wantToGoTab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#passWantToGoList [data-want-open="3"]')).toBeVisible();
  await assertNoBrowserErrors(page);
});

test('removal is silent; Want → Visited announces one combined transition', async ({ page }) => {
  await preparePage(page, 'ja');
  await page.locator(cardBookmark('3')).click();
  await expect(page.locator('#toast')).toBeVisible();
  await page.evaluate(() => window.hideToast?.() ?? document.getElementById('toast')?.classList.remove('is-visible'));

  // OFF: the bookmark state change is feedback enough.
  await page.locator(cardBookmark('3')).click();
  await expect(page.locator('#toast')).toBeHidden();

  // Want → Visited removes the plan, so the loss is explained rather than silent.
  await page.locator(cardBookmark('3')).click();
  await openDrawer(page, '3');
  await page.locator(drawerVisited).click();
  const toast = page.locator('#toast');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('訪問済みに記録し、「行きたい」から削除しました');
  await expect(page.locator('#toastAction')).toHaveText('記録を見る');
  await page.locator('#toastAction').click();
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#visitedTab')).toHaveAttribute('aria-selected', 'true');
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: true });
});

test('toast strings localize in JA / EN / ZH', async ({ page }) => {
  await preparePage(page, 'ja');
  for (const [lang, message, action] of [
    ['en', 'Added to Want to go', 'View list'],
    ['zh', '已加入“想去”', '查看列表'],
  ]) {
    await setLanguage(page, lang);
    await page.evaluate(() => window.setWantToGo('3', false));
    const bookmark = page.locator(cardBookmark('3'));
    await bookmark.scrollIntoViewIfNeeded();
    await bookmark.click();
    await expect(page.locator('#toast')).toContainText(message);
    await expect(page.locator('#toastAction')).toHaveText(action);
  }
});

test('Visited ADD toast strings localize in JA / EN / ZH', async ({ page }) => {
  await preparePage(page, 'ja');
  for (const [lang, message, action] of [
    ['ja', '「訪問済み」に記録しました', '記録を見る'],
    ['en', 'Marked as visited', 'View record'],
    ['zh', '已记录为“去过”', '查看记录'],
  ]) {
    await setLanguage(page, lang);
    await page.evaluate(() => {
      window.setWantToGo('3', false);
      window.setVisited('3', false);
      window.hideToast();
      window.setVisited('3', true);
    });
    await expect(page.locator('#toast')).toContainText(message);
    await expect(page.locator('#toastAction')).toHaveText(action);
  }
});

test('independent Visited ADD uses one toast and opens the explicit Visited tab', async ({ page }) => {
  await preparePage(page, 'ja');
  // Seed a competing Want item so the default tab would be the wrong answer.
  await page.evaluate(() => {
    window.setWantToGo('5', true);
    window.hideToast();
  });

  await clickInputLabel(page, '#card-3 [data-visited-toggle="3"]');
  await expect(page.locator('#toast')).toBeVisible();
  await expect(page.locator('#toast')).toContainText('「訪問済み」に記録しました');
  await expect(page.locator('#toastAction')).toHaveText('記録を見る');
  await page.locator('#toastAction').click();

  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#visitedTab')).toHaveAttribute('aria-selected', 'true');
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: true });
  await assertNoBrowserErrors(page);
});

test('independent Visited ADD from Detail uses the same feedback grammar', async ({ page }) => {
  await preparePage(page, 'ja');
  await openDrawer(page, '3');
  await page.locator(drawerVisited).click();

  await expect(page.locator('#toast')).toBeVisible();
  await expect(page.locator('#toast')).toContainText('「訪問済み」に記録しました');
  await expect(page.locator('#toastAction')).toHaveText('記録を見る');
  await page.locator('#toastAction').click();

  await expect(page.locator('#facilityDrawer')).toBeHidden();
  await expect(page.locator('#passTracker')).toBeVisible();
  await expect(page.locator('#visitedTab')).toHaveAttribute('aria-selected', 'true');
  await assertNoBrowserErrors(page);
});

test('Visited REMOVE is silent and never restores Want to Go', async ({ page }) => {
  await preparePage(page, 'ja');
  await clickInputLabel(page, '#card-3 [data-visited-toggle="3"]');
  await expect(page.locator('#toast')).toBeVisible();
  await page.evaluate(() => window.hideToast());

  await clickInputLabel(page, '#card-3 [data-visited-toggle="3"]');
  await expect(page.locator('#toast')).toBeHidden();
  expect(await wantIsSet(page, '3')).toEqual({ want: false, visited: false });
  await assertNoBrowserErrors(page);
});

test('a new Toast replaces the previous timer without being hidden by the stale callback', async ({ page }) => {
  await preparePage(page, 'ja', { skipDateTime: true });
  const state = await page.evaluate(() => {
    const originalSetTimeout = window.setTimeout;
    const originalClearTimeout = window.clearTimeout;
    const timers = [];
    window.setTimeout = (handler, delay) => {
      const id = timers.length;
      timers.push({ handler, delay, cleared: false });
      return id;
    };
    window.clearTimeout = id => {
      if (timers[id]) timers[id].cleared = true;
    };

    window.showToast('first', 'First action');
    window.showToast('second', 'Second action');
    timers[0].handler();
    const result = {
      message: document.getElementById('toastMessage').textContent,
      visible: document.getElementById('toast').classList.contains('is-visible'),
      firstTimerCleared: timers[0].cleared,
      secondTimerDelay: timers[1].delay
    };

    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
    window.hideToast();
    return result;
  });

  expect(state).toEqual({
    message: 'second',
    visible: true,
    firstTimerCleared: true,
    secondTimerDelay: 6000
  });
});

test('mobile Toast composition stays wide and keeps the action intact', async ({ page }) => {
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 812 });
    await preparePage(page, 'ja', { skipDateTime: true });
    await page.locator(cardBookmark('3')).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const geometry = await page.locator('#toast').evaluate(toast => {
      const message = document.getElementById('toastMessage');
      const action = document.getElementById('toastAction');
      const rect = element => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right };
      };
      return {
        toast: rect(toast),
        message: rect(message),
        action: rect(action),
        actionWhiteSpace: getComputedStyle(action).whiteSpace,
        separator: getComputedStyle(action, '::before').content,
        backTopDisplay: getComputedStyle(document.getElementById('backTop')).display,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });

    expect(geometry.toast.x).toBe(16);
    expect(geometry.toast.width).toBe(width - 32);
    expect(geometry.toast.right).toBe(width - 16);
    expect(geometry.actionWhiteSpace).toBe('nowrap');
    expect(geometry.action.height).toBeGreaterThanOrEqual(44);
    expect(geometry.action.width).toBeGreaterThanOrEqual(44);
    expect(geometry.message.width).toBeGreaterThan(0);
    expect(geometry.separator).toBe('none');
    expect(geometry.backTopDisplay).toBe('none');
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
    await expect(page.locator('#toast')).toBeVisible();
  }
});

test('mobile Visited feedback keeps long messages readable in JA / EN / ZH', async ({ page }) => {
  for (const language of ['ja', 'en', 'zh']) {
    await page.setViewportSize({ width: 320, height: 812 });
    await preparePage(page, language, { skipDateTime: true });
    await clickInputLabel(page, '#card-3 [data-visited-toggle="3"]');

    const geometry = await page.locator('#toast').evaluate(toast => {
      const message = document.getElementById('toastMessage');
      const action = document.getElementById('toastAction');
      const toastBox = toast.getBoundingClientRect();
      const messageBox = message.getBoundingClientRect();
      const actionBox = action.getBoundingClientRect();
      return {
        toastWidth: toastBox.width,
        messageWidth: messageBox.width,
        actionWidth: actionBox.width,
        actionHeight: actionBox.height,
        actionY: actionBox.y,
        messageBottom: messageBox.bottom,
        actionWhiteSpace: getComputedStyle(action).whiteSpace,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });

    expect(geometry.toastWidth).toBe(288);
    expect(geometry.messageWidth).toBeGreaterThan(0);
    expect(geometry.actionWidth).toBeGreaterThanOrEqual(44);
    expect(geometry.actionHeight).toBeGreaterThanOrEqual(44);
    expect(geometry.actionY).toBeGreaterThanOrEqual(geometry.messageBottom);
    expect(geometry.actionWhiteSpace).toBe('nowrap');
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
  }
});

test('desktop Toast remains compact at tablet and desktop widths', async ({ page }) => {
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await preparePage(page, 'ja', { skipDateTime: true });
    await page.locator(cardBookmark('3')).click();

    const geometry = await page.locator('#toast').evaluate(toast => {
      const message = document.getElementById('toastMessage');
      const action = document.getElementById('toastAction');
      const toastBox = toast.getBoundingClientRect();
      const messageBox = message.getBoundingClientRect();
      const actionBox = action.getBoundingClientRect();
      return {
        toast: toastBox,
        message: messageBox,
        action: actionBox,
        separator: getComputedStyle(action, '::before').content,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });

    expect(geometry.toast.width).toBeLessThanOrEqual(520);
    expect(geometry.toast.width).toBeLessThan(width - 32);
    expect(geometry.action.width).toBeGreaterThanOrEqual(44);
    expect(geometry.action.bottom).toBeGreaterThan(geometry.message.top);
    expect(geometry.action.top).toBeLessThan(geometry.message.bottom);
    expect(geometry.separator).toBe('"·"');
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
  }
});

test('the long Want → Visited Toast uses the narrow fallback without vertical action glyphs', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await preparePage(page, 'ja', { skipDateTime: true });
  await page.locator(cardBookmark('3')).click();
  await openDrawer(page, '3');
  await page.locator(drawerVisited).click();

  const geometry = await page.locator('#toast').evaluate(toast => {
    const message = document.getElementById('toastMessage');
    const action = document.getElementById('toastAction');
    const toastBox = toast.getBoundingClientRect();
    const messageBox = message.getBoundingClientRect();
    const actionBox = action.getBoundingClientRect();
    return {
      toastWidth: toastBox.width,
      messageWidth: messageBox.width,
      messageHeight: messageBox.height,
      actionWidth: actionBox.width,
      actionHeight: actionBox.height,
      actionY: actionBox.y,
      messageBottom: messageBox.bottom,
      separator: getComputedStyle(action, '::before').content,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });

  expect(geometry.toastWidth).toBe(288);
  expect(geometry.messageWidth).toBe(264);
  expect(geometry.messageHeight).toBeGreaterThan(28);
  expect(geometry.actionWidth).toBeGreaterThanOrEqual(44);
  expect(geometry.actionHeight).toBe(44);
  expect(geometry.actionY).toBeGreaterThanOrEqual(geometry.messageBottom);
  expect(geometry.separator).toBe('none');
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
});

test('the Want list shows the shared opening summary, not just a badge', async ({ page }) => {
  await preparePage(page, 'ja');
  // Save every facility so at least one is open at the fixture date/time and the
  // projection has something to show.
  await page.evaluate(() => [...document.querySelectorAll('.area-section .card')]
    .forEach(card => window.setWantToGo(card.dataset.facilityKey, true)));
  await openMyPass(page);

  await expect(page.locator('#passWantToGoList .my-pass-want-status').first()).toBeVisible();

  // The hours line is projected VERBATIM from the Card's shared status reason,
  // so identical text proves there is no second derivation path.
  const pairs = await page.evaluate(() =>
    [...document.querySelectorAll('#passWantToGoList .my-pass-want-item')].map(item => {
      const key = item.querySelector('[data-want-open]')?.dataset.wantOpen;
      return {
        list: item.querySelector('.my-pass-want-hours')?.textContent?.trim() || '',
        card: document.querySelector(`#card-${CSS.escape(key)} .status-reason-hours`)?.textContent?.trim() || ''
      };
    }));
  const withHours = pairs.filter(p => p.card);
  expect(withHours.length).toBeGreaterThan(0);
  for (const pair of withHours) expect(pair.list).toBe(pair.card);
  // Facilities with no hours reason get no empty line.
  for (const pair of pairs.filter(p => !p.card)) expect(pair.list).toBe('');

  await assertNoHorizontalOverflow(page);
  await assertNoBrowserErrors(page);
});

test('the collection CTA closes My Pass and applies the existing Want-to-go filter', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);
  await openMyPass(page);

  const browse = page.locator('#browseCollectionButton');
  await expect(browse).toBeVisible();
  await browse.click();

  await expect(page.locator('#passTracker')).toBeHidden();
  // It reuses the single existing filter — no second filter state.
  await expect(page.locator('input[name="visitedFilter"][value="want"]')).toBeChecked();
  await expect.poll(() => visibleCardCount(page)).toBe(3);
  // Focus must not be left inside the closed modal.
  const insideModal = await page.evaluate(() => Boolean(document.getElementById('passTracker')?.contains(document.activeElement)));
  expect(insideModal).toBe(false);
  await assertNoBrowserErrors(page);
});

test('the collection CTA preserves the current List / Map mode', async ({ page }) => {
  await preparePage(page, 'ja');
  await bookmarkAll(page, WANT_ROWS);

  await page.locator('#mapToggleBtn').click();
  await expect(page.locator('#mapToggleBtn')).toHaveAttribute('aria-pressed', 'true');

  await openMyPass(page);
  await page.locator('#browseCollectionButton').click();
  await expect(page.locator('#passTracker')).toBeHidden();

  // Still on the Map — the collection action browses, it does not switch views.
  await expect(page.locator('#mapToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#listToggleBtn')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('input[name="visitedFilter"][value="want"]')).toBeChecked();
  await assertNoBrowserErrors(page);
});

test('the collection CTA is hidden when there is nothing saved', async ({ page }) => {
  await preparePage(page, 'ja');
  await openMyPass(page);
  await expect(page.locator('#browseCollectionButton')).toBeHidden();
});
