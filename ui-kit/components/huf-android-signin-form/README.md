# Sign-in form (heading + locale, Server/Email/Password fields, Sign in, OR, Use an API key)  `huf-android-signin-form`

Sign-in form (heading + locale, Server/Email/Password fields, Sign in, OR, Use an API key)

**When to use:** Connect screen body. Button state: "disabled" until all fields are filled.

**Slots people usually change:** `server_color` (css, e.g. "var(--ha-secondary)"), `email_color` (css, e.g. "var(--ha-secondary)"), `password_color` (css, e.g. "var(--ha-secondary)"), `hint` (text, e.g. "Enter your server, email, and "), `lead` (text, e.g. "Sign in to your workspace."), `password` (text, e.g. "Password"). All 10 slots are in `slots.json`.

**States:** default (none), ready (props), disabled (slot-preset). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-signin-form"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-signin-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
