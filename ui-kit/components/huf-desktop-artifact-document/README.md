# Desktop chat with a markdown document artifact open in the right pane  `huf-desktop-artifact-document`

Chat "Reorder policy for chilled goods" with the right pane showing the markdown document artifact (headings, a table, bullets) and its Export control.

**When to use:** Use for "the agent wrote a document" moments.

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "Yesterday"), `font_semibold_2` (currency, e.g. "$18,400"), `font_semibold_3` (currency, e.g. "$61,000"), `text_steel_soft` (relative-time, e.g. "Today"), `gap_0_5` (number, e.g. "83"), `leading_relaxed_4` (text, e.g. "Chilled lines were short on 14"). All 183 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-artifact-document"`; 57 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-artifact-document.button-1`, `huf-desktop-artifact-document.button-2`, `huf-desktop-artifact-document.button-3`).

**Render:** `node tools/render.mjs huf-desktop-artifact-document --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat/NW-CONV-0003` with fixtures [base].
