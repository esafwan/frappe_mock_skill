# huf-android-top-app-bar

Top app bar (menu, title, subtitle, optional project line, overflow)

Chat header. variant "two" (title+subtitle) or "three" (adds the teal "Project: …" line).

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-top-app-bar"]`. Slots: `variant`, `title`, `subtitle`, `project_line`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
