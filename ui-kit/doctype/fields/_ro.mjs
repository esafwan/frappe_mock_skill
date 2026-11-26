// Read-only rules shared by field renderers and the form renderer. Generic; no doctype names.
// Default export is empty on purpose: loadFieldRenderers() treats default entries as fieldtype renderers.
const NON_DATA = new Set(['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Heading', 'Button', 'Image', 'Fold']);

// Frappe display_status: docstatus 2 locks everything; docstatus 1 locks fields without allow_on_submit.
export function isLockedByDocstatus(df, doc) {
  const ds = Number(doc?.docstatus) || 0;
  if (ds === 2) return true;
  return ds === 1 && !df.allow_on_submit;
}

export function shouldBeReadOnly(df, doc) {
  if (!df || NON_DATA.has(df.fieldtype)) return false;
  return isLockedByDocstatus(df, doc);
}

export default {};
