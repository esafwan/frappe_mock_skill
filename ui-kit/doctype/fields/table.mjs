// Table (child grid) field built on kit-lib/grid.mjs.
// Default export is empty on purpose: base.mjs still owns the "Table" fieldtype key and loadFieldRenderers()
// warns on duplicates. base.mjs should delegate: `import { renderTable } from './table.mjs'; Table: renderTable`.
import { esc, formatValue } from '../lib/control.mjs';
import { gridColumns, renderGrid } from '../../kit-lib/grid.mjs';
import { isLockedByDocstatus } from './_ro.mjs';

export function renderTable(df, ctx = {}) {
  const child = ctx.loadMeta?.(df.options);
  const cols = gridColumns(child?.fields || []);
  const rows = Array.isArray(ctx.value) ? ctx.value : [];
  const gs = ctx.grid_state?.[df.fieldname] || ctx.doc?.__grid?.[df.fieldname] || {};
  const readOnly = !!(df.read_only || (ctx.doc && isLockedByDocstatus(df, ctx.doc)));
  return renderGrid({
    df, cols, rows, readOnly,
    fmt: (c, v) => formatValue(c, v, ctx),
    selected: gs.selected || [],
    page: gs.page || 1,
  });
}

export default {};
