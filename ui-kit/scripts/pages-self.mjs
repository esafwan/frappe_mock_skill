// Every page variant gets its own screenshot (pages/shots/<name>.png, JS enabled) and must render within 0.5% of it with JavaScript removed.
import fs from 'fs'; import { chromium } from 'playwright'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch'; import { ROOT, launch } from './lib.mjs';
fs.mkdirSync(ROOT + 'pages/shots', { recursive: true }); const b = await launch(); const rep = {}; let fail = 0;
for (const f of fs.readdirSync(ROOT + 'pages').filter(f => f.endsWith('.html')).sort()) {
  const name = f.replace('.html', ''); const shot = async (js) => { const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, javaScriptEnabled: js }); const p = await c.newPage(); const reqs = []; p.on('request', r => { if (!/^(file|data):/.test(r.url())) reqs.push(r.url()); });
    await p.goto('file://' + ROOT + 'pages/' + f); await p.waitForTimeout(400); const buf = await p.screenshot(); await c.close(); return { buf, reqs }; };
  const on = await shot(true), off = await shot(false); fs.writeFileSync(ROOT + `pages/shots/${name}.png`, on.buf);
  const a = PNG.sync.read(on.buf), c = PNG.sync.read(off.buf); const pct = pixelmatch(a.data, c.data, null, a.width, a.height, { threshold: 0.1 }) / (a.width * a.height);
  const ok = pct <= 0.005 && !on.reqs.length && !off.reqs.length; if (!ok) fail++; rep[name] = { diffPct: +(pct * 100).toFixed(3), network: on.reqs.length + off.reqs.length, ok }; console.log(ok ? 'PASS' : 'FAIL', name, (pct * 100).toFixed(3) + '%'); }
fs.writeFileSync(ROOT + 'pages-self-report.json', JSON.stringify(rep, null, 2)); await b.close(); process.exit(fail ? 1 : 0);
