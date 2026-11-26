import fs from 'node:fs';
import assert from 'node:assert/strict';
import render from './index.mjs';
import { BLOCKS } from './blocks/index.mjs';

const ctx = (w) => ({ warn: (m) => w.push(m), overlays: [], locale: 'en-US' });
const mk = (content, extra = {}) => ({ meta: { workspace: { name: 'T', title: 'T', public: 1, content, shortcuts: [{ label: 'A', type: 'DocType', link_to: 'A', doc_view: 'List', color: 'Green', format: '{} open' }], links: [{ type: 'Card Break', label: 'C' }, { type: 'Link', label: 'L', link_type: 'DocType', link_to: 'L', onboard: 1, description: 'd' }], number_cards: [{ label: 'N', number_card_name: 'N' }], charts: [{ chart_name: 'Ch' }], quick_lists: [{ label: 'Q', document_type: 'Doc' }], custom_blocks: [{ custom_block_name: 'CB', html: '<p onclick="x()">hi</p><script>1</script>', style: 'p{color:red}' }], ...extra.meta } }, data: { counts: { A: 5 }, number_cards: { N: { value: 10, delta: 25 } }, charts: { Ch: { type: 'Bar', labels: ['a', 'b'], datasets: [{ name: 'x', values: [1, 2] }] } }, onboarding: { O: { steps: [{ title: 's1', status: 'Complete' }, { title: 's2', description: 'x', action_label: 'Go' }] } }, quick_lists: { Q: [{ name: 'r1' }] } }, overlays: [] });
const ids = ['header', 'paragraph', 'spacer', 'shortcut', 'card', 'number_card', 'chart', 'quick_list', 'onboarding', 'custom_block'];
const d = { header: { text: 'Hi' }, paragraph: { text: 'p' }, spacer: {}, shortcut: { shortcut_name: 'A' }, card: { card_name: 'C' }, number_card: { number_card_name: 'N' }, chart: { chart_name: 'Ch' }, quick_list: { quick_list_name: 'Q' }, onboarding: { onboarding_name: 'O' }, custom_block: { custom_block_name: 'CB' } };
const w = [];
const out = render(mk(ids.map((t, i) => ({ id: 'i' + i, type: t, data: { ...d[t], col: 4 } }))), ctx(w));
assert.deepEqual(Object.keys(BLOCKS).sort(), [...ids].sort());
for (const t of ids) assert(out.main.includes(`data-ui="block:${t}"`), t);
assert(out.main.includes('2 of 2') === false && out.main.includes('<bdi>1</bdi> of <bdi>2</bdi> steps'), 'onboarding progress');
assert(out.main.includes('5 open'), 'count format');
assert(!out.main.includes('<script') && !out.main.includes('onclick'), 'sanitised');
assert(out.main.includes('[data-block-id="i9"] p'), 'scoped css');
assert.equal(w.length, 0, w.join());
for (const c of [3, 4, 6, 12]) assert(render(mk([{ id: 'x', type: 'spacer', data: { col: c } }]), ctx([])).main.includes(`ce-block grid-col-${c}"`));
assert.equal(JSON.stringify(out), JSON.stringify(render(mk(ids.map((t, i) => ({ id: 'i' + i, type: t, data: { ...d[t], col: 4 } }))), ctx([]))), 'deterministic');
assert(out.head.includes('data-visibility="public"'));
assert(render({ ...mk([]), meta: { workspace: { name: 'P', public: 0, content: [] } } }, ctx([])).head.includes('data-visibility="private"'));
// real samples
for (const f of ['selling', 'accounts']) {
  const j = JSON.parse(fs.readFileSync(new URL(`../../samples/workspaces/${f}.json`, import.meta.url)));
  j.content = JSON.parse(j.content);
  const ww = [];
  const r = render({ meta: { workspace: j }, data: {}, overlays: [] }, ctx(ww));
  assert(r.main.includes('workspace-grid'), f);
  console.log(f, 'blocks', j.content.length, 'warnings', ww.length);
}
console.log('workspace.test ok');
