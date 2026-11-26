// Report dialogs (T-R4): Pick Columns, Add Column, Export, Save As, Create Chart. Built on renderers/dialog.mjs.
// Generic: every name comes from meta / overlays. renderReportDialogs() claims dialog overlays by `kind` or title.
import { renderDialog } from '../dialog.mjs';
import { esc } from '../../kit-lib/util.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const NO_COL = new Set(['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Table', 'Table MultiSelect', 'Button', 'Image', 'Fold', 'Heading']);
const lbl = (f) => f.label || String(f.fieldname || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const opts = (a) => (a || []).map((x) => (typeof x === 'string' ? x : x.value ?? x.label)).join('\n');

export function columnFields(meta = {}) { return (meta.fields || []).filter((f) => f.fieldname && !NO_COL.has(f.fieldtype) && !t(f.hidden)); }

/** Pick Columns: one Check per available field (checked = shown), grouped by doctype (parent first, then each child table), as frappe's "Pick Columns" dialog.
 *  `o.groups` = [{ doctype, fields:[{fieldname,label}] }]; `o.selected` holds picker keys ("fieldname" for the parent, "<Child>.<fieldname>" for children). */
export const pickKey = (dt, fn, parent) => (dt && dt !== parent ? `${dt}.${fn}` : fn);
export function pickColumnsDialog(meta = {}, o = {}) {
  const groups = o.groups || [{ doctype: meta.name || '', fields: o.available || columnFields(meta).map((f) => ({ fieldname: f.fieldname, label: lbl(f), default: f.default })) }];
  const sel = new Set(o.selected || groups.flatMap((g) => g.fields.filter((f) => f.default).map((f) => pickKey(g.doctype, f.fieldname, meta.name))));
  const values = {}, fields = [];
  groups.forEach((g, i) => {
    if (groups.length > 1) fields.push({ fieldname: `pick_sb_${i}`, fieldtype: 'Section Break', label: g.doctype });
    for (const f of g.fields) { const k = pickKey(g.doctype, f.fieldname, meta.name); const fn = k.replace(/[^\w]/g, '_'); values[fn] = sel.has(k) ? 1 : 0; fields.push({ fieldname: fn, fieldtype: 'Check', label: f.label || lbl(f) }); }
  });
  return renderDialog({ kind: 'pick_columns', title: o.title || 'Pick Columns', size: o.size, primary_action: o.primary_action || 'Submit', secondary_action: o.secondary_action, fields, values }, o.n || 0, o.kit);
}

/** Add Column: Doctype (Select), Field (Select), Insert After (Select). */
export function addColumnDialog(meta = {}, o = {}) {
  const v = o.values || {};
  const fields = [
    { fieldname: 'doctype', fieldtype: 'Select', label: 'Doctype', options: opts(o.doctypes || [meta.name].filter(Boolean)) },
    { fieldname: 'field', fieldtype: 'Select', label: 'Field', options: opts(o.field_options || columnFields(meta).map((f) => ({ value: f.fieldname, label: lbl(f) }))) },
    { fieldname: 'insert_after', fieldtype: 'Select', label: 'Insert After', options: opts(o.insert_after_options || o.columns || []) },
  ];
  return renderDialog({ kind: 'add_column', title: o.title || 'Add Column', size: o.size, primary_action: o.primary_action || 'Submit', secondary_action: o.secondary_action, fields, values: { doctype: v.doctype ?? meta.name ?? '', field: v.field ?? '', insert_after: v.insert_after ?? '' } }, o.n || 0, o.kit);
}

/** Export: File Format, Include indentation (tree), Export all rows when limited. */
export function exportDialog(meta = {}, o = {}) {
  const v = o.values || {};
  const fields = [
    { fieldname: 'file_format', fieldtype: 'Select', label: 'File Format', options: opts(o.formats || ['Excel', 'CSV']), reqd: 1 },
    ...(o.tree ? [{ fieldname: 'include_indentation', fieldtype: 'Check', label: 'Include indentation' }] : []),
    ...(o.filtered ? [{ fieldname: 'export_filtered', fieldtype: 'Check', label: 'Export filtered rows only' }] : []),
  ];
  return renderDialog({ kind: 'report_export', title: o.title || 'Export Report', size: o.size || 'small', primary_action: o.primary_action || 'Download', secondary_action: o.secondary_action, fields,
    values: { file_format: v.file_format ?? (o.formats?.[0]?.value ?? o.formats?.[0] ?? 'Excel'), include_indentation: t(v.include_indentation) ? 1 : 0, export_filtered: t(v.export_filtered) ? 1 : 0 } }, o.n || 0, o.kit);
}

/** Save As: new report name. */
export function saveAsDialog(meta = {}, o = {}) {
  const v = o.values || {};
  return renderDialog({ kind: 'report_save_as', title: o.title || 'Save Report', size: o.size || 'small', primary_action: o.primary_action || 'Save', secondary_action: o.secondary_action,
    fields: [{ fieldname: 'report_name', fieldtype: 'Data', label: 'Report Name', reqd: 1 }], values: { report_name: v.report_name ?? '' } }, o.n || 0, o.kit);
}

/** Create Chart: name, type, x-axis, y-axis fields. */
export function createChartDialog(meta = {}, o = {}) {
  const v = o.values || {};
  const NUM = new Set(['Int', 'Float', 'Currency', 'Percent']);
  const numCols = columnFields(meta).filter((f) => NUM.has(f.fieldtype)).map((f) => ({ value: f.fieldname, label: lbl(f) }));
  const cols = o.columns || columnFields(meta).map((f) => ({ value: f.fieldname, label: lbl(f) }));
  const fields = [
    { fieldname: 'chart_name', fieldtype: 'Data', label: 'Chart Name' },
    { fieldname: 'chart_type', fieldtype: 'Select', label: 'Chart Type', options: opts(o.chart_types || ['Bar', 'Line', 'Percentage', 'Pie', 'Donut']) },
    { fieldname: 'x_field', fieldtype: 'Select', label: 'X Field', options: opts(o.x_options || cols) },
    { fieldname: 'y_fields', fieldtype: 'Select', label: 'Y Axis Fields', options: opts(o.y_options || (numCols.length ? numCols : cols)) },
  ];
  return renderDialog({ kind: 'report_create_chart', title: o.title || 'Create Chart', size: o.size, primary_action: o.primary_action || 'Create', secondary_action: o.secondary_action, fields,
    values: { chart_name: v.chart_name ?? '', chart_type: v.chart_type ?? 'Bar', x_field: v.x_field ?? '', y_fields: v.y_fields ?? '' } }, o.n || 0, o.kit);
}

const KINDS = { pick_columns: pickColumnsDialog, add_column: addColumnDialog, report_export: exportDialog, report_save_as: saveAsDialog, report_create_chart: createChartDialog };
const ALIAS = { export: 'report_export', save_as: 'report_save_as', create_chart: 'report_create_chart' };
function kindOf(o) {
  const k = ALIAS[o.kind] || o.kind;
  if (KINDS[k]) return k;
  const ti = String(o.title || '').toLowerCase();
  if (/^pick columns\b/.test(ti)) return 'pick_columns';
  if (/^add column\b/.test(ti)) return 'add_column';
  if (/^export( report)?\b/.test(ti)) return 'report_export';
  if (/^save( report)?( as)?\b/.test(ti)) return 'report_save_as';
  if (/^create chart\b/.test(ti)) return 'report_create_chart';
  return null;
}

/** Claim report-dialog overlays. Returns { dialogs: [{overlay, html}] }; `n0` is the first data-ui index. */
export function renderReportDialogs({ spec = {}, meta = {}, ctx, n0 = 0, columns = [] } = {}) {
  const children = Object.entries(spec.meta?.children || {}).filter(([, m]) => m && typeof m === 'object');
  const groups = [{ doctype: meta.name || '', fields: columnFields(meta).map((f) => ({ fieldname: f.fieldname, label: lbl(f) })) },
    ...children.map(([dt, m]) => ({ doctype: dt, fields: columnFields(m).map((f) => ({ fieldname: f.fieldname, label: lbl(f) })) }))];
  const picked = columns.map((c) => pickKey(c.child ? c.doctype : '', c.fieldname, meta.name));
  const out = { dialogs: [] };
  if (!ctx?.useOverlays) return out;
  let n = n0;
  for (const o of ctx.useOverlays('dialog', (x) => !!kindOf(x))) {
    const { kind, title, ...rest } = o;
    out.dialogs.push({ overlay: o, html: KINDS[kindOf(o)](meta, { groups, selected: picked, insert_after_options: columns.map((c) => ({ value: c.fieldname, label: c.label })), ...rest, title, n: n++, kit: ctx.dialogKit }) });
  }
  return out;
}
export default renderReportDialogs;
