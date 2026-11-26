// Seeded deterministic sample-data generator. No clocks, no Math.random.
// Dates derive from ctx.today (data). Generic: no doctype/brand names here.
import fs from 'node:fs';
const H = new URL('.', import.meta.url).pathname;
const readJ = (p) => JSON.parse(fs.readFileSync(H + p, 'utf8'));
let _P; const P = () => (_P ??= { links: readJ('pools/links.json'), fields: readJ('pools/fields.json'), text: readJ('pools/text.json').phrases });
let _U; const U = () => (_U ??= { locales: readJ('universals/locales.json'), currencies: readJ('universals/currencies.json') });

export const FIELDTYPES = ['Attach', 'Attach Image', 'Autocomplete', 'Barcode', 'Button', 'Check', 'Code', 'Color', 'Column Break', 'Currency', 'Data', 'Date', 'Datetime', 'Duration', 'Dynamic Link', 'Float', 'Fold', 'Geolocation', 'HTML', 'HTML Editor', 'Heading', 'Icon', 'Image', 'Int', 'JSON', 'Link', 'Long Text', 'Markdown Editor', 'Password', 'Percent', 'Phone', 'Rating', 'Read Only', 'Section Break', 'Select', 'Signature', 'Small Text', 'Tab Break', 'Table', 'Table MultiSelect', 'Text', 'Text Editor', 'Time'];
export const LAYOUT_TYPES = new Set(['Column Break', 'Section Break', 'Tab Break', 'Fold', 'Button', 'Heading', 'HTML']);

export function hash(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
export function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const WORDS = ['alpha', 'beacon', 'cedar', 'delta', 'ember', 'falcon', 'garnet', 'harbor', 'indigo', 'juniper', 'kestrel', 'lumen', 'meadow', 'nimbus', 'onyx', 'pioneer', 'quartz', 'river', 'summit', 'topaz', 'umber', 'vertex', 'willow', 'zephyr'];
const NAMES = ['Aisha Khan', 'Liam Chen', 'Maria Garcia', 'Omar Haddad', 'Priya Nair', 'Noah Smith', 'Fatima Zahra', 'Ethan Brown', 'Sofia Rossi', 'Yusuf Ali', 'Hannah Weber', 'Ravi Menon'];
const STATUS = ['Draft', 'Open', 'Pending', 'In Progress', 'Completed', 'Cancelled'];
const COLORS = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce', '#805ad5', '#d53f8c'];
const ICONS = ['star', 'users', 'file', 'calendar', 'settings', 'tag', 'bell'];
const TZ_OFFSET = '+00:00';

const dateAdd = (iso, days) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
const pad = (n) => String(n).padStart(2, '0');
const title = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const slug = (s) => String(s || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function resolveCtx(ctx = {}) {
  const locale = ctx.locale || 'en-US/USD';
  const L = U().locales[locale] || U().locales[Object.keys(U().locales).find((k) => k.startsWith(locale)) || 'en-US/USD'];
  const cur = U().currencies[ctx.currency || L.currency];
  return { seed: ctx.seed ?? 1, today: ctx.today || '2026-01-15', locale: L.id, L, cur, rtl: ctx.rtl ?? L.dir === 'rtl', linkPools: ctx.linkPools || {}, doctype: ctx.doctype || '' };
}

function rngFor(c, f, row, extra = '') {
  return mulberry32(hash([c.seed, c.doctype, f.fieldname || '', f.fieldtype, c.locale, row, extra].join('|')));
}
const pick = (r, a) => a[Math.floor(r() * a.length)];
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const sentence = (r, n) => { const w = Array.from({ length: n }, () => pick(r, WORDS)); const s = w.join(' '); return s[0].toUpperCase() + s.slice(1) + '.'; };

export function selectOptions(f) { return String(f.options || '').split('\n').map((s) => s.trim()).filter(Boolean); }
function linkPool(c, f) {
  const key = f.options || f.fieldname;
  if (c.linkPools[key]?.length) return c.linkPools[key];
  const p = P();
  if (p.links[f.options]) return p.links[f.options];
  if (p.fields[f.fieldname]) return p.fields[f.fieldname];
  if (/currency/.test(f.fieldname || '')) return p.links.Currency;
  const base = title(f.options || f.fieldname || 'Item');
  return [1, 2, 3, 4, 5].map((i) => `${base} ${String(i).padStart(3, '0')}`);
}
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();
const phrase = (r) => pick(r, P().text);

// One value for one field. `row` is the row index (varies values across rows).
export function genValue(field, ctx = {}, row = 0, doc = {}) {
  const c = ctx._resolved ? ctx : { ...resolveCtx(ctx), _resolved: true };
  const f = field, r = rngFor(c, f, row), t = f.fieldtype, fn = f.fieldname || '';
  switch (t) {
    case 'Column Break': case 'Section Break': case 'Tab Break': case 'Fold': case 'Button': case 'Heading': case 'HTML': return null;
    case 'Check': return r() < 0.5 ? 1 : 0;
    case 'Int': return int(r, 1, 500);
    case 'Float': return Math.round((r() * 1000) * 1000) / 1000;
    case 'Currency': return Math.round(r() * 100000) / 100;
    case 'Percent': return Math.round(r() * 10000) / 100;
    case 'Rating': return Math.round(int(r, 1, 5)) / 5; // v16 stores 0..1
    case 'Duration': return int(r, 1, 48) * 900; // seconds
    case 'Date': return dateAdd(c.today, int(r, -60, 60));
    case 'Datetime': return `${dateAdd(c.today, int(r, -30, 30))} ${pad(int(r, 8, 18))}:${pad(int(r, 0, 59))}:00`;
    case 'Time': return `${pad(int(r, 8, 18))}:${pad(int(r, 0, 59))}:00`;
    case 'Select': { const o = selectOptions(f); if (o.length) return f.default && o.includes(f.default) && row === 0 ? f.default : pick(r, o); return pick(r, STATUS); }
    case 'Link': return pick(r, linkPool(c, f));
    case 'Dynamic Link': { const dt = doc[f.options]; return `${title(dt || 'Record')} ${String(int(r, 1, 5)).padStart(3, '0')}`; }
    case 'Table': case 'Table MultiSelect': return [];
    case 'Autocomplete': { const o = selectOptions(f); return o.length ? pick(r, o) : pick(r, NAMES); }
    case 'Phone': return `+${int(r, 20, 99)} ${int(r, 100, 999)} ${int(r, 100, 999)} ${int(r, 1000, 9999)}`;
    case 'Color': return pick(r, COLORS);
    case 'Icon': return pick(r, ICONS);
    case 'Password': return '********';
    case 'Barcode': return String(int(r, 100000000, 999999999)) + String(int(r, 1000, 9999));
    case 'Code': return `function ${pick(r, WORDS)}() {\n  return ${int(r, 1, 99)};\n}`;
    case 'JSON': return JSON.stringify({ [pick(r, WORDS)]: int(r, 1, 99), enabled: r() < 0.5 });
    case 'Geolocation': return JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [Math.round((r() * 160 - 80) * 1e4) / 1e4, Math.round((r() * 120 - 60) * 1e4) / 1e4] } }] });
    case 'Attach': return `/files/${slug(fn)}-${int(r, 1, 99)}.pdf`;
    case 'Attach Image': case 'Image': case 'Signature': return `/files/${slug(fn)}-${int(r, 1, 99)}.png`;
    case 'Small Text': case 'Text': case 'Long Text': return oneLine(P().fields[fn] ? pick(r, P().fields[fn]) : phrase(r));
    case 'Markdown Editor': return `## ${title(pick(r, WORDS))}\n\n- ${sentence(r, 4)}\n- ${sentence(r, 4)}`;
    case 'HTML Editor': case 'Text Editor': return `<p>${sentence(r, 8)}</p>`;
    case 'Read Only': if (P().fields[fn]) return pick(r, P().fields[fn]); return sentence(r, 2).replace('.', '');
    case 'Data': {
      const o = f.options;
      if (o === 'Email' || /email/.test(fn)) return `${slug(pick(r, NAMES)).replace(/-/g, '.')}@example.com`;
      if (o === 'Phone' || /phone|mobile/.test(fn)) return genValue({ ...f, fieldtype: 'Phone' }, c, row, doc);
      if (o === 'URL' || /url|website/.test(fn)) return `https://example.com/${pick(r, WORDS)}`;
      if (P().fields[fn]) return pick(r, P().fields[fn]);
      if (o === 'Name' || /(^|_)name$/.test(fn)) return pick(r, NAMES);
      return title(pick(r, WORDS)) + ' ' + int(r, 1, 99);
    }
    default: return sentence(r, 3); // unknown fieldtype: harmless text
  }
}

// Resolve status-ish default for first row from field.default
export function genDoc(meta, ctx = {}, row = 0, opts = {}) {
  const c = { ...resolveCtx({ ...ctx, doctype: ctx.doctype || meta.name || meta.doctype }), };
  c._resolved = true;
  const doc = { doctype: c.doctype };
  const fields = meta.fields || [];
  for (const f of fields) {
    if (LAYOUT_TYPES.has(f.fieldtype) || !f.fieldname) continue;
    if (f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect') continue;
    doc[f.fieldname] = genValue(f, c, row, doc);
  }
  doc.name = opts.name || `${slug(c.doctype).toUpperCase().slice(0, 6)}-${String(row + 1).padStart(5, '0')}`;
  doc.docstatus = 0;
  doc.creation = `${dateAdd(c.today, -(row + 1))} 09:00:00`;
  doc.modified = `${dateAdd(c.today, -row)} 10:30:00`;
  doc.owner = 'user@example.com';
  for (const f of fields) {
    if ((f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect') && f.fieldname) {
      const cm = opts.childMetas?.[f.options];
      const n = opts.childCount ?? (rngFor(c, f, row)() * 3 + 2 | 0);
      doc[f.fieldname] = cm ? genRows(cm, { ...ctx, doctype: f.options }, { count: n, childOf: doc.name, parentfield: f.fieldname }) : [];
    }
  }
  return doc;
}

export function genRows(meta, ctx = {}, { count = 10, childOf, parentfield } = {}) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const d = genDoc(meta, ctx, i, {});
    if (childOf) { d.parent = childOf; d.parentfield = parentfield; d.idx = i + 1; d.name = `${childOf}-${i + 1}`; }
    rows.push(d);
  }
  return rows;
}

// Spec entry point: data = {"$gen": {count, seed}}
export function expandGen(spec, meta, ctx = {}, childMetas = {}) {
  const g = spec?.$gen || {};
  return genRows(meta, { ...ctx, seed: g.seed ?? ctx.seed }, { count: g.count ?? 10 });
}
