// Screenshots + pixel boxes for pages/la/rpt-tier-migration*.html and registers manifest.pages["la-rpt-tier-migration"].
//   node scripts/la-page-tier-migration-shots.mjs [--no-manifest]
// JS off (proves JS-free). Boxes = every [data-ui] in the page at 1440x900 @1x. Manifest is read-modify-written fresh (other sessions also write it).
import fs from 'fs'; import { chromium } from 'playwright'; import { ROOT } from './lib.mjs'; import { VARIANT_FILES } from './la-page-tier-migration.mjs';
const SH = ROOT + 'pages/la/shots/'; fs.mkdirSync(SH, { recursive: true }); const b = await chromium.launch(); const boxes = {}; let bad = 0;
for (const f of VARIANT_FILES) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); const p = await c.newPage(); await p.goto('file://' + ROOT + 'pages/la/' + f);
  const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p2 = await c2.newPage(); await p2.goto('file://' + ROOT + 'pages/la/' + f); await p2.evaluate(() => document.fonts.ready);
  boxes[f] = await p2.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes[f].map(x => x.id); if (new Set(ids).size !== ids.length) { bad++; console.log('DUPLICATE data-ui in', f); }
  await p.screenshot({ path: SH + f.replace('.html', '.png') }); await c.close(); await c2.close();
}
await b.close(); fs.writeFileSync(SH + 'rpt-tier-migration.boxes.json', JSON.stringify(boxes, null, 1));
if (!process.argv.includes('--no-manifest')) {
  const P = 'la-rpt-tier-migration'; const m = JSON.parse(fs.readFileSync(ROOT + 'manifest.json'));
  const state = (f) => (f.match(/rpt-tier-migration(?:\.(zero|empty|preset-qtd|cell-hl|grow))?/) || [])[1] || 'populated';
  const variants = VARIANT_FILES.map(f => ({ file: 'pages/la/' + f, state: state(f), variant: f.replace('rpt-tier-migration', '').replace('.html', '').replace(/^\./, '') || 'en-AED.light', screenshot: 'pages/la/shots/' + f.replace('.html', '.png'), targets: boxes[f].filter(x => x.id.startsWith(P)).map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) }));
  m.pages[P] = { id: P, title: 'Tier Migration Matrix report (Loyal Arrow desk)', system: 'loyal-arrow-desk', group: 'la', html: 'pages/la/rpt-tier-migration.html', reference: 'ux-after-r1/rpt-tier-migration-matrix__desktop-light.png', viewport: { w: 1440, h: 900 },
    slots: 'pages/la/rpt-tier-migration.slots.json', data: 'loyal-arrow/data/<dataset>/tier_migration.json', components: ['la-shell', 'la-heat-table', 'la-kpi-card', 'la-stack-bar', 'la-preset-pills', 'la-filter-bar'], states: ['populated', 'zero', 'empty', 'preset', 'cell-hl', 'grow'],
    interactionTargets: { [P + '.preset-7d']: 'period pill (click to change preset; .preset-qtd variant shows QTD active with new dates)', [P + '.preset-30d']: 'period pill', [P + '.preset-90d']: 'period pill', [P + '.preset-qtd']: 'period pill', [P + '.preset-custom']: 'period pill (active by default)', [P + '.cell-rNcM']: 'matrix cell (6x6, N=row M=col) for zoom/highlight/cursor; .cell-hl variant outlines cell-r3c4 (Bronze to Silver)', [P + '.row-N']: 'matrix row', [P + '.split-fill']: 'split bar fill (width driven by --la-progress; .grow variant = 0.3)', [P + '.seg-up']: 'segment moved up', [P + '.seg-same']: 'segment unchanged', [P + '.seg-down']: 'segment moved down', [P + '.about']: 'About this report link', [P + '.field-start-value']: 'start date', [P + '.field-end-value']: 'end date', [P + '.reset']: 'reset link' }, variants };
  fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(m, null, 2));
}
console.log('shots', VARIANT_FILES.length, bad ? 'DUPLICATE IDS' : 'ok'); process.exit(bad ? 1 : 0);
