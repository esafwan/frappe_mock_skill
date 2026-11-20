# huf-android-agent-switcher-sheet

Switch agent bottom sheet

Modal sheet listing agents; the current one shows a check.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-agent-switcher-sheet"]`. Slots: `current`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
