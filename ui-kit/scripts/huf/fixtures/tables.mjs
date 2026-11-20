// Tables area fixtures: huf_data_table API (summary list, schema, rows, agent access, tool signature, activity). Data: data/huf/tables.json (fictional).
// Fixture variants via spec.fixtures: 'tables' (filled) ; the empty list is a separate module 'tables-empty'.
import fs from 'fs';
export async function install(page, { json, args, ROOT }, opts = {}) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/tables.json', 'utf8'));
  const P = 'huf.huf.doctype.huf_data_table';
  const empty = !!opts.empty;
  const val = (v) => (v == null ? '' : String(v).toLowerCase());
  await page.route(`**/api/method/${P}.**`, (r) => {
    const url = new URL(r.request().url()); const m = url.pathname.split('/api/method/')[1].slice(P.length + 1); const a = args(r.request());
    switch (m) {
      case 'rows.list_tables_summary': return json(r, { message: empty ? [] : D.tables });
      case 'api.get_table_schema': { const k = (opts.builder && a.name === 'tbl-orders') ? 'tbl-orders-builder' : a.name; return json(r, { message: D.schemas[k] || D.schemas['tbl-orders'] }); }
      case 'api.get_table_records': {
        let rows = (D.rows[a.doctype_name] || []).slice();
        if (a.search) rows = rows.filter((x) => Object.values(x).some((v) => val(v).includes(String(a.search).toLowerCase())));
        if (a.order_by && !/^modified/.test(a.order_by)) { const [f, d] = a.order_by.split(' '); rows.sort((x, y) => (val(x[f]) < val(y[f]) ? -1 : 1) * (d === 'desc' ? -1 : 1)); }
        const s = +(a.start || 0), n = +(a.limit || 20);
        return json(r, { message: { items: rows.slice(s, s + n), hasMore: s + n < rows.length, total: a.doctype_name === 'HDT Orders' && !a.search ? D.total[a.doctype_name] : rows.length } });
      }
      case 'api.get_table_agent_access': return json(r, { message: D.agentAccess[a.table] || [] });
      case 'rows.get_table_tool_signature': return json(r, { message: D.signature });
      case 'rows.get_table_agent_activity': return json(r, { message: D.activity });
      case 'rows.get_table_dependencies': return json(r, { message: D.deps });
      case 'api.get_table_record_counts': return json(r, { message: Object.fromEntries(D.tables.map((t) => [t.name, t.record_count])) });
      default: return json(r, { message: [] });
    }
  });
  await page.route('**/api/resource/Agent?**', (r) => json(r, { data: D.agents.map((n) => ({ name: n, agent_name: n })) }));
}
