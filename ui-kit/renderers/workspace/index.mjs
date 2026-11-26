// Workspace page renderer: Workspace `content` blocks on a 12-column grid.
import { BLOCKS } from './blocks/index.mjs';
import { renderHead, emptyState } from './head.mjs';

export const clampCol = (c) => { const n = Math.round(Number(c)); return Number.isFinite(n) ? Math.min(12, Math.max(1, n)) : 12; };
const CSS = `<style data-ui="workspace.layout">.workspace-grid{display:flex;flex-wrap:wrap;gap:0;margin:0 -8px}.workspace-grid>.ce-block{box-sizing:border-box;padding:0 8px 16px;min-width:0}${Array.from({ length: 12 }, (_, i) => `.grid-col-${i + 1}{width:${((i + 1) / 12 * 100).toFixed(4)}%}`).join('')}@media(max-width:767px){.workspace-grid>.ce-block{width:100%}}.workspace-grid .widget{height:100%}.widget-group-title{margin:8px 0}.link-items .link-item{display:flex;align-items:center;gap:6px;padding:4px 0}.ce-spacer{width:100%}.chart-widget .widget-body svg{display:block;width:100%;height:240px}.number-widget-box .stat,.number-widget-box [class*=-stat]{display:inline-flex;gap:4px;align-items:center}.onboarding-step{padding:6px 0}.onboarding-step .step-title{display:flex;align-items:center;gap:8px}.onboarding-step .step-body{padding-left:24px}</style>`;

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
  return { head: renderHead(spec, ctx), main: `${CSS}<div class="desk-page workspace-page" data-ui="workspace.page">${body}</div>`, title: ws.title || ws.label || ws.name };
}
