import { open, go } from './lib.mjs';
const [,, p] = process.argv; const { browser, page } = await open();
page.on('response', async r => { const u = r.url(); if (/\/api\/(method|resource)/.test(u)) console.log(r.status(), u.replace('http://localhost:8001', '').slice(0, 140)); });
await go(page, p); await page.waitForTimeout(4000); await browser.close();
