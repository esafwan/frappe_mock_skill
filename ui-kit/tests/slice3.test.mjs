// Slice 3 gate: grid + row form, every dialog id from an overlay, docstatus x workflow matrix, single doctype,
// navbar popover anchors, dialog bodies through the real field renderers. node tests/slice3.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
import { FORM_DIALOG_IDS } from '../renderers/dialogs/form-dialogs.mjs';
import { formActions } from '../renderers/form/head.mjs';
import { workflowTransitions } from '../renderers/form/workflow.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'slice3-'));
const sample = (n) => path.join(KIT, 'samples', `${n}.json`);
const run = async (file) => { const l = loadSpec(file); assert.ok(l.ok, `${file}: ${JSON.stringify(l.errors)}`); const r = await renderSpec(l, { outFile: path.join(KIT, 'out', 'slice3', 'x.html') }); assert.deepEqual(r.warnings, [], `${file} warnings`); return r.html; };
const spec = (name, base, patch) => { const j = { ...JSON.parse(fs.readFileSync(sample(base), 'utf8')), ...patch }; if (typeof j.meta?.doctype === 'string' && j.meta.doctype.startsWith('../')) j.meta.doctype = path.resolve(KIT, 'samples', j.meta.doctype); const f = path.join(TMP, `${name}.json`); fs.writeFileSync(f, JSON.stringify(j)); return f; };
const count = (html, re) => (html.match(re) || []).length;

// 1. grid rows, footer and the row form (odd_child with odd_grand inside)
let h = await run(sample('s3-form-rowform'));
assert.ok(count(h, /class="grid-row grid-row-open"/g) === 2, 'row and grandchild row open');
assert.equal(count(h, /class="form-in-grid"/g), 2, 'two stacked row forms');
for (const s of ['grid-heading-row', 'Add Row', 'Add Multiple', 'Download', 'Upload', 'Editing Row #1', 'Editing Row #2', 'Insert Above', 'Edit in full page']) assert.ok(h.includes(s), `rowform: ${s}`);
assert.ok(h.includes('data-ui="rowform.freeze"'));
h = await run(sample('s3-form-grid-readonly'));
assert.ok(!h.includes('Insert Above') && !h.includes('grid-add-row') && !h.includes('grid-row-check'), 'submitted doc: read-only grid and row form');
assert.ok(h.includes('Edit in full page'));

// 2. every dialog id opens from an overlay
for (const id of [...FORM_DIALOG_IDS, 'list_settings', 'quick_filters', 'save_view']) {
  const list = ['list_settings', 'quick_filters', 'save_view'].includes(id);
  const f = spec(`dlg-${id}`, list ? 's3-customer-list' : 's3-form-grid', { overlays: [{ type: 'dialog', kind: id }] });
  const out = await run(f);
  assert.ok(out.includes('class="modal-dialog'), `${id} draws a modal`);
  assert.ok(out.includes(`data-dialog-kind="${id}"`), `${id} marker`);
  assert.ok(out.includes('data-ui="dialog.0"'), `${id}: dialog.N hook`);
  if (!list) assert.ok(out.includes(`data-ui="dialog:${id}"`), `${id}: dialog:<id> alias`);
}
// named dialogs: field bodies are real controls
h = await run(spec('dlg-assign', 's3-form-grid', { overlays: [{ type: 'dialog', kind: 'assign_to' }] }));
for (const [t, n] of [['Link', 'assign_to'], ['Check', 'myself'], ['Date', 'date'], ['Select', 'priority']]) assert.ok(new RegExp(`data-fieldtype="${t}"[^>]*data-fieldname="${n}"`).test(h), `assign_to: ${n} is a ${t} control`);
// Connections is a tab (never above the tabs); no connections data -> no block
h = await run(sample('s3-form-activity-more'));
assert.ok(h.indexOf('data-ui="form.connections"') > h.indexOf('data-ui="form.tabs"'), 'connections after the tab strip');
assert.ok(/class="nav-link active"[^>]*data-fieldname="connections_tab"[^>]*>Connections</.test(h), 'Connections tab is active');
assert.ok(h.includes('>Details</button>'), 'Details tab');
assert.ok(!(await run(sample('s3-form-grid'))).includes('data-ui="form.connections"'), 'no connections data, no block');
for (const f of ['s3-dialog-fields', 's3-dialog-quick-entry', 's3-dialog-confirm-stack']) assert.ok((await run(sample(f))).includes('class="modal-dialog'), f);

// 3. dialog bodies use the real field renderers (Link control, Date control, Check, a real grid for Table)
h = await run(sample('s3-dialog-fields'));
const body = h.slice(h.indexOf('data-ui="dialog.0"'));
assert.ok(/data-fieldtype="Link"[^>]*data-fieldname="warehouse"/.test(body) && body.includes('awesomplete'), 'Link control');
assert.ok(/data-fieldtype="Date"[^>]*data-fieldname="when"/.test(body), 'Date control');
assert.ok(/data-fieldtype="Check"[^>]*data-fieldname="urgent"/.test(body), 'Check control');
assert.ok(body.includes('form-grid') && body.includes('grid-heading-row'), 'Table field is a real grid');
h = await run(sample('s3-dialog-quick-entry'));
assert.ok(h.includes('Edit Full Form') && /data-fieldname="title"/.test(h) && !h.includes('[object Object]'), 'quick entry');

// 4. docstatus x workflow matrix
const wf = { state_field: 'workflow_state', states: [], transitions: [{ state: 'Pending', action: 'Approve', next_state: 'Approved', allowed: 'Manager' }, { state: 'Pending', action: 'Reject', next_state: 'Draft', allowed: 'Clerk' }] };
const base = { name: 'D-1', is_submittable: 1 };
const spc = (roles) => ({ ctx: { user: { name: 'u@example.com', roles } } });
const label = (a) => [a.primary?.label ?? '-', a.secondary?.label ?? '-'].join('/');
const expect = { // [docstatus, workflow] -> primary/secondary for a user holding every action permission
  '0-no': 'Submit/-', '1-no': '-/Cancel', '2-no': 'Amend/-',
  '0-wf': '-/-', '1-wf': '-/Cancel', '2-wf': 'Amend/-',
};
for (const ds of [0, 1, 2]) for (const w of ['no', 'wf']) {
  const meta = { ...base, ...(w === 'wf' ? { workflow: wf } : {}) };
  const doc = { name: 'D-1', docstatus: ds, workflow_state: 'Pending', creation: '2026-01-01', ...(ds === 2 ? {} : {}) };
  assert.equal(label(formActions(spc(['System Manager']), meta, doc)), expect[`${ds}-${w}`], `actions ds=${ds} ${w}`);
}
assert.equal(label(formActions({}, { ...base, workflow: wf }, { name: 'D-1', docstatus: 0, workflow_state: 'Pending', __unsaved: 1 })), 'Save/-', 'workflow doc: Save only when dirty');
assert.equal(label(formActions({}, base, { name: 'D-1', docstatus: 0, __unsaved: 1 })), 'Save/-');
assert.equal(label(formActions({}, base, { name: 'D-1', docstatus: 1, __unsaved: 1 })), 'Update/Cancel');
const acts = (roles, doc = { name: 'D-1', workflow_state: 'Pending' }) => workflowTransitions(spc(roles), { workflow: wf }, doc).map((t) => t.action).join(',');
assert.equal(acts(['Manager']), 'Approve');
assert.equal(acts(['Clerk']), 'Reject');
assert.equal(acts(['Other']), '');
assert.equal(acts(['System Manager']), 'Approve,Reject');
assert.equal(acts(['Manager'], { __islocal: 1, workflow_state: 'Pending' }), '');
h = await run(sample('s3-form-workflow')); // Manager sees only Approve; state pill is the workflow state
assert.ok(/data-label="Actions"/.test(h) && h.includes('>Approve<') && !h.includes('>Reject<'), 'Actions dropdown filtered by role');
assert.ok(/page-indicator-pill[^>]*>[^]*?Pending/.test(h), 'workflow state pill');

// 5. single doctype: Update, no status pill
h = await run(sample('s3-single-update'));
assert.ok(/data-ui="form.primary-action"[^>]*>[^]*?<span class="es-button__label">Update<\/span>/.test(h), 'single: Update');
assert.ok(!/page-indicator-pill(?![^>]*\bhide\b)/.test(h.replace(/<style[\s\S]*?<\/style>/g, '')), 'single: no visible status pill');

// 6. navbar popovers anchor to real navbar elements
for (const [name, anchor, menu] of [['s3-navbar-search', 'navbar.search', 'navbar.search'], ['s3-navbar-notifications', 'navbar.button-2', 'navbar.notifications'], ['s3-navbar-user', 'navbar.user', 'navbar.user']]) {
  h = await run(sample(name));
  assert.ok(h.includes('data-ui="navbar"'), `${name}: navbar drawn`);
  assert.ok(h.includes(`data-ui="${anchor}"`), `${name}: anchor element ${anchor}`);
  const m = new RegExp(`data-anchor='([^']*)' data-popover-target="${menu.replace('.', '\\.')}"`).exec(h);
  assert.ok(m && m[1].includes(`data-ui=\\"${anchor}\\"`.replace(/\\"/g, '&quot;')) || (m && m[1].includes(anchor)), `${name}: popover anchors to ${anchor}`);
}
// real geometry (needs playwright): the popover sits under its anchor
try {
  const { chromium } = await import('playwright');
  let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, anchor, menu] of [['s3-navbar-search', 'navbar.search', 'navbar.search'], ['s3-navbar-notifications', 'navbar.button-2', 'navbar.notifications'], ['s3-navbar-user', 'navbar.user', 'navbar.user']]) {
    fs.writeFileSync(path.join(TMP, `${name}.html`), await run(sample(name)));
    await p.goto('file://' + path.join(TMP, `${name}.html`));
    const r = await p.evaluate(([a, mn]) => { const A = document.querySelector(`[data-ui="${a}"]`).getBoundingClientRect(); const P = document.querySelector(`[data-popover-target="${mn}"]`).getBoundingClientRect(); return { dy: P.top - A.bottom, left: P.left, right: P.right, aLeft: A.left, aRight: A.right, vw: innerWidth }; }, [anchor, menu]);
    assert.ok(r.dy >= 0 && r.dy < 12, `${name}: popover top ${r.dy}px under anchor`);
    assert.ok(r.right <= r.vw && r.left >= 0, `${name}: popover inside the viewport`);
    assert.ok(r.left <= r.aRight && r.right >= r.aLeft, `${name}: popover horizontally overlaps its anchor`);
  }
  await b.close();
} catch (e) { if (/Cannot find|Executable doesn't exist|ERR_MODULE/.test(String(e.message))) console.log('slice3: playwright missing, geometry part skipped'); else throw e; }

fs.rmSync(TMP, { recursive: true, force: true });
console.log('slice3 tests ok');
