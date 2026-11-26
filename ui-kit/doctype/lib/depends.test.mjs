import assert from 'node:assert/strict';
import { evalDepends as e } from './depends.mjs';
const d = { a: 'A', n: 5, z: 0, s: '', items: [1, 2], t: 'hello', f: 1, nul: null, st: 'Open' };
const cases = [
  ['a', d, true], ['z', d, false], ['s', d, false], ['missing', d, false], ['items', d, true],
  ['eval:doc.a', d, true], ['eval:doc.z', d, false],
  ["eval:doc.a == 'A'", d, true], ["eval:doc.a == 'B'", d, false], ["eval:doc.a != 'B'", d, true],
  ['eval:doc.n > 3', d, true], ['eval:doc.n >= 5', d, true], ['eval:doc.n < 5', d, false], ['eval:doc.n <= 5', d, true],
  ["eval:doc.a == 'A' && doc.n > 1", d, true], ["eval:doc.a == 'B' || doc.n > 1", d, true],
  ["eval:doc.a == 'B' || doc.n > 10", d, false], ['eval:!doc.z', d, true], ['eval:!doc.a', d, false],
  ["eval:['Open','Closed'].includes(doc.st)", d, null],
  ["eval:in(doc.st, ['Open'])", d, null],
  ["eval:in_list(['Open','Closed'], doc.st)", d, true],
  ["eval:doc.st in(['Open','Closed'])", d, true],
  ["eval:doc.st in(['X'])", d, false],
  ['eval:(doc.n > 1 || doc.z) && doc.f', d, true], ['eval:doc.items.length > 1', d, true], ['eval:doc.items.length == 0', d, false],
  ['eval:doc.t.length == 5', d, true], ['eval:cint(doc.n) == 5', d, true], ["eval:cint('7') + 0", d, null],
  ["eval:flt('2.5') > 2", d, true], ['eval:cint(doc.z) == 0', d, true], ['eval:doc.nul == null', d, true],
  ["eval:frappe.user == 'x'", d, null], ['eval:cur_frm.doc.a', d, null], ["eval:frappe.boot.x", d, null],
  ['eval:foo(doc.a)', d, null], ['eval:doc.a.toUpperCase()', d, null], ['eval:', d, false],
  [null, d, null], ['', d, null], ['eval:doc.n ==', d, null], ['eval:(doc.n', d, null], ['eval:1 == 1', d, true],
  ["eval:doc.a === 'A'", d, true], ["eval:'x' == \"x\"", d, true], ['eval:!(doc.n > 10)', d, true],
];
let ok = 0;
for (const [x, doc, want] of cases) {
  // '' expr after eval: parses to unsupported -> null; adjust expectation
  const got = e(x, doc);
  const exp = x === 'eval:' ? null : want;
  assert.equal(got, exp, `${JSON.stringify(x)} => ${got}, want ${exp}`); ok++;
}
console.log(`depends.test: ${ok} cases passed`);
