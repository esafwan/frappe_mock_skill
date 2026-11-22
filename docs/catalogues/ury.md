# URY (Restaurant ERP and POS) feature catalogue

Source: URY app code (origin/develop, snapshot read from the filtered v3 checkout). Parts: Frappe app `ury` on ERPNext, the desk admin app at `/ury`, the cashier POS at `/pos`, the captain order screens, the self-order app at `/order`, and Mosaic (kitchen display) at `/mosaic`.
Only features found in code are listed. Roles seen: URY Admin, URY Manager, URY Captain, URY Cashier, URY Sales Plan.

## Contents
1. Restaurant setup and layout
2. Menu and pricing
3. Cashier POS (register, tables, orders)
4. Captain ordering (waiter tablet)
5. Kitchen orders, KDS and printing
6. Production, recipes and yield
7. Stock control, reservations and wastage
8. Sales planning
9. Payments, shifts and day close
10. Self-ordering (QR, tablet, kiosk)
11. Delivery aggregators
12. Reports and P&L
13. Dashboard, insights and AI assistant
14. Staff, roles, commission
15. Setup wizard, flags, background jobs
16. Planned, not yet built
17. Gaps a writer should not claim
18. Screens for mocks

## 1. Restaurant setup and layout
- **Restaurant**: one record per outlet with branch, company, invoice number prefix, default tax template and address. Ties every sale to the right outlet.
- **Rooms**: dining areas with a room type, a bill printer, KOT printing on or off, and a block-takeaway switch. Lets each area behave differently.
- **Tables**: seats, minimum seating, take-away flag, shape and drag position for a visual floor plan, occupied status. Staff see the real floor.
- **Table layout view**: a floor-plan screen to place and size tables. Matches the screen to the real room.
- **Branch operating schedule, exceptions and service windows**: opening hours, special days and named service periods (lunch, dinner). Controls when the outlet can sell.
- **Production units and departments**: kitchens and stations (grill, bar) grouped into departments. Orders go to the right place.
- **Printer settings**: which printer prints bills and KOTs per room.
- **Menu bulk upload**: import menu items from a CSV. Speeds up onboarding.

## 2. Menu and pricing
- **Menu**: named menus with items, courses and price per item, set active per restaurant. The menu a guest sees.
- **Room-wise menu**: a different menu per room (for example bar vs dining). Different prices by area.
- **Order-type menu**: a different menu per order type (dine-in, take-away, delivery). Supports channel pricing.
- **Menu courses**: courses (starter, main) with validation that items fit them. Lets the kitchen fire in order.
- **Item variants and add-ons**: POS item variants and item add-ons. Supports sizes and extras.
- **Disposable items**: packaging items added per profile or table type and costed. Takeaway cost is tracked.
- **Menu availability**: item availability computed from stock and plan, shown on POS and self-order. Stops selling what cannot be made.
- **Fast-moving items**: list of top sellers on the dashboard. Shows what to prep.
- **Customer favourites**: favourite items for a returning customer at the register.

## 3. Cashier POS (register, tables, orders)
- **Register**: pick order type, table, customer and items, then take payment. The core selling screen.
- **Order type select**: dine-in, take-away, aggregator and others per profile.
- **Customer pick and quick create**: search or create a customer by name and mobile.
- **Comments on orders and lines**: notes to the kitchen.
- **Table view**: live table status with cards, actions menu and floor layout. Shows who is seated.
- **Table transfer**: move an order to another table.
- **Table merge and unmerge**: combine tables into one bill and split them again.
- **Bill merge**: join two bills into one invoice.
- **Bill split**: split one bill into several groups to pay separately.
- **Captain transfer**: hand an order to another captain.
- **Orders list**: search and filter open, draft and paid invoices, with cashier-scoped lists.
- **Order status sidebar**: kitchen state of each order at the till.
- **Quantity reduction control**: reducing a sent item is checked and recorded.
- **Cancellation with reason**: cancelling KOTs or items goes through a service that records who and why.
- **Spotlight search**: global quick search in the POS.
- **Screen size dialog**: choose layout size for the device.
- **Languages**: English, French, Arabic (right-to-left supported by locale files).

## 4. Captain ordering (waiter tablet)
- **Captain tables**: a mobile list of tables at `/pos/order`. Waiters pick a table.
- **Captain order screen**: take and add items to a table at `/pos/order/table/:table`. Orders without walking to the till.
- **Captain actions menu**: transfer, request bill and similar actions per table.
- **Guest service requests panel**: shows Bill or Assistance calls from guests and lets staff acknowledge and resolve them.

## 5. Kitchen orders, KDS and printing
- **KOT generation**: each invoice becomes kitchen orders split by production unit, with order number. Each station sees only its items.
- **KOT routing**: items route by menu, item group and workstation mapping.
- **Mosaic kitchen display**: Vue screen with one view per production unit showing KOT cards. Replaces paper in the kitchen.
- **KOT state tracking**: started, ready, served, cancelled with who and when.
- **Item-level execution**: per-item progress inside one KOT.
- **Job card time controls**: start, pause and stop timers on a job card in Mosaic.
- **KOT cancellation**: cancel with a disposition (waste or reuse) recorded.
- **KOT chef filter**: chefs see only their own units.
- **KOT reprint and waiter print**: reprint tickets and print a waiter copy.
- **Realtime KOT alerts**: POS gets sound and popup alerts when a kitchen order changes.
- **KOT validation job**: runs every minute to flag stuck or invalid KOTs, with a KOT error log screen.
- **Websocket print page**: desk page that sends prints to a connected print client.
- **Alert rules**: thresholds for High Food Cost, Product Block, Payment Delay, Cancel Delay, Table Turnaround and Round Off Limit, notifying chosen roles. Managers hear about problems.

## 6. Production, recipes and yield
- **Item production configuration**: per item and branch, who makes it, make-to-order or pre-produced, sourcing, recipe, and availability mode.
- **Make-to-order work orders**: a sale creates a work order for the item.
- **Pre-produced fulfilment**: sales draw down pre-made stock.
- **Batch manufacture**: produce a batch ahead of service.
- **Recipe (BOM) compiler and staleness check**: flattens recipes and warns when stale.
- **Production plan from sales plan**: can auto-create plans and material requests (setting on production settings).
- **Requirements**: screen showing ingredients needed for the plan.
- **Yield standards, checks and variance**: record input vs output, compare to standard. Shows trim loss.
- **Overdue yield check reminders**: daily notice, plus compliance and overdue screens.
- **Fulfilment posting**: posts stock for fulfilment with retry every minute for failures.
- **Completed work orders report**.
- **Cost variance attribution and department profitability**: why cost moved and which department earns.

## 7. Stock control, reservations and wastage
- **Branch stock policy**: per-branch switches for reservation control, real-time production posting and closing reconciliation (all off by default).
- **Stock reservations**: hold ingredient capacity for open orders, expire stale ones hourly. Prevents overselling.
- **Department stock**: stock held by each department.
- **Store issue with authorization**: issue stock from store to department with an authorization record and stock movement log.
- **Wastage capture**: record wasted quantity with reason and valuation.
- **Stock correction**: correct counts with items.
- **POS Stock Authority V2 (off by default)**: company or branch feature flag moving stock authority to URY. Has a shadow comparison report.
- **Wastage and damage report**.

## 8. Sales planning
- **Sales plan**: per branch, date and service period, with items and a Draft to approved flow. Plans what to cook.
- **Enforcement mode**: Hard stops selling beyond plan; items can allow over-plan sale.
- **Plan approval snapshot and audit log**.
- **Insight snapshot and comparable weekday history**: helps set quantities.
- **Role: URY Sales Plan**.

## 9. Payments, shifts and day close
- **POS opening**: choose profile, enter opening cash, checks allowed profiles and main cashier status.
- **POS opening checklist and closing checklist**: mandatory items must be ticked before opening or closing, logged.
- **POS closing**: payment table with expected vs counted, sub-POS closing, short and excess report.
- **Open entries screen**: see and close unclosed shifts.
- **Payment dialog**: multiple modes of payment, change, mode accounts auto-created.
- **Payment terminals**: register card machines with provider (Simulated, Ingenico, PAX, Verifone, Other), status and last transaction. Provider names exist; only the simulated flow is clearly built.
- **Day close page**: end-of-day screen with day status card.
- **Round-off journal entry**: books rounding on submit.
- **Sales invoice consolidation**: POS sales roll up to consolidated invoices with reservation close out.
- **Sales returns**.
- **Daily P&L**: sales, tax, cost of goods, disposables, direct and fixed expenses per day.

## 10. Self-ordering (QR, tablet, kiosk)
- **Self-ordering profile**: switches for QR table ordering, QR pickup, kiosk (off by default), add to running table, product detail, images, notes, request bill, customer payment (off by default), payment link (off by default), pay at counter, idle timeout.
- **QR table codes**: signed tokens per table. Guests scan to order.
- **Ordering sessions**: tokenised and time limited, linked to the invoice.
- **Ordering devices**: enroll tablets and kiosks with a credential, layout (Mobile, Tablet, Landscape Kiosk, Portrait Kiosk), fixed or assigned table, staff PIN to assign.
- **Guest menu, product detail, cart, checkout, order status**.
- **Request bill and call assistance**.
- **Customer payment and share payment link**: creates a payment request and checks status.
- **Idle reset** on shared devices.

## 11. Delivery aggregators
- **Aggregator settings**: customer, price list and mode of payment per aggregator. Aggregator orders use their own prices.
- **Aggregator invoice prefix** per restaurant.
- **Aggregator picker at register**.

## 12. Reports and P&L
Web reports: today's sales, day-wise sales, day-wise invoices, month-wise, time-wise, service-wise, cancelled invoices, average bill value, item-wise sales, item-wise purchase history, customer data, day-wise customer details, repeated customers, employee sales, employee commission, employee item-wise sales, completed work orders, daily P&L.
Desk-only reports: APC, food cost and margin, product categorization, RevPASH, table turnaround delay, unsettled bills, short and excess, stock authority shadow comparison, wastage and damage.
- **Report settings**: operating hours, price list for costs, fixed, indirect and percentage expenses used by P&L.
- **Date range filter and charts**.
- **High food cost notifications**: checked every 5 minutes.

## 13. Dashboard, insights and AI assistant
- **Dashboard KPIs, quick actions, analytics charts, baseline comparison**.
- **Insight feed**: rule-generated notes with severity per branch, dismissible.
- **AI assistant chat (off by default)**: ask questions about reports, with report context. Enabled by AI settings.
- **Desk link**: jump from the web admin to the matching desk record.
- **Workflow status stepper** for documents.

## 14. Staff, roles, commission
- **Roles and permissions**: five roles above, button-level permission API.
- **Users page**: manage URY users and their branch.
- **Staff discount policy** by item group.
- **Commission settings (off by default)**: base, tiers, rules, attribution mode.
- **Notification recipients** by role.

## 15. Setup wizard, flags, background jobs
- **Setup wizard and configure page**: guided install, business type, demo data.
- **Feature flags** doctype.
- **Background jobs**: every minute KOT validation and fulfilment retry; every 5 minutes food cost alert; hourly reservation expiry; daily yield reminders.

## 16. Planned, not yet built
- Real card terminal drivers beyond the simulated provider (provider list only).
- Planning docs under `ury/docs/v3-integration` describe further work; not verified as built.

## 17. Gaps a writer should not claim
- No loyalty, points or coupon program, no reservations or bookings, no online delivery site of its own, no accounting beyond ERPNext, no multi-language beyond English, French and Arabic.
- Do not claim live Zomato or Swiggy integration; aggregators are price list and payment mode setups.
- Do not claim real payment gateway or terminal integration; do not claim AI is on by default.
- Do not claim stock authority, reservation, or commission features are active without turning them on.

## 18. Screens for mocks
POS app (base `/pos`, shell with header, sidebar, footer):
- `/pos/dashboard`: KPI strip, baseline comparison, fast-moving items, insight feed, chat widget.
- `/pos/pos` (register): menu search and category tabs, menu grid, order panel (lines, order type, table, customer), payment dialog, actions menu.
- `/pos/tables`: floor layout or card grid, table actions (transfer, merge, split), room filter.
- `/pos/orders`: tabs by status, search, invoice list, order detail, print.
- `/pos/open-entries`: open shift list, close action.
- `/pos/settings`: language, screen size, profile.
- `/pos/order`: captain table cards. `/pos/order/table/:table`: menu, order lines, service request panel.
- Opening and closing dialogs with payment tables and checklist gate.

Admin app (`/ury`): setup-wizard/0 and /1; dashboard; menu; table; room; pos-profile; user; branch; report-settings; ai-settings; commission-settings; self-ordering-profile; production-unit; production-department; item-production-config; yield-standards; yield-variance; overdue-yield-checks; yield-compliance; aggregator; sales-plan; requirements; service; department-stock; menu-routing; store-issue; wastage; department-profitability; close-day; kot-error-log; stock-reservations; payment-terminals. Each is a header, page toolbar, list or form with drawer. Reports at `/ury/reports` (home with report cards, then each report with date range filter, table and charts), side nav with breadcrumbs.

Self-order (`/order`): layout chosen per device: Mobile QR, Tablet, Landscape Kiosk, Portrait Kiosk. Regions: category tabs, search, product grid, product detail, cart panel or page, checkout, order status.

Mosaic (`/mosaic`): production dashboard (cards per production unit), per-unit KOT board with KOT cards and job card timers, login.
