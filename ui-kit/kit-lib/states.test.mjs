import assert from 'node:assert/strict';
import { applyStates, STATES } from './states.mjs';

const html = `<div data-ui="list.row.0" class="r"><span data-ui="list.cell.0.name">A</span><span data-ui="list.cell.0.status">B</span></div>
<div data-ui="list.row.3" class="r">x</div>
<button class="btn btn-primary" type="button">Save</button><button class="btn" type="button"><span>Cancel</span></button>
<div class="frappe-control" data-fieldtype="Data" data-fieldname="title"><input data-fieldname="title"></div>`;
const ov = [
  { type: 'state', target: 'row:3', state: 'hover' },
  { type: 'state', target: 'cell:0,1', state: 'focus' },
  { type: 'state', target: 'cell:0:name', state: 'active' },
  { type: 'state', target: 'button:Save', state: 'loading' },
  { type: 'state', target: 'button:Cancel', state: 'disabled' },
  { type: 'state', target: 'field:title', state: 'focus' },
  { type: 'state', target: 'row:9', state: 'hover' },
];
const a = applyStates(html, ov), b = applyStates(html, ov);
assert.equal(a.slots[0], b.slots[0], 'deterministic');
assert.equal(a.applied.length, 6); assert.equal(a.missed.length, 1);
const o = a.slots[0];
assert(/data-ui="list.row.3"[^>]*data-state="hover"/.test(o) && o.includes('is-hover'));
assert(/list.cell.0.status[^>]*data-state="focus"/.test(o));
assert(/list.cell.0.name[^>]*data-state="active"/.test(o));
assert(/btn-primary[^>]*data-state="loading"[^>]*aria-busy/.test(o) && /btn-primary loading/.test(o));
assert(/class="btn disabled"[^>]*disabled/.test(o));
assert(/frappe-control is-focused"[^>]*data-state="focus"/.test(o) || /data-fieldname="title"[^>]*data-state="focus"/.test(o));
assert.equal(STATES.length, 5);
console.log('states ok');
