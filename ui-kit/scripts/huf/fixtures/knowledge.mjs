// Knowledge area fixtures: Knowledge Source / Knowledge Input lists and docs, per-status counts, "used by" agents,
// import options, ingestion status (static: polling keeps reading the same numbers) and test_search (ask with citations).
// Data: data/huf/knowledge.json (fictional, Northwind Trading). Times are relative to the fixed capture clock.
// Page-level variants without extra fixture files: the page URL may carry ?demo=<variant>
//   demo=empty     -> no knowledge sources (library empty state)
//   demo=noresults -> test_search returns no passages
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/knowledge.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const sources = () => (demo() === 'empty' ? [] : D.sources);
  const match = (row, filters = []) => (Array.isArray(filters) ? filters : Object.entries(filters).map(([k, v]) => [k, '=', v])).every((f) => {
    const [field, op, v] = f.length === 4 ? f.slice(1) : f;
    if (op === '=') return String(row[field] ?? 0) === String(v);
    if (op === 'like') return String(row[field] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase());
    return true;
  });
  const isAgg = (fields) => Array.isArray(fields) && fields.some((f) => f && typeof f === 'object');
  const page_ = (rows, a) => { const s = +(a.limit_start || 0), n = +(a.limit || a.limit_page_length || 1000); return rows.slice(s, s + n); };

  // Knowledge Source: list and single doc
  await page.route(/\/api\/resource\/Knowledge%20Source(\?|$)/, (r) => { const a = args(r.request()); return json(r, { data: page_(sources().filter((x) => match(x, a.filters || [])), a) }); });
  await page.route(/\/api\/resource\/Knowledge%20Source\/[^?]+/, (r) => {
    const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const doc = D.sources.find((s) => s.name === name);
    return doc ? json(r, { data: { doctype: 'Knowledge Source', ...doc } }) : json(r, { exc_type: 'DoesNotExistError', message: 'Not found' }, 404);
  });
  // Knowledge Input: rows, per-status counts (one source) and counts grouped by source
  await page.route(/\/api\/resource\/Knowledge%20Input(\?|$)/, (r) => {
    const a = args(r.request());
    if (isAgg(a.fields)) {
      const out = [];
      for (const s of sources()) for (const [status, count] of Object.entries(D.counts[s.name] || {})) {
        const row = { knowledge_source: s.name, status, count };
        if (match(row, a.filters || [])) out.push(row);
      }
      if (!/knowledge_source/.test(a.group_by || '')) { // grouped by status only
        const by = {}; for (const x of out) by[x.status] = (by[x.status] || 0) + x.count;
        return json(r, { data: Object.entries(by).map(([status, count]) => ({ status, count })) });
      }
      return json(r, { data: out });
    }
    return json(r, { data: page_(D.inputs.filter((x) => match(x, a.filters || [])), a) });
  });
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request());
    if (a.doctype !== 'Knowledge Source') return r.fallback();
    return json(r, { message: sources().filter((x) => match(x, a.filters || [])).length }); });
  // The Knowledge Input doctype has the optional title field (so URL and text inputs show their titles)
  await page.route('**/api/method/frappe.desk.form.load.getdoctype**', (r) => { const a = args(r.request());
    if (a.doctype !== 'Knowledge Input') return r.fallback();
    return json(r, { docs: [{ name: 'Knowledge Input', fields: [{ fieldname: 'title' }] }] }); });
  // "Used by" agents (Agent Knowledge child rows)
  await page.route('**/api/method/frappe.client.get_list**', (r) => { const a = args(r.request());
    if (a.doctype !== 'Agent Knowledge') return r.fallback();
    if (a.group_by) return json(r, { message: Object.entries(D.agents).filter(([, v]) => v.length).map(([knowledge_source, v]) => ({ knowledge_source, count: v.length })) });
    let f = a.filters; if (typeof f === 'string') { try { f = JSON.parse(f); } catch { f = {}; } }
    return json(r, { message: (D.agents[f?.knowledge_source] || []).map((parent) => ({ parent })) }); });
  // Bulk import
  await page.route('**/api/method/huf.ai.knowledge.bulk_sources_api.get_import_options**', (r) => json(r, { message: D.import_options }));
  await page.route('**/api/method/huf.ai.knowledge.bulk_api.list_ingestions**', (r) => { const a = args(r.request()); return json(r, { message: { ingestions: D.ingestions[a.knowledge_source] || [] } }); });
  await page.route('**/api/method/huf.ai.knowledge.bulk_api.get_ingestion_status**', (r) => {
    const a = args(r.request()); const st = D.ingestion_status[a.ingestion];
    const header = Object.values(D.ingestions).flat().find((i) => i.name === a.ingestion);
    if (!st || !header) return json(r, { exc_type: 'DoesNotExistError' }, 404);
    const items = D.inputs.filter((i) => i.ingestion === a.ingestion).map((i) => ({ name: i.name, external_key: i.external_key, file_name: i.file_name, title: i.title, status: i.status, chunks_created: i.chunks_created, attempts: 1, error_message: i.error_message || null, skip_reason: i.skip_reason || null }))
      .filter((i) => !a.item_status || i.status === a.item_status);
    return json(r, { message: { ingestion: header, ...st, items: +a.include_items ? items : [] } });
  });
  // Ask: test_search returns the passages for the fixture query (any query), or none with ?demo=noresults
  await page.route('**/api/method/huf.huf.doctype.knowledge_source.knowledge_source.test_search**', (r) => json(r, { message: demo() === 'noresults' ? [] : D.ask.results }));
}
