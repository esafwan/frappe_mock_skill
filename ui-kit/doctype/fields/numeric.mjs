import { esc, wrapControl, formatValue } from '../lib/control.mjs';
import { wrapFrappe } from './base.mjs';
import { formatNumber as formatSystemNumber } from '../../kit-lib/format.mjs';

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
// Live Frappe read-only: control-input is hidden and empty, control-value is shown.
const asReadOnly = (df, html) => (df.read_only
  ? html
    .replace(/<div class="control-input">[\s\S]*?<\/div>(\s*<div class="control-value)/, '<div class="control-input hide"></div>$1')
    .replace(/(<div class="control-value like-disabled-input) hide/, '$1')
  : html);
const cur = (df, ctx) => ctx.value ?? (df.default !== undefined && df.default !== '' ? df.default : undefined);

function numberInput(df, ctx) {
  const v = formatValue(df, cur(df, ctx), ctx);
  return asReadOnly(df, wrapControl(df, {
    inputHtml: `<input type="text" inputmode="decimal" autocomplete="off" class="input-with-feedback form-control text-right${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(v)}">`,
    valueHtml: esc(v),
  }));
}

function fmtDuration(value) {
  const s = Number(value);
  if (value === undefined || value === null || value === '' || Number.isNaN(s)) return value == null ? '' : String(value);
  let r = Math.max(0, Math.floor(s));
  const d = Math.floor(r / 86400); r %= 86400;
  const h = Math.floor(r / 3600); r %= 3600;
  const m = Math.floor(r / 60); const sec = r % 60;
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (sec || !parts.length) parts.push(`${sec}s`);
  return parts.join(' ');
}

function rating(df, ctx) {
  const n = Math.max(1, parseInt(df.options, 10) || 5);
  const raw = Number(cur(df, ctx));
  const v = Number.isNaN(raw) ? 0 : raw <= 1 && raw > 0 && !Number.isInteger(raw * n) ? raw * n : (raw <= 1 ? raw * n : raw);
  const star = (i) => {
    const full = v >= i, half = !full && v >= i - 0.5;
    const cls = `icon icon-md star-click${full ? ' star-full' : ''}${half ? ' star-half' : ''}`;
    return `<svg class="${cls}" data-rating="${i}" style="${full ? 'fill: var(--yellow-500, #f6c343); stroke: var(--yellow-500, #f6c343);' : ''}"><use href="#icon-star"></use></svg>`;
  };
  const stars = Array.from({ length: n }, (_, i) => star(i + 1)).join('');
  return asReadOnly(df, wrapControl(df, {
    inputHtml: `<div class="rating" ${attrs(df, ctx)}>${stars}</div>`,
    valueHtml: `<div class="rating">${stars}</div>`,
  }));
}

function duration(df, ctx) {
  const v = fmtDuration(cur(df, ctx));
  return asReadOnly(df, wrapControl(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control text-right${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder="1d 2h 3m"${ro(df)} value="${esc(v)}">`,
    valueHtml: esc(v),
  }));
}

const SYM = { INR: '\u20b9', USD: '$', GBP: '\u00a3', EUR: '\u20ac', AED: 'AED', SAR: 'SAR' };
const LOCALE_CUR = { 'en-IN': 'INR', 'en-US': 'USD', 'en-GB': 'GBP', 'ar-AE': 'AED', 'ar-SA': 'SAR', 'de-DE': 'EUR' };
function curInfo(df, ctx) {
  const l = ctx.locale;
  const locale = (l && typeof l === 'object' ? l.locale : l) || 'en-IN';
  const company = (l && typeof l === 'object' && l.currency) || LOCALE_CUR[locale] || 'INR';
  const code = df.options && /^[A-Z]{3}$/.test(df.options) ? df.options : company;
  return { locale, code };
}
// Frappe format_currency: "<symbol> <number>" (e.g. "\u20b9 0.00"); read-only: control-input hidden, control-value shown.
function currency(df, ctx) {
  const { locale, code } = curInfo(df, ctx);
  const raw = cur(df, ctx);
  const n = raw === undefined || raw === null || raw === '' ? 0 : Number(raw);
  const num = ctx.system ? formatSystemNumber(Number.isNaN(n) ? 0 : n, ctx.system, ctx.system.currency_precision) : new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isNaN(n) ? 0 : n);
  const shown = `${SYM[code] || code} ${num}`;
  // ERPNext set_df_currency: fields with a currency "options" get " (<currency>)" appended to the label.
  const label = df.options ? `${df.label ?? df.fieldname} (${code})` : df.label;
  const d = { ...df, label };
  if (df.read_only) {
    return wrapFrappe(d, { inputHtml: '', valueHtml: esc(shown), hideValue: false }).replace('<div class="control-input">', '<div class="control-input hide">');
  }
  return wrapFrappe(d, {
    inputHtml: `<input type="text" inputmode="decimal" autocomplete="off" class="input-with-feedback form-control${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder="" value="${esc(raw === undefined || raw === '' ? '' : num)}">`,
    valueHtml: esc(shown),
  });
}

export default {
  Currency: currency,
  Int: numberInput,
  Float: numberInput,
  Percent: (df, ctx) => numberInput(df, ctx),
  Rating: rating,
  Duration: duration,
};
