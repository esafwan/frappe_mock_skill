# Intelligence page, Policies tab (memory policies: agent, capture mode, inject mode, auto-promote to knowledge)  `huf-memory-policies`

Policies tab: search, status filter, New policy, and five policy cards showing Enabled/Disabled, agent, capture mode (Agent Suggested / Automatic / Manual), inject mode and whether memories auto-promote to knowledge.

**When to use:** Use to show that learning is governed per agent; cut to huf-memory-policy-capture.

**Slots people usually change:** `min_h_2_5rem` (text, e.g. "Learns customer-care preferenc"), `min_h_2_5rem_2` (text, e.g. "Keeps shipping and stock decis"), `min_h_2_5rem_3` (text, e.g. "Captures invoice review rules "), `min_h_2_5rem_5` (text, e.g. "Paused while the lead qualifie"), `min_h_2_5rem_4` (text, e.g. "User scope · Relevant Only inj"), `text_steel_51` (text, e.g. "Showing all 5 memory policies"). All 131 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-policies"`; 40 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-policies.link-1`, `huf-memory-policies.link-2`, `huf-memory-policies.link-3`).

**Render:** `node tools/render.mjs huf-memory-policies --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory#policies` with fixtures [base, agents, learning].
