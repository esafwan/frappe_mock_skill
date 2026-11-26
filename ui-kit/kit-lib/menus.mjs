import { esc } from './util.mjs';
import { button } from './buttons.mjs';
/** items: [{label, divider?, shortcut?}] ; the "..." menu-dropdown. */
export function menuDropdown(items = [], { toggle } = {}) {
  const lis = items.map((it) => it.divider ? '<li class="dropdown-divider"></li>'
    : `<li><a class="grey-link dropdown-item" href="#"><span class="menu-item-label" data-label="${esc(it.label)}">${esc(it.label)}</span>${it.shortcut ? `<kbd class="pull-right">${esc(it.shortcut)}</kbd>` : ''}</a></li>`).join('');
  return `<div class="menu-btn-group">${toggle || button('Menu', { iconOnly: true, icon: 'ellipsis', cls: 'menu-more-button', title: 'Menu' }).replace('type="button"', 'type="button" aria-haspopup="menu"')}<ul class="dropdown-menu dropdown-menu-right" role="presentation">${lis}</ul></div>`;
}
