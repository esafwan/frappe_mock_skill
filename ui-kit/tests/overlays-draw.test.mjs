// Every registry menu_open target, every state and every layer draws with zero warnings. node tests/overlays-draw.test.mjs
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec, OVERLAY_TYPES } from '../bin/mock.mjs';
import { sampleTargets } from '../kit-lib/menu-registry.mjs';
import { STATES } from '../kit-lib/states.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = JSON.parse(fs.readFileSync(path.join(KIT, 'samples', 's7-blank.json'), 'utf8'));
const tmp = fs.mkdtempSync(path.join(KIT, 'out', '.overlays-'));
const render = async (name, overlays) => {
  const f = path.join(tmp, `${name.replace(/[^\w.-]+/g, '_')}.json`);
  fs.writeFileSync(f, JSON.stringify({ ...base, overlays }));
  const l = loadSpec(f);
  assert(l.ok, `${name}: ${JSON.stringify(l.errors)}`);
  const a = await renderSpec(l), b = await renderSpec(loadSpec(f));
  assert.equal(a.html, b.html, `${name}: not deterministic`);
  assert.deepEqual(a.warnings, [], `${name}: warnings ${a.warnings.join(' | ')}`);
  assert(!/undefined|NaN|\[object Object\]|\{\{/.test(a.html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')), `${name}: hygiene`);
  return a.html;
};
let n = 0;
try {
  for (const t of sampleTargets()) {
    const target = t === 'ui:sample' ? 'ui:shell.main' : t === 'row_actions:sample' ? 'row_actions:1' : t;
    const html = await render(`menu-${t}`, [{ type: 'menu_open', target }]);
    if (!target.startsWith('ui:')) assert(html.includes(`data-ui="menu:${target}"`), `${target}: menu markup missing`);
    n++;
  }
  for (const s of STATES) {
    const html = await render(`state-${s}`, [{ type: 'state', target: 'ui:shell.main', state: s }]);
    assert(html.includes(`data-state="${s}"`), `state ${s} not applied`);
    n++;
  }
  const html = await render('layers', [
    { type: 'dialog', kind: 'dialog', title: 'One', fields: [{ fieldname: 'a', fieldtype: 'Data', label: 'A' }] },
    { type: 'dialog', kind: 'confirm', message: 'Sure?' },
    { type: 'toast', message: 'Saved', indicator: 'green' },
    { type: 'toast', message: 'Queued', indicator: 'blue' },
  ]);
  assert.equal((html.match(/data-layer="modal"/g) || []).length, 2, 'two stacked dialogs');
  assert(html.indexOf('Saved') < html.indexOf('Queued'), 'toast order');
  assert(OVERLAY_TYPES.includes('toast'));
  n++;
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
console.log(`overlays-draw: ${n} cases ok`);
