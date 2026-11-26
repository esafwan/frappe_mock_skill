// Shortcut widget. Variants: type (DocType/Report/Page/Dashboard/URL/Workspace), doc_view, count badge, colour.
import { esc, icon, colourOf, findIn, routeFor } from './common.mjs';

export function formatCount(fmt, n) {
  const s = new Intl.NumberFormat('en-US', n >= 1e5 ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(n);
  return fmt ? String(fmt).replace('{}', s) : s;
}
export default function shortcut(data, ctx, spec) {
  const ws = spec.meta.workspace;
  const name = data.shortcut_name;
  const sc = findIn(ws.shortcuts, ['label', 'name'], name);
  if (!sc) { ctx.warn(`workspace: shortcut "${name}" not found in meta.workspace.shortcuts`); }
  const s = sc || { label: name, type: 'DocType', link_to: name };
  const counts = spec.data?.counts || {};
  const n = counts[s.label] ?? counts[s.link_to];
  const showCount = n !== undefined && (s.type === 'DocType' || s.type === 'Report' || !s.type);
  const colour = colourOf(s.color);
  const badge = showCount ? `<div class="indicator-pill ellipsis ${s.color ? 'shortcut-count' : 'grey'}" data-ui="shortcut.count" data-count="${n}"${colour ? ` style="color:${colour}"` : ''}>${esc(formatCount(s.format, n))}</div>` : '';
  const href = routeFor(s.type, s.link_to || s.url, s.doc_view);
  const view = s.doc_view ? ` data-doc-view="${esc(s.doc_view)}"` : '';
  return `<a class="widget shortcut-widget-box" href="${esc(href)}" data-ui="card:${esc(s.label)}" data-widget-name="${esc(s.label)}" data-shortcut-type="${esc(s.type || 'DocType')}"${view}><div class="widget-head"><div class="widget-title ellipsis">${s.icon ? icon(s.icon, 'sm') + ' ' : ''}<span class="ellipsis" title="${esc(s.label)}">${esc(s.label)}</span></div><div class="widget-control">${badge}${icon('move-up-right', 'xs')}</div></div></a>`;
}
