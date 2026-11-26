// Kanban page renderer (v16 kanban markup). Generic, deterministic. Default export render(spec, ctx) -> { head, main, title }.
// spec.meta.kanban: { name|board_name, field_name?, reference_doctype?, columns:[{column_name, indicator|color, status?}], show_labels? }
// spec.data.cards: [{ name, title, column, fields:[{label,value}] | {label:value}, assignees:[names], indicator:{label,colour}|colour,
//                     tags:[...], comments:int, image, doc_icon }]  (or spec.data.rows with spec.meta.kanban.card_field/column_field)
// Rows path: board.card_fields (or meta.kanban.fields) = [fieldname | {fieldname,label}] picks the card fields; _assign, _user_tags and _comment_count map to assignees, tags and comments.
//   Rows with no value in the column field (e.g. $gen rows) cycle through the columns by index. title_field defaults to meta.doctype.title_field, then title, then name.
// spec.data.counts: { "<column>": n } optional override (e.g. paged boards). A count above the drawn cards adds a "+N more" footer; below it warns.
//   A card with an unknown column is dropped with a warning, unless board.fallback_column (column name, or true for the first column) is set.
// Overlays drawn: menu_open target "column-header:<column>" or "ui:kanban.column-menu:<column>"; menu_open "page.menu" or "ui:kanban.board-menu"; state "ui:kanban.add-card:<column>" (composer); state "ui:kanban.add-column" (input open).
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { avatarGroup } from '../../kit-lib/avatars.mjs';
import { COLOURS, guess_colour, indicatorPill } from '../../kit-lib/indicators.mjs';
import { menuList } from '../list/head.mjs';

const CSS = `<style data-ui="kanban.layout">.kanban{display:flex;gap:12px;align-items:flex-start;overflow-x:auto;padding:12px 0 16px}.kanban .kanban-column{flex:0 0 280px;width:280px;background:var(--kanban-column-bg,var(--surface-gray-1,#f3f3f3));border-radius:8px;padding:8px;box-sizing:border-box;position:relative}.kanban .kanban-column-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 4px 8px}.kanban .kanban-column-title{display:flex;align-items:center;gap:6px;min-width:0}.kanban .kanban-title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kanban .kanban-column-count{color:var(--text-muted,#7c7c7c);font-size:12px}.kanban .kanban-cards{display:flex;flex-direction:column;gap:8px;min-height:24px}.kanban .kanban-card{background:var(--kanban-card-bg,var(--surface-white,#fff));border:1px solid var(--outline-gray-1,#ededed);border-radius:8px;padding:10px;box-sizing:border-box}.kanban .kanban-card-body{display:flex;flex-direction:column;gap:6px}.kanban .kanban-card-title{display:flex;align-items:flex-start;gap:6px;justify-content:space-between}.kanban .kanban-card-title-link{font-weight:500;overflow-wrap:anywhere}.kanban .kanban-doc-field{display:flex;gap:4px;font-size:12px;color:var(--text-muted,#7c7c7c)}.kanban .kanban-doc-field .field-label{flex:0 0 auto}.kanban .kanban-column .kanban-cards .kanban-card-wrapper .kanban-card .kanban-card-body{padding:10px 12px}.kanban .kanban-column .kanban-cards .kanban-card-wrapper .kanban-card .kanban-card-body .kanban-card-meta{min-height:0;margin:0;padding:0}.kanban .kanban-column .kanban-column-header{margin-bottom:4px}.kanban .kanban-column .kanban-cards+.kanban-add,.kanban .kanban-column .kanban-cards+*{margin-top:8px}.kanban .kanban-column .kanban-cards .kanban-card-wrapper:last-child .kanban-card{margin-bottom:0}.kanban .kanban-card-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--text-muted,#7c7c7c)}.kanban .kanban-tags{display:flex;flex-wrap:wrap;gap:4px}.kanban .kanban-assignments{display:inline-flex}.kanban .kanban-add{display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;margin-top:8px;padding:6px 8px;color:var(--text-muted,#7c7c7c);cursor:pointer;white-space:nowrap}.kanban .kanban-add>svg{flex:0 0 16px;width:16px;height:16px;margin:0!important}.kanban .kanban-more{padding:6px 8px;text-align:center;font-size:12px;color:var(--text-muted,#7c7c7c)}.kanban .kanban-column.add-new-column{padding:8px 12px}.kanban .kanban-card-composer textarea,.kanban .kanban-column-add input{width:100%;box-sizing:border-box}.kanban .kanban-column.add-new-column{background:transparent;border:1px dashed var(--outline-gray-2,#d6d6d6);flex:0 0 240px;width:240px;align-self:flex-start;min-height:0;height:auto}.kanban .kanban-empty-state{padding:16px;text-align:center;color:var(--text-muted,#7c7c7c)}.kanban .kanban-column-menu{position:relative}.kanban .kanban-column-menu>.dropdown-menu{position:absolute;right:0;top:100%;z-index:5;display:none}.kanban .kanban-column-menu>.dropdown-menu.show{display:block}[dir=rtl] .kanban .kanban-column-menu>.dropdown-menu{right:auto;left:0}.menu-btn-group{position:relative}.menu-btn-group>.dropdown-menu{position:absolute;right:0;top:100%;z-index:5;display:none}.menu-btn-group>.dropdown-menu.show{display:block}</style>`;

const ov = (ctx, type, pred) => (ctx.useOverlays ? ctx.useOverlays(type, pred) : (ctx.overlays || []).filter((o) => o.type === type && pred(o)));
const colourOf = (c) => { const s = String(c || '').toLowerCase().replace(/\s+/g, '-'); return COLOURS.includes(s) ? s : s === 'grey' ? 'gray' : s === 'light-blue' || s === 'dark-blue' ? 'blue' : s === 'dark-green' ? 'green' : ''; };
const ind = (i, fallbackLabel) => {
  if (!i) return null;
  const o = typeof i === 'string' ? { colour: i } : i;
  const colour = colourOf(o.colour || o.color) || guess_colour(o.label || fallbackLabel || '');
  return { colour, label: o.label ?? fallbackLabel ?? '' };
};
const fieldRows = (f) => (Array.isArray(f) ? f : Object.entries(f || {}).map(([label, value]) => ({ label, value })));

function card(c, i, board) {
  const pill = ind(c.indicator, c.status);
  const fields = fieldRows(c.fields).map((f) => `<div class="kanban-doc-field text-muted" data-ui="kanban.card-field">${board.show_labels === false ? '' : `<span class="field-label">${esc(f.label)}:</span>`}<span class="field-value ellipsis">${esc(f.value)}</span></div>`).join('');
  const tags = (c.tags || []).length ? `<div class="kanban-tags">${c.tags.map((t) => `<span class="es-badge" data-theme="gray"><span>${esc(t)}</span></span>`).join('')}</div>` : '';
  const people = (c.assignees || []).length ? `<span class="kanban-assignments" data-ui="kanban.assignees">${avatarGroup(c.assignees, { size: 'small', max: 3 })}</span>` : '';
  const comments = c.comments ? `<span class="kanban-comments">${icon('message-square', 'sm')} ${esc(c.comments)}</span>` : '';
  const image = c.image ? `<img class="kanban-card-image" src="${esc(c.image)}" alt="">` : '';
  return `<div class="kanban-card-wrapper" draggable="true" data-name="${esc(c.name || c.title)}" data-ui="kanban.card:${esc(c.name || c.title || i)}"><div class="kanban-card content"><div class="kanban-card-body">${image}<div class="kanban-card-title"><a class="kanban-card-title-link" href="#" data-ui="kanban.card-title">${esc(c.title || c.name)}</a>${pill ? indicatorPill(pill) : ''}</div>${fields}${tags}${people || comments ? `<div class="kanban-card-meta">${people}${comments}</div>` : ''}</div></div></div>`;
}

function column(col, cards, count, ctx, board, rest = 0) {
  const name = col.column_name;
  const c = colourOf(col.indicator || col.color) || 'gray';
  const menuOv = ov(ctx, 'menu_open', (o) => o.target === `column-header:${name}` || o.target === `ui:kanban.column-menu:${name}`)[0];
  const items = (menuOv?.items || ['Edit Card', 'Archive', 'Archive All Cards', 'Set Colour']).map((x) => (typeof x === 'string' ? { label: x } : x));
  const menu = `<div class="kanban-column-menu dropdown" data-ui="kanban.column-menu:${esc(name)}"><button class="btn btn-xs btn-default icon-btn" aria-label="Column options">${icon('ellipsis', 'sm')}</button>${menuList(items, { open: !!menuOv })}</div>`;
  const composer = ov(ctx, 'state', (o) => o.target === `ui:kanban.add-card:${name}`)[0];
  const add = composer
    ? `<div class="kanban-card-composer" data-ui="kanban.add-card-composer:${esc(name)}"><textarea class="form-control" rows="2" placeholder="Card title" aria-label="Card title" readonly>${esc('')}</textarea><div class="mt-2"><button class="btn btn-xs btn-primary">Add</button></div></div>`
    : `<a class="kanban-add add-card add-new-card" href="#" data-ui="kanban.add-card:${esc(name)}">${icon('plus', 'sm')} <span>Add a card</span></a>`;
  const more = rest ? `<div class="kanban-more" data-ui="kanban.load-more">+${rest} more</div>` : '';
  const body = cards.length ? cards.join('') + more : (rest ? more : `<div class="kanban-empty-state text-muted" data-ui="kanban.empty-column">No cards</div>`);
  return `<div class="kanban-column" data-column-value="${esc(name)}" data-ui="kanban.column:${esc(name)}"><div class="kanban-column-header"><div class="kanban-column-title"><span class="indicator-pill-dot" data-theme="${c}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--${c}-500,var(--ink-${c}-3,currentColor))"></span><span class="kanban-title" title="${esc(name)}">${esc(name)}</span><span class="kanban-column-count" data-ui="kanban.count">${esc(count)}</span></div>${menu}</div><div class="kanban-cards" data-ui="kanban.cards">${body}</div>${add}</div>`;
}

export default function render(spec, ctx) {
  const board = spec.meta?.kanban || spec.meta?.kanban_board;
  if (!board) throw new Error('kanban renderer: spec.meta.kanban is required');
  const title = board.board_name || board.name || board.title || 'Kanban Board';
  const dt = board.reference_doctype || spec.meta?.doctype?.name || (typeof spec.meta?.doctype === 'string' ? spec.meta.doctype : '') || '';
  const cols = (board.columns || []).map((c) => (typeof c === 'string' ? { column_name: c } : { ...c, column_name: c.column_name ?? c.name }));
  if (!cols.length) ctx.warn?.('kanban: no columns defined');
  let cards = spec.data?.cards;
  const warn = (m) => ctx.warn?.(m);
  if (!cards && Array.isArray(spec.data?.rows)) {
    const dm = spec.meta?.doctype && typeof spec.meta.doctype === 'object' ? spec.meta.doctype : {};
    const cf = board.column_field || board.field_name || 'status';
    const tf = board.title_field || dm.title_field || 'title';
    const label = (fn) => (dm.fields || []).find((f) => f.fieldname === fn)?.label || fn.replace(/_/g, ' ').replace(/^./, (m) => m.toUpperCase());
    const cfields = (board.card_fields || board.fields || []).map((f) => (typeof f === 'string' ? { fieldname: f, label: label(f) } : { ...f, label: f.label || label(f.fieldname) }));
    const list = (v) => (Array.isArray(v) ? v : typeof v === 'string' ? (() => { try { const j = JSON.parse(v); return Array.isArray(j) ? j : []; } catch { return v.split(',').map((x) => x.trim()).filter(Boolean); } })() : []);
    cards = spec.data.rows.map((r, i) => {
      const given = r[cf];
      const column = given === undefined || given === null || given === '' ? cols[i % (cols.length || 1)]?.column_name : given;
      return { ...r, name: r.name ?? `row-${i}`, title: r[tf] ?? r.title ?? r.name, column,
        fields: cfields.filter((f) => r[f.fieldname] !== undefined && r[f.fieldname] !== null && r[f.fieldname] !== '').map((f) => ({ label: f.label, value: r[f.fieldname] })),
        assignees: r.assignees ?? list(r._assign), tags: r.tags ?? list(r._user_tags), comments: r.comments ?? (Number(r._comment_count) || 0) };
    });
  }
  const buckets = new Map(cols.map((c) => [c.column_name, []]));
  const fb = board.fallback_column === true ? cols[0]?.column_name : board.fallback_column;
  (cards || []).forEach((c, i) => {
    if (buckets.has(c.column)) { buckets.get(c.column).push(card(c, i, board)); return; }
    if (fb !== undefined && buckets.has(fb)) { warn(`kanban: card "${c.name || c.title}" has unknown column "${c.column}"; placed in fallback column "${fb}"`); buckets.get(fb).push(card(c, i, board)); return; }
    warn(`kanban: card "${c.name || c.title}" has unknown column "${c.column}"; dropped (set board.fallback_column to keep it)`);
  });
  const cs = spec.data?.counts || {};
  const colsHtml = cols.map((c) => {
    const drawn = buckets.get(c.column_name), n = cs[c.column_name];
    const total = n === undefined ? drawn.length : Number(n);
    if (total < drawn.length) warn(`kanban: counts["${c.column_name}"]=${n} is below the ${drawn.length} cards drawn`);
    const rest = Math.max(0, total - drawn.length);
    return column(c, drawn, total, ctx, board, rest);
  }).join('');
  const addColOpen = ov(ctx, 'state', (o) => o.target === 'ui:kanban.add-column').length > 0;
  const addCol = `<div class="kanban-column add-new-column" data-ui="kanban.add-column">${addColOpen ? `<div class="kanban-column-add"><input class="form-control" type="text" placeholder="Column name" aria-label="Column name" readonly><div class="mt-2"><button class="btn btn-xs btn-primary">Save</button></div></div>` : `<a class="kanban-add" href="#">${icon('plus', 'sm')} <span>Add column</span></a>`}</div>`;
  const bmo = ov(ctx, 'menu_open', (o) => o.target === 'page.menu' || o.target === 'ui:kanban.board-menu')[0];
  const bitems = (bmo?.items || ['Save filters', 'Delete Kanban Board']).map((x) => (typeof x === 'string' ? { label: x } : x));
  const menu = `<div class="menu-btn-group" data-ui="kanban.menu"><button class="btn btn-default icon-btn" data-ui="page.menu-button" aria-label="Menu">${icon('ellipsis', 'sm')}</button>${menuList(bitems, { open: !!bmo })}</div>`;
  const crumbs = `${dt ? `<li><span class="es-breadcrumbs__item"><span class="es-breadcrumbs__label">${esc(dt)}</span></span></li>` : ''}<li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${esc(title)}</span></span></li>`;
  const head = `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between"><div class="page-title"><div class="flex title-area ellipsis"><nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol>${crumbs}</ol></nav></div></div><div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex">${menu}</div></div></div></div></div></div>`;
  return { head, main: `${CSS}<div class="desk-page kanban-page" data-ui="kanban.page"><div class="kanban" data-ui="kanban.board">${colsHtml}${addCol}</div></div>`, title };
}
