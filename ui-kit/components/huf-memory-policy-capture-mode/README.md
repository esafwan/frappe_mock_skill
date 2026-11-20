# Memory policy detail, Capture tab with the capture mode menu open (Manual / Agent Suggested / Automatic)  `huf-memory-policy-capture-mode`

Capture tab with the Capture mode dropdown open: Manual, Agent Suggested (checked), Automatic.

**When to use:** Use for the "choose how much the agent learns on its own" beat.

**Slots people usually change:** `text_steel_3` (text, e.g. "Optional dedicated agent that "), `block_7` (text, e.g. "Which of Memory Record's Recor"), `text_steel_4` (text, e.g. "New memory records are forced "), `text_steel_5` (text, e.g. "Status assigned to newly captu"), `block_6` (text, e.g. "— same background extraction, "), `block_4` (text, e.g. "— a background job proposes me"). All 108 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-policy-capture-mode"`; 52 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-policy-capture-mode.link-1`, `huf-memory-policy-capture-mode.link-2`, `huf-memory-policy-capture-mode.link-3`).

**Render:** `node tools/render.mjs huf-memory-policy-capture-mode --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory/policies/Support%20Desk%20Learning#capture` with fixtures [base, agents, learning].
