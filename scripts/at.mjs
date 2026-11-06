import { open, go } from './lib.mjs';
const [,, p, ...pts] = process.argv;
const { browser, page } = await open(); await go(page, p); await page.waitForTimeout(2500);
for (const pt of pts) { const [x, y] = pt.split(',').map(Number);
console.log(pt, await page.evaluate(([x, y]) => { let e = document.elementFromPoint(x, y), o = []; while (e && e !== document.body) { o.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).join('.') : '')); e = e.parentElement; } return o.slice(0, 8).join('  <  '); }, [x, y])); }
await browser.close();
