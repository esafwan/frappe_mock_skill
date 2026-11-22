# Intelligence page, Memories tab (what agents learned from chats: preference, fact, decision, insight, observation, summary cards)  `huf-memory-overview`

Intelligence screen (EXPERIMENTAL) on the Memories tab: eight memory cards the agents captured from Maya's chats, each with a type chip (Preference, Fact, Decision, Insight, Observation, Summary), title, summary, date, importance score and confidence.

**When to use:** Establishing shot for "your agents learn from every conversation"; zoom into huf-memory-card or cut to the policy that controls capture.

**Slots people usually change:** `gap_1_3` (number, e.g. "94"), `gap_1_7` (number, e.g. "91"), `gap_1_11` (number, e.g. "88"), `gap_1_15` (number, e.g. "86"), `gap_1_19` (number, e.g. "79"), `gap_1_23` (number, e.g. "97"). All 132 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-overview"`; 51 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-overview.link-1`, `huf-memory-overview.link-2`, `huf-memory-overview.link-3`).

**Render:** `node tools/render.mjs huf-memory-overview --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory` with fixtures [base, agents, learning].
