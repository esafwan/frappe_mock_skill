// Shared page head + filter area for view pages (tree, image, inbox, map, calendar). Reuses list/head.mjs and kit-lib filter/sort pieces,
// so the view switcher, primary Add button, "..." menu, filter button and sort selector match the list page. Deterministic.
import { renderListHead } from '../renderers/list/head.mjs';
import { renderStandardFilters, renderFilterButton } from './filters.mjs';
import { renderSort, sortOptions, currentSort } from './sort.mjs';
import { enabledViews } from './viewswitch.mjs';

/** Normalise spec.meta.doctype (string | object) to a meta object with a name. */
export function metaOf(spec, fallbackName = '') {
  const d = spec.meta?.doctype;
  if (d && typeof d === 'object') return d.name || d.doctype ? d : { ...d, name: fallbackName };
  return { name: (typeof d === 'string' && d) || fallbackName, doctype: undefined };
}

/**
 * viewHead(spec, ctx, { view, label, trail, filters = true, sort = true }) -> html (page-head [+ filter bar])
 *   view:  view id the switcher shows as current ("image", "map", "inbox", "tree", "calendar")
 *   label: last breadcrumb (default doctype name); trail overrides the whole breadcrumb list.
 */
export function viewHead(spec, ctx, { view, label, trail, filters = true, sort = true, std = true, meta: metaIn } = {}) {
  const meta = metaIn || metaOf(spec, label || '');
  const sv = spec.view || {};
  const raw = sv.views === 'auto' ? 'auto' : [view, ...(Array.isArray(sv.views) ? sv.views : [])];
  const vspec = { ...spec, view: { ...sv, views: raw, current_view: view } };
  const views = enabledViews(meta, vspec.view, ctx);
  const bc = trail || (label ? [ctx.workspace, label].filter(Boolean) : undefined);
  const hctx = bc ? Object.create(ctx, { breadcrumbs: { value: bc } }) : ctx;
  const head = renderListHead(vspec, meta, hctx, { selected: 0, views }).html;
  if (!filters && !sort) return head;
  const stdHtml = filters && std ? renderStandardFilters({ meta, filters: [], groupBy: [] }) : '';
  const fbtn = filters ? renderFilterButton({ count: 0, open: false }) : '';
  const srt = sort ? renderSort({ meta, sort: currentSort(meta, sv), options: sortOptions(meta) }) : '';
  return `${head}<div class="container"><div class="page-form flex list-page-form" data-ui="${esc0(view)}.filter-area">${stdHtml}<div class="filter-section flex">${fbtn}${srt}</div></div></div>`;
}
const esc0 = (s) => String(s).replace(/[^a-z0-9_.-]/gi, '');
