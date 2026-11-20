// Decisions area fixtures: Playground (Decision Runtime, trace, compare), Executions list + run detail + analytics, Execution profiles.
// Data: data/huf/decisions.json (fictional Northwind Trading). Agent list comes from data/huf/agents.json.
import fs from 'fs';
const dt = (s) => (s ? s : null);

export async function install(page, { json, args, ROOT }) {
  const d = JSON.parse(fs.readFileSync(ROOT + 'data/huf/decisions.json', 'utf8'));
  const { agents } = JSON.parse(fs.readFileSync(ROOT + 'data/huf/agents.json', 'utf8'));
  const R = d.runs; const P = d.playground;
  const runDoc = (r) => ({ name: r.name, agent: r.agent, start_time: dt(r.start), end_time: dt(r.end), status: r.status, is_child: 0, cached_tokens: r.cached_tokens, cost: r.cost, flow_run: null, flow_node_id: null, run_kind: r.run_kind });
  const like = (a, f) => (f || []).every(([k, op, v]) => op === 'like' ? String(a[k] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase()) : op === 'in' ? v.includes(a[k]) : op === '=' ? String(a[k] ?? '') === String(v) : true);
  const slice = (rows, a) => rows.slice(+(a.limit_start || 0), +(a.limit_start || 0) + +(a.limit_page_length || a.limit || 1000));

  await page.route('**/api/resource/Agent?**', (r) => { const a = args(r.request()); return json(r, { data: slice(agents.filter((x) => like(x, a.filters)), a) }); });
  await page.route('**/api/resource/AI%20Provider?**', (r) => json(r, { data: d.providers }));
  await page.route('**/api/resource/AI%20Model?**', (r) => { const a = args(r.request()); return json(r, { data: d.models.filter((m) => like(m, a.filters)) }); });
  // Agent Run: top-level list (is_child=0), child list by parent_run, single doc
  await page.route('**/api/resource/Agent%20Run?**', (r) => {
    const a = args(r.request()); const f = a.filters || [];
    const parent = f.find(([k]) => k === 'parent_run');
    if (parent) return json(r, { data: P.trace.map((s) => ({ ...s, is_child: 1 })) });
    const rows = R.filter((x) => like({ agent: x.agent, status: x.status }, f.filter(([k]) => ['agent', 'status'].includes(k)))).map(runDoc);
    return json(r, { data: slice(rows, a) });
  });
  await page.route('**/api/resource/Agent%20Run/**', (r) => {
    const id = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const x = R.find((y) => y.name === id) || R[0];
    return json(r, { data: { ...runDoc(x), conversation: null, provider: x.provider, model: x.model, input_tokens: x.input_tokens, output_tokens: x.output_tokens, cache_creation_tokens: 0, cost_source: 'catalog', prompt: d.detail.prompt, response: x.status === 'Failed' ? '' : d.detail.response, round_count: d.detail.round_count, execution_mode: 'sync', provider_path: 'litellm', docstatus: 0, owner: 'maya@example.com', creation: x.start, modified: x.end } });
  });
  await page.route('**/api/resource/Agent/**', (r) => { const id = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop()); return json(r, { data: { ...(agents.find((x) => x.name === id) || agents[0]), enable_prompt_caching: 0 } }); });
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request()); const st = (a.filters || []).find(([k]) => k === 'status'); const n = { 'Agent Run': st ? R.filter((x) => x.status === st[2]).length : R.length, 'Execution Profile': d.profiles.length, Agent: agents.length }[a.doctype]; return json(r, { message: n ?? 0 }); });
  await page.route('**/api/method/huf.ai.agent.run_context_api.get_run_context_metrics**', (r) => json(r, { message: null }));
  // Playground runs
  await page.route('**/api/method/huf.ai.agent.integration.run_agent_sync**', (r) => json(r, { message: { success: true, response: P.response, agent_run_id: 'AR-2026-0412' } }));
  await page.route('**/api/method/huf.ai.console_api.run_prompt_sync**', (r) => {
    const a = args(r.request()); const b = a.provider === P.compare_b.provider ? P.compare_b : P.primary;
    return json(r, { message: { success: true, response: b.response || P.response, provider: b.provider, model: b.model, latency_ms: b.latency_ms, input_tokens: b.input_tokens, output_tokens: b.output_tokens, cost: b.cost } });
  });
  await page.route('**/api/method/huf.ai.console_api.evaluate_run**', (r) => json(r, { message: P.evaluation }));
  // Analytics
  await page.route('**/api/method/huf.ai.agent.run_analytics_api.get_execution_analytics**', (r) => {
    const a = args(r.request()); const dim = a.dimension || 'provider'; const A = d.analytics;
    const rows = (A.breakdowns[dim] || A.breakdowns.provider).map((b) => ({ ...b, duration_ms_sum: b.average_duration_ms * b.run_count, duration_count: b.run_count, cache_creation_tokens: 0 }));
    const series = A.series_days.map((n, i) => ({ ...A.summary, run_count: n, bucket_start: `2025-12-${String(25 + i).padStart(2, '0')}T00:00:00Z` }));
    return json(r, { message: { summary: A.summary, series, breakdowns: rows, composition_totals: { system: 118000, tools: 142000, knowledge: 201000, history: 96000, message: 55400 }, metadata: { granularity: 'day', dimension: dim, entity: null, freshness: '2026-01-01T08:55:00Z', source: 'scheduled_rollup', breakdowns_total_count: rows.length } } });
  });
  // Execution profiles
  const prof = (id) => d.profiles.find((p) => p.name === id) || d.profiles[0];
  await page.route('**/api/resource/Execution%20Profile?**', (r) => {
    const a = args(r.request()); const f = a.filters || [];
    let rows = d.profiles;
    for (const [k, op, v] of f) { if (k === 'disabled') rows = rows.filter((p) => String(p.disabled) === String(v)); else if (op === 'like') rows = rows.filter((p) => String(p[k] || '').toLowerCase().includes(String(v).replace(/%/g, '').toLowerCase())); }
    return json(r, { data: slice(rows, a) });
  });
  await page.route('**/api/resource/Execution%20Profile/**', (r) => json(r, { data: { ...prof(decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop())), doctype: 'Execution Profile' } }));
}
