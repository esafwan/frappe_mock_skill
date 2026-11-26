// Tree view renderer (page: 'tree'). Generic, deterministic.
// spec.data.tree: nodes [{ value, label?, expandable?, expanded?, children?: [...] }] (also spec.data.nodes / spec.data.rows).
// spec.view: { selected: value, expand: 'all'|'none'|[values] }; spec.data.title for the heading.
// spec.data.actions: [{label, primary?}] node actions shown for the selected node (default Add Child, Edit, Rename, Delete).
import { esc, icon } from '../workspace/blocks/common.mjs';
import { viewHead, metaOf } from '../../kit-lib/viewhead.mjs';

const CSS = `<style data-ui="tree.layout">.tree-page{padding:16px 0}.tree-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}.tree-root{list-style:none;margin:0;padding:0}.tree-root ul{list-style:none;margin:0;padding:0;padding-inline-start:20px;border-inline-start:1px solid var(--outline-gray-1,#ededed);margin-inline-start:9px}.tree-node{margin:0}.tree-link{flex-wrap:wrap;display:flex;align-items:center;gap:6px;min-height:28px;padding:2px 6px;border-radius:6px;white-space:nowrap}.tree-link.selected{background:var(--surface-gray-2,#f3f3f3);font-weight:500}.tree-link .tree-toggle{display:inline-flex;width:14px;justify-content:center}.tree-link .node-actions{display:inline-flex;gap:6px;margin-inline-start:12px}.tree-empty{display:flex;align-items:center;justify-content:center;min-height:200px}</style>`;

const norm = (n) => (typeof n === 'string' ? { value: n } : n || {});
const kids = (n) => (Array.isArray(n.children) ? n.children : []);
const isGroup = (n) => !!(n.expandable ?? n.is_group) || kids(n).length > 0;

function isOpen(n, view, depth) {
  if (n.expanded !== undefined) return !!n.expanded;
  const e = view.expand;
  if (e === 'all') return true;
  if (e === 'none') return false;
  if (Array.isArray(e)) return e.includes(n.value);
  return depth === 0;
}

function node(raw, view, depth, actions) {
  const n = norm(raw);
  const v = String(n.value ?? n.label ?? n.name ?? '');
  const label = n.label ?? v;
  const group = isGroup(n);
  const open = group && kids(n).length > 0 && isOpen(n, view, depth);
  const sel = view.selected !== undefined && String(view.selected) === v;
  const toggle = group ? `<span class="tree-toggle" data-ui="tree.toggle">${icon(open ? 'chevron-down' : 'chevron-right', 'xs')}</span>` : `<span class="tree-toggle"></span>`;
  const act = sel ? `<span class="node-actions" data-ui="tree.node-actions">${actions.map((a) => `<button type="button" class="btn btn-xs ${a.primary ? 'btn-primary' : 'btn-default'}">${esc(a.label)}</button>`).join('')}</span>` : '';
  const inner = open ? `<ul data-ui="tree.children">${kids(n).map((c) => node(c, view, depth + 1, actions)).join('')}</ul>` : '';
  return `<li class="tree-node ${group ? 'is-group' : 'is-leaf'}${open ? ' open' : ''}" data-ui="tree.node:${esc(v)}" data-group="${group ? 1 : 0}"><div class="tree-link${sel ? ' selected' : ''}">${toggle}<span class="tree-icon">${icon(group ? 'folder' : 'file', 'sm')}</span><span class="tree-label ellipsis">${esc(label)}</span>${act}</div>${inner}</li>`;
}

export default function render(spec, ctx = {}) {
  const roots = spec.data?.tree || spec.data?.nodes || spec.data?.rows || [];
  const view = spec.view || {};
  const title = spec.data?.title || metaOf(spec).name || 'Tree';
  const actions = spec.data?.actions || [{ label: 'Add Child', primary: true }, { label: 'Edit' }, { label: 'Rename' }, { label: 'Delete' }];
  if (!Array.isArray(roots)) throw new Error('tree renderer: data.tree must be an array of nodes');
  if (!roots.length && !spec.view?.state) ctx.warn?.('tree: no nodes; rendering empty state');
  const head = viewHead(spec, ctx, { view: 'tree', label: spec.data?.title || undefined, filters: false, sort: false });
  const toolbar = `<div class="tree-toolbar" data-ui="tree.toolbar"><button type="button" class="btn btn-default btn-sm" data-ui="tree.collapse-all">Collapse All</button><button type="button" class="btn btn-default btn-sm" data-ui="tree.expand-all">Expand All</button></div>`;
  const body = roots.length ? `<ul class="tree-root" data-ui="tree.root">${roots.map((r) => node(r, view, 0, actions)).join('')}</ul>` : `<div class="tree-empty text-muted" data-ui="tree.empty">No items to show</div>`;
  return { head, main: `${CSS}<div class="desk-page tree-page" data-ui="tree.page">${toolbar}${body}</div>`, title };
}
