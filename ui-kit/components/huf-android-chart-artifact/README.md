# huf-android-chart-artifact

Chart artifact (bar chart card with Y-axis values and Chart data list)

Native bar chart. Bar heights are px (plot 272 px = 600,000).

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-chart-artifact"]`. Slots: `title`, `yaxis`, `h1`, `h2`, `h3`, `h4`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
