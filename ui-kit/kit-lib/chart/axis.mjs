// Axis charts (line, bar, axis-mixed, stacked) plus helpers shared by the chart modules.
// Deterministic, no deps, generic. data = { labels, datasets: [{ name, values, chartType? }] }
import { esc } from '../util.mjs';
import { decimalSep } from '../format.mjs';

export const PALETTE = ['#7cd6fd', '#5e64ff', '#743ee2', '#ff5858', '#ffa00a', '#feef72', '#28a745', '#98d85b', '#b554ff', '#ffa3ef', '#eceff1', '#b8c2cc'];
export const MAX_SLICES = 6;
export const MAX_POINTS = 60; // cap only for unreadable volumes; every row is shown below it
export const GRANULARITIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

export const r2 = (n) => Math.round(n * 100) / 100;
// Decimal separator of ctx.system.number_format for the chart being drawn (set by chart() for the duration of a synchronous draw).
let DEC = '.';
export const setChartSystem = (system) => { const prev = DEC; DEC = system ? decimalSep(system) : '.'; return prev; };
const raw = (n) => {
  const a = Math.abs(n);
  if (a >= 1e9) return r2(n / 1e9) + 'B';
  if (a >= 1e6) return r2(n / 1e6) + 'M';
  if (a >= 1e4) return r2(n / 1e3) + 'K';
  return String(r2(n));
};
export const fmt = (n) => (DEC === '.' ? raw(n) : raw(n).replace('.', DEC));
export const color = (opts, i) => (opts.colors || PALETTE)[i % (opts.colors || PALETTE).length];
export const tip = (label, name, v) => `<title>${esc(label)}${name ? ' · ' + esc(name) : ''}: ${esc(fmt(v))}</title>`;

export function niceTicks(min, max, n = 5) {
  min = Math.min(0, min); if (max <= min) max = min + 1;
  const raw = (max - min) / n, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
  for (let v = lo; v <= hi + step / 1e6; v += step) out.push(r2(v));
  return out;
}

export function legend(items, opts) {
  if (opts.legend === false) return '';
  return `<div class="chart-legend" data-ui="chart.legend" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:8px;font-size:12px">${items.map((it, i) =>
    `<span class="legend-item" data-legend="${i}" style="display:inline-flex;align-items:center;gap:4px"><span class="legend-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${esc(it.color)}"></span><span class="legend-label">${esc(it.label)}</span>${it.value !== undefined ? `<span class="legend-value" style="color:var(--text-muted,#777)">${esc(fmt(it.value))}</span>` : ''}</span>`).join('')}</div>`;
}

// Header: granularity / timespan selectors (opts.granularity = 'Weekly', opts.timespan = 'Last Year', or arrays of options via opts.granularities / opts.timespans) and Export.
export function toolbar(opts) {
  if (opts.toolbar === false) return '';
  const sel = (kind, cur, list) => cur === undefined && !list ? '' :
    `<select class="chart-${kind} form-control input-xs" data-ui="chart.${kind}" data-field="${kind}">${(list || [cur]).map((o) => `<option${o === cur ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  const g = sel('granularity', opts.granularity, opts.granularity !== undefined || opts.granularities ? opts.granularities || GRANULARITIES : null);
  const t = sel('timespan', opts.timespan, opts.timespans);
  return `<div class="chart-toolbar" data-ui="chart.toolbar">${t}${g}<button class="btn btn-xs btn-secondary" data-action="action-export" type="button">Export</button></div>`;
}
export function wrap(type, svg, leg, opts) {
  return `<div class="chart-container frappe-chart" data-chart-type="${type}" data-ui="chart.${type}"${opts.title ? ` aria-label="${esc(opts.title)}"` : ''}>${toolbar(opts)}${svg}${leg}</div>`;
}
export function noData(type, opts = {}) {
  return `<div class="chart-container frappe-chart chart-empty" data-chart-type="${type}" data-ui="chart.${type}"${opts.title ? ` aria-label="${esc(opts.title)}"` : ''}>${toolbar(opts)}<div class="chart-no-data text-muted" data-ui="chart.no-data" style="text-align:center;padding:48px 0">No data</div></div>`;
}

export function axisChart(type, data, opts = {}) {
  let labels = data.labels || [];
  let ds = (data.datasets || []).map((d) => ({ ...d, values: d.values || [] }));
  if (!labels.length || !ds.some((d) => d.values.length)) return noData(type, opts);
  const W = opts.width || 520, H = opts.height || 240, L = 44, R = 12, T = 12, B = 32;
  const pw = W - L - R, ph = H - T - B, stacked = !!opts.stacked;
  if (labels.length > MAX_POINTS) { labels = labels.slice(-MAX_POINTS); ds = ds.map((d) => ({ ...d, values: d.values.slice(-MAX_POINTS) })); }
  const kinds = ds.map((d) => (type === 'axis-mixed' ? d.chartType || 'bar' : type));
  const bars = kinds.map((k, i) => (k === 'bar' ? i : -1)).filter((i) => i >= 0);
  // stacking: bar datasets accumulate positive/negative separately per label
  const base = ds.map((d) => d.values.map(() => 0));
  if (stacked) {
    const pos = labels.map(() => 0), neg = labels.map(() => 0);
    bars.forEach((di) => ds[di].values.forEach((v, i) => { if (v >= 0) { base[di][i] = pos[i]; pos[i] += v; } else { base[di][i] = neg[i]; neg[i] += v; } }));
  }
  const ext = [];
  ds.forEach((d, di) => d.values.forEach((v, i) => { ext.push(stacked && kinds[di] === 'bar' ? base[di][i] + v : v); }));
  const ticks = niceTicks(Math.min(...ext, 0), Math.max(...ext, 0));
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const y = (v) => r2(T + ph - ((v - lo) / (hi - lo)) * ph);
  const y0 = y(0), n = labels.length, slot = pw / Math.max(n, 1);
  const rtl = !!opts.rtl; // mirrored: first label at the right, value axis on the right
  const X0 = rtl ? R : L, X1 = rtl ? W - L : W - R;
  const cx = (i) => r2(rtl ? X1 - slot * i - slot / 2 : L + slot * i + slot / 2);
  const nb = stacked ? 1 : Math.max(bars.length, 1);
  const bw = Math.min(28, (slot * 0.7) / nb);
  let s = `<svg class="frappe-chart-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">`;
  s += `<g class="y-axis">${ticks.map((t) => `<g class="tick"><line class="${t === 0 ? 'zero-line' : 'grid-line'}" x1="${X0}" x2="${X1}" y1="${y(t)}" y2="${y(t)}" stroke="#ebeef0" stroke-dasharray="${t === 0 ? '' : '2,2'}"/><text x="${rtl ? X1 + 6 : L - 6}" y="${y(t) + 3}" text-anchor="${rtl ? 'start' : 'end'}" font-size="10" fill="#6c7680">${fmt(t)}</text></g>`).join('')}</g>`;
  s += `<g class="x-axis">${labels.map((l, i) => `<text x="${cx(i)}" y="${H - 12}" text-anchor="middle" font-size="10" fill="#6c7680">${esc(l)}</text>`).join('')}</g>`;
  ds.forEach((d, di) => {
    const c = color(opts, di);
    if (kinds[di] === 'bar') {
      const bi = bars.indexOf(di), off = stacked ? 0 : (bi - (bars.length - 1) / 2) * bw;
      s += `<g class="dataset bar-dataset" data-series="${esc(d.name || '')}">${d.values.map((v, i) => {
        const a = y(base[di][i]), b = y(base[di][i] + v), top = Math.min(a, b), h = r2(Math.abs(a - b));
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
