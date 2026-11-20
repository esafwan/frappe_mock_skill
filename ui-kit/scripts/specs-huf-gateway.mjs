// Gateways, integrations and the Channels app (pre-develop). Fixtures: scripts/huf/fixtures/gateway.mjs + data/huf/gateway.json
// (fictional Northwind Trading: WhatsApp, Slack, Microsoft Teams, Telegram, Email and an SMS/voice line still to set up).
// 'whatsapp' fixtures come first (template/number data for the Channels app), 'gateway' after so its routes win.
const FX = ['agents', 'whatsapp', 'gateway'];
/** States aimed at plain text: capture's automatic hover/focus/active would otherwise press the first button (e.g. "Copy app manifest", a sidebar link). */
const SAFE = { hover: { target: 'p', description: 'no visible hover (plain text)' }, focus: { target: 'p', description: 'no visible focus (plain text)' }, active: { target: 'p', description: 'no visible active (plain text)' } };
const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts; not captured' };
const SLACK = '/gateways/slack-northwind';
const WA = '/channels/whatsapp/n/Northwind%20Sales';
const CARD = 'main .grid > div:nth-child(1)';

const settle = (page, ms = 350) => page.waitForTimeout(ms);
const click = async (page, sel) => { await page.locator(sel).first().click(); await settle(page); };
const fill = async (page, sel, v) => { const l = page.locator(sel).first(); await l.fill(v); await l.blur(); await settle(page, 120); };
/** Nothing focused or hovered, every scroller back at the top. */
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(page); };
/** Scroll a card of the long Channel tab into view (it lives in the page's own scroller). */
const reveal = async (page, sel) => { await page.setViewportSize({ width: 1440, height: 2200 }); await page.evaluate(() => document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; })); await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.locator(sel).first().scrollIntoViewIfNeeded(); await settle(page); };
/** Card on the Channel tab whose heading text is `title` (plain CSS, resolved once in prepare and tagged). */
/** Open the Channel tab (a click, not a #channel URL: re-navigating to the same URL with a hash would not reload between light and dark). */
const channelTab = async (page, waitFor) => { await click(page, '[role="tab"]:has-text("Channel")'); await page.waitForSelector(waitFor); await settle(page); };
const tagCard = async (page, title, tag) => { await page.evaluate(({ title, tag }) => {
  const h = [...document.querySelectorAll('main p, main h3, main h2')].find((e) => e.textContent.trim() === title);
  let el = h; while (el && !(el.classList.contains('rounded-md') || el.classList.contains('rounded-lg') || el.classList.contains('rounded-xl')) ) el = el.parentElement;
  (el || h).setAttribute('data-kit-card', tag); }, { title, tag }); };

/** Answer an empty Gateway list, then leave and re-enter the page through the sidebar (client-side, so the kit fonts stay). */
async function emptyGateways(page) {
  if (await page.locator('text=No gateways').count()) return; // dark pass: the override from the light pass is still installed
  await page.route(/\/api\/resource\/Gateway\?/, (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: [] }) }));
  await page.route(/list_gateway_access_entries/, (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ message: [] }) }));
  await click(page, '[data-sidebar="menu-button"][href$="/integrations"]');
  await page.waitForSelector('text=Market research');
  await click(page, '[data-sidebar="menu-button"][href$="/gateways"]');
  await page.waitForSelector('text=No gateways');
}
/** Mark the first button in `scope` whose text is `text` with data-kit-btn=<tag>, so states can target it with plain CSS. */
const tagBtn = (page, scope, text, tag) => page.evaluate(({ scope, text, tag }) => { const b = [...document.querySelectorAll(scope + ' button')].find((x) => x.textContent.trim() === text); b?.setAttribute('data-kit-btn', tag); }, { scope, text, tag });
const listDescribe = (what) => [`Settings > Gateways for the fictional wholesaler Northwind Trading: tabs (Gateways, Pending access with a count, Channel credentials), the overview card and ${what}.`, 'Establishing shot for "connect your messaging channels to agents"; data in data/huf/gateway.json.'];
const detailDescribe = (what) => [`Gateway detail for the "Northwind Slack" channel (/gateways/<setting>): title, Connected status line with the last check, Test connection / Use in agent / Delete, tabs Connection, Recipients, Channel. ${what}`, 'The same page serves WhatsApp, Teams, Telegram and Email gateways (credential fields come from the service).'];

export const specs = [
  // ---- /gateways --------------------------------------------------------------------------------------------
  { id: 'huf-gateway-list', name: 'Gateways page (6 channels: WhatsApp, Slack, Teams, Telegram, Email, SMS/voice)', url: '/gateways', root: '#root', fixtures: FX,
    waitFor: 'text=Northwind Voice', prepare: async (p) => { await tagBtn(p, 'main', 'Add gateway', 'add'); await rest(p); },
    describe: listDescribe('six gateway cards with brand icons, status (Active, Needs attention, 3 to set up), channel, access policy, route target, last event or the outstanding setup steps'),
    targets: { add: '[data-kit-btn="add"]' }, states: { hover: { target: CARD, description: 'gateway card hover' }, focus: { target: 'add' }, active: { target: 'add' } },
    na: { ...PAGE_NA, empty: 'captured as huf-gateway-list-empty' },
    slotNames: { 'main .grid h3': 'gateway_name' } },
  { id: 'huf-gateway-list-add', name: 'Gateways page with the quick "Add gateway" form open (filled)', url: '/gateways', root: '#root', fixtures: FX,
    waitFor: 'text=Northwind Voice', prepare: async (p) => { await click(p, 'main button:has-text("Add gateway")'); await fill(p, 'main form input', 'Northwind Returns'); await rest(p); },
    describe: listDescribe('the quick add form open under the header: gateway name, channel provider select (WhatsApp) and "Create & Configure"; picking WhatsApp continues in the Channels setup wizard (huf-channels-setup)'),
    states: SAFE, na: { ...PAGE_NA, hover: 'see huf-gateway-list', focus: 'see huf-gateway-list', active: 'see huf-gateway-list', empty: 'see huf-gateway-list-empty' } },
  { id: 'huf-gateway-list-empty', name: 'Gateways page, no gateways yet', url: '/gateways', root: '#root', fixtures: FX,
    waitFor: 'text=Active Gateways', prepare: async (p) => { await emptyGateways(p); await rest(p); },
    describe: listDescribe('the empty state ("No gateways" with Add gateway)'),
    states: SAFE, na: { ...PAGE_NA, hover: 'see huf-gateway-list', focus: 'see huf-gateway-list', active: 'see huf-gateway-list', empty: 'this id is the empty state' } },
  { id: 'huf-gateway-card', name: 'Gateway card (WhatsApp, active, routed to an agent)', url: '/gateways', root: CARD, fixtures: FX,
    waitFor: 'text=Northwind Voice', prepare: rest,
    describe: ['One gateway card: name, Active status dot, description, Channel / Access policy / Route target, Manage WhatsApp and Configure icons, last event and the WhatsApp mark.', 'Compose several to show "all channels in one place"; text slots: gateway_name, description, metadata values.'],
    states: { ...SAFE, hover: { description: 'card hover' } }, na: { focus: 'card itself is not focusable', active: 'n/a', disabled: 'n/a', error: 'see huf-gateway-card-setup', loading: 'n/a', empty: 'n/a' },
    slotNames: { h3: 'gateway_name' } },
  { id: 'huf-gateway-card-setup', name: 'Gateway card that still needs setup (SMS/voice, 3 to set up)', url: '/gateways', root: 'main .grid > div:nth-child(6)', fixtures: FX,
    waitFor: 'text=Northwind Voice', prepare: rest,
    describe: ['Gateway card for a line that is not live yet: grey "3 to set up" status, "No default route", and the three red setup hints (credentials, route target, turn on).', 'Pair with huf-gateway-card for a before/after.'],
    states: SAFE, na: { hover: 'see huf-gateway-card', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'this id is the needs-setup state', loading: 'n/a', empty: 'n/a' },
    slotNames: { h3: 'gateway_name' } },
  { id: 'huf-gateway-pending', name: 'Gateways > Pending access (3 senders waiting for approval)', url: '/gateways?tab=pending-access', root: '#root', fixtures: FX,
    waitFor: 'text=PAIR-7Q4M', prepare: rest,
    describe: listDescribe('the Pending access tab: "Approve by pairing code" form and the pending pairing requests (sender, gateway, code, expiry, Approve / Revoke)'),
    states: SAFE, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'not captured (empty table says "No pending access requests")' } },

  // ---- /gateways/<setting> ------------------------------------------------------------------------------------
  { id: 'huf-gateway-detail', name: 'Gateway detail: Slack, Connection tab (credentials saved, connected)', url: SLACK, root: '#root', fixtures: FX,
    waitFor: 'text=Slack Signing Secret', prepare: rest,
    describe: detailDescribe('Connection tab: name, credentials (Slack Bot Token, Signing Secret, both "Saved"), the "How to connect Slack" guide and the Active / Use by default options.'),
    targets: { test: '[data-testid="integration-test-connection"]' }, states: { hover: { target: 'test' }, focus: { target: 'test' } },
    na: { ...PAGE_NA, active: 'n/a', empty: 'n/a' },
    slotNames: { 'main h1': 'page_title' } },
  { id: 'huf-gateway-detail-channel', name: 'Gateway detail: Slack, Channel tab (ready, routing, access policy, waiting people)', url: SLACK, root: '#root', fixtures: FX,
    waitFor: 'text=Slack Signing Secret', prepare: async (p) => { await channelTab(p, 'text=Ready to receive messages'); await rest(p); },
    describe: detailDescribe('Channel tab, top of the page: "Ready to receive messages", Channel enabled, Run as user, Connection, Routing target (Agent: Support Triage), Direct message policy (Pairing) and new-sender limits.'),
    states: SAFE, na: { ...PAGE_NA, hover: 'see huf-gateway-detail', focus: 'see huf-gateway-detail', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-gateway-routing-rules', name: 'Routing rules card (3 rules: channel, channel, catch-all)', url: SLACK, root: '[data-kit-card="routing"]', fixtures: FX,
    waitFor: 'text=Slack Signing Secret', prepare: async (p) => { await channelTab(p, 'text=Routing rules'); await tagCard(p, 'Routing rules', 'routing'); await reveal(p, '[data-kit-card="routing"]'); },
    describe: ['Routing rules of a gateway in plain sentences ("When a message arrives in #warehouse, send it to Order status reply flow"), with order arrows, on/off switches, edit and delete, Add a rule and the "Test a message" box.', 'Use to show how one channel routes to different agents and flows.'],
    states: SAFE, na: { hover: 'n/a', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },
  { id: 'huf-gateway-activity', name: 'Gateway activity card (24h / 7d counts, recent messages)', url: SLACK, root: '[data-kit-card="activity"]', fixtures: FX,
    waitFor: 'text=Slack Signing Secret', prepare: async (p) => { await channelTab(p, 'text=Jonas Weber'); await tagCard(p, 'Activity', 'activity'); await reveal(p, '[data-kit-card="activity"]'); },
    describe: ['Activity of a gateway: On badge, last message, messages and problems in the last 24 hours and 7 days, usage cost and tokens, and recent messages with who sent them, status (Done / Blocked) and which agent or flow handled them.', 'Data in data/huf/gateway.json (health).'],
    states: SAFE, na: { hover: 'n/a', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },
  { id: 'huf-gateway-slack-setup', name: 'Slack setup card (manifest, keys, connection checks, test message)', url: SLACK, root: '[data-kit-card="slack-setup"]', fixtures: FX,
    waitFor: 'text=Slack Signing Secret', prepare: async (p) => { await channelTab(p, 'text=Bot token added'); await tagCard(p, 'Slack setup', 'slack-setup'); await reveal(p, '[data-kit-card="slack-setup"]'); },
    describe: ['Slack setup guide: 1 create the Slack app from the manifest, 2 add your keys, 3 check the connection (eight checks, one recommendation), 4 send a test message.', 'Use for "connect Slack in minutes".'],
    states: SAFE, na: { hover: 'n/a', focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },

  // ---- /integrations ----------------------------------------------------------------------------------------
  { id: 'huf-integrations-list', name: 'Integrations page (11 connections, two need attention)', url: '/integrations', root: '#root', fixtures: FX,
    waitFor: 'text=Market research', prepare: async (p) => { await tagBtn(p, 'header', 'Service catalog', 'catalog'); await rest(p); },
    describe: ['Settings > Integrations: every connected account (channels and tools such as GitHub, Gmail, Google Calendar/Sheets/Maps, SerpApi) with service logo, status pill, last check, "Use in agent" and "Fix this" / Settings.', 'Sorted by health, so problems come first.'],
    targets: { catalog: '[data-kit-btn="catalog"]' }, states: { hover: { target: 'catalog' }, focus: { target: 'catalog' } },
    na: { ...PAGE_NA, active: 'n/a', empty: 'n/a' } },
  { id: 'huf-integrations-catalog', name: 'Integrations page with the "Add Integration" catalog open', url: '/integrations', root: 'body', fixtures: FX,
    waitFor: 'text=Market research', prepare: async (p) => { await click(p, 'header button:has-text("Add Integration")'); await p.waitForSelector('[role="dialog"]'); await rest(p); },
    describe: ['The service catalog dialog over the Integrations page: services grouped by category with logos and short descriptions, ready to connect.', 'Root is body (the dialog is a portal).'],
    states: SAFE, na: { hover: 'n/a', focus: 'dialog owns focus', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },

  // ---- Channels app -------------------------------------------------------------------------------------------
  { id: 'huf-channels-home', name: 'Channels app: WhatsApp number home (healthy)', url: WA + '/home', root: '#root', fixtures: FX,
    waitFor: 'text=Working: receiving and replying normally.', prepare: async (p) => { await p.waitForSelector('[data-testid="counter-Conversations"]:has-text("86")'); await tagBtn(p, 'main', 'Check now', 'check'); await rest(p); },
    describe: ['Channels app home for the "Northwind Sales" number: channel rail (WhatsApp, Telegram, Slack, Teams, number picker, sections), health banner with Enabled / Credentials / Receiving chips, counters, access token and 24h activity cards, needs attention, quick actions.', 'Establishing shot for the Channels app; previously crashed under the mocks (fixed by the get_number_summary and list_conversations fixtures).'],
    targets: { check: '[data-kit-btn="check"]' }, states: { hover: { target: 'check' }, focus: { target: 'check' } },
    na: { ...PAGE_NA, active: 'n/a', empty: 'n/a' } },
  { id: 'huf-channels-rail', name: 'Channels rail (WhatsApp selected, number picker, sections)', url: WA + '/home', root: 'nav[aria-label="Channels"]', fixtures: FX,
    waitFor: 'text=Working: receiving and replying normally.', prepare: rest,
    describe: ['Left rail of the Channels app: channel switcher (WhatsApp, Telegram, Slack, Teams), the number picker and the WhatsApp sections (Home active, Activity, Broadcasts, Templates, Commerce, Automations, Analytics, Connections, Numbers, Settings).', 'Compose beside any Channels section.'],
    targets: { item: 'a[href$="/templates"]' }, states: { hover: { target: 'item', description: 'section hover' } },
    na: { focus: 'n/a', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' } },
  { id: 'huf-channels-setup', name: 'Channels app: Set up WhatsApp, step 1 (choose how to connect)', url: '/channels/whatsapp/setup', root: '#root', fixtures: FX,
    waitFor: 'text=Step 1 of 6', prepare: rest,
    describe: ['WhatsApp setup wizard step 1 of 6 (Choose how to connect, Credentials, Webhook, Test, Who answers, Access policy): Connect with Facebook or "I have a Meta app", plus the Ask Hub card.', 'Start of the "connect WhatsApp" story.'],
    states: SAFE, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
  { id: 'huf-channels-setup-credentials', name: 'Channels app: Set up WhatsApp, step 2 (credentials, filled)', url: '/channels/whatsapp/setup', root: '#root', fixtures: FX,
    waitFor: 'text=Step 1 of 6', prepare: async (p) => { await click(p, 'main button:has-text("I have a Meta app")');
      for (const [k, v] of [['wa-gw-name', 'Northwind Returns'], ['wa-phone_number_id', '100000000000187'], ['wa-business_account_id', '200000000000917'], ['wa-app_id', '300000000000455'], ['wa-access_token', 'EAAG-northwind-demo-token'], ['wa-app_secret', 'northwind-demo-secret']]) await fill(p, `#${k}`, v);
      await rest(p); },
    describe: ['WhatsApp setup wizard step 2: gateway name and the Meta IDs and keys (phone number ID, WABA, app ID, access token, app secret) with where to find each.', 'Secret fields are masked; all values are fictional.'],
    states: SAFE, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
];
