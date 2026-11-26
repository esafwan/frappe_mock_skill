import assert from 'node:assert/strict';
import { fitColumns, V16_MAX_LIST_FIELDS } from './fit.mjs';
import { colRange } from '../../kit-lib/colwidth.mjs';
const T = ['Data', 'Select', 'Currency', 'Date', 'Check', 'Percent'];
const mk = (n) => [{ kind: 'subject', fieldname: 'name', df: { fieldtype: 'Data' } }, { kind: 'status' },
  ...Array.from({ length: n }, (_, i) => ({ kind: 'field', fieldname: `f${i}`, df: { fieldtype: T[i % 6] } })), { kind: 'id', fieldname: 'name2' }];
for (const n of [1, 4, 8, 12, 30]) {
  const { cols } = fitColumns(mk(n), { available: 1800 });
  assert.equal(cols[0].kind, 'subject');
  assert.equal(cols.filter((c) => c.kind === 'field').length, Math.min(n, V16_MAX_LIST_FIELDS), `count n=${n}`);
  const names = cols.filter((c) => c.kind === 'field').map((c) => c.fieldname);
  assert.deepEqual(names, Array.from({ length: names.length }, (_, i) => `f${i}`), 'order');
  assert.equal(cols.at(-1).kind, 'id');
  assert.ok(cols.reduce((s, c) => s + colRange(c)[0], 0) <= 1800, 'no overflow'); const d = fitColumns(mk(n)); assert.ok(d.cols.reduce((s, c) => s + colRange(c)[0], 0) <= 1162 && d.cols[0].kind === 'subject', 'default fits');
}
const narrow = fitColumns(mk(12), { available: 700 });
assert.ok(narrow.cols.reduce((s, c) => s + colRange(c)[0], 0) <= 700);
assert.ok(narrow.dropped.length > 0);
assert.deepEqual(fitColumns(mk(12)), fitColumns(mk(12)), 'deterministic');
console.log('fit.test ok');
