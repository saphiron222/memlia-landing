#!/bin/bash
set -euo pipefail
exec /usr/local/bin/python3 "$HOME/.hermes/profiles/marketing/scripts/bing_monitor.py" weekly --output="$HOME/.hermes/profiles/marketing/reports/bing"
