// Workspace page renderer: Workspace `content` blocks on a 12-column grid.
import { BLOCKS } from './blocks/index.mjs';
import { renderHead, emptyState } from './head.mjs';
import { clampCol, LAYOUT_CSS } from './layout.mjs';

export { clampCol };

export default function render(spec, ctx) {
  const ws = spec.meta?.workspace;
  if (!ws) throw new Error('workspace renderer: spec.meta.workspace is required');
  let content = ws.content;
  if (typeof content === 'string') content = JSON.parse(content || '[]');
  content = Array.isArray(content) ? content : [];
  const state = spec.view?.state;
  const parts = content.map((b, i) => {
    const fn = BLOCKS[b.type];
    const data = b.data || {};
    const col = clampCol(data.col ?? 12);
    if (!fn) { ctx.warn(`workspace: unknown block type "${b.type}"`); return ''; }
    const id = b.id || `b${i}`;
    return `<div class="ce-block grid-col-${col}" data-ui="block:${b.type}" data-block-id="${id}" data-col="${col}"><div class="ce-block__content">${fn(data, ctx, spec, id)}</div></div>`;
  }).join('');
  const body = content.length === 0 || state === 'empty' ? emptyState : `<div class="workspace-grid editor-js-container" data-ui="workspace.grid">${parts}</div>`;
  return { head: renderHead(spec, ctx), main: `${LAYOUT_CSS}<div class="desk-page workspace-page" data-ui="workspace.page">${body}</div>`, title: ws.title || ws.label || ws.name };
}
