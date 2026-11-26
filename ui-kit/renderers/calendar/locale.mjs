// Locale vocabulary for date-based views (calendar, gantt): month and weekday names via Intl (UTC, Gregorian, no clock) plus a small
// template table for "+N more" and "Week N". Counts are wrapped in <bdi> so they stay intact in RTL text.
import { loadVocabulary } from '../../kit-lib/i18n.mjs';
// Templates ('+{0} more', 'Week {0}') live in data/universals/i18n/<lang>.json under their English text.
const KEYS = { more: '+{0} more', week: 'Week {0}', today: 'Today' };
export const langOf = (locale) => String(locale || 'en').toLowerCase().split(/[-_]/)[0];
const cache = new Map();

export function names(locale) {
  const lang = langOf(locale);
  if (cache.has(lang)) return cache.get(lang);
  const mk = (opts, f) => { try { const fmt = new Intl.DateTimeFormat(`${lang}-u-ca-gregory-nu-latn`, { ...opts, timeZone: 'UTC' }); return Array.from({ length: 12 }, (_, i) => f(fmt, i)); } catch { return null; } };
  const month = mk({ month: 'long' }, (f, i) => f.format(Date.UTC(2000, i, 1)));
  const monthShort = mk({ month: 'short' }, (f, i) => f.format(Date.UTC(2000, i, 1)));
  const wk = (style) => mk({ weekday: style }, (f, i) => (i < 7 ? f.format(Date.UTC(2000, 0, 2 + i)) : '')); // 2000-01-02 is a Sunday
  const out = { month, monthShort, weekday: wk('long')?.slice(0, 7), weekdayShort: wk('short')?.slice(0, 7) };
  const EN = { month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
  EN.monthShort = EN.month.map((m) => m.slice(0, 3)); EN.weekdayShort = EN.weekday.map((d) => d.slice(0, 3));
  for (const k of Object.keys(EN)) if (!out[k]) out[k] = EN[k];
  cache.set(lang, out);
  return out;
}

/** t(locale, key, ...args): template with {0} args, each wrapped in <bdi>. Falls back to English. */
export function t(locale, key, ...args) {
  const en = KEYS[key] ?? key, v = loadVocabulary(langOf(locale));
  const tpl = Object.prototype.hasOwnProperty.call(v, en) ? v[en] : en;
  return tpl.replace(/\{(\d+)\}/g, (_, i) => `<bdi>${args[i]}</bdi>`);
}
