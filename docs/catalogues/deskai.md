# DeskAI: feature catalogue

DeskAI is a floating chat assistant embedded in the logged-in Frappe Desk. It is an app (`deskai`) that needs the `huf` app. Source: deskai repo, ref main. Everything here is read from code.

## Contents
1. Chat window
2. Pointing at things (context picker)
3. What the assistant can do (tools)
4. Safety and error handling
5. Admin settings
6. Setup
7. Screens for mocks
8. Planned, not yet built
9. Gaps a writer should not claim

## 1. Chat window
- **Floating chat bubble**: a button on every Desk page opens the assistant, so help is one click away.
- **Three layouts**: bubble (small popup), dock (side panel that pushes the page and can collapse to a thin rail), and focus (large centred view with the greeting "What do you want to do?"). The choice is remembered per browser.
- **Recent chats menu**: the title in the header opens a list of recent conversations to switch to, plus a "New chat" entry, so work can be resumed.
- **New chat button**: starts a fresh conversation.
- **Conversation reload**: past messages load back when you reopen a conversation.
- **Live step lines**: each action the assistant takes shows as a short status line (ok or error), with links to documents it touched, so you can see what it did.
- **Plan checklist**: for tasks with two or more steps, a live to-do list shows pending, in progress and done steps, so you can follow along.
- **Working indicator**: a typing animation and a "working (step N of 8)" line show progress.
- **Stop button**: halts the assistant before its next step.
- **Continue button**: after the 8-step limit, one click lets it carry on.
- **Automatic multi-step loop**: the assistant reports each action result back to itself and keeps going without you re-prompting, up to 8 steps per request.
- **Badge counter**: the bubble and rail show how many attached items are waiting (9+ cap).
- **Keyboard**: Enter to send, Esc to leave picker mode or close the bubble.

## 2. Pointing at things (context picker)
- **Alt+click or Cmd+click to attach**: point at any field, list row, report cell or other element and it becomes part of your message, so you can say "this field" and be understood.
- **Picker mode**: a crosshair button in the header highlights elements on hover and attaches on click. A first-use hint appears once.
- **Attachment chips**: attached items show as removable chips above the input and stay visible on sent messages.
- **Field details captured**: the form, record, field, current value and whether it is required, read-only or hidden. Password values are masked.
- **Child table rows**: pointing inside a table row captures the row too.

## 3. What the assistant can do (tools)
All tools run in your browser under your own login and permissions. There are 26 in the code.

Navigation and reading
- **Navigate**: opens lists, new forms or existing records (with filters or default values).
- **Read current screen**: route, record, live form values and page title.
- **Read session info**: who you are, your roles, defaults and system settings.
- **Read field layout**: all fields of a DocType (type, required, hidden, options) plus a permissions summary.
- **Read documents**: fetch a full record, a filtered list, or a single field value.

Forms
- **Fill form**: sets fields and table rows on the open form without saving.
- **Save form**, **Reload form**: save or refresh from the database.
- **Click a button**: presses the primary action or any button by its label.

Changing data
- **Create document**, **Update one field**, **Delete document** (the assistant is told to ask you first).
- **Bulk update**: set the same field on many records at once.
- **Rename record**: change a record ID, with optional merge into another.
- **Workflow action**: apply a workflow step such as Approve.
- **Add comment**: write on a record's timeline.
- **Call any whitelisted method**: run a server method with arguments, for things the other tools do not cover.

Output and prompts
- **Open report**: goes to a report with filters applied, so figures come from the report rather than guesswork.
- **Open print view**: opens a record's print view, optionally with a chosen print format.
- **Show message**: popup message.
- **Ask yes or cancel**: confirmation prompt to you.
- **Write plan**: updates the plan checklist.

Dialogs
- **List open dialogs**, **Close dialog**: inspect and dismiss popups.

## 4. Safety and error handling
- **Your permissions only**: the assistant acts as you, in your session, so it cannot do more than you can.
- **Error popups captured**: Frappe error and message dialogs are read and passed back to the assistant, so it knows a save failed and can fix and retry.
- **Auto-close of error popups**: while the assistant is running, error dialogs show a 5 second countdown and close so they do not block it. Clicking inside cancels the close. Nothing is auto-closed when the assistant is idle.
- **Session token recovery**: if the security token goes stale during a long run, the widget fetches a fresh one and retries once.
- **Step cap**: at most 8 automatic steps, and 2 tool rounds per model turn, to limit runaway work and delay.

## 5. Admin settings
- **DeskAI Settings** (single page, System Manager only): choose the default agent.
- **Enabled tools list**: restrict which tools the assistant has. Empty means all tools.
- **Enabled tools help text** shown on the settings page.

## 6. Setup
- **Auto-seeded assistant**: on migrate, the app creates the tool library, an agent named "Desk Assistant" (low randomness, chat enabled) and sets it as default.
- **Fallback AI provider**: if none is configured, a placeholder provider is created. A real one must be set for useful answers.
- **Conversation helpers (server)**: start, reuse, list and read conversations, scoped to the caller's session.

## 7. Screens for mocks
No standalone screens: everything overlays existing Desk pages (any route) for logged-in users.

**Chat window, bubble mode** (any Desk route)
- Round toggle button bottom corner with attachment count badge.
- Header: title with recent-chats caret, new chat button, three-way layout switch (bubble, dock, focus), close.
- Message area: user and assistant messages, step status lines, plan checklist, typing dots, system lines (stopped, step limit with Continue).
- Attachment chip row.
- Footer: crosshair picker button, text input "Type a message", Stop button (while working), Send.

**Chat window, dock mode** (any Desk route)
- Same regions as a side panel that narrows the page; edge arrow to collapse; collapsed rail with badge to expand.

**Chat window, focus mode** (any Desk route)
- Large centred panel with greeting "What do you want to do?" when empty; same header, body and footer.

**Recent chats menu** (dropdown under header title)
- "New chat" row, list of past chats with title, time and a check on the current one; loading and empty states.

**Picker mode overlay** (any Desk route)
- Hover highlight box on page elements; chips appear above input.

**Error dialog countdown** (over any Desk modal)
- Frappe modal with a small countdown badge while the assistant runs.

**DeskAI Settings** (`/app/deskai-settings`)
- Default Agent link, Enabled Tools multi-select, help text block.

## 8. Planned, not yet built
- None found in code. The README says 20 tools and 17 seeded; code has 26. Treat the README count as out of date.

## 9. Gaps a writer should not claim
- No voice input, file or image upload, or message editing.
- No reports, dashboards or scheduled jobs of its own; no custom roles (settings are System Manager only).
- No answer quality, language or cost guarantees: it depends on the AI provider chosen in huf.
- Not a separate app or PWA; it only works inside authenticated Desk, and only with huf installed.
- Mobile layout is not specified in code; do not claim phone support.
- The assistant is told to confirm deletes, but this is a prompt rule, not a hard lock.
- Do not claim it works offline or outside Desk.
