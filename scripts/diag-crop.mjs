import fs from 'fs'; import { PNG } from 'pngjs';
const [f,x,y,w,h,o]=process.argv.slice(2).map((v,i)=>i==0||i==5?v:+v);const p=PNG.sync.read(fs.readFileSync(f));const q=new PNG({width:w,height:h});PNG.bitblt(p,q,x,y,w,h,0,0);fs.writeFileSync(o,PNG.sync.write(q))
