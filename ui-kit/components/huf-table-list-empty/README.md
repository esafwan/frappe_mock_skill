# Tables list, empty (steps, drop target, start chips)  `huf-table-list-empty`

First-run Tables screen: three setup steps, a CSV drop target and starter chips (blank, CSV, paste, describe).

**When to use:** Use for onboarding stories.

**Slots people usually change:** `text_steel_7` (text, e.g. "Drop a CSV or Excel file to ma"), `text_steel_soft_2` (text, e.g. "Import a file, paste, or type."), `text_steel_soft_3` (text, e.g. "Choose what each agent may do."), `text_steel_6` (text, e.g. "Let an agent use it"), `hover_text_ink_2` (text, e.g. "From a CSV or Sheet"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"). All 68 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-list-empty"`; 31 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-list-empty.link-1`, `huf-table-list-empty.link-2`, `huf-table-list-empty.link-3`).

**Render:** `node tools/render.mjs huf-table-list-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data` with fixtures [base, tables-empty].
