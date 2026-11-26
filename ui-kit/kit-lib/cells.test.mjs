import assert from 'node:assert/strict';
import { formatCell, CELL_FIELDTYPES, formatDuration } from './cells.mjs';
import { guess_colour } from './indicators.mjs';

const f = (fieldtype, value, extra = {}, ctx = {}) => formatCell({ fieldtype, fieldname: 'x', label: 'X', ...extra }, value, ctx);
const sample = { Select: 'Open', Link: 'A-1', 'Dynamic Link': 'A-1', Percent: 40, Currency: 1234.5, Float: 1.5, Int: 7, Rating: 0.6, Image: 'a.png', Date: '2026-03-05', Datetime: '2026-03-05 14:30:00', Time: '10:00:00', Check: 1, Color: '#ff0000', Duration: 3700, Attach: '/f/a.pdf', 'Attach Image': '/f/a.png', 'Text Editor': '<p>Hi <b>there</b></p>', 'HTML Editor': '<i>x</i>', Code: 'a<b', Text: 'l1\nl2', 'Small Text': 's', 'Long Text': 'l', Data: '<x>' };
for (const ft of CELL_FIELDTYPES) {
  const r = f(ft, sample[ft], ft === 'Image' ? { options: 'img' } : {}, { doc: { img: 'a.png' } });
  assert.equal(typeof r.html, 'string', ft);
  assert.ok(r.html.length > 0, ft + ' non-empty');
  assert.deepEqual(r, f(ft, sample[ft], ft === 'Image' ? { options: 'img' } : {}, { doc: { img: 'a.png' } }), ft + ' deterministic');
}
// Select badge uses guess_colour, stable
const s = f('Select', 'Pending').html;
assert.ok(s.includes(`data-theme="${guess_colour('Pending')}"`));
assert.equal(f('Select', 'Pending').html, s);
assert.equal(f('Select', '').html, '');
assert.ok(f('Percent', 40).html.includes('width:40%'));
assert.equal(f('Percent', 40).title, 'X: 40');
assert.equal(f('Currency', 1234.5, {}, { currency: 'USD' }).html, 'USD 1,234.50');
assert.equal(f('Currency', 1).align, 'right');
assert.equal(f('Data', 'a').align, 'left');
assert.equal(f('Float', 1).html, '1');
assert.equal((f('Rating', 0.6).html.match(/filled/g) || []).length, 3);
assert.ok(f('Image', null, {}, {}).html.includes('missing-image'));
assert.equal(f('Date', '2026-03-05').html, '05-03-2026');
assert.equal(f('Date', 'bad').html, '');
assert.equal(f('Datetime', '2026-03-05 14:30').html, '05-03-2026 14:30:00');
assert.ok(f('Check', 1).html.includes('disabled-selected'));
assert.ok(f('Check', 0).html.includes('disabled-deselected'));
assert.ok(f('Color', '#f00').html.includes('background-color:#f00'));
assert.equal(formatDuration(3700), '1h 1m 40s');
assert.equal(f('Duration', 0).html, '0s');
assert.ok(f('Link', 'A-1').html.includes('data-filter'));
assert.ok(f('Attach', '/f/a.pdf').html.includes('target="_blank"'));
assert.equal(f('Data', '<x>').html, '&lt;x&gt;');
assert.ok(f('Text Editor', '<p>Hi</p>').html.includes('Hi') && !f('Text Editor', '<p>Hi</p>').html.includes('<p>'));
console.log('cells.test ok');
