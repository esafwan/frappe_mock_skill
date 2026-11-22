# Huf (AI agent platform on Frappe): feature catalogue

Source of truth: code in the Huf repo, read from the clean pre-develop worktree (`pre-develop` c21cd5268, the base the WhatsApp track uses). Frappe app `huf` with a React frontend in `frontend/` and design tokens in `DESIGN.md`. Only features found in code are listed as built.

## Contents

1. [Agents](#1-agents)
2. [Chat and conversations](#2-chat-and-conversations)
3. [Tools, skills and MCP](#3-tools-skills-and-mcp)
4. [Flows, procedures and orchestration](#4-flows-procedures-and-orchestration)
5. [Triggers, automations and scheduling](#5-triggers-automations-and-scheduling)
6. [Gateways (WhatsApp, Telegram and others)](#6-gateways-whatsapp-telegram-and-others)
7. [Memory](#7-memory)
8. [Knowledge](#8-knowledge)
9. [Voice and meetings](#9-voice-and-meetings)
10. [Models and providers](#10-models-and-providers)
11. [Code execution and safety](#11-code-execution-and-safety)
12. [Apps, data tables and artifacts](#12-apps-data-tables-and-artifacts)
13. [Executions, analytics and reports](#13-executions-analytics-and-reports)
14. [Roles, permissions and members](#14-roles-permissions-and-members)
15. [Settings and public API](#15-settings-and-public-api)
16. [Background jobs](#16-background-jobs)
17. [Planned, not yet built](#17-planned-not-yet-built)
18. [Gaps a writer should not claim](#18-gaps-a-writer-should-not-claim)
19. [Screens for mocks](#19-screens-for-mocks)

## 1. Agents

- **Agent**: A named AI worker with its own instructions, model, temperature and limits. It is the unit a business user creates, tests and assigns work to.
- **Text, voice or both**: Each agent is set to Text, Voice or Both so one agent can serve chat and calls.
- **Local or template prompt**: Instructions are typed on the agent or pulled from a shared prompt library, with an option to lock to a version so a template change does not silently alter behaviour.
- **Prompt library and categories**: Reusable prompts grouped by category, with new versions, so teams share one approved wording.
- **Starter prompts**: Suggested first messages shown in chat so staff know what to ask.
- **Context strategy**: Long chats are summarised (default), cut to the last N messages, or left alone, so cost stays in check. History limit and summary ratio are set per agent.
- **Summary prompts**: Library of prompts that control how old chat is summarised.
- **Reasoning controls**: Auto, on or off, with effort level and summary choice for models that think before answering.
- **Prompt caching**: Reuses repeated prompt text to cut cost (off by default).
- **Max turns**: Caps how many steps an agent may take in one run (default 20).
- **Lazy tool loading**: Agent discovers tools only when needed to keep prompts small (off by default).
- **File upload and OCR in chat**: Users can attach files, up to a size limit (25 MB default); reading text from scanned images is a separate switch (both off by default).
- **Rich elements and document artifacts in chat**: Agent can reply with cards, charts and downloadable documents (on by default).
- **Ask the user**: Agent can pause and ask a clarifying question mid-task (on by default).
- **Show tool details**: Chat can show which tools ran and what they did (on by default).
- **Auto-naming of conversations**: Titles are generated from the first messages (on by default).
- **Conversation data tools**: Agent can read structured data attached to a conversation (off by default).
- **Guest and all-users access switches**: Control who may chat with an agent beyond named users (off by default).
- **Embeddable chat widget**: Agent can be embedded on another website with a publishable key and allowed origins (off by default).
- **Conversation retention**: Per agent rules for hide, archive, trash or delete; trash kept 30 days by default, optional auto-archive and message expiry.
- **Agent permissions tab**: Per agent control of who can use and edit it.
- **System agents**: Built-in agents (Hub orchestrator, demo assistant) shipped as starting points.
- **Agent form**: Tabs for General, Behavior, Tools, Skills, Knowledge, Triggers, Procedures, Voice, Permissions and Advanced.
- **Delete agent dialog**: Confirms before removing an agent.

## 2. Chat and conversations

- **Hub**: Home screen with an ask box, slash commands and recent chats; the front door to every agent.
- **Chat**: Full chat window with streaming replies, attachments, copy, message actions and an agent picker.
- **Chat projects**: Group chats under a project with its own page.
- **Chat artifacts page**: Gallery of everything agents produced across chats.
- **Scheduled chats page**: Lists conversations created by scheduled work.
- **Pinned conversations**: Pin chats to keep them on top.
- **Fork conversation**: Branch a chat from any point to try another direction.
- **Conversation menu**: Rename, pin, archive, trash, delete.
- **Chat-only mode**: A stripped chat page with no navigation, for focused use.
- **Public chat page**: Server-rendered agent chat page for the embed widget.
- **Message feedback**: Feedback on runs, feeding the feedback report.
- **Artifact side panel**: Opens generated documents, web previews and React previews beside the chat.
- **Voice call overlay**: Start a spoken conversation from chat when voice is on.
- **Approvals bell**: Shows pending approvals for risky actions so a person can allow or deny.
- **Propose procedure from a chat**: Turn a good chat into a reusable procedure (see section 4).

## 3. Tools, skills and MCP

- **Built-in tool library**: Ready tools for Gmail, Google Calendar, Drive, Sheets, Meet, Maps, Places, Chat, Slack, Microsoft Teams webhook, Telegram, WhatsApp, Messenger, Discord, GitHub, Raven, Helpdesk, CRM, ERPNext (documents, inventory, reports), Frappe Cloud, Perplexity search and SERP search (hotels, reviews, YouTube).
- **Record tools**: Agent can read, create, update and delete records of chosen DocTypes, with a guard on which DocTypes are allowed.
- **Custom function tools**: Expose a Python function in your own app as an agent tool.
- **HTTP request tools**: Call any web API, with saved headers and protection against calls to internal addresses.
- **Tool types**: Admin-managed list of tool categories.
- **Integration credentials**: Store keys and connections per service once, reuse across tools.
- **Integration services and settings**: Catalogue of services and one settings page per connected account.
- **Recipients**: Saved contacts agents may message through a tool.
- **Skills**: Reusable bundles of instructions, tools, knowledge and MCP servers an agent can load on demand, with categories, priority and auto-load.
- **Skill import and export**: Move skills between sites.
- **MCP servers**: Connect outside tool servers with headers, sign-in (OAuth) and an hourly tool refresh.
- **Ask-user and render tools**: Let agents ask questions and draw rich cards.
- **Lazy tool discovery**: Search for tools at run time instead of loading all (off by default).
- **Test tool**: Try a tool from the screen before giving it to an agent.

## 4. Flows, procedures and orchestration

- **Flow builder**: Drag and drop canvas to chain steps visually, with save, versions and run history.
- **Flow node types**: Webhook, schedule and document-event triggers; agent run; tool call; AI router; human approval; condition; transform; for-each; parallel; validate; output.
- **Flow run viewer**: Watch a run step by step, with status per node.
- **Flow list**: Search and open all flows.
- **Human approval step**: A flow can stop and wait for a person to approve.
- **AI router step**: Lets a model pick the next branch.
- **Procedures**: Saved, versioned, step by step recipes agents can follow without reasoning from scratch, with input and output schemas, tier, and read-only or contains-writes markers.
- **Procedure approval**: A procedure must be approved before use; self-approval is a setting (off by default).
- **Convert flow to procedure**: One action turns a flow into a procedure.
- **Propose procedure from runs**: Agent suggests a procedure from repeated work for a person to review.
- **Procedure bindings**: Attach procedures to an agent.
- **Procedure runs and steps**: Each use is logged per step.
- **Orchestration plans**: A coordinator agent splits a goal into sub-tasks for other agents, with depth, deadline and spend caps.
- **Hub orchestrator**: Built-in agent that routes asks to the right agent and can build apps.

## 5. Triggers, automations and scheduling

- **Triggers on an agent**: Run an agent on a schedule, on a document event (create, save, submit and so on) with an optional condition, on a webhook, on an app event, or by hand.
- **Webhook triggers**: Unique key and slug per trigger so outside systems can call an agent.
- **Automations**: Named jobs that run an agent with an instruction and input template, as a chosen user, with status, last run, next run, last error and run totals.
- **Conversation mode for automations**: New chat per run, one dedicated chat, or no chat shown.
- **Notify user**: Automation can alert the owner when it finishes.
- **Trigger attachments**: Files can be attached to a trigger run.
- **Batch jobs**: Submit bulk runs to a model provider's discount batch service and poll results every 15 minutes.
- **Run asynchronously**: Agent can run in the background and report later (off by default).
- **Stalled run recovery**: Stuck runs are picked up every minute.

## 6. Gateways (WhatsApp, Telegram and others)

- **Gateway**: One connection between an agent or flow and a messaging channel, with an enabled switch, run-as user, last event time and last error.
- **WhatsApp**: Receives text and media (image, document, audio, video, sticker) from the WhatsApp Cloud API, verifies the sender, and replies with text. Media replies are not sent yet.
- **Telegram**: Receives updates guarded by a required secret, saves photos, files and voice as attachments, and replies with text.
- **Messenger, Instagram, Email, Google Chat, Microsoft Teams, Slack**: Adapters exist and are registered for each, and the Gateway form offers them. Maturity varies, see gaps.
- **Direct message policy**: Disabled, Pairing, Allow list or Open (default Allow list).
- **Room policy and sender policy**: Same idea for group chats; mention required by default.
- **Pairing**: A new person gets a code, a manager approves or revokes, with an expiry (60 minutes default) and an optional pairing reply.
- **Access list**: Approved and pending people per gateway, with approve, list and revoke.
- **Routing rules (bindings)**: Priority ordered rules send a message to an agent or flow by match: any conversation, direct message, room, thread or sender.
- **Default target**: Fallback agent or flow when no rule matches.
- **Route preview**: Test which agent a sample message would reach.
- **Readiness check**: One click checks the gateway is set up correctly.
- **Test send**: Send a test message to a recipient.
- **Gateway events log**: Every inbound event kept; rejected ones purged daily.
- **Gateway pairing tools**: Agent tools that let an agent handle pairing.
- **Gateways list and detail screens**: Setup per provider with credentials from integration settings.

## 7. Memory

- **Memory records**: Facts, preferences and lessons saved with title, summary, type, tags, confidence, importance and dates.
- **Scope**: A memory belongs to a conversation, user, role, agent, workspace, site or global, so you control who benefits.
- **Memory policy**: Rules per agent for what may be saved, who approves, token budget, record limit and expiry (default 5 records, 1000 tokens).
- **Capture mode**: Manual (default), agent suggested or automatic.
- **Approval before use**: New memories start as Draft and need approval (default).
- **Inject mode**: Never, relevant only, always, or only when the agent asks (default).
- **Memory search and write tools**: Agent can look up and save memories during a chat.
- **Learning from runs**: A learning agent can propose memories from finished runs.
- **Supersede and archive**: Replace an old memory or retire it.
- **Expiry**: Expired memories are marked daily.
- **Promote to knowledge**: Strong memories can be pushed into a knowledge source, with confidence and importance thresholds (off by default).
- **Memory master switch**: Memory is off per agent until enabled (off by default).
- **Intelligence screen**: Lists memory records and policies with filters.

## 8. Knowledge

- **Knowledge sources**: Searchable collections an agent can read before answering, shown with status, chunk count, input count and index size.
- **Inputs**: Add files, web pages, text and Office documents (PDF, Word, PowerPoint, Excel, HTML).
- **Search backends**: Built-in SQLite keyword, vector or hybrid search, plus Chroma, pgvector, Redis, Weaviate, FAISS, Pinecone and zvec options.
- **Embeddings**: Choose embedding provider and model.
- **Chunk size and overlap**: Control how text is split.
- **Test connection**: Check an external vector store works.
- **Attach to agents**: Link sources to an agent, with a token cap for retrieved text (4000 default).
- **Index maintenance**: Daily cleanup of orphan files and index tuning.
- **Skill knowledge**: Skills can bring their own knowledge sources.
- **ERPNext docs seed**: Bundled ERPNext reference text for ERP agents.

## 9. Voice and meetings

- **Voice engines**: Realtime voice through a model provider or ElevenLabs, per agent, with a greeting (off by default).
- **Speech to text and text to speech**: Audio in chat and TTS voice choice per agent.
- **Voice settings**: Global speech-to-text choices.
- **Meetings**: Record a meeting in the browser, upload in chunks, transcribe, summarise and export.
- **Meeting chat**: Ask an agent questions about a meeting.
- **Post-meeting context prompt**: Asks what the meeting was about to improve the summary.
- **Failure card**: Shows which step failed and why.
- **Recording recovery**: Hourly job cleans stale recordings and rescues stuck uploads.

## 10. Models and providers

- **AI providers**: Connect OpenAI, Anthropic, Google, OpenRouter, Groq, ElevenLabs and others through a unified layer, with brand icons.
- **Models list**: Catalogue of models with metadata and cost.
- **Allowed models per agent**: Restrict which models an agent may use.
- **Defaults**: Default provider and model for new agents.
- **Cost calculation**: Each run priced from token use, including cached tokens.
- **Local runtime**: Run local models where installed.

## 11. Code execution and safety

- **Execution profiles**: Named safety settings for code runs: approval mode (auto, ask, never), file access (none, scratch, shared), network policy, allowed modules, time, CPU, memory and output limits.
- **Built-in profiles**: Ready profiles you can pick without building your own.
- **Network access policies**: Allow lists of hosts for code and tools.
- **Code execution tool**: Agent runs code in a sandbox (off by default per agent).
- **Docker execution**: Run code in a container.
- **SSH connections and SSH tool**: Agent can run commands on a registered server (off by default per agent).
- **Execution approvals**: Risky steps wait for a person; the bell shows pending items.
- **Run budgets**: Spend cap, deadline and depth limits (defaults: spend cap 0 meaning none, 900 seconds, depth 3).

## 12. Apps, data tables and artifacts

- **Apps**: Small apps built or installed on top of Huf, listed with icon, route, category, version, launch mode, permission method and public flag.
- **App seeding**: Apps found in other installed Frappe apps are loaded automatically.
- **Public apps**: An app can be shown without sign-in (off unless set).
- **Data tables**: Build simple tables, add records, view and edit, as storage for agents and apps.
- **Artifacts**: Documents, charts, web pages and Office files agents produce, with a viewer page and export.
- **Context artifacts**: Files kept as reusable context for agents, with expiry cleanup.
- **Capability discovery**: Agents find which apps and actions exist on the site.

## 13. Executions, analytics and reports

- **Executions**: List of every agent run with status, cost, time and a detail page showing messages, tool calls and prompt snapshot.
- **Run feedback**: Capture and review feedback per run.
- **Analytics tab**: Dashboards by agent, model and other dimensions, with drill-down pages.
- **Rollups**: Analytics refreshed every 5 minutes with an archive table.
- **Dashboard**: Home dashboard of agent activity.
- **Number cards**: Total Agent Runs, Success Rate, Total Cost.
- **Reports**: Agent Run Feedback, AI Model Efficiency Analysis, Average Time Duration.
- **Playground**: Try a prompt against one or several models side by side, compare answers with word diff, keep a run ledger, save templates.
- **Run ledger and trace rail**: See each step of a test run.

## 14. Roles, permissions and members

- **Huf roles**: Huf Admin, Huf Manager, Huf User, Huf Viewer, backed by Frappe roles (System Manager, Huf Manager, Huf User, Huf Viewer).
- **Capability based permissions**: Each Huf role holds capabilities such as agent.create, flows.use, system.providers.manage, so screens and actions appear only if allowed.
- **Custom roles**: Create roles and assign capabilities.
- **Members**: Add people, assign Huf roles.
- **Agent users and access**: Choose who may use each agent.
- **API keys**: Create keys for outside callers, with scopes, shown once on creation.
- **Execution user per gateway and automation**: Work runs as a chosen user so record permissions apply.

## 15. Settings and public API

- **General settings**: Site wide options.
- **Agent defaults**: Default provider, model, max turns ceiling (20), depth, deadline and spend cap.
- **Voice / STT settings**: Speech to text options.
- **Add-ons**: Optional features such as DeskAI, with an enable switch (off by default).
- **Developer settings**: API keys and API docs for agents.
- **Public API v1**: Endpoints for agents, conversations, runs, identity and responses (including streaming), with scopes and an OpenAPI description.
- **Command palette**: Keyboard jump to any screen or action.
- **Design tokens**: One shared token file (DESIGN.md) drives the look.
- **Night mode**: Dark theme.

## 16. Background jobs

- **Every tick**: Run due agent schedules and due automations.
- **Every minute**: Advance orchestrations; recover stalled runs.
- **Every 5 minutes**: Refresh analytics rollups.
- **Every 15 minutes**: Poll provider batch jobs.
- **Hourly**: Refresh MCP tool lists and sign-in tokens; clean meeting recordings.
- **Daily**: Clean knowledge files and indexes, expire memories, purge trashed chats, purge expired context artifacts, purge old rejected gateway events.

## 17. Planned, not yet built

- **WhatsApp media replies**: Sending images or files back is marked as a gap in code comments.
- **Gateway pairing and allow list UI polish**: Design notes exist (GATEWAY_PAIRING_AND_SETUP_DESIGN, GATEWAY_PAIRING_UI_GAP, GATEWAY_ALLOW_LIST_GAP) describing missing screens.
- **Playground multimodal**: Roadmap document only.
- **Unified app builder in the Hub**: Plan documents only.
- **Discord gateway**: Discord and Slack event modules exist, but no registered Discord gateway adapter was found.

## 18. Gaps a writer should not claim

- Do not claim an installable offline app: a service worker is registered and manifest routes exist, but the build plugin that generates them was removed and the files are not in source.
- Do not claim WhatsApp can send images, documents or voice notes back.
- Do not claim Discord, SMS, VK or WeCom as gateway providers: the Gateway form offers WhatsApp, Messenger, Instagram, Telegram, Slack, Email, Google Chat and Microsoft Teams only.
- Do not claim memory, code execution, SSH, prompt caching, embed widget, voice or lazy tools work out of the box: all are off until enabled.
- Do not claim the agent saves memories on its own: capture is manual by default and new memories need approval.
- Do not claim production ready: project notes say the app is being migrated and not recommended for production.
- Do not claim billing, subscriptions or a marketplace: none found.
- Do not claim all vector stores are equally tested: only SQLite search is the bundled default.
- Do not claim old flow nodes (http request, loop, end) can be created: they only keep old runs working.
- Do not claim a business vertical (retail, CRM suite): CRM and ERPNext are tools, not built-in modules.

## 19. Screens for mocks

Shell: left sidebar (Hub, Apps, Chat, Agents, Flows, Procedures, Intelligence, Skills, Automations, Prompts, Sources, Tables, Dashboard, Executions, Playground, Settings group), top header with page title and actions, approvals bell, user menu, command palette.

| Screen | Route | Key UI regions |
| --- | --- | --- |
| Hub | `/` | Greeting and ask box, slash command menu, recent chats list, agent picker |
| Apps | `/apps` | Grid of app cards with icon, title, category |
| Chat | `/chat`, `/chat/:chatId` | Conversation list rail with search and pins, message list, input with attach and voice, agent picker, artifact side panel, header with menu |
| Chat projects | `/chat/projects`, `/chat/projects/:projectId` | Project list, project detail with its chats |
| Chat artifacts | `/chat/artifacts` | Grid of generated documents with filters |
| Scheduled chats | `/chat/scheduled` | List of scheduled conversations |
| Chat only | `/ui/chat`, `/ui/chat/:chatId` | Full width chat, no sidebar |
| Message view | `/view/:messageId` | Single shared message render |
| Artifact view | `/artifact/:artifactId`, `/artifacts/:artifactId` | Full artifact render with export |
| Artifacts | `/artifacts` | Table of context artifacts |
| Agents | `/agents` | Search, card or list of agents, create button |
| Agent form | `/agents/:id` | Header with save and delete, tabs General, Behavior, Tools, Skills, Knowledge, Triggers, Procedures, Voice, Permissions, Advanced |
| Automations | `/automations`, `/automations/:automationId` | List with status and next run; form with agent, instruction, trigger editor, conversation mode |
| Prompts | `/prompts`, `/prompts/:id` | Prompt library by category; editor with versions |
| Summary prompts | `/summary-prompts`, `/summary-prompts/:id` | Same layout as prompts |
| Flows | `/flows` | Flow list with search |
| Flow canvas | `/flows/:flowId` | Node rail, canvas, node settings modal, run history, run viewer |
| Procedures | `/procedures`, `/procedures/:procedureId` | List with status and tier; detail with steps, schemas, approval banner |
| Intelligence (memory) | `/memory`, `/memory/policies/:id` | Tabs for records and policies, memory cards, policy form |
| Skills | `/skills`, `/skills/:id` | Skill grid by category; detail with tools, knowledge, MCP, prompts |
| Sources (knowledge) | `/knowledge`, `/knowledge/:id` | List with status; detail tabs General and Status, inputs modal |
| Tables | `/data`, `/data/new`, `/data/:tableId`, `/data/:tableId/:recordName`, `/data/:tableId/edit` | Table list, builder, grid view, record view |
| Dashboard | `/dashboard` | Number cards, charts, filters |
| Executions | `/executions` (tabs Runs, Analytics), `/executions/:runId` | Filterable run table; analytics dashboard; run detail with messages, tool calls, feedback |
| Analytics detail | `/analytics/:dimension/:entity` | Entity metrics and trend |
| Playground | `/playground` | Config strip, prompt panel, response panel, compare view, run ledger, trace rail |
| Batch jobs | `/batch-jobs` | Table of batch jobs with status |
| Meetings | `/meetings`, `/meetings/:meetingId/record`, `/meetings/:meetingId` | Meeting cards; recorder with timer and controls; detail with player, transcript, summary, chat, context prompt |
| Gateways | `/gateways`, `/gateways/:settingId` | Gateway list; detail with provider, policies, bindings, access list, readiness and test send |
| Integrations | `/integrations`, `/integrations/:settingId` | Connected account cards; settings detail |
| Integration services | `/integration-services`, `/integration-services/:serviceId` | Service catalogue; service form |
| MCP servers | `/mcp`, `/mcp/:mcpId` | Server list; detail tabs for connection and tools |
| AI providers and models | `/providers`, `/models` | Provider cards with keys; model table |
| Code execution | `/execution-profiles`, `/execution-profiles/:id` | Profile list; limits form |
| SSH connections | `/ssh-connections`, `/ssh-connections/:id` | Connection list; form |
| Network policies | `/network-policies`, `/network-policies/:id` | Policy list; rule table |
| Members | `/members` | People table with roles, add member |
| Roles | `/roles`, `/roles/:id` | Role list; capability checklist |
| Settings | `/settings`, `/settings/general`, `/settings/developer` | Tabs Agent defaults, Voice / STT, Add-ons; General form; Developer with API keys and docs |
| Not found | `*` | Empty message with link home |
