# Loyal Arrow feature catalogue

This is a plain-English list of what Loyal Arrow does today, written for content writers who build blogs, brochures, decks and videos. Every line was checked against the shipped code on the live merge line (`integration/master-2`, merge of PR #373), not against plans. Each feature has one line: the name in bold, then what it does and why a retailer cares.

How to read the labels:

- **(beta, off by default)** means the feature is built but switched off, and is still being proven. Do not promise it as generally available.
- **(setting, off by default)** means the feature is finished but the retailer has to switch it on in settings.
- No label means the feature works out of the box.

Loyal Arrow runs inside Frappe and works with or without ERPNext. A retailer can use its own counter app, a standalone customer app on the member's phone, WhatsApp for messages, and a set of reports and dashboards. Money is stored in whole minor units (paise, fils) so there are no rounding drift errors.

## Table of contents

1. [Programme setup](#1-programme-setup)
2. [Earning points](#2-earning-points)
3. [Referrals](#3-referrals)
4. [Redemption and rewards](#4-redemption-and-rewards)
5. [Reversals, voids and returns](#5-reversals-voids-and-returns)
6. [Tiers](#6-tiers)
7. [Expiry and liability](#7-expiry-and-liability)
8. [Members](#8-members)
9. [Counter and POS](#9-counter-and-pos)
10. [Member app (PWA)](#10-member-app-pwa)
11. [Campaigns and messaging](#11-campaigns-and-messaging)
12. [Journeys and automations](#12-journeys-and-automations)
13. [Audiences and segments](#13-audiences-and-segments)
14. [Retail space](#14-retail-space)
15. [Analytics and reports](#15-analytics-and-reports)
16. [Dashboards and workspaces](#16-dashboards-and-workspaces)
17. [Arrow AI](#17-arrow-ai)
18. [Fraud and risk](#18-fraud-and-risk)
19. [Finance](#19-finance)
20. [Privacy and security](#20-privacy-and-security)
21. [Admin and ops](#21-admin-and-ops)
22. [Integrations and APIs](#22-integrations-and-apis)
23. [Planned, not yet built](#planned-not-yet-built)
24. [Gaps a writer should not claim](#gaps-a-writer-should-not-claim)

---

## 1. Programme setup

- **Points or stamps programmes** Run a points scheme or a stamp-card scheme (for example, 10 visits for a free coffee) from the same product, so one tool fits cafes, salons and supermarkets.
- **Multiple programmes** Run more than one programme on one site, each with its own rules, tiers, rewards, members and reports, so a group with several brands keeps them apart.
- **Custom unit names** Call the currency "points", "stars", "visits" or anything else, with singular and plural forms, so the programme speaks the brand's language.
- **Currencies with 2, 3 or 0 decimals** Money works correctly in INR and AED (2 decimals), KWD, BHD, OMR, JOD and similar (3 decimals), and zero-decimal currencies, so Gulf retailers are not forced into wrong rounding.
- **Points value** Set what one point is worth in money (for example 1 point = 0.25 rupee), which drives redemption value and the liability figure.
- **Earn rate and rounding** Set how many points per unit of spend, whether the bill is taken before or after discounts, and whether tax is included, so earning matches the retailer's pricing.
- **Programme dates and status** Give a programme start and end dates and a Draft or Active status, so a programme is tested before customers see it.
- **Industry starter templates** Start from ready programme templates for grocery, retail with tiers, cafe stamp card, salon visit stamps, clinic care points, dining and fuel per-litre, so setup takes minutes instead of days.
- **Industry presets in setup** Presets for cafe, salon, clinic and electronics pre-fill the earn rules, expiry and referral settings for that trade.
- **Setup wizard** A step-by-step wizard covers business details, industry, earn rules, redeem limit and a test bill, and says what is still missing.
- **Test bill simulator** Try a sample bill before going live and see exactly how many points it would earn, so there are no surprises at the counter.
- **Go-live checklist** One screen shows what is ready and what blocks launch (programme active, sends on, templates approved, counter set up).
- **Simple and Advanced desk modes** A Simple mode hides the heavy menus for small shops; Advanced shows everything, so the same product suits a one-store owner and a head office.
- **Plan feature switches** Stamps, campaigns, the customer app and self check-in can each be turned on or off per plan, so a retailer only sees what they pay for.
- **Plan limits** Caps on members, locations, staff, monthly marketing messages and import rows can be set per plan, with a usage banner so owners see how close they are.
- **Programme-level overrides** Message limits, quiet hours, OTP limits can be set per programme and fall back to site defaults.
- **Brand theming** Set product name, short name, colours, logo, favicon and light or dark theme so the customer app and desk carry the retailer's brand.
- **Locations** Add stores with codes, address, map link, opening hours, timezone, format, size band and region, so reports and rules can work store by store.
- **Public store page** A store can publish a visit page with name, hours and map link for customers to find it (setting, off by default).
- **Location groups and zones** Group stores into clusters (for example "Mall stores") and map categories to zones in a store, which later drives cluster-level reports and promo planning.
- **Service categories** Define which service items earn points and at what price, so salons and clinics earn on services as well as products.
- **Staff records** Create cashiers and managers with a PIN, a home store and daily limits on bills, points, redemptions and money.
- **Demo data toggle** Switch on clearly marked demo members and locations to explore the product, then remove them without touching real ledger data.

## 2. Earning points

- **Bill-based earning** A completed bill earns points automatically from its value, so staff never calculate by hand.
- **Minimum bill** Ignore bills below a set amount so tiny purchases do not clutter the ledger.
- **Rules engine** Build earn, bonus, burn, tier and milestone rules from a no-code builder with conditions on amount, member, tier, location and history, so marketing can change offers without a developer.
- **Rule versions** Every rule change creates a new version with a checksum, and each award is stamped with the version that earned it, so audits can explain any past balance.
- **Rule priority and stack groups** Rules have a priority and can be put in a group where only the first match applies, so two offers do not pay twice by accident.
- **Stack cap** A cap can limit the total points one bill earns across all stacked rules, keeping promotions affordable.
- **Rule simulator** Replay real past events against a rule before publishing it and see how many members match and how many points it would cost.
- **Earn simulation by bill** Enter a basket and see the points per line and the total, with the reason for each line, so cashier questions are answered in seconds.
- **Line-level earn rules** Set different earn rates by SKU, brand or category, such as double points on a category or fixed points per unit (beta, off by default).
- **Item exclusions** Exclude whole categories or items from earning, such as tobacco or gift cards, with a per-line explanation of why (beta, off by default).
- **Double or no points presets** One-click presets add "double points on an item group" or "no points on an item group", with a before and after quote before anything changes (setting, off by default).
- **Promo and discount guards** Skip points on promo-priced items, on service items, or on lines discounted beyond a set percentage, so heavy markdowns do not also give points.
- **Tier earn multipliers** Higher tiers earn points faster (for example Gold earns 1.5x), which gives members a reason to climb.
- **Earn windows** Run happy hours and weekend boosts with a multiplier by day and time, with a daily bonus cap and a rehearsal mode (setting, off by default).
- **Event count milestones** Reward the 5th, 10th or 20th purchase with bonus points, tracked per member.
- **Date-based bonuses** Birthday and anniversary bonuses trigger a set number of days before the date from the member's recorded dates.
- **Pending points** Hold earned points until the return window ends or the bill is paid, so returns cannot create free points (setting, off by default).
- **Backdating window** Bills can be entered after the fact within a limited window, so a late invoice still earns.
- **Bill claim** A customer who forgot to give a number can claim a recorded bill later from the member app, so the points are not lost.
- **Member-less bills** Bills with no member are still recorded and counted, so the retailer sees how much sales it fails to attribute.
- **Staff attribution** Record which staff member served the customer so service quality and sales can be credited (setting, off by default).
- **Stamp earning** One qualifying visit earns exactly one stamp, with progress shown as a stamp card.
- **Prepaid visit packs** Sell a pack of visits (for example 10 haircuts) that is used up one visit at a time at the counter, with an audit view of pack use.
- **Recall reminders** Remind a member when a service is due again (for example a six-month check-up) using a per-service interval (setting, off by default).
- **Idempotent awards** The same bill sent twice never pays twice, so POS retries and network glitches are safe.
- **Daily award totals** Per-member daily award totals back the caps, so one member cannot farm points in a day.

## 3. Referrals

- **Referral programmes** Create a referral campaign with a reward for the referrer, a reward for the friend, start and end dates, and caps, so word of mouth becomes a managed channel (setting, off by default per programme).
- **Personal referral codes and links** Each member gets a code and share link they can send by WhatsApp or any app.
- **Attribution window** A friend who joins within a set number of days after the invite is credited to the referrer.
- **Qualifying event** A referral only pays after the friend does a qualifying thing, such as a first bill above a minimum spend.
- **Reward hold** Referral rewards wait a set number of days before they are released, so returned or fake purchases do not pay out.
- **Referral clawback** If the qualifying bill is reversed or the referral turns out to be fraudulent, the reward is taken back automatically within a clawback window.
- **Referral states** A referral moves through invited, attributed, qualified, rewarded, rejected, held or clawed back, so staff can see exactly where each one stands.
- **Referral guards** Self-referral, repeated identity and velocity checks screen referrals before reward.
- **Referral funnel report** Shows invites, joins, qualified and rewarded referrals, so the owner can judge the programme's return.
- **Referral messages** The friend invite and the referrer reward notice go out as approved WhatsApp templates.

## 4. Redemption and rewards

- **Rewards catalogue** Create rewards of four types: discount, free item, voucher and non-cash benefit, each with a points cost, so members always have something to aim for.
- **Reward value cap and cost** Cap a reward's money value and record the retailer's own unit cost, so the true cost of rewards is known.
- **Reward stock** Limited stock can be set per reward, so scarce rewards run out cleanly.
- **Reward validity** Rewards can have start and end dates or a number of days valid after being issued.
- **Minimum tier for rewards** Lock premium rewards to Silver, Gold or higher, so tiers feel valuable.
- **Reward terms** Add plain-language terms to each reward shown to members.
- **Public offer pages** Publish a reward as a public page with title, description, terms and a store to visit, for sharing outside the app (setting, off by default).
- **Voucher issuing** Redeeming a reward issues a voucher with a unique code that is later used at the counter.
- **Voucher validation and use** A voucher code can be checked and marked used from the counter or API, and cannot be used twice.
- **Redemption quote** Before the member commits, the system shows the discount and points to be spent.
- **Redemption holds** Points are held while a bill is being rung up and released if the sale is abandoned, so a member cannot spend the same points twice.
- **Hold expiry** Unused holds expire automatically after a short time so points are never locked forever.
- **Counter redeem** Cashiers redeem points or a voucher for a member directly on the bill.
- **OTP for large redemptions** Redemptions above a set value need a code sent to the member's phone, so a stolen card or number cannot drain a balance.
- **Redemption rules** Set a minimum redeem amount, a redeem step, a maximum share of the bill, and a daily maximum, so redemption stays affordable.
- **Counter coupons** Create coupon campaigns (percent off, amount off, free item or bonus points) with budgets, minimum bill, usage per member and exclusivity groups, then redeem codes at the counter (setting, off by default).
- **Adjustment requests** Staff request a points change with a reason, evidence and amount, and a different person must approve it, so no single employee can create points.
- **Adjustment limits** Per-request and per-day limits on adjustments protect against abuse.
- **Adjustment reasons** A managed list of reasons (goodwill, error fix and so on) with a flag for which need approval.
- **Reward requests inbox** Member requests for rewards and support follow a managed workflow with states and due times.

## 5. Reversals, voids and returns

- **Void a bill** A cashier can void a bill within a set window and the earned points are taken back.
- **Void approval** Voids outside the window or above a limit go to a manager for approval before they apply.
- **Void reasons** Require a reason from a managed list, so voids are explainable at the day-end close.
- **Return handling** A returned item reverses the points it earned, fully or in part.
- **Redeemed points refund** Voiding a bill that used points gives those points back to the member.
- **Clawback** Points can be clawed back after the fact for fraud or error, with a visible ledger row.
- **Shortfall handling** If a member already spent points that a return takes back, the shortfall is recorded instead of failing or silently going negative.
- **Negative balance policy** Choose to disallow negative balances or to record the debt and recover it from later earning.
- **Append-only ledger** Nothing is edited or deleted; every reversal is a new row pointing at the original, so history is always auditable.
- **Plain-language ledger** Each ledger row can be read as a sentence ("Earned 120 points on bill B-102"), so support staff can explain it to a customer.
- **Member merge** Merge two duplicate member records, moving balance, expiry dates, pending points, contact, consent and referral links to the survivor.

## 6. Tiers

- **Tier ladder** Define Bronze, Silver, Gold or any ladder with a threshold and a points multiplier per tier, with a visual ladder editor.
- **Qualification by points, spend or visits** Choose what moves a member up: points earned, money spent or number of visits, over a rolling window.
- **Automatic upgrades** Members move up as soon as they qualify, with a history row showing why.
- **Downgrades with grace** Members who fall below a tier get a grace period before they drop, so one quiet month does not cost them status.
- **Daily tier review** A daily job re-checks all members for time-based downgrades.
- **Tier invitations and manual grants** Managers can grant a tier by invitation or manually for a set period, with approval and expiry, so VIPs can be welcomed in.
- **Tier benefits** Each tier carries a benefits description and an earn multiplier shown to members.
- **Tier history** Every change records from, to, direction, reason and the data that qualified the member.
- **Tier change message** Members get a WhatsApp message on upgrade.
- **Tier ring in the member app** Members see progress to the next tier and how many points remain.
- **Tier distribution and migration reports** Show how many members sit in each tier and how they moved between tiers over time.

## 7. Expiry and liability

- **Expiry modes** Choose fixed expiry (for example 12 months), rolling expiry, or no expiry at all.
- **Lot-based expiry** Each earn is tracked as its own lot with its own expiry, so the oldest points expire first and the numbers are exact.
- **Expiry warnings** Members are warned a set number of days before points expire, so they come back to spend them.
- **Daily expiry run** A daily job expires lots and writes expiry rows to the ledger.
- **Expiry forecast** Shows points that will expire in the next 30, 90 or up to 730 days by tier and location, so the owner can plan campaigns.
- **Points liability** Shows total outstanding points and their money value, split into expiry bands (0-7, 8-30, 31-90, over 90 days), so finance knows what the programme owes.
- **Expected redemption view** Liability can be shown at an assumed redemption rate, because not every point will be spent.
- **Pending points report** Lists held points separately and never mixes them into the liability total.
- **Expiring points card** A dashboard card shows points expiring in 30 days.

## 8. Members

- **Enrolment at the counter** Staff sign up a customer in seconds with a mobile number and consent, so the line does not stop.
- **Self-registration** Customers can join themselves from the member app or a store QR, with an OTP to prove the number.
- **Self check-in by poster QR** A printed poster with a QR code lets customers check in and join themselves, with staff review of check-ins (setting, off by default).
- **Phone verification by OTP** One-time codes by WhatsApp (and optionally SMS) confirm a number, with attempt, daily and resend limits.
- **Member number and QR card** Each member has a number, a scannable QR card in the app, and a printable plastic or paper card with a barcode.
- **Card printing** Print membership cards in bulk with the retailer's branding.
- **Mobile number change** A member's number can be changed safely by verifying both old and new numbers, so accounts are not hijacked.
- **Multiple identities** A member can have more than one verified identity (phone, email, external customer id).
- **Household** Link family members into one household with invites, roles and a primary member, for household-level views (beta, off by default).
- **Preferred language** Members choose English, Hindi or Malayalam for the app and messages.
- **Member 360** One page per member with profile, balance, tier, history, rewards, messages, consent, wallet pass and an attention flag, so support answers in one place.
- **Member attributes** Store custom facts (birthday, anniversary, preferences) used for segments and bonuses.
- **Member requests** A support-style request workflow (with states, owners and due times) handles member issues and privacy requests.
- **Consent records** Every consent is stored by purpose (service or marketing) and channel (WhatsApp, SMS, email), with source and time, never overwritten.
- **Consent snapshots** The consent in force at the time of each send or campaign is stored, so you can show what was true then.
- **Consent opt-in at the counter** Staff capture consent per channel on a counter screen with the right wording.
- **Opt-out by reply** A member who replies STOP is opted out immediately and START opts them back in when it is clearly their own number.
- **Member list export** Export members to CSV for approved users.
- **Member import** Bulk import customers and opening balances from CSV, with column mapping, a dry run, a consent attestation and one-click rollback.
- **Competitor import presets** Header presets for common exports (generic Excel, Zoho-style, Shopify customers, Loyverse-style) speed up moving from another system.
- **Lifecycle stages** Members are classified into stages (new, active, at risk, lapsed and so on) by rules, with a history of stage changes.
- **Apple and Google Wallet pass** Members can add their card to Apple Wallet or Google Wallet and the pass updates with balance (beta, off by default).

## 9. Counter and POS

- **Counter app** A touch-friendly web app for the till, installable on a tablet or PC, for quick member lookup, earn and redeem.
- **Staff login by PIN** Cashiers switch between users with a PIN, with lock-out after failed tries.
- **Member lookup** Find a member by phone, name, member number or scanned card.
- **Barcode and QR scan** Scan a member card or a voucher with a camera or a USB scanner, with a dedicated scanner mode.
- **Bill entry and quote** Enter the bill amount, see points to be earned and the redemption option, then confirm.
- **Redeem with OTP** Large redemptions ask for the code the member receives.
- **Void and void requests** Void a bill, or raise a request for a manager to approve.
- **Day-end close** A manager closes each store's day with expected cash, declared cash, variance, voids and points per cashier, locked once closed.
- **Check-in review** Approve or reject customer self check-ins at the counter, with an audit view.
- **Visit pack use and undo** Use a visit from a prepaid pack and undo a mistake.
- **Counter enrolment** Create a member at the till with the right consent boxes.
- **Counter consent screen** Capture or change marketing consent for a member at the till.
- **Counter mobile change** Change a member's number at the till with verification.
- **Offline mode** The counter caches the member chips it has seen, shows an offline banner and queues safe writes to send when the connection returns, with a list of pending and failed items.
- **Staff limits** Per-cashier daily limits on bills, points, redemptions and money.
- **Self-dealing guard** Stops staff from awarding points to themselves.
- **Duplicate bill guard** Refuses the same bill number twice in a short window.
- **ERPNext POS and Sales Invoice earning** Invoices in ERPNext earn points automatically on submit, with B2B customer groups excluded.
- **POS redemption in ERPNext** A cashier can apply points to a POS invoice with a hold, a receipt block showing balance, and release if the sale is cancelled.
- **Unconfirmed POS redemption recovery** Failed or unconfirmed redemptions are retried automatically up to three times and listed for a manager to retry or resolve.
- **Independent mode without ERPNext** The counter app and the REST API let any system, or no system, run the programme with no ERPNext at all.
- **Receipt block** A balance and points-earned block for printing on the receipt.

## 10. Member app (PWA)

- **Installable member app** A mobile web app members add to the home screen, no app store needed.
- **OTP sign-in** Members log in with their number and a one-time code, with a remembered session.
- **Home screen** Balance, tier, expiring points and a next-best action in one view.
- **QR card** A scannable card that rotates its token so a screenshot cannot be reused.
- **History** A clear list of earn, redeem and expiry rows in plain language.
- **Rewards list** Rewards the member can afford or is saving for, with redemption.
- **Stamp card** A stamp-card view with a fill animation for stamp schemes.
- **Tier view** Progress ring to the next tier with benefits.
- **Referral card** Share a code or link and see referral status.
- **Notifications** An in-app list of messages and alerts.
- **Wallet pass add** Add the loyalty card to Apple or Google Wallet (beta, off by default).
- **Consent controls** Members can grant or withdraw marketing consent per channel.
- **Privacy self-service** Members can request a copy of their data or ask for erasure, after a step-up code.
- **Bill claim** Claim points from a bill that was rung up without their number.
- **Languages and direction** English, Hindi and Malayalam text, with right-to-left layout support built in.
- **Light and dark themes** The app follows the phone's theme with brand colours.
- **Cached home** The home screen shows the last known balance when the network is slow or down.
- **Accessibility** Contrast, focus and screen-reader checks are part of the build.
- **Module switches** Individual app sections can be turned off per site.

## 11. Campaigns and messaging

- **WhatsApp as the main channel** Messages go out as approved WhatsApp templates through the Huf messaging gateway.
- **Template library of 36** The pack includes 36 ready templates in three classes (service, marketing, sign-in code): enrolment, points earned, balance reply, reward issued and redeemed, tier changed, points expiring, points pending and released, referral invite and reward, win-back, special-date offer, new reward, birthday, welcome gift, tier upgrade, festive offer, anniversary, we-miss-you, favourite item, percent off, buy-one-get-one, feedback ask, visit-us, OTP codes, and image, video, PDF, copy-code and carousel layouts.
- **Template gallery** Browse every template with a plain status badge (ready, waiting, rejected, paused, not submitted) and a preview in any language.
- **Template approval tracking** The live approval status from WhatsApp is synced, and templates that are not approved are never sent.
- **Template images** Generate branded header images for templates from a style, headline and palette.
- **Campaign builder** Create a campaign with an objective, an audience, a template and a budget in a guided wizard.
- **Campaign approval** A second person approves a campaign before it can be scheduled.
- **Campaign scheduling** Schedule a send, or cancel or pause it later.
- **Dispatch plan preview** See who will receive the message and who will be skipped, and why, before approving a send.
- **Pause and resume** Pause a running dispatch and resume it, so a mistake is stoppable.
- **Campaign results** See sent, delivered, read and failed counts per campaign, and the members who came back (attribution).
- **Message log** Every message has a row with outcome, template, language, delivery status and a plain-language "why" explanation.
- **Message outbox** All outgoing messages go through a reliable queue with retries, backoff and replay.
- **Send guards** Before each message the system checks consent, template approval, opt-out, quiet hours, daily caps and allow-lists, so unsafe sends are blocked with a clear reason.
- **Quiet hours** No messages at night, per programme or site.
- **Daily caps** A cap per day overall and per member per day limits message volume.
- **Rehearsal (dry run) mode** Every site starts in rehearsal where nothing is actually sent, until the owner switches sending on.
- **Emergency stop** A kill switch halts all sending immediately; safe stop and release are one click.
- **Allowed recipients list** In test mode only listed numbers can receive messages, so tests never reach real customers.
- **Environment mode** Test and live modes keep sandboxes safe.
- **Email channel** Email messages can be sent as a fallback with an unsubscribe link (setting, off by default).
- **SMS channel** SMS sends and SMS OTP through a configurable provider with a sender id (setting, off by default).
- **Channel fallback** If WhatsApp fails or is not allowed, the system can wait a set time and try email.
- **Delivery status updates** Sent, delivered, read and failed updates come back from the gateway.
- **Inbound replies** Replies, button taps and STOP or START keywords are processed and routed.
- **Calendar console** A calendar of festivals and special days with a console to switch holiday messages on, in dispatch or announce mode.
- **Festival calendars for India and UAE** Built-in public holiday calendars for India and the UAE for 2026 and 2027, with region-aware entries.
- **Message attribution** Link a purchase to the last message the member received within a window (setting, off by default).
- **Plain-language reasons** Every skip or block is explained in business wording, never as a raw code.

## 12. Journeys and automations

- **Journey builder** Build automated flows on a canvas with triggers, waits, branches, message steps and goals.
- **Trigger types** Start a journey on an event, on a schedule or when a member enters an audience.
- **Wait steps** Wait a set time or until an event occurs before the next step.
- **Branching** Send members down different paths by conditions.
- **Message and offer steps** Send a template or make an offer visible to the member, then end.
- **Goal tracking** Define a success event (for example a visit within 14 days) and see how many reached it.
- **Holdout groups** Keep a share of members out of a journey to measure its real effect.
- **Entry rules** Set re-entry cooldowns, a maximum number of live journeys per member, priority and exclusion groups so members are not over-messaged.
- **Draft, version and publish** Edit safely in a draft, validate it, simulate it, send a test, then publish a numbered version.
- **Ready-made journeys** Welcome, win-back, expiry warning, birthday, post-purchase and recall journeys ship as drafts in rehearsal mode (setting, off by default).
- **Journey activity view** See each member's path, the step results and why a step was skipped.
- **Automations list** A simple list to switch ready-made automations on or off with a preview.
- **Safety rule for journeys** Journeys can send messages but never create points or coupons themselves, so no flow can silently give away value.

## 13. Audiences and segments

- **Segment builder** Build audiences from conditions with no code, combined with AND or OR, with a live member count as you build.
- **Static and dynamic segments** A static list stays fixed; a dynamic segment refreshes hourly or daily as members enter and leave.
- **Saved segments** Name, update and archive segments for reuse across campaigns.
- **Frozen cohorts** Freeze a segment at a moment in time so a campaign and its results use the exact same group.
- **Segment history** Entry and exit times show who joined or left an audience.
- **Consent applied automatically** A marketing audience always excludes members without marketing consent.
- **Audience count preview** See how many people a message will reach before sending.
- **RFM segments** Group members by recency, frequency and spend, with stable segment codes for targeting.
- **Lapsing and lapsed customers** Find members about to go quiet or already gone, with days since last purchase and lifetime spend.
- **Win-back audience by category** Members who used to buy a category but stopped, within a chosen number of days.
- **First-time category buyers** Members new to a category in the last N days.
- **Bought leaf** Members who bought a category, brand or SKU in a window (beta, off by default).
- **Festival shoppers** Members who shopped inside a festival window, honouring a festival opt-out (beta, off by default).
- **Basket mission leaf** Members whose bills are stock-up, top-up, meal-for-tonight or festival baskets (beta, off by default).
- **Bulk and private-label share** Members whose spend leans to bulk buys or the retailer's own brand (beta, off by default).
- **Sensitive category protection** Health, pharmacy and baby categories are blocked from audience use.
- **Lifecycle stage audiences** Use stages such as new, active, at risk or lapsed as audiences.
- **Special day audiences** Birthday and anniversary audiences from member dates and lead days.
- **Unknown-data handling** Members with no recorded history are never guessed into a segment unless asked.

## 14. Retail space

Most retail features need item-level bill lines to be recorded, which is a programme switch and is off by default. Beta items below are built and tested but gated.

- **Product catalogue** Maintain SKUs with name, English and Arabic labels, brand, supplier, pack size, private-label and regulated flags, and import them from CSV or sync from ERPNext items.
- **Category tree** Build a multi-level category hierarchy with English and Arabic labels, roles (destination, routine, seasonal, convenience, impulse) and sensitivity, with a preview before saving.
- **SKU to category mapping** Map every SKU to a category node with valid dates and a mapping version, so reports can be restated when the map changes.
- **Mapping exceptions** Items that cannot be mapped are listed for staff to resolve or ignore, so reports are not silently wrong.
- **Event lines** Record one line per item on every sale and return, with category, brand, supplier, quantity and net amount (beta, off by default).
- **Event line archive** Old lines move to cold storage nightly with a retention period.
- **Category by store matrix (heatmap)** See sales of each category in each store as a heatmap to spot gaps (beta, off by default).
- **Category penetration** Share of members who buy each category (beta, off by default).
- **Share of wallet** How much of a member's spend each category captures (beta, off by default).
- **Identified share** The share of sales tied to a known member, so the retailer sees how much of the business the programme sees (beta, off by default).
- **Zone table and treemap** View sales by store zone (for example front of store, aisle) as a table or treemap (beta, off by default).
- **Category basis comparison** Compare category results on different measures (beta, off by default).
- **Category affinity** Show which categories are bought together with support, confidence and lift, plus a next-best-category suggestion (beta, off by default).
- **Basket classifier** Tag each bill as stock-up, top-up, meal for tonight or festival, nightly (beta, off by default).
- **Missions** Create category missions (breadth, depth, trial, pack trade-up, private-label switch, fresh attach) with targets and rewards, tracked per member and period (beta, off by default).
- **Festival and retail windows** Define festival windows with lead-in dates, region and recurrence, and compare festival performance with a preview of mission effect (beta, off by default).
- **Store clusters** Group stores and read results by cluster.
- **Promo placement** Plan where a promo is placed in a store (fixture type, dates, SKUs), confirm it and record execution checks with photos.
- **Placement lift** Measure how a promo placement changed sales using matched store pairs, so the result is fairer than before-and-after.
- **Retail experiments** Run store-level and member-level tests with holdouts and a frozen assignment, and read the result (beta, off by default).
- **Four-arm experiments** Combine store and member tests in a 2x2 design (beta, off by default).
- **Change review** Before changing categories, SKUs or placements, request a review with a dry-run of the impact and an approve or reject decision.
- **Snapshot pinning** Pin a version of the category map for a report or contract, so results stay reproducible.
- **Range review** Open a case on a weak SKU or category, attach evidence, decide and close it (beta, off by default).
- **Supplier funding agreements** Record supplier-funded offers with scope, cost per point, share, cap and settlement basis (beta, off by default).
- **Supplier funding ledger** Track what each supplier owes against the points their offers generated, with reconciliation and an export for claims (beta, off by default).
- **Supplier reports** Prepare supplier-facing reports that a manager approves, freezes and can later revoke, with minimum-group-size protection (beta, off by default).
- **Retail readiness check** A checklist shows whether the data is ready for each retail feature.
- **Retail aggregates** Nightly category, member and affinity tables keep reports fast.
- **Taxonomy restatement** When the category map changes, history is restated nightly.

## 15. Analytics and reports

All reports need a programme filter, respect user permissions and store scope, and show members by id only, with no phone or email in the output. Roles are Loyalty Administrator, Loyalty Manager and System Manager unless noted.

- **Active Rate** The share of enrolled members who bought in the last N days.
- **Adjustments and Approvals** Every manual points change with value, requester, approver, time to decide and a self-approval flag.
- **Basket Uplift** Average order value before and after enrolment for the same members.
- **Campaign Attribution** Messages sent per campaign and members who came back and bought afterwards.
- **Cohorts** Retention by the month members first transacted, up to 12 months out.
- **Customer Lifetime Value** Revenue-based lifetime value by tier or cohort (revenue, not profit).
- **Earn Leakage** Invoices that earned no points, with an estimate of points missed, per company (shown when ERPNext is connected).
- **Earn vs Redeem Trend** Points earned, redeemed, expired, reversed and adjusted per day, week or month.
- **Expiry Forecast** Points expiring over the next days by date, tier and location.
- **Integration Health** Outbox status counts, retries, oldest pending age and event lag.
- **Lapsing Customers** Members whose last purchase is old, with days since and lifetime spend.
- **Ledger Audit** The full ledger with running balance per member, filterable by type and date.
- **Liability and Aging** Unexpired points by time to expiry with face and policy-valued liability.
- **Loyalty Earn Breakdown** Where earned points came from: rule rates, defaults, free items, exclusions, flat rate.
- **Loyalty Liability** Outstanding points and money value in expiry bands, with pending points shown apart.
- **Loyalty Pending Points** Points held back until their release date, by member.
- **Loyalty Today** Today's bills, points earned and redeemed, new members and voids.
- **Member Growth and Activation** New members per period, how many earned, and how long that took.
- **Milestones** Progress of each member toward event-count milestone rules.
- **Native Loyalty Balances** Balances held in ERPNext's own loyalty feature, shown when ERPNext is connected.
- **Program ROI** Member revenue against a baseline of non-member bills and programme cost.
- **Redemption Rate and Breakage** Share of points redeemed against expired unused, by month.
- **Referral Fraud Review** Fraud signals, held and clawed-back referrals in one review list.
- **Referral Funnel** Invites to joins to qualified to rewarded.
- **Repeat Rate** Share of buyers with two or more purchases.
- **Reward Performance** Issued, redeemed, expired and open vouchers per reward, with stock.
- **RFM Segments** Recency, frequency and monetary scores grouped into segments.
- **Rule Effectiveness** Awards and points per rule version, with dormant rules flagged.
- **Rule Simulation** Replay past events through rules to preview matches and points.
- **Source Earn Reconciliation** Invoices against events against ledger rows, listing only mismatches.
- **Staff Activity** Bills, voids, net amount and points per cashier over a date range.
- **Tier Distribution** Members per tier and movement counts.
- **Tier Migration Matrix** Where members moved between tiers across two dates.
- **Top Customers** Best members by net spend with orders and points earned.
- **Unconfirmed POS Redemptions** POS invoices whose point redemption did not confirm, with retry and resolve actions.
- **WhatsApp Funnel** Sent, delivered, read and failed per template, with opt-outs and converted members.
- **Winback Returns** Observed returns of previously lapsed members.
- **Retail reports** Category by store matrix, penetration, share of wallet, zone table and placement lift (beta, off by default; see Retail space).
- **Number cards** Cards for total and active members, points earned and redeemed today, points outstanding, points expiring in 30 days, rewards issued and used, consent granted and withdrawn, messages sent and blocked, outbox waiting and invoices without a loyalty event.
- **Dashboard charts** Charts for earn vs redeem, points earned per day, redemptions per day, new members per week, members by tier, messages per day, message outcomes, events received per day, outbox by status and referral funnel by state.

## 16. Dashboards and workspaces

- **Home page** A home workspace with a "needs attention" list, go-live status and setup cards, so owners know what to do next.
- **Loyalty dashboard** A single page with headline figures and charts for the programme.
- **Member 360 page** The interactive member view described under Members.
- **Message activity page** Live view of sends, outcomes and the reasons for blocks.
- **Template gallery page** Visual library of templates and their approval status.
- **Campaign wizard page** Guided campaign creation with readiness checks.
- **Calendar console page** Festival and special-day control page.
- **Tier ladder page** Visual tier editor.
- **Import page** Guided import with mapping, dry run and rollback.
- **WhatsApp setup page** Connect and check the WhatsApp channel, with template status.
- **Loyalty setup page** The setup wizard with live earn preview.
- **Automations page** Switch on and preview ready-made automations.
- **Rule simulator page** Try a rule against sample events.
- **Retail page** One place for catalogue, categories, missions, windows, placements, experiments, funding and reviews.
- **Audit page** Browse the append-only audit log.
- **Workspaces** Organised desk areas for Members, Points and Rewards, Messaging, Insights and Reports, Operations, Approvals, ERPNext and Arrow AI.
- **Sidebar sections** A sidebar grouped as Home, Members, Points and rewards, Campaigns, Insights, Arrow AI, Approvals, Program setup, Connections, System health and Internal records.
- **Counter and member app as islands** Reusable interface blocks (dashboard, Member 360) are embedded in desk pages.

## 17. Arrow AI

Arrow AI uses the Huf agent platform. Nine assistants ship, all switched off until a manager turns them on.

- **Assistant modes** Each assistant runs in Draft (off), Shadow (shows what it would do, changes nothing) or Live (acts, with approvals), and an unknown mode always falls back to Draft.
- **Analyst** Answers questions about programme performance from existing reports only, never changing anything (beta, off by default).
- **Campaign drafter** Turns an idea into a campaign draft for a person to review, never sending (beta, off by default).
- **Complaint triage** Reads complaints and shows how it would route them, starting in Shadow (beta, off by default).
- **Expiry nudge** Prepares reminder drafts for points about to expire, for a person to review (beta, off by default).
- **Health check** A weekly list of what needs attention, such as falling activity or piling up points (beta, off by default).
- **Liability watch** A daily check that flags unusual movement in points liability (beta, off by default).
- **Member 360 assistant** A one-page summary of a single member for staff (beta, off by default).
- **Setup copilot** Walks a new business through setup and says what is missing (beta, off by default).
- **What-if** Compares options, such as another earn rate or reward, using today's numbers and changing nothing (beta, off by default).
- **Seven additional Huf agents** Campaign assistant, churn analyst, member concierge, referral monitor, support triage, expiry notifier and programme analyst ship as disabled agent definitions (beta, off by default).
- **Guarded tool set** 22 tools let agents read balances, members, rewards and reports, preview segments, draft campaigns, request adjustments and send approved templates, each limited to its role.
- **Approvals for money actions** Any assistant action that changes points waits for a human approval; the requester cannot approve.
- **Retail read tools** Agents can read category affinity, lift, mapping exceptions, readiness, placement conflicts and change impact from aggregate data, and draft category missions or supplier offers as drafts only (beta, off by default).
- **AI spend caps and pause** Monthly and per-agent daily caps, plus a pause switch, control cost.
- **AI pages** Overview, assistants, actions, approvals, knowledge, channels, runs and audit, and settings pages in the desk.
- **Run and audit log** Every agent run and its tool calls are recorded for review.
- **Knowledge base** Programme rules and policies are given to agents as knowledge so answers match the real programme.

## 18. Fraud and risk

- **Fraud signals** The system records signals for velocity, duplicate identity, self-referral, reversal after redemption and manual adjustment flags, each with a severity and evidence kept free of personal data.
- **Signal review** Reviewers mark a signal reviewed, dismissed or actioned.
- **Nightly fraud screen** A nightly job screens recent activity for suspicious patterns.
- **Self-dealing guard** Staff cannot award points to themselves (on by default).
- **Duplicate bill guard** The same bill number cannot be used twice within a window.
- **Staff daily limits** Caps on bills, points, redemptions and money per cashier per day.
- **Per-member daily caps** Daily award totals block farming.
- **Approval for adjustments** Manual changes need a different approver, with caps and a self-approval flag in the report.
- **OTP on large redemptions** Big redemptions need a member-held code.
- **Referral reward hold and clawback** Rewards wait and can be reversed if the qualifying bill is reversed.
- **Redemption holds** Points are locked during a sale so they cannot be double spent.
- **Idempotency keys** Every earn, redeem and API write carries a key so retries cannot duplicate value.
- **Transaction locks** Ledger writes lock in a fixed order to prevent two simultaneous spends.

## 19. Finance

- **Liability by expiry band** Outstanding points and money value split by time to expiry.
- **Liability at expected redemption** Apply an expected redemption rate to see a realistic liability.
- **Expiry forecast** Predicted points expiring over a horizon of up to two years.
- **Breakage estimate** Share of points expiring unused, shown by month.
- **Reward cost tracking** Each reward carries a unit cost and each issued voucher records its cost.
- **Programme ROI** Member revenue against a non-member baseline and programme cost.
- **Day-end close** Cash expected, declared and the variance, per store and day, locked after close.
- **Staff cash handling view** Totals per cashier on the close and in the Staff Activity report.
- **Supplier funding ledger** Per-supplier amounts owed for funded points, with claim export (beta, off by default).
- **Earn and ledger reconciliation** Reports that tie invoices, events and ledger rows together and list only mismatches.
- **Append-only ledger** Every points movement is a permanent row, which is the basis for finance audit.

## 20. Privacy and security

- **Roles** Nine roles (Administrator, Manager, Operator, Analyst, Auditor, Integration Service, Agent Service, Cashier, API Service), so each person sees only what they need.
- **Permission matrix** A written matrix defines what each role can read and change on every record type.
- **Store-scoped access** Users can be limited to specific stores and see only those stores' data.
- **Masked phone numbers** Phone numbers are masked on screens and in logs for roles that do not need them.
- **No personal data in reports** Reports show member ids, never phone or email.
- **Consent by purpose and channel** Service and marketing consent are kept apart per channel.
- **Consent audit trail** Consent changes are appended, never overwritten.
- **Member data export** A member or admin can export a member's data.
- **Erasure requests** Members request erasure, a manager approves, and personal details are removed while the financial ledger stays intact.
- **Retention clean-up** Copies of personal data held outside the member record are purged on a schedule, as is old event data.
- **Audit log** An append-only log records sensitive actions with actor, before and after, and reason.
- **Signed API requests** Partner API calls can require HMAC signatures, with key rotation overlap.
- **Hashed secrets** API keys and card tokens are stored hashed.
- **Rate limits** Per-client limits protect the API.
- **Outbound request protection** Webhook and SMS calls are blocked from reaching internal network addresses.
- **Webhook signing** Outbound webhooks are signed so receivers can verify them.
- **Step-up verification** Sensitive member actions need a fresh OTP.
- **Member session security** Sessions are device-bound, refreshable and revocable.
- **Install and uninstall safeguards** Guards prevent losing ledger data by accident on uninstall.

## 21. Admin and ops

- **System health** A status view of scheduler heartbeat, queues, stuck jobs and alert conditions.
- **Heartbeat and stuck-queue alerts** Jobs raise alerts when the scheduler stops or the queue stalls.
- **Background jobs** Scheduled jobs handle expiry, outbox sweeps, tier review, referral release and clawback, reservation cleanup, nightly reconciliation, fraud screen, retention clean-up, segment refresh, journey ticks, recall scans, festival dispatch and retail aggregates.
- **Outbox replay** Failed messages can be replayed after a fix.
- **Outbox contract** A documented delivery contract lets other channels plug in.
- **Safe stop** One action stops sends and risky jobs, and a release action restores them.
- **Event inbox and outbox** Every incoming and outgoing event is stored for inspection.
- **Event sources and types** Configure which systems send events and which event types the programme understands.
- **Import runs** History of every import with counts, errors and rollback.
- **Seed and demo data** A deterministic seed builds a realistic programme, members, ledger, vouchers and messages for demos and tests, with Gulf and Indian profiles and fake delivery so nothing real is sent.
- **Languages** Desk text in Hindi and Malayalam, customer app in English, Hindi and Malayalam.
- **Right-to-left support** The customer app and templates preview handle right-to-left languages.
- **Light and dark themes** Counter, member app and desk blocks follow light or dark mode.
- **Number and date formats** Locale-aware money and dates for India, UAE, Kuwait and US styles.
- **Backup and restore guides** Documented backup, restore rehearsal and deploy runbooks.
- **Partner key issuance** A controlled process issues production API keys with a gate.
- **Plan usage banner** Shows usage against plan limits.

## 22. Integrations and APIs

- **ERPNext connection** A setup screen connects ERPNext with checks, a test connection, and a go and disable switch, so enabling is safe and reversible.
- **ERPNext earn on invoices** Sales Invoices and POS Invoices earn points on submit, with minimum amount and B2B group exclusions.
- **ERPNext returns** Credit notes reverse the points earned.
- **ERPNext POS redemption** Reserve, apply, release and confirm points on POS invoices, with retries.
- **ERPNext customer panel** Show loyalty details on the ERPNext customer and enrol a customer from there.
- **ERPNext item catalogue sync** Pull items and groups into the retail catalogue.
- **ERPNext calendar import** Use ERPNext holidays for festival messaging.
- **ERPNext backfill** Replay historical invoices as a dry run first, then apply, with pause and resume.
- **Native loyalty coexistence** Detect ERPNext's own loyalty program, import its balances and turn it off for enrolled customers to avoid double points.
- **Earn leakage and reconciliation** Reports tell finance which invoices missed earning.
- **Uninstall policy** Controlled behaviour on removing the integration.
- **REST API v1** Endpoints for bills, earn, returns and reversals, members and identities, statements, tiers, stamps, wallet, redeem quote, hold and confirm, vouchers validate and redeem, and referral attribution.
- **Member API** Separate member-facing endpoints for OTP login, profile, home, card, history, rewards, tier, stamps, referrals, consents, privacy, bill claim and wallet.
- **API clients and scopes** Issue a client per partner with scopes, rate limits, sandbox flag and signing, and rotate keys without downtime.
- **Idempotency** All write endpoints accept an idempotency key and return the same result on retry.
- **OpenAPI document** A machine-readable API description is generated.
- **Webhooks out** Send signed events (points earned, redeemed, expired, expiring, adjusted, reversed, pending and released, tier changed, member joined, reward ready, voucher redeemed, referral qualified and rewarded) to a partner URL, with retries and a delivery log (setting, off by default).
- **Event ingestion** A generic endpoint accepts events from any system and maps them to earn rules.
- **Connector templates** Ready mapping templates for Zoho Books, Zoho Inventory, Zoho POS, Shopify, WooCommerce, Odoo, any JSON sender and CSV.
- **SDKs** JavaScript and Python client libraries.
- **Huf integration** Messaging, agents, tools, approvals and inbound webhooks run through the Huf platform.
- **WhatsApp provider** Templates, sends, delivery status, inbound replies and template status sync through the Huf gateway to WhatsApp.
- **Extension hooks** Hook points before earn, after post, on reward fulfilment and on member profile let partners extend behaviour without forking.
- **Adapter registry** A registry lists available source adapters (ERPNext, generic) and how to add more.

---

## Planned, not yet built

These appear in plans or docs but were not found in the shipped code. Do not list them as features.

- **Retail media audience packages** Selling audiences to suppliers was deferred pending sales and legal work.
- **Floor schematic and store map overlay** A drawn floor plan with coordinates was not built.
- **GPC brick mapping screen** The field exists but there is no screen for it.
- **In-store location sensing** Geofence, beacon, Wi-Fi and camera-based features were rejected by the plan.
- **Real-time basket category triggers** A live "you missed a category" trigger was rejected.
- **Account-level KSA hosting** Data residency choices are not built into the product.
- **Remaining Huf catalogue tools** Several planned agent tools (find member, tier progress, history, redemption check, simulate rule, segment members, at-risk list, issue reward, expire notify, set attribute, acknowledge outbox, open ticket) have no handler yet.
- **Agent schedules and triggers** Daily referral review and weekly churn review schedules were not seeded.
- **Per-market regulated category lists** Exclusions work as data, but the lists per country are not shipped.

## Gaps a writer should not claim

- **No general ledger or accounting entries** Liability is reported, but the product does not post journal entries or create accounting vouchers.
- **No NPV or discounted valuation** Liability can be weighted by an expected redemption rate, but there is no net present value calculation.
- **No Arabic interface text** Right-to-left layout and Arabic catalogue labels exist, but the desk, counter and member app ship in English, Hindi and Malayalam only.
- **No push notifications** The member app has an in-app notification list and WhatsApp messages, not phone push alerts.
- **No profit or margin analytics** Customer lifetime value is revenue-based, because margin is not captured.
- **No controlled uplift for win-back** Winback Returns shows observed returns only, not a tested result.
- **Messaging is on only after setup** Every site starts in rehearsal with sending off, so nothing goes out until the owner enables it.
- **AI assistants are off** All Arrow AI assistants and Huf agents ship disabled, and money-changing actions always need a person to approve.
- **Retail features are mostly off** Item-line recording, missions, line rules, supplier funding, supplier reports, household and four-arm experiments are all off by default.
- **Wallet passes need issuer setup** Apple and Google Wallet need the retailer's own issuer credentials.
- **SMS and email need a provider** Both are off by default and depend on the retailer's own provider details.
- **Competitor import presets are unverified** The mapping presets are guesses at the formats, not captured from the real products.
- **No claim on competitor comparisons** Competitor claims were not verified.
- **Reports are not real-time** Retail category reports read nightly tables and lag by up to a day.
- **Counter offline is limited** Offline mode caches member chips and queues safe writes, but redemptions, voids and consent changes need a connection.
- **Statistical sign-off pending** Four-arm retail experiments should not be promised as validated results.
