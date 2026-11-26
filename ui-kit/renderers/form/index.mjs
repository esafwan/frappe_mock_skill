// Form page renderer: shell + sidebar + form head + doctype layout/fields + form sidebar placeholder.
// Generic: no doctype/app/brand names. Names come from the spec / fixtures only.
// Engine contract: default export render(spec, ctx) -> {main, head, aside, title, sidebarHtml}.
// Standalone: renderFormDocument(opts) -> complete HTML document (used by doctype/render-doctype.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../../doctype/lib/control.mjs';
import { buildLayout } from '../../doctype/lib/layout.mjs';
import { applyCustomizations } from '../../doctype/lib/customize.mjs';
import { renderShell } from '../../shell/shell.mjs';
import { renderSidebar } from '../../shell/sidebar.mjs';
import { adaptFlatSidebar } from '../../adapters/sidebar.mjs';
import { renderFormHead } from './head.mjs';
import { applyReadOnly, readOnlyBanners } from './readonly.mjs';
import { formTitle } from './title.mjs';
import { formSidebarHtml as sidebarPanel } from './sidebar.mjs';
import { renderTimeline } from './timeline.mjs';
import { renderConnections } from './connections.mjs';
import { injectRowForms } from './rowform.mjs';
import { applyFieldOpen } from '../../doctype/fields/open/index.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const DOCTYPE_DIR = path.join(KIT, 'doctype');
export const snake = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// ---- field renderers (doctype/fields/*.mjs), loaded once
let RENDERERS = null;
export async function loadFieldRenderers() {
  if (RENDERERS) return RENDERERS;
  const out = {};
  const fdir = path.join(DOCTYPE_DIR, 'fields');
  for (const f of fs.readdirSync(fdir).filter((x) => x.endsWith('.mjs')).sort()) {
    const m = (await import(path.join(fdir, f))).default || {};
    for (const [k, fn] of Object.entries(m)) {
      if (out[k]) console.warn(`warn: duplicate fieldtype renderer "${k}" in fields/${f} ignored`);
      else out[k] = fn;
    }
  }
  return (RENDERERS = out);
}

// ---- metadata lookup for child doctypes: given dirs first, then doctype/fixtures/* (not samples)
export function makeMetaLoader(dirs = []) {
  const search = [...dirs];
  const fx = path.join(DOCTYPE_DIR, 'fixtures');
  if (fs.existsSync(fx)) {
    for (const d of fs.readdirSync(fx).sort()) {
      if (d === 'samples') continue;
      search.push(path.join(fx, d));
      const child = path.join(fx, d, 'child');
      if (fs.existsSync(child)) search.push(child);
    }
  }
  const cache = {};
  return function loadMeta(name) {
    if (name in cache) return cache[name];
    let r = null;
    for (const d of search) {
      const p = path.join(d, snake(name) + '.json');
      if (fs.existsSync(p)) { r = readJson(p); break; }
    }
    return (cache[name] = r);
  };
}

function fallbackField(df) {
  return `<div class="frappe-control input-max-width" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}"><div class="form-group horizontal"><div class="clearfix"><label class="control-label">${esc(df.label ?? df.fieldname)}</label></div><div class="control-input-wrapper"><div class="control-input"><input type="text" class="form-control" disabled value="[${esc(df.fieldtype)}]" data-fieldname="${esc(df.fieldname)}"></div></div></div></div>`;
}

// ---- layout -> HTML
function layoutHtml(layout, { renderField, sn, active, dash = '' }) {
  const tabId = (t) => `${sn}-${t.fieldname}`;
  const tabs = `<div class="form-tabs-list" data-ui="form.tabs"><ul class="nav form-tabs" id="form-tabs" role="tablist">${layout.tabs.map((t, i) => `<li class="nav-item show"><button class="nav-link${i === active ? ' active' : ''}" id="${tabId(t)}-tab" data-toggle="tab" data-fieldname="${esc(t.fieldname)}" type="button" role="tab" aria-controls="${tabId(t)}">${esc(t.label)}</button></li>`).join('')}</ul></div>`;

  const sec = (s) => {
    const head = s.label
      ? `<div class="section-head${s.collapsible ? ' collapsible' : ''}${s.collapsed ? ' collapsed' : ''}">${esc(s.label)}<span class="ml-2 collapse-indicator mb-1"><svg class="icon icon-sm" aria-hidden="true"><use href="#icon-${s.collapsed ? 'chevron-down' : 'chevron-up'}"></use></svg></span></div>`
      : '';
    const desc = s.description ? `<div class="section-description text-muted small">${esc(s.description)}</div>` : '';
    const n = s.columns.length || 1;
    const equal = s.columns.every((c) => Math.abs((c.pct ?? 100 / n) - 100 / n) < 0.01);
    const cols = s.columns.map((c, i) => {
      const w = equal ? ` col-sm-${Math.max(1, Math.floor(12 / n))}` : '';
      const st = equal ? '' : ` style="flex:0 0 ${c.pct}%;max-width:${c.pct}%"`;
      return `<div class="form-column${w}"${st} data-fieldname="__column_${i}"><form>${c.fields.map((f) => renderField(f)).join('')}</form></div>`;
    }).join('');
    const cls = ['form-section', 'card-section', 'visible-section', s.collapsed && 'collapsed', s.hide_border && 'hide-border', s.isFold && 'form-fold', s.folded && !s.isFold && 'folded-section'].filter(Boolean).join(' ');
    return `<div class="${cls}"${s.fieldname ? ` data-fieldname="${esc(s.fieldname)}"` : ''}${s.folded ? ' data-folded="1"' : ''}>${head}${desc}<div class="section-body"${s.collapsed ? ' style="display: none;"' : ''}>${cols}</div></div>`;
  };
  const dashTab = dash ? layout.tabs.findIndex((t) => t.fieldname === 'connections_tab' || t.fieldname === 'overview_tab') : -1;
  const panes = layout.tabs.map((t, i) => `<div id="${tabId(t)}" class="tab-pane fade${i === active ? ' show active' : ''}">${i === dashTab ? dash : ''}${t.sections.map(sec).join('')}</div>`).join('');
  return `<div class="form-page" data-ui="form.page">${tabs}<div class="form-tab-content tab-content">${panes}</div></div>`;
}

/** Form sidebar (right panel, saved docs only), built from the doc by ./sidebar.mjs. */
export function formSidebarHtml(meta = {}, doc = {}, opts = {}) { return sidebarPanel(meta, doc, opts); }

/**
 * Build the slots of a form page.
 * opts: { spec, meta, doc, custom, loadMeta, locale, tab, ctx }
 * Returns { head, main, right, title, sidebarActive, counts }.
 */
export async function buildFormPage(opts = {}) {
  const spec = opts.spec || {};
  const renderers = await loadFieldRenderers();
  const locale = opts.locale || spec.ctx?.locale || 'en-IN';
  let custom = opts.custom || [];
  let meta = opts.meta;
  if (!Array.isArray(custom)) {
    if (custom.custom_fields) custom = custom.custom_fields;
    else custom = (custom[meta.name] || []).map((c) => ({ dt: meta.name, ...c }));
  }
  meta = applyCustomizations(meta, custom, []);
  const doc = { ...(opts.doc || {}) };
  meta = applyReadOnly(meta, doc);
  const doctype = meta.name;
  const isNew = doc.__islocal !== undefined ? !!doc.__islocal : !doc.name;
  if (isNew) doc.__islocal = 1;
  const loadMeta = opts.loadMeta || makeMetaLoader();

  const spec_overlays = opts.overlays || opts.ctx?.overlays || spec.overlays || [];
  const fieldOpen = spec_overlays.filter((o) => o?.type === 'field_open');
  const drawn = new Set();
  const renderField = (df, ctx0 = {}) => {
    const ctx = { value: doc[df.fieldname], doc, doctype, meta, locale, loadMeta, renderField, ...ctx0 };
    const fn = (df.fieldtype === 'Data' && df.options && renderers['Data:' + df.options]) || renderers[df.fieldtype];
    let html = fn ? fn(df, ctx) : fallbackField(df);
    for (const ov of fieldOpen.filter((o) => o.field === df.fieldname)) {
      const next = applyFieldOpen(html, df, ctx, ov);
      if (next !== html) { html = next; drawn.add(ov); }
    }
    return html;
  };

  const layout = buildLayout(meta, doc);
  if (isNew) { // Frappe shows these dashboard tabs only for a saved document
    const hideNew = new Set(['overview_tab', 'connections_tab']);
    layout.tabs = layout.tabs.filter((t) => !hideNew.has(t.fieldname));
  }
  const sn = snake(doctype).replace(/_/g, '-');

  // v16: Connections is its own tab, shown only when the DocType has links. Synthesised after the layout's tabs when it has none.
  const connections = opts.connections ?? spec.data?.connections ?? spec.meta?.connections;
  if (!isNew && Array.isArray(connections) && connections.length && !layout.tabs.some((t) => t.fieldname === 'connections_tab' || t.fieldname === 'overview_tab')) {
    layout.tabs.push({ label: 'Connections', fieldname: 'connections_tab', sections: [] });
  }
  const want = opts.tab ?? spec.view?.tab ?? 0;
  const norm = (x) => String(x).toLowerCase().replace(/_tab$/, '');
  let active = typeof want === 'string' && Number.isNaN(Number(want)) ? layout.tabs.findIndex((t) => t.label === want || t.fieldname === want || norm(t.label) === norm(want) || norm(t.fieldname) === norm(want)) : Number(want);
  active = Math.min(Math.max(Number.isFinite(active) ? active : 0, 0), Math.max(layout.tabs.length - 1, 0));
  const dash = !isNew && Array.isArray(connections) && connections.length ? renderConnections(connections, { readOnly: Number(doc.docstatus) === 2 }) : '';
  let form = layoutHtml(layout, { renderField, sn, active, dash });
  form = injectRowForms(form, { overlays: spec_overlays, meta, doc, renderField, loadMeta, markDrawn: (o) => drawn.add(o) });
  const showTimeline = !isNew && opts.timeline !== false && spec.view?.timeline !== false && spec.ctx?.desk_settings?.timeline !== false;
  const timeline = showTimeline ? `<div class="form-footer" data-ui="form.footer"><div class="form-timeline">${renderTimeline(doc, { more: spec.view?.timeline_more, user: spec.ctx?.user?.full_name || spec.ctx?.user?.name })}</div></div>` : '';
  const body = readOnlyBanners(meta, doc) + form + timeline;
  const geo = isNew
    ? '<style id="form-geometry">.layout-main{justify-content:center;position:relative}.layout-main-section-wrapper{flex:0 1 900px!important;max-width:900px;width:900px}</style>'
    : '';
  const head = renderFormHead(spec, meta, doc);
  const right = isNew || spec.ctx?.chrome?.form_sidebar === false ? '' : formSidebarHtml(meta, doc);
  const c = (re) => (body.match(re) || []).length;
  drawn.forEach((o) => opts.ctx?.useOverlays?.(o.type, (x) => x === o));
  return {
    head, main: geo + body, right,
    title: `${doctype} ${isNew ? 'new' : doc.name}`,
    doctype, docName: doc.name || `New ${doctype}`, isNew, meta, doc,
    counts: { tabs: c(/class="nav-link/g), sections: c(/class="form-section /g), columns: c(/class="form-column/g), fields: c(/class="(?:form-group )?frappe-control/g) },
  };
}

// ---- workspace -> sidebar + dock
export function loadWorkspaceSidebar(workspace) {
  const slug = snake(workspace || '');
  const f = path.join(DOCTYPE_DIR, 'workspaces', slug + '.json');
  if (!slug || !fs.existsSync(f)) return null;
  const j = readJson(f);
  return j.items?.some((i) => i.indent !== undefined) ? adaptFlatSidebar(j) : j;
}

export function dockFromWorkspaces() {
  const d = path.join(DOCTYPE_DIR, 'workspaces');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((x) => x.endsWith('.json') && x !== 'icons.json').sort().map((x) => {
    const j = readJson(path.join(d, x));
    return { label: j.title, icon: j.header_icon || 'layout-grid' };
  }).filter((i) => i.label);
}

export function sidebarContainer(sidebarJson, { active, collapsed, title, icon } = {}) {
  const items = renderSidebar(sidebarJson, { active, collapsed });
  const t = esc(title || sidebarJson?.title || '');
  const hi = icon || sidebarJson?.header_icon;
  return `<div class="body-sidebar-container${collapsed ? '' : ' expanded'}" data-ui="sidebar"><div class="body-sidebar" data-title="${t}"><a class="sidebar-header shell-header" style="text-decoration: none;" aria-haspopup="menu" aria-expanded="false" data-ui="sidebar.link-1">${hi ? `<div class="header-logo"><svg class="icon icon-md"><use href="#icon-${esc(hi)}"></use></svg></div>` : ''}<div class="title-container"><div class="sidebar-item-label header-title">${t}</div></div></a><div class="body-sidebar-top">${items}</div></div></div>`;
}

/**
 * Complete document. opts: buildFormPage opts plus
 *   workspace, sidebar (JSON), dock (items), outFile, user, theme, rtl, chrome
 */
export async function renderFormDocument(opts = {}) {
  const page = await buildFormPage(opts);
  const spec = opts.spec || {};
  const sctx = spec.ctx || {};
  const workspace = opts.workspace || sctx.workspace || page.meta.module || '';
  const sidebarJson = opts.sidebar || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(sctx.chrome || {}), ...(opts.chrome || {}) };
  const outFile = opts.outFile ? path.resolve(opts.outFile) : path.join(DOCTYPE_DIR, 'out', snake(page.doctype) + '.html');
  const tokensPath = path.relative(path.dirname(outFile), path.join(KIT, 'tokens')).split(path.sep).join('/');
  const collapsed = chrome.sidebar === 'collapsed';
  const sidebarHtml = chrome.sidebar === 'hidden' || !sidebarJson ? ''
    : sidebarContainer(sidebarJson, { active: { doctype: page.doctype }, collapsed, title: workspace });
  const letterUser = opts.user || sctx.user || { name: page.docName };
  const ctx = {
    theme: opts.theme || sctx.theme || 'light', locale: opts.locale || sctx.locale || 'en', rtl: !!(opts.rtl ?? sctx.rtl),
    viewport: typeof sctx.viewport === 'string' ? sctx.viewport : '1440x900',
    app: sctx.app || workspace, workspace, user: letterUser, chrome,
    dock: { title: sctx.dock?.title ?? '', ...(sctx.dock || {}), items: opts.dock || sctx.dock?.items || dockFromWorkspaces() },
    title: `${page.doctype} form`, route: `Form/${page.doctype}/${page.docName}`, pageName: page.doctype, page: 'form', tokensPath,
    notifications: sctx.notifications,
  };
  const html = renderShell({ ctx, head: page.head, main: page.main, right: page.right, sidebarHtml });
  return { html, outFile, counts: page.counts };
}

// ---- engine entry
export default async function render(spec, ctx) {
  const meta = spec.meta?.doctype;
  if (!meta || typeof meta !== 'object') { ctx?.warn?.('form: meta.doctype did not resolve to a DocType'); return { main: '' }; }
  const loadMeta = (name) => (ctx?.resolve ? ctx.resolve(name, 'doctype') : null) || makeMetaLoader()(name);
  const sidebarMeta = typeof spec.meta?.sidebar === 'object' ? spec.meta.sidebar : null;
  const wfSpec = spec.meta?.workflow;
  const metaWf = wfSpec && typeof wfSpec === 'object' && !meta.workflow?.transitions
    ? { ...meta, workflow: { state_field: wfSpec.workflow_state_field || wfSpec.state_field || 'workflow_state', states: wfSpec.states || [], transitions: wfSpec.transitions || [], styles: wfSpec.styles } } : meta;
  const page = await buildFormPage({ spec, meta: metaWf, doc: spec.data?.doc || {}, custom: spec.meta?.custom || [], loadMeta, locale: ctx?.locale, ctx });
  ctx?.useOverlays?.('intro');
  ctx?.useOverlays?.('button');
  const workspace = ctx?.workspace || spec.ctx?.workspace || meta.module || '';
  const sj = sidebarMeta || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx?.chrome || {}) };
  const sidebarHtml = !sj || chrome.sidebar === 'hidden' ? ''
    : sidebarContainer(sj, { active: { doctype: page.doctype }, collapsed: chrome.sidebar === 'collapsed', title: workspace });
  const vp = ctx?.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx?.viewport || '1440x900');
  const sctx = spec.ctx || {};
  // Own the document until shell/shell.mjs has the engine's default-export wrapper (slots, spec, ctx).
  const document = renderShell({ ctx: {
    theme: ctx?.theme, locale: ctx?.locale, rtl: ctx?.rtl, viewport: vp, app: ctx?.app || workspace, workspace, user: ctx?.user, chrome,
    dock: { ...(sctx.dock || {}), items: sctx.dock?.items || dockFromWorkspaces() },
    title: page.title, route: `Form/${page.doctype}/${page.docName}`, pageName: page.doctype, page: 'form',
    tokensPath: ctx?.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
  }, head: page.head, main: page.main, right: page.right, sidebarHtml });
  return { document, head: page.head, main: page.main, aside: page.right, title: page.title, sidebarHtml };
}
