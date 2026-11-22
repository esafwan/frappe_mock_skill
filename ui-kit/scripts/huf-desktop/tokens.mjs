// Copy the Huf Desktop renderer build's CSS into the kit: tokens/css/huf-desktop/build/*.css, with every url() asset
// (fontsource IBM Plex / JetBrains Mono, KaTeX) copied to tokens/css/huf-desktop/fonts/ and rewritten to it.
//   node scripts/huf-desktop/tokens.mjs        (after scripts/huf-desktop/build.sh)
import fs from 'fs'; import path from 'path';
import { ROOT } from '../lib.mjs';
import { DIST } from './app.mjs';
const outDir = ROOT + 'tokens/css/huf-desktop/build/'; const fontDir = ROOT + 'tokens/css/huf-desktop/fonts/';
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(fontDir, { recursive: true });
const files = fs.readdirSync(DIST + '/assets').filter((f) => f.endsWith('.css')); let assets = 0;
for (const f of files) {
  let css = fs.readFileSync(DIST + '/assets/' + f, 'utf8');
  css = css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (m, q, u) => {
    if (u.startsWith('data:') || u.startsWith('#')) return m;
    const fn = path.basename(u.split('?')[0].split('#')[0]); const src = path.join(DIST, 'assets', fn);
    if (!fs.existsSync(src)) return 'none';
    if (!fs.existsSync(fontDir + fn)) { fs.copyFileSync(src, fontDir + fn); assets++; }
    return `url("../fonts/${fn}")`;
  });
  fs.writeFileSync(outDir + f, css);
}
const src = path.join(DIST, '.source'); if (fs.existsSync(src)) fs.copyFileSync(src, outDir + 'SOURCE.txt');
console.log('css', files.length, 'files,', assets, 'assets ->', path.relative(ROOT, outDir));
