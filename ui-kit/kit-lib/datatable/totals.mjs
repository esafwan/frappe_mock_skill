// Datatable totals row (generic, deterministic, pure). Sums numeric columns.
import { esc } from '../util.mjs';
import { formatNumber } from '../cells.mjs';

export const SUMMABLE = ['Currency', 'Float', 'Int'];

const num = (v) => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/,/g, '')); return Number.isFinite(n) ? n : 0; };
const cellVal = (row, col, i) => (Array.isArray(row) ? row[i] : row?.[col.fieldname ?? col.id]);
const isSummable = (col, types) => types.includes(col.fieldtype) && col.totals !== false;

// Returns one entry per column: {sum:number}|null. Group/tree rows (row.__group or row.indent>0 with row.is_total) are skipped.
export function computeTotals(columns = [], rows = [], opts = {}) {
  const types = opts.summable || SUMMABLE;
  const data = rows.filter((r) => !(r && (r.__group || r.is_total_row)));
  return columns.map((c, i) => (isSummable(c, types) ? { sum: data.reduce((a, r) => a + num(cellVal(r, c, i)), 0) } : null));
}

// Toggle state. state: true|false|{show_totals}. Default off (Frappe "Show Totals" is a user toggle).
export function totalsEnabled(opts = {}) {
  const s = opts.showTotals ?? opts.show_totals ?? opts.totals;
  return s && typeof s === 'object' ? !!s.show : !!s;
}

// Menu item descriptor for the settings menu ("Show Totals" / "Hide Totals" wording per v16: label stays "Show Totals", checked state).
export function totalsToggle(opts = {}) {
  const on = totalsEnabled(opts);
  return { label: 'Show Totals', checked: on, ui: 'datatable.menu.show_totals' };
}

// Totals row HTML. opts: {showTotals, label='Total', rowIndex (index into row count), checkbox, gridStyle(col,i)->style}
export function renderTotals(columns = [], rows = [], opts = {}) {
  if (!totalsEnabled(opts)) return '';
  const totals = computeTotals(columns, rows, opts);
  const label = opts.label ?? 'Total';
  const cells = columns.map((c, i) => {
    const t = totals[i];
    const numeric = !!t;
    const align = numeric || c.align === 'right' ? 'text-align:right;' : c.align === 'center' ? 'text-align:center;' : '';
    const style = `${align}${opts.gridStyle ? opts.gridStyle(c, i) : ''}`;
    let inner = '';
    if (t) inner = esc(formatNumber(t.sum, c.precision ?? (c.fieldtype === 'Int' ? 0 : 2)));
    else if (i === 0) inner = esc(label);
    return `<div class="dt-cell dt-cell--col-${i}" style="${c.width ? `width:${c.width}px;flex:0 0 ${c.width}px` : ''}" data-ui="datatable.totals.cell" data-col-index="${i}"${c.fieldname ? ` data-fieldname="${esc(c.fieldname)}"` : ''}><div class="dt-cell__content dt-cell__content--col-${i}" style="${style}"><b>${inner}</b></div></div>`;
  }).join('');
  const lead = opts.lead ? `<div class="dt-cell dt-cell--lead" style="width:${opts.lead}px;flex:0 0 ${opts.lead}px"><div class="dt-cell__content"></div></div>` : opts.checkbox ? '<div class="dt-cell dt-cell--col-0 dt-cell--check"><div class="dt-cell__content"></div></div>' : '';
  return `<div class="dt-footer dt-row dt-row-totals" data-ui="datatable.totals" data-rows="${rows.length}">${lead}${cells}</div>`;
}
