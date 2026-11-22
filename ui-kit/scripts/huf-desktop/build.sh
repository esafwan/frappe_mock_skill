#!/usr/bin/env bash
# Build ONLY the renderer of Huf Desktop (Electron + React) into .huf-cache/dist-desktop, then copy its CSS into tokens.
#   scripts/huf-desktop/build.sh [<huf_desktop checkout>]   (default /home/user/huf_desktop; it is never modified)
# The checkout is exported (git archive HEAD) to a scratch dir, installed there with `npm ci --ignore-scripts`
# (no Electron binary, no native rebuild), and built with a Vite config that mirrors the `renderer` block of
# electron.vite.config.ts (root src/renderer, base './', inputs index.html + approval/index.html, aliases @ and @renderer).
set -euo pipefail
SRC="${1:-/home/user/huf_desktop}"; KIT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${HUF_DESKTOP_WORK:-${TMPDIR:-/tmp}/huf-desktop-build}"; OUT="$KIT/.huf-cache/dist-desktop"
mkdir -p "$WORK"; SHA="$(git -C "$SRC" rev-parse HEAD)"
if [ "$(cat "$WORK/.sha" 2>/dev/null)" != "$SHA" ]; then
  find "$WORK" -mindepth 1 -maxdepth 1 ! -name node_modules -exec rm -rf {} +
  git -C "$SRC" archive HEAD | tar -x -C "$WORK"; echo "$SHA" > "$WORK/.sha"
fi
cp "$KIT/scripts/huf-desktop/renderer.vite.config.mjs" "$WORK/"
cd "$WORK"
[ -d node_modules ] || ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci --ignore-scripts --no-audit --no-fund
OUT_DIR="$OUT" node node_modules/vite/bin/vite.js build -c renderer.vite.config.mjs --logLevel warn
echo "huf_desktop $SHA" > "$OUT/.source"
cd "$KIT" && node scripts/huf-desktop/tokens.mjs
echo "built huf_desktop $SHA -> $OUT"
