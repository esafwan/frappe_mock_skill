// Shortcut widget. Variants: type (DocType/Report/Page/Dashboard/URL/Workspace), doc_view, count badge, colour.
import { esc, icon, colourOf, findIn, routeFor } from './common.mjs';

export function formatCount(fmt, n) {
  const s = new Intl.NumberFormat('en-US', n >= 1e5 ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(n);
  return fmt ? String(fmt).replace('{}', s) : s;
}
const VIEWS = { list: ['', 'list'], 'report builder': ['report', 'file-text'], report: ['report', 'file-text'], dashboard: ['dashboard', 'layout-dashboard'], tree: ['tree', 'git-fork'], new: ['new', 'plus'], calendar: ['calendar', 'calendar'], kanban: ['kanban', 'columns-3'], image: ['image', 'image'], gantt: ['gantt', 'chart-gantt'], map: ['map', 'map'], inbox: ['inbox', 'inbox'] };
export function viewRoute(type, to, view, kanban) {
  if (!/^(doctype)?$/i.test(type || '')) return routeFor(type, to, view);
  const slug = String(to ?? '').toLowerCase().replace(/\s+/g, '-');
  const v = VIEWS[String(view || 'list').toLowerCase()] || ['', 'list'];
  if (v[0] === 'new') return `/desk/${slug}/new`;
  if (!v[0]) return `/desk/${slug}`;
  return `/desk/${slug}/view/${v[0]}${v[0] === 'kanban' && kanban ? '/' + encodeURIComponent(kanban) : ''}`;
}
export default function shortcut(data, ctx, spec) {
  const ws = spec.meta.workspace;
  const name = data.shortcut_name;
  const sc = findIn(ws.shortcuts, ['label', 'name'], name);
  if (!sc) { ctx.warn(`workspace: shortcut "${name}" not found in meta.workspace.shortcuts`); }
  const s = sc || { label: name, type: 'DocType', link_to: name };
  const counts = spec.data?.counts || {};
  const n = counts[s.label] ?? counts[s.link_to];
  const showCount = n !== undefined && Number.isFinite(Number(n)) && (s.type === 'DocType' || s.type === 'Report' || !s.type);
  const colour = colourOf(s.color);
  const vi = (VIEWS[String(s.doc_view || '').toLowerCase()] || [])[1];
  const badge = showCount ? `<div class="indicator-pill ellipsis ${s.color ? 'shortcut-count' : 'grey'}" data-ui="shortcut.count" data-count="${n}"${colour ? ` style="color:${colour}"` : ''}>${esc(formatCount(s.format, n))}</div>` : '';
  const href = /^url$/i.test(s.type || '') ? (s.url || s.link_to) : viewRoute(s.type, s.link_to, s.doc_view, s.kanban_board);
  const view = s.doc_view && !/^(doctype)?$/i.test(s.type || '') === false ? ` data-doc-view="${esc(s.doc_view)}"` : '';
  return `<a class="widget shortcut-widget-box" href="${esc(href)}" data-ui="card:${esc(s.label)}" data-widget-name="${esc(s.label)}" data-shortcut-type="${esc(s.type || 'DocType')}"${view}><div class="widget-head"><div class="widget-title ellipsis">${s.icon ? icon(s.icon, 'sm') + ' ' : ''}${!s.icon && vi && vi !== 'list' && /^(doctype)?$/i.test(s.type || '') ? icon(vi, 'sm') + ' ' : ''}<span class="ellipsis" title="${esc(s.label)}">${esc(s.label)}</span></div><div class="widget-control">${badge}${icon('move-up-right', 'xs')}</div></div></a>`;
}
