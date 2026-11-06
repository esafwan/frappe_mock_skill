// Fails on anything that would need network/JS/clock: scripts, on* handlers, http(s) or absolute-path URLs, Date/random in markup.
import fs from 'fs'; import path from 'path'; import { ROOT } from './lib.mjs';
let bad = 0; const err = (f, m) => { bad++; console.log('LINT', path.relative(ROOT, f), m); };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of [...walk(ROOT + 'components'), ...(fs.existsSync(ROOT + 'pages') ? walk(ROOT + 'pages') : [])]) {
  if (!/\.(html|css)$/.test(f)) continue; const s = fs.readFileSync(f, 'utf8');
  const noData = s.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, 'data:');
  if (/<script/i.test(noData)) err(f, '<script>');
  if (/\son[a-z]+\s*=/i.test(noData.replace(/data-[a-z-]+="[^"]*"/g, ''))) err(f, 'inline event handler');
  for (const m of noData.matchAll(/\b(?:src|href|action|poster)="(https?:)?\/\/[^"]+"/g)) err(f, 'network url ' + m[0].slice(0, 70));
  for (const m of noData.matchAll(/\b(?:src|srcset|poster)="\/[^"]*"/g)) err(f, 'absolute path ' + m[0].slice(0, 70));
  for (const m of noData.matchAll(/url\(\s*["']?(\/[^)"']+|https?:[^)"']+)/g)) err(f, 'css url ' + m[1].slice(0, 70));
  for (const m of noData.matchAll(/\b[A-Z]{2,5}-(?:[A-Z]{2,5}-)?\d{4}-\d{3,}\b/g)) err(f, 'document id leaked ' + m[0]);
  for (const m of noData.matchAll(/[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/g)) if (!/@example\.com$/.test(m[0])) err(f, 'email ' + m[0]);
  if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(noData.replace(/<path[^>]*>/g, '').replace(/d="[^"]*"/g, ''))) err(f, 'ip-like number');
  if (/@import\s+url\(\s*['"]?https?:/.test(noData)) err(f, '@import network');
}
// every component has the required files and data-ui root
for (const d of fs.readdirSync(ROOT + 'components')) { const dir = ROOT + 'components/' + d + '/';
  if (!fs.existsSync(dir + 'harness.json')) continue;
  for (const f of ['component.html', 'states.json', 'slots.json', 'screenshot.png', 'measurements.json', 'README.md']) if (!fs.existsSync(dir + f)) err(dir + f, 'missing');
  const html = fs.existsSync(dir + 'component.html') ? fs.readFileSync(dir + 'component.html', 'utf8') : '';
  if (!new RegExp(`data-ui="${d}"`).test(html)) err(dir + 'component.html', 'root data-ui missing');
  if (fs.existsSync(dir + 'states.json')) { const st = JSON.parse(fs.readFileSync(dir + 'states.json')).states; for (const k of ['default', 'hover', 'focus', 'active', 'disabled', 'error', 'loading', 'empty']) if (!(k in st)) err(dir + 'states.json', 'state key ' + k + ' missing'); }
}
console.log(bad ? `lint: ${bad} problems` : 'lint: clean'); process.exit(bad ? 1 : 0);
