// Providers / Models / MCP area fixtures: AI Provider, AI Model and MCP Server doctype lists + docs, connection test.
// Data: data/huf/providers.json (fictional: Northwind Trading). Shapes follow services/providerApi.ts and services/mcpApi.ts.
import fs from 'fs';
export async function install(page, { json, args, ROOT }, opts = {}) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/providers.json', 'utf8'));
  const like = (v, q) => String(v || '').toLowerCase().includes(String(q).replace(/%/g, '').toLowerCase());
  const match = (row, filters = []) => filters.every(([f, op, v]) => op === '=' ? String(row[f] ?? '') === String(v) : op === 'like' ? like(row[f], v) : true);
  const list = (rows) => (r) => { const a = args(r.request()); const m = rows.filter((x) => match(x, a.filters || [])); const s = +(a.limit_start || 0), n = +(a.limit_page_length || a.limit || 1000); return json(r, { data: m.slice(s, s + n) }); };
  const providers = opts.emptyProviders ? [] : D.providers;
  // list endpoints end in "?" (query string); doc endpoints are /api/resource/<doctype>/<name>
  await page.route('**/api/resource/AI%20Provider?**', list(providers));
  await page.route('**/api/resource/AI%20Model?**', list(D.models));
  await page.route('**/api/resource/MCP%20Server?**', list(D.mcp));
  await page.route('**/api/resource/AI%20Provider/*', (r) => { const n = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop()); return json(r, { data: D.providers.find((p) => p.name === n) || {} }); });
  await page.route('**/api/resource/AI%20Model/*', (r) => { const n = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop()); return json(r, { data: D.models.find((p) => p.name === n) || {} }); });
  await page.route('**/api/resource/MCP%20Server/*', (r) => { const n = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop()); const s = D.mcp.find((p) => p.name === n) || {}; return json(r, { data: { ...s, ...(D.mcpDetail[n] || { tools: [], custom_headers: [] }) } }); });
  await page.route('**/api/resource/DocType/AI%20Model', (r) => json(r, { data: { fields: [{ fieldname: 'modalities', options: D.modalityOptions.join('\n') }] } }));
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request()); const rows = { 'AI Provider': providers, 'AI Model': D.models, 'MCP Server': D.mcp }[a.doctype] || []; return json(r, { message: rows.filter((x) => match(x, a.filters || [])).length }); });
  await page.route('**/api/method/huf.ai.local_runtime.test_provider_connection**', (r) => json(r, { message: D.connectionTest }));
  await page.route('**/api/method/huf.ai.mcp_client.get_available_mcp_servers**', (r) => json(r, { message: [] }));
}
