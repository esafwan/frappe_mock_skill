import { esc } from './util.mjs';
import { guess_colour } from './indicators.mjs';
export function badge(label, colour, { dot = false } = {}) {
  return `<span class="es-badge" data-theme="${esc(colour || guess_colour(label))}"${dot ? ' data-dot="true"' : ''}><span>${esc(label)}</span></span>`;
}
