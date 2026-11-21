// Menu photos for the self-order previews: data/images/cafe/*.jpg downsized to 480px (credits in data/images/cafe/CREDITS.md), keyed by file stem.
import fs from 'node:fs';
export const CAFE = JSON.parse(fs.readFileSync(new URL('./cafe-images.json', import.meta.url), 'utf8'));
export const photo = (stem) => { if (!CAFE[stem]) throw new Error('self-order: no cafe photo ' + stem); return { type: 'image', sample: CAFE[stem] }; };
