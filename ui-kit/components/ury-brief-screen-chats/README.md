# Screen: Brief chats sheet  `ury-brief-screen-chats`

All questions sheet: grab handle, Close, search field and conversation rows (pending dot, voice glyph, time, kebab).

**When to use:** Opened from See all on Today. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `h_big` (currency, e.g. "AED 18,420.00"), `v_avg` (currency, e.g. "AED 130.00"), `v_spc` (currency, e.g. "AED 78.00"), `r2_p` (text, e.g. "Chicken Mandi and Grilled Hamm"), `r4_p` (text, e.g. "Covers rose 8% over the last 7"), `r3_p` (text, e.g. "You: How is kitchen prep time?"). All 36 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-screen-chats"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-brief-screen-chats.topbar.avatar`).

**Render:** `node tools/render.mjs ury-brief-screen-chats --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
