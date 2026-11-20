// Learning area specs (pre-develop): the Intelligence page (memories agents learned from chats, memory policies),
// a memory policy's Capture tab (learning agent, approval) and its knowledge projection (promote to knowledge), and Skills.
// Fixtures: scripts/huf/fixtures/learning.mjs + data/huf/learning.json. Data variants are separate ids; hover/focus are states.
// Not in the app (pre-develop af81d82 / c4d54cf build): a review queue of Draft memories with approve / graduate actions.
// The Memories tab lists Active records only and offers Archive; promotion to knowledge is a policy setting (auto_promote_to_knowledge).
const POLICY = '/memory/policies/' + encodeURIComponent('Support Desk Learning');
const FX = ['agents', 'learning'];
const FIRST_MEMORY = 'main .grid > div:first-child';
const blur = (page) => page.evaluate(() => document.activeElement?.blur?.());
// Radix portals (select listbox) live outside #root: move them in so a #root page capture includes them.
const portalsIntoRoot = (page) => page.evaluate(() => { const root = document.getElementById('root'); for (const el of [...document.body.children]) if (el !== root && el.tagName === 'DIV' && !el.hasAttribute('data-sonner-toaster') && el.getBoundingClientRect().width > 0) root.appendChild(el); });

// Static HTML cannot nest <button> in <button> (the combobox "open" arrow sits inside the trigger): turn inner buttons into spans.
const unnestButtons = (page) => page.evaluate(() => { for (const b of [...document.querySelectorAll('button button')]) { const s = document.createElement('span'); for (const a of b.attributes) s.setAttribute(a.name, a.value); s.setAttribute('role', 'button'); s.append(...b.childNodes); b.replaceWith(s); } });
const settleForm = async (page) => { await blur(page); await unnestButtons(page); };

const pageNa = { disabled: 'page-level: no single disabled control', error: 'page-level errors are toasts', loading: 'spinner flashes < 100 ms with mocked data' };
const formNa = { ...pageNa, empty: 'a new policy (/memory/policies/new) is backlog: huf-memory-policy-new' };

export const specs = [
  // Intelligence: memories learned from chats
  { id: 'huf-memory-overview', name: 'Intelligence page, Memories tab (what agents learned from chats: preference, fact, decision, insight, observation, summary cards)', url: '/memory', root: '#root',
    fixtures: FX, waitFor: 'text=Prefers weekly summaries on Monday',
    describe: ['Intelligence screen (EXPERIMENTAL) on the Memories tab: eight memory cards the agents captured from Maya\'s chats, each with a type chip (Preference, Fact, Decision, Insight, Observation, Summary), title, summary, date, importance score and confidence.', 'Establishing shot for "your agents learn from every conversation"; zoom into huf-memory-card or cut to the policy that controls capture.'],
    targets: { policies: '[role="tab"]:nth-child(2)' },
    states: { hover: { target: FIRST_MEMORY, description: 'hover on the "Prefers weekly summaries on Monday" card (shadow)' }, focus: { target: 'policies', description: 'Policies tab focused' } },
    na: { ...pageNa, empty: 'capture huf-memory-overview-empty' } },
  { id: 'huf-memory-overview-empty', name: 'Intelligence page, Memories tab, empty ("No memories yet")', url: '/memory?demo=empty', root: '#root',
    fixtures: FX, waitFor: 'text=No memories yet',
    describe: ['First-run Memories tab: brain icon, "No memories yet", explanation that facts, preferences and context appear automatically after chatting with a memory-enabled agent, and a Start a Chat button.', 'Use as the "before" frame of a learning story.'],
    targets: { cta: 'main button.gap-2' },
    states: { hover: { target: 'cta' }, focus: { target: 'cta' } }, na: { ...pageNa, empty: 'this whole spec is the empty state' } },
  { id: 'huf-memory-card', name: 'Memory card (one learned item: type chip, title, summary, date, importance score, confidence, archive)', url: '/memory', root: FIRST_MEMORY,
    fixtures: FX, waitFor: 'text=Prefers weekly summaries on Monday', pad: { l: 24, t: 24, r: 24, b: 24 },
    describe: ['One memory card: Preference chip, "Prefers weekly summaries on Monday", the summary the agent captured, date, "Score: 8/10" and "Conf: 94%", archive button.', 'Close-up of a single learned item; title, summary and scores are text slots.'],
    targets: { archive: 'button' },
    states: { hover: { target: FIRST_MEMORY, description: 'card hover (raised shadow)' }, focus: { target: 'archive', description: 'archive button focused' },
      active: { target: FIRST_MEMORY, act: async (p, t) => t.hover(), description: 'pointer on the card (pressing archive would remove it)' } },
    na: { ...pageNa, empty: 'see huf-memory-overview-empty' } },

  // Policies
  { id: 'huf-memory-policies', name: 'Intelligence page, Policies tab (memory policies: agent, capture mode, inject mode, auto-promote to knowledge)', url: '/memory#policies', root: '#root',
    fixtures: FX, waitFor: 'text=Support Desk Learning',
    describe: ['Policies tab: search, status filter, New policy, and five policy cards showing Enabled/Disabled, agent, capture mode (Agent Suggested / Automatic / Manual), inject mode and whether memories auto-promote to knowledge.', 'Use to show that learning is governed per agent; cut to huf-memory-policy-capture.'],
    targets: { search: 'input[placeholder^="Search memory policies"]' },
    states: { hover: { target: 'main .grid > div:first-child', description: 'hover on the "Support Desk Learning" card' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'not captured: "No memory policies" create state (backlog huf-memory-policies-empty)' } },
  { id: 'huf-memory-policy-capture', name: 'Memory policy detail, Capture tab (Agent Suggested capture, learning agent, approval required, Draft default, allowed record types)', url: POLICY + '#capture', root: '#root',
    fixtures: FX, waitFor: 'text=Memory Curator', prepare: settleForm,
    describe: ['Policy "Support Desk Learning" on the Capture tab: capture mode Agent Suggested (a background job proposes memories after each chat), learning agent "Memory Curator", Approval required on (new memories land as Draft until approved), default status Draft, allowed types Fact, Preference, Decision +1.', 'The "how agents learn from chats, with a human in the loop" shot.'],
    targets: { mode: 'button[role="combobox"]' },
    states: { hover: { target: 'button[role="switch"]', description: 'hover on the Approval required switch' }, focus: { target: 'mode', description: 'capture mode select focused' },
      active: { target: 'button[role="switch"]', act: async (p, t) => t.hover(), description: 'pointer on Approval required (clicking would toggle it)' } },
    na: formNa },
  { id: 'huf-memory-policy-capture-mode', name: 'Memory policy detail, Capture tab with the capture mode menu open (Manual / Agent Suggested / Automatic)', url: POLICY + '#capture', root: '#root',
    fixtures: FX, waitFor: 'text=Memory Curator',
    prepare: async (page) => { await page.click('button[role="combobox"]'); await page.waitForSelector('[role="listbox"]'); await page.waitForTimeout(300); await page.mouse.move(0, 0); await unnestButtons(page); await portalsIntoRoot(page); },
    describe: ['Capture tab with the Capture mode dropdown open: Manual, Agent Suggested (checked), Automatic.', 'Use for the "choose how much the agent learns on its own" beat.'],
    states: { hover: { target: '[role="option"]:nth-child(3)', description: 'hover on "Automatic"' } },
    na: { ...formNa, focus: 'focus stays on the open listbox (same as default)', active: 'pressing an option closes the menu' } },
  { id: 'huf-memory-policy-promote', name: 'Memory policy, Knowledge projection card (auto promote to knowledge: target knowledge source, min confidence, min importance)', url: POLICY + '#guardrails', root: '[role="tabpanel"] .space-y-6 > div:nth-child(2)',
    fixtures: FX, waitFor: 'text=Knowledge projection', pad: { l: 32, t: 32, r: 32, b: 32 },
    // The card is the last thing in the page's scroll area (24 px bottom padding): give it room for the 32 px capture pad and scroll it fully into view.
    prepare: async (page) => { await page.evaluate(() => { const sc = document.querySelector('[role="tabpanel"]').closest('.overflow-auto'); sc.firstElementChild.style.paddingBottom = '96px'; sc.scrollTop = sc.scrollHeight; }); await page.waitForTimeout(200); await settleForm(page); },
    describe: ['Guardrails tab, Knowledge projection card: "Auto promote to knowledge" on, knowledge source "Northwind Support Handbook", min confidence 0.85 and min importance 0.7: learned memories that clear both thresholds graduate into a permanent knowledge source.', 'The "graduate what agents learn into shared knowledge" shot; pair with huf-knowledge-source.'],
    targets: { confidence: 'input[type="number"]' },
    states: { hover: { target: 'button[role="switch"]', description: 'hover on the auto-promote switch' }, focus: { target: 'confidence', description: 'Min confidence field focused' },
      active: { target: 'confidence', description: 'mouse down in Min confidence' } },
    na: { ...formNa, empty: 'auto promote off hides the source and thresholds (backlog huf-memory-policy-promote-off)' } },

  // Skills
  { id: 'huf-skills-list', name: 'Skills page (skill cards: status Active / Draft / Error, source Local / Git / Common Destination / App Provided, version, updated)', url: '/skills', root: '#root',
    fixtures: FX, waitFor: 'text=Refund approvals',
    describe: ['Skills screen (EXPERIMENTAL): search, status and source filters, New skill, and six skill cards with status dot, description, source, version and relative update time.', 'Use to show reusable skills agents can be given.'],
    targets: { search: 'input[placeholder^="Search skills"]' },
    states: { hover: { target: 'main .grid > div:first-child', description: 'hover on the "Refund approvals" card' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'not captured: "No skills" create state (backlog huf-skills-empty)' } },
];
