# Intelligence page, Memories tab, empty ("No memories yet")  `huf-memory-overview-empty`

First-run Memories tab: brain icon, "No memories yet", explanation that facts, preferences and context appear automatically after chatting with a memory-enabled agent, and a Start a Chat button.

**When to use:** Use as the "before" frame of a learning story.

**Slots people usually change:** `max_w_sm` (text, e.g. "Your AI agents haven't learned"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"), `font_semibold` (text, e.g. "No memories yet"), `text_ink` (text, e.g. "Maya Fernandes"), `sr_only` (text, e.g. "Toggle sidebar"). All 56 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-overview-empty"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-overview-empty.link-1`, `huf-memory-overview-empty.link-2`, `huf-memory-overview-empty.link-3`).

**Render:** `node tools/render.mjs huf-memory-overview-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory?demo=empty` with fixtures [base, agents, learning].
