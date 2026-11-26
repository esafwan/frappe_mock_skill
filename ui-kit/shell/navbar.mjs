// Desk navbar: logo, search button, notification bell, avatar. Generic chrome only, no brand names.
// Layout is self-contained (NAVBAR_CSS) so it does not depend on bootstrap navbar classes.
import { esc } from '../kit-lib/util.mjs';

export const NAVBAR_CSS = `.desktop-navbar{display:flex;align-items:center;gap:16px;box-sizing:border-box;width:100%;height:var(--navbar-height,48px);min-height:var(--navbar-height,48px);padding:0 16px;background:var(--navbar-bg,var(--surface-white,#fff));border-bottom:1px solid var(--outline-gray-1,#ededed);position:relative;z-index:1020}.desktop-navbar .navbar-home{display:flex;align-items:center;flex:none;min-width:0}.desktop-navbar .navbar-home:empty{display:none}.desktop-navbar #brand-logo{display:block;height:24px;width:auto;max-width:140px;object-fit:contain}.desktop-navbar .search-widget-wrapper{display:flex;flex:1 1 auto;justify-content:center;min-width:0}.desktop-navbar .search-widget-button{display:flex;align-items:center;gap:8px;width:100%;max-width:360px;height:28px;padding:0 10px;border:0;border-radius:6px;background:var(--surface-gray-2,#f3f3f3);color:var(--ink-gray-5,#7c7c7c);font-size:var(--text-base,14px);text-align:left;cursor:pointer}.desktop-navbar .search-widget-icon{display:inline-flex;flex:none}.desktop-navbar .search-widget-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.desktop-navbar .search-widget-shortcut{margin-left:auto;font-size:var(--text-sm,12px);color:var(--ink-gray-4,#999)}.desktop-navbar .navbar-end{display:flex;align-items:center;gap:16px;flex:none;margin-left:auto}.desktop-navbar .desktop-notifications{position:relative;display:flex;align-items:center}.desktop-navbar .desktop-notification-icon{position:relative;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;background:transparent;color:var(--ink-gray-6,#525252);border-radius:6px}.desktop-navbar .notification-count{position:absolute;top:-2px;right:-4px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--ink-red-3,#e03636);color:#fff;font-size:10px;line-height:16px;text-align:center}.desktop-navbar .desktop-avatar{display:flex;align-items:center;cursor:pointer}.desktop-navbar .desktop-avatar .avatar{margin:0}`;

const initial = (u) => esc((u?.full_name || u?.name || u?.email || '?').trim().charAt(0).toUpperCase());
const avatar = (u) => `<span class="avatar avatar-medium" title="${esc(u?.full_name || u?.name || '')}"><div class="avatar-frame standard-image" style="background-color: var(--dark-green-avatar-bg); color: var(--dark-green-avatar-color)">${initial(u)}</div></span>`;

/** renderNavbar({ctx}) -> markup string. ctx.navbar{logo,title,search_label,search_shortcut}, ctx.notifications.count, ctx.user. */
export function renderNavbar({ ctx = {} } = {}) {
  const nc = ctx.notifications?.count;
  const logo = ctx.navbar?.logo || ctx.dock?.logo;
  return `<style data-ui="navbar.css">${NAVBAR_CSS}</style><header class="desktop-navbar navbar-expand navbar-container" role="navigation" data-ui="navbar">
<div class="navbar-home" data-ui="navbar.logo">${logo ? `<img id="brand-logo" src="${esc(logo)}" alt="${esc(ctx.navbar?.title || '')}">` : ''}</div>
<div class="search-widget-wrapper input-group search-bar"><button id="search-widget-button" class="btn-reset search-widget-button" title="Search" data-ui="navbar.search"><span class="search-widget-icon"><svg class="icon icon-sm"><use href="#icon-search"></use></svg></span><span class="search-widget-label">${esc(ctx.navbar?.search_label ?? 'Search')}</span><span class="search-widget-shortcut">${esc(ctx.navbar?.search_shortcut ?? '')}</span></button></div>
<div class="navbar-end"><div class="desktop-notifications"><button class="btn-reset nav-link text-muted desktop-notification-icon" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false" data-ui="navbar.button-2"><svg class="icon icon-md" aria-hidden="true"><use href="#icon-bell"></use></svg>${nc ? `<span class="notification-count" aria-live="polite" aria-label="${esc(nc)} unread notifications">${esc(nc)}</span>` : ''}</button></div><div class="desktop-avatar" aria-haspopup="menu" aria-expanded="false" data-ui="navbar.user">${avatar(ctx.user)}</div></div>
</header>`;
}

/** Anchors for navbar.* popovers (consumed by kit-lib/draw.mjs ANCHORS). */
export const NAVBAR_ANCHORS = {
  'navbar.search': ['[data-ui="navbar.search"]'],
  'navbar.notifications': ['[data-ui="navbar.button-2"]'],
  notifications: ['[data-ui="navbar.button-2"]'],
  'navbar.help': ['[data-ui="navbar.help"]', '[data-ui="navbar.button-2"]'],
  'navbar.user': ['[data-ui="navbar.user"]', '.desktop-avatar'],
};
