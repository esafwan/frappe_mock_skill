// URY v16 admin dashboard (Service Board) specs: KPI grid, chart cards, quick actions, full screen.
// Sources: frontend/src/pages/Dashboard/{DashboardPage,KPIGrid,AnalyticsCharts,QuickActions,ReportWidgets}.tsx, frontend/src/lib/dashboardStatsKpis.ts,
// packages/ui/src/components/{kpi-strip,stat-card,card,data-table,spinner}.tsx, frontend/src/components/reports/charts/*ChartCard.tsx.
import { ic, money, screen, STATE_NA } from '../lib.mjs';
import { adminLayout, shellSlots, shellRtl } from './shell.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/admin-shell.css', 'ury-v16/components/admin-dashboard.css'];
const base = { group: 'ury-admin', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const NA = (what) => ({ disabled: `not applicable: ${what} has no disabled state in the source`, error: `not applicable: ${what} has no error state of its own`, loading: `not applicable: ${what} has no loading state in the source` });

// lucide-react 0.525 ExternalLink (ISC), not in ../icons.mjs
const EXTRA = { ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' };
const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const u = (id) => `data-ui="${id}"`;

// ---------- copy registry: key -> [English (source __() strings or sample data), Arabic] ----------
// Arabic comes from ury/translations/ar.csv. Sample data (names, items, payment modes) and fixed labels without an ar.csv entry are translated here.
const REG = {};
const S = (key, en, ar = en) => { REG[key] = [en, ar]; return `{{${key}}}`; };
const MONEY = {};
const M = (key, amount, cur = 'AED') => { MONEY[key] = money(amount, cur); return `{{${key}}}`; };
const keysIn = (html) => [...new Set([...String(html).matchAll(/\{\{([a-z0-9_]+)\}\}/g)].map((m) => m[1]))];
const slotsFor = (...h) => { const ks = keysIn(h.join('')).filter((k) => MONEY[k] || REG[k]); return Object.fromEntries(ks.map((k) => [k, MONEY[k] || REG[k][0]])); };
const rtlFor = (...h) => { const ks = keysIn(h.join('')).filter((k) => REG[k]); return Object.fromEntries(ks.map((k) => [k, REG[k][1]])); };

// ---------- spinner (packages/ui spinner.tsx, h-6 w-6 ring, static frame) ----------
const spinner = () => `<div class="ud-spin" role="status"><div class="ud-spin__in"><div class="ud-spin__ring" aria-hidden="true"></div><p class="ud-spin__msg">${S('loading', 'Loading...', 'جارٍ التحميل...')}</p></div></div>`;

// ---------- KPI grid ----------
const kpiItem = (label, value, tone, hint, id) => `<div class="u-kpi" ${u(id)}><div class="u-kpi-label">${label}</div><div class="u-kpi-value${tone ? ' u-kpi-value--' + tone : ''}">${value}</div>${hint ? `<div class="u-kpi-hint">${hint}</div>` : ''}</div>`;
const linkCard = (label, sub, id) => `<a class="ud-link" title="${sub}" ${u(id)}>${I('ExternalLink', 14)}<span>${label}</span><span class="ud-link__sub ud-trunc">— ${sub}</span></a>`;
const lPos = () => linkCard(S('k_pos', 'POS', 'نقطة البيع'), S('k_pos_sub', 'Billing &amp; order taking', 'الفوترة وتسجيل الطلبات'), 'ury-admin-kpi-grid.link-pos');
const lMosaic = () => linkCard(S('k_mosaic', 'Mosaic', 'موزاييك'), S('k_mosaic_sub', 'Kitchen Display System', 'شاشة المطبخ'), 'ury-admin-kpi-grid.link-mosaic');
const KL = { sales: ["Today's Sales", 'مبيعات اليوم'], orders: ['Orders Today', 'طلبات اليوم'], avg: ['Avg. Order Value', 'متوسط قيمة الطلب'], tables: ['Active Tables', 'الطاولات النشطة'] };
const kl = (k) => S('k_' + k, ...KL[k]);
function kpiGrid(p = {}) {
  const mixed = !!p.mixed; const full = !!p.full;
  const sales = mixed ? `${M('kv_sales_aed', 18640)} · ${M('kv_sales_usd', 1250, 'USD')}` : M('kv_sales', 18640);
  const avg = mixed ? `${M('kv_avg_aed', 145.63)} · ${M('kv_avg_usd', 62.5, 'USD')}` : M('kv_avg', 145.63);
  const tables = '<span class="u-num">' + (full ? S('k_tables_full', '19 / 22') : S('k_tables_val', '14 / 22')) + '</span>';
  const body = p.loading ? `<div class="ud-kpis__load" ${u('ury-admin-kpi-grid.loading')}>${spinner()}</div>`
    : p.cards ? `<div class="ud-cards" ${u('ury-admin-kpi-grid.cards')}>
${statCard(kl('sales'), sales, 'success', 'TrendingUp', 'up', S('d_up1', '+12.4%'), null, 'ury-admin-kpi-grid.card-sales')}
${statCard(kl('orders'), S('k_orders_val', '128'), 'primary', 'Receipt', 'up', S('d_up2', '+8.1%'), null, 'ury-admin-kpi-grid.card-orders')}
${statCard(kl('avg'), avg, 'default', 'Coins', 'down', S('d_down', '-3.2%'), null, 'ury-admin-kpi-grid.card-avg')}
${statCard(kl('tables'), tables, full ? 'warning' : 'default', 'Armchair', 'flat', S('d_flat', '0.0%'), full ? S('k_full', 'Floor nearly full', 'الصالة شبه ممتلئة') : null, 'ury-admin-kpi-grid.card-tables')}</div>`
    : `<div class="u-kpi-strip" ${u('ury-admin-kpi-grid.strip')}>
${kpiItem(kl('sales'), sales, 'success', mixed ? S('k_mixed', 'Multiple currencies — not summed', 'عملات متعددة — بدون جمع') : '', 'ury-admin-kpi-grid.kpi-sales')}
${kpiItem(kl('orders'), S('k_orders_val', '128'), '', '', 'ury-admin-kpi-grid.kpi-orders')}
${kpiItem(kl('avg'), avg, '', '', 'ury-admin-kpi-grid.kpi-avg')}
${kpiItem(kl('tables'), tables, full ? 'warning' : '', full ? S('k_full', 'Floor nearly full', 'الصالة شبه ممتلئة') : '', 'ury-admin-kpi-grid.kpi-tables')}</div>`;
  return `<section class="ud ud-kpis" ${u('ury-admin-kpi-grid')}><div class="ud-links" ${u('ury-admin-kpi-grid.links')}>${lPos()}${lMosaic()}</div>${body}</section>`;
}
const ARROW = { up: '▲', down: '▼', flat: '—' };
function statCard(label, value, tone, icon, dir, delta, hint, id) {
  const chip = tone === 'default' ? `<span class="ud-stat__ico">${I(icon, 20)}</span>` : `<span class="ud-stat__chip ud-stat__chip--${tone}">${I(icon, 20)}</span>`;
  return `<div class="ud-stat${tone !== 'default' ? ' ud-stat--' + tone : ''}" ${u(id)}><div class="ud-stat__top"><span class="ud-stat__label">${label}</span>${chip}</div><div class="ud-stat__value">${value}</div>${hint ? `<div class="ud-stat__hint">${hint}</div>` : ''}<div class="ud-stat__delta ud-stat__delta--${dir}"><span aria-hidden="true">${ARROW[dir]}</span><span>${delta}</span></div></div>`;
}

// ---------- charts (Recharts output as static SVG) ----------
const COL = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#0ea5e9', '#14b8a6']; // CHART_COLORS
const f = (n) => +n.toFixed(2);
function monoPath(P) {
  const n = P.length; let d = `M${f(P[0][0])},${f(P[0][1])}`; if (n < 2) return d;
  const h = [], s = [];
  for (let i = 0; i < n - 1; i++) { h[i] = P[i + 1][0] - P[i][0]; s[i] = (P[i + 1][1] - P[i][1]) / h[i]; }
  const t = new Array(n); t[0] = s[0]; t[n - 1] = s[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (s[i - 1] * s[i] <= 0) t[i] = 0;
    else { const pp = (s[i - 1] * h[i] + s[i] * h[i - 1]) / (h[i - 1] + h[i]); t[i] = (Math.sign(s[i - 1]) + Math.sign(s[i])) * Math.min(Math.abs(s[i - 1]), Math.abs(s[i]), 0.5 * Math.abs(pp)) || 0; }
  }
  for (let i = 0; i < n - 1; i++) { const dx = h[i] / 3; d += ` C${f(P[i][0] + dx)},${f(P[i][1] + t[i] * dx)} ${f(P[i + 1][0] - dx)},${f(P[i + 1][1] - t[i + 1] * dx)} ${f(P[i + 1][0])},${f(P[i + 1][1])}`; }
  return d;
}
// cartesian frame: ResponsiveContainer 100% x 300, chart margin 5, YAxis width 64, XAxis height 30
const FR = (W) => ({ W, H: 300, L: 69, R: W - 5, T: 5, B: 265 });
function frame(W, yTicks, d0, d1, xs, yLabel, xLabel, gridX) {
  const { L, R, T, B } = FR(W); const yy = (v) => B - ((v - d0) / (d1 - d0)) * (B - T);
  const g = [...yTicks.map((v) => `<line class="ud-grid" x1="${L}" x2="${R}" y1="${f(yy(v))}" y2="${f(yy(v))}"/>`), ...gridX.map((x) => `<line class="ud-grid" x1="${f(x)}" x2="${f(x)}" y1="${T}" y2="${B}"/>`)].join('');
  const ax = `<line class="ud-axis" x1="${L}" x2="${R}" y1="${B}" y2="${B}"/><line class="ud-axis" x1="${L}" x2="${L}" y1="${T}" y2="${B}"/>`;
  const xt = xs.map(([x, k]) => `<line class="ud-axis" x1="${f(x)}" x2="${f(x)}" y1="${B}" y2="${B + 6}"/><text class="ud-ct" x="${f(x)}" y="${B + 8}" dy=".71em" text-anchor="middle">${xLabel(k)}</text>`).join('');
  const yt = yTicks.map((v, i) => `<line class="ud-axis" x1="${L - 6}" x2="${L}" y1="${f(yy(v))}" y2="${f(yy(v))}"/><text class="ud-ct" x="${L - 8}" y="${f(yy(v))}" dy=".355em" text-anchor="end">${yLabel(v, i)}</text>`).join('');
  return { yy, svg: `${g}${ax}${xt}${yt}` };
}
const svgWrap = (W, inner, id) => `<div class="ud-chart__plot" ${u(id)}><svg width="${W}" height="300" viewBox="0 0 ${W} 300" role="img">${inner}</svg></div>`;
const cardWrap = (title, body, id, w = 546) => `<div class="ud ud-chart" style="width:${w}px" ${u(id)}><div class="ud-chart__h"><h3 class="ud-chart__t" ${u(id + '.title')}>${title}</h3></div><div class="ud-chart__c">${body}</div></div>`;
const tick = (k, v) => S(k, v);

const TREND = [['d1', '11/15', 8420], ['d2', '11/16', 9150], ['d3', '11/17', 7980], ['d4', '11/18', 10240], ['d5', '11/19', 11860], ['d6', '11/20', 13420], ['d7', '11/21', 12180]];
const YT_TREND = [[6000, 'AED6K'], [8000, 'AED8K'], [10000, 'AED10K'], [12000, 'AED12K'], [14000, 'AED14K']];
function lineChart() {
  const W = 480, { L, R } = FR(W); const n = TREND.length; const xs = TREND.map((d, i) => [L + (i * (R - L)) / (n - 1), d]);
  const fr = frame(W, YT_TREND.map((t) => t[0]), 6000, 14000, xs, (v) => tick('yt_' + v, YT_TREND.find((t) => t[0] === v)[1]), (d) => tick('xd_' + d[0], d[1]), xs.map((x) => x[0]));
  const pts = xs.map(([x, d]) => [x, fr.yy(d[2])]);
  const dots = pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#fff" stroke="${COL[0]}" stroke-width="1"/>`).join('');
  return cardWrap(S('c_trend', 'Sales Trend', 'اتجاه المبيعات'), svgWrap(W, `${fr.svg}<path d="${monoPath(pts)}" fill="none" stroke="${COL[0]}" stroke-width="2"/>${dots}`, 'ury-admin-chart-card.plot'), 'ury-admin-chart-card');
}
const PAY = [['p1', 'Cash', 'نقدي', 5200], ['p2', 'Card', 'بطاقة', 7800], ['p3', 'Online', 'عبر الإنترنت', 2100], ['p4', 'Wallet', 'محفظة', 640]];
function barChart() {
  const W = 480, { L, R, T, B } = FR(W); const n = PAY.length; const band = (R - L) / n;
  const yt = [[0, 'AED0'], [2000, 'AED2K'], [4000, 'AED4K'], [6000, 'AED6K'], [8000, 'AED8K']];
  const xs = PAY.map((d, i) => [L + band * (i + 0.5), d]);
  const grid = Array.from({ length: n + 1 }, (_, i) => L + band * i);
  const fr = frame(W, yt.map((t) => t[0]), 0, 8000, xs, (v) => tick('yt_' + v, yt.find((t) => t[0] === v)[1]), (d) => S('pm_' + d[0], d[1], d[2]), grid);
  const bw = Math.min(56, band * 0.8);
  const bars = PAY.map((d, i) => { const x = L + band * (i + 0.5) - bw / 2; const y = fr.yy(d[3]); return `<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(B - y)}" fill="${COL[0]}"/>`; }).join('');
  return cardWrap(S('c_pay', 'Payment Breakdown', 'تفصيل الدفع'), svgWrap(W, `${fr.svg}${bars}`, 'ury-admin-chart-card.plot'), 'ury-admin-chart-card');
}
const ORD = [['o1', 'Dine In', 'في المطعم', 64], ['o2', 'Take Away', 'سفري', 38], ['o3', 'Delivery', 'تسليم', 21]];
function donut() {
  const W = 480, cx = W / 2, cy = 140, ri = 65, ro = 100; const total = ORD.reduce((s, d) => s + d[3], 0);
  const P = (r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)]; // recharts: counter-clockwise from 3 o'clock
  let a = 0; let secs = '', lbls = '', leg = '';
  ORD.forEach((d, i) => {
    const sweep = (d[3] / total) * 360; const a0 = a, a1 = a + sweep; a = a1; const mid = (a0 + a1) / 2; const big = sweep > 180 ? 1 : 0;
    const [x0, y0] = P(ro, a0), [x1, y1] = P(ro, a1), [x2, y2] = P(ri, a1), [x3, y3] = P(ri, a0);
    secs += `<path d="M${f(x0)},${f(y0)} A${ro},${ro},0,${big},0,${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A${ri},${ri},0,${big},1,${f(x3)},${f(y3)} Z" fill="${COL[i]}" stroke="#fff" stroke-width="1"/>`;
    const [lx0, ly0] = P(ro, mid), [lx, ly] = P(ro + 20, mid);
    lbls += `<path d="M${f(lx0)},${f(ly0)} L${f(lx)},${f(ly)}" fill="none" stroke="${COL[i]}"/><text class="ud-ct" x="${f(lx + (lx >= cx ? 4 : -4))}" y="${f(ly)}" dy=".355em" text-anchor="${lx >= cx ? 'start' : 'end'}" style="fill:${COL[i]}">${S('pct_' + d[0], Math.round((d[3] / total) * 100) + '%')}</text>`;
    leg += `<span class="ud-legend__i" style="color:${COL[i]}"><svg width="14" height="14" viewBox="0 0 32 32"><path fill="${COL[i]}" d="M0,4h32v24h-32z"/></svg>${S('ot_' + d[0], d[1], d[2])}</span>`;
  });
  return cardWrap(S('c_order', 'Order Type Split', 'توزيع أنواع الطلبات'), `<div class="ud-chart__plot" ${u('ury-admin-chart-card.plot')}><svg width="${W}" height="300" viewBox="0 0 ${W} 300" role="img">${secs}${lbls}</svg><div class="ud-legend" ${u('ury-admin-chart-card.legend')}>${leg}</div></div>`, 'ury-admin-chart-card');
}
const TOP = [
  ['Butter Chicken', 'Butter Chicken', 186, 8370, 100], ['Paneer Tikka Masala', 'Paneer Tikka Masala', 152, 5320, 82], ['Chicken Biryani', 'Chicken Biryani', 131, 6550, 70],
  ['Garlic Naan', 'Garlic Naan', 118, 1180, 63], ['Masala Chai', 'Masala Chai', 97, 970, 52], ['Gulab Jamun', 'Gulab Jamun', 74, 1110, 40],
];
function topItems(p = {}) {
  const head = `<div class="ud-top__h"><div class="ud-top__hr"><div><h3 class="ud-top__t" ${u('ury-admin-chart-card.title')}>${S('c_top', 'Top Selling Menu Items', 'أصناف القائمة الأكثر مبيعاً')}</h3><p class="ud-top__sub">${S('c_top_sub', 'Highest grossing items ranked by order count &amp; volume', 'أعلى الأصناف مبيعاً مرتبة حسب عدد الطلبات والحجم')}</p></div><span class="ud-top__badge">${S('c_ranked', 'Ranked Top', 'أعلى')} ${S('c_ranked_n', String(TOP.length))}</span></div></div>`;
  const body = p.empty ? `<div class="ud-top__empty">${S('c_top_empty', 'No top items data available', 'لا تتوفر بيانات لأعلى الأصناف')}</div>`
    : `<div class="ud-top__grid" ${u('ury-admin-chart-card.list')}>${TOP.map((d, i) => `<div class="ud-top__row${p.hover === i ? ' is-hover' : ''}"><span class="ud-rank ud-rank--${i < 3 ? i + 1 : 'n'}">#${i + 1}</span><div class="ud-top__main"><div class="ud-top__l1"><span class="ud-top__name">${S('ti_n' + i, d[0], d[1])}</span><span class="ud-top__rev ud-num">${M('ti_r' + i, d[3])}</span></div><div class="ud-top__bar"><div class="ud-top__fill" style="width:${d[4]}%"></div></div><div class="ud-top__l3"><span>${S('c_cat', 'Category:', 'الفئة:')} ${S('ti_cat', 'Sales Item')}</span><span>${S('ti_c' + i, String(d[2]))} ${S('c_ordered', 'items ordered', 'أصناف مطلوبة')}</span></div></div></div>`).join('')}</div>`;
  return `<div class="ud ud-top" ${u('ury-admin-chart-card')}>${head}<div class="ud-top__body">${p.loading ? `<div class="ud-top__load">${spinner()}</div>` : body}</div></div>`;
}
const chartState = (kind, msgKey, msgEn, msgAr, title) => cardWrap(title, kind === 'load' ? `<div class="ud-chart__load" ${u('ury-admin-chart-card.loading')}>${spinner()}</div>` : `<div class="ud-chart__empty" ${u('ury-admin-chart-card.empty')}>${S(msgKey, msgEn, msgAr)}</div>`, 'ury-admin-chart-card');
function chartCard(p = {}) {
  switch (p.kind) {
    case 'donut': return donut();
    case 'bars': return barChart();
    case 'top': return topItems();
    case 'top-empty': return topItems({ empty: true });
    case 'top-loading': return topItems({ loading: true });
    case 'loading': return chartState('load', '', '', '', S('c_trend', 'Sales Trend', 'اتجاه المبيعات'));
    case 'empty': return chartState('empty', 'c_trend_empty', 'No sales trend data available', 'لا تتوفر بيانات لاتجاه المبيعات', S('c_trend', 'Sales Trend', 'اتجاه المبيعات'));
    default: return lineChart();
  }
}

// ---------- quick actions ----------
const sv = (d, cls = '') => `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"/></svg>`;
const QA = [
  ['M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 'Open POS Terminal', 'فتح طرفية نقطة البيع', 'Launch billing counter for active restaurant orders', 'افتح كاونتر الفوترة لطلبات المطعم النشطة', 'Launch POS', 'تشغيل نقطة البيع'],
  ['M12 6v6m0 0v6m0-6h6m-6 0H6', 'Add Menu Item', 'إضافة صنف إلى القائمة', 'Create new dishes, pricing, or course categories', 'أنشئ أطباقاً جديدة أو أسعاراً أو فئات للأطباق', '+ Add Menu', '+ إضافة قائمة'],
  ['M4 6h16M4 10h16M4 14h16M4 18h16', 'Add Table', 'إضافة طاولة', 'Configure new dining table layout &amp; seat capacity', 'اضبط تخطيط طاولات الطعام الجديد وعدد المقاعد', '+ Add Table', '+ إضافة طاولة'],
  ['M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6', 'Add Room / Zone', 'إضافة قاعة / منطقة', 'Set up AC Hall, Terrace, VIP, or Bar dining sections', 'أعدّ قاعة مكيفة أو شرفة أو VIP أو أقسام البار', '+ Add Zone', '+ إضافة منطقة'],
  ['M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6', 'Add Branch', 'إضافة فرع', 'Configure multi-outlet restaurant profiles &amp; prefixes', 'اضبط ملفات المطاعم متعددة الفروع وبادئاتها', '+ Add Branch', '+ إضافة فرع'],
  ['M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', 'Add User / Staff', 'إضافة مستخدم / موظف', 'Grant cashier, captain, or manager POS permissions', 'منح صلاحيات نقطة البيع للكاشير أو الكابتن أو المدير', '+ Add User', '+ إضافة مستخدم'],
];
function quickActions(p = {}) {
  const toast = p.toast ? `<div class="ud-qa__toast" ${u('ury-admin-quick-actions.toast')}><span>${S('qa_toast', 'Successfully added Table "T-15" (4 seats).')}</span><button type="button">${S('qa_dismiss', 'Dismiss', 'إخفاء')}</button></div>` : '';
  const cards = QA.map((c, i) => `<div class="ud-qa__card${p.hover === i ? ' is-hover' : ''}" ${u('ury-admin-quick-actions.card-' + i)}><div><div class="ud-qa__ico${i ? ' ud-qa__ico--pri' : ''}">${sv(c[0])}</div><h3 class="ud-qa__title">${S('qa_t' + i, c[1], c[2])}</h3><p class="ud-qa__desc">${S('qa_d' + i, c[3], c[4])}</p></div><div class="ud-qa__act"><button type="button" class="ud-qa__btn ${i ? 'ud-qa__btn--outline' : 'ud-qa__btn--solid'}${p.hoverBtn === i ? ' is-hover' : ''}" ${u('ury-admin-quick-actions.btn-' + i)}>${S('qa_a' + i, c[5], c[6])}</button></div></div>`).join('');
  return `<section class="ud ud-qa" ${u('ury-admin-quick-actions')}>${toast}<div class="ud-qa__h"><h2 class="ud-qa__t">${S('qa_title', 'Quick Operations &amp; Setup', 'العمليات السريعة والإعداد')}</h2><span class="ud-qa__n">${S('qa_sub', 'Fast action shortcuts', 'اختصارات الإجراءات السريعة')}</span></div><div class="ud-qa__grid" ${u('ury-admin-quick-actions.grid')}>${cards}</div></section>`;
}

// ---------- screen: DashboardPage (Page > Section KPIGrid, Section ReportWidgets) ----------
const TX = [
  ['INV-2026-00128', 'Walk-in Customer', 'عميل زائر', 'T-04', 'Dine In', 'في المطعم', '2026-11-21 02:14:08 PM', 'Paid', 'مدفوع', 86.5],
  ['INV-2026-00127', 'Aisha Rahman', 'Aisha Rahman', 'Counter', 'Take Away', 'سفري', '2026-11-21 02:09:41 PM', 'Paid', 'مدفوع', 142],
  ['INV-2026-00126', 'Omar Khalid', 'Omar Khalid', 'T-11', 'Dine In', 'في المطعم', '2026-11-21 01:58:19 PM', 'Submitted', 'مسجلة', 318.75],
  ['INV-2026-00125', 'Walk-in Customer', 'عميل زائر', 'Counter', 'Delivery', 'تسليم', '2026-11-21 01:47:03 PM', 'Paid', 'مدفوع', 64],
  ['INV-2026-00124', 'Layla Haddad', 'Layla Haddad', 'T-07', 'Dine In', 'في المطعم', '2026-11-21 01:36:55 PM', 'Draft', 'مسودة', 205.25],
  ['INV-2026-00123', 'Yusuf Ahmed', 'Yusuf Ahmed', 'T-02', 'Dine In', 'في المطعم', '2026-11-21 01:21:30 PM', 'Paid', 'مدفوع', 97],
  ['INV-2026-00122', 'Walk-in Customer', 'عميل زائر', 'Counter', 'Take Away', 'سفري', '2026-11-21 01:12:47 PM', 'Submitted', 'مسجلة', 45.5],
  ['INV-2026-00121', 'Mariam Saleh', 'Mariam Saleh', 'T-09', 'Dine In', 'في المطعم', '2026-11-21 12:58:12 PM', 'Paid', 'مدفوع', 276],
];
const ok = (s) => s === 'Paid' || s === 'Submitted';
function reportWidgets(p = {}) {
  const th = (k, en, ar, end) => `<th class="${end ? 'is-end' : ''}">${S(k, en, ar)}</th>`;
  const rows = p.empty ? `<tr><td colspan="7" class="ud-dt__empty">${S('t_empty', 'No transactions recorded yet today.', 'لم تُسجَّل معاملات اليوم بعد.')}</td></tr>`
    : TX.map((r, i) => `<tr ${u('ury-admin-screen-dashboard.row-' + i)}><td><bdi dir="ltr" class="ud-dt__id">${S('tx_n' + i, r[0])}</bdi></td><td>${r[1] === 'Walk-in Customer' ? S('t_walkin', r[1], r[2]) : S('tx_c' + i, r[1], r[2])}</td><td>${r[3] === 'Counter' ? S('t_counter', 'Counter', 'الكاونتر') : S('tx_t' + i, r[3])}</td><td><span class="ud-bdg ud-bdg--pri">${S('t_ot_' + r[4].replace(/\s/g, '').toLowerCase(), r[4], r[5])}</span></td><td><bdi dir="ltr" class="ud-dt__ltr">${S('tx_d' + i, r[6])}</bdi></td><td><span class="ud-bdg ud-bdg--${ok(r[7]) ? 'success' : 'warning'}">${S('t_st_' + r[7].toLowerCase(), r[7], r[8])}</span></td><td class="is-end"><span dir="ltr" class="ud-dt__ltr">${M('tx_a' + i, r[9])}</span></td></tr>`).join('');
  const table = p.loading ? `<div class="ud-rw__load">${spinner()}</div>`
    : `<div class="ud-dt" ${u('ury-admin-screen-dashboard.table')}><table><thead><tr>${th('t_h_inv', 'Invoice ID', 'رقم الفاتورة')}${th('t_h_cust', 'Customer', 'العميل')}${th('t_h_tbl', 'Table / Location', 'الطاولة / الموقع')}${th('t_h_ot', 'Order Type', 'نوع الطلب')}${th('t_h_dt', 'Date &amp; Time', 'التاريخ والوقت')}${th('t_h_st', 'Status', 'الحالة')}${th('t_h_gt', 'Grand Total', 'المجموع الإجمالي', true)}</tr></thead><tbody>${rows}</tbody></table></div>`;
  return `<div class="ud-rw" ${u('ury-admin-screen-dashboard.widgets')}><div><h3 class="ud-rw__h">${S('t_title', 'Live POS Transactions', 'معاملات نقاط البيع المباشرة')}</h3><p class="ud-rw__p">${S('t_sub', 'Real-time sales and active checkouts', 'المبيعات الفورية وعمليات الدفع الجارية')}</p></div>${table}</div>`;
}
function dashboardScreen(p = {}) {
  const kpi = p.error ? `<p role="alert" class="ud-err" ${u('ury-admin-screen-dashboard.error')}>${S('s_err', 'Unable to load Service Board data. Please retry.', 'تعذر تحميل بيانات لوحة الخدمة. يرجى إعادة المحاولة.')}</p>` : kpiGrid({ loading: p.loading, full: p.full }).replace('data-ui="ury-admin-kpi-grid"', 'data-ui="ury-admin-screen-dashboard.kpis"');
  const main = `<div class="ud ud-page" ${u('ury-admin-screen-dashboard.page')}><div class="ud-sec">${kpi}</div><div class="ud-sec">${reportWidgets({ loading: p.loading, empty: p.empty })}</div></div>`;
  return screen(1440, 900, adminLayout('/dashboard', main), 'ury-admin-screen-dashboard');
}

// every html a spec can render, so slots / rtlValues cover all of them
const all = (render, variants) => [render({}, {}), ...Object.values(variants).map((v) => render({}, v.props || {}))].join('');
const SLOTS = (render, variants, shell) => { const h = all(render, variants); return { slots: { ...(shell ? shellSlots(h) : {}), ...slotsFor(h) }, rtlValues: { ...(shell ? shellRtl(h) : {}), ...rtlFor(h) } }; };

const kgRender = (v, p) => kpiGrid(p);
const kgVariants = {
  'stat-cards': { props: { cards: true }, describe: 'StatCard row (packages/ui stat-card.tsx): rounded-lg border, p-5, toned top rail and icon chip, uppercase 12px label, 3xl value, delta with arrow (▲ ▼ —) and sign. Used by report pages; the Service Board itself renders the KpiStrip.' },
  'stat-cards-full': { props: { cards: true, full: true }, describe: 'StatCard row with the occupancy warning tone and the "Floor nearly full" hint (occupancy 0.85 or more).' },
  'floor-full': { props: { full: true }, state: 'warning', describe: 'Active Tables at 85 percent or more of the floor: value turns text-warning-600 and the hint "Floor nearly full" appears.' },
  'mixed-currency': { props: { mixed: true }, describe: 'More than one currency in scope: one figure per currency joined by " · " and the hint "Multiple currencies — not summed".' },
  loading: { props: { loading: true }, state: 'loading', describe: 'loading is true: a centred Spinner (py-8) replaces the KpiStrip.' },
};
const ccRender = (v, p) => chartCard(p);
const ccVariants = {
  donut: { props: { kind: 'donut' }, describe: 'PieChartCard (Order Type Split): donut innerRadius 65, outerRadius 100, white 1px sector strokes, percent labels with leader lines, coloured legend.' },
  'payment-bars': { props: { kind: 'bars' }, describe: 'BarChartCard (Payment Breakdown drawn as bars): maxBarSize 56, dashed grid, mono 11px ticks with compact currency. The source draws Payment Breakdown as a donut; the bar form is the same BarChartCard used for Peak Sales Distribution and Revenue by Branch.' },
  'top-items': { props: { kind: 'top' }, describe: 'Top Selling Menu Items: Card padding lg rounded-xl, two-column ranked list with a progress bar (purple-600 to purple-400) per item and a "Ranked Top" badge.' },
  'top-items-empty': { props: { kind: 'top-empty' }, describe: 'Top Selling Menu Items with no rows: dashed empty box with "No top items data available".' },
  'top-items-loading': { props: { kind: 'top-loading' }, state: 'loading', describe: 'Top Selling Menu Items while loading: centred Spinner (py-12).' },
  loading: { props: { kind: 'loading' }, state: 'loading', describe: 'ChartLoading: h-64 rounded-lg bordered box with a centred Spinner.' },
  empty: { props: { kind: 'empty' }, describe: 'ChartEmpty: h-64 dashed box with the "No sales trend data available" message.' },
};
const qaRender = (v, p) => quickActions(p);
const qaVariants = {
  toast: { props: { toast: true }, describe: 'Toast banner above the header after a successful add: rounded-[9px] bg-primary-900 text-white, message plus a Dismiss button.' },
  'card-hover': { props: { hover: 2 }, state: 'hover', describe: 'Action card hovered: hover:bg-muted/50.' },
  'button-hover': { props: { hoverBtn: 3 }, state: 'hover', describe: 'Outline action button hovered: hover:bg-primary-50.' },
};
const scRender = (v, p) => dashboardScreen(p);
const scVariants = {
  loading: { props: { loading: true }, state: 'loading', describe: 'loading skeleton: the KPI strip and the transactions table are each replaced by a centred Spinner (py-8 and py-12); the link cards stay.' },
  'floor-full': { props: { full: true }, state: 'warning', describe: 'Active Tables at 19 / 22: warning-toned value and the "Floor nearly full" hint.' },
  empty: { props: { empty: true }, describe: 'No transactions today: the table shows "No transactions recorded yet today."' },
  error: { props: { error: true }, state: 'error', describe: 'Fetch failed: the KPI section shows the destructive alert text instead of the link cards and strip.' },
};
const noteAr = 'Arabic comes from ury/translations/ar.csv; payment-mode names (Cash, Card, Online, Wallet), the "Wallet" and sample customer, menu-item and invoice names, "POS", the action button captions and the toast have no ar.csv entry and are translated here (the toast text is an English literal in the source and stays English).';

export const specs = [
  { ...base, id: 'ury-admin-kpi-grid', name: 'URY admin KPI grid', width: 1116, ...SLOTS(kgRender, kgVariants), props: {}, render: kgRender, variants: kgVariants,
    describe: ['Top of the Service Board (KPIGrid.tsx): two chrome link buttons (POS, Mosaic) over a KpiStrip of four live metrics: Today\'s Sales (success tone), Orders Today, Avg. Order Value and Active Tables. KpiStrip is borderless: 11px label, 25px/600 tabular value, hairline dividers and a border-b. Money values are typed currency slots. ' + noteAr, 'Use as the headline stats of the admin dashboard; the stat-cards variant is the boxed StatCard form used for toned metrics with deltas.'],
    na: { disabled: 'not applicable: the KPI grid has no disabled state', error: 'not applicable: an error replaces the whole section (see ury-admin-screen-dashboard error)' } },
  { ...base, id: 'ury-admin-chart-card', name: 'URY admin chart card', width: 1116, ...SLOTS(ccRender, ccVariants), props: {}, render: ccRender, variants: ccVariants,
    describe: ['AnalyticsCharts cards with the Recharts output redrawn as static SVG (no JS): Sales Trend line (monotone, dots under 20 points), Order Type Split donut, payment bars and the Top Selling Menu Items ranked list. Card is rounded-lg border shadow-sm with the double p-4 gutter of Card + CardHeader/CardContent; title 14px/600 uppercase tracking-wide; chart height 300; colours from CHART_COLORS (blue and violet ramp). ' + noteAr, 'Place in a grid (lg:grid-cols-2 or 3, gap 24); the 546px width is the two-column cell of the 1116px page.'],
    na: { ...NA('the chart card'), hover: 'not applicable: charts have no hover state until the Recharts tooltip is active (JS-driven)' } },
  { ...base, id: 'ury-admin-quick-actions', name: 'URY admin quick actions', width: 1164, ...SLOTS(qaRender, qaVariants), props: {}, render: qaRender, variants: qaVariants,
    describe: ['Quick Operations & Setup (QuickActions.tsx): header row with a bottom border and "Fast action shortcuts", then six cards (xl:grid-cols-6, gap 16): Open POS Terminal (solid primary button) and five outline "+ Add" shortcuts. Card rounded-[9px] border-hair p-[14px_16px]; 40px primary-50 icon tile; title 14/700; description 12px text-tertiary clamped to two lines. ' + noteAr, 'Shown in a card or page with p-6; the header uses -mx-6 -mt-6 to run edge to edge.'],
    na: NA('the quick-actions grid') },
  { ...base, id: 'ury-admin-screen-dashboard', name: 'URY admin screen: Dashboard', width: 1440, height: 900, ...SLOTS(scRender, scVariants, true), props: {}, render: scRender, variants: scVariants,
    describe: ['Service Board at 1440x900 inside the admin shell (header, sidebar with the Service Board link at /dashboard active). Page content (max 1440, px 22, pt 20): link cards, KPI strip, then Live POS Transactions in a DataTable. The analytics charts are commented out in DashboardPage.tsx, so the screen omits them; see ury-admin-chart-card. ' + noteAr, 'The landing page of the admin app after sign-in.'],
    na: { disabled: 'not applicable: the dashboard screen has no disabled state' } },
];
