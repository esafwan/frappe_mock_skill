import { open, go } from './lib.mjs';
const [,, p, code] = process.argv; const { browser, page } = await open(); await go(page, p); await page.waitForTimeout(2000);
console.log(JSON.stringify(await page.evaluate(code), null, 1)); await browser.close();
