// Submitted/cancelled forms: read-only fields plus Cancelled and amended-from banners.
// Generic; no doctype/app/brand names.
import { esc } from '../../doctype/lib/control.mjs';
import { shouldBeReadOnly } from '../../doctype/fields/_ro.mjs';

// Returns meta with read_only=1 set on locked fields (input meta is not mutated).
// Field renderers already show .control-value text when df.read_only is set.
export function applyReadOnly(meta, doc = {}) {
  const ds = Number(doc?.docstatus) || 0;
  if (!meta || ds < 1) return meta;
  const fields = (meta.fields || []).map((df) => (shouldBeReadOnly(df, doc) && !df.read_only ? { ...df, read_only: 1, _ro_locked: 1 } : df));
  return { ...meta, fields };
}

// Banner strip (frappe form-message style). Returns '' when nothing applies.
export function readOnlyBanners(meta, doc = {}) {
  const ds = Number(doc?.docstatus) || 0;
  const out = [];
  if (ds === 2) out.push('<div class="form-message red" data-ui="form.banner.cancelled"><div>Cancelled Document</div></div>');
  if (doc?.amended_from) out.push(`<div class="form-message blue" data-ui="form.banner.amended"><div>Amended From <a href="#" data-doctype="${esc(meta?.name || '')}" data-name="${esc(doc.amended_from)}">${esc(doc.amended_from)}</a></div></div>`);
  return out.length ? `<div class="form-message-container" data-ui="form.banners">${out.join('')}</div>` : '';
}

export default { applyReadOnly, readOnlyBanners };
