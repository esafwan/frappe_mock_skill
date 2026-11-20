# Desktop chat with a chart artifact open in the right pane  `huf-desktop-artifact-chart`

Chat "On-time delivery by supplier" with the right pane open on the Artifacts tab: a Recharts bar chart (on time vs 95% target for six fictional suppliers), its title bar and the Activity / Processes tabs.

**When to use:** The chart is real SVG captured from the app; change values by editing the chart in data/huf/desktop.json and re-capturing.

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "Yesterday"), `text_steel_soft` (relative-time, e.g. "Today"), `font_semibold` (number, e.g. "98.5%"), `font_semibold_2` (number, e.g. "91.2%"), `recharts_cartesian_axis_tick_value_11` (number, e.g. "100"), `recharts_cartesian_axis_tick_value_7` (number, e.g. "85"). All 162 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-artifact-chart"`; 57 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-artifact-chart.button-1`, `huf-desktop-artifact-chart.button-2`, `huf-desktop-artifact-chart.button-3`).

**Render:** `node tools/render.mjs huf-desktop-artifact-chart --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat/NW-CONV-0002` with fixtures [base].
