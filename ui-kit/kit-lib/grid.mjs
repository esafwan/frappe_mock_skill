// Child-table grid v2 (generic, deterministic). Pure functions: no I/O, no clocks.
// Markup follows Frappe's form grid (grid-heading-row, grid-body, grid-footer, grid-pagination).
export const GRID_PAGE_SIZE = 50;
export const GRID_UNITS = 10; // total width units: data columns <= 8, +1 index +1 edit

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NUM = /^(Currency|Float|Int|Percent)$/;
const icon = (n, cls = 'icon-sm', style = '') => `<svg class="icon  ${cls}" style="${style}" aria-hidden="true"><use class="" href="#icon-${n}"></use></svg>`;
const BREAKS = /Break$/;

// Pick the in_list_view columns (fallback: first 4 visible data fields) and fit them in 8 units.
export function gridColumns(fields = []) {
  const ok = (f) => !f.hidden && !BREAKS.test(f.fieldtype) && !['HTML', 'Button', 'Heading', 'Fold'].includes(f.fieldtype);
  let cols = fields.filter((f) => f.in_list_view && ok(f));
  if (!cols.length) cols = fields.filter(ok).slice(0, 4);
  const out = [];
  let used = 0;
  for (const c of cols) {
    const n = Math.min(GRID_UNITS - 2, Math.max(1, parseInt(c.columns, 10) || 2));
    if (used + n > GRID_UNITS - 2) continue;
    used += n;
    out.push({ ...c, _w: n });
  }
  return out;
}

const colStyle = (c) => `style="flex: ${c._w} 1 0; min-width: 0;"`;
const FIXED = { check: 'flex: 0 0 32px;', index: 'flex: 0 0 48px;', edit: 'flex: 0 0 40px;' };

export function gridPages(total, pageSize = GRID_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

function footer({ readOnly, total, page, pages, nSel, pageSize, df }) {
  const btn = (cls, label, hide) => `<button type="button" class="btn btn-xs ${cls}${hide ? ' hidden' : ''}">${label}</button>`;
  const buttons = readOnly
    ? ''
    : btn('btn-danger grid-remove-rows', 'Delete', !nSel)
      + btn('btn-danger grid-remove-all-rows', 'Delete All', !nSel)
      + btn('btn-secondary grid-add-row', 'Add Row', false)
      + (df.allow_bulk_edit ? btn('btn-secondary grid-add-multiple-rows', 'Add Multiple', false) : btn('btn-secondary grid-add-multiple-rows', 'Add Multiple', false))
      + btn('btn-secondary grid-download', 'Download', false)
      + btn('btn-secondary grid-upload', 'Upload', false);
  const pager = total > pageSize
    ? `<div class="grid-pagination"><div class="btn-group"><button type="button" class="btn btn-xs btn-default prev-page${page <= 1 ? ' disabled' : ''}">${icon('chevron-left', 'icon-xs')}</button><span class="btn btn-xs btn-default current-page"><input class="form-control" type="text" value="${page}" style="width:28px;height:18px;padding:0;text-align:center;display:inline-block"> / ${pages}</span><button type="button" class="btn btn-xs btn-default next-page${page >= pages ? ' disabled' : ''}">${icon('chevron-right', 'icon-xs')}</button></div></div>`
    : '';
  if (!buttons && !pager) return '';
  return `<div class="small form-clickable-section grid-footer" data-ui="grid.footer"><div class="flex justify-between"><div class="grid-buttons">${buttons}</div>${pager}</div></div>`;
}

/**
 * opts: { df, cols (from gridColumns), rows, fmt(col, value) -> text, readOnly, selected: number[] (1-based idx),
 *         page (1-based), pageSize }
 */
export function renderGrid({ df, cols, rows = [], fmt = (c, v) => (v ?? ''), readOnly = false, selected = [], page = 1, pageSize = GRID_PAGE_SIZE }) {
  const total = rows.length;
  const pages = gridPages(total, pageSize);
  const pg = Math.min(Math.max(parseInt(page, 10) || 1, 1), pages);
  const start = (pg - 1) * pageSize;
  const slice = rows.slice(start, start + pageSize);
  const sel = new Set(selected.map(Number));
  const nSel = sel.size;
  const allSel = slice.length > 0 && slice.every((_, i) => sel.has(start + i + 1));
  const last = (i) => (i === cols.length - 1 ? ' grid-data-last' : '');
  const checkCell = (idx, head) => readOnly
    ? `<div class="row-check col" style="${FIXED.check}"></div>`
    : `<div class="row-check sortable-handle col" style="${FIXED.check}"><input type="checkbox" class="grid-row-check" tabindex="-1"${(head ? allSel : sel.has(idx)) ? ' checked=""' : ''}></div>`;
  const indexCell = (txt, head) => `<div class="row-index sortable-handle grid-static-col col" style="${FIXED.index};display:flex;align-items:center;gap:2px">${!head && !readOnly ? `<span class="drag-handle" data-ui="grid.drag" style="display:inline-flex;width:auto">${icon('grip-vertical', 'icon-xs', 'opacity:.45;margin-right:2px')}</span>` : ''}<span style="width:auto">${esc(txt)}</span></div>`;
  const edit = (head) => head
    ? `<div class="col grid-static-col pointer" style="${FIXED.edit}"><a>${icon('settings', 'icon-sm', 'filter: opacity(0.5)')}</a></div>`
    : `<div class="col" style="${FIXED.edit}"><div class="btn-open-row" title="${readOnly ? 'View' : 'Edit'}"><a>${icon(readOnly ? 'eye' : 'pencil', 'icon-xs')}</a></div></div>`;
  const head = cols.map((c, i) => `<div class="col grid-static-col col-xs-${c._w}${NUM.test(c.fieldtype) ? ' text-right' : ''}${last(i)}" ${colStyle(c)} data-fieldname="${esc(c.fieldname)}" data-fieldtype="${esc(c.fieldtype)}" title="${esc(c.label)}"${i === 0 ? ' tabindex="0"' : ''}><div class="field-area" style="display: none;"></div><div class="static-area ellipsis${c.reqd ? ' reqd' : ''}">${esc(c.label)}</div><div class="grid-col-resize-handle" title=""></div></div>`).join('');
  const body = slice.map((r, i) => {
    const idx = start + i + 1;
    const isSel = sel.has(idx);
    return `<div class="grid-row${isSel ? ' grid-row-selected' : ''}" data-name="row-${idx}" data-idx="${idx}"><div class="data-row row m-0">${checkCell(idx, false)}${indexCell(idx, false)}${cols.map((c, j) => `<div class="col grid-static-col col-xs-${c._w}${NUM.test(c.fieldtype) ? ' text-right' : ''} bold${last(j)}" ${colStyle(c)} data-fieldname="${esc(c.fieldname)}" data-fieldtype="${esc(c.fieldtype)}"><div class="field-area" style="display: none;"></div><div class="static-area ellipsis${c.reqd ? ' reqd' : ''}">${esc(fmt(c, r?.[c.fieldname]))}</div></div>`).join('')}${edit(false)}</div></div>`;
  }).join('');
  return `<div class="frappe-control form-group" data-fieldtype="Table" data-fieldname="${esc(df.fieldname)}"><span class="tooltip-content">${esc(df.fieldname)}</span><div class="grid-field${readOnly ? ' grid-read-only' : ''}" data-ui="grid" data-rows="${total}" data-page="${pg}" data-pages="${pages}">
				<label class="control-label">${esc(df.label ?? df.fieldname)}</label>
				<span class="help"></span>
				<p class="text-muted small grid-description" style="display: none;"></p>
				<div class="grid-custom-buttons"></div>
				<div class="form-grid-container">
					<div class="form-grid">
						<div class="grid-heading-row"><div class="grid-row"><div class="data-row row m-0">${checkCell(0, true)}${indexCell('No.', true)}${head}${edit(true)}</div></div></div>
						<div class="grid-body"><div class="rows">${body}</div>
						<div class="grid-empty text-center text-extra-muted${total ? ' hidden hide' : ''}">No rows</div></div>
					</div>
				</div>
				${footer({ readOnly, total, page: pg, pages, nSel, pageSize, df })}
			</div></div>`;
}
