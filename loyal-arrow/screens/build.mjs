#!/usr/bin/env node
// Builds 4 Loyal Arrow desk screens (HTML) from the synthetic UAE dataset + ui-kit CSS/markup.
//   node build.mjs <outDir>     (default outDir = ./out)
import fs from 'fs'; import path from 'path';
const HERE = new URL('.', import.meta.url).pathname;
const KIT = path.resolve(HERE, '../../ui-kit');
const LA = path.resolve(HERE, '..');
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
// --kit-relative: write desk-lapsing / desk-home to ui-kit/pages/la/<name>.en-AED.html with ../../tokens hrefs
// (no file:// links) and data-ui ids, so the video toolkit can copy them with the kit. Default mode is unchanged.
const KIT_REL = process.argv.includes('--kit-relative');
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const OUT = KIT_REL ? path.join(KIT, 'pages/la') : path.resolve(ARGS[0] || path.join(HERE, 'out'));
fs.mkdirSync(OUT, { recursive: true });

// ---------- data (all from loyal-arrow/data/uae-dubai-supermarket) ----------
const D = path.join(LA, 'data/uae-dubai-supermarket');
const members = J(D + '/members.json'), bills = J(D + '/bills.json'), cfg = J(D + '/cfg.json');
const TODAY = new Date(Date.UTC(2026, 10, 12)); // 12 Nov 2026 = day_offset 0
const fmtDate = off => { const d = new Date(TODAY.getTime() + off * 864e5); return `${d.getUTCDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = n => n.toLocaleString('en-US');
const first = m => m.names.en;
const stat = {};
for (const m of members) stat[m.member_id] = { m, visits: 0, spend: 0, last: -999, firstBill: 999, pts: 0 };
for (const b of bills) { const s = stat[b.member_id]; s.visits++; s.spend += b.total; s.pts += b.points_earned; s.last = Math.max(s.last, b.day_offset); s.firstBill = Math.min(s.firstBill, b.day_offset); }
const active = Object.values(stat).filter(s => s.visits > 0);
active.forEach(s => s.away = -s.last);
// Synthetic overlay for redemptions (data pack has none): every 7th bill redeems 100 pts (= min_redeem_pts). Documented in README.
const redeemed = bills.map((b, i) => (i % 7 === 3 ? cfg.min_redeem_pts : 0));
const win = (from) => bills.map((b, i) => ({ b, r: redeemed[i] })).filter(x => x.b.day_offset >= from);
const kpi = from => { const w = win(from); return { bills: w.length, earned: w.reduce((a, x) => a + x.b.points_earned, 0), redeemed: w.reduce((a, x) => a + x.r, 0), newm: active.filter(s => s.firstBill >= from).length }; };
const K = { today: kpi(0), week: kpi(-6) };
// Groups (plain words)
const LAPS = 30;
const group = s => s.visits === 0 ? 'none' : s.away >= LAPS ? 'slipping' : s.spend >= 1000 ? 'big' : (s.away <= 14 && s.visits >= 4) ? 'regular' : 'occasional';
const GROUPS = [
  ['big', 'Big spenders', 'AED 1,000 or more in total'],
  ['regular', 'Regulars', 'Visited in the last 2 weeks, 4 or more visits'],
  ['occasional', 'Occasional shoppers', 'Shopped recently, fewer visits'],
  ['slipping', 'Slipping away', 'No visit for 30 days or more'],
  ['none', 'Joined, not shopped yet', 'No bill on record'],
];
const gm = {}; for (const m of members) { const s = stat[m.member_id]; (gm[group(s)] ||= []).push(s); }
const lapsing = active.filter(s => s.away >= LAPS).sort((a, b) => b.away - a.away);
const top = [...active].sort((a, b) => b.spend - a.spend).slice(0, 10);
const maskPhone = m => { const n = +m.member_id.slice(4); const a = String(100 + (n * 37) % 900), b = String(1000 + (n * 7919) % 9000); return `+971 ${['50','52','55','56'][n % 4]} ${a} ${b}`; };
const tierPill = t => `<span class="es-badge" data-theme="${t === 'Platinum' ? 'purple' : t === 'Gold' ? 'orange' : 'gray'}"><span class="es-badge__label">${t}</span></span>`;

// ---------- chrome from the kit ----------
const dsk = fs.readFileSync(KIT + '/pages/desk-list.html', 'utf8');
const headCss = dsk.slice(0, dsk.indexOf('<body')).replace(/href="\.\.\/tokens/g, KIT_REL ? 'href="../../tokens' : `href="file://${KIT}/tokens`);
const sprite = fs.readFileSync(KIT + '/tokens/icons/sprite.svg.html', 'utf8');
const SB = J(LA + '/structure/sidebar.json').items;
const ic = n => `<svg class="icon current-color icon-sm" stroke="currentColor" aria-hidden="true"><use href="#icon-${n}"></use></svg>`;
function sidebar(activeSection, activeLabel) {
  const secs = []; for (const it of SB) { if (it.indent === 0) secs.push({ ...it, kids: [] }); else secs.at(-1).kids.push(it); }
  const hide = new Set(['Integrations', 'ERPNext', 'Settings', 'Internal records']);
  let h = '';
  for (const s of secs) { if (hide.has(s.label)) continue; const open = s.label === activeSection;
    h += `<div class="sidebar-item-container section-item" item-name="${s.label}"><div class="standard-sidebar-item"><a class="item-anchor"><span class="sidebar-item-icon">${ic(s.icon)}</span><span class="sidebar-item-label">${s.label}</span><div class="sidebar-item-control"><button class="btn-reset drop-icon"><svg class="icon icon-sm" stroke="#7c7c7c"><use href="#icon-chevron-${open ? 'down' : 'right'}" stroke="#7c7c7c"></use></svg></button></div></a></div>`;
    if (open) { h += '<div class="sidebar-child-item nested-container">';
      for (const k of s.kids) { if (k.label === 'Reports' && s.label === 'Analytics') continue; h += `<div class="sidebar-item-container" item-name="${k.label}"><div class="standard-sidebar-item${k.label === activeLabel ? ' active-sidebar' : ''}"><a class="item-anchor"><span class="sidebar-item-label">${k.label}</span><div class="sidebar-item-control"></div></a></div></div>`; }
      h += '</div>'; }
    h += '</div>'; }
  return `<div class="body-sidebar-container expanded"><div class="body-sidebar"><a class="sidebar-header shell-header" style="text-decoration:none"><div class="header-logo">${ic('gift')}</div><div class="title-container"><div class="sidebar-item-label header-title">Loyal Arrow</div></div><button class="btn-reset drop-icon"><svg class="icon icon-sm" stroke="currentColor"><use href="#icon-chevron-down"></use></svg></button></a>
<div class="body-sidebar-top"><div class="sidebar-items">${h}</div></div></div><div class="sidebar-edge" aria-hidden="true"></div></div>`;
}
const dock = `<div class="dock" id="desk-dock" role="navigation"><div class="dock-logo"><a class="shell-header"><div class="header-logo" style="background:#7c7c7c;color:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:20px">L</div></a></div><div class="dock-items"><button class="dock-item" aria-label="Search"><span class="dock-item-icon"><svg class="icon icon-rail"><use href="#icon-search"></use></svg></span></button><button class="dock-item" aria-label="Notifications"><span class="dock-item-icon"><svg class="icon icon-rail"><use href="#icon-bell"></use></svg></span></button><div style="height:1px;background:#ededed;margin:6px 8px"></div><button class="dock-item active" aria-label="Loyal Arrow"><span class="dock-item-icon"><svg class="icon icon-rail"><use href="#icon-gift"></use></svg></span></button></div><div class="dock-user"><span style="width:28px;height:28px;border-radius:50%;background:#c9f0d8;color:#1c6b3c;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center">RM</span></div></div>`;
const pageHead = (title, refresh) => `<div class="page-head flex"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between"><div class="page-title"><div class="flex title-area ellipsis"><nav class="es-breadcrumbs navbar-breadcrumbs"><ol><li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${title}</span></span></li></ol></nav></div></div><div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex"><span class="page-icon-group">${refresh ? `<button class="text-muted btn btn-default icon-btn"><svg class="icon icon-sm"><use href="#icon-refresh-cw"></use></svg></button>` : ''}</span><div class="menu-btn-group"><button class="btn btn-default icon-btn"><svg class="icon icon-sm"><use href="#icon-ellipsis"></use></svg></button></div></div></div></div></div></div></div>`;
const EXTRA = `<style>.codex-editor__redactor{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 16px;padding:8px 0 0}.codex-editor__redactor>.ce-block{width:auto!important;max-width:none!important;padding:0!important;margin:0!important}.codex-editor__redactor>.ce-block:has(.ce-header){grid-column:1/-1;margin-top:10px!important}.ce-block__content{max-width:none!important;margin:0!important}.page-content{padding:16px 15px 24px}.page-content .layout-main-section-wrapper,.page-content .frappe-list,.page-content .layout-main{padding:0!important;margin:0!important}.sidebar-child-item{margin-left:15px;border-left:1px solid #e2e2e2;padding-left:8px}.sidebar-child-item .item-anchor{padding-left:0!important}.dock .dock-items{gap:0!important;padding-top:0!important}.dock .dock-item{width:30px!important;height:30px!important;min-height:0!important;margin:0 auto!important;padding:0!important}.dock .dock-item svg{width:16px!important;height:16px!important}.dock .dock-item.active{width:34px!important;height:34px!important;margin-top:13px!important}.dock .dock-logo{margin-bottom:11px}.dock .dock-item.active svg{width:20px!important;height:20px!important}.list-view .list-row-head{border-radius:0!important;background:#f3f3f3}.list-row-col{padding:0 7px;font-size:13px}.list-row{height:33px!important;min-height:0!important;padding:0!important}.list-row-head{height:36px!important}.list-row-container{border-bottom:1px solid #ededed}.page-body .container{padding:0!important}.page-container{min-height:100vh;background:var(--bg-color,#fff)}.page-content .layout-main{width:100%}.list-view .list-row-head{border-radius:8px}</style>`;
const shell = (title, secAct, labelAct, body, refresh) => `${headCss}${EXTRA}<body class="desktop-page dock-active dock-pinned dock-open no-list-sidebar" data-sidebar="1"><div id="ui-kit-stage" class="ui-kit-page"><div style="display:none">${sprite}</div>${dock}${sidebar(secAct, labelAct)}<div class="main-section"><div id="body"><div class="content page-container">${pageHead(title, refresh)}<div class="container page-body"><div class="page-wrapper"><div class="page-content">${body}</div></div></div></div></div></div></div></body></html>`;

// ---------- blocks ----------
const ui = id => (KIT_REL && id ? ` data-ui="${id}"` : '');
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const numCard = (label, val, sub = '', id = '') => `<div class="ce-block col-xs-12 col-sm-6 col-md-3"${ui(id)}><div class="ce-block__content"><div><div class="widget number-widget-box"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis">${label}</span></div><div class="widget-subtitle"></div></div></div><div class="widget-body"><div class="widget-content"><div class="number">${val}</div>${sub ? `<div class="card-stats grey-stat"><span class="percentage-stat-area">${sub}</span></div>` : ''}</div></div><div class="widget-footer"></div></div></div></div></div>`;
const heading = t => `<div class="ce-block col-xs-12"><div class="ce-block__content"><div class="ce-header"><div class="h4"><b>${t}</b></div></div></div></div>`;
const shortcut = (label, count) => `<div class="ce-block col-xs-12 col-sm-6 col-md-3"><div class="ce-block__content"><div><div class="widget shortcut-widget-box"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis">${label}</span>${count ? `<span style="background:#f0f0f0;border-radius:10px;padding:0 7px;font-size:12px;margin-left:8px;color:#525252">${count}</span>` : ''}</div></div><div class="widget-control"><svg class="icon icon-sm"><use href="#icon-arrow-up-right"></use></svg></div></div></div></div></div></div>`;
const ws = inner => `<div class="editor-js-container" style="margin-top:var(--margin-sm)"><div class="desk-page page-main-content"><div class="codex-editor"><div class="codex-editor__redactor">${inner}</div></div></div></div>`;
// table built on the kit's list-row classes
function table(cols, rows, ids = []) {
  cols = [{ h: '', w: 36 }, ...cols]; rows = rows.map((r, i) => [`<span class="text-muted">${i + 1}</span>`, ...r]);
  const w = c => `flex:${c.w ? `0 0 ${c.w}px` : '1 1 0'};${c.right ? 'justify-content:flex-end;text-align:right;' : ''}`;
  const head = `<header class="level list-row-head text-muted"><div class="level-left list-header-subject" style="width:100%">${cols.map(c => `<div class="list-row-col ellipsis" style="${w(c)}"><span>${c.h}</span></div>`).join('')}</div></header>`;
  const body = rows.map((r, ri) => `<div class="list-row-container"${ui(ids[ri])}><div class="level list-row"><div class="level-left ellipsis" style="width:100%">${r.map((v, i) => `<div class="list-row-col ellipsis${i === 1 ? ' bold' : ''}" style="${w(cols[i])}">${v}</div>`).join('')}</div></div></div>`).join('');
  return `<div class="layout-main"${ui(ids.length ? 'la-table' : '')}><div class="layout-main-section-wrapper list-view"><div class="frappe-list"><div class="result"${ui(ids.length ? 'la-table-rows' : '')}><div class="list-row-container">${head}</div>${body}</div></div></div></div>`;
}
const cards = (a, id = '') => `<div class="codex-editor__redactor" style="margin:4px 0 16px"${ui(id)}>${a.map(([l,v],i)=>numCard(l,v,'',id ? `${id.replace(/s$/, '')}-${i+1}` : '')).join('')}</div>`;
const strip = (items) => `<div style="display:flex;gap:16px;margin:0 0 14px">${items.map((t, i) => `<span style="background:#f3f3f3;border-radius:8px;padding:0 8px;height:28px;line-height:28px;font-size:13px;color:#171717;font-weight:${i ? 400 : 600}">${t}</span>`).join('')}</div>`;
const lead = t => `<p style="margin:4px 0 12px;color:var(--text-muted,#525252);font-size:13px">${t}</p>`;

// ---------- screens ----------
const screens = {};
const homeCards = k => numCard('Bills', int(k.bills)) + numCard('Points earned', int(k.earned)) + numCard('Points redeemed', int(k.redeemed)) + numCard('New members', int(k.newm));
const homeSec = (id, inner) => KIT_REL ? `<div class="codex-editor__redactor" data-ui="${id}" style="grid-column:1/-1;grid-template-columns:subgrid;margin:0;padding:0">${inner}</div>` : inner;
const HOMECSS = `<style>.page-content{padding:0 68px 24px!important}.codex-editor__redactor{gap:15px!important;padding-top:0!important}.codex-editor__redactor>.ce-block:has(.ce-header){margin-top:0!important;margin-bottom:-8px!important}.ce-header .h4{color:#7c7c7c;font-size:15px;font-weight:600;line-height:20px}.ce-header .h4 b{font-weight:600}.page-content{padding-top:15px!important}</style>`;
screens['desk-home'] = shell('Loyal Arrow Home', 'Home', 'Overview', HOMECSS + ws(
  homeSec('la-home-today', heading('Today') + homeCards(K.today)) + homeSec('la-home-week', heading('Last 7 days') + homeCards(K.week)) +
  heading('Programme') + shortcut('Programs') + shortcut('Tiers', String(J(D + '/tiers.json').length)) + shortcut('Rewards catalog') + shortcut('Earning & Redemption Rules') + shortcut('Campaigns') + shortcut('Message log')), false);
const lapRows = lapsing.map((s, i) => [first(s.m), fmtDate(s.last), `${s.away} days`, money(s.spend), tierPill(s.m.tier), maskPhone(s.m)]);
screens['desk-lapsing'] = shell('Lapsing Customers', 'Analytics', 'Lapsing Customers',
  strip([cfg.store, '30 days or more since last visit']) + cards([['Customers lapsing', lapsing.length], ['Longest away', lapsing[0].away + ' days'], ['Their total spend (AED)', money(lapsing.reduce((a, s) => a + s.spend, 0))], ['Gold or Platinum', lapsing.filter(s => s.m.tier !== 'Silver').length]], 'la-kpis') + lead('Longest away first.') +
  table([{ h: 'Customer' }, { h: 'Last visit' }, { h: 'Days away', right: 1, w: 140 }, { h: 'Total spend (AED)', right: 1, w: 180 }, { h: 'Tier', w: 150 }, { h: 'Phone', w: 200 }], lapRows, lapsing.map(s => 'la-row-' + slug(first(s.m)))), true);
const gRows = GROUPS.map(([k, name, desc]) => { const g = gm[k] || []; const sp = g.reduce((a, s) => a + s.spend, 0); const vis = g.filter(s => s.visits); return [name, desc, int(g.length), vis.length ? money(sp / vis.length) : '–']; });
screens['desk-groups'] = shell('Customer groups', 'Members', 'Segments',
  strip([cfg.store, `${members.length} members`]) + cards([['Members', members.length], ['Shopped at least once', active.length], ['Groups', GROUPS.length], ['Avg spend per shopper (AED)', money(active.reduce((a, s) => a + s.spend, 0) / active.length)]]) + lead('Every member sits in exactly one group, based on spend and how recently they shopped.') +
  table([{ h: 'Group', w: 260 }, { h: 'Who is in it' }, { h: 'Members', right: 1, w: 130 }, { h: 'Avg spend (AED)', right: 1, w: 180 }], gRows), true);
const tRows = top.map((s, i) => [first(s.m), `M${s.m.member_id.slice(4)}`, tierPill(s.m.tier), int(s.visits), money(s.spend), s.away === 0 ? 'Today' : `${s.away} ${s.away === 1 ? 'day' : 'days'} ago`]);
screens['desk-top-customers'] = shell('Top Customers', 'Analytics', 'Top Customers',
  strip([cfg.store, 'Top 10 by total spend']) + cards([['Top 10 spend (AED)', money(top.reduce((a, s) => a + s.spend, 0))], ['Share of all spend', Math.round(100 * top.reduce((a, s) => a + s.spend, 0) / active.reduce((a, s) => a + s.spend, 0)) + '%'], ['Platinum in top 10', top.filter(s => s.m.tier === 'Platinum').length], ['Gold in top 10', top.filter(s => s.m.tier === 'Gold').length]]) + lead('Ranked by total spend including VAT, all bills on record.') +
  table([{ h: 'Customer' }, { h: 'Member no.', w: 130 }, { h: 'Tier', w: 150 }, { h: 'Visits', right: 1, w: 110 }, { h: 'Total spend (AED)', right: 1, w: 180 }, { h: 'Last visit', right: 1, w: 150 }], tRows), true);

for (const [n, h] of Object.entries(screens)) {
  if (KIT_REL) { if (n === 'desk-lapsing' || n === 'desk-home') fs.writeFileSync(path.join(OUT, n + '.en-AED.html'), h); }
  else fs.writeFileSync(path.join(OUT, n + '.html'), h);
}
if (!KIT_REL) fs.writeFileSync(path.join(OUT, 'figures.json'), JSON.stringify({ K, groups: GROUPS.map(g => [g[1], (gm[g[0]] || []).length]), lapsing: lapsing.length, top: top.map(s => [first(s.m), s.m.member_id, s.spend.toFixed(2)]) }, null, 1));
console.log('wrote', Object.keys(screens).join(', '), JSON.stringify(K));
