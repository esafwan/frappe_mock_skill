#!/usr/bin/env bash
# Full rebuild from a live bench: capture every component (one browser per component for isolation), then verify, lint, pages, docs.
set -u; cd "$(dirname "$0")/.."
IDS=$(node -e "Promise.all([import('./scripts/specs.mjs'),import('./scripts/specs-pos.mjs')]).then(([a,b])=>console.log([...a.specs,...b.specs].map(s=>s.id).join(' ')))")
for id in $IDS; do node scripts/capture.mjs "$id" 2>&1 | tail -1; done
node scripts/verify.mjs $IDS | tee /tmp/verify.out | grep -c PASS; grep FAIL /tmp/verify.out || true
node scripts/docs.mjs && node scripts/lint.mjs; node scripts/check-data.mjs | tail -1; node scripts/pages.mjs verify
