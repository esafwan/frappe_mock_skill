// Empty, loading and error state helper for every view. Generic, pure, deterministic.
// emptyState({kind:'empty'|'loading'|'error'|'no-results', view, title, message, icon, action:{label,ui}, minHeight}) -> html
import { esc } from './util.mjs';

export const KINDS = ['empty', 'loading', 'error', 'no-results'];
const DEFAULTS = {
  empty: { title: 'Nothing to show', message: '' },
  'no-results': { title: 'No results found', message: 'Try changing the filters or the search.' },
  loading: { title: 'Loading', message: '' },
  error: { title: 'Something went wrong', message: 'The data could not be loaded.' },
};
const GLYPH = {
  empty: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  'no-results': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  loading: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
};

export const EMPTY_CSS = '<style data-ui="empty.css">.view-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;box-sizing:border-box;width:100%;padding:40px 16px;color:var(--text-muted,#6c7680)}.view-state .view-state__icon{width:32px;height:32px;opacity:.7}.view-state .view-state__title{font-size:14px;font-weight:500;color:var(--text-color,#171717)}.view-state .view-state__msg{font-size:12px;margin:0}.view-state[data-kind=error] .view-state__icon{color:var(--red-500,#e24c4c);opacity:1}.view-state[data-kind=loading] .view-state__icon{animation:view-state-spin 1s linear infinite}@keyframes view-state-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.view-state[data-kind=loading] .view-state__icon{animation:none}}.view-state .btn{margin-top:8px}</style>';

/** Normalise a spec/state value ('empty', {kind,...}) into options. Unknown kinds fall back to 'empty'. */
export function normalizeState(s) {
  const o = typeof s === 'string' ? { kind: s } : { ...(s || {}) };
  if (!KINDS.includes(o.kind)) o.kind = 'empty';
  return o;
}

export function emptyState(opts = {}) {
  const o = normalizeState(opts), d = DEFAULTS[o.kind];
  const title = o.title ?? d.title, msg = o.message ?? d.message;
  const icon = `<svg class="view-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPH[o.kind]}</svg>`;
  const action = o.action?.label ? `<button type="button" class="btn btn-sm btn-default" data-ui="${esc(o.action.ui || 'view-state.action')}">${esc(o.action.label)}</button>` : '';
  const ui = `${o.view ? esc(o.view) + '.' : ''}${o.kind}`;
  const role = o.kind === 'error' ? 'alert' : 'status';
  return `${o.css === false ? '' : EMPTY_CSS}<div class="view-state view-state--${o.kind}" data-ui="${ui}" data-kind="${o.kind}" role="${role}"${o.kind === 'loading' ? ' aria-busy="true"' : ''} style="min-height:${Number(o.minHeight) || 240}px">${icon}<div class="view-state__title">${esc(title)}</div>${msg ? `<p class="view-state__msg">${esc(msg)}</p>` : ''}${action}</div>`;
}
export default emptyState;
