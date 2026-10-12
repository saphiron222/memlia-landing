import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_SKILLS, SEO_SKILLS } from '../../../scripts/lib/blog-pipeline.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const matrix = JSON.parse(readFileSync(join(dir, 'couverture-skills.json')));
const lectures = JSON.parse(readFileSync(join(dir, 'preuves/lectures-skills.json')));
const names = matrix.lignes.map(r => r.skill);
assert.equal(new Set(names).size, names.length);
const required = new Set(['blog', 'seo', ...BLOG_SKILLS, ...SEO_SKILLS, ...lectures.map(l => l.skill)]);
assert.deepEqual([...required].filter(s => !names.includes(s)), []);
const states = {};
for (const row of matrix.lignes) {
  assert.ok(row.motif && row.constat && row.preuves.length);
  assert.ok(lectures.some(l => l.skill === row.skill));
  for (const p of row.preuves) assert.ok(existsSync(join(dir, p)), `${row.skill}: ${p}`);
  states[row.etat] = (states[row.etat] || 0) + 1;
}
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const provenance = JSON.parse(readFileSync(join(dir, 'provenance-94abc8c8-5111-4257-b2e6-c52a5006bf68.json')));
assert.equal(sha(join(dir, provenance.master.split('/').pop())), provenance.sha256_master);
const copy1 = JSON.parse(readFileSync(join(dir, 'preuves/cmf-identification.dila.json')));
const copy2 = JSON.parse(readFileSync(join(dir, 'preuves/cmf-relation.dila.json')));
const scopeLog = readFileSync('/Users/kevinkitanga/.hermes/profiles/metier/cache/terminal-output/out-1791793168-94377-b820.log', 'utf8');
const currentScope = JSON.parse(scopeLog.split('__HERMES_CWD_')[0].trim())[0];
const scope = currentScope.text.split('\n').filter(x => x.startsWith('12° ') && x.includes('experts-comptables'));
assert.equal(scope.length, 1);
const result = {
  reviewer: 'metier:t_67cb2d6a', executedAt: new Date().toISOString(),
  matrix: { rows: names.length, states, omissions: [], referencesExist: true, limite: 'Inventaire et existence contrôlés ; les N/A justifiés et états partiels ne sont pas des PASS d’exécution intégrale.' },
  sourceScope: { id: currentScope.id, validFrom: currentScope.valid_from, validToExclusive: currentScope.valid_to_exclusive, extrait: scope[0], warning: currentScope.warning },
  sources: [copy1, copy2].map(c => ({ id: c.id, validFrom: c.valid_from, validToExclusive: c.valid_to_exclusive, textSha256: sha(join(dir, c.id === copy1.id ? 'preuves/cmf-identification.dila.json' : 'preuves/cmf-relation.dila.json')), limite: c.warning })),
  image: { candidateOriginalSha256: provenance.sha256_master, candidateProcessedSha256: sha(join(dir, 'image-source.png')), operatorAttachmentSha256: sha('/Users/kevinkitanga/.hermes/kanban/attachments/t_67cb2d6a/automatiser-l-entree-en-relation-d-un-nouveau-client-openai.png'), provenanceConcordante: true, sameAsOperatorAttachment: false },
  figures: ['onboarding-pieces', 'onboarding-jalons'].map(id => ({ id, bytes: statSync(join(dir, `preuves/${id}.webp`)).size })),
  limites: ['Pas de CI ni publication à ce stade de fabrication.', 'Le chargement des images dans le transport navigateur file:// a retourné naturalWidth=0 : pas utilisé comme preuve du rendu local original. Figures inspectées séparément et capture auteur mobile lue.']
};
writeFileSync(join(dir, 'preuves/revue-metier-inventaire.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
