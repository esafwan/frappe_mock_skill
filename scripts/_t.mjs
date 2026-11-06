import { open, go } from './lib.mjs';
const { browser, page } = await open(); await go(page, '/mosaic/Grill%20&%20Tandoor'); await page.waitForTimeout(4000);
await page.screenshot({ path: '/tmp/mosaic3.png' });
console.log(await page.evaluate(() => { const m = document.querySelector('main, #app, #root') || document.body; const o = []; const f = (e, d) => { if (d > 3) return; o.push('  '.repeat(d) + e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 70)); [...e.children].slice(0, 4).forEach(c => f(c, d + 1)); }; f(document.body.children[0] || document.body, 0); return o.join('\n'); }));
await browser.close();
