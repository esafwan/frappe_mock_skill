import fs from 'fs'; import { ROOT } from './lib.mjs';
let out = '# Photo credits\nAll photographs are third-party works used under their stated licences (Wikimedia Commons, Pexels, Unsplash). CC BY / CC BY-SA images **require attribution** (author + licence + link) when you publish a video or page that shows them.\n\n';
for (const f of fs.readdirSync(ROOT + 'data/menus').filter(f => f.endsWith('.json'))) { const m = JSON.parse(fs.readFileSync(ROOT + 'data/menus/' + f)); out += `## ${m.id}\n| item | image | author | licence | source |\n|---|---|---|---|---|\n`;
  for (const it of m.items) { const c = it.imageCredit || {}; out += `| ${it.id} | ${it.image.split('/').pop()} | ${(c.author || '').replace(/\|/g, '/')} | ${(c.license || '').replace(/\|/g, '/')} | ${c.url ? `[${c.source}](${c.url})` : c.source} |\n`; } out += '\n'; }
fs.writeFileSync(ROOT + 'data/CREDITS.md', out); console.log('credits written');
