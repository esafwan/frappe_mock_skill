// Tools area fixtures: Execution Profile, SSH Connection, Network Access Policy, Batch Job (list, single doc, counts).
// Data: data/huf/tools.json (fictional, Northwind Trading). Page-level variants via ?demo=<variant>:
//   demo=empty -> every list is empty (first-run empty states)
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/tools.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const TABLES = { 'Execution Profile': ['profiles', 'name'], 'SSH Connection': ['ssh', 'name'], 'Network Access Policy': ['policies', 'name'], 'Batch Job': ['batch', 'name'] };
  const rows = (dt) => (demo() === 'empty' ? [] : D[TABLES[dt][0]]);
  const match = (row, filters = []) => (Array.isArray(filters) ? filters : Object.entries(filters).map(([k, v]) => [k, '=', v])).every((f) => {
    const [field, op, v] = f.length === 4 ? f.slice(1) : f;
    if (op === '=') return String(row[field] ?? 0) === String(v);
    if (op === 'like') return Object.values(row).some((x) => typeof x === 'string') && String(row[field] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase());
    return true;
  });
  for (const dt of Object.keys(TABLES)) {
    const enc = encodeURIComponent(dt);
    await page.route(new RegExp(`/api/resource/${enc}(\\?|$)`), (r) => { const a = args(r.request());
      const key = dt === 'Batch Job' ? 'creation' : 'modified';
      const list = rows(dt).filter((x) => match(x, a.filters || [])).sort((x, y) => String(y[key]).localeCompare(String(x[key])));
      const s = +(a.limit_start || 0), n = +(a.limit || a.limit_page_length || 1000);
      return json(r, { data: list.slice(s, s + n) }); });
    await page.route(new RegExp(`/api/resource/${enc}/[^?]+`), (r) => {
      const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
      const doc = D[TABLES[dt][0]].find((x) => x.name === name);
      return doc ? json(r, { data: { doctype: dt, ...doc } }) : json(r, { exc_type: 'DoesNotExistError', message: 'Not found' }, 404); });
  }
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request());
    if (!TABLES[a.doctype]) return r.fallback();
    return json(r, { message: rows(a.doctype).filter((x) => match(x, a.filters || [])).length }); });
}
