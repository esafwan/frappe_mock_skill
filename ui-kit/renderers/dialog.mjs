// Generic frappe.ui.Dialog renderer. Fields come from a plain `fields` list and are drawn by the shared
// fieldtype renderers (doctype/fields/*) and layout builder (doctype/lib/layout.mjs): Section Break,
// Column Break, Tab Break, Table (inline child `fields`), HTML, etc. No doctype/app/brand names. Deterministic.
//   const dk = await loadDialogKit();            // once (async: loads field renderers)
//   renderDialog(o, n, dk)                       // sync, returns the .modal-dialog html for the modal layer
import { loadFieldRenderers, makeMetaLoader } from './form/index.mjs';
import { buildLayout } from '../doctype/lib/layout.mjs';
import { esc } from '../kit-lib/util.mjs';

export const DIALOG_SIZES = { small: 380, default: 520, large: 720, 'extra-large': 940 };
const SIZE_CLASS = { small: ' modal-sm', large: ' modal-lg', 'extra-large': ' modal-xl' };
const colorOf = (c) => String(c || '').replace(/[^a-z-]/gi, '');

let KIT = null;
/** Load what renderDialog needs. Cached. */
export async function loadDialogKit() {
  if (KIT) return KIT;
  return (KIT = { renderers: await loadFieldRenderers(), loadMeta: makeMetaLoader() });
}

const fallback = (df) => `<div class="frappe-control input-max-width" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}"><div class="form-group"><div class="clearfix"><label class="control-label">${esc(df.label ?? df.fieldname)}</label></div><div class="control-input-wrapper"><div class="control-input"><input type="text" class="form-control" disabled data-fieldname="${esc(df.fieldname)}"></div></div></div></div>`;

function actionBtn(a, fallbackStyle, ui, cls) {
  if (!a) return '';
  const o = typeof a === 'string' ? { label: a } : a;
  const style = o.style || fallbackStyle;
  const k = style === 'primary' ? 'btn-primary' : style === 'danger' ? 'btn-danger' : 'btn-secondary';
  return `<button type="button" class="btn btn-sm ${k} ${cls}" data-ui="${ui}">${esc(o.label)}</button>`;
}

/** Fields list -> form-layout html (sections, columns, tabs-less flow). */
export function dialogBody(fields = [], values = {}, kit = {}) {
  const renderers = kit.renderers || {};
  const baseLoad = kit.loadMeta || (() => null);
  // Inline child fields for Table: register them under a synthetic name.
  const inline = {};
  const flds = fields.filter((f) => f && f.fieldname).map((f) => {
    if (f.fieldtype === 'Table' && Array.isArray(f.fields)) {
      const name = `__dialog_${f.fieldname}`;
      inline[name] = { name, istable: 1, fields: f.fields };
      return { ...f, options: name };
    }
    return f;
  });
  const loadMeta = (name) => inline[name] || baseLoad(name);
  const meta = { name: '', fields: flds, field_order: flds.map((f) => f.fieldname) };
  const doc = { ...values };
  for (const f of flds) if (doc[f.fieldname] === undefined && f.default !== undefined && f.default !== '') doc[f.fieldname] = f.default;
  const renderField = (df, c0 = {}) => {
    const ctx = { value: doc[df.fieldname], doc, doctype: '', meta, locale: kit.locale || 'en', loadMeta, renderField, dialog: true, ...c0 };
    const fn = renderers[df.fieldtype];
    return fn ? fn(df, ctx) : fallback(df);
  };
  const layout = buildLayout(meta, doc);
  const sec = (s, i = 0) => {
    const head = s.label ? `<div class="section-head">${esc(s.label)}</div>` : '';
    const desc = s.description ? `<div class="section-description text-muted small">${esc(s.description)}</div>` : '';
    const n = s.columns.length || 1;
    const equal = s.columns.every((c) => Math.abs((c.pct ?? 100 / n) - 100 / n) < 0.01);
    const cols = s.columns.map((c, i) => {
      const w = equal ? ` col-sm-${Math.max(1, Math.floor(12 / n))}` : '';
      const st = equal ? '' : ` style="flex:0 0 ${c.pct}%;max-width:${c.pct}%"`;
      return `<div class="form-column${w}"${st} data-fieldname="__column_${i}"><form>${c.fields.map((f) => renderField(f)).join('')}</form></div>`;
    }).join('');
    return `<div class="form-section card-section visible-section${s.hide_border || i === 0 ? ' hide-border' : ''}"${s.fieldname ? ` data-fieldname="${esc(s.fieldname)}"` : ''}>${head}${desc}<div class="section-body">${cols}</div></div>`;
  };
  // Dialogs have no tab strip: tab breaks just contribute their sections in order.
  const secs = layout.tabs.flatMap((t) => t.sections).map((s, i) => sec(s, i)).join('');
  return `<div class="form-layout"><div class="form-page">${secs}</div></div>`;
}

/**
 * o: { title, size: small|default|large|extra-large, indicator, message, fields[], values{},
 *      primary_action, secondary_action (string | {label, style}), kind, extra_class }
 * Raw slots: `body` (pre-rendered html, before `fields`), `custom_actions` (footer html), `attrs` (extra attributes on the
 *   .modal-content, e.g. the `data-ui="dialog:<id>"` alias; `data-ui="dialog.N"` stays on the .modal-dialog).
 * n: stack index (data-ui="dialog.N"). kit: result of loadDialogKit().
 */
export function renderDialog(o = {}, n = 0, kit = {}) {
  const kind = o.kind || 'dialog';
  const size = DIALOG_SIZES[o.size] ? o.size : 'default';
  const title = o.title || (kind === 'confirm' ? 'Confirm' : kind === 'msgprint' ? 'Message' : '');
  const lines = String(o.message || '').split('\n').filter((l) => l !== '');
  const msg = lines.length ? `<div class="msgprint">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>` : '';
  // `body` is pre-rendered html (bespoke bodies such as a share table); `fields` go through the real field renderers.
  const body = (o.body ?? '') + ((o.fields || []).length ? dialogBody(o.fields, o.values || {}, kit) : '');
  const primary = o.primary_action ?? (kind === 'confirm' ? 'Yes' : kind === 'msgprint' ? null : kind === 'quick_entry' ? 'Save' : 'Submit');
  const secondary = o.secondary_action ?? (kind === 'confirm' ? 'No' : null);
  const ind = o.indicator ? `<span class="indicator ${colorOf(o.indicator)}"></span> ` : '<span class="indicator hide"></span>';
  const x = '<svg class="icon icon-sm" aria-hidden="true"><use href="#icon-x"></use></svg>';
  const custom = o.custom_actions ? `<div class="custom-actions">${o.custom_actions}</div>` : '';
  const foot = [actionBtn(secondary, 'default', `dialog.${n}.secondary`, 'btn-modal-secondary'), actionBtn(primary, 'primary', `dialog.${n}.primary`, 'btn-modal-primary')].filter(Boolean).join('');
  return `<div class="modal-dialog${SIZE_CLASS[size] || ''}${o.extra_class ? ' ' + esc(o.extra_class) : ''}" style="--dlg-w:${DIALOG_SIZES[size]}px" role="document" data-ui="dialog.${n}" data-dialog-kind="${esc(kind)}" data-dialog-size="${size}"><div class="modal-content"${o.attrs ? ` ${o.attrs}` : ''}><div class="modal-header"><div class="fill-width flex title-section">${ind}<h4 class="modal-title">${esc(title)}</h4></div><div class="modal-actions"><button type="button" class="btn btn-modal-close btn-link" aria-label="Close">${x}</button></div></div><div class="modal-body ui-front">${msg}${body}</div>${foot || custom ? `<div class="modal-footer">${custom}<div class="standard-actions">${foot}</div></div>` : ''}</div></div>`;
}
export default renderDialog;
