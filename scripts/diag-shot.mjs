import { chromium } from 'playwright';
const [id,mode,out]=process.argv.slice(2);
const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,javaScriptEnabled:false});const p=await c.newPage();
await p.goto('file://'+process.cwd()+'/components/'+id+'/preview.'+mode+'.html');
await p.locator('[data-ui="'+id+'"]').first().screenshot({path:out});await b.close();
