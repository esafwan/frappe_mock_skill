// Learning area fixtures (Intelligence page: memories learned from chats, memory policies; Skills).
// search_memory_records (Memories tab), Memory Policy list/doc/count, Agent + Knowledge Source pickers on the policy page,
// Skill list/count, skill marketplace registry. Data: data/huf/learning.json (fictional, Northwind Trading).
// Page-level variants without extra fixture files: the page URL may carry ?demo=<variant>
//   demo=empty -> no memory records (Memories tab empty state)
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/learning.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const match = (row, filters = []) => (Array.isArray(filters) ? filters : Object.entries(filters).map(([k, v]) => [k, '=', v])).every((f) => {
    const [field, op, v] = f.length === 4 ? f.slice(1) : f;
    if (op === '=') return String(row[field] ?? 0) === String(v);
    if (op === 'like') return String(row[field] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase());
    return true;
  });
  const slice = (rows, a) => { const s = +(a.limit_start || 0), n = +(a.limit || a.limit_page_length || 1000); return rows.slice(s, s + n); };
  const pick = (rows, fields) => (Array.isArray(fields) && fields.length && fields.every((f) => typeof f === 'string') ? rows.map((r) => Object.fromEntries(fields.map((f) => [f, r[f] ?? null]))) : rows);
  const list = (rows) => (r) => { const a = args(r.request()); return json(r, { data: slice(pick(rows.filter((x) => match(x, a.filters || [])), a.fields), a) }); };
  const counts = { 'Memory Policy': D.policies, Skill: D.skills };

  // Memories tab: the backend returns {success, results}
  await page.route('**/api/method/huf.ai.memory_tools.search_memory_records**', (r) => json(r, { message: { success: true, results: demo() === 'empty' ? [] : D.memories } }));
  await page.route('**/api/method/huf.ai.memory_tools.get_memory_record**', (r) => { const a = args(r.request()); return json(r, { message: D.memories.find((m) => m.name === a.memory_record) || null }); });

  // Memory Policy: list + single doc
  await page.route(/\/api\/resource\/Memory%20Policy(\?|$)/, list(D.policies));
  await page.route(/\/api\/resource\/Memory%20Policy\/[^?]+/, (r) => {
    const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const doc = D.policies.find((p) => p.name === name);
    return doc ? json(r, { data: { doctype: 'Memory Policy', owner: 'maya@example.com', creation: doc.modified, ...doc } }) : json(r, { exc_type: 'DoesNotExistError', message: 'Not found' }, 404);
  });
  // Pickers on the policy page (fields name + agent_name / source_name)
  await page.route(/\/api\/resource\/Agent(\?|$)/, (r) => { const a = args(r.request());
    if (!(Array.isArray(a.fields) && a.fields.includes('agent_name') && a.fields.length === 2)) return r.fallback();
    return json(r, { data: D.picker_agents }); });
  await page.route(/\/api\/resource\/Knowledge%20Source(\?|$)/, (r) => json(r, { data: D.picker_knowledge_sources }));

  // Skills
  await page.route(/\/api\/resource\/Skill(\?|$)/, list(D.skills));
  await page.route('**/api/method/huf.ai.skills.api.fetch_skill_registry**', (r) => json(r, { message: D.registry }));

  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request());
    const rows = counts[a.doctype]; if (!rows) return r.fallback();
    return json(r, { message: rows.filter((x) => match(x, a.filters || [])).length }); });
}
