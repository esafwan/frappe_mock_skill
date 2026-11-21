# URY Captain service requests  `ury-captain-service-requests`

Service request bell (48px, amber with a red count badge) and the 320px panel: title, close, rows "Table T1 · Assistance" with Clock meta, optional amber "Acknowledged" pill, Ack and resolve (Check) buttons.

**When to use:** Floating over the captain screens. Request types are Bill and Assistance in the source; the panel polls open requests.

**Slots people usually change:** `row_1` (text, e.g. "Table T1 · Assistance"), `row_3` (text, e.g. "Table T2 · Assistance"), `title` (text, e.g. "Service Requests"), `empty` (text, e.g. "No open requests"), `row_2` (text, e.g. "Table T4 · Bill"), `acknowledged` (text, e.g. "Acknowledged"). All 11 slots are in `slots.json`.

**States:** default (none), collapsed (props), empty-panel (props), empty (props), resolving (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-service-requests"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-service-requests --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
