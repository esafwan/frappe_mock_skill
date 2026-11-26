import { esc, icon } from './blocks/common.mjs';
import { menuDropdown } from '../../kit-lib/menus.mjs';
export function workspaceBadge(ws) {
  if (ws.for_user || ws.public === 0 || ws.public === false) return { text: 'Private', color: 'orange' };
  if (ws.roles?.length) return { text: ws.roles.map((r) => r.role || r).join(', '), color: 'blue' };
  return { text: 'Public', color: 'green' };
}
export function renderHead(spec, ctx, { empty = false } = {}) {
  const ws = spec.meta.workspace;
  const title = ws.title || ws.label || ws.name;
  const badge = workspaceBadge(ws);
  const open = ctx.overlays.some((o) => o.type === 'menu_open' && o.target === 'workspace.menu');
  const items = ['Edit', 'Duplicate', 'Hide', 'Customize', 'Reload'];
  const menu = `<div class="menu-btn-group" data-ui="workspace.menu"><button class="btn btn-default icon-btn" data-ui="page.menu-button" aria-label="Menu">${icon('ellipsis', 'sm')}</button>${open ? menuDropdown(items.map((l) => ({ label: l })), {}) : ''}</div>`;
  const crumbs = `<nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol><li><span class="es-breadcrumbs__item" aria-current="page">${ws.icon ? `<span class="title-icon" data-ui="workspace.icon">${icon(ws.icon, 'md')}</span>` : ''}<span class="es-breadcrumbs__label">${esc(title)}</span></span></li></ol></nav>`;
  const pill = `<span class="indicator-pill ${badge.color} no-indicator-dot" data-ui="workspace.badge" data-visibility="${esc(badge.text.toLowerCase())}">${esc(badge.text)}</span>`;
  return `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between">`
    + `<div class="page-title"><div class="flex title-area ellipsis">${crumbs}${pill}</div></div>`
    + `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex">${menu}</div></div></div>`
    + `</div></div></div>`;
}
export const emptyState = `<div class="workspace-empty text-muted" data-ui="workspace.empty"><p>This workspace has no content yet.</p></div>`;
