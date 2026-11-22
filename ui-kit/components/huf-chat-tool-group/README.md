# Tool call group, expanded (search_knowledge, list_records, get_record)  `huf-chat-tool-group`

The "Ran N tools" row from an assistant turn, expanded: one line per call with index, green done dot, tool name (mono) and a summary of its result.

**When to use:** Close-up for "the agent looked things up"; tool names and summaries are slots.

**Slots people usually change:** `tool_summary_4` (text, e.g. "{"contact": "Giulia Rinaldi", "), `tool_summary_2` (text, e.g. "{"results": 3, "top": "§4.2 La"), `tool_summary_3` (text, e.g. "{"count": 2, "names": ["PO-202"), `tool_summary_1` (text, e.g. "search_knowledge ×1, list_reco"), `tool_name_1` (text, e.g. "search_knowledge"), `tool_name_2` (text, e.g. "list_records"). All 13 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-tool-group"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-tool-group.trigger`).

**Render:** `node tools/render.mjs huf-chat-tool-group --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0001` with fixtures [base, chat].
