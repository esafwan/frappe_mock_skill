# huf-android-signin-form

Sign-in form (heading + locale, Server/Email/Password fields, Sign in, OR, Use an API key)

Connect screen body. Button state: "disabled" until all fields are filled.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-signin-form"]`. Slots: `lead`, `hint`, `locale`, `btn_state`, `server`, `email`, `password`, `server_color`, `email_color`, `password_color`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
