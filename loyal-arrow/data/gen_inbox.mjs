// Deterministic synthetic Retail mapping inbox rows (SKUs not yet mapped to a category). No clocks, no randomness.
// node loyal-arrow/data/gen_inbox.mjs  -> <region>/mapping_inbox.json
import fs from 'fs'; const H = new URL('.', import.meta.url).pathname;
const common = { last_seen: '2026-11-22T10:44:00', categories_en: ['Staples', 'Dairy', 'Bakery', 'Beverages', 'Snacks'] };
const sets = {
  'uae-dubai-supermarket': { rows: [['RICE1','none',6],['SNAC1','ambiguous',4],['2312345012349','weighed',3],['TEA1','none',2]], categories: ['Staples','Dairy','Bakery','Beverages','Snacks'] },
  'india-departmental-store': { rows: [['ATTA5','none',7],['NAMK2','ambiguous',5],['2312345067892','weighed',3],['GHEE1','none',2]], categories: ['Staples','Dairy','Snacks','Beverages','Household'] },
};
for (const [d, s] of Object.entries(sets)) fs.writeFileSync(`${H}${d}/mapping_inbox.json`, JSON.stringify({ synthetic: true, ...common, categories_en: s.categories, rows: s.rows.map(([sku, reason, bills]) => ({ sku, reason, bills })) }, null, 1) + '\n');
