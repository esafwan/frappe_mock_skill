// Audit area fixtures (cost and usage): get_execution_analytics (totals, per agent / model / provider breakdowns, hourly series, entity drill-down),
// the dashboard feeds (agent runs, flows, providers, counts) and get_conversation_analytics. Data: data/huf/audit.json (fictional, Northwind Trading).
// Page-level variant: ?demo=empty -> every analytics call answers with the "no runs yet" stub.
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/audit.json', 'utf8'));
  const demo = () => { try { return new URL(page.url()).searchParams.get('demo') || ''; } catch { return ''; } };
  const f4 = (n) => Math.round(n * 1e4) / 1e4;
  const sum = (rows) => {
    const s = { run_count: 0, success_count: 0, failed_count: 0, input_tokens: 0, output_tokens: 0, cached_tokens: 0, cache_creation_tokens: 0, total_cost: 0, duration_ms_sum: 0, duration_count: 0 };
    for (const r of rows) { s.run_count += r.run_count; s.failed_count += r.failed; s.success_count += r.run_count - r.failed; s.input_tokens += r.input; s.output_tokens += r.output; s.cached_tokens += r.cached; s.total_cost += r.cost; s.duration_ms_sum += r.avg_ms * r.run_count; s.duration_count += r.run_count; }
    s.total_cost = f4(s.total_cost); s.cache_creation_tokens = Math.round(s.input_tokens * 0.0347);
    return fin(s);
  };
  const fin = (s) => ({ ...s,
    success_rate: s.run_count ? Math.round((s.success_count / s.run_count) * 1000) / 10 : null,
    average_duration_ms: s.duration_count ? Math.round(s.duration_ms_sum / s.duration_count) : null,
    cache_ratio: s.input_tokens ? Math.round((s.cached_tokens / s.input_tokens) * 1000) / 10 : null });
  const group = (key) => {
    const m = new Map();
    for (const r of D.rows) m.set(r[key], [...(m.get(r[key]) || []), r]);
    return [...m].map(([dimension, rows]) => ({ dimension, ...sum(rows) })).sort((a, b) => b.run_count - a.run_count);
  };
  // Hourly buckets over the 7 days before the fixed clock, with a working-day curve (busy 08-18h, quiet nights and weekend).
  const END = Date.parse('2026-01-01T09:00:00Z'), H = 3600e3;
  const buckets = Array.from({ length: 24 * D.window_days }, (_, i) => END - (24 * D.window_days - i) * H);
  const curve = (t) => { const d = new Date(t), h = d.getUTCHours(), dow = d.getUTCDay(); const day = h >= 8 && h <= 18 ? 1 : h >= 6 && h <= 21 ? 0.45 : 0.12; const wk = dow === 0 || dow === 6 ? 0.35 : dow === 4 && d.getUTCDate() === 1 ? 0.5 : 1; const wob = 0.85 + 0.3 * Math.abs(Math.sin(t / 7.3e6)); return day * wk * wob; };
  const seriesFor = (rows) => {
    const tot = sum(rows), w = buckets.map(curve), W = w.reduce((a, b) => a + b, 0);
    const raw = w.map((x) => (x / W) * tot.run_count); const base = raw.map(Math.floor); let rem = tot.run_count - base.reduce((a, b) => a + b, 0);
    raw.map((x, i) => [x - base[i], i]).sort((a, b) => b[0] - a[0]).slice(0, rem).forEach(([, i]) => { base[i]++; });
    return base.map((n, i) => ({ bucket_start: new Date(buckets[i]).toISOString(), ...fin({ ...tot, run_count: n, success_count: Math.round(n * (tot.success_count / tot.run_count)), failed_count: n - Math.round(n * (tot.success_count / tot.run_count)), total_cost: f4((n / tot.run_count) * tot.total_cost) }) }));
  };
  const empty = { summary: { run_count: 0, success_count: 0, failed_count: 0, input_tokens: 0, output_tokens: 0, cached_tokens: 0, cache_creation_tokens: 0, total_cost: 0, duration_ms_sum: 0, duration_count: 0, success_rate: null, average_duration_ms: null, cache_ratio: null }, series: [], breakdowns: [], composition_totals: {}, metadata: { granularity: 'hour', dimension: 'provider', freshness: null, breakdowns_total_count: 0, source: 'scheduled_rollup' } };

  await page.route('**/api/method/huf.ai.agent.run_analytics_api.get_execution_analytics**', (r) => {
    if (demo() === 'empty') return json(r, { message: empty });
    const a = args(r.request()), dim = a.dimension || 'provider', key = { agent: 'agent', model: 'model', provider: 'provider' }[dim] || 'agent';
    const meta = { granularity: a.granularity || 'hour', dimension: dim, freshness: D.freshness, from: new Date(END - D.window_days * 24 * H).toISOString(), to: new Date(END).toISOString(), source: 'scheduled_rollup' };
    if (a.entity) {
      const rows = D.rows.filter((x) => x[key] === a.entity);
      if (!rows.length) return json(r, { message: empty });
      return json(r, { message: { summary: sum(rows), series: seriesFor(rows), breakdowns: [], composition_totals: D.composition_totals, metadata: { ...meta, entity: a.entity, breakdowns_total_count: 0 } } });
    }
    const b = group(key);
    return json(r, { message: { summary: sum(D.rows), series: seriesFor(D.rows), breakdowns: b, composition_totals: D.composition_totals, metadata: { ...meta, breakdowns_total_count: b.length } } });
  });

  // Dashboard feeds
  await page.route('**/api/method/frappe.client.get_count**', (r) => { const a = args(r.request()); let n = 0;
    if (a.doctype === 'Agent Run') n = D.summary.run_count;
    else if (a.doctype === 'Flow Run') { const f = (a.filters || []).find?.((x) => x[0] === 'flow_id'); n = D.flows.find((x) => x.flow_id === f?.[2])?.runs ?? 0; }
    else if (a.doctype === 'Agent') n = 6;
    else if (a.doctype === 'AI Provider') n = D.providers.length;
    return json(r, { message: n }); });
  await page.route(/\/api\/resource\/Agent%20Run(\?|$)/, (r) => json(r, { data: D.agent_runs.map((x) => ({ name: x.name, agent: x.agent, conversation: null, start_time: x.start, end_time: x.end, status: x.status })) }));
  await page.route(/\/api\/resource\/AI%20Provider(\?|$)/, (r) => json(r, { data: D.providers }));
  await page.route(/\/api\/resource\/Flow%20Definition(\?|$)/, (r) => json(r, { data: D.flows.map((f) => ({ name: f.flow_id, flow_id: f.flow_id, flow_name: f.flow_name, description: '', category: f.category, status: f.status, version: 3, schema_version: 1, modified: '2025-12-30 10:00:00' })) }));
  await page.route('**/api/method/huf.ai.flow.api.list_flow_runs**', (r) => { const a = args(r.request()); const f = D.flows.find((x) => x.flow_id === a.flow_id); return json(r, { message: f ? [{ name: 'FR-' + f.flow_id, flow_id: f.flow_id, status: 'Success', started_at: f.last_run, run_mode: 'Real' }] : [] }); });

  // Conversation analytics pane (chat > Analytics)
  await page.route('**/api/method/huf.ai.agent.conversation_analytics_api.get_conversation_analytics**', (r) => json(r, { message: { totals: { cumulative: true, ...D.conversation.totals }, current: D.conversation.current, series: D.conversation.series, cache: D.conversation.cache, measurement: D.conversation.measurement } }));
}
