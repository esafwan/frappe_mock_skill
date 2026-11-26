import { evalDepends } from './depends.mjs';

const hasValue = (v) => v !== undefined && v !== null && v !== '' && v !== 0 && v !== false;

// opts.emitHidden: keep hidden / depends_on-false fields as {_hidden:true} so the renderer can emit them
// display:none (live parity). Off by default until wrapControl honors f._hidden (else they would show).
export function buildLayout(meta, doc = {}, opts = {}) {
  const fields = meta.fields || [];
  const byName = new Map(fields.map((f) => [f.fieldname, f]));
  const order = [];
  const seen = new Set();
  for (const n of meta.field_order || []) if (byName.has(n) && !seen.has(n)) { order.push(byName.get(n)); seen.add(n); }
  for (const f of fields) if (!seen.has(f.fieldname)) { order.push(f); seen.add(f.fieldname); }

  const tabs = [];
  let tab = null, sec = null, col = null;
  const newTab = (label, fieldname, hidden) => { tab = { label, fieldname, hidden: !!hidden, dep: undefined, sections: [] }; tabs.push(tab); sec = null; col = null; };
  const newSec = (df) => {
    if (!tab) newTab('Details', '__details');
    sec = { dep: df?.depends_on, label: df?.label || '', fieldname: df?.fieldname || '', collapsible: !!df?.collapsible, collapsible_depends_on: df?.collapsible_depends_on, hidden: !!df?.hidden, columns: [] };
    tab.sections.push(sec); col = null;
  };
  const newCol = () => { if (!sec) newSec(null); col = { fields: [] }; sec.columns.push(col); };

  for (const df of order) {
    switch (df.fieldtype) {
      case 'Tab Break': newTab(df.label || df.fieldname, df.fieldname, df.hidden); tab.dep = df.depends_on; break;
      case 'Section Break': case 'Fold': newSec(df); break;
      case 'Column Break': newCol(); break;
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
      secs.push({ label: s.label, fieldname: s.fieldname, collapsible: s.collapsible, collapsed, columns });
    }
    if (secs.length) out.push({ label: t.label, fieldname: t.fieldname, sections: secs });
  }
  // New unsaved doc: live form has no right sidebar / View-Create-Actions buttons and a narrow centered form.
  const isNew = !doc?.name;
  return { tabs: out, isNew, narrow: isNew, noRightSidebar: isNew, noToolbarMenus: isNew };
}
