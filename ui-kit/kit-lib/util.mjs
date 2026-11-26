// Tiny shared helpers (owned by T4 kit-lib). Deterministic, no deps.
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const enc = (s) => encodeURIComponent(String(s ?? ''));
export const attrs = (o = {}) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false)
  .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');
export function hash(str) { let h = 5381; for (const c of String(str)) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h; }
