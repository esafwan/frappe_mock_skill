// WhatsApp templates and channels (HUF Channels app, pre-develop). Fixtures: scripts/huf/fixtures/whatsapp.mjs + data/huf/whatsapp.json
// (fictional wholesale supplier "Northwind Trading", one healthy number "Northwind Sales").
// The template wizard keeps its step in local state, so every step/variant is its own spec whose prepare() clicks through the earlier steps.
import fs from 'fs';
const DATA = JSON.parse(fs.readFileSync(new URL('../data/huf/whatsapp.json', import.meta.url), 'utf8'));
const W = DATA.wizard, B = DATA.broadcast;
const GW = '/channels/whatsapp/n/Northwind%20Sales';
const IMG = (f) => `https://huf.mock/files/${f}`;
const FX = ['whatsapp'];
const PAGE_NA = { disabled: 'page-level: no single disabled control', loading: 'mocked data renders without a visible skeleton', error: 'page-level errors are toasts or LoadError cards; not captured' };

const settle = (page, ms = 350) => page.waitForTimeout(ms);
const click = async (page, sel) => { await page.locator(sel).first().click(); await settle(page); };
const fill = async (page, sel, v) => { const l = page.locator(sel).first(); await l.fill(v); await l.blur(); await settle(page, 120); };
/** Leave the page with nothing focused or hovered so screenshots are stable. */
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.evaluate(() => { const m = document.querySelector('main'); m?.scrollTo?.(0, 0); document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; }); }); await settle(page); };

// Next carries aria-disabled while step 2 is invalid (Playwright then refuses a normal click), so dispatch the click.
const next = async (page) => { await page.locator('main button:has-text("Next")').first().dispatchEvent('click'); await settle(page); };
/** Step 2 filled with the marketing invite from data/huf/whatsapp.json (text header, 2 variables, footer, website + reply buttons). */
async function writeFilled(page) {
  await next(page);
  await fill(page, '#tpl-name', W.name);
  await click(page, '[aria-label="Header type"] button:has-text("Text")');
  await fill(page, '#tpl-header-text', W.header);
  await fill(page, '#tpl-body', W.body);
  for (const [i, v] of W.samples.entries()) await fill(page, `#tpl-sample-${i + 1}`, v);
  await fill(page, '#tpl-footer', W.footer);
  for (const [i, b] of W.buttons.entries()) {
    await click(page, 'main button:has-text("Add button")');
    await click(page, `[role="menuitem"]:has-text("${b.type}")`);
    await fill(page, `#tpl-btn-${i}-text`, b.text);
    if (b.url) await fill(page, `#tpl-btn-${i}-url`, b.url);
  }
}
async function writeImage(page) {
  await writeFilled(page);
  await click(page, '[aria-label="Header type"] button:has-text("Image")');
  await fill(page, '#tpl-header-media', IMG('northwind-spring-restock.svg'));
  await page.waitForSelector('aside[aria-label="Preview"] img', { timeout: 5000 });
  await page.waitForFunction(() => [...document.querySelectorAll('aside[aria-label="Preview"] img')].every((i) => i.complete && i.naturalWidth > 0));
}
async function writeCarousel(page) {
  await click(page, 'label[for="kind-marketing_carousel"]');
  await next(page);
  await fill(page, '#tpl-name', 'new_suppliers_showcase');
  await fill(page, '#tpl-body', 'Hi {{1}}, two new suppliers joined Northwind this month. Swipe to see their best sellers.');
  await fill(page, '#tpl-sample-1', 'Lena');
  const cards = [['northwind-card-pasta.svg', 'Bronze-cut pasta from Casa Rinaldi, 12 shapes in stock.', 'Order pasta'], ['northwind-card-spices.svg', 'Smoked paprika and 30 more spices from Vera Spice Co.', 'Order spices']];
  for (const [i, [img, body, btn]] of cards.entries()) {
    await fill(page, `#tpl-card-${i}-media`, IMG(img));
    await fill(page, `#tpl-card-${i}-body`, body);
    await fill(page, `#tpl-card-${i}-btn-0-text`, btn);
  }
  await page.waitForFunction(() => { const im = [...document.querySelectorAll('aside[aria-label="Preview"] img')]; return im.length >= 2 && im.every((i) => i.complete && i.naturalWidth > 0); });
}
/** Swap the template list for an empty one and press Sync, which reloads the list (no page reload, so the kit fonts stay injected). */
async function emptyTemplates(page) {
  await page.route('**/api/method/huf.ai.whatsapp.management.list_templates{,?*}', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ message: { success: true, templates: [], manager_url: '', business_id: '' } }) }));
  await page.route('**/api/method/huf.ai.whatsapp.management.list_template_drafts{,?*}', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ message: { success: true, drafts: [] } }) }));
  await page.route('**/api/method/huf.ai.whatsapp.management.sync_templates{,?*}', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ message: { success: true, imported: 0, updated: 0 } }) }));
  await click(page, 'main button:has-text("Sync")');
  await page.waitForSelector('text=No templates yet');
}

/** Broadcast wizard step 1 filled: title, the approved spring_restock template (Radix Select), default variable value and header image link. */
async function broadcastTemplate(page) {
  await fill(page, '#bc-title', B.title);
  await click(page, 'button[aria-label="Approved template"]');
  await click(page, '[role="option"]:has-text("spring_restock")');
  await page.waitForSelector('#bc-var-1');
  for (const [k, v] of Object.entries(B.defaults)) await fill(page, `#bc-var-${k}`, v);
  await fill(page, '#bc-header', B.header_link);
}
async function broadcastRecipients(page) {
  await broadcastTemplate(page);
  await click(page, 'main button:has-text("Next")');
  await click(page, 'button[aria-label="Add an audience"]');
  await click(page, `[role="option"]:has-text("${B.audiences[0].title}")`);
  await page.waitForSelector('[aria-label="Audience counts"]');
  await fill(page, '#bc-recipients', B.recipients_text);
}
const ROW = 'main ul > li:nth-child(3) > button';
const listDescribe = (what) => [`Channels app, WhatsApp > Templates for the fictional supplier Northwind Trading: channel rail with number picker, template list (search, status/category/language filters, status and quality badges) and ${what}.`, 'Establishing shot for any WhatsApp template story; text comes from data/huf/whatsapp.json.'];
const wizardDescribe = (what) => [`Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). ${what}`, 'Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.'];
const previewSlots = { 'p.text-base': 'header_text', 'p.text-sm, div.text-sm': 'body', 'p.text-xs': 'footer', 'p.text-right': 'time', '[data-testid="preview-button"]': 'button_label', '[data-testid="preview-card"] .text-sm': 'card_body' };

export const specs = [
  // ---- templates list + detail -------------------------------------------------------------------------------
  { id: 'huf-wa-templates', name: 'WhatsApp templates page (list + approved template detail with live preview)', url: `${GW}/templates/TPL-0001`, root: '#root', fixtures: FX,
    waitFor: 'h2:has-text("order_shipped")', prepare: async (p) => { await p.waitForSelector('[aria-label="Message preview"]'); await rest(p); },
    describe: listDescribe('the approved "order_shipped" template open: badges, status hint, details list, Send / Edit and resubmit / Delete and the WhatsApp preview'),
    targets: { search: 'input[placeholder^="Search"]' }, states: { hover: { target: ROW, description: 'template row hover (bg-paper-deep)' }, focus: { target: 'search' } }, na: { ...PAGE_NA, empty: 'captured as huf-wa-templates-empty' },
    slotNames: { 'main h2.font-mono': 'template_name', 'main ul li .font-mono': 'row_template_name', 'main ul li button > span:nth-child(2)': 'row_meta' } },
  { id: 'huf-wa-templates-rejected', name: 'WhatsApp templates page, rejected template selected (reason + WhatsApp suggestion)', url: `${GW}/templates/TPL-0004`, root: '#root', fixtures: FX,
    waitFor: 'text=Why it was not approved', prepare: rest,
    describe: listDescribe('the rejected "weekend_flash_deal" template open, with the red "Why it was not approved" note and WhatsApp\'s suggestion'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-wa-templates', focus: 'see huf-wa-templates', active: 'see huf-wa-templates', empty: 'captured as huf-wa-templates-empty' },
    slotNames: { 'main h2.font-mono': 'template_name', '[role="note"] h3': 'reason_title' } },
  { id: 'huf-wa-templates-empty', name: 'WhatsApp templates page, no templates yet', url: `${GW}/templates`, root: '#root', fixtures: FX,
    waitFor: 'main button:has-text("Sync")', prepare: async (p) => { await emptyTemplates(p); await rest(p); },
    describe: listDescribe('the empty state ("No templates yet" card with New template)'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-wa-templates', focus: 'see huf-wa-templates', active: 'see huf-wa-templates', empty: 'this id is the empty state' } },

  // ---- wizard step 1 -----------------------------------------------------------------------------------------
  { id: 'huf-wa-wizard-type', name: 'Template wizard step 1: pick a type (Marketing selected)', url: `${GW}/templates?new=1`, root: '#root', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: rest,
    describe: wizardDescribe('Step 1 with the Marketing tab: Default (selected), Media carousel and the "Coming soon" kinds, canned preview, "Good for" and "Parts you can change".'),
    states: { hover: { target: 'label[for="kind-marketing_carousel"]', description: 'type card hover (bg-paper-deep)' }, focus: { target: '#kind-marketing_carousel' } }, na: { ...PAGE_NA, empty: 'no empty state' } },
  { id: 'huf-wa-wizard-type-utility', name: 'Template wizard step 1: Utility tab selected', url: `${GW}/templates?new=1`, root: '#root', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await click(p, '[role="tab"]:has-text("Utility")'); await click(p, 'label[for="kind-utility_default"]'); await rest(p); },
    describe: wizardDescribe('Step 1 on the Utility tab with Utility · Default selected and the order-update sample preview.'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-wa-wizard-type', focus: 'see huf-wa-wizard-type', active: 'see huf-wa-wizard-type', empty: 'no empty state' } },

  // ---- wizard step 2 -----------------------------------------------------------------------------------------
  { id: 'huf-wa-wizard-write', name: 'Template wizard step 2: write it (filled, live preview)', url: `${GW}/templates?new=1`, root: '#root', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await writeFilled(p); await rest(p); }, settle: 800,
    describe: wizardDescribe('Step 2 filled: name and language, text header, body with two variables and their samples, footer; the live preview updates as you type.'),
    targets: { name: '#tpl-name' }, states: { focus: { target: 'name' } }, na: { ...PAGE_NA, hover: 'no meaningful hover at page level', active: 'no meaningful active state', empty: 'captured as huf-wa-wizard-write-errors' } },
  { id: 'huf-wa-wizard-write-errors', name: 'Template wizard step 2: empty with validation errors (after Next)', url: `${GW}/templates?new=1`, root: '#root', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await next(p); await next(p); await rest(p); },
    describe: wizardDescribe('Step 2 after pressing Next with nothing filled in: red field messages, Next dimmed, empty preview ("Your message preview appears here as you type.").'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-wa-wizard-write', focus: 'see huf-wa-wizard-write', active: 'see huf-wa-wizard-write', empty: 'this id is the empty/error state' } },
  { id: 'huf-wa-wizard-write-add-button', name: 'Template wizard step 2: "Add button" menu (open)', url: `${GW}/templates?new=1`, root: '[data-radix-popper-content-wrapper]', pad: { l: 8, t: 8, r: 8, b: 12 }, fixtures: FX,
    waitFor: 'text=What kind of message is it?',
    prepare: async (p) => { await writeFilled(p); await rest(p); const b = p.locator('main button:has-text("Add button")').first(); await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForSelector('[role="menu"]'); await p.mouse.move(0, 0); await settle(p); },
    describe: ['The "Add button" dropdown of the template wizard (step 2, Buttons section): Custom reply, Visit website, Call phone number, Copy offer code; kinds WhatsApp no longer allows show the reason in grey.', 'Radix portal captured on its own (the page behind it is huf-wa-wizard-write); place it under the "Add button" control when composing.'],
    states: {}, na: { hover: 'menu items highlight on keyboard focus only; not captured', focus: 'menu owns focus', active: 'n/a', disabled: 'no kind is blocked with this draft', error: 'n/a', loading: 'n/a', empty: 'n/a' },
    slotNames: { '[role="menuitem"]': 'menu_item' } },

  // ---- wizard step 3 -----------------------------------------------------------------------------------------
  { id: 'huf-wa-wizard-review', name: 'Template wizard step 3: check and send (ready to submit)', url: `${GW}/templates?new=1`, root: '#root', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await writeFilled(p); await next(p); await p.waitForSelector('text=Ready to send'); await rest(p); },
    describe: wizardDescribe('Step 3: summary (type, name and language, header, body, footer, buttons, samples), "Ready to send" check and "Submit to WhatsApp".'),
    targets: { submit: 'main div.border-t.pt-4 > div > button:last-child' }, states: { hover: { target: 'submit' }, focus: { target: 'submit' } },
    na: { ...PAGE_NA, empty: 'no empty state; Next is blocked until step 2 is valid, so a "N problems" review is not reachable in the UI' } },
  { id: 'huf-wa-wizard-review-edit', name: 'Template wizard step 3 in edit mode (resubmit an approved template)', url: `${GW}/templates?edit=TPL-0001`, root: '#root', fixtures: FX,
    waitFor: '#tpl-name', prepare: async (p) => { await next(p); await p.waitForSelector('text=Submit changes to WhatsApp'); await rest(p); },
    describe: wizardDescribe('Edit mode of "order_shipped" at step 3: step 1 locked, utility expiry row, "Submit changes to WhatsApp".'),
    states: {}, na: { ...PAGE_NA, hover: 'see huf-wa-wizard-review', focus: 'see huf-wa-wizard-review', active: 'see huf-wa-wizard-review', empty: 'no empty state' } },

  // ---- live message preview (component) ----------------------------------------------------------------------
  { id: 'huf-wa-template-preview', name: 'WhatsApp message preview (text header, body with samples, footer, 2 buttons)', url: `${GW}/templates?new=1`, root: 'aside[aria-label="Preview"] [aria-label="Message preview"]', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await writeFilled(p); await rest(p); }, settle: 800,
    describe: ['Live WhatsApp message preview from the template wizard: dotted chat wallpaper, bubble with bold header, body with *bold* formatting and variables filled from samples, footer, time, and the button pills below.', 'Use for close-ups of "what the customer sees"; change copy via slots (header_text, body, footer, button_label).'],
    states: {}, na: { hover: 'static preview, no hover', focus: 'not focusable', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'see huf-wa-wizard-write-errors (empty preview text)' },
    slotNames: previewSlots },
  { id: 'huf-wa-template-preview-image', name: 'WhatsApp message preview with an image header', url: `${GW}/templates?new=1`, root: 'aside[aria-label="Preview"] [aria-label="Message preview"]', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await writeImage(p); await rest(p); }, settle: 800,
    describe: ['Message preview with an image header (fictional Northwind spring-range banner), body, footer and two buttons.', 'The image is a kit asset (assets/); swap it by replacing the file or the img slot.'],
    states: {}, na: { hover: 'static preview', focus: 'not focusable', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' },
    slotNames: { ...previewSlots, img: 'header_image' } },
  { id: 'huf-wa-template-preview-carousel', name: 'WhatsApp message preview, media carousel (2 cards)', url: `${GW}/templates?new=1`, root: 'aside[aria-label="Preview"] [aria-label="Message preview"]', fixtures: FX,
    waitFor: 'text=What kind of message is it?', prepare: async (p) => { await writeCarousel(p); await rest(p); }, settle: 800,
    describe: ['Message preview of a marketing media carousel: intro bubble plus two product cards, each with image, text and a reply button.', 'Card images are fictional kit assets.'],
    states: {}, na: { hover: 'static preview', focus: 'not focusable', active: 'n/a', disabled: 'n/a', error: 'n/a', loading: 'n/a', empty: 'n/a' },
    slotNames: { ...previewSlots, img: 'card_image' } },

  // ---- broadcast wizard ------------------------------------------------------------------------------------
  { id: 'huf-wa-broadcast-wizard', name: 'Broadcast wizard step 1: template (filled)', url: `${GW}/broadcasts/new`, root: '#root', fixtures: FX,
    waitFor: 'text=New broadcast', prepare: async (p) => { await broadcastTemplate(p); await rest(p); },
    describe: ['Channels app, WhatsApp > Broadcasts > New broadcast (5 steps: Template, Recipients, Consent, Preview, Confirm). Step 1 filled: title, approved marketing template, default for {{1}}, header image link and "Send via".', 'Establishing shot for a broadcast/campaign story; data in data/huf/whatsapp.json (broadcast).'],
    states: {}, na: { ...PAGE_NA, hover: 'no meaningful hover at page level', focus: 'see huf-wa-wizard-write', active: 'n/a', empty: 'unfilled step 1 is the route without prepare; not captured' } },
  { id: 'huf-wa-broadcast-wizard-recipients', name: 'Broadcast wizard step 2: recipients (saved list of 1,240 + pasted numbers)', url: `${GW}/broadcasts/new`, root: '#root', fixtures: FX,
    waitFor: 'text=New broadcast', prepare: async (p) => { await broadcastRecipients(p); await rest(p); },
    describe: ['Broadcast wizard step 2: the "Restaurant buyers (opted in)" saved list with tag filters and the count badges (Selected 1240, Opted out 18, Will receive 1222), plus three numbers pasted for this broadcast only.', 'Counts come from data/huf/whatsapp.json (broadcast.preview).'],
    states: {}, na: { ...PAGE_NA, hover: 'n/a', focus: 'n/a', active: 'n/a', empty: 'n/a' } },
];
