#!/usr/bin/env node
// Thin alias: renders a DocType JSON as a form page via renderers/form/index.mjs.
// `--legacy` uses the old regex-splicing path (doctype/legacy/legacy.mjs).
import fs from 'node:fs';
import path from 'node:path';

const a = process.argv.slice(2);
if (a.includes('--legacy')) {
  await import('./legacy/legacy.mjs');
} else {
  const { renderFormDocument, makeMetaLoader, snake } = await import('../renderers/form/index.mjs');
  const opt = { metaDirs: [], tab: 0, locale: 'en-IN' };
  let file;
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--doc') opt.doc = a[++i];
    else if (k === '--meta-dir') opt.metaDirs.push(a[++i]);
    else if (k === '--custom') opt.custom = a[++i];
    else if (k === '--locale') opt.locale = a[++i];
    else if (k === '--tab') opt.tab = Number(a[++i]);
    else if (k === '--out') opt.out = a[++i];
    else if (k === '--workspace') opt.workspace = a[++i];
    else if (k === '--back-to') a[++i];
    else if (!file) file = k;
  }
  if (!file) { console.error('usage: render-doctype.mjs <doctype.json> [--doc f] [--meta-dir d]... [--custom f] [--locale l] [--tab n] [--out f] [--workspace name] [--legacy]'); process.exit(1); }
  const rj = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
  const meta = rj(file);
  const loadMeta = makeMetaLoader([path.dirname(path.resolve(file)), ...opt.metaDirs.map((d) => path.resolve(d))]);
  const { html, outFile, counts } = await renderFormDocument({
    meta, doc: opt.doc ? rj(opt.doc) : {}, custom: opt.custom ? rj(opt.custom) : [], loadMeta,
    locale: opt.locale, tab: opt.tab, workspace: opt.workspace,
    outFile: path.resolve(opt.out || path.join(path.dirname(new URL(import.meta.url).pathname), 'out', snake(meta.name) + '.html')),
  });
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  console.log(`wrote ${outFile}`);
  console.log(`tabs=${counts.tabs} sections=${counts.sections} columns=${counts.columns} fields=${counts.fields}`);
}
