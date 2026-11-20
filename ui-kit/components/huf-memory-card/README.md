# Memory card (one learned item: type chip, title, summary, date, importance score, confidence, archive)  `huf-memory-card`

One memory card: Preference chip, "Prefers weekly summaries on Monday", the summary the agent captured, date, "Score: 8/10" and "Conf: 94%", archive button.

**When to use:** Close-up of a single learned item; title, summary and scores are text slots.

**Slots people usually change:** `gap_1_3` (number, e.g. "94"), `leading_relaxed` (text, e.g. "Maya wants the open-ticket sum"), `line_clamp_1` (text, e.g. "Prefers weekly summaries on Mo"), `gap_1_5` (text, e.g. "Dec 31, 2025"), `text_signal_ink` (text, e.g. "Preference"), `font_medium` (text, e.g. "Score:"). All 10 slots are in `slots.json`.

**States:** default (none), focus (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-card"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-card.archive-1`, `huf-memory-card.archive-2`, `huf-memory-card.archive-3`).

**Render:** `node tools/render.mjs huf-memory-card --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory` with fixtures [base, agents, learning].
