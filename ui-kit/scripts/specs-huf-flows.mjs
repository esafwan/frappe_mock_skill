// HUF Flows area specs (pre-develop): flow list, builder canvas (reactflow v11), node card, Run agent panel, node rail, run viewer.
// Fixtures: scripts/huf/fixtures/flows.mjs + data/huf/flows.json (fictional "Harbor Goods" WhatsApp order desk), agents list from fixtures/agents.mjs.
// Reactflow draws nodes as absolutely positioned divs in a transformed viewport and edges as one SVG: both are captured as static DOM,
// positions come from the app's own fit-view (no recomputation), so edges, handles and edge labels stay where the app put them.
const FLOW = '/flows/whatsapp-order-desk';
const NODE = (id) => `.react-flow__node[data-id="${id}"]`;
const CANVAS_READY = `${NODE('handoff')} [data-testid="flow-node-title-handoff"]`;
const FIRST_CARD = '[data-testid="flow-list-item-whatsapp-order-desk"]';
// Radix portals (sheet, overlay) live outside #root: move them in so a #root page capture includes them.
const portalsIntoRoot = (page) => page.evaluate(() => { const root = document.getElementById('root'); for (const el of [...document.body.children]) if (el !== root && el.tagName === 'DIV' && !el.hasAttribute('data-sonner-toaster') && el.getBoundingClientRect().width > 0) root.appendChild(el); });
// Static HTML cannot nest <button> in <button> (the parser closes the outer one): turn inner buttons into spans with the same attributes.
const unnestButtons = (page) => page.evaluate(() => { for (const b of [...document.querySelectorAll('button button')]) { const s = document.createElement('span'); for (const a of b.attributes) s.setAttribute(a.name, a.value); s.setAttribute('role', 'button'); s.append(...b.childNodes); b.replaceWith(s); } });
// A component whose height comes from a stretched flex parent: pin its live height so the standalone preview keeps it.
const pinHeight = (sel) => (page) => page.evaluate((q) => { const e = document.querySelector(q); e.style.height = e.getBoundingClientRect().height + 'px'; }, sel);
const blur = (page) => page.evaluate(() => document.activeElement?.blur?.());
const openStep = (id) => async (page) => { await page.click(NODE(id)); await page.waitForSelector('[data-testid="flow-config-sidebar"] >> text=What to tell it'); await page.waitForTimeout(300); await blur(page); await page.mouse.move(0, 0); await unnestButtons(page); };
const openRun = async (page) => { await page.waitForSelector('[data-testid="flow-run-headline"]'); await page.waitForTimeout(400); await blur(page); await portalsIntoRoot(page); };

// Run sheet is modal: never press outside it (that closes it). States stay on the sheet's own controls.
const RUN_STATES = { hover: { target: '[data-testid="flow-run-back"]', description: 'Run history link hovered' }, focus: { target: '[data-testid="flow-run-back"]', description: 'Run history link focused' },
  active: { target: '[data-testid="flow-run-back"]', act: async (p, t) => t.hover({ force: true }), description: 'pointer on Run history (pressing it would leave the run)' } };
const CANVAS_NA = { disabled: 'page-level: no single disabled control', error: 'a failed step is a run state: see huf-flow-run-viewer', loading: 'skeleton flashes < 100 ms with mocked data', empty: 'empty builder ("Choose a trigger") is backlog' };

export const specs = [
  { id: 'huf-flow-list', name: 'Flows list page (sidebar, header with EXPERIMENTAL chip and count, filters, flow cards)', url: '/flows', root: '#root',
    fixtures: ['flows', 'agents'], waitFor: 'text=Harbor Goods - WhatsApp order desk',
    describe: ['Complete Flows screen: two-level sidebar, "Flows" title with EXPERIMENTAL chip and flow count, search + status/category/sort filters and a grid of flow cards (trigger icon, title, Draft/Live/Has problems pill, description, step icons, trigger line, last run, category, Open / Run test / more).', 'Use as the establishing shot of any flows story; zoom into the first card before cutting to the canvas.'],
    targets: { search: 'input[placeholder^="Search"]', 'card-1': FIRST_CARD },
    states: { hover: { target: FIRST_CARD, description: 'card hover: border turns ink' }, focus: { target: 'search' }, active: { target: 'search', description: 'search field pressed' } },
    na: CANVAS_NA },
  { id: 'huf-flow-list-empty', name: 'Flows list page, no flows yet (first-flow coach)', url: '/flows', root: '#root',
    fixtures: ['agents'], waitFor: 'text=No flows',
    describe: ['Flows screen before anything is built: empty state with the first-flow coach and the New flow action.', 'Use as the "before" frame of a build-a-flow story.'],
    targets: { search: 'input[placeholder^="Search"]' }, states: { focus: { target: 'search' }, active: { target: 'search' } },
    na: { ...CANVAS_NA, empty: 'this whole spec is the empty state' } },
  { id: 'huf-flow-canvas', name: 'Flow builder canvas, nothing selected (header, node rail, reactflow graph with branches, minimap, empty settings panel)', url: FLOW, root: '#root',
    fixtures: ['flows', 'agents'], waitFor: CANVAS_READY,
    describe: ['Visual flow builder for "Harbor Goods - WhatsApp order desk": WhatsApp trigger -> Look up their orders -> Asking about an order? (Yes/No) -> Write the reply / Answer from help center -> Check before sending (Approved/Rejected) -> End steps. Header with Saved, undo/redo, Runs, Settings, Run test, Draft and Publish; left node rail; zoom controls and minimap; right panel hint "Select a step or a connection".', 'Edges are the app\'s SVG paths with arrowheads and Yes/No/Approved/Rejected pills; nodes keep the fit-view positions. Use as the establishing shot of the builder.'],
    targets: { 'node-write': NODE('write_reply'), fit: '.react-flow__controls-fitview' },
    states: { hover: { target: NODE('write_reply'), description: 'hover on the Write the reply step' }, focus: { target: NODE('write_reply') }, active: { target: 'fit', description: 'fit-view button pressed (re-fits the same view)' } },
    na: CANVAS_NA },
  { id: 'huf-flow-canvas-step', name: 'Flow builder with the Run agent step selected (purple node, Setup panel with agent picker and data-chip prompt)', url: FLOW, root: '#root',
    fixtures: ['flows', 'agents'], waitFor: CANVAS_READY, prepare: openStep('write_reply'),
    describe: ['Builder with "Write the reply" selected: the node gets the violet selection border and trash button, the right panel shows the Run agent step (Ready, Setup/Test/Settings tabs, Which agent = Order Status Bot, What to tell it with data chips "Sender name · WhatsApp message", "Order no · Look up their orders", "Status · Look up their orders", and the preview "What this will become").', 'Use after huf-flow-canvas to show configuring a step.'],
    targets: { 'tab-test': '[role="tab"]:nth-child(2)' }, states: { hover: { target: 'tab-test' }, focus: { target: 'tab-test' }, active: { target: 'tab-test', act: async (p, t) => t.hover({ force: true }), description: 'tab under the pointer' } },
    na: CANVAS_NA },
  { id: 'huf-flow-node', name: 'Flow node card (Run agent step: icon well, title, ready dot, in/out handles)', url: FLOW, root: '#kit-flow-node > div',
    fixtures: ['flows', 'agents'], waitFor: CANVAS_READY, pad: { l: 4, t: 8, r: 4, b: 8 },
    // The canvas sits at ~76 % zoom (compact level of detail). Zoom in once through the app (full level of detail, >= 80 %), then copy the
    // rendered card (with its handles) into a plain 1:1 holder outside the transformed reactflow viewport, so the preview needs no canvas ancestors.
    prepare: async (page) => { await page.click('.react-flow__controls-zoomin'); await page.waitForSelector('[data-testid="flow-node-write_reply"] [data-lod="full"]');
      await page.evaluate(() => { const h = document.createElement('div'); h.id = 'kit-flow-node'; h.style.cssText = 'position:absolute;left:40px;top:40px;z-index:2147483646;background:transparent';
        h.appendChild(document.querySelector('[data-testid="flow-node-write_reply"]').cloneNode(true)); document.getElementById('root').appendChild(h); }); await page.waitForTimeout(200); },
    describe: ['One builder step card (236 x 100): rounded white card, 28 px icon well with the Run agent glyph, title, green "Ready" status dot, dark connection handles at top and bottom.', 'Compose custom graphs from it or use it for close-ups; change text via slots (node_title); the status dot reads its aria-label.'],
    slotNames: { '[data-testid^="flow-node-title-"]': 'node_title' },
    states: { hover: { description: 'card hover (pointer over the step)' } },
    na: { ...CANVAS_NA, focus: 'selection is a data state: see huf-flow-canvas-step', active: 'pressing a node selects it: see huf-flow-canvas-step' } },
  { id: 'huf-flow-panel-agent', name: 'Run agent step panel (Setup tab: agent picker, prompt with data chips, preview)', url: FLOW, root: '[data-testid="flow-step-panel"]',
    fixtures: ['flows', 'agents'], waitFor: CANVAS_READY, prepare: async (page) => { await openStep('write_reply')(page); await pinHeight('[data-testid="flow-step-panel"]')(page); },
    describe: ['Right-hand step panel of the builder for a Run agent step: header (Write the reply, Run agent, more and close), Ready status strip, Setup/Test/Settings tabs, Which agent picker (Order Status Bot), What to tell it with inline data chips and + Use data, help text and "What this will become" preview.', 'Use for close-ups of configuring a step; swap the agent and prompt text through slots.'],
    targets: { 'tab-test': '[role="tab"]:nth-child(2)' }, states: { hover: { target: 'tab-test' }, focus: { target: 'tab-test' }, active: { target: 'tab-test', act: async (p, t) => t.hover({ force: true }) } },
    na: CANVAS_NA },
  { id: 'huf-flow-node-rail', name: 'Builder node rail (48 px: triggers, agent, condition, tools, data)', url: FLOW, root: ':has(> [data-testid="flow-rail-trigger"])',
    fixtures: ['flows', 'agents'], waitFor: CANVAS_READY, prepare: pinHeight(':has(> [data-testid="flow-rail-trigger"])'),
    describe: ['The thin left rail of the flow builder: icon buttons that open the step palettes (What starts it, Run agent, Condition, Apps and tools, Data).', 'Use for a close-up of adding a step.'],
    states: { hover: { target: '[data-testid="flow-rail-agent"]', act: async (p, t) => t.evaluate((e) => e.classList.add('bg-paper-deep', 'text-ink')), reset: async (p, t) => t.evaluate((e) => e.classList.remove('bg-paper-deep', 'text-ink')), description: 'agent button hovered (the app\'s hover classes; the tooltip is a portal and not part of this component)' },
      focus: { target: '[data-testid="flow-rail-agent"]', act: async (p, t) => t.evaluate((e) => e.classList.add('ring-2', 'ring-signal', 'ring-offset-1', 'ring-offset-paper')), reset: async (p, t) => t.evaluate((e) => e.classList.remove('ring-2', 'ring-signal', 'ring-offset-1', 'ring-offset-paper')), description: 'keyboard focus ring (focus-visible classes)' } },
    na: { ...CANVAS_NA, active: 'pressing a rail button opens a palette dialog (backlog: huf-flow-action-palette)' } },
  { id: 'huf-flow-run-viewer', name: 'Run viewer, finished run (sheet over the canvas: run #42, outcome, step story; canvas shows the taken path)', url: FLOW + '?run=FR-0042', root: '#root',
    fixtures: ['flows', 'agents'], waitFor: '[data-testid="flow-run-details"]', prepare: openRun,
    describe: ['Run #42 of the WhatsApp order desk opened over the canvas: Finished + "Order update sent" pills, "Run finished in 2 min 50 s", and "What happened" step cards (received WhatsApp message with its data, looked up saved data, checked a condition, asked an agent...). Behind the dimmed overlay the canvas shows "Showing this run" and the taken edges in green, untaken faded.', 'Use to show what a flow did for one customer message.'],
    states: RUN_STATES, na: CANVAS_NA },
  { id: 'huf-flow-run-viewer-waiting', name: 'Run viewer, waiting for approval (decision card with Approve / Reject)', url: FLOW + '?run=FR-0043', root: '#root',
    fixtures: ['flows', 'agents'], waitFor: '[data-testid="flow-run-details"]', prepare: openRun,
    describe: ['Run #43 paused at "Check before sending": Waiting for approval pill and headline, "Your decision is needed" card with the approval message, waiting time, green Approve and red Reject buttons, then the steps so far. The canvas behind marks the waiting step.', 'Use for the human-in-the-loop beat of a flow story.'],
    states: RUN_STATES, na: CANVAS_NA },
];
