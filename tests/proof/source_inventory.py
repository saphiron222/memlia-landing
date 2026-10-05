"""Lecture des exports de données TypeScript, sans importer le rendu Astro.

Node >= 22.6 est déjà requis par le site ; le dépouillement des types évite
une copie fragile des tableaux TypeScript dans les oracles Python.
"""
import json
from pathlib import Path
import subprocess


def source_export(root: Path, relative_path: str, export_name: str):
    script = (
        'const source = await import(process.argv[1]); '
        'console.log(JSON.stringify(source[process.argv[2]]));'
    )
    result = subprocess.run(
        ['node', '--experimental-strip-types', '--input-type=module', '-e',
         script, (root / relative_path).resolve().as_uri(), export_name],
        check=True, capture_output=True, text=True, cwd=root,
    )
    return json.loads(result.stdout)
