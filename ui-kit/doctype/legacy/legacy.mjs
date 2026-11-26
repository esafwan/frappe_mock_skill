// Legacy path: regex splicing of pages/desk-form.html (kept behind --legacy). Frozen; use renderers/form/index.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, formatValue } from '../lib/control.mjs';
import { buildLayout } from '../lib/layout.mjs';
import { applyCustomizations } from '../lib/customize.mjs';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.resolve(HERE, '..');
const snake = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ---- args
const a = process.argv.slice(2);
const opt = { metaDirs: [], tab: 0, locale: 'en-IN' };
let file;
for (let i = 0; i < a.length; i++) {
  const k = a[i];
  if (k === '--doc') opt.doc = a[++i];
  else if (k === '--meta-dir') opt.metaDirs.push(a[++i]);
  else if (k === '--custom') opt.custom = a[++i];
  else if (k === '--locale') opt.locale = a[++i];
  else if (k === '--tab') opt.tab = Number(a[++i]);
  else if (k === '--out') opt.out = a[++i];
  else if (k === '--legacy') {}
  else if (k === '--workspace') opt.workspace = a[++i];
  else if (!file) file = k;
}
if (!file) { console.error('usage: render-doctype.mjs <doctype.json> [--doc f] [--meta-dir d]... [--custom f] [--locale l] [--tab n] [--out f] [--workspace name]'); process.exit(1); }
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// ---- field renderers
const renderers = {};
const fdir = path.join(HERE, 'fields');
for (const f of fs.readdirSync(fdir).filter((x) => x.endsWith('.mjs')).sort()) {
  const m = (await import(path.join(fdir, f))).default || {};
  for (const [k, fn] of Object.entries(m)) {
    if (renderers[k]) console.warn(`warn: duplicate fieldtype renderer "${k}" in fields/${f} ignored`);
    else renderers[k] = fn;
  }
}

// ---- meta loading
const searchDirs = [path.dirname(path.resolve(file)), ...opt.metaDirs.map((d) => path.resolve(d))];
const fx = path.join(HERE, 'fixtures');
if (fs.existsSync(fx)) for (const d of fs.readdirSync(fx)) if (d !== 'samples') searchDirs.push(path.join(fx, d));
const cache = {};
function loadMeta(name) {
  if (name in cache) return cache[name];
  let r = null;
  for (const d of searchDirs) {
    const p = path.join(d, snake(name) + '.json');
    if (fs.existsSync(p)) { r = readJson(p); break; }
  }
  return (cache[name] = r);
}

let meta = readJson(file);
let custom = opt.custom ? readJson(opt.custom) : [];
if (!Array.isArray(custom)) {
  if (custom.custom_fields) custom = custom.custom_fields;
  else custom = (custom[meta.name] || []).map(c => ({ dt: meta.name, ...c })); // map of doctype -> fields
}
meta = applyCustomizations(meta, custom, []);
const doc = opt.doc ? readJson(opt.doc) : {};
const doctype = meta.name;
// new (unsaved) doc: no name, or explicit __islocal
const isNew = doc.__islocal !== undefined ? !!doc.__islocal : !doc.name;
if (isNew) doc.__islocal = 1;

function renderField(df, ctx0 = {}) {
  const ctx = { value: doc[df.fieldname], doc, doctype, meta, locale: opt.locale, loadMeta, renderField, ...ctx0 };
  const fn = (df.fieldtype === 'Data' && df.options && renderers['Data:' + df.options]) || renderers[df.fieldtype];
  if (!fn) {
    return `<div class="frappe-control input-max-width" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}"><div class="form-group horizontal"><div class="clearfix"><label class="control-label">${esc(df.label ?? df.fieldname)}</label></div><div class="control-input-wrapper"><div class="control-input"><input type="text" class="form-control" disabled value="[${esc(df.fieldtype)}]" data-fieldname="${esc(df.fieldname)}"></div></div></div></div>`;
  }
  return fn(df, ctx);
}

// ---- layout
const layout = buildLayout(meta, doc);
if (isNew) {
  // Frappe hides these tabs on a new doc (Connections, Address & Contact, Overview, Items need a saved doc)
  const hideNew = new Set(['overview_tab', 'connections_tab', 'contact_and_address_tab', 'items_tab']);
  layout.tabs = layout.tabs.filter((t) => !hideNew.has(t.fieldname));
  // Customer: Accounting and Tax come before Settings
  const iSet = layout.tabs.findIndex((t) => t.fieldname === 'settings_tab');
  if (doctype === 'Customer' && iSet >= 0) {
    const mv = layout.tabs.filter((t) => t.fieldname === 'accounting_tab' || t.fieldname === 'tax_tab');
    mv.sort((x, y) => (x.fieldname === 'accounting_tab' ? -1 : 1));
    layout.tabs = layout.tabs.filter((t) => !mv.includes(t));
    layout.tabs.splice(layout.tabs.findIndex((t) => t.fieldname === 'settings_tab'), 0, ...mv);
  }
}
const sn = snake(doctype).replace(/_/g, '-');
const active = Math.min(Math.max(opt.tab, 0), Math.max(layout.tabs.length - 1, 0));
const tabId = (t) => `${sn}-${t.fieldname}`;

const tabsHtml = `<div class="form-tabs-list"><ul class="nav form-tabs" id="form-tabs" role="tablist">${layout.tabs.map((t, i) => `<li class="nav-item show">
				<button class="nav-link${i === active ? ' active' : ''}" id="${tabId(t)}-tab" data-toggle="tab" data-fieldname="${esc(t.fieldname)}" type="button" role="tab" aria-controls="${tabId(t)}">
						${esc(t.label)}
				</button>
			</li>`).join('')}</ul>
			</div>`;

const secHtml = (s) => {
  const head = s.label
    ? `<div class="section-head${s.collapsible ? ' collapsible' : ''}${s.collapsed ? ' collapsed' : ''}">${esc(s.label)}<span class="ml-2 collapse-indicator mb-1"><svg class="icon  icon-sm" aria-hidden="true"><use href="#icon-${s.collapsed ? 'chevron-down' : 'chevron-up'}"></use></svg></span></div>`
    : '';
  const w = Math.floor(12 / s.columns.length);
  const cols = s.columns.map((c, i) => `<div class="form-column col-sm-${w}" data-fieldname="__column_${i}"><form>${c.fields.map((f) => renderField(f)).join('')}</form></div>`).join('');
  return `<div class="form-section card-section visible-section${s.collapsed ? ' collapsed' : ''}"${s.fieldname ? ` data-fieldname="${esc(s.fieldname)}"` : ''}>${head}<div class="section-body"${s.collapsed ? ' style="display: none;"' : ''}>${cols}</div></div>`;
};
const panes = layout.tabs.map((t, i) => `<div id="${tabId(t)}" class="tab-pane fade${i === active ? ' show active' : ''}">${t.sections.map(secHtml).join('')}</div>`).join('');
const formHtml = `${tabsHtml}<div class="form-tab-content tab-content">${panes}</div></div>`; // closes form-page

// ---- shell from desk-form.html
const shellPath = path.join(KIT, 'pages', 'desk-form.html');
const shell = fs.readFileSync(shellPath, 'utf8');
const iTabs = shell.indexOf('<div class="form-tabs-list"');
const iSide = shell.indexOf('<div class="layout-side-section right"');
if (iTabs < 0 || iSide < 0) throw new Error('desk-form.html shell markers not found');
let pre = shell.slice(0, iTabs);
let sideTail = shell.slice(iSide);
if (isNew) { // omit the right form sidebar: cut the balanced <div> at iSide
  const re = /<\/?div\b[^>]*>/g; re.lastIndex = 0; let depth = 0, end = -1, m;
  while ((m = re.exec(sideTail))) { depth += m[0][1] === '/' ? -1 : 1; if (depth === 0) { end = re.lastIndex; break; } }
  if (end > 0) sideTail = sideTail.slice(end);
}
const post = '</div></div></div></div></div>' + sideTail; // 5 closers; form-page closed in formHtml
const outFile = path.resolve(opt.out || path.join(HERE, 'out', snake(doctype) + '.html'));
fs.mkdirSync(path.dirname(outFile), { recursive: true });
const rel = path.relative(path.dirname(outFile), path.join(KIT, 'tokens')).split(path.sep).join('/');
pre = pre.replaceAll('../tokens/', rel + '/');

const title = doc.name || `New ${doctype}`;
const status = doc.status || doc.workflow_state || 'Not Saved';
pre = pre
  .replace(/(es-breadcrumbs__label">)Customer</, (_, p) => `${p}${esc(doctype)}<`)
  .replace(/(es-breadcrumbs__label">)Direct</, (_, p) => `${p}${esc(title)}<`)
  .replace(/(es-breadcrumbs__item" title=")Direct"/, (_, p) => `${p}${esc(title)}"`)
  .replace(/(data-testid="page-status" data-theme=")blue(" data-ui="form-title.status"><span>)Enabled</, (_, p, q) => `${p}${doc.status ? 'blue' : 'orange'}${q}${esc(status)}<`)
  .replace(/(bold ellipsis mr-3 text-medium">)Direct</, (_, p) => `${p}${esc(title)}<`)
  .replace('id="page-Customer"', `id="page-${esc(doctype)}"`)
  .replace('data-route="Form/Customer/Direct"', `data-route="Form/${esc(doctype)}/${esc(title)}"`)
  .replace(/<title>[^<]*/, `<title>${esc(doctype)} form`);

// New unsaved doc (no --doc): live shows only title, 'Not Saved' pill and Save; no right sidebar.
if (isNew) {
  const a0 = pre.indexOf('<span class="page-icon-group');
  const a1 = pre.indexOf('<button class="es-button primary-action"');
  if (a0 > 0 && a1 > a0) pre = pre.slice(0, a0) + pre.slice(a1);
}

// live v16 geometry: 900px main column centred in the page, form sidebar out of flow (hidden for unsaved docs)
const geo = doc.name ? '' : `.layout-main{justify-content:center;position:relative}.layout-main-section-wrapper{flex:0 1 900px!important;max-width:900px;width:900px}.layout-side-section{display:none!important}`; // saved docs keep the shell's own main + side layout (side section in flow); new docs match the live unsaved form
pre = pre.replace('</head>', `<style id="doctype-geometry">${geo}</style></head>`);
const workspace = opt.workspace || meta.module || 'Selling';
const letter = esc([...String(title).trim()][0]?.toUpperCase() || 'D');
pre = pre
  .replace('data-title="Selling"', `data-title="${esc(workspace)}"`)
  .replace(/(header-title" data-name-style="">)Selling</, (_, p) => `${p}${esc(workspace)}<`)
  .replace('aria-label="Selling" aria-current="page"', `aria-label="${esc(workspace)}" aria-current="page"`)
  .replace(/(dock-item-label">)Selling</, (_, p) => `${p}${esc(workspace)}<`)
  .replace('standard-sidebar-item active-sidebar', 'standard-sidebar-item')
  .replace(new RegExp(`(item-name="${doctype.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" data-id="[^"]*">\\s*<div class="standard-sidebar-item)\\s*"`), '$1 active-sidebar"')
  .replace(/(avatar-frame[^>]*>\s*)A(\s*<\/div>)/g, (_, p, q) => `${p}${letter}${q}`);
// optional "Back to <App>" pill (only seen on benches with an app switcher); off by default
const BACK_TO = (() => { const i = process.argv.indexOf('--back-to'); return i > 0 ? process.argv[i + 1] : null; })();
// ---- rail: utility icons above the apps, "Back to app" pill instead of the avatar (matches live v16)
{
  const ico = (label, body) => `<button class="dock-item" aria-label="${label}"><span class="dock-item-icon"><svg class="icon icon-rail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg></span></button>`;
  const util = '<div class="dock-utils">' + ico('Search', '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>') + ico('Notifications', '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"></path>') + ico('Chat', '<circle cx="12" cy="12" r="9"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><path d="M9 9.5h.01M15 9.5h.01"></path>') + '</div><div class="dock-sep" style="height:1px;background:var(--border-color,#e5e5e5);margin:6px 8px"></div>';
  pre = pre.replace('<div class="dock-items">', util + '<div class="dock-items">');
  if (BACK_TO) pre = pre.replace(/<div class="dock-user"[\s\S]*?<\/button>\s*<\/div>/, `<div class="back-to-app" style="position:fixed;left:8px;bottom:12px;z-index:60;padding:6px 10px;border-radius:999px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);font-size:12px;white-space:nowrap;display:flex;align-items:center;gap:6px;color:var(--text-color,#171717)">\u2190 Back to ${BACK_TO} <span style="opacity:.6">\u00d7</span></div>`);
}
if (isNew) {
  const cut = (str, a, b, repl = '') => { const i = str.indexOf(a); if (i < 0) return str; const j = str.indexOf(b, i + a.length); return j < 0 ? str : str.slice(0, i) + repl + str.slice(j); };
  // page actions: only status + Save
  pre = cut(pre, '<div class="custom-actions', '<div class="custom-mobile-actions">');
  pre = cut(pre, '<span class="page-icon-group', '<button class="es-button primary-action"');
  // sidebar: no Search / Notification rows
  { const a = pre.indexOf('<div class="standard-items-band">'); const n = pre.indexOf('<div class="body-sidebar-top">');
    if (a >= 0 && n > a) pre = pre.slice(0, a) + pre.slice(n); }
  // user avatar row -> "Back to URY" pill, bottom-left
  { const a = pre.indexOf('<div class="nav-item dropdown-navbar-user'); const e = a >= 0 ? /<\/a>\s*<\/div>/.exec(pre.slice(a)) : null;
    if (BACK_TO && e && !pre.includes('back-to-app')) pre =pre.slice(0, a) + '<div class="nav-item mt-3"><a class="es-pill back-to-ury" href="#" data-ui="sidebar.back-to-app" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid var(--border-color,#e5e5e5);font-size:12px;cursor:pointer;text-decoration:none;color:inherit"><svg class="icon icon-sm"><use href="#icon-chevron-left"></use></svg>Back to ' + BACK_TO + '</a></div>' + pre.slice(a + e.index + e[0].length); } }
// ---- per-workspace sidebar (workspaces/<slug>.json); falls back to the shell sidebar
{
  const slug = String(workspace).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const wf = path.join(HERE, 'workspaces', slug + '.json');
  if (fs.existsSync(wf)) {
    const ws = JSON.parse(fs.readFileSync(wf, 'utf8'));
    const iconsF = path.join(HERE, 'workspaces', 'icons.json');
    const lib = fs.existsSync(iconsF) ? JSON.parse(fs.readFileSync(iconsF, 'utf8')) : {};
    const iconAlias = { home: 'house' };
    const need = new Set(); let n = 100;
    const svg = (name, cls, extra = '') => `<svg class="icon ${cls}" ${extra} style="" aria-hidden="true"><use class="" href="#icon-${name}"></use></svg>`;
    const isActive = (it) => it.link_type === 'DocType' && it.link_to === doctype;
    const item = (it, depth) => {
      const kids = it.children || [];
      const sect = it.type === 'Section Break';
      const act = isActive(it) || kids.some(isActive);
      const ic = iconAlias[it.icon] || it.icon;
      let icon = '';
      if (ic) { if (!pre.includes(`id="icon-${ic}"`) && lib[it.icon]) need.add(it.icon); icon = `<span class="sidebar-item-icon" item-icon="${esc(ic)}">${svg(ic, 'current-color icon-sm', 'stroke="currentColor"')}</span>`; }
      const ctl = sect ? `<button class="btn-reset drop-icon" data-state="${act ? 'open' : 'closed'}" data-ui="sidebar.button-${n++}">${svg('chevron-right', 'icon-sm', 'stroke="#7c7c7c"')}</button>` : '';
      const anchor = sect ? '<a class="item-anchor"' : '<a href="#" target="" class="item-anchor"';
      return `<div class="sidebar-item-container  ${sect ? 'section-item' : ''}" item-name="${esc(it.label)}" data-id="${esc(it.label)}"><div class="standard-sidebar-item ${sect ? 'indent' : ''}${isActive(it) ? ' active-sidebar' : ''}">${anchor} data-link-type="${esc(it.link_type)}" data-ui="sidebar.link-${n++}">${icon}<span class="sidebar-item-label">${esc(it.label)}</span><div class="sidebar-item-control">${ctl}</div></a></div><div class="sidebar-child-item nested-container${sect && !act ? ' hidden' : ''}">${kids.map((k) => item(k, depth + 1)).join('')}</div></div>`;
    };
    // rail + header follow the workspace: mark its dock item active, reuse its rail icon in the sidebar header
    {
      const dockRe = new RegExp(`<button class="dock-item[^"]*" (aria-label="${esc(workspace).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")[^>]*>\\s*<span class="dock-item-icon"><svg[^>]*>\\s*<use class="" href="#icon-([a-z-]+)">`);
      const dm = pre.match(dockRe);
      if (dm) {
        pre = pre.replace(/<button class="dock-item active " aria-label="[^"]*" aria-current="page"/, (m) => m.replace('dock-item active ', 'dock-item  ').replace(' aria-current="page"', ''));
        pre = pre.replace(`<button class="dock-item  " ${dm[1]}`, `<button class="dock-item active " ${dm[1]} aria-current="page"`);
        pre = pre.replace(/(<div class="header-logo"><svg[^>]*>\s*<use class="" href="#icon-)[a-z-]+(">)/, `$1${dm[2]}$2`);
      }
      if (ws.no_standard_items) pre = pre.replace(/<div class="standard-items-band">[\s\S]*?<\/div><\/div><\/div>(\s*<div class="body-sidebar-top">)/, '$1');
    }
    const itemsHtml = ws.items.map((it) => item(it, 0)).join('');
    const a = pre.indexOf('<div class="sidebar-items">');
    const b = pre.indexOf('<div class="body-sidebar-cards">');
    if (a >= 0 && b > a) {
      const defs = [...need].map((k) => `<symbol viewBox="0 0 24 24" id="icon-${iconAlias[k] || k}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${lib[k]}</symbol>`).join('');
      pre = pre.slice(0, a) + '<div class="sidebar-items">' + itemsHtml + '</div></div>    ' + pre.slice(b);
      if (defs) pre = pre.replace(/<body[^>]*>/, (m) => m + `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${defs}</defs></svg>`);
    }
  }
}
const postFixed = (isNew ? post.replace('<div class="layout-side-section right"', '<div class="layout-side-section right" style="display:none"') : post).replace(/(<div class="standard-image">)D(<\/div>)/, (_, p, q) => `${p}${letter}${q}`).replace(/(bold ellipsis mr-3 text-medium">)Direct</, (_, p) => `${p}${esc(title)}<`).replace(/(avatar-frame[^>]*>\s*(?:<[^>]*>\s*)?)D(?=\s*<)/, (_, p) => `${p}${esc(title[0].toUpperCase())}`);
fs.writeFileSync(outFile, pre + formHtml + postFixed);
const count = (re) => (fs.readFileSync(outFile, 'utf8').match(re) || []).length;
const html = fs.readFileSync(outFile, 'utf8');
const body = html.slice(html.indexOf('<div class="form-tabs-list"'), (html.indexOf('<div class="layout-side-section right"') + 1 || html.length) - 1);
const c = (re) => (body.match(re) || []).length;
console.log(`wrote ${outFile}`);
console.log(`tabs=${c(/class="nav-link/g)} sections=${c(/class="form-section /g)} columns=${c(/class="form-column /g)} fields=${c(/class="(?:form-group )?frappe-control/g)}`);
