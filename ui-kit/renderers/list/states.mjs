// List states (T-L8): empty, no-results, skeleton loading, mobile card list. Pure markup helpers; rows.mjs picks one by state.
// Generic: the DocType label is passed in.
import { esc } from '../../kit-lib/util.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { renderMeta } from './meta.mjs';

/** Empty list. canCreate shows "Create your first X". */
export function renderEmpty({ doctype, canCreate = true } = {}) {
  return `<div class="no-result text-muted flex justify-center align-center" data-ui="list.empty"><div class="msg-box no-border"><p>You haven't created a ${esc(doctype)} yet</p>${canCreate ? `<p>${button(`Create your first ${doctype}`, { primary: true, ui: 'list.empty.create' })}</p>` : ''}</div></div>`;
}

/** Filters matched nothing. */
export function renderNoResults({ filterCount = 0 } = {}) {
  return `<div class="no-result text-muted flex justify-center align-center" data-ui="list.no-results"><div class="msg-box no-border"><p>Nothing to show</p>${filterCount ? `<p class="text-muted">${filterCount} filter${filterCount === 1 ? '' : 's'} applied</p><p>${button('Clear Filters', { ui: 'list.no-results.clear' })}</p>` : ''}</div></div>`;
}

const bar = (w, i) => `<span class="skeleton-box" style="display:inline-block;width:${w}px;max-width:100%;height:12px;border-radius:4px;background:var(--bg-gray, var(--gray-200, #ededed))" data-ui="list.skeleton.bar.${i}"></span>`;
const SUBJ = [140, 110, 160, 120, 150];

/** Skeleton rows: `cols` (from listColumns) decide how many placeholder cells each row has. Deterministic widths. */
export function renderSkeleton({ cols = [], rows = 5 } = {}) {
  const other = cols.slice(1).map((c, k) => `<div class="list-row-col ellipsis hidden-xs">${bar(c.kind === 'status' ? 64 : 70 + ((k * 13) % 30), k)}</div>`).join('');
  const one = (i) => `<div class="list-row-container" data-ui="list.skeleton.${i}"><div class="level list-row"><div class="level-left ellipsis"><div class="list-row-col ellipsis list-subject level"><span class="level-item">${bar(SUBJ[i % SUBJ.length], 's')}</span></div>${other}</div><div class="level-right text-muted ellipsis border-0"><div class="level-item list-row-activity hidden-xs">${bar(60, 'm')}</div></div></div></div>`;
  return `<div class="list-skeleton" data-ui="list.loading" aria-busy="true">${Array.from({ length: rows }, (_, i) => one(i)).join('')}</div>`;
}

/**
 * Mobile card list. One card per row: subject, status, up to `maxFields` secondary label/value pairs, meta block.
 * o: { cols, doctype, ctx, cell(col, doc) -> html, status(doc) -> html, subject(doc) -> text, ago(doc), maxFields=3 }
 */
export function renderMobileCards(rows, o = {}) {
  const { cols = [], doctype = '', ctx = {}, maxFields = 3 } = o;
  const sec = cols.slice(1).filter((c) => c.kind === 'field').slice(0, maxFields);
  return `<div class="list-cards" data-ui="list.cards">${rows.map((d, i) => {
    const title = o.subject ? o.subject(d) : String(d.name ?? '');
    const fields = sec.map((c) => `<div class="card-field d-flex justify-between"><span class="text-muted">${esc(c.label)}</span><span class="ellipsis">${o.cell ? o.cell(c, d) : esc(d[c.fieldname] ?? '')}</span></div>`).join('');
    const metaHtml = renderMeta(d, ctx, { doctype, ago: o.ago?.(d) || '', showAssignees: true }).replace(/\bhidden-xs\b/g, '').replace(/\bhidden-md\b/g, '');
    return `<div class="list-card" style="padding:12px 15px;border-bottom:1px solid var(--border-color,#ededed);display:flex;flex-direction:column;gap:6px" data-ui="list.card.${i}" data-name="${esc(d.name ?? '')}"><div class="d-flex justify-between align-center"><a class="ellipsis bold" href="#" data-ui="list.card.${i}.link">${esc(title)}</a>${o.status ? o.status(d) : ''}</div>${fields}<div class="d-flex justify-between align-center text-muted">${metaHtml}</div></div>`;
  }).join('')}</div>`;
}
