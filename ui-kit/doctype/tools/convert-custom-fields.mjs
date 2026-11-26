#!/usr/bin/env node
// Convert fixtures/india_compliance/custom_fields.py -> custom_fields.json keyed by doctype.
// Runs the .py under `python3 -I` with stub modules (frappe, india_compliance.*) written to a temp dir.
// usage: node tools/convert-custom-fields.mjs [in.py] [out.json]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(process.argv[2] || join(root, 'fixtures/india_compliance/custom_fields.py'));
const dst = resolve(process.argv[3] || join(root, 'fixtures/india_compliance/custom_fields.json'));

const tmp = mkdtempSync(join(tmpdir(), 'icstub-'));
const w = (p, s) => { mkdirSync(dirname(join(tmp, p)), { recursive: true }); writeFileSync(join(tmp, p), s); };
w('frappe/__init__.py', 'import json\n_=lambda s,*a,**k:s\ndef as_json(o,indent=None):\n    return json.dumps(o)\n');
w('india_compliance/__init__.py', '');
w('india_compliance/gst_india/__init__.py', '');
w('india_compliance/gst_india/constants/__init__.py',
  'GST_CATEGORIES=["Registered Regular","Registered Composition","Unregistered","SEZ","Overseas","Deemed Export","UIN Holders","Tax Deductor","Tax Collector","Input Service Distributor"]\n' +
  'GST_TAX_RATES=(0,0.1,0.25,1,1.5,3,5,6,7.5,12,18,28,40)\n' +
  'PORT_CODES={"INBOM4":"Mumbai Sea","INDEL4":"Delhi Air"}\n' +
  'STATE_NUMBERS={"Andhra Pradesh":"37","Delhi":"07","Karnataka":"29","Kerala":"32","Maharashtra":"27","Tamil Nadu":"33"}\n');
w('india_compliance/gst_india/utils/__init__.py',
  'def get_place_of_supply_options():\n    return "\\n37-Andhra Pradesh\\n07-Delhi\\n29-Karnataka\\n32-Kerala\\n27-Maharashtra\\n33-Tamil Nadu"\n');
w('run.py', `
import sys, json, runpy
sys.path.insert(0, ${JSON.stringify(tmp)})
ns = runpy.run_path(${JSON.stringify(src)})
out = {}
def add(dt, fields):
    if isinstance(fields, dict): fields = [fields]
    lst = out.setdefault(dt, [])
    have = {f.get("fieldname") for f in lst}
    for f in fields:
        if f.get("fieldname") not in have:
            lst.append(f); have.add(f.get("fieldname"))
for k, v in ns.items():
    if k.isupper() and isinstance(v, dict) and v and all(isinstance(x, (list, tuple, dict)) for x in v.values()):
        for dt, fields in v.items():
            for d in ([dt] if isinstance(dt, str) else list(dt)):
                add(d, fields)
print(json.dumps(out, indent=1, sort_keys=False))
`);
try {
  const o = execFileSync('python3', ['-I', join(tmp, 'run.py')], { encoding: 'utf8', maxBuffer: 64e6 });
  const data = JSON.parse(o);
  writeFileSync(dst, JSON.stringify(data, null, 1) + '\n');
  const n = Object.values(data).reduce((a, l) => a + l.length, 0);
  console.log(`wrote ${dst}: ${Object.keys(data).length} doctypes, ${n} fields`);
  for (const [k, v] of Object.entries(data)) console.log(`  ${k}: ${v.length}`);
} finally { rmSync(tmp, { recursive: true, force: true }); }
