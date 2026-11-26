// Pin interaction states (hover, focus, active, disabled, loading) on already-rendered HTML.
// Generic: works on any page that marks elements with data-ui, data-fieldname or data-row-index/data-col-index.
import { esc } from './util.mjs';

export const STATES = ['hover', 'focus', 'active', 'disabled', 'loading'];
/** Class Frappe uses for the state, where one exists. */
const STATE_CLASS = { hover: 'is-hover', focus: 'is-focused', active: 'active', disabled: 'disabled', loading: 'loading' };
const STATE_ATTR = { disabled: ' disabled aria-disabled="true"', loading: ' aria-busy="true"', active: ' aria-pressed="true"', focus: '', hover: '' };
const reEsc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when the target string is one this module can resolve. */
export const STATE_TARGET_RE = /^(row:\d+|cell:\d+[,:].+|button:.+|field:.+|tab:.+|link:.+|card:.+|column:.+|ui:.+)$/;

/** Mark the opening tag at [index, index+len) with the state. */
function markTag(html, index, tag, state) {
  let t = tag.replace(/\sdata-state="[^"]*"/, '');
  t = t.replace(/\/?>$/, (e) => ` data-state="${state}"${t.includes(' disabled') ? '' : STATE_ATTR[state] || ''}${e}`);
  const cls = STATE_CLASS[state];
  t = /\sclass="/.test(t)
    ? t.replace(/\sclass="([^"]*)"/, (_, c) => ` class="${c.split(/\s+/).includes(cls) ? c : `${c} ${cls}`.trim()}"`)
    : t.replace(/^<([\w-]+)/, `<$1 class="${cls}"`);
  return html.slice(0, index) + t + html.slice(index + tag.length);
}

function findTag(html, re, from = 0) {
  re.lastIndex = from;
  const m = re.exec(html);
  return m ? { index: m.index, tag: m[0] } : null;
}

const byAttr = (attr, val) => new RegExp(`<([a-zA-Z][\\w-]*)\\b[^>]*\\s${attr}="${reEsc(esc(val))}"[^>]*>`, 'g');

/** Locate the opening tag for a target. Returns {index, tag} or null. */
export function locate(html, target) {
  const i = target.indexOf(':');
  const kind = target.slice(0, i), id = target.slice(i + 1);
  const ui = (v) => findTag(html, byAttr('data-ui', v));
  if (kind === 'ui') return ui(id);
  if (kind === 'row') return ui(`list.row.${id}`) || ui(`row.${id}`) || findTag(html, new RegExp(`<[a-zA-Z][\\w-]*\\b[^>]*\\sdata-row-index="${reEsc(id)}"[^>]*>`, 'g'));
  if (kind === 'cell') {
    const [r, ...rest] = id.split(/[,:]/); const c = rest.join(':');
    if (/^\d+$/.test(c)) {
      // column by index: the c-th data-fieldname cell inside row r, else datatable data-col-index
      const dt = findTag(html, new RegExp(`<[a-zA-Z][\\w-]*\\b(?=[^>]*\\sdata-row-index="${r}")(?=[^>]*\\sdata-col-index="${c}")[^>]*>`, 'g'));
      if (dt) return dt;
      const row = ui(`list.row.${r}`);
      if (!row) return null;
      const end = html.indexOf('data-ui="list.row.', row.index + row.tag.length);
      const seg = html.slice(row.index, end < 0 ? html.length : end);
      const cells = [...seg.matchAll(/<[a-zA-Z][\w-]*\b[^>]*\sdata-ui="list\.cell\.\d+\.[^"]*"[^>]*>/g)];
      const m = cells[+c];
      return m ? { index: row.index + m.index, tag: m[0] } : null;
    }
    return ui(`list.cell.${r}.${c}`) || ui(`cell.${r}.${c}`);
  }
  if (kind === 'column') return ui(`list.column.${id}`) || ui(`column.${id}`);
  if (kind === 'field') {
    // prefer the control wrapper; fall back to the input itself
    return findTag(html, new RegExp(`<div\\b[^>]*\\sclass="[^"]*frappe-control[^"]*"[^>]*\\sdata-fieldname="${reEsc(esc(id))}"[^>]*>`, 'g'))
      || findTag(html, new RegExp(`<div\\b[^>]*\\sdata-fieldname="${reEsc(esc(id))}"[^>]*\\sclass="[^"]*frappe-control[^"]*"[^>]*>`, 'g'))
      || findTag(html, byAttr('data-fieldname', id)) || ui(`field.${id}`);
  }
  if (kind === 'button') {
    for (const c of [`list.button.${id}`, `form.button.${id}`, `button.${id}`, `list.button-group.${id}`, ...(id === 'primary' ? ['primary-action', 'list.primary-action', 'form.primary-action'] : [])]) { const h = ui(c); if (h) return h; }
    const re = new RegExp(`<button\\b[^>]*>(?:\\s*<[^>]+>)*\\s*${reEsc(esc(id))}\\s*(?:<[^>]+>\\s*)*</button>`, 'g');
    const m = re.exec(html);
    if (m) return { index: m.index, tag: /^<button\b[^>]*>/.exec(m[0])[0] };
    if (id === 'primary') return findTag(html, /<button\b[^>]*\sclass="[^"]*btn-primary[^"]*"[^>]*>/g);
    return null;
  }
  if (kind === 'tab' || kind === 'link' || kind === 'card') {
    const h = ui(`${kind}:${id}`) || ui(`${kind}.${id}`);
    if (h) return h;
    if (kind === 'tab') {
      const re = new RegExp(`<(a|button)\\b[^>]*class="[^"]*nav-link[^"]*"[^>]*>\\s*${reEsc(esc(id))}\\s*</\\1>`, 'g');
      const m = re.exec(html);
      return m ? { index: m.index, tag: /^<(?:a|button)\b[^>]*>/.exec(m[0])[0] } : null;
    }
  }
  return null;
}

/**
 * Apply state overlays to rendered HTML.
 * @param {string|string[]} slots one HTML string, or several (e.g. head and main); first hit wins per overlay.
 * @param {object[]} overlays overlays of type "state" ({target, state}); others ignored.
 * @returns {{slots: string[], applied: object[], missed: object[]}}
 */
export function applyStates(slots, overlays = []) {
  const out = Array.isArray(slots) ? [...slots] : [slots];
  const applied = [], missed = [];
  for (const o of overlays) {
    if (!o || o.type !== 'state') continue;
    if (!STATES.includes(o.state) || !STATE_TARGET_RE.test(o.target || '')) { missed.push(o); continue; }
    let hit = false;
    for (let s = 0; s < out.length && !hit; s++) {
      const h = locate(out[s], o.target);
      if (h) { out[s] = markTag(out[s], h.index, h.tag, o.state); hit = true; }
    }
    (hit ? applied : missed).push(o);
  }
  return { slots: out, applied, missed };
}

/** Convenience for a renderer ctx: applies and marks drawn overlays via ctx.useOverlays. Returns the new slots array. */
export function applyStatesCtx(slots, ctx) {
  const { slots: out, applied } = applyStates(slots, ctx.overlays || []);
  if (applied.length) ctx.useOverlays?.('state', (x) => applied.includes(x));
  return out;
}
