// Slice 5 gate: role perms, locale formats, view dialogs, RTL from locale, gantt mirror. node tests/slice5.test.mjs
import assert from 'node:assert/strict'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec, normalizeCtx, mergeSpec, readSpecFile } from '../bin/mock.mjs';
import { formatNumber, formatDate, formatDatetime, formatTime, formatCurrency } from '../kit-lib/format.mjs';
import { computeCoverage, NOT_APPLICABLE } from '../bin/coverage.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'slice5-'));
/** Render samples/<n>.json with a merge-patch on the raw spec (written next to the sample so relative refs resolve). */
async function r(n, patch = null) {
  let file = path.join(KIT, 'samples', n + '.json'); let cleanup = null;
  if (patch) { file = path.join(KIT, 'samples', `.tmp-${process.pid}-${n}.json`); fs.writeFileSync(file, JSON.stringify(mergeSpec(readSpecFile(path.join(KIT, 'samples', n + '.json')), patch))); cleanup = file; }
  try { const l = loadSpec(file); assert(l.ok, n + ' invalid: ' + JSON.stringify(l.errors)); const o = await renderSpec(l); assert.equal(o.warnings.length, 0, n + ': ' + o.warnings.join('|')); return o.html; } finally { if (cleanup) fs.rmSync(cleanup, { force: true }); }
}
const has = (h, s) => h.includes(s);

// ---- PERMS: form. Role lacks write, create, delete, export; permlevel 1 not readable; Quotation not readable.
const NOPERMS = { ctx: { perms: null } };
let h = await r('s5-perms-readonly'); const base = await r('s5-perms-readonly', NOPERMS);
assert(has(base, 'data-ui="form.primary-action"'), 'control: Save shows without perms');
assert(!has(h, 'data-ui="form.primary-action"'), 'no write: primary action hidden');
for (const lbl of ['Delete', 'Duplicate']) { assert(has(base, `data-label="${lbl}"`), `control: ${lbl} menu item exists`); assert(!has(h, `data-label="${lbl}"`), `no ${lbl.toLowerCase()} perm: menu item hidden`); }
assert(has(base, 'data-fieldname="restrict_to_companies"') && !has(h, 'data-fieldname="restrict_to_companies"'), 'permlevel 1 field hidden when the role cannot read level 1');
assert(has(base, '>Quotation<') && !has(h, '>Quotation<'), 'sidebar item for a DocType without read perm is hidden');
assert(has(h, '>Sales Order<'), 'other sidebar items stay');
// ---- PERMS: list. No create, export, delete.
h = await r('s5-perms-readonly-list'); const lbase = await r('s5-perms-readonly-list', NOPERMS);
const lnone = await r('s5-perms-readonly-list', { overlays: [] }); const lnoneBase = await r('s5-perms-readonly-list', { overlays: [], ctx: { perms: null } });
assert(has(lnoneBase, 'data-label="Add Customer"') && !has(lnone, 'data-label="Add Customer"') && !has(lnone, 'primary-action'), 'list: New button hidden without create');
for (const lbl of ['Export', 'Delete']) assert(has(lbase, `data-label="${lbl}"`) && !has(h, `data-label="${lbl}"`), `list menu: ${lbl} hidden`);
// ---- PERMS: absent ctx.perms means unchanged output (flat ptype also works)
assert.equal(normalizeCtx({}).perms && Object.keys(normalizeCtx({}).perms).length, 0, 'ctx.perms defaults to empty');
const flat = await r('s5-perms-readonly', { ctx: { perms: { write: false, create: false, delete: false, export: false, Quotation: { read: false }, Customer: { levels: { 1: { read: false } } } } } });
assert(!has(flat, 'data-ui="form.primary-action"') && !has(flat, '>Quotation<'), 'flat ptype booleans apply to every DocType');

// ---- LOCALE: formatter units
const de = { number_format: '#.###,##', date_format: 'dd.mm.yyyy', time_format: 'HH:mm', currency: 'EUR' };
assert.equal(formatNumber(1234567.5, de), '1.234.567,50');
assert.equal(formatNumber(1234567.5, { number_format: '#,##,###.##' }), '12,34,567.50');
assert.equal(formatNumber(1234567.5, { number_format: "#'###.##" }), "1'234'567.50");
assert.equal(formatCurrency(1500, de), 'EUR 1.500,00');
assert.equal(formatDate('2026-11-03', de), '03.11.2026');
assert.equal(formatDate('2026-11-03', { date_format: 'mm/dd/yyyy' }), '11/03/2026');
assert.equal(formatTime('09:05:30', de), '09:05');
assert.equal(formatDatetime('2026-11-03 09:05:30', de), '03.11.2026 09:05');
// ---- LOCALE: wired into a list sample (decimal comma, date order), and unchanged for the default system
h = await r('s5-locale-de');
assert(has(h, 'EUR 12.345,50') && has(h, 'EUR 98.765,40'), 'currency cells use the system number format');
assert(has(h, '03.11.2026') && has(h, '25.11.2026'), 'date cells use the system date format');
assert(!has(h, '03-11-2026') && !has(h, 'EUR 12,345.50'), 'default formats are gone when the system says otherwise');
const english = await r('s5-locale-de', { ctx: { system: { number_format: '#,###.##', date_format: 'dd-mm-yyyy' } } });
assert(has(english, 'EUR 12,345.50') && has(english, '03-11-2026'), 'default system keeps the original formats');
// number cards and chart axes follow the system format too
h = await r('s4-dashboard', { ctx: { system: { number_format: '#.###,##', date_format: 'dd.mm.yyyy' } } });
assert(has(h, '482.000,00'), 'number card uses the system number format (dot grouping, decimal comma)');
assert(has(await r('s4-dashboard'), '4,82,000.00'), 'number card keeps the declared en-IN grouping by default');

import { chart } from '../kit-lib/chart.mjs';
const cd = { labels: ['a', 'b'], datasets: [{ name: 'n', values: [0.5, 1.5] }] };
assert(/>\d+,5</.test(chart('bar', cd, { system: de })) && !/>\d+\.5</.test(chart('bar', cd, { system: de })), 'chart axis labels use the decimal comma');
assert(/>\d+\.5</.test(chart('bar', cd, {})), 'chart axis labels keep the decimal point by default');

h = await r('s5-calendar-month', { ctx: { system: { first_day_of_the_week: 'Monday' } } });
const sun = await r('s5-calendar-month');
assert(h.indexOf('>Mon<') < h.indexOf('>Sun<') && sun.indexOf('>Sun<') < sun.indexOf('>Mon<'), 'first_day_of_the_week sets the calendar week start');

// ---- RTL from locale: ar he fa ur imply RTL; explicit ctx.rtl wins both ways
for (const l of ['ar', 'he', 'fa', 'ur']) assert.equal(normalizeCtx({ locale: l }).dir, 'rtl', l + ' implies rtl');
assert.equal(normalizeCtx({ locale: 'en' }).dir, 'ltr');
assert.equal(normalizeCtx({ locale: 'ar', rtl: false }).dir, 'ltr', 'explicit ctx.rtl false wins over locale ar');
assert.equal(normalizeCtx({ locale: 'en', rtl: true }).dir, 'rtl', 'explicit ctx.rtl true wins over locale en');
h = await r('s5-kanban', { ctx: { locale: 'ar', rtl: false } });
assert(/<html[^>]* dir="ltr"/.test(h), 'rendered document honours ctx.rtl false with locale ar');
h = await r('s5-kanban', { ctx: { locale: 'ar' } });
assert(/<html[^>]* dir="rtl"/.test(h), 'rendered document is rtl for locale ar');

// ---- GANTT RTL: shapes mirrored, text stays upright
const gl = await r('s5-gantt-week'); const gr = await r('s5-gantt-rtl');
assert(!has(gl, 'data-mirrored') && has(gr, 'data-mirrored="1"'), 'gantt mirrors its SVG shapes only in RTL');
assert(has(gr, 'text-anchor="end"'), 'gantt RTL labels hang to the left of short bars');

// ---- VIEW DIALOGS: quick entry, filter, sort, pick columns open from view pages
for (const [n, kind] of [['s5-kanban-dialog-quick-entry', 'quick_entry'], ['s5-calendar-dialog-quick-entry', 'quick_entry'], ['s5-gantt-dialog-filter', 'view_filter'], ['s5-tree-dialog-sort', 'view_sort'], ['s5-image-dialog-columns', 'pick_columns'], ['s5-map-dialog-filter', 'view_filter'], ['s5-inbox-dialog-filter', 'view_filter']]) {
  h = await r(n);
  assert(has(h, `data-dialog-kind="${kind}"`), `${n}: ${kind} dialog drawn`);
}
h = await r('s5-kanban-dialog-quick-entry');
assert(has(h, 'Northwind Traders') && has(h, 'Edit Full Form'), 'kanban quick entry shows the card values and Edit Full Form');
h = await r('s5-gantt-dialog-filter');
assert(has(h, 'Apply Filters') && has(h, 'Company') && has(h, 'India'), 'filter dialog rows carry the filters');
assert((await r('s5-query-report-dialog-pick-columns')).includes('data-dialog-kind="pick_columns"'), 'query report opens report dialogs');

// ---- COVERAGE: no red cells; every skipped cell has a reason; dialog is not skipped on view pages
const cov = computeCoverage();
assert.equal(cov.red, 0, 'coverage has red cells');
for (const [page, cols] of Object.entries(NOT_APPLICABLE)) for (const [c, why] of Object.entries(cols)) assert(typeof why === 'string' && why.length > 8, `${page}.${c} needs a reason`);
for (const p of ['kanban', 'calendar', 'gantt', 'tree', 'image', 'map', 'inbox']) assert(!('dialog' in (NOT_APPLICABLE[p] || {})), `${p}.dialog must not be skipped`);
const gcell = cov.rows.find((x) => x.page === 'gantt').cols.rtl;
assert(gcell.samples.some((s) => /rtl/.test(s)), 'gantt rtl sample exists (mirrored, see test above)');

// ---- MOBILE form: single column below the breakpoint (the form body fills the phone)
h = await r('s5-form-mobile');
assert(has(h, 'body[data-route^=Form] .layout-main-section-wrapper') && has(h, 'data-ui="form.mobile"'), 'phone form CSS overrides the desktop sidebar width');

fs.rmSync(tmp, { recursive: true, force: true });
console.log('slice5.test: ok');
