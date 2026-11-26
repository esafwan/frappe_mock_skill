import assert from 'node:assert/strict';
import { MENU_ENTRIES, sampleTargets, resolveTarget, defaultItems } from '../kit-lib/menu-registry.mjs';
import { renderMenu } from '../shell/menus.mjs';
import { MENU_TARGETS } from '../bin/mock.mjs';

const required = ['page.menu', 'form.menu', 'button_group:', 'page.sort', 'view-switcher', 'user', 'help', 'notifications', 'sidebar.header', 'row_actions:', 'bulk-actions', 'column-header'];
const ids = new Set(MENU_ENTRIES.map((e) => e.id || e.prefix));
for (const r of required) assert(ids.has(r), `registry lacks ${r}`);
// every id in bin/mock.mjs MENU_TARGETS resolves
for (const id of Object.keys(MENU_TARGETS.fixed)) assert(resolveTarget(id), `unresolved fixed ${id}`);
for (const p of Object.keys(MENU_TARGETS.prefix)) assert(resolveTarget(`${p}x`), `unresolved prefix ${p}`);

let drawn = 0;
for (const t of sampleTargets()) {
  const html = renderMenu({ target: t, query: 'abc' });
  if (t.startsWith('ui:')) { assert.equal(html, ''); continue; }
  assert(html.includes(`data-ui="menu:${t}"`), `${t} not drawn`);
  assert(html.includes('data-label='), `${t} has no items`);
  assert(!/undefined|NaN|\[object Object\]|\{\{/.test(html), `${t} hygiene`);
  assert.equal(html, renderMenu({ target: t, query: 'abc' }), `${t} not deterministic`);
  drawn += 1;
}
assert(renderMenu({ target: 'page.menu', items: ['A', '---', { label: 'B', danger: true }], highlight: 0 }).includes('text-danger'));
assert(renderMenu({ target: 'button_group:Create' }).includes('Create item 1'));
assert.equal(renderMenu({ target: 'nope' }), '');
assert.deepEqual(defaultItems('nope'), []);
console.log(`menu-registry: ${drawn} targets drawn, all tests passed`);
