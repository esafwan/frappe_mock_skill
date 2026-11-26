// Datatable header (T-R1a). Generic, pure, deterministic. Markup follows frappe-datatable's header row.
import { esc } from '../util.mjs';

const NUMERIC = new Set(['Int', 'Float', 'Currency', 'Percent']);
const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>';
export const ARROW = { asc: '▲', desc: '▼', none: '' };
export const DEFAULT_MENU = [
  { id: 'sort-asc', label: 'Sort Ascending' },
  { id: 'sort-desc', label: 'Sort Descending' },
  { id: 'reset-sort', label: 'Reset sorting' },
  { id: 'remove', label: 'Remove column' },
  { id: 'pick', label: 'Pick Columns' },
];

/** Right-align numeric fieldtypes; an explicit col.align wins. */
export const colAlign = (c = {}) => c.align || (NUMERIC.has(c.fieldtype) ? 'right' : 'left');

/** Column dropdown items; `remove` is dropped when the column is not removable, sort items when not sortable. */
export function headMenuItems(col = {}, { items = DEFAULT_MENU, sort } = {}) {
  return items.filter((it) => {
    if (it.id === 'remove' && col.removable === false) return false;
    if ((it.id === 'sort-asc' || it.id === 'sort-desc' || it.id === 'reset-sort') && col.sortable === false) return false;
    if (it.id === 'reset-sort' && !(sort && sort.field === col.fieldname)) return false;
    return true;
  });
}

/**
 * renderHead({ columns, sort?, selectable?, frozen?, widths?, menu?, resizing?, rtl? }) -> `.dt-header` markup.
 *  columns: [{fieldname,label,fieldtype,width,align,sortable,removable,editable}]
 *  sort: {field, order:'asc'|'desc'}   selectable: leading checkbox column   frozen: number of leading data columns kept sticky (default 1)
 *  menu: {col: fieldname, items?, highlight?}  opens that column's dropdown   resizing: fieldname whose handle is active
 */
export function renderHead({ columns = [], sort, selectable = true, frozen = 1, widths = {}, menu, resizing, rtl = false } = {}) {
  const lead = [];
  if (selectable) lead.push({ __chk: true, width: 32 });
  lead.push({ __idx: true, width: 40 });
  const all = [...lead, ...columns];
  const nSticky = lead.length + Math.max(0, frozen);
  let left = 0;
  const offs = all.map((c) => { const o = left; left += c.width || widths[c.fieldname] || 120; return o; });
  let menuHtml = '';
  const cells = all.map((c, i) => {
    const w = c.width || widths[c.fieldname] || 120;
    const sticky = i < nSticky;
    const cls = ['dt-cell', `dt-cell--col-${i}`, 'dt-cell--header', `dt-cell--header-${i}`];
    if (sticky) cls.push('dt-cell--sticky', 'dt-cell--sticky-top');
    if (sticky && i === nSticky - 1) cls.push('dt-cell--sticky-last');
    const style = `${sticky ? `${rtl ? 'right' : 'left'}:${offs[i]}px;` : ''}`;
    const base = `class="${cls.join(' ')}" data-col-index="${i}" data-is-header="1" tabindex="0"${style ? ` style="${style}"` : ''}`;
    if (c.__chk) return `<div ${base} data-ui="datatable.head.select"><div class="dt-cell__content dt-cell__content--header-${i}" style="width:${w}px;"><input type="checkbox" data-ui="datatable.head.select.input"></div></div>`;
    if (c.__idx) return `<div ${base} data-ui="datatable.head.index"><div class="dt-cell__content dt-cell__content--header-${i}" style="width:${w}px;"><span class="sort-indicator"></span><span class="dt-cell__resize-handle"></span></div></div>`;
    const key = c.fieldname || `c${i}`;
    const active = sort && sort.field === c.fieldname ? sort.order : 'none';
    const align = colAlign(c);
    const label = c.label ?? c.fieldname ?? '';
    const isOpen = menu && menu.col === c.fieldname;
    const sortable = c.sortable !== false;
    if (isOpen) {
      const items = headMenuItems(c, { items: menu.items || DEFAULT_MENU, sort });
      menuHtml = `<div class="dt-dropdown-container dt-dropdown--active" data-ui="datatable.head.menu"><div class="dt-dropdown__list" style="left:${offs[i] + w - 140}px;top:36px;">`
        + items.map((it, k) => `<div class="dt-dropdown__list-item${menu.highlight === k ? ' highlighted' : ''}" data-index="${k}" data-action="${esc(it.id)}" data-ui="datatable.head.menu.${esc(it.id)}">${esc(it.label)}</div>`).join('') + '</div></div>';
    }
    return `<div ${base.replace('class="', `data-fieldname="${esc(key)}" class="`)} data-ui="datatable.head.col.${esc(key)}">`
      + `<div class="dt-cell__content dt-cell__content--header-${i}" title="${esc(label)}" style="width:${w}px;text-align:${align};${align === 'right' ? 'justify-content:flex-end;' : ''}">`
      + `${esc(label)}`
      + `<span class="sort-indicator${sortable ? '' : ' dt-hidden'}" data-sort="${active}" data-ui="datatable.head.sort.${esc(key)}">${ARROW[active] || ''}</span>`
      + `<span class="dt-cell__resize-handle${resizing === c.fieldname ? ' active' : ''}" data-ui="datatable.head.resize.${esc(key)}"></span>`
      + `<div class="dt-dropdown${isOpen ? ' dt-dropdown--active' : ''}"><div class="dt-dropdown__toggle"${isOpen ? ' style="opacity:1"' : ''} data-ui="datatable.head.toggle.${esc(key)}">${CHEVRON}</div></div>`
      + '</div></div>';
  }).join('');
  return `<div class="dt-header" data-ui="datatable.head"><div><div class="dt-row dt-row-header" data-is-header="1">${cells}</div></div>${menuHtml}</div>`;
}
