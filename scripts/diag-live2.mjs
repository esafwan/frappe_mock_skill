import { open, go } from './lib.mjs'; import { specs } from './specs.mjs';
const [id,mode,js]=process.argv.slice(2); const spec=specs.find(s=>s.id===id);
const {browser,page}=await open();
await go(page,spec.url,{dark:mode==='dark'}); if(mode==='rtl')await page.evaluate(()=>document.documentElement.setAttribute('dir','rtl'));
if(spec.prepare)await spec.prepare(page);await page.waitForTimeout(spec.settle??600);
await page.evaluate(({rootSel,id})=>document.querySelector(rootSel).setAttribute('data-ui',id),{rootSel:spec.root,id});
console.log(JSON.stringify(await page.evaluate(new Function('id','return ('+js+')(id)')  ,id),null,1));
await browser.close();
