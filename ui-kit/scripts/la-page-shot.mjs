// Screenshot composed LA pages: node scripts/la-page-shot.mjs <outDir> [fileSubstring]  (1440x900 @1x, JS off). Writes <name>.png beside outDir.
import fs from 'fs'; import { chromium } from 'playwright'; import { ROOT } from './lib.mjs';
const out = process.argv[2]; const only = process.argv[3]; fs.mkdirSync(out, { recursive: true }); const b = await chromium.launch();
for (const f of fs.readdirSync(ROOT + 'pages/la').filter(f => f.endsWith('.html') && (!only || f.includes(only)))) { const c = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); const p = await c.newPage(); await p.goto('file://' + ROOT + 'pages/la/' + f); await p.screenshot({ path: out + '/' + f.replace('.html', '.png') }); await c.close(); }
await b.close();
