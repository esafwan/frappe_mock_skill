# URY desk launcher screen  `ury-desk-screen-launcher`

The /desk apps screen: the page navbar, then one .desktop-icon tile per add_to_apps_screen app (ERPNext, URY, Huf), each a 54px app-icon in .icon-container over .icon-caption with the title and the Open in Desk subtitle.

**When to use:** The subtitle is drawn for apps whose own UI is not the desk (URY and Huf); ERPNext is desk-native and has none. Frappe HR and Framework are not installed on this bench.

**Slots people usually change:** `ln_logo_huf` (image, e.g. "data:image/png;base64,iVBORw0K"), `ln_logo_ury` (image, e.g. "data:image/png;base64,iVBORw0K"), `ln_logo_erp` (image, e.g. "data:image/svg+xml;base64,PHN2"), `nav_user_name` (text, e.g. "Administrator"), `ln_sub` (text, e.g. "Open in Desk"), `ln_title_erp` (text, e.g. "ERPNext"). All 11 slots are in `slots.json`.

**States:** default (none), hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-launcher"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-desk-screen-launcher --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-overlays.css from `tokens/css/` and the desk icon sprite (inlined in preview).
