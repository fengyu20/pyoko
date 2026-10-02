const { test, expect } = require('@playwright/test');

const PAGES = [
  {
    path: '/about/',
    titles: {
      ja: 'PYOKOについて｜ぐるっとパス非公式ガイド',
      en: 'About PYOKO | Unofficial Grutto Pass Guide',
      zh: '关于 PYOKO｜ぐるっとパス非官方个人指南'
    },
    headings: {
      ja: 'PYOKOについて',
      en: 'About PYOKO',
      zh: '关于 PYOKO'
    }
  },
  {
    path: '/about/data/',
    titles: {
      ja: '情報・出典と判断について｜PYOKO',
      en: 'Information, Sources and How PYOKO Decides | PYOKO',
      zh: '信息、来源与判断｜PYOKO'
    },
    headings: {
      ja: '情報・出典と判断について',
      en: 'Information, sources and how PYOKO decides',
      zh: '信息、来源与判断'
    }
  },
  {
    path: '/about/pass-tracker/',
    titles: {
      ja: 'Pass Trackerと参考価値について｜PYOKO',
      en: 'Pass Tracker and Reference Value | PYOKO',
      zh: 'Pass Tracker 和参考价值｜PYOKO'
    },
    headings: {
      ja: 'Pass Trackerと「参考価値」',
      en: 'Pass Tracker and “reference value”',
      zh: 'Pass Tracker 和“参考价值”'
    }
  }
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test('About pages switch languages, metadata, and contextual links together', async ({ page }) => {
  for (const aboutPage of PAGES) {
    await page.goto(`${aboutPage.path}?lang=en`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(aboutPage.titles.en);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.about-article[data-about-language="en"]')).toBeVisible();
    await expect(page.locator('.about-article[data-about-language="en"] h1')).toHaveText(aboutPage.headings.en);
    await expect(page.locator('.about-article[data-about-language="ja"]')).toBeHidden();
    await expect(page.locator('[data-about-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('a[data-about-language-link][href*="lang=en"]').first()).toBeVisible();

    await page.locator('[data-about-lang="zh"]').click();
    await expect(page).toHaveTitle(aboutPage.titles.zh);
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
    await expect(page.locator('.about-article[data-about-language="zh"]')).toBeVisible();
    await expect(page.locator('.about-article[data-about-language="zh"] h1')).toHaveText(aboutPage.headings.zh);
    await expect(page.locator('[data-about-lang="zh"]')).toHaveAttribute('aria-pressed', 'true');
  }
});

test('About pages remain readable without horizontal overflow at narrow widths', async ({ page }) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const aboutPage of PAGES) {
      await page.goto(`${aboutPage.path}?lang=en`, { waitUntil: 'domcontentloaded' });
      const geometry = await page.evaluate(() => ({
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth
      }));
      expect(geometry.documentWidth, `${aboutPage.path} at ${width}px`).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.bodyWidth, `${aboutPage.path} body at ${width}px`).toBeLessThanOrEqual(geometry.viewport);
    }
  }
});
