import { menuDropdown } from '../../kit-lib/menus.mjs';
import { button } from '../../kit-lib/buttons.mjs';

const truthy = (v) => v === 1 || v === true || v === '1';

/** Permission lookup: ctx.perms (object of booleans) wins; default is allowed. */
export function perm(spec, key) {
  const p = spec?.ctx?.perms;
  return !p || p[key] === undefined ? true : !!p[key];
}

/** Form "..." items in toolbar order (make_menu_items). Returns [{label, shortcut?, divider?}]. */
export function buildFormMenuItems(spec = {}, meta = {}, doc = {}) {
  const ctx = spec.ctx || {};
  const ds = Number(doc.docstatus || 0);
  const local = !!doc.__islocal;
  const single = truthy(meta.issingle);
  const submittable = truthy(meta.is_submittable);
  const workflow = !!meta.workflow;
  const dev = !!ctx.developer_mode;
  const isCore = truthy(meta.core);
  const items = [];
  const add = (label, shortcut) => items.push(shortcut ? { label, shortcut } : { label });
  if (local || truthy(meta.hide_toolbar)) return items;

  if (perm(spec, 'print') && !truthy(meta.hide_print)) add('Print');
  if (submittable && ds === 0 && !workflow) add('Discard');
  if (ctx.chrome?.form_sidebar !== false) add('Toggle Sidebar');
  if (perm(spec, 'email') && ds < 2) add('Email', 'Ctrl+E');
  if (perm(spec, 'write') && truthy(meta.allow_rename)) add('Rename');
  add('Reload');
  if (ds !== 1 && !single && perm(spec, 'delete')) add('Delete', 'Shift+Ctrl+D');
  if (perm(spec, 'create') && !truthy(meta.allow_copy)) add('Duplicate', 'Shift+D');
  if (perm(spec, 'create') && !single && !truthy(meta.in_create)) add(`New ${meta.name || meta.doctype || 'Document'}`, 'Ctrl+B');
  if (ctx.web_form_request && perm(spec, 'write')) add('Request via Web Form');
  items.push({ divider: true });
  if (doc.amended_from && truthy(meta.track_changes)) add('View Audit Trail');
  add('Jump to field', 'Ctrl+J');
  if (!single) add('Show Links');
  add('Copy to Clipboard');
  add('Remind Me', 'Shift+R');
  if (truthy(meta.track_changes) && ctx.document_follow_notify) add(ctx.following ? 'Unfollow' : 'Follow');
  add('Undo', 'Ctrl+Z');
  add('Redo', 'Ctrl+Y');
  if (truthy(meta.allow_auto_repeat) && !doc.auto_repeat) add('Repeat');
  items.push({ divider: true });
  if (perm(spec, 'customize') && !isCore && !single) { add(`Settings - ${meta.name || meta.doctype || ''}`.replace(/ - $/, '')); add('Customize'); }
  if (dev && perm(spec, 'create_doctype')) add('Edit DocType');
  if (meta.documentation) add('Documentation');
  // collapse leading/trailing/duplicate dividers
  return items.filter((it, i, a) => !it.divider || (i > 0 && i < a.length - 1 && !a[i - 1].divider));
}

/** "..." button + dropdown markup; empty string when the menu is hidden. */
export function renderFormMenu(spec, meta, doc) {
  const items = buildFormMenuItems(spec, meta, doc);
  return items.length ? menuDropdown(items) : '';
}

/** Custom button groups and standalone buttons from spec.overlays (type "button"). */
export function renderCustomButtons(spec = {}) {
  const btns = (spec.overlays || []).filter((o) => o.type === 'button');
  const groups = new Map(); const out = [];
  for (const b of btns) {
    if (b.group) {
      if (!groups.has(b.group)) { const g = { label: b.group, items: [] }; groups.set(b.group, g); out.push({ g }); }
      groups.get(b.group).items.push({ label: b.label });
    } else out.push({ b });
  }
  return out;
}
export { button };
