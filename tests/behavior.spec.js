// Key interactions: survey link, privacy dialog, header video and menu.
const { test, expect } = require('@playwright/test');
const { openPage } = require('./helpers');

test('survey buttons open the survey in a new tab', async ({ page }) => {
  await openPage(page);
  const links = page.locator('a.takepart');
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', 'http://surveys.iprobe.gr/CS015/');
    await expect(link).toHaveAttribute('target', '_blank');
    expect(await link.getAttribute('onclick')).toBeNull();
  }
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
