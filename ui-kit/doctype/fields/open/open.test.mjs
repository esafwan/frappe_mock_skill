import assert from 'node:assert/strict';
import { loadFieldRenderers } from '../../../renderers/form/index.mjs';
import { applyFieldOpen } from './index.mjs';

const R = await loadFieldRenderers();
const mk = (df, ctx = {}) => R[df.fieldtype]({ label: df.fieldname, ...df }, { doctype: 'X', ...ctx });
const run = (df, ov, ctx) => applyFieldOpen(mk(df, ctx), df, ctx || {}, { type: 'field_open', field: df.fieldname, ...ov });
const same = (a, b) => assert.equal(a, b);

let h = run({ fieldname: 'l', fieldtype: 'Link', options: 'Foo' }, { query: 'ba', results: [{ value: 'Bar', description: 'd' }], create: true, advanced: true });
assert.match(h, /<mark>ba<\/mark>|<mark>Ba<\/mark>/i); assert.match(h, /Create a new Foo/); assert.match(h, /Advanced Search/); assert.match(h, /aria-expanded="true"/);
h = run({ fieldname: 'l', fieldtype: 'Link', options: 'Foo' }, { query: 'zz', results: [] });
assert.match(h, /No results/);
h = run({ fieldname: 'd', fieldtype: 'Date' }, { value: '2024-02-14' });
assert.match(h, /February, <i>2024/); assert.match(h, /-selected-" data-date="14"/); assert.match(h, /value="14-02-2024"/);
h = run({ fieldname: 'dt', fieldtype: 'Datetime' }, { value: '2024-02-14 09:30:00' });
assert.match(h, /datepicker--time-current-hours">09/);
h = run({ fieldname: 't', fieldtype: 'Time' }, { value: '10:05:00' }); assert.match(h, /timepicker-col/);
h = run({ fieldname: 'c', fieldtype: 'Color' }, { value: '#3b82f6' }); assert.match(h, /color-picker-pop/);
h = run({ fieldname: 'm', fieldtype: 'Table MultiSelect', options: 'Child' }, { chips: ['A'], results: [{ value: 'B' }] }); assert.match(h, /tb-selected-value/);
h = run({ fieldname: 'r', fieldtype: 'Data', reqd: 1 }, { state: 'error' }); assert.match(h, /has-error/); assert.match(h, /Value missing/);
h = run({ fieldname: 'p', fieldtype: 'Data' }, { state: 'readonly', value: 'v' }); assert.match(h, /display:none/); assert.match(h, /like-disabled-input">v|like-disabled-input[^>]*>v/);
same(run({ fieldname: 'l', fieldtype: 'Link', options: 'Foo' }, { results: ['A'] }), run({ fieldname: 'l', fieldtype: 'Link', options: 'Foo' }, { results: ['A'] }));
console.log('field-open ok');
