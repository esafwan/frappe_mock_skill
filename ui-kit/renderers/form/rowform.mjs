// Expanded child-table row form (Frappe grid-row-open) driven by overlay
//   {type:'row_open', field:'<table fieldname>', row:<0-based index>, child?:{field,row}}
// `child` opens a row of a grandchild table inside the expanded form (nest as deep as needed).
// Generic: no doctype/app/brand names. Pure string output, deterministic.
import { esc } from '../../doctype/lib/control.mjs';
import { buildLayout } from '../../doctype/lib/layout.mjs';

const ic = (n, cls = 'icon-sm') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${n}"></use></svg>`;
const btn = (cls, label, icon, extra = '') => `<button type="button" class="btn btn-default btn-xs ${cls}"${extra}>${icon ? ic(icon, 'icon-xs') : ''}${label ? esc(label) : ''}</button>`;

function sectionHtml(s, renderField) {
  const head = s.label ? `<div class="section-head">${esc(s.label)}</div>` : '';
  const n = s.columns.length || 1;
  const cols = s.columns.map((c, i) => {
    const pct = c.pct ?? 100 / n;
    return `<div class="form-column" style="flex:0 0 ${+pct.toFixed(4)}%;max-width:${+pct.toFixed(4)}%" data-fieldname="__column_${i}"><form>${c.fields.map((f) => renderField(f)).join('')}</form></div>`;
  }).join('');
  return `<div class="form-section card-section visible-section"${s.fieldname ? ` data-fieldname="${esc(s.fieldname)}"` : ''}>${head}<div class="section-body">${cols}</div></div>`;
}

/**
 * Markup of the open row form.
 * o: {overlay, meta (parent), doc (parent row or doc), rowIdx, field (df of the Table), childMeta,
 *     row, renderField(df, ctx0), loadMeta, count, readOnly}
 */
export function renderRowForm(o) {
  const { field, childMeta, row = {}, rowIdx = 0, renderField, count = 1 } = o;
  const idx = rowIdx + 1;
  const ds = Number(o.docstatus ?? row.docstatus ?? 0);
  const ro = o.readOnly || field?.read_only || ((ds === 1 || ds === 2) && !(field?.allow_on_submit === 1 || field?.allow_on_submit === true));
  const rdoc = { ...row, docstatus: ds }; // children of a submitted or cancelled document are locked like their parent
  const layout = childMeta ? buildLayout(childMeta, row) : { tabs: [] };
  const rf = (df) => renderField(df, { value: row[df.fieldname], doc: rdoc, doctype: childMeta.name, meta: childMeta, parentdoc: o.doc });
  const body = layout.tabs.map((t) => t.sections.map((s) => sectionHtml(s, rf)).join('')).join('');
  const actions = ro ? '' : `<span class="grid-row-actions" data-ui="rowform.actions">${btn('grid-insert-row', 'Insert Above', 'arrow-up', ' data-action="insert-above"')}${btn('grid-insert-row-below', 'Insert Below', 'arrow-down', ' data-action="insert-below"')}${btn('grid-duplicate-row', 'Duplicate', 'copy', ' data-action="duplicate"')}${btn('grid-move-row', 'Move', 'move', ' data-action="move"')}${btn('grid-delete-row', 'Delete', 'trash-2', ' data-action="delete"')}</span>`;
  const heading = `<div class="grid-form-heading" data-ui="rowform.heading"><div class="toolbar grid-header-toolbar"><span class="panel-title"><span class="grid-form-row-index">Editing Row #${idx}</span></span>${actions}<span class="row-actions"><button type="button" class="btn btn-default btn-xs grid-collapse-row" data-action="collapse" aria-label="Collapse">${ic('chevron-up', 'icon-xs')}</button></span></div></div>`;
  const footer = `<div class="grid-footer-toolbar hidden-xs flex justify-between" data-ui="rowform.footer"><div class="grid-shortcuts"><span class="text-muted small">Ctrl+Up / Ctrl+Down: previous / next row</span></div><div class="flex">${ro ? '' : btn('grid-append-row', 'Add Row', '', ' data-action="add-row"')}${btn('grid-edit-full', 'Edit in full page', 'external-link', ' data-action="edit-full" data-ui="rowform.edit-full"')}</div></div>`;
  const d = Number(o.depth) || 0; // a grandchild form stacks on its parent: lower and narrower, like a second dialog
  return `<div class="form-in-grid" data-ui="rowform" data-fieldname="${esc(field?.fieldname || '')}" data-idx="${idx}" data-rows="${count}" data-depth="${d}"><div class="grid-form-body">${heading}<div class="form-area">${body}</div>${footer}</div></div>`;
}

// Find the Table control of `fieldname` in html and the grid-row `idx` in it; returns insert position or -1.
function findRowEnd(html, fieldname, idx) {
  const mark = `data-fieldtype="Table" data-fieldname="${esc(fieldname)}"`;
  const t = html.indexOf(mark);
  if (t < 0) return null;
  const rowTag = `<div class="grid-row" data-name="row-${idx}" data-idx="${idx}">`;
  const s = html.indexOf(rowTag, t);
  if (s < 0) return null;
  const after = s + rowTag.length;
  const n1 = html.indexOf('<div class="grid-row" data-name=', after);
  const n2 = html.indexOf('</div><div class="grid-empty', after);
  const ends = [n1, n2].filter((x) => x >= 0);
  const stop = ends.length ? Math.min(...ends) : html.length;
  // the row's own closing </div> directly precedes `stop` (for n2 the leading </div> closes .rows; step back one more)
  const rowClose = html.lastIndexOf('</div>', n2 === stop ? stop - 1 : stop);
  return { start: s, at: rowClose };
}

/**
 * Post-process rendered form HTML: open the requested rows.
 * opts: {overlays, meta, doc, renderField, loadMeta, markDrawn(o)}
 * Returns new html. Unresolvable overlays are skipped (caller's warn path reports undrawn ones).
 */
export function injectRowForms(html, opts = {}) {
  const { overlays = [], meta, doc = {}, renderField, loadMeta } = opts;
  const open = overlays.filter((o) => o?.type === 'row_open');
  let out = html;
  const drawn = [];
  const openChain = (o, hostHtml, hostMeta, hostDoc, depth) => {
    const df = (hostMeta?.fields || []).find((f) => f.fieldname === o.field && /^Table/.test(f.fieldtype));
    const rows = Array.isArray(hostDoc?.[o.field]) ? hostDoc[o.field] : [];
    const i = Number.isInteger(o.row) ? o.row : 0;
    const childMeta = df && loadMeta?.(df.options);
    if (!df || !childMeta || i < 0 || i >= rows.length) return null;
    const pos = findRowEnd(hostHtml, o.field, i + 1);
    if (!pos) return null;
    let form = renderRowForm({ overlay: o, meta: hostMeta, doc: hostDoc, rowIdx: i, field: df, childMeta, row: rows[i], renderField, loadMeta, count: rows.length, depth, docstatus: doc.docstatus });
    if (o.child && depth < 6) { const nested = openChain(o.child, form, childMeta, rows[i], depth + 1); if (nested) form = nested; }
    const opened = hostHtml.slice(pos.start, pos.at).replace('<div class="grid-row"', '<div class="grid-row grid-row-open"');
    return hostHtml.slice(0, pos.start) + opened + form + hostHtml.slice(pos.at);
  };
  for (const o of open) {
    const r = openChain(o, out, meta, doc, 0);
    if (r) { out = r; drawn.push(o); }
  }
  for (const o of drawn) opts.markDrawn?.(o);
  // the desk dims the page behind an open row form (#freeze.grid-form)
  if (drawn.length) out += '<div id="freeze" class="grid-form" data-ui="rowform.freeze" style="position:fixed;inset:0;z-index:1038;background:var(--gray-800,#171717);opacity:.45"></div>';
  return out;
}

export default { renderRowForm, injectRowForms };
