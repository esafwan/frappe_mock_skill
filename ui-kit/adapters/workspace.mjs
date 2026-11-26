// Adapter: legacy workspace json ({name,label,title,icon,links:[Card Break|Link],shortcuts}) -> Frappe-native Workspace
// ({doctype:'Workspace', public, content[] blocks, links with link_count/link_type, shortcuts with link_to/type}).
// Idempotent on native input. `content` may be a JSON string (Frappe storage) or an array; output is always an array.
const hash = (s) => { let h = 5381; for (const c of s) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(16).padStart(8, '0').slice(0, 10); };
const inferLinkType = (to, hint) => hint || (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(to || '') || /^[a-z0-9_]+$/.test(to || '') && to === (to || '').toLowerCase() && /[-]/.test(to) ? 'Page' : 'DocType');

export function parseContent(c) {
  if (Array.isArray(c)) return c;
  if (typeof c === 'string' && c.trim()) return JSON.parse(c);
  return [];
}

export function adaptWorkspace(ws, { reports = [] } = {}) {
  const repSet = new Set(reports);
  const links = [];
  let cur = null;
  for (const l of ws.links || []) {
    if (l.type === 'Card Break') { cur = { ...l, link_count: 0, hidden: l.hidden ?? 0, onboard: l.onboard ?? 0 }; delete cur.link_to; links.push(cur); }
    else {
      const link_type = l.link_type || (repSet.has(l.link_to) ? 'Report' : inferLinkType(l.link_to));
      links.push({ ...l, type: 'Link', link_type, hidden: l.hidden ?? 0, onboard: l.onboard ?? 0, is_query_report: link_type === 'Report' ? 1 : (l.is_query_report ?? 0) });
      if (cur) cur.link_count++;
    }
  }
  const shortcuts = (ws.shortcuts || []).map((s) => ({ ...s, type: s.type || inferLinkType(s.link_to, s.link_type) }));
  let content = parseContent(ws.content);
  if (!content.length && !ws.content) {
    content = shortcuts.map((s) => ({ id: hash('s' + s.label), type: 'shortcut', data: { shortcut_name: s.label, col: 3 } }));
    for (const l of links.filter((x) => x.type === 'Card Break')) content.push({ id: hash('c' + l.label), type: 'card', data: { card_name: l.label, col: 4 } });
  }
  return { doctype: 'Workspace', public: 1, is_hidden: 0, ...ws, name: ws.name || ws.label || ws.title, label: ws.label || ws.title || ws.name, title: ws.title || ws.label || ws.name, links, shortcuts, content };
}

// Inverse: native -> legacy shape (drops derived fields). adaptWorkspace(toLegacyWorkspace(x)) keeps links/shortcuts stable.
export function toLegacyWorkspace(ws) {
  const links = (ws.links || []).map((l) => (l.type === 'Card Break'
    ? { label: l.label, type: 'Card Break', link_to: null }
    : { label: l.label, type: 'Link', link_to: l.link_to }));
  const shortcuts = (ws.shortcuts || []).map((s) => ({ label: s.label, type: s.type, link_to: s.link_to }));
  const out = { name: ws.name, label: ws.label, title: ws.title };
  if (ws.icon) out.icon = ws.icon;
  return { ...out, links, shortcuts };
}
