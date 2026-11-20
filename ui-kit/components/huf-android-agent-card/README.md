# huf-android-agent-card

Agent card (name, description, model; selected state with check)

Agents tab list item. sel_class "sel" = currently selected agent; disabled agents render dimmed.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-agent-card"]`. Slots: `name`, `description`, `model`, `sel_class`, `check`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
