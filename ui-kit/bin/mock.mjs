#!/usr/bin/env node
// mock: validate and render mock specs (docs/SPEC.md).
//
//   node bin/mock.mjs validate <spec.json>... [--json]
//   node bin/mock.mjs render <spec.json> [--out file.html] [--theme light|dark] [--rtl]
//                            [--viewport WxH|desktop|tablet|mobile] [--today YYYY-MM-DD] [--locale xx]
//
// Renderer contract: renderers/<page>/index.mjs, default export (spec, ctx) => string | slots | Promise of either.
// Deterministic: no clocks, randomness, env or network. Node 18, no dependencies.
// Generic: no doctype, app or brand names in this file; they live in specs and fixtures.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { applyMobile } from '../shell/mobile.mjs';
import { drawOverlays, addSymbols } from '../kit-lib/draw.mjs';

import { normalizeWorkflow } from '../kit-lib/indicators.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..');
export const SCHEMA_PATH = path.join(KIT, 'schemas', 'mock-spec.schema.json');
export const SPEC_VERSION = 'mock-spec/1';

export const snake = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isPathLike = (s) => typeof s === 'string' && (s.includes('/') || s.includes('\\') || s.endsWith('.json'));

// ---------------------------------------------------------------- registries (also exported for tests and renderers)

export const PAGES = ['blank', 'form', 'list', 'report', 'query_report', 'workspace', 'dashboard', 'kanban', 'calendar', 'gantt', 'tree', 'image', 'map', 'inbox', 'dialog'];

export const OVERLAY_TYPES = ['button', 'intro', 'menu_open', 'dialog', 'list_select', 'filter_chips', 'state', 'toast'];

/** Overlay draw layers, low to high. Renderers draw page-layer overlays in place; the shell draws modal and toast. */
export const OVERLAY_LAYER = {
  button: 'page', intro: 'page', list_select: 'page', filter_chips: 'page', state: 'page',
  menu_open: 'popover', dialog: 'modal', toast: 'toast',
};

/** menu_open target registry. Fixed ids, then parametric prefixes ("<prefix><arg>"). */
export const MENU_TARGETS = {
  fixed: {
    'page.menu': 'Page head "..." menu (form, list, report, workspace).',
    'page.actions': 'Page head "Actions" dropdown (workflow transitions, list bulk actions).',
    'page.primary': 'Split primary button dropdown (e.g. Save / Submit variants).',
    'page.view_switcher': 'List/Report/Kanban/... view switcher.',
    'page.sort': 'Sort selector (field list and asc/desc).',
    'page.group_by': 'Group-by selector in the page head or report toolbar.',
    'page.filter': 'Filter popover (rows come from filter_chips overlay).',
    'page.settings': 'List settings / column picker gear.',
    'page.page_length': 'Paging size selector (20/100/500).',
    'navbar.search': 'Awesomebar with results (use `query`).',
    'navbar.notifications': 'Notifications panel.',
    'navbar.help': 'Help dropdown.',
    'navbar.user': 'User avatar menu.',
    'sidebar.header': 'Workspace sidebar header (app/workspace switcher).',
    'sidebar.user': 'User block at the bottom of the sidebar.',
    'dock.more': 'Dock overflow popover.',
    'workspace.menu': 'Workspace page menu.',
    'workspace.block_picker': 'Workspace "+" block picker (edit mode).',
  },
  prefix: {
    'button_group:': 'Custom button group dropdown, by group label (overlay button.group).',
    'row_actions:': 'List row action dropdown, by 0-based row index.',
    'column:': 'Report/datatable column header dropdown, by fieldname.',
    'field:': 'Field popover: Link/Dynamic Link results, Select, Date/Datetime/Time picker, Color, Icon. By fieldname.',
    'chart:': 'Chart toolbar menu, by chart name.',
    'group_by:': 'List sidebar group-by dropdown, by fieldname (or "assigned_to", "owner", "tags").',
    'ui:': 'Escape hatch: any element with data-ui="<id>".',
  },
};

/** state overlay target syntax. */
export const STATE_TARGETS = {
  'row:<n>': 'List/report row (0-based).',
  'cell:<n>:<fieldname>': 'One cell of a list/report/grid row.',
  'field:<fieldname>': 'Form or dialog field control.',
  'button:<label>': 'Button by label, or button:primary for the page primary action.',
  'tab:<label>': 'Form tab.',
  'link:<label>': 'Sidebar link or workspace card link.',
  'card:<label>': 'Workspace shortcut / number card / chart widget.',
  'column:<fieldname>': 'Report/datatable column header.',
  'ui:<id>': 'Any element with data-ui="<id>".',
};
export const STATES = ['hover', 'focus', 'active', 'disabled', 'loading'];

export const FILTER_OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'like', 'not like', 'in', 'not in', 'is', 'between', 'timespan',
  'descendants of', 'descendants of (inclusive)', 'not descendants of', 'ancestors of', 'not ancestors of'];

export const WORKSPACE_BLOCKS = ['header', 'paragraph', 'spacer', 'card', 'shortcut', 'chart', 'number_card', 'quick_list', 'onboarding', 'custom_block'];

/** Standard columns every DocType has (valid as fieldnames in targets, filters and sort). */
export const STANDARD_FIELDS = ['name', 'owner', 'creation', 'modified', 'modified_by', 'docstatus', 'idx', 'parent', 'parentfield', 'parenttype',
  '_assign', '_liked_by', '_user_tags', '_comments', '_seen', 'assigned_to', 'tags'];

/** Which meta key each page needs. An inner array means "any one of". */
const PAGE_REQUIRES = {
  form: ['doctype'], list: ['doctype'], report: [['doctype', 'report']], query_report: ['report'], workspace: ['workspace'],
  dashboard: ['dashboard'], kanban: ['doctype'], calendar: ['doctype'], gantt: ['doctype'], tree: ['doctype'],
  image: ['doctype'], map: ['doctype'], inbox: ['doctype'],
};

/** Name lookup dirs per meta kind (kit-relative). The spec's own dir and <spec dir>/meta are always searched first. */
const LOOKUP_DIRS = {
  doctype: ['doctype/fixtures'],
  sidebar: ['doctype/workspaces'],
};

const VIEWPORTS = { desktop: [1440, 900], tablet: [768, 1024], mobile: [375, 812] };

// ---------------------------------------------------------------- small helpers

class SpecError extends Error {
  constructor(errors) { super(errors.map((e) => `${e.path}: ${e.message}`).join('\n')); this.errors = errors; }
}

function readJson(file, at = '/') {
  let txt;
  try { txt = fs.readFileSync(file, 'utf8'); } catch { throw new SpecError([{ path: at, message: `cannot read ${file}` }]); }
  try { return JSON.parse(txt); } catch (e) { throw new SpecError([{ path: at, message: `invalid JSON in ${file}: ${e.message}` }]); }
}

/** Deep merge for `extends`: objects merge, arrays and scalars replace, null deletes. */
export function mergeSpec(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === null) delete out[k];
    else out[k] = isObj(v) && isObj(out[k]) ? mergeSpec(out[k], v) : v;
  }
  return out;
}

function walkFiles(dir) {
  const out = [];
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  ents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------- JSON Schema subset validator

const KEYWORDS = new Set(['$schema', '$id', 'title', 'description', 'type', 'required', 'properties', 'patternProperties', 'additionalProperties',
  '$defs', '$ref', 'items', 'minItems', 'maxItems', 'minimum', 'maximum', 'minLength', 'pattern', 'oneOf', 'anyOf', 'enum', 'const', 'default']);

function checkSchemaKeywords(node, at = '#') {
  if (node === true || node === false) return;
  if (!isObj(node)) throw new Error(`schema ${at}: not a schema`);
  for (const k of Object.keys(node)) if (!KEYWORDS.has(k)) throw new Error(`schema ${at}: keyword "${k}" not supported by bin/mock.mjs validator`);
  for (const key of ['properties', 'patternProperties', '$defs']) for (const [k, v] of Object.entries(node[key] || {})) checkSchemaKeywords(v, `${at}/${key}/${k}`);
  for (const key of ['additionalProperties', 'items']) if (key in node && typeof node[key] !== 'boolean') checkSchemaKeywords(node[key], `${at}/${key}`);
  for (const key of ['oneOf', 'anyOf']) (node[key] || []).forEach((v, i) => checkSchemaKeywords(v, `${at}/${key}/${i}`));
}

let SCHEMA;
export function loadSchema() {
  if (!SCHEMA) { SCHEMA = readJson(SCHEMA_PATH); checkSchemaKeywords(SCHEMA); }
  return SCHEMA;
}

function deref(node, root) {
  let n = node, guard = 0;
  while (isObj(n) && n.$ref) {
    if (!n.$ref.startsWith('#/$defs/')) throw new Error(`schema: unsupported $ref ${n.$ref}`);
    n = root.$defs[n.$ref.slice(8)];
    if (!n || ++guard > 20) throw new Error(`schema: bad $ref ${node.$ref}`);
  }
  return n;
}

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const typeOk = (t, v) => (t === 'number' ? typeof v === 'number' : t === 'integer' ? Number.isInteger(v) : typeOf(v) === t);
const ptr = (p, k) => `${p === '/' ? '' : p}/${String(k).replace(/~/g, '~0').replace(/\//g, '~1')}`;

/** Validate `data` against `node` (subset of JSON Schema 2020-12). Returns [{path, message}]. */
export function validateSchema(data, node = loadSchema(), root = loadSchema(), at = '/') {
  const errs = [];
  node = deref(node, root);
  if (node === true || node === undefined) return errs;
  if (node === false) return [{ path: at, message: 'not allowed' }];

  if (node.type) {
    const types = [].concat(node.type);
    if (!types.some((t) => typeOk(t, data))) return [{ path: at, message: `must be ${types.join(' or ')} (got ${typeOf(data)})` }];
  }
  if ('const' in node && data !== node.const) errs.push({ path: at, message: `must be ${JSON.stringify(node.const)}` });
  if (node.enum && !node.enum.includes(data)) errs.push({ path: at, message: `must be one of ${node.enum.map((x) => JSON.stringify(x)).join(', ')} (got ${JSON.stringify(data)})` });
  if (typeof data === 'string') {
    if (node.minLength !== undefined && data.length < node.minLength) errs.push({ path: at, message: `must have at least ${node.minLength} character(s)` });
    if (node.pattern && !new RegExp(node.pattern, 'u').test(data)) errs.push({ path: at, message: `${JSON.stringify(data)} does not match ${node.pattern}` });
  }
  if (typeof data === 'number') {
    if (node.minimum !== undefined && data < node.minimum) errs.push({ path: at, message: `must be >= ${node.minimum}` });
    if (node.maximum !== undefined && data > node.maximum) errs.push({ path: at, message: `must be <= ${node.maximum}` });
  }
  if (Array.isArray(data)) {
    if (node.minItems !== undefined && data.length < node.minItems) errs.push({ path: at, message: `must have at least ${node.minItems} item(s)` });
    if (node.maxItems !== undefined && data.length > node.maxItems) errs.push({ path: at, message: `must have at most ${node.maxItems} item(s)` });
    if (node.items !== undefined) data.forEach((v, i) => errs.push(...validateSchema(v, node.items, root, ptr(at, i))));
  }
  if (isObj(data)) {
    for (const k of node.required || []) if (!(k in data)) errs.push({ path: ptr(at, k), message: 'is required' });
    const props = node.properties || {};
    const pats = Object.entries(node.patternProperties || {}).map(([re, s]) => [new RegExp(re, 'u'), s]);
    for (const [k, v] of Object.entries(data)) {
      let matched = false;
      if (k in props) { matched = true; errs.push(...validateSchema(v, props[k], root, ptr(at, k))); }
      for (const [re, s] of pats) if (re.test(k)) { matched = true; errs.push(...validateSchema(v, s, root, ptr(at, k))); }
      if (matched || node.additionalProperties === undefined || node.additionalProperties === true) continue;
      if (node.additionalProperties === false) {
        const known = Object.keys(props);
        errs.push({ path: ptr(at, k), message: `unknown key${known.length ? ` (allowed: ${known.join(', ')})` : ''}` });
      } else errs.push(...validateSchema(v, node.additionalProperties, root, ptr(at, k)));
    }
  }
  for (const comb of ['oneOf', 'anyOf']) {
    if (!node[comb]) continue;
    const branches = node[comb].map((b) => deref(b, root));
    // Discriminated union: every branch pins the same property with `const` -> dispatch on it for precise errors.
    if (isObj(data) && branches.every((b) => isObj(b) && b.properties)) {
      const keys = Object.keys(branches[0].properties).filter((k) => branches.every((b) => b.properties[k] && 'const' in b.properties[k]));
      if (keys.length) {
        const key = keys[0];
        const hit = branches.find((b) => b.properties[key].const === data[key]);
        if (!hit) errs.push({ path: ptr(at, key), message: `must be one of ${branches.map((b) => JSON.stringify(b.properties[key].const)).join(', ')} (got ${JSON.stringify(data[key])})` });
        else errs.push(...validateSchema(data, hit, root, at));
        continue;
      }
    }
    const results = branches.map((b) => validateSchema(data, b, root, at));
    const ok = results.filter((r) => r.length === 0).length;
    if (comb === 'oneOf' && ok > 1) errs.push({ path: at, message: 'matches more than one alternative' });
    if (ok === 0) {
      const typed = branches.map((b, i) => [b, results[i]]).filter(([b]) => !b.type || [].concat(b.type).some((t) => typeOk(t, data)));
      if (typed.length === 1) errs.push(...typed[0][1]);
      else {
        const desc = branches.map((b) => (b.type ? [].concat(b.type).join('|') : b.properties ? 'object' : 'value')).join(' | ');
        errs.push({ path: at, message: `does not match any allowed form (${desc})`, detail: typed.flatMap(([, r]) => r) });
      }
    }
  }
  return errs;
}

// ---------------------------------------------------------------- defaults

function applyDefaults(value, node, root) {
  node = deref(node, root);
  if (!isObj(node) || !node.properties) return value;
  const out = isObj(value) ? { ...value } : {};
  for (const [k, s] of Object.entries(node.properties)) {
    const d = deref(s, root);
    if (!(k in out) && isObj(d) && 'default' in d) out[k] = d.default;
    if (isObj(d) && d.properties && (isObj(out[k]) || !(k in out))) out[k] = applyDefaults(out[k], d, root);
  }
  return out;
}

/** Normalised runtime context (without helpers). Exported so other tools build the same ctx. */
export function normalizeCtx(specCtx = {}) {
  const root = loadSchema();
  const c = applyDefaults(specCtx, root.$defs.ctx, root);
  c.desk_settings = Object.fromEntries(Object.keys(root.$defs.ctx.properties.desk_settings.properties).map((k) => [k, c.desk_settings?.[k] ?? true]));
  c.user = { name: 'Administrator', full_name: 'Administrator', email: 'admin@example.com', roles: ['System Manager'], ...(specCtx.user || {}) };
  c.perms = specCtx.perms || {};
  c.breadcrumbs = specCtx.breadcrumbs || null;
  c.now = specCtx.now ? specCtx.now.replace('T', ' ') : `${c.today} 12:00:00`;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(c.now)) c.now += ':00';
  const vp = VIEWPORTS[c.viewport] || c.viewport.split('x').map(Number);
  const device = c.viewport in VIEWPORTS ? c.viewport : vp[0] < 768 ? 'mobile' : vp[0] < 1024 ? 'tablet' : 'desktop';
  c.viewport = { width: vp[0], height: vp[1], device };
  c.dir = c.rtl ? 'rtl' : 'ltr';
  return c;
}

// ---------------------------------------------------------------- loading, extends, resolution

/** Read a spec file and apply `extends` (paths in a base spec are made absolute so they resolve from the base's folder). */
export function readSpecFile(file, seen = []) {
  const abs = path.resolve(file);
  if (seen.includes(abs)) throw new SpecError([{ path: '/extends', message: `extends cycle: ${[...seen, abs].join(' -> ')}` }]);
  const raw = readJson(abs);
  if (!isObj(raw)) throw new SpecError([{ path: '/', message: 'spec must be a JSON object' }]);
  if (typeof raw.extends !== 'string') return raw;
  const basePath = path.resolve(path.dirname(abs), raw.extends);
  const base = absolutizeRefs(readSpecFile(basePath, [...seen, abs]), path.dirname(basePath));
  const { extends: _x, ...rest } = raw;
  return mergeSpec(base, rest);
}

function absolutizeRefs(spec, dir) {
  const fix = (v) => (isPathLike(v) && !path.isAbsolute(v) ? path.resolve(dir, v) : v);
  const s = structuredClone(spec);
  if (isObj(s.meta)) for (const [k, v] of Object.entries(s.meta)) {
    if (typeof v === 'string') s.meta[k] = fix(v);
    else if (Array.isArray(v) && k === 'custom') s.meta[k] = v.map(fix);
    else if (k === 'children' && isObj(v)) for (const [ck, cv] of Object.entries(v)) v[ck] = fix(cv);
  }
  if (isObj(s.data)) for (const k of ['doc', 'rows']) if (k in s.data) s.data[k] = fix(s.data[k]);
  for (const o of Array.isArray(s.overlays) ? s.overlays : []) if (isObj(o) && o.doctype) o.doctype = fix(o.doctype);
  if (s.extends) s.extends = fix(s.extends);
  return s;
}

/** Make a resolver bound to one spec. resolve(ref, kind) -> { value, file } | null; throws SpecError for a missing path. */
export function makeResolver(specDir, children = {}) {
  const cache = new Map();
  const nameIndex = new Map();
  const indexFor = (kind) => {
    if (!nameIndex.has(kind)) {
      const files = [specDir, path.join(specDir, 'meta'), ...(LOOKUP_DIRS[kind] || []).map((d) => path.join(KIT, d))]
        .flatMap((d, i) => (i < 2 ? (() => { try { return fs.readdirSync(d).sort().map((f) => path.join(d, f)); } catch { return []; } })() : walkFiles(d)))
        .filter((f) => f.endsWith('.json'));
      nameIndex.set(kind, files);
    }
    return nameIndex.get(kind);
  };
  const load = (file) => {
    if (!cache.has(file)) cache.set(file, readJson(file));
    return structuredClone(cache.get(file));
  };
  return function resolve(ref, kind = 'doctype', at = '/') {
    if (isObj(ref) || Array.isArray(ref)) return { value: structuredClone(ref), file: null };
    if (typeof ref !== 'string' || !ref) return null;
    if (kind === 'doctype' && children[ref] !== undefined && children[ref] !== ref) return resolve(children[ref], kind, at);
    if (isPathLike(ref)) {
      const cands = path.isAbsolute(ref) ? [ref] : [path.resolve(specDir, ref), path.resolve(KIT, ref)];
      const hit = cands.find((f) => fs.existsSync(f));
      if (!hit) throw new SpecError([{ path: at, message: `file not found: ${ref} (looked in ${cands.join(', ')})` }]);
      return { value: load(hit), file: hit };
    }
    const want = `${snake(ref)}.json`;
    const hits = indexFor(kind).filter((f) => path.basename(f) === want);
    if (!hits.length) return null;
    return { value: load(hits[0]), file: hits[0], also: hits.slice(1) };
  };
}

const NAME_KINDS = new Set(Object.keys(LOOKUP_DIRS));

/** Resolve every meta ref (and data.doc / data.rows paths) in place. Returns { spec, refs, errors, warnings }. */
function resolveSpec(spec, specDir) {
  const errors = [], warnings = [], refs = {};
  const s = structuredClone(spec);
  const meta = isObj(s.meta) ? s.meta : (s.meta = {});
  const resolve = makeResolver(specDir, isObj(meta.children) ? meta.children : {});
  const one = (ref, kind, at, required = true) => {
    try {
      const r = resolve(ref, kind, at);
      if (r) {
        if (r.also?.length) warnings.push({ path: at, message: `"${ref}" matched ${r.also.length + 1} files; using ${path.relative(KIT, r.file)}` });
        if (r.file) refs[at] = r.file;
        return r.value;
      }
      const hint = `no ${snake(ref)}.json in the spec folder or its meta/ folder${NAME_KINDS.has(kind) ? ` or ${LOOKUP_DIRS[kind].join(', ')}` : ` (${kind} has no default lookup dir; give a path or inline JSON)`}`;
      (required ? errors : warnings).push({ path: at, message: `cannot resolve "${ref}": ${hint}` });
    } catch (e) { if (e instanceof SpecError) errors.push(...e.errors); else throw e; }
    return undefined;
  };
  for (const [k, v] of Object.entries(meta)) {
    if (k === 'states') continue;
    if (k === 'children') {
      if (isObj(v)) for (const [ck, cv] of Object.entries(v)) { const r = one(cv, 'doctype', `/meta/children/${ck}`); if (r !== undefined) v[ck] = r; }
      continue;
    }
    if (k === 'custom') {
      const list = Array.isArray(v) ? v : [v];
      meta.custom = list.map((x, i) => one(x, 'custom', Array.isArray(v) ? `/meta/custom/${i}` : '/meta/custom')).filter((x) => x !== undefined);
      continue;
    }
    if (typeof v === 'string' || isObj(v)) { const r = one(v, k, `/meta/${k}`); if (r !== undefined) meta[k] = r; else delete meta[k]; }
  }
  for (const o of [meta, isObj(meta.doctype) ? meta.doctype : null]) if (o && o.workflow !== undefined) { const w = normalizeWorkflow(o.workflow); if (w === undefined) delete o.workflow; else o.workflow = w; }
  if (isObj(meta.workspace) && typeof meta.workspace.content === 'string') {
    try { meta.workspace.content = JSON.parse(meta.workspace.content); } catch { errors.push({ path: '/meta/workspace/content', message: 'content is a string but not valid JSON' }); }
  }
  if (isObj(s.data)) {
    if (typeof s.data.doc === 'string') { const r = one(s.data.doc, 'doc', '/data/doc'); s.data.doc = r === undefined ? null : r; }
    if (typeof s.data.rows === 'string') {
      const r = one(s.data.rows, 'rows', '/data/rows');
      if (r !== undefined && !Array.isArray(r)) errors.push({ path: '/data/rows', message: 'file must hold a JSON array' });
      s.data.rows = Array.isArray(r) ? r : [];
    }
  }
  (s.overlays || []).forEach((o, i) => {
    if (o?.type === 'dialog' && o.doctype !== undefined) { const r = one(o.doctype, 'doctype', `/overlays/${i}/doctype`); if (r !== undefined) o.doctype = r; }
  });
  return { spec: s, refs, errors, warnings, resolve };
}

// ---------------------------------------------------------------- semantic checks

function semanticChecks(spec) {
  const errors = [], warnings = [];
  const meta = spec.meta || {};
  for (const need of PAGE_REQUIRES[spec.page] || []) {
    const any = [].concat(need);
    if (!any.some((k) => meta[k] !== undefined)) errors.push({ path: `/meta/${any[0]}`, message: `page "${spec.page}" needs meta.${any.join(' or meta.')}` });
  }
  const overlays = spec.overlays || [];
  if (spec.page === 'dialog' && !overlays.some((o) => o.type === 'dialog')) errors.push({ path: '/overlays', message: 'page "dialog" needs at least one dialog overlay' });

  const dt = isObj(meta.doctype) ? meta.doctype : null;
  const fieldnames = dt && Array.isArray(dt.fields) ? new Set([...dt.fields.map((f) => f.fieldname), ...STANDARD_FIELDS]) : null;
  const checkField = (name, at) => {
    if (fieldnames && name && !fieldnames.has(name)) warnings.push({ path: at, message: `"${name}" is not a field of ${dt.name || 'the doctype'}` });
  };
  const rows = Array.isArray(spec.data?.rows) ? spec.data.rows.length : spec.data?.rows?.$gen?.count;

  const menuSeen = new Set();
  let primaries = 0;
  overlays.forEach((o, i) => {
    const at = `/overlays/${i}`;
    if (o.type === 'button' && (o.style === 'primary' || o.primary_action)) primaries++;
    if (o.type === 'menu_open') {
      if (menuSeen.has(o.target)) warnings.push({ path: `${at}/target`, message: `menu "${o.target}" is opened twice` });
      menuSeen.add(o.target);
      const m = /^(field|column|group_by):(.+)$/.exec(o.target);
      if (m && !['assigned_to', 'owner', 'tags'].includes(m[2])) checkField(m[2], `${at}/target`);
      const r = /^row_actions:(\d+)$/.exec(o.target);
      if (r && rows !== undefined && +r[1] >= rows) warnings.push({ path: `${at}/target`, message: `row ${r[1]} is past the last row (${rows} rows)` });
      if (/^button_group:/.test(o.target) && !overlays.some((b) => b.type === 'button' && b.group === o.target.slice(13)))
        warnings.push({ path: `${at}/target`, message: `no button overlay has group "${o.target.slice(13)}"` });
    }
    if (o.type === 'list_select' && Array.isArray(o.rows) && rows !== undefined)
      o.rows.forEach((r, j) => { if (r >= rows) warnings.push({ path: `${at}/rows/${j}`, message: `row ${r} is past the last row (${rows} rows)` }); });
    if (o.type === 'filter_chips') o.items.forEach((f, j) => {
      const op = f.length === 4 ? f[2] : f[1];
      const fn = f.length === 4 ? f[1] : f[0];
      if (typeof op !== 'string' || !FILTER_OPERATORS.includes(op.toLowerCase()))
        errors.push({ path: `${at}/items/${j}`, message: `unknown operator ${JSON.stringify(op)} (allowed: ${FILTER_OPERATORS.join(', ')})` });
      if (f.length === 3) checkField(fn, `${at}/items/${j}/0`);
    });
    if (o.type === 'state') {
      const m = /^(row|cell):(\d+)(?::(.+))?$/.exec(o.target);
      if (m && rows !== undefined && +m[2] >= rows) warnings.push({ path: `${at}/target`, message: `row ${m[2]} is past the last row (${rows} rows)` });
      if (m?.[3]) checkField(m[3], `${at}/target`);
      const f = /^(field|column):(.+)$/.exec(o.target);
      if (f) checkField(f[2], `${at}/target`);
    }
  });
  if (spec.ctx?.chrome?.navbar === true) warnings.push({ path: '/ctx/chrome/navbar', message: 'chrome.navbar=true is not supported yet (navbar layout is broken and navbar.* popovers fall back to the top right); keep it off until slice 3' });
  if (primaries > 1) warnings.push({ path: '/overlays', message: `${primaries} primary buttons; Frappe shows one primary action` });

  if (spec.view?.sort?.field) checkField(spec.view.sort.field, '/view/sort/field');
  if (spec.view?.group_by) checkField(spec.view.group_by, '/view/group_by');
  if (dt && typeof spec.view?.tab === 'string' && Array.isArray(dt.fields)) {
    const tabs = ['Details', ...dt.fields.filter((f) => f.fieldtype === 'Tab Break').map((f) => f.label)];
    if (!tabs.includes(spec.view.tab)) warnings.push({ path: '/view/tab', message: `no tab "${spec.view.tab}" (tabs: ${tabs.join(', ')})` });
  }
  if (isObj(meta.workspace) && Array.isArray(meta.workspace.content)) meta.workspace.content.forEach((b, i) => {
    if (!isObj(b) || !WORKSPACE_BLOCKS.includes(b.type)) warnings.push({ path: `/meta/workspace/content/${i}`, message: `unknown block type ${JSON.stringify(b?.type)}` });
    else if (b.data?.col !== undefined && ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(b.data.col)) errors.push({ path: `/meta/workspace/content/${i}/data/col`, message: 'col must be an integer 1..12' });
  });
  return { errors, warnings };
}

// ---------------------------------------------------------------- public API

/**
 * Load, merge, validate and resolve a spec.
 * @returns {{ ok, file, spec, raw, refs, errors, warnings, notes, resolve }}
 *   spec: resolved spec (meta refs replaced by JSON, defaults NOT applied; see buildCtx for ctx defaults).
 */
export function loadSpec(file, overrides = {}) {
  const out = { ok: false, file: path.resolve(file), spec: null, raw: null, refs: {}, errors: [], warnings: [], notes: [], resolve: null };
  try { out.raw = readSpecFile(file); } catch (e) { if (e instanceof SpecError) { out.errors = e.errors; return out; } throw e; }
  if (Object.keys(overrides).length) out.raw = mergeSpec(out.raw, { ctx: overrides });
  out.errors.push(...validateSchema(out.raw));
  if (typeof out.raw.$schema === 'string' && out.raw.$schema !== SPEC_VERSION && !out.raw.$schema.endsWith('mock-spec.schema.json'))
    out.errors.push({ path: '/$schema', message: `unsupported spec version (this engine reads ${SPEC_VERSION})` });
  if (out.errors.length) return out;
  const r = resolveSpec(out.raw, path.dirname(out.file));
  out.spec = r.spec; out.refs = r.refs; out.resolve = r.resolve;
  out.errors.push(...r.errors); out.warnings.push(...r.warnings);
  if (!out.errors.length) { const s = semanticChecks(out.spec); out.errors.push(...s.errors); out.warnings.push(...s.warnings); }
  const rp = rendererPath(out.raw.page);
  if (!fs.existsSync(rp) && !BUILTIN[out.raw.page]) out.notes.push(`no renderer yet for page "${out.raw.page}" (${path.relative(KIT, rp)})`);
  out.ok = out.errors.length === 0;
  return out;
}

export const rendererPath = (page) => path.join(KIT, 'renderers', page, 'index.mjs');

/** Built-in renderers used only while renderers/<page>/index.mjs does not exist. */
const BUILTIN = {
  blank: () => ({ main: '' }),
};

/**
 * Runtime ctx handed to renderers and the shell: spec.ctx with defaults applied, plus helpers.
 *   resolve(ref, kind='doctype') -> JSON | null   (name, path or inline; meta.children consulted for doctypes)
 *   overlays                     -> all overlays, in spec order (read-only view)
 *   useOverlays(type, pred?)     -> matching overlays, marked as drawn
 *   href(kitRelPath)             -> URL from the output file to a kit file (css, sprite, fonts)
 *   warn(msg)                    -> report a problem without failing
 */
export function buildCtx(loaded, { outFile = null } = {}) {
  const c = normalizeCtx(loaded.spec.ctx || {});
  const overlays = Object.freeze((loaded.spec.overlays || []).map((o) => Object.freeze(o)));
  const used = new Set();
  const warnings = [];
  const outDir = outFile ? path.dirname(path.resolve(outFile)) : process.cwd();
  const helpers = {
    kit: KIT,
    specFile: loaded.file,
    specDir: path.dirname(loaded.file),
    overlays,
    useOverlays(type, pred = () => true) {
      const hit = overlays.filter((o) => o.type === type && pred(o));
      hit.forEach((o) => used.add(o));
      return hit;
    },
    resolve(ref, kind = 'doctype') {
      try { return loaded.resolve(ref, kind)?.value ?? null; } catch (e) { if (e instanceof SpecError) { warnings.push(e.message); return null; } throw e; }
    },
    href(kitRel) { return path.relative(outDir, path.join(KIT, kitRel)).split(path.sep).join('/'); },
    warn(msg) { warnings.push(String(msg)); },
  };
  Object.assign(c, helpers);
  Object.defineProperty(c, '_report', { enumerable: false, value: () => ({ warnings, unused: overlays.filter((o) => !used.has(o)) }) });
  return c;
}

const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/** Minimal document used when shell/shell.mjs is absent or ctx.chrome.shell is false. Same data-ui slots as the shell. */
function fallbackDocument(slots, spec, ctx, bare) {
  const body = bare
    ? `<main data-ui="main">${slots.main || ''}</main>`
    : `<div class="desk" data-ui="desk">
<header data-ui="navbar"></header>
<nav data-ui="dock"></nav>
<aside data-ui="sidebar"></aside>
<div data-ui="page">
<div data-ui="page-head">${slots.head || ''}</div>
<main data-ui="main">${slots.main || ''}</main>
<aside data-ui="right-panel">${slots.aside || ''}</aside>
</div>
<div data-ui="layer-popover"></div><div data-ui="layer-modal"></div><div data-ui="layer-toast"></div>
</div>`;
  return `<!doctype html>
<html lang="${escHtml(ctx.locale)}" dir="${ctx.dir}" data-theme="${ctx.theme}" data-page="${escHtml(spec.page)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escHtml(slots.title || spec.title || spec.page)}</title></head>
<body>
${body}
</body>
</html>
`;
}

/** Render a loaded spec to a full HTML document. Throws Error with a clear message on renderer problems. */
export async function renderSpec(loaded, { outFile = null } = {}) {
  if (!loaded.ok) throw new SpecError(loaded.errors);
  const spec = loaded.spec;
  const rp = rendererPath(spec.page);
  let renderer;
  if (fs.existsSync(rp)) {
    renderer = (await import(pathToFileURL(rp).href)).default;
    if (typeof renderer !== 'function') throw new Error(`${path.relative(KIT, rp)} must default-export a function (spec, ctx) => html`);
  } else if (BUILTIN[spec.page]) renderer = BUILTIN[spec.page];
  else throw new Error(`no renderer for page "${spec.page}": expected ${rp} with \`export default (spec, ctx) => html\``);
  const ctx = buildCtx(loaded, { outFile });
  let res = await renderer(spec, ctx);
  if (typeof res === 'string') res = { main: res };
  if (!isObj(res) || (typeof res.main !== 'string' && typeof res.document !== 'string'))
    throw new Error(`renderer for page "${spec.page}" must return a string or { main, head?, aside?, title? } or { document }`);
  let html;
  if (typeof res.document === 'string') html = res.document;
  else if (ctx.chrome.shell === false) html = fallbackDocument(res, spec, ctx, true);
  else {
    const shellPath = path.join(KIT, 'shell', 'shell.mjs');
    if (fs.existsSync(shellPath)) {
      const shell = (await import(pathToFileURL(shellPath).href)).default;
      if (typeof shell !== 'function') throw new Error('shell/shell.mjs must default-export a function (slots, spec, ctx) => html');
      html = await shell(res, spec, ctx);
      if (typeof html !== 'string') throw new Error('shell/shell.mjs must return an HTML string');
    } else html = fallbackDocument(res, spec, ctx, false);
  }
  if (html.includes('class="body-sidebar-container') || html.includes('data-ui="shell.main"')) html = applyMobile(html, ctx);
  html = addSymbols(drawOverlays(html, ctx, OVERLAY_LAYER).html);
  const rep = ctx._report();
  return {
    html,
    warnings: [...rep.warnings, ...rep.unused.map((o) => `overlay ${loaded.spec.overlays.indexOf(o)} (${o.type}${o.target ? ` ${o.target}` : o.label ? ` "${o.label}"` : ''}) was not drawn by page "${spec.page}"`)],
  };
}

// ---------------------------------------------------------------- CLI

const USAGE = `usage:
  node bin/mock.mjs validate <spec.json>... [--json]
  node bin/mock.mjs render <spec.json> [--out file.html] [--theme light|dark] [--rtl] [--viewport WxH|desktop|tablet|mobile] [--today YYYY-MM-DD] [--locale xx]
exit codes: 0 ok, 1 invalid spec, 2 renderer missing or failed, 64 usage`;

function parseArgs(argv) {
  const o = { files: [], overrides: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) throw new Error(`${a} needs a value`); return argv[++i]; };
    if (a === '--json') o.json = true;
    else if (a === '--out') o.out = val();
    else if (a === '--theme') o.overrides.theme = val();
    else if (a === '--rtl') o.overrides.rtl = true;
    else if (a === '--viewport') o.overrides.viewport = val();
    else if (a === '--today') o.overrides.today = val();
    else if (a === '--locale') o.overrides.locale = val();
    else if (a === '-h' || a === '--help') o.help = true;
    else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else o.files.push(a);
  }
  return o;
}

const fmt = (file, e) => `${file}: ${e.path}: ${e.message}`;

async function main(argv) {
  const [cmd, ...rest] = argv;
  let o;
  try { o = parseArgs(rest); } catch (e) { console.error(`mock: ${e.message}\n${USAGE}`); return 64; }
  if (!cmd || o.help || cmd === 'help') { console.log(USAGE); return cmd ? 0 : 64; }

  if (cmd === 'validate') {
    if (!o.files.length) { console.error(USAGE); return 64; }
    const results = o.files.map((f) => {
      const r = loadSpec(f, o.overrides);
      return { file: f, ok: r.ok, errors: r.errors.map(({ path: p, message }) => ({ path: p, message })), warnings: r.warnings, notes: r.notes };
    });
    if (o.json) console.log(JSON.stringify(results, null, 2));
    else for (const r of results) {
      console.log(`${r.ok ? 'ok     ' : 'INVALID'} ${r.file}`);
      for (const e of r.errors) console.log(`  error  ${fmt(r.file, e)}`);
      for (const w of r.warnings) console.log(`  warn   ${fmt(r.file, w)}`);
      for (const n of r.notes) console.log(`  note   ${n}`);
    }
    return results.every((r) => r.ok) ? 0 : 1;
  }

  if (cmd === 'render') {
    if (o.files.length !== 1) { console.error(USAGE); return 64; }
    const f = o.files[0];
    const r = loadSpec(f, o.overrides);
    if (!r.ok) { for (const e of r.errors) console.error(`error ${fmt(f, e)}`); return 1; }
    for (const w of r.warnings) console.error(`warn  ${fmt(f, w)}`);
    let res;
    try { res = await renderSpec(r, { outFile: o.out }); } catch (e) { console.error(`mock render: ${f}: ${e.message}`); return 2; }
    for (const w of res.warnings) console.error(`warn  ${f}: ${w}`);
    if (o.out) { fs.mkdirSync(path.dirname(path.resolve(o.out)), { recursive: true }); fs.writeFileSync(o.out, res.html); console.error(`wrote ${o.out}`); }
    else process.stdout.write(res.html);
    return 0;
  }

  console.error(`mock: unknown command "${cmd}"\n${USAGE}`);
  return 64;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }, (e) => { console.error(e.stack || e.message); process.exitCode = 2; });
}
