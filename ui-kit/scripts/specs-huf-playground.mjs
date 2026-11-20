// Playground specs (pre-develop, /playground): empty bench, a completed agent run (response, trace, evaluation, ledger),
// the generation settings (provider / model / temperature / max tokens / evaluation criteria), compare view, template picker.
// Fixtures: scripts/huf/fixtures/playground.mjs + data/huf/playground.json. Runs are driven through the real UI against mocked run endpoints.
import fs from 'fs';
const D = JSON.parse(fs.readFileSync(new URL('../data/huf/playground.json', import.meta.url), 'utf8'));
const FX = ['agents-editor', 'agents', 'playground'];
const settle = (page, ms = 350) => page.waitForTimeout(ms);
const click = async (page, sel) => { await page.locator(sel).first().click(); await settle(page); };
const fill = async (page, sel, v) => { const l = page.locator(sel).first(); await l.fill(v); await l.blur(); await settle(page, 120); };
const rest = async (page) => { await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(0, 0); await page.evaluate(() => document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; })); await settle(page); };
/** Pick an option of the n-th select (combobox) inside `scope`. */
const pick = async (page, scope, n, label) => { await page.locator(`${scope} [role="combobox"]`).nth(n).click(); await settle(page, 200); await page.locator(`[role="option"]:has-text("${label}")`).first().click(); await settle(page, 250); };
const PROMPT = 'textarea[placeholder^="Type a prompt"]';
const RUN = 'button:has-text("Run")';
const FRAME = 'main';

const na = { disabled: 'page-level: no single disabled control', loading: 'mocked runs resolve instantly (the Running state is a 1 s flash)', error: 'a failed run shows the raw payload in the response panel; not captured here' };
const describe = (what) => [`Playground (Single mode) for Northwind Trading: Decision Runtime strip, Agent / Provider / Model / Temp · max tok bar, Prompt, Response and Trace panels and the Run ledger. ${what}`, 'Full 1440x900 page with the app sidebar collapsed (the Playground closes it for width).'];

async function singleRun(page) {
  await pick(page, FRAME, 1, D.single.agent);
  await fill(page, PROMPT, D.single.prompt);
  await click(page, 'button:has-text("Criteria"), button:has-text("Evaluation criteria")');
  await fill(page, 'textarea[placeholder^="Describe what a good response"]', D.single.criteria);
  await click(page, RUN);
  await page.waitForSelector('text=pass ·', { timeout: 8000 });
  await page.waitForSelector('[aria-expanded] >> text=lookup_order');
  await settle(page, 500);
}
async function directSettings(page) {
  await pick(page, FRAME, 2, D.direct.provider);
  await pick(page, FRAME, 3, 'GPT-4.1 mini');
  await fill(page, 'input[aria-label="Temperature"]', D.direct.temperature);
  await fill(page, 'input[aria-label="Max tokens"]', D.direct.maxTokens);
  await fill(page, PROMPT, D.direct.prompt);
  await click(page, 'button:has-text("Evaluation criteria")');
  await fill(page, 'textarea[placeholder^="Describe what a good response"]', D.single.criteria);
}
async function compareRun(page) {
  await click(page, '[role="tab"]:has-text("Compare")');
  for (const [col, key] of [[0, 'a'], [1, 'b']]) {
    const c = D.compare[key]; const scope = `main >> nth=0`; void scope;
    const base = col * 3; // each compact strip: provider, model, agent comboboxes
    await pick(page, FRAME, base, c.provider);
    await pick(page, FRAME, base + 1, key === 'a' ? 'GPT-4.1 mini' : 'Mistral Large');
    await fill(page, `main textarea[placeholder^="Type a prompt"] >> nth=${col}`, D.compare.prompt);
    await page.locator('input[aria-label="Temperature"]').nth(col).fill(c.temperature);
    await page.locator('input[aria-label="Max tokens"]').nth(col).fill(c.maxTokens);
    await page.locator('input[aria-label="Max tokens"]').nth(col).blur();
  }
  await click(page, 'button:has-text("Run both")');
  await page.waitForSelector('text=Response B >> xpath=../..//span[contains(.,"ok")]', { timeout: 8000 }).catch(() => {});
  await settle(page, 700);
}

export const specs = [
  { id: 'huf-playground-empty', name: 'Playground, empty bench (Single mode, nothing run yet)', url: '/playground', root: '#root', fixtures: FX,
    waitFor: 'text=Run a prompt to see the response here.', prepare: rest,
    describe: describe('Empty state: placeholders in the prompt, response and trace panels and "No runs yet" in the ledger.'),
    targets: { prompt: PROMPT }, states: { hover: { target: 'button:has-text("Templates")' }, focus: { target: 'prompt' } }, na: { ...na, empty: 'this id is the empty state' },
    slotNames: { 'section[aria-label="Decision Runtime preview"] p': 'runtime_caption' } },
  { id: 'huf-playground-run', name: 'Playground, completed agent run (response, trace steps, evaluation pass, run ledger)', url: '/playground?demo=ledger', root: '#root', fixtures: FX,
    waitFor: 'text=Run ledger', prepare: async (p) => { await singleRun(p); await rest(p); }, settle: 600,
    describe: describe('Order Status Bot answered a WhatsApp delay question: response with latency, tokens and cost in the header, three trace steps (agent, lookup_order tool, agent), an evaluation verdict and the run ledger with earlier runs.'),
    states: { hover: { target: 'ul.font-mono li:nth-child(2) button', description: 'trace step hover' }, focus: { target: 'button:has-text("Run")' } }, na: { ...na, empty: 'see huf-playground-empty' },
    slotNames: { 'p.whitespace-pre-wrap': 'response', 'ul.font-mono li:nth-child(2) button span.truncate': 'trace_tool' } },
  { id: 'huf-playground-settings', name: 'Playground, generation settings (direct run, model picker open, evaluation criteria)', url: '/playground', root: 'body', fixtures: FX,
    waitFor: 'text=Run a prompt to see the response here.',
    prepare: async (p) => { await directSettings(p); await p.locator(`${FRAME} [role="combobox"]`).nth(3).click(); await settle(p, 300); },
    describe: describe('Direct run (no agent): provider OpenAI, temperature 0.3, max tokens 800, evaluation criteria expanded and the Model dropdown open.'),
    states: {}, na: { ...na, hover: 'see huf-playground-empty', focus: 'see huf-playground-empty', active: 'dropdown is the open state', empty: 'see huf-playground-empty' } },
  { id: 'huf-playground-compare', name: 'Playground, Compare mode after Run both (two models, word diff of the answers)', url: '/playground?demo=ledger', root: '#root', fixtures: FX,
    waitFor: 'text=Run ledger', prepare: async (p) => { await compareRun(p); await rest(p); }, settle: 600,
    describe: ['Playground in Compare mode: columns A and B each with provider, model, agent, temperature and max tokens, the same prompt, both responses with word-level diff highlighting and the centre console (copy, swap, diff toggle).', 'Shows two models answering the same prompt side by side.'],
    states: { hover: { target: 'button[aria-label="Swap A and B"]' }, focus: { target: 'button:has-text("Run both")' } }, na: { ...na, empty: 'compare starts empty; see huf-playground-empty' } },
  { id: 'huf-playground-templates', name: 'Playground, Load template dialog', url: '/playground', root: '[role="dialog"]', fixtures: FX, pad: { l: 32, t: 32, r: 32, b: 48 },
    waitFor: 'text=Run a prompt to see the response here.',
    prepare: async (p) => { await click(p, 'button:has-text("Templates")'); await click(p, '[role="menuitem"]:has-text("Load template")'); await p.waitForSelector('text=Order delay apology'); await rest(p); },
    describe: ['Load template dialog opened from Templates > Load template…: search box and a list of active prompt templates with visibility badge, description and tags.', 'Close-up for the "reuse a saved prompt" beat.'],
    targets: { search: 'input[placeholder^="Search templates"]' }, states: { hover: { target: '[role="dialog"] .divide-y > button:nth-child(2)' }, focus: { target: 'search' } }, na: { ...na, empty: 'a search with no match shows "No templates match your search."' } },
];
