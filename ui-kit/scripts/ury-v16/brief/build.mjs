// Brief capture wrapper (derived from pos/captain: flattens object slots to .sample, applies canvas, maps dark theme, rebuilds RTL previews)
// usage: node ui-kit/scripts/ury-v16/brief/build.mjs [id...]
import fs from 'fs';
import { launch, ROOT } from '../../lib.mjs';
import { captureStatic, fillStatic } from '../../static-capture.mjs';
const norm = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, v && typeof v === 'object' ? v.sample : v]));
const all = (await import('./brief.spec.mjs')).specs;
const only = process.argv.slice(2); const specs = all.filter((s) => !only.length || only.includes(s.id));
const b = await launch();
const ph = () => new Proxy({}, { get: (_, k) => `{{${String(k)}}}` });
for (const s0 of specs) {
  const s = { ...s0, slots: norm(s0.slots), rtlValues: norm(s0.rtlValues) };
  s.variants = Object.fromEntries(Object.entries(s0.variants || {}).map(([k, v]) => [k, { ...v, values: norm(v.values) }]));
  await captureStatic(s, b);
  const dir = ROOT + 'components/' + s.id + '/';
  const fixBg = (f) => fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('var(--hi-canvas,#fff)', s.canvas).replace(/ data-theme="\.dark"/, ' class="dark"'));
  const files = ['preview.html', 'preview.dark.html'].map((f) => [dir + f, dir + f.replace('preview', 'screenshot').replace('.html', '.png')]);
  const light = fs.readFileSync(dir + 'preview.html', 'utf8'); const head = light.slice(0, light.indexOf('<body>'));
  const body = fillStatic(s.render(ph(), s.props || {}), { ...s.slots, ...s.rtlValues });
  fs.writeFileSync(dir + 'preview.rtl.html', head.replace('<html lang="en">', '<html lang="ar" dir="rtl">') + '<body>\n<div id="ui-kit-stage">\n' + body + '\n</div>\n</body></html>\n');
  files.push([dir + 'preview.rtl.html', dir + 'screenshot.rtl.png']);
  if (fs.existsSync(dir + 'states')) for (const n of fs.readdirSync(dir + 'states')) if (n.endsWith('.html')) files.push([dir + 'states/' + n, dir + 'states/' + n.replace('.html', '.png')]);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: s.dsf || 2 }); const p = await ctx.newPage();
  for (const [h, png] of files) { fixBg(h); await p.goto('file://' + h); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120); await p.locator(`[data-ui="${s.id}"]`).first().screenshot({ path: png, animations: 'disabled' }); }
  await ctx.close(); console.log('built', s.id);
}
await b.close();
