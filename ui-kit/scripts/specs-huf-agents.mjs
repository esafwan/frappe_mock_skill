const FX = ['agents', 'agents-editor'];
const ED = '/agents/Order%20Status%20Bot';
const ABIL = { url: ED + '#abilities', root: '#root', fixtures: FX, waitFor: 'text=Northwind Support Handbook' };
export const specs = [
  { id: 'huf-agent-editor-setup', name: 'Agent editor, Setup tab (instructions, basics, model) with the Try it panel', url: ED, root: '#root', fixtures: FX, waitFor: 'text=Order Status Bot',
    describe: ['Full agent editor on the Setup tab: header with status and model chip, tabs, instructions card, and the Try it panel with starter prompts.', 'Use as the establishing shot for editing an agent.'],
    slotNames: { 'h1': 'agent_name' } },
  { id: 'huf-agent-editor-knowledge', name: 'Agent editor, Abilities tab: knowledge sources (ready / failed) and actions', ...ABIL,
    describe: ['Abilities tab with the Knowledge section: sources with mode and health status, then the Actions list.', 'Use to show what documents an agent answers from.'] },
  { id: 'huf-agent-editor-knowledge-add', name: 'Agent editor with the Add knowledge dialog open (source picker)', ...ABIL, root: 'body',
    prepare: async (page) => { await page.getByRole('button', { name: 'Add knowledge' }).click(); await page.waitForSelector('text=Regional Handbooks'); },
    describe: ['Add knowledge dialog over the Abilities tab: searchable source picker with health badges and document counts.'] },
  { id: 'huf-agent-editor-tools', name: 'Agent editor, Abilities tab scrolled to Actions (tools and MCP server rows)', ...ABIL,
    prepare: async (page) => { await page.getByText('Things it can do').scrollIntoViewIfNeeded(); await page.waitForTimeout(200); },
    describe: ['Actions section with attached tools and a connected MCP server.'] },
  { id: 'huf-agent-editor-tools-add', name: 'Agent editor with the Add tool dialog open', ...ABIL, root: 'body',
    prepare: async (page) => { await page.getByRole('button', { name: 'Add tool', exact: true }).click(); await page.waitForSelector('[role=dialog]'); await page.waitForTimeout(400); },
    describe: ['Add tool dialog over the Abilities tab listing available tools.'] },
  { id: 'huf-agent-new', name: 'New agent: create card, empty', url: '/agents/new', root: '#root', fixtures: FX, waitFor: 'text=Create and try it',
    describe: ['New agent create flow, empty.'] },
  { id: 'huf-agent-new-template', name: 'New agent: name typed and a template picked', url: '/agents/new', root: '#root', fixtures: FX, waitFor: 'text=Create and try it',
    prepare: async (page) => { await page.getByRole('textbox').first().fill('Order Helper'); await page.getByText('Customer support', { exact: true }).click(); await page.waitForTimeout(200); },
    describe: ['New agent create flow with name filled and the Customer support template applied.'] },
];
