import { esc } from './util.mjs';
// Sprite reference icon, as used by the Desk shell (symbols live in the page's icon sprite).
export function icon(name, size = 'sm', extra = {}) {
  const cls = ['icon', `icon-${size}`, extra.class].filter(Boolean).join(' ');
  return `<svg class="${esc(cls)}" stroke="currentColor" aria-hidden="true"><use href="#icon-${esc(name)}"></use></svg>`;
}
