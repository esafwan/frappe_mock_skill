import { loadVocabulary } from './i18n.mjs';
// Permission helpers (owned by PERMS). Pure, deterministic, no deps.
// Sources: ctx.perms (explicit overrides) > DocPerm rows in meta.permissions + ctx.user.roles > allow all.
// ctx.perms shape: { "<DocType>": { "<ptype>": bool }, "*": {...}, "<ptype>": bool (flat = every DocType) }; ptypes: read write create delete submit
// cancel amend print export email share report import. Per-level: { "levels": { "1": {"read": true, "write": false} } }.
const PTYPES = ['read', 'write', 'create', 'delete', 'submit', 'cancel', 'amend', 'print', 'export', 'email', 'share', 'report', 'import'];
const ADMIN_ROLES = ['Administrator', 'System Manager'];
const DEFAULT_ROLES = ['System Manager'];

/** Permissions are enforced only when the spec declares ctx.perms (non-empty). Absent = everything allowed, output unchanged. */
export const permsOn = (ctx) => !!ctx && !!ctx.perms && typeof ctx.perms === 'object' && Object.keys(ctx.perms).length > 0;

export function userRoles(ctx = {}) {
  const r = ctx.user && ctx.user.roles;
  return Array.isArray(r) && r.length ? r : DEFAULT_ROLES;
}
const isAdmin = (ctx) => (ctx.user && ctx.user.name === 'Administrator') || userRoles(ctx).some((r) => ADMIN_ROLES.includes(r));

/** Role gate for sidebar items, shortcuts, links: item.roles (array) or item.role (string). Empty = visible. */
export function roleAllowed(ctx, roles) {
  const need = Array.isArray(roles) ? roles : roles ? [roles] : [];
  if (!need.length || isAdmin(ctx)) return true;
  const have = userRoles(ctx);
  return need.some((r) => have.includes(r));
}

/** Resolve permission flags for one doctype at a permlevel (default 0). Returns {ptype: bool}. */
export function resolvePerms(ctx = {}, meta = {}, doctype, permlevel = 0) {
  const dt = doctype || meta.name || meta.doctype;
  const out = {};
  const rows = Array.isArray(meta.permissions) ? meta.permissions : null;
  const have = userRoles(ctx);
  for (const p of PTYPES) {
    let v = true;
    if (rows && !isAdmin(ctx)) {
      v = rows.some((r) => (r.permlevel || 0) === permlevel && have.includes(r.role) && !!r[p]);
    }
    out[p] = v;
  }
  const o = ctx.perms || {};
  const apply = (src) => { if (src) for (const p of PTYPES) if (typeof src[p] === 'boolean') out[p] = src[p]; };
  apply(o); apply(o['*']); apply(o[dt]);
  const lv = (o[dt] && o[dt].levels && o[dt].levels[permlevel]) || null;
  apply(lv);
  if (!out.read) { for (const p of PTYPES) out[p] = false; }
  return out;
}
export const can = (ctx, meta, ptype, doctype, permlevel = 0) => !!resolvePerms(ctx, meta, doctype, permlevel)[ptype];

// Standard action label -> required ptype. Matching is case-insensitive on the visible label.
const ACTION_PTYPE = { create: 'create', new: 'create', delete: 'delete', export: 'export', print: 'print',
  submit: 'submit', cancel: 'cancel', amend: 'amend', email: 'email', share: 'share', import: 'import', duplicate: 'create' };

/** Filter a list of action items ({label|id|action}) by perms. Menu items for Create/Delete/Export/Print/Submit hidden. */
export function applyActions(ctx, meta, items = [], doctype) {
  const p = resolvePerms(ctx, meta, doctype);
  return items.filter((it) => {
    if (!it) return true;
    const key = String(it.action || it.id || it.label || '').toLowerCase().trim();
    const first = key.split(/[\s_-]+/)[0];
    const pt = ACTION_PTYPE[key] || ACTION_PTYPE[first];
    if (it.ptype) return !!p[it.ptype];
    return pt ? !!p[pt] : true;
  });
}

/** Mark fields read-only by permlevel: returns new fields with `read_only: 1` / `hidden: 1` per DocPerm. Does not mutate. */
export function applyFields(ctx, meta, fields, doctype) {
  const list = fields || meta.fields || [];
  const cache = {};
  const at = (lv) => (cache[lv] ??= resolvePerms(ctx, meta, doctype, lv));
  return list.map((f) => {
    const lv = f.permlevel || 0;
    const p = at(lv);
    if (!p.read) return { ...f, hidden: 1, _perm_hidden: 1 };
    if (!p.write && !f.read_only) return { ...f, read_only: 1, _perm_readonly: 1 };
    return f;
  });
}

/** Sidebar/shortcut filter. Items may have children/items; empty parents (all children hidden) are dropped. */
export function applySidebar(ctx, items = []) {
  const out = [];
  for (const it of items) {
    if (!roleAllowed(ctx, it.roles || it.role) || !itemReadable(ctx, it)) continue;
    const kids = it.items || it.children;
    if (Array.isArray(kids)) {
      const k = applySidebar(ctx, kids);
      if (!k.length && kids.length) continue;
      out.push({ ...it, ...(it.items ? { items: k } : { children: k }) });
    } else out.push(it);
  }
  return out;
}
export const applyShortcuts = (ctx, shortcuts = []) => shortcuts.filter((s) => roleAllowed(ctx, s.roles || s.role) && itemReadable(ctx, s));

/** DocType an item points at: link_type/type DocType -> link_to, else document_type / doctype. '' when none. */
export function doctypeOf(it = {}) {
  const lt = String(it.link_type || it.type || '').toLowerCase();
  if (lt === 'doctype' && it.link_to) return String(it.link_to);
  return String(it.document_type || it.doctype || '');
}
/** An item is readable unless it points at a DocType the role cannot read. Only enforced when ctx.perms is declared. */
export function itemReadable(ctx, it) {
  if (!permsOn(ctx)) return true;
  const dt = doctypeOf(it);
  return !dt || resolvePerms(ctx, {}, dt).read;
}
/** Grid/list column or form field is visible at its permlevel (read at that level). */
export function fieldReadable(ctx, meta, df, doctype) {
  if (!permsOn(ctx)) return true;
  return resolvePerms(ctx, meta, doctype, df.permlevel || 0).read;
}
/** Form fields after perms: no read at the permlevel -> hidden, no write -> read-only. Returns the input untouched when perms are off. */
export function fieldsFor(ctx, meta, fields, doctype) {
  const list = localizeFields(ctx, fields);
  return permsOn(ctx) ? applyFields(ctx, meta, list, doctype) : list;
}
/** DocField label, description, and section/tab labels through the locale vocabulary (data/universals/i18n/<lang>.json). Non-en only; en returns the input. */
export function localizeFields(ctx, fields) {
  const lang = String(ctx?.locale || 'en').toLowerCase().split(/[-_]/)[0];
  if (lang === 'en' || !Array.isArray(fields)) return fields;
  const v = loadVocabulary(lang);
  if (!Object.keys(v).length) return fields;
  const tr = (s) => (typeof s === 'string' && Object.prototype.hasOwnProperty.call(v, s.trim()) ? v[s.trim()] : s);
  return fields.map((f) => {
    const n = { ...f };
    for (const k of ['label', 'description']) if (f[k]) n[k] = tr(f[k]);
    return n;
  });
}
/** Single yes/no for one ptype; always true when perms are off. */
export function allowed(ctx, meta, ptype, doctype) { return !permsOn(ctx) || can(ctx, meta, ptype, doctype); }

/** Page-level toolbar flags for renderers: which standard buttons to show. */
export function toolbarFlags(ctx, meta, doctype) {
  const p = resolvePerms(ctx, meta, doctype);
  return { create: p.create, delete: p.delete, export: p.export, print: p.print, submit: p.submit, cancel: p.cancel,
    amend: p.amend, email: p.email, share: p.share, import: p.import, write: p.write, read: p.read, readOnly: !p.write };
}
