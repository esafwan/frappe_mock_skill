// Datatable composer: head + body + totals. API (stable):
//   renderDatatable(columns, rows, opts) -> HTML string
//   columns: [{fieldname, label, fieldtype, width, align, child_label, ...}]  rows: [{[fieldname]: v}]
//   opts: sort, checkbox, tree, editing, selected, menu, resizing, frozen, rtl, currency, dateFormat, widths, showTotals, state, ui
// Header and body cells share one width per column (col.width || opts.widths[fieldname] || 120) so they line up.
import { renderHead } from './head.mjs';
import { renderBody, columnLabel } from './body.mjs';
import { renderTotals, computeTotals, totalsEnabled, totalsToggle } from './totals.mjs';

export const DATATABLE_CSS = '<style data-ui="datatable.css">'
  + '.datatable{position:relative;font-size:var(--text-sm,12px)}'
  + '.datatable .dt-scrollable{overflow-x:auto;overflow-y:hidden;max-width:100%}'
  + '.datatable .dt-header,.datatable .dt-body,.datatable .dt-footer{min-width:max-content}'
  + '.datatable .dt-row{display:flex;align-items:stretch;box-sizing:border-box;border-bottom:1px solid var(--dt-border-color,#d1d8dd)}'
  + '.datatable .dt-cell{position:relative;box-sizing:border-box;display:flex;align-items:center;min-height:32px;overflow:hidden}'
  + '.datatable .dt-cell__content{box-sizing:border-box;display:flex;align-items:center;min-width:1px;padding:0 8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}'
  + '.datatable .dt-body .dt-cell__content,.datatable .dt-footer .dt-cell__content{flex:1 1 auto}'
  + '.datatable .dt-header .dt-row{background:var(--dt-header-bg,#f7fafc);font-weight:500}'
  + '.datatable .dt-header .dt-cell--sticky{position:sticky;z-index:1;background:inherit}'
  + '.datatable .dt-cell__resize-handle{position:absolute;right:0;top:0;bottom:0;width:4px}'
  + '.datatable .dt-cell__resize-handle.active{background:var(--primary,#5e64ff)}'
  + '.datatable .sort-indicator{display:inline-block;min-width:10px;min-height:12px;margin-inline-start:4px;font-size:9px}'
  + '.datatable .dt-header{position:relative}'
  + '.datatable .dt-dropdown{position:absolute;right:4px;top:50%;transform:translateY(-50%);min-width:12px;min-height:12px}.datatable .dt-dropdown__toggle{min-width:12px;min-height:12px}'
  + '.datatable .dt-dropdown__toggle{opacity:0}.datatable .dt-cell--header:hover .dt-dropdown__toggle{opacity:1}'
  + '.datatable .dt-dropdown-container{position:absolute;inset:0;z-index:5;pointer-events:none}.datatable .dt-dropdown__list{pointer-events:auto}'
  + '.datatable .dt-dropdown__list{position:absolute;min-width:140px;padding:4px 0;border:1px solid var(--dt-border-color,#d1d8dd);border-radius:6px;background:var(--surface-white,#fff);box-shadow:0 4px 12px rgba(0,0,0,.1)}'
  + '.datatable .dt-dropdown__list-item{padding:6px 12px;white-space:nowrap}.datatable .dt-dropdown__list-item.highlighted{background:var(--surface-gray-2,#f3f3f3)}'
  + '.datatable .dt-row-totals{font-weight:600;background:var(--dt-header-bg,#f7fafc)}'
  + '.datatable .dt-cell--editing{outline:2px solid var(--primary,#5e64ff);outline-offset:-2px}.datatable .dt-cell__edit input{width:100%;border:0;background:transparent}'
  + '.datatable .dt-tree-node{display:inline-flex;align-items:center;gap:2px}'
  + '.datatable .dt-row--selected{background:var(--surface-gray-1,#f8f8f8)}'
  + '.datatable .datatable-empty{padding:40px;text-align:center}'
  + '</style>';

const widthOf = (c, opts) => c.width || opts.widths?.[c.fieldname] || Math.max(120, Math.min(280, columnLabel(c).length * 8 + 56));

export function renderDatatable(columns = [], rows = [], opts = {}) {
  const cols = columns.map((c) => ({ ...c, label: columnLabel(c), width: widthOf(c, opts) }));
  const checkbox = !!opts.checkbox;
  const head = renderHead({ columns: cols, sort: opts.sort, selectable: checkbox, frozen: opts.frozen ?? 1, widths: opts.widths || {}, menu: opts.menu, resizing: opts.resizing, rtl: !!opts.rtl });
  const body = renderBody({ ...opts, columns: cols, rows, checkbox, index: true });
  const lead = (checkbox ? 32 : 0) + 40;
  const totals = renderTotals(cols, rows, { ...opts, checkbox: false, lead});
  return `${DATATABLE_CSS}<div class="datatable"${opts.rtl ? ' dir="rtl"' : ''} data-ui="${opts.ui || 'datatable'}" data-rows="${rows.length}" data-cols="${columns.length}"><div class="dt-scrollable">${head}${body}${totals}</div></div>`;
}

export { renderHead, renderBody, renderTotals, computeTotals, totalsEnabled, totalsToggle, columnLabel };
