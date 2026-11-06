import { chromium } from 'playwright';
import fs from 'fs';
export const BASE = process.env.BASE || 'http://localhost:8001';
export const ROOT = new URL('..', import.meta.url).pathname;
export async function open({ dark = false, rtl = false } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-US', timezoneId: 'UTC' });
  await ctx.addInitScript(() => { const t = 1767225600000; Date.now = () => t; let s = 42; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; });
  const page = await ctx.newPage(); page.setDefaultTimeout(6000);
  const r = await page.request.post(BASE + '/api/method/login', { data: { usr: 'Administrator', pwd: 'admin' } });
  if (!r.ok()) throw new Error('login failed');
  await page.addStyleTag?.({ content: '' }).catch(() => {});
  return { browser, ctx, page };
}
export async function go(page, path, { dark = false } = {}) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.evaluate((d) => document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light'), dark);
  await page.evaluate(()=>{const s=document.createElement('style');s.dataset.uikit='1';s.textContent='*{animation:none!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(s)});
  await page.evaluate(() => { document.querySelectorAll('#ury-return-to-app').forEach(e => e.remove()); return document.fonts.ready; });
}
export const write = (p, c) => { fs.mkdirSync(require_dirname(p), { recursive: true }); fs.writeFileSync(p, c); };
const require_dirname = (p) => p.split('/').slice(0, -1).join('/');
