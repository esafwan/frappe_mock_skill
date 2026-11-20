// Chat area specs (pre-develop): the chat app (/chat: cold start, conversation with a grounded answer, tool calls, agent picker),
// artifacts in chat (frappe-report artifact card, Outputs card), context management (conversation analytics pane, agent Limits and
// Summaries/memory settings), voice settings (agent Channels tab > Voice calls), chat projects and the /apps launcher.
// Fixtures: scripts/huf/fixtures/chat.mjs + data/huf/chat.json (fictional, Northwind Trading); agent editor ids also use the
// agents + agents-editor fixtures (Order Status Bot) with the chat fixture layering the voice and advanced sections on top.
// Page specs keep every inner scroller at the top (static previews cannot hold a scroll offset); deeper content is a component id.
import fs from 'fs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/chat.json', import.meta.url), 'utf8'));
const FX = ['chat'];
const ED_FX = ['agents', 'agents-editor', 'chat'];
const ED = '/agents/Order%20Status%20Bot';
const COMPOSER = 'textarea[placeholder^="Write a message"]';
const POPPER = '[data-radix-popper-content-wrapper]';

const settle = (page, ms = 350) => page.waitForTimeout(ms);
/** Nothing focused or hovered, no spellcheck squiggles, every scroller back at the top, so live == static preview. */
const rest = async (page) => { await page.evaluate(() => { document.activeElement?.blur?.(); document.querySelectorAll('textarea, input').forEach((e) => { e.spellcheck = false; }); }); await page.mouse.move(0, 0); await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(page); };
const openTools = async (page) => { await page.locator('button:has-text("Ran 3 tools")').first().click(); await settle(page); };
const draft = async (page) => { const c = page.locator(COMPOSER).first(); await c.fill(D.drafts.empty); await c.blur(); await settle(page); };
// Same-document re-navigation (hash routes) keeps state between the light and dark runs, so only open when still closed.
const devOptions = async (page) => { const b = page.locator('button[aria-expanded="false"]:has-text("Show developer options")'); if (await b.count()) { await b.first().click(); await settle(page, 500); } };
const DEV = '[role="tabpanel"] div.space-y-4.pt-3';
/** Tall settings cards are taller than the 900 px viewport; content outside a fixed-height scroller is not painted, so give the page room. */
const tall = (h) => async (page) => { await page.setViewportSize({ width: 1440, height: h }); await settle(page, 300); };

const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts; not captured' };
const COMP_NA = { disabled: 'n/a', loading: 'mocked data renders without a visible skeleton', error: 'n/a' };
const chatDescribe = (what) => [`HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). ${what}`, 'Fictional Northwind Trading data from data/huf/chat.json.'];

export const specs = [
  // ---- chat: cold start ------------------------------------------------------------------------------------------
  { id: 'huf-chat-empty', name: 'Chat, new conversation (Hub Orchestrator cold start with starter prompts, recents filled)', url: '/chat', root: '#root', fixtures: FX,
    waitFor: 'text=Draft a restock email', prepare: rest,
    describe: chatDescribe('Cold start: agent avatar, name and description, three "Try" starter prompts, empty composer.'),
    targets: { starter: 'button.border-line.h-8:first-child', composer: COMPOSER },
    states: { hover: { target: 'starter', description: 'starter prompt hover (bg-paper)' }, focus: { target: 'composer' } },
    na: { ...PAGE_NA, active: 'pressing a starter sends it', empty: 'captured as huf-chat-empty-first-run' },
    slotNames: { 'button.border-line.h-8 span.truncate': 'starter_prompt' } },
  { id: 'huf-chat-empty-drafted', name: 'Chat, new conversation with a drafted message in the composer', url: '/chat', root: '#root', fixtures: FX,
    waitFor: 'text=Draft a restock email', prepare: async (p) => { await draft(p); await rest(p); },
    describe: chatDescribe('Cold start with a typed question in the composer; the send button turns solid.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-chat-empty', focus: 'see huf-chat-empty', active: 'see huf-chat-empty', empty: 'see huf-chat-empty-first-run' } },
  { id: 'huf-chat-empty-first-run', name: 'Chat, first run (no conversations yet)', url: '/chat?demo=empty', root: '#root', fixtures: FX,
    waitFor: 'text=No conversations yet', prepare: rest,
    describe: chatDescribe('First visit: "No conversations yet" in Recents, Hub Orchestrator hero with starters.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-chat-empty', focus: 'see huf-chat-empty', active: 'see huf-chat-empty', empty: 'this id is the empty state' } },

  // ---- chat: grounded answer + tool calls ------------------------------------------------------------------------
  { id: 'huf-chat-answer', name: 'Chat conversation: question, tool group (collapsed) and grounded answer with table and numbered sources', url: '/chat/CONV-0001', root: '#root', fixtures: FX,
    waitFor: 'text=Supplier Handbook 2025', prepare: rest,
    describe: chatDescribe('Supplier Desk conversation: user bubble, "Ran 3 tools" row (search_knowledge, list_records, get_record), then a markdown answer with a table of late orders, policy bullets with numbered source links [1] [2] and a Sources list. Citations are markdown links (HUF chat has no dedicated citation chips).'),
    targets: { tools: 'div.not-prose > button' },
    states: { hover: { target: 'tools', description: 'tool group row hover (bg-muted/60)' }, focus: { target: COMPOSER } },
    na: { ...PAGE_NA, active: 'click expands the tool group: huf-chat-answer-tools', empty: 'see huf-chat-empty' },
    slotNames: { '.is-user p': 'user_message', '.is-assistant td': 'table_cell' } },
  { id: 'huf-chat-answer-tools', name: 'Chat conversation with the tool group expanded (3 tool calls with results)', url: '/chat/CONV-0001', root: '#root', fixtures: FX,
    waitFor: 'text=Supplier Handbook 2025', prepare: async (p) => { await openTools(p); await rest(p); },
    describe: chatDescribe('Same conversation with "Ran 3 tools" open: numbered rows with status dot, tool name and a one-line result summary.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-chat-answer', focus: 'see huf-chat-answer', active: 'see huf-chat-answer', empty: 'n/a' } },
  { id: 'huf-chat-tool-group', name: 'Tool call group, expanded (search_knowledge, list_records, get_record)', url: '/chat/CONV-0001', root: 'div.not-prose[data-state="open"]', pad: { l: 12, t: 8, r: 12, b: 8 }, fixtures: FX,
    waitFor: 'text=Supplier Handbook 2025', prepare: async (p) => { await openTools(p); await rest(p); },
    describe: ['The "Ran N tools" row from an assistant turn, expanded: one line per call with index, green done dot, tool name (mono) and a summary of its result.', 'Close-up for "the agent looked things up"; tool names and summaries are slots.'],
    targets: { trigger: 'div.not-prose[data-state="open"] > button' },
    states: { hover: { target: 'trigger', description: 'header hover' }, active: { target: 'div.items-center.gap-2:first-of-type', description: 'pressing a call row (no visual change; clicking the header would collapse the group)' } },
    na: { ...COMP_NA, focus: 'focus ring only on keyboard focus', empty: 'a run without tools shows no group' },
    slotNames: { 'span.shrink-0.truncate.font-mono': 'tool_name', 'span.flex-1.truncate.font-mono': 'tool_summary' } },

  // ---- chat: agent picker ----------------------------------------------------------------------------------------
  { id: 'huf-chat-agent-picker', name: 'Chat agent switcher (open): agents grouped by provider with model', url: '/chat', root: POPPER, pad: { l: 8, t: 8, r: 8, b: 12 }, fixtures: FX,
    waitFor: 'text=Draft a restock email',
    prepare: async (p) => { await rest(p); await p.locator('button:has-text("Hub Orchestrator")').first().click(); await p.waitForSelector(POPPER); await p.mouse.move(0, 0); await settle(p); },
    describe: ['The agent switcher popover from the chat header: search field, agents grouped by provider (Anthropic, OpenAI) with coloured initials avatar, name, model and a check on the current agent.', 'Radix portal captured on its own; place it under the header agent name (top-left of the chat area) when composing.'],
    targets: { search: 'input' }, states: { hover: { target: '[cmdk-item]:nth-of-type(2)', description: 'agent row hover' }, focus: { target: 'search' }, active: { target: 'search', description: 'pressing in the search field (pressing a row would switch agent and close the popover)' } },
    na: { disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },

  // ---- artifacts --------------------------------------------------------------------------------------------------
  { id: 'huf-artifacts-report', name: 'Chat conversation with a report artifact (Q4 sales orders over $5,000)', url: '/chat/CONV-0002', root: '#root', fixtures: FX,
    waitFor: 'text=Open in Desk', prepare: rest,
    describe: chatDescribe('Sales Analyst conversation: question, render_frappe_view tool row, short answer and an inline frappe-report artifact card (title, Preview/Source tabs, copy, download, fullscreen, filters, sortable table). The header shows the analytics and artifact-pane toggles.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-artifacts-report-card', focus: 'see huf-chat-empty', active: 'n/a', empty: 'the /chat/artifacts page is a placeholder ("No artifacts yet")' } },
  { id: 'huf-artifacts-report-card', name: 'Artifact card: frappe report (filters + sortable table)', url: '/chat/CONV-0002', root: '.is-assistant div.overflow-hidden.rounded-lg.border.bg-background', fixtures: FX,
    waitFor: 'text=Open in Desk', prepare: rest,
    describe: ['An inline artifact as an agent returns it in chat: header with table icon and title, Preview/Source pill tabs and copy/download/fullscreen actions, then the report: Open in Desk link, filter inputs per column, sortable table and record count.', 'Rows come from data/huf/chat.json (report.data).'],
    targets: { source: 'button[role="tab"]:last-child', row: '.is-assistant tbody tr:nth-child(2)' },
    states: { hover: { target: 'row', description: 'table row hover (bg-paper-deep)' }, focus: { target: 'source' } },
    na: { ...COMP_NA, active: 'n/a', empty: 'an empty report shows "No records."; not captured' },
    slotNames: { 'tbody td span': 'cell' } },
  { id: 'huf-artifacts-outputs', name: 'Outputs card at the end of a conversation (artifacts produced)', url: '/chat/CONV-0002', root: '.gap-chat-turn > div.rounded-md.border-line', pad: { l: 8, t: 8, r: 8, b: 8 }, fixtures: FX,
    waitFor: 'text=Open in Desk', prepare: rest,
    describe: ['The Outputs card that closes a conversation turn: count and one row per artifact (report, document) with its type icon; clicking a row opens the artifact pane.', 'Artifact titles are slots; list in data/huf/chat.json (artifacts).'],
    targets: { first: '.gap-chat-turn > div.rounded-md.border-line > button:nth-of-type(1)' },
    states: { hover: { target: 'first', description: 'row hover' } },
    na: { ...COMP_NA, focus: 'keyboard focus ring only', active: 'opens the pane', empty: 'no card when a conversation has no artifacts' },
    slotNames: { 'button span': 'artifact_title' } },

  // ---- context management -----------------------------------------------------------------------------------------
  { id: 'huf-context-analytics', name: 'Chat with the conversation analytics pane (tokens, cost, current context window)', url: '/chat/CONV-0001?pane=analytics', root: '#root', fixtures: FX,
    waitFor: 'text=Context window', prepare: rest,
    describe: ['Conversation analytics pane next to the chat: Totals (runs, billed input, output, cost, cache read/write, average duration) and Current context (largest turn, context window, context fullness, this turn, composition by system/history/knowledge/tools/user).', 'Use for context-window and cost stories; numbers in data/huf/chat.json (analytics).'],
    states: {}, na: { ...PAGE_NA, hover: 'info icons show tooltips; not captured', focus: 'n/a', active: 'n/a', empty: 'a conversation without runs shows empty stats; not captured' } },
  { id: 'huf-context-growth', name: 'Context growth chart (largest context per turn)', url: '/chat/CONV-0001?pane=analytics', root: 'div.flex.flex-col.gap-6 > section:last-child', pad: { l: 8, t: 8, r: 8, b: 8 }, fixtures: FX,
    waitFor: 'text=Context window', prepare: rest, settle: 900,
    describe: ['Bottom of the analytics pane: "Context growth", a line chart of the largest context size per turn (6 turns, 4k to 15k tokens).', 'Series in data/huf/chat.json (analytics.series).'],
    states: {}, na: { hover: 'chart tooltip needs pointer tracking; not captured', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },
  { id: 'huf-context-limits', name: 'Agent settings: Limits (context strategy Summarize, history limit, max turns, knowledge and tool budgets)', url: ED + '#advanced', root: '[role="tabpanel"] > div > section:nth-child(3)', fixtures: ED_FX,
    waitFor: 'text=When a conversation gets long', prepare: rest,
    describe: ['Agent editor > Advanced > Limits card: "When a conversation gets long" (Summarize / FIFO / None), history limit, max turns, max knowledge tokens and max context characters.', 'Values in data/huf/chat.json (advanced), layered over the Order Status Bot agent.'],
    targets: { history: 'input' },
    states: { focus: { target: 'history' }, hover: { target: 'history', description: 'inputs have no hover style' }, active: { target: 'history', description: 'press in the history limit field (the strategy select would open)' } },
    na: { ...COMP_NA, empty: 'n/a' } },
  { id: 'huf-context-summaries', name: 'Agent settings: Summaries (how long conversations are compressed)', url: ED + '#advanced', root: DEV + ' > div.rounded-lg.p-4', fixtures: ED_FX,
    waitFor: 'text=When a conversation gets long', prepare: async (p) => { await devOptions(p); await p.waitForSelector('text=Summary ratio'); await rest(p); },
    describe: ['Agent editor > Advanced > Developer options > Summaries (shown when "When a conversation gets long" is Summarize): summary ratio, summary model, and the external-template switch (the summary prompt field sits just below the card).', 'Pairs with huf-context-limits; values in data/huf/chat.json (advanced).'],
    targets: { ratio: 'input' },
    states: { focus: { target: 'ratio' }, hover: { target: 'ratio', description: 'no hover style' }, active: { target: 'ratio', description: 'press in the summary ratio field (the switch would toggle)' } },
    na: { ...COMP_NA, empty: 'n/a' } },
  { id: 'huf-context-memory', name: 'Agent settings: conversation data and memory switches', url: ED + '#advanced', root: DEV + ' > div.rounded-lg:nth-child(6)', fixtures: ED_FX,
    waitFor: 'text=When a conversation gets long', prepare: async (p) => { await devOptions(p); await p.waitForSelector('text=Enable memory'); await rest(p); },
    describe: ['Agent editor > Advanced > Developer options: conversation data management (allow + inject into prompt), Enable memory with the memory search / write tools, and Show tool execution details.', 'Long-term memory and per-conversation data are HUF\'s other context-management levers; values in data/huf/chat.json (advanced).'],
    targets: { note: 'p' },
    states: { hover: { target: 'note', description: 'no hover style' }, focus: { target: 'note', description: 'descriptions are not focusable' }, active: { target: 'note', description: 'press on a description (pressing a switch or its label would toggle it)' } },
    na: { ...COMP_NA, empty: 'n/a' } },

  // ---- voice ------------------------------------------------------------------------------------------------------
  { id: 'huf-voice-settings', name: 'Agent settings: Voice calls on (mode, engine, engine configuration, greeting, speech models)', url: ED + '#channels', root: '[role="tabpanel"] div[data-state="on"]:has([aria-label="Voice calls settings"])', fixtures: ED_FX,
    waitFor: 'text=Voice calls', prepare: async (p) => { await tall(2600)(p); await p.waitForSelector('[aria-label="Voice calls settings"]'); await p.waitForSelector('text=How the agent sounds on the call.'); await rest(p); }, settle: 900,
    describe: ['Agent editor > Channels > Voice calls switched on: Text and voice / Voice only, voice engine (OpenAI Realtime), engine configuration (voice, turn detection, interruptions), greeting and the speech-to-text / text-to-speech model fields.', 'Values in data/huf/chat.json (voice). The live call overlay itself needs WebRTC and is not captured.'],
    targets: { greeting: 'textarea' },
    states: { focus: { target: 'greeting' }, hover: { target: 'greeting', description: 'no hover style' }, active: { target: 'greeting', description: 'press in the greeting (the switch would turn voice off)' } },
    na: { ...COMP_NA, empty: 'voice off collapses the card to its switch row' } },

  // ---- projects ---------------------------------------------------------------------------------------------------
  { id: 'huf-chat-projects', name: 'Chat projects list', url: '/chat/projects', root: '#root', fixtures: FX,
    waitFor: 'text=Supplier performance Q1', prepare: rest,
    describe: chatDescribe('Projects page: three projects with description and last activity, "+ Project" button.'),
    targets: { row: 'ul.divide-line > li:first-child > button' },
    states: { hover: { target: 'row', description: 'project row hover (bg-paper-deep)' } },
    na: { ...PAGE_NA, focus: 'n/a', active: 'n/a', empty: 'captured as huf-chat-projects-empty' } },
  { id: 'huf-chat-projects-empty', name: 'Chat projects, none yet', url: '/chat/projects?demo=empty', root: '#root', fixtures: FX,
    waitFor: 'text=No conversations yet', prepare: rest,
    describe: chatDescribe('Projects page with no projects and an empty rail.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-chat-projects', focus: 'n/a', active: 'n/a', empty: 'this id is the empty state' } },

  // ---- apps launcher ----------------------------------------------------------------------------------------------
  { id: 'huf-apps-launcher', name: 'Apps launcher (six installed HUF apps)', url: '/apps', root: '#root', fixtures: FX,
    waitFor: 'text=Recipe Cards', prepare: rest,
    describe: ['HUF Apps launcher inside the main shell: one card per installed app with icon, title, category chip, open-in-new-tab action and description.', 'Fictional Northwind apps and icons from data/huf/chat.json (apps) and fixtures/chat.mjs (ICONS).'],
    states: { hover: { target: 'div.grid > div:first-child > a > div', description: 'app card hover (border-ink)' }, focus: { target: 'h1', description: 'page title (cards are links; focusing them is not a distinct look)' }, active: { target: 'h1', description: 'press on the page title (pressing a card or nav link navigates away)' } },
    na: { ...PAGE_NA, focus: 'n/a', active: 'n/a', empty: 'captured as huf-apps-launcher-empty' },
    slotNames: { 'div.grid h3': 'app_title', 'div.grid p.text-steel': 'app_description' } },
  { id: 'huf-apps-launcher-empty', name: 'Apps launcher, no apps installed', url: '/apps?demo=empty', root: '#root', fixtures: FX,
    waitFor: 'main h1, main h2', prepare: async (p) => { await settle(p, 600); await rest(p); },
    describe: ['HUF Apps launcher with no apps installed (empty state).'],
    states: { hover: { target: 'h1', description: 'no hover on the empty page' }, focus: { target: 'h1', description: 'n/a' }, active: { target: 'h1', description: 'press on the page title (nav links would navigate away)' } },
    na: { ...PAGE_NA, empty: 'this id is the empty state' } },
];
