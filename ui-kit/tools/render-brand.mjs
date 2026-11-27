#!/usr/bin/env node
// Branded render of a kit page/component without forked HTML.
//   node tools/render-brand.mjs --brand brands/happiol.json --page member-360 [--out f.html] [--theme dark] [--lang ar] [--dataset d]
//   node tools/render-brand.mjs --brand brands/happiol.json --component <la-id> [--state s] [--out f.html]
// Output keeps relative css links from pages/la/ (cssBase ../../tokens/css/) unless --css-base is given.
import fs from 'fs';
import { loadBrand, applyBrand, brandViolations } from './brand.mjs';
import { composeMember360 } from './compose-la-member360.mjs';
import { renderLa } from './render-la.mjs';
const a = process.argv.slice(2); const g = (k) => { const i = a.indexOf(k); return i < 0 ? undefined : a[i + 1]; };
const bf = g('--brand'); if (!bf) { console.error('usage: render-brand.mjs --brand brand.json (--page member-360|--component id) [--out f]'); process.exit(1); }
const brand = loadBrand(bf); let html;
if (g('--page')) { if (g('--page') !== 'member-360') { console.error('only member-360 page composer is wired'); process.exit(1); } html = composeMember360({ theme: g('--theme'), lang: g('--lang'), dataset: g('--dataset'), mode: g('--mode') }); }
else if (g('--component')) html = renderLa(g('--component'), { state: g('--state'), theme: g('--theme'), lang: g('--lang'), cssBase: g('--css-base') });
else { console.error('need --page or --component'); process.exit(1); }
html = applyBrand(html, brand);
const bad = brandViolations(html, brand); if (bad.length) { console.error('brand forbid hits: ' + bad.join(', ')); process.exit(2); }
g('--out') ? fs.writeFileSync(g('--out'), html) : process.stdout.write(html);
