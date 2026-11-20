// Providers area specs (pre-develop): AI providers (cloud API key vs self-hosted endpoint), models, MCP servers.
// Fixtures: scripts/huf/fixtures/providers.mjs + data/huf/providers.json (fictional: Northwind Trading).
import fs from 'fs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/providers.json', import.meta.url), 'utf8'));
const FX = ['providers'];
const DIALOG = '[role="dialog"]';
const PAD = { l: 32, t: 32, r: 32, b: 48 };
const settle = (page, ms = 350) => page.waitForTimeout(ms);
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await settle(page); };
const fill = async (page, sel, v) => { const l = page.locator(sel).first(); await l.fill(v); await l.blur(); await settle(page, 120); };
const pageNa = { disabled: 'page-level: no single disabled control', error: 'page-level errors are toasts', loading: 'skeletons flash < 100 ms with mocked data' };
const dlgNa = { hover: 'dialog fields have no distinct hover', active: 'n/a', disabled: 'n/a', error: 'validation errors are toasts', loading: 'n/a', empty: 'n/a' };

const openAdd = async (page) => { await page.click('button:has-text("Add provider")'); await page.waitForSelector(DIALOG); await settle(page); };
const pickBrand = async (page, label) => { await page.click(`${DIALOG} button[role="combobox"]`); await page.click(`[role="option"]:has-text("${label}")`); await settle(page, 200); };
const addCloud = async (page) => { await openAdd(page); await fill(page, '#provider_name', D.newCloud.name); await fill(page, '#api_key', D.newCloud.key); await pickBrand(page, 'Groq'); await rest(page); };
const addLocal = async (page) => { await openAdd(page); await fill(page, '#provider_name', D.newLocal.name); await page.click('#is_local_llm'); await settle(page, 200); await fill(page, '#api_base_url', D.newLocal.url); await pickBrand(page, 'Ollama'); await rest(page); };
const configureLocal = async (page) => {
  await page.locator('main :text("Northwind Ollama")').first().click(); await page.waitForSelector(`${DIALOG} button:has-text("Test Connection")`); await settle(page);
  await page.click(`${DIALOG} button:has-text("Test Connection")`); await page.waitForSelector(`${DIALOG} :text("Endpoint reachable")`); await rest(page);
};
const openModel = async (page) => { await page.locator('main :text("claude-sonnet-4-5")').first().click(); await page.waitForSelector(`${DIALOG} #input_cost`); await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); [...d.querySelectorAll('.border-t')].slice(-1).forEach((e) => e.remove()); }); await rest(page); };

const providersDescribe = (what) => [`AI providers screen (Providers | Models tabs): ${what}`, 'Fictional Northwind Trading setup; data in data/huf/providers.json.'];

export const specs = [
  { id: 'huf-providers-list', name: 'AI providers page (cloud providers and self-hosted Ollama / LM Studio endpoints)', url: '/providers', root: '#root', fixtures: FX,
    waitFor: 'text=Northwind Ollama', prepare: rest,
    describe: providersDescribe('"Get started with AI" starter paths, then provider cards: OpenAI, Anthropic, Google and Mistral as "Configured" cloud API providers, and Northwind Ollama / Warehouse LM Studio marked "Local" (self-hosted endpoint), each with model count and model badges.'),
    targets: { search: 'input[placeholder^="Search providers"]' }, states: { hover: { target: 'main .grid > div:nth-child(3)', description: 'hover on the self-hosted "Northwind Ollama" card' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'empty list is the "No providers" card; not captured' },
    slotNames: { 'main h3': 'provider_name' } },
  { id: 'huf-providers-add-cloud', name: 'Add provider dialog: own API key (cloud provider)', url: '/providers', root: DIALOG, pad: PAD, fixtures: FX,
    waitFor: 'text=Northwind Ollama', prepare: addCloud,
    describe: ['Add provider dialog filled for a cloud provider with the customer\'s own API key: name, masked API key, optional base URL and brand picker (Groq).', 'Dialog is a portal captured on its own; the page behind it is huf-providers-list.'],
    states: {}, na: dlgNa, slotNames: { [`${DIALOG} h2`]: 'dialog_title' } },
  { id: 'huf-providers-add-local', name: 'Add provider dialog: self-hosted local model (Ollama / OpenAI-compatible endpoint)', url: '/providers', root: DIALOG, pad: PAD, fixtures: FX,
    waitFor: 'text=Northwind Ollama', prepare: addLocal,
    describe: ['Add provider dialog with "Is local LLM (self-hosted endpoint)" ticked: API key becomes optional, API Base URL is required (http://ollama.northwind.local:11434) and the brand is Ollama.', 'Pair with huf-providers-add-cloud for the "own key vs run it yourself" contrast.'],
    states: {}, na: dlgNa, slotNames: { [`${DIALOG} h2`]: 'dialog_title' } },
  { id: 'huf-providers-test', name: 'Configure self-hosted provider with Test Connection results', url: '/providers', root: DIALOG, pad: PAD, fixtures: FX,
    waitFor: 'text=Northwind Ollama', prepare: configureLocal,
    describe: ['Configure dialog for the Ollama endpoint after pressing Test Connection: "Endpoint reachable", two models OK with capability badges (chat, tools) and one model that is missing on the host with a red hint.', 'Shows the health check a self-hosted setup gets.'],
    states: {}, na: dlgNa, slotNames: { [`${DIALOG} h2`]: 'dialog_title' } },

  { id: 'huf-models-list', name: 'Models page (model cards with provider, modality badges and pricing)', url: '/models', root: '#root', fixtures: FX,
    waitFor: 'text=claude-sonnet-4-5', prepare: rest,
    describe: ['Models tab: one card per model (gpt-4.1-mini, claude-sonnet-4-5, llama3.1:8b on Northwind Ollama, ...) with provider, modality badges (Text, Image, Embeddings) and custom pricing summary; search and provider filter on top.', 'Free self-hosted models show "In $0/1M · Out $0/1M".'],
    targets: { search: 'input[placeholder^="Search models"]' }, states: { hover: { target: 'main .grid > div:nth-child(4)', description: 'hover on the claude-sonnet-4-5 card' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'empty list is the "No models" card; not captured' }, slotNames: { 'main h3': 'model_name' } },
  { id: 'huf-models-dialog', name: 'Configure model dialog (custom pricing)', url: '/models', root: DIALOG, pad: { l: 32, t: 4, r: 32, b: 4 }, fixtures: FX,
    waitFor: 'text=claude-sonnet-4-5', prepare: openModel,
    describe: ['Configure dialog for claude-sonnet-4-5: provider, modalities, "Enable custom pricing" on with input, output and cached input cost per 1M tokens.', 'Establishes how cost is set per model.'],
    states: {}, na: dlgNa },

  { id: 'huf-mcp-list', name: 'MCP servers page (tool connections: connected, token expired, disabled)', url: '/mcp', root: '#root', fixtures: FX,
    waitFor: 'text=Northwind Orders', prepare: rest,
    describe: ['MCP servers screen: cards for Northwind Orders, Shared Drive, Support Desk, Team Calendar and Legacy Pricing with status pills (enabled, connected, token expired, disabled), namespace and last sync.', 'Establishing shot for "connect your agent to tools" stories.'],
    targets: { search: 'input[placeholder^="Search MCP"]' }, states: { hover: { target: 'main .grid > div:nth-child(1)' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'empty list is the "No MCP servers" card; not captured' }, slotNames: { 'main h3': 'server_name' } },
  { id: 'huf-mcp-detail-tools', name: 'MCP server detail, Tools tab (synced tools with enable switches)', url: '/mcp/Northwind%20Orders#tools', root: '#root', fixtures: FX,
    waitFor: 'text=orders_lookup', prepare: rest,
    describe: ['MCP server detail for Northwind Orders on the Tools tab: auto-sync settings, last sync, and the table of five tools (orders_lookup, shipment_track, stock_level, customer_balance, order_cancel) with enable switches.', 'Header shows Enabled badge, Sync Now and Test Connection.'],
    states: {}, na: { ...pageNa, hover: 'see huf-mcp-list', focus: 'n/a', active: 'n/a', empty: 'no empty tools state captured' }, slotNames: { 'main td.font-medium': 'tool_name' } },
  { id: 'huf-mcp-detail-connection', name: 'MCP server detail, Connection tab (HTTP endpoint with API key)', url: '/mcp/Northwind%20Orders#connection', root: '#root', fixtures: FX,
    waitFor: '[role="tab"][data-state="active"]:has-text("Connection")', prepare: async (p) => { await p.waitForFunction(() => [...document.querySelectorAll('input')].some((i) => i.value.includes('mcp.northwind.example'))); await rest(p); },
    describe: ['MCP server detail on the Connection tab: transport type, server URL (https://mcp.northwind.example/orders) and API-key authentication header.', 'Use after the list to show how a tool server is wired.'],
    states: {}, na: { ...pageNa, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
];
