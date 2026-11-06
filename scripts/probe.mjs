import { open, go } from './lib.mjs';
const { browser, page } = await open();
await go(page, '/desk');
console.log(await page.evaluate(() => ({
  css: [...document.styleSheets].map(s => s.href), 
  theme: document.documentElement.dataset.theme,
  boot: { lang: frappe.boot.lang, cur: frappe.boot.sysdefaults?.currency, home: window.location.pathname },
  sprite: !!document.querySelector('svg symbol'), symbols: document.querySelectorAll('symbol').length,
  fonts: [...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.status).slice(0,12),
})));
await page.screenshot({ path: '/tmp/desk.png' });
await browser.close();
