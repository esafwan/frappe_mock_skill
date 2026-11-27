#!/usr/bin/env node
// Query the ui-kit manifest without opening the 11 MB file.
//   node ui-kit/tools/kit.mjs find <words...>        ranked pages (max 20 lines)
//   node ui-kit/tools/kit.mjs page <id> [--variant K] [--grep word] [--max N]
// Output is hard-capped at 90 lines.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CAP = 90;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = [];
const say = (s) => out.push(s);
const flush = () => {
  const lines = out.length > CAP ? [...out.slice(0, CAP - 1), `... ${out.length - CAP + 1} more lines truncated (use --grep/--variant/--max)`] : out;
  console.log(lines.join('\n'));
};

const [cmd, ...rest] = process.argv.slice(2);
const flags = {}, words = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) flags[rest[i].slice(2)] = rest[++i];
  else words.push(rest[i]);
}
if (!['find', 'page'].includes(cmd) || !words.length) {
  console.log('usage: kit.mjs find <words...> | page <id> [--variant K] [--grep word] [--max N]');
  process.exit(2);
}
const m = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
const pages = m.pages;
const variantsOf = (p) => (Array.isArray(p.variants) ? p.variants.map((v) => [v.file, v]) : Object.entries(p.variants || {}));
const targetsOf = (v) => (v.targets || []).map((t) => `${t.id} ${t.box.x},${t.box.y} ${t.box.w}x${t.box.h}`);

if (cmd === 'find') {
  const ws = words.map((w) => w.toLowerCase());
  const scored = Object.values(pages).map((p) => {
    const head = [p.id, p.title, p.system, ...(p.components || [])].join(' ').toLowerCase();
    const tg = variantsOf(p).flatMap(([, v]) => (v.targets || []).map((t) => t.id.toLowerCase()));
    let s = 0;
    for (const w of ws) { if (head.includes(w)) s += 3; if (tg.some((t) => t.includes(w))) s += 1; }
    return { p, s };
  }).filter((x) => x.s).sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id));
  say(`${scored.length} page(s) match "${words.join(' ')}"`);
  for (const { p, s } of scored.slice(0, 20)) say(`${s}\t${p.id}\t${p.system}\t${p.title || ''}`);
} else {
  const p = pages[words[0]];
  if (!p) {
    say(`no page "${words[0]}". Nearest: ${Object.keys(pages).filter((k) => k.includes(words[0].split('-').pop())).slice(0, 8).join(', ') || 'none'}`);
  } else {
    say(`${p.id}  [${p.system}]  ${p.title || ''}`);
    say(`html: ${p.html || variantsOf(p)[0]?.[1].file || '?'}`);
    if (p.components?.length) say(`components: ${p.components.join(', ')}`);
    const vs = variantsOf(p);
    say(`variants (${vs.length}):`);
    for (const [k, v] of vs.slice(0, 12)) {
      const meta = ['lang', 'currency', 'theme', 'state'].map((f) => v[f]).filter(Boolean).join('/');
      say(`  ${k}  ${v.file}${meta ? '  ' + meta : ''}${v.targets ? `  targets=${v.targets.length}` : ''}`);
    }
    if (vs.length > 12) say(`  ... ${vs.length - 12} more variants`);
    // Targets: only some pages carry them; per-page sidecar manifests are not read (manifest is source of truth).
    const pick = flags.variant ? vs.find(([k]) => k === flags.variant) : vs.find(([, v]) => v.targets?.length);
    if (!pick || !pick[1].targets) say('targets: none recorded in manifest for this page');
    else {
      let ts = targetsOf(pick[1]);
      if (flags.grep) ts = ts.filter((t) => t.toLowerCase().includes(flags.grep.toLowerCase()));
      const max = Math.min(Number(flags.max) || 50, 60);
      say(`targets of "${pick[0]}" (${ts.length}${flags.grep ? ' matching' : ''}; id x,y wxh @1440x900):`);
      ts.slice(0, max).forEach((t) => say('  ' + t));
      if (ts.length > max) say(`  ... ${ts.length - max} more (use --grep or --max)`);
    }
  }
}
flush();
