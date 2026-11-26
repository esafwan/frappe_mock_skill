import { esc, findIn, safeInline } from './common.mjs';
// Custom HTML Block: html + style from meta.workspace.custom_blocks (matched by custom_block_name) or data.custom_blocks.
// CSS is scoped by prefixing every selector with the block id (Frappe uses a shadow root; static HTML cannot).
export function scopeCss(css, scope) {
  return String(css || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\})\s*([^@{}][^{}]*)\{/g, (m, close, sel) =>
    `${close}\n${sel.split(',').map((s) => (/^\s*(:host|body|html)\b/.test(s) ? s.replace(/^\s*(:host|body|html)/, scope) : `${scope} ${s.trim()}`)).join(',')}{`);
}
export function sanitizeHtml(html) {
  return String(html ?? '')
    .replace(/<\s*(script|iframe|object|embed|link|meta|base)\b[\s\S]*?(<\s*\/\s*\1\s*>|>)/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}
export default function customBlock(data, ctx, spec, id) {
  const name = data.custom_block_name;
  const rec = findIn(spec.meta.workspace.custom_blocks, ['custom_block_name', 'name', 'label'], name) || spec.data?.custom_blocks?.[name];
  if (!rec) { ctx.warn(`workspace: custom block "${name}" has no html`); }
  const scope = `[data-block-id="${String(id).replace(/[^\w-]/g, '')}"]`;
  const css = scopeCss(rec?.style || rec?.css, scope);
  return `<div class="widget custom-block" data-ui="custom-block:${esc(name)}" data-block-id="${esc(String(id).replace(/[^\w-]/g, ''))}">${css ? `<style>${css.replace(/<\/style/gi, '')}</style>` : ''}<div class="custom-block-body">${sanitizeHtml(rec?.html)}</div></div>`;
}
