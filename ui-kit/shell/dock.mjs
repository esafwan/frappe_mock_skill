// Dock rail renderer. Generic: every label, icon and route comes from data (ctx.dock).
// Markup reference: components/dock/component.html (class names and data-ui hooks).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../kit-lib/util.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
let SYMS = null;

// id -> full <symbol> markup. Lucide sprite plus the "-soft" rail symbols captured in the reference page.
export function loadSymbols() {
  if (SYMS) return SYMS;
  SYMS = new Map();
  const grab = (txt) => { for (const m of txt.matchAll(/<symbol\b[^>]*\bid="([^"]+)"[\s\S]*?<\/symbol>/g)) if (!SYMS.has(m[1])) SYMS.set(m[1], m[0]); };
  for (const f of ['tokens/icons/sprite.svg.html', 'pages/desk-form.html']) {
    const p = path.join(KIT, f);
    if (fs.existsSync(p)) grab(fs.readFileSync(p, 'utf8'));
  }
  return SYMS;
}

// Rail icon id for a dock item icon name: prefer the "-soft" variant, then the plain icon, then a neutral glyph.
export function railIcon(name) {
  const s = loadSymbols();
  const n = String(name || '').replace(/^icon-/, '');
  for (const id of [`icon-${n}`, `icon-${n.replace(/-soft$/, '')}-soft`, `icon-${n}-soft`]) if (n && s.has(id)) return id;
  return s.has('icon-layout-grid') ? 'icon-layout-grid' : 'icon-circle';
}

const DEFAULT_LOGO = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="28" fill="#7B808A"/><rect x="30" y="30" width="40" height="40" rx="8" fill="#fff"/></svg>');
const initial = (u) => esc((u?.full_name || u?.name || u?.email || '?').trim().charAt(0).toUpperCase());

// dock: { logo, title, items:[{label, icon, route, unread, active, hidden}], utilities:[{label, icon}] }
export function renderDock({ dock = {}, app, user } = {}) {
  let n = 1;
  const items = (dock.items || []).filter((i) => !i.hidden);
  const hasActive = items.some((i) => i.active);
  const act = (i) => (hasActive ? !!i.active : app != null && (i.label === app || i.link_to === app));
  const btn = (i) => {
    const on = act(i);
    const dot = i.unread ? `<span class="dock-item-unread" aria-label="Unread" style="position:absolute;top:6px;right:8px;width:7px;height:7px;border-radius:50%;background:var(--red-500,#e24c4c)"></span>` : '';
    return `<button class="dock-item ${on ? 'active' : ''} " aria-label="${esc(i.label)}"${on ? ' aria-current="page"' : ''}${i.route ? ` data-route="${esc(i.route)}"` : ''} data-ui="dock.button-${++n}"><span class="dock-item-icon"${i.unread ? ' style="position:relative"' : ''}><svg class="icon icon-rail" aria-hidden="true"><use href="#${railIcon(i.icon)}"></use></svg>${dot}</span><span class="dock-item-label">${esc(i.label)}</span></button>`;
  };
  const utils = (dock.utilities || []).length
    ? `<div class="dock-utils">${dock.utilities.map((u) => `<button class="dock-item" aria-label="${esc(u.label)}" data-ui="dock.button-${++n}"><span class="dock-item-icon"><svg class="icon icon-rail" aria-hidden="true"><use href="#${railIcon(u.icon)}"></use></svg></span></button>`).join('')}</div>`
    : '';
  const title = dock.title ?? '';
  return `<div class="dock" id="desk-dock" role="navigation" aria-label="Apps" aria-hidden="false" data-ui="dock">
<div class="dock-logo"><a class="shell-header" href="#" aria-label="All apps" data-ui="dock.link-1"><div class="header-logo"><img src="${esc(dock.logo || DEFAULT_LOGO)}" alt="${esc(title)}"></div><div class="title-container"><div class="header-title">${esc(title)}</div></div></a></div>
${utils}<div class="dock-items">${items.map(btn).join('')}</div>
<div class="dock-user" aria-haspopup="menu" aria-expanded="false"><button class="dock-item dock-user-button" aria-label="User Menu" data-ui="dock.button-${++n}"><span class="avatar avatar-medium"><div class="avatar-frame standard-image" style="background-color: var(--dark-green-avatar-bg); color: var(--dark-green-avatar-color)">${initial(user)}</div></span></button></div>
</div>`;
}
