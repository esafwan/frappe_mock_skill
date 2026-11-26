// Draws any menu_open target from the registry in its open state. Generic: chrome labels only.
import { esc } from '../kit-lib/util.mjs';
import { icon } from '../kit-lib/icons.mjs';
import { resolveTarget, defaultItems } from '../kit-lib/menu-registry.mjs';

const norm = (items = []) => items.map((i) => (i === '---' || i?.divider ? { divider: true } : typeof i === 'string' ? { label: i } : i));

function lis(items, highlight) {
  let n = -1;
  return items.map((it) => {
    if (it.divider) return '<li class="dropdown-divider"></li>';
    n += 1;
    const cls = ['grey-link', 'dropdown-item', it.danger && 'text-danger', it.disabled && 'disabled', highlight === n && 'highlighted', it.checked && 'selected'].filter(Boolean).join(' ');
    return `<li><a class="${cls}" href="#" data-label="${esc(it.label)}"${highlight === n ? ' data-state="focus"' : ''}>${it.icon ? icon(it.icon) : ''}<span class="menu-item-label">${esc(it.label)}</span>${it.checked ? icon('check') : ''}${it.shortcut ? `<kbd class="pull-right">${esc(it.shortcut)}</kbd>` : ''}</a></li>`;
  }).join('');
}

/** overlay: a menu_open overlay {target, items?, extra_items?, query?, highlight?}. Returns HTML or '' when the target is unknown. */
export function renderMenu(overlay = {}) {
  const r = resolveTarget(overlay.target);
  if (!r) return '';
  const { entry } = r;
  const ui = `menu:${overlay.target}`;
  if (entry.kind === 'ui') return '';
  let items = overlay.items ? norm(overlay.items) : norm(defaultItems(overlay.target, overlay));
  if (overlay.extra_items) items = [...items, ...norm(overlay.extra_items)];
  const base = `data-ui="${esc(ui)}" data-menu-kind="${entry.kind}"`;
  switch (entry.kind) {
    case 'search':
      return `<div class="awesomplete menu-popover" ${base}><div class="menu-search" style="display:flex;align-items:center;gap:8px;padding:6px 10px">${icon('search')}<input type="text" class="form-control" style="flex:1;border:0;background:transparent;box-shadow:none" value="${esc(overlay.query || '')}" aria-label="Search"></div><ul class="dropdown-menu show" role="listbox">${lis(items, overlay.highlight)}</ul></div>`;
    case 'panel':
      return `<div class="notifications-list menu-popover show" ${base}><div class="panel-header">${(entry.tabs || []).map((t, i) => `<span class="notifications-category${i ? '' : ' active'}">${esc(t)}</span>`).join('')}</div><ul class="dropdown-menu show">${lis(items, overlay.highlight)}</ul><div class="notification-null-state"><span class="text-muted">No new notifications</span></div></div>`;
    case 'switcher':
      return `<div class="sidebar-header-menu menu-popover show" ${base}><ul class="dropdown-menu show" role="presentation">${lis(items, overlay.highlight)}</ul></div>`;
    case 'picker':
      return `<div class="block-picker menu-popover show" ${base}>${items.filter((i) => !i.divider).map((i) => `<button type="button" class="block-picker-item" data-label="${esc(i.label)}">${esc(i.label)}</button>`).join('')}</div>`;
    default:
      return `<ul class="dropdown-menu dropdown-menu-right show" role="presentation" ${base}>${lis(items, overlay.highlight)}</ul>`;
  }
}
