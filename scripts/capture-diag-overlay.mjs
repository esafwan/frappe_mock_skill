import fs from 'fs'; import path from 'path';
import { chromium } from 'playwright';
import { BASE, ROOT, open, go } from './lib.mjs';
import { extractInPage, harnessDoc, fill } from './engine-diag-overlay.mjs';
import { specs as deskSpecs } from './specs.mjs';
const posSpecs = fs.existsSync(new URL('./specs-pos.mjs', import.meta.url)) ? (await import('./specs-pos.mjs')).specs : [];
const specs = [...deskSpecs, ...posSpecs];
for (const s of specs) if (s.id === 'field-link') { const pr = s.prepare; s.prepare = async (p) => { await pr(p); await p.evaluate(() => document.activeElement && document.activeElement.blur()); }; }

const only = process.argv.slice(2);
const sprite = fs.readFileSync(ROOT + 'tokens/icons/sprite.svg.html', 'utf8');
const symbolMap = {}; for (const m of sprite.matchAll(/<symbol[^>]*id="([^"]+)"[\s\S]*?<\/symbol>/g)) symbolMap[m[1]] = m[0];
export const spriteFor = (html) => { const ids = new Set([...html.matchAll(/(?:xlink:)?href="#([^"]+)"/g)].map(m => m[1])); const syms = [...ids].filter(i => symbolMap[i]).map(i => symbolMap[i]).join(''); return syms ? `<svg class="icon-sprite" aria-hidden="true" style="display:none">${syms}</svg>` : ''; };

const STATES = ['default', 'hover', 'focus', 'active', 'disabled', 'error', 'loading', 'empty'];
const snap = () => { const r = document.querySelector('[data-ui]'); return null; };

const { browser, page } = await open();
for (const spec of specs) {
  if (only.length && !only.includes(spec.id)) continue;
  const dir = ROOT + 'components/' + spec.id + '/'; fs.mkdirSync(dir + 'states', { recursive: true });
  const out = { id: spec.id }; let bgDark;
  try {
    const modes = [['light', false, false], ['dark', true, false], ['rtl', false, true]];
    for (const [mode, dark, rtl] of modes) {
      await go(page, spec.url, { dark });
      if (rtl) await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
      if (spec.prepare) await spec.prepare(page);
      await page.waitForTimeout(spec.settle ?? 600);
      await page.evaluate(()=>{const s=document.createElement('style');s.dataset.uikit='1';s.textContent='*{animation:none!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(s)});
      const rootSel = spec.root;
      const data = await page.evaluate(extractInPage, { rootSel, id: spec.id, targets: spec.targets || {} });
      const loc = page.locator(`[data-ui="${spec.id}"]`).first();
      await loc.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const pad = Object.assign({ l: 0, t: 0, r: 0, b: 0 }, spec.pad || {});
      const shotPath = dir + (dark ? 'screenshot.dark.png' : rtl ? 'screenshot.rtl.png' : 'screenshot.png');
      if (spec.pad && rtl) await page.evaluate(({ padL, sel }) => { const x = document.querySelector(sel).getBoundingClientRect().x; if (x < padL) document.body.style.transform = `translateX(${padL - x}px)`; }, { padL: pad.l, sel: `[data-ui="${spec.id}"]` }); // RTL root sits near the left edge: shift page so the left pad is not clamped (preview always has pad.l of room)
      if (spec.pad) await page.evaluate((sel) => { const r = document.querySelector(sel); document.querySelectorAll('[data-keep]').forEach(e => e.removeAttribute('data-keep')); r.setAttribute('data-keep', ''); r.querySelectorAll('*').forEach(e => e.setAttribute('data-keep', '')); for (let a = r.parentElement; a; a = a.parentElement) a.setAttribute('data-keep', ''); const s = document.createElement('style'); s.dataset.uikit = '1'; s.textContent = 'body :not([data-keep]){visibility:hidden!important}'; document.head.appendChild(s); }, `[data-ui="${spec.id}"]`);
      if (dark) bgDark = await page.evaluate(() => { for (let p = document.body; p; p = p.parentElement) { const c = getComputedStyle(p).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; } return 'rgb(255,255,255)'; });
      const shot = async (pth) => { if (!spec.pad) return loc.screenshot({ path: pth, animations: 'disabled' });
        const r = await loc.evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height }; });
        return page.screenshot({ path: pth, fullPage: true, clip: { x: Math.max(0, r.x - pad.l), y: Math.max(0, r.y - pad.t), width: Math.ceil(r.w + pad.l + pad.r), height: Math.ceil(r.h + pad.t + pad.b) } }); };
      await shot(shotPath);
      if (dark || rtl) continue;
      const fr = await loc.evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY }; }); data.rootFrac = { x: +((fr.x % 1 + 1) % 1).toFixed(3), y: +((fr.y % 1 + 1) % 1).toFixed(3) };
      data.pad = pad; data.clip = spec.pad ? { w: Math.ceil(data.size.w + pad.l + pad.r), h: Math.ceil(data.size.h + pad.t + pad.b) } : null;
      Object.assign(out, data);
      // states
      const states = {};
      for (const st of STATES) {
        const def = (spec.states || {})[st];
        if (st === 'default') { states[st] = { applicable: true, mechanism: 'none', note: 'markup as captured' }; continue; }
        if (!def) { states[st] = { applicable: false, reason: (spec.na && spec.na[st]) || 'no such state on this component' }; continue; }
        const before = await page.evaluate(({ id }) => { const r = document.querySelector(`[data-ui="${id}"]`); return [r, ...r.querySelectorAll('*')].map((e, i) => ({ i, tag: e.tagName, ui: e.getAttribute('data-ui'), cls: e.getAttribute('class') || '', attrs: Object.fromEntries([...e.attributes].filter(a => a.name !== 'class' && a.name !== 'style').map(a => [a.name, a.value])), }));}, { id: spec.id });
        const tgtSel = def.target ? (spec.targets?.[def.target] || def.target) : null;
        const tloc = tgtSel ? page.locator(`[data-ui="${spec.id}"] ${tgtSel}`).first() : loc;
        const csBefore = tgtSel ? await tloc.evaluate(e => { const c = getComputedStyle(e); return { color: c.color, backgroundColor: c.backgroundColor, borderColor: c.borderTopColor, boxShadow: c.boxShadow, outline: c.outline, opacity: c.opacity, textDecoration: c.textDecorationLine, cursor: c.cursor }; }) : null;
        try {
          if (def.act) await def.act(page, tloc, loc);
          else if (st === 'hover') await tloc.hover({ force: true });
          else if (st === 'focus') await tloc.focus();
          else if (st === 'active') { await tloc.hover({ force: true }); await page.mouse.down(); }
          await page.waitForTimeout(250);
          const after = await page.evaluate(({ id }) => { const r = document.querySelector(`[data-ui="${id}"]`); return [r, ...r.querySelectorAll('*')].map((e, i) => ({ i, tag: e.tagName, ui: e.getAttribute('data-ui'), cls: e.getAttribute('class') || '', attrs: Object.fromEntries([...e.attributes].filter(a => a.name !== 'class' && a.name !== 'style').map(a => [a.name, a.value])) })); }, { id: spec.id });
          const changes = [];
          if (before.length === after.length) for (let i = 0; i < before.length; i++) {
            const b = before[i], a = after[i]; if (b.tag !== a.tag) continue;
            const bc = new Set(b.cls.split(/\s+/).filter(Boolean)), ac = new Set(a.cls.split(/\s+/).filter(Boolean));
            const addClass = [...ac].filter(c => !bc.has(c)), removeClass = [...bc].filter(c => !ac.has(c));
            const attrs = {}; for (const k of new Set([...Object.keys(b.attrs), ...Object.keys(a.attrs)])) if (b.attrs[k] !== a.attrs[k]) attrs[k] = k in a.attrs ? a.attrs[k] : null;
            if (addClass.length || removeClass.length || Object.keys(attrs).length) changes.push({ element: a.ui || `#path:${i}`, addClass, removeClass, attrs });
          } else changes.push({ note: 'DOM structure changed', before: before.length, after: after.length });
          const csAfter = tgtSel ? await tloc.evaluate(e => { const c = getComputedStyle(e); return { color: c.color, backgroundColor: c.backgroundColor, borderColor: c.borderTopColor, boxShadow: c.boxShadow, outline: c.outline, opacity: c.opacity, textDecoration: c.textDecorationLine, cursor: c.cursor }; }) : null;
          const styleDelta = {}; if (csBefore) for (const k in csBefore) if (csBefore[k] !== csAfter[k]) styleDelta[k] = { from: csBefore[k], to: csAfter[k] };
          await shot(dir + `states/${st}.png`);
          states[st] = { applicable: true, mechanism: changes.length ? 'class-attr' : 'css-pseudo', pseudo: st === 'hover' ? ':hover' : st === 'focus' ? ':focus' : st === 'active' ? ':active' : undefined, target: tgtSel ? (await tloc.getAttribute('data-ui')) || tgtSel : spec.id, changes, computedStyleDelta: styleDelta, screenshot: `states/${st}.png`, description: def.description };
          if (st === 'active') await page.mouse.up();
          if (def.reset) await def.reset(page, tloc, loc);
          else if (def.act || st === 'focus') await page.evaluate(() => document.activeElement?.blur?.());
          await page.mouse.move(0, 0);
        } catch (e) { states[st] = { applicable: false, reason: 'capture failed: ' + e.message.split('\n')[0] }; }
      }
      out.states = states;
    }
    // write files
    const meta = { id: spec.id, name: spec.name, group: spec.group, source: spec.url, ancestors: out.ancestors, bg: out.bg, bgDark, pageBg: undefined, size: out.size, origin: out.rootFrac, stageW: (out.ancestors.find(a => a.tag !== 'html' && a.tag !== 'body') || {}).w, cssBase: '../../tokens/css/', css: spec.css || ['frappe-desk.css', 'erpnext-erpnext.css'], fonts: out.font, sprite: true, inlineCss: out.inlineCss, pad: out.pad, clip: out.clip };
    const bodyHtml = out.html;
    fs.writeFileSync(dir + 'component.html', bodyHtml + '\n');
    const slots = {}; for (const s of out.slots) slots[s.name] = { type: s.type, sample: s.sample, maxLength: s.maxLength, where: s.where, element: s.element };
    fs.writeFileSync(dir + 'slots.json', JSON.stringify({ component: spec.id, slots }, null, 2));
    fs.writeFileSync(dir + 'states.json', JSON.stringify({ component: spec.id, states: out.states }, null, 2));
    fs.writeFileSync(dir + 'measurements.json', JSON.stringify({ component: spec.id, viewport: { w: 1440, h: 900, deviceScaleFactor: 2 }, size: out.size, elements: out.boxes }, null, 2));
    if (out.inlineCss) fs.writeFileSync(dir + 'inline.css', out.inlineCss);
    fs.writeFileSync(dir + 'harness.json', JSON.stringify(meta, null, 2));
    const samples = Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, v.sample]));
    const prev = harnessDoc(meta, spriteFor(bodyHtml) + fill(bodyHtml, samples), { title: spec.name });
    fs.writeFileSync(dir + 'preview.html', prev);
    fs.writeFileSync(dir + 'preview.rtl.html', harnessDoc(meta, spriteFor(bodyHtml) + fill(bodyHtml, samples), { rtl: true, title: spec.name }));
    const prevDark = harnessDoc(meta, spriteFor(bodyHtml) + fill(bodyHtml, samples), { dark: true, title: spec.name });
    fs.writeFileSync(dir + 'preview.dark.html', prevDark);
    console.log('OK', spec.id, Object.keys(slots).length, 'slots', out.boxes.length, 'boxes');
  } catch (e) { console.log('FAIL', spec.id, e.message.split('\n')[0]); }
}
await browser.close();
