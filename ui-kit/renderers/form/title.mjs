// Form title + status pill model. Generic, deterministic.
// Frappe: title = doc.name, or doc[title_field] only when meta.show_title_field_in_link is set.
import { get_indicator, normalizeWorkflow } from '../../kit-lib/indicators.mjs';

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
  return get_indicator(doc, meta) || null;
}

export function formTitleModel(meta = {}, doc = {}) {
  return { ...formTitle(meta, doc), status: formStatus(meta, doc) };
}

// Matrix self-test: node renderers/form/title.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const sub = { name: 'Doc', is_submittable: 1, title_field: 'cust', show_title_field_in_link: 1 };
  const plain = { ...sub, show_title_field_in_link: 0 };
  const wf = { ...sub, workflow: normalizeWorkflow(1) };
  const cases = [
    ['ds0', sub, { name: 'D-1', cust: 'Acme', docstatus: 0 }],
    ['ds1', sub, { name: 'D-1', cust: 'Acme', docstatus: 1 }],
    ['ds2', sub, { name: 'D-1', cust: 'Acme', docstatus: 2 }],
    ['unsaved-new', sub, { __islocal: 1, docstatus: 0 }],
    ['unsaved-dirty', sub, { name: 'D-1', cust: 'Acme', __unsaved: 1, docstatus: 0 }],
    ['workflow', wf, { name: 'D-1', cust: 'Acme', docstatus: 0, workflow_state: 'Pending' }],
    ['amended', sub, { name: 'D-1-1', cust: 'Acme', docstatus: 0, amended_from: 'D-1' }],
    ['no-title-flag', plain, { name: 'D-1', cust: 'Acme', docstatus: 0 }],
  ];
  let bad = 0;
  for (const [n, m, d] of cases) {
    const r = formTitleModel(m, d);
    const ok = r.title && (n === 'unsaved-new' ? r.title === 'New Doc' : n === 'no-title-flag' ? r.title === 'D-1' : r.title === 'Acme' && r.sub === d.name) && r.status && r.status.label;
    if (!ok) bad++;
    console.log(ok ? 'ok  ' : 'FAIL', n, JSON.stringify(r));
  }
  process.exit(bad ? 1 : 0);
}
