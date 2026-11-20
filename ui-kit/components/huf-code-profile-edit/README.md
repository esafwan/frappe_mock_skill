# Execution profile editor (approval mode, filesystem, network policy, modules, limits, broker capabilities)  `huf-code-profile-edit`

Execution profile editor for "Reports with warehouse access": approval mode, filesystem policy, network access policy, allowed Python modules, resource limits and the broker capabilities it may use.

**When to use:** Use to show how safe code execution is configured.

**Slots people usually change:** `text_steel_8` (text, e.g. "Restricts outbound network req"), `text_steel_15` (text, e.g. "Capabilities the sandbox broke"), `text_steel_6` (text, e.g. "Determines whether user confir"), `text_steel_9` (text, e.g. "JSON array of module names the"), `font_normal` (text, e.g. "Read only — this capability ma"), `font_normal_2` (text, e.g. "Read only — this capability ma"). All 114 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-code-profile-edit"`; 51 interactive elements with measured boxes in `measurements.json` (e.g. `huf-code-profile-edit.button-1`, `huf-code-profile-edit.link-2`, `huf-code-profile-edit.link-3`).

**Render:** `node tools/render.mjs huf-code-profile-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/execution-profiles/Reports%20with%20warehouse%20access` with fixtures [base, tools].
