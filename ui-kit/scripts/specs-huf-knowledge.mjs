// Knowledge area specs (pre-develop): library, add content (upload / web page / text / storage), source page,
// import progress, ask with citations, settings sheet. Fixtures: scripts/huf/fixtures/knowledge.mjs + data/huf/knowledge.json.
// Data variants are separate ids (plan section 8); hover/focus are states.
import fs from 'fs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/knowledge.json', import.meta.url), 'utf8'));
const HANDBOOK = '/knowledge/' + encodeURIComponent('Northwind Support Handbook');
const CONTRACTS = '/knowledge/' + encodeURIComponent('Supplier Contracts');
const REGIONAL = '/knowledge/' + encodeURIComponent('Northwind Regional Handbooks');
const FX = ['agents', 'knowledge'];
const DIALOG = '[role="dialog"]';
const PAD = { l: 32, t: 32, r: 32, b: 48 };
const ASK = 'input[placeholder^="Ask a question"]';
const ROW = 'main [role="row"], main li';

const STAGED = [['Returns Policy 2026.pdf', 50], ['Price List Q4.xlsx', 41], ['Shipping Guide.docx', 32], ['Trail Club Onboarding.pptx', 2350], ['Warranty Terms.pdf', 18], ['Store Pickup Procedure.docx', 12]];
const openAdd = async (page) => { await page.click('main button:has-text("Add content")'); await page.waitForSelector(DIALOG); await page.waitForTimeout(300); };
const tab = (name) => async (page) => { await openAdd(page); await page.click(`${DIALOG} [role="tab"]:has-text("${name}")`); await page.waitForTimeout(300); };
const ask = (q) => async (page) => { await page.fill(ASK, q); await page.keyboard.press('Enter'); await page.waitForSelector('text=Clear search'); await page.locator(ASK).blur(); await page.waitForTimeout(300); };

const pageNa = { disabled: 'page-level: no single disabled control', error: 'page-level errors are toasts', loading: 'skeletons flash < 100 ms with mocked data' };
const dialogNa = { active: 'no pressed variant worth capturing', error: 'upload errors are per-row; not in this fixture', loading: 'import options load instantly with mocked data', empty: 'see huf-knowledge-add-content (empty drop zone is the top half of every upload state)' };

export const specs = [
  // Library
  { id: 'huf-knowledge-library', name: 'Knowledge library (full screen: sidebar, search + status filter, source cards: updating, ready, needs attention, paused)', url: '/knowledge', root: '#root',
    fixtures: FX, waitFor: 'text=Supplier Contracts',
    describe: ['Knowledge screen: every knowledge source as a card with health pill (Updating, Ready, Needs attention, Paused), document count, last update, "Used by N agents" and an Add content button.', 'Establishing shot for any knowledge story; zoom into one card or cut to the source page.'],
    targets: { search: 'input[placeholder^="Search knowledge"]' },
    states: { hover: { target: 'main .grid > div:nth-child(2) > div', description: 'hover on the "Northwind Support Handbook" card' }, focus: { target: 'search' } },
    na: { ...pageNa, empty: 'capture huf-knowledge-library-empty' } },
  { id: 'huf-knowledge-library-empty', name: 'Knowledge library, empty (first-run: "Teach your agents with your own documents.")', url: '/knowledge?demo=empty', root: '#root',
    fixtures: FX, waitFor: 'text=Teach your agents',
    describe: ['First-run Knowledge screen with no sources: headline, Add content / Connect storage actions and three step tiles.', 'Use as the "before" frame of an onboarding story.'],
    states: { hover: { target: 'button:has-text("New knowledge source")' }, focus: { target: 'button:has-text("New knowledge source")' } }, na: pageNa },

  // Add content dialog
  { id: 'huf-knowledge-add-content', name: 'Add content dialog, Upload files tab with staged files (PDF, Excel, Word, PowerPoint)', url: HANDBOOK, root: DIALOG, pad: PAD,
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf',
    prepare: async (page) => { await openAdd(page);
      await page.locator(`${DIALOG} input[type=file]`).first().setInputFiles(STAGED.map(([name, kb]) => ({ name, mimeType: 'application/octet-stream', buffer: Buffer.alloc(kb * 1024) })));
      await page.waitForSelector(`${DIALOG} button:has-text("Add ${STAGED.length} files")`); },
    describe: ['Add content dialog for "Northwind Support Handbook": tabs Upload files / Web page / Text / Connect storage, drop zone and six staged files with sizes, footer "Add 6 files".', 'Use to show how documents get into a knowledge source; pair with huf-knowledge-import-progress.'],
    states: { hover: { target: '[role="tab"]:has-text("Web page")' }, focus: { target: 'button:has-text("Add 6 files")' } }, na: dialogNa },
  { id: 'huf-knowledge-add-content-web', name: 'Add content dialog, Web page tab with a URL filled', url: HANDBOOK, root: DIALOG, pad: PAD,
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf',
    prepare: async (page) => { await tab('Web page')(page); await page.fill(`${DIALOG} input[placeholder^="https://"]`, 'https://northwind.example/help/shipping-rates'); await page.locator(`${DIALOG} input[placeholder^="https://"]`).blur(); },
    describe: ['Add content dialog on the Web page tab: one address field filled with a help-centre page URL.', 'Use to show adding a web page as a source document.'],
    targets: { url: 'input[placeholder^="https://"]' }, states: { focus: { target: 'url' }, hover: { target: '[role="tab"]:has-text("Text")' } }, na: dialogNa },
  { id: 'huf-knowledge-add-content-text', name: 'Add content dialog, Text tab with a title and pasted text', url: HANDBOOK, root: DIALOG, pad: PAD,
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf',
    prepare: async (page) => { await tab('Text')(page); await page.fill(`${DIALOG} input[placeholder="Refund policy"]`, 'Holiday opening hours');
      await page.fill(`${DIALOG} textarea`, 'All stores open 10 am to 4 pm on 24 and 31 December and close on 25 December and 1 January.\nOnline orders placed after 18 December ship in January.\nCustomer care answers chats 9 am to 1 pm on holidays.');
      await page.locator(`${DIALOG} textarea`).blur(); },
    describe: ['Add content dialog on the Text tab: optional title and a textarea with typed holiday opening hours.', 'Use to show teaching an agent a short fact without a file.'],
    targets: { body: 'textarea' }, states: { focus: { target: 'body' }, hover: { target: '[role="tab"]:has-text("Connect storage")' } }, na: dialogNa },
  { id: 'huf-knowledge-add-content-storage', name: 'Add content dialog, Connect storage picker (Amazon S3 / Cloudflare R2, SFTP server, Server folder)', url: HANDBOOK, root: DIALOG, pad: PAD,
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf', prepare: tab('Connect storage'),
    describe: ['Add content dialog on Connect storage: three option cards for bulk import from Amazon S3 / Cloudflare R2, an SFTP server or a server folder.', 'Use to show bulk import of a whole document store.'],
    states: { hover: { target: 'button:has-text("Amazon S3")' }, focus: { target: 'button:has-text("Amazon S3")' } }, na: dialogNa },

  // Source page
  { id: 'huf-knowledge-source', name: 'Knowledge source page, ready (status sentence, ask field, document ledger with mixed formats and origins)', url: HANDBOOK, root: '#root',
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf',
    describe: ['Source page for "Northwind Support Handbook": "Ready · 18 documents · used by 2 agents", ask field, and a ledger of PDF, XLSX, DOCX, PPTX, URL, TXT, MD and HTML documents from uploads, S3, a web page and typed text.', 'Main establishing shot of a knowledge source; cut to huf-knowledge-ask for the answer.'],
    targets: { ask: ASK },
    states: { hover: { target: 'main button:has-text("Add content")' }, focus: { target: 'ask', description: 'ask field focused (blue ring), ready to type a question' } },
    na: { ...pageNa, empty: 'not captured: StepHint + drop zone page (backlog huf-knowledge-source-empty)' } },
  { id: 'huf-knowledge-source-attention', name: 'Knowledge source page, needs attention (failed and skipped documents with reasons and Retry)', url: CONTRACTS, root: '#root',
    fixtures: FX, waitFor: 'text=Freight Terms - Bluewater Logistics.pdf',
    describe: ['Source page for "Supplier Contracts" after an S3 import: "3 documents need attention" with Review, filter pills with counts, failed rows with plain-language reasons and Retry, skipped rows.', 'Use for the "something went wrong, one click fixes it" beat.'],
    states: { hover: { target: 'button:has-text("Review")' }, focus: { target: 'button:has-text("Review")' } }, na: pageNa },

  // Import progress
  { id: 'huf-knowledge-import-progress', name: 'Knowledge source page while importing (Importing · 58 of 112, progress row, Adding… rows, Skipped 8)', url: REGIONAL, root: '#root',
    fixtures: FX, waitFor: 'text=Importing from', settle: 900,
    describe: ['Source page for "Northwind Regional Handbooks" during an S3 import: live "Importing · 58 of 112" header, progress row with View details / Cancel, documents marked "Adding…" and ready rows below.', 'Use for the background-import beat; the numbers are text slots.'],
    states: { hover: { target: 'button:has-text("View details")' }, focus: { target: 'button:has-text("Cancel")' } }, na: pageNa },

  // Ask with citations
  { id: 'huf-knowledge-ask', name: 'Ask a question: passages with citations (page labels, match strength, highlighted terms)', url: HANDBOOK, root: '#root',
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf', prepare: ask(D.ask.query),
    describe: [`Source page after asking "${D.ask.query}": "These are the passages your agents would read." and result cards citing document, page ("page 2", "pages 2–3"), High/Good match, with query words highlighted and Open document links.`, 'Use to show answers grounded in your own documents (citations).'],
    states: { hover: { target: ':is(a,button):has-text("Open document")' }, focus: { target: 'button:has-text("Clear search")' } }, na: { ...pageNa, empty: 'capture huf-knowledge-ask-empty' } },
  { id: 'huf-knowledge-ask-empty', name: 'Ask a question: nothing matched', url: HANDBOOK + '?demo=noresults', root: '#root',
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf', prepare: ask(D.ask.empty_query),
    describe: ['Source page after a question with no matching passages: "No passages found." and "Nothing matched. Try different words."', 'Use for the honest "I do not know" beat.'],
    states: { hover: { target: 'button:has-text("Clear search")' }, focus: { target: 'button:has-text("Clear search")' } }, na: pageNa },

  // Settings sheet
  { id: 'huf-knowledge-settings', name: 'Knowledge source settings sheet (details, available to agents, advanced, danger zone)', url: HANDBOOK, root: DIALOG, pad: { l: 32, t: 0, r: 0, b: 0 },
    fixtures: FX, waitFor: 'text=Returns Policy 2026.pdf',
    prepare: async (page) => { await page.click('main button[aria-label="More actions"]'); await page.click('[role="menuitem"]:has-text("Settings")'); await page.waitForSelector(DIALOG); await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(400); },
    describe: ['Right-hand settings sheet of "Northwind Support Handbook": name, description, "Available to agents" switch, collapsed Advanced section and the Delete danger zone.', 'Use for configuration close-ups.'],
    targets: { name: 'input' }, states: { active: { target: 'name', description: 'mouse down in the Name field (the automatic first-control target is the close button, which would close the sheet)' }, focus: { target: 'name' }, hover: { target: 'button:has-text("Advanced")' } }, na: dialogNa },
];
