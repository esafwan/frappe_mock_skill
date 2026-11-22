#!/usr/bin/env node
// Composes the Loyal Arrow "Loyalty Member" list page (reference: ux-after-r1/member-list__desktop-light.png) for system loyal-arrow-desk.
// Deterministic: no clocks/random/network. Data: loyal-arrow/data/<dataset>/members.json (synthetic). Output: pages/la/member-list[.variant].html + member-list.page.json (+ manifest.json pages["la-member-list"]).
//   node scripts/la-page-member-list.mjs            (compose + screenshot + measure boxes)
import fs from 'fs'; import path from 'path'; import { fill } from './engine.mjs'; import { laSlotValues } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const REPO = path.resolve(ROOT, '..'); const OUT = ROOT + 'pages/la/';
const ICO = {
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>', ud: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>', refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', plus: '<path d="M12 5v14M5 12h14"/>', filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  sort: '<path d="M4 7h10M4 12h7M4 17h4M18 5v14M15 16l3 3 3-3"/>', chev: '<path d="M6 9l6 6 6-6"/>', approx: '<path d="M5 9c2-3 5 3 7 0s5 3 7 0M5 15c2-3 5 3 7 0s5 3 7 0"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>', users: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14.500a5 5 0 0 1 4.500 5"/>',
};
const ico = (k, c = '') => `<svg class="la-ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICO[k]}</svg>`;
// ---- text (slots). every string is a named slot with maxLength; en + ar ----
const T = {
  en: { pageTitle: ['Loyalty Member', 40], viewLabel: ['List View', 14], addBtn: ['Add Loyalty Member', 24], fId: ['ID', 14], fName: ['Name', 14], fStatus: ['Status', 14], fLocation: ['Home location', 20], fTier: ['Current tier', 18], fProgramme: ['Loyalty programme', 22], fTest: ['Test record', 16], filterBtn: ['Filter', 12], sortBy: ['Last Updated On', 22],
    cName: ['Name', 14], cStatus: ['Status', 14], cNumber: ['Member number', 20], cJoined: ['Joined', 14], cTier: ['Current tier', 18], cPoints: ['Points balance', 20], loadMore: ['Load More', 14], ago_d: ['d', 3], ago_w: ['w', 3], active: ['Active', 12], merged: ['Merged', 12], inactive: ['Inactive', 12],
    emptyTitle: ["You haven't created a Loyalty Member yet", 44], emptyBody: ['Members join at the till or through the self check-in link.', 64], emptyAction: ['Create your first Loyalty Member', 36], nrTitle: ['No Loyalty Member found', 36], nrBody: ['No member matches these filters.', 48], nrAction: ['Clear filters', 20],
    leaf1: ['Members summary', 30], leaf2: ['All members', 30], leaf3: ['Tier changes', 30], leaf4: ['Tier grants', 30], leaf5: ['Consent records', 30], leaf6: ['Self check-ins', 30], leaf7: ['Poster tokens', 30], leaf8: ['Member 360', 30], mActive: ['Active', 12], mMerged: ['Merged', 12], mInactive: ['Inactive', 12] },
  ar: { pageTitle: ['عضو الولاء', 40], viewLabel: ['عرض القائمة', 14], addBtn: ['إضافة عضو ولاء', 24], fId: ['المعرّف', 14], fName: ['الاسم', 14], fStatus: ['الحالة', 14], fLocation: ['الفرع الرئيسي', 20], fTier: ['المستوى الحالي', 18], fProgramme: ['برنامج الولاء', 22], fTest: ['سجل تجريبي', 16], filterBtn: ['تصفية', 12], sortBy: ['آخر تحديث', 22],
    cName: ['الاسم', 14], cStatus: ['الحالة', 14], cNumber: ['رقم العضو', 20], cJoined: ['تاريخ الانضمام', 14], cTier: ['المستوى الحالي', 18], cPoints: ['رصيد النقاط', 20], loadMore: ['تحميل المزيد', 14], ago_d: ['ي', 3], ago_w: ['أ', 3], active: ['نشط', 12], merged: ['مدمج', 12], inactive: ['غير نشط', 12],
    emptyTitle: ['لم تنشئ أي عضو ولاء بعد', 44], emptyBody: ['ينضم الأعضاء عند الصندوق أو عبر رابط تسجيل الحضور الذاتي.', 64], emptyAction: ['أنشئ أول عضو ولاء', 36], nrTitle: ['لم يتم العثور على أعضاء', 36], nrBody: ['لا يوجد عضو يطابق هذه التصفية.', 48], nrAction: ['مسح التصفية', 20],
    leaf1: ['ملخص الأعضاء', 30], leaf2: ['كل الأعضاء', 30], leaf3: ['تغييرات المستوى', 30], leaf4: ['منح المستوى', 30], leaf5: ['سجلات الموافقة', 30], leaf6: ['تسجيل الحضور الذاتي', 30], leaf7: ['رموز الملصقات', 30], leaf8: ['ملف العضو 360', 30], mActive: ['نشط', 12], mMerged: ['مدمج', 12], mInactive: ['غير نشط', 12] },
};
const TIERS_AR = { Bronze: 'برونزي', Silver: 'فضي', Gold: 'ذهبي', Platinum: 'بلاتيني' };
const digits = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const used = {};   // slot -> {sample,maxLength}
function mk(lang) { const t = T[lang]; return (k) => { const [v, max] = t[k]; if (v.length > max) throw new Error(`slot ${k} exceeds maxLength ${max}`); used[k] = { type: 'text', sample: T.en[k][0], maxLength: max, where: 'text' }; return v; }; }
// ---- data: derived deterministically from synthetic members.json (no dataset edits) ----
const base = Date.UTC(2026, 10, 13);   // fixed "today" so output is stable
const iso = (n) => new Date(base - n * 864e5).toISOString().slice(0, 10);
function rows(dataset, lang, zero) {
  const ms = JSON.parse(fs.readFileSync(`${REPO}/loyal-arrow/data/${dataset}/members.json`));
  return ms.slice(0, 22).map((m, i) => ({ i, name: m.names[lang] || m.names.en, status: i < 2 ? 'merged' : i === 9 ? 'inactive' : 'active', no: String((i * 37 + 11) % 2200 + 1).padStart(5, '0'), joined: iso(i < 2 ? 40 + i * 120 : Math.floor((i - 2) * 0.55)),
    tier: zero ? (i === 4 || i === 6 ? '' : 'Bronze') : (m.tier || ''), pts: zero ? 0 : m.balance_pts, ago: i < 2 ? ['d', 1] : i < 14 ? ['w', 1] : ['w', 2] }));
}
const fmt = (n, loc, lang) => { const s = new Intl.NumberFormat(loc).format(n); return lang === 'ar' ? digits(s) : s; };
// ---- variants ----
const V = [
  { key: '', desc: 'populated (default, light, EN, AED dataset)' }, { key: 'dark', theme: 'dark', desc: 'populated, dark theme' },
  { key: 'ar-AED', lang: 'ar', desc: 'populated, Arabic RTL, UAE dataset' }, { key: 'en-INR', dataset: 'india-departmental-store', loc: 'en-IN', desc: 'populated, India dataset (lakh digit grouping)' },
  { key: 'zero', zero: true, desc: 'populated but every points balance is 0 (fresh programme; the pixel-reference state)' },
  { key: 'empty', empty: true, desc: 'no Loyalty Member exists yet (0 of 0, create CTA)' }, { key: 'no-results', noResults: true, status: 'Inactive', desc: 'filter Status applied, nothing matches' },
  { key: 'filter-open', open: 'status', desc: 'Status filter dropdown open (cursor target for filter type)' }, { key: 'sort-open', open: 'sort', desc: 'sort menu open (cursor target for sort)' }, { key: 'row-hover', hover: 3, desc: 'row 3 hovered (cursor target: click row to Member 360)' },
];
const slugOf = (v) => v.key ? '.' + v.key : '';
function compose(v) {
  const lang = v.lang || 'en', loc = v.loc || (lang === 'ar' ? 'ar-AE' : 'en-US'), ds = v.dataset || 'uae-dubai-supermarket', t = mk(lang), shell = fs.readFileSync(ROOT + 'components/la/shell/component.html', 'utf8');
  const sv = laSlotValues('shell', { lang }); let sh = fill(shell, sv);
  const lf = (k) => `<span class="la-sidebar-leaf${k === 2 ? ' is-active' : ''}" data-ui="la-member-list.nav-${k}">${t('leaf' + k)}</span>`;
  const aside = sh.match(/<aside[\s\S]*?<\/aside>/)[0];
  const items = [...aside.matchAll(/<div class="la-sidebar-item[^"]*" data-ui="la-shell\.item-(\d+)">[\s\S]*?<\/div>/g)];
  const itemHtml = (n) => items.find(m => m[1] == n)[0].replace(' is-open', '');
  const open = itemHtml(2).replace('M9 6l6 6-6 6', 'M6 9l6 6 6-6').replace('"la-sidebar-item"', '"la-sidebar-item is-open"');
  let side = `<aside class="la-sidebar" data-ui="la-shell.sidebar"><div class="la-workspace" data-ui="la-shell.workspace"><span>${sv.workspaceLabel}</span>${ico('chev', 'la-chev')}</div>${itemHtml(1).replace('is-open', '').replace('M9 6l6 6-6 6', 'M6 9l6 6 6-6')}<div class="la-sidebar-leaves"><div class="la-sidebar-leaf" data-ui="la-shell.leaf-home">${sv.homeLeaf}</div></div>`;
  side = `<aside class="la-sidebar" data-ui="la-shell.sidebar"><div class="la-workspace" data-ui="la-shell.workspace"><span>${sv.workspaceLabel}</span>${ico('chev', 'la-chev')}</div>` + itemHtml(1).replace(/M9 6l6 6-6 6/, 'M6 9l6 6 6-6') + `<div class="la-sidebar-leaves"><div class="la-sidebar-leaf" data-ui="la-shell.leaf-home">${sv.homeLeaf}</div></div>` + open + `<div class="la-sidebar-leaves" data-ui="la-member-list.nav">${[1, 2, 3, 4, 5, 6, 7, 8].map(lf).join('')}</div>` + [3, 4, 5, 6, 7, 8, 9, 10, 11].map(itemHtml).join('') + '</aside>';
  sh = sh.replace(aside, side);
  const header = `<header class="la-header" data-ui="la-shell.header"><h1 class="la-header-title" data-ui="la-member-list.title">${t('pageTitle')}</h1><div class="la-header-actions"><span class="la-btn la-btn-subtle" data-ui="la-member-list.view-switch">${ico('list')}${t('viewLabel')}${ico('ud')}</span><span class="la-iconbtn" data-ui="la-member-list.refresh">${ico('refresh')}</span><span class="la-iconbtn" data-ui="la-member-list.more">${ico('dots')}</span><span class="la-btn is-dark" data-ui="la-member-list.add-btn">${ico('plus')}&nbsp;${t('addBtn')}</span></div></header>`;
  sh = sh.replace(/<header[\s\S]*?<\/header>/, header);
  const stLabel = (s) => t('m' + s[0].toUpperCase() + s.slice(1));
  const field = (id, label, cls, extra = '', op = false, set = '') => `<div class="la-lfield ${cls}${set ? ' is-set' : ''}${v.open === id ? ' is-open' : ''}" data-ui="la-member-list.filter-${id}"><span class="la-lftext">${set || label}</span>${op ? `<span class="la-lop" data-ui="la-member-list.filter-${id}-op">${ico('approx')}</span>` : ''}${extra}${v.open === id ? `<div class="la-menu is-anchored" data-ui="la-member-list.status-menu">${['active', 'merged', 'inactive'].map((s, k) => `<div class="la-menu-item${k === 0 ? ' is-active' : ''}" data-ui="la-member-list.status-opt-${s}">${stLabel(s)}</div>`).join('')}</div>` : ''}</div>`;
  const sortMenu = v.open === 'sort' ? `<div class="la-menu" data-ui="la-member-list.sort-menu" style="inset-inline-end:0">${['sortBy', 'cName', 'cJoined', 'cPoints'].map((k, n) => `<div class="la-menu-item${n === 0 ? ' is-active' : ''}" data-ui="la-member-list.sort-opt-${n + 1}">${t(k)}</div>`).join('')}</div>` : '';
  const statusSet = v.noResults ? t('inactive') : '';
  const filters = `<div class="la-lf-row">${field('id', t('fId'), 'has-op', '', true)}${field('name', t('fName'), 'has-op', '', true)}${field('status', t('fStatus'), 'is-sel', ico('ud'), false, statusSet)}${field('location', t('fLocation'), 'is-sel')}${field('tier', t('fTier'), 'is-sel')}<span class="la-lf-spacer"></span><span class="la-btn is-tool" data-ui="la-member-list.filter-btn">${ico('filter')}${t('filterBtn')}</span><span style="position:relative"><span class="la-sortgrp" data-ui="la-member-list.sort-btn"><span data-ui="la-member-list.sort-dir">${ico('sort')}</span><span data-ui="la-member-list.sort-field">${t('sortBy')}${ico('chev')}</span></span>${sortMenu}</span></div><div class="la-lf-row">${field('programme', t('fProgramme'), 'is-programme')}<span class="la-lcheck" data-ui="la-member-list.filter-test"><span class="la-chk"></span>${t('fTest')}</span></div>`;
  let list = v.empty ? [] : rows(ds, lang, v.zero); if (v.noResults) list = [];
  const num = (n) => lang === 'ar' ? digits(n) : n; const nm = (n) => fmt(n, loc, lang);
  const countTxt = v.empty || v.noResults ? num('0') + (lang === 'ar' ? ' من ' : ' of ') + num('0') : num('20') + (lang === 'ar' ? ' من ' : ' of ') + (lang === 'ar' ? digits('1,000') : '1,000') + '+';
  const body = list.slice(0, 20).map((r, n) => `<div class="la-lrow${v.hover === n + 1 ? ' is-hover' : ''}" data-ui="la-member-list.row-${n + 1}"><div class="la-lc is-first"><span class="la-chk" data-ui="la-member-list.row-${n + 1}-check"></span><b data-ui="la-member-list.row-${n + 1}-name">${r.name}</b></div><div class="la-lc"><span class="la-status-pill" data-state="${r.status === 'active' ? 'active' : r.status === 'merged' ? 'draft' : 'draft'}" data-ui="la-member-list.row-${n + 1}-status">${t(r.status)}</span></div><div class="la-lc" data-ui="la-member-list.row-${n + 1}-number">${num(r.no)}</div><div class="la-lc is-date" data-ui="la-member-list.row-${n + 1}-joined"><bdo dir="ltr">${num(r.joined)}</bdo></div><div class="la-lc" data-ui="la-member-list.row-${n + 1}-tier">${lang === 'ar' ? (TIERS_AR[r.tier] || '') : r.tier}</div><div class="la-lc is-num" data-ui="la-member-list.row-${n + 1}-points">${nm(r.pts)}</div><div class="la-lc is-last"><span>${num(r.ago[1])} ${t('ago_' + r.ago[0])}</span><span class="la-dots"></span></div></div>`).join('');
  const empty = v.empty || v.noResults ? `<div class="la-lempty" data-ui="la-member-list.empty">${ico('users')}<div class="la-lempty-title" data-ui="la-member-list.empty-title">${t(v.empty ? 'emptyTitle' : 'nrTitle')}</div><div class="la-lempty-body">${t(v.empty ? 'emptyBody' : 'nrBody')}</div><div class="la-lempty-action" data-ui="la-member-list.empty-action">${t(v.empty ? 'emptyAction' : 'nrAction')}</div></div>` : '';
  const head = `<div class="la-lhead" data-ui="la-member-list.head"><div class="la-lc is-first"><span class="la-chk" data-ui="la-member-list.select-all"></span><span data-ui="la-member-list.col-name">${t('cName')}</span></div><div class="la-lc" data-ui="la-member-list.col-status">${t('cStatus')}</div><div class="la-lc" data-ui="la-member-list.col-number">${t('cNumber')}</div><div class="la-lc" data-ui="la-member-list.col-joined">${t('cJoined')}</div><div class="la-lc" data-ui="la-member-list.col-tier">${t('cTier')}</div><div class="la-lc is-num" data-ui="la-member-list.col-points">${t('cPoints')}</div><div class="la-lc is-last"><span data-ui="la-member-list.count">${countTxt}</span>${ico('heart')}</div></div>`;
  const foot = `<div class="la-lfoot" data-ui="la-member-list.foot"><span class="la-psize" data-ui="la-member-list.page-size">${['20', '100', '500', '2500'].map((p, k) => `<span class="${k === 0 ? 'is-active' : ''}" data-ui="la-member-list.size-${p}">${num(p)}</span>`).join('')}</span><span class="la-btn is-loadmore" data-ui="la-member-list.load-more">${t('loadMore')}</span></div>`;
  const content = `<div class="la-list" data-ui="la-member-list.list">${filters}${head}<div class="la-lbody" data-ui="la-member-list.body">${body}${empty}</div>${v.empty || v.noResults ? '' : foot}</div>`;
  sh = sh.replace('<!--la:content-->', content).replace('data-ui="la-shell"', 'data-ui="la-shell"');
  const css = ['fonts', 'frappe-desk', 'la-desk-vars', 'la-desk-base', 'la-desk-components', 'la-desk-data', 'la-desk-chart', 'la-desk-nav', 'la-desk-admin', 'la-desk-list'].map(f => `<link rel="stylesheet" href="../../tokens/css/${f}.css">`).join('\n');
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${v.theme || 'light'}"${lang === 'ar' ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>Loyalty Member list${slugOf(v)}</title>\n${css}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:1440px;min-height:900px}.la-root{--la-lcols:140px 164px 164px 165px 164px 164px 1fr}</style></head>\n<body class="la-root"><div id="ui-kit-stage"><div data-ui="la-member-list" data-page="member-list" data-variant="${v.key || 'populated'}">\n${sh}\n</div></div></body></html>\n`;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}member-list${slugOf(v)}.html`, compose(v));
const { chromium } = await import('playwright'); const b = await chromium.launch(); const meta = { id: 'la-member-list', title: 'Loyalty Member list view', system: 'loyal-arrow-desk', route: '/desk/loyalty-member', reference: 'ux-after-r1/member-list__desktop-light.png', viewport: { w: 1440, h: 900 }, slots: used, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}member-list${slugOf(v)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}member-list${slugOf(v)}.png` }); meta.variants[v.key || 'default'] = { file: `pages/la/member-list${slugOf(v)}.html`, screenshot: `pages/la/member-list${slugOf(v)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + 'member-list.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {}; m.pages['la-member-list'] = { id: 'la-member-list', system: 'loyal-arrow-desk', group: 'la', path: 'pages/la/member-list.page.json', variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('member-list: ' + V.length + ' variants');
