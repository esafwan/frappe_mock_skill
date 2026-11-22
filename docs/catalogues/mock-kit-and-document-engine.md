# Mock kit and document engine: feature catalogue (and where to write the notes)

Scope: the two Experiments projects that make demo videos, mock screens and proposals for the apps (Loyal Arrow, URY, Huf, and later WhatsApp). Source of truth is the working trees as they stand today, read only:

- Mock kit: `frappe_mock_skill` (branch `feat/la-video-kit`), plus the sibling trees `frappe_mock_skill-ury` (`feat/ury-full-v16-desk`) and `frappe_mock_skill-mobile` (`feat/huf-mobile-polish`).
- Document engine: `tridz_document_engine` (`feat/huf-workspace`) and `tridz_document_engine-mobile` (`fix/huf-mobile-kit-path`), with workspaces `huf`, `loyalarrow`, `tridz`, `ury`.

Counts differ per tree. The base tree has 41 components (13 are point-of-sale), the URY tree has 469 folders in `components/`, the mobile tree has 339. Each feature below says which tree has it. Everything is mock or synthetic: no real customer data.

## Contents
1. [Mock kit: core engine](#1-mock-kit-core-engine)
2. [Mock kit: Frappe desk components](#2-mock-kit-frappe-desk-components)
3. [Mock kit: Loyal Arrow pack](#3-mock-kit-loyal-arrow-pack)
4. [Mock kit: URY systems](#4-mock-kit-ury-systems)
5. [Mock kit: Huf systems](#5-mock-kit-huf-systems)
6. [Mock kit: WhatsApp pieces](#6-mock-kit-whatsapp-pieces)
7. [Document engine: proposals and print](#7-document-engine-proposals-and-print)
8. [Document engine: content governance](#8-document-engine-content-governance)
9. [Document engine: data root and projects](#9-document-engine-data-root-and-projects)
10. [Document engine: video](#10-document-engine-video)
11. [Document engine: workspaces (brands)](#11-document-engine-workspaces-brands)
12. [Where to write the notes (per target)](#12-where-to-write-the-notes-per-target)
13. [Planned, not yet built](#13-planned-not-yet-built)
14. [Gaps a writer should not claim](#14-gaps-a-writer-should-not-claim)
15. [Screens for mocks](#15-screens-for-mocks)

## 1. Mock kit: core engine
- **System registry**: one file (`ui-kit/systems/registry.json`) lists each look (frappe-desk, ury-pos, huf, loyal-arrow-desk and more) so a maker picks one and never mixes styles. Why it matters: a video never shows two apps' styles blended.
- **Component folders**: every piece has HTML, text slots, states, screenshots and measured boxes. Why it matters: a maker can reuse a piece and trust it looks like the real product.
- **Text slots with length limits**: only slot text changes, and each slot states a maximum length. Why it matters: layouts do not break when copy changes.
- **Offline renderer**: `node tools/render.mjs <component>` builds a screen with no network and no backend. Why it matters: repeatable output, safe to run anywhere.
- **Theme switch**: light and dark for every component. Why it matters: one screen serves both video styles.
- **Right-to-left Arabic**: `dir=rtl` previews with translated fixed words. Why it matters: Gulf customers see their own layout.
- **Currency and locale swap**: AED, SAR, QAR, USD, EUR, INR and more, with symbol side, decimals and grouping handled (India grouping included). Why it matters: the same mock fits any market.
- **Menus with real photos**: cafe, south-indian, north-indian, mediterranean (English and Arabic), quick-service chicken burger, fine-dine, with credits file. Why it matters: restaurant mocks look real; credits must be kept in published videos.
- **Target ids and pixel boxes**: `data-ui` ids with measured boxes at 1440x900. Why it matters: cursor paths and click highlights land on the right spot.
- **State variants**: hover, focus, active, disabled, error shown by class changes plus screenshots. Why it matters: a video can show a button being pressed.
- **Pixel verification**: `scripts/verify.mjs` compares each preview with its screenshot (JavaScript off, no network). Why it matters: mocks stay faithful.
- **Capture pipeline**: `scripts/all.sh` re-captures from a live Frappe v16 bench when the real UI changes (needs a bench and Playwright).
- **Lint and docs generators**: `lint.mjs` and `docs.mjs` rebuild manifest and per-component READMEs.
- **Complete pages**: `desk-list`, `desk-form`, `pos-register`, each in dark, RTL, Arabic-AED, euro and menu variants.

## 2. Mock kit: Frappe desk components
Base tree, system `frappe-desk` (Frappe v16 shell).
- **Shell pieces**: dock, sidebar, navbar, page head, menu dropdown, workspace shortcuts.
- **Form pieces**: form title, tabs, section, sidebar, and eight field types (data, currency, date, link, select, check, table, text editor).
- **Data pieces**: list view, report view, number card, dashboard chart, comment timeline.
- **Feedback pieces**: alert, toast, modal dialog.
- **Kitchen order screens (desk)**: `kot-list`, `kot-form`.

## 3. Mock kit: Loyal Arrow pack
Lives in `frappe_mock_skill/loyal-arrow/` and `ui-kit/components/la/`, system `loyal-arrow-desk` (extends frappe-desk, status ready). The counter and member PWAs are listed as `loyal-arrow` and are **planned** in the registry.
- **Brand pack**: app identity, PWA theme colours read from the app source, per-store themes, placeholder logo (no real logo in repo yet).
- **Navigation structure**: sidebar, 10 workspaces and 26 reports taken from the app at `integration/master-2`. Why it matters: the mock menu matches the live app.
- **Synthetic datasets**: Dubai supermarket (AED, VAT 5%, English and Arabic) and Indian departmental store (INR, GST, English, Hindi, Malayalam). Each has 40 products, 60 members (6 Platinum, 16 Gold, 38 Silver), 200 bills, 10 referral pairs and WhatsApp previews; the UAE set also has returns. Generated by a deterministic script. Phones use `+0000000NNNN`.
- **Copy deck**: on-screen strings, taglines in four languages, and 33 WhatsApp template bodies (exact text).
- **Six flow scripts**: enrol a member, bill and earn preview, stamp/points/redeem with OTP, member PWA login and QR card, WhatsApp messages, desk reports tour. Each step has a caption, a selector and a hold time. Why it matters: a video agent can follow a known story.
- **Loyal Arrow desk components** (25 in `components/la/`): shell, sidebar page head, KPI-style mini lists, filter bar, preset pills, stack bar, tier bar, health list, meter, progress meter, member hero, balance cards, consent chips, activity feed, earn preview, feature card, form card, inline panel, tree table, action table, sentence form, chart toolbar, primary action, counter shell, scan frame, WhatsApp bubble.
- **Two desk pages built**: `desk-home` and `desk-lapsing` (English, AED) in `pages/la/`.
- **Screen catalogue**: `loyal-arrow/docs/SCREEN_CATALOGUE.md` lists desk, counter and WhatsApp screens with references and states (see section 15).
- **Video integration plan**: `loyal-arrow/docs/VIDEO_INTEGRATION_PLAN.md` says what to build next.

## 4. Mock kit: URY systems
URY tree only (`frappe_mock_skill-ury`), recaptured from URY `version-16` at commit `100c43fe2e`. Static, offline, light, dark and Arabic RTL.
- **POS system `ury-pos`** (57 `pos-*` components, 12 full screens): register, tables, orders, reservations, dashboard, settings, open entries, plus dialogs.
- **POS dialogs**: payment, bill split, bill merge, closing, comment, customer picker, product options, reservation, table select and transfer, screen size, checklist gate, spotlight search, printer watch.
- **POS dashboard strip**: KPI strip, attention feed, dashboard panels.
- **Waiter app `ury-captain`** (10 components, 4 screens): table grid, order taking, menu pane, send-to-kitchen bar, service requests, actions menu.
- **Kitchen display `ury-mosaic`** (10, 4 screens): production-unit cards, ticket cards, item pills, alerts, delayed and empty boards, scope selector, dashboard.
- **Table-QR ordering `ury-self-order`** (14, 8 screens): menu, detail, cart, checkout, status, idle dialog, plus tablet menu, detail and assignment.
- **Self-service kiosk `ury-kiosk`** (9 screens, landscape and portrait): idle, menu, detail, cart, checkout, status.
- **Admin app `ury-admin`** (18, 9 screens): dashboard with service board, reports home, daily profit and loss, master list and form, printer config, setup wizard, sales plan.
- **Brief mobile app `ury-brief`** (8, 5 screens): today story, chats, chat, call, settings, tab bar.
- **Desk as URY ships it `ury-desk`** (17, 9 screens): home, launcher, operate, POS operations, order list and form, table form, kitchen order list, report, with dock, sidebar, awesomebar, number and link cards, user menu. Do not mix with the older frappe-desk components.
- **Contact sheet**: one light screen per app in `docs/ury-contact-sheet.png`.
- **Menu-bound POS screens**: `pos-register` accepts `--menu` and `--locale` so items, prices and photos swap.

## 5. Mock kit: Huf systems
Huf is **planned** in the base tree (placeholder system file). The URY and mobile trees carry the real work.
- **Huf web app `huf`** (foundation; 176 `huf-*` web components in the URY tree): captured from the real React app running with every network call answered by a mock, on a fixed clock, fixed random seed and a fake origin. Dark theme is the `midnight` attribute. No right-to-left in Huf.
- **Agents**: agent card, new agent, templates, editor (setup, tools, knowledge and their add dialogs), agents page.
- **Chat**: empty and first-run states, agent picker, answers with tool groups, projects list.
- **Knowledge**: library, add content (text, web, storage), ask, import progress, settings, source and needs-attention state.
- **Tables (data)**: table list, grid with filter and selection, builder with field types, record edit with error, agent access.
- **Flows**: canvas, node and rail, agent panel, run viewer (including waiting), list.
- **Automations, procedures, batch jobs, executions**: list and editor, triggers, approval procedure, job detail and failure, runs, failed runs, run detail, analytics by model.
- **Analytics and cost**: analytics by agent, model and provider, grouping menu, cost dashboard (with flows).
- **Context and memory**: growth, limits, summaries, analytics, memory overview, policies, capture and promote policies.
- **Playground and decisions**: playground, compare, deployment, run, trace, templates, settings.
- **Gateways and channels**: gateway list, card, detail, activity, routing rules, pending access, Slack setup, WhatsApp channel setup and credentials.
- **Members, roles, integrations**: invite and disable members, role matrix (expanded), new and edit role, integrations catalogue and list, MCP list and detail (connection, tools).
- **Settings, providers, models, voice, SSH, network policy, execution profiles, code skills, apps launcher, artifacts and reports**.
- **Huf Desktop `huf-desktop`** (13 components; registry status `area`, so not finished): chat, tool run, approvals (including batch), permissions menu, first run and API key, agent selector, chart and document artifacts, settings for agents, local and MCP.
- **Huf iOS `huf-ios`** (60 components, status ready): device shell, screens for chats, chat, agents, agent switcher, dashboard, projects, computers, artifacts and detail, approval, voice, upload, attach, login, sign-in, empty and busy states, rich content, charts, diagrams and web artifacts.
- **Huf Android `huf-android`** (61 components, status ready, URY tree only): matching Material 3 set including drawer, bottom nav, overflow menu, permission dialog, approval states.
- **Mobile tree**: `frappe_mock_skill-mobile` has `huf-ios` and the web Huf set but not Android.

## 6. Mock kit: WhatsApp pieces
- **WhatsApp bubble (Loyal Arrow)**: a message bubble with sent, delivered and read ticks, English-left and Arabic-right layouts, light and dark. Why it matters: message previews look right in videos.
- **WhatsApp thread preview**: welcome, earned and win-back texts.
- **Huf WhatsApp screens** (15): template list (plus empty and rejected), template preview (image, carousel), template wizard (type, utility type, write, add button, errors, review, edit), broadcast wizard and recipients.
- **Huf WhatsApp channel setup** inside gateways (see section 5).
- **Doc engine screenshots**: the Huf workspace ships ten WhatsApp and Telegram screenshots (`assets/screens/`, catalogue in `CATALOGUE.md`).

## 7. Document engine: proposals and print
- **Proposal as JSON**: a proposal is a list of sections pointing at approved library parts, rendered through a chosen design. Same inputs give the same bytes. Why it matters: a sent proposal can be rebuilt and proved unchanged.
- **Lockfile**: `build` writes HTML plus a lock; `build --lock` fails if anything drifted.
- **Four page layouts**: `fixed` (one section per A4 page), `flow` (sections run across pages), `typst` (densest, needs Typst installed), `wide` (16:9 slides).
- **PDF export**: `pdf` via Chrome (fixed, flow) or Typst.
- **Layout check**: `layout-check` finds stranded headings, split table headers and near-empty pages (advisory, needs `pdftotext`).
- **Presenting mode**: `--format present` gives one slide at a time with keys, swipe, fullscreen and overview; `bundle` makes a self-contained folder and zip.
- **Block kit**: shared block types (see `docs/BLOCKS.md`) plus cards, figure, stat, quote, chain, contact and steps in the Huf, URY and Loyal Arrow workspaces.
- **Page break controls**: section `break` (before, after, both) and `keep`.
- **Spelling and style lint**: `lint [--spell]`.
- **Pre-send review**: `review` lists versions, flags, drift, lint results and unfinished sections, and exits non-zero if anything is flagged.
- **Placeholder guard**: any unresolved `[placeholder]` or `{{token}}` stops the build. Why it matters: nothing invented slips into a client file.

## 8. Document engine: content governance
- **Versioned components**: each part has versions with status draft, review, approved or deprecated.
- **Sealed approvals**: `seal` records hashes; `test` fails if an approved file was edited.
- **Pricing catalogues**: all amounts live in versioned price files (Tridz has `assessment_aed`, `retainer_aed`, `sprint_aed`, `sprint_usd`); `price set` makes a new draft and totals recompute.
- **Designs and offerings**: designs are versioned files with renderers; offerings group components.
- **Registry**: `library/registry.json` indexes every version and status.
- **Frozen fixtures and templates**: regression goldens and skeleton proposals copied with `new`.
- **Edit commands**: `add-section`, `remove-section`, `move-section`, `set-variant`, `component new-version`, `component status`.
- **Brand-free engine rule**: the engine holds no brand names; workspaces never reference each other.

## 9. Document engine: data root and projects
- **Data root outside the repo**: client work lives in `~/TridzData` (or `--data`, `$TRIDZ_DATA`), its own git repo. Why it matters: no client data enters the engine repo.
- **Projects**: `project new|list|show|files|status|attach|clean` with statuses wip, completed, archived (completed and archived refuse edits).
- **Search**: `data search` ranked fuzzy search across projects, notes and section text; `data index` builds the index.
- **Asset registry**: `asset add|new-version|list|show|verify|status|frame|contact` tracks media with versions, hashes and licences.
- **Shared data repo**: `data clone <url>`.

## 10. Document engine: video
Two layers: the in-engine story builder and the `video/` toolkit.
- **Video definitions**: `video plan|build|lock|review`; build writes an mp4 and a lock, `lock` replays and fails on drift.
- **Narrated story builder**: `video story-build` turns a story file into speech, renders, narration and the final video; `--draft` uses half size and fake speech.
- **Story helpers**: `video init`, `script-lint`, `status`, `preview` (frames at chosen seconds), `inventory` (scene changes, black spans, contact sheet), `capture` (screenshot at 1440x900 into the asset registry), `doctor` (checks ffmpeg, Chrome, Remotion, speech providers).
- **Approval step**: `video approve` moves generated assets from review to approved; final builds need approved assets.
- **Speech providers**: say, qwen3 (local), openai, gemini, custom, and a fake one for drafts. Cloud providers send script text out, so they refuse without `--yes` and refuse confidential projects without `--allow-cloud` (off by default).
- **Pronunciation and captions**: pronunciation normalisation, caption and voice files per workspace.
- **Video dashboard**: `video dash serve` (http://127.0.0.1:8787) shows every video output with state, history and jobs; agents may never set approved or published.
- **Shot-list toolkit** (`video/`): JSON shot list to HTML and GSAP to mp4 through HyperFrames, deterministic.
- **Shot types**: logo, echo, title (typewriter), words, slot, counter, bars, media, cascade, ui (screenshot in a window with cursor and zoom), page (live mock kit screen), page with live acts (numbers count up, chat bubbles arrive, ticks turn read), phone frame.
- **Motion modes**: wild, balanced, calm. A shot list is re-cut calmer by changing one word.
- **Transitions**: blur, whip, push, skew, zoom, iris, wipe, flash, dip, cut, match.
- **Mock kit link**: `page` shots take a mock kit screen (`uiKit`) and aim the cursor at `data-ui` ids. This is how the two projects connect.
- **Brands**: `video/brands/loyalarrow.json` and `ury.json` hold brand settings; samples include a 30 second URY ad and Arabic UI films with transcripts.
- **Per-workspace video design**: Loyal Arrow and URY each have a `video/` folder (design, captions, voice, templates).

## 11. Document engine: workspaces (brands)
- **Tridz**: company proposals; 29 components (sprint, retainer, assessment, ERPNext pages and more), four price catalogues, agreements, fixtures.
- **Huf**: designs `huf_a4` and `huf_wide`; 7 components (cover, back cover, narrative page, statement, free page, screenshot figure, stat strip); 21 icons; brand assets, partner badge, brochure sources and PDFs for WhatsApp, showcase proposals in all four modes.
- **Loyal Arrow**: design `la_a4`; 4 components (cover, back cover, free page, figure page); 88 Lucide icons; contrast checker; brochure template; brochure blocks drawn by the HTML renderers only.
- **URY**: 5 components; templates `restaurant-platform` and `ury-showcase` in all four modes; video design and Arabic UI film samples.
- **Mobile engine copy**: `tridz_document_engine-mobile` carries only the `tridz` and `ury` workspaces; it is a snapshot for mobile kit work.
- **New workspace guide**: `docs/NEW-WORKSPACE.md` explains adding a brand.

## 12. Where to write the notes (per target)
Rule: notes about an app go where makers already read. Do not create new top-level files; add a short "App notes" section.

| Target | Write the notes here | Why this spot |
|---|---|---|
| Mock kit (any tree) | `SKILL.md` (agent entry) and `ui-kit/AGENT_GUIDE.md` | Agents read these first |
| Loyal Arrow mocks | `frappe_mock_skill/loyal-arrow/README.md` and `loyal-arrow/docs/SCREEN_CATALOGUE.md` | Already the app's content pack |
| URY mocks | `frappe_mock_skill-ury/SKILL.md` ("URY v16 systems" table) | Already lists systems |
| Huf mocks | `frappe_mock_skill-ury/ui-kit/systems/huf/README.md`; mobile notes in `systems/huf-ios/` | Huf's own system folder |
| WhatsApp mocks | no registry entry yet: add a `whatsapp` system via `systems/ADDING_A_SYSTEM.md`, then notes in its folder | Nowhere to write until the system exists |
| Document engine | `AGENTS.md` and `SKILL.md` at repo root | Agents read these first |
| Huf proposals | `workspaces/huf/README.md` and `design-system/VOICE.md` | Brand rules live there |
| Loyal Arrow proposals | `workspaces/loyalarrow/README.md` | Same pattern |
| URY proposals | `workspaces/ury/README.md` | Same pattern |
| Tridz | none: company workspace, no app source | Skip |

## 13. Planned, not yet built
- **Loyal Arrow counter and member PWA as kit systems**: registry says planned; counter and member CSS not captured (`loyal-arrow/README.md`).
- **Huf in the base tree**: only a placeholder system file; real work is in the URY and mobile trees.
- **Huf Desktop**: status `area`, partly captured.
- **WhatsApp as its own system**: no registry or workspace entry.
- **Quick score screen**: not in the app source (closest: member PWA home).
- **Video toolkit next steps**: UI-as-DOM replay with typing and streaming, recording ingest with speed ramps, beat-synced audio and click sounds, animated gradient backgrounds, variable-font echo (`video/README.md`).
- **Typst drawing of Loyal Arrow brochure blocks**: pending (`workspaces/loyalarrow/README.md`).

## 14. Gaps a writer should not claim
- Do not say the mock kit shows live data or a working backend: every screen is static and offline.
- Do not say all apps are covered: Loyal Arrow counter and member PWAs, WhatsApp and (in the base tree) Huf are not finished systems.
- Do not claim Huf has right-to-left mocks; the Huf app has none.
- Do not claim Android mocks exist in the mobile tree; they are in the URY tree.
- Do not say a quick-score screen exists for Loyal Arrow.
- Do not claim `method-otp` ids and desk selectors in the flow scripts are verified; they are marked unverified.
- Do not claim a real Loyal Arrow logo: it is a placeholder, and the brand accent is awaiting owner confirmation.
- Do not claim the engine draws every Loyal Arrow brochure block in Typst.
- Do not promise cloud speech without consent: it is refused unless confirmed.
- Do not claim fixed mode of the Loyal Arrow workspace was smoke-built; only flow and typst were.
- Do not present food photos as free to reuse without credits (CC BY and CC BY-SA, see `data/CREDITS.md`).
- Do not claim Tridz has an app mock: it has no app source.
- Do not mix `ury-desk` and `frappe-desk` components in one page.

## 15. Screens for mocks
All desk screens are 1440x900, counter and member screens 390x844. Routes are the real app routes where a spec records one; kit-only screens have an id instead.

### Loyal Arrow desk (`loyal-arrow-desk`)
Shared shell: icon rail, 224 px sidebar with workspace switcher, page head with actions and primary button.

| Screen | Route | Key regions |
|---|---|---|
| Workspace | /desk/loyal-arrow | Today KPI row, quick actions, two trend charts, three recent-activity lists |
| Loyalty dashboard | /desk/loyalty-dashboard | programme select, needs-attention banner, 9 KPIs, members by tier, lifecycle, recent activity, system health |
| Member 360 | /desk/member-profile/{member} | hero card with tier and progress, balance cards, tabs, dated activity feed |
| Member list | /desk/loyalty-member | filter bar, header, rows, paging |
| Member form | /desk/loyalty-member/{member} | tabs, summary line, consent chips, identity and contact sections, form sidebar |
| Scheme form | /desk/loyalty-scheme/{prog} | tabs (Overview, Earning, Spending, Messages, Where), earn preview card |
| Rule builder | scheme rule line | rule line editor |
| Loyalty Today report | /desk/query-report/Loyalty Today | filter, 5 KPIs with vs-yesterday, metric table |
| Cohorts report | .../Cohorts | line chart, filters, 6 KPIs, heat table |
| Tier Migration report | .../Tier Migration Matrix | split bar, preset pills, 6 KPIs, matrix |
| Program ROI report | .../Program ROI | pills, info banner, 5 KPIs, measure table |
| RFM, Liability and Aging, Expiry Forecast, Campaign Attribution reports | .../<name> | filters, KPIs, chart or empty state ("Generate New Report" for background reports) |
| Retail heatmap | /desk/retail | tabs, level select, 4 KPIs, category-by-store grid, penetration table |
| Retail mapping inbox, settings, festival, windows, missions | Retail tabs | segmented filter, tables with actions, KPI row, sentence builder, cumulative line chart |
| Retail funding, placements, zones, experiments, change review | retail-admin tabs | cap meters, check forms, tree table, result panel |

### Loyal Arrow counter and member PWA (planned system)
| Screen | Route | Key regions |
|---|---|---|
| Counter home | /counter | three cards: Find/enrol, Scan card, New bill |
| Find | /counter/find | lookup type, query, result with tier chip, balance, pending, expiring |
| Scan | /counter/scan | camera frame |
| Enrol | /counter/enrol | program, name, mobile, birthday, consent rows, error banner |
| Bill amount, earn preview, redeem, receipt | /counter/bill | amount field, points preview, approver (QR, OTP, PIN), receipt |
| Void | /counter/void | event id, reason, 10 minute window, done and expired states |
| Member PWA | member app | login, home balance, QR card |
| WhatsApp thread | kit component | bubbles with ticks, 4 languages |

### URY (URY tree)
| Screen | Id | Key regions |
|---|---|---|
| POS register | `pos-screen-register` | header with search, 256 px category sidebar, item grid, 384 px order panel, footer nav |
| POS tables, orders, reservations, dashboard, settings, open entries | `pos-screen-*` | table cards with legend, order cards and detail, reservation timeline, KPI strip |
| Waiter | `ury-captain-screen-*` | table grid, menu, order list, send bar |
| Kitchen | `ury-mosaic-screen-*` | board, delayed, empty, dashboard |
| Self order and tablet | `ury-self-order-screen-*` | menu, detail, cart, checkout, status |
| Kiosk | `ury-kiosk-screen-*` | idle, menu, detail, cart, checkout, status |
| Admin | `ury-admin-screen-*` | dashboard, reports home, daily P&L, masters, printer config, setup wizard, sales plan |
| Brief | `ury-brief-screen-*` | today, chats, chat, call, settings |
| Desk | `ury-desk-screen-*` | home, launcher, operate, POS operations, order list and form, table form, KOT list, report |

### Huf web (routes from the capture specs)
| Screen | Route | Key regions |
|---|---|---|
| Agents | /agents, /agents/new | agent card grid, template picker, editor tabs |
| Chat | /chat, /chat/{id}, /chat/projects | agent picker, answer with tool group, projects list, outputs pane |
| Knowledge | knowledge library | library, add content, ask, import progress |
| Data tables | /data, /data/{table}, /data/{table}/edit | table list, grid with filter, builder, record edit |
| Flows | flows | list, canvas, node rail, run viewer |
| Automations | /automations, /automations/{id} | list, editor, triggers |
| Procedures | /procedures, /procedures/{id} | list, approval detail |
| Batch jobs | /batch-jobs | job detail, failed job |
| Executions | /executions, /executions/{id}, ?tab=analytics | runs, failures, run detail, analytics |
| Cost dashboard | /dashboard | cost cards, flows view |
| Playground | /playground | empty, templates, compare, deployment |
| Gateways | /gateways, ?tab=pending-access | cards, add, empty, pending access |
| WhatsApp channel setup | /channels/whatsapp/setup | setup steps, credentials |
| Members and roles | /members, ?view=roles, /roles/new | people, invite, disable, role matrix |
| Integrations and MCP | /integrations, /mcp/{name} | catalogue, list, connection, tools |
| Providers and models | /providers, /models | add cloud or local, test, model list and dialog |
| Settings | /settings, /settings/general, /settings/developer | code skills, general, developer keys |
| Apps, SSH, network policies, execution profiles | /apps, /ssh-connections, /network-policies, /execution-profiles | launcher, connections, list, form |
| Memory and context | /memory, chat analytics pane | overview, empty, growth |
| Desktop | #/chat/{id}, #/settings/agents, #/settings/local | chat, tool run, permissions menu, chart artifact, settings |
| Desktop approval | approval window | single and batch approval |
| iOS and Android | `huf-ios-screen-*`, `huf-android-screen-*` | chats, chat, agents, projects, artifacts, approval, voice, upload, login, empty and busy states |
