// Locale/number/date formatting from ctx.system (System Settings). Pure, deterministic.
export const SYSTEM_DEFAULTS = {
  number_format: '#,###.##', date_format: 'dd-mm-yyyy', time_format: 'HH:mm:ss',
  currency_precision: null, float_precision: 3, currency: 'USD', first_day_of_the_week: 'Sunday',
};
const sys = (s) => ({ ...SYSTEM_DEFAULTS, ...(s || {}) });
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// -> { group, decimal, decimals, indian }
export function parseNumberFormat(fmt = SYSTEM_DEFAULTS.number_format) {
  const f = String(fmt);
  const indian = f === '#,##,###.##';
  const m = f.match(/^#([^#\d]+)###(?:([.,])(#+))?$/);
  if (indian) return { group: ',', decimal: '.', decimals: 2, indian: true };
  if (!m) return parseNumberFormat(SYSTEM_DEFAULTS.number_format);
  let group = m[1];
  let decimal = m[2] || '.';
  const decimals = m[3] ? m[3].length : 0;
  if (!m[2]) { // "#.###" / "#,###": the single separator is the group
    return { group, decimal: group === ',' ? '.' : ',', decimals: 0, indian: false };
  }
  return { group, decimal, decimals, indian: false };
}

function groupInt(int, group, indian) {
  if (indian && int.length > 3) {
    const last = int.slice(-3); const rest = int.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, group) + group + last;
  }
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
}
const roundHalfUp = (abs, p) => { // string-based rounding avoids float drift
  const s = abs.toFixed(Math.min(20, p + 4));
  const [i, d = ''] = s.split('.');
  const digits = (i + d.slice(0, p)).replace(/^0+(?=\d)/, '') || '0';
  const up = (d[p] || '0') >= '5';
  let n = BigInt(digits) + (up ? 1n : 0n);
  let str = n.toString().padStart(p + 1, '0');
  return p ? str.slice(0, -p) + '.' + str.slice(-p) : str;
};

// precision: override decimals; null/undefined = from number_format
// opts.trim drops trailing zeros of the decimal part (shows 1.5 for 1.500).
export function formatNumber(value, system, precision, opts) {
  const v = Number(value);
  if (value === null || value === undefined || value === '' || !Number.isFinite(v)) return '';
  const nf = parseNumberFormat(sys(system).number_format);
  const p = precision == null ? nf.decimals : Math.max(0, Math.min(9, precision | 0));
  const [int, dec = ''] = roundHalfUp(Math.abs(v), p).split('.');
  const neg = v < 0 && /[1-9]/.test(int + dec);
  const dd = opts && opts.trim ? dec.replace(/0+$/, '') : dec;
  return (neg ? '-' : '') + groupInt(int, nf.group, nf.indian) + (dd ? nf.decimal + dd : '');
}
/** Currency text: the locale decides where the symbol (and any bidi mark) sits, the system number format draws the digits. */
export function currencyAround(value, system, locale, currency) {
  const v = Number(value);
  if (!Number.isFinite(v)) return '';
  const body = formatNumber(Math.abs(v), system, sys(system).currency_precision);
  let parts;
  try { parts = new Intl.NumberFormat(locale || 'en', { style: 'currency', currency }).formatToParts(v); } catch { return (v < 0 ? '-' : '') + currency + ' ' + body; }
  let put = false;
  return parts.map((p) => {
    if (p.type === 'integer' || p.type === 'group' || p.type === 'decimal' || p.type === 'fraction') { if (put) return ''; put = true; return body; }
    return p.value;
  }).join('');
}
/** Decimal separator of the system number format. */
export const decimalSep = (system) => parseNumberFormat(sys(system).number_format).decimal;
export const formatFloat = (v, system) => formatNumber(v, system, sys(system).float_precision);
export const formatInt = (v, system) => formatNumber(v, system, 0);
export function formatCurrency(value, system, currency, symbol) {
  const s = sys(system);
  const n = formatNumber(value, s, s.currency_precision);
  if (n === '') return '';
  const sym = symbol ?? currency ?? s.currency;
  return sym ? `${sym} ${n}` : n;
}
export const formatPercent = (v, system) => { const n = formatNumber(v, system, sys(system).float_precision); return n === '' ? '' : n + '%'; };

// Accepts 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss' or Date (read as UTC). Returns {y,m,d,H,M,S} or null.
export function parseDate(v) {
  if (v instanceof Date) return Number.isNaN(+v) ? null : { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1, d: v.getUTCDate(), H: v.getUTCHours(), M: v.getUTCMinutes(), S: v.getUTCSeconds() };
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  return m ? { y: +m[1], m: +m[2], d: +m[3], H: +(m[4] || 0), M: +(m[5] || 0), S: +(m[6] || 0) } : null;
}
const p2 = (n) => String(n).padStart(2, '0');
export function formatDate(value, system) {
  const t = parseDate(value); if (!t) return value == null ? '' : String(value);
  const f = sys(system).date_format;
  return f.replace(/yyyy|dd|mm/g, (k) => (k === 'yyyy' ? String(t.y).padStart(4, '0') : k === 'dd' ? p2(t.d) : p2(t.m)));
}
export function formatTime(value, system) {
  const m = typeof value === 'string' && value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  const t = m ? { H: +m[1], M: +m[2], S: +(m[3] || 0) } : parseDate(value);
  if (!t) return value == null ? '' : String(value);
  return sys(system).time_format === 'HH:mm' ? `${p2(t.H)}:${p2(t.M)}` : `${p2(t.H)}:${p2(t.M)}:${p2(t.S)}`;
}
export function formatDatetime(value, system) {
  const t = parseDate(value); if (!t) return value == null ? '' : String(value);
  return `${formatDate(value, system)} ${formatTime(value, system)}`;
}
// 0=Sunday..6=Saturday
export function firstDayIndex(system) { const i = DAYS.indexOf(sys(system).first_day_of_the_week); return i < 0 ? 0 : i; }
export function weekdayOrder(system) { const f = firstDayIndex(system); return DAYS.map((_, i) => (f + i) % 7); }
