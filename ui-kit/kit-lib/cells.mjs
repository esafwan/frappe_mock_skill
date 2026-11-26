// List/report cell formatter per fieldtype (T-L1). Pure, deterministic, generic.
// Port of list_view.js get_column_html + form/formatters.js (see docs/V16-FACTS.md section 3).
import { esc } from './util.mjs';
import { guess_colour } from './indicators.mjs';
import { badge } from './badges.mjs';

const NUMERIC = new Set(['Int', 'Float', 'Currency', 'Percent']);
const isEmpty = (v) => v === undefined || v === null || v === '';
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const pad = (n) => String(n).padStart(2, '0');

export function formatNumber(n, precision = 2) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '';
  const [i, d] = Math.abs(x).toFixed(precision).split('.');
  return (x < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
}
export function formatDate(v, fmt = 'dd-mm-yyyy') {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v ?? ''));
  if (!m) return '';
  const [, y, mo, d] = m;
  return fmt.replace('yyyy', y).replace('mm', mo).replace('dd', d).replace('M', MON[+mo - 1]);
}
export function formatDuration(sec) {
  let s = Math.floor(Number(sec) || 0);
  if (s <= 0) return '0s';
  const out = [];
  for (const [u, n] of [['d', 86400], ['h', 3600], ['m', 60], ['s', 1]]) { const q = Math.floor(s / n); if (q) out.push(q + u); s %= n; }
  return out.join(' ');
}
const stripHtml = (s) => String(s).replace(/<[^>]*>/g, '');
const starSvg = (on) => `<svg class="icon icon-sm star${on ? ' filled' : ''}" viewBox="0 0 16 16"><path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.4L8 11.2 4.1 13.4l.9-4.4-3.3-3 4.4-.5z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor"/></svg>`;

/**
 * formatCell(df, value, ctx) -> { html, align:'left'|'right', title }
 * df: { fieldtype, fieldname, label, options, precision }
 * ctx: { doc, currency, dateFormat, timeFormat, filterable }
 */
export function formatCell(df = {}, value, ctx = {}) {
  const ft = df.fieldtype || 'Data';
  const align = NUMERIC.has(ft) ? 'right' : 'left';
  const empty = isEmpty(value);
  const wrap = (html, title) => ({ html, align, title: title ?? (empty ? '' : stripHtml(String(value))) });
  const flt = ctx.filterable === false ? '' : ' filterable';
  switch (ft) {
    case 'Select': {
      if (empty) return wrap('', '');
      const b = badge(String(value), guess_colour(String(value)));
      return wrap(`<span class="${flt.trim()} ellipsis" data-filter="${esc(df.fieldname)},=,${esc(value)}">${b}</span>`, String(value));
    }
    case 'Link':
    case 'Dynamic Link':
      if (empty) return wrap('', '');
      return wrap(`<a class="${flt.trim()} ellipsis" data-filter="${esc(df.fieldname)},=,${esc(value)}">${esc(ctx.linkTitle ?? value)}</a>`, String(ctx.linkTitle ?? value));
    case 'Percent': {
      const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
      return wrap(`<div class="progress"><div class="progress-bar progress-bar-success" style="width:${v}%"></div></div>`, `${df.label || df.fieldname}: ${Number(value) || 0}`);
    }
    case 'Currency':
      return wrap(empty ? '' : esc((ctx.currency ? ctx.currency + ' ' : '') + formatNumber(value, df.precision ?? 2)));
    case 'Float':
      return wrap(empty ? '' : esc(formatNumber(value, df.precision ?? 3).replace(/\.?0+$/, '')));
    case 'Int':
      return wrap(empty ? '' : esc(df.options === 'File Size' ? fileSize(value) : formatNumber(Math.round(Number(value)), 0)));
    case 'Rating': {
      const n = Number(df.options) || 5;
      const filled = Math.round(Number(value || 0) * n * 2) / 2; // value is 0..1, scaled by star count
      let h = '';
      for (let i = 1; i <= n; i++) h += starSvg(i <= Math.round(filled));
      return wrap(`<div class="rating">${h}</div>`, `${Math.round(filled)}/${n}`);
    }
    case 'Image': {
      const src = df.options && ctx.doc ? ctx.doc[df.options] : value;
      if (!df.options && !src) return wrap('<div class="missing-image small"><svg class="icon icon-md"><use href="#icon-ban"></use></svg></div>', '');
      return wrap(src ? `<img src="${esc(src)}" style="max-height:30px;max-width:100%">` : '', '');
    }
    case 'Date': return wrap(esc(formatDate(value, ctx.dateFormat)));
    case 'Datetime': {
      const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/.exec(String(value ?? ''));
      if (!m) return wrap('');
      const t = m[2].length === 5 ? m[2] + ':00' : m[2];
      return wrap(esc(`${formatDate(m[1], ctx.dateFormat)} ${t}`));
    }
    case 'Time': return wrap(esc(empty ? '' : String(value).slice(0, 8)));
    case 'Check':
      return wrap(`<input type="checkbox" disabled class="${Number(value) ? 'disabled-selected' : 'disabled-deselected'}"${Number(value) ? ' checked' : ''}>`, Number(value) ? 'Yes' : 'No');
    case 'Color':
      return wrap(empty ? '' : `<div><div class="selected-color" style="background-color:${esc(value)}"></div><span class="color-value">${esc(value)}</span></div>`);
    case 'Duration': return wrap(esc(formatDuration(value)));
    case 'Attach':
    case 'Attach Image':
      return wrap(empty ? '' : `<a href="${esc(value)}" target="_blank">${esc(value)}</a>`);
    case 'Text Editor':
    case 'HTML Editor':
      return wrap(`<span class="ellipsis">${esc(stripHtml(empty ? '' : value))}</span>`);
    case 'Code': return wrap(empty ? '' : `<pre>${esc(value)}</pre>`);
    case 'Text':
    case 'Small Text':
    case 'Long Text':
      return wrap(`<span class="ellipsis">${esc(stripHtml(empty ? '' : value)).replace(/\n/g, '<br>')}</span>`);
    default:
      if (df.options === 'URL' && !empty) return wrap(`<a href="${esc(value)}" target="_blank">${esc(value)}</a>`);
      return wrap(esc(empty ? '' : value));
  }
}

function fileSize(b) {
  const n = Number(b) || 0;
  if (n >= 1048576) return (n / 1048576).toFixed(1) + 'M';
  if (n >= 1024) return Math.round(n / 1024) + 'K';
  return n + 'B';
}

export const CELL_FIELDTYPES = ['Select', 'Link', 'Dynamic Link', 'Percent', 'Currency', 'Float', 'Int', 'Rating', 'Image', 'Date', 'Datetime', 'Time', 'Check', 'Color', 'Duration', 'Attach', 'Attach Image', 'Text Editor', 'HTML Editor', 'Code', 'Text', 'Small Text', 'Long Text', 'Data'];
