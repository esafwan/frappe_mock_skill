# Brief feed card  `ury-brief-feed-card`

Feed card (.fcard): 24px radius card with title, sub line, chart, facts and Ask about this / Dashboard actions.

**When to use:** Use for each story in Today’s story. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `f_totalv` (currency, e.g. "AED 18,420.00"), `p1` (currency, e.g. "AED 4,280.00"), `p2` (currency, e.g. "AED 3,150.00"), `p3` (currency, e.g. "AED 2,760.00"), `v_avg` (currency, e.g. "AED 130.00"), `q1` (currency, e.g. "AED 120.00"). All 44 slots are in `slots.json`.

**States:** default (none), number-cards (props), top-sellers (props), slowest-sellers (props), partial (props), unavailable (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-feed-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-brief-feed-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
