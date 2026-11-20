# huf-android-table-artifact

Table artifact (markdown table, horizontally clipped)

Rich message table; wide tables clip at the screen edge (horizontal scroll on device).

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-table-artifact"]`. Slots: `h1`, `h2`, `h3`, `r1`, `r2`, `r3`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
