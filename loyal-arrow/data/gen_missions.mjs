// Deterministic synthetic Retail missions + "check against last year" results. No clocks, no randomness.
// node loyal-arrow/data/gen_missions.mjs -> <region>/missions.json
import fs from 'fs'; import path from 'path'; const H = new URL('.', import.meta.url).pathname;
const ROWS = [
  { id: 'M-0001', name_en: 'Switch to the store tea', kind_en: 'Switch to the store brand', counts: { verb: 'Buy', n: 2, unit: 'units', from: 'Own Brand' }, window: 'Ramadan 2026', reward_pts: 60, status: 'Paused', funding: 'supplier' },
  { id: 'M-0002', name_en: 'Try three aisles', kind_en: 'Try several categories', counts: { verb: 'Buy', n: 3, unit: 'categories', from: 'Food, Beverages, Fresh' }, window: 'Ramadan 2026', reward_pts: 100, status: 'Draft', funding: 'store' },
  { id: 'M-0003', name_en: 'Dates and dairy habit', kind_en: 'Come back and buy again', counts: { verb: 'Buy', n: 4, unit: 'bills', from: 'Food/Dates, Food/Dairy' }, window: 'Ramadan 2026', reward_pts: 150, status: 'Active', funding: 'supplier' },
];
const sets = { 'uae-dubai-supermarket': { shoppers: 200, qualified: 177, form_pts: 100, progress: 68, supplier_share_pct: 40 },
               'india-departmental-store': { shoppers: 240, qualified: 192, form_pts: 100, progress: 74, supplier_share_pct: 40 } };
for (const [d, s] of Object.entries(sets)) {
  const cfg = JSON.parse(fs.readFileSync(path.join(H, d, 'cfg.json'), 'utf8')); const cap = 1;
  const completions = s.qualified * cap; const pts = completions * s.form_pts; const cost = Math.round(pts * cfg.redeem_value_per_pt * 1000) / 1000;
  const out = { synthetic: true, currency: cfg.currency, last_year_shoppers: s.shoppers, check: { would_qualify: s.qualified, pct_of_shoppers: Math.round(s.qualified / s.shoppers * 1000) / 10, completions, points_cost: pts, est_cost: cost, supplier_funded: Math.round(cost * s.supplier_share_pct) / 100, supplier_share_pct: s.supplier_share_pct },
    draft: { name_en: 'Dates and dairy habit', kind_en: 'Come back and buy again', count: 4, unit_en: 'bills', source_en: 'these categories', names_en: 'Food/Dates, Food/Dairy', window: 'Ramadan 2026', points: s.form_pts, cap },
    progress: { mission_id: 'M-0003', current: s.progress, target: s.qualified }, missions: ROWS };
  fs.writeFileSync(path.join(H, d, 'missions.json'), JSON.stringify(out, null, 1) + '\n');
}
