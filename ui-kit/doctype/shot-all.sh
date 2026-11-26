#!/bin/bash
# For each out/*.html writes <name>.png (first viewport) and <name>.full.png (whole form)
cd "$(dirname "$0")"
for f in out/*.html; do
  node shot-doctype.mjs "$f" "${f%.html}.png" || echo FAIL $f
  node shot-doctype.mjs "$f" "${f%.html}.full.png" --full || echo FAIL full $f
done
