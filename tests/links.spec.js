// Every internal link and asset referenced by the site must load.
const { test, expect } = require('@playwright/test');
const { blockThirdParty } = require('./helpers');

const DOWNLOADS = ['cs15.pdf', 'cs08.pdf', 'cs08-datamine.pdf', 'cs08-mediakit.zip', 'cs08-wallpaper.zip', 'cs08.csv', 'cs08-calendar.ics'];

test('all internal links and assets respond with 200', async ({ page, request, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Same URLs on every viewport; checked once.');
  await blockThirdParty(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const found = await page.evaluate(() => {
    const out = [];
    const add = (v) => v && !v.startsWith('#') && out.push(v);
    document.querySelectorAll('a[href]').forEach((a) => add(a.getAttribute('href')));
    document.querySelectorAll('img[src], script[src], source[src]').forEach((e) => add(e.getAttribute('src')));
    document.querySelectorAll('link[href]').forEach((l) => add(l.getAttribute('href')));
    return out;
  });
  const urls = new Set();
  for (const raw of found) {
    const url = new URL(raw, page.url());
    if (url.origin !== new URL(baseURL).origin) continue;
    url.hash = '';
    urls.add(url.toString());
  }
  for (const file of DOWNLOADS) urls.add(new URL('/downloads/' + file, baseURL).toString());

  const broken = [];
  for (const url of urls) {
    const res = await request.get(url);
    if (res.status() !== 200) broken.push(`${res.status()} ${url}`);
  }
  expect(broken, `Broken URLs:\n${broken.join('\n')}`).toEqual([]);
  expect(urls.size).toBeGreaterThan(20);
});

test('server-side leftovers are not published', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Checked once.');
  for (const path of ['/index.php', '/downloads/error_log', '/downloads/download.php']) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect([301, 308, 404], path).toContain(res.status());
  }
});
