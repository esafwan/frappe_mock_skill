# Pulse: execution visibility and process compliance

Pulse is a Frappe 16 app with a React single page app for operations teams. It turns daily checklist work (standard operating procedures, "SOPs") into scores that roll up the reporting line, so a manager can see who is missing steps. It is our own app and a candidate for a mock system.

Source: Pulse/pulse, ref main (commit f082e8c). Everything below was found in code. The demo data is invented sample data for a fictional restaurant chain.

## Table of contents

1. [Organisation and people](#1-organisation-and-people)
2. [SOP templates and assignments](#2-sop-templates-and-assignments)
3. [Daily execution (checklist runs)](#3-daily-execution-checklist-runs)
4. [Scoring and roll-up](#4-scoring-and-roll-up)
5. [Operations drill-down](#5-operations-drill-down)
6. [Insights (analytics)](#6-insights-analytics)
7. [Corrective actions](#7-corrective-actions)
8. [Access and permissions](#8-access-and-permissions)
9. [Automation (scheduled jobs)](#9-automation-scheduled-jobs)
10. [Setup, demo data and install](#10-setup-demo-data-and-install)
11. [Look and feel](#11-look-and-feel)
12. [Screens for mocks](#screens-for-mocks)
13. [Planned, not yet built](#planned-not-yet-built)
14. [Gaps a writer should not claim](#gaps-a-writer-should-not-claim)

## 1. Organisation and people

- **Pulse Employee**: one record per person, with name, linked login user, branch, department, who they report to, active flag and avatar. The "reports to" link builds the management tree that all scores follow.
- **Pulse Role**: a business job title (Operator, Supervisor, Area Manager, Executive) with a level number, an alias and the system role it maps to. Lets a company call roles what it likes while access stays fixed.
- **Pulse Department**: a named department (Kitchen, Operations and so on) with description and active flag. Used to group templates and to compare departments.
- **Branch**: a free-text field on the employee, not its own record. Used to compare locations.
- **Current employee lookup**: the app finds the signed-in person's employee record, role alias and system role on load. Decides what menu and data they see.
- **Role migration patch**: a one-time upgrade step that renames old "PM" roles to the new Pulse roles and fixes people left without a role.

## 2. SOP templates and assignments

- **SOP Template**: the master checklist for a procedure, with title, department, frequency (Daily, Weekly, Monthly, Custom), owner role, active-from and active-to dates and an on/off flag. Defines what "done properly" means.
- **Checklist items**: each template holds ordered steps with a weight, a type (Checkbox, Numeric, Photo) and whether photo evidence is required. Weights let important steps count more.
- **SOP Assignment**: links one template to one employee, with an active flag. This is what decides who gets which checklist.
- **Template catalogue**: managers and above can browse all templates as cards showing frequency and title, and open the step list for each.
- **Template item viewer**: the item list of a template can be fetched with sequence, weight and type.

## 3. Daily execution (checklist runs)

- **SOP Run**: one person's copy of a template for one date, with status Open, Closed or Locked, item counts, a progress percent and a closed time. The unit of proof that work was done.
- **Run items**: each step copied from the template with status Pending, Completed or Missed, completed time, optional number, notes and photo.
- **My Tasks**: a person sees their runs for the day as cards with template name, frequency, percent complete and a progress bar. Operators start here.
- **Tick a step**: tapping a step toggles Pending and Completed and stamps the time. Open runs only, and only the owner or their direct manager may do it.
- **Submit and close**: closes the run and records the close time. Closed runs cannot be edited.
- **Auto totals**: total, completed and progress are recomputed on every save.
- **Progress bar and count**: the open run shows completed against total.
- **Empty state**: "All caught up" when no runs are due.

## 4. Scoring and roll-up

- **Own score**: completed steps divided by total steps for the person over the period. Shows how well they did their own work.
- **Team score**: average of the direct reports' combined scores, counting only those with work. Shows how well their team did.
- **Combined score**: average of own and team when both exist, otherwise whichever exists. Lets a failure at the bottom pull down every manager above it.
- **Periods**: Day, Week (Monday to Sunday) and Month, switchable on the main screens.
- **Score Snapshot**: a saved score per person, period and key with own, team, combined and item counts. Keeps a history for trends.
- **Status colours**: 80 percent and above is pass, 50 to 79 is risk, below 50 is fail, and no data shows a grey dash. Gives a read at a glance.
- **Team scores**: a manager can fetch scores for direct reports or the whole subtree.
- **Failure analytics**: the five most missed steps over the last 30 days across a manager's subtree.
- **Score breakdown panel**: a side sheet that explains a person's score, listing their checklists and steps with an expandable section per run.

## 5. Operations drill-down

- **Operations overview**: a full org tree with scores per person for the chosen period. Executives and area managers see the whole picture in one place.
- **Hierarchy breakdown**: scores grouped by branch or role level for a top-level person.
- **Person run breakdown**: all runs and steps for one person and period, used by the profile page.
- **Performance profile**: a person page with own, team and combined scores, a period switch, an open-breakdown action, a team performance table for managers, and today's checklists.

## 6. Insights (analytics)

All insight views share one filter bar (date range, department, branch, employee) and respect row-level access.

- **Org score trend**: line of score over time.
- **Completion rate trend**: how much work was finished each day.
- **Department comparison**: average score by department.
- **Branch comparison**: average score by branch.
- **Top performers and needs attention**: best and worst people for the period, with a limit.
- **Template performance**: which SOPs are done well or badly.
- **Day of week heatmap**: shows which weekdays slip.
- **Score distribution**: how many people sit in each score band.
- **Most missed items**: the steps skipped most, with template and department.
- **Corrective action summary**: open count and average time to resolve.
- **Drill into people**: list the employees behind a department or branch, with own, team and combined scores.
- **Filter option lists**: departments and branches offered as pick lists.
- **Date presets**: last 7, 30 or 90 days, this month, and a demo-data window.

## 7. Corrective actions

- **Corrective Action record**: a follow-up on a failure, with linked run, step reference, description, status (Open, In Progress, Resolved, Closed), priority (Low to Critical), assigned to, raised by, resolution, resolved time and a photo. Closes the loop between a miss and a fix.
- **Row-level access**: people see actions assigned to or raised by themselves and their reports.
- **Reporting only in the app**: the React app only reads corrective actions through the Insights summary (see Gaps).

## 8. Access and permissions

- **Five system roles**: Pulse User, Pulse Manager, Pulse Leader, Pulse Executive, Pulse Admin. Role names map to Operator, Supervisor, Area Manager, Executive and admin.
- **Row-level visibility**: on runs, snapshots and corrective actions. Operator sees own, Supervisor sees self plus direct reports, Area Manager sees the whole subtree, Executive and Admin see everything, a user with no employee record sees nothing.
- **Menu by role**: Team and SOP Templates are hidden from operators. Operations and Insights are hidden from operators and supervisors.
- **Page guards**: Operations and Insights show an "Access Restricted" message to people without access.
- **Edit guard**: only the run owner or their direct manager can change a run.
- **App launcher entry**: Pulse appears on the Frappe apps screen only for users holding a Pulse role.
- **Login required**: the app page redirects guests to login and waits for site setup to finish.

## 9. Automation (scheduled jobs)

- **Daily run creation**: each day creates today's runs for every active daily assignment, within the template's active dates, and never duplicates.
- **Weekly run creation**: on Mondays, for weekly assignments.
- **Monthly run creation**: on the 1st, for monthly assignments.
- **Overdue lock**: yesterday's and older Open runs have pending steps set to Missed and the run Locked. Makes skipped work count against the score.
- **Hourly score cache**: refreshes today's Day snapshot for every active employee.
- Custom frequency templates are not scheduled (see Gaps).

## 10. Setup, demo data and install

- **Install setup**: creates the five roles, four default business roles and starter departments (Operations, Security, Management).
- **Setup wizard option**: "Load demo data" checkbox that queues sample data.
- **Demo data**: a three-branch quick-service restaurant sample with 19 people, 7 departments, SOPs, about 40 days of runs, scores and corrective actions. Safe to load or clear again.
- **Bench commands**: `pulse-load-demo` and `pulse-clear-demo`.
- **Demo banner and button**: admins with no demo data see a prompt on the dashboard to load it, and a status check tells the screen what to show.
- **Empty-account card**: a user with no employee record sees guidance instead of data.

## 11. Look and feel

- **Light and dark theme toggle** in the top bar.
- **Collapsible sidebar** with workspace section and user block.
- **Closed status colour set** (pass, risk, fail, waive, none) with a separate selection colour, flat 3px corners.
- **Segmented meters** instead of gauges, and a large "ledger" number for headline scores.
- **Tables with loading, empty and error states**, toasts, status chips and disclosure sections.
- **Frappe session sign-in** reused by the app, no separate login screen.

## Screens for mocks

The app is served at `/pulse` with a left sidebar (Workspace group) and a top bar (theme toggle). Sidebar order: Dashboard, My Tasks, Team, Operations, Insights, SOP Templates.

**Dashboard** `/pulse/`
- Header "Execution Dashboard" with Day, Week, Month switch.
- Optional amber "No demo data on this site" banner with Load demo data button (admins only).
- Ledger headline number ("Day KPI") with "Execution Health" text and own, team and item counts.
- Segmented meter for combined score.
- "Execution by Group" bar chart of direct reports.
- "Organization-wide Failure Points" cards with most missed tasks (day view).
- Empty variant: "No employee record" card.

**My Tasks** `/pulse/tasks`
- Header "My Tasks".
- Run cards: template title, frequency, "% Complete", progress bar, status.
- Open run: checklist rows with checkbox, weight and notes, Progress line, "Submit & Close Checklist" button.
- Empty state "All caught up!".

**Team** `/pulse/team` (Supervisor and above)
- Header "Team".
- Table of direct reports: Team Member, Role, Own Score, Team Score, Operational.
- Second table of the wider team: Name, Role, Department, Branch, Own, Team, Combined.
- Empty states "No Direct Reports" and "No Team Data".

**Operations** `/pulse/operations` (Area Manager and above)
- Header "Operations Overview" with Day, Week, Month switch.
- Expandable org tree rows with name, role, branch, score chip and meter; clicking a leaf opens the person.
- "Access Restricted" state.

**Performance profile** `/pulse/operations/:userId`
- Back button to Operations, period switch.
- "Performance Profile" with score ledger and meter, button to open breakdown.
- "Management Scope: Team Performance" table.
- "Operational Checklists (Today)" list.
- "User not found" state.
- Score breakdown side sheet with one expandable section per run.

**Insights** `/pulse/insights` (Area Manager and above)
- Header "Insights" and filter bar (date preset, department, branch, employee).
- Summary tiles: Dept Avg, Branch Avg, Open CAs, Avg Resolution.
- Charts: Org Score Trend, Completion Rate Trend, Department Comparison, Branch Comparison, Day of Week, Score Distribution.
- Lists: Top Performers, Needs Attention, Template Performance, Corrective Actions.
- Table: Most Missed Items (Item, Template, Department, Misses).
- People table opened from a department or branch (Name, Role, Branch, Own, Team, Combined).
- "Access Restricted" state.

**SOP Templates** `/pulse/templates` (Supervisor and above)
- Header "SOP Templates".
- Card grid: frequency badge, title, id; loading skeleton cards.

**Frappe desk (admin)**
- Standard Frappe list and form screens for the eleven doctypes, plus the setup wizard step with the "Load demo data" checkbox.

## Planned, not yet built

- Assignment by role, branch or team. A comment in the original plan says assignment is per person today and may widen later.
- Photo and numeric evidence capture. The fields exist in the data but the task screen only offers tick boxes.

## Gaps a writer should not claim

- No mobile app and no PWA. There is no manifest or service worker, so do not claim offline use or install to phone. The app is responsive web only.
- No notifications. The bell icon in the sidebar and the Cmd K search box are visual only and do nothing.
- No email, WhatsApp or other outbound messaging, no webhooks and no external integrations.
- No in-app screen to create, edit or resolve corrective actions, to build templates or assignments, or to manage employees. These are done in the Frappe desk. Templates in the app are read-only.
- No automatic raising of corrective actions when steps are missed.
- No photo upload or numeric entry in My Tasks, and no evidence enforcement before closing.
- No approval or sign-off step, no escalation rules and no waivers in data (the "waive" colour exists only in the design set).
- No report or print builder and no export. Charts are on screen only.
- Custom frequency is selectable but nothing generates runs for it. Weekly runs only appear if the job runs on a Monday and monthly only on the 1st.
- Only the Day snapshot is cached. Week and Month are calculated on demand.
- Scores count steps equally in the calculation. Template weights are stored but not used in own score.
- Lock rule: any Open run from an earlier date is locked and its pending steps counted as Missed at the daily job.
- Frappe 16 only. Does not support earlier Frappe versions.
- The demo password is a fixed sample value and the data is fictional.
