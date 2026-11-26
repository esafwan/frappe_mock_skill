// Shared helpers for workspace blocks. Generic, deterministic.
import { esc } from '../../../kit-lib/util.mjs';
import { icon } from '../../../kit-lib/icons.mjs';
export { esc, icon };

export const COLOUR_MAP = { grey: '#6c7680', gray: '#6c7680', green: '#28a745', red: '#e24c4c', blue: '#318ad8', orange: '#ff8c0a', yellow: '#f8c51c', purple: '#7575ff', pink: '#ff5858', cyan: '#00b8d9', 'dark blue': '#2490ef', 'light blue': '#7cd6fd' };
export const colourOf = (c) => (c ? COLOUR_MAP[String(c).toLowerCase()] || String(c) : '');

/** Look up a record by name in a list of `{key: name}` rows, or return a plain-object entry. */
export function findIn(list, keys, name) {
  return (list || []).find((r) => keys.some((k) => r?.[k] === name)) || null;
}
export const stripTags = (s) => String(s ?? '').replace(/<[^>]*>/g, '');
/** Paragraph/header text is trusted editor HTML in Frappe; allow only a small tag whitelist. */
export function safeInline(html) {
  return String(html ?? '')
    .replace(/<\s*(script|style|iframe|object|embed)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<(?!\/?(b|i|u|a|span|br|strong|em|code|mark|font)\b)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/javascript:/gi, '');
}
export const widgetHead = (title, { subtitle = '', controls = '' } = {}) =>
  `<div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis" title="${esc(stripTags(title))}">${esc(stripTags(title))}</span></div><div class="widget-subtitle">${esc(subtitle)}</div></div>${controls}</div>`;
export const routeFor = (type, to, view) => {
  const slug = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, '-');
  if (/^report$/i.test(type)) return `/desk/query-report/${encodeURIComponent(to)}`;
  if (/^page$/i.test(type)) return `/desk/${slug(to)}`;
  if (/^dashboard$/i.test(type)) return `/desk/dashboard-view/${encodeURIComponent(to)}`;
  if (/^workspace$/i.test(type)) return `/desk/${slug(to)}`;
  if (/^url$/i.test(type)) return to;
  const v = String(view || 'list').toLowerCase();
  return `/desk/${slug(to)}${v === 'list' || !v ? '' : '/view/' + v.replace(/\s+/g, '-')}`;
};
