// Procedures + Automations (HUF pre-develop). Fixtures: scripts/huf/fixtures/procedures.mjs + data/huf/procedures.json (fictional Northwind Trading).
const FX = ['agents', 'procedures'];
const na = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts' };
const settle = (p, ms = 350) => p.waitForTimeout(ms);
const rest = async (p) => { await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(0, 0); await settle(p); };
const ROW = 'main tbody tr:nth-child(2)';
export const specs = [
  { id: 'huf-procedures-list', name: 'Procedures list (name, tier, status, version, source flow, updated)', url: '/procedures', root: '#root', fixtures: FX,
    waitFor: 'text=Look up an order refund', prepare: rest,
    describe: ['Procedures screen: saved agent step sequences in a table with tier badge (Compiled / System / Draft), status, version, source flow and last update; Status and Tier filters above.', 'Establishing shot for "turn a chat into a repeatable procedure" stories.'],
    states: { hover: { target: ROW, description: 'row hover (bg-paper-deep)' } }, na: { ...na, focus: 'no focusable control worth capturing', active: 'no pressed variant', empty: 'captured as huf-procedures-list-empty' },
    slotNames: { 'main tbody tr:first-child td:first-child': 'procedure_name' } },
  { id: 'huf-procedures-list-empty', name: 'Procedures list, empty state', url: '/procedures?demo=empty', root: '#root', fixtures: FX,
    waitFor: 'text=No procedures yet', prepare: rest,
    describe: ['Procedures screen with no procedures: "No procedures yet" card explaining how to save a chat sequence as a Procedure.', 'Use as the "before" frame.'],
    states: {}, na: { ...na, hover: 'see huf-procedures-list', focus: 'see huf-procedures-list', active: 'see huf-procedures-list', empty: 'this id is the empty state' } },
  { id: 'huf-procedures-detail', name: 'Procedure detail, read-only active procedure (header, validation status, definition, version history)', url: '/procedures/AP-0007', root: '#root', fixtures: FX,
    waitFor: 'text=Version history', prepare: rest,
    describe: ['Procedure detail: name with Compiled / Active badges, plain-language explainer, Test button, id / version / fingerprint / read-only facts, "Fingerprinted - passed validation", the compiled step graph and earlier versions.', 'Read-only procedures need no approval card.'],
    states: { hover: { target: 'main .flex-row > button', description: 'Test button hover' } }, na: { ...na, focus: 'see hover', active: 'no pressed variant', empty: 'no empty state' },
    slotNames: { 'main .font-semibold': 'procedure_name' } },
  { id: 'huf-procedures-detail-approval', name: 'Procedure detail, write procedure pending review, Test result shown', url: '/procedures/AP-0009', root: '#root', fixtures: FX,
    waitFor: 'text=Approval',
    prepare: async (p) => { await p.locator('main button:has-text("Test")').first().click(); await p.waitForSelector('text=Validation harness result'); await rest(p); },
    describe: ['Procedure detail for a write procedure (Place a supplier restock order): Approval card with Pending Review badge and Request Review / Approve / Reject, then the validation harness result (2 of 3 runs passed, reasons for not promoting).', 'Shows the safety gate before an agent may change real data.'],
    states: {}, na: { ...na, hover: 'see huf-procedures-detail', focus: 'see huf-procedures-detail', active: 'see huf-procedures-detail', empty: 'no empty state' } },

  { id: 'huf-automations-list', name: 'Automations list (cards: status, trigger, agent, last run)', url: '/automations', root: '#root', fixtures: FX,
    waitFor: 'text=Monday sales digest', prepare: rest,
    describe: ['Automations screen: agent automations as cards with status badge (Active, Paused, Error, Draft), trigger types (Schedule, Doc Event, Webhook, App Event, Manual), agent, last run, Open / Run now actions; search, status filter and New automation button.', 'Establishing shot for scheduled and event-driven agent stories.'],
    targets: { search: 'input[placeholder^="Search"]' }, states: { hover: { target: 'main .grid > div:nth-child(2)', description: 'card hover' }, focus: { target: 'search' } }, na: { ...na, active: 'no pressed variant', empty: 'captured as huf-automations-list-empty' } },
  { id: 'huf-automations-list-empty', name: 'Automations list, empty state', url: '/automations?demo=empty', root: '#root', fixtures: FX,
    waitFor: 'text=No automations', prepare: rest,
    describe: ['Automations screen with none: "An automation runs an Agent automatically, outside a normal chat" with a New automation action.', 'Use as the "before" frame.'],
    states: {}, na: { ...na, hover: 'see huf-automations-list', focus: 'see huf-automations-list', active: 'see huf-automations-list', empty: 'this id is the empty state' } },
  { id: 'huf-automations-editor', name: 'Automation editor, General tab (name, agent, status)', url: '/automations/AUT-0001', root: '#root', fixtures: FX,
    waitFor: 'text=Monday sales digest', prepare: rest,
    describe: ['Automation editor, General tab: name, description, agent, project and status controls with Cancel / Save, tabs General, Task, Triggers, Execution, History.', 'Full 1440x900 page.'],
    states: {}, na: { ...na, hover: 'no meaningful hover at page level', focus: 'no meaningful focus', active: 'no pressed variant', empty: 'no empty state' } },
  { id: 'huf-automations-editor-triggers', name: 'Automation editor, Triggers tab (weekly schedule)', url: '/automations/AUT-0001', root: '#root', fixtures: FX,
    waitFor: 'text=Monday sales digest',
    prepare: async (p) => { await p.locator('[role="tab"]:has-text("Trigger")').first().click(); await settle(p); await rest(p); },
    describe: ['Automation editor, Triggers tab: the weekly schedule trigger with enabled switch, execution mode, interval and repeat count, plus Add trigger.', 'Shows how an agent is put on a schedule.'],
    states: {}, na: { ...na, hover: 'see huf-automations-editor', focus: 'see huf-automations-editor', active: 'see huf-automations-editor', empty: 'no empty state' } },
];
