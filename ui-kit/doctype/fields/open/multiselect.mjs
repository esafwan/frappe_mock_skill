import { esc } from './util.mjs';
import { linkOpen } from './link.mjs';

/** Table MultiSelect: chips (ov.chips appended to existing) plus optional dropdown (ov.results / ov.query). */
export function multiselectOpen(html, df, ctx, ov = {}) {
  let out = html;
  const chips = (ov.chips || []).map((n) => `<div class="tb-selected-value" data-value="${esc(n)}"><div class="btn-link-to-form"><span class="btn-link-to-form-text">${esc(n)}</span><span class="btn-remove"><svg class="icon icon-sm" aria-hidden="true"><use href="#icon-close"></use></svg></span></div></div>`).join('');
  if (chips) out = out.replace(/(<div class="awesomplete">)/, `${chips}$1`);
  if (ov.results || ov.query !== undefined || ov.create || ov.advanced) out = linkOpen(out, df, ctx, ov);
  return out;
}
