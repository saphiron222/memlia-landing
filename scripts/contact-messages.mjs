#!/usr/bin/env node
/**
 * Lire les messages du formulaire de contact, sans passer par une interface tierce.
 *
 *   npm run contact:messages            — les messages non traités, du plus récent au plus ancien
 *   npm run contact:messages -- --tous  — tout l'historique
 *   npm run contact:messages -- --purger-ip — efface les empreintes d'adresse de plus de 24 h
 *
 * Lit la base D1 de production via wrangler ; rien n'est modifié sauf avec --purger-ip.
 */
import { spawnSync } from 'node:child_process';

const BASE = 'memlia-contact';
const options = new Set(process.argv.slice(2));

function executer(sql) {
  const run = spawnSync('npx', ['wrangler', 'd1', 'execute', BASE, '--remote', '--json', '--command', sql], { encoding: 'utf8' });
  if (run.status !== 0) {
    console.error(run.stderr || run.stdout);
    process.exit(run.status ?? 1);
  }
  const debut = run.stdout.indexOf('[');
  const resultat = JSON.parse(run.stdout.slice(debut));
  return resultat[0]?.results ?? [];
}

if (options.has('--purger-ip')) {
  const limite = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  executer(`UPDATE messages SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND recu_le < '${limite}'`);
  console.log(`Empreintes d'adresse antérieures au ${limite} effacées.`);
  process.exit(0);
}

const filtre = options.has('--tous') ? '' : "WHERE statut = 'nouveau'";
const lignes = executer(`SELECT id, recu_le, nom, cabinet, courriel, message, statut FROM messages ${filtre} ORDER BY recu_le DESC LIMIT 200`);
if (lignes.length === 0) {
  console.log(options.has('--tous') ? 'Aucun message.' : 'Aucun message nouveau.');
  process.exit(0);
}
for (const m of lignes) {
  console.log(`\n#${m.id} · ${m.recu_le} · ${m.statut}`);
  console.log(`${m.nom}${m.cabinet ? ` — ${m.cabinet}` : ''} <${m.courriel}>`);
  console.log(m.message);
}
console.log(`\n${lignes.length} message(s).`);
