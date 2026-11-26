// Post-render overlay drawing, shared by every page. Takes the finished document and draws what the page
// renderer did not: pinned states, open menus (popover layer), dialogs (modal layer), toasts (toast layer).
// Generic: no doctype/app/brand names. Deterministic: no clocks, no randomness.
import { esc } from './util.mjs';
import { applyStates, locate, STATES } from './states.mjs';
import { layerCss, wrapOverlays, toastHtml } from './layers.mjs';
import { renderMenu } from '../shell/menus.mjs';
import { loadSymbols } from '../shell/dock.mjs';

/** Where each menu_open target hangs: selectors tried in order. No match falls back to the top right under the page head. */
const ANCHORS = {
  'page.menu': ['[data-ui="page.menu-button"]', '.standard-actions .menu-btn-group'],
  'form.menu': ['[data-ui="page.menu-button"]', '.standard-actions .menu-btn-group'],
  'workspace.menu': ['[data-ui="page.menu-button"]'],
  'page.actions': ['.actions-btn-group', '.standard-actions button'],
  'bulk-actions': ['.actions-btn-group', '.standard-actions button'],
  'page.primary': ['[data-ui="form.primary-action"]', '[data-ui="list.primary-action"]', '.btn-primary'],
  'page.view_switcher': ['[data-ui="list.view-switcher"]'],
  'view-switcher': ['[data-ui="list.view-switcher"]'],
  'page.sort': ['[data-ui="list.sort"]'],
  'page.filter': ['[data-ui="list.filter"]'],
  'page.group_by': ['[data-ui="list.standard-filters"]'],
  'page.settings': ['[data-ui="page.menu-button"]'],
  'page.page_length': ['[data-ui="list.paging"]'],
  'navbar.search': ['[data-ui="navbar.search"]'],
  'navbar.notifications': ['[data-ui="navbar.button-2"]'],
  notifications: ['[data-ui="navbar.button-2"]'],
  'navbar.help': ['[data-ui="navbar.button-2"]'],
  help: ['[data-ui="navbar.button-2"]'],
  'navbar.user': ['.desktop-avatar', '.dock-user', '.dock-utilities .avatar'],
  user: ['.desktop-avatar', '.dock-user', '.dock-utilities .avatar'],
  'sidebar.user': ['.desktop-avatar', '.dock-user', '.dock-utilities .avatar'],
  'sidebar.header': ['[data-ui="sidebar.link-1"]'],
  'dock.more': ['[data-ui="dock"]'],
  'workspace.block_picker': ['[data-ui="workspace.grid"]'],
};
const PREFIX_ANCHORS = [
  ['button_group:', (a) => [`[data-ui="form.group.${a}"]`, `[data-ui="list.button-group.${a}"]`]],
  ['row_actions:', (a) => [`[data-ui="list.row.${a}"] .list-row-action-col`, `[data-ui="list.row.${a}"]`]],
  ['column:', (a) => [`[data-ui="list.column.${a}"]`, `[data-fieldname="${a}"]`]],
  ['column-header:', (a) => [`[data-ui="list.column.${a}"]`, `[data-fieldname="${a}"]`]],
  ['field:', (a) => [`[data-fieldname="${a}"] .control-input`, `[data-fieldname="${a}"]`]],
  ['chart:', () => ['[data-ui="chart.menu"]']],
  ['group_by:', () => ['[data-ui="list.standard-filters"]']],
];
const anchorsFor = (target) => {
  if (ANCHORS[target]) return ANCHORS[target];
  const p = PREFIX_ANCHORS.find(([k]) => target.startsWith(k));
  return p ? p[1](target.slice(p[0].length)) : [];
};

/** Tiny static positioner: puts each [data-anchor] popover under its anchor element, else top right. Same text every build. */
const POSITION_JS = `(function(){function p(){var L=document.querySelectorAll('[data-layer="popover"] [data-anchor]');for(var i=0;i<L.length;i++){var e=L[i],a=null,s;try{s=JSON.parse(e.getAttribute('data-anchor'))}catch(x){s=[]}for(var j=0;j<s.length&&!a;j++){try{a=document.querySelector(s[j])}catch(x){}}var w=e.offsetWidth,vw=document.documentElement.clientWidth;if(a){var r=a.getBoundingClientRect();var l=r.left;if(l+w>vw-8)l=Math.max(8,r.right-w);e.style.left=l+'px';e.style.top=(r.bottom+4)+'px';}else{e.style.left=Math.max(8,vw-w-16)+'px';e.style.top='56px';}e.style.visibility='visible';}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',p);else p();window.addEventListener('load',p);})();`;

const POPOVER_CSS = `[data-layer="popover"]{position:fixed;inset:0;pointer-events:none}[data-layer="popover"] [data-anchor]{position:fixed;visibility:hidden;pointer-events:auto;min-width:180px;max-width:360px}[data-layer="popover"] .dropdown-menu{position:static;display:block;float:none;margin:0}[data-layer="popover"] .menu-popover{background:var(--surface-white,#fff);border:1px solid var(--outline-gray-2,#e2e2e2);border-radius:8px;box-shadow:var(--shadow-3,0 8px 24px rgba(0,0,0,.12));padding:4px}[data-layer="popover"] .dropdown-item,.workspace-page .dropdown-item{display:flex;align-items:center;gap:8px}[data-layer="popover"] .dropdown-item .icon{flex:none}[data-layer="popover"] .dropdown-item kbd{margin-left:auto}[data-layer="popover"] .notifications-list .panel-header{display:flex;gap:12px;padding:8px 10px;border-bottom:1px solid var(--outline-gray-1,#ededed)}[data-layer="popover"] .notifications-category.active{font-weight:600}[data-layer="popover"] .notification-null-state{padding:12px 10px}[data-layer="popover"] .block-picker{display:grid;grid-template-columns:repeat(2,1fr);gap:4px;padding:8px}[data-layer="popover"] .block-picker-item{border:0;background:transparent;padding:6px 8px;text-align:left;border-radius:6px}.desk-alert{display:flex;align-items:center;gap:8px;background:var(--surface-white,#fff);border:1px solid var(--outline-gray-2,#e2e2e2);border-radius:8px;box-shadow:var(--shadow-3,0 8px 24px rgba(0,0,0,.12));padding:10px 14px;min-width:240px;font-size:var(--text-base,14px)}.desk-alert .indicator{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ink-gray-5,#888)}.desk-alert .indicator.green{background:var(--ink-green-3,#30a66d)}.desk-alert .indicator.red{background:var(--ink-red-3,#e03636)}.desk-alert .indicator.orange{background:var(--ink-amber-3,#db7706)}.desk-alert .indicator.blue{background:var(--ink-blue-3,#318ad8)}.layer-modal .modal-dialog{margin:0;width:100%;max-width:var(--dlg-w,520px)}.layer-modal .modal-content{background:var(--surface-white,#fff);border-radius:12px;box-shadow:var(--shadow-3,0 8px 24px rgba(0,0,0,.2));border:0}.layer-modal .modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--outline-gray-1,#ededed)}.layer-modal .modal-title{font-size:var(--text-lg,16px);font-weight:600;margin:0}.layer-modal .modal-body{padding:16px 20px}.layer-modal .modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid var(--outline-gray-1,#ededed)}`;

/** Visible styling for pinned states. Scoped to the markers this module and the list renderer add. */
const STATE_CSS = `<style data-ui="states.css">[data-state="hover"],.is-hover{background-color:var(--surface-gray-2,#f3f3f3)!important}.list-row-container[data-state="hover"] .level-right,.list-row-container[data-state="hover"]>.list-row,.list-row-container.is-hover>.list-row{background-color:var(--surface-gray-2,#f3f3f3)}[data-state="focus"],.is-focused{outline:2px solid var(--outline-gray-4,#999);outline-offset:1px;border-radius:6px}[data-state="disabled"][aria-disabled="true"],.disabled[data-state="disabled"]{opacity:.5;pointer-events:none;cursor:not-allowed}[data-state="loading"]{position:relative;opacity:.7;pointer-events:none}[data-state="loading"] .es-spinner,[data-state="loading"].loading .es-spinner{display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;margin-right:6px;vertical-align:middle}[data-state="active"][aria-pressed="true"]{background-color:var(--surface-gray-3,#ebebeb)!important;box-shadow:inset 0 0 0 1px var(--outline-gray-3,#ccc)}</style>`;

const DLG_W = { small: 380, default: 520, large: 720, 'extra-large': 940 };
const colorOf = (c) => String(c || '').replace(/[^a-z-]/gi, '');

function actionBtn(a, fallbackStyle, ui) {
  if (!a) return '';
  const o = typeof a === 'string' ? { label: a } : a;
  const style = o.style || fallbackStyle;
  return `<button type="button" class="btn btn-sm ${style === 'primary' ? 'btn-primary' : style === 'danger' ? 'btn-danger' : 'btn-default'}" data-ui="${ui}">${esc(o.label)}</button>`;
}

/** Minimal generic dialog chrome for the modal layer (title, message, simple field rows, actions). */
export function dialogHtml(o = {}, n = 0) {
  const kind = o.kind || 'dialog';
  const title = o.title || (kind === 'confirm' ? 'Confirm' : kind === 'msgprint' ? 'Message' : '');
  const lines = String(o.message || '').split('\n').filter((l) => l !== '');
  const msg = lines.length ? `<div class="msgprint">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>` : '';
  const vals = o.values || {};
  const fields = (o.fields || []).filter((f) => f.fieldname && !/Break$/.test(f.fieldtype || '')).map((f) => `<div class="frappe-control" data-fieldtype="${esc(f.fieldtype || 'Data')}" data-fieldname="${esc(f.fieldname)}"><div class="form-group"><label class="control-label${f.reqd ? ' reqd' : ''}">${esc(f.label || f.fieldname)}</label><div class="control-input"><input type="text" class="form-control" value="${esc(vals[f.fieldname] ?? f.default ?? '')}" readonly></div></div></div>`).join('');
  const primary = o.primary_action ?? (kind === 'confirm' ? 'Yes' : kind === 'msgprint' ? null : kind === 'quick_entry' ? 'Save' : 'Submit');
  const secondary = o.secondary_action ?? (kind === 'confirm' ? 'No' : null);
  const ind = o.indicator ? `<span class="indicator ${colorOf(o.indicator)}"></span> ` : '';
  const foot = [actionBtn(secondary, 'default', `dialog.${n}.secondary`), actionBtn(primary, 'primary', `dialog.${n}.primary`)].filter(Boolean).join('');
  return `<div class="modal-dialog modal-${esc(o.size || 'default')}" style="--dlg-w:${DLG_W[o.size] || DLG_W.default}px" role="document" data-ui="dialog.${n}" data-dialog-kind="${esc(kind)}"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">${ind}${esc(title)}</h4></div><div class="modal-body">${msg}${fields}</div>${foot ? `<div class="modal-footer">${foot}</div>` : ''}</div></div>`;
}

/** Add `show` / aria-expanded to the element a `ui:<id>` menu target names. Returns [html, found]. */
function openUi(html, target) {
  const h = locate(html, target);
  if (!h) return [html, false];
  let t = h.tag.replace(/\saria-expanded="[^"]*"/, '');
  t = t.replace(/>$/, ' aria-expanded="true">');
  t = /\sclass="/.test(t) ? t.replace(/\sclass="([^"]*)"/, (_, c) => ` class="${c.split(/\s+/).includes('show') ? c : `${c} show`}"`) : t.replace(/^<([\w-]+)/, '<$1 class="show"');
  return [html.slice(0, h.index) + t + html.slice(h.index + h.tag.length), true];
}

/** Add sprite symbols for icons used by injected markup. */
export function addSymbols(html, extra = html) {
  const have = new Set([...html.matchAll(/<symbol[^>]*\sid="(icon-[^"]+)"/g)].map((m) => m[1]));
  const want = new Set();
  for (const m of extra.matchAll(/href="#(icon-[A-Za-z0-9_-]+)"/g)) if (!have.has(m[1])) want.add(m[1]);
  if (!want.size) return html;
  const syms = loadSymbols();
  const add = [...want].sort().map((id) => syms.get(id)).filter(Boolean).join('');
  return add ? html.replace(/(<svg[^>]*id="frappe-symbols"[^>]*>)/, `$1${add}`) : html;
}

/**
 * Draw every overlay the page did not. `ctx` is the engine ctx (overlays, useOverlays, _report).
 * Returns { html, drawn: {states, menus, dialogs, toasts} }.
 */
export function drawOverlays(html, ctx, layerMap = {}) {
  const unused = () => ctx._report().unused;
  const drawn = { states: 0, menus: 0, dialogs: 0, toasts: 0 };

  // states first: they pin attributes on existing markup
  const st = unused().filter((o) => o.type === 'state');
  if (st.length) {
    const { slots, applied } = applyStates(html, st);
    html = slots[0];
    ctx.useOverlays('state', (x) => applied.includes(x));
    drawn.states = applied.length;
  }

  const items = []; // {type, html}
  for (const o of unused().filter((x) => x.type === 'menu_open')) {
    if (String(o.target).startsWith('ui:')) {
      const [h, ok] = openUi(html, o.target);
      if (ok) { html = h; ctx.useOverlays('menu_open', (x) => x === o); drawn.menus++; }
      continue;
    }
    const body = renderMenu(o);
    if (!body) continue;
    ctx.useOverlays('menu_open', (x) => x === o);
    items.push({ type: 'menu_open', html: `<div data-anchor='${JSON.stringify(anchorsFor(o.target)).replace(/'/g, '&#39;')}' data-popover-target="${esc(o.target)}">${body}</div>` });
    drawn.menus++;
  }
  let n = 0;
  for (const o of unused().filter((x) => x.type === 'dialog')) {
    ctx.useOverlays('dialog', (x) => x === o);
    items.push({ type: 'dialog', html: dialogHtml(o, n++) });
    drawn.dialogs++;
  }
  for (const o of unused().filter((x) => x.type === 'toast')) {
    ctx.useOverlays('toast', (x) => x === o);
    items.push({ type: 'toast', html: toastHtml({ message: o.message, indicator: o.indicator, title: o.title }) });
    drawn.toasts++;
  }
  if (/data-state="(hover|focus|disabled|loading)"|data-state="active"[^>]*aria-pressed|is-hover|is-focused/.test(html) && !html.includes('data-ui="states.css"')) html = html.includes('</head>') ? html.replace('</head>', `${STATE_CSS}</head>`) : html + STATE_CSS;
  if (!items.length) return { html, drawn };

  const layers = wrapOverlays(items, layerMap);
  const css = `<style data-ui="layers.css">${layerCss()}${POPOVER_CSS}</style>`;
  const inject = `${css}${layers.popover}${layers.modal}${layers.toast}${layers.popover ? `<script data-ui="layers.position">${POSITION_JS}</script>` : ''}`;
  html = html.replace(/<div data-ui="layer-popover"><\/div><div data-ui="layer-modal"><\/div><div data-ui="layer-toast"><\/div>/, '');
  html = html.includes('</body>') ? html.replace('</body>', `${inject}\n</body>`) : html + inject;
  return { html: addSymbols(html, inject), drawn };
}

export { STATES };
