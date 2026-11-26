import { esc, hash } from './util.mjs';

export const COLOURS = ['gray', 'green', 'red', 'orange', 'yellow', 'blue', 'cyan', 'purple', 'pink'];
const MAP = {
  green: ['active', 'enabled', 'approved', 'completed', 'closed', 'paid', 'success', 'passed', 'delivered', 'resolved', 'received', 'accepted', 'billed', 'fully paid', 'submitted ok'],
  red: ['cancelled', 'canceled', 'rejected', 'failed', 'overdue', 'expired', 'error', 'lost', 'stopped', 'disabled-error', 'unpaid', 'out of stock', 'draft'],
  orange: ['pending', 'partially paid', 'to bill', 'to deliver', 'on hold', 'hold', 'warning', 'in progress', 'working', 'open'],
  blue: ['submitted', 'new', 'to receive', 'to deliver and bill', 'ordered', 'sent', 'scheduled', 'replied'],
  gray: ['disabled', 'inactive', 'draft-gray', 'archived', 'na', 'not started', 'default'],
};
const LOOKUP = new Map();
for (const [c, ws] of Object.entries(MAP)) for (const w of ws) LOOKUP.set(w, c);

/** Deterministic colour for a status string: known words map fixed, others hash into the palette. */
export function guess_colour(value) {
  const key = String(value ?? '').trim().toLowerCase();
  if (!key) return 'gray';
  if (LOOKUP.has(key)) return LOOKUP.get(key);
  return COLOURS[hash(key) % COLOURS.length];
}

const normColour = (c) => (c ? String(c).toLowerCase() : null);

/**
 * Port of frappe.get_indicator, 7-step order:
 * 1 unsaved, 2 workflow state, 3 docstatus (draft/cancelled), 4 DocType `states` rules,
 * 5 submitted, 6 `status` field (guess_colour), 7 none (null).
 * ctx: { doc, meta:{is_submittable, states[], workflow:{state_field, styles{state:colour}}, title_field} }
 * Returns { label, colour, step } or null.
 */
export function get_indicator(doc = {}, meta = {}) {
  if (doc.__unsaved) return { label: 'Not Saved', colour: 'orange', step: 1 };
  const wf = meta.workflow;
  if (wf && wf.state_field && doc[wf.state_field]) {
    const s = doc[wf.state_field];
    return { label: s, colour: normColour(wf.styles?.[s]) || guess_colour(s), step: 2 };
  }
  const ds = Number(doc.docstatus || 0);
  if (meta.is_submittable) {
    if (ds === 2) return { label: 'Cancelled', colour: 'red', step: 3 };
    if (ds === 0) { if (!doc.__islocal || true) { /* fallthrough to states below for drafts only if no rule matches */ } }
  }
  for (const st of meta.states || []) {
    const f = st.field ?? st.fieldname, v = doc[f];
    const ok = st.value !== undefined ? String(v) === String(st.value) : Array.isArray(st.values) ? st.values.map(String).includes(String(v)) : !!v;
    if (ok) return { label: st.title || st.label || String(v), colour: normColour(st.color || st.colour) || guess_colour(v), step: 4 };
  }
  if (meta.is_submittable) {
    if (ds === 0) return { label: 'Draft', colour: 'red', step: 3 };
    if (ds === 1) return { label: 'Submitted', colour: 'blue', step: 5 };
  }
  if (doc.status) return { label: doc.status, colour: guess_colour(doc.status), step: 6 };
  return null;
}

/** Espresso badge markup for an indicator result. */
export function indicatorPill(ind, { page = false } = {}) {
  if (!ind) return '';
  const cls = ['es-badge', page ? 'page-indicator-pill' : 'indicator-pill'].join(' ');
  return `<span class="${cls}" data-theme="${esc(ind.colour)}"><span>${esc(ind.label)}</span></span>`;
}

/** Normalise meta.workflow once at load time: true or a name string becomes an object; objects keep their keys. */
export function normalizeWorkflow(wf) {
  if (wf === undefined || wf === null || wf === false || wf === 0 || wf === '') return undefined;
  if (typeof wf === 'object' && !Array.isArray(wf)) return wf;
  return { name: typeof wf === 'string' ? wf : undefined, state_field: 'workflow_state', states: [] };
}
