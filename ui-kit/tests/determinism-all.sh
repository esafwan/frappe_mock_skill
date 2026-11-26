#!/usr/bin/env bash
# Render every samples/*.json twice into out/slice5/ and compare bytes. Usage: bash tests/determinism-all.sh
cd "$(dirname "$0")/.." || exit 2
mkdir -p out/slice5; bad=0; n=0
mkdir -p out/slice5/recipes
for f in samples/*.json docs/recipes/*.json; do
  b=$(basename "$f" .json); o=out/slice5/$b.html
  case "$f" in docs/recipes/*) o=out/slice5/recipes/$b.html; b=recipes/$b;; esac
  node bin/mock.mjs render "$f" --out "$o" >/dev/null 2>"${o%.html}.err" || { echo "FAIL $b"; bad=1; continue; }
  cp "$o" "$o.1"
  node bin/mock.mjs render "$f" --out "$o" >/dev/null 2>&1
  cmp -s "$o" "$o.1" || { echo "NONDET $b"; bad=1; }
  rm -f "$o.1"; n=$((n+1))
done
echo "determinism: $n specs, $([ $bad = 0 ] && echo byte-identical || echo FAILURES)"
exit $bad
