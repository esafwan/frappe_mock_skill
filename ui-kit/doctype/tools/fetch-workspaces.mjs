// Fetch Frappe v16 workspace sidebar definitions from GitHub raw -> workspaces/<slug>.json
import fs from 'node:fs'; import path from 'node:path';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'workspaces');
const E = 'https://raw.githubusercontent.com/frappe/erpnext/version-16/erpnext/';
const I = 'https://raw.githubusercontent.com/resilient-tech/india-compliance/version-16/india_compliance/';
const SRC = [
  ['accounts', 'Accounts', E + 'accounts/sidebar/accounts/accounts.json'],
  ['selling', 'Selling', E + 'workspace_sidebar/selling.json'],
  ['stock', 'Stock', E + 'workspace_sidebar/stock.json'],
  ['gst_india', 'GST India', I + 'workspace_sidebar/gst_india.json'],
];
for (const [slug, title, url] of SRC) {
  const j = await (await fetch(url)).json();
  const items = []; let cur = null;
  for (const it of j.items || []) {
    const o = { label: it.label, icon: it.icon || '', link_to: it.link_to || '', link_type: it.link_type || '', type: it.type };
    if (it.type === 'Section Break' || it.type === 'Spacer') { o.children = []; items.push(o); cur = o.type === 'Section Break' ? o : null; continue; }
    if (it.child && cur) cur.children.push(o); else { items.push(o); cur = null; }
  }
  fs.writeFileSync(path.join(OUT, slug + '.json'), JSON.stringify({ title, app: j.app, header_icon: j.header_icon, source: url, items }, null, 1));
  console.log(slug, items.length);
}

// lucide icons used by the sidebars -> workspaces/icons.json (inner svg markup)
const used = new Set();
for (const f of fs.readdirSync(OUT)) if (f !== 'icons.json' && f.endsWith('.json')) {
  const w = JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'));
  for (const it of w.items) { if (it.icon) used.add(it.icon); for (const c of it.children || []) if (c.icon) used.add(c.icon); }
}
const ALIAS = { home: 'house', sell: 'store' };
const icons = {};
for (const n of used) {
  const r = await fetch(`https://unpkg.com/lucide-static@0.468.0/icons/${ALIAS[n] || n}.svg`);
  if (!r.ok) { console.warn('no lucide icon', n); continue; }
  icons[n] = (await r.text()).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
}
fs.writeFileSync(path.join(OUT, 'icons.json'), JSON.stringify(icons, null, 1));
console.log('icons', Object.keys(icons).length);
