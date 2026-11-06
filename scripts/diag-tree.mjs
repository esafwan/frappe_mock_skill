import { chromium } from 'playwright'; import { open, go } from './lib.mjs'; import { specs } from './specs.mjs';
const [id,mode]=process.argv.slice(2);
const tree=(id)=>{const e=document.querySelector('[data-ui="'+id+'"]');const out=[];const w=(n,d)=>{if(d>6)return;const r=n.getBoundingClientRect();out.push(' '.repeat(d)+n.tagName+'.'+(n.className&&n.className.baseVal===undefined?n.className:'').toString().slice(0,30)+' '+[r.x+scrollX,r.y+scrollY,r.width,r.height].map(v=>v.toFixed(1)).join(','));for(const ch of n.children)w(ch,d+1)};w(e,0);return out.join('\n')};
const spec=specs.find(s=>s.id===id);
const {browser,page}=await open();
await go(page,spec.url,{dark:mode==='dark'}); if(mode==='rtl')await page.evaluate(()=>document.documentElement.setAttribute('dir','rtl'));
if(spec.prepare)await spec.prepare(page);await page.waitForTimeout(spec.settle??600);
await page.evaluate(({rootSel,id})=>document.querySelector(rootSel).setAttribute('data-ui',id),{rootSel:spec.root,id});
const live=await page.evaluate(tree,id);
const c=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,javaScriptEnabled:true});const p=await c.newPage();
await p.goto('file://'+process.cwd()+'/components/'+id+'/preview'+(mode==='light'?'':'.'+mode)+'.html');
const prev=await p.evaluate(tree,id);
const L=live.split('\n'),P=prev.split('\n');
for(let i=0;i<Math.max(L.length,P.length);i++){ if(L[i]!==P[i]) console.log('L:',L[i],'\nP:',P[i]);}
console.log(L.length,P.length);
await browser.close();
