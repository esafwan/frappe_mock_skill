// Dock rail renderer. Generic: every label, icon and route comes from data (ctx.dock).
// Markup reference: components/dock/component.html (class names and data-ui hooks).
import { esc } from '../kit-lib/util.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSymbols, resolveIcon, misses } from './icons.mjs';

export { loadSymbols };
export const railIcon = (name) => resolveIcon(name).id;

// Logo: a URL/data URI renders as an image; a bare icon name (or nothing) renders a real lucide glyph, never a blank square.
const isUrl = (s) => /^(data:|https?:|\/|\.{0,2}\/)|\.(svg|png|jpe?g|webp)(\?|$)/i.test(String(s || ''));
const logoHtml = (logo, title) => (isUrl(logo)
  ? `<img src="${esc(logo)}" alt="${esc(title)}">`
  : `<span class="dock-logo-glyph" role="img" aria-label="${esc(title)}">${`<svg class="icon icon-rail" aria-hidden="true"><use href="#${resolveIcon(logo || 'layout-grid').id}"></use></svg>`}</span>`);
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
<div class="dock-logo"><a class="shell-header" href="#" aria-label="All apps" data-ui="dock.link-1"><div class="header-logo">${logoHtml(dock.logo, title)}</div><div class="title-container"><div class="header-title">${esc(title)}</div></div></a></div>
${utils}<div class="dock-items">${items.map(btn).join('')}</div>
<div class="dock-user" aria-haspopup="menu" aria-expanded="false"><button class="dock-item dock-user-button" aria-label="User Menu" data-ui="dock.button-${++n}"><span class="avatar avatar-medium"><div class="avatar-frame standard-image" style="background-color: var(--dark-green-avatar-bg); color: var(--dark-green-avatar-color)">${initial(user)}</div></span></button></div>
</div>`;
}

// Node self-test: node shell/dock.mjs --test
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--test')) {
  const s = loadSymbols();
  const bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  ok(s.size > 1500, `full lucide set loaded (got ${s.size})`);
  for (const n of ['shopping-cart', 'ShoppingCart', 'lucide:users', 'icon-wallet', 'file_text']) ok(resolveIcon(n, { warn: false }).hit, `resolves ${n}`);
  ok(!resolveIcon('zz-not-an-icon', { warn: false }).hit, 'miss reported as miss');
  const html = renderDock({ dock: { title: 'App', items: [{ label: 'A', icon: 'Wallet' }, { label: 'B', icon: 'zz-nope' }] } });
  for (const m of html.matchAll(/<use href="#([^"]+)"/g)) ok(s.has(m[1]), `dock <use> #${m[1]} has a symbol`);
  ok(!/<rect width="100" height="100" rx="28"/.test(decodeURIComponent(html)), 'default logo is not a blank square');
  ok(/class="dock-logo-glyph"/.test(html), 'default logo is a real icon glyph');
  if (bad.length) { console.error('FAIL\n' + bad.join('\n')); process.exit(1); }
  console.log(`icons ok: ${s.size} symbols, ${misses.length} expected miss(es)`);
}
