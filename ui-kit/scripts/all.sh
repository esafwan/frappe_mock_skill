#!/usr/bin/env bash
# Full rebuild from a live bench. Desk captures run 4 at a time (independent); POS captures run 2 at a time (heavy SPA); payment dialog is serial (it mutates an order).
set -u; cd "$(dirname "$0")/.."
D=$(node -e "import('./scripts/specs.mjs').then(a=>console.log(a.specs.map(s=>s.id).join(' ')))")
P=$(node -e "import('./scripts/specs-pos.mjs').then(a=>console.log(a.specs.map(s=>s.id).filter(i=>i!=='pos-payment-dialog').join(' ')))")
echo $D | tr ' ' '\n' | xargs -P 4 -I{} sh -c 'node scripts/capture.mjs {} 2>&1 | tail -1' | tee /tmp/cap1.log
grep FAIL /tmp/cap1.log | awk '{print $2}' | while read id; do node scripts/capture.mjs $id 2>&1 | tail -1; done   # serial retry of flaky ones
echo $P | tr ' ' '\n' | xargs -P 2 -I{} sh -c 'node scripts/capture.mjs {} 2>&1 | tail -1'
node scripts/capture.mjs pos-payment-dialog 2>&1 | tail -1
node scripts/bindings.mjs >/dev/null && node scripts/previews.mjs
node scripts/verify.mjs | tee /tmp/verify.out | grep -c PASS; grep FAIL /tmp/verify.out || true
node scripts/pages.mjs verify; node scripts/credits.mjs; node scripts/docs.mjs && node scripts/lint.mjs; node scripts/check-data.mjs | tail -1
