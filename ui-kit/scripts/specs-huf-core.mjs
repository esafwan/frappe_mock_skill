// Core HUF specs (foundation / feasibility proof): agents list page (pre-develop) and its parts.
const CARD = 'main main .flex-1.p-6 > .grid > div';
export const specs = [
  { id: 'huf-page-agents', name: 'Agents list page (full screen: sidebar + header + filter bar + agent cards)', url: '/agents', root: '#root',
    fixtures: ['agents'], waitFor: 'text=Support Triage',
    describe: ['Complete Agents screen: two-level sidebar (Hub, Build, Library, Monitor), page title, search + status/chat filters and a grid of agent cards.', 'Use as the establishing shot for any agent story, or as the base frame before zooming into one card.'],
    targets: { search: 'input[placeholder^="Search"]', 'nav-agents': 'a[href$="/agents"]' }, states: { hover: { target: `${CARD}:nth-child(2) > div` }, focus: { target: 'search' } },
    na: { disabled: 'page-level: no single disabled control', error: 'page-level error is a toast; capture huf-toast instead', loading: 'skeleton flashes < 100 ms with mocked data', empty: 'capture huf-page-agents-empty (fixtures: [] )' } },
  { id: 'huf-agent-card', name: 'Agent card (name, status dot, description, provider/model/runs/last run, badges, provider logo)', url: '/agents', root: `${CARD}:first-child`,
    fixtures: ['agents'], waitFor: 'text=Support Triage',
    describe: ['One agent card: name, status dot, two-line description, provider/model/runs/last-run ledger, capability badges, settings/logs buttons and provider logo.', 'Use for close-ups or to compose custom agent grids; change text via slots (agent_name, description, status, meta_value_*).'],
    states: { hover: { target: '> div' } }, na: { disabled: 'cards are not disabled; a disabled agent is a data state (status dot "disabled")', error: 'no error variant', loading: 'no skeleton card with mocked data', empty: 'see huf-page-agents empty state' },
    slotNames: { 'h3 span': 'agent_name', 'h3 + p': 'description', '.absolute.right-4 span:last-child': 'status', '.space-y-1 > div > :first-child': 'meta_label', '.space-y-1 > div > :last-child': 'meta_value', '.flex-wrap > div': 'badge', img: 'provider_logo' } },
];
