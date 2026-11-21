// URY v16 POS Dashboard route: KPI strip, Act now / Needs attention feeds, Service Line, left stack, right rail, full screen.
// Sources: pos/src/pages/Dashboard.tsx, components/dashboard/InsightFeed.tsx, components/chat/AskBar.tsx,
//          packages/ui/src/components/{kpi-strip,attention-feed,badge,card}.tsx @100c43fe2e. CSS: tokens/css/ury-v16/components/pos-dashboard.css
import { ic, money, screen } from '../lib.mjs';
import { header, footer, SHELL_SLOTS, SHELL_RTL, HEADER_KEYS, FOOTER_KEYS, pick } from './shell.mjs';

const X = {
  Activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  PackageSearch: '<path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/>',
};
const I = (n, s = 16, c = '') => ic(n, s, c, X);
const P = new Proxy({}, { get: (_, k) => `{{${String(k)}}}` });

export const DASH_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-dashboard.css'];
export const SCREEN_CSS = [...DASH_CSS.slice(0, 3), 'ury-v16/components/pos-shell.css', DASH_CSS[3]];

// ---- slots: [English sample (pos/src/i18n/locales/en.json), Arabic (ar.json)] ----
const cur = (n) => [money(n)];
const S = {
  // page header
  title: ['Shift Overview', 'نظرة عامة على الوردية'], branch: ['Downtown', 'وسط المدينة'], live_status: ['Live floor status for the current shift', 'حالة القاعة مباشرة للوردية الحالية'],
  ask_text: ['Ask about tonight…', 'اسأل عن الليلة…'], ask_tag: ['HUF'], ask_key: ['⌘K'], live_badge: ['Live', 'مباشر'],
  // kpi strip
  k1_label: ["Today's Sales", 'مبيعات اليوم'], k1_value: cur(18420), k2_label: ['Orders Today', 'طلبات اليوم'], k2_value: ['142'],
  k3_label: ['Avg. Order Value', 'متوسط قيمة الطلب'], k3_value: cur(129.72), k4_label: ['Active Tables', 'الطاولات النشطة'], k4_value: ['14 / 22'],
  k2_hint: ['vs usual 128', 'مقابل المعتاد 128'],
  // feeds
  att_title: ['Needs Attention', 'تحتاج إلى متابعة'], att_count: ['3'],
  att1_title: ['2 order(s) pending payment for over 15 minutes', 'طلبان في انتظار الدفع لأكثر من 15 دقيقة'],
  att2_title: ['1 table(s) occupied for over 60 minutes', 'طاولة واحدة مشغولة لأكثر من 60 دقيقة'],
  att3_title: ['1 POS session(s) left open from a previous day', 'جلسة نقطة بيع واحدة بقيت مفتوحة من يوم سابق'],
  act_title: ['Act now', 'تحرك الآن'], act_count: ['2 things worth your attention', '2 أمور تستحق انتباهك'],
  act_empty: ['Nothing needs attention right now.', 'لا شيء يحتاج إلى انتباه الآن.'],
  ins1_title: ['Hammour stock will run out before the dinner peak', 'مخزون الهامور سينفد قبل ذروة العشاء'], ins1_body: ['At the current sell rate only 3 portions remain for tonight.', 'بمعدل البيع الحالي تبقى 3 حصص فقط لهذه الليلة.'], ins1_branch: ['Downtown', 'وسط المدينة'],
  ins2_title: ['Kitchen ticket time is above the usual', 'زمن إعداد الطلبات في المطبخ أعلى من المعتاد'], ins2_body: ['Average ticket time is 38 min against a usual 31 min.', 'متوسط زمن الطلب 38 دقيقة مقابل 31 دقيقة معتادة.'], ins2_branch: ['Downtown', 'وسط المدينة'],
  // service line
  sl_title: ['Service Line', 'خط الخدمة'], sl_over_n: ['2'], sl_over_label: ['over time', 'تجاوز الوقت'], sl_tracked: ['8 tables tracked', '8 طاولة متابَعة'],
  sl_warn: ['2 tables running over time — check on them before the next fire.', '2 طاولات تجاوزت الوقت — تفقّدها قبل الوجبة التالية.'],
  sl_loading: ['Loading…', 'جاري التحميل…'], sl_empty: ['No tables seated yet', 'لا توجد طاولات مشغولة حالياً'],
  st_open: ['Open', 'مفتوحة'], st_seated: ['Seated', 'مُجلَسة'], st_fired: ['Fired', 'قيد التحضير'], st_served: ['Served', 'مُقدَّمة'], st_over: ['Over time', 'تجاوزت الوقت'],
  c_open: ['1'], c_seated: ['1'], c_fired: ['2'], c_served: ['2'], c_over: ['2'],
  t1_name: ['Table 4', 'طاولة 4'], t1_min: ['72'], t2_name: ['Table 9', 'طاولة 9'], t2_min: ['64'], t3_name: ['Table 2', 'طاولة 2'], t3_min: ['48'],
  t4_name: ['Table 7', 'طاولة 7'], t4_min: ['41'], t5_name: ['Table 11', 'طاولة 11'], t5_min: ['33'], t6_name: ['Table 5', 'طاولة 5'], t6_min: ['26'],
  t7_name: ['Table 3', 'طاولة 3'], t7_min: ['12'], t8_name: ['Table 8', 'طاولة 8'], t8_min: [''],
  // baseline + metrics
  bl_title: ['Tonight vs Baseline', 'الليلة مقارنةً بالمعتاد'], bl_meta: ['14-day median', 'متوسط 14 يوم'],
  m1_label: ['Sales', 'المبيعات'], m1_value: cur(18420), m1_delta: ['▲ +12%'], m1_vs: ['vs', 'مقارنةً بـ'], m1_against: cur(16450),
  m2_label: ['Covers', 'الأغطية'], m2_value: ['318'], m2_delta: ['▲ +21'], m2_against: ['297'],
  m3_label: ['Avg per Cover', 'المتوسط لكل غطاء'], m3_value: cur(57.92),
  m4_label: ['Avg Ticket Time', 'متوسط وقت الطلب'], m4_value: ['38 min', '38 د'],
  // running low
  rl_title: ['Running Low', 'ينفد قريباً'],
  r1_name: ['Lamb Shank', 'ساق الضأن'], r1_eta: ['~45 min', '~45 د'], r2_name: ['Chicken Shawarma', 'شاورما الدجاج'], r2_eta: ['~75 min', '~75 د'], r3_name: ['Grilled Hammour', 'هامور مشوي'], r3_eta: ['~2 hr 10 min', '~2 س 10 د'],
  // right rail
  fl_title: ['Floor Load', 'توزيع القاعة'], w1_name: ['Sara Khan', 'سارة خان'], w1_n: ['5'], w2_name: ['Omar Haddad', 'عمر حداد'], w2_n: ['4'], w3_name: ['Layla Nasser', 'ليلى ناصر'], w3_n: ['3'], w4_name: ['Yusuf Karim', 'يوسف كريم'], w4_n: ['2'],
  fl_empty: ['No tables assigned yet', 'لم يُسنَد أي طاولة بعد'],
  os_title: ['Open Sessions', 'الجلسات المفتوحة'], os_meta: ['3 open', '3 مفتوحة'], os_view_all: ['View all', 'عرض الكل'], os_empty: ['All sessions closed', 'جميع الجلسات مغلقة'],
  e1_user: ['Sara Khan', 'سارة خان'], e1_when: ['5h 12m ago', 'منذ 5س 12د'], e2_user: ['Omar Haddad', 'عمر حداد'], e2_when: ['3h 40m ago', 'منذ 3س 40د'], e3_user: ['Layla Nasser', 'ليلى ناصر'], e3_when: ['48m ago', 'منذ 48د'],
  sb_title: ['Shift Brief', 'ملخص الوردية'], sb_badge: ['HUF'], sb_text: ['AI shift summaries will appear here once connected.', 'سيظهر هنا ملخص الوردية الذكي بمجرد توصيله.'],
  nt_title: ['Recent Notifications', 'آخر الإشعارات'], nt_empty: ['No recent notifications', 'لا إشعارات حديثة'],
  n1_msg: ['A guest has asked for the bill', 'ضيف طلب الفاتورة'], n1_time: ['just now', 'للتو'],
  n2_msg: ['Order # 2026-00142 Delayed', 'الطلب رقم 2026-00142 متأخر'], n2_time: ['6 min ago', 'منذ 6 دقيقة'],
  n3_msg: ['Draft sales plan for 2026-11-22 is ready for review', 'مسودة خطة المبيعات ليوم 2026-11-22 جاهزة للمراجعة'], n3_time: ['1 hr ago', 'منذ 1 ساعة'],
  n4_msg: ["Today's sales plan is locked for production", 'خطة مبيعات اليوم مقفلة للإنتاج'], n4_time: ['3 hr ago', 'منذ 3 ساعة'],
};
export const DASH_SLOTS = Object.fromEntries(Object.entries(S).map(([k, [en]]) => [k, en]));
export const DASH_RTL = Object.fromEntries(Object.entries(S).filter(([, a]) => a.length > 1).map(([k, a]) => [k, a[1]]));
export const keysOf = (re) => Object.keys(S).filter((k) => re.test(k));
export const slotsFor = (re) => pick(DASH_SLOTS, keysOf(re));
export const rtlFor = (re) => pick(DASH_RTL, keysOf(re).filter((k) => k in DASH_RTL));

// ---- parts ----
const dot = (cls) => `<span class="pdb-sdot ${cls}"></span>`;
const badge = (variant, inner, extra = '') => `<span class="pdb-badge pdb-badge--${variant}${extra}">${inner}</span>`;
const n = (s) => `<span class="pdb-mono">${s}</span>`;

export function panel({ icon, title, meta = '', tone = 'neutral', body, id, cls = '' }) {
  return `<section class="pdb-card pdb-panel ${cls}" data-ui="${id}"><div class="pdb-panel__body"><div class="pdb-panel__head"><div class="pdb-panel__id"><span class="pdb-panel__chip pdb-panel__chip--${tone}">${I(icon, 16)}</span><h2 class="pdb-panel__title">${title}</h2></div>${meta ? `<div class="pdb-panel__meta">${meta}</div>` : ''}</div>${body}</div></section>`;
}
const state = (kind, text) => `<p class="pdb-state pdb-state--${kind}">${text}</p>`;

// KPI strip. state: 'ready' | 'loading' ; hint: show second item hint ; tone: tint values
export function kpiStrip({ v = P, loading = false, hint = false, id = 'pos-kpi-strip' } = {}) {
  if (loading) return `<div class="pdb pdb-bg" data-ui="${id}"><div class="pdb-kpi-skel" data-ui="${id}.skeleton"></div></div>`;
  const items = [1, 2, 3, 4].map((i) => `<div class="pdb-kpi" data-ui="${id}.item-${i}"><div class="pdb-kpi__label">${v['k' + i + '_label']}</div><div class="pdb-kpi__value u-num-wrap">${i === 4 ? `<span class="u-num">${v.k4_value}</span>` : v['k' + i + '_value']}</div>${hint && i === 2 ? `<div class="pdb-kpi__hint">${v.k2_hint}</div>` : ''}</div>`).join('');
  return `<div class="pdb pdb-bg" data-ui="${id}"><div class="pdb-kpi-wrap"><div class="pdb-kpi-strip">${items}</div></div></div>`;
}

const SEV = ['blocking', 'warning', 'warning'];
export function attentionFeed({ v = P, count = 3, id = 'pos-attention-feed' } = {}) {
  const rows = [1, 2, 3].slice(0, count).map((i) => `<div class="pdb-att"><div class="pdb-att__bar pdb-att__bar--${SEV[i - 1]}"></div><div class="pdb-att__main"><div class="pdb-att__title">${v['att' + i + '_title']}</div></div></div>`).join('');
  return `<section class="pdb-att-card" data-ui="${id}.attention"><div class="pdb-att-card__head"><h3 class="pdb-att-card__title">${v.att_title}</h3><span class="pdb-badge pdb-badge--secondary pdb-badge--sm">${count}</span></div><div class="pdb-att-card__rows">${rows}</div></section>`;
}
const RAIL = ['critical', 'warning'];
export function insightFeed({ v = P, count = 2, id = 'pos-attention-feed' } = {}) {
  const body = count === 0 ? `<p class="pdb-ins__empty">${v.act_empty}</p>` : `<div class="pdb-ins__list">${[1, 2].slice(0, count).map((i) => `<div class="pdb-ins pdb-ins--${RAIL[i - 1]}"><div class="pdb-ins__main"><p class="pdb-ins__title">${v['ins' + i + '_title']}</p><p class="pdb-ins__body">${v['ins' + i + '_body']}</p><span class="pdb-ins__branch">${v['ins' + i + '_branch']}</span></div><button type="button" class="pdb-ins__x" aria-label="Dismiss">${I('X', 16)}</button></div>`).join('')}</div>`;
  return `<section class="pdb-card pdb-insight" data-ui="${id}.insights"><div class="pdb-insight__body"><div class="pdb-insight__head"><div class="pdb-insight__id">${I('Sparkles', 20, 'pdb-insight__icon')}<h3 class="pdb-insight__title">${v.act_title}</h3></div>${count ? `<span class="pdb-insight__count">${v.act_count}</span>` : ''}</div>${body}</div></section>`;
}
// both feeds stacked as on the page
export function feeds({ v = P, insights = 2, attention = 3, id = 'pos-attention-feed' } = {}) {
  return `${insightFeed({ v, count: insights, id })}${attention ? attentionFeed({ v, count: attention, id }) : ''}`;
}

// ---- service line ----
const STAGES = [['open', 'open', 'default', 'pdb-dot--open'], ['seated', 'seated', 'accent', 'pdb-dot--seated'], ['fired', 'fired', 'accent', 'pdb-dot--fired'], ['served', 'served', 'accent', 'pdb-dot--served'], ['over', 'over', 'destructive', 'pdb-dot--over']];
const TABLES = [['over', 72], ['over', 64], ['served', 48], ['served', 41], ['fired', 33], ['fired', 26], ['seated', 12], ['open', null]];
export function serviceLine({ v = P, view = 'ready', id = 'pos-service-line' } = {}) {
  const over = view === 'ready';
  const meta = view !== 'ready' ? '' : badge('destructive', `${dot('')}<span class="pdb-mono">${v.sl_over_n}</span> ${v.sl_over_label}`, ' pdb-badge--tag');
  const metaTracked = view === 'no-over' ? v.sl_tracked : meta;
  let body;
  if (view === 'loading') body = state('loading', v.sl_loading);
  else if (view === 'empty') body = state('empty', v.sl_empty);
  else {
    const chips = STAGES.map(([k, , variant, dc]) => `<span class="pdb-badge pdb-badge--tag pdb-badge--${variant}">${dot(dc)}${v['st_' + k]}${n(v['c_' + k]).replace('pdb-mono', 'pdb-mono pdb-mono--semi')}</span>`).join('');
    const stage = (k) => k;
    const bars = TABLES.map(([k, min], i) => {
      const isOver = k === 'over'; const h = min !== null ? (min / 90) * 100 : 5;
      return `<div class="pdb-bar"><span class="pdb-bar__min${isOver ? ' is-over' : ''}">${min !== null ? v['t' + (i + 1) + '_min'] : ''}</span><div class="pdb-bar__track"><div class="pdb-bar__fill pdb-bar__fill--${stage(k)}${isOver ? ' is-over' : ''}" style="height:${h.toFixed(2)}%"></div></div><span class="pdb-bar__name${isOver ? ' is-over' : ''}">${v['t' + (i + 1) + '_name']}</span></div>`;
    }).join('');
    body = `<div><div class="pdb-chips">${chips}</div><div class="pdb-bars">${bars}</div>${over || view === 'ready' ? `<p class="pdb-warn">${v.sl_warn}</p>` : ''}</div>`;
    if (view === 'no-over') body = body.replace(/<p class="pdb-warn">.*?<\/p>/, '');
  }
  return `<div class="pdb pdb-bg" data-ui="${id}">${panel({ icon: 'Activity', title: v.sl_title, meta: view === 'no-over' ? v.sl_tracked : meta, tone: 'primary', body, id: id + '.panel' })}</div>`;
}

// ---- left stack (baseline + running low) ----
const tile = (v, i, delta) => `<div class="pdb-tile" data-ui="pos-dash.tile-${i}"><p class="pdb-tile__label">${v['m' + i + '_label']}</p><p class="pdb-tile__value">${v['m' + i + '_value']}</p>${delta ? `<p class="pdb-tile__delta"><span class="pdb-tile__up">${v['m' + i + '_delta']}</span><span class="pdb-tile__vs">${i === 1 ? v.m1_vs + ' ' + v.m1_against : v.m1_vs + ' ' + v.m2_against}</span></p>` : ''}</div>`;
export function leftStack({ v = P, id = 'pos-dash-left' } = {}) {
  const baseline = panel({ icon: 'Gauge', title: v.bl_title, meta: v.bl_meta, id: id + '.baseline', body: `<div class="pdb-tiles">${tile(v, 1, true)}${tile(v, 2, true)}${tile(v, 3, false)}${tile(v, 4, false)}</div>` });
  const row = (i, critical, pct) => `<div><div class="pdb-low__top"><span class="pdb-low__name">${v['r' + i + '_name']}</span>${badge(critical ? 'destructive' : 'warning', v['r' + i + '_eta'], ' pdb-badge--tag pdb-mono')}</div><div class="pdb-meter"><div class="pdb-meter__fill pdb-meter__fill--${critical ? 'danger' : 'warn'}" style="width:${pct}%"></div></div></div>`;
  const low = panel({ icon: 'PackageSearch', title: v.rl_title, id: id + '.running-low', body: `<div class="pdb-low">${row(1, true, 18)}${row(2, false, 34)}${row(3, false, 61)}</div>` });
  return `<div class="pdb-col" data-ui="${id}">${baseline}${low}</div>`;
}

// ---- right rail ----
export function dashPanels({ v = P, view = 'ready', id = 'pos-dash-panels' } = {}) {
  const empty = view === 'empty';
  const floor = panel({ icon: 'Users', title: v.fl_title, id: id + '.floor-load', body: empty ? state('empty', v.fl_empty) : `<div class="pdb-floor">${[1, 2, 3, 4].map((i) => `<div><div class="pdb-floor__top"><span class="pdb-floor__name">${v['w' + i + '_name']}</span><span class="pdb-floor__n">${v['w' + i + '_n']}</span></div><div class="pdb-meter"><div class="pdb-meter__fill pdb-meter__fill--primary" style="width:${[100, 80, 60, 40][i - 1]}%"></div></div></div>`).join('')}</div>` });
  const sessions = panel({ icon: 'LogOut', title: v.os_title, meta: empty ? '' : v.os_meta, id: id + '.open-sessions', body: empty ? state('empty', v.os_empty) : `<div><div class="pdb-sess">${[1, 2, 3].map((i) => `<div class="pdb-sess__row"><span class="pdb-sess__user">${v['e' + i + '_user']}</span><span class="pdb-sess__when">${v['e' + i + '_when']}</span></div>`).join('')}</div><a href="#" class="pdb-sess__all">${v.os_view_all}${I('ArrowRight', 14, 'pdb-flip')}</a></div>` });
  const brief = panel({ icon: 'Sparkles', title: v.sb_title, meta: `<span class="pdb-huf">${v.sb_badge}</span>`, id: id + '.shift-brief', body: `<p class="pdb-brief">${v.sb_text}</p>` });
  const notes = panel({ icon: 'Bell', title: v.nt_title, id: id + '.notifications', body: empty ? state('empty', v.nt_empty) : `<div class="pdb-notes">${[1, 2, 3, 4].map((i) => `<div class="pdb-note"><p class="pdb-note__msg">${v['n' + i + '_msg']}</p><span class="pdb-note__time">${v['n' + i + '_time']}</span></div>`).join('')}</div>` });
  return `<div class="pdb pdb-bg"><div class="pdb-col" data-ui="${id}">${floor}${sessions}${brief}${notes}</div></div>`;
}

// ---- full screen ----
export function pageHeader(v) {
  return `<div class="pdb-pagehead" data-ui="pos-screen-dashboard.page-header"><div><h1 class="pdb-h1">${v.title}</h1><p class="pdb-sub">${v.branch} · ${v.live_status}</p></div><div class="pdb-pagehead__right"><button type="button" class="pdb-ask" data-ui="pos-screen-dashboard.ask"><span class="pdb-ask__tag">${v.ask_tag}</span><span class="pdb-ask__text">${I('Sparkles', 14)}${v.ask_text}</span><span class="pdb-ask__key">${v.ask_key}</span></button><span class="pdb-live" data-ui="pos-screen-dashboard.live"><span class="pdb-live__dot"></span>${v.live_badge}</span></div></div>`;
}
export const SCREEN_SLOT_KEYS = [...HEADER_KEYS, ...FOOTER_KEYS];
export function dashboardScreen({ v = P, id = 'pos-screen-dashboard', scrolled = false } = {}) {
  const content = `<div class="pdb-page"><div class="pdb-page__in${scrolled ? ' pdb-page__in--scrolled' : ''}">${pageHeader(v)}${insightFeed({ v, id })}${attentionFeed({ v, id })}<div class="pdb-kpi-wrap" data-ui="${id}.kpi"><div class="pdb-kpi-strip">${[1, 2, 3, 4].map((i) => `<div class="pdb-kpi"><div class="pdb-kpi__label">${v['k' + i + '_label']}</div><div class="pdb-kpi__value">${i === 4 ? `<span class="u-num">${v.k4_value}</span>` : v['k' + i + '_value']}</div></div>`).join('')}</div></div>${serviceLine({ v, id: id + '.service-line' }).replace('class="pdb pdb-bg"', 'class="pdb-embed"')}<div class="pdb-grid"><div data-ui="${id}.left">${leftStack({ v, id: id + '.left-stack' })}</div>${dashPanels({ v, id: id + '.rail' }).replace('class="pdb pdb-bg"', 'class="pdb-embed"')}</div></div></div>`;
  const shell = `<div class="pdb pdb-appshell">${header({ v, variant: 'dashboard', id: id + '.header' })}<div class="pdb-appshell__main">${content}</div>${footer('dashboard', { v, id: id + '.footer' })}</div>`;
  return screen(1440, 900, shell, id);
}
export { SHELL_SLOTS, SHELL_RTL };
