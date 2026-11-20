// Generic "static HTML" spec source: components that are hand-authored HTML/CSS (native apps such as huf-ios / huf-android cannot be
// DOM-captured). Same outputs as capture.mjs app mode: component.html ({{slots}}), slots/states/measurements/harness.json, JS-free
// preview(.dark).html, screenshot(.dark).png, states/*.png. Spec shape:
//   { id, name, group, static: true, width: 402, height?: stage height, dsf: 3, css: ['huf-ios/huf-ios-fonts.css', ...], darkTheme: 'dark',
//     slots: { name: 'sample text' }, render: (values, props) => html, props: {}, variants: { name: { props, values, state?, describe } },
//     describe: [what, when], modes: ['light','dark'], lang: 'en', dir: 'ltr' }
import fs from 'fs';
import { ROOT } from './lib.mjs';
const unesc = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&quot;/g, '"');
const ph = (names) => new Proxy({}, { get: (_, k) => (names.has(k) ? `{{${k}}}` : `{{${String(k)}}}`) });
export const fillStatic = (html, values) => { const all = { ...values }; for (const [k, v] of Object.entries(values)) all[k + '_initials'] = String(v).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); return html.replace(/\{\{([a-z0-9_]+)\}\}/gi, (m, k) => (k in all ? all[k] : m)); };
const doc = (spec, body, { dark = false, base = '../../tokens/css/', title = '' } = {}) => {
  const links = spec.css.map((f) => `<link rel="stylesheet" href="${base}${f}">`).join('\n');
  const ha = ` lang="${spec.lang || 'en'}"${dark ? ` data-theme="${spec.darkTheme || 'dark'}"` : ''}`;
  return `<!doctype html>\n<html${ha}>\n<head><meta charset="utf-8"><title>${title}</title>\n${links}\n<style>html,body{margin:0}body{background:var(--hi-canvas,#fff);min-height:${spec.height || 0}px}#ui-kit-stage{position:absolute;left:0;top:0;width:${spec.width}px${spec.height ? `;height:${spec.height}px` : ''}}*{animation:none!important;transition:none!important;caret-color:transparent!important}</style></head>\n<body>\n<div id="ui-kit-stage">\n${body}\n</div>\n</body></html>\n`;
};
export async function captureStatic(spec, browser) {
  const dir = ROOT + 'components/' + spec.id + '/'; fs.mkdirSync(dir + 'states', { recursive: true });
  const samples = spec.slots; const names = new Set(Object.keys(samples));
  const tpl = spec.render(ph(names), spec.props || {});
  const modes = spec.modes || ['light', 'dark']; const dsf = spec.dsf || 2;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: dsf }); const page = await ctx.newPage();
  const slotsOut = {}; for (const [k, v] of Object.entries(samples)) slotsOut[k] = { type: 'text', sample: unesc(v), maxLength: Math.max(24, Math.ceil(unesc(v).length * 1.6)), where: 'text', element: 'text' };
  const shoot = async (file, html, selId, out, dark) => { fs.writeFileSync(file, html); await page.goto('file://' + file); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(120); return page.locator(`[data-ui="${selId}"]`).first().screenshot({ path: out, animations: 'disabled' }); };
  const body = fillStatic(tpl, samples); let size, boxes;
  for (const mode of modes) { const dark = mode === 'dark';
    const f = dir + (dark ? 'preview.dark.html' : 'preview.html'); await shoot(f, doc(spec, body, { dark, title: spec.name }), spec.id, dir + (dark ? 'screenshot.dark.png' : 'screenshot.png'), dark);
    if (!dark) { const r = await page.evaluate((id) => { const root = document.querySelector(`[data-ui="${id}"]`); const rb = root.getBoundingClientRect(); const els = [root, ...root.querySelectorAll('[data-ui]')].map((e) => { const b = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), tag: e.tagName.toLowerCase(), interactive: /^(button|a|input|select|textarea)$/i.test(e.tagName), x: +(b.x - rb.x).toFixed(2), y: +(b.y - rb.y).toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; }); return { size: { w: rb.width, h: rb.height }, els }; }, spec.id); size = r.size; boxes = r.els; } }
  // variants -> states/<name>.png + .html (JS-free, light)
  const states = { default: { applicable: true, mechanism: 'none', note: 'markup as captured' } }; const NA = 'touch UI: iOS has no hover/focus/pressed variants in the simulator captures';
  for (const k of ['hover', 'focus', 'active']) states[k] = { applicable: false, reason: NA };
  const used = new Set();
  for (const [name, v] of Object.entries(spec.variants || {})) {
    const html = fillStatic(spec.render(ph(names), { ...(spec.props || {}), ...(v.props || {}) }), { ...samples, ...(v.values || {}) });
    await shoot(dir + `states/${name}.html`, doc(spec, html, { base: '../../../tokens/css/', title: spec.name + ' / ' + name }), spec.id, dir + `states/${name}.png`);
    const e = { applicable: true, mechanism: 'props', props: v.props || {}, values: v.values, screenshot: `states/${name}.png`, preview: `states/${name}.html`, description: v.describe };
    states[name] = e; if (v.state && !used.has(v.state)) { used.add(v.state); states[v.state] = { ...e, alias: name }; }
  }
  for (const k of ['disabled', 'error', 'loading', 'empty']) if (!states[k]) states[k] = { applicable: false, reason: (spec.na && spec.na[k]) || 'not applicable: this component has no distinct ' + k + ' variant' };
  await ctx.close();
  const meta = { id: spec.id, name: spec.name, group: spec.group, static: true, source: 'static', ancestors: [], bg: null, size, origin: { x: 0, y: 0 }, cssBase: '../../tokens/css/', css: spec.css, modes, describe: spec.describe, darkTheme: spec.darkTheme || 'dark', dsf, clip: null, pad: null, sprite: false, width: spec.width, height: spec.height || null, props: spec.props || {} };
  fs.writeFileSync(dir + 'component.html', tpl + '\n');
  fs.writeFileSync(dir + 'slots.json', JSON.stringify({ component: spec.id, note: '{{<slot>_initials}} placeholders are derived from the slot value (first letters of each word)', slots: slotsOut }, null, 2));
  fs.writeFileSync(dir + 'states.json', JSON.stringify({ component: spec.id, states }, null, 2));
  fs.writeFileSync(dir + 'measurements.json', JSON.stringify({ component: spec.id, viewport: { w: spec.width, h: spec.height || Math.ceil(size.h), deviceScaleFactor: dsf }, size, elements: boxes }, null, 2));
  fs.writeFileSync(dir + 'harness.json', JSON.stringify(meta, null, 2));
  console.log('OK', spec.id, Object.keys(slotsOut).length, 'slots', boxes.length, 'boxes', Object.keys(spec.variants || {}).length, 'variants');
}
