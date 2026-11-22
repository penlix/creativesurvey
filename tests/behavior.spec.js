// Key interactions: survey link, privacy dialog, header video and menu.
const { test, expect } = require('@playwright/test');
const { openPage } = require('./helpers');

test('survey buttons download the 2015 results PDF', async ({ page, request }) => {
  await openPage(page);
  const links = page.locator('a.takepart');
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', '/downloads/cs15.pdf');
    await expect(link).toHaveAttribute('download', 'Creative-Survey-2015.pdf');
    expect(await link.getAttribute('target')).toBeNull();
    await expect(link).toHaveAttribute('aria-label', /^ΚΑΤΕΒΑΣΕ ΤΗΝ ΕΡΕΥΝΑ/);
  }
  const res = await request.get('/downloads/cs15.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('hidden helper text never shows inside the survey buttons', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Hover runs on desktop.');
  await openPage(page);
  const button = page.locator('.buttonbar a.takepart');
  await button.scrollIntoViewIfNeeded();
  await button.hover();
  await page.waitForTimeout(800);
  await expect(button).toHaveText(/^\s*ΚΑΤΕΒΑΣΕ ΤΗΝ ΕΡΕΥΝΑ\s*$/);
});

test('privacy terms open as a dialog and close with Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Keyboard test runs on desktop.');
  await openPage(page);
  const opener = page.locator('a.data');
  const dialog = page.locator('.terms[role="dialog"]');
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.terms .close')).toBeFocused();

  // The page behind stays put; the terms text scrolls inside the box.
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  const copy = page.locator('.terms .terms_copy');
  const sizes = await copy.evaluate((e) => ({ scroll: e.scrollHeight, client: e.clientHeight, top: e.scrollTop }));
  expect(sizes.scroll).toBeGreaterThan(sizes.client);
  expect(sizes.top).toBeGreaterThan(0);
  const box = await page.locator('.terms .contterms').boundingBox();
  const copyBox = await copy.boundingBox();
  expect(copyBox.y + copyBox.height).toBeLessThanOrEqual(box.y + box.height + 1);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('header video can be paused and resumed', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'On touch screens the site shows a still image instead of the video.');
  await openPage(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const button = page.locator('.a11y-pause');
  const paused = () => page.locator('.topbar video').evaluate((v) => v.paused);
  await expect(button).toHaveAttribute('aria-label', 'Παύση βίντεο');
  await button.click();
  await expect.poll(paused).toBe(true);
  await expect(button).toHaveAttribute('aria-label', 'Αναπαραγωγή βίντεο');
  await button.click();
  await expect.poll(paused).toBe(false);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('header video starts paused', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'No video on touch screens.');
    await openPage(page);
    await expect(page.locator('.a11y-pause')).toHaveAttribute('aria-label', 'Αναπαραγωγή βίντεο');
  });
});

test('header is visible on load and content starts below it', async ({ page }) => {
  await openPage(page);
  const layout = await page.evaluate(() => ({
    header: Math.round(document.querySelector('.topbar').getBoundingClientRect().height),
    contentTop: Math.round(document.querySelector('.wrapper').getBoundingClientRect().top),
    viewport: window.innerHeight,
  }));
  expect(layout.contentTop).toBeGreaterThanOrEqual(layout.viewport * 0.9);
});

test('menu links scroll to their section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Menu checked on desktop.');
  await openPage(page);
  await page.locator('.topbar .burger').click();
  for (const id of ['section-audience', 'section-about', 'section-cs08']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    if (!(await page.locator(`.topbar a[href="#${id}"]`).isVisible())) await page.locator('.topbar .burger').click();
    await page.locator(`.topbar a[href="#${id}"]`).click();
    const target = await page.locator(`#${id}`).evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeGreaterThan(target - 200);
  }
});

test('header content stays visible after resizing while scrolled down', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop layout.');
  await openPage(page);
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1280, height: 700 }); // e.g. the browser download bar appears
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await expect(page.locator('.topbar .logo')).toBeInViewport();
  await expect(page.locator('.topbar a.takepart')).toBeInViewport();
});

test('2008 links and results download work', async ({ page, request }) => {
  await openPage(page);
  const links = page.locator('a[href="/2008/"]');
  await expect(links).toHaveCount(2);
  await links.last().scrollIntoViewIfNeeded();
  await links.last().click();
  await expect(page).toHaveURL(/\/2008\/$/);
  await expect(page.locator('h1')).toContainText('Creative Survey 2008');
  const button = page.locator('#participate a');
  await expect(button).toHaveAttribute('href', '/downloads/cs08.pdf');
  await expect(button).toBeVisible();
  expect((await request.get('/downloads/cs08.pdf')).status()).toBe(200);
});
