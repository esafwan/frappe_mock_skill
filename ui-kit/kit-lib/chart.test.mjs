import assert from 'node:assert/strict';
import { chart, capSlices, niceTicks, CHART_TYPES } from './chart.mjs';
import { numberCard, formatNumber } from './numbercard.mjs';

const d = { labels: ['A', 'B', 'C', 'D'], datasets: [{ name: 'S1', values: [10, 20, 40, 30] }, { name: 'S2', values: [5, 15, 25, 35], chartType: 'line' }] };
for (const t of CHART_TYPES) {
  const html = chart(t, t === 'heatmap' ? { start: '2024-01-07', weeks: 4, points: { '2024-01-08': 3, '2024-01-09': 9 } } : d);
  assert(html.includes(`data-chart-type="${t}"`) && html.includes('<svg') && html.includes('<title>') || t === 'percentage' || t === 'heatmap', t);
  assert(html === chart(t, t === 'heatmap' ? { start: '2024-01-07', weeks: 4, points: { '2024-01-08': 3, '2024-01-09': 9 } } : d), 'deterministic ' + t);
}
// bar heights proportional
const bars = [...chart('bar', { labels: d.labels, datasets: [d.datasets[0]] }).matchAll(/class="bar" data-value="(\d+)"[^>]*height="([\d.]+)"/g)].map((m) => [+m[1], +m[2]]);
assert.equal(bars.length, 4);
for (const [v, h] of bars) assert(Math.abs(h / v - bars[0][1] / bars[0][0]) < 0.02, 'bar proportional');
// mixed has both
const mx = chart('axis-mixed', d); assert(mx.includes('class="bar"') && mx.includes('line-graph-path') && mx.includes('chart-legend'));
// pie angles proportional; sum 360
const pie = chart('pie', { labels: ['a', 'b', 'c'], datasets: [{ values: [1, 1, 2] }] });
const ang = [...pie.matchAll(/data-angle="([\d.]+)"/g)].map((m) => +m[1]);
assert.deepEqual(ang, [90, 90, 180]);
assert(chart('donut', { labels: ['a', 'b'], datasets: [{ values: [3, 1] }] }).includes('data-percent="75"'));
// cap rules
const cap = capSlices(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [8, 7, 6, 5, 4, 3, 2, 1]);
assert.equal(cap.length, 6); assert.deepEqual(cap.at(-1), { label: 'Others', value: 3 + 2 + 1 });
assert.equal((chart('pie', { labels: 'abcdefgh'.split(''), datasets: [{ values: [8, 7, 6, 5, 4, 3, 2, 1] }] }).match(/class="slice"/g) || []).length, 6);
const many = Array.from({ length: 15 }, (_, i) => i + 1);
assert.equal((chart('bar', { labels: many.map(String), datasets: [{ values: many }] }).match(/class="bar"/g) || []).length, 9);
assert.equal(chart('percentage', { labels: ['a', 'b'], datasets: [{ values: [1, 3] }] }).includes('data-percent="75"'), true);
const hm = chart('heatmap', { start: '2024-01-07', weeks: 4, points: { '2024-01-08': 3, '2024-01-09': 9 } });
assert.equal((hm.match(/class="day"/g) || []).length, 28); assert(hm.includes('data-date="2024-01-09" data-value="9" data-level="4"'));
assert.deepEqual(niceTicks(0, 40), [0, 10, 20, 30, 40]);
assert.throws(() => chart('radar', d));
// number card
const up = numberCard({ label: 'Rev', value: 120, previous: 100, currency: 'USD' });
assert(up.includes('green-stat') && up.includes('data-delta="up"') && up.includes('data-percent="20"') && up.includes('$120.00'));
assert(numberCard({ label: 'x', value: 5, previous: 10 }).includes('red-stat'));
assert(numberCard({ label: 'x', value: 5 }).includes('grey-stat'));
for (const c of ['green', 'red', 'blue', 'orange']) assert(numberCard({ label: 'x', value: 1, colour: c }).includes('style="color:#'));
assert.equal(formatNumber(12500, { compact: true }), '12.5K');
assert(numberCard({ label: 'A<', value: 1 }).includes('A&lt;'));
console.log('chart + numbercard: all tests passed');
