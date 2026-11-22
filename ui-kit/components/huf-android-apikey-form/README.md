# API key sign-in form (Server, API key, API secret, Sign in, OR, Use email and password, help)  `huf-android-apikey-form`

API key sign-in form (Server, API key, API secret, Sign in, OR, Use email and password, help)

**When to use:** Connect screen body in API-key mode (Use an API key). Button state "disabled" until server, key and secret are filled.

**Slots people usually change:** `eye` (html, e.g. "<svg class="ha-ico " viewBox=""), `server_color` (css, e.g. "var(--ha-secondary)"), `key_color` (css, e.g. "var(--ha-secondary)"), `secret_color` (css, e.g. "var(--ha-secondary)"), `hint` (text, e.g. "Enter your server, API key, an"), `lead` (text, e.g. "Sign in to your workspace."). All 13 slots are in `slots.json`.

**States:** default (none), active (props), ready (props), verifying (props), pressed (props), disabled (slot-preset). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-apikey-form"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-apikey-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
