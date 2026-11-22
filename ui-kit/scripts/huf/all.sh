#!/usr/bin/env bash
# Capture + verify HUF components. No bench needed. Usage: scripts/huf/all.sh [area]   (area = suffix of scripts/specs-huf-<area>.mjs; omit for all)
# Prereq: scripts/huf/build.sh <branch> for every `source` the selected specs use (pre-develop, feat/tables-redesign, ...).
set -u; cd "$(dirname "$0")/../.."
SEL=${1:-}
IDS=$(node -e "import('./scripts/specs-huf.mjs').then(m=>console.log(m.specs.filter(s=>!process.argv[1]||s.file===process.argv[1]).map(s=>s.id).join(' ')))" "$SEL")
echo $IDS | tr ' ' '\n' | xargs -P ${HUF_JOBS:-3} -I{} sh -c 'node scripts/capture.mjs {} 2>&1 | tail -1'
VERIFY_REPORT=${VERIFY_REPORT:-verify-report.json} node scripts/verify.mjs $IDS | tee /tmp/huf-verify.out | grep -c PASS; grep FAIL /tmp/huf-verify.out || true
