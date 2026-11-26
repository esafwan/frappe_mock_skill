// Pie, donut and percentage charts with an 'Others' bucket beyond MAX_SLICES.
import { esc } from '../util.mjs';
import { MAX_SLICES, r2, color, tip, legend, wrap, noData } from './axis.mjs';

// Keep top (max-1) by value, fold the rest into "Others" (so the result has `max` entries).
export function capSlices(labels, values, max = MAX_SLICES) {
  const rows = labels.map((l, i) => ({ l, v: Math.max(0, Number(values[i]) || 0), i }));
  if (rows.length <= max) return rows.map(({ l, v }) => ({ label: l, value: v }));
  const top = [...rows].sort((a, b) => b.v - a.v || a.i - b.i).slice(0, max - 1).sort((a, b) => a.i - b.i);
  const keep = new Set(top.map((r) => r.i));
  const others = rows.filter((r) => !keep.has(r.i)).reduce((s, r) => s + r.v, 0);
  return [...top.map(({ l, v }) => ({ label: l, value: v })), { label: 'Others', value: others }];
}

const polar = (cx, cy, r, a) => [r2(cx + r * Math.sin(a)), r2(cy - r * Math.cos(a))];
const slicesOf = (data, opts) => capSlices(data.labels || [], data.datasets?.[0]?.values || [], opts.maxSlices || MAX_SLICES);

export function pieChart(type, data, opts = {}) {
  const slices = slicesOf(data, opts);
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) return noData(type, opts);
  const S = opts.size || 240, c = S / 2, R = S / 2 - 8, ri = type === 'donut' ? R * 0.6 : 0;
  let a = 0, s = `<svg class="frappe-chart-svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" role="img">`;
  slices.forEach((sl, i) => {
    const ang = (sl.value / total) * Math.PI * 2, fill = color(opts, i);
    if (sl.value <= 0) return;
    const pct = r2((sl.value / total) * 100), attr = `class="slice" data-value="${sl.value}" data-label="${esc(sl.label)}" data-percent="${pct}" data-angle="${r2((ang * 180) / Math.PI)}" fill="${fill}" stroke="#fff"`;
    if (ang >= Math.PI * 2 - 1e-9) {
      s += ri ? `<path ${attr} fill-rule="evenodd" d="M${c} ${c - R}A${R} ${R} 0 1 1 ${c} ${c + R}A${R} ${R} 0 1 1 ${c} ${c - R}ZM${c} ${c - ri}A${ri} ${ri} 0 1 0 ${c} ${c + ri}A${ri} ${ri} 0 1 0 ${c} ${c - ri}Z">${tip(sl.label, '', sl.value)}</path>` : `<circle ${attr} cx="${c}" cy="${c}" r="${R}">${tip(sl.label, '', sl.value)}</circle>`;
    } else {
      const [x1, y1] = polar(c, c, R, a), [x2, y2] = polar(c, c, R, a + ang), large = ang > Math.PI ? 1 : 0;
      let d;
      if (ri) { const [x3, y3] = polar(c, c, ri, a + ang), [x4, y4] = polar(c, c, ri, a); d = `M${x1} ${y1}A${R} ${R} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${ri} ${ri} 0 ${large} 0 ${x4} ${y4}Z`; }
      else d = `M${c} ${c}L${x1} ${y1}A${R} ${R} 0 ${large} 1 ${x2} ${y2}Z`;
      s += `<path ${attr} d="${d}">${tip(sl.label, '', sl.value)}</path>`;
    }
    a += ang;
  });
  s += '</svg>';
  return wrap(type, s, legend(slices.map((x, i) => ({ label: x.label, value: x.value, color: color(opts, i) })), opts), opts);
}

export function percentageChart(data, opts = {}) {
  const slices = slicesOf(data, opts);
  const total = slices.reduce((s, x) => s + x.value, 0), W = opts.width || 520;
  if (!total) return noData('percentage', opts);
  let x = 0;
  const s = `<svg class="frappe-chart-svg" viewBox="0 0 ${W} 20" width="${W}" height="20" role="img">${slices.map((sl, i) => {
    const w = r2((sl.value / total) * W), r = `<rect class="percentage-bar" data-value="${sl.value}" data-label="${esc(sl.label)}" data-percent="${r2((sl.value / total) * 100)}" x="${r2(x)}" y="0" width="${w}" height="20" fill="${color(opts, i)}">${tip(sl.label, '', sl.value)}</rect>`;
    x += w; return r;
  }).join('')}</svg>`;
  return wrap('percentage', s, legend(slices.map((v, i) => ({ label: v.label, value: v.value, color: color(opts, i) })), opts), opts);
}
