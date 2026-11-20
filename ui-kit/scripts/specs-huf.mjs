// HUF component specs: aggregates every scripts/specs-huf-<area>.mjs (one file per area, owned by one task: no merge conflicts).
// Spec shape (same as specs.mjs, plus app-mode fields):
//   { id: 'huf-<name>', name, group: 'huf', url: '/agents' (app route under /huf), root: CSS selector of the component root,
//     source: 'pre-develop' | '<branch>' (which build in .huf-cache/dist; scripts/huf/build.sh <branch>),
//     fixtures: ['agents', ...] (scripts/huf/fixtures/<name>.mjs; 'base' is always on), waitFor: selector proving data rendered,
//     prepare: async (page) => {...} (click to open a modal, fill a field, select a row ...), targets: { name: selector }, states: {...}, na: {...},
//     modes: ['light', 'dark'] (default; dark = HUF's "midnight" theme; HUF has no RTL), pad: {l,t,r,b} (for overlays/shadows), time: ISO clock override }
// css is NOT listed by hand: capture maps the stylesheets the live page loaded to tokens/css/huf/<source>/ and adds huf-fonts.css.
import fs from 'fs';
const dir = new URL('.', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => /^specs-huf-[a-z0-9-]+\.mjs$/.test(f)).sort();
export const specs = [];
for (const f of files) for (const s of (await import(new URL(f, dir))).specs) specs.push({ group: 'huf', modes: ['light', 'dark'], source: 'pre-develop', fixtures: [], file: f.replace(/^specs-huf-|\.mjs$/g, ''), ...s });
const seen = new Set(); for (const s of specs) { if (!/^huf-[a-z0-9-]+$/.test(s.id)) throw new Error('huf spec id must be huf-<kebab>: ' + s.id); if (seen.has(s.id)) throw new Error('duplicate huf spec id ' + s.id); seen.add(s.id); }
