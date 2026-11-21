# Screen: Brief settings  `ury-brief-screen-settings`

Settings sheet: Signed in as row, Appearance, Language for chat and calls and the play-button toggle.

**When to use:** Opened from the account menu. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `h_big` (currency, e.g. "AED 18,420.00"), `v_avg` (currency, e.g. "AED 130.00"), `v_spc` (currency, e.g. "AED 78.00"), `s_who` (text, e.g. "Signed in as owner@example.com"), `s_read` (text, e.g. "Show a play button on replies"), `s_lang` (text, e.g. "Language for chat and calls"). All 29 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-screen-settings"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-brief-screen-settings.topbar.avatar`, `ury-brief-screen-settings.select-theme`, `ury-brief-screen-settings.select-lang`).

**Render:** `node tools/render.mjs ury-brief-screen-settings --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
