// Form title + status pill model. Generic, deterministic.
// Frappe: title = doc.name, or doc[title_field] only when meta.show_title_field_in_link is set.
import { get_indicator } from '../../kit-lib/indicators.mjs';

const t = (v) => v === 1 || v === true || v === '1';

export function formTitle(meta = {}, doc = {}) {
  const dt = meta.name || meta.doctype || 'Document';
  if (doc.__islocal || !doc.name) return { title: `New ${dt}`, sub: '' };
  const tv = t(meta.show_title_field_in_link) && meta.title_field ? doc[meta.title_field] : '';
  const title = tv || doc.name;
  return { title, sub: title !== doc.name ? doc.name : '' };
}

/** Status indicator beside the title: {label, colour} or null. */
export function formStatus(meta = {}, doc = {}) {
  if (doc.__islocal && !doc.__unsaved) return { label: 'Not Saved', colour: 'orange' };
  if (doc.__unsaved && !doc.__islocal && !(t(meta.is_submittable) && Number(doc.docstatus) === 2)) {
    return { label: 'Not Saved', colour: 'orange' };
  }
  if (t(meta.issingle)) return null; // Single DocTypes have no status pill
  return get_indicator(doc, meta) || null;
}

export function formTitleModel(meta = {}, doc = {}) {
  return { ...formTitle(meta, doc), status: formStatus(meta, doc) };
}
