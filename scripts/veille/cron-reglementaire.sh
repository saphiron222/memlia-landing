#!/bin/bash
set -euo pipefail

REPO="/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_6bdef7fe"
STATE="/Users/kevinkitanga/.hermes/profiles/marketing/data/veille-acces"
DAY="$(TZ=Europe/Paris date +%F)"
OUT="$STATE/reglementaire-$DAY.json"
TMP="$OUT.tmp.$$"
trap 'rm -f "$TMP"' EXIT
mkdir -p "$STATE"

node "$REPO/scripts/veille/reglementaire.mjs" > "$TMP"
mv "$TMP" "$OUT"

python3.12 - "$OUT" <<'PY'
from pathlib import Path
import sys
sys.stdout.write(Path(sys.argv[1]).read_text(encoding="utf-8"))
PY
