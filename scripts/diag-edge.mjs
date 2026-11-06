import fs from 'fs'; import { PNG } from 'pngjs';
for(const f of process.argv.slice(2)){const p=PNG.sync.read(fs.readFileSync(f));const xs=[];for(let x=0;x<p.width;x++){const i=(120*p.width+x)*4;if(p.data[i]<245)xs.push(x)}console.log(f.split('/').pop(),xs.slice(0,3),xs.slice(-3))}
