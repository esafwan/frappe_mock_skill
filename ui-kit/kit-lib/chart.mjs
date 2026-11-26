// SVG chart facade (frappe-charts look). Deterministic, no deps, generic.
// data = { labels: [...], datasets: [{ name, values: [...], chartType?: 'bar'|'line' }] }
// Implementation lives in kit-lib/chart/{axis,pie,heatmap}.mjs; this file keeps the public API stable.
import { axisChart, PALETTE, MAX_SLICES, MAX_POINTS, GRANULARITIES, niceTicks } from './chart/axis.mjs';
import { pieChart, percentageChart, capSlices } from './chart/pie.mjs';
import { heatmap } from './chart/heatmap.mjs';

export { PALETTE, MAX_SLICES, MAX_POINTS, GRANULARITIES, niceTicks, capSlices };
export const CHART_TYPES = ['line', 'bar', 'pie', 'donut', 'percentage', 'heatmap', 'axis-mixed'];

export function chart(type, data, opts = {}) {
  if (!CHART_TYPES.includes(type)) throw new Error(`chart: unknown type ${type}`);
  if (type === 'pie' || type === 'donut') return pieChart(type, data, opts);
  if (type === 'percentage') return percentageChart(data, opts);
  if (type === 'heatmap') return heatmap(data, opts);
  return axisChart(type, data, opts);
}
