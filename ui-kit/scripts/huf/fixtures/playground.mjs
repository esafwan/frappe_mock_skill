// Playground fixtures: Agent / AI Provider / AI Model lists, prompt templates, run_prompt_sync / run_agent_sync / evaluate_run,
// the Agent Run doc + child steps (trace rail) and a seeded run ledger. Data: data/huf/playground.json (fictional, Northwind Trading).
// The page URL may carry ?demo=ledger, which seeds three earlier runs into the run ledger (localStorage) before the app boots.
import fs from 'fs';
export async function install(page, { json, args, ROOT }) {
  const D = JSON.parse(fs.readFileSync(ROOT + 'data/huf/playground.json', 'utf8'));
  const E = JSON.parse(fs.readFileSync(ROOT + 'data/huf/agents-editor.json', 'utf8'));
  const A = JSON.parse(fs.readFileSync(ROOT + 'data/huf/agents.json', 'utf8')).agents;
  const NOW = new Date('2026-01-01T09:00:00Z').getTime();
  const rx = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}(\\?|$)`);
  const rxDoc = (name) => new RegExp(`/api/resource/${name.replace(/ /g, '(?:%20| |\\+)')}/([^/?]+)`);

  const ledger = D.ledger.map((e) => ({ id: e.id, ranAt: NOW - e.minutesAgo * 60000, status: e.status, model: e.model, latencyMs: e.latencyMs, tokens: e.tokens,
    config: { agentName: '', provider: e.provider, model: e.model, prompt: e.prompt, evaluationCriteria: '', temperature: '', maxTokens: '' } }));
  await page.addInitScript((entries) => {
    try { if (/demo=ledger/.test(location.search)) localStorage.setItem('huf.playground.run-ledger.site.user', JSON.stringify(entries)); } catch {}
  }, ledger);

  await page.route(rx('Agent'), (r) => json(r, { data: A }));
  await page.route(rx('AI Provider'), (r) => json(r, { data: E.providers }));
  await page.route(rx('AI Model'), (r) => { const a = args(r.request()); const f = (a.filters || []).find((x) => x[0] === 'provider');
    return json(r, { data: f ? E.models.filter((m) => m.provider === f[2]) : E.models }); });
  await page.route(rx('Agent Prompt'), (r) => json(r, { data: D.templates }));
  await page.route(rxDoc('Agent Run'), (r) => json(r, { data: { name: D.agentRunId, input_tokens: D.single.input_tokens, output_tokens: D.single.output_tokens, cost: D.single.cost,
    start_time: '2026-01-01 08:59:57.000', end_time: '2026-01-01 09:00:00.' + String(D.single.latency_ms % 1000).padStart(3, '0') } }));
  await page.route(rx('Agent Run'), (r) => json(r, { data: D.single.steps }));

  const out = (m) => ({ message: { success: true, response: m.response, provider: m.provider, model: m.model, latency_ms: m.latency_ms, input_tokens: m.input_tokens, output_tokens: m.output_tokens, cost: m.cost } });
  await page.route('**/api/method/huf.ai.console_api.run_prompt_sync**', (r) => {
    const a = args(r.request()); const c = D.compare;
    const m = a.model === c.b.model ? { ...c.b, model: c.b.model } : { ...c.a, model: a.model || c.a.model };
    if (/NW-20418/.test(a.prompt || '')) return json(r, out({ ...m, provider: a.provider }));
    return json(r, out({ response: 'Good news: your spring restock order has shipped and will reach you on Thursday. Tap the tracking link below to follow it.\nThanks for ordering with Northwind Trading!', provider: a.provider, model: a.model, latency_ms: 980, input_tokens: 44, output_tokens: 36, cost: 0.0001 }));
  });
  await page.route('**/api/method/huf.ai.agent.integration.run_agent_sync**', (r) => json(r, { message: { success: true, response: D.single.response, agent_run_id: D.agentRunId } }));
  await page.route('**/api/method/huf.ai.console_api.evaluate_run**', (r) => json(r, { message: D.single.evaluation }));
}
