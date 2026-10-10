"""Lecture des exports de données TypeScript, sans importer le rendu Astro.

Le compilateur TypeScript du site dépouille les types ; les imports JSON locaux
sont lus depuis les sources (y compris les inventaires de la forge des guides).
Les fixtures isolées utilisent le compilateur du dépôt, sans recopier les tableaux.
"""
import json
from pathlib import Path
import subprocess


def source_export(root: Path, relative_path: str, export_name: str):
    script = (
        'import { readFileSync } from "node:fs"; '
        'import { createRequire } from "node:module"; '
        'const ts = createRequire(process.argv[3])("typescript"); '
        'const url = process.argv[1]; '
        'const text = readFileSync(new URL(url), "utf8").replace('
        '/import (\\w+) from [\'\"](\\.\\/[^\'\"]+\\.json)[\'\"](?: with \\{[^}]+\\})?;?/g, '
        '(_, name, path) => "const " + name + " = " + readFileSync(new URL(path, url), "utf8") + ";"); '
        'const compiled = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText; '
        'const source = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64")); '
        'console.log(JSON.stringify(source[process.argv[2]]));'
    )
    result = subprocess.run(
        ['node', '--experimental-strip-types', '--input-type=module', '-e',
         script, (root / relative_path).resolve().as_uri(), export_name,
         str(Path(__file__).resolve().parents[2] / 'package.json')],
        check=True, capture_output=True, text=True, cwd=root,
    )
    return json.loads(result.stdout)
