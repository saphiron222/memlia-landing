#!/usr/bin/env bash
set +e
sortie="$(node scripts/veille-outils.mjs 2>&1)"
code=$?
printf '%s\n' "$sortie"
if [ "$code" -ne 0 ]; then
  case "$sortie" in
    *'"verdict":"SUSPENDRE"'*) ;;
    *) printf '{"verdict":"ERREUR_INSTRUMENT","code":%s}\n' "$code" ;;
  esac
fi
exit 0
