// Agents area fixtures: /api/resource/Agent list + count. Data: data/huf/agents.json (fictional).
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const { agents } = JSON.parse(fs.readFileSync(ROOT + 'data/huf/agents.json', 'utf8'));
  const match = (a, filters = []) => filters.every(([f, op, v]) => op === '=' ? String(a[f] ?? 0) === String(v) : op === 'like' ? String(a[f] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase()) : true);
  await page.route('**/api/resource/Agent?**', (r) => { const a = args(r.request()); const rows = agents.filter((x) => match(x, a.filters || [])); const s = +(a.limit_start || 0), n = +(a.limit_page_length || a.limit || 1000); return json(r, { data: rows.slice(s, s + n) }); });
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request()); return json(r, { message: a.doctype === 'Agent' ? agents.filter((x) => match(x, a.filters || [])).length : 0 }); });
}
