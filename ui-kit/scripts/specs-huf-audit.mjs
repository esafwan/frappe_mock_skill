// Cost and usage (HUF pre-develop): dashboard gauges, Analytics (Executions > Analytics tab) per provider / agent / model, entity drill-down, empty state.
// Fixtures: scripts/huf/fixtures/audit.mjs + data/huf/audit.json (fictional supplier "Northwind Trading"; 6 agents, 5,130 runs, $67.61 in the last 7 days).
// The app has no audit-trail page, no spend budget / limit screen and no response-cache settings page; see the hand-off report.
const FX = ['agents', 'audit'];
const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts; not captured' };
const settle = (page, ms = 350) => page.waitForTimeout(ms);
const click = async (page, sel) => { await page.locator(sel).first().click(); await settle(page); };
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(page); };
/** Pick an option of the Analytics "group by" select (first combobox in the filter row). */
const groupBy = async (page, label) => { await click(page, 'main [role="combobox"]'); await click(page, `[role="option"]:has-text("${label}")`); await page.waitForSelector(`h2:has-text("By ${label.toLowerCase()}")`); await settle(page, 500); };

const AN = '/executions?tab=analytics';
const anDescribe = (what) => [`Analytics tab (Executions > Analytics) for the fictional supplier Northwind Trading, last 7 days: four gauges (runs, cache ratio, LLM cost, average duration), ${what} and the context-composition bars.`, 'Cost is visible per agent, per model and per provider; there is no per-seat charge anywhere. Numbers come from data/huf/audit.json.'];
const anSlots = { 'main h2': 'section_title', 'main tbody tr:nth-child(1) td:nth-child(1)': 'top_name', 'main tbody tr:nth-child(1) td:nth-child(4)': 'top_cost' };
const entityDescribe = (what) => [`Analytics entity page (/analytics/<dimension>/<name>): breadcrumb, the same four gauges scoped to ${what}, "Runs over time" area chart (hourly, 7 days) and context composition.`, 'Reached by clicking a row of the Analytics table.'];

export const specs = [
  { id: 'huf-cost-dashboard', name: 'Dashboard (4 gauges incl. total cost, active agents list)', url: '/dashboard', root: '#root', fixtures: FX,
    waitFor: 'text=Support Triage', prepare: rest,
    describe: ['Dashboard home for Northwind Trading: gauge strip (agent runs, success rate, average runtime, total cost for the last 7 days) above the Agents / Flows / Executions tabs with run counts per agent.', 'Establishing shot for "what are my agents costing me"; totals are in data/huf/audit.json.'],
    states: { hover: { target: 'main [role="tab"]:nth-child(2)', description: 'tab hover' } }, na: { ...PAGE_NA, focus: 'no input on the page', active: 'tabs only', empty: 'not captured (new workspaces show the "Get started" provider card)' },
    slotNames: { 'main [data-slot="metric-gauge"]:nth-child(4)': 'total_cost' } },
  { id: 'huf-cost-dashboard-flows', name: 'Dashboard, Flows tab (active flows with run counts)', url: '/dashboard', root: '#root', fixtures: FX,
    waitFor: 'text=Support Triage', prepare: async (p) => { await click(p, '[role="tab"]:has-text("Flows")'); await p.waitForSelector('text=Supplier invoice intake'); await rest(p); },
    describe: ['Dashboard with the Flows tab open: active flows, last run and run count each.', 'Same gauge strip as huf-cost-dashboard.'],
    states: {}, na: { ...PAGE_NA, hover: 'see huf-cost-dashboard', focus: 'n/a', active: 'n/a', empty: 'n/a' } },

  { id: 'huf-analytics-provider', name: 'Analytics tab, cost by provider (default)', url: AN, root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("By provider")', prepare: rest,
    describe: anDescribe('the "By provider" table (runs, success rate, LLM cost, average duration)'),
    targets: { group: 'main [role="combobox"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)', description: 'row hover (bg-paper-deep)' }, focus: { target: 'group' } },
    na: { ...PAGE_NA, active: 'no meaningful active state', empty: 'captured as huf-analytics-empty' }, slotNames: anSlots },
  { id: 'huf-analytics-agent', name: 'Analytics tab, cost per agent', url: AN, root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("By provider")', prepare: async (p) => { await groupBy(p, 'Agent'); await rest(p); },
    describe: anDescribe('the "By agent" table: Order Status Bot, Support Triage, Policy Librarian, Invoice Reconciler ... with their LLM cost each'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-analytics-provider', focus: 'see huf-analytics-provider', active: 'n/a', empty: 'captured as huf-analytics-empty' }, slotNames: anSlots },
  { id: 'huf-analytics-model', name: 'Analytics tab, cost per model', url: AN, root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("By provider")', prepare: async (p) => { await groupBy(p, 'Model'); await rest(p); },
    describe: anDescribe('the "By model" table: gpt-4.1, gpt-4.1-mini, mistral-small, mistral-large ... with their LLM cost each'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-analytics-provider', focus: 'see huf-analytics-provider', active: 'n/a', empty: 'captured as huf-analytics-empty' }, slotNames: anSlots },
  { id: 'huf-analytics-group-menu', name: 'Analytics "group by" menu (open)', url: AN, root: '[data-radix-popper-content-wrapper]', pad: { l: 8, t: 8, r: 8, b: 12 }, fixtures: FX,
    waitFor: 'h2:has-text("By provider")', prepare: async (p) => { await rest(p); await click(p, 'main [role="combobox"]'); await p.waitForSelector('[role="listbox"]'); await p.mouse.move(0, 0); await settle(p); },
    describe: ['The group-by dropdown of the Analytics tab: Provider, Agent, Model, Conversation, Run kind.', 'Radix portal captured on its own; place it under the select when composing.'],
    states: {}, na: { hover: 'items highlight on keyboard focus only', focus: 'listbox owns focus', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' }, slotNames: { '[role="option"]': 'option' } },
  { id: 'huf-analytics-empty', name: 'Analytics tab, no analytics yet', url: AN + '&demo=empty', root: '#root', fixtures: FX,
    waitFor: 'text=No analytics yet', prepare: rest,
    describe: ['Analytics tab on a new workspace: "No analytics yet. Analytics accrue as agent runs complete in this window."', 'Empty state only.'],
    states: {}, na: { ...PAGE_NA, hover: 'see huf-analytics-provider', focus: 'see huf-analytics-provider', active: 'n/a', empty: 'this id is the empty state' } },

  { id: 'huf-analytics-entity-agent', name: 'Analytics entity page: one agent (Order Status Bot)', url: '/analytics/agent/Order%20Status%20Bot', root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("Runs over time")', prepare: async (p) => { await p.waitForSelector('.recharts-area'); await rest(p); },
    describe: entityDescribe('one agent'), states: { hover: { target: 'main nav a, main a:has-text("Analytics")', description: 'breadcrumb link hover' } },
    na: { ...PAGE_NA, focus: 'n/a', active: 'n/a', empty: 'see huf-analytics-empty' }, slotNames: { 'main span.text-ink': 'entity_name' } },
  { id: 'huf-analytics-entity-model', name: 'Analytics entity page: one model (gpt-4.1-mini)', url: '/analytics/model/gpt-4.1-mini', root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("Runs over time")', prepare: async (p) => { await p.waitForSelector('.recharts-area'); await rest(p); },
    describe: entityDescribe('one model'), states: {}, na: { ...PAGE_NA, hover: 'see huf-analytics-entity-agent', focus: 'n/a', active: 'n/a', empty: 'see huf-analytics-empty' }, slotNames: { 'main span.text-ink': 'entity_name' } },
];
