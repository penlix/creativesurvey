// WCAG 2.2 AA checks with axe, desktop and mobile.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { openPage, scrollThrough } = require('./helpers');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

function describe(violations) {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help}\n` + v.nodes.slice(0, 5).map((n) => `    ${n.target.join(' ')}`).join('\n'))
    .join('\n');
}

for (const [name, path] of [['2015 home page', '/'], ['2008 page', '/2008/']]) {
  test(`${name} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await openPage(page, path);
    await scrollThrough(page);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(violations, describe(violations)).toEqual([]);
  });
}

test('page has one h1, landmarks and Greek language', async ({ page }) => {
  await openPage(page);
  const info = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    nav: document.querySelectorAll('nav').length,
    lang: document.documentElement.lang,
  }));
  expect(info).toEqual({ h1: 1, main: 1, nav: 1, lang: 'el' });
});
