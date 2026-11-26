import { chart as drawChart, CHART_TYPES } from '../../../kit-lib/chart.mjs';
import { esc, icon, findIn } from './common.mjs';
const TYPE = { Line: 'line', Bar: 'bar', Pie: 'pie', Donut: 'donut', Percentage: 'percentage', Heatmap: 'heatmap', 'Axis-Mixed': 'axis-mixed' };
const MIN_H = 300;
export default function chartBlock(data, ctx, spec) {
  const name = data.chart_name;
  const meta = findIn(spec.meta.workspace.charts, ['chart_name', 'label', 'name'], name) || {};
  const d = spec.data?.charts?.[name];
  const label = meta.label || name;
  let body;
  if (!d) { ctx.warn(`workspace: no data.charts["${name}"]; rendering empty state`); body = `<div class="chart-empty text-muted" data-ui="chart.empty">No Data</div>`; }
  else {
    const t = TYPE[d.type] || String(d.type || 'line').toLowerCase();
    if (!CHART_TYPES.includes(t)) throw new Error(`workspace: chart "${name}" has unknown type ${d.type}`);
    const cw = Math.min(12, Math.max(1, Number(data.col) || 12));
    body = drawChart(t, d, { title: label, colors: d.colors, width: Math.round(cw * 88), height: 240 });
  }
  const controls = `<div class="widget-control" data-ui="chart.menu">${icon('ellipsis', 'sm')}</div>`;
  return `<div class="widget dashboard-widget-box chart-widget" style="width:100%;min-height:${MIN_H}px" data-ui="card:${esc(label)}" data-widget-name="${esc(label)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis" title="${esc(label)}">${esc(label)}</span></div><div class="widget-subtitle">${esc(d?.subtitle || '')}</div></div>${controls}</div><div class="widget-body" style="min-height:${MIN_H - 60}px">${body}</div></div>`;
}
