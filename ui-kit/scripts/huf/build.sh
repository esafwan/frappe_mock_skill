#!/usr/bin/env bash
# Build the HUF frontend of one branch into .huf-cache/dist/<branch-slug> (router base /huf/), then extract its CSS into tokens.
#   scripts/huf/build.sh pre-develop
#   scripts/huf/build.sh feat/tables-redesign [<commit-sha>]   (pin a commit for reproducible captures; see HUF-MOCK-PLAN pins)
# Env: HUF_REPO (clone of github.com/tridz-dev/huf, default ../../tridz-dev/huf next to this repo or /home/user/tridz-dev/huf)
#      HUF_WT   (where branch worktrees go, default $HUF_REPO/../wt)
set -euo pipefail
B="${1:-pre-develop}"; PIN="${2:-}"; KIT="$(cd "$(dirname "$0")/../.." && pwd)"; SLUG="$(echo "$B" | sed 's#[^A-Za-z0-9._-]\+#-#g')"
HUF_REPO="${HUF_REPO:-/home/user/tridz-dev/huf}"; HUF_WT="${HUF_WT:-$(dirname "$HUF_REPO")/wt}"
SRC="$HUF_WT/$SLUG"
# Fetch into a private ref (FETCH_HEAD is shared by everyone using the clone), then check out the pinned or tip commit.
git -C "$HUF_REPO" fetch -q origin "+refs/heads/$B:refs/huf-mock/$SLUG"
REV="${PIN:-$(git -C "$HUF_REPO" rev-parse "refs/huf-mock/$SLUG")}"
if [ ! -d "$SRC/frontend" ]; then mkdir -p "$HUF_WT"; git -C "$HUF_REPO" worktree add -q --detach "$SRC" "$REV"
else git -C "$SRC" checkout -q --detach "$REV"; fi
cd "$SRC/frontend"
# Reuse the main checkout's node_modules when the lockfile is identical (saves a 1 GB install per branch).
if [ ! -e node_modules ]; then
  if [ -d "$HUF_REPO/frontend/node_modules" ] && cmp -s package-lock.json "$HUF_REPO/frontend/package-lock.json"; then ln -s "$HUF_REPO/frontend/node_modules" node_modules
  else npm ci --no-audit --no-fund --ignore-scripts; fi
fi
OUT="$KIT/.huf-cache/dist/$SLUG"
node node_modules/vite/bin/vite.js build --base=/huf/ --outDir "$OUT" --emptyOutDir --logLevel warn
echo "$B $(git -C "$SRC" rev-parse HEAD)" > "$OUT/.source"
cd "$KIT" && node scripts/huf/tokens.mjs "$B"
echo "built $B -> $OUT"
