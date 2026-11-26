// Workspace page renderer: Workspace `content` blocks on a 12-column grid.
import { BLOCKS } from './blocks/index.mjs';
import { renderHead, emptyState } from './head.mjs';
import { clampCol, LAYOUT_CSS } from './layout.mjs';
import { permsOn, itemReadable, roleAllowed } from '../../kit-lib/perms.mjs';

export { clampCol };

export default function render(spec, ctx) {
  const ws = spec.meta?.workspace;
  if (!ws) throw new Error('workspace renderer: spec.meta.workspace is required');
  let content = ws.content;
  if (typeof content === 'string') content = JSON.parse(content || '[]');
  content = Array.isArray(content) ? content : [];
  const state = spec.view?.state;
  // Role perms: shortcuts, card links and quick lists that point at a DocType the role cannot read are not drawn.
  const hide = new Set();
  if (permsOn(ctx)) {
    const ok = (it) => itemReadable(ctx, it) && roleAllowed(ctx, it.roles || it.role);
    for (const s of ws.shortcuts || []) if (!ok(s)) hide.add('shortcut:' + (s.label ?? s.name));
    for (const q of ws.quick_lists || []) if (!ok(q)) hide.add('quick_list:' + (q.name ?? q.label ?? q.quick_list_name));
    const links = ws.links || [];
    const kept = links.filter((l) => l.type === 'Card Break' || ok(l));
    if (kept.length !== links.length) {
      spec = { ...spec, meta: { ...spec.meta, workspace: { ...ws, links: kept } } };
      let cur = null; const total = new Map(); const left = new Map();
      for (const l of links) { if (l.type === 'Card Break') cur = l.label; else if (cur) total.set(cur, (total.get(cur) || 0) + 1); }
      cur = null;
      for (const l of kept) { if (l.type === 'Card Break') cur = l.label; else if (cur) left.set(cur, (left.get(cur) || 0) + 1); }
      for (const [c, n] of total) if (n && !left.get(c)) hide.add('card:' + c);
    }
  }
  // RTL: a row of number cards that does not fill 12 columns (1 or 2 cards) shares the whole row, so the empty cell is not left on one side.
  const stretch = new Map();
  if (ctx.rtl) {
    for (let i = 0; i < content.length;) {
      if (content[i]?.type !== 'number_card') { i++; continue; }
      let j = i; while (j < content.length && content[j].type === 'number_card') j++;
      let row = [], sum = 0;
      const flush = () => { if (row.length && row.length < 3 && sum < 12) row.forEach((k) => stretch.set(k, 12 / row.length)); row = []; sum = 0; };
      for (let k = i; k < j; k++) {
        const c = clampCol(content[k].data?.col ?? 12);
        if (c > 4) { flush(); continue; }
        if (sum + c > 12) flush();
        row.push(k); sum += c;
      }
      flush();
      i = j;
    }
  }
  const parts = content.map((b, i) => {
    const fn = BLOCKS[b.type];
    const data = b.data || {};
    if (hide.has(`${b.type}:${data.shortcut_name ?? data.card_name ?? data.quick_list_name}`)) return '';
    const col = stretch.get(i) ?? clampCol(data.col ?? 12);
    if (!fn) { ctx.warn(`workspace: unknown block type "${b.type}"`); return ''; }
    const id = b.id || `b${i}`;
    return `<div class="ce-block grid-col-${col}" data-ui="block:${b.type}" data-block-id="${id}" data-col="${col}"><div class="ce-block__content">${fn(data, ctx, spec, id)}</div></div>`;
  }).join('');
  const body = content.length === 0 || state === 'empty' ? emptyState : `<div class="workspace-grid editor-js-container" data-ui="workspace.grid">${parts}</div>`;
  return { head: renderHead(spec, ctx), main: `${LAYOUT_CSS}<div class="desk-page workspace-page" data-ui="workspace.page">${body}</div>`, title: ws.title || ws.label || ws.name };
}
