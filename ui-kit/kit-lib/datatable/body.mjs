// Datatable body (T-R1b). Pure, deterministic, generic. Shared by report view and query reports.
import { esc } from '../util.mjs';
import { formatCell } from '../cells.mjs';

const INDENT_PX = 20;

/** Header label: 'Label (Child Label)' for child-table columns, 'Index' for idx. */
export function columnLabel(col = {}) {
  const base = col.fieldname === 'idx' ? 'Index' : (col.label || col.fieldname || '');
  const child = col.child_label ?? col.childLabel;
  return child && col.fieldname !== 'idx' ? `${base} (${child})` : base;
}

const chev = (open) => `<svg class="icon icon-xs" viewBox="0 0 16 16"><path d="${open ? 'M3 6l5 5 5-5' : 'M6 3l5 5-5 5'}" fill="none" stroke="currentColor"/></svg>`;

/**
 * renderBody({columns, rows, checkbox, tree, editing, selected, rowHeight, currency, dateFormat}) -> html
 * columns: [{fieldname,label,fieldtype,options,precision,child_label,width,align,editable}]
 * rows: array of objects; tree rows may carry indent (number) and has_children / expanded (bool)
 * editing: {row, col} (col index or fieldname) -> that cell is rendered in edit state
 * selected: Set/array of row indexes
 */
export function renderBody(o = {}) {
  const { columns = [], rows = [], checkbox = false, tree = false, editing = null, rowHeight = 33 } = o;
  const index = o.index === true;
  const sel = new Set(o.selected || []);
  const off = (checkbox ? 1 : 0) + (index ? 1 : 0);
  const treeCol = tree ? (o.treeColumn ?? 0) : -1;
  const out = rows.map((row, r) => {
    const cells = [];
    if (checkbox) {
      cells.push(`<div class="dt-cell dt-cell--col-0 dt-cell--no-filter" data-row-index="${r}" data-col-index="0" style="width:32px;flex:0 0 32px"><div class="dt-cell__content dt-cell__content--col-0"><input type="checkbox" class="dt-checkbox" data-row-index="${r}"${sel.has(r) ? ' checked' : ''}></div></div>`);
    }
    if (index) {
      const ii = checkbox ? 1 : 0;
      cells.push(`<div class="dt-cell dt-cell--col-${ii} dt-cell--index" data-row-index="${r}" data-col-index="${ii}" style="width:40px;flex:0 0 40px;text-align:right"><div class="dt-cell__content" style="justify-content:flex-end">${r + 1}</div></div>`);
    }
    columns.forEach((col, c) => {
      const ci = c + off;
      const val = row[col.fieldname];
      const f = col.fieldname === 'idx' ? { html: esc(val ?? ''), align: 'right', title: String(val ?? '') }
        : formatCell(col, val, { doc: row, currency: row.currency ?? o.currency, dateFormat: o.dateFormat, system: o.system, filterable: false });
      const align = col.align || f.align;
      const isEdit = editing && editing.row === r && (editing.col === c || editing.col === col.fieldname);
      let inner = f.html;
      let cls = `dt-cell dt-cell--col-${ci}`;
      if (c === treeCol) {
        const lvl = Number(row.indent) || 0;
        const toggle = row.has_children
          ? `<span class="dt-tree-node__toggle" data-expanded="${row.expanded !== false ? 1 : 0}">${chev(row.expanded !== false)}</span>`
          : '<span class="dt-tree-node__spacer" style="display:inline-block;width:12px"></span>';
        inner = `<span class="dt-tree-node" style="padding-left:${lvl * INDENT_PX}px">${toggle} ${inner}</span>`;
        cls += ' dt-cell--tree';
      }
      if (isEdit) {
        cls += ' dt-cell--editing';
        inner = `<div class="dt-cell__edit"><input class="form-control input-sm" type="text" value="${esc(val ?? '')}" data-fieldname="${esc(col.fieldname)}"></div>`;
      } else if (col.editable) cls += ' dt-cell--editable';
      const w = col.width || o.widths?.[col.fieldname] || 120;
      cells.push(`<div class="${cls}" data-row-index="${r}" data-col-index="${ci}" style="width:${w}px;flex:0 0 ${w}px;text-align:${align}"${isEdit ? '' : ` title="${esc(f.title)}"`}><div class="dt-cell__content" style="justify-content:${align === 'right' ? 'flex-end' : 'flex-start'}">${inner}</div></div>`);
    });
    return `<div class="dt-row dt-row-${r}${sel.has(r) ? ' dt-row--selected' : ''}${row.is_total ? ' dt-row-totals' : ''}" data-row-index="${r}" style="height:${rowHeight}px;display:flex">${cells.join('')}</div>`;
  });
  return `<div class="dt-body">${out.join('')}</div>`;
}
