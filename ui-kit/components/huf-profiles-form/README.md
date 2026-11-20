# Execution profile editor (Warehouse automation)  `huf-profiles-form`

HUF, Execution profile editor for "Warehouse automation": approval mode, filesystem and network policy, allowed modules, resource limits and per-doctype permissions.

**When to use:** Use when explaining guardrails for automated actions.

**Slots people usually change:** `text_steel_9` (text, e.g. "Restricts outbound network req"), `text_steel_8` (text, e.g. "No network access policies exi"), `text_steel_16` (text, e.g. "Capabilities the sandbox broke"), `text_steel_6` (text, e.g. "Determines whether user confir"), `text_steel_10` (text, e.g. "JSON array of module names the"), `font_normal` (text, e.g. "Read only — this capability ma"). All 98 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-profiles-form"`; 45 interactive elements with measured boxes in `measurements.json` (e.g. `huf-profiles-form.button-1`, `huf-profiles-form.link-2`, `huf-profiles-form.link-3`).

**Render:** `node tools/render.mjs huf-profiles-form --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/execution-profiles/Warehouse%20automation` with fixtures [base, decisions].
