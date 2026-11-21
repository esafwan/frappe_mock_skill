# Mosaic KOT Ticket  `ury-mosaic-kot-ticket`

Kitchen order ticket: p12 r8 card, inner width 256, table/takeaway header, elapsed timer 24/32 mono (ltr), items at 12.5/600 with status pill and mono qty.

**When to use:** Mosaic KOT board (masonry grid). Colour by type: dine-in panel, takeaway blue, modified amber, cancelled red. Timer and qty stay ltr in Arabic. The source sets an inline border-color of --hair2 on every card that overrides the colour class border; this mock follows the class list (--ac-b, --am-b, --rd-b). Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `dup_note` (text, e.g. "Duplicate KOT ( CHECK WITH CAP"), `disp_done` (text, e.g. "Disposition: Returned to Stock"), `kot_comment` (text, e.g. "No onions please"), `item_1` (text, e.g. "Chicken Biryani"), `item_3` (text, e.g. "Fresh Lime Soda"), `return_label` (text, e.g. "Return to Stock"). All 32 slots are in `slots.json`.

**States:** default (none), dine-in (props), takeaway (props), modified (props), cancelled (props), partially-cancelled (props), disposition-resolved (props), duplicate (props), aggregator (props), struck-item (props), overdue (props), comments (props), flip-serve (props), flip-confirm (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-kot-ticket"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-mosaic-kot-ticket --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
