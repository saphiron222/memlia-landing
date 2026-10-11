#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readDilaCopy } from './lib/dila-source-copy.mjs';

export function exportDilaCopy({ id, destination, referentiel = join(homedir(), 'hermes/referentiel-juridique'), python = 'python3' }) {
  if (!/^(?:LEGIARTI|JORFTEXT)\d{12}$/.test(id ?? '')) throw new Error('Identifiant LEGIARTI ou JORFTEXT exact requis.');
  let bytes;
  if (id.startsWith('LEGIARTI')) {
    const result = spawnSync(python, [join(referentiel, 'rechercher.py'), id, '--json'], { encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(`Recherche A4 refusée : ${result.stderr ?? result.error?.message}`);
    const rows = JSON.parse(result.stdout);
    if (rows.length !== 1 || rows[0].id !== id) throw new Error('Résultat A4 ambigu ou divergent.');
    bytes = `${JSON.stringify(rows[0], null, 2)}\n`;
  } else bytes = readFileSync(join(referentiel, 'sources/jorf-nep', `${id}.json`));
  const target = resolve(destination);
  mkdirSync(dirname(target), { recursive: true });
  // wx : ne jamais remplacer une copie déjà saisie ou relue.
  writeFileSync(target, bytes, { flag: 'wx' });
  try {
    const copy = JSON.parse(bytes);
    return readDilaCopy({ root: dirname(target), path: basename(target), url: copy.url, excerpt: copy.text });
  } catch (error) {
    throw new Error(`Export non utilisable conservé pour diagnostic : ${error.message}`);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [, , id, destination, ...args] = process.argv;
    if (!destination || args.some((arg) => !arg.startsWith('--referentiel='))) throw new Error('Usage : node scripts/export-dila-source.mjs <LEGIARTI…|JORFTEXT…> <copie.json> [--referentiel=<racine-A4>]');
    const referentiel = args.find((a) => a.startsWith('--referentiel='))?.slice('--referentiel='.length);
    const result = exportDilaCopy({ id, destination, ...(referentiel ? { referentiel } : {}) });
    console.log(JSON.stringify({ ...result, text: undefined }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
