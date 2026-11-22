# Loyal Arrow: feature catalogue

Source of truth: code at integration/master-2, index build 1c2ad34f (read-only). Loyal Arrow is a loyalty and retention app that runs on Huf (and on Frappe/ERPNext). It already has `loyal-arrow-desk` in the mock registry. This catalogue lists what the code does today, in plain words, for writers and mock makers.

Conventions: "(off by default)" means the feature is built but a setting, plan switch or draft state keeps it off until the owner turns it on. Roles named are the real Frappe roles in code.

## Contents

1. Members and identity
2. Earning points and stamps
3. Redeeming rewards and coupons
4. Tiers
5. Referrals
6. Counter app (cashier PWA)
7. Customer app (member PWA) and public pages
8. Messaging and consent
9. Campaigns, journeys and automations
10. Audiences and lifecycle
11. Reports, dashboards and insights
12. Integrations and connectors
13. API and webhooks
14. Huf agents
15. Safety, privacy and audit
16. Settings, setup and branding
17. Roles
18. Planned, not yet built
19. Gaps a writer should not claim
20. Screens for mocks

## 1. Members and identity

- **Member record**: one person per programme, keyed by mobile number, with name, tier, balance and history. Gives the shop a single customer file.
- **Multiple identities per member**: extra phones or identifiers attach to one member. Stops duplicate customers when someone changes number.
- **Enrolment at the counter**: cashier adds a customer with phone, name and recorded consent. Gets a customer into the programme in seconds.
- **Self check-in poster QR (off by default)**: customer scans a poster, enters phone and a code, and lands on a pending list for the cashier. Cuts queue time; needs the Self check-in plan switch.
- **Mobile number change with OTP**: cashier moves a member to a new number after a code is confirmed. Keeps the balance with the person, not the SIM.
- **CSV member import**: upload or paste a CSV, map columns, dry-run, then import with opening balances; an import can be rolled back. Brings an existing customer list in safely; imported members are never messaged until consent is recorded.
- **Competitor CSV presets**: ready column mappings for other loyalty exports. These are guesses, not checked against the real products.
- **Member merge**: join two duplicate members into one and carry history over. Cleans up the customer base.
- **Member attributes**: custom attributes and date attributes (birthday, anniversary) per member. Powers occasion messages and segments.
- **Member 360 screen**: one page with profile, balance, ledger, timeline, messages, consent and requests. Support answers a customer without hunting through screens.
- **Member card with QR and barcode**: printable card and sticker for each member (Code 128 and QR). Lets cashiers scan instead of typing.
- **Member requests with states**: configurable request types, states and transitions (for example change a detail). Gives staff a tracked queue for member asks.
- **Served-by staff tag**: record which staff served a bill (off by default; scheme switch). Lets owners see who drove repeat visits.

## 2. Earning points and stamps

- **Programme (scheme) setup**: name, currency, point label, earn rate, rounding and expiry for each programme. This is the heart of how customers earn.
- **Amount-based earn**: points per amount spent, with rounding choice and a base of net before or after discount. Simple and fair earning.
- **Earn classes**: different rates by item, category or brand, or fixed points per unit, with quantity caps. Rewards high-margin items more.
- **Earn exclusions**: skip promo-priced items, service items, small bills, or lines with heavy discounts. Stops points on items you do not want to reward.
- **Earn windows (happy hours)**: bonus multipliers by weekday and time of day, with a daily bonus cap, a rehearsal mode and an option to trust claimed times. Fills quiet hours.
- **Rule engine**: rules of type earn, burn, tier, milestone and bonus, with conditions, priority, stack groups, versions and date limits. Lets managers shape the programme without a developer.
- **Every-Nth-visit, spend-in-period and bonus rules**: built from the rule engine. Drives repeat visits.
- **Birthday, anniversary and festival rules**: date-driven bonuses from member dates and a holiday calendar. Gives customers a reason to return on special days.
- **Stamp cards**: visit stamps toward a reward, with stamp progress at the counter. Fits cafes and salons (on by default in plan; scheme sets stamps per reward).
- **Prepaid visit packs**: sell a pack such as five visits, use one visit at a time, undo the last use, and audit uses. Sells prepaid services without a cash wallet.
- **Pending points (off by default)**: hold points until the return window ends or the bill is paid, then release. Protects against returns and unpaid invoices.
- **Release schedule**: scheduled sweep releases pending points; lazy release on read stays authoritative. Customers see points arrive without staff action.
- **Points expiry**: lots expire on a schedule; expiring-soon warnings go out before they do. Controls liability and nudges visits.
- **Earn simulation and Rule Simulator**: try a bill and see what it would earn, explain a rule, or replay a rule on recent events (dry run only). Lets managers test before going live.
- **Earn preview at the counter**: live "points this bill" preview while the cashier types the amount. Customers see the benefit before paying.
- **Negative balance policy**: choose to clamp at zero (default) when a return takes points below zero. Avoids unfair debt.
- **Manual adjustments with approval**: staff request a points adjustment and a manager approves it. Keeps corrections traceable.
- **Industry presets**: starter setups for cafe, cafe with stamps, cafe volume, clinic, electronics, salon, salon with stamps, plus programme presets for dining, fuel, grocery and retail. Shortens setup.
- **Points value**: set the money worth of one point (default 1 rupee). Used to show members what points are worth and to value liability.

## 3. Redeeming rewards and coupons

- **Reward catalogue**: rewards of type discount, item, voucher or benefit, with points cost, tier minimum, stock, validity and public offer text. The menu members spend on.
- **Public offers**: rewards can carry a public title, terms and slug for display. Lets rewards show on the member app.
- **Redeem by QR, PIN or OTP**: member shows a QR, gives a manager PIN, or confirms a code. Protects balances.
- **Redeem without a code up to a limit**: set an amount under which no code is needed (default 200 rupees; 0 means always ask). Keeps small redemptions fast.
- **Redemption holds**: a reward is held for a short time (default 10 minutes) then confirmed or released. Prevents double spend between quote and bill.
- **Redeem quote, hold, confirm**: three-step flow used by the counter, the API and the ERPNext POS. Safe and repeatable.
- **Daily redemption cap per customer (off by default)**: limit points used per day. Reduces abuse.
- **Partial redeem against a bill**: points act as a discount on part of a bill. Works with other payment types.
- **Coupon campaigns**: percent off, amount off, free item or bonus points, with code prefix, audience, per-member limits, budget cap and rehearsal mode. Targeted offers with a cost ceiling.
- **Coupon code check and redeem**: validate a code and redeem it once, at the counter or by API. Stops reuse.
- **Reward issue records**: each reward given is logged with cost and use. Supports reward performance reporting.
- **Bill voids and undo**: undo a bill within a window (default 30 minutes) with a reason; manager approval path for later voids; shift close totals. Fixes mistakes without losing the audit trail.
- **Duplicate bill block**: bill number check and a repeat-amount warning. Stops the same bill earning twice.
- **Bill claims by members (off by default)**: a member claims points for a bill by number. Recovers missed earns.

## 4. Tiers

- **Tier ladder**: named tiers with points to reach, earn boost, benefits and downgrade grace days. Gives customers something to climb.
- **Tier ladder editor**: add, reorder and preview tiers with checks (each tier needs more points, higher tier cannot earn less). Prevents broken ladders.
- **Qualification by metric and window**: tiers qualify on a chosen metric over a chosen window. Lets owners pick spend, points or visits.
- **Automatic upgrade and downgrade review**: a daily job moves members, with history and grants. Keeps tiers current.
- **Tier-change message**: a template tells the member when they move tier. Celebrates progress.

## 5. Referrals

- **Referral campaigns**: reward the referrer and the friend, with minimum spend, hold days, caps and anti-fraud policy. Grows the base through word of mouth.
- **Referral codes and links**: each member gets a code and a share link; a join page lets the friend accept the notice and verify by code. Makes sharing easy.
- **Referral at enrolment**: scan or type a code while enrolling. Credits the right referrer.
- **Reward hold and clawback**: rewards release after a hold period and are taken back if the qualifying bill is reversed. Stops gaming.
- **Referral fraud screening**: signals logged and reviewed in a report. Protects the budget.

## 6. Counter app (cashier PWA)

- **Counter home**: shift summary (bills, points earned, redeemed, voided) and shortcuts. Shows the cashier's day.
- **Scan member card**: camera QR scan with torch and manual code fallback. Fastest way to find a member.
- **Find member**: search by mobile, card code, name or ID. Works when no card is at hand.
- **One-screen bill**: keypad amount, live points, optional bill number and coupon, redeem toggle, Add points, then Undo for a few seconds. Under a few seconds per bill.
- **Scanner mode (off by default)**: tuned for a barcode scanner acting as a keyboard. Speeds up counters with scanners.
- **Visit pack use and undo**: use one visit or undo the last use from the member card. Handles prepaid services.
- **Void requests inbox**: managers approve or reject undo requests. Controls late voids.
- **Pack audit**: visit use, undo and void per cashier over a date range. Catches misuse.
- **Check-ins inbox and audit**: approve self check-ins and review them. Needed when poster check-in is on.
- **Consent screen**: find a member, tick channels, or record an opt-out. Keeps messaging legal at the till.
- **Cashier quick-switch with PIN**: swap cashier on a shared device. Keeps actions tied to the right person.
- **Offline handling**: banner and card when offline; queued earns replay when back online; other writes fail closed. Avoids silent errors.
- **Install and cache**: service worker and reload guard so the app opens fast and updates safely.
- **Friendly error copy**: plain-language errors with retry that reuses the same bill key so nothing books twice.

## 7. Customer app (member PWA) and public pages

- **Member sign-in by OTP**: phone and 6-digit code over WhatsApp, SMS fallback offered; choose programme if the number is in several. No passwords.
- **Home**: points balance, worth in money, pending and expiring points, tier ring, rewards, stamp card and recent activity. The member's daily reason to open the app.
- **Reward cards**: ready, nearly there and locked states with progress. Motivates the next visit.
- **My QR card**: the member's card and a one-time redeem token. Lets members redeem without staff typing.
- **Activity history**: earned, redeemed, expired, adjusted and reversed lines, grouped by day. Builds trust.
- **Referral card**: show code, share link and stats. Drives sharing.
- **Add to Apple or Google Wallet (off by default)**: save the card as a wallet pass that updates with the balance. Needs wallet issuer keys per programme.
- **Notifications inbox**: in-app messages from the shop. A free channel that always works.
- **Profile**: name, mobile, tier, sign out, privacy controls. Self-service basics.
- **Privacy self-service**: view and change consents, export my data, erase my data, each confirmed by code. Meets data-rights duties.
- **Hide modules**: owner can hide parts of the app; theme follows brand colours. Keeps the app focused.
- **Offline cached home**: last known balance shows with an "as of" time when offline. Still useful on weak signal.
- **Languages**: English with Hindi locale table; Arabic and Hindi review strings are held back until reviewed. Serves local customers.
- **Self check-in page**: public page where a customer enters mobile and code at the poster link (off by default). 
- **Referral join page**: public page for invited friends. Starts a referral.
- **Visit page and card link**: public page behind a printed QR. Opens a member's card view without sign-in.
- **Unsubscribe page**: one-click email unsubscribe. Required for email marketing.
- **Wallet pass pages**: public endpoints for wallet pass download and device updates (off by default with wallet).

## 8. Messaging and consent

- **WhatsApp as main channel**: guarded sending through Huf with template messages. Highest open rate for Indian shoppers.
- **Message templates set**: enrolment confirmation, points earned, points pending, points released, reward issued, reward redeemed, referral reward earned, tier changed, special date offer, points expiring. Covers the main moments.
- **Template status panel**: shows which templates Meta approved, which are out of date or paused. Avoids failed sends.
- **Template gallery**: read-only preview of every message members can receive. Helps owners review wording.
- **WhatsApp setup page**: checks, allowed test phones, opted-in counts and go-live steps. Guides the owner to a safe launch.
- **Sending switch, emergency stop and rehearsal**: "Sending to customers" is off by default, rehearsal (dry run) is on by default, and an emergency stop blocks everything. Prevents accidental sends.
- **Test-phone mode (off by default)**: send only to listed test phones. Safe testing in production.
- **Send guard**: every send re-checks consent, opt-out, quiet hours, daily caps and kill switch. One place that keeps messaging safe.
- **Quiet hours**: no sends from 9pm to 9am by default, with optional per-programme override (off by default). Respects customers.
- **Daily message caps**: per site (default 5) and per customer (off by default). Limits spam risk.
- **SMS channel (off by default)**: generic gateway with URL template, DLT ids, sender id and auth modes; also sends login codes (off by default). Fallback and OTP in India.
- **Email channel (off by default)**: sends through a Frappe email account with test allowlist. Third channel.
- **Channel fallback (off by default)**: WhatsApp, then SMS, then email after a wait (default 30 minutes). Reaches more people.
- **Mock channel**: stand-in channel for tests. Safe rehearsal.
- **Message log and activity page**: every message with outcome and reason; delivery outcome codes explained in plain text. Answers "did it send".
- **Outbox with retries**: events queue, back off, and deliver by a worker; stuck queues raise an alert. No lost messages.
- **Inbound WhatsApp webhook**: receives replies and delivery statuses (signed, guest-allowed). Updates logs and routes replies.
- **Opt-out handling**: stop words and counter opt-outs honoured; re-opt-in gap (default 24 hours). Legal safety.
- **Consent records and snapshots**: per channel (whatsapp, sms, email) with source and wording version. Proof of consent.
- **Consent wording approval gate**: consent text must be marked legally approved. Stops unreviewed wording.
- **Message intents and notification types**: registry of notification types, channels, categories (utility, marketing, authentication) and quiet-hour exemptions. Lets new messages be added cleanly.
- **Allowed recipients list**: test recipients. Used by test mode.

## 9. Campaigns, journeys and automations

- **Campaign wizard**: pick audience, template, schedule, review blockers, approve the plan, then queue. Safe one-off sends.
- **Campaign approval**: manager approves or rejects with a reason. Second pair of eyes.
- **Campaign results and attribution (off by default)**: counts and visits within a window (default 7 days) after a message. Shows what worked.
- **Automations page**: switch ready-made automations on or off per programme (all start off) and set days. Always-on retention without code.
- **Journeys**: versioned journeys with trigger (event, schedule, audience entry), entry mode, cooldowns, exclusions and success event. Multi-step flows for power users.
- **Journey seeds**: welcome, birthday, post-purchase, recall, win-back and expiry warning. Starter flows.
- **Recall reminders**: remind a customer to rebook after set days per service, with a scan job. Lifts salon and clinic repeats.
- **Calendar console**: upcoming occasions, birthdays and anniversaries, with preview and announce modes (off, preview, live; default off). Plan occasion messages with control.
- **Public holiday calendar**: bundled holiday data feeds occasion messages. Saves typing dates.
- **Special-day job**: daily scan queues occasion offers through the guarded path. Hands-free greetings.

## 10. Audiences and lifecycle

- **Segments**: static or dynamic audiences with a filter builder, hourly and daily refresh, counts and memberships. Targets the right customers.
- **Segment cohorts**: saved snapshots of who was in a group. Lets reports compare over time.
- **Audience size preview**: see how many can receive a message before sending. No surprises.
- **Lifecycle stages**: members classified into stages by editable rules, with history. Shows who is new, active or slipping.
- **Lapsing and win-back lists**: reports and flows for customers about to lapse or returning. Retention focus.

## 11. Reports, dashboards and insights

- **Dashboard page**: programme picker with live tiles and charts. Daily health at a glance.
- **Number cards**: members, new members, bills today, points earned and redeemed, points outstanding, expiring in 30 days, rewards issued and used, tier upgrades, messages sent and blocked, consent withdrawn, outbox waiting, events received. Quick numbers.
- **Setup progress cards**: location, cashier, counter, scheme live, customers imported, redeem limit, WhatsApp templates, cards and stickers. A go-live checklist.
- **Dashboard charts**: earn vs redeem, points per day, redemptions per day, new members per week, members by tier, messages per day and by outcome, outbox status, events per day, referral funnel.
- **Workspaces**: Loyal Arrow home, Getting started, Members, Points and Rewards, Messaging, Operations, Approvals, Reports, Insights, ERPNext, Advanced and Internal records. Role-friendly navigation.
- **Reports (36)**: Active Rate, Adjustments and Approvals, Basket Uplift, Campaign Attribution, Cohorts, Customer Lifetime Value, Earn Leakage, Earn vs Redeem Trend, Expiry Forecast, Integration Health, Lapsing Customers, Ledger Audit, Liability and Aging, Loyalty Earn Breakdown, Loyalty Liability, Loyalty Pending Points, Loyalty Today, Member Growth and Activation, Milestones, Native Loyalty Balances, Program ROI, Redemption Rate and Breakage, Referral Fraud Review, Referral Funnel, Repeat Rate, Reward Performance, RFM Segments, Rule Effectiveness, Rule Simulation, Source Earn Reconciliation, Staff Activity, Tier Distribution, Tier Migration Matrix, Top Customers, Unconfirmed POS Redemptions, WhatsApp Funnel, Winback Returns. Answers money and retention questions.
- **Liability and breakage**: outstanding points value, aging lots and breakage. What the programme owes.
- **Insights add-on (optional)**: ready workbooks, charts and views (la01 to la11) when the Insights app is installed; detected by feature, not version. Deeper analysis.
- **Audit and Reconciliation page**: read-only log of who changed what and when. For owners and auditors.
- **Nightly reconcile**: checks totals each night and raises alerts. Catches drift early.

## 12. Integrations and connectors

- **ERPNext adapter**: invoices and POS invoices earn points, returns reverse them, pending release waits for payment, with backfill of old invoices. Loyalty inside the ERP.
- **ERPNext POS redeem**: hold then confirm on the POS bill with failed-confirm retry and a report of unconfirmed ones. Redeem at the till.
- **ERPNext setup, health and leakage**: setup doctype, health cards (invoices without a loyalty event) and leakage report. Finds missed earns.
- **ERPNext native loyalty import**: read or migrate balances from ERPNext's own loyalty. Eases moving over.
- **Connectors folder (webhook mappings)**: CSV, generic webhook, Odoo, Shopify, WooCommerce, Zoho Books, Zoho Inventory, Zoho POS, each with a mapping and sample payloads. One event per sale or refund, no code needed. These are mappings and docs; the source system posts to the webhook-in endpoint.
- **Event sources and types**: registry of sources, event types, mapping presets and a connector kit with a manifest schema. Adds new systems cleanly.
- **Event intake**: events stored with idempotency, retry and skip logs. Safe against duplicates.
- **Locations and external ids**: shops and outlets with their ids in other systems. Multi-store.
- **Plan limits**: caps for members, marketing messages, locations, staff and import rows. Supports tiered pricing.

## 13. API and webhooks

- **Public API v1**: earn, reverse, returns, bills, redeem quote, hold and confirm, voucher validate and redeem, member lookup, enrol, update, identities, wallet, statement, tier and stamps, referral attribute. Lets any system plug in.
- **Member API**: OTP login, session, me, home, wallet, history, tier, rewards, referral, card, notifications, stamps, app config, bill claim, consents, privacy export and erase. Powers the member app.
- **API clients and keys**: scoped keys with signing, idempotency keys and request log; production keys gated (off by default). Controlled partner access.
- **Error catalogue and OpenAPI**: consistent error codes and a generated spec. Easier integration.
- **Outbound webhooks (off by default)**: signed event delivery to endpoints with retry, rotation of secrets and auto-disable after failures. Feeds other systems.

## 14. Huf agents

- **Campaign assistant**: drafts campaign copy and template suggestions; cannot send. Faster writing.
- **Points expiry notifier**: reacts to points-expiring events and asks the guarded send path for the template. Nudges before loss.
- **Referral monitor**: flags odd referrals and logs one follow-up; cannot approve or message. Fraud triage.
- **Support triage**: looks up a member and logs a follow-up note; cannot adjust points. Helps staff.
- **Member concierge (off by default)**: WhatsApp answers on balance, tier, rewards, redemption and referral. Self-service support.
- **Restricted member concierge (off by default)**: read-only pilot version. Safer rollout.
- **Churn analyst (off by default)** and **Program analyst (off by default)**: read-only managers' analysts; their tools return not-implemented today.
- **Agent tools**: award points, get balance, get member, get profile, list rewards, redeem reward, create and check referral, preview segment, get report, send template, log follow-up. The actions agents may use.
- **Agent triggers**: manager question webhook, points expiring, referral review. Starts agents from events.
- **Reply gate**: inbound messages are dropped unless live, verified, consented and within rate. Keeps agents safe.

## 15. Safety, privacy and audit

- **Append-only ledger**: every point change is a row with reason; nothing is edited. Trust and audit.
- **Idempotency everywhere**: same request twice books once. Prevents double earn.
- **Fraud signals**: self-dealing guard (on by default), duplicate checks, nightly screen. Blocks staff gaming.
- **Privacy requests**: export and erase with identity check and retention cleanup. Data-rights compliance.
- **PII masking and retention**: masked views and scheduled cleanup. Reduces exposure.
- **Audit log**: changes recorded and viewable. Accountability.
- **Health alerts**: heartbeat, stuck outbox and kill-switch independent alerts every 5 minutes. Early warning.
- **Uninstall and install guards**: policy checks on install and uninstall. Protects data.

## 16. Settings, setup and branding

- **Setup wizard**: business name, country, industry, earning examples, redeem limit, sample data, templates and Go live. First-run path.
- **Simple mode (on by default)**: hides advanced options. Easier for small shops.
- **Plan switches**: Stamps (on), Campaigns (on), Customer app (on), Self check-in (off). Packages the product.
- **Business locale**: country, state and dial code defaults. Correct phone handling.
- **Brand settings**: product name, short name, colours, logo, favicon, theme mode, optionally applied to the desk (off by default). White-label look.
- **Data capture switches (all off by default)**: attribution, point value on ledger rows, reward cost, non-member bills, enrolment source, bill claims. Opt-in analytics.
- **Demo and seed data**: sample data and scenario seeds for training. Fast demos.
- **Translations**: Hindi and Malayalam source tables for the desk. Local language staff.

## 17. Roles

- **Loyalty Administrator, Manager, Operator, Analyst, Auditor**: desk roles with rising or narrower rights.
- **Loyalty Cashier and Loyalty API Service**: no desk access; counter and API only.
- **Loyalty Integration Service and Agent Service**: service users for integrations and Huf agents.

## 18. Planned, not yet built

Claimed in planning documents but not found as working code:
- Family or household accounts (shared pool or dependants).
- B2B account members with several buyer contacts, and quarterly volume rebates.
- Stored-value cash wallet or top-up (decided out for v1).
- Weighted or loose item earn rules beyond net value.
- Appointment or booking view.
- Verified competitor import formats (presets exist but are unverified guesses).
- Churn and program analyst tools (agents exist but tools return not-implemented).

## 19. Gaps a writer should not claim

- Do not say messages send out of the box: sending, SMS, email, fallback and webhooks are all off until switched on, and rehearsal is on by default.
- Do not say the member concierge or analysts are live: they ship disabled.
- Do not call connectors "plug and play apps": they are payload mappings and setup notes.
- Do not claim Apple or Google Wallet works without the programme's issuer keys.
- Do not claim a household, cash wallet or B2B feature.
- Do not claim production deployment or paid billing: plan limits exist, billing does not.
- Do not claim live message approval status without a template check; approval comes from Meta.
- Do not quote deployment, merge or test pass numbers from planning documents.
- Do not claim Arabic is shipped: Arabic review strings are pending review in the member app.
- Do not claim stock-level or SKU-level data at the standalone counter: the counter takes a bill amount, not line items.

## 20. Screens for mocks

### Counter app (route prefix /counter)

- **Counter home** `/counter/`: shift summary tiles (Bills, Points earned, Points redeemed, Voided); shortcut tiles Scan, Find, Enrol, New bill, Check-ins, Mobile change, Consent; manager tiles Void requests, Pack audit, Check-in audit.
- **Scan** `/counter/scan`: camera preview with frame hint and torch, "Enter code instead" box, member result, buttons Continue to bill, Scan next card.
- **Find member** `/counter/find`: search box (mobile, card code, name, ID), result list, "No member found" with Enrol new member, Continue to bill.
- **Enrol** `/counter/enrol`: details form (name, mobile), consent ticks, optional referral code, result with card.
- **Bill** `/counter/bill`: member header with tier and balance, amount display, number pad, points hero (live preview), Redeem points toggle, bill number link, coupon field, Add points button; success screen with points added and timed Undo; error panel with retry.
- **Void** `/counter/void`: bill summary, reason picker, Request manager approval, Keep bill, Yes undo; waiting for manager state.
- **Void requests** `/counter/void-requests`: inbox list of pending requests with approve and reject.
- **Check-ins** `/counter/checkins`: pending self check-ins list; **Check-in audit** `/counter/checkins/audit`: dated audit list.
- **Consent** `/counter/consent`: find member, channel tick boxes (whatsapp, sms, email), opt-out section.
- **Mobile change** `/counter/mobile-change`: find member, new number, code entry, confirm.
- **Switch cashier** `/counter/switch`: staff list and PIN pad.
- **Pack audit** `/counter/pack-audit`: From and To dates, Show audit, results table per cashier.
- **Offline states**: offline banner, offline card, offline pending list.
- Bottom tab bar: Scan, Find, Bill, Inbox, More. Chips: Till, clear member.

### Customer app (route prefix /app-member)

- **Login** `/app-member/login`: country code and mobile field, Send my code; code entry with 6 boxes, Sign in, Use a different number, Try SMS instead; programme chooser.
- **Home** `/app-member/`: greeting, balance hero (points, worth, pending, expiring), tier ring, stamp card, reward cards, referral card, wallet add button, recent activity list, "as of" line.
- **Notifications** `/app-member/notifications`: inbox list, empty "all caught up", offline error.
- **Profile** `/app-member/profile`: name, mobile, tier, consents, export and erase data, Sign out.
- Bottom tab bar with Home, Inbox, Profile.
- Read-only card view from printed QR (`/app-member/` with token, scrubbed from the address bar).

### Public pages

- **Self check-in** `/self_checkin`: mobile number, Send code, code entry, unavailable message.
- **Referral join** `/referral_join`: "You were invited", mobile number, Accept notice and send code, code entry.
- **Member card page** `/m` and **visit page** `/visit`, **offer page** `/o`: card or offer view behind a printed QR or link.
- **Email unsubscribe**, **wallet pass download**: single-action pages.

### Desk (Frappe desk, role based)

- **Loyal Arrow Setup** `/app/loyal-arrow-setup`: steps for business name, country, industry, earn examples with a bill amount try-out, redeem limit, templates, sample data, Go live.
- **Loyalty Dashboard** `/app/loyalty-dashboard`: programme selector, number cards, charts.
- **Member 360** `/app/member-profile`: member picker, profile header, balance, ledger, timeline, messages, consent, requests.
- **Import Members** `/app/loyalty-import`: programme, source, file upload or paste, column mapping, consent attestation, dry run result, Import, Roll back.
- **Rule Simulator** `/app/rule-simulator`: pick a rule, member, bill amount, optional date, Run, result and explanation; advanced replay and event JSON.
- **Tier ladder** `/app/loyalty-tier-ladder`: programme picker, tier cards (points to reach, boost, benefits), Edit tiers, Add tier, Preview.
- **Automations** `/app/loyalty-automations`: programme picker, list of automations with On/Off switch, days field, details panel.
- **New campaign** `/app/loyalty-campaign-wizard`: steps Campaign name, Audience (count shown), Message template, Schedule, Before you send checks, Approve plan.
- **Calendar console** `/app/loyalty-calendar-console`: mode banner, upcoming occasions, occasion messages, held-back members, announcement campaigns.
- **Message activity** `/app/loyalty-message-activity`: filter bar and message list with outcome.
- **Message templates** `/app/loyalty-template-gallery`: read-only cards for each template.
- **WhatsApp setup** `/app/loyalty-whatsapp-setup`: readiness checks, template approval table, test phones, opted-in count, go-live steps.
- **Audit and Reconciliation** `/app/loyalty-audit`: DocType filter and read-only change log.
- **Reports** `/app/query-report/<report name>`: 36 script reports (see section 11) with filters and tables.
- **Workspaces** `/app/loyal-arrow`, `/app/loyalty-members`, `/app/loyalty-points-and-rewards`, `/app/loyalty-messaging`, `/app/loyalty-operations`, `/app/approvals`, `/app/loyal-arrow-reports`, `/app/loyal-arrow-insights`, `/app/loyalty-erpnext`, `/app/loyal-arrow-advanced`: shortcut tiles, number cards, charts, recent lists.
- **Form and list screens**: Loyalty Settings, Scheme, Rule, Reward, Tier, Segment, Coupon Campaign, Referral Campaign, Journey, Member, Ledger Entry, Message Log, Adjustment Request, Webhook Endpoint, API Client, Location, Staff, Wallet Issuer, Plan Limits.
