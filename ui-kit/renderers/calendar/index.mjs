// Calendar page renderer (T-V2): month / week / day from Calendar View JSON and rows. Generic, deterministic, no clock.
// spec.meta.calendar (or meta.calendar_view): { start_date_field, end_date_field, title_field, color_field, all_day_field,
//   defaultView|default_view: month|week|day, date (anchor), first_day (0=Sunday), colors:{value:colourName}, doctype|name }
// spec.data.rows: [{...}] (or {rows:[...]}). View/anchor overrides: spec.view.mode / spec.view.date. Today comes from ctx.today.
import { esc } from '../../kit-lib/util.mjs';
import { firstDayIndex } from '../../kit-lib/format.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { viewHead } from '../../kit-lib/viewhead.mjs';
import { names, t as tr } from './locale.mjs';

const MAX_LANES = 3;   // month view: event rows shown per week before the rest collapse into "+N more"
const PALETTE = ['blue', 'green', 'orange', 'red', 'purple', 'cyan', 'pink', 'yellow', 'gray'];
const KNOWN = new Set([...PALETTE, 'grey', 'amber', 'teal', 'violet']);
const DAY_MS = 86400000;
const HOUR_PX = 40;

const CSS = `<style data-ui="calendar.layout">
.cal-page{padding:12px 0}.cal-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.cal-nav,.cal-views{display:flex;align-items:center;gap:4px}.cal-title{font-size:16px;font-weight:600;margin:0 8px}
.cal-views .btn.active{background:var(--bg-gray,#ededed)}
.cal-grid{border:1px solid var(--border-color,#ededed);border-radius:8px;overflow:hidden;background:var(--card-bg,var(--surface-white,#fff))}
.cal-dow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.cal-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-template-rows:28px repeat(${MAX_LANES},22px) 1fr;min-height:96px;position:relative}.cal-week>.cal-day{grid-row:1/-1;min-height:0}.cal-week>.cal-ev{position:relative;z-index:1;margin:2px 3px 0}.cal-week>.cal-more{position:relative;z-index:1;margin:0 6px;align-self:center}.cal-dow>div{padding:6px 8px;font-size:12px;color:var(--text-muted,#7c7c7c);border-bottom:1px solid var(--border-color,#ededed);text-align:start}
.cal-day{min-height:96px;padding:4px;border-inline-end:1px solid var(--border-color,#ededed);border-bottom:1px solid var(--border-color,#ededed);min-width:0;box-sizing:border-box}
.cal-week>.cal-day:nth-child(7n){border-inline-end:0}.cal-day.out{background:var(--control-bg,#f8f8f8);color:var(--text-muted,#7c7c7c)}
.cal-num{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;font-size:12px;border-radius:11px;padding:0 4px;box-sizing:border-box}
.cal-day.today .cal-num{background:var(--primary,var(--ink-gray-9,#171717));color:var(--surface-white,#fff);font-weight:600}
.cal-day.today{background:var(--bg-yellow,rgba(255,235,150,.15))}
.cal-ev{display:block;margin-top:2px;padding:1px 6px;font-size:12px;line-height:18px;border-radius:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-sizing:border-box;border-inline-start:3px solid var(--ev-fg,currentColor);background:var(--ev-bg);color:var(--ev-fg)}
.cal-ev.cont{border-inline-start-width:0;border-start-start-radius:0;border-end-start-radius:0}.cal-ev.cont-end{border-start-end-radius:0;border-end-end-radius:0}.cal-more{display:block;margin-top:2px;font-size:11px;color:var(--text-muted,#7c7c7c)}
.cal-time{display:grid;grid-template-columns:48px 1fr}.cal-time .cal-head{display:grid;grid-template-columns:repeat(var(--cols,7),minmax(0,1fr));border-bottom:1px solid var(--border-color,#ededed)}
.cal-head>div{padding:6px 8px;font-size:12px;text-align:center;border-inline-start:1px solid var(--border-color,#ededed)}.cal-head>div.today{font-weight:600}
.cal-head>div.today .cal-num{background:var(--primary,var(--ink-gray-9,#171717));color:var(--surface-white,#fff)}
.cal-gutter{border-inline-end:1px solid var(--border-color,#ededed)}.cal-gutter>div{height:${HOUR_PX}px;font-size:11px;color:var(--text-muted,#7c7c7c);text-align:end;padding:0 6px;box-sizing:border-box}
.cal-allday{display:grid;grid-template-columns:repeat(var(--cols,7),minmax(0,1fr));border-bottom:1px solid var(--border-color,#ededed);min-height:28px}
.cal-allday>div{padding:2px;border-inline-start:1px solid var(--border-color,#ededed);min-width:0}
.cal-body{display:grid;grid-template-columns:repeat(var(--cols,7),minmax(0,1fr))}.cal-col{position:relative;border-inline-start:1px solid var(--border-color,#ededed);background-image:linear-gradient(var(--border-color,#ededed) 1px,transparent 1px);background-size:100% ${HOUR_PX}px;min-width:0}
.cal-col.today{background-color:var(--bg-yellow,rgba(255,235,150,.15))}.cal-col .cal-ev{position:absolute;left:2px;right:2px;margin:0;white-space:normal;line-height:16px}
.cal-empty{padding:32px;text-align:center;color:var(--text-muted,#7c7c7c)}
@media(max-width:767px){.cal-day{min-height:64px}.cal-title{font-size:14px}}
</style>`;

// ---- date helpers (UTC only; no Date.now / local time) ----
function parse(v) {
  if (v === undefined || v === null || v === '') return null;
  const m = String(v).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) return null;
  return { t: Date.UTC(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0), timed: m[4] !== undefined };
}
const dayStart = (t) => Math.floor(t / DAY_MS) * DAY_MS;
const ymd = (t) => new Date(t).toISOString().slice(0, 10);
const hm = (t) => new Date(t).toISOString().slice(11, 16);
const fmtTime = (t) => { const h = new Date(t).getUTCHours(); const mm = String(new Date(t).getUTCMinutes()).padStart(2, '0'); return `${h % 12 || 12}${mm === '00' ? '' : ':' + mm}${h < 12 ? 'am' : 'pm'}`; };
const hourLabel = (h) => `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
const addMonths = (t, n) => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1); };

function colourOf(row, cal) {
  const raw = cal.color_field ? row[cal.color_field] : row.color;
  if (raw === undefined || raw === null || raw === '') return 'blue';
  const key = String(raw);
  const mapped = cal.colors?.[key] || key;
  const lc = String(mapped).toLowerCase();
  if (KNOWN.has(lc)) return lc === 'grey' ? 'gray' : lc;
  if (/^(#|rgb|hsl)/i.test(lc)) return lc;
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;   // stable colour per distinct value
  return PALETTE[h % (PALETTE.length - 1)];
}
function evStyle(colour) {
  if (/^(#|rgb|hsl)/i.test(colour)) return `--ev-bg:color-mix(in srgb,${esc(colour)} 18%,transparent);--ev-fg:${esc(colour)}`;
  return `--ev-bg:var(--bg-${colour},var(--control-bg));--ev-fg:var(--text-${colour},var(--text-color))`;
}

function normalise(rows, cal, warn) {
  const out = [];
  for (const [i, r] of rows.entries()) {
    const s = parse(r[cal.start_date_field]);
    if (!s) { warn?.(`calendar: row ${i} has no usable "${cal.start_date_field}"; skipped`); continue; }
    let e = cal.end_date_field ? parse(r[cal.end_date_field]) : null;
    if (!e || e.t < s.t) e = s;
    const allDay = r[cal.all_day_field || 'all_day'] === 1 || r[cal.all_day_field || 'all_day'] === true || !s.timed;
    const title = String(r[cal.title_field] ?? r.title ?? r.name ?? '');
    out.push({ i, name: r.name ?? String(i), title, s: s.t, e: e.t, allDay, colour: colourOf(r, cal) });
  }
  return out.sort((a, b) => a.s - b.s || a.e - b.e || a.i - b.i);
}
// Last day (inclusive) an event touches.
const lastDay = (ev) => dayStart(ev.allDay || ev.e === ev.s ? ev.e : ev.e - 1 > ev.s ? ev.e - 1 : ev.e);
const touches = (ev, d) => dayStart(ev.s) <= d && lastDay(ev) >= d;

const chip = (ev, { cont = false, contEnd = false, showTime = false, style = '' } = {}) =>
  `<span class="cal-ev${cont ? ' cont' : ''}${contEnd ? ' cont-end' : ''}" style="${evStyle(ev.colour)}${style}" data-ui="calendar.event" data-event="${esc(ev.name)}" title="${esc(ev.title)}" aria-label="${esc(ev.title)}">${showTime && !ev.allDay ? esc(fmtTime(ev.s)) + ' ' : ''}${esc(ev.title)}</span>`;

// ---- views ----
function monthView(anchor, events, today, firstDay, locale) {
  const nm = names(locale);
  const first = Date.UTC(new Date(anchor).getUTCFullYear(), new Date(anchor).getUTCMonth(), 1);
  const lead = (new Date(first).getUTCDay() - firstDay + 7) % 7;
  const start = first - lead * DAY_MS;
  const month = new Date(first).getUTCMonth();
  const weeks = Math.ceil((lead + new Date(Date.UTC(new Date(first).getUTCFullYear(), month + 1, 0)).getUTCDate()) / 7);
  const dow = Array.from({ length: 7 }, (_, k) => `<div>${esc(nm.weekdayShort[(firstDay + k) % 7])}</div>`).join('');
  let body = '';
  for (let w = 0; w < weeks; w++) {
    const w0 = start + w * 7 * DAY_MS, w1 = w0 + 6 * DAY_MS;
    // one spanning segment per event per week; a stable lane per segment, so a bar keeps its row for the whole week
    const segs = events.filter((ev) => dayStart(ev.s) <= w1 && lastDay(ev) >= w0).map((ev) => {
      const c0 = Math.max(0, Math.round((dayStart(ev.s) - w0) / DAY_MS)), c1 = Math.min(6, Math.round((lastDay(ev) - w0) / DAY_MS));
      return { ev, c0, c1, span: c1 - c0 + 1 };
    }).sort((a, b) => a.c0 - b.c0 || b.span - a.span || a.ev.i - b.ev.i);
    const lanes = [];
    for (const sg of segs) { let l = 0; while ((lanes[l] ?? -1) >= sg.c0) l++; lanes[l] = sg.c1; sg.lane = l; }
    let cells = '';
    for (let k = 0; k < 7; k++) {
      const d = w0 + k * DAY_MS;
      const cls = ['cal-day', new Date(d).getUTCMonth() !== month && 'out', d === today && 'today'].filter(Boolean).join(' ');
      cells += `<div class="${cls}" style="grid-column:${k + 1}" data-date="${ymd(d)}" data-ui="calendar.day"><span class="cal-num">${new Date(d).getUTCDate()}</span></div>`;
    }
    const bars = segs.filter((sg) => sg.lane < MAX_LANES).map((sg) => chip(sg.ev, { cont: dayStart(sg.ev.s) < w0, contEnd: lastDay(sg.ev) > w1, style: `;grid-column:${sg.c0 + 1}/span ${sg.span};grid-row:${sg.lane + 2}` })).join('');
    let more = '';
    for (let k = 0; k < 7; k++) {
      const n = segs.filter((sg) => sg.lane >= MAX_LANES && sg.c0 <= k && sg.c1 >= k).length;
      if (n) more += `<span class="cal-more" style="grid-column:${k + 1};grid-row:${MAX_LANES + 2}" data-ui="calendar.more">${tr(locale, 'more', n)}</span>`;
    }
    body += `<div class="cal-week" data-ui="calendar.week">${cells}${bars}${more}</div>`;
  }
  return `<div class="cal-grid" data-ui="calendar.month"><div class="cal-dow">${dow}</div>${body}</div>`;
}

function timeView(days, events, today, mode, locale) {
  const nm = names(locale);
  // Hour range: 8-18 by default, widened (never narrowed) to cover every timed event in range, so no event is clipped.
  const timed = events.filter((e) => !e.allDay && days.some((d) => touches(e, d)));
  let h0 = 8, h1 = 18;
  for (const e of timed) { h0 = Math.min(h0, new Date(e.s).getUTCHours()); h1 = Math.max(h1, Math.min(24, Math.ceil((e.e > e.s ? e.e : e.s + 3600000) % DAY_MS / 3600000) || 24)); }
  if (h1 <= h0) h1 = Math.min(24, h0 + 1);
  const gutter = Array.from({ length: h1 - h0 }, (_, k) => `<div>${hourLabel(h0 + k)}</div>`).join('');
  const heads = days.map((d) => `<div class="${d === today ? 'today' : ''}" data-date="${ymd(d)}">${esc(nm.weekdayShort[new Date(d).getUTCDay()])} <span class="cal-num">${new Date(d).getUTCDate()}</span></div>`).join('');
  const allday = days.map((d) => `<div>${events.filter((e) => e.allDay && touches(e, d)).map((e) => chip(e)).join('')}</div>`).join('');
  const cols = days.map((d) => {
    const evs = timed.filter((e) => touches(e, d)).map((e) => {
      const top = Math.max(0, ((Math.max(e.s, d) - d) / 3600000 - h0)) * HOUR_PX;
      const endH = (Math.min(e.e > e.s ? e.e : e.s + 3600000, d + DAY_MS) - d) / 3600000;
      const h = Math.max(20, (endH - h0) * HOUR_PX - top);
      return `<span class="cal-ev" style="${evStyle(e.colour)};top:${top}px;height:${h - 2}px" data-ui="calendar.event" data-event="${esc(e.name)}" title="${esc(e.title)}">${esc(fmtTime(e.s))} ${esc(e.title)}</span>`;
    }).join('');
    return `<div class="cal-col${d === today ? ' today' : ''}" style="height:${(h1 - h0) * HOUR_PX}px" data-date="${ymd(d)}" data-ui="calendar.column">${evs}</div>`;
  }).join('');
  return `<div class="cal-grid" data-ui="calendar.${mode}" style="--cols:${days.length}"><div class="cal-time"><div></div><div><div class="cal-head" style="--cols:${days.length}">${heads}</div></div>`
    + `<div class="cal-gutter" style="padding-top:28px"><div style="height:0"></div>${gutter}</div><div><div class="cal-allday" data-ui="calendar.allday" style="--cols:${days.length}">${allday}</div><div class="cal-body" style="--cols:${days.length}">${cols}</div></div></div></div>`;
}

export default function render(spec, ctx) {
  const cal = { ...(spec.meta?.calendar_view || {}), ...(spec.meta?.calendar || {}) };
  cal.start_date_field = cal.start_date_field || cal.start_date || 'start';
  cal.end_date_field = cal.end_date_field || cal.end_date || (cal.end_date_field === undefined ? 'end' : undefined);
  cal.title_field = cal.title_field || cal.subject_field || cal.title || 'title';
  const rowsIn = spec.data?.rows ?? spec.data?.events;
  const rows = Array.isArray(rowsIn) ? rowsIn : Array.isArray(rowsIn?.rows) ? rowsIn.rows : [];
  if (!Array.isArray(rowsIn) && !Array.isArray(rowsIn?.rows)) ctx.warn?.('calendar: spec.data.rows is not an array; rendering an empty calendar');
  const events = normalise(rows, cal, ctx.warn);

  const modeRaw = String(spec.view?.mode || cal.defaultView || cal.default_view || 'month').toLowerCase();
  const mode = ['month', 'week', 'day'].includes(modeRaw) ? modeRaw : 'month';
  const todayP = parse(ctx.today);
  if (!todayP) ctx.warn?.('calendar: ctx.today is missing; no today marker');
  const today = todayP ? dayStart(todayP.t) : null;
  const anchorP = parse(spec.view?.date || cal.date) || todayP || (events[0] && { t: events[0].s }) || { t: Date.UTC(2000, 0, 1) };
  const anchor = dayStart(anchorP.t);
  const firstDay = Number.isInteger(cal.first_day) ? cal.first_day % 7 : ctx.formatSystem ? firstDayIndex(ctx.formatSystem) : 0;

  const LN = names(ctx.locale);
  let title, body;
  if (mode === 'month') { title = `${LN.month[new Date(anchor).getUTCMonth()]} ${new Date(anchor).getUTCFullYear()}`; body = monthView(anchor, events, today, firstDay, ctx.locale); }
  else if (mode === 'week') {
    const start = anchor - ((new Date(anchor).getUTCDay() - firstDay + 7) % 7) * DAY_MS;
    const days = Array.from({ length: 7 }, (_, k) => start + k * DAY_MS);
    const a = new Date(days[0]), b = new Date(days[6]);
    title = `${LN.monthShort[a.getUTCMonth()]} ${a.getUTCDate()} – ${a.getUTCMonth() === b.getUTCMonth() ? '' : LN.monthShort[b.getUTCMonth()] + ' '}${b.getUTCDate()}, ${b.getUTCFullYear()}`;
    body = timeView(days, events, today, 'week', ctx.locale);
  } else { title = `${LN.month[new Date(anchor).getUTCMonth()]} ${new Date(anchor).getUTCDate()}, ${new Date(anchor).getUTCFullYear()}`; body = timeView([anchor], events, today, 'day', ctx.locale); }
  if (!events.length) body += `<div class="cal-empty" data-ui="calendar.empty">No events</div>`;

  const nm = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? v.name || v.doctype : undefined);
  const label = nm(cal.doctype) || nm(cal.name) || nm(spec.meta?.doctype) || nm(spec.meta?.name) || 'Calendar';
  const head = viewHead(spec, ctx, { view: 'calendar', label, std: false, sort: false });
  const rtl = !!(ctx.rtl || ctx.dir === 'rtl');
  const btn = (txt, extra = '') => `<button type="button" class="btn btn-default btn-sm${extra}">${txt}</button>`;
  const toolbar = `<div class="cal-toolbar" data-ui="calendar.toolbar"><div class="cal-nav" data-ui="calendar.nav">${btn(icon(rtl ? 'chevron-right' : 'chevron-left', 'sm'), ' btn-prev')}${btn(icon(rtl ? 'chevron-left' : 'chevron-right', 'sm'), ' btn-next')}${btn('Today')}<h3 class="cal-title" data-ui="calendar.title">${esc(title)}</h3></div>`
    + `<div class="cal-views" data-ui="calendar.view-toggle">${['month', 'week', 'day'].map((m) => btn(m[0].toUpperCase() + m.slice(1), m === mode ? ' active' : '')).join('')}</div></div>`;
  return { head, main: `${CSS}<div class="desk-page cal-page" data-ui="calendar.page" data-mode="${mode}">${toolbar}${body}</div>`, title: label };
}
