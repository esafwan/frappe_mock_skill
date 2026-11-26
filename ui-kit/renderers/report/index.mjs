// Report View page renderer (page: 'report'). Engine contract: default export render(spec, ctx) -> { document, head, main, title, sidebarHtml }.
import { applyCustomizations } from '../../doctype/lib/customize.mjs';
import { renderShell } from '../../shell/shell.mjs';
import { sidebarContainer, loadWorkspaceSidebar, dockFromWorkspaces } from '../form/index.mjs';
import { renderReportDialogs } from './dialogs.mjs';
import { buildReportPage, reportInfo, reportColumns, groupRows, buildReportMenu } from './view.mjs';

export default async function render(spec, ctx) {
  let meta = spec.meta?.doctype;
  if (!meta || typeof meta !== 'object') { ctx?.warn?.('report: meta.doctype did not resolve to a DocType'); return { main: '' }; }
  const custom = spec.meta?.custom;
  if (custom) {
    const cf = Array.isArray(custom) ? custom.flatMap((c) => c.custom_fields || (Array.isArray(c) ? c : [])) : (custom.custom_fields || []);
    const ps = Array.isArray(custom) ? custom.flatMap((c) => c.property_setters || []) : (custom.property_setters || []);
    if (cf.length || ps.length) meta = applyCustomizations(meta, cf, ps);
  }
  const page = await buildReportPage({ spec, meta, ctx });
  const rd = renderReportDialogs({ spec, meta, ctx, columns: page.columns });
  ctx.preDialogs = [...(ctx.preDialogs || []), ...rd.dialogs];
  const workspace = ctx.workspace || spec.ctx?.workspace || meta.module || '';
  const sidebarMeta = typeof spec.meta?.sidebar === 'object' ? spec.meta.sidebar : null;
  const sj = sidebarMeta || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const sidebarHtml = !sj || chrome.sidebar === 'hidden' ? ''
    : sidebarContainer(sj, { active: { doctype: page.doctype }, collapsed: chrome.sidebar === 'collapsed', title: workspace, ctx });
  const sctx = spec.ctx || {};
  const vp = ctx.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx.viewport || '1440x900');
  const document = renderShell({ ctx: {
    theme: ctx.theme, locale: ctx.locale, rtl: ctx.rtl, viewport: vp, app: ctx.app || workspace, workspace, user: ctx.user, chrome,
    dock: { ...(sctx.dock || {}), items: sctx.dock?.items || dockFromWorkspaces() },
    title: page.title, route: `report/${page.doctype}`, pageName: page.doctype, page: 'report',
    tokensPath: ctx.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
  }, head: page.head, main: page.main, right: '', sidebarHtml });
  return { document, head: page.head, main: page.main, title: page.title, sidebarHtml };
}
export { reportInfo, reportColumns, groupRows, buildReportMenu };
