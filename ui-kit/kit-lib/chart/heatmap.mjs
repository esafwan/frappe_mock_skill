// Calendar heatmap. data = { start: 'YYYY-MM-DD', weeks, points: { 'YYYY-MM-DD': count } }
import { tip, wrap, noData } from './axis.mjs';

export const HEAT = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

export function heatmap(data, opts = {}) {
  const pts = data.points || {};
  if (!data.start || !Object.keys(pts).length) return noData('heatmap', opts);
  const weeks = data.weeks || 26, cell = 12, gap = 2, step = cell + gap, L = 4, T = 16;
  const start = Date.UTC(...data.start.split('-').map((v, i) => (i === 1 ? v - 1 : +v)));
  const max = Math.max(1, ...Object.values(pts));
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
