# Brief top bar  `ury-brief-topbar`

Brief app top bar: 56px, title 17/600, one-line subtitle 12px muted, 40px circular Call and kebab buttons.

**When to use:** Use at the top of the Brief PWA; the kebab opens the overflow menu. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `tb_title` (text, e.g. "Al Noor Restaurant"), `m_install` (text, e.g. "Add to home screen"), `tb_sub` (text, e.g. "Updated 09:41"), `tb_more` (text, e.g. "More options"), `tb_account` (text, e.g. "Account menu"), `m_appearance` (text, e.g. "Appearance"). All 14 slots are in `slots.json`.

**States:** default (none), menu (props), home (props), home-menu (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-topbar"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-brief-topbar.bar.call`, `ury-brief-topbar.bar.kebab`).

**Render:** `node tools/render.mjs ury-brief-topbar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
