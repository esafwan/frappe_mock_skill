# Memory policy, Knowledge projection card (auto promote to knowledge: target knowledge source, min confidence, min importance)  `huf-memory-policy-promote`

Guardrails tab, Knowledge projection card: "Auto promote to knowledge" on, knowledge source "Northwind Support Handbook", min confidence 0.85 and min importance 0.7: learned memories that clear both thresholds graduate into a permanent knowledge source.

**When to use:** The "graduate what agents learn into shared knowledge" shot; pair with huf-knowledge-source.

**Slots people usually change:** `text_steel` (text, e.g. "Automatically copies memory re"), `text_steel_3` (text, e.g. "Minimum confidence score (0-1)"), `text_steel_4` (text, e.g. "Minimum importance score (0-1)"), `text_steel_2` (text, e.g. "Required when Auto Promote is "), `text_muted_foreground` (text, e.g. "Optionally promote high-confid"), `text_left` (text, e.g. "Northwind Support Handbook"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-memory-policy-promote"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-memory-policy-promote.button-1`, `huf-memory-policy-promote.input-2`, `huf-memory-policy-promote.button-3`).

**Render:** `node tools/render.mjs huf-memory-policy-promote --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/memory/policies/Support%20Desk%20Learning#guardrails` with fixtures [base, agents, learning].
