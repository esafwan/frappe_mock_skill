# Feature catalogue: frappe_whatsapp (WhatsApp Frappe app, Genie fork)

Source: code at `frappe_whatsapp-ro`, ref `develop` (034c97f). Read-only checkout. Frappe app that talks to Meta's WhatsApp Cloud API. It has no custom page, no PWA and no standalone frontend: everything is standard Frappe desk forms, lists, one script report, and one global "Send To Whatsapp" menu item.

## Contents
1. Accounts and settings
2. Templates
3. Sending messages and conversations
4. Receiving messages and webhook
5. Automatic notifications
6. Bulk campaigns and recipient lists
7. WhatsApp Flows (interactive forms)
8. Product catalogue messages
9. Reports
10. Integrations and API
11. Roles and permissions
12. Planned, not yet built
13. Gaps a writer should not claim
14. Screens for mocks

## 1. Accounts and settings
- **Multiple WhatsApp accounts**: store several business numbers (token, phone id, business id, app id, API version), each Active or Inactive. Lets one business run separate numbers for sales and support.
- **Default incoming and outgoing account**: mark one account as the default for receiving and one for sending; only one of each can be default. Messages without an explicit account use these.
- **WhatsApp Settings**: a single page that picks the default incoming and outgoing account.
- **Subscribe app to webhooks button**: one click on the account form subscribes the app to Meta so incoming messages arrive. Needed after registering a number.
- **Webhook verify token per account**: the secret Meta checks when you register your callback URL.
- **Auto read receipt option**: per-account switch to allow marking incoming messages as read.
- **Upgrade patch to multi-account**: moves old single-account setups to the account model.

## 2. Templates
- **Template library**: create message templates (body, header, footer, category, language) that are sent to Meta for approval. Required by WhatsApp to start a conversation.
- **Template categories**: Transactional, Marketing, OTP, Utility, Authentication.
- **Header types**: none, text, document, image, with a sample file and sample values for approval.
- **Buttons on templates**: quick reply, call phone, visit website (static or dynamic URL), flow, multi-product message, catalog.
- **Variables tied to a document type**: a template can be linked to a doctype so field values fill in the placeholders.
- **Edit template on Meta**: saving changes pushes the update to Meta; deleting removes it there too.
- **Fetch templates from Meta**: pulls all templates and their approval status from every active account, so nothing is retyped.
- **Live approval status**: Meta's approve or reject updates arrive by webhook and change the template status.
- **Template list button**: a list-view action on templates (list script present).

## 3. Sending messages and conversations
- **WhatsApp Message log**: every message in or out is a record with status, number, account, conversation id, profile name and links to the related record. This is the audit trail.
- **Manual outgoing messages**: type a text message, or send image, document, video or audio with an attachment.
- **Template messages**: send an approved template with body and header parameters.
- **Interactive messages**: buttons or list messages sent from stored JSON.
- **Reactions**: send an emoji reaction to a message.
- **Reply to a message**: Reply button on a received message, linked to the original.
- **Mark as read**: button that sends a read receipt to the customer.
- **Retry failed sends**: a failed outgoing message can be re-sent; status shows Success or Failed.
- **Contact profiles**: the sender's WhatsApp name and number are saved as a profile and optionally linked to a Contact.
- **Link to any record**: a message stores the doctype and record it is about.
- **Send To Whatsapp menu on every form**: a menu item on all desk forms opens a dialog to choose a template and a Contact (mobile auto-filled) and send it.
- **Phone number cleaning**: numbers are normalised before sending.
- **Live chat feed event**: inbound flow responses publish a site-wide realtime event meant for a separate chat screen app (that app is not in this repo).

## 4. Receiving messages and webhook
- **Webhook endpoint**: one public URL answers Meta's verification and receives all events.
- **Inbound text**: saved as incoming messages with sender name and conversation id.
- **Inbound media**: images, audio, video and documents are downloaded from Meta and attached, with caption kept.
- **Inbound reactions, button taps and list picks**: stored as messages so replies to buttons are visible.
- **Inbound orders**: orders placed from a catalogue are stored with the product data.
- **Inbound flow answers**: completed WhatsApp Flow forms are stored on the message and announced in realtime.
- **Delivery status updates**: sent, delivered, read and failed update the message record.
- **Template status updates**: approval changes update the template.
- **Account lookup by phone id**: each event is matched to the right account.
- **Webhook error logging**: failures are written to the Error Log.

## 5. Automatic notifications
- **WhatsApp Notification rules**: send a template when a document event happens (before/after insert, save, submit, cancel, delete, and after-submit edits).
- **Condition expression**: optional simple Python condition decides whether to send.
- **Scheduled notifications**: run hourly, daily, weekly, monthly, yearly, "long" variants, or custom, plus "Days Before" and "Days After" a date field.
- **Recipient from a field**: pick which field of the record holds the phone number.
- **Fill template fields from the record**: map template placeholders to document fields.
- **Attach the printed document**: send the record's print PDF, a custom file, or a file from a field.
- **Update a field after sending**: set a property on the record once sent (for example a "notified" flag).
- **Per-rule account**: choose which WhatsApp account sends.
- **Preview today's targets**: "Get Alerts for Today" button shows which records would be messaged.
- **Notification log**: every send records the template and Meta response.
- **Disable switch**: turn a rule off without deleting it.
- **Catalogue and product buttons in notifications**: notifications can attach multi-product or catalogue buttons.

## 6. Bulk campaigns and recipient lists
- **Recipient lists**: reusable lists of numbers and names with extra per-person data.
- **Import recipients from any record type**: pull from a doctype with filters, a limit and chosen mobile and name fields.
- **Add test recipient and validate**: buttons to add a test number and check the list's numbers.
- **Bulk WhatsApp Message**: a submittable campaign with title, from number, template or free text, attachment, recipients (individual or list).
- **Common or unique variables**: one value for all, or per-recipient values.
- **Background sending**: each recipient is queued as a job so large sends do not block the screen.
- **Check Progress**: button shows how many are sent, delivered, read, failed.
- **Retry failed messages**: re-queues only the failures.
- **Statuses**: Draft, Queued, In Progress, Completed, Partially Failed.
- **Scheduled time field (off by default)**: a send time is stored and a scheduler function exists, but it is not registered in the app's scheduler hooks, so nothing runs it automatically.

## 7. WhatsApp Flows (interactive forms)
- **Flow builder**: define screens and fields inside Frappe (text input, text area, date picker, radio, checkbox, dropdown, opt-in, link, image, headings, body, caption, footer).
- **Flow categories**: sign up, sign in, appointment, lead generation, contact us, support, survey, other.
- **Create, upload JSON, publish, deprecate, delete on Meta**: manage the whole lifecycle from buttons.
- **Import and sync from Meta**: bring existing flows in, or refresh all.
- **Check status and preview link**: see the flow's state and get a preview URL.
- **Send test**: send the flow to a number from the form.
- **Send a flow message**: flows go out as messages with a call-to-action label and screen.
- **Flow data endpoint**: a public endpoint answers Meta's init, data exchange and back requests, checks the request signature, and saves the form data.

## 8. Product catalogue messages
- **Multi-product message in bulk**: send a bulk campaign as a multi-product message with product ids, a header and a thumbnail product.
- **Catalogue button**: template and notification buttons can open the catalogue.
- **Order capture**: orders sent back by customers are saved on the message.

## 9. Reports
- **Bulk WhatsApp Status**: script report listing each campaign with total recipients, sent, delivered, read, failed and status. Shows how a campaign performed.

## 10. Integrations and API
- **Meta WhatsApp Cloud API**: direct connection, no third-party gateway.
- **Send notification API**: a POST endpoint (public, guest allowed) to send a text or template message with parameters.
- **OTP sender hook**: sends a one-time code over WhatsApp using the default outgoing account and a template with "otp" in its name, else plain text.
- **Document event script runner**: a wildcard hook on all document events that runs matching notification rules.
- **Scheduler jobs**: all, hourly, daily, weekly, monthly and long variants trigger scheduled notifications.
- **Python and JS test suites**: tests cover webhook, utils and bulk messaging.

## 11. Roles and permissions
- **System Manager**: full access to accounts, settings, messages, templates, flows, profiles, logs, recipient lists and bulk messages.
- **WhatsApp Manager**: access to Bulk WhatsApp Message, Recipient List and the status report.
- **Script Manager**: manages WhatsApp Notification rules.
- No other role gets access. Public (guest) access exists only on the webhook, flow endpoint and send-notification API.

## 12. Planned, not yet built
- Automatic scheduled bulk sends (field and function exist, not hooked up).
- A chat inbox screen (only a realtime event is published; the screen lives in another app).
- Documentation site at `docs/index.html` and README feature list were not checked line by line; treat claims beyond this catalogue as unverified.

## 13. Gaps a writer should not claim
- No built-in chat inbox or agent assignment screen.
- No custom dashboard, PWA, portal page or mobile app.
- No loyalty, customer segments or opt-out management.
- No automatic bulk scheduling (see above).
- No contact import from Meta and no message search view beyond the standard list.
- Do not claim the send-notification API is authenticated: it allows guests.
- Do not claim sending is guaranteed: delivery depends on Meta approval, the 24 hour window and template status.
- Location, contact and sticker content types appear in the picklist but only the types listed in sections 3 and 4 have send or receive code.

## 14. Screens for mocks
All routes are standard Frappe desk routes (`/app/<doctype-slug>`).

- **WhatsApp Account list and form** `/app/whatsapp-account`: header with Active/Inactive; credential section (token masked, url, version, phone id, business id, app id); default incoming/outgoing checkboxes; auto read receipt; Subscribe App to Webhooks button.
- **WhatsApp Settings** `/app/whatsapp-settings`: two links, default incoming and outgoing account.
- **WhatsApp Templates list and form** `/app/whatsapp-templates`: name, language, category, status badge; body editor; header type and sample; footer; buttons table; linked doctype and field names; list has a fetch-from-Meta action.
- **WhatsApp Message list and form** `/app/whatsapp-message`: list with type (Outgoing/Incoming), status, number, template; form shows message body, attachment, reference record, reply-to, flow section; Reply and Mark as read buttons.
- **Send To Whatsapp dialog** (on every form, Menu): template picker, contact picker, mobile field, Send button.
- **WhatsApp Notification list and form** `/app/whatsapp-notification`: name, record type, trigger (event or schedule), condition code box with help text, template, recipient field, field mapping table, attachment options, post-send property, Get Alerts for Today button.
- **WhatsApp Notification Log** `/app/whatsapp-notification-log`: template and response JSON, read only.
- **WhatsApp Profiles** `/app/whatsapp-profiles`: name, number, linked contact, account.
- **WhatsApp Recipient List form** `/app/whatsapp-recipient-list`: name, recipients table, import-from-record section (record type, mobile and name fields, filters, limit, Import button), Add Test Recipient and Validate Recipients buttons.
- **Bulk WhatsApp Message form** `/app/bulk-whatsapp-message`: title, from number, recipient type, template or message, variables JSON, schedule time, status, multi-product options; Check Progress and Retry Failed Messages buttons.
- **Bulk WhatsApp Status report** `/app/query-report/Bulk WhatsApp Status`: table of campaigns with counts per outcome.
- **WhatsApp Flow list and form** `/app/whatsapp-flow`: name, account, status, category, CTA text; screens table, fields table, flow JSON editor, endpoint URI, preview URL; toolbar buttons Import, Sync, Create, Upload JSON, Publish, Deprecate, Send Test, Check Status, Get Preview URL, Delete.
