import { open, go } from './lib.mjs'; import { specs } from './specs-pos.mjs';
const s = specs.find(x => x.id === process.argv[2]);
const { browser, page } = await open(); await go(page, s.url); await s.prepare(page); await page.waitForTimeout(2000);
console.log(await page.evaluate((sel) => { const e = document.querySelector(sel); if(!e) return 'none'; const r = e.getBoundingClientRect(); return [document.querySelectorAll(sel).length, r.x, r.y, r.width, r.height, innerHeight]; }, s.root));
await page.screenshot({path:'/tmp/dbg.png'});
await browser.close();
