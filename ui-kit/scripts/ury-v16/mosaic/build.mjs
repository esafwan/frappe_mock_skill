// Mosaic/admin/brief/desk capture wrapper (derived from the self-order one). Handles modes light/dark/rtl; skips dark when a spec has no dark mode.
// Captain capture wrapper: normalises object slots (money/image -> .sample), runs static-capture, then applies the spec canvas
// (dark theme needs hsl(var(--background)) behind transparent surfaces), regenerates the RTL preview and re-shoots every html.
// usage: node ui-kit/scripts/ury-v16/mosaic/build.mjs [id...]
import fs from 'fs'; import path from 'path';
import { launch, ROOT } from '../../lib.mjs';
import { captureStatic, fillStatic } from '../../static-capture.mjs';
const norm = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, v && typeof v === 'object' ? v.sample : v]));
const D = new URL('../', import.meta.url).pathname; const all = [];
for (const f of ['mosaic/components','mosaic/screens','admin/dashboard','admin/masters','admin/reports','admin/shell','brief/brief','desk/nav','desk/overlays','desk/views','desk/workspace']) all.push(...(await import(D + f + '.spec.mjs')).specs);
const only = process.argv.slice(2); const specs = all.filter((s) => !only.length || only.includes(s.id));
const b = await launch();
const ph = () => new Proxy({}, { get: (_, k) => `{{${String(k)}}}` });
for (const s0 of specs) {
  const s = { ...s0, slots: norm(s0.slots), rtlValues: norm(s0.rtlValues) };
  s.variants = Object.fromEntries(Object.entries(s0.variants || {}).map(([k, v]) => [k, { ...v, values: norm(v.values) }]));
  await captureStatic(s, b);
  const dir = ROOT + 'components/' + s.id + '/';
  const fixBg = (f) => fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('var(--hi-canvas,#fff)', s.canvas).replace(/ data-theme="\.dark"/, ' class="dark"'));
  const files = ['preview.html', 'preview.dark.html'].filter((f) => (s.modes || ['light', 'dark']).includes(f.includes('dark') ? 'dark' : 'light')).map((f) => [dir + f, dir + f.replace('preview', 'screenshot').replace('.html', '.png')]);
  const light = fs.readFileSync(dir + 'preview.html', 'utf8'); const head = light.slice(0, light.indexOf('<body>'));
  const body = fillStatic(s.render(ph(), s.props || {}), { ...s.slots, ...s.rtlValues });
  if ((s.modes || []).includes('rtl')) fs.writeFileSync(dir + 'preview.rtl.html', head.replace('<html lang="en">', '<html lang="ar" dir="rtl">') + '<body>\n<div id="ui-kit-stage">\n' + body + '\n</div>\n</body></html>\n');
  if ((s.modes || []).includes('rtl')) files.push([dir + 'preview.rtl.html', dir + 'screenshot.rtl.png']);
  for (const n of fs.readdirSync(dir + 'states')) if (n.endsWith('.html')) files.push([dir + 'states/' + n, dir + 'states/' + n.replace('.html', '.png')]);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: s.dsf || 2 }); const p = await ctx.newPage();
  for (const [h, png] of files) { fixBg(h); await p.goto('file://' + h); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120); await p.locator(`[data-ui="${s.id}"]`).first().screenshot({ path: png, animations: 'disabled' }); }
  await ctx.close(); console.log('built', s.id);
}
await b.close();
