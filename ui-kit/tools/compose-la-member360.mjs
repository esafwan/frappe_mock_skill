#!/usr/bin/env node
// Composes pages/la/member-360*.html (loyal-arrow-desk) from la-shell (members-open) + la-member-hero + la-balance-cards + la-tabs + a data-driven activity feed.
// Deterministic: synthetic loyal-arrow/data only; fixed "today" 2026-06-20; no clock/random/network. Also writes pages/la/member-360.boxes.json (pixel boxes of every data-ui, per variant).
//   node tools/compose-la-member360.mjs            (all variants + boxes + screenshots when playwright is present)
import fs from 'fs'; import path from 'path';
import { fill } from '../scripts/engine.mjs';
import { laSlotValues, laMeta } from './render-la.mjs';
const ROOT = new URL('..', import.meta.url).pathname; const DATA = path.join(ROOT, '../loyal-arrow/data/');
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8')); const C = (id) => path.join(ROOT, 'components/la', id);
const AD = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const MON = { en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'] };
const AR = { 'Earned': 'اكتساب', 'Redeemed': 'استبدال', 'Bonus': 'مكافأة', purchase: 'عملية شراء', 'birthday bonus': 'مكافأة عيد ميلاد', 'redeem reward voucher': 'استبدال قسيمة مكافأة',
  Activity: 'النشاط', Rewards: 'المكافآت', Messages: 'الرسائل', Details: 'التفاصيل', Member: 'عضو', Joined: 'انضم في', 'Find another member': 'البحث عن عضو آخر', 'points to the next tier': 'نقطة للوصول إلى المستوى التالي',
  Silver: 'فضي', Gold: 'ذهبي', Platinum: 'بلاتيني', Active: 'نشط', 'Points balance': 'رصيد النقاط', Available: 'المتاح', 'No activity yet': 'لا يوجد نشاط بعد', 'Points earned or redeemed will show up here.': 'ستظهر هنا النقاط المكتسبة أو المستبدلة.',
  'Highest tier reached': 'تم بلوغ أعلى مستوى', 'Member 360': 'عضو ٣٦٠', 'Reward voucher': 'قسيمة مكافأة', 'Available to redeem': 'متاح للاستبدال', 'Redeemed': 'استبدال', 'Mobile': 'الجوال', 'Tier': 'المستوى', 'Lifetime points': 'النقاط الإجمالية',
  'Marketing consent': 'موافقة التسويق', 'Service consent': 'موافقة الخدمة', 'Preferred language': 'اللغة المفضلة', 'Referral code': 'رمز الإحالة', Yes: 'نعم', No: 'لا', English: 'الإنجليزية', Arabic: 'العربية', 'No messages yet': 'لا توجد رسائل بعد', 'Service message sent': 'تم إرسال رسالة خدمة', 'Welcome message sent': 'تم إرسال رسالة ترحيب', 'Reward voucher issued': 'تم إصدار قسيمة مكافأة' };
const t = (lang, s) => lang === 'ar' ? (AR[s] ?? s) : s;
const num = (lang, n) => { const s = Number(n).toLocaleString('en-US'); return lang === 'ar' ? AD(s) : s; };
const TODAY = Date.UTC(2026, 5, 20);
function dateOf(off, lang) { const d = new Date(TODAY + off * 864e5); const s = `${MON[lang][d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; return lang === 'ar' ? AD(s) : s; }
function timeOf(seed, lang) { const h = 9 + (seed * 7) % 12, m = (seed * 13) % 60; const ap = h >= 12 ? (lang === 'ar' ? 'م' : 'PM') : (lang === 'ar' ? 'ص' : 'AM'); const h12 = ((h + 11) % 12) + 1; const s = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`; return lang === 'ar' ? AD(s) : s; }

// ---- data: deterministic pick, activity from bills + one bonus + one redeem
function member(dataset, mode) {
  const dir = DATA + dataset + '/'; const ms = J(dir + 'members.json'), bills = J(dir + 'bills.json'), tiers = J(dir + 'tiers.json');
  const pick = mode === 'empty' ? ms.find(m => !bills.some(b => b.member_id === m.member_id)) : ms.find(m => m.tier === 'Silver' && m.balance_pts > 400 && bills.filter(b => b.member_id === m.member_id).length >= 4) || ms.find(m => m.balance_pts > 400 && bills.filter(b => b.member_id === m.member_id).length >= 4);
  const my = bills.filter(b => b.member_id === pick.member_id).sort((a, b) => b.day_offset - a.day_offset);
  let ev = my.map(b => ({ off: b.day_offset, kind: 'Earned', note: 'purchase', pts: b.points_earned, seed: +b.bill_no.slice(-3) }));
  if (mode !== 'empty') { ev.push({ off: ev[ev.length - 1].off - 12, kind: 'Bonus', note: 'birthday bonus', pts: 100, seed: 31 }); ev.unshift({ off: -2, kind: 'Redeemed', note: 'redeem reward voucher', pts: -Math.min(pick.balance_pts, 600), seed: 44 }); }
  ev = mode === 'empty' ? [] : ev.sort((a, b) => b.off - a.off).slice(0, 7);
  const nextT = tiers.filter(x => x.threshold_pts > pick.lifetime_pts).sort((a, b) => a.threshold_pts - b.threshold_pts)[0]; const curT = tiers.filter(x => x.threshold_pts <= pick.lifetime_pts).pop();
  return { m: pick, ev, nextT, curT, idx: +pick.member_id.replace(/\D/g, ''), bills: my, tiers };
}
// ---- component fragments (rendered with the real component html + slot rules)
function frag(id, lang, set = {}, state) {
  const file = state && fs.existsSync(path.join(C(id), 'states', state + '.html')) ? path.join(C(id), 'states', state + '.html') : path.join(C(id), 'component.html');
  const sv = { ...laSlotValues(id, { lang, state: undefined }), ...set }; for (const k of Object.keys(sv)) if (sv[k + '__raw'] === undefined && /Pct$/.test(k)) sv[k + '__raw'] = String(sv[k]).replace(/[^\d.]/g, '');
  return fill(fs.readFileSync(file, 'utf8').replaceAll('{{state}}', state || 'default'), sv);
}
function slotCheck(id, set) { const sl = J(path.join(C(id), 'slots.json')).slots; for (const [k, v] of Object.entries(set)) if (sl[k]?.maxLength && String(v).length > sl[k].maxLength) throw new Error(`${id}.${k} exceeds maxLength ${sl[k].maxLength}`); }

export function composeMember360(o = {}) {
  const lang = o.lang || 'en', dataset = o.dataset || 'uae-dubai-supermarket', theme = o.theme || 'light', mode = o.mode || 'populated', tab = o.tab || 'activity';
  const D = member(dataset, mode === 'empty' ? 'empty' : 'pop'); const m = D.m; const zero = mode === 'zero' || mode === 'empty';
  const id5 = String(D.idx).padStart(5, '0'); const tierName = zero ? (D.tiers[0].tier_name) : D.curT.tier_name;
  const nm = `${t(lang, 'Member')} #${lang === 'ar' ? AD(id5) : id5} (${t(lang, tierName)})`;
  const bal = zero ? 0 : m.balance_pts; const toNext = D.nextT ? Math.max(0, D.nextT.threshold_pts - (zero ? 0 : m.lifetime_pts)) : 0;
  const pct = D.nextT ? Math.round(100 * (zero ? 0 : m.lifetime_pts) / D.nextT.threshold_pts) : 100;
  const joined = dateOf(-(199) + 9, lang); const mask = '+0000000 •• ••• ' + m.mobile_masked.slice(-2);
  const heroSet = { avatarInitial: (m.names.en[0]), name: nm, joinedLine: `${t(lang, 'Joined')} ${joined} · ${lang === 'ar' ? AD(mask) : mask}`, tierPill: t(lang, tierName), statusPill: t(lang, 'Active'), progressPct: String(pct), progressPct__raw: String(pct),
    progressLabel: D.nextT ? `${num(lang, toNext)} ${t(lang, 'points to the next tier')}` : t(lang, 'Highest tier reached'), backLink: t(lang, 'Find another member') };
  if (lang === 'ar') heroSet.avatarInitial = m.names.ar[0];
  slotCheck('member-hero', heroSet);
  const hero = frag('member-hero', lang, heroSet, mode === 'empty' ? 'no-tier' : 'populated').replace('data-ui="la-member-hero"', 'data-ui="la-member-hero"');
  const back = hero.match(/<a class="la-backlink"[\s\S]*?<\/a>/)[0]; const card = hero.match(/<section class="la-card la-hero"[\s\S]*?<\/section>/)[0];
  const balSet = { balanceLabel: t(lang, 'Points balance'), balanceValue: num(lang, bal), availableLabel: t(lang, 'Available'), availableValue: num(lang, bal) }; slotCheck('balance-cards', balSet);
  const balance = frag('balance-cards', lang, balSet, o.tick ? 'tick' : zero ? 'zero' : 'populated').match(/<section class="la-card la-balance"[\s\S]*?<\/section>/)[0];
  const tabIdx = { activity: 1, rewards: 2, messages: 3, details: 4 }[tab];
  const tabsSet = { tab1: t(lang, 'Activity'), tab2: t(lang, 'Rewards'), tab3: t(lang, 'Messages'), tab4: t(lang, 'Details') }; slotCheck('la-tabs'.slice(3), tabsSet);
  let tabs = frag('tabs', lang, tabsSet, 'active-' + tabIdx).replace(/<a class="la-tab"[^>]*data-ui="la-tabs\.tab-[567]"[\s\S]*?<\/a>\n?/g, '');
  tabs = tabs.replace('data-ui="la-tabs"', 'data-ui="la-member-360.tabs"').replace(/la-tabs\.tab-(\d)/g, 'la-member-360.tab-$1');
  let body = '';
  const row = (e, i, focus) => `<div class="la-act-row${e.pts < 0 ? ' is-out' : ''}${focus ? ' is-focus' : ''}" data-ui="la-member-360.feed-row-${i + 1}"><span class="la-act-time" data-ui="la-member-360.feed-time-${i + 1}">${timeOf(e.seed, lang)}</span><span class="la-act-main"><span class="la-act-kind" data-ui="la-member-360.feed-kind-${i + 1}">${t(lang, e.kind)}</span><span class="la-act-note" data-ui="la-member-360.feed-note-${i + 1}">${t(lang, e.note)}</span></span><span class="la-act-pts" data-ui="la-member-360.feed-points-${i + 1}">${(e.pts > 0 ? '+' : e.pts < 0 ? '-' : '') + num(lang, Math.abs(e.pts))}</span></div>`;
  const kv = (rows, p) => `<div class="la-m360-kv" data-ui="la-member-360.${p}">` + rows.map(([k, v], i) => `<div class="la-m360-kv-row" data-ui="la-member-360.${p}-row-${i + 1}"><span class="la-m360-kv-k">${t(lang, k)}</span><span class="la-m360-kv-v">${v}</span></div>`).join('') + '</div>';
  if (tab === 'activity') {
    if (!D.ev.length) body = `<div class="la-m360-empty" data-ui="la-member-360.feed-empty"><div class="la-act-empty-title">${t(lang, 'No activity yet')}</div><div class="la-act-empty-hint">${t(lang, 'Points earned or redeemed will show up here.')}</div></div>`;
    else { const groups = []; D.ev.forEach((e, i) => { const g = groups[groups.length - 1]; if (g && g.off === e.off) g.rows.push([e, i]); else groups.push({ off: e.off, rows: [[e, i]] }); });
      body = `<div class="la-act" data-ui="la-member-360.feed" data-state="populated">` + groups.map((g, gi) => `<div class="la-act-group" data-ui="la-member-360.feed-group-${gi + 1}"><div class="la-act-date" data-ui="la-member-360.feed-date-${gi + 1}">${dateOf(g.off, lang)}</div><div class="la-act-card">${g.rows.map(([e, i]) => row(e, i, o.focusRow === i + 1)).join('')}</div></div>`).join('') + '</div>'; }
  } else if (tab === 'rewards') {
    const red = D.ev.filter(e => e.pts < 0).map(e => [`${t(lang, 'Reward voucher')} · ${dateOf(e.off, lang)}`, num(lang, -e.pts)]);
    body = kv([[ 'Available to redeem', num(lang, bal)], ...red.map(r => [r[0], r[1]])].map(([k, v]) => [k, v]), 'rewards-list');
  } else if (tab === 'messages') {
    body = zero ? `<div class="la-m360-empty" data-ui="la-member-360.messages-empty"><div class="la-act-empty-title">${t(lang, 'No messages yet')}</div></div>` : kv([['Welcome message sent', dateOf(-190, lang)], ['Service message sent', dateOf(-60, lang)], ['Reward voucher issued', dateOf(-2, lang)]], 'messages-list');
  } else body = kv([['Mobile', lang === 'ar' ? AD(mask) : mask], ['Tier', t(lang, tierName)], ['Lifetime points', num(lang, zero ? 0 : m.lifetime_pts)], ['Marketing consent', t(lang, m.consent_marketing ? 'Yes' : 'No')], ['Service consent', t(lang, m.consent_service ? 'Yes' : 'No')], ['Preferred language', t(lang, m.preferred_language === 'ar' ? 'Arabic' : 'English')], ['Referral code', m.referral_code]], 'details-list');
  const content = `<div class="la-page-col la-m360" data-ui="la-member-360" data-state="${mode}" data-tab="${tab}">${back}<div class="la-m360-top">${card}${balance}</div>${tabs}${body}</div>`;
  // shell (members-open state)
  const shSet = { ...laSlotValues('shell', { lang }), activeLeaf: t(lang, 'Member 360'), pageTitle: nm };
  const shell = fill(fs.readFileSync(path.join(C('shell'), 'states/members-open.html'), 'utf8'), shSet).replace('<!--la:content-->', content);
  const sys = J(path.join(ROOT, 'systems/loyal-arrow-desk/system.json')); const css = [...sys.tokens.css.map(f => path.basename(f)), 'la-widgets.css', 'la-desk-nav.css', 'la-desk-feedform.css', 'la-pages.css'].filter((x, i, a) => a.indexOf(x) === i);
  const links = css.map(f => `<link rel="stylesheet" href="../../tokens/css/${f}">`).join('\n');
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${theme}"${lang === 'ar' ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>Member 360 (${dataset})</title>\n${links}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:1440px;min-height:900px}</style></head>\n<body class="la-root"><div id="ui-kit-stage">\n${shell}\n</div></body></html>\n`;
}
export const VARIANTS = {
  '': {}, '.dark': { theme: 'dark' }, '.ar-AED': { lang: 'ar' }, '.en-INR': { dataset: 'india-departmental-store' },
  '.empty': { mode: 'empty' }, '.zero': { mode: 'zero' }, '.tick': { tick: true }, '.focus-row': { focusRow: 2 },
  '.rewards': { tab: 'rewards' }, '.messages': { tab: 'messages' }, '.details': { tab: 'details' }, '.dark.empty': { theme: 'dark', mode: 'empty' }, '.ar-AED.empty': { lang: 'ar', mode: 'empty' },
};
if (process.argv[1]?.endsWith('compose-la-member360.mjs')) {
  const out = path.join(ROOT, 'pages/la/'); fs.mkdirSync(out, { recursive: true });
  for (const [suf, o] of Object.entries(VARIANTS)) fs.writeFileSync(out + `member-360${suf}.html`, composeMember360(o));
  if (!process.argv.includes('--no-measure')) {
    const { chromium } = await import('playwright'); const b = await chromium.launch(); const boxes = {}; fs.mkdirSync(out + 'shots', { recursive: true });
    for (const suf of Object.keys(VARIANTS)) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + out + `member-360${suf}.html`); await p.evaluate(() => document.fonts.ready);
      boxes['member-360' + suf] = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }));
      const ids = boxes['member-360' + suf].map(x => x.id); if (new Set(ids).size !== ids.length) { console.error('DUP data-ui in', suf); process.exitCode = 1; }
      await p.screenshot({ path: out + `shots/member-360${suf}.png` }); await p.close(); }
    await b.close(); fs.writeFileSync(out + 'member-360.boxes.json', JSON.stringify({ viewport: { w: 1440, h: 900 }, variants: boxes }, null, 1));
  }
  console.log('composed', Object.keys(VARIANTS).length, 'variants');
}
