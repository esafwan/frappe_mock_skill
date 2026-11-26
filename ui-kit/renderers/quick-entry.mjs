// Generic Quick Entry dialog: mandatory fields (plus allow_in_quick_entry) of a DocType meta, with
// "Save" and "Edit Full Form". Produces a dialog spec for renderers/dialog.mjs. No names baked in. Deterministic.
import { renderDialog } from './dialog.mjs';

const BREAKS = new Set(['Section Break', 'Column Break', 'Tab Break']);
const SKIP = new Set(['Table', 'Table MultiSelect', 'Attach', 'Attach Image', 'Button', 'Image', 'Fold', 'Heading', 'HTML', 'Geolocation', 'Signature', 'Code', 'Text Editor', 'Markdown Editor', 'HTML Editor', 'Barcode', 'Rating', 'Icon', 'Autocomplete', 'JSON']);
// Frappe allows only simple types; Code/Text Editor etc. are skipped, Attach and Table are unsupported.
const OK_TYPES_EXTRA = new Set(['Autocomplete', 'Rating', 'Code']);

/** Is each mandatory field drawable in quick entry? Frappe refuses quick entry when a mandatory field is a Table. */
export function isQuickEntry(meta = {}) {
  if (meta.quick_entry === 0 || meta.quick_entry === false) return false;
  if (meta.istable || meta.issingle) return false;
  return !(meta.fields || []).some((f) => f.reqd && !f.hidden && /^Table/.test(f.fieldtype));
}

/** Pick fields: reqd or allow_in_quick_entry, not hidden/read-only/display-only; keep a break only if a picked field follows it. */
export function quickEntryFields(meta = {}) {
  const all = meta.fields || [];
  const order = (meta.field_order || []).length
    ? meta.field_order.map((n) => all.find((f) => f.fieldname === n)).filter(Boolean).concat(all.filter((f) => !meta.field_order.includes(f.fieldname)))
    : all;
  const out = [];
  let pending = [];
  for (const f of order) {
    if (BREAKS.has(f.fieldtype)) { if (f.fieldtype !== 'Tab Break') pending.push(f); continue; }
    if (f.hidden || f.read_only || f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect') continue;
    if (SKIP.has(f.fieldtype) && !OK_TYPES_EXTRA.has(f.fieldtype)) continue;
    if (!(f.reqd || f.allow_in_quick_entry)) continue;
    // Frappe flattens the layout: at most one leading break, none before the first field.
    if (out.length) out.push(...pending.filter((b) => b.fieldtype === 'Column Break' || b.fieldtype === 'Section Break').slice(-1));
    pending = [];
    out.push(f);
  }
  return out;
}

/** Dialog spec for renderDialog. `doctype` defaults to meta.name; the title is "New <doctype>". */
export function quickEntrySpec(meta = {}, o = {}) {
  const dt = (typeof o.doctype === 'string' && o.doctype && !/[\/]|\.json$/.test(o.doctype) ? o.doctype : '') || meta.name || '';
  return {
    kind: 'quick_entry',
    title: o.title || `New ${dt}`.trim(),
    size: o.size || 'default',
    fields: quickEntryFields(meta),
    values: o.values || {},
    primary_action: o.primary_action || 'Save',
    secondary_action: o.secondary_action ?? 'Edit Full Form',
  };
}

/** html of the quick entry dialog. kit: loadDialogKit() result. */
export function renderQuickEntry(meta, o = {}, n = 0, kit = {}) {
  return renderDialog(quickEntrySpec(meta, o), n, kit);
}
export default renderQuickEntry;
