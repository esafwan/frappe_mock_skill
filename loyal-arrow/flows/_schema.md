# Flow format
Each `*.flow.json`: `{id, title, surface, viewport, base, dataset(path under ../data), steps[]}`.
Step: `{n, caption, goto?, action(click|fill|press|wait|scroll|shot), selector, value?, expect?, hold_ms, data_ref?}`.
`selector` uses the real `data-testid` values from the app (`[data-testid="..."]`) or role/text. `value` may reference dataset rows as `{{members[4].mobile}}`.
Desk surface selectors are standard Frappe v16 (`.sidebar-item-container`, `.page-title`, report `.dt-scrollable`) and must be confirmed on a live capture.
Each step with `shot:true` is a keyframe for the mock kit / screen-record pipeline.
