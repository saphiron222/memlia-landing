#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditResourceInventory, auditResourceManifestFile, RESOURCE_PHASES } from './lib/resource-pipeline.mjs';

const root = process.cwd();

function printReport(report) {
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exitCode = 1;
}

function parsePhase(args) {
  const indexes = args.flatMap((argument, index) => argument === '--phase' ? [index] : []);
  if (indexes.length !== 1 || indexes[0] === args.length - 1) throw new Error('Option requise : --phase qa|preview|approval|release.');
  const index = indexes[0];
  const phase = args[index + 1];
  if (!RESOURCE_PHASES.includes(phase)) throw new Error(`Phase inconnue ${phase}; attendu : ${RESOURCE_PHASES.join(' | ')}.`);
  return { phase, positional: args.filter((_, argumentIndex) => argumentIndex !== index && argumentIndex !== index + 1) };
}

function audit(args) {
  const { phase, positional } = parsePhase(args);
  if (positional.length !== 0) throw new Error('La commande audit n’accepte aucun argument positionnel.');
  const report = { generatedAt: new Date().toISOString(), ...auditResourceInventory({ root, phase }) };
  const reportPath = join(root, '.qa', 'resources', 'staged-gates', `${phase}-audit.json`);
  mkdirSync(resolve(reportPath, '..'), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  printReport({ ...report, report: relative(root, reportPath) });
}

function validate(args) {
  const { phase, positional } = parsePhase(args);
  const [path] = positional;
  if (!path || positional.length !== 1) throw new Error('Manifeste unique requis : npm run resource:validate -- <chemin-manifest.json> --phase qa|preview|approval|release.');
  const absolutePath = resolve(root, path);
  printReport({
    generatedAt: new Date().toISOString(),
    manifest: relative(root, absolutePath),
    ...auditResourceManifestFile(absolutePath, { root, phase }),
  });
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (command === 'audit') return audit(args);
  if (command === 'validate') return validate(args);
  throw new Error('Commande attendue : audit --phase <phase> | validate <chemin-manifest.json> --phase <phase>.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(`[resource-pipeline] ${error.message}`);
    process.exitCode = 1;
  }
}
