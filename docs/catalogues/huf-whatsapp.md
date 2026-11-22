# Huf WhatsApp Channel: Feature Catalogue

Scope: WhatsApp Cloud API inside Huf (gateway adapter, agent tools, provider hooks) plus the Channels app track (WhatsApp first, then Telegram, Slack, Teams in the same shell).

Sources read:
- Base code: `huf/ai/gateway_adapters/whatsapp.py`, `whatsapp_hooks.py`, `huf/ai/tools/whatsapp.py` and the sibling `whatsapp_*` modules, on the Channels track branch `track/wa-channels` (also on `origin/track/wa-channels`; the track's own status file says it was merged to `pre-develop` on 2026-10-30).
- Base ref `pre-develop` c21cd5268 has only a small adapter (229 lines), four agent tool actions (send_message, send_template, list_messages, get_account_info) and a template composer. It has no `whatsapp_hooks.py`. Everything else below is on the track branch.
- Track notes: `Huf/Tracks/safwan-erooth.WhatsAppApp` (PLAN.md, IMPLEMENTATION_STATUS.md). Plan text is used only for the "Planned" section.
- Not verified live: Helpdesk, CRM, ERPNext and LMS hand-offs and live sends were tested with mocks in the track notes, except the live Meta checks listed under Gaps.

## Contents
1. Connect and set up
2. Receiving messages
3. Sending messages
4. Templates
5. Broadcasts and audiences
6. Consent and opt-out
7. Who answers: routing, hours, hand-off
8. Agent tools
9. Commerce
10. Integrations with other apps
11. Calling and voice
12. Analytics and cost
13. Safety, permissions and settings
14. Other channels
15. Background jobs
16. Records (doctypes)
17. Screens for mocks
18. Planned, not yet built
19. Gaps a writer should not claim

## 1. Connect and set up
- **Guided 6-step setup**: Choose how to connect, Credentials, Webhook, Test, Who answers, Access policy. Resumes where the server says you are, so a business owner can finish setup without a developer.
- **Setup stage badge**: each number shows one of eight stages (not connected, connected unverified, receiving, live but unrouted, live, degraded, blocked, off). Tells you at a glance what to fix next.
- **Connect with Facebook (Embedded Signup) (off by default)**: link a business WhatsApp account through a Meta pop-up instead of pasting keys. Three modes: direct (the site's own Meta app), broker (a self-hosted site goes through Huf Cloud) and central broker (Huf holds tenant keys, exchanges codes and forwards signed webhooks).
- **Credential fields**: phone number ID, access token, webhook verify token, app secret. The app secret is required because inbound events are checked with it.
- **Webhook verification**: answers Meta's subscribe check with the verify token; refuses mismatches.
- **Token check**: tests the saved access token against Meta, on demand or forced, and reports expiry or rejection.
- **Credential sync**: keeps the Huf gateway and the optional `frappe_whatsapp` account in step.
- **Account event handling**: reacts to Meta account changes (disconnects, number or quality changes) and feeds them into health.
- **Health banner with reasons**: healthy, degraded, blocked, not set up or disabled, with plain reasons (rejected token, missing app secret, failed signature, delivery failures, rejected fallback template).
- **Setup checklist and test message**: shows credentials, webhook, first inbound, and a test round trip.
- **Chat-based setup helper**: the Hub assistant can pair a gateway and run health checks, and asks for secrets through a masked prompt that stores them in a short-lived stash (not in chat history). Tool-call logs hide those values.
- **Launcher access control**: the WhatsApp tile opens for admins even with zero gateways, so first setup is possible.

## 2. Receiving messages
- **Signature check on every event**: rejects any POST that lacks a valid Meta HMAC-SHA256 signature. Stops fake messages.
- **Text, button replies, list replies**: understood as text.
- **Media in**: images, documents, audio, video and stickers come in as attachments and are saved.
- **Reactions, replies and forwards**: reactions are recognised as reactions; quoted and forwarded flags are kept.
- **Location and contact cards in**: normalised into the event (via the inbound module).
- **Delivery status updates**: sent, delivered, read and failed update the message log; a status that arrives before its message is parked and applied later.
- **Template status, quality and category updates**: Meta approvals and quality changes flow in and update template state.
- **Typing and read indicator**: marks the message read and shows typing while the agent works. On by default; can be switched off per number.
- **Ordering and duplicate protection**: events are stored once and stuck events are reaped.

## 3. Sending messages
- **Text reply with quoting**: replies as a reply to the customer's message.
- **Long reply splitting and formatting**: long answers are split into parts and formatted for WhatsApp (bold, lists).
- **Media, voice note, sticker, location, contact, reaction, interactive (buttons and lists)**: all sendable by gateway.
- **Send by file upload or link, with link checks**: media links are checked before sending.
- **24-hour window rule**: free text is blocked outside 24 hours of the last customer message; a template must be used.
- **Fallback template**: if a free-text reply is blocked by the window, a chosen template goes out instead.
- **Typed send errors**: Meta errors are turned into plain messages (for example permanent recipient errors are not retried).
- **Duplicate-send protection**: send keys stop the same message going twice.
- **Outbound allow-list guard**: an agent can only message numbers on a per-number allow-list when one is set.
- **Each send logged**: recorded in the WhatsApp message log (and `frappe_whatsapp` if installed).
- **Message log with filters**: browse and filter sent and received messages.
- **Agent reply to a customer from the app**: staff can send text or a template on a conversation, return it to the AI, or close it.

## 4. Templates
- **Template list with status and quality badges**: approved, pending, rejected, paused.
- **Template wizard**: Type, Write (header, body, footer, buttons), Review, with samples, live preview and Meta-rule checks.
- **Create, edit, delete, sync**: pushed to Meta; sync pulls Meta's state back.
- **Shared-template warning**: editing or deleting a template used elsewhere asks you to acknowledge.
- **Agent template drafts**: agents can propose templates for a human to approve or reject (off by default; "Agent may draft templates").
- **Agent auto-submit (off by default)**: "Agent templates skip approval".
- **Template guard**: stops a Desk save or delete from re-pushing or removing Huf-owned templates on Meta.
- **Send template with fill-in values**: body placeholders filled in order.
- **Utility templates pack**: one click submits a ready set (order, payment, cart) to Meta.

## 5. Broadcasts and audiences
- **Broadcast wizard**: Template, Recipients, Consent, Preview, Confirm.
- **Recipients from a pasted list, CSV upload or saved audiences**: with per-recipient variable columns; missing values use defaults.
- **Audiences**: saved lists with import (background job and status), add, remove, list members.
- **Audience selection preview**: shows who would be included or blocked before you start.
- **Pre-flight checks**: template approved, audience valid, number's sending limit and quality, consent attested. Blocking issues stop the start; warnings must be acknowledged.
- **Consent attestation**: you state where consent came from before sending.
- **Cost preview**: estimated spend per broadcast.
- **Start, pause, resume, cancel, pause all**: full run control, plus a gateway-wide pause.
- **Scheduled broadcasts**: pick a time; a job starts them when due.
- **Retry failed**: re-send only the failed recipients.
- **Live progress**: realtime counts per status; a detail view lists recipients (phone numbers masked).
- **Sending limits panel**: shows Meta's tier, quality rating and throughput and lets you set your own caps.
- **Stale run recovery and status sweep**: stuck broadcasts resume; pending statuses are reconciled.
- **Audit trail**: broadcast actions are recorded.

## 6. Consent and opt-out
- **Opt-out keywords (STOP, UNSUBSCRIBE, CANCEL, END, QUIT)**: a customer who sends one is unsubscribed, with a confirmation reply (editable).
- **Opt-in keywords (START, UNSTOP, SUBSCRIBE)**: resubscribes.
- **Opt-in sources (off by default)**: inbound `[ref:...]` tag, API record, and CSV import with an attestation note.
- **Import opt-ins and record opt-in API**: for consent collected elsewhere.
- **Kill switch and marketing opt-in check**: proactive sends (reminders, cart recovery) require opt-in and respect a global stop.
- **Sender limits section on the gateway**: opt-out text and keywords live with the number.

## 7. Who answers: routing, hours, hand-off
- **Default target**: an agent or flow answers by default.
- **Agents and Solutions tab**: switch a solution on a number Live or off.
- **Routing rules**: ordered rules (match on text, attribute and so on) send a conversation to a chosen agent, solution or flow. Reorderable, each can be switched off.
- **Business hours with holidays**: weekly hours and date exceptions; applies to all channels.
- **After-hours mode**: keep the agent on 24/7 (default), or send an away template.
- **Hand-off to a human**: target none (default), Help Desk or CRM, with a message to the customer. While handed off, the AI stays silent.
- **Return to AI and close**: staff hand the conversation back or end it.
- **Reply sync from Help Desk**: staff replies in the other app go out on WhatsApp.
- **Run-as user and role**: automation actions run as a chosen user, with an audit stamp on records it creates.
- **Private reply policy**: in groups, answer where asked or privately.
- **Pairing reply**: unknown senders can get a pairing code reply, limited per day (default 20).
- **Access policy**: allow-list by default; manage who may chat (Access tab).

## 8. Agent tools
- **WhatsApp tool actions**: send message, media, voice note, location, contact, reaction, products, template; list messages; get account info; list templates; create template; get template status.
- **Send WhatsApp Flow tool**: send a Meta Flow form with a button.
- **Product messages tool**: send single or multi-product cards from the catalogue.
- **Hand-off tool**: pass the chat to a human.
- **Create ticket tool**: Help Desk ticket from the chat.
- **Create lead tool**: CRM lead from the chat.
- **ERP tools**: look up customer by phone, create order, order status.
- **LMS tools**: list courses, enroll, my progress, send certificate.
- **Credential fallback**: tools use the number's saved credentials unless given explicitly.

## 9. Commerce
- **Catalogue sync from ERPNext items**: pushes items to the Meta catalogue (needs a catalogue ID); runs daily or on demand.
- **Product messages**: single, list and multi-product.
- **Inbound cart to order**: a customer's cart becomes a draft Sales Order or a WhatsApp Order record.
- **Order cards and drawer**: staff see order items and status.
- **Payment links (off by default)**: ERPNext, Razorpay or Stripe, chosen per number (default none). Signed webhooks mark orders paid.
- **Order confirmed message (off by default)**: a template sent on payment.
- **Cart recovery (off by default)**: hours-after nudge for abandoned carts (0 means off).
- **WhatsApp Flows**: list flows from Meta, send one, store responses.

## 10. Integrations with other apps
- **Help Desk adapter**: ticket creation, two-way replies, ticket updates back to the chat.
- **CRM adapter**: find or create a lead by phone; notes; ad-referral info.
- **ERPNext adapter**: match customers by phone; orders and status.
- **LMS adapter**: member match by phone; lesson reminders (off by default, needs a template and opt-in).
- **Connections screen**: cards showing which apps are installed and linked.
- **frappe_whatsapp bridge (optional)**: messages are mirrored when that app is present.
- **Web chat widget and click-to-chat**: wa.me link with prefill and ref tag, QR code (built in), and an embeddable widget snippet.

## 11. Calling and voice
- **Voice note replies (off by default)**: agent answers a voice note with a voice note (needs ffmpeg).
- **Calling (experimental) (off by default)**: answer calls with a greeting, optional reply and closing audio, max length (default 60 seconds).
- **Call permission request**: ask a customer's permission to call.
- **Call settings and actions**: read and change per number.

## 12. Analytics and cost
- **Analytics screen**: message volume (in vs out), broadcast funnel, template quality, estimated spend; date range.
- **Editable rate card**: per-region message prices used for estimates.
- **Home counters**: conversations, AI-resolved, handed off, template sends.

## 13. Safety, permissions and settings
- **Signature check, fail closed** (section 2).
- **Secret stash**: short-lived storage for secrets entered in chat.
- **Role checks**: broadcasts, audiences and replies check read and write per gateway; the reply API needs a "channels.reply" permission.
- **Settings panels (WhatsApp)**: Credentials, Policy, Access, Run-as, Widgets, Business hours, Replies, Danger zone, Connect with Facebook.
- **Per-number toggles**: typing indicator (on), voice replies (off), calling (off), pairing reply (on), agent proactive sends outside 24h (off).

## 14. Other channels
- **Telegram, Slack, Teams in the shell**: appear in the channel switcher; Home, Activity, Automations, Analytics, Connections, Settings (Connection, Run-as, Business hours) work for them; Broadcasts, Templates, Commerce are WhatsApp only. Provider credentials still live on the old per-provider pages.

## 15. Background jobs
- Every 5 min: resume stale broadcasts, start due scheduled broadcasts, sweep pending statuses.
- Hourly: cart recovery.
- Daily: catalogue sync, lesson reminders, purge expired send keys and secrets.

## 16. Records (doctypes)
Channel Conversation, Channel Rate Card, Channel Reminder Log, Channel Embedded Signup Settings, Gateway (with business hours, holidays, routing rule, consent children), Huf Secret Stash, WhatsApp Audience, Audience Member, Broadcast, Broadcast Recipient, Broadcast Settings, Flow Cache, Flow Response, Order, Order Item, Send Key, Status Pending, Template Draft, Template State.

## 17. Screens for mocks
Shell: full-screen app with a 248px left rail, a channel switcher (WhatsApp, Telegram, Slack, Teams) plus number switcher, and a top bar. Base route `/channels/:channel/n/:gw/...`. `/whatsapp` redirects to `/channels/whatsapp`.

| Screen | Route | Key regions |
|---|---|---|
| Setup wizard | `/channels/whatsapp/setup` | Left stepper (6 steps), step body, setup banner, Connect with Facebook choice, webhook URL and verify token copy fields, test message panel |
| Home | `.../home` | Setup banner or stage badge, counters (Conversations, AI-resolved, Handed off, Template sends), health banner, checklist |
| Activity | `.../activity/:conversationId?` | Conversation list with status and search, thread view, reply box with text or template, Return to AI and Close buttons |
| Broadcasts | `.../broadcasts` | List with status chips, New broadcast wizard (5 steps), detail with progress and recipients, limits panel, audiences page |
| Templates | `.../templates/:name?` | List with status and quality badges, detail pane with preview, wizard (Type, Write, Review), drafts panel, send dialog |
| Commerce | `.../commerce/:tab?` | Tabs Catalog, Orders, Payments, Automations, Flows; order drawer |
| Automations | `.../automations/:tab?` | Tabs Agents and Solutions, Routing rules (table), Business hours, Handoff rules, Run-as user |
| Analytics | `.../analytics` | Date range, volume chart, broadcast funnel, template quality, estimated spend with rate card editor |
| Connections | `.../connections` | Cards per app (Help Desk, CRM, ERPNext, LMS) with installed or not state |
| Numbers | `/channels/whatsapp/numbers` | List of numbers with setup stage and health |
| Settings | `.../settings/:section?` | Panel list (Credentials, Policy, Access, Run-as, Widgets, Hours, Replies, Facebook, Danger), form on the right; widgets shows wa.me link, QR, snippet |

## 18. Planned, not yet built
- Delivery and read receipts checked on a real phone by non-owner numbers (only the owner phone was tested live).
- Embedded Signup go-live: Meta Tech Provider verification, app review and a config ID are not done.
- Dedicated Telegram, Slack, Teams broadcasts, templates and commerce (shell only).
- Rate card prices are estimates; filling real prices is a setup task.

## 19. Gaps a writer should not claim
- Do not claim "Connect with Facebook" works for customers today; code exists, Meta approval does not.
- Do not claim live Help Desk, CRM, ERPNext or LMS flows were proven end to end; track notes say mocks, plus a later bench run with the apps installed.
- Do not claim media replies exist on the old base adapter; only the track adapter sends media.
- Do not claim Telegram, Slack or Teams have broadcasts, templates or commerce.
- Do not claim group chats are supported on WhatsApp; the adapter treats chats as one-to-one.
- Do not claim spend figures are billed amounts; they are estimates.
- Do not claim calling is production ready; it is labelled experimental.
- Do not claim the pre-develop base has any of sections 4 to 12; they come from the track branch.
- Do not claim proactive sends (reminders, cart recovery, payments) are on; all are off until configured.
