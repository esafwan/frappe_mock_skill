import { evalDepends } from './depends.mjs';

// Column Break width: "30%" / 30 (percent) or "columns" 1-12 grid units; undefined = equal share.
function parseWidth(df) {
  if (!df) return undefined;
  const w = df.width ?? df.columns;
  if (w === undefined || w === null || w === '') return undefined;
  const m = String(w).trim().match(/^(\d+(?:\.\d+)?)\s*(%?)$/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  if (m[2]) return n;
  return df.width === undefined ? +(n / 12 * 100).toFixed(4) : n;
}

const hasValue = (v) => v !== undefined && v !== null && v !== '' && v !== 0 && v !== false;

// opts.emitHidden: keep hidden / depends_on-false fields as {_hidden:true} so the renderer can emit them
// display:none (live parity). Off by default until wrapControl honors f._hidden (else they would show).
export function buildLayout(meta, doc = {}, opts = {}) {
  const fields = meta.fields || [];
  const byName = new Map(fields.map((f) => [f.fieldname, f]));
  const order = [];
  const seen = new Set();
  for (const n of meta.field_order || []) if (byName.has(n) && !seen.has(n)) { order.push(byName.get(n)); seen.add(n); }
  const loose = fields.filter((f) => !seen.has(f.fieldname));
  // insert_after: place a field directly after its anchor (Custom Field semantics); unresolved ones append.
  const rest = [];
  for (const f of loose) {
    const at = f.insert_after ? order.findIndex((o) => o.fieldname === f.insert_after) : -1;
    if (at >= 0) { let i = at + 1; while (i < order.length && order[i]._ins === f.insert_after) i++; order.splice(i, 0, { ...f, _ins: f.insert_after }); seen.add(f.fieldname); }
    else rest.push(f);
  }
  for (const f of rest) { order.push(f); seen.add(f.fieldname); }

  const tabs = [];
  let tab = null, sec = null, col = null, folded = false;
  const newTab = (label, fieldname, hidden) => { tab = { label, fieldname, hidden: !!hidden, dep: undefined, sections: [] }; tabs.push(tab); sec = null; col = null; };
  const newSec = (df) => {
    if (!tab) newTab('Details', '__details');
    sec = { dep: df?.depends_on, label: df?.label || '', fieldname: df?.fieldname || '', collapsible: !!df?.collapsible, collapsible_depends_on: df?.collapsible_depends_on, hidden: !!df?.hidden, description: df?.description || '', hide_border: !!df?.hide_border, isFold: df?.fieldtype === 'Fold', folded, columns: [] };
    tab.sections.push(sec); col = null;
  };
  const newCol = (df) => { if (!sec) newSec(null); col = { fields: [], width: parseWidth(df) }; sec.columns.push(col); };

  for (const df of order) {
    switch (df.fieldtype) {
      case 'Tab Break': newTab(df.label || df.fieldname, df.fieldname, df.hidden); tab.dep = df.depends_on; break;
      case 'Fold': folded = true; newSec(df); break;
      case 'Section Break': newSec(df); break;
      case 'Column Break': newCol(df); break;
      default:
        if (!col) newCol();
        {
          // Live Frappe emits every field as a .frappe-control, even hidden ones (display:none, 0x0).
          // Flag them with _hidden so renderers keep them in the DOM but invisible.
          const f = { ...df };
          const d = df.depends_on ? evalDepends(df.depends_on, doc) : true;
          if (df.hidden || d === false) { if (!opts.emitHidden) break; f._hidden = true; }
          else if (d === null) f._dep_unknown = true;
          if (df.mandatory_depends_on) { const m = evalDepends(df.mandatory_depends_on, doc); if (m === true) f.reqd = 1; else if (m === null) f._dep_unknown = true; }
          if (df.read_only_depends_on) { const r = evalDepends(df.read_only_depends_on, doc); if (r === true) f.read_only = 1; else if (r === null) f._dep_unknown = true; }
          col.fields.push(f);
        }
    }
  }

  const out = [];
  for (const t of tabs) {
    if (t.hidden || (t.dep && evalDepends(t.dep, doc) === false)) continue;
    const secs = [];
    for (const s of t.sections) {
      if (s.hidden || (s.dep && evalDepends(s.dep, doc) === false)) continue;
      const columns = s.columns.filter((c) => c.fields.some((f) => !f._hidden));
      if (!columns.length) continue;
      const anyVal = columns.some((c) => c.fields.some((f) => !f._hidden && hasValue(doc?.[f.fieldname])));
      const dep = s.collapsible_depends_on ? evalDepends(s.collapsible_depends_on, doc) : null;
      const collapsed = s.collapsible && !anyVal && dep !== true;
      // Normalise widths: explicit percents kept, unspecified columns share the remainder equally.
      const set = columns.filter((c) => c.width !== undefined);
      const left = Math.max(0, 100 - set.reduce((a, c) => a + c.width, 0));
      const unset = columns.length - set.length;
      for (const c of columns) c.pct = c.width !== undefined ? c.width : +(left / (unset || 1)).toFixed(4);
      secs.push({ label: s.label, fieldname: s.fieldname, description: s.description, hide_border: s.hide_border, isFold: s.isFold, folded: s.folded, ncols: columns.length, collapsible: s.collapsible, collapsed, columns });
    }
    if (secs.length) out.push({ label: t.label, fieldname: t.fieldname, sections: secs });
  }
  // New unsaved doc: live form has no right sidebar / View-Create-Actions buttons and a narrow centered form.
  const isNew = !doc?.name;
  return { tabs: out, isNew, narrow: isNew, noRightSidebar: isNew, noToolbarMenus: isNew };
}
