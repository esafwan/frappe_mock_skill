import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import { ROOT } from './lib.mjs';
const cur = JSON.parse(fs.readFileSync(ROOT + 'data/universals/currencies.json'));
let bad = 0; const err = (m) => { bad++; console.log('DATA', m); };
for (const f of fs.readdirSync(ROOT + 'data/menus').filter(f => f.endsWith('.json'))) {
  const m = JSON.parse(fs.readFileSync(ROOT + 'data/menus/' + f)); const id = m.id; if (id + '.json' !== f) err(f + ' id mismatch');
  if (!(m.defaultCurrency in cur)) err(id + ' bad defaultCurrency');
  const cats = new Set(m.categories.map(c => c.id)); const ids = new Set(); const hashes = {};
  if (m.items.length < 25) err(`${id} only ${m.items.length} items`);
  for (const it of m.items) {
    if (ids.has(it.id)) err(`${id} dup id ${it.id}`); ids.add(it.id);
    if (!cats.has(it.category)) err(`${id}/${it.id} bad category`);
    for (const c of ['USD', 'EUR', 'INR', 'AED', 'SAR', 'QAR']) if (typeof it.prices?.[c] !== 'number') err(`${id}/${it.id} price ${c}`);
    if ((m.languages || []).includes('ar') && !(it.name?.ar && it.description?.ar)) err(`${id}/${it.id} missing ar`);
    const p = ROOT + it.image; if (!fs.existsSync(p)) { err(`${id}/${it.id} image missing ${it.image}`); continue; }
    const b = fs.readFileSync(p); if (!(b[0] === 0xff && b[1] === 0xd8)) err(`${id}/${it.id} not a JPEG`);
    if (b.length < 8000) err(`${id}/${it.id} image tiny ${b.length}`); if (b.length > 200000) err(`${id}/${it.id} image big ${b.length}`);
    const h = crypto.createHash('md5').update(b).digest('hex'); (hashes[h] ||= []).push(it.id);
    if (!it.imageCredit?.source || !it.imageCredit?.license || !it.imageCredit?.url) err(`${id}/${it.id} credit incomplete`);
  }
  for (const [h, l] of Object.entries(hashes)) if (l.length > 2) err(`${id} image reused ${l.length}x: ${l.join(',')}`);
  const dims = (() => { try { return require('child_process') } catch { return null } })();
  console.log(`${id}: ${m.items.length} items, ${m.categories.length} cats, ${Object.keys(hashes).length} unique photos`);
}
console.log(bad ? `data: ${bad} problems` : 'data: clean'); process.exit(bad ? 1 : 0);
