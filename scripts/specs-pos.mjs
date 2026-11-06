// URY POS component specs (React/Tailwind SPA at /pos, Vue Mosaic at /mosaic)
const CSS = ['fonts.css', 'ury-pos.css'];
const CARDS = '.grid.grid-cols-2.gap-3';
const clean = (p) => p.evaluate(() => { document.querySelectorAll('.fixed.bottom-5.right-5').forEach(e => e.remove()); document.querySelectorAll('.Toastify__toast-container').forEach(e => e.remove()); });
const register = async (p) => { await p.waitForSelector(`${CARDS} > div:has-text("Available")`, { timeout: 15000 }); await p.waitForTimeout(800); };
// keep only a deterministic, available subset of the 200+ menu cards (call AFTER any click that re-renders React)
const trim = (n) => (p) => p.evaluate((n) => { const g = document.querySelector('.grid.grid-cols-2.gap-3'); [...g.children].forEach(c => { if (!/Available/.test(c.innerText)) c.remove(); }); [...g.children].slice(n).forEach(c => c.remove()); }, n);
const addFirst = async (p) => { await register(p); await p.locator(`${CARDS} > div:has-text("Available")`).first().click(); await p.waitForTimeout(800); };
const ordersPrep = async (p) => { await p.waitForSelector('.grid > div:has-text("URY-")', { timeout: 15000 }); await p.waitForTimeout(600); };
const hover = (t) => ({ hover: { target: t }, focus: { target: t } });

export const specs = [
  { id: 'pos-navbar', name: 'POS top navbar (logo, search, user)', group: 'pos', css: CSS, url: '/pos/register', root: 'header.sticky', settle: 1500,
    targets: { logo: 'a:first-child', search: 'input', user: 'button:has(span.text-sm)' },
    prepare: clean, states: { hover: { target: 'user' }, focus: { target: 'search' } } },
  { id: 'pos-bottom-nav', name: 'POS bottom navigation', group: 'pos', css: CSS, url: '/pos/register', root: 'div.border-t.border-border[class*="py-1.5"]', settle: 1500,
    targets: { active: 'a:nth-child(2)' }, prepare: clean, states: { hover: { target: 'a:nth-child(3)' }, focus: { target: 'a:nth-child(3)' } } },
  { id: 'pos-category-tabs', name: 'Menu category tabs (pills)', group: 'pos', css: CSS, url: '/pos/register', root: 'div.flex.items-center.gap-2.overflow-x-auto.overflow-y-hidden', settle: 1500,
    prepare: clean, targets: { all: 'button:nth-child(1)', special: 'button:nth-child(2)' }, states: hover('special') },
  { id: 'pos-item-grid', name: 'Menu item grid', group: 'pos', css: CSS, url: '/pos/register', root: CARDS, settle: 2500,
    prepare: async (p) => { await register(p); await clean(p); await trim(10)(p); }, targets: {}, states: { hover: { target: 'div.cursor-pointer' } } },
  { id: 'pos-item-card', name: 'Menu item card', group: 'pos', css: CSS, url: '/pos/register', root: `${CARDS} > div:first-child`, settle: 2500,
    prepare: async (p) => { await register(p); await clean(p); await trim(10)(p); }, targets: {}, states: { hover: {}, focus: {}, active: {} } },
  { id: 'pos-cart', name: 'Order cart (lines, totals, actions)', group: 'pos', css: CSS, url: '/pos/register', root: 'div.w-96.bg-white.border-s', settle: 2500,
    prepare: async (p) => { await addFirst(p); await clean(p); },
    targets: { qty: 'button.inline-flex' },
    states: { hover: { target: 'qty' }, focus: { target: 'qty' }, active: { target: 'qty' },
      empty: { act: async (p) => { await p.locator('button:has-text("Clear cart")').first().click(); await p.waitForTimeout(600); }, description: 'Clear cart' } } },
  { id: 'pos-table-picker', name: 'Table picker grid (available / occupied tables)', group: 'pos', css: CSS, url: '/pos/tables', root: '.grid[class*="grid-cols-2"].gap-4', settle: 2500,
    prepare: async (p) => { await p.waitForSelector('.grid.gap-4 > div:has-text("Seats")', { timeout: 15000 }); await clean(p); },
    targets: {}, states: { hover: { target: '[class*="min-h-[15.5rem]"]:nth-child(3)' } } },
  { id: 'pos-order-status-chips', name: 'Order status filter chips', group: 'pos', css: CSS, url: '/pos/orders', root: 'div.w-64 nav > div.bg-gray-50', settle: 2000,
    prepare: clean, targets: {}, states: { hover: { target: '.space-y-1 > *:nth-child(2)' }, focus: { target: '.space-y-1 > *:nth-child(2)' } } },
  { id: 'pos-payment-dialog', name: 'Payment dialog', group: 'pos', css: CSS, url: '/pos/orders', root: '#ui-pay-card', settle: 3000,
    prepare: async (p) => {
      await ordersPrep(p); await p.locator('.grid > div:has-text("URY-2026-2027-02784")').first().click(); await p.waitForTimeout(1200);
      const open = async () => { await p.locator('button:has-text("Payment")').first().click(); await p.waitForTimeout(1500); return p.locator('[role=dialog]').count(); };
      if (!(await open())) { await p.locator('.w-96 button:has(svg.lucide-printer)').first().click(); await p.waitForTimeout(3500); await open(); }
      await p.evaluate(() => { const d = document.querySelector('[role=dialog]'); const card = d.querySelector(':scope > div.relative'); const w = card.getBoundingClientRect().width; card.id = 'ui-pay-card'; card.style.width = w + 'px'; card.style.cssText += ';position:absolute;left:80px;top:80px;margin:0;animation:none'; document.body.appendChild(card); d.remove(); document.getElementById('root').style.display = 'none'; });
      await clean(p);
    }, targets: { }, states: { hover: { target: 'button:last-of-type' }, focus: { target: 'input' } } },
  { id: 'pos-kot-view', name: 'Kitchen / KOT production-unit overview (Mosaic)', group: 'pos', css: ['fonts.css', 'ury-mosaic.css'], url: '/mosaic/', root: 'div.p-6 > .grid', settle: 3000,
    prepare: async (p) => { await p.waitForSelector('div.p-6 > .grid > div', { timeout: 15000 }); }, targets: {},
    states: { hover: { target: 'div.cursor-pointer' } } },
];
