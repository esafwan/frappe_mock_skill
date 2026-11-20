// Tools area specs (pre-develop): execution profiles (safe code execution), SSH connections, network access policies, batch jobs.
// Fixtures: scripts/huf/fixtures/tools.mjs + data/huf/tools.json.
const FX = ['tools'];
const DIALOG = '[role="dialog"]';
const DST = { hover: { target: '.divide-y' }, focus: { target: '.divide-y' }, active: { target: '.divide-y' } };
const pageNa = { disabled: 'page-level: no single disabled control', error: 'page-level errors are toasts', loading: 'skeletons flash < 100 ms with mocked data', empty: 'see the matching -empty id where captured' };
export const specs = [
  { id: 'huf-code-profiles', name: 'Execution profiles list (approval mode, filesystem policy, resource limits, status)', url: '/execution-profiles', root: '#root', fixtures: FX, waitFor: 'text=Reports with warehouse access',
    describe: ['Execution profiles screen: table of the safe-code-execution profiles with approval mode, filesystem policy, wall time / memory limits and Active or Disabled status.', 'Use for "you decide where agent code may run" beats.'],
    targets: { search: 'input[placeholder^="Search execution"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)' }, focus: { target: 'search' } }, na: pageNa },
  { id: 'huf-ssh-connections', name: 'SSH connections list (pinned host keys, last test, enabled)', url: '/ssh-connections', root: '#root', fixtures: FX, waitFor: 'text=Northwind reporting server',
    describe: ['SSH connections screen: remote hosts with user@host:port, auth method, host key Pinned or Unenrolled, last test result and Enabled status.', 'Use to show agents running commands on managed hosts.'],
    targets: { search: 'input[placeholder^="Search SSH"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)' }, focus: { target: 'search' } }, na: pageNa },
  { id: 'huf-netpolicy-list', name: 'Network access policies list (rule counts)', url: '/network-policies', root: '#root', fixtures: FX, waitFor: 'text=Warehouse API only',
    describe: ['Network access policies screen: named egress policies with rule counts and last modified, plus New policy.', 'Use to show which hosts and ports agent code may reach.'],
    targets: { search: 'input[placeholder^="Search network"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)' }, focus: { target: 'search' } }, na: pageNa },
  { id: 'huf-batch-jobs', name: 'Batch jobs list (agent, provider, status, submitted, completed, est. cost)', url: '/batch-jobs', root: '#root', fixtures: FX, waitFor: 'text=Weekly Stock Digest',
    describe: ['Batch jobs screen: scheduled-agent batches across OpenAI, Anthropic and Gemini with status dots (Completed, In progress, Submitted, Failed, Expired) and estimated cost.', 'Use for the "run big jobs at half price overnight" beat.'],
    targets: { search: 'input[placeholder^="Search batch"]' }, states: { hover: { target: 'main tbody tr:nth-child(2)' }, focus: { target: 'search' } }, na: pageNa },
  { id: 'huf-batch-job-detail', name: 'Batch job dialog, completed (details and results)', url: '/batch-jobs', root: DIALOG, pad: { l: 32, t: 32, r: 32, b: 48 }, fixtures: FX, waitFor: 'text=Weekly Stock Digest',
    prepare: async (page) => { await page.click('main tbody tr:has-text("BJ"), main tbody tr:has-text("Weekly Stock Digest")'); await page.waitForSelector(DIALOG); await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(300); },
    describe: ['Batch job dialog for a completed Weekly Stock Digest batch: provider, 240 requests, times, estimated cost and a results table (succeeded, failed, tokens).', 'Use after huf-batch-jobs to show the outcome of one batch.'],
    states: DST, na: { ...pageNa, disabled: 'read-only dialog' } },
  { id: 'huf-batch-job-failed', name: 'Batch job dialog, failed (provider error message)', url: '/batch-jobs', root: DIALOG, pad: { l: 32, t: 32, r: 32, b: 48 }, fixtures: FX, waitFor: 'text=Weekly Stock Digest',
    prepare: async (page) => { await page.click('main tbody tr:has-text("Failed")'); await page.waitForSelector(DIALOG); await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(300); },
    describe: ['Batch job dialog for a failed Product Description Refresh batch with the provider error in plain words.', 'Use for the "what went wrong" beat.'],
    states: DST, na: { ...pageNa, disabled: 'read-only dialog' } },
  { id: 'huf-code-profile-edit', name: 'Execution profile editor (approval mode, filesystem, network policy, modules, limits, broker capabilities)', url: '/execution-profiles/' + encodeURIComponent('Reports with warehouse access'), root: '#root', fixtures: FX, waitFor: 'text=Resource limits',
    describe: ['Execution profile editor for "Reports with warehouse access": approval mode, filesystem policy, network access policy, allowed Python modules, resource limits and the broker capabilities it may use.', 'Use to show how safe code execution is configured.'],
    targets: { name: 'input[placeholder="e.g. Standard Sandbox"]' }, states: { focus: { target: 'name' }, hover: { target: 'button:has-text("Save changes")' } }, na: pageNa },
  { id: 'huf-ssh-connection-edit', name: 'SSH connection editor (connection details, key auth, host key)', url: '/ssh-connections/SSH-0001', root: '#root', fixtures: FX, waitFor: 'text=Connection details',
    describe: ['SSH connection editor for the warehouse printer host: enable switch, host, port, user, private-key authentication and the pinned host key section, with Test connection.', 'Use for configuring remote execution.'],
    states: { hover: { target: 'button:has-text("Test connection")' }, focus: { target: 'input[placeholder^="192.168"]' } }, na: pageNa },
  { id: 'huf-netpolicy-edit', name: 'Network access policy editor (host / CIDR, port range, protocol rules)', url: '/network-policies/' + encodeURIComponent('Internal services only'), root: '#root', fixtures: FX, waitFor: 'text=Rules',
    describe: ['Network access policy editor for "Internal services only": general settings and three allow rules with host or CIDR, port range and protocol.', 'Use to show egress allow-listing for agent code.'],
    states: { hover: { target: 'button:has-text("Save changes")' }, focus: { target: 'input[placeholder^="api.example"]' } }, na: pageNa },
];
