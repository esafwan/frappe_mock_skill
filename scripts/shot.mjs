import { open, go } from './lib.mjs';
const [,, p, out, ...rest] = process.argv;
const { browser, page } = await open();
await go(page, p); await page.waitForTimeout(3000);
console.log(page.url(), await page.evaluate(() => document.title));
await page.screenshot({ path: out }); await browser.close();
