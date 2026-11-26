// Adapter: legacy report json ({name, ref_doctype, report_type, columns}) -> Frappe-native Report
// ({doctype:'Report', report_name, ref_doctype, report_type, columns:[{fieldname,label,fieldtype,width,options}], filters:[]}).
// Columns accept objects or Frappe script-report strings "Label:Fieldtype/Options:Width". Idempotent on native input.
const slug = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export function parseColumn(c) {
  if (c && typeof c === 'object') {
    const label = c.label ?? c.fieldname ?? '';
    return { ...c, fieldname: c.fieldname || slug(label), label, fieldtype: c.fieldtype || 'Data' };
  }
  const [label, type = 'Data', width] = String(c).split(':');
  const [fieldtype, options] = type.split('/');
  const col = { fieldname: slug(label), label: label.trim(), fieldtype: fieldtype.trim() || 'Data' };
  if (options) col.options = options.trim();
  if (width && !isNaN(+width)) col.width = +width;
  return col;
}

export function adaptReport(r) {
  const name = r.name || r.report_name;
  return { doctype: 'Report', is_standard: 'Yes', disabled: 0, ...r, name, report_name: r.report_name || name, ref_doctype: r.ref_doctype, report_type: r.report_type || 'Report Builder', columns: (r.columns || []).map(parseColumn), filters: r.filters || [] };
}

export function toLegacyReport(r) {
  return { name: r.name, ref_doctype: r.ref_doctype, report_type: r.report_type, columns: (r.columns || []).map((c) => ({ ...c })) };
}
