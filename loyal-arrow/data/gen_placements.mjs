// Deterministic synthetic retail placements (shelf/end-cap placements and their checks). No clocks, no randomness.
// node loyal-arrow/data/gen_placements.mjs  -> <region>/placements.json   (text_ar fields feed the Arabic page variants)
import fs from 'fs'; const H = new URL('.', import.meta.url).pathname;
const chk = [{ result: 'in_place', on: '2026-11-14', note: 'Full facing, price tags up', note_ar: 'واجهة كاملة وبطاقات الأسعار موجودة' }, { result: 'partly', on: '2026-11-03', note: 'Two of three SKUs on shelf', note_ar: 'صنفان من ثلاثة على الرف' }];
const mk = (t, ta, s, sa, w, wa, f, to, n, st, seen) => ({ title: t, title_ar: ta, store_set: s, store_set_ar: sa, where: w, where_ar: wa, from: f, to, skus: n, status: st, seen, checks: st === 'confirmed' ? chk : [] });
const sets = {
  'uae-dubai-supermarket': [
    mk('Ramadan dates end cap', 'ركن التمور الرمضاني', 'Ramadan promo stores', 'فروع عروض رمضان', 'End cap', 'نهاية الممر', '2026-11-01', '2026-11-30', 3, 'confirmed', ['2026-11-03', '2026-11-14']),
    mk('Cereal gondola', 'جندول الحبوب', 'Ramadan promo stores', 'فروع عروض رمضان', 'Gondola', 'جندول', '2026-12-01', '2026-12-31', 2, 'planned', null),
    mk('Soft drinks promo bay', 'ركن المشروبات الغازية', 'Ramadan promo stores', 'فروع عروض رمضان', 'Promo bay', 'ركن ترويجي', '2026-10-01', '2026-10-15', 1, 'not_carried_out', null)],
  'india-departmental-store': [
    mk('Diwali sweets end cap', 'ركن حلويات ديوالي', 'Diwali promo stores', 'فروع عروض ديوالي', 'End cap', 'نهاية الممر', '2026-11-01', '2026-11-30', 3, 'confirmed', ['2026-11-03', '2026-11-14']),
    mk('Atta gondola', 'جندول الطحين', 'Diwali promo stores', 'فروع عروض ديوالي', 'Gondola', 'جندول', '2026-12-01', '2026-12-31', 2, 'planned', null),
    mk('Cold drinks promo bay', 'ركن المشروبات الباردة', 'Diwali promo stores', 'فروع عروض ديوالي', 'Promo bay', 'ركن ترويجي', '2026-10-01', '2026-10-15', 1, 'not_carried_out', null)],
};
for (const [d, rows] of Object.entries(sets)) fs.writeFileSync(`${H}${d}/placements.json`, JSON.stringify({ synthetic: true, today: '2026-11-22', placements: rows }, null, 1) + '\n');
