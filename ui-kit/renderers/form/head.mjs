import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { button, buttonGroup } from '../../kit-lib/buttons.mjs';
import { get_indicator, indicatorPill } from '../../kit-lib/indicators.mjs';
import { perm, renderFormMenu, renderCustomButtons } from './menu.mjs';

const t = (v) => v === 1 || v === true || v === '1';

/** Port of toolbar.get_action_status. Returns {primary, secondary} each {label, icon?, disabled?, title?} or null. */
export function formActions(spec = {}, meta = {}, doc = {}) {
  const ds = Number(doc.docstatus || 0);
  const submittable = t(meta.is_submittable), wf = !!meta.workflow, local = !!doc.__islocal, dirty = !!doc.__unsaved;
  const ro = t(spec.ctx?.read_only);
  const saveDisabled = t(meta.save_disabled) || t(spec.ctx?.save_disabled);
  const canSubmit = submittable && ds === 0 && !local && !dirty && perm(spec, 'submit') && !wf;
  const canSave = ds === 0 && !saveDisabled && perm(spec, 'write') && (!wf || dirty);
  const canUpdate = submittable && ds === 1 && !local && dirty && perm(spec, 'submit');
  const canCancel = submittable && ds === 1 && perm(spec, 'cancel') && !ro && (!wf || spec.ctx?.can_cancel_document !== false);
  const canAmend = submittable && ds === 2 && perm(spec, 'amend') && !ro;
  const r = { primary: null, secondary: null };
  if (canSubmit) r.primary = { label: 'Submit' };
  else if (canSave) r.primary = { label: 'Save' };
  else if (canUpdate) r.primary = { label: 'Update', icon: 'pencil' };
  if (canCancel) r.secondary = { label: 'Cancel' };
  if (canAmend) {
    if (doc.amended_to) r.secondary = { label: 'Amend', disabled: true, title: `Already amended as ${doc.amended_to}` };
    else r.primary = { label: 'Amend' };
  }
  return r;
}

export function formTitle(meta = {}, doc = {}) {
  const dt = meta.name || meta.doctype || 'Document';
  if (doc.__islocal || !doc.name) return { title: `New ${dt}`, sub: '' };
  const tf = meta.title_field && doc[meta.title_field];
  const title = tf || doc.name;
  return { title, sub: tf && tf !== doc.name ? doc.name : '' };
}

/** Form page head + optional intro. spec overlays: button, intro. */
export function renderFormHead(spec = {}, meta = {}, doc = {}) {
  const { title, sub } = formTitle(meta, doc);
  const dt = meta.name || meta.doctype || 'Document';
  const ind = doc.__islocal && !doc.__unsaved ? { label: 'Not Saved', colour: 'orange' } : get_indicator(doc, meta);
  const pill = ind ? indicatorPill(ind, { page: true }) : '<span class="es-badge page-indicator-pill hide" data-testid="page-status"></span>';
  const crumbs = `<nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol>`
    + `<li><span class="es-breadcrumbs__item"><span class="es-breadcrumbs__label">${esc(dt)}</span></span></li>`
    + `<li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${esc(title)}</span></span></li></ol></nav>`;
  const acts = formActions(spec, meta, doc);
  const custom = renderCustomButtons(spec).map((c) => (c.g ? buttonGroup(c.g.label, c.g.items) : ''));
  const rightCustom = renderCustomButtons(spec).filter((c) => c.b).map(({ b }) => button(b.label, { primary: b.style === 'primary', ui: `form.custom.${b.label}` }));
  const secondary = acts.secondary ? button(acts.secondary.label, { title: acts.secondary.title, cls: acts.secondary.disabled ? 'disabled' : '', ui: 'form.secondary-action' }) : '';
  const primary = acts.primary ? button(acts.primary.label, { primary: true, icon: acts.primary.icon, ui: 'form.primary-action' }) : '';
  const nav = (spec.ctx?.form_navigation_buttons && !doc.__islocal && !t(meta.issingle))
    ? `<span class="page-icon-group">${button('Previous Document', { iconOnly: true, icon: 'chevron-left', title: 'Previous Document' })}${button('Next Document', { iconOnly: true, icon: 'chevron-right', title: 'Next Document' })}</span>` : '';
  const intro = (spec.overlays || []).filter((o) => o.type === 'intro')
    .map((o) => `<div class="form-message ${esc(o.color || 'blue')}" data-ui="form.intro"><div>${esc(o.text)}</div></div>`).join('');
  return `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between">`
    + `<div class="page-title"><button class="btn-reset sidebar-toggle-btn navbar-brand" type="button">${icon('panel-left-close', 'md')}</button>`
    + `<div class="flex title-area ellipsis">${crumbs}${sub ? `<span class="title-sub text-muted">${esc(sub)}</span>` : ''}${pill}</div></div>`
    + `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end">`
    + `<div class="custom-actions hidden-xs hidden-md">${custom.join('')}</div>`
    + `<div class="standard-actions flex">${nav}${renderFormMenu(spec, meta, doc)}${secondary}${rightCustom.join('')}${primary}</div>`
    + `</div></div></div></div></div>${intro}`;
}
