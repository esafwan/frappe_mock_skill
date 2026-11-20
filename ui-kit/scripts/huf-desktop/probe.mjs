// Dev helper: open one renderer route with the desktop harness, print bridge calls and failures, save a screenshot.
//   HUF_DESKTOP_DEBUG=1 node scripts/huf-desktop/probe.mjs '#/chat/NW-CONV-0001' out.png [dark] [specJson]
import { openHuf, goHuf } from './app.mjs';
const [route = '#/chat', out = 'probe.png', mode = 'light', specJson = '{}'] = process.argv.slice(2);
const spec = JSON.parse(specJson);
const { page, browser } = await openHuf(spec);
await goHuf(page, route, { dark: mode === 'dark' });
await page.waitForTimeout(800);
const calls = await page.evaluate(() => [...new Set(window.__hufDesktopCalls || [])]);
console.log('bridge calls:', calls.join(' '));
console.log('fonts:', JSON.stringify(await page.evaluate(() => { const o = {}; for (const e of document.querySelectorAll('body *')) { if (!e.childElementCount && e.textContent.trim()) { const f = getComputedStyle(e).fontFamily; o[f] = (o[f] || 0) + 1; } } return o; })));
await page.screenshot({ path: out });
await browser.close();
