// List body (T-L3): columns, header, rows, meta block, count, paging, empty/loading states.
// Port of list_view.js (V16-FACTS sections 1 and 2). Deterministic: sample values via data/gen.mjs only.
import { esc, enc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { avatarGroup } from '../../kit-lib/avatars.mjs';
import { get_indicator } from '../../kit-lib/indicators.mjs';
import { formatCell, formatDate } from '../../kit-lib/cells.mjs';
import { expandGen, hash, mulberry32 } from '../../data/gen.mjs';
import { menuList, takeMenu, dtName, listPerm, isSystemManager } from './head.mjs';
import { renderEmpty, renderNoResults, renderSkeleton, renderMobileCards } from './states.mjs';
import { renderMeta } from './meta.mjs';
import { renderBulkBar, renderRowAction } from './bulk.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const NO_VALUE = new Set(['Section Break', 'Column Break', 'Tab Break', 'Fold', 'HTML', 'Heading', 'Button', 'Table', 'Table MultiSelect', 'Image', 'Geolocation']);
const HTML_TYPES = new Set(['Text Editor', 'HTML Editor', 'Markdown Editor', 'Text', 'Small Text', 'Long Text', 'Code']);
const stripHtml = (s) => String(s ?? '').replace(/<[^>]*>/g, '');
const kebab = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const MAX_FIELDS = 50;
export const PAGE_LENGTHS = [20, 100, 500, 2500];
const AVATAR_USERS = ['Aisha Khan', 'Liam Chen', 'Maria Garcia', 'Omar Haddad', 'Priya Nair', 'Noah Smith'];
const TAGS = ['Priority', 'Review', 'Follow Up', 'Archive', 'Pilot'];
const TAG_COLOURS = ['blue', 'cyan', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'];

const parseJson = (v, d) => { if (typeof v !== 'string') return v ?? d; try { return JSON.parse(v); } catch { return d; } };

/** has_indicator: submittable, workflow, DocType states or a `status` field; view.status_column overrides. */
export function hasIndicator(meta = {}, spec = {}) {
  const o = spec.view?.status_column;
  if (o === true || o === false) return o;
  return t(meta.is_submittable) || !!meta.workflow || !!spec.meta?.workflow || (meta.states || []).length > 0 || (spec.meta?.states || []).length > 0
    || (meta.fields || []).some((f) => f.fieldname === 'status');
}

/**
 * Columns in v16 order: Subject, Tag (optional), Status (when has_indicator), in_list_view fields, trailing ID.
 * `list_view_settings.fields` ([{fieldname,width}] or JSON string) reorders; Subject stays first.
 * view.max_columns caps field columns (default 50). Returns [{kind, fieldname, label, df?, width?}].
 */
export function listColumns(spec = {}, meta = {}, ctx = {}) {
  const lvs = spec.meta?.list_view_settings || {};
  const fields = meta.fields || [];
  const byName = new Map(fields.map((f) => [f.fieldname, f]));
  const title = meta.title_field && byName.get(meta.title_field) ? byName.get(meta.title_field) : null;
  const indicator = hasIndicator(meta, spec);
  const readable = (f) => !(Number(f.permlevel) > 0) || ctx.perms?.permlevels?.includes?.(f.permlevel);
  const isVal = (f) => f.fieldname && !NO_VALUE.has(f.fieldtype) && !f.hidden && !t(f.is_virtual) && readable(f);
  const subject = { kind: 'subject', fieldname: title ? title.fieldname : 'name', label: title ? (title.label || title.fieldname) : 'ID', df: title || { fieldtype: 'Data', fieldname: 'name' } };
  const tag = t(lvs.show_tags) || spec.view?.show_tags === true ? { kind: 'tag', fieldname: '_user_tags', label: 'Tag' } : null;
  const status = indicator ? { kind: 'status', fieldname: 'status_field', label: 'Status' } : null;
  const cap = Math.max(1, Number(spec.view?.max_columns) || MAX_FIELDS);
  const mk = (f) => ({ kind: 'field', fieldname: f.fieldname, label: f.label || f.fieldname, df: f });

  let cols;
  const cfg = parseJson(lvs.fields, null);
  if (Array.isArray(cfg) && cfg.length) {
    cols = [];
    for (const c of cfg) {
      if (c.fieldname === 'status_field') { if (status) cols.push({ ...status, width: c.width }); continue; }
      if (c.fieldname === 'name' && !title) continue;
      const f = byName.get(c.fieldname) || (c.fieldname === 'name' ? { fieldname: 'name', fieldtype: 'Data', label: 'ID' } : null);
      if (f && f.fieldname !== subject.fieldname && (isVal(f) || f.fieldname === 'name')) cols.push({ ...mk(f), width: c.width });
    }
  } else {
    cols = fields.filter((f) => t(f.in_list_view) && isVal(f) && f.fieldname !== subject.fieldname && !(indicator && f.fieldname === 'status')).map(mk);
    if (status) cols.unshift(status);
  }
  cols = cols.slice(0, cap);
  if (title && title.fieldname !== 'name' && !t(lvs.hide_name_column) && !cols.some((c) => c.fieldname === 'name')) cols.push({ kind: 'id', fieldname: 'name', label: 'ID', df: { fieldtype: 'Data', fieldname: 'name', label: 'ID' } });
  return [subject, ...(tag ? [tag] : []), ...cols];
}

/** Rows from data.rows (array) or $gen, decorated with list meta (_assign, _user_tags, _comment_count, _liked_by) for generated rows. */
export function resolveRows(spec = {}, meta = {}, ctx = {}) {
  const r = spec.data?.rows;
  const meta2 = { ...meta, name: dtName(meta) };
  if (Array.isArray(r)) return r;
  if (r && r.$gen) {
    const g = r.$gen;
    const rows = expandGen(r, meta2, { today: ctx.today, locale: g.locale || ctx.locale, doctype: dtName(meta), seed: g.seed, linkPools: spec.data?.linkPools || {} });
    const users = spec.data?.users?.length ? spec.data.users : AVATAR_USERS;
    return rows.map((d, i) => {
      const rng = mulberry32(hash(`${g.seed ?? 1}|list-meta|${i}|${d.name}`));
      const out = { ...d };
      if (out._assign === undefined) { const n = Math.floor(rng() * 3); out._assign = Array.from({ length: n }, (_, k) => users[Math.floor(rng() * users.length)]).filter((u, k, a) => a.indexOf(u) === k); }
      if (out._user_tags === undefined) { const n = rng() < 0.4 ? 0 : 1 + Math.floor(rng() * 2); out._user_tags = Array.from({ length: n }, () => TAGS[Math.floor(rng() * TAGS.length)]).filter((u, k, a) => a.indexOf(u) === k); }
      if (out._comment_count === undefined) out._comment_count = rng() < 0.5 ? 0 : 1 + Math.floor(rng() * 12);
      if (out._liked_by === undefined) out._liked_by = rng() < 0.2 ? [ctx.user?.email || ctx.user?.name || 'Administrator'] : [];
      return out;
    });
  }
  return [];
}

/** Frappe's mini timestamp: "now", "5m", "3h", "2d", "1w", "4M", "2y". Deterministic from ctx.now. */
export function miniAgo(ts, now) {
  const p = (s) => Date.parse(String(s).replace(' ', 'T').replace(/\.\d+$/, '') + (/[zZ]|[+-]\d\d:\d\d$/.test(String(s)) ? '' : 'Z'));
  const a = p(ts), b = p(now);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  const s = Math.max(0, Math.round((b - a) / 1000));
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  const d = Math.floor(s / 86400);
  if (d < 7) return `${d}d`;
  if (d < 30) return `${Math.floor(d / 7)}w`;
  if (d < 365) return `${Math.floor(d / 30)}M`;
  return `${Math.floor(d / 365)}y`;
}

const sysFmt = (ctx) => ctx.system?.date_format || 'dd-mm-yyyy';
const palette = (name) => TAG_COLOURS[hash(String(name)) % TAG_COLOURS.length];
const tagPill = (n) => `<div class="tag-pill ellipsis" style="background-color: var(--${palette(n)}-avatar-bg); color: var(--${palette(n)}-avatar-color)" data-tag-name="${esc(n)}">${esc(n)}</div>`;

const DS_TITLE = { 0: 'Document is in draft state', 1: 'Document has been submitted', 2: 'Document has been cancelled' };
function statusBadge(doc, meta, spec, { visibleXs = false } = {}) {
  const ind = get_indicator(doc, { ...meta, workflow: spec.meta?.workflow ? { state_field: spec.meta.workflow.workflow_state_field || 'workflow_state', styles: {} } : meta.workflow, states: meta.states?.length ? meta.states : spec.meta?.states });
  if (!ind) return '';
  const theme = ind.colour === 'orange' ? 'amber' : ind.colour;
  const title = t(meta.is_submittable) ? DS_TITLE[Number(doc.docstatus || 0)] : ind.label;
  const filt = doc.status !== undefined && ind.label === doc.status ? `status,=,${doc.status}` : `docstatus,=,${Number(doc.docstatus || 0)}`;
  return `<span class="es-badge filterable ellipsis"${theme && theme !== 'gray' ? ` data-theme="${esc(theme)}"` : ''} title="${esc(title)}" data-filter="${esc(filt)}"><span class="es-badge__label">${esc(ind.label)}</span></span>`;
}

function subjectText(doc, col) {
  const df = col.df || {};
  const v = col.fieldname === 'name' ? doc.name : doc[col.fieldname];
  const text = HTML_TYPES.has(df.fieldtype) ? stripHtml(v) : v;
  return text === undefined || text === null || text === '' ? String(doc.name ?? '') : String(text);
}

function cellFor(col, doc, meta, ctx) {
  const df = col.df || {};
  const cur = (df.fieldtype === 'Currency' && df.options && !String(df.options).includes(':') && doc[df.options]) || (col.fieldname !== 'currency' && typeof doc.currency === 'string' && doc.currency) || ctx.system?.currency || '';
  return formatCell(df, doc[col.fieldname], { doc, currency: cur, dateFormat: sysFmt(ctx), filterable: true });
}

import { fitColumns } from './fit.mjs';
const vpWidth = (ctx) => { const v = ctx.viewport; const w = v && typeof v === 'object' ? Number(v.width) : parseInt(String(v || '').split('x')[0], 10); return Number.isFinite(w) && w > 0 ? w : 1440; };
// px for the field columns: viewport minus dock (48), expanded sidebar (230) when shown, list padding and the row meta block (230).
const listAvailable = (ctx) => vpWidth(ctx) - (ctx.chrome?.dock === false ? 0 : 48) - (ctx.chrome?.sidebar === false || ctx.chrome?.sidebar === 'hidden' ? 0 : ctx.chrome?.sidebar === 'collapsed' ? 48 : 230) - 64 - 230;
const COL_GAP = 15; // horizontal gap every list column adds
const DASH = '-';
function headerCols(cols, { selectAll, resize, rowAction, showCheck }) {
  const sub = cols[0];
  const other = cols.slice(1).map((c) => {
    const w = c.width ? ` style="width:${Math.max(50, Math.min(400, Number(c.width)))}px;flex:none"` : '';
    const handle = resize ? '<div class="list-col-resize-handle"></div>' : '';
    if (c.kind === 'tag') return `<div class="list-row-col ellipsis hidden-xs tag-col" data-fieldname="_user_tags" data-ui="list.column._user_tags"><span>Tag</span>${handle}</div>`;
    if (c.kind === 'status') return `<div class="list-row-col ellipsis hidden-xs"${w} data-fieldname="status_field" data-ui="list.column.status_field"><span>Status</span>${handle}</div>`;
    return `<div class="list-row-col ellipsis hidden-xs${NUM(c) ? ' text-right' : ''}"${w} data-fieldname="${esc(c.fieldname)}" data-ui="list.column.${esc(c.fieldname)}"><span data-sort-by="${esc(c.fieldname)}" title="Click to sort by ${esc(c.label)}">${esc(c.label)}</span>${handle}</div>`;
  }).join('');
  const check = showCheck ? `<span class="level-item select-like"><input class="list-header-checkbox list-check-all" type="checkbox" title="Select All"${selectAll ? ' checked' : ''} data-ui="list.select-all"></span>` : '';
  return { sub: `<div class="list-row-col ellipsis list-subject level" data-fieldname="${esc(sub.fieldname)}" data-ui="list.column.${esc(sub.fieldname)}">${check}<span class="level-item" data-sort-by="${esc(sub.fieldname)}" title="Click to sort by ${esc(sub.label)}">${esc(sub.label)}</span>${resize ? '<div class="list-col-resize-handle"></div>' : ''}</div>`, other: other + (rowAction ? '<div class="list-row-col ellipsis hidden-xs list-row-action-col" style="flex:0 0 auto"></div>' : '') };
}
const NUM = (c) => ['Int', 'Float', 'Currency', 'Percent'].includes(c.df?.fieldtype);

/** Row action buttons from `button` overlays targeted row_actions:<n> (plus an opened menu_open of the same target). */
function rowActions(ctx, n) {
  const target = `row_actions:${n}`;
  const btns = ctx.useOverlays('button', (b) => b.target === target);
  const mo = takeMenu(ctx, target, []);
  if (!btns.length && !mo) return '';
  const groups = new Map(); const out = [];
  for (const b of btns) {
    if (b.group) { if (!groups.has(b.group)) { const g = { label: b.group, items: [] }; groups.set(b.group, g); out.push({ g }); } groups.get(b.group).items.push({ label: b.label }); } else out.push({ b });
  }
  if (mo && !out.some((o) => o.g)) out.push({ g: { label: 'Actions', items: [] } });
  const html = out.map((o) => (o.b ? renderRowAction(n, { b: o.b }) : renderRowAction(n, { g: { label: o.g.label, items: mo ? mo.items.map((i) => ({ label: i.label, divider: i.divider })) : o.g.items } }, { open: !!mo }))).join('');
  return html;
}

function renderRow(doc, n, cols, o) {
  const { meta, spec, ctx, selected, showCheck, anyRowAction, doctype } = o;
  const slug = kebab(doctype);
  const name = String(doc.name ?? '');
  const sub = cols[0];
  const txt = subjectText(doc, sub);
  const unseen = t(doc.__unseen);
  const checked = selected.has(n);
  const subject = `<div class="list-row-col ellipsis list-subject level" data-fieldname="${esc(sub.fieldname)}" data-ui="list.cell.${n}.${esc(sub.fieldname)}">`
    + (showCheck ? `<span class="level-item select-like"><input class="list-row-checkbox" type="checkbox" data-doctype="${esc(doctype)}" data-name="${esc(name)}"${checked ? ' checked' : ''} data-ui="list.row.${n}.check"></span>` : '')
    + `<span class="level-item${unseen ? ' bold' : ''} ellipsis"><a class="ellipsis" data-doctype="${esc(doctype)}" data-name="${esc(name)}" href="/app/${esc(slug)}/${enc(name)}" title="${esc(txt)}" data-ui="list.row.${n}.link">${esc(txt)}</a></span></div>`;
  const rest = cols.slice(1).map((c) => {
    if (c.kind === 'tag') {
      const tags = parseJson(doc._user_tags, []); const tg = Array.isArray(tags) ? tags : String(tags).split(',').filter(Boolean);
      return `<div class="list-row-col tag-col hidden-xs ellipsis" data-ui="list.cell.${n}._user_tags">${tg.length ? tg.slice(0, 2).map(tagPill).join('') : `<div class="tags-empty">${DASH}</div>`}</div>`;
    }
    if (c.kind === 'status') return `<div class="list-row-col hidden-xs ellipsis"${c.width ? ` style="width:${Math.max(50, Math.min(400, Number(c.width)))}px;flex:none"` : ''} data-fieldname="status_field" data-ui="list.cell.${n}.status_field">${statusBadge(doc, meta, spec)}</div>`;
    const cell = cellFor(c, doc, meta, ctx);
    const w = c.width ? ` style="width:${Math.max(50, Math.min(400, Number(c.width)))}px;flex:none"` : '';
    return `<div class="list-row-col ellipsis hidden-xs${cell.align === 'right' ? ' text-right' : ''}"${w} data-fieldname="${esc(c.fieldname)}" data-ui="list.cell.${n}.${esc(c.fieldname)}"><span class="ellipsis" title="${esc(cell.title)}">${cell.html}</span></div>`;
  }).join('');
  const ra = anyRowAction ? `<div class="list-row-col ellipsis hidden-xs list-row-action-col" style="flex:0 0 auto">${rowActions(ctx, n)}</div>` : '';

  const ago = doc.modified ? miniAgo(doc.modified, ctx.now) : '';
  const modTitle = doc.modified ? `${formatDate(doc.modified, sysFmt(ctx))} ${String(doc.modified).slice(11, 19)}` : '';
  const meta2 = renderMeta(doc, ctx, { doctype, ago, modTitle, showComments: !t(spec.meta?.list_view_settings?.disable_comment_count), statusHtml: cols.some((c) => c.kind === 'status') ? statusBadge(doc, meta, spec) : '' });
  return `<div class="list-row-container" tabindex="1" data-ui="list.row.${n}" data-name="${esc(name)}"${checked ? ' data-selected="true"' : ''}><div class="level list-row"><div class="level-left ellipsis">${subject}${rest}${ra}</div><div class="level-right text-muted ellipsis border-0">${meta2}</div></div></div>`;
}


/** Count label: "{0} of {1}", total capped at count_upper_bound (default 1001) and shown as "1000+". */
export function countLabel(shown, total, { upper = 1001 } = {}) {
  const tot = total >= upper ? `${upper - 1}+` : String(total);
  return `${shown} of ${tot}`;
}

/**
 * renderListBody(spec, meta, ctx, st) -> { html, columns, rows }
 *   st: { selected:Set<number>, filters:[], state?:'normal'|'empty'|'no_results'|'loading'|'error', pageLength }
 */
export function renderListBody(spec = {}, meta = {}, ctx = {}, st = {}) {
  const view = spec.view || {};
  const doctype = dtName(meta);
  const rawCols = listColumns(spec, meta, ctx);
  const cols = fitColumns(rawCols, { available: listAvailable(ctx), gap: COL_GAP }).cols;
  const rows = resolveRows(spec, meta, ctx);
  const selected = st.selected || new Set();
  const total = Number.isFinite(Number(spec.data?.total)) && spec.data?.total != null ? Number(spec.data.total) : rows.length;
  const showCheck = ctx.desk_settings?.bulk_actions !== false;
  const lvs = spec.meta?.list_view_settings || {};
  const anyRowAction = ctx.overlays.some((o) => (o.type === 'button' && /^row_actions:/.test(o.target || '')) || (o.type === 'menu_open' && /^row_actions:/.test(o.target || '')));
  let state = st.state || view.state || 'normal';
  if (state === 'normal' && !rows.length) state = st.filters?.length ? 'no_results' : 'empty';
  const pl = PAGE_LENGTHS.includes(Number(st.pageLength)) ? Number(st.pageLength) : 20;
  const mobile = ctx.viewport?.device === 'mobile';
  const resize = isSystemManager(ctx) && !mobile;

  const hc = headerCols(cols, { selectAll: selected.size > 0 && selected.size === rows.length, resize, rowAction: anyRowAction, showCheck });
  const n = selected.size;
  const count = t(lvs.disable_count) ? '' : `<span class="list-count" style="white-space: nowrap;"><span>${esc(countLabel(rows.length, total, { upper: Number(view.count_upper_bound) || 1001 }))}</span></span>`;
  const header = `<header class="level list-row-head text-muted">`
    + `<div class="level-left list-header-subject"${n ? ' style="display:none"' : ''}>${hc.sub}${hc.other}</div>`
    + renderBulkBar(n, { showCheck })
    + `<div class="level-right">${count}<span class="level-item list-liked-by-me hidden-xs"><span title="Liked by me">${icon('heart', 'sm', { class: 'like-icon' })}</span></span></div></header>`;

  const create = listPerm(ctx, meta, 'create') && !t(ctx.read_only);
  let inner;
  if (state === 'empty') {
    inner = renderEmpty({ doctype, canCreate: create });
  } else if (state === 'no_results') {
    inner = renderNoResults({ filterCount: st.filters?.length || 0 });
  } else if (state === 'error') {
    inner = `<div class="no-result text-muted flex justify-center align-center" data-ui="list.error"><div class="msg-box no-border"><p>Something went wrong while loading the list</p><p>${button('Reload', { ui: 'list.error.reload' })}</p></div></div>`;
  } else if (state === 'loading') {
    inner = renderSkeleton({ cols });
  } else if (mobile) {
    inner = renderMobileCards(rows, { cols: rawCols, doctype, ctx, cell: (c, d) => cellFor(c, d, meta, ctx).html, status: (d) => statusBadge(d, meta, spec), subject: (d) => subjectText(d, cols[0]), ago: (d) => (d.modified ? miniAgo(d.modified, ctx.now) : '') });
  } else {
    inner = rows.map((d, i) => renderRow(d, i, cols, { meta, spec, ctx, selected, showCheck, anyRowAction, doctype })).join('');
  }
  const maxAssign = Math.min(3, Math.max(0, ...rows.map((d) => { const a = parseJson(d._assign, []); return Array.isArray(a) ? a.filter(Boolean).length : 0; })));
  const assignCls = maxAssign ? `has-assign-to assign-to-length-${maxAssign}` : 'no-assign-to';
  const subW = Math.max(180, Math.min(420, Math.round(listAvailable(ctx) - COL_GAP * cols.length - cols.slice(1).reduce((a, c) => a + (c.width ? Math.max(50, Math.min(400, Number(c.width))) : c.kind === 'tag' ? 110 : 110), 0))));
  const layoutCss = `<style data-ui="list.layout">.frappe-list{--list-subject-w:${subW}px}.frappe-list .list-subject{flex:0 0 var(--list-subject-w);width:var(--list-subject-w);box-sizing:border-box;padding-right:0}.frappe-list .level.list-row{min-height:46px;align-items:center}.frappe-list .list-row-col{box-sizing:border-box}.frappe-list .list-row-col>span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.frappe-list .list-row-col .progress{margin:0}.frappe-list .list-row-col .es-badge{display:inline-flex;align-items:center}${mobile ? '.frappe-list,.frappe-list .result,.frappe-list .list-row-container,.frappe-list .list-row-head{max-width:100%;min-width:0;box-sizing:border-box}.frappe-list .list-row-head .level-left{min-width:0;flex:1 1 0}.frappe-list .list-row-head .list-subject{flex:1 1 auto;width:auto}.frappe-list .list-card .card-field{gap:12px;min-width:0}' : ''}</style>`;
  const result = `${layoutCss}<div class="frappe-list"><div class="result-container"><div class="result ${assignCls}" data-ui="list.result"><div class="list-row-container">${header}</div>${inner}</div></div>`;

  const hasRows = state === 'normal' && rows.length > 0;
  const lens = PAGE_LENGTHS.map((p) => `<button type="button" class="es-pill" role="radio" data-state="${p === pl ? 'active' : 'inactive'}" aria-checked="${p === pl}" tabindex="${p === pl ? 0 : -1}" data-ui="list.page-length.${p}">${p}</button>`).join('');
  const paging = hasRows
    ? `<div class="list-paging-area level" data-ui="list.paging"><div class="level-left"><div class="es-tab-buttons" role="radiogroup" aria-label="Page length">${lens}</div></div>`
      + `<div class="level-right">${rows.length < total ? button('Load More', { cls: 'btn-more', ui: 'list.load-more' }) : ''}</div></div>` : '';
  return { html: `${result}${paging}</div>`, columns: cols, rows };
}
