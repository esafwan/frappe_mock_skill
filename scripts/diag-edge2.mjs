import fs from 'fs'; import { PNG } from 'pngjs';
const [f,y]=process.argv.slice(2);const p=PNG.sync.read(fs.readFileSync(f));const xs=[];for(let x=1400;x<2100;x++){const i=(+y*p.width+x)*4;if(p.data[i]<245)xs.push(x)}console.log(xs.slice(0,6))
