// Shared desk shell: navbar, dock rail, sidebar, page-head slot, main slot, right panel slot.
// Generic: no doctype/app/brand names here. Markup reference: pages/desk-form.html, components/{navbar,dock}.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../kit-lib/util.mjs';
import { renderDock, loadSymbols, railIcon } from './dock.mjs';
import { activeFor } from '../renderers/workspace/layout.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
const slug = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let HEAD_CSS = null;

// Page-level <style> blocks of the captured reference page (CSS only, no markup).
function headStyles() {
  if (HEAD_CSS != null) return HEAD_CSS;
  const p = path.join(KIT, 'pages/desk-form.html');
  const h = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  HEAD_CSS = (h.slice(0, h.indexOf('<body')).match(/<style[\s\S]*?<\/style>/g) || []).join('\n');
  return HEAD_CSS;
}

const initial = (u) => esc((u?.full_name || u?.name || u?.email || '?').trim().charAt(0).toUpperCase());
const avatar = (u) => `<span class="avatar avatar-medium" title="${esc(u?.full_name || u?.name || '')}"><div class="avatar-frame standard-image" style="background-color: var(--dark-green-avatar-bg); color: var(--dark-green-avatar-color)">${initial(u)}</div></span>`;

export function renderNavbar({ ctx = {} } = {}) {
  const nc = ctx.notifications?.count;
  const logo = ctx.navbar?.logo || ctx.dock?.logo;
  return `<header class="desktop-navbar navbar-expand navbar-container" role="navigation" data-ui="navbar">
<div class="navbar-home" data-ui="navbar.logo">${logo ? `<img id="brand-logo" src="${esc(logo)}" alt="${esc(ctx.navbar?.title || '')}">` : ''}</div>
<div class="search-widget-wrapper input-group search-bar"><button id="search-widget-button" class="btn-reset search-widget-button" title="Search" data-ui="navbar.search"><span class="search-widget-icon"><svg class="icon icon-sm"><use href="#icon-search"></use></svg></span><span class="search-widget-shortcut">${esc(ctx.navbar?.search_shortcut ?? '')}</span></button></div>
<div class="flex" style="gap:16px; align-items: center;"><div class="desktop-notifications"><button class="btn-reset nav-link text-muted desktop-notification-icon" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false" data-ui="navbar.button-2"><svg class="icon icon-md" aria-hidden="true"><use href="#icon-bell"></use></svg>${nc ? `<span class="notification-count" aria-live="polite" aria-label="${esc(nc)} unread notifications">${esc(nc)}</span>` : ''}</button></div><div class="desktop-avatar" aria-haspopup="menu" aria-expanded="false">${avatar(ctx.user)}</div></div>
</header>`;
}

// Minimal sidebar when the caller passes no sidebarHtml (the data-driven sidebar is shell/sidebar.mjs).
function defaultSidebar(ctx, collapsed) {
  const t = esc(ctx.workspace || ctx.app || '');
  return `<div class="body-sidebar-container${collapsed ? '' : ' expanded'}" data-ui="sidebar"><div class="body-sidebar" data-title="${t}"><a class="sidebar-header shell-header" style="text-decoration: none;" aria-haspopup="menu" aria-expanded="false" data-ui="sidebar.link-1"><div class="title-container"><div class="sidebar-item-label header-title">${t}</div></div></a><div class="body-sidebar-top"><div class="sidebar-items"></div></div></div></div>`;
}

function spriteFor(html) {
  const s = loadSymbols(); const ids = new Set();
  for (const m of html.matchAll(/href="#(icon-[A-Za-z0-9_-]+)"/g)) ids.add(m[1]);
  const out = [...ids].sort().map((id) => s.get(id)).filter(Boolean);
  return `<svg class="icon-sprite" id="frappe-symbols" aria-hidden="true" style="display:none" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
}

// renderShell({ctx, head, main, right, sidebarHtml}) -> complete HTML document string.
//   ctx: theme, locale, rtl, viewport, app, workspace, user, chrome{dock,sidebar,navbar}, dock{items,title,logo,utilities}, title, route, page
//   head: page-head HTML slot; main: main-slot HTML; right: optional right-panel HTML; sidebarHtml: full sidebar container markup.
export function renderShell({ ctx = {}, head = '', main = '', right = '', sidebarHtml = '' } = {}) {
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const theme = ctx.theme === 'dark' ? 'dark' : 'light';
  const mobile = /^mobile$/i.test(ctx.viewport || '') || (parseInt(String(ctx.viewport || '').split('x')[0], 10) || 1440) < 768;
  const rel = ctx.tokensPath ?? '../tokens';
  const showDock = chrome.dock !== false && !mobile;
  const sbMode = chrome.sidebar === false ? 'hidden' : chrome.sidebar;
  const bodyCls = ['desktop-page', showDock && 'dock-active dock-pinned dock-open', sbMode === 'collapsed' && 'sidebar-collapsed', sbMode === 'hidden' && 'no-sidebar', mobile && 'mobile-view', ctx.rtl && 'rtl']
    .filter(Boolean).join(' ');
  const pageId = `page-${slug(ctx.pageName || ctx.page || 'page')}`;
  const sidebar = sbMode === 'hidden' ? '' : (sidebarHtml || defaultSidebar(ctx, sbMode === 'collapsed'));
  const body = `<div id="ui-kit-stage" class="ui-kit-page">
@@SPRITE@@
${showDock ? renderDock({ dock: ctx.dock || {}, app: ctx.app, user: ctx.user }) : ''}
${sidebar}
<div class="main-section">${chrome.navbar ? renderNavbar({ ctx }) : ''}<div id="body"><div id="${esc(pageId)}" class="content page-container" data-ui="page">
<div data-ui="shell.head">${head}</div>
<div class="container page-body"><div class="page-wrapper"><div class="page-content"><div class="layout-main${right ? ' layout-two-column' : ''}"><div class="layout-main-section-wrapper"><div class="layout-main-section" data-ui="shell.main">${main}</div></div>${right ? `<div class="layout-side-section right" data-ui="shell.right">${right}</div>` : ''}</div></div></div></div>
</div></div></div>
</div>`;
  const full = body.replace('@@SPRITE@@', spriteFor(body));
  return `<!doctype html>
<html data-theme-mode="${theme}" lang="${esc(ctx.locale || 'en')}" dir="${ctx.rtl ? 'rtl' : 'ltr'}" class="chrome" data-theme="${theme}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(ctx.title || 'Desk')}</title>
<link rel="stylesheet" href="${esc(rel)}/css/frappe-desk.css">
<link rel="stylesheet" href="${esc(rel)}/css/erpnext-erpnext.css">
${headStyles()}
<style data-ui="shell.extra">.form-sidebar .es-button,.menu-btn-group .es-button,.form-sidebar-items button{gap:6px}.form-sidebar-label{gap:8px}.page-head .title-area{display:flex;align-items:center;gap:8px}.page-head .title-sub{font-size:var(--text-sm,12px)}.page-head .es-breadcrumbs__item{display:inline-flex;align-items:center;gap:6px}[data-ui="shell.head"]:empty{min-height:48px;border-bottom:1px solid var(--outline-gray-1,#ededed)}[data-ui="shell.main"]:empty{min-height:calc(100vh - 96px)}</style></head>
<body data-ajax-state="complete" class="${bodyCls}"${ctx.route ? ` data-route="${esc(ctx.route)}"` : ''} data-sidebar="${sbMode === 'hidden' ? 0 : 1}">
${full}
</body></html>
`;
}

export { renderDock, railIcon };

// Engine entry: default export (slots, spec, ctx) => html. Used for pages that return slots (workspace, blank, ...).
// Sidebar and dock helpers are loaded lazily from the form renderer to avoid a static import cycle.
export default async function shellForSlots(slots, spec, ctx) {
  const { sidebarContainer, loadWorkspaceSidebar, dockFromWorkspaces } = await import('../renderers/form/index.mjs');
  const workspace = ctx.workspace || spec.ctx?.workspace || '';
  const sidebarMeta = spec.meta?.sidebar && typeof spec.meta.sidebar === 'object' ? spec.meta.sidebar : null;
  const sj = sidebarMeta || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const sidebarHtml = !sj || chrome.sidebar === 'hidden' ? ''
    : sidebarContainer(sj, { active: spec.page === 'workspace' && spec.meta?.workspace ? activeFor(spec) : { workspace }, collapsed: chrome.sidebar === 'collapsed', title: workspace });
  const sctx = spec.ctx || {};
  const vp = ctx.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx.viewport || '1440x900');
  return renderShell({
    ctx: {
      theme: ctx.theme, locale: ctx.locale, rtl: ctx.rtl, viewport: vp, app: ctx.app || workspace, workspace, user: ctx.user, chrome,
      dock: { ...(sctx.dock || {}), items: sctx.dock?.items || dockFromWorkspaces() },
      title: slots.title || spec.title || workspace, route: spec.page, pageName: spec.page, page: spec.page,
      tokensPath: ctx.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
    },
    head: slots.head || '', main: slots.main || '', right: slots.aside || '', sidebarHtml,
  });
}
