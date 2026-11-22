// Shared helpers for the site tests.

/** Third-party hosts the tests should not depend on. */
const BLOCKED = /google-analytics\.com|googletagmanager\.com|facebook\.|twitter\.com|linkedin\.com/;

async function blockThirdParty(page) {
  await page.route(BLOCKED, (route) => route.abort());
}

/** Load the page and let the loader and entrance animations finish. */
async function openPage(page, path = '/') {
  await blockThirdParty(page);
  await page.goto(path, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
}

/** Scroll through the page so scroll-triggered content is revealed. */
async function scrollThrough(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1000);
}

module.exports = { blockThirdParty, openPage, scrollThrough };
