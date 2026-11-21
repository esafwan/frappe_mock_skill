# POS dashboard right rail  `pos-dash-panels`

The 340px right column: Floor Load (primary bars per waiter), Open Sessions (gray rows and View all link), Shift Brief (HUF badge) and Recent Notifications (divided list).

**When to use:** Right side of the Dashboard main grid; mirrors to the left in RTL.

**Slots people usually change:** `sb_text` (text, e.g. "AI shift summaries will appear"), `n3_msg` (text, e.g. "Draft sales plan for 2026-11-2"), `n4_msg` (text, e.g. "Today's sales plan is locked f"), `n1_msg` (text, e.g. "A guest has asked for the bill"), `n2_msg` (text, e.g. "Order # 2026-00142 Delayed"), `nt_empty` (text, e.g. "No recent notifications"). All 33 slots are in `slots.json`.

**States:** default (none), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-dash-panels"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-dash-panels --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
