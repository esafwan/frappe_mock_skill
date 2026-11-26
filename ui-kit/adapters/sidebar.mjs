// Adapter: flat indent-shaped sidebar (indent 0 = Section Break, indent 1 = child) <-> nested { items:[{..., children}] }.
// Nested `children` is the canonical shape. Idempotent on already nested input. Output feeds shell/sidebar.mjs renderSidebar.
const isNested = (items) => (items || []).some((i) => Array.isArray(i.children));

export function adaptFlatSidebar(json) {
  const src = json?.items || [];
  if (isNested(src)) return { ...json, items: src.map(cleanNested) };
  const out = []; let section = null;
  for (const it of src) {
    const { indent, ...rest } = it;
    if (it.type === 'Section Break' && !(indent >= 1)) { section = { ...rest, children: [] }; out.push(section); }
    else if (indent >= 1 && section) section.children.push({ ...rest, child: 1 });
    else { out.push(rest); section = null; }
  }
  return { ...json, items: out };
}
function cleanNested(it) {
  if (!it.children) return it;
  return { ...it, children: it.children.map((c) => ({ ...cleanNested(c), ...(c.children ? {} : { child: 1 }) })) };
}

// Inverse: nested -> flat with indent (depth) on every item. Section Break at depth 0 has indent 0.
export function flattenSidebar(json) {
  const out = [];
  const walk = (items, depth) => {
    for (const it of items || []) {
      const { children, child, ...rest } = it;
      out.push({ ...rest, indent: depth });
      if (children) walk(children, depth + 1);
    }
  };
  walk(json?.items, 0);
  return { ...json, items: out };
}
