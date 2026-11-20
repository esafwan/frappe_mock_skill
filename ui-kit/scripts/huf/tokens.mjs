// Extract a HUF build's CSS into the kit: tokens/css/huf/<branch-slug>/*.css (url() rewritten to local files),
// and (for the base branch) the CSS custom properties into tokens/huf/vars.css + tokens/huf/tokens.json.
//   node scripts/huf/tokens.mjs pre-develop
import fs from 'fs'; import path from 'path';
import { ROOT } from '../lib.mjs';
import { distFor, slug, openHuf, goHuf } from './app.mjs';
const source = process.argv[2] || 'pre-develop'; const DIST = distFor(source);
const outDir = ROOT + `tokens/css/huf/${slug(source)}/`; fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
const fontDir = ROOT + 'tokens/huf/fonts/'; fs.mkdirSync(fontDir, { recursive: true });
const files = fs.readdirSync(DIST + '/assets').filter((f) => f.endsWith('.css'));
for (const f of files) {
  let css = fs.readFileSync(DIST + '/assets/' + f, 'utf8');
  css = css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (m, q, u) => {
    if (u.startsWith('data:') || u.startsWith('#')) return m;
    const fn = path.basename(u.split('?')[0].split('#')[0]); const src = path.join(DIST, 'assets', fn);
    if (!fs.existsSync(src)) return 'none';
    fs.copyFileSync(src, fontDir + fn); return `url("../../../huf/fonts/${fn}")`;
  });
  fs.writeFileSync(outDir + f, css);
}
console.log('css', files.length, 'files ->', path.relative(ROOT, outDir));
if (source === 'pre-develop' || process.argv.includes('--vars')) {
  const { page, browser } = await openHuf({ source });
  await goHuf(page, '/agents');
  const vars = await page.evaluate(() => { const cs = getComputedStyle(document.documentElement); const o = {};
    const walk = (rs) => { for (const r of rs) { if (r.cssRules) walk(r.cssRules); if (r.style && r.selectorText && /(^|,)\s*:root\s*(,|$)/.test(r.selectorText)) for (const p of r.style) if (p.startsWith('--')) o[p] = cs.getPropertyValue(p).trim(); } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} } return o; });
  for (const k of ['--display', '--body', '--mono']) delete vars[k]; // overridden by huf-fonts.css
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'midnight'));
  const dark = await page.evaluate((keys) => { const cs = getComputedStyle(document.documentElement); return Object.fromEntries(keys.map((k) => [k, cs.getPropertyValue(k).trim()])); }, Object.keys(vars));
  const darkDiff = Object.fromEntries(Object.entries(dark).filter(([k, v]) => v !== vars[k]));
  const keys = Object.keys(vars).sort();
  fs.mkdirSync(ROOT + 'tokens/huf', { recursive: true });
  fs.writeFileSync(ROOT + 'tokens/huf/vars.css', `/* HUF computed CSS custom properties. Light = :root (no data-theme attribute); dark = html[data-theme="midnight"] (HUF's only dark theme; tailwind dark: variant is off). Source: ${source} build. */\n:root {\n${keys.map((k) => `  ${k}: ${vars[k]};`).join('\n')}\n}\n[data-theme="midnight"] {\n${Object.keys(darkDiff).sort().map((k) => `  ${k}: ${darkDiff[k]};`).join('\n')}\n}\n`);
  const pick = (k) => vars[k] ?? null;
  fs.writeFileSync(ROOT + 'tokens/huf/tokens.json', JSON.stringify({ source, generatedFrom: 'computed :root custom properties of the live (mocked) app', count: keys.length,
    design: { doc: 'DESIGN.md (HUF "Instrument / Control-Room" v2.0). NOTE: the shipped build is the truth; its palette differs from DESIGN.md section 2 (e.g. --signal is violet, not orange).', palette: Object.fromEntries(['--paper', '--paper-deep', '--panel', '--ink', '--ink-soft', '--steel', '--steel-soft', '--line', '--line-dark', '--signal', '--signal-ink', '--good', '--warning', '--destructive'].map((k) => [k, pick(k)])),
      radius: Object.fromEntries(['--r', '--r-sm', '--r-md', '--r-lg', '--radius'].map((k) => [k, pick(k)])),
      fonts: { declared: Object.fromEntries(['display', 'body', 'mono'].map((k) => [k, (files.map((f) => fs.readFileSync(DIST + '/assets/' + f, 'utf8')).join('').match(new RegExp(`--${k}:([^;}]+)`)) || [])[1] || null])), bundled: 'tokens/css/huf/huf-fonts.css overrides --display/--body with Inter and --mono with Geist Mono (see tokens/fonts/LICENSES.md)' } },
    vars, darkTheme: { attribute: 'data-theme', value: 'midnight', overrides: darkDiff } }, null, 1));
  console.log('vars', keys.length);
  await browser.close();
}
