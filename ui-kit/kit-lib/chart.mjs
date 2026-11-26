// SVG chart module (frappe-charts look). Deterministic, no deps, generic.
// data = { labels: [...], datasets: [{ name, values: [...], chartType?: 'bar'|'line' }] }
import { esc } from './util.mjs';

export const PALETTE = ['#7cd6fd', '#5e64ff', '#743ee2', '#ff5858', '#ffa00a', '#feef72', '#28a745', '#98d85b', '#b554ff', '#ffa3ef', '#eceff1', '#b8c2cc'];
export const MAX_SLICES = 6;
export const MAX_POINTS = 9;
export const CHART_TYPES = ['line', 'bar', 'pie', 'donut', 'percentage', 'heatmap', 'axis-mixed'];

const r2 = (n) => Math.round(n * 100) / 100;
const fmt = (n) => {
  const a = Math.abs(n);
  if (a >= 1e9) return r2(n / 1e9) + 'B';
  if (a >= 1e6) return r2(n / 1e6) + 'M';
  if (a >= 1e4) return r2(n / 1e3) + 'K';
  return String(r2(n));
};
const color = (opts, i) => (opts.colors || PALETTE)[i % (opts.colors || PALETTE).length];

// Cap rule: keep top (max-1) by value, fold the rest into "Others".
export function capSlices(labels, values, max = MAX_SLICES) {
  const rows = labels.map((l, i) => ({ l, v: Math.max(0, Number(values[i]) || 0), i }));
  if (rows.length <= max) return rows.map(({ l, v }) => ({ label: l, value: v }));
  const top = [...rows].sort((a, b) => b.v - a.v || a.i - b.i).slice(0, max - 1).sort((a, b) => a.i - b.i);
  const keep = new Set(top.map((r) => r.i));
  const others = rows.filter((r) => !keep.has(r.i)).reduce((s, r) => s + r.v, 0);
  return [...top.map(({ l, v }) => ({ label: l, value: v })), { label: 'Others', value: others }];
}

// Nice axis ticks from 0 (or negative min) to max.
export function niceTicks(min, max, n = 5) {
  min = Math.min(0, min); if (max <= min) max = min + 1;
  const raw = (max - min) / n, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
  for (let v = lo; v <= hi + step / 1e6; v += step) out.push(r2(v));
  return out;
}

function legend(items, opts) {
  if (opts.legend === false) return '';
  return `<div class="chart-legend" data-ui="chart.legend">${items.map((it, i) =>
    `<span class="legend-item" data-legend="${i}"><span class="legend-dot" style="background:${esc(it.color)}"></span><span class="legend-label">${esc(it.label)}</span>${it.value !== undefined ? `<span class="legend-value">${esc(fmt(it.value))}</span>` : ''}</span>`).join('')}</div>`;
}
const tip = (label, name, v) => `<title>${esc(label)}${name ? ' · ' + esc(name) : ''}: ${esc(fmt(v))}</title>`;

function toolbar(opts) {
  if (opts.toolbar === false) return '';
  return `<div class="chart-toolbar" data-ui="chart.toolbar"><button class="btn btn-xs btn-secondary" data-action="action-export" type="button">Export</button></div>`;
}
function wrap(type, svg, leg, opts) {
  return `<div class="chart-container frappe-chart" data-chart-type="${type}" data-ui="chart.${type}"${opts.title ? ` aria-label="${esc(opts.title)}"` : ''}>${toolbar(opts)}${svg}${leg}</div>`;
}

function axisChart(type, data, opts) {
  const W = opts.width || 520, H = opts.height || 240, L = 44, R = 12, T = 12, B = 32;
  const pw = W - L - R, ph = H - T - B;
  let labels = data.labels || [];
  let ds = (data.datasets || []).map((d) => ({ ...d }));
  if (labels.length > MAX_POINTS) { labels = labels.slice(-MAX_POINTS); ds = ds.map((d) => ({ ...d, values: d.values.slice(-MAX_POINTS) })); }
  const all = ds.flatMap((d) => d.values);
  const ticks = niceTicks(Math.min(...all, 0), Math.max(...all, 0));
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const y = (v) => r2(T + ph - ((v - lo) / (hi - lo)) * ph);
  const y0 = y(0), n = labels.length, slot = pw / Math.max(n, 1);
  const cx = (i) => r2(L + slot * i + slot / 2);
  const kinds = ds.map((d) => (type === 'axis-mixed' ? d.chartType || 'bar' : type));
  const bars = kinds.map((k, i) => (k === 'bar' ? i : -1)).filter((i) => i >= 0);
  const bw = Math.min(28, (slot * 0.7) / Math.max(bars.length, 1));
  let s = `<svg class="frappe-chart-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">`;
  s += `<g class="y-axis">${ticks.map((t) => `<g class="tick"><line class="${t === 0 ? 'zero-line' : 'grid-line'}" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="#ebeef0" stroke-dasharray="${t === 0 ? '' : '2,2'}"/><text x="${L - 6}" y="${y(t) + 3}" text-anchor="end" font-size="10" fill="#6c7680">${fmt(t)}</text></g>`).join('')}</g>`;
  s += `<g class="x-axis">${labels.map((l, i) => `<text x="${cx(i)}" y="${H - 12}" text-anchor="middle" font-size="10" fill="#6c7680">${esc(l)}</text>`).join('')}</g>`;
  ds.forEach((d, di) => {
    const c = color(opts, di);
    if (kinds[di] === 'bar') {
      const bi = bars.indexOf(di), off = (bi - (bars.length - 1) / 2) * bw;
      s += `<g class="dataset bar-dataset" data-series="${esc(d.name || '')}">${d.values.map((v, i) => {
        const top = Math.min(y(v), y0), h = r2(Math.abs(y(v) - y0));
        return `<rect class="bar" data-value="${v}" data-label="${esc(labels[i])}" x="${r2(cx(i) + off - bw / 2)}" y="${top}" width="${r2(bw)}" height="${h}" rx="1" fill="${c}">${tip(labels[i], d.name, v)}</rect>`;
      }).join('')}</g>`;
    } else {
      const pts = d.values.map((v, i) => `${cx(i)},${y(v)}`);
      s += `<g class="dataset line-dataset" data-series="${esc(d.name || '')}"><polyline class="line-graph-path" fill="none" stroke="${c}" stroke-width="2" points="${pts.join(' ')}"/>${d.values.map((v, i) =>
        `<circle class="data-point" data-value="${v}" data-label="${esc(labels[i])}" cx="${cx(i)}" cy="${y(v)}" r="3" fill="${c}">${tip(labels[i], d.name, v)}</circle>`).join('')}</g>`;
    }
  });
  s += '</svg>';
  return wrap(type, s, legend(ds.map((d, i) => ({ label: d.name || `Series ${i + 1}`, color: color(opts, i) })), opts), opts);
}

const polar = (cx, cy, r, a) => [r2(cx + r * Math.sin(a)), r2(cy - r * Math.cos(a))];
function pieChart(type, data, opts) {
  const slices = capSlices(data.labels || [], (data.datasets?.[0]?.values) || [], opts.maxSlices || MAX_SLICES);
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
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

function percentageChart(data, opts) {
  const slices = capSlices(data.labels || [], (data.datasets?.[0]?.values) || [], opts.maxSlices || MAX_SLICES);
  const total = slices.reduce((s, x) => s + x.value, 0) || 1, W = opts.width || 520;
  let x = 0;
  const s = `<svg class="frappe-chart-svg" viewBox="0 0 ${W} 20" width="${W}" height="20" role="img">${slices.map((sl, i) => {
    const w = r2((sl.value / total) * W), r = `<rect class="percentage-bar" data-value="${sl.value}" data-label="${esc(sl.label)}" data-percent="${r2((sl.value / total) * 100)}" x="${r2(x)}" y="0" width="${w}" height="20" fill="${color(opts, i)}">${tip(sl.label, '', sl.value)}</rect>`;
    x += w; return r;
  }).join('')}</svg>`;
  return wrap('percentage', s, legend(slices.map((v, i) => ({ label: v.label, value: v.value, color: color(opts, i) })), opts), opts);
}

// Heatmap: data.points = { 'YYYY-MM-DD': count }, data.start = 'YYYY-MM-DD' (Sunday-first weeks), data.weeks = 26
const HEAT = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
function heatmap(data, opts) {
  const weeks = data.weeks || 26, cell = 12, gap = 2, step = cell + gap, L = 4, T = 16;
  const start = Date.UTC(...data.start.split('-').map((v, i) => (i === 1 ? v - 1 : +v)));
  const pts = data.points || {}, max = Math.max(1, ...Object.values(pts));
  const W = L + weeks * step, H = T + 7 * step;
  let s = `<svg class="frappe-chart-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">`;
  for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
    const dt = new Date(start + (w * 7 + d) * 864e5), key = dt.toISOString().slice(0, 10), v = pts[key] || 0;
    const lvl = v === 0 ? 0 : Math.min(4, 1 + Math.floor((v / max) * 3.999));
    s += `<rect class="day" data-date="${key}" data-value="${v}" data-level="${lvl}" x="${L + w * step}" y="${T + d * step}" width="${cell}" height="${cell}" rx="2" fill="${HEAT[lvl]}">${tip(key, '', v)}</rect>`;
  }
  s += '</svg>';
  return wrap('heatmap', s, '', { ...opts, legend: false });
}

export function chart(type, data, opts = {}) {
  if (!CHART_TYPES.includes(type)) throw new Error(`chart: unknown type ${type}`);
  if (type === 'pie' || type === 'donut') return pieChart(type, data, opts);
  if (type === 'percentage') return percentageChart(data, opts);
  if (type === 'heatmap') return heatmap(data, opts);
  return axisChart(type, data, opts);
}
