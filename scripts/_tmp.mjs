import { open, go } from './lib.mjs';
const [,, p, out, ...clicks] = process.argv;
const { browser, page } = await open(); await go(page, p); await page.waitForTimeout(2500);
for (const c of clicks) { await page.locator(c).first().click(); await page.waitForTimeout(1200); }
await page.screenshot({ path: out });
console.log(page.url());
await browser.close();
