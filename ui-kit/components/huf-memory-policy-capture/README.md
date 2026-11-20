# Memory policy detail, Capture tab (Agent Suggested capture, learning agent, approval required, Draft default, allowed record types)  `huf-memory-policy-capture`

Policy "Support Desk Learning" on the Capture tab: capture mode Agent Suggested (a background job proposes memories after each chat), learning agent "Memory Curator", Approval required on (new memories land as Draft until approved), default status Draft, allowed types Fact, Preference, Decision +1.

**When to use:** The "how agents learn from chats, with a human in the loop" shot.

**Slots people usually change:** `text_steel_3` (text, e.g. "Optional dedicated agent that "), `block_7` (text, e.g. "Which of Memory Record's Recor"), `text_steel_4` (text, e.g. "New memory records are forced "), `text_steel_5` (text, e.g. "Status assigned to newly captu"), `block_6` (text, e.g. "— same background extraction, "), `block_4` (text, e.g. "— a background job proposes me"). All 105 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-policy-capture"`; 48 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-policy-capture.link-1`, `huf-memory-policy-capture.link-2`, `huf-memory-policy-capture.link-3`).

**Render:** `node tools/render.mjs huf-memory-policy-capture --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory/policies/Support%20Desk%20Learning#capture` with fixtures [base, agents, learning].
