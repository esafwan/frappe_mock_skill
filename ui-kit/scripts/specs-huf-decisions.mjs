// Decision models in HUF = the Playground "Decision Runtime" (model + deployment Auto/Primary/Fallback, provider resolved per run, trace of routed steps),
// plus the run traces (Executions, run detail, analytics by provider/model) and Execution profiles (approval/sandbox policy).
// Fixtures: scripts/huf/fixtures/decisions.mjs + data/huf/decisions.json (fictional Northwind Trading).
import fs from 'fs';
import { goHuf } from './huf/app.mjs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/decisions.json', import.meta.url), 'utf8'));
const P = D.playground;
const FX = ['decisions'];
const NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts; not captured' };
const settle = (p, ms = 350) => p.waitForTimeout(ms);
const click = async (p, sel) => { await p.locator(sel).first().click(); await settle(p); };
const fill = async (p, sel, v) => { const l = p.locator(sel).first(); await l.fill(v); await l.blur(); await settle(p, 120); };
const rest = async (p) => { await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(0, 0); await p.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(p); };
const pick = async (p, trigger, option) => { await click(p, `button[role="combobox"]:has-text("${trigger}")`); await click(p, `[role="option"]:has-text("${option}")`); };

// The run ledger lives in localStorage and the light and dark passes share one context: start each pass with an empty ledger.
const freshLedger = async (p) => {
  await p.evaluate(() => { try { Object.keys(localStorage).filter((k) => /ledger|playground/i.test(k)).forEach((k) => localStorage.removeItem(k)); } catch {} });
  const dark = await p.evaluate(() => document.documentElement.getAttribute('data-theme') === 'midnight');
  await goHuf(p, '/playground', { waitFor: '[aria-label="Decision Runtime preview"]', dark }); // reload so the ledger is read from the emptied storage
};
async function runSingle(p, { expand = false } = {}) {
  await freshLedger(p);
  await pick(p, 'Direct (no agent)', P.agent);
  await click(p, 'text=Evaluation criteria');
  await fill(p, 'textarea[placeholder^="Type a prompt"]', P.prompt);
  await fill(p, 'textarea[placeholder^="Describe what a good"]', P.criteria);
  await click(p, 'header button:has-text("Run"), button:has-text("Run"):not(:has-text("Runtime"))');
  await p.waitForSelector('text=Category: delivery.');
  await p.waitForSelector('text=AR-2026-0412-1, text=Local Ollama', { timeout: 4000 }).catch(() => {});
  await settle(p, 500);
  if (expand) await click(p, 'ul.font-mono li:nth-child(1) button');
}
const desc = (what) => [`HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: ${what}`, 'The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.'];

export const specs = [
  { id: 'huf-decisions-playground', name: 'Playground: Decision Runtime bench (default)', url: '/playground', root: '#root', fixtures: FX,
    waitFor: '[aria-label="Decision Runtime preview"]', prepare: rest,
    describe: desc('empty bench with the Decision Runtime card (model, deployment Auto, provider and provider model ID resolved after run), agent/provider/model strip, prompt, response, trace and run ledger.'),
    states: {}, na: { ...NA, hover: 'no meaningful hover at page level', focus: 'no meaningful focus at page level', active: 'n/a', empty: 'this id is the empty state' } },
  { id: 'huf-decisions-playground-deployment', name: 'Playground: deployment picker open (Auto / Primary / Fallback)', url: '/playground', root: 'body', fixtures: FX,
    waitFor: '[aria-label="Decision Runtime preview"]', prepare: async (p) => { await click(p, '[aria-label="Decision Runtime preview"] button[role="combobox"]'); await p.mouse.move(0, 0); await settle(p); },
    describe: desc('the Deployment dropdown open on the Decision Runtime card, showing the routing choices Auto, Primary and Fallback.'),
    states: {}, na: { ...NA, hover: 'see huf-decisions-playground', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-decisions-playground-run', name: 'Playground: completed run with response, evaluation, routed trace and ledger', url: '/playground', root: '#root', fixtures: FX,
    waitFor: '[aria-label="Decision Runtime preview"]', prepare: async (p) => { await runSingle(p); await rest(p); },
    describe: desc('Support Triage run finished: filled prompt and evaluation criteria, response with pass score, latency/token/cost stats, a 3-step trace (route on local Llama, tool and agent steps on gpt-4.1-mini) and the run ledger row.'),
    states: {}, na: { ...NA, hover: 'see huf-decisions-playground', focus: 'n/a', active: 'n/a', empty: 'see huf-decisions-playground' },
    slotNames: { 'textarea': 'prompt' } },
  { id: 'huf-decisions-playground-trace', name: 'Playground: trace step expanded (provider, model, tokens, cost per step)', url: '/playground', root: '#root', fixtures: FX,
    waitFor: '[aria-label="Decision Runtime preview"]', prepare: async (p) => { await runSingle(p, { expand: true }); await rest(p); },
    describe: desc('same finished run with trace step 1 expanded: the routing step handled by the local model (Provider Local Ollama, Model llama3.1-8b, tokens, cost $0.0000).'),
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-decisions-playground-compare', name: 'Playground: compare two models side by side', url: '/playground', root: '#root', fixtures: FX,
    waitFor: '[aria-label="Decision Runtime preview"]',
    prepare: async (p) => {
      await freshLedger(p);
      await click(p, '[role="tab"]:has-text("Compare")'); await p.waitForTimeout(400);
      const cbx = (i) => p.locator('button[role="combobox"]').nth(i);
      const opt = async (i, o) => { await cbx(i).click(); await click(p, `[role="option"]:has-text("${o}")`); };
      await opt(0, 'OpenAI'); await opt(1, 'gpt-4.1-mini'); await opt(3, 'Anthropic'); await opt(4, 'claude-sonnet');
      for (const t of await p.locator('textarea[placeholder^="Type a prompt"]').all()) { await t.fill(P.prompt); await t.blur(); }
      await click(p, 'button:has-text("Run both")');
      await p.waitForSelector('text=Category: delivery.'); await settle(p, 800); await rest(p);
    },
    describe: desc('Compare mode: column A gpt-4.1-mini and column B claude-sonnet run on the same prompt, with latency, tokens and cost for each, so the cheaper or faster decision model is visible.'),
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },

  // ---- run traces ----
  { id: 'huf-executions-runs', name: 'Executions: agent runs list with metrics strip', url: '/executions', root: '#root', fixtures: FX, waitFor: 'table', prepare: rest,
    describe: ['HUF, Executions > Agent runs: Runs / Cache ratio / LLM cost / Average duration strip, filters (status, time, agent) and the run table (agent, run ID, status, cost, cached tokens, duration, started) for Northwind Trading.', 'Establishing shot for any run-history or audit story; rows from data/huf/decisions.json.'],
    targets: { search: 'input[placeholder^="Search"]' }, states: { hover: { target: 'tbody tr:nth-child(2)', description: 'row hover' }, focus: { target: 'search' } }, na: { ...NA, active: 'n/a', empty: 'not captured' } },
  { id: 'huf-executions-runs-failed', name: 'Executions: failed run filter', url: '/executions', root: '#root', fixtures: FX, waitFor: 'table',
    prepare: async (p) => { await click(p, 'button[role="combobox"]:has-text("Status")'); await click(p, '[role="option"]:has-text("Failed")'); await settle(p, 500); await rest(p); },
    describe: ['HUF, Executions with the Status filter set to Failed: the Lead Qualifier run shown with a red Failed pill.', 'Use for an error-handling or monitoring story.'],
    states: {}, na: { ...NA, hover: 'see huf-executions-runs', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-executions-run-detail', name: 'Run detail: overview, prompt, response and orchestration steps', url: '/executions/AR-2026-0412', root: '#root', fixtures: FX, waitFor: 'text=Agent orchestration', prepare: rest,
    describe: ['HUF, Executions > run AR-2026-0412: status, agent, provider, model, tokens and cost, the prompt and response, and the child runs of the orchestration (the routed steps).', 'Establishing shot for a run-trace story.'],
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-executions-analytics', name: 'Executions analytics: breakdown by provider', url: '/executions?tab=analytics', root: '#root', fixtures: FX, waitFor: 'text=By provider', prepare: rest,
    describe: ['HUF, Executions > Analytics: metric strip, token composition and a "By provider" table (OpenAI, Anthropic, Local Ollama) with runs, success rate, cost and cache ratio.', 'Shows how work is split across hosted and local models.'],
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-executions-analytics-model', name: 'Executions analytics: breakdown by model', url: '/executions?tab=analytics', root: '#root', fixtures: FX, waitFor: 'text=By provider',
    prepare: async (p) => { await click(p, 'main button[role="combobox"]'); await click(p, '[role="option"]:has-text("Model")'); await p.waitForSelector('text=By model'); await rest(p); },
    describe: ['HUF, Executions > Analytics with the dimension switched to Model: gpt-4.1-mini, claude-sonnet, llama3.1-8b and gpt-4.1 compared on cost, speed and success rate.', 'Use for a cost-per-model decision story.'],
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },

  // ---- execution profiles ----
  { id: 'huf-profiles-list', name: 'Execution profiles list', url: '/execution-profiles', root: '#root', fixtures: FX, waitFor: 'table', prepare: rest,
    describe: ['HUF, Execution profiles: sandbox and approval policies (Auto Approve / Ask Every Time / Never Allow, filesystem policy, wall time and memory limits) that decide what an agent may do without asking.', 'Built-in and custom profiles from data/huf/decisions.json.'],
    states: { hover: { target: 'tbody tr:nth-child(3)', description: 'row hover' } }, na: { ...NA, focus: 'n/a', active: 'n/a', empty: 'not captured' } },
  { id: 'huf-profiles-form', name: 'Execution profile editor (Warehouse automation)', url: '/execution-profiles/Warehouse%20automation', root: '#root', fixtures: FX, waitFor: 'main input', prepare: rest,
    describe: ['HUF, Execution profile editor for "Warehouse automation": approval mode, filesystem and network policy, allowed modules, resource limits and per-doctype permissions.', 'Use when explaining guardrails for automated actions.'],
    states: {}, na: { ...NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
];
