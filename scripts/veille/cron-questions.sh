#!/bin/bash
set -euo pipefail

REPO="/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_6bdef7fe"
LAST30DAYS="/Users/kevinkitanga/hermes/packs/last30days/skills/last30days/scripts/last30days.py"
PLAN="$REPO/scripts/veille/last30days-plan.json"
STATE="/Users/kevinkitanga/.hermes/profiles/marketing/data/veille-acces"
SCRATCH="/Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch"
DAY="$(TZ=Europe/Paris date +%F)"
mkdir -p "$STATE" "$SCRATCH"
RAW="$(mktemp "$SCRATCH/last30days-c6.XXXXXX")"
ROTATED_PLAN="$(mktemp "$SCRATCH/last30days-c6-plan.XXXXXX")"
OUT="$STATE/questions-$DAY.json"
trap 'rm -f "$RAW" "$ROTATED_PLAN"' EXIT

# Le profil deep de last30days exécute deux sous-requêtes. La rotation couvre
# les six familles en trois semaines au lieu de rescanner toujours les deux premières.
python3.12 - "$PLAN" "$ROTATED_PLAN" <<'PY'
from datetime import datetime
from pathlib import Path
import json
import sys

source = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
pair = (datetime.now().isocalendar().week + 2) % 3
source["subqueries"] = source["subqueries"][pair * 2:pair * 2 + 2]
Path(sys.argv[2]).write_text(json.dumps(source, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY

python3.12 "$LAST30DAYS" \
  "operational pain and repetitive work in accounting firms worldwide" \
  --emit json \
  --json-profile raw \
  --search reddit \
  --deep \
  --days 31 \
  --max-results 80 \
  --max-per-source 20 \
  --max-source-fetches 12 \
  --subreddits Accounting,Bookkeeping,taxpros,CPA,CharteredAccountants \
  --plan "$ROTATED_PLAN" \
  --output "$RAW" \
  >/dev/null

node "$REPO/scripts/veille/questions.mjs" \
  --last30days="$RAW" \
  --output="$OUT"

python3.12 - "$OUT" <<'PY'
from pathlib import Path
import sys
sys.stdout.write(Path(sys.argv[1]).read_text(encoding="utf-8"))
PY
