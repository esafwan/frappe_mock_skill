# POS footer navigation  `pos-footer-nav`

The bottom rail with seven route tabs; the active tab shows a dark icon chip.

**When to use:** Use below every POS page; Reservations appears only when the branch enables it.

**Slots people usually change:** `nav_reservations` (text, e.g. "Reservations"), `nav_dashboard` (text, e.g. "Dashboard"), `nav_sessions` (text, e.g. "Sessions"), `nav_settings` (text, e.g. "Settings"), `nav_tables` (text, e.g. "Tables"), `nav_orders` (text, e.g. "Orders"). All 7 slots are in `slots.json`.

**States:** default (none), active-dashboard (props), active-pos (props), active-tables (props), active-reservations (props), active-orders (props), active-sessions (props), active-settings (props), no-reservations (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-footer-nav"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `pos-footer-nav.dashboard`, `pos-footer-nav.active`, `pos-footer-nav.tables`).

**Render:** `node tools/render.mjs pos-footer-nav --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
