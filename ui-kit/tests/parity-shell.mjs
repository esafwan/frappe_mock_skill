// Shell parity: new shell vs legacy render (structure + pixels), plus mobile off-canvas and collapsed rail checks.
//   node tests/parity-shell.mjs        (needs playwright, pixelmatch, pngjs from node_modules)
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { applyMobile, shellState } from '../shell/mobile.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parity-shell-'));
// the renders reference ../tokens, so write them inside the kit tree (removed at the end)
const work = fs.mkdtempSync(path.join(KIT, 'out', '.parity-'));
const node = (...a) => execFileSync(process.execPath, a, { cwd: KIT, encoding: 'utf8' });
const FX = 'doctype/fixtures';
// Legacy-only hooks: sidebar collapse arrow, section drop-icons and the hidden sidebar panel (close, pills). Not yet in the new sidebar.
const KNOWN_GAPS = new Set(['sidebar.button', 'sidebar.span']);
const MAX_PIXEL_RATIO = 0.06; // shell region only; active item and header differ slightly between renders

const legacy = path.join(work, 'legacy.html');
node('doctype/render-doctype.mjs', `${FX}/erpnext/sales_invoice.json`, '--doc', `${FX}/samples/sales_invoice.doc.json`, '--custom', `${FX}/india_compliance/custom_fields.json`, '--meta-dir', `${FX}/erpnext`, '--legacy', '--out', legacy);
const spec = 'samples/s1-sinv-submitted.json';
const desk = path.join(work, 'new.html'); node('bin/mock.mjs', 'render', spec, '--out', desk);
const mob = path.join(work, 'mobile.html'); node('bin/mock.mjs', 'render', spec, '--viewport', 'mobile', '--out', mob);
const mobOpen = path.join(work, 'mobile-open.html'); node('bin/mock.mjs', 'render', spec, '--viewport', 'mobile', '--out', mobOpen);
const rail = path.join(work, 'rail.html'); node('bin/mock.mjs', 'render', spec, '--out', rail);
const rd = (f) => fs.readFileSync(f, 'utf8');
const wr = (f, h) => fs.writeFileSync(f, h);
node('bin/mock.mjs', 'render', 'samples/t2-form-mobile-open.json', '--out', mobOpen); // the engine applies the mobile shell itself
// collapsed rail: re-render with the collapse flag via the spec chrome
const railSpec = JSON.parse(rd(path.join(KIT, spec)));
railSpec.ctx = { ...railSpec.ctx, chrome: { sidebar: 'collapsed' } };
const railSpecFile = path.join(work, 'rail.json'); wr(railSpecFile, JSON.stringify(railSpec).replace(/"\.\.\/doctype/g, `"../../doctype`));
// data paths in the spec are relative to the spec file; run it from samples/ via a copy
const railCopy = path.join(KIT, 'samples', `.rail-${process.pid}.json`);
wr(railCopy, JSON.stringify(railSpec));
try { node('bin/mock.mjs', 'render', railCopy, '--out', rail); } finally { fs.rmSync(railCopy, { force: true }); }

// ---- 1. structural parity (shell data-ui ids and classes)
const norm = (id) => id.replace(/-\d+$/, '');
const uiIds = (h, re) => new Set([...h.matchAll(/data-ui="([^"]+)"/g)].map((m) => norm(m[1])).filter((x) => re.test(x)));
const classesOf = (h, cls) => { const m = h.match(new RegExp(`class="([^"]*\\b${cls}\\b[^"]*)"`)); return new Set(m ? m[1].split(/\s+/).filter((c) => c !== 'expanded') : []); };
const L = rd(legacy), N = rd(desk);
for (const re of [/^dock/, /^sidebar/]) {
  const a = uiIds(L, re), b = uiIds(N, re);
  const missing = [...a].filter((x) => !b.has(x) && !KNOWN_GAPS.has(x));
  assert.deepEqual(missing, [], `new shell lacks data-ui ids present in legacy: ${missing.join(', ')}`);
  for (const x of a) if (KNOWN_GAPS.has(x) && !b.has(x)) console.log(`known gap (legacy only): ${x}`);
}
for (const cls of ['dock', 'body-sidebar-container', 'body-sidebar', 'sidebar-header', 'dock-item']) {
  const a = classesOf(L, cls), b = classesOf(N, cls);
  const missing = [...a].filter((c) => !b.has(c));
  assert.deepEqual(missing, [], `.${cls}: classes missing in new shell: ${missing.join(', ')}`);
}
console.log('structural parity ok');

// ---- 2. pixel parity + mobile + rail
let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
async function open(file, w, h) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('file://' + file); await p.waitForTimeout(400); return p;
}
try {
  const regionW = async (p) => p.evaluate(() => { const s = document.querySelector('[data-ui="sidebar"]'); return Math.round(s ? s.getBoundingClientRect().right : 0); });
  const pl = await open(legacy, 1440, 900), pn = await open(desk, 1440, 900);
  const w = Math.min(await regionW(pl), await regionW(pn)); assert(w > 100, `sidebar region width ${w}`);
  const [A, B] = await Promise.all([pl, pn].map(async (p) => PNG.sync.read(await p.screenshot({ clip: { x: 0, y: 0, width: w, height: 900 } }))));
  const diff = pixelmatch(A.data, B.data, null, w, 900, { threshold: 0.15 });
  const ratio = diff / (w * 900);
  console.log(`pixel diff shell region ${w}x900: ${diff}px (${(ratio * 100).toFixed(2)}%)`);
  assert(ratio <= MAX_PIXEL_RATIO, `shell pixel diff ${(ratio * 100).toFixed(2)}% exceeds ${MAX_PIXEL_RATIO * 100}%`);

  // mobile closed: sidebar off-canvas, no overlay, no horizontal overflow, toggle present
  const pm = await open(mob, 375, 812);
  const m = await pm.evaluate(() => {
    const bs = document.querySelector('.body-sidebar'); const cs = getComputedStyle(bs); const r = bs.getBoundingClientRect();
    const kid = bs.firstElementChild; const ks = kid && getComputedStyle(kid);
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, ov: !!document.querySelector('[data-ui="sidebar.overlay"]'),
      dock: !!document.querySelector('.dock'), toggle: !!document.querySelector('[data-ui="shell.menu-toggle"]'),
      hidden: cs.pointerEvents === 'none' && (!kid || Number(ks.opacity) === 0), bg: cs.backgroundColor, x: r.left, w: r.width,
      mainW: document.querySelector('.main-section').getBoundingClientRect().width };
  });
  assert(m.sw <= m.cw, `horizontal overflow at 375: ${m.sw} > ${m.cw}`);
  assert(!m.ov && !m.dock && m.toggle && m.hidden, `mobile closed state wrong: ${JSON.stringify(m)}`);
  assert(m.mainW >= 360, `main section too narrow: ${m.mainW}`);
  // mobile open: drawer visible with overlay
  const po = await open(mobOpen, 375, 812);
  const o = await po.evaluate(() => {
    const ov = document.querySelector('[data-ui="sidebar.overlay"]'); const bs = document.querySelector('.body-sidebar'); const r = bs.getBoundingClientRect();
    return { ov: !!ov, ovShown: ov && getComputedStyle(ov).display !== 'none' && ov.getBoundingClientRect().width > 0, left: r.left, w: r.width, op: getComputedStyle(bs.firstElementChild).opacity,
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, exp: document.querySelector('.body-sidebar-container').classList.contains('expanded') };
  });
  assert(o.exp && o.ov && o.ovShown && o.w > 150 && o.left >= 0 && Number(o.op) === 1, `mobile open state wrong: ${JSON.stringify(o)}`);
  assert(o.sw <= o.cw, `horizontal overflow with drawer open: ${o.sw} > ${o.cw}`);
  // collapsed rail at desktop: 48px rail, labels hidden, dock still drawn
  const pr = await open(rail, 1440, 900);
  const r = await pr.evaluate(() => {
    const bs = document.querySelector('.body-sidebar'); const lab = document.querySelector('.body-sidebar .sidebar-item-label');
    return { w: Math.round(bs.getBoundingClientRect().width), label: lab ? (getComputedStyle(lab).opacity === '0' && lab.getBoundingClientRect().width === 0 ? 'none' : 'shown') : 'none', dock: !!document.querySelector('.dock'), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
  });
  assert(r.w === 48 && r.label === 'none' && r.dock && r.sw <= r.cw, `collapsed rail wrong: ${JSON.stringify(r)}`);
  console.log('mobile closed', JSON.stringify({ x: m.x, w: m.w }), 'open', JSON.stringify({ w: o.w }), 'rail', r.w + 'px');
  // state helper
  assert.deepEqual(shellState({ viewport: '375x812' }), { mobile: true, rail: false, drawer: 'closed' });
  assert.deepEqual(shellState({ chrome: { sidebar: 'collapsed' } }), { mobile: false, rail: true, drawer: null });
  // idempotent
  const once = applyMobile(rd(mob), { viewport: 'mobile' }); assert.equal(applyMobile(once, { viewport: 'mobile' }), once);
  console.log('parity-shell ok');
} finally { await b.close(); fs.rmSync(work, { recursive: true, force: true }); fs.rmSync(tmp, { recursive: true, force: true }); }
