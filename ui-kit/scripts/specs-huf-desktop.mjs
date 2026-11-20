// HUF DESKTOP (Electron + React app, github huf_desktop): the REAL renderer built by scripts/huf-desktop/build.sh and run by
// the desktop harness scripts/huf-desktop/app.mjs (spec.harness), with the preload bridge (window.desktop / approvalPanel) and the
// Huf server answered from data/huf/desktop.json. Fictional company Northwind Trading, user maya@example.com, workspace supplier-ops.
// Routes are hash routes of the renderer ('#/chat/<conversation>', '#/settings/<category>') or 'approval/index.html' (the approval panel window).
import fs from 'fs';
const DATA = JSON.parse(fs.readFileSync(new URL('../data/huf/desktop.json', import.meta.url), 'utf8'));
const BASE = { harness: 'huf-desktop', source: 'huf-desktop', darkTheme: 'dark' };
const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'fixture data renders without a visible skeleton', error: 'page-level errors are inline banners; not captured' };
const NO_STATES = { hover: 'see huf-desktop-chat', focus: 'see huf-desktop-chat', active: 'see huf-desktop-chat' };

/** Explicit states for whole-window specs: without them capture presses the FIRST interactive element (the rail toggle), which
 *  collapses the rail before the next mode is captured. Active never presses (a press navigates); it records the hover look. */
const safeStates = (target, what) => ({
  hover: { target, description: `${what} hover` }, focus: { target, description: `${what} focus ring` },
  active: { target, act: async (p, t) => t.hover({ force: true }), description: `no distinct pressed style; a press would navigate, so this is the ${what} hover look` },
});
const RAIL = safeStates('[data-testid="rail-skills"]', 'chat rail Skills row');
const SETTINGS = safeStates('input[placeholder^="Search"]', 'settings search field');
const settle = (page, ms = 350) => page.waitForTimeout(ms);
const click = async (page, sel) => { await page.locator(sel).first().click(); await settle(page); };
/** Nothing focused or hovered, every scroller at the top, so screenshots are stable. */
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(page); };
/** Chat transcript scrolled to its end (the app does this itself; we repeat it after rest()). */
const toBottom = (page) => page.evaluate(() => { document.querySelectorAll('[data-testid="message-list"], .overflow-y-auto').forEach((e) => { e.scrollTop = e.scrollHeight; }); });
/** The approval panel window is sized to its content by main (setHeight); in a browser the root is h-screen, so size it to content. */
const panelToContent = (page) => page.evaluate(() => { const r = document.querySelector('#root > *'); if (r) r.style.height = 'auto'; });
const openArtifact = async (page, title) => {
  await page.locator('[data-testid="artifact-card-toggle"]').first().click();
  await page.waitForSelector(`text=${title} >> nth=1`, { timeout: 8000 }).catch(() => {});
  await settle(page, 900);
};

const chatDescribe = (what) => [`Huf Desktop main window, chat with a Huf agent (Operations Analyst on the fictional Northwind Trading server): title bar, chat rail (New chat, Projects, Scheduled, Documents, Skills, Recents grouped by day, connection footer), ${what}`, 'Composer row: workspace folder chip (supplier-ops), agent selector with model, approval-mode Permissions chip (Ask every time). Text comes from data/huf/desktop.json.'];

export const specs = [
  // ---- chat -------------------------------------------------------------------------------------------------------
  { ...BASE, id: 'huf-desktop-chat', name: 'Desktop chat: tool run summary, document card and answer, composer with workspace / agent / Permissions chips', url: '#/chat/NW-CONV-0001', root: '#root',
    waitFor: 'text=Two suppliers need a conversation', prepare: rest,
    describe: chatDescribe('the conversation "Supplier delivery review, Q4": user request, "Ran 4 tools" summary (reads, a command, Create document), the document card with Open, and the agent answer with bullets.'),
    targets: { open: '[data-testid="artifact-card-toggle"]' }, states: { hover: { target: 'open', description: 'artifact card Open button hover' }, focus: { target: 'open' }, active: { target: 'open', act: async (p, t) => t.hover({ force: true }), description: 'no distinct pressed style; a press opens the side panel (see huf-desktop-artifact-document), so this is the hover look' } },
    na: { ...PAGE_NA, empty: 'captured as huf-desktop-first-run (nothing connected)' },
    slotNames: { 'header h1, header .truncate': 'conversation_title' } },
  { ...BASE, id: 'huf-desktop-chat-tool-run', name: 'Desktop chat: tool run expanded (each call with its input)', url: '#/chat/NW-CONV-0001', root: '#root',
    waitFor: 'text=Two suppliers need a conversation',
    prepare: async (p) => { await click(p, 'button:has-text("Ran 4 tools")'); await rest(p); },
    describe: chatDescribe('the "Ran 4 tools" group expanded: fs.read of the delivery log and open purchase orders, the scoring command and Create document, each with its status.'),
    states: RAIL, na: { ...PAGE_NA, ...NO_STATES, empty: 'see huf-desktop-first-run' } },
  { ...BASE, id: 'huf-desktop-permissions-menu', name: 'Composer Permissions chip: approval mode menu (open)', url: '#/chat/NW-CONV-0001', root: '[data-radix-popper-content-wrapper]', pad: { l: 8, t: 8, r: 8, b: 12 },
    waitFor: 'text=Two suppliers need a conversation',
    prepare: async (p) => { await rest(p); await p.locator('button[aria-label^="Permissions"]').first().click(); await p.waitForSelector('[data-radix-popper-content-wrapper]'); await p.mouse.move(0, 0); await settle(p); },
    describe: ['The approval-mode menu of the composer Permissions chip for the workspace supplier-ops: Ask every time (selected), Auto, Sandboxed, Full access, each with its one-line meaning.', 'Radix portal captured on its own (the window behind it is huf-desktop-chat); place it above the "Ask every time" chip when composing.'],
    targets: { auto: 'button + button' },
    states: { hover: { target: 'auto', description: 'mode row hover (Auto)' }, focus: { target: 'auto' }, active: { target: 'auto', act: async (p, t) => t.hover({ force: true }), description: 'no distinct pressed style; a press selects the mode and closes the menu, so this is the hover look' } },
    na: { disabled: 'no mode is blocked here', error: 'n/a', loading: 'n/a', empty: 'n/a' } },
  { ...BASE, id: 'huf-desktop-agent-selector', name: 'Composer agent selector (open): Huf agents and models on this computer', url: '#/chat/NW-CONV-0001', root: '[data-radix-popper-content-wrapper]', pad: { l: 8, t: 8, r: 8, b: 12 },
    waitFor: 'text=Two suppliers need a conversation',
    prepare: async (p) => { await rest(p); await p.locator('button:has-text("Operations Analyst")').last().click(); await p.waitForSelector('[data-radix-popper-content-wrapper]'); await p.mouse.move(0, 0); await settle(p); },
    describe: ['The agent and model picker of the composer: the three Huf agents of Northwind Trading (Operations Analyst selected, Buying Assistant, Catalog Writer) with their models, and the on-device options.', 'Radix portal captured on its own (the window behind it is huf-desktop-chat).'],
    targets: { row: '[data-testid="picker-row-huf:Buying Assistant"]', search: 'input' },
    states: { hover: { target: 'row', description: 'agent row hover' }, focus: { target: 'search' }, active: { target: 'row', act: async (p, t) => t.hover({ force: true }), description: 'no distinct pressed style; a press selects the agent and closes the picker, so this is the hover look' } },
    na: { disabled: 'no agent is unavailable here', error: 'n/a', loading: 'n/a', empty: 'n/a' } },

  // ---- artifacts --------------------------------------------------------------------------------------------------
  { ...BASE, id: 'huf-desktop-artifact-chart', name: 'Desktop chat with a chart artifact open in the right pane', url: '#/chat/NW-CONV-0002', root: '#root',
    waitFor: 'text=Four of six suppliers met', prepare: async (p) => { await openArtifact(p, 'On-time delivery by supplier, Q4'); await p.waitForSelector('.recharts-surface', { timeout: 8000 }); await rest(p); }, settle: 900,
    describe: ['Chat "On-time delivery by supplier" with the right pane open on the Artifacts tab: a Recharts bar chart (on time vs 95% target for six fictional suppliers), its title bar and the Activity / Processes tabs.', 'The chart is real SVG captured from the app; change values by editing the chart in data/huf/desktop.json and re-capturing.'],
    states: RAIL, na: { ...PAGE_NA, ...NO_STATES, empty: 'n/a' } },
  { ...BASE, id: 'huf-desktop-artifact-document', name: 'Desktop chat with a markdown document artifact open in the right pane', url: '#/chat/NW-CONV-0003', root: '#root',
    waitFor: 'text=Here is the proposal', prepare: async (p) => { await openArtifact(p, 'Reorder policy for chilled goods'); await rest(p); }, settle: 900,
    describe: ['Chat "Reorder policy for chilled goods" with the right pane showing the markdown document artifact (headings, a table, bullets) and its Export control.', 'Use for "the agent wrote a document" moments.'],
    states: RAIL, na: { ...PAGE_NA, ...NO_STATES, empty: 'n/a' } },

  // ---- first run --------------------------------------------------------------------------------------------------
  { ...BASE, id: 'huf-desktop-first-run', name: 'First run: connect to a Huf server (server address, API key, API secret)', url: '#/chat', root: '#root',
    bridge: { connection: null, executor: null }, emptyConversations: true,
    waitFor: 'text=Connect to Huf', prepare: async (p) => { await click(p, 'button:has-text("Connect to Huf")'); await p.waitForSelector('input'); await rest(p); },
    describe: ['The connection screen of Huf Desktop: "Connect to Huf" with server address, API key and API secret, "Where do I find these?", Advanced (site and live-updates port), Connect / Test only, and the "With Huf Desktop" benefits list.', 'Nothing is connected in this state (no saved connection).'],
    targets: { url: 'input' }, states: { ...safeStates('input', 'server address field'), focus: { target: 'input', description: 'server address field focus ring' } }, na: { ...PAGE_NA, hover: 'no meaningful hover', active: 'n/a', empty: 'this id is the empty state' } },

  { ...BASE, id: 'huf-desktop-first-run-api-key', name: 'First run: connect with an API key (server address, API key, API secret)', url: '#/chat', root: '#root',
    bridge: { connection: null, executor: null }, emptyConversations: true,
    waitFor: 'text=Connect to Huf', prepare: async (p) => { await click(p, 'button:has-text("Connect to Huf")'); await p.waitForSelector('input'); await click(p, 'button:has-text("API key")'); await p.locator('input').first().fill('northwind.huf.example'); await rest(p); },
    describe: ['The connection screen on the API key tab with the server address filled in: API key and API secret fields, "Where do I find these?", Advanced, Connect / Test only, and the local-models fallback.', 'Same screen as huf-desktop-first-run (Password tab).'],
    states: safeStates('a, button[aria-expanded]', 'Where do I find these? disclosure'), na: { ...PAGE_NA, hover: 'see huf-desktop-first-run', focus: 'see huf-desktop-first-run', active: 'see huf-desktop-first-run', empty: 'see huf-desktop-first-run' } },

  // ---- approval panel ---------------------------------------------------------------------------------------------
  { ...BASE, id: 'huf-desktop-approval', name: 'Approval panel: one command waiting for approval', url: 'approval/index.html', root: '#root > *', viewport: { width: 380, height: 640 },
    bridge: { approvalPanel: DATA.approval.single }, waitFor: 'text=Run a command', prepare: async (p) => { await settle(p, 800); await panelToContent(p); await rest(p); },
    slotNames: { 'section h2': 'action_title', 'section pre': 'command', 'header h1': 'pending_count', 'section p.truncate': 'agent_and_chat' },
    describe: ['The in-app approval panel (its own 380 px window over the chat): Operations Analyst asks to run a command in supplier-ops, with the command, working folder, confinement note and Allow once / for this run / Deny.', 'Approve buttons are disarmed for 600 ms after a request appears in the real app; this capture is after that.'],
    states: safeStates('section button:last-child', 'approval button'), na: { hover: 'not captured', focus: 'not captured', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'the panel is hidden when nothing waits' } },
  { ...BASE, id: 'huf-desktop-approval-batch', name: 'Approval panel: batch of four requests from one run', url: 'approval/index.html', root: '#root > *', viewport: { width: 380, height: 900 },
    bridge: { approvalPanel: DATA.approval.batch }, waitFor: 'text=Write a file', prepare: async (p) => { await settle(p, 800); await panelToContent(p); await rest(p); },
    slotNames: { 'section h2': 'action_title', 'section pre': 'command', 'header h1': 'pending_count', 'section p.truncate': 'agent_and_chat' },
    describe: ['The approval panel with four pending requests from one agent run (two file writes, one edit, one command) and the batch Allow all / Deny all row.', 'Same window as huf-desktop-approval.'],
    states: safeStates('section button:last-child', 'approval button'), na: { hover: 'not captured', focus: 'not captured', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'the panel is hidden when nothing waits' } },

  // ---- settings ---------------------------------------------------------------------------------------------------
  { ...BASE, id: 'huf-desktop-settings-agents', name: 'Settings > Agents and permissions (approval modes, limits per agent)', url: '#/settings/agents', root: '#root',
    waitFor: 'text=Limits per agent', prepare: rest,
    describe: ['Settings, Agents and permissions: category rail, the four approval modes (Ask every time, Auto, Sandboxed, Full access) and the limits per agent for workspace supplier-ops.', 'Establishing shot for "you stay in control" stories.'],
    targets: { search: 'input[placeholder^="Search"]' }, states: SETTINGS, na: { ...PAGE_NA, hover: 'see focus', active: 'n/a', empty: 'n/a' } },
  { ...BASE, id: 'huf-desktop-settings-local', name: 'Settings > Local capabilities (local skills and MCP servers)', url: '#/settings/local', root: '#root',
    waitFor: 'text=Local skills', prepare: rest,
    describe: ['Settings, Local capabilities: local skill folders, eight skills with Shipped / Local / Workspace badges, one needing confirmation, and the start of the Local MCP servers card.', 'Use for "bring your own skills and tools" stories.'],
    states: SETTINGS, na: { ...PAGE_NA, ...NO_STATES, empty: 'n/a' } },
  { ...BASE, id: 'huf-desktop-settings-mcp', name: 'Settings > Local capabilities: Local MCP servers card', url: '#/settings/local', root: '#mcp',
    waitFor: 'text=Local MCP servers', prepare: async (p) => { await rest(p); await p.locator('text=Local MCP servers').first().evaluate((e) => e.scrollIntoView({ block: 'start' })); await settle(p); },
    describe: ['The Local MCP servers card of Settings, Local capabilities (component): inventory and supplier-portal servers, confined, with their tools and per-tool policy (allow / ask / deny).', 'Same page as huf-desktop-settings-local.'],
    states: safeStates('button', 'card button'), na: { ...PAGE_NA, ...NO_STATES, empty: 'n/a' } },
];
