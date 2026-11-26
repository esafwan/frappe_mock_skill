// Awesomebar popover: query box plus result groups. Generic chrome only.
// overlay: {target, query?, items?, extra_items?, highlight?}. Item: {label, icon?, shortcut?, group?, disabled?}.
// Items without `group` fall into "Results". Groups keep first-seen order. highlight is a 0-based index over result rows.
import { esc } from '../kit-lib/util.mjs';
import { icon } from '../kit-lib/icons.mjs';

const DEFAULT_GROUP = 'Results';

export function groupItems(items = []) {
  const order = []; const map = new Map();
  for (const it of items) {
    if (it.divider) continue;
    const g = it.group || DEFAULT_GROUP;
    if (!map.has(g)) { map.set(g, []); order.push(g); }
    map.get(g).push(it);
  }
  return order.map((g) => ({ name: g, items: map.get(g) }));
}

export function renderAwesomebar(overlay = {}, items = [], ui = 'menu:navbar.search') {
  const groups = groupItems(items);
  let n = -1;
  const body = groups.length
    ? groups.map((g) => `<div class="awesomebar-group" data-group="${esc(g.name)}"><div class="awesomebar-group-title text-muted">${esc(g.name)}</div><ul class="awesomebar-results" role="listbox">${g.items.map((it) => {
      n += 1;
      const cls = ['awesomebar-result', 'dropdown-item', it.disabled && 'disabled', overlay.highlight === n && 'highlighted'].filter(Boolean).join(' ');
      return `<li role="option"><a class="${cls}" href="#" data-label="${esc(it.label)}"${overlay.highlight === n ? ' data-state="focus" aria-selected="true"' : ''}>${it.icon ? icon(it.icon) : ''}<span class="menu-item-label">${esc(it.label)}</span>${it.shortcut ? `<kbd>${esc(it.shortcut)}</kbd>` : ''}</a></li>`;
    }).join('')}</ul></div>`).join('')
    : '<div class="awesomebar-empty text-muted">No results found</div>';
  return `<div class="awesomplete menu-popover awesomebar-popover" data-ui="${esc(ui)}" data-menu-kind="search"><style>.awesomebar-popover{min-width:360px}.awesomebar-popover .menu-search{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--outline-gray-1,#ededed)}.awesomebar-popover .menu-search input{flex:1;border:0;background:transparent;box-shadow:none;outline:0}.awesomebar-group{padding:4px 0}.awesomebar-group+.awesomebar-group{border-top:1px solid var(--outline-gray-1,#ededed)}.awesomebar-group-title{padding:4px 10px;font-size:var(--text-sm,12px);font-weight:500}.awesomebar-results{list-style:none;margin:0;padding:0}.awesomebar-result{display:flex;justify-content:flex-start;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;color:var(--ink-gray-8,#383838);text-decoration:none}.awesomebar-result.highlighted{background:var(--surface-gray-2,#f3f3f3)}.awesomebar-result .icon{flex:none;width:14px;height:14px}.awesomebar-empty{padding:12px 10px}</style><div class="menu-search">${icon('search')}<input type="text" class="form-control" value="${esc(overlay.query || '')}" aria-label="Search" readonly></div>${body}</div>`;
}
