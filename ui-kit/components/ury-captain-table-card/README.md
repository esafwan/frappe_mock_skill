# URY Captain table card  `ury-captain-table-card`

Captain "Tables" home card: table name, status badge (Free / Mine / owner name / Billed), owner row (Billed only: the other states already show the owner name in the badge), elapsed time and bill total, seats. Free = emerald, Mine = sky, Occupied by another captain = amber, Billed = slate with a Lock, Merged adds a "+ T2, T3" line. The attention-timer variant is the newer frontend/ copy (AlertTriangle, destructive tint, 4px inline-start border).

**When to use:** Captain tables grid (2 columns, 177px cards at 390px). Tap target only; no cashier chrome. Labels Free/Mine/Billed are hard-coded English in the source; the Arabic labels are translated UI words (tables.available, captain.billed_locked).

**Slots people usually change:** `total` (currency, e.g. "AED 86.50"), `status` (text, e.g. "Rashid K."), `owner_name` (text, e.g. "Rashid K."), `merge_list` (text, e.g. "T2, T3"), `elapsed` (text, e.g. "45m"), `table_name` (text, e.g. "T1"). All 7 slots are in `slots.json`.

**States:** default (none), free (props), mine (props), occupied (props), billed (props), merged (props), attention-newer (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-table-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-table-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
