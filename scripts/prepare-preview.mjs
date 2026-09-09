/** Prépare une copie de déploiement noindex sans modifier le candidat indexable ni la production. */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
const target = '.qa/preview-dist';
if (!existsSync('dist/index.html')) throw new Error('Construire et vérifier dist avant de préparer une preview.');
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync('dist', target, { recursive: true });
writeFileSync(`${target}/_headers`, '/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log(`Preview noindex prête dans ${target}. Déployer seulement sur la branche preview-m4-r3, jamais main.`);
