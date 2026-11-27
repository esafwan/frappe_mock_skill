// Brand as a render-time parameter. Additive: no brand => output unchanged.
// Brand file JSON: { id, name, replace:[[from,to]...], logo?: "path.svg" (replaces the dock brand-tile glyph), colours?: {"--la-primary":"#hex"}, coloursDark?: {...}, forbid?: [regex...] }
// Replacements touch text nodes and title/alt/aria-label/placeholder only; never <style>, tags or data-ui ids.
import fs from 'fs'; import path from 'path';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const loadBrand = (p) => { const f = path.resolve(p); const b = JSON.parse(fs.readFileSync(f, 'utf8')); b.__dir = path.dirname(f); return b; };
function rep(s, pairs) { for (const [f, t] of pairs) s = s.split(f).join(esc(t)); return s; }
export function applyBrand(html, b) {
  if (!b) return html;
  const pairs = b.replace || [];
  const i = html.indexOf('<body'); let head = html.slice(0, i < 0 ? 0 : i), rest = html.slice(i < 0 ? 0 : i);
  rest = rest.replace(/(<style\b[\s\S]*?<\/style>)|(<[^>]*>)|([^<]+)/g, (m, sty, tag, txt) => sty ? sty : txt ? rep(txt, pairs) : tag.replace(/\b(aria-label|title|alt|placeholder)="([^"]*)"/g, (mm, k, v) => `${k}="${rep(v, pairs)}"`));
  head = head.replace(/<title>([^<]*)<\/title>/, (m, t) => `<title>${rep(t, pairs)}</title>`);
  const vars = (o) => Object.entries(o || {}).map(([k, v]) => `${k}:${v}`).join(';');
  const css = [b.colours && `:root,[data-theme="light"]{${vars(b.colours)}}`, b.coloursDark && `[data-theme="dark"]{${vars(b.coloursDark)}}`].filter(Boolean).join('');
  if (css) head = head.replace('</head>', `<style data-brand="${b.id || ''}">${css}</style></head>`);
  let out = head + rest;
  if (b.logo) { const svg = fs.readFileSync(path.resolve(b.__dir, b.logo), 'utf8').replace(/<\?xml[^>]*>/, '').trim(); out = out.replace(/(<span class="la-brand-tile"[^>]*>)[\s\S]*?(<\/span>)/, `$1${svg}$2`); }
  return out;
}
export function brandViolations(html, b) {   // visible-text check of b.forbid (case-insensitive)
  const t = html.slice(Math.max(0, html.indexOf('<body'))).replace(/<style\b[\s\S]*?<\/style>/g, '').replace(/<[^>]*>/g, ' ');
  return (b.forbid || []).filter(p => new RegExp(p, 'i').test(t));
}
