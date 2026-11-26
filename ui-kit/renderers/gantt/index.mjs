// Gantt page renderer (T-V3). Engine contract: default export render(spec, ctx) -> { document, head, main, title }.
// Static SVG in the shape of frappe-gantt (V16-FACTS: bar_height 35, corner radius 4, default view_mode Day, Today button,
// progress fill only when a row has progress). View spec keys (all optional): view_mode (Day|Week|Month), field_map
// {start,end,progress,id,title,color,depends_on}, dependencies (bool, default true), show_progress, state (loading|empty), page_length.
// Field map falls back to spec.meta.calendar_view.field_map, then to the first two Date fields. Rows come from data.rows;
// rows without dates get deterministic ones derived from ctx.today and the row index. Colours are CSS variables only.
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { enabledViews } from '../../kit-lib/viewswitch.mjs';
import { applyCustomizations } from '../../doctype/lib/customize.mjs';
import { renderShell } from '../../shell/shell.mjs';
import { sidebarContainer, loadWorkspaceSidebar, dockFromWorkspaces } from '../form/index.mjs';
import { renderListHead, dtName } from '../list/head.mjs';
import { resolveRows } from '../list/rows.mjs';
import { hash } from '../../data/gen.mjs';
import { names, t as tr } from '../calendar/locale.mjs';

const MODES = ['Day', 'Week', 'Month'];
const COL_W = { Day: 38, Week: 140, Month: 120 };
const BAR_H = 35, PAD = 18, ROW_H = BAR_H + PAD, HEAD_H = 68, UPPER_H = 28, RADIUS = 4;
const DAY = 86400000;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PALETTE = ['var(--blue-500)', 'var(--green-500)', 'var(--orange-500)', 'var(--purple-500)', 'var(--cyan-500)', 'var(--pink-500)'];
const PALETTE_SOFT = ['var(--blue-100)', 'var(--green-100)', 'var(--orange-100)', 'var(--purple-100)', 'var(--cyan-100)', 'var(--pink-100)'];

const parse = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? '')); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; };
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (ms, n) => ms + n * DAY;
const dayDiff = (a, b) => Math.round((b - a) / DAY);
const monthStart = (ms) => { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1); };
const addMonths = (ms, n) => { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1); };
const daysInMonth = (ms) => { const d = new Date(ms); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); };
const parseJson = (v, d) => { if (typeof v !== 'string') return v ?? d; try { return JSON.parse(v); } catch { return d; } };
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null; };

/** Field map: view.field_map, then meta.calendar_view.field_map (object or JSON string), then Date fields of the DocType. */
export function ganttFields(spec = {}, meta = {}) {
  const cv = spec.meta?.calendar_view || {};
  const given = { ...(parseJson(cv.field_map, {}) || {}), ...(cv.start_date_field ? { start: cv.start_date_field } : {}), ...(cv.end_date_field ? { end: cv.end_date_field } : {}), ...(spec.view?.field_map || {}) };
  const dates = (meta.fields || []).filter((f) => ['Date', 'Datetime'].includes(f.fieldtype) && !f.hidden).map((f) => f.fieldname);
  const names = new Set((meta.fields || []).map((f) => f.fieldname));
  const title = meta.title_field && names.has(meta.title_field) ? meta.title_field : 'name';
  return { start: dates[0] || 'start', end: dates[1] || dates[0] || 'end', progress: names.has('progress') ? 'progress' : 'progress', id: 'name', title, color: 'color', depends_on: 'depends_on', ...given };
}

/** Normalise rows to tasks [{id,name,start,end,progress,color,deps,milestone}] (ms dates, end inclusive). */
export function ganttTasks(rows, fm, today, { seed = 1 } = {}) {
  const base = parse(today);
  return rows.map((r, i) => {
    const id = String(r[fm.id] ?? r.name ?? `row-${i}`);
    let s = parse(r[fm.start]), e = parse(r[fm.end]);
    if (!Number.isFinite(s)) { const h = hash(`${seed}|gantt|${id}|${i}`); s = addDays(base, (h % 21) - 8 + i); e = Number.isFinite(e) ? e : addDays(s, 3 + (h >>> 8) % 12); }
    if (!Number.isFinite(e) || e < s) e = s;
    const deps = String(r[fm.depends_on] ?? '').split(',').map((x) => x.trim()).filter(Boolean);
    return { id, name: String(r[fm.title] ?? id), start: s, end: e, progress: num(r[fm.progress]), color: r[fm.color] || '', deps, milestone: r.is_milestone === 1 || r.is_milestone === true };
  });
}

/** Time axis for a mode: returns { origin, end, steps:[{x,w,lower,upper,start}], x(ms), width }. */
export function ganttAxis(tasks, today, mode, firstDay = 'Sunday', locale = 'en') {
  const nm = names(locale);
  const cw = COL_W[mode];
  const lo = Math.min(...tasks.map((t) => t.start), parse(today)), hi = Math.max(...tasks.map((t) => t.end), parse(today)) + DAY;
  const steps = [];
  let origin, endMs;
  if (mode === 'Month') {
    origin = addMonths(monthStart(lo), -1); endMs = addMonths(monthStart(hi), 2);
    for (let m = origin, x = 0; m < endMs; m = addMonths(m, 1), x += cw) { const d = new Date(m); steps.push({ x, w: cw, start: m, lower: nm.monthShort[d.getUTCMonth()], upper: String(d.getUTCFullYear()) }); }
  } else if (mode === 'Week') {
    const fd = Math.max(0, WEEKDAYS.indexOf(firstDay));
    const wk = (ms) => addDays(ms, -((new Date(ms).getUTCDay() - fd + 7) % 7));
    origin = addDays(wk(lo), -7); endMs = addDays(wk(hi), 14);
    for (let w = origin, x = 0; w < endMs; w = addDays(w, 7), x += cw) { const d = new Date(w); steps.push({ x, w: cw, start: w, lower: tr(locale, 'week', Math.ceil((dayDiff(Date.UTC(d.getUTCFullYear(), 0, 1), w) + 1) / 7)).replace(/<\/?bdi>/g, ''), upper: `${nm.month[d.getUTCMonth()]} ${d.getUTCFullYear()}` }); }
  } else {
    origin = addDays(lo, -3); endMs = addDays(hi, 5);
    for (let d = origin, x = 0; d < endMs; d = addDays(d, 1), x += cw) { const dt = new Date(d); steps.push({ x, w: cw, start: d, lower: String(dt.getUTCDate()), upper: `${nm.month[dt.getUTCMonth()]} ${dt.getUTCFullYear()}` }); }
  }
  const width = steps.length * cw;
  const xOf = (ms) => {
    if (mode === 'Day') return (dayDiff(origin, ms)) * cw;
    if (mode === 'Week') return (ms - origin) / DAY / 7 * cw;
    const ms0 = monthStart(ms); const idx = steps.findIndex((s) => s.start === ms0);
    return (idx < 0 ? 0 : idx) * cw + (dayDiff(ms0, ms) / daysInMonth(ms0)) * cw;
  };
  return { origin, end: endMs, steps, width, x: xOf, mode, cw };
}

function arrow(a, b, ax, bx) {
  // from end of predecessor a (right edge) to start of b (left edge), elbow path with a small head
  const x1 = ax.right, y1 = ax.mid, x2 = bx.left, y2 = bx.mid;
  const curve = 10, step = 12;
  const down = y2 > y1 ? 1 : -1;
  const mid = Math.max(x1 + step, 0);
  let d;
  if (x2 >= x1 + step * 2) d = `M ${x1} ${y1} H ${x2 - step} V ${y2} H ${x2}`;
  else d = `M ${x1} ${y1} H ${mid} V ${y1 + down * (ROW_H / 2)} H ${x2 - step} V ${y2} H ${x2}`;
  void curve;
  return `<path class="gantt-arrow" d="${d}" fill="none" stroke="var(--gray-500)" stroke-width="1.4" data-ui="gantt.arrow.${esc(a)}.${esc(b)}"/><path d="M ${x2} ${y2} l -5 -3.5 v 7 z" fill="var(--gray-500)"/>`;
}

const CSS = `.gantt-modern .gantt-toolbar{display:flex;align-items:center;gap:var(--margin-sm);padding:var(--padding-sm) var(--padding-md);border-bottom:1px solid var(--border-color)}
.gantt-modern .gantt-toolbar .spacer{flex:1}
.gantt-modern .gantt-scroll{overflow:auto;background:var(--card-bg)}
.gantt-modern .gantt-container{min-height:120px}
.gantt-modern svg.gantt text{font-family:inherit;font-size:12px;fill:var(--text-color)}
.gantt-modern .gantt-lower text,.gantt-modern .gantt-upper text{fill:var(--text-muted)}
.gantt-modern .bar-label{fill:var(--gray-900)}
.gantt-modern .gantt-empty{padding:var(--padding-2xl,48px);text-align:center;color:var(--text-muted)}`;

/** Build the gantt body. Returns { main, count, mode }. */
export function buildGantt({ spec, meta, ctx }) {
  const view = spec.view || {};
  const mode = MODES.includes(view.view_mode) ? view.view_mode : 'Day';
  const state = view.state || 'normal';
  const today = ctx.today || '2026-01-01';
  const rows = state === 'normal' || state === undefined ? resolveRows(spec, meta, ctx) : [];
  const fm = ganttFields(spec, meta);
  const tasks = ganttTasks(rows, fm, today, { seed: spec.data?.rows?.$gen?.seed ?? 1 });
  const useProgress = view.show_progress !== false && tasks.some((t) => t.progress !== null);
  const showDeps = view.dependencies !== false;
  const toolbar = `<div class="gantt-toolbar" data-ui="gantt.toolbar"><div class="btn-group view-modes" role="group">${MODES.map((m) => `<button type="button" class="btn btn-default btn-sm${m === mode ? ' active' : ''}" data-mode="${m}" data-ui="gantt.mode.${m}"${m === mode ? ' aria-pressed="true"' : ''}>${m}</button>`).join('')}</div><span class="spacer"></span><button type="button" class="btn btn-default btn-sm" data-ui="gantt.today">Today</button></div>`;
  let body;
  if (state === 'loading') body = `<div class="gantt-empty" data-ui="gantt.loading" aria-busy="true">Loading...</div>`;
  else if (!tasks.length) body = `<div class="gantt-empty" data-ui="gantt.empty">No ${esc(dtName(meta))} to show on the Gantt chart</div>`;
  else {
    const ax = ganttAxis(tasks, today, mode, ctx.system?.first_day_of_the_week, ctx.locale);
    const H = HEAD_H + tasks.length * ROW_H + PAD;
    const todayX = ax.x(parse(today));
    const todayW = mode === 'Day' ? ax.cw : mode === 'Week' ? ax.cw / 7 : ax.cw / daysInMonth(monthStart(parse(today)));
    const upper = []; // group steps sharing the same upper label
    for (const s of ax.steps) { const l = upper[upper.length - 1]; if (l && l.label === s.upper) l.w += s.w; else upper.push({ x: s.x, w: s.w, label: s.upper }); }
    // RTL: time runs right to left. Shapes are mirrored with a transform; text x positions are mirrored by hand so glyphs stay upright.
    const rtl = !!ctx.rtl, W = ax.width;
    const mir = (inner) => (rtl ? `<g transform="translate(${W} 0) scale(-1 1)" data-mirrored="1">${inner}</g>` : inner);
    const tx = (x) => (rtl ? W - x : x);
    const grid = ax.steps.map((s) => `<line x1="${s.x}" x2="${s.x}" y1="${HEAD_H}" y2="${H}" stroke="var(--border-color)" stroke-width="1"/>`).join('');
    const rowsBg = tasks.map((_, i) => `<rect x="0" y="${HEAD_H + i * ROW_H}" width="${ax.width}" height="${ROW_H}" fill="${i % 2 ? 'var(--subtle-fg)' : 'transparent'}" data-ui="gantt.row.${i}"/>`).join('');
    const lowerTxt = ax.steps.map((s) => `<text x="${tx(s.x + s.w / 2)}" y="${UPPER_H + 20}" text-anchor="middle" data-ui="gantt.scale.${esc(iso(s.start))}">${esc(s.lower)}</text>`).join('');
    const upperTxt = upper.map((u) => `<text x="${tx(u.x + 8)}" y="${UPPER_H - 8}"${rtl ? ' text-anchor="end"' : ''} font-weight="600">${esc(u.label)}</text>`).join('');
    const pos = new Map();
    const bars = tasks.map((t, i) => {
      const y = HEAD_H + i * ROW_H + PAD / 2;
      const x = ax.x(t.start), w = Math.max(ax.x(t.end + DAY) - x, t.milestone ? BAR_H : 8);
      pos.set(t.id, { left: x, right: x + w, mid: y + BAR_H / 2 });
      const k = hash(t.id) % PALETTE.length;
      const fill = t.color || PALETTE_SOFT[k], prog = t.color || PALETTE[k];
      const pw = useProgress && t.progress !== null ? w * t.progress / 100 : 0;
      const label = t.name;
      const fits = label.length * 6.4 + 16 < w;
      const lx = fits ? x + w / 2 : x + w + 8;
      const anchor = fits ? 'middle' : rtl ? 'end' : 'start';
      return `<g class="bar-wrapper${t.milestone ? ' bar-milestone' : ''}" data-id="${esc(t.id)}" data-ui="gantt.bar.${i}">`
        + mir(`<rect class="bar" x="${x}" y="${y}" width="${w}" height="${BAR_H}" rx="${RADIUS}" ry="${RADIUS}" fill="${esc(fill)}" stroke="${esc(prog)}" stroke-width="1"/>`
        + (pw ? `<rect class="bar-progress" x="${x}" y="${y}" width="${pw}" height="${BAR_H}" rx="${RADIUS}" ry="${RADIUS}" fill="${esc(prog)}" opacity="0.55" data-progress="${t.progress}"/>` : ''))
        + `<text class="bar-label" x="${tx(lx)}" y="${y + BAR_H / 2 + 4}" text-anchor="${anchor}">${esc(label)}</text></g>`;
    }).join('');
    const arrows = showDeps ? tasks.flatMap((t) => t.deps.filter((d) => pos.has(d)).map((d) => arrow(d, t.id, pos.get(d), pos.get(t.id)))).join('') : '';
    const todayMark = `<rect class="today-highlight" x="${todayX}" y="${HEAD_H}" width="${Math.max(todayW, 2)}" height="${H - HEAD_H}" fill="var(--blue-100)" opacity="0.5" data-ui="gantt.today-highlight"/>`
      + `<rect class="today-line" x="${todayX + todayW / 2 - 0.75}" width="1.5" y="${UPPER_H}" height="${H - UPPER_H}" fill="var(--red-500)" data-ui="gantt.today-marker" data-date="${esc(today)}"/>`
      + ``;
    const tl = names(ctx.locale) && String(tr(ctx.locale, 'today')).replace(/<\/?bdi>/g, ''), pw = Math.round(tl.length * 6.5 + 14), cxm = todayX + todayW / 2;
    const todayText = `<g data-ui="gantt.today-label"><rect x="${tx(cxm) - pw / 2}" y="${HEAD_H - 19}" width="${pw}" height="16" rx="8" fill="var(--red-500)"/><text x="${tx(cxm)}" y="${HEAD_H - 7}" text-anchor="middle" style="fill:var(--white)">${esc(tl)}</text></g>`;
    body = `<div class="gantt-scroll" data-ui="gantt.scroll"><div class="gantt-container" style="width:${ax.width}px">`
      + `<svg class="gantt" xmlns="http://www.w3.org/2000/svg" width="${ax.width}" height="${H}" viewBox="0 0 ${ax.width} ${H}" role="img" aria-label="Gantt chart" data-mode="${mode}" data-ui="gantt.svg">`
      + `<rect x="0" y="0" width="${ax.width}" height="${HEAD_H}" fill="var(--card-bg)"/><line x1="0" x2="${ax.width}" y1="${HEAD_H}" y2="${HEAD_H}" stroke="var(--border-color)"/>`
      + `<g class="gantt-grid">${mir(rowsBg + grid)}</g>${mir(todayMark)}${todayText}<g class="gantt-upper">${upperTxt}</g><g class="gantt-lower">${lowerTxt}</g>`
      + `<g class="gantt-arrows">${mir(arrows)}</g><g class="gantt-bars">${bars}</g></svg></div></div>`;
  }
  const main = `<style>${CSS}</style><div class="layout-main-list gantt-view" data-ui="gantt-view"><div class="gantt-modern" data-ui="gantt-modern">${toolbar}${body}</div></div>`;
  return { main, count: tasks.length, mode };
}

export default async function render(spec, ctx) {
  let meta = spec.meta?.doctype;
  if (!meta || typeof meta !== 'object') { ctx?.warn?.('gantt: meta.doctype did not resolve to a DocType'); return { main: '' }; }
  const custom = spec.meta?.custom;
  if (custom) {
    const cf = Array.isArray(custom) ? custom.flatMap((c) => c.custom_fields || (Array.isArray(c) ? c : [])) : (custom.custom_fields || []);
    const ps = Array.isArray(custom) ? custom.flatMap((c) => c.property_setters || []) : (custom.property_setters || []);
    if (cf.length || ps.length) meta = applyCustomizations(meta, cf, ps);
  }
  const dt = dtName(meta);
  const gspec = { ...spec, view: { ...(spec.view || {}), current_view: 'gantt' } };
  const views = enabledViews(meta, gspec.view, ctx);
  const head = renderListHead(gspec, meta, ctx, { selected: 0, views }).html;
  const { main } = buildGantt({ spec: gspec, meta, ctx });
  const workspace = ctx.workspace || spec.ctx?.workspace || meta.module || '';
  const sidebarMeta = typeof spec.meta?.sidebar === 'object' ? spec.meta.sidebar : null;
  const sj = sidebarMeta || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const sidebarHtml = !sj || chrome.sidebar === 'hidden' ? ''
    : sidebarContainer(sj, { active: { doctype: dt }, collapsed: chrome.sidebar === 'collapsed', title: workspace, ctx });
  const sctx = spec.ctx || {};
  const vp = ctx.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx.viewport || '1440x900');
  const title = `${dt} Gantt`;
  const document = renderShell({ ctx: {
    theme: ctx.theme, locale: ctx.locale, rtl: ctx.rtl, viewport: vp, app: ctx.app || workspace, workspace, user: ctx.user, chrome,
    dock: { ...(sctx.dock || {}), items: sctx.dock?.items || dockFromWorkspaces() },
    title, route: `List/${dt}/Gantt`, pageName: dt, page: 'gantt',
    tokensPath: ctx.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
  }, head, main, right: '', sidebarHtml });
  return { document, head, main, title, sidebarHtml };
}
void icon;
