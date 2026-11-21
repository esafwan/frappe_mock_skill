# URY admin quick actions  `ury-admin-quick-actions`

Quick Operations & Setup (QuickActions.tsx): header row with a bottom border and "Fast action shortcuts", then six cards (xl:grid-cols-6, gap 16): Open POS Terminal (solid primary button) and five outline "+ Add" shortcuts. Card rounded-[9px] border-hair p-[14px_16px]; 40px primary-50 icon tile; title 14/700; description 12px text-tertiary clamped to two lines. Arabic comes from ury/translations/ar.csv; payment-mode names (Cash, Card, Online, Wallet), the "Wallet" and sample customer, menu-item and invoice names, "POS", the action button captions and the toast have no ar.csv entry and are translated here (the toast text is an English literal in the source and stays English).

**When to use:** Shown in a card or page with p-6; the header uses -mx-6 -mt-6 to run edge to edge.

**Slots people usually change:** `qa_d4` (text, e.g. "Configure multi-outlet restaur"), `qa_d3` (text, e.g. "Set up AC Hall, Terrace, VIP, "), `qa_d0` (text, e.g. "Launch billing counter for act"), `qa_d5` (text, e.g. "Grant cashier, captain, or man"), `qa_d2` (text, e.g. "Configure new dining table lay"), `qa_d1` (text, e.g. "Create new dishes, pricing, or"). All 22 slots are in `slots.json`.

**States:** default (none), hover (props), toast (props), card-hover (props), button-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-quick-actions"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-quick-actions.btn-0`, `ury-admin-quick-actions.btn-1`, `ury-admin-quick-actions.btn-2`).

**Render:** `node tools/render.mjs ury-admin-quick-actions --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
