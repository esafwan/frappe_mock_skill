import { open, go } from './lib.mjs';
const [,, p, sel = 'body', depth = '3'] = process.argv;
const { browser, page } = await open(); await go(page, p); await page.waitForTimeout(2500);
console.log(await page.evaluate(({ sel, depth }) => { const f = (e, d) => { if (d > depth) return ''; const t = `${'  '.repeat(d)}<${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 5).join('.') : ''}>${e.children.length ? '' : ' ' + (e.textContent || '').trim().slice(0, 30)}\n`; return t + [...e.children].map(c => f(c, d + 1)).join(''); }; return [...document.querySelectorAll(sel)].map(e => f(e, 0)).join('\n'); }, { sel, depth: +depth }));
await browser.close();
