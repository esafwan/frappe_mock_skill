# Agent access tab (permission matrix, what the agent sees, recent calls)  `huf-table-agent-access`

Orders, Agents tab: a Read/Create/Edit/Delete matrix per agent, an Add an agent combobox, the tool signatures agents get and recent calls.

**When to use:** Use for stories about controlling what an agent may do with a table.

**Slots people usually change:** `md_block_2` (date, e.g. "2026-01-01 08:52:00"), `md_block_4` (date, e.g. "2026-01-01 08:20:00"), `md_block_6` (date, e.g. "2025-12-31 18:20:00"), `md_block_8` (date, e.g. "2025-12-31 17:05:00"), `text_steel_9` (text, e.g. "Tools follow your fields. Afte"), `text_steel_8` (text, e.g. "Agents still run under the sig"). All 235 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-agent-access"`; 53 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-agent-access.link-1`, `huf-table-agent-access.link-2`, `huf-table-agent-access.link-3`).

**Render:** `node tools/render.mjs huf-table-agent-access --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders?tab=agents` with fixtures [base, tables].
