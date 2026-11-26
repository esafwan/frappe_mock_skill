import assert from 'node:assert/strict';
import { axisChart, niceTicks, GRANULARITIES } from './axis.mjs';
import { pieChart, percentageChart, capSlices } from './pie.mjs';
import { heatmap } from './heatmap.mjs';

const num = (s, a) => +new RegExp(`${a}="(-?[\\d.]+)"`).exec(s)[1];
const D = { labels: ['A', 'B', 'C', 'D'], datasets: [{ name: 'S1', values: [10, 20, 40, 30] }] };

// bar heights proportional to values, baseline shared
const rects = [...axisChart('bar', D).matchAll(/<rect class="bar"[^>]*>/g)].map((m) => m[0]);
assert.equal(rects.length, 4);
const k = num(rects[0], 'height') / 10;
rects.forEach((r) => { assert(Math.abs(num(r, 'height') / num(r, 'data-value') - k) < 0.02); assert(Math.abs(num(r, 'y') + num(r, 'height') - (num(rects[0], 'y') + num(rects[0], 'height'))) < 0.02); });

// stacked: segment heights proportional and stacked contiguously
const st = axisChart('bar', { labels: ['A', 'B'], datasets: [{ name: 'x', values: [10, 20] }, { name: 'y', values: [30, 20] }] }, { stacked: true });
const sr = [...st.matchAll(/<rect class="bar"[^>]*>/g)].map((m) => m[0]);
assert.equal(sr.length, 4);
assert.equal(num(sr[0], 'x'), num(sr[2], 'x'));
assert(Math.abs(num(sr[2], 'y') + num(sr[2], 'height') - num(sr[0], 'y')) < 0.02, 'segment sits on lower one');
assert(Math.abs(num(sr[2], 'height') / 30 - num(sr[0], 'height') / 10) < 0.02);

// line points: y decreases linearly with value
const pts = [...axisChart('line', D).matchAll(/<circle class="data-point"[^>]*>/g)].map((m) => m[0]);
const s10 = (num(pts[1], 'cy') - num(pts[0], 'cy')) / 10, s20 = (num(pts[2], 'cy') - num(pts[1], 'cy')) / 20;
assert(Math.abs(s10 - s20) < 0.02 && s10 < 0);

// mixed
const mx = axisChart('axis-mixed', { labels: ['a', 'b'], datasets: [{ name: 'b', values: [1, 2] }, { name: 'l', values: [2, 1], chartType: 'line' }] });
assert(mx.includes('class="bar"') && mx.includes('line-graph-path') && mx.includes('chart-legend'));
// 9-point cap
const many = Array.from({ length: 15 }, (_, i) => i + 1);
assert.equal((axisChart('bar', { labels: many.map(String), datasets: [{ values: many }] }).match(/class="bar"/g) || []).length, 9);

// pie angles proportional, sum 360, donut percent
const ang = [...pieChart('pie', { labels: ['a', 'b', 'c'], datasets: [{ values: [1, 1, 2] }] }).matchAll(/data-angle="([\d.]+)"/g)].map((m) => +m[1]);
assert.deepEqual(ang, [90, 90, 180]);
assert(pieChart('donut', { labels: ['a', 'b'], datasets: [{ values: [3, 1] }] }).includes('data-percent="75"'));
// Others bucket
const cap = capSlices('abcdefgh'.split(''), [8, 7, 6, 5, 4, 3, 2, 1]);
assert.equal(cap.length, 6); assert.deepEqual(cap.at(-1), { label: 'Others', value: 6 });
const p8 = pieChart('pie', { labels: 'abcdefgh'.split(''), datasets: [{ values: [8, 7, 6, 5, 4, 3, 2, 1] }] });
assert.equal((p8.match(/class="slice"/g) || []).length, 6); assert(p8.includes('Others'));
assert.equal(capSlices(['a', 'b'], [1, 2]).length, 2);
// percentage widths proportional
const pw = [...percentageChart({ labels: ['a', 'b'], datasets: [{ values: [1, 3] }] }).matchAll(/class="percentage-bar"[^>]*width="([\d.]+)"/g)].map((m) => +m[1]);
assert(Math.abs(pw[1] / pw[0] - 3) < 0.05);

// heatmap
const hm = heatmap({ start: '2024-01-07', weeks: 4, points: { '2024-01-08': 3, '2024-01-09': 9 } });
assert.equal((hm.match(/class="day"/g) || []).length, 28); assert(hm.includes('data-date="2024-01-09" data-value="9" data-level="4"'));

// No data
for (const h of [axisChart('bar', { labels: [], datasets: [] }), axisChart('line', { labels: ['a'], datasets: [{ values: [] }] }), pieChart('pie', { labels: ['a'], datasets: [{ values: [0] }] }), pieChart('donut', {}), percentageChart({}), heatmap({ start: '2024-01-07', points: {} })]) assert(h.includes('No data') && !h.includes('<svg'));

// granularity / timespan header
const g = axisChart('line', D, { granularity: 'Weekly', timespan: 'Last Year', timespans: ['Last Year', 'Last Quarter'] });
assert(g.includes('data-ui="chart.granularity"') && g.includes('<option selected>Weekly</option>') && g.includes('Monthly') && g.includes('<option selected>Last Year</option>'));
assert.deepEqual(GRANULARITIES.slice(0, 3), ['Daily', 'Weekly', 'Monthly']);
assert(!axisChart('line', D).includes('chart.granularity'));
assert(axisChart('bar', { labels: [], datasets: [] }, { granularity: 'Daily' }).includes('chart.granularity'));

// determinism, ticks, escaping
assert.equal(axisChart('bar', D, { stacked: true }), axisChart('bar', D, { stacked: true }));
assert.deepEqual(niceTicks(0, 40), [0, 10, 20, 30, 40]);
assert(axisChart('bar', { labels: ['<x>'], datasets: [{ values: [1] }] }).includes('&lt;x&gt;'));
console.log('chart split: all tests passed');
