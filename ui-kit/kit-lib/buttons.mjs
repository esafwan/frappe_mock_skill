import { esc, enc, attrs } from './util.mjs';
import { icon } from './icons.mjs';

/** Espresso es-button. opts: {variant:'solid|ghost|subtle', primary, icon, iconOnly, caret, ui, cls, hidden, title} */
export function button(label, o = {}) {
  const cls = ['es-button', o.primary ? 'primary-action' : '', o.caret ? 'ellipsis' : '', o.iconOnly ? 'icon-btn' : '', o.cls].filter(Boolean).join(' ');
  const a = attrs({ class: cls, type: 'button', 'data-variant': o.variant || (o.primary ? 'solid' : undefined), 'data-icon-button': o.iconOnly ? 'true' : undefined,
    'data-label': o.primary ? label : undefined, title: o.title, 'aria-label': o.iconOnly ? (o.title || label) : undefined,
    'aria-haspopup': o.caret ? 'menu' : undefined, 'aria-expanded': o.caret ? 'false' : undefined, 'data-ui': o.ui });
  const lab = o.iconOnly ? '' : `<span class="es-button__label">${esc(label)}</span>`;
  return `<button${a}><span class="es-spinner" aria-hidden="true"></span>${o.icon ? icon(o.icon) : ''}${lab}${o.caret ? icon('chevrons-up-down') : ''}</button>`;
}

/** Custom button group (Actions/Create/View): label + dropdown of items [{label, ui}]. */
export function buttonGroup(label, items = []) {
  const links = items.map((it) => `<a class="dropdown-item" href="#" data-label="${enc(it.label)}">${esc(it.label)}</a>`).join('');
  return `<div class="inner-group-button" data-label="${esc(label)}">${button(label, { caret: true })}<div role="presentation" class="dropdown-menu ">${links}</div></div>`;
}
