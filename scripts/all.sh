#!/usr/bin/env bash
# Full rebuild from a live bench. Captures run 6 at a time (each component is independent); the payment dialog is serial (it mutates an order).
set -u; cd "$(dirname "$0")/.."
IDS=$(node -e "Promise.all([import('./scripts/specs.mjs'),import('./scripts/specs-pos.mjs')]).then(([a,b])=>console.log([...a.specs,...b.specs].map(s=>s.id).filter(i=>i!=='pos-payment-dialog').join(' ')))")
echo $IDS | tr ' ' '\n' | xargs -P 6 -I{} sh -c 'node scripts/capture.mjs {} 2>&1 | tail -1'
node scripts/capture.mjs pos-payment-dialog 2>&1 | tail -1
node scripts/bindings.mjs && node scripts/previews.mjs
node scripts/verify.mjs | tee /tmp/verify.out | grep -c PASS; grep FAIL /tmp/verify.out || true
node scripts/docs.mjs && node scripts/lint.mjs; node scripts/check-data.mjs | tail -1; node scripts/pages.mjs verify
