import { esc, icon, findIn, routeFor } from './common.mjs';
export default function quickList(data, ctx, spec) {
  const name = data.quick_list_name;
  const meta = findIn(spec.meta.workspace.quick_lists, ['name', 'label', 'quick_list_name'], name) || { label: name };
  const dt = meta.document_type || meta.link_to;
  const label = meta.label || name;
  const rows = spec.data?.quick_lists?.[name] ?? spec.data?.quick_lists?.[label] ?? [];
  const items = rows.map((r) => `<div class="quick-list-item" data-ui="quick-list.row"><span class="ellipsis title">${esc(r.title ?? r.name)}</span>${r.status ? `<span class="indicator-pill ${esc(r.color || 'grey')}">${esc(r.status)}</span>` : ''}<span class="text-muted modified">${esc(r.modified || '')}</span></div>`).join('');
  const body = rows.length ? items : `<div class="quick-list-empty text-muted" data-ui="quick-list.empty">No data to show</div>`;
  const add = dt ? `<a class="btn btn-xs btn-secondary" data-ui="quick-list.add" href="${esc(routeFor('DocType', dt) + '/new')}">${icon('plus', 'xs')} Add New</a>` : '';
  return `<div class="widget quick-list-widget-box" data-ui="card:${esc(label)}" data-widget-name="${esc(label)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis">${esc(label)}</span></div></div><div class="widget-control">${add}</div></div><div class="widget-body">${body}</div></div>`;
}
