// Fixed UI vocabulary translation for ctx.locale (data/universals/i18n/<lang>.json: { "English": "Translated" }).
// Pure post-process over final HTML: exact-match text nodes and placeholder/title/aria-label values. Deterministic, no network.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();

export function loadVocabulary(lang) {
  if (!/^[a-z]{2,3}$/.test(lang)) return {};
  if (!cache.has(lang)) {
    const f = path.join(ROOT, 'data', 'universals', 'i18n', `${lang}.json`);
    let v = {};
    try { v = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { /* no vocabulary for this language */ }
    cache.set(lang, v);
  }
  return cache.get(lang);
}

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const SKIP = /(<(style|script|title|textarea|svg)\b[\s\S]*?<\/\2>)/i; // not UI text
// Code-like values (naming series, IDs, codes): one token, letters plus digits or . - _ / # : separators. Always left-to-right.
const CODE = /^(?=[^\s]*[A-Za-z])(?=[^\s]*[0-9._\-#\/:])[A-Za-z0-9._\-#\/:]+$/;
export const isCodeLike = (t) => CODE.test(t);
const PUNCT = /^([\s.:;,!?()\[\]'"…*•\-–—]*)([\s\S]*?)([\s.:;,!?()\[\]'"…*•\-–—]*)$/;

/**
 * Translate html for locale and report text nodes that stayed English.
 * Handles exact text nodes, nodes with leading/trailing punctuation (".This invoice..."), and code-like tokens, which are wrapped
 * in <bdi dir="ltr"> so series and IDs do not get bidi-mangled. Returns { html, untranslated: [text...] } (sorted, unique).
 */
export function translateHtmlReport(html, locale) {
  const lang = String(locale || 'en').toLowerCase().split(/[-_]/)[0];
  if (lang === 'en') return { html, untranslated: [] };
  const v = loadVocabulary(lang);
  if (!Object.keys(v).length) return { html, untranslated: [] };
  const own = (k) => Object.prototype.hasOwnProperty.call(v, k) ? v[k] : undefined;
  const miss = new Set();
  const node = (m, t) => {
    const k = t.trim();
    if (!k) return m;
    const lead = t.slice(0, t.indexOf(k)), trail = t.slice(t.indexOf(k) + k.length);
    const exact = own(k);
    if (exact) return `>${lead}${exact}${trail}<`;
    const [, p1, core, p2] = PUNCT.exec(k);
    const mid = core && own(core);
    if (mid) return `>${lead}${p1}${mid}${p2}${trail}<`;
    if (isCodeLike(core || k)) return `>${lead}${p1}<bdi dir="ltr">${core || k}</bdi>${p2}${trail}<`;
    if (/[A-Za-z]{2}/.test(k) && !/^&[a-z#0-9]+;$/i.test(k)) miss.add(k);
    return m;
  };
  const out = html.split(SKIP).map((seg, i) => (i % 3 === 0 ? trNode(seg) : (i % 3 === 1 ? seg : ''))).join('');
  function trNode(seg) {
    return seg
      .replace(/<option\b([^>]*)>([^<>]+)<\/option>/g, (m, a, t) => (isCodeLike(t.trim()) && !/\sdir=/.test(a) ? `<option${a} dir="ltr">${t}</option>` : m)) // <option> cannot hold <bdi>: isolate through dir
      .replace(/>([^<>]+)(?=<)/g, (m, t) => node(m + '<', t).slice(0, -1))
      .replace(/\b(placeholder|title|aria-label)="([^"]+)"/g, (m, a, t) => { const r = own(t); return r ? `${a}="${escAttr(r)}"` : m; });
  }
  return { html: out, untranslated: [...miss].sort() };
}

/** Translate html for locale (e.g. "ar", "ar-SA"). English or unknown languages return the input unchanged. */
export function translateHtml(html, locale) { return translateHtmlReport(html, locale).html; }
