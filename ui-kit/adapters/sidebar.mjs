// Adapter: flat indent-shaped sidebar (indent 0 = Section Break, indent 1 = child) -> nested { items:[{..., children}] }
// Also accepts workspace JSON already nested. Output feeds shell/sidebar.mjs renderSidebar.
export function adaptFlatSidebar(json) {
  const out = []; let section = null;
  for (const it of json.items || []) {
    const { indent, ...rest } = it;
    if (it.children) { out.push(it); section = null; continue; }
    if (it.type === 'Section Break') { section = { ...rest, children: [] }; out.push(section); }
    else if (indent >= 1 && section) section.children.push({ ...rest, child: 1 });
    else { out.push(rest); section = null; }
  }
  return { ...json, items: out };
}
