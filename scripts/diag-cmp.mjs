import fs from 'fs'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch';
const [a,b]=process.argv.slice(2).map(f=>PNG.sync.read(fs.readFileSync(f)));
const w=Math.min(a.width,b.width),h=Math.min(a.height,b.height);const c=p=>{const o=new PNG({width:w,height:h});PNG.bitblt(p,o,0,0,w,h,0,0);return o};
console.log(a.width,a.height,b.width,b.height,(pixelmatch(c(a).data,c(b).data,null,w,h,{threshold:.1})/(w*h)*100).toFixed(3)+'%');
