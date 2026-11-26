// Generic Workspace/Sidebar renderer. Input: Sidebar JSON (v16 Sidebar / Workspace Sidebar shape).
// items may be flat (use `child` flag, v16 nest_section_items) or already nested via `children`.
// Markup follows frappe sidebar_item.html (V16-FACTS section 9). No brand/doctype names here.
import { esc } from '../kit-lib/util.mjs';
import { icon } from '../kit-lib/icons.mjs';
import { permsOn, applySidebar } from '../kit-lib/perms.mjs';

const svg = (name, extra = '') => icon(name, 'sm', { class: extra });

// v16 nest_section_items: Section Break starts a section; following items with child=1 nest under it.
export function nestItems(items = []) {
  const out = []; let section = null;
  for (const it of items) {
    if (it.children) { out.push(it); section = it.type === 'Section Break' ? it : null; continue; }
    if (it.type === 'Section Break') { section = { ...it, children: [] }; out.push(section); continue; }
    if (it.child && section) { section.children.push({ ...it, parent: section.label }); continue; }
    out.push({ ...it }); if (it.type !== 'Spacer') section = null;
  }
  return out;
}

// Sidebar Item Group (older shape): { type:'Sidebar Item Group', links:[{report|label,...}] } -> section of Report links
function normalize(it) {
  if (it.type === 'Sidebar Item Group') {
    const links = it.links || it.children || [];
    return { ...it, type: 'Section Break', children: links.map((l) => normalize({
      type: 'Link', label: l.label || l.report, link_type: l.link_type || 'Report', link_to: l.link_to || l.report, icon: l.icon, child: 1 })) };
  }
  return it.children ? { ...it, children: it.children.map(normalize) } : it;
}

export function matchesActive(it, active) {
  if (!active || it.type !== 'Link') return false;
  if (typeof active === 'string') return it.link_to === active || it.label === active;
  if (active.link_type && it.link_type !== active.link_type) return false;
  if (active.link_to !== undefined) return it.link_to === active.link_to;
  if (active.doctype) return it.link_type === 'DocType' && it.link_to === active.doctype;
  if (active.label) return it.label === active.label;
  return false;
}

const hasActive = (it, active) => matchesActive(it, active) || (it.children || []).some((k) => hasActive(k, active));

export function renderSidebar(sidebarJson, { active = null, collapsed = false, ctx = null } = {}) {
  let items = normalize({ children: nestItems(sidebarJson?.items || []) }).children;
  if (permsOn(ctx)) items = applySidebar(ctx, items); // role perms: hide items whose DocType the role cannot read (also item.roles)
  let n = 0;
  const drop = (state) => `<button class="btn-reset drop-icon" data-state="${state}" data-ui="sidebar.button-${n++}">${svg('chevron-right', 'chevron')}</button>`;

  const row = (it, parentIndent) => {
    if (it.hidden) return '';
    const sect = it.type === 'Section Break';
    const kids = (it.children || []).filter((k) => !k.hidden);
    if (it.type === 'Spacer') return `<div class="sidebar-item-container" data-ui="sidebar.spacer-${n++}"><div class="standard-sidebar-item"><div class="item-anchor" style="pointer-events:none"></div></div></div>`;
    if (sect && !kids.length && !it.indent) return ''; // empty section skipped
    const act = matchesActive(it, active);
    const open = sect && !it.keep_closed && (hasActive(it, active) || !it.collapsible && !it.keep_closed);
    const asLink = !sect || it.indent;      // Section Break with indent=1 renders as a link row
    const cls = ['sidebar-item-container', sect ? 'section-item' : ''].join(' ').trim();
    const std = ['standard-sidebar-item', it.indent ? 'indent' : '', act ? 'active-sidebar' : ''].filter(Boolean).join(' ');
    const showIcon = !it.show_arrow && !(it.child && parentIndent);
    const ic = showIcon ? `<span class="sidebar-item-icon" item-icon="${esc(it.icon || 'list')}">${svg(it.icon || 'list', 'current-color')}</span>` : '';
    const lead = it.show_arrow ? `<span class="sidebar-item-icon">${svg('chevron-right', 'chevron')}</span>` : '';
    const label = `<span class="sidebar-item-label">${esc(it.label)}</span>`;
    const sfx = it.keyboard_shortcut ? `<span class="sidebar-item-suffix"><span class="keyboard-shortcut">${esc(it.keyboard_shortcut)}</span></span>` : '';
    const badge = it.badge != null ? `<span class="sidebar-item-suffix"><span class="es-badge es-badge-gray">${esc(it.badge)}</span></span>` : '';
    const ctl = (sect && (it.collapsible || kids.length) && !it.show_arrow) ? drop(open ? 'open' : 'closed') : '';
    const control = it.show_arrow ? '' : `<div class="sidebar-item-control">${ctl}</div>`;
    let head;
    if (sect && !asLink) {
      head = `<div class="${std}"><div class="divider hidden"></div><div class="item-anchor section-break" data-ui="sidebar.section-${n++}">${label}${control}</div></div>`;
    } else {
      const href = it.link_type === 'URL' && it.url ? ` href="${esc(it.url)}" target="${it.open_in_new_tab ? '_blank' : ''}"` : ' href="#" target=""';
      head = `<div class="${std}"><a${href} class="item-anchor" data-link-type="${esc(it.link_type || '')}" data-ui="sidebar.link-${n++}">${lead}${ic}${label}${sfx}${badge}${control}</a></div>`;
    }
    const nested = kids.length ? `<div class="sidebar-child-item nested-container${sect && !open ? ' hidden' : ''}">${kids.map((k) => row(k, !!it.indent)).join('')}</div>` : '<div class="sidebar-child-item nested-container"></div>';
    return `<div class="${cls}" item-name="${esc(it.label)}" data-id="${esc(it.label)}">${head}${nested}</div>`;
  };

  if (collapsed) {
    const rail = items.filter((i) => i.type !== 'Spacer' && !i.hidden).map((it) => {
      const act = hasActive(it, active);
      return `<div class="sidebar-item-container" item-name="${esc(it.label)}" data-id="${esc(it.label)}"><div class="standard-sidebar-item${act ? ' active-sidebar' : ''}"><a href="#" class="item-anchor" title="${esc(it.label)}" data-link-type="${esc(it.link_type || '')}" data-ui="sidebar.rail-${n++}"><span class="sidebar-item-icon" item-icon="${esc(it.icon || 'list')}">${svg(it.icon || 'list', 'current-color')}</span></a></div></div>`;
    }).join('');
    return `<div class="sidebar-items sidebar-collapsed">${rail}</div>`;
  }
  return `<div class="sidebar-items">${items.map((i) => row(i, false)).join('')}</div>`;
}
