// Notifications dropdown: tabs, header actions, rows, empty state. Generic chrome only.
// overlay.items are the rows. Row: {label, icon?, group?, checked?}. `group` names the tab a row belongs to (default: first tab);
// `checked` marks an unread row. Without items the panel shows the empty state. highlight is a 0-based row index.
import { esc } from '../kit-lib/util.mjs';
import { icon } from '../kit-lib/icons.mjs';

const TABS = ['Notifications', 'Events', 'Mentions'];

export function renderNotifications(overlay = {}, items = [], entry = {}, ui = 'menu:navbar.notifications') {
  const tabs = entry.tabs?.length ? entry.tabs : TABS;
  const rows = overlay.items ? items.filter((i) => !i.divider) : [];
  const active = tabs.find((t) => rows.some((r) => r.group === t) && !rows.some((r) => !r.group)) || tabs[0];
  const shown = rows.filter((r) => (r.group || tabs[0]) === active);
  const list = shown.length
    ? `<ul class="notification-list-body">${shown.map((r, i) => `<li class="notification-item${r.checked ? ' unread' : ''}${overlay.highlight === i ? ' highlighted' : ''}" data-label="${esc(r.label)}"${overlay.highlight === i ? ' data-state="focus"' : ''}>${r.checked ? '<span class="notification-dot" aria-label="Unread"></span>' : '<span class="notification-dot read"></span>'}${r.icon ? icon(r.icon) : ''}<span class="notification-text">${esc(r.label)}</span></li>`).join('')}</ul>`
    : `<div class="notification-null-state"><span class="text-muted">No new ${esc(active.toLowerCase())}</span></div>`;
  return `<div class="notifications-list menu-popover show" data-ui="${esc(ui)}" data-menu-kind="panel"><style>.notifications-list{min-width:340px}.notifications-list .panel-header{display:flex;align-items:center;gap:12px;padding:8px 10px;border-bottom:1px solid var(--outline-gray-1,#ededed)}.notifications-list .notifications-category{color:var(--ink-gray-5,#7c7c7c);cursor:pointer}.notifications-list .notifications-category.active{color:var(--ink-gray-9,#171717);font-weight:600}.notifications-list .panel-actions{margin-left:auto;display:flex;gap:8px;color:var(--ink-gray-5,#7c7c7c)}.notification-list-body{list-style:none;margin:0;padding:4px 0;max-height:360px;overflow:hidden}.notification-item{display:flex;justify-content:flex-start;align-items:center;gap:8px;padding:8px 10px;border-radius:6px}.notification-item.highlighted{background:var(--surface-gray-2,#f3f3f3)}.notification-item .icon{flex:none;width:14px;height:14px}.notification-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--ink-blue-3,#318ad8)}.notification-dot.read{background:transparent}.notification-null-state{display:flex;align-items:center;justify-content:center;padding:24px 10px}</style><div class="panel-header">${tabs.map((t) => `<span class="notifications-category${t === active ? ' active' : ''}" data-tab="${esc(t)}">${esc(t)}</span>`).join('')}<span class="panel-actions"><span data-label="Mark all as read" title="Mark all as read">${icon('check-check')}</span><span data-label="Settings" title="Settings">${icon('settings')}</span></span></div>${list}</div>`;
}
