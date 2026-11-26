// Icon resolution for the shell. Generic: names come from data; symbols come from the full lucide sprite.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
let SYMS = null;
const WARNED = new Set();
export const misses = [];

// id -> <symbol> markup. Lucide sprite first, then the "-soft" rail symbols captured in the reference page.
export function loadSymbols() {
  if (SYMS) return SYMS;
  SYMS = new Map();
  const grab = (txt) => { for (const m of txt.matchAll(/<symbol\b[^>]*\bid="([^"]+)"[\s\S]*?<\/symbol>/g)) if (!SYMS.has(m[1])) SYMS.set(m[1], m[0]); };
  for (const f of ['tokens/icons/sprite.svg.html', 'pages/desk-form.html']) {
    const p = path.join(KIT, f);
    if (fs.existsSync(p)) grab(fs.readFileSync(p, 'utf8'));
  }
  return SYMS;
}

// "lucide:ShoppingCart", "icon-shopping_cart", "Shopping Cart" -> "shopping-cart"
export function normName(name) {
  return String(name ?? '').trim().replace(/^(lucide[:/])/i, '').replace(/^icon-/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
}

const FALLBACK = 'icon-layout-grid';

// Returns { id, hit }. Prefers "-soft" rail variant, then plain, then lucide aliases; warns on miss.
export function resolveIcon(name, { warn = true, fallback = FALLBACK } = {}) {
  const s = loadSymbols();
  const n = normName(name);
  if (n) {
    const base = n.replace(/-soft$/, '');
    for (const id of [`icon-${n}`, `icon-${base}-soft`, `icon-${n}-soft`, `icon-${base}`]) if (s.has(id)) return { id, hit: true };
  }
  if (warn && !WARNED.has(n)) {
    WARNED.add(n);
    misses.push(String(name ?? ''));
    console.warn(`[shell/icons] no lucide symbol for "${name ?? ''}"; using ${fallback}`);
  }
  return { id: s.has(fallback) ? fallback : 'icon-circle', hit: false };
}

export const iconSvg = (name, cls = 'icon icon-rail') => `<svg class="${cls}" aria-hidden="true"><use href="#${resolveIcon(name).id}"></use></svg>`;
