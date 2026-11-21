// T25: ury-desk-number-card, ury-desk-shortcut, ury-desk-link-card, ury-desk-screen-home / -operate / -pos-operations.
// Titles come from ury/ury/workspace/{ury,ury_operate,pos_operations}/*.json (header, shortcut, number_card, chart blocks).
// Arabic: labels from ury/translations/ar.csv; the sample data (axis ticks, order types, payment modes, item names) has no Arabic source and is hand-translated.
import { ic, money } from '../lib.mjs';
import { deskShell, NAV_SLOTS, NAV_RTL } from './nav.mjs';
const CSS = ['frappe-desk.css', 'theme-vars.css', 'ury-v16/components/desk-workspace.css'];
const CSS_NAV = ['frappe-desk.css', 'theme-vars.css', 'ury-v16/components/desk-nav.css', 'ury-v16/components/desk-workspace.css'];
const AED = (n, ar) => [money(n), ar];

// ---- slot registry: key -> [English sample, Arabic] ----
const W = {
  h_freq: ['Frequently used', 'الأكثر استخدامًا'], h_today: ['Today', 'اليوم'], h_trends: ['Trends', 'الاتجاهات'],
  sc_kitchen: ['Kitchen Orders', 'أوامر المطبخ'], sc_subpos: ['Sub POS Closing', 'إقفال نقطة البيع الفرعية'], sc_plans: ['Sales Plans', 'خطط المبيعات'],
  sc_today: ["Today's Sales", 'مبيعات اليوم'], sc_month: ['Month Wise Sales', 'المبيعات حسب الشهر'], sc_day: ['Daywise Sales', 'المبيعات حسب اليوم'],
  sc_tables: ['Tables', 'الطاولات'], sc_sessions: ['Ordering Sessions', 'جلسات الطلب'], sc_requests: ['Service Requests', 'طلبات الخدمة'], sc_rooms: ['Rooms', 'القاعات'],
  nc_sales: ['Sales Today', 'مبيعات اليوم'], nc_bills: ['Bills Today', 'فواتير اليوم'], nc_avg: ['Average Bill Today', 'متوسط الفاتورة اليوم'], nc_cancel: ['Cancelled Bills Today', 'الفواتير الملغاة اليوم'],
  nc_unsettled: ['Unsettled Bills (All Open)', 'الفواتير غير المسددة (كل المفتوحة)'], nc_kots: ['Open KOTs', 'أوامر المطبخ المفتوحة'], nc_waste: ['Wastage Today', 'هدر اليوم'],
  v_sales: AED(5053.13, 'د.إ ٥٬٠٥٣٫١٣'), v_bills: ['42', '٤٢'], v_avg: AED(120.31, 'د.إ ١٢٠٫٣١'), v_cancel: ['3', '٣'], v_unsettled: ['9', '٩'], v_kots: ['12', '١٢'], v_waste: ['4', '٤'],
  d_up: ['12.5%', '١٢٫٥٪'], d_down: ['4.2%', '٤٫٢٪'], d_label: ['vs yesterday', 'مقارنة بالأمس'],
  ch_trend: ['Daily Sales Trend', 'اتجاه المبيعات اليومي'], ch_type: ['Order Type Split', 'توزيع أنواع الطلبات'], ch_pay: ['Payment Mode Split', 'توزيع طرق الدفع'], ch_top: ['Top Selling Items', 'الأصناف الأكثر مبيعًا'],
  ch_sub: ['Last Month', 'الشهر الماضي'],
  lk_title1: ['Kitchen and Billing', 'المطبخ والفوترة'], lk_title2: ['Floor and Service', 'الصالة والخدمة'], lk_title3: ['Settings', 'إعدادات'],
  lk_kot: ['Kitchen Orders', 'أوامر المطبخ'], lk_subpos: ['Sub POS Closing', 'إقفال نقطة البيع الفرعية'], lk_term: ['Payment Terminals', 'أجهزة الدفع'], lk_tx: ['Terminal Transactions', 'معاملات أجهزة الدفع'],
  lk_tables: ['Tables', 'الطاولات'], lk_rooms: ['Rooms', 'القاعات'], lk_sess: ['Ordering Sessions', 'جلسات الطلب'], lk_req: ['Service Requests', 'طلبات الخدمة'], lk_orders: ['Orders', 'الطلبات'],
  pc_sales: ["Today's Sales", 'مبيعات اليوم'], pc_bills: ["Today's Bills", 'فواتير اليوم'], pc_avg: ['Average Bill Value', 'متوسط قيمة الفاتورة'], pc_kots: ['Open KOTs', 'أوامر المطبخ المفتوحة'], pc_unsettled: ['Unsettled Bills', 'الفواتير غير المسددة'],
  pv_sales: AED(5053.13, 'د.إ ٥٬٠٥٣٫١٣'), pv_bills: ['42', '٤٢'], pv_avg: AED(120.31, 'د.إ ١٢٠٫٣١'), pv_kots: ['5', '٥'], pv_unsettled: ['3', '٣'],
};
// chart sample data
const MON = [['Nov', 'نوفمبر']]; const dn = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const XL = [1, 8, 15, 22, 29]; XL.forEach((d, i) => { W['tx' + i] = [`${d} Nov`, `${dn(d)} نوفمبر`]; });
const YT = [0, 2000, 4000, 6000, 8000]; YT.forEach((y, i) => { W['ty' + i] = [y.toLocaleString('en-US'), dn(y.toLocaleString('en-US')).replace(/,/g, '٬')]; });
const OT = [['Dine In', 'داخل المطعم'], ['Take Away', 'سفري'], ['Delivery', 'توصيل']]; OT.forEach((o, i) => { W['ot' + i] = o; });
const PM = [['Cash', 'نقدًا'], ['Card', 'بطاقة'], ['Online', 'عبر الإنترنت']]; PM.forEach((o, i) => { W['pm' + i] = o; });
const IT = [['Chicken Shawarma', 'شاورما دجاج'], ['Beef Burger', 'برغر لحم'], ['Fresh Lime', 'ليمون طازج'], ['Mixed Grill', 'مشاوي مشكلة'], ['Falafel Wrap', 'ساندويتش فلافل']]; IT.forEach((o, i) => { W['it' + i] = o; });
const BY = [0, 40, 80, 120, 160]; BY.forEach((y, i) => { W['by' + i] = [String(y), dn(y)]; });

const widget = (cls, title, body, extra = '') => `<div class="widget ${cls}"${extra}><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis" title="${title}">${title}</span></div><div class="widget-subtitle"></div></div><div class="widget-control"></div></div>${body}<div class="widget-footer"></div></div>`;
const block = (col, inner, ui = '') => `<div class="ce-block col-${col}"${ui ? ` data-ui="${ui}"` : ''}><div class="ce-block__content"><div>${inner}</div></div></div>`;
const header = (text, ui) => `<div class="ce-block col-12"${ui ? ` data-ui="${ui}"` : ''}><div class="ce-block__content"><div class="ce-header"><span class="h4"><b>${text}</b></span></div></div></div>`;
const spacer = () => `<div class="ce-block col-12"><div class="ce-block__content"><div class="ce-spacer"></div></div></div>`;
const arrow = (up) => `<svg class="icon icon-xs" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${up ? '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>' : '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'}</svg>`;

// number card; stat: null | 'up' | 'down'
const numberCard = (v, t, val, o = {}) => {
  const stat = o.stat ? `<div class="card-stats ${o.stat === 'up' ? 'green-stat' : 'red-stat'}"><span class="percentage-stat-area" data-ui="ury-desk-number-card.stat">${arrow(o.stat === 'up')} ${o.stat === 'up' ? v.d_up : v.d_down}<span class="stat-label">${v.d_label}</span></span></div>` : '';
  return widget('number-widget-box', v[t], `<div class="widget-body"><div class="widget-content"><div class="number" data-ui="ury-desk-number-card.number">${v[val]}</div>${stat}</div></div>`);
};
const ncBlock = (v, t, val, o, col = 3) => block(col, `<div number_card_name="${W[t][0]}">${numberCard(v, t, val, o)}</div>`, o && o.ui);
const shortcut = (v, t, hover) => widget('shortcut-widget-box' + (hover ? ' is-hover' : ''), v[t], '');
const scBlock = (v, t, hover) => block(4, `<div shortcut_name="${W[t][0]}">${shortcut(v, t, hover)}</div>`);
const linkCard = (v, title, items, hoverIdx = -1) => widget('links-widget-box', v[title], `<div class="widget-body">${items.map((k, i) => `<a class="link-item${i === hoverIdx ? ' is-hover' : ''}"><span class="link-text ellipsis">${v[k]}</span></a>`).join('')}</div>`);
const lcBlock = (v, title, items, hv) => block(4, `<div card_name="${W[title][0]}">${linkCard(v, title, items, hv)}</div>`);

// ---- frappe-chart style SVG (static) ----
const CW = 534, CH = 205, L = 48, R = 12, T = 12, B = 28;
const frame = (inner) => `<svg class="frappe-chart chart" style="max-width:100%;height:auto" width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}"><g class="chart-draw-area">${inner}</g></svg>`;
const yAxis = (v, pre, n = 5) => Array.from({ length: n }, (_, i) => { const y = T + (CH - T - B) * (1 - i / (n - 1)); return `<line class="${i ? 'grid-line' : 'base-line'}" x1="${L}" x2="${CW - R}" y1="${y}" y2="${y}"/><text class="chart-label y-axis-label" x="${L - 8}" y="${y + 3}">${v[pre + i]}</text>`; }).join('');
const lineChart = (v) => {
  const pts = [2.5, 4, 3.2, 5.8, 8.2, 6.4, 7.1, 9.5, 8.8, 11.2, 10.4, 12.6, 11.9, 14.2, 13.1, 15.8, 14.6, 13.2, 15.1, 16.4, 15.7, 17.2, 16.1, 18.0, 15.4, 16.9, 17.6, 15.9, 17.3, 18.4].map((k, i, a) => [L + 10 + (CW - L - R - 20) * i / (a.length - 1), T + (CH - T - B) * (1 - (i === a.length - 1 ? 12.63 : k * 0.62) / 20)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const base = CH - B; const area = `${d} L${pts[pts.length - 1][0].toFixed(1)} ${base} L${pts[0][0].toFixed(1)} ${base} Z`;
  const xs = XL.map((_, i) => `<text class="chart-label x-axis-label" x="${(L + 10 + (CW - L - R - 20) * (XL[i] - 1) / 29).toFixed(1)}" y="${CH - 8}">${v['tx' + i]}</text>`).join('');
  return frame(`${yAxis(v, 'ty')}${xs}<path class="area-fill" d="${area}"/><path class="dataset-line" d="${d}"/>`);
};
const donut = (v, pre, n, vals) => {
  const cx = 120, cy = 92, r = 70, ri = 40; const tot = vals.reduce((a, b) => a + b, 0); let a0 = -Math.PI / 2;
  const sl = vals.map((x, i) => { const a1 = a0 + 2 * Math.PI * x / tot; const P = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`; const lg = a1 - a0 > Math.PI ? 1 : 0;
    const dd = `M${P(a0, r)} A${r} ${r} 0 ${lg} 1 ${P(a1, r)} L${P(a1, ri)} A${ri} ${ri} 0 ${lg} 0 ${P(a0, ri)} Z`; a0 = a1; return `<path class="donut-path ch-${i + 1}" d="${dd}"/>`; }).join('');
  const lg = vals.map((_, i) => `<g transform="translate(${CW / 2 + 60},${52 + i * 26})"><rect class="legend-dot ch-${i + 1}" x="0" y="-9" width="10" height="10" rx="2"/><text class="chart-label legend-label" x="18" y="0" style="text-anchor:start">${v[pre + i]}</text></g>`).join('');
  return frame(`<g class="donut-slices">${sl}</g>${lg}`).replace(`translate(${CW / 2 + 60}`, `translate(${CW / 2 + 60}`).replace(/<g class="chart-draw-area">/, `<g class="chart-draw-area" transform="translate(${CW / 2 - 200},0)">`);
};
const barChart = (v) => {
  const vals = [152, 128, 96, 74, 52]; const bw = 34; const step = (CW - L - R) / vals.length;
  const bars = vals.map((x, i) => { const h = (CH - T - B) * x / 160; const x0 = L + step * i + (step - bw) / 2; return `<rect class="bar ch-1" x="${x0.toFixed(1)}" y="${(CH - B - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}"/><text class="chart-label x-axis-label" x="${(x0 + bw / 2).toFixed(1)}" y="${CH - 8}">${v['it' + i]}</text>`; }).join('');
  return frame(`${yAxis(v, 'by')}${bars}`);
};
const chartCard = (v, title, svg, ui) => widget('dashboard-widget-box', v[title], `<div class="widget-body"><div class="chart-container">${svg}</div></div>`, ` data-ui="${ui}"`).replace('<div class="widget-subtitle"></div>', `<div class="widget-subtitle">${v.ch_sub}</div>`);
const chBlock = (v, title, svg, ui) => block(6, `<div chart_name="${W[title][0]}">${chartCard(v, title, svg, ui)}</div>`);

const redactor = (inner, scroll = 0) => `<div class="ury-ws-clip"><div class="editor-js-container ury-ws" data-ui="ury-desk-workspace"><div class="desk-page page-main-content"><div class="codex-editor"><div class="codex-editor__redactor" style="${scroll ? `margin-top:-${scroll}px` : ''}">${inner}</div></div></div></div></div>`;

const homeBody = (v, o = {}) => redactor(
  header(v.h_freq, 'ury-desk-screen-home.frequent') + ['sc_kitchen', 'sc_subpos', 'sc_plans', 'sc_today', 'sc_month', 'sc_day'].map((k) => scBlock(v, k)).join('')
  + header(v.h_today, 'ury-desk-screen-home.today') + [['nc_sales', 'v_sales'], ['nc_bills', 'v_bills'], ['nc_avg', 'v_avg'], ['nc_cancel', 'v_cancel'], ['nc_unsettled', 'v_unsettled'], ['nc_kots', 'v_kots'], ['nc_waste', 'v_waste']].map(([t, x]) => ncBlock(v, t, x)).join('')
  + header(v.h_trends, 'ury-desk-screen-home.trends')
  + chBlock(v, 'ch_trend', lineChart(v), 'ury-desk-screen-home.chart-trend') + chBlock(v, 'ch_type', donut(v, 'ot', 3, [58, 27, 15]), 'ury-desk-screen-home.chart-type')
  + chBlock(v, 'ch_pay', donut(v, 'pm', 3, [46, 38, 16]), 'ury-desk-screen-home.chart-pay') + chBlock(v, 'ch_top', barChart(v), 'ury-desk-screen-home.chart-top'), o.scroll || 0);
const operateBody = (v) => redactor(
  header(v.h_freq) + ['sc_kitchen', 'sc_tables', 'sc_subpos', 'sc_sessions', 'sc_requests', 'sc_rooms'].map((k) => scBlock(v, k)).join('') + spacer()
  + lcBlock(v, 'lk_title1', ['lk_kot', 'lk_subpos', 'lk_term', 'lk_tx']) + lcBlock(v, 'lk_title2', ['lk_tables', 'lk_rooms', 'lk_sess', 'lk_req']) + lcBlock(v, 'lk_title3', ['lk_orders']));
const posBody = (v) => redactor([['pc_sales', 'pv_sales'], ['pc_bills', 'pv_bills'], ['pc_avg', 'pv_avg'], ['pc_kots', 'pv_kots'], ['pc_unsettled', 'pv_unsettled']].map(([t, x]) => ncBlock(v, t, x, {}, 4)).join(''));

// ---- spec plumbing ----
const proxy = (used) => new Proxy({}, { get: (_, k) => (used.add(String(k)), `{{${String(k)}}}`) });
const collect = (render, ps = []) => { const u = new Set(); [{}, ...ps].forEach((p) => render(proxy(u), p)); return u; };
const wslots = (u) => Object.fromEntries([...u].filter((k) => k in W).map((k) => [k, W[k][0]]));
const wrtl = (u) => Object.fromEntries([...u].filter((k) => k in W).map((k) => [k, W[k][1]]));
const screenSlots = (u, crumb) => ({ ...Object.fromEntries([...u].filter((k) => k in NAV_SLOTS).map((k) => [k, NAV_SLOTS[k]])), ...wslots(u), nav_crumb: crumb[0] });
const screenRtl = (u, crumb) => ({ ...Object.fromEntries([...u].filter((k) => k in NAV_RTL).map((k) => [k, NAV_RTL[k]])), ...wrtl(u), nav_crumb: crumb[1] });
const base = { group: 'ury-desk', static: true, dsf: 2, darkTheme: 'dark', modes: ['light', 'dark', 'rtl'], canvas: 'var(--bg-color)',
  naDefault: 'pointer UI: hover/focus are shown as variants where the source styles them',
  na: { disabled: 'not applicable: workspace widgets have no disabled state', error: 'not applicable: failed widgets render the chart error state, not mocked here', loading: 'not applicable: the mock shows the loaded widget', empty: 'not applicable: the workspace always has its configured widgets' } };

// widget-level components render on a bare canvas of the workspace grid
const stage = (inner, w) => `<div class="ury-ws" style="width:${w}px;padding:0"><div class="codex-editor"><div class="codex-editor__redactor">${inner}</div></div></div>`;
const ncRender = (v, p) => stage(`${ncBlock(v, p.t || 'nc_sales', p.val || 'v_sales', { stat: p.stat || null }, 12)}`, p.w || 320).replace('data-ui="undefined"', '');
const ncR = (v, p) => { const h = ncRender(v, p); return h.replace('class="ury-ws"', 'class="ury-ws" data-ui="ury-desk-number-card"'); };
const scR = (v, p) => stage(block(12, `<div shortcut_name="x">${shortcut(v, 'sc_kitchen', p.hover)}</div>`), 280).replace('class="ury-ws"', 'class="ury-ws" data-ui="ury-desk-shortcut"');
const lcR = (v, p) => stage(block(12, `<div card_name="x">${linkCard(v, 'lk_title1', ['lk_kot', 'lk_subpos', 'lk_term', 'lk_tx'], p.hover ? 1 : -1)}</div>`), 280).replace('class="ury-ws"', 'class="ury-ws" data-ui="ury-desk-link-card"');
const mk = (render, crumb, ps) => { const u = collect(render, ps); return { slots: screenSlots(u, crumb), rtlValues: screenRtl(u, crumb) }; };
const mkW = (render, ps) => { const u = collect(render, ps); return { slots: wslots(u), rtlValues: wrtl(u) }; };
const shell = (active, body, id) => (v, p) => deskShell(active, body(v, p), v, { id });

const ncW = mkW(ncR, [{ stat: 'up' }, { stat: 'down' }, { t: 'nc_bills', val: 'v_bills' }, { t: 'nc_cancel', val: 'v_cancel' }]), scW = mkW(scR), lcW = mkW(lcR);
const homeR = shell({ row: 'Home' }, homeBody, 'ury-desk-screen-home');
const opR = shell({ row: '', section: 'Operate' }, operateBody, 'ury-desk-screen-operate');
const posR = shell({ row: '', section: 'Operate' }, posBody, 'ury-desk-screen-pos-operations');
const homeR2 = (v, p) => deskShell({ row: 'Home' }, homeBody(v, p), v, { id: 'ury-desk-screen-home' });

export const specs = [
  { ...base, id: 'ury-desk-number-card', name: 'URY desk number card', css: CSS, width: 320, ...ncW, props: {}, render: ncR,
    variants: {
      currency: { props: { t: 'nc_sales', val: 'v_sales' }, describe: 'Sum card (Sales Today): the value is a currency slot.' },
      count: { props: { t: 'nc_bills', val: 'v_bills' }, describe: 'Count card (Bills Today): a plain integer.' },
      'percentage-up': { props: { t: 'nc_sales', val: 'v_sales', stat: 'up' }, describe: 'Percentage stat enabled (show_percentage_stats): green arrow-up delta against the previous period.' },
      'percentage-down': { props: { t: 'nc_cancel', val: 'v_cancel', stat: 'down' }, describe: 'Percentage stat enabled: red arrow-down delta.' },
    },
    describe: ['URY number card: .widget.number-widget-box with a 13px ink-gray-5 title and a 17px semibold value, padding 8 8 8 12; the card menu stays hidden until hover.',
      'Use for single metrics on a workspace (the URY cards are Sum, Count and Average of POS Invoice, URY KOT and URY Wastage; none shows percentage stats by default).'] },
  { ...base, id: 'ury-desk-shortcut', name: 'URY desk shortcut', css: CSS, width: 280, ...scW, props: {}, render: scR,
    variants: { hover: { props: { hover: true }, describe: 'Pointer over the shortcut: border and title switch to --invert-neutral.' } },
    describe: ['Workspace shortcut: .widget.shortcut-widget-box, 60px high, padding 10 12, 1px border, 16px title.', 'Use for a link to a list, report or page in a workspace column (col-3 on URY Home).'] },
  { ...base, id: 'ury-desk-link-card', name: 'URY desk link card', css: CSS, width: 280, ...lcW, props: {}, render: lcR,
    variants: { hover: { props: { hover: true }, describe: 'Pointer over a link row: ink-gray-9 with an underline.' } },
    describe: ['Workspace link card: .widget.links-widget-box with a 13px medium title and one 13px ink-gray-6 row per Link (Card Break from the workspace JSON).', 'Use for grouped navigation on a workspace such as Operate (col-4).'] },
  { ...base, id: 'ury-desk-screen-home', name: 'URY desk screen: URY Home', css: CSS_NAV, width: 1440, height: 900, dsf: 2, ...mk(homeR2, ['URY Home', 'الصفحة الرئيسية لـ URY']), props: {}, render: homeR2,
    variants: { 'charts-scrolled': { props: { scroll: 330 }, describe: 'The workspace scrolled down so the four charts (Daily Sales Trend, Order Type Split, Payment Mode Split, Top Selling Items) fill the viewport.' } },
    describe: ['URY Home workspace (ury/workspace/ury/ury.json) in the 1440x900 desk shell: Frequently used (6 shortcuts, col-3), Today (7 number cards, col-4) and Trends (4 charts, col-6).', 'Landing page of the URY app; the two custom blocks (URY POS, POS V1) are not drawn.'] },
  { ...base, id: 'ury-desk-screen-operate', name: 'URY desk screen: Operate', css: CSS_NAV, width: 1440, height: 900, dsf: 2, ...mk(opR, ['Operate', 'التشغيل']), props: {}, render: opR, variants: {},
    describe: ['Operate overview workspace (ury_operate.json): Frequently used shortcuts, a spacer, then the link cards Kitchen and Billing, Floor and Service and Settings.', 'Opened from Operate > Overview in the sidebar.'] },
  { ...base, id: 'ury-desk-screen-pos-operations', name: 'URY desk screen: POS Operations', css: CSS_NAV, width: 1440, height: 900, dsf: 2, ...mk(posR, ['POS Operations', 'عمليات نقطة البيع']), props: {}, render: posR, variants: {},
    describe: ['POS Operations workspace (ury/ury/workspace/pos_operations): the five cashier number cards Today\'s Sales, Today\'s Bills, Average Bill Value, Open KOTs and Unsettled Bills.', 'Cashier landing page; the sidebar shows the standard URY desk because the dedicated POS Operations sidebar is a separate module sidebar.'] },
];
