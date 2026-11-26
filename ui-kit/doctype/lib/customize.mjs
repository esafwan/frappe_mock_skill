// Apply Custom Fields (insert_after) and Property Setters to a DocType meta. Pure; returns new meta.
function cast(value, type) {
  if (type === 'Check' || type === 'Int') { const n = parseInt(value, 10); return Number.isNaN(n) ? 0 : n; }
  if (type === 'Float' || type === 'Currency') { const n = parseFloat(value); return Number.isNaN(n) ? 0 : n; }
  return value;
}

export function applyCustomizations(meta, customFields = [], propertySetters = []) {
  const out = JSON.parse(JSON.stringify(meta));
  out.fields = out.fields || [];
  const byName = new Map(out.fields.map(f => [f.fieldname, f]));
  // base order: field_order, then leftovers in fields order
  let order = [...(out.field_order || [])].filter(n => byName.has(n));
  for (const f of out.fields) if (!order.includes(f.fieldname)) order.push(f.fieldname);

  // Custom fields: only those targeting this doctype (if dt given); repeat passes so chains resolve in any input order.
  let pending = (customFields || []).filter(c => c && c.fieldname && (!c.dt || c.dt === out.name))
    .map(c => ({ ...c, custom: 1 }));
  const placed = new Set();
  let progress = true;
  while (pending.length && progress) {
    progress = false;
    const next = [];
    for (const c of pending) {
      const anchor = c.insert_after;
      if (anchor && !order.includes(anchor) && pending.some(p => p !== c && p.fieldname === anchor)) { next.push(c); continue; }
      const { dt, insert_after, ...df } = c;
      if (byName.has(df.fieldname)) { Object.assign(byName.get(df.fieldname), df); progress = true; continue; }
      const idx = anchor ? order.indexOf(anchor) : -1;
      if (idx >= 0) order.splice(idx + 1, 0, df.fieldname); else order.push(df.fieldname);
      out.fields.push(df); byName.set(df.fieldname, df); placed.add(df.fieldname); progress = true;
    }
    pending = next;
  }
  for (const c of pending) { // unresolvable cycle: append
    const { dt, insert_after, ...df } = c;
    if (!byName.has(df.fieldname)) { out.fields.push(df); byName.set(df.fieldname, df); order.push(df.fieldname); }
  }

  // Property Setters
  for (const ps of propertySetters || []) {
    if (ps.doc_type && ps.doc_type !== out.name) continue;
    const v = cast(ps.value, ps.property_type);
    if (ps.doctype_or_field === 'DocType') out[ps.property] = v;
    else if (ps.doctype_or_field === 'DocField' && byName.has(ps.field_name)) byName.get(ps.field_name)[ps.property] = v;
  }
  out.field_order = order;
  out.fields = order.map(n => byName.get(n));
  return out;
}
