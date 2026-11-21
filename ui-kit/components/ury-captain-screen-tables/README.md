# URY Captain screen: Tables  `ury-captain-screen-tables`

Captain "Tables" home screen: sticky white header (Tables 18/700, ghost Refresh, room tab buttons h36), gray-50 body with a 2-column grid (gap 12) of table cards in free, mine, occupied (merged), billed and attention states.

**When to use:** First screen after Captain sign-in on a phone (390x844). Tapping a card opens the Order screen. Empty (Square icon) and error (AlertTriangle) replace the grid. Free / Mine / Billed and the room names are hard-coded English in the source; their Arabic is a translated UI label (tables.available, captain.billed_locked).

**Slots people usually change:** `t5_total` (currency, e.g. "AED 210.00"), `t7_total` (currency, e.g. "AED 132.25"), `t2_total` (currency, e.g. "AED 54.00"), `t3_total` (currency, e.g. "AED 86.50"), `t4_total` (currency, e.g. "AED 86.50"), `t8_total` (currency, e.g. "AED 96.75"). All 58 slots are in `slots.json`.

**States:** default (none), empty (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-screen-tables"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-screen-tables --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css, ury-v16/components/captain-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
