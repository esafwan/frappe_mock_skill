import { esc, wrapControl, formatValue } from '../lib/control.mjs';

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
const cur = (df, ctx) => ctx.value ?? (df.default !== undefined && df.default !== '' ? df.default : undefined);

function numberInput(df, ctx) {
  const v = formatValue(df, cur(df, ctx), ctx);
  return wrapControl(df, {
    inputHtml: `<input type="text" inputmode="decimal" autocomplete="off" class="input-with-feedback form-control text-right${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(v)}">`,
    valueHtml: esc(v),
  });
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
  return wrapControl(df, {
    inputHtml: `<div class="rating" ${attrs(df, ctx)}>${stars}</div>`,
    valueHtml: `<div class="rating">${stars}</div>`,
  });
}

function duration(df, ctx) {
  const v = fmtDuration(cur(df, ctx));
  return wrapControl(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control text-right${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder="1d 2h 3m"${ro(df)} value="${esc(v)}">`,
    valueHtml: esc(v),
  });
}

export default {
  Int: numberInput,
  Float: numberInput,
  Percent: (df, ctx) => numberInput(df, ctx),
  Rating: rating,
  Duration: duration,
};
