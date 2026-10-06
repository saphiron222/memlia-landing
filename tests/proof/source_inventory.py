"""Lecture des exports de données TypeScript, sans importer le rendu Astro.

Node >= 22.6 est déjà requis par le site ; le dépouillement des types évite
une copie fragile des tableaux TypeScript dans les oracles Python.
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
        '"import generatedGuides from \'./guides.generated.json\';", '
        '() => "const generatedGuides = " + readFileSync(new URL("./guides.generated.json", url), "utf8") + ";"); '
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
