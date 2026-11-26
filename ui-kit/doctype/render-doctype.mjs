#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, formatValue } from './lib/control.mjs';
import { buildLayout } from './lib/layout.mjs';
import { applyCustomizations } from './lib/customize.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
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
const post = '</div></div></div></div></div>' + shell.slice(iSide); // 5 closers; form-page closed in formHtml
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
const postFixed = post.replace(/(<div class="standard-image">)D(<\/div>)/, (_, p, q) => `${p}${letter}${q}`).replace(/(bold ellipsis mr-3 text-medium">)Direct</, (_, p) => `${p}${esc(title)}<`).replace(/(avatar-frame[^>]*>\s*(?:<[^>]*>\s*)?)D(?=\s*<)/, (_, p) => `${p}${esc(title[0].toUpperCase())}`);
fs.writeFileSync(outFile, pre + formHtml + postFixed);
const count = (re) => (fs.readFileSync(outFile, 'utf8').match(re) || []).length;
const html = fs.readFileSync(outFile, 'utf8');
const body = html.slice(html.indexOf('<div class="form-tabs-list"'), html.indexOf('<div class="layout-side-section right"'));
const c = (re) => (body.match(re) || []).length;
console.log(`wrote ${outFile}`);
console.log(`tabs=${c(/class="nav-link/g)} sections=${c(/class="form-section /g)} columns=${c(/class="form-column /g)} fields=${c(/class="(?:form-group )?frappe-control/g)}`);
