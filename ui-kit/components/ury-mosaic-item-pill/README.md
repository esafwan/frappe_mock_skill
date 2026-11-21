# Mosaic Item Status Pill  `ury-mosaic-item-pill`

Per-item KOT status badge: px6 py2 r4, 12/600, 1px border; default shows the four states side by side.

**When to use:** Beside each KOT item quantity; state progresses Queued, Preparing, Ready, Served. Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `dup_note` (text, e.g. "Duplicate KOT ( CHECK WITH CAP"), `disp_done` (text, e.g. "Disposition: Returned to Stock"), `kot_comment` (text, e.g. "No onions please"), `item_1` (text, e.g. "Chicken Biryani"), `item_3` (text, e.g. "Fresh Lime Soda"), `return_label` (text, e.g. "Return to Stock"). All 32 slots are in `slots.json`.

**States:** default (none), queued (props), preparing (props), ready (props), served (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-item-pill"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-mosaic-item-pill --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
