// Mobile (<768px) and collapsed-rail variants of the desk shell. Generic: no doctype/app/brand names.
// Pure post-processor over the document returned by renderShell(), so it needs no change to shell internals:
//   applyMobile(html, ctx) -> html
// ctx.chrome.mobile_sidebar: 'closed' (default, off-canvas) | 'open' (drawer plus dimming overlay).
// ctx.chrome.sidebar === 'collapsed' on desktop keeps the 48px icon rail (CSS from frappe-desk.css).
// Layout CSS comes from tokens/css/frappe-desk.css (@media max-width 767.98px); this file adds only the
// toggle bar and a no-horizontal-overflow guard.
import { esc } from '../kit-lib/util.mjs';

const MARK = 'data-ui="shell.mobile"';

export function isMobile(ctx = {}) {
  const v = ctx.viewport;
  if (v && typeof v === 'object') return (Number(v.width) || 1440) < 768 || /^mobile$/i.test(v.device || '');
  if (/^mobile$/i.test(v || '')) return true;
  return (parseInt(String(v || '').split('x')[0], 10) || 1440) < 768;
}

/** Resolved shell state: { mobile, rail, drawer: 'open'|'closed'|null } (drawer only on mobile). */
export function shellState(ctx = {}) {
  const chrome = ctx.chrome || {};
  const mobile = isMobile(ctx);
  const hidden = chrome.sidebar === false || chrome.sidebar === 'hidden';
  return {
    mobile,
    rail: !mobile && !hidden && chrome.sidebar === 'collapsed',
    drawer: mobile && !hidden ? (chrome.mobile_sidebar === 'open' ? 'open' : 'closed') : null,
  };
}

export const MOBILE_CSS = `@media (max-width:767.98px){body.mobile-view{overflow-x:hidden}body.mobile-view .main-section{min-width:0;width:100%}body.mobile-view .mobile-bar{display:flex}body.mobile-view .layout-side-section{display:none}body.mobile-view .body-sidebar-container{position:fixed;top:44px;left:0;bottom:0;height:calc(100vh - 44px);width:0;z-index:1020;overflow:visible}body.mobile-view .body-sidebar-container.expanded{width:100%}body.mobile-view .body-sidebar-container .body-sidebar{height:100%;top:0;bottom:0}body.mobile-view .body-sidebar-container:not(.expanded) .body-sidebar{display:none}body.mobile-view .body-sidebar-container .overlay{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:1021}body.mobile-view .body-sidebar-container.expanded .body-sidebar{z-index:1022;background:var(--surface-gray-1,#f8f8f8)}}
.mobile-bar{display:none;align-items:center;gap:8px;height:44px;padding:0 12px;border-bottom:1px solid var(--outline-gray-1);background:var(--surface-white,#fff)}
.mobile-bar .sidebar-toggle{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;color:var(--ink-gray-7)}
.mobile-bar .sidebar-toggle .icon{width:16px;height:16px}
.mobile-bar .mobile-title{font-size:var(--text-base,14px);font-weight:600;color:var(--ink-gray-8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`;

/** Off-canvas / collapsed-rail transform of a renderShell document. Idempotent. */
export function applyMobile(html, ctx = {}) {
  if (typeof html !== 'string' || html.includes(MARK)) return html;
  const st = shellState(ctx);
  let out = html;
  if (st.drawer) {
    const open = st.drawer === 'open';
    out = out.replace(/<div class="body-sidebar-container([^"]*)"([^>]*)>/, (m, cls, rest) => {
      const c = cls.split(/\s+/).filter((x) => x && x !== 'expanded');
      if (open) c.push('expanded');
      return `<div class="body-sidebar-container${c.length ? ' ' + c.join(' ') : ''}"${rest} data-state="${st.drawer}">${open ? '<div class="overlay" data-ui="sidebar.overlay"></div>' : ''}`;
    });
    const title = esc(ctx.title || ctx.workspace || ctx.app || '');
    const bar = `<div class="mobile-bar" ${MARK}><button class="btn-reset sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="${open}" data-ui="shell.menu-toggle"><svg class="icon icon-md" aria-hidden="true"><use href="#icon-menu"></use></svg></button><span class="mobile-title" data-ui="shell.mobile-title">${title}</span></div>`;
    out = out.replace(/(<div class="main-section">)/, `$1${bar}`);
    out = out.replace(/<body([^>]*?) class="([^"]*)"/, (m, a, c) => `<body${a} class="${[...new Set(c.split(/\s+/).concat('mobile-view', `sidebar-${st.drawer}`))].join(' ')}" data-sidebar-state="${st.drawer}"`);
  } else if (st.mobile) {
    out = out.replace(/<body([^>]*?) class="([^"]*)"/, (m, a, c) => `<body${a} class="${[...new Set(c.split(/\s+/).concat('mobile-view'))].join(' ')}"`);
  } else if (st.rail) {
    out = out.replace(/<body([^>]*?) class="([^"]*)"/, (m, a, c) => `<body${a} class="${[...new Set(c.split(/\s+/).concat('sidebar-collapsed'))].join(' ')}" data-sidebar-state="rail"`);
  }
  if (st.mobile || st.rail) out = out.replace('</head>', `<style ${MARK}>${MOBILE_CSS}</style></head>`);
  return out;
}
